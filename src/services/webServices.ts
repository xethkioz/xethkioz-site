import { fallbackWebServiceOffers } from '../data/webServiceFallbacks'
import type { WebServiceOffer } from '../types/webServices'
import { isSupabaseConfigured, supabase } from './supabaseClient'

const publicOfferFields = [
  'id',
  'slug',
  'eyebrow',
  'title',
  'summary',
  'description',
  'image_url',
  'image_path',
  'image_alt',
  'price_label',
  'delivery_label',
  'features',
  'cta_label',
  'status',
  'featured',
  'sort_order',
  'created_at',
  'updated_at',
].join(', ')

export type WebServiceCatalogResult = {
  offers: WebServiceOffer[]
  source: 'supabase' | 'fallback'
  notice: string | null
}

export async function loadFeaturedWebService(): Promise<WebServiceOffer> {
  const fallback = fallbackWebServiceOffers[0]

  if (!isSupabaseConfigured) return fallback

  const { data, error } = await supabase
    .from('web_service_offers')
    .select(publicOfferFields)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .limit(1)
    .overrideTypes<WebServiceOffer[], { merge: false }>()

  return !error && data?.[0] ? data[0] : fallback
}

export async function loadPublishedWebServices(): Promise<WebServiceCatalogResult> {
  if (!isSupabaseConfigured) {
    return {
      offers: fallbackWebServiceOffers,
      source: 'fallback',
      notice: 'Catálogo base disponible mientras se completa la conexión del CMS.',
    }
  }

  const { data, error } = await supabase
    .from('web_service_offers')
    .select(publicOfferFields)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .overrideTypes<WebServiceOffer[], { merge: false }>()

  if (error || !data?.length) {
    return {
      offers: fallbackWebServiceOffers,
      source: 'fallback',
      notice: error
        ? 'El catálogo administrable está sincronizando. Mientras tanto podés consultar las propuestas base.'
        : 'Todavía no hay propuestas publicadas en el CMS. Mostramos las opciones base.',
    }
  }

  return {
    offers: data,
    source: 'supabase',
    notice: null,
  }
}
