import { isSupabaseConfigured, supabase } from '../supabaseClient'

export type PublicAdSlotId = 'home-hero' | 'news-inline' | 'section-sidebar' | 'stream-banner'

export type PublicAdCampaign = {
  id: string
  slot_id: PublicAdSlotId | string
  sponsor_name: string
  title: string
  description: string | null
  target_url: string | null
  image_url: string | null
  status: 'draft' | 'review' | 'active' | 'paused' | 'archived'
  starts_at: string | null
  ends_at: string | null
}

export async function fetchActiveAdCampaigns(slotId: PublicAdSlotId | string, limit = 1): Promise<PublicAdCampaign[]> {
  if (!isSupabaseConfigured) return []

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('ads_campaigns')
    .select('id, slot_id, sponsor_name, title, description, target_url, image_url, status, starts_at, ends_at')
    .eq('slot_id', slotId)
    .eq('status', 'active')
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.warn('[XETHKIOZ Ads] No se pudieron cargar campañas públicas:', error.message)
    return []
  }

  return (data ?? []) as PublicAdCampaign[]
}
