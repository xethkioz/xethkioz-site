import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SafeImage from '../components/SafeImage'
import SEO from '../components/SEO'
import { fallbackWebServiceOffers } from '../data/webServiceFallbacks'
import { useWisp } from '../providers/WispProvider'
import { useLang } from '../lib/LangContext'
import type { WebServiceOffer } from '../types/webServices'

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

type DataSavingConnection = {
  saveData?: boolean
  addEventListener?: (type: 'change', listener: () => void) => void
  removeEventListener?: (type: 'change', listener: () => void) => void
}

const copy = {
  es: {
    eyebrow: 'Bienvenido al ecosistema',
    titleTop: 'EL GAMING',
    titleBottom: 'ES MI PASIÓN',
    subtitle: 'Tres portales, un estudio creativo y miles de historias por descubrir.',
    cta: 'Explorar ecosistema →',
    wispTitle: 'WISP // INFECTED',
    wispText: 'Una entidad malware abrió el Archivo Negro. Entrá si querés investigar la señal.',
    wispBtn: 'Interceptar señal',
    wispNote: 'Acceso clandestino · Nivel 13',
    login: 'Login',
    news: 'Abrir radar de noticias',
    switchLanguage: 'Cambiar a inglés',
    primaryNav: 'Navegación principal',
    launcher: 'Accesos rápidos XETHKIOZ',
    portalsLabel: 'Portales XETHKIOZ',
    navHome: 'HOME',
    navGames: 'JUEGOS',
    navScience: 'CIENCIA & TECH',
    navFun: 'DIVERSIÓN',
    navWeb: 'CREACIÓN WEB',
    navWisp: 'WISP NEXUS',
    webEyebrow: 'NUEVA LÍNEA · CREACIÓN WEB',
    webTitle: 'Tu idea también puede tener su propio universo.',
    webText: 'Diseño y desarrollo de landing pages, tiendas online y sitios profesionales con identidad, velocidad y presupuesto personalizado.',
    webCta: 'Explorar creación web →',
    webNote: 'Propuestas visuales · Presupuesto privado · Diseño responsive',
    webImageAlt: 'Ejemplo visual de una landing page premium creada por XETHKIOZ',
    webFeaturedLabel: 'Propuesta destacada',
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
    subtitle: 'Three portals, one creative studio and thousands of stories waiting to be discovered.',
    cta: 'Explore ecosystem →',
    wispTitle: 'WISP // INFECTED',
    wispText: 'A malware entity opened the Black Archive. Enter if you want to investigate the signal.',
    wispBtn: 'Intercept signal',
    wispNote: 'Clandestine access · Level 13',
    login: 'Login',
    news: 'Open news radar',
    switchLanguage: 'Switch to Spanish',
    primaryNav: 'Primary navigation',
    launcher: 'XETHKIOZ quick links',
    portalsLabel: 'XETHKIOZ portals',
    navHome: 'HOME',
    navGames: 'GAMES',
    navScience: 'SCIENCE & TECH',
    navFun: 'FUN',
    navWeb: 'WEB CREATION',
    navWisp: 'WISP NEXUS',
    webEyebrow: 'NEW LINE · WEB CREATION',
    webTitle: 'Your idea can have a universe of its own.',
    webText: 'Design and development of landing pages, online stores and professional sites with identity, speed and a custom quote.',
    webCta: 'Explore web creation →',
    webNote: 'Visual proposals · Private quote · Responsive design',
    webImageAlt: 'Visual example of a premium landing page created by XETHKIOZ',
    webFeaturedLabel: 'Featured solution',
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
  { to: '/creacion-web', icon: '▣' },
]

function useAmbientVideoEnabled() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & { connection?: DataSavingConnection }).connection
    const syncPreference = () => setEnabled(!motionPreference.matches && !connection?.saveData)

    syncPreference()
    motionPreference.addEventListener('change', syncPreference)
    connection?.addEventListener?.('change', syncPreference)

    return () => {
      motionPreference.removeEventListener('change', syncPreference)
      connection?.removeEventListener?.('change', syncPreference)
    }
  }, [])

  return enabled
}

function useFeaturedWebService() {
  const [offer, setOffer] = useState<WebServiceOffer>(fallbackWebServiceOffers[0])

  useEffect(() => {
    let active = true

    import('../services/webServices')
      .then(({ loadFeaturedWebService }) => loadFeaturedWebService())
      .then((nextOffer) => {
        if (active) setOffer(nextOffer)
      })
      .catch(() => {
        // The static featured offer remains available if the CMS cannot be reached.
      })

    return () => {
      active = false
    }
  }, [])

  return offer
}

export default function Home() {
  const navigate = useNavigate()
  const { triggerGreenPortal } = useWisp()
  const { lang, setLang } = useLang()
  const t = copy[lang]
  const videoEnabled = useAmbientVideoEnabled()
  const featuredWebOffer = useFeaturedWebService()

  const openWisp = () => {
    triggerGreenPortal()
    window.setTimeout(() => navigate('/green-node'), 450)
  }

  const scrollToPortals = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('portals')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <>
      <SEO
        title="XETHKIOZ Web v1.0 · Ecosistema"
        description="Ecosistema inmersivo XETHKIOZ con gaming, ciencia, diversión, Green Wisp y creación de páginas web a medida."
        url="/"
        image="/assets/xethkioz-cover.png"
      />

      <section className="relative min-h-[100svh] overflow-hidden bg-[#0A0A0F] text-white">
        <div
          className="fixed inset-0 -z-50 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/bg-dragon-poster.webp')" }}
          aria-hidden="true"
        />
        {videoEnabled && (
          <video
            className="fixed inset-0 -z-50 h-full w-full object-cover"
            src="/assets/bg-dragon-animated.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/assets/bg-dragon-poster.webp"
            aria-hidden="true"
          />
        )}

        <div className="fixed inset-0 -z-40 bg-black/65" />
        <div className="fixed inset-0 -z-30 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.16),transparent_30%),radial-gradient(circle_at_75%_35%,rgba(34,197,94,0.10),transparent_24%),radial-gradient(circle_at_center,transparent_35%,#0A0A0F_92%)]" />
        <div className="xk-noise fixed inset-0 -z-20 opacity-[0.17]" />

        <LeftLauncher
          onWisp={openWisp}
          label={t.launcher}
          itemLabels={[t.navHome, t.navGames, t.navScience, t.navFun, t.navWeb]}
          wispLabel={t.navWisp}
        />

        <header className="relative z-30 flex items-center justify-between px-5 py-5 md:px-10 lg:px-14">
          <Link to="/" className="group" aria-label="XETHKIOZ Home">
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

          <nav className="hidden rounded-full border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-xl lg:flex" aria-label={t.primaryNav}>
            <Link to="/" aria-current="page" className="rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-orange-300">{t.navHome}</Link>
            <Link to="/gaming" className="rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-orange-300">{t.navGames}</Link>
            <Link to="/science" className="rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-orange-300">{t.navScience}</Link>
            <Link to="/fun" className="rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-orange-300">{t.navFun}</Link>
            <Link to="/creacion-web" className="rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-orange-200 transition hover:bg-orange-400/10 hover:text-orange-100">{t.navWeb}</Link>
            <button
              type="button"
              onClick={openWisp}
              className="rounded-full px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-green-300 transition hover:bg-green-400/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
            >
              {t.navWisp}
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/news" aria-label={t.news} className="hidden h-11 w-11 place-items-center rounded-xl border border-white/10 bg-black/30 backdrop-blur-xl transition hover:border-orange-400/60 hover:shadow-[0_0_20px_rgba(251,146,60,0.4)] md:grid">⌕</Link>
            <button
              type="button"
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              aria-label={t.switchLanguage}
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

        <div className="relative z-20 mx-auto max-w-[1720px] px-5 pb-40 pt-2 md:px-10 lg:px-14">
          <div className="relative min-h-[calc(100svh-190px)]">
            <section className="xk-home-manifesto pt-4 xl:pr-[310px]">
              <p className="font-mono text-xs font-black uppercase tracking-[0.38em] text-orange-300 drop-shadow-[0_0_14px_rgba(251,146,60,0.72)]">
                {t.eyebrow}
              </p>

              <h1 className="xk-home-horizontal-title">
                <span className="text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.35)]">{t.titleTop}</span>{' '}
                <span className="bg-gradient-to-r from-orange-400 via-purple-400 to-violet-700 bg-clip-text text-transparent drop-shadow-[0_0_34px_rgba(139,92,246,0.65)]">{t.titleBottom}</span>
              </h1>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="max-w-xl text-base leading-relaxed text-white/75 md:text-lg">{t.subtitle}</p>
                <button type="button" onClick={scrollToPortals} className="shrink-0 rounded-xl border border-orange-400/60 bg-orange-500/10 px-6 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-orange-300 shadow-[0_0_28px_rgba(251,146,60,0.28)] transition hover:scale-[1.03] hover:bg-orange-500/20 hover:shadow-[0_0_45px_rgba(251,146,60,0.55)]">{t.cta}</button>
              </div>
            </section>

            <FloatingWisp
              ariaLabel={t.navWisp}
              onClick={openWisp}
            />

            <section id="portals" aria-label={t.portalsLabel} className="xk-home-portal-deck mt-8 grid grid-cols-1 items-stretch gap-4 p-2.5 md:grid-cols-3 md:gap-3 md:p-4 xl:mt-7 xl:gap-5">
              {t.portals.map((portal) => (
                <PortalCard key={portal.title} portal={portal} />
              ))}
            </section>

            <WebCreationFeature
              eyebrow={t.webEyebrow}
              title={t.webTitle}
              text={t.webText}
              cta={t.webCta}
              note={t.webNote}
              imageAlt={t.webImageAlt}
              featuredLabel={t.webFeaturedLabel}
              offer={featuredWebOffer}
            />
          </div>
        </div>

        <StatsBar stats={[t.statsUsers, t.statsNews, t.statsContent, t.statsSecure]} copyright={t.copyright} />
      </section>
    </>
  )
}

function WebCreationFeature({
  eyebrow,
  title,
  text,
  cta,
  note,
  imageAlt,
  featuredLabel,
  offer,
}: {
  eyebrow: string
  title: string
  text: string
  cta: string
  note: string
  imageAlt: string
  featuredLabel: string
  offer: WebServiceOffer
}) {
  return (
    <section className="relative mt-14 overflow-hidden rounded-[1.75rem] border border-orange-400/25 bg-gradient-to-br from-orange-500/[0.09] via-purple-500/[0.09] to-black/55 p-5 shadow-[0_32px_100px_rgba(0,0,0,.48)] sm:p-6 md:mt-20 md:rounded-[2.4rem] md:p-9 lg:p-12" aria-labelledby="web-creation-home-title">
      <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" aria-hidden="true" />
      <div className="relative grid items-center gap-10 xl:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-orange-300">{eyebrow}</p>
          <h2 id="web-creation-home-title" className="mt-4 max-w-2xl text-[2rem] font-black leading-[1.02] tracking-[-0.04em] sm:text-4xl md:text-6xl">{title}</h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/70 md:text-base md:leading-7">{text}</p>
          <Link to="/creacion-web" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-orange-500 to-orange-300 px-5 py-3.5 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-black shadow-[0_0_28px_rgba(255,106,0,.28)] transition hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(255,106,0,.48)] sm:px-6 sm:py-4 sm:text-xs sm:tracking-[0.16em]">
            {cta}
          </Link>
          <p className="mt-5 font-mono text-[8px] font-bold uppercase leading-5 tracking-[0.14em] text-purple-200/65 sm:text-[9px] sm:tracking-[0.18em]">{note}</p>
        </div>

        <Link to="/creacion-web" className="group relative block overflow-hidden rounded-[1.75rem] border border-white/15 bg-black/60 p-2 shadow-[0_25px_70px_rgba(0,0,0,.5)]" aria-label={`${cta}: ${offer.title}`}>
          <div className="flex h-8 items-center gap-2 border-b border-white/10 px-3" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="ml-2 h-2 flex-1 rounded-full bg-white/[0.06]" />
          </div>
          <div className="overflow-hidden rounded-[1.2rem]">
            <SafeImage src={offer.image_url} fallback="/web-services/landing-premium.svg" alt={offer.image_alt || imageAlt} className="aspect-[12/7.6] w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
          </div>
          <div className="grid gap-3 px-3 py-4 sm:grid-cols-[1fr_auto] sm:items-end sm:px-4">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-orange-300">{featuredLabel}</p>
              <p className="mt-1 truncate text-base font-black text-white">{offer.title}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm font-black text-purple-100">{offer.price_label}</p>
              {offer.delivery_label ? <p className="mt-1 text-[10px] text-white/45">{offer.delivery_label}</p> : null}
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}

function PortalCard({ portal }: { portal: Portal }) {
  const tone = portal.route === '/gaming' ? 'violet' : portal.route === '/science' ? 'cyan' : 'orange'

  return (
    <Link to={portal.route} className="group block rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-4 focus-visible:ring-offset-black" aria-label={`${portal.button.replace(' →', '')}: ${portal.title}`}>
      <article
        className={[
          `xk-home-portal xk-home-portal-${tone}`,
          'relative mx-auto aspect-[0.875] w-full max-w-none overflow-hidden rounded-t-[42%] rounded-b-[1.6rem] ring-2 md:rounded-b-[1.35rem] xl:rounded-b-[2rem]',
          portal.ring,
          portal.shadow,
          'bg-black/25 transition-all duration-500 ease-out group-hover:scale-[1.035]',
        ].join(' ')}
      >
        <span className="xk-portal-aura" aria-hidden="true" />
        <span className="xk-portal-orbit" aria-hidden="true" />
        <span className="xk-portal-orbit xk-portal-orbit-reverse" aria-hidden="true" />
        <span className="xk-portal-scan" aria-hidden="true" />
        <span className="xk-portal-particle xk-portal-particle-1" aria-hidden="true" />
        <span className="xk-portal-particle xk-portal-particle-2" aria-hidden="true" />
        <span className="xk-portal-particle xk-portal-particle-3" aria-hidden="true" />

        <SafeImage
          className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-[1.075] group-hover:saturate-125"
          src={portal.poster}
          alt={portal.title}
          loading="lazy"
          fallback="/images/articles/fallback.svg"
        />

        <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(0,0,0,0.6)_100%)] opacity-55 transition duration-500 group-hover:opacity-30" />
        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/20" />
        <div className="pointer-events-none absolute inset-3 rounded-t-[40%] rounded-b-[1.15rem] border border-white/10 opacity-35 transition duration-500 group-hover:inset-2 group-hover:opacity-80 md:inset-2 xl:inset-4" />
      </article>
    </Link>
  )
}

function FloatingWisp({
  ariaLabel,
  onClick,
}: {
  ariaLabel: string
  onClick: () => void
}) {
  return (
    <div className="pointer-events-none absolute right-[1%] top-0 z-20 hidden h-[360px] w-[285px] xl:block 2xl:right-[2%]">
      <span className="xk-home-specter-energy" aria-hidden="true" />
      <button type="button" onClick={onClick} aria-label={ariaLabel} className="xk-home-specter pointer-events-auto absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#32FF8A]">
        <SafeImage src="/assets/identity/wisp-digital-specter-v1.webp" fallback="/images/articles/tech.svg" alt="" className="h-full w-full object-contain drop-shadow-[0_0_22px_rgba(50,255,138,.52)]" />
      </button>
    </div>
  )
}

function LeftLauncher({
  onWisp,
  label,
  itemLabels,
  wispLabel,
}: {
  onWisp: () => void
  label: string
  itemLabels: readonly string[]
  wispLabel: string
}) {
  return (
    <nav className="xk-home-launcher fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 rounded-[1.6rem] border border-white/10 bg-black/35 p-2 shadow-[0_0_30px_rgba(139,92,246,0.25)] backdrop-blur-xl md:flex" aria-label={label}>
      {sideItems.map((item, index) => (
        <Link
          key={item.to}
          to={item.to}
          aria-label={itemLabels[index]}
          aria-current={item.to === '/' ? 'page' : undefined}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/40 text-xl text-white/75 transition hover:border-purple-400 hover:text-purple-200 hover:shadow-[0_0_22px_rgba(139,92,246,0.65)]"
        >
          {item.icon}
        </Link>
      ))}

      <button
        type="button"
        onClick={onWisp}
        aria-label={wispLabel}
        className="grid h-12 w-12 place-items-center rounded-2xl border border-green-500/40 bg-green-500/10 text-xl text-green-300 transition hover:border-green-300 hover:shadow-[0_0_25px_rgba(34,197,94,0.8)]"
      >
        ✦
      </button>
    </nav>
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
