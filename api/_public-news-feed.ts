import { getCuratedExternalNews } from '../src/services/news/curatedExternalNews.js'

const SITE_URL = 'https://www.xethkioz.com.ar'
const PUBLIC_SUPABASE_URL = 'https://pascicauudfyydzknoop.supabase.co'
const PUBLIC_SUPABASE_KEY = 'sb_publishable_baha-MZOxBr-2pQGaXlcwA_edqFjj-_'

export type FeedArticle = {
  slug: string
  title: string
  summary: string | null
  category: string
  published_at: string | null
  updated_at: string | null
  cover_image_url: string | null
}

export type PublicArticleMetadata = FeedArticle & {
  created_at: string
  cover_image_alt: string | null
  tags: string[] | null
}

type CuratedArticle = ReturnType<typeof getCuratedExternalNews>[number]

export function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] ?? character)
}

export function absoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

function getPublicSupabaseConfig() {
  return {
    url: (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || PUBLIC_SUPABASE_URL).replace(/\/+$/, ''),
    key: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || PUBLIC_SUPABASE_KEY,
  }
}

function requestPublicRows(url: string, key: string, query: URLSearchParams) {
  return fetch(`${url}/rest/v1/news_articles?${query}`, {
    // Modern Supabase publishable keys are API keys, not JWT access tokens.
    // Sending them as Bearer tokens makes PostgREST reject an otherwise public request.
    headers: { apikey: key, Accept: 'application/json' },
  })
}

async function resolvePublicRows<T>(query: URLSearchParams, label: string): Promise<T[]> {
  const config = getPublicSupabaseConfig()
  let response = await requestPublicRows(config.url, config.key, query)
  let usedFallback = false

  if (!response.ok && (config.url !== PUBLIC_SUPABASE_URL || config.key !== PUBLIC_SUPABASE_KEY)) {
    usedFallback = true
    response = await requestPublicRows(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, query)
  }

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240)
    console.error(JSON.stringify({
      level: 'error',
      message: `${label} Supabase request failed`,
      status: response.status,
      usedFallback,
      detail,
    }))
    return []
  }

  return await response.json() as T[]
}

function toCuratedArticleMetadata(article: CuratedArticle): PublicArticleMetadata | null {
  if (article.status !== 'published') return null

  const publishedAt = article.published_at || article.created_at
  const timestamp = Date.parse(publishedAt)
  if (!publishedAt || Number.isNaN(timestamp) || timestamp > Date.now()) return null

  return {
    slug: article.slug,
    title: article.title,
    summary: article.summary ?? null,
    category: article.category,
    published_at: publishedAt,
    updated_at: null,
    created_at: article.created_at,
    cover_image_url: article.cover_image_url ?? null,
    cover_image_alt: article.cover_image_alt ?? null,
    tags: article.tags ?? [],
  }
}

function getPublishedCuratedArticleMetadata() {
  return getCuratedExternalNews()
    .map(toCuratedArticleMetadata)
    .filter((article): article is PublicArticleMetadata => article !== null)
}

function findCuratedArticleMetadata(slug: string): PublicArticleMetadata | null {
  return getPublishedCuratedArticleMetadata().find((article) => article.slug === slug) ?? null
}

function feedTimestamp(article: FeedArticle) {
  const value = article.published_at || article.updated_at
  const timestamp = value ? Date.parse(value) : 0
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function mergeFeedArticles(supabaseRows: FeedArticle[], limit: number) {
  const merged = new Map<string, FeedArticle>()

  for (const article of getPublishedCuratedArticleMetadata()) merged.set(article.slug, article)
  for (const article of supabaseRows) merged.set(article.slug, article)

  return [...merged.values()]
    .sort((left, right) => feedTimestamp(right) - feedTimestamp(left))
    .slice(0, limit)
}

export async function fetchFeedArticles(limit = 1000): Promise<FeedArticle[]> {
  const safeLimit = Math.min(1000, Math.max(1, limit))
  const now = new Date().toISOString()
  const query = new URLSearchParams({
    select: 'slug,title,summary,category,published_at,updated_at,cover_image_url',
    status: 'eq.published',
    published_at: `lte.${now}`,
    order: 'published_at.desc',
    limit: String(safeLimit),
  })

  const rows = await resolvePublicRows<FeedArticle>(query, 'public-news-feed')
  return mergeFeedArticles(rows, safeLimit)
}

export async function fetchPublishedArticleMetadata(slug: string): Promise<PublicArticleMetadata | null> {
  const normalizedSlug = slug.trim().toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug) || normalizedSlug.length > 180) return null

  const now = new Date().toISOString()
  const query = new URLSearchParams({
    select: 'slug,title,summary,category,published_at,updated_at,created_at,cover_image_url,cover_image_alt,tags',
    slug: `eq.${normalizedSlug}`,
    status: 'eq.published',
    published_at: `lte.${now}`,
    limit: '1',
  })

  const rows = await resolvePublicRows<PublicArticleMetadata>(query, 'public-news-article')
  return rows[0] ?? findCuratedArticleMetadata(normalizedSlug)
}

export { SITE_URL }
