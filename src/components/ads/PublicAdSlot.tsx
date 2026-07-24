import { useEffect, useState } from 'react'
import { useLang } from '../../lib/LangContext'
import { fetchActiveAdCampaigns, type PublicAdCampaign, type PublicAdSlotId } from '../../services/ads/publicAdsService'
import SafeImage from '../SafeImage'

type PublicAdSlotProps = {
  slotId: PublicAdSlotId | string
  compact?: boolean
  fallbackLabel?: string
}

const disclosures = {
  es: {
    house: 'Promoción propia de XETHKIOZ',
    sponsor: 'Contenido patrocinado',
    affiliate: 'Enlace afiliado',
    network: 'Publicidad',
    sponsorLabel: 'Responsable',
    open: 'Abrir promoción',
  },
  en: {
    house: 'XETHKIOZ house promotion',
    sponsor: 'Sponsored content',
    affiliate: 'Affiliate link',
    network: 'Advertisement',
    sponsorLabel: 'Provided by',
    open: 'Open promotion',
  },
} as const

export default function PublicAdSlot({ slotId, compact = false, fallbackLabel }: PublicAdSlotProps) {
  const { lang } = useLang()
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

  const ui = disclosures[lang]
  const disclosure = ui[campaign.campaign_kind]
  const isInternalTarget = Boolean(campaign.target_url?.startsWith('/'))
  const isCommercial = campaign.campaign_kind !== 'house'

  const content = (
    <article className={`overflow-hidden rounded-[1.5rem] border border-orange-400/25 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,.2),transparent_38%),linear-gradient(135deg,rgba(124,58,237,.16),rgba(0,0,0,.82))] text-white shadow-[0_0_35px_rgba(249,115,22,.12)] ${compact ? 'p-4' : 'p-5 md:p-6'}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-orange-300">{disclosure}</p>
          {fallbackLabel ? <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">{fallbackLabel}</p> : null}
          <h3 className={`${compact ? 'text-lg' : 'text-2xl'} mt-2 font-black uppercase leading-tight`}>{campaign.title}</h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-violet-200">{ui.sponsorLabel}: {campaign.sponsor_name}</p>
          {campaign.description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">{campaign.description}</p> : null}
        </div>
        {campaign.image_url ? (
          <div className="shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/35 md:w-56">
            <SafeImage src={campaign.image_url} alt={campaign.title} loading="lazy" fallback="/images/articles/fallback.svg" className="h-32 w-full object-cover" />
          </div>
        ) : null}
      </div>
    </article>
  )

  if (!campaign.target_url) return content

  return (
    <a
      href={campaign.target_url}
      target={isInternalTarget ? undefined : '_blank'}
      rel={isInternalTarget ? undefined : isCommercial ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
      aria-label={`${ui.open}: ${campaign.title}`}
      className="block transition hover:-translate-y-0.5 hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300"
    >
      {content}
    </a>
  )
}
