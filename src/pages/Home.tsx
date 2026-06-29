import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { useWisp } from '../providers/WispProvider'
import { useLang } from '../lib/LangContext'

type Portal = {
  title: string
  subtitle: string
  route: string
  poster: string
  icon: string
  ring: string
  shadow: string
  text: string
  button: string
}

const copy = {
  es: {
    eyebrow: 'Bienvenido al ecosistema',
    titleTop: 'EL GAMING',
    titleBottom: 'ES MI PASIÓN',
    subtitle: 'Tres portales. Un universo. Miles de historias por descubrir.',
    cta: 'Explorar ecosistema →',
    wispTitle: 'GREEN WISP',
    wispText: 'Soy tu guía. Hay secretos que solo los curiosos encuentran.',
    wispBtn: 'Tocar al Wisp',
    wispNote: 'Solo para curiosos',
    login: 'Login',
    search: 'Buscar',
    navHome: 'HOME',
    navGames: 'JUEGOS',
    navScience: 'CIENCIA & TECH',
    navFun: 'DIVERSIÓN',
    navWisp: 'WISP NEXUS',
    statsUsers: '+25K XETHKIOZERS',
    statsNews: '1,248 NOTICIAS',
    statsContent: '+3.6K CONTENIDO',
    statsSecure: '24/7 SISTEMA SEGURO',
    copyright: '© 2026 Alexis Ivan Diaz Sellanes Santajulia. XETHKIOZ Web v1.0. Todos los derechos reservados.',
    portals: [
      {
        title: 'JUEGOS',
        subtitle: 'Noticias · Guías · Videos · Imágenes',
        route: '/gaming',
        poster: '/assets/portal-games-poster.png',
        icon: '🎮',
        ring: 'ring-purple-500/90',
        shadow: 'shadow-[0_0_70px_rgba(139,92,246,0.75)] hover:shadow-[0_0_105px_rgba(139,92,246,0.95)]',
        text: 'text-purple-300',
        button: 'Entrar al portal →',
      },
      {
        title: 'CIENCIA Y TECNOLOGÍA',
        subtitle: 'Física · Tecnología · IA · Proyectos',
        route: '/science',
        poster: '/assets/portal-science-poster.png',
        icon: '⚛',
        ring: 'ring-cyan-400/90',
        shadow: 'shadow-[0_0_70px_rgba(34,211,238,0.78)] hover:shadow-[0_0_110px_rgba(34,211,238,0.98)]',
        text: 'text-cyan-300',
        button: 'Entrar al portal →',
      },
      {
        title: 'DIVERSIÓN',
        subtitle: 'Memes · Videos · Arte · Humor',
        route: '/fun',
        poster: '/assets/portal-fun-poster.png',
        icon: '☻',
        ring: 'ring-orange-400/90',
        shadow: 'shadow-[0_0_70px_rgba(251,146,60,0.78)] hover:shadow-[0_0_110px_rgba(251,146,60,0.98)]',
        text: 'text-orange-300',
        button: 'Entrar al portal →',
      },
    ] as Portal[],
  },
  en: {
    eyebrow: 'Welcome to the ecosystem',
    titleTop: 'GAMING IS',
    titleBottom: 'MY PASSION',
    subtitle: 'Three portals. One universe. Thousands of stories waiting to be discovered.',
    cta: 'Explore ecosystem →',
    wispTitle: 'GREEN WISP',
    wispText: 'I am your guide. There are secrets that only the curious can find.',
    wispBtn: 'Touch the Wisp',
    wispNote: 'Only for the curious',
    login: 'Login',
    search: 'Search',
    navHome: 'HOME',
    navGames: 'GAMES',
    navScience: 'SCIENCE & TECH',
    navFun: 'FUN',
    navWisp: 'WISP NEXUS',
    statsUsers: '+25K XETHKIOZERS',
    statsNews: '1,248 NEWS',
    statsContent: '+3.6K CONTENT',
    statsSecure: '24/7 SECURE SYSTEM',
    copyright: '© 2026 Alexis Ivan Diaz Sellanes Santajulia. XETHKIOZ Web v1.0. All rights reserved.',
    portals: [
      {
        title: 'GAMES',
        subtitle: 'News · Guides · Videos · Images',
        route: '/gaming',
        poster: '/assets/portal-games-poster.png',
        icon: '🎮',
        ring: 'ring-purple-500/90',
        shadow: 'shadow-[0_0_70px_rgba(139,92,246,0.75)] hover:shadow-[0_0_105px_rgba(139,92,246,0.95)]',
        text: 'text-purple-300',
        button: 'Enter portal →',
      },
      {
        title: 'SCIENCE & TECHNOLOGY',
        subtitle: 'Physics · Technology · AI · Projects',
        route: '/science',
        poster: '/assets/portal-science-poster.png',
        icon: '⚛',
        ring: 'ring-cyan-400/90',
        shadow: 'shadow-[0_0_70px_rgba(34,211,238,0.78)] hover:shadow-[0_0_110px_rgba(34,211,238,0.98)]',
        text: 'text-cyan-300',
        button: 'Enter portal →',
      },
      {
        title: 'FUN',
        subtitle: 'Memes · Videos · Art · Humor',
        route: '/fun',
        poster: '/assets/portal-fun-poster.png',
        icon: '☻',
        ring: 'ring-orange-400/90',
        shadow: 'shadow-[0_0_70px_rgba(251,146,60,0.78)] hover:shadow-[0_0_110px_rgba(251,146,60,0.98)]',
        text: 'text-orange-300',
        button: 'Enter portal →',
      },
    ] as Portal[],
  },
} as const

const sideItems = [
  { to: '/', icon: '⌂' },
  { to: '/gaming', icon: '🎮' },
  { to: '/science', icon: '⚛' },
  { to: '/fun', icon: '☻' },
]

export default function Home() {
  const navigate = useNavigate()
  const { triggerGreenPortal } = useWisp()
  const { lang, setLang } = useLang()
  const t = copy[lang]

  const openWisp = () => {
    triggerGreenPortal()
    window.setTimeout(() => navigate('/green-node'), 450)
  }

  return (
    <>
      <SEO
        title="XETHKIOZ Web v1.0 · Ecosistema"
        description="Web inmersiva de XETHKIOZ con portales ovalados, Green Wisp y navegación AAA."
        url="/"
        image="/assets/xethkioz-cover.png"
      />

      <section className="relative min-h-[100svh] overflow-hidden bg-[#0A0A0F] text-white">
        <video
          className="fixed inset-0 -z-50 h-full w-full object-cover"
          src="/assets/bg-dragon-animated.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />

        <div className="fixed inset-0 -z-40 bg-black/65" />
        <div className="fixed inset-0 -z-30 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.16),transparent_30%),radial-gradient(circle_at_75%_35%,rgba(34,197,94,0.10),transparent_24%),radial-gradient(circle_at_center,transparent_35%,#0A0A0F_92%)]" />
        <div className="xk-noise fixed inset-0 -z-20 opacity-[0.17]" />

        <LeftLauncher onWisp={openWisp} />

        <header className="relative z-30 flex items-center justify-between px-5 py-5 md:px-10 lg:px-14">
          <Link to="/" className="group">
            <div className="text-4xl font-black italic tracking-tight md:text-5xl">
              <span className="bg-gradient-to-br from-orange-500 via-orange-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(255,107,26,0.65)]">
                X
              </span>
              <span className="bg-gradient-to-r from-purple-300 via-purple-500 to-violet-700 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(139,92,246,0.7)]">
                ETHKIOZ
              </span>
            </div>
            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-white/70">
              Gaming Is My Passion · Beyond The Game
            </p>
          </Link>

          <nav className="hidden rounded-full border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-xl lg:flex">
            <Link to="/" className="rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-orange-300">{t.navHome}</Link>
            <Link to="/gaming" className="rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-orange-300">{t.navGames}</Link>
            <Link to="/science" className="rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-orange-300">{t.navScience}</Link>
            <Link to="/fun" className="rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-orange-300">{t.navFun}</Link>
            <button
              onClick={openWisp}
              className="rounded-full px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-green-300 transition hover:bg-green-400/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
            >
              {t.navWisp}
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button aria-label={t.search} className="hidden h-11 w-11 place-items-center rounded-xl border border-white/10 bg-black/30 backdrop-blur-xl transition hover:border-orange-400/60 hover:shadow-[0_0_20px_rgba(251,146,60,0.4)] md:grid">⌕</button>
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] backdrop-blur-xl transition hover:border-purple-400"
            >
              {lang.toUpperCase()}
            </button>
            <Link
              to="/login"
              className="rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-purple-200 backdrop-blur-xl transition hover:bg-purple-500/20 hover:shadow-[0_0_22px_rgba(139,92,246,0.55)]"
            >
              {t.login}
            </Link>
          </div>
        </header>

        <main className="relative z-20 mx-auto max-w-[1720px] px-5 pb-40 pt-6 md:px-10 lg:px-14">
          <div className="relative min-h-[calc(100svh-190px)]">
            <section className="max-w-[760px] pt-8 lg:pt-12">
              <p className="font-mono text-xs font-black uppercase tracking-[0.38em] text-green-300 drop-shadow-[0_0_14px_rgba(34,197,94,0.8)]">
                {t.eyebrow}
              </p>

              <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.92] tracking-[0.04em] md:text-7xl lg:text-8xl">
                <span className="block text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.35)]">{t.titleTop}</span>
                <span className="block bg-gradient-to-r from-orange-400 via-purple-400 to-violet-700 bg-clip-text text-transparent drop-shadow-[0_0_34px_rgba(139,92,246,0.65)]">{t.titleBottom}</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">{t.subtitle}</p>

              <button
                onClick={() => document.getElementById('portals')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="mt-8 rounded-xl border border-orange-400/60 bg-orange-500/10 px-7 py-4 font-mono text-sm font-black uppercase tracking-[0.18em] text-orange-300 shadow-[0_0_28px_rgba(251,146,60,0.28)] transition hover:scale-[1.03] hover:bg-orange-500/20 hover:shadow-[0_0_45px_rgba(251,146,60,0.55)]"
              >
                {t.cta}
              </button>
            </section>

            <FloatingWisp
              title={t.wispTitle}
              text={t.wispText}
              button={t.wispBtn}
              note={t.wispNote}
              onClick={openWisp}
            />

            <section id="portals" className="mt-12 grid grid-cols-1 items-end gap-8 md:mt-16 md:grid-cols-3 xl:mt-10 xl:pr-[340px] 2xl:pr-[380px]">
              {t.portals.map((portal) => (
                <PortalCard key={portal.title} portal={portal} />
              ))}
            </section>
          </div>
        </main>

        <StatsBar stats={[t.statsUsers, t.statsNews, t.statsContent, t.statsSecure]} copyright={t.copyright} />
      </section>
    </>
  )
}

function PortalCard({ portal }: { portal: Portal }) {
  return (
    <Link to={portal.route} className="group block" aria-label={portal.button}>
      <article
        className={[
          'relative mx-auto h-[420px] w-full max-w-[420px] overflow-hidden rounded-[44%] ring-4 md:h-[460px] xl:h-[500px]',
          portal.ring,
          portal.shadow,
          'bg-black/25 transition-all duration-300 ease-out hover:scale-[1.035]',
        ].join(' ')}
      >
        <img
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.055]"
          src={portal.poster}
          alt={portal.title}
          loading="lazy"
        />

        <div className="absolute inset-0 rounded-[44%] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.46)_100%)] opacity-75 transition duration-300 group-hover:opacity-45" />
        <div className="absolute inset-0 rounded-[44%] ring-1 ring-white/20" />
        <div className="pointer-events-none absolute inset-4 rounded-[42%] border border-white/10 opacity-0 transition duration-300 group-hover:opacity-100" />

        <span className="sr-only">{portal.button}</span>
      </article>
    </Link>
  )
}

function FloatingWisp({
  title,
  text,
  button,
  note,
  onClick,
}: {
  title: string
  text: string
  button: string
  note: string
  onClick: () => void
}) {
  return (
    <div className="pointer-events-none absolute right-0 top-[18%] z-20 hidden xl:flex 2xl:right-6">
      <aside className="pointer-events-auto relative flex w-[260px] flex-col items-center rounded-[1.75rem] border border-green-500/35 bg-black/28 px-6 py-5 text-center shadow-[0_0_42px_rgba(34,197,94,0.22)] backdrop-blur-md">
        <div className="absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),transparent_62%)]" />
        <p className="relative z-10 font-mono text-[10px] font-black uppercase tracking-[0.34em] text-green-300">{title}</p>
        <img src="/assets/green-wisp.png" alt="Green Wisp" className="animate-float relative z-10 my-5 h-28 w-28 object-contain drop-shadow-[0_0_45px_rgba(34,197,94,0.95)]" draggable={false} />
        <p className="relative z-10 text-sm leading-relaxed text-white/75">{text}</p>
        <button
          type="button"
          onClick={onClick}
          className="relative z-10 mt-5 rounded-xl border border-green-400/60 bg-green-500/15 px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-green-100 shadow-[0_0_28px_rgba(34,197,94,0.45)] transition hover:scale-105 hover:bg-green-500/25 hover:shadow-[0_0_50px_rgba(34,197,94,0.85)]"
        >
          {button}
          <span className="mt-1 block text-[9px] text-yellow-300">{note}</span>
        </button>
      </aside>
    </div>
  )
}

function LeftLauncher({ onWisp }: { onWisp: () => void }) {
  return (
    <aside className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 rounded-[1.6rem] border border-white/10 bg-black/35 p-2 shadow-[0_0_30px_rgba(139,92,246,0.25)] backdrop-blur-xl md:flex">
      {sideItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/40 text-xl text-white/75 transition hover:border-purple-400 hover:text-purple-200 hover:shadow-[0_0_22px_rgba(139,92,246,0.65)]"
        >
          {item.icon}
        </Link>
      ))}

      <button
        type="button"
        onClick={onWisp}
        className="grid h-12 w-12 place-items-center rounded-2xl border border-green-500/40 bg-green-500/10 text-xl text-green-300 transition hover:border-green-300 hover:shadow-[0_0_25px_rgba(34,197,94,0.8)]"
      >
        ✦
      </button>
    </aside>
  )
}

function StatsBar({ stats, copyright }: { stats: string[]; copyright: string }) {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/72 px-5 py-4 font-mono text-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1720px] flex-col items-center justify-between gap-3 text-center md:flex-row">
        <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-xs uppercase tracking-[0.18em]">
          {stats.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">{copyright}</p>
      </div>
    </footer>
  )
}
