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

export function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] ?? character)
}

export function absoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

export async function fetchFeedArticles(limit = 1000): Promise<FeedArticle[]> {
  const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || PUBLIC_SUPABASE_URL).replace(/\/+$/, '')
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || PUBLIC_SUPABASE_KEY
  const now = new Date().toISOString()

  const query = new URLSearchParams({
    select: 'slug,title,summary,category,published_at,updated_at,cover_image_url',
    status: 'eq.published',
    published_at: `lte.${now}`,
    order: 'published_at.desc',
    limit: String(Math.min(1000, Math.max(1, limit))),
  })
  const requestArticles = (url: string, key: string) => fetch(`${url}/rest/v1/news_articles?${query}`, {
    // Modern Supabase publishable keys are API keys, not JWT access tokens.
    // Sending them as Bearer tokens makes PostgREST reject an otherwise public request.
    headers: { apikey: key, Accept: 'application/json' },
  })
  let response = await requestArticles(supabaseUrl, anonKey)
  let usedFallback = false
  if (!response.ok && (supabaseUrl !== PUBLIC_SUPABASE_URL || anonKey !== PUBLIC_SUPABASE_KEY)) {
    usedFallback = true
    response = await requestArticles(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY)
  }
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240)
    console.error(JSON.stringify({
      level: 'error',
      message: 'public-news-feed Supabase request failed',
      status: response.status,
      usedFallback,
      detail,
    }))
    return []
  }
  return await response.json() as FeedArticle[]
}

export { SITE_URL }
