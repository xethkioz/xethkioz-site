const SITE_URL = 'https://www.xethkioz.com.ar'
const PUBLIC_SUPABASE_URL = 'https://pascicauudfyydzknoop.supabase.co'
const PUBLIC_SUPABASE_KEY = 'sb_publishable_baha-MZOxBr-2pQGaXlcwA_edqFjj-_'
const PUBLIC_REQUEST_TIMEOUT_MS = 4_500
const PUBLIC_REQUEST_ATTEMPTS = 2

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
    signal: AbortSignal.timeout(PUBLIC_REQUEST_TIMEOUT_MS),
  })
}

async function resolvePublicRows<T>(query: URLSearchParams, label: string): Promise<T[]> {
  const config = getPublicSupabaseConfig()
  const candidates = [
    config,
    { url: PUBLIC_SUPABASE_URL, key: PUBLIC_SUPABASE_KEY },
  ].filter((candidate, index, list) => (
    list.findIndex((item) => item.url === candidate.url && item.key === candidate.key) === index
  ))
  let lastNetworkError: unknown = null
  let lastHttpFailure: { status: number; detail: string; usedFallback: boolean } | null = null

  for (const [candidateIndex, candidate] of candidates.entries()) {
    for (let attempt = 0; attempt < PUBLIC_REQUEST_ATTEMPTS; attempt += 1) {
      try {
        const response = await requestPublicRows(candidate.url, candidate.key, query)
        if (response.ok) return await response.json() as T[]

        lastHttpFailure = {
          status: response.status,
          detail: (await response.text()).slice(0, 240),
          usedFallback: candidateIndex > 0,
        }
        if (response.status < 500) break
      } catch (error) {
        lastNetworkError = error
      }
    }
  }

  if (lastNetworkError) {
    throw new Error(`${label.toUpperCase().replace(/-/g, '_')}_NETWORK_UNAVAILABLE`, { cause: lastNetworkError })
  }

  console.error(JSON.stringify({
    level: 'error',
    message: `${label} Supabase request failed`,
    status: lastHttpFailure?.status ?? 503,
    usedFallback: lastHttpFailure?.usedFallback ?? false,
    detail: lastHttpFailure?.detail ?? 'No response received.',
  }))
  return []
}

export async function fetchFeedArticles(limit = 1000): Promise<FeedArticle[]> {
  const now = new Date().toISOString()
  const query = new URLSearchParams({
    select: 'slug,title,summary,category,published_at,updated_at,cover_image_url',
    status: 'eq.published',
    published_at: `lte.${now}`,
    order: 'published_at.desc',
    limit: String(Math.min(1000, Math.max(1, limit))),
  })

  return resolvePublicRows<FeedArticle>(query, 'public-news-feed')
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
  return rows[0] ?? null
}

export { SITE_URL }
