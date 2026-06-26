import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Logo from '../components/Logo'
import { useLang } from '../lib/LangContext'

export default function Home() {
  const { t } = useLang()
  const portals = [
    {
      to: '/gaming',
      title: t.v7.portals.games.title,
      subtitle: t.v7.portals.games.subtitle,
      color: 'violet',
      icon: '🎮',
    },
    {
      to: '/science',
      title: t.v7.portals.science.title,
      subtitle: t.v7.portals.science.subtitle,
      color: 'blue',
      icon: '⚛',
    },
    {
      to: '/fun',
      title: t.v7.portals.fun.title,
      subtitle: t.v7.portals.fun.subtitle,
      color: 'orange',
      icon: '☻',
    },
  ]

  return (
    <div className="xeth-core min-h-screen overflow-hidden bg-[#050608] text-white">
      <SEO
        title="XETHKIOZ Ecosystem"
        description="Tres portales, un universo: juegos, ciencia y tecnología, memes y comunidad. El Wisp verde abre el camino oculto."
        url="/"
        image="/images/articles/xethkioz-cover.svg"
      />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-8 sm:px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_52%_38%,rgba(138,46,255,.24),transparent_32%),radial-gradient(circle_at_82%_28%,rgba(255,122,0,.20),transparent_30%),radial-gradient(circle_at_29%_30%,rgba(50,255,138,.08),transparent_18%)]" />
        <div className="absolute inset-0 -z-10 opacity-25 grid-bg" />

        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-black/50 shadow-[0_0_90px_rgba(138,46,255,.16)] backdrop-blur-md">
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(5,6,8,.96),rgba(5,6,8,.58)_45%,rgba(5,6,8,.90))]" />
          <div className="absolute inset-0 opacity-90">
            <div className="dragon-shape-core absolute right-[4%] top-[14%] h-72 w-80 rotate-[-10deg] rounded-[48%] border border-orange/25 bg-black/45 shadow-[0_0_80px_rgba(255,122,0,.18)]" />
            <div className="dragon-neck-core absolute right-[18%] top-[38%] h-44 w-24 rotate-[28deg] rounded-full border border-orange/15 bg-black/35" />
            <div className="dragon-eye absolute right-[13%] top-[24%] h-5 w-5 rounded-full bg-orange shadow-[0_0_35px_rgba(255,122,0,1)]" />
            <div className="avatar-core absolute left-[47%] top-[37%] h-36 w-24 -translate-x-1/2 rounded-t-full border border-violet-400/25 bg-gradient-to-b from-[#151827] to-black shadow-[0_0_45px_rgba(138,46,255,.22)]" />
            <div className="avatar-core-head absolute left-[47%] top-[31%] h-12 w-12 -translate-x-1/2 rounded-full border border-orange/25 bg-[#11131d] shadow-[0_0_28px_rgba(255,122,0,.16)]" />
            <div className="sword-aura absolute left-[49%] top-[50%] h-2 w-56 origin-left rotate-[-35deg] rounded-full bg-gradient-to-r from-orange via-neon to-transparent shadow-[0_0_28px_rgba(138,46,255,.9)]" />
            <Link
              to="/green-node"
              aria-label={t.v7.core.wispLabel}
              className="wisp-home-orb absolute left-[35%] top-[24%] h-20 w-20 rounded-full border border-green-300/30 bg-green-400/10 shadow-[0_0_45px_rgba(50,255,138,.62)] transition hover:scale-110 hover:border-green-200"
            >
              <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-300 shadow-[0_0_25px_rgba(50,255,138,1)]" />
              <span className="absolute -left-3 bottom-1 h-8 w-14 -rotate-12 rounded-full border-l border-green-300/40 blur-[1px]" />
              <span className="sr-only">{t.v7.core.wispLabel}</span>
            </Link>
          </div>

          <div className="relative grid min-h-[500px] grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[.9fr_1.1fr] md:px-10 md:py-12">
            <div className="flex flex-col justify-center">
              <div className="mb-5 max-w-[22rem]">
                <Logo size="xl" />
              </div>
              <p className="section-eyebrow text-orange">{t.v7.core.eyebrow}</p>
              <h1 className="mt-4 font-display text-4xl font-black leading-none text-white md:text-6xl">
                {t.v7.core.title}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-300 md:text-base">
                {t.v7.core.description}
              </p>
              <a href="#portales" className="btn-primary mt-6 w-fit">{t.v7.core.cta}</a>
            </div>
            <div className="hidden items-end justify-end md:flex">
              <div className="max-w-sm rounded-3xl border border-white/10 bg-black/35 p-5 text-right backdrop-blur-md">
                <p className="font-display text-2xl font-black text-orange">{t.v7.core.sceneTitle}</p>
                <p className="mt-2 text-sm text-gray-300">{t.v7.core.sceneText}</p>
              </div>
            </div>
          </div>
        </div>

        <div id="portales" className="mt-7 text-center">
          <p className="section-eyebrow mb-4">{t.v7.core.choosePortal}</p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {portals.map((portal) => (
              <Link key={portal.to} to={portal.to} className={`portal-ring-card portal-ring-${portal.color} group`}>
                <span className="portal-glyph">{portal.icon}</span>
                <span className="portal-title">{portal.title}</span>
                <span className="portal-subtitle">{portal.subtitle}</span>
                <span className="portal-enter">{t.v7.enter}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
