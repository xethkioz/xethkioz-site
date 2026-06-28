import type { RealtimeChannel } from '@supabase/supabase-js'
import type { PortalEventBusLike, PortalNodeId } from '../../engines/world/sandbox/portalEventContracts'
import { cmsSupabaseClient, isCmsSupabaseConfigured, type CmsSupabaseClient } from './supabaseClient'
import {
  DEFAULT_ARTICLE_METRICS,
  XETHKIOZ_CATEGORY_CONFIG,
  type ArticleRow,
  type CategoryConfigRow,
  type XethkiozCategorySlug,
  isXethkiozCategorySlug,
  resolveCategoryConfig,
} from './databaseSchema'

export interface HydratedNewsArticle {
  readonly article: ArticleRow
  readonly category: CategoryConfigRow
}

export interface NewsDataSnapshot {
  readonly articles: readonly HydratedNewsArticle[]
  readonly featured: HydratedNewsArticle | null
  readonly updatedAt: number
}

export type NewsDataListener = (snapshot: NewsDataSnapshot) => void
export type NewsErrorListener = (error: Error) => void

export interface NewsDataServiceOptions {
  readonly client?: CmsSupabaseClient
  readonly eventBus?: PortalEventBusLike
  readonly now?: () => number
}

export interface NewsRealtimeSubscription {
  readonly unsubscribe: () => void
}

const FALLBACK_ARTICLE = Object.freeze({
  id: 'xethkioz-local-preview',
  title: 'XETHKIOZ NEWS Factory conectada al Runtime',
  subtitle: 'Fallback local activo hasta conectar Supabase Realtime.',
  summary:
    'La plantilla editorial puede hidratarse desde Supabase y disparar eventos al RuntimeBridge sin mutar shaders desde React.',
  content_body:
    'Este contenido se usa solo cuando las variables de entorno de Supabase no están configuradas. Producción debe consumir articles + categories_config.',
  main_image: '/images/articles/fallback.svg',
  category_id: 'gaming',
  portal_id: 'xethkioz-main',
  metrics: DEFAULT_ARTICLE_METRICS,
  release_date: new Date(0).toISOString(),
  created_at: new Date(0).toISOString(),
} satisfies ArticleRow)

export class NewsDataService {
  private readonly client: CmsSupabaseClient
  private readonly eventBus: PortalEventBusLike | null
  private readonly now: () => number
  private readonly listeners = new Set<NewsDataListener>()
  private readonly errorListeners = new Set<NewsErrorListener>()
  private channel: RealtimeChannel | null = null
  private snapshot: NewsDataSnapshot = Object.freeze({
    articles: [hydrateArticle(FALLBACK_ARTICLE)],
    featured: hydrateArticle(FALLBACK_ARTICLE),
    updatedAt: Date.now(),
  })
  private activePortal: PortalNodeId | null = null

  constructor(options: NewsDataServiceOptions = {}) {
    this.client = options.client ?? cmsSupabaseClient
    this.eventBus = options.eventBus ?? null
    this.now = options.now ?? (() => performance.now())
  }

  getSnapshot(): NewsDataSnapshot {
    return this.snapshot
  }

  onChange(listener: NewsDataListener): () => void {
    this.listeners.add(listener)
    listener(this.snapshot)
    return () => this.listeners.delete(listener)
  }

  onError(listener: NewsErrorListener): () => void {
    this.errorListeners.add(listener)
    return () => this.errorListeners.delete(listener)
  }

  async fetchInitial(): Promise<NewsDataSnapshot> {
    if (!isCmsSupabaseConfigured) {
      this.publishSnapshot(this.snapshot)
      return this.snapshot
    }

    const { data, error } = await this.client
      .from('articles')
      .select('*')
      .order('release_date', { ascending: false })
      .limit(12)

    if (error) {
      const wrapped = new Error(`[NewsDataService] Initial fetch failed: ${error.message}`)
      this.publishError(wrapped)
      throw wrapped
    }

    const articles = (data ?? []).map((row) => hydrateArticle(normalizeArticleRow(row)))
    const nextSnapshot = Object.freeze({
      articles,
      featured: articles[0] ?? null,
      updatedAt: this.now(),
    } satisfies NewsDataSnapshot)

    const nextPortal = nextSnapshot.featured ? resolvePortalFromArticle(nextSnapshot.featured.article) : null
    if (nextPortal) this.dispatchPortalTransition(nextPortal, nextSnapshot.featured?.article.id)

    this.publishSnapshot(nextSnapshot)
    return nextSnapshot
  }

  subscribeRealtime(): NewsRealtimeSubscription {
    if (!isCmsSupabaseConfigured) {
      return Object.freeze({ unsubscribe: () => undefined })
    }

    if (this.channel) {
      return Object.freeze({ unsubscribe: () => this.unsubscribeRealtime() })
    }

    this.channel = this.client
      .channel('xethkioz-news-hydration')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'articles' },
        (payload) => this.handleRealtimeArticle(normalizeArticleRow(payload.new as Partial<ArticleRow>)),
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'articles' },
        (payload) => this.handleRealtimeArticle(normalizeArticleRow(payload.new as Partial<ArticleRow>)),
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          this.publishError(new Error(`[NewsDataService] Realtime channel status: ${status}`))
        }
      })

    return Object.freeze({ unsubscribe: () => this.unsubscribeRealtime() })
  }

  unsubscribeRealtime(): void {
    if (!this.channel) return
    void this.client.removeChannel(this.channel)
    this.channel = null
  }

  dispose(): void {
    this.unsubscribeRealtime()
    this.listeners.clear()
    this.errorListeners.clear()
  }

  private handleRealtimeArticle(article: ArticleRow): void {
    const nextPortal = resolvePortalFromArticle(article)

    // Contract: Supabase portal signal reaches EventBus before React receives new content.
    this.dispatchPortalTransition(nextPortal, article.id)

    const hydrated = hydrateArticle(article)
    const remaining = this.snapshot.articles.filter((entry) => entry.article.id !== article.id)
    const articles = [hydrated, ...remaining].slice(0, 12)
    this.publishSnapshot(
      Object.freeze({
        articles,
        featured: hydrated,
        updatedAt: this.now(),
      } satisfies NewsDataSnapshot),
    )
  }

  private dispatchPortalTransition(nextPortal: PortalNodeId, articleId?: string): void {
    if (!this.eventBus) {
      this.activePortal = nextPortal
      return
    }

    const payload = Object.freeze({
      previousPortal: this.activePortal,
      nextPortal,
      source: 'supabase',
      timestamp: this.now(),
      articleId,
      intensity: nextPortal === 'GREEN_NODE' ? 1 : nextPortal === 'URGENT' ? 0.88 : 0.42,
    } as const)

    try {
      this.eventBus.emit?.('PORTAL_STATE_CHANGED', payload)
      this.eventBus.dispatch?.({ type: 'PORTAL_STATE_CHANGED', payload })
      this.activePortal = nextPortal
    } catch (error) {
      console.error('[NewsDataService] Failed to dispatch PORTAL_STATE_CHANGED', error)
    }
  }

  private publishSnapshot(snapshot: NewsDataSnapshot): void {
    this.snapshot = snapshot
    this.listeners.forEach((listener) => listener(snapshot))
  }

  private publishError(error: Error): void {
    console.error(error)
    this.errorListeners.forEach((listener) => listener(error))
  }
}

export const newsDataService = new NewsDataService()

export function hydrateArticle(article: ArticleRow): HydratedNewsArticle {
  return Object.freeze({
    article,
    category: resolveCategoryConfig(article.category_id),
  })
}

export function resolvePortalFromArticle(article: Pick<ArticleRow, 'category_id' | 'portal_id'>): PortalNodeId {
  if (article.category_id === 'urgent') return 'URGENT'
  if (article.portal_id === 'xethkioz-green-node') return 'GREEN_NODE'
  if (article.category_id === 'science') return 'SCIENCE'
  if (article.category_id === 'ia') return 'IA'
  if (article.category_id === 'hardware') return 'HARDWARE'
  if (article.category_id === 'deals') return 'OFFERS'
  return 'GAMING'
}

function normalizeArticleRow(row: Partial<ArticleRow>): ArticleRow {
  const rawCategory = String(row.category_id ?? 'gaming')
  const category_id: XethkiozCategorySlug = isXethkiozCategorySlug(rawCategory) ? rawCategory : 'gaming'

  return {
    id: String(row.id ?? crypto.randomUUID()),
    title: String(row.title ?? 'XETHKIOZ NEWS'),
    subtitle: typeof row.subtitle === 'string' ? row.subtitle : null,
    summary: String(row.summary ?? 'Resumen pendiente de carga desde CMS.'),
    content_body: String(row.content_body ?? ''),
    main_image: String(row.main_image ?? '/images/articles/fallback.svg'),
    category_id,
    portal_id: row.portal_id ?? 'xethkioz-main',
    metrics: row.metrics ?? DEFAULT_ARTICLE_METRICS,
    release_date: String(row.release_date ?? new Date().toISOString()),
    created_at: String(row.created_at ?? new Date().toISOString()),
  }
}

export const NEWS_CATEGORY_TO_PORTAL = Object.freeze({
  gaming: 'GAMING',
  ia: 'IA',
  hardware: 'HARDWARE',
  science: 'SCIENCE',
  deals: 'OFFERS',
  urgent: 'URGENT',
} satisfies Record<keyof typeof XETHKIOZ_CATEGORY_CONFIG, PortalNodeId>)
