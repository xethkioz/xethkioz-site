import { isSupabaseConfigured, supabase } from '../supabaseClient'

export type PublicAdSlotId = 'home-hero' | 'news-inline' | 'section-sidebar' | 'stream-banner'
export type PublicAdCampaignKind = 'house' | 'sponsor' | 'affiliate' | 'network'

export type PublicAdCampaign = {
  id: string
  campaign_key: string
  campaign_kind: PublicAdCampaignKind
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

function safePublicUrl(value: unknown) {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  if (!normalized || normalized.length > 2048 || /[\u0000-\u001F\u007F\\]/.test(normalized)) return null
  if (normalized.startsWith('/') && !normalized.startsWith('//')) return normalized

  try {
    const parsed = new URL(normalized)
    return parsed.protocol === 'https:' ? parsed.toString() : null
  } catch {
    return null
  }
}

function normalizeCampaign(value: unknown): PublicAdCampaign | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const kind = String(row.campaign_kind)
  if (!['house', 'sponsor', 'affiliate', 'network'].includes(kind)) return null
  if (typeof row.id !== 'string' || typeof row.campaign_key !== 'string' || typeof row.slot_id !== 'string') return null
  if (typeof row.sponsor_name !== 'string' || typeof row.title !== 'string') return null
  if (!['draft', 'review', 'active', 'paused', 'archived'].includes(String(row.status))) return null

  return {
    id: row.id,
    campaign_key: row.campaign_key,
    campaign_kind: kind as PublicAdCampaignKind,
    slot_id: row.slot_id,
    sponsor_name: row.sponsor_name.trim().slice(0, 120),
    title: row.title.trim().slice(0, 160),
    description: typeof row.description === 'string' ? row.description.trim().slice(0, 500) || null : null,
    target_url: safePublicUrl(row.target_url),
    image_url: safePublicUrl(row.image_url),
    status: row.status as PublicAdCampaign['status'],
    starts_at: typeof row.starts_at === 'string' ? row.starts_at : null,
    ends_at: typeof row.ends_at === 'string' ? row.ends_at : null,
  }
}

export async function fetchActiveAdCampaigns(slotId: PublicAdSlotId | string, limit = 1): Promise<PublicAdCampaign[]> {
  if (!isSupabaseConfigured) return []

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('ads_campaigns')
    .select('id,campaign_key,campaign_kind,slot_id,sponsor_name,title,description,target_url,image_url,status,starts_at,ends_at')
    .eq('slot_id', slotId)
    .eq('status', 'active')
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('updated_at', { ascending: false })
    .limit(Math.max(1, Math.min(6, limit)))

  if (error) {
    console.warn('[XETHKIOZ Ads] No se pudieron cargar campañas públicas:', error.message)
    return []
  }

  return (data ?? []).map(normalizeCampaign).filter((campaign): campaign is PublicAdCampaign => Boolean(campaign))
}
