const SITE_URL = 'https://www.xethkioz.com.ar'

export type FeedArticle = {
  slug: string
  title: string
  summary: string | null
  category: string
  published_at: string | null
  updated_at: string | null
  cover_image_url: string | null
}

export function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] ?? character)
}

export function absoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

export async function fetchFeedArticles(limit = 1000): Promise<FeedArticle[]> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) return []

  const query = new URLSearchParams({
    select: 'slug,title,summary,category,published_at,updated_at,cover_image_url',
    status: 'eq.published',
    order: 'published_at.desc',
    limit: String(Math.min(1000, Math.max(1, limit))),
  })
  const response = await fetch(`${supabaseUrl}/rest/v1/news_articles?${query}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  })
  if (!response.ok) return []
  return await response.json() as FeedArticle[]
}

export { SITE_URL }
