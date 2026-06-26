import { Link, useLocation } from 'react-router-dom'
import { editorialSlots, publishingLanes } from '../lib/editorialPlan'
import { fallbackArticles, fallbackStreams } from '../lib/mockData'
import { trustedNewsSources } from '../lib/newsSources'
import { usePresence } from '../lib/realtimeCommunity'

function pickDailyIndex(length: number, salt = 0) {
  if (length <= 0) return 0
  const now = new Date()
  const seed = now.getFullYear() * 372 + (now.getMonth() + 1) * 31 + now.getDate() + salt
  return seed % length
}

export default function ActivityPulsePanel() {
  const location = useLocation()
  const presence = usePresence(location.pathname, 'general')
  const lead = fallbackArticles[pickDailyIndex(fallbackArticles.length)]
  const secondary = fallbackArticles[pickDailyIndex(fallbackArticles.length, 7)]
  const source = trustedNewsSources[pickDailyIndex(trustedNewsSources.length, 13)]
  const slot = editorialSlots[pickDailyIndex(editorialSlots.length, 21)]
  const lane = publishingLanes[pickDailyIndex(publishingLanes.length, 34)]
  const stream = fallbackStreams[pickDailyIndex(fallbackStreams.length, 55)]

  const pulseItems = [
    { label: 'Usuarios online', value: `${presence.onlineTotal}`, detail: `${presence.routeOnline} mirando esta página`, tone: 'text-green-300', link: '/community' },
    { label: 'Wisp', value: `Lv.${presence.wispLevel}`, detail: `${presence.wispName} · energía ${presence.energy}%`, tone: 'text-green-300', link: '/network' },
    { label: 'Noticia del día', value: lead.category?.name ?? 'Gaming', detail: lead.title, tone: 'text-orange', link: `/article/${lead.slug}` },
    { label: 'Fuente a revisar', value: source.name, detail: `${source.region} · ${source.language.toUpperCase()} · ${source.status}`, tone: 'text-neon', link: '/news-engine' },
    { label: 'Carril editorial', value: lane.name, detail: lane.output, tone: 'text-white', link: '/content-system' },
    { label: 'Próximo foco', value: slot.portal, detail: slot.nextAction, tone: 'text-orange', link: '/milestones' },
  ]

  return (
    <section className="relative overflow-hidden rounded-3xl border border-orange/20 bg-ink-300/85 p-5 shadow-[0_0_38px_rgba(255,106,0,0.12)] backdrop-blur-xl">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-stretch">
        <div className="lg:w-[34%] rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="section-eyebrow">XETHKIOZ LIVE PULSE</p>
          <h2 className="mt-2 font-display text-2xl font-black text-white">Centro de actividad</h2>
          <p className="mt-2 text-sm text-gray-400">
            Un panel vivo para que la home muestre movimiento diario: comunidad, noticias, fuente destacada, stream y plan editorial.
          </p>
          <div className="mt-4 rounded-xl border border-green-400/20 bg-green-400/5 p-3 font-mono text-xs text-green-200">
            realtime: {presence.realtime ? 'online' : 'fallback local'} · watchers: {presence.onlineTotal} · wisp-energy: {presence.energy}%
          </div>
          <Link to="/news-engine" className="btn-primary mt-4 inline-flex text-sm">Ver motor editorial</Link>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pulseItems.map((item) => (
            <Link key={item.label} to={item.link} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-all hover:-translate-y-0.5 hover:border-orange/50 hover:bg-white/[0.055]">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">{item.label}</p>
              <h3 className={`mt-2 line-clamp-1 font-display text-lg font-black ${item.tone}`}>{item.value}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-400">{item.detail}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Link to={`/article/${secondary.slug}`} className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:border-neon/50">
          <p className="section-eyebrow mb-1">Rotación diaria</p>
          <h3 className="font-display text-lg font-black text-white">{secondary.title}</h3>
          <p className="mt-1 text-xs text-gray-400">{secondary.excerpt}</p>
        </Link>
        <Link to="/streaming" className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:border-orange/50">
          <p className="section-eyebrow mb-1">Streaming pulse</p>
          <h3 className="font-display text-lg font-black text-white">{stream?.title ?? 'Preparar próximo directo'}</h3>
          <p className="mt-1 text-xs text-gray-400">Estado, clips, overlay y agenda del próximo vivo.</p>
        </Link>
      </div>
    </section>
  )
}
