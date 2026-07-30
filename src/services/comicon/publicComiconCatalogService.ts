import { isSupabaseConfigured, supabase } from '../supabaseClient'

export type ComiconCatalogChannel = 'marvel' | 'dc' | 'anime' | 'screen' | 'comics'
export type ComiconCatalogEntityType = 'hero' | 'villain' | 'antihero' | 'team' | 'comic' | 'manga' | 'screen'

export type ComiconCatalogItem = {
  id: string
  slug: string
  channel: ComiconCatalogChannel
  entity_type: ComiconCatalogEntityType
  title: string
  publisher: string
  universe: string | null
  identity: string | null
  debut: string | null
  creators: string[]
  summary: { es: string; en: string }
  facts: { es: string[]; en: string[] }
  image_url: string
  image_alt: string
  source_urls: string[]
  tags: string[]
  featured: boolean
  sort_order: number
}

type RawCatalogItem = Omit<ComiconCatalogItem, 'summary' | 'facts' | 'creators' | 'source_urls' | 'tags'> & {
  summary: unknown
  facts: unknown
  creators: string[] | null
  source_urls: string[] | null
  tags: string[] | null
}

function localizedText(value: unknown) {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  return {
    es: typeof record.es === 'string' ? record.es : '',
    en: typeof record.en === 'string' ? record.en : typeof record.es === 'string' ? record.es : '',
  }
}

function localizedFacts(value: unknown) {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const normalize = (input: unknown) => Array.isArray(input) ? input.filter((item): item is string => typeof item === 'string') : []
  return {
    es: normalize(record.es),
    en: normalize(record.en).length ? normalize(record.en) : normalize(record.es),
  }
}

function mapCatalogItem(item: RawCatalogItem): ComiconCatalogItem {
  return {
    ...item,
    creators: item.creators ?? [],
    source_urls: item.source_urls ?? [],
    tags: item.tags ?? [],
    summary: localizedText(item.summary),
    facts: localizedFacts(item.facts),
  }
}

export const isComiconCatalogSupabaseConfigured = isSupabaseConfigured

export async function fetchPublishedComiconCatalog() {
  if (!isSupabaseConfigured) return []

  const { data, error } = await supabase
    .from('comicon_catalog')
    .select('id, slug, channel, entity_type, title, publisher, universe, identity, debut, creators, summary, facts, image_url, image_alt, source_urls, tags, featured, sort_order')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true })
    .limit(80)

  if (error) throw error
  return (data ?? []).map((item) => mapCatalogItem(item as RawCatalogItem))
}
