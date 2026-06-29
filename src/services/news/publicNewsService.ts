import { isSupabaseConfigured, supabase } from '../supabaseClient'

export type PublicNewsCategory = 'gaming' | 'tech' | 'science' | 'ai' | 'community' | 'green' | 'programming'
export type PublicNewsStatus = 'draft' | 'review' | 'published' | 'archived'

export type PublicNewsContentBlock = {
  type: 'paragraph' | 'heading' | 'list' | 'quote'
  text: string
}

export type PublicNewsArticle = {
  id: string
  slug: string
  title: string
  summary: string | null
  content: PublicNewsContentBlock[]
  category: PublicNewsCategory
  status: PublicNewsStatus
  published_at: string | null
  tags: string[]
  source_urls: string[]
  ai_generated: boolean
  created_at: string
}

type RawNewsArticle = {
  id: string
  slug: string
  title: string
  summary: string | null
  content: unknown
  category: string
  status: PublicNewsStatus
  published_at: string | null
  tags: string[] | null
  source_urls: string[] | null
  ai_generated: boolean | null
  created_at: string
}

export const publicNewsCategories = ['gaming', 'tech', 'science', 'ai', 'community', 'green', 'programming'] as const

export const publicNewsCategoryLabels = {
  es: {
    all: 'Todas',
    gaming: 'Gaming',
    tech: 'Tecnología',
    science: 'Ciencia',
    ai: 'IA',
    community: 'Comunidad',
    green: 'Green Node',
    programming: 'Programación',
  },
  en: {
    all: 'All',
    gaming: 'Gaming',
    tech: 'Technology',
    science: 'Science',
    ai: 'AI',
    community: 'Community',
    green: 'Green Node',
    programming: 'Programming',
  },
} as const

export function isPublicNewsCategory(value: string): value is PublicNewsCategory {
  return publicNewsCategories.includes(value as PublicNewsCategory)
}

export function normalizePublicNewsCategory(value: string | null | undefined): PublicNewsCategory {
  if (!value) return 'gaming'
  if (value === 'ia') return 'ai'
  if (value === 'hardware') return 'tech'
  if (value === 'deals') return 'gaming'
  return isPublicNewsCategory(value) ? value : 'gaming'
}

function normalizeContent(value: unknown): PublicNewsContentBlock[] {
  if (!Array.isArray(value)) return []
  return value
    .map((block) => {
      if (!block || typeof block !== 'object') return null
      const candidate = block as Partial<PublicNewsContentBlock>
      const type = candidate.type === 'heading' || candidate.type === 'list' || candidate.type === 'quote' ? candidate.type : 'paragraph'
      const text = typeof candidate.text === 'string' ? candidate.text.trim() : ''
      if (!text) return null
      return { type, text } satisfies PublicNewsContentBlock
    })
    .filter((block): block is PublicNewsContentBlock => Boolean(block))
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : []
}

export function normalizePublicNewsArticle(row: RawNewsArticle): PublicNewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: normalizeContent(row.content),
    category: normalizePublicNewsCategory(row.category),
    status: row.status,
    published_at: row.published_at,
    tags: normalizeStringArray(row.tags),
    source_urls: normalizeStringArray(row.source_urls),
    ai_generated: Boolean(row.ai_generated),
    created_at: row.created_at,
  }
}

export function formatPublicNewsDate(value: string | null | undefined, lang: 'es' | 'en') {
  if (!value) return lang === 'es' ? 'Sin fecha' : 'No date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export async function fetchPublishedNews(category?: PublicNewsCategory | 'all', limit = 36): Promise<PublicNewsArticle[]> {
  if (!isSupabaseConfigured) return []

  let query = supabase
    .from('news_articles')
    .select('id, slug, title, summary, content, category, status, published_at, tags, source_urls, ai_generated, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (category && category !== 'all') query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw error
  return ((data ?? []) as RawNewsArticle[]).map(normalizePublicNewsArticle)
}

export async function fetchPublishedNewsBySlug(slug: string): Promise<PublicNewsArticle | null> {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('news_articles')
    .select('id, slug, title, summary, content, category, status, published_at, tags, source_urls, ai_generated, created_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) throw error
  return data ? normalizePublicNewsArticle(data as RawNewsArticle) : null
}

export { isSupabaseConfigured as isPublicNewsSupabaseConfigured }
