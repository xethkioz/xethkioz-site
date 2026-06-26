import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Logo from '../components/Logo'
import { useLang } from '../lib/LangContext'

type PortalCard = {
  to: string
  title: string
  subtitle: string
  color: 'violet' | 'blue' | 'orange'
  icon: string
  label: string
}

export default function Home() {
  const { t } = useLang()
  const portals: PortalCard[] = [
    {
      to: '/gaming',
      title: t.v7.portals.games.title,
      subtitle: t.v7.portals.games.subtitle,
      color: 'violet',
      icon: '🎮',
      label: 'Gaming Hub',
    },
    {
      to: '/science',
      title: t.v7.portals.science.title,
      subtitle: t.v7.portals.science.subtitle,
      color: 'blue',
      icon: '⚛',
      label: 'Science Lab',
    },
    {
      to: '/fun',
      title: t.v7.portals.fun.title,
      subtitle: t.v7.portals.fun.subtitle,
      color: 'orange',
      icon: '☻',
      label: 'Fun Portal',
    },
  ]

  return (
    <div className="xeth-core xeth-world min-h-screen overflow-hidden bg-[#050608] text-white">
      <SEO
        title="XETHKIOZ Ecosystem"
        description="Tres portales, un universo: juegos, ciencia y tecnología, memes y comunidad. El Wisp verde abre el camino oculto."
        url="/"
        image="/images/articles/xethkioz-cover.svg"
      />

      <section className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col justify-center px-4 py-7 sm:px-6 lg:px-8">
        <div className="xeth-world-bg absolute inset-0 -z-10" />
        <div className="xeth-world-fog absolute inset-0 -z-10" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 shadow-[0_0_120px_rgba(138,46,255,.16)] backdrop-blur-md">
          <div className="xeth-rune-noise absolute inset-0 opacity-45" />
          <div className="xeth-citadel absolute inset-0 opacity-80" />

          <div className="relative min-h-[78vh] px-5 pb-7 pt-6 md:px-8 md:pt-8 lg:px-10">
            <div className="relative z-20 flex items-start justify-between gap-4">
              <div className="max-w-[20rem]">
                <Logo size="xl" />
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.34em] text-orange/90">
                  Gaming is my passion • Beyond the game
                </p>
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-right text-xs uppercase tracking-[0.22em] text-gray-300 backdrop-blur-md md:block">
                <span className="block text-green-300">Estado del núcleo</span>
                <span className="mt-1 block text-white/80">Conectado • Alpha 4</span>
              </div>
            </div>

            <div className="xeth-dragon" aria-hidden="true">
              <div className="xeth-dragon-wing left-wing" />
              <div className="xeth-dragon-wing right-wing" />
              <div className="xeth-dragon-head">
                <span className="dragon-eye left" />
                <span className="dragon-eye right" />
              </div>
              <div className="dragon-core-mark">X</div>
            </div>

            <Link to="/green-node" aria-label={t.v7.core.wispLabel} className="green-wisp-secret">
              <span className="wisp-face">
                <span />
                <span />
              </span>
              <span className="wisp-flame one" />
              <span className="wisp-flame two" />
              <span className="wisp-flame three" />
              <span className="sr-only">{t.v7.core.wispLabel}</span>
            </Link>

            <div className="relative z-10 mx-auto mt-10 max-w-3xl text-center md:mt-8">
              <p className="section-eyebrow text-orange">{t.v7.core.eyebrow}</p>
              <h1 className="xeth-main-title mt-3 font-display text-5xl font-black uppercase leading-none text-white md:text-7xl lg:text-8xl">
                XETHKIOZ
              </h1>
              <p className="mt-2 font-display text-sm uppercase tracking-[0.46em] text-gray-300 md:text-base">
                {t.v7.core.title}
              </p>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
                {t.v7.core.description}
              </p>
            </div>

            <div id="portales" className="relative z-20 mt-10">
              <p className="mb-5 text-center font-display text-[11px] font-black uppercase tracking-[0.38em] text-gray-300">
                {t.v7.core.choosePortal}
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {portals.map((portal) => (
                  <Link key={portal.to} to={portal.to} className={`wow-portal wow-portal-${portal.color} group`}>
                    <span className="portal-stone-top" />
                    <span className="portal-vortex" />
                    <span className="portal-runes" />
                    <span className="portal-depth" />
                    <span className="portal-icon">{portal.icon}</span>
                    <span className="portal-title">{portal.title}</span>
                    <span className="portal-subtitle">{portal.subtitle}</span>
                    <span className="portal-enter">{t.v7.enter}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-7 max-w-3xl rounded-2xl border border-white/10 bg-black/45 px-5 py-4 text-center backdrop-blur-md">
              <p className="font-display text-sm uppercase tracking-[0.26em] text-neon-100">
                “No es solo un sitio. Es un portal. Es una red. Es XETHKIOZ.”
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
