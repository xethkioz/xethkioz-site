import { useEffect, useState } from 'react'
import { fetchActiveAdCampaigns, type PublicAdCampaign, type PublicAdSlotId } from '../../services/ads/publicAdsService'

type PublicAdSlotProps = {
  slotId: PublicAdSlotId | string
  compact?: boolean
  fallbackLabel?: string
}

export default function PublicAdSlot({ slotId, compact = false, fallbackLabel = 'XETHKIOZ SPONSOR SLOT' }: PublicAdSlotProps) {
  const [campaign, setCampaign] = useState<PublicAdCampaign | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true

    async function loadCampaign() {
      const campaigns = await fetchActiveAdCampaigns(slotId, 1)
      if (!active) return
      setCampaign(campaigns[0] ?? null)
      setLoaded(true)
    }

    void loadCampaign()

    return () => {
      active = false
    }
  }, [slotId])

  if (!loaded || !campaign) return null

  const content = (
    <article className={`overflow-hidden rounded-[1.5rem] border border-orange-400/25 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,.2),transparent_38%),linear-gradient(135deg,rgba(124,58,237,.16),rgba(0,0,0,.82))] text-white shadow-[0_0_35px_rgba(249,115,22,.12)] ${compact ? 'p-4' : 'p-5 md:p-6'}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-orange-300">{fallbackLabel}</p>
          <h3 className={`${compact ? 'text-lg' : 'text-2xl'} mt-2 font-black uppercase leading-tight`}>{campaign.title}</h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-violet-200">Sponsor: {campaign.sponsor_name}</p>
          {campaign.description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">{campaign.description}</p> : null}
        </div>
        {campaign.image_url ? (
          <div className="shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/35 md:w-56">
            <img src={campaign.image_url} alt={campaign.title} loading="lazy" className="h-32 w-full object-cover" />
          </div>
        ) : null}
      </div>
    </article>
  )

  if (!campaign.target_url) return content

  return (
    <a href={campaign.target_url} target="_blank" rel="noopener noreferrer sponsored" className="block transition hover:-translate-y-0.5 hover:opacity-95">
      {content}
    </a>
  )
}
