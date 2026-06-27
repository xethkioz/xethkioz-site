import { Link } from 'react-router-dom'
import { getFusionArticles, getFusionCmsQueue, getFusionMissions, type FusionPortalId } from '../../lib/fusionContent'
import { useLang } from '../../lib/LangContext'
import { useProfileProgress } from '../../lib/ProfileProgressContext'
import { useWispEngine } from '../../lib/WispEngineContext'
import { FUSION_LABEL, FUSION_STAGE } from '../../lib/fusionConfig'

type PortalTone = 'gaming' | 'science' | 'green' | 'fun'

interface PortalCard {
  id: FusionPortalId
  to: string
  code: string
  title: string
  subtitle: string
  tone: PortalTone
}

const toneClass: Record<PortalTone, string> = {
  gaming: 'hover:border-fusionAccent-tech-primary hover:shadow-glow-tech focus-visible:ring-fusionAccent-tech-primary',
  science: 'hover:border-fusionAccent-science hover:shadow-glow-science focus-visible:ring-fusionAccent-science',
  green: 'hover:border-fusionAccent-greenNode hover:shadow-glow-green focus-visible:ring-fusionAccent-greenNode',
  fun: 'hover:border-fusionAccent-tech-secondary hover:shadow-glow-action focus-visible:ring-fusionAccent-tech-secondary',
}

const dotClass: Record<PortalTone, string> = {
  gaming: 'bg-fusionAccent-tech-primary',
  science: 'bg-fusionAccent-science',
  green: 'bg-fusionAccent-greenNode',
  fun: 'bg-fusionAccent-tech-secondary',
}

const copy = {
  es: {
    quote: '"No quiero que se vea como una web... quiero que parezca un universo."',
    portalsTitle: 'World Gates / Acceso Ecosistema',
    updatesTitle: 'Noticias Destacadas & Actualizaciones',
    systemCore: 'SYSTEM_CORE',
    release: 'V5.0.0_INIT',
    updateHeadline: 'Refactorización de Nodos en Marcha',
    updateText: 'Centralizando la lógica de versiones, paneles y contenido dinámico para conservar funcionalidad sin saturar la vista principal.',
    wispEngine: 'WISP_ENGINE_v1.0',
    wispStatus: 'WISP: Watching',
    wispText: 'Navegando, leyendo señales y optimizando el flujo del ecosistema.',
    communityStatus: 'COMUNIDAD_STATUS',
    online: 'ONLINE',
    connectedUsers: 'Usuarios conectados',
    hiddenDimension: '// Buscar dimensión oculta _',
    contentSignal: 'Señales de contenido',
    cmsQueue: 'Cola editorial',
    missions: 'Misiones activas',
  },
  en: {
    quote: '"It should not look like a website... it should feel like a universe."',
    portalsTitle: 'World Gates / Ecosystem Access',
    updatesTitle: 'Featured News & Updates',
    systemCore: 'SYSTEM_CORE',
    release: 'V5.0.0_INIT',
    updateHeadline: 'Node Refactor in Progress',
    updateText: 'Centralizing version, panel and dynamic content logic to preserve functionality without saturating the main view.',
    wispEngine: 'WISP_ENGINE_v1.0',
    wispStatus: 'WISP: Watching',
    wispText: 'Navigating, reading signals and optimizing the ecosystem flow.',
    communityStatus: 'COMMUNITY_STATUS',
    online: 'ONLINE',
    connectedUsers: 'Connected users',
    hiddenDimension: '// Search hidden dimension _',
    contentSignal: 'Content signals',
    cmsQueue: 'Editorial queue',
    missions: 'Active missions',
  },
} as const

export default function FusionWorldStageV5() {
  const { lang, t } = useLang()
  const { energy, mood, registerEvent } = useWispEngine()
  const { xp, level } = useProfileProgress()
  const ui = copy[lang]

  const portalCards: PortalCard[] = [
    { id: 'gaming', to: '/gaming', code: '01 / PORTAL', title: t.v7.portals.games.title, subtitle: t.v7.portals.games.subtitle, tone: 'gaming' },
    { id: 'science', to: '/science', code: '02 / PORTAL', title: t.v7.portals.science.title, subtitle: t.v7.portals.science.subtitle, tone: 'science' },
    { id: 'green', to: '/green-node', code: '03 / HIDDEN', title: t.v7.portals.green.title, subtitle: t.v7.portals.green.subtitle, tone: 'green' },
    { id: 'fun', to: '/fun', code: '04 / PORTAL', title: t.v7.portals.fun.title, subtitle: t.v7.portals.fun.subtitle, tone: 'fun' },
  ]

  const articles = getFusionArticles(lang).slice(0, 3)
  const queue = getFusionCmsQueue(lang).slice(0, 3)
  const missions = getFusionMissions(lang).slice(0, 3)

  return (
    <div className="min-h-screen overflow-x-hidden bg-fusionBg text-gray-300 selection:bg-fusionAccent-tech-primary/30">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fusionSurface-glow/20 via-fusionBg to-fusionBg" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(139,92,246,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,126,41,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-70" />

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <section className="flex flex-col items-center gap-6 py-12 text-center md:py-20" aria-labelledby="world-gate-title">
          <p className="rounded-full border border-fusionAccent-tech-primary/20 bg-fusionSurface-base/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-fusionAccent-tech-primary shadow-glow-tech-subtle">
            {FUSION_LABEL} · {FUSION_STAGE}
          </p>
          <h1 id="world-gate-title" className="bg-gradient-to-r from-white via-gray-200 to-fusionAccent-tech-primary bg-clip-text text-4xl font-black uppercase tracking-[0.16em] text-transparent drop-shadow-[0_0_10px_rgba(139,92,246,0.15)] md:text-6xl">
            XETHKIOZ
          </h1>
          <p className="max-w-2xl font-mono text-sm uppercase tracking-[0.22em] text-fusionAccent-tech-secondary md:text-base">
            {ui.quote}
          </p>
        </section>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <section className="flex flex-col gap-4" aria-labelledby="world-gates-heading">
              <SectionHeading id="world-gates-heading" tone="tech" label={ui.portalsTitle} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {portalCards.map((portal) => (
                  <Link
                    key={portal.id}
                    to={portal.to}
                    aria-label={`${t.v7.enter} ${portal.title}`}
                    onMouseEnter={() => registerEvent('portal-hover', `home-v5:${portal.id}`, portal.to)}
                    className={`panel-cyber group flex h-36 flex-col justify-between p-4 transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 ${toneClass[portal.tone]}`}
                  >
                    <span className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.16em] text-gray-500 transition-colors group-hover:text-gray-200">
                      {portal.code}
                      <span className={`h-2 w-2 rounded-full ${dotClass[portal.tone]} opacity-70 transition group-hover:scale-125`} />
                    </span>
                    <span className="space-y-1">
                      <strong className="block text-base font-black uppercase tracking-wide text-white">{portal.title}</strong>
                      <small className="line-clamp-2 text-xs text-gray-500">{portal.subtitle}</small>
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4" aria-labelledby="updates-heading">
              <SectionHeading id="updates-heading" tone="action" label={ui.updatesTitle} />
              <article className="panel-cyber border-l-2 border-l-fusionAccent-tech-secondary p-6">
                <div className="mb-4 flex items-center justify-between font-mono text-xs text-fusionAccent-tech-secondary">
                  <span>{ui.systemCore}</span>
                  <span>{ui.release}</span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-wide text-white">{ui.updateHeadline}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">{ui.updateText}</p>
              </article>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label={ui.contentSignal}>
              {articles.map((article) => (
                <article key={article.id} className="panel-cyber p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">{article.category}</p>
                  <h3 className="mt-2 line-clamp-2 text-sm font-bold text-gray-100">{article.title}</h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-500">{article.summary}</p>
                </article>
              ))}
            </section>
          </div>

          <aside className="flex flex-col gap-8 lg:col-span-4" aria-label="World Gate side systems">
            <section className="panel-cyber group relative flex min-h-[250px] flex-col items-center justify-center overflow-hidden p-6 text-center">
              <div className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-gray-600">{ui.wispEngine}</div>
              <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-fusionAccent-tech-primary/40 to-transparent" />
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-fusionAccent-tech-primary to-fusionAccent-tech-secondary opacity-80 blur-md transition group-hover:scale-110 group-hover:shadow-glow-tech" />
              <div className="relative -mt-16 h-16 w-16 rounded-full border border-white/20 bg-fusionBg/60 shadow-glow-tech-subtle" />
              <div className="mt-8">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-fusionAccent-tech-primary">{ui.wispStatus}</p>
                <p className="mx-auto mt-2 max-w-[230px] text-xs text-gray-500">{ui.wispText}</p>
              </div>
              <div className="mt-4 grid w-full grid-cols-2 gap-2 text-xs">
                <StatusPill label="MOOD" value={mood} />
                <StatusPill label="ENERGY" value={`${energy}%`} />
              </div>
            </section>

            <section className="panel-cyber flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-gray-500">{ui.communityStatus}</span>
                <span className="animate-pulse text-fusionAccent-greenNode">{ui.online}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{ui.connectedUsers}</span>
                <span className="font-mono font-bold text-white">1</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">LVL / XP</span>
                <span className="font-mono font-bold text-white">{level} / {xp}</span>
              </div>
              <div className="mt-2 border-t border-fusionSurface-muted pt-3 text-center">
                <Link to="/green-node" className="font-mono text-[11px] uppercase tracking-[0.22em] text-fusionAccent-secret transition hover:text-fusionAccent-greenNode hover:underline">
                  {ui.hiddenDimension}
                </Link>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <SideList title={ui.cmsQueue} items={queue.map((item) => `${item.status.toUpperCase()} · ${item.title}`)} />
              <SideList title={ui.missions} items={missions.map((mission) => `${mission.rewardXp} XP · ${mission.title}`)} />
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

function SectionHeading({ id, label, tone }: { id: string; label: string; tone: 'tech' | 'action' }) {
  return (
    <h2 id={id} className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-gray-500">
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'tech' ? 'bg-fusionAccent-tech-primary' : 'bg-fusionAccent-tech-secondary'} animate-pulse`} />
      {label}
    </h2>
  )
}

function StatusPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-left">
      <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-gray-600">{label}</span>
      <strong className="font-mono text-[11px] uppercase text-gray-200">{value}</strong>
    </div>
  )
}

function SideList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="panel-cyber p-4">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-white/5 bg-black/15 px-3 py-2 text-xs text-gray-400">{item}</li>
        ))}
      </ul>
    </article>
  )
}
