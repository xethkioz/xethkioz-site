import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SafeImage from '../components/SafeImage'
import SEO from '../components/SEO'
import { NexusDistrict } from '../components/NexusDistrict'
import { fallbackWebServiceOffers } from '../data/webServiceFallbacks'
import { useLang } from '../lib/LangContext'
import { useWisp } from '../providers/WispProvider'
import { useExperience } from '../lib/ExperienceContext'
import type { WebServiceOffer } from '../types/webServices'
import './HomeReborn.css'

type DataSavingConnection = {
  saveData?: boolean
  addEventListener?: (type: 'change', listener: () => void) => void
  removeEventListener?: (type: 'change', listener: () => void) => void
}

type IdleCapableWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

type PortalCard = {
  id: string
  code: string
  title: string
  subtitle: string
  action: string
  route: string
  external?: boolean
  world: string
  frame: string
  tone: string
  position: string
}

type DestinationCard = {
  id: 'nexus' | 'web' | 'green'
  code: string
  title: string
  text: string
  action: string
  route: string
  image: string
  tone: string
  position: string
}

const copy = {
  es: {
    kicker: 'XETHKIOZ // WORLD GATE',
    titleTop: 'EL GAMING ES',
    titleBottom: 'MI PASIÓN',
    intro: 'Una entrada viva hacia cuatro mundos principales. Gaming, ciencia, cultura fan y caos se sienten como portales reales, con identidad propia y sin convertir el Home en una grilla técnica.',
    seoDescription: 'Entrada inmersiva a la Red de Portales XETHKIOZ: gaming, ArgenCiencia, Universo COMICON, diversión, Nexus City, Green Node y creación web.',
    primaryCta: 'ELEGIR UN PORTAL',
    newsCta: 'ABRIR RADAR DE NOTICIAS',
    news: 'NOTICIAS',
    portalLabel: 'PORTALES PRINCIPALES // SEÑAL ESTABLE',
    liveSignal: '4 PORTALES PRINCIPALES ACTIVOS',
    nexusSignal: 'NEXUS CITY EN LÍNEA',
    safeSignal: 'SISTEMA SEGURO 24/7',
    secondaryEyebrow: 'OTRAS PUERTAS DEL NEXUS',
    secondaryTitle: 'La Red de Portales continúa más allá de la escena principal.',
    secondaryText: 'Destinos especiales para habitar, crear y descifrar XETHKIOZ sin competir con la escena principal.',
    webEyebrow: 'XETHKIOZ // CREACIÓN WEB',
    webTitle: 'Tu idea también puede convertirse en un mundo.',
    webText: 'Diseño y desarrollo de páginas con identidad propia, rendimiento real y una presentación que no parece una plantilla genérica.',
    webCta: 'EXPLORAR CREACIÓN WEB',
    featured: 'PROPUESTA DESTACADA',
    login: 'INICIAR SESIÓN',
    brandLabel: 'Ir al inicio de XETHKIOZ',
    switchLanguage: 'Cambiar a inglés',
    switchCode: 'EN',
    wispLabel: 'Abrir Green Node mediante Wisp',
    primary: [
      {
        id: 'science',
        code: 'XK-02',
        title: 'CIENCIA & TECH',
        subtitle: 'ArgenCiencia · Divulgación · Tecnología',
        action: 'ABRIR ARGENCIENCIA',
        route: 'https://argenciencia.com/',
        external: true,
        world: '/assets/portal-science-world-v3.webp',
        frame: '/assets/portal-science-clean-v1.webp',
        tone: '#22d3ee',
        position: '50% 47%',
      },
      {
        id: 'gaming',
        code: 'XK-01',
        title: 'GAMING',
        subtitle: 'Noticias · Guías · Comunidad · Mundos',
        action: 'ATRAVESAR PORTAL',
        route: '/gaming',
        world: '/assets/portal-games-world-v3.webp',
        frame: '/assets/portal-games-clean-v1.webp',
        tone: '#8b5cf6',
        position: '50% 52%',
      },
      {
        id: 'comicon',
        code: 'XK-04',
        title: 'UNIVERSO COMICON',
        subtitle: 'Marvel · DC · Anime · Cultura Fan',
        action: 'ABRIR MULTIVERSO',
        route: '/comicon',
        world: '/assets/xethkioz-light-shadow-comic-anime.webp',
        frame: '/assets/portal-games-clean-v1.webp',
        tone: '#ffe45c',
        position: '50% 42%',
      },
      {
        id: 'fun',
        code: 'XK-03',
        title: 'DIVERSIÓN',
        subtitle: 'Juego · Memes · Clips · Caos',
        action: 'JUGAR AHORA',
        route: '/fun',
        world: '/assets/portal-fun-world-v3.webp',
        frame: '/assets/portal-fun-chaos-v2.webp',
        tone: '#ff6b1a',
        position: '50% 53%',
      },
    ] as PortalCard[],
    destinations: [
      {
        id: 'nexus',
        code: 'XK-05 // CIUDAD VIVA',
        title: 'NEXUS CITY',
        text: 'Creá tu identidad, recorré salas y conectate con la comunidad.',
        action: 'ENTRAR A LA CIUDAD',
        route: '/nexus-city',
        image: '/assets/xethkioz-cover.webp',
        tone: '#a855f7',
        position: '50% 38%',
      },
      {
        id: 'web',
        code: 'XK-06 // ESTUDIO CREATIVO',
        title: 'CREACIÓN WEB',
        text: 'Proyectos digitales personalizados con estética, velocidad y estrategia.',
        action: 'VER EL ESTUDIO',
        route: '/creacion-web',
        image: '/web-services/creacion-web-og.png',
        tone: '#f59e0b',
        position: '50% 50%',
      },
      {
        id: 'green',
        code: 'XK-13 // SEÑAL INFECTADA',
        title: 'GREEN NODE',
        text: 'El Archivo Negro permanece oculto hasta que Wisp abra el acceso.',
        action: 'INTERCEPTAR SEÑAL',
        route: '/green-node',
        image: '/assets/identity/green-node-occult-malware-v1.webp',
        tone: '#32ff8a',
        position: '50% 40%',
      },
    ] as DestinationCard[],
    copyright: '© 2026 Alexis Ivan Diaz Sellanes Santajulia · XETHKIOZ Web v10.0',
  },
  en: {
    kicker: 'XETHKIOZ // WORLD GATE',
    titleTop: 'GAMING IS',
    titleBottom: 'MY PASSION',
    intro: 'A living entrance into four main worlds. Gaming, science, fan culture and chaos feel like real portals again, each with its own identity and without turning the Home into a technical grid.',
    seoDescription: 'An immersive entrance to the XETHKIOZ Portal Network: gaming, ArgenCiencia, COMICON Universe, fun, Nexus City, Green Node and web creation.',
    primaryCta: 'CHOOSE A PORTAL',
    newsCta: 'OPEN NEWS RADAR',
    news: 'NEWS',
    portalLabel: 'MAIN PORTALS // STABLE SIGNAL',
    liveSignal: '4 MAIN PORTALS ACTIVE',
    nexusSignal: 'NEXUS CITY ONLINE',
    safeSignal: 'SECURE SYSTEM 24/7',
    secondaryEyebrow: 'OTHER NEXUS GATES',
    secondaryTitle: 'The Portal Network continues beyond the main gates.',
    secondaryText: 'Special destinations to inhabit, create and decode XETHKIOZ without competing with the main scene.',
    webEyebrow: 'XETHKIOZ // WEB CREATION',
    webTitle: 'Your idea can become a world of its own.',
    webText: 'Web design and development with original identity, real performance and a presentation that never feels like a generic template.',
    webCta: 'EXPLORE WEB CREATION',
    featured: 'FEATURED PROPOSAL',
    login: 'SIGN IN',
    brandLabel: 'Go to XETHKIOZ home',
    switchLanguage: 'Switch to Spanish',
    switchCode: 'ES',
    wispLabel: 'Open Green Node through Wisp',
    primary: [
      {
        id: 'science',
        code: 'XK-02',
        title: 'SCIENCE & TECH',
        subtitle: 'ArgenCiencia · Outreach · Technology',
        action: 'OPEN ARGENCIENCIA',
        route: 'https://argenciencia.com/',
        external: true,
        world: '/assets/portal-science-world-v3.webp',
        frame: '/assets/portal-science-clean-v1.webp',
        tone: '#22d3ee',
        position: '50% 47%',
      },
      {
        id: 'gaming',
        code: 'XK-01',
        title: 'GAMING',
        subtitle: 'News · Guides · Community · Worlds',
        action: 'CROSS PORTAL',
        route: '/gaming',
        world: '/assets/portal-games-world-v3.webp',
        frame: '/assets/portal-games-clean-v1.webp',
        tone: '#8b5cf6',
        position: '50% 52%',
      },
      {
        id: 'comicon',
        code: 'XK-04',
        title: 'COMICON UNIVERSE',
        subtitle: 'Marvel · DC · Anime · Fan Culture',
        action: 'OPEN MULTIVERSE',
        route: '/comicon',
        world: '/assets/xethkioz-light-shadow-comic-anime.webp',
        frame: '/assets/portal-games-clean-v1.webp',
        tone: '#ffe45c',
        position: '50% 42%',
      },
      {
        id: 'fun',
        code: 'XK-03',
        title: 'FUN',
        subtitle: 'Game · Memes · Clips · Chaos',
        action: 'PLAY NOW',
        route: '/fun',
        world: '/assets/portal-fun-world-v3.webp',
        frame: '/assets/portal-fun-chaos-v2.webp',
        tone: '#ff6b1a',
        position: '50% 53%',
      },
    ] as PortalCard[],
    destinations: [
      {
        id: 'nexus',
        code: 'XK-05 // LIVING CITY',
        title: 'NEXUS CITY',
        text: 'Create your identity, explore rooms and connect with the community.',
        action: 'ENTER THE CITY',
        route: '/nexus-city',
        image: '/assets/xethkioz-cover.webp',
        tone: '#a855f7',
        position: '50% 38%',
      },
      {
        id: 'web',
        code: 'XK-06 // CREATIVE STUDIO',
        title: 'WEB CREATION',
        text: 'Custom digital projects built around aesthetics, speed and strategy.',
        action: 'OPEN THE STUDIO',
        route: '/creacion-web',
        image: '/web-services/creacion-web-og.png',
        tone: '#f59e0b',
        position: '50% 50%',
      },
      {
        id: 'green',
        code: 'XK-13 // INFECTED SIGNAL',
        title: 'GREEN NODE',
        text: 'The Black Archive stays hidden until Wisp opens the access point.',
        action: 'INTERCEPT SIGNAL',
        route: '/green-node',
        image: '/assets/identity/green-node-occult-malware-v1.webp',
        tone: '#32ff8a',
        position: '50% 40%',
      },
    ] as DestinationCard[],
    copyright: '© 2026 Alexis Ivan Diaz Sellanes Santajulia · XETHKIOZ Web v10.0',
  },
} as const

function scheduleIdleTask(task: () => void, timeout = 1200) {
  const idleWindow = window as IdleCapableWindow
  if (idleWindow.requestIdleCallback) {
    const handle = idleWindow.requestIdleCallback(task, { timeout })
    return () => idleWindow.cancelIdleCallback?.(handle)
  }

  const handle = window.setTimeout(task, timeout)
  return () => window.clearTimeout(handle)
}

function useAmbientVideoEnabled(graphicsMode: 'full' | 'lite') {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & { connection?: DataSavingConnection }).connection
    let armed = false
    let activated = false

    const removeInteractionListeners = () => {
      if (!armed) return
      window.removeEventListener('pointerdown', activate)
      window.removeEventListener('keydown', activate)
      window.removeEventListener('scroll', activate)
      armed = false
    }

    const activate = () => {
      if (graphicsMode === 'lite' || motionPreference.matches || connection?.saveData) return
      activated = true
      setEnabled(true)
      removeInteractionListeners()
    }

    const armInteractionListeners = () => {
      if (armed || activated) return
      window.addEventListener('pointerdown', activate, { passive: true })
      window.addEventListener('keydown', activate)
      window.addEventListener('scroll', activate, { passive: true })
      armed = true
    }

    const syncPreference = () => {
      if (graphicsMode === 'lite' || motionPreference.matches || connection?.saveData) {
        activated = false
        setEnabled(false)
        removeInteractionListeners()
        return
      }

      armInteractionListeners()
    }

    syncPreference()
    motionPreference.addEventListener('change', syncPreference)
    connection?.addEventListener?.('change', syncPreference)

    return () => {
      removeInteractionListeners()
      motionPreference.removeEventListener('change', syncPreference)
      connection?.removeEventListener?.('change', syncPreference)
    }
  }, [graphicsMode])

  return enabled
}

function useFeaturedWebService() {
  const [offer, setOffer] = useState<WebServiceOffer>(fallbackWebServiceOffers[0])

  useEffect(() => {
    let active = true
    const cancelScheduled = scheduleIdleTask(() => {
      import('../services/webServices')
        .then(({ loadFeaturedWebService }) => loadFeaturedWebService())
        .then((nextOffer) => {
          if (active) setOffer(nextOffer)
        })
        .catch(() => {
          // The static featured offer remains visible when the CMS is unavailable.
        })
    }, 1800)

    return () => {
      active = false
      cancelScheduled()
    }
  }, [])

  return offer
}

export default function Home() {
  const navigate = useNavigate()
  const { triggerGreenPortal } = useWisp()
  const { lang, setLang } = useLang()
  const { graphicsMode } = useExperience()
  const videoEnabled = useAmbientVideoEnabled(graphicsMode)
  const featuredWebOffer = useFeaturedWebService()
  const t = copy[lang]

  const openWisp = () => {
    triggerGreenPortal()
    window.setTimeout(() => navigate('/green-node'), 450)
  }

  const scrollToPortals = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('portals')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center',
    })
  }

  return (
    <>
      <SEO
        title="Gaming Is My Passion · World Gate"
        description={t.seoDescription}
        url="/"
        image="/assets/xethkioz-cover.png"
      />

      <main className="xk-rb-home">
        <div className="xk-rb-bg" aria-hidden="true" />
        {videoEnabled && (
          <video
            className="xk-rb-bg-video"
            src="/assets/bg-dragon-animated.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster="/assets/bg-dragon-poster.webp"
            aria-hidden="true"
          />
        )}
        <div className="xk-rb-shade" aria-hidden="true" />
        <div className="xk-rb-grid" aria-hidden="true" />

        <div className="xk-rb-shell">
          <header className="xk-rb-header">
            <Link to="/" className="xk-rb-brand" aria-label={t.brandLabel}>
              <span className="xk-rb-logo">XETHKIOZ</span>
              <small>Gaming Is My Passion · Beyond The Game</small>
            </Link>

            <nav className="xk-rb-nav" aria-label={lang === 'es' ? 'Navegación principal' : 'Primary navigation'}>
              <Link to="/gaming">{lang === 'es' ? 'Juegos' : 'Gaming'}</Link>
              <a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer">ArgenCiencia ↗</a>
              <Link to="/comicon">COMICON</Link>
              <Link to="/fun">{lang === 'es' ? 'Diversión' : 'Fun'}</Link>
              <Link to="/nexus-city">Nexus City</Link>
              <Link to="/creacion-web">{lang === 'es' ? 'Creación Web' : 'Web Creation'}</Link>
            </nav>

            <div className="xk-rb-tools">
              <Link to="/news">{t.news}</Link>
              <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={t.switchLanguage}>
                {t.switchCode}
              </button>
              <Link to="/login">{t.login}</Link>
            </div>
          </header>

          <section className="xk-rb-hero" aria-labelledby="home-title">
            <div className="xk-rb-copy">
              <p className="xk-rb-kicker">{t.kicker}</p>
              <h1 id="home-title">
                {t.titleTop}
                <span>{t.titleBottom}</span>
              </h1>
              <p>{t.intro}</p>

              <div className="xk-rb-copy-actions">
                <button type="button" onClick={scrollToPortals}>{t.primaryCta} <span aria-hidden="true">↓</span></button>
                <Link to="/news">{t.newsCta} <span aria-hidden="true">↗</span></Link>
              </div>

              <div className="xk-rb-signal" aria-label={lang === 'es' ? 'Estado del sistema' : 'System status'}>
                <span>{t.liveSignal}</span>
                <span>{t.nexusSignal}</span>
                <span>{t.safeSignal}</span>
              </div>
            </div>

            <div id="portals" className="xk-rb-theatre" aria-label={lang === 'es' ? 'Portales principales' : 'Main portals'}>
              <p className="xk-rb-theatre-label">{t.portalLabel}</p>
              <div className="xk-rb-portals">
                {t.primary.map((portal) => <PrimaryPortal key={portal.id} portal={portal} />)}
              </div>
            </div>

            <FloatingWisp ariaLabel={t.wispLabel} onClick={openWisp} />
          </section>

          <section className="xk-rb-secondary" aria-labelledby="secondary-gates-title">
            <div className="xk-rb-section-head">
              <div>
                <p>{t.secondaryEyebrow}</p>
                <h2 id="secondary-gates-title">{t.secondaryTitle}</h2>
              </div>
              <span>{t.secondaryText}</span>
            </div>

            <div className="xk-rb-destinations">
              {t.destinations.map((destination) => (
                <Destination key={destination.id} destination={destination} onOpenWisp={openWisp} />
              ))}
            </div>
          </section>

          <NexusDistrict tone="home" compact />

          <WebCreationFeature
            eyebrow={t.webEyebrow}
            title={t.webTitle}
            text={t.webText}
            cta={t.webCta}
            featuredLabel={t.featured}
            offer={featuredWebOffer}
          />

          <footer className="xk-rb-footer">
            <div>
              <span>{t.copyright}</span>
              <nav aria-label={lang === 'es' ? 'Enlaces legales' : 'Legal links'}>
                <Link to="/privacy">{lang === 'es' ? 'Privacidad' : 'Privacy'}</Link>
                <Link to="/editorial-policy">{lang === 'es' ? 'Política editorial' : 'Editorial policy'}</Link>
                <Link to="/contact">{lang === 'es' ? 'Contacto' : 'Contact'}</Link>
              </nav>
            </div>
          </footer>
        </div>
      </main>
    </>
  )
}

function PrimaryPortal({ portal }: { portal: PortalCard }) {
  const isFeatured = portal.id === 'gaming'
  const content: ReactNode = (
    <>
      <span className="xk-rb-gate">
        <span className="xk-rb-aura" aria-hidden="true" />
        <span className="xk-rb-window">
          <SafeImage
            src={portal.world}
            fallback="/images/articles/fallback.svg"
            alt=""
            loading="eager"
            fetchPriority={isFeatured ? 'high' : 'low'}
            style={{ objectPosition: portal.position }}
          />
        </span>
        <span className="xk-rb-frame" aria-hidden="true" />
        <span className="xk-rb-sparks" aria-hidden="true"><i /><i /><i /></span>
      </span>

      <span className="xk-rb-portal-copy">
        <small>{portal.code} // WORLD GATE</small>
        <strong>{portal.title}</strong>
        <span>{portal.subtitle}</span>
        <b>{portal.action} ↗</b>
      </span>
    </>
  )
  const commonProps = {
    className: 'xk-rb-portal',
    style: { '--tone': portal.tone } as CSSProperties,
    'aria-label': `${portal.action}: ${portal.title}`,
  }

  if (portal.external) return <a {...commonProps} href={portal.route} target="_blank" rel="noopener noreferrer">{content}</a>
  return <Link {...commonProps} to={portal.route}>{content}</Link>
}

function Destination({ destination, onOpenWisp }: { destination: DestinationCard; onOpenWisp: () => void }) {
  const content = (
    <>
      <SafeImage
        src={destination.image}
        fallback="/images/articles/fallback.svg"
        alt=""
        fetchPriority="low"
        style={{ objectPosition: destination.position }}
      />
      <span className="xk-rb-destination-copy">
        <small>{destination.code}</small>
        <strong>{destination.title}</strong>
        <span>{destination.text}</span>
        <b>{destination.action} ↗</b>
      </span>
    </>
  )

  const style = { '--tone': destination.tone } as CSSProperties

  if (destination.id === 'green') {
    return (
      <button type="button" className="xk-rb-destination" style={style} onClick={onOpenWisp}>
        {content}
      </button>
    )
  }

  return <Link to={destination.route} className="xk-rb-destination" style={style}>{content}</Link>
}

function FloatingWisp({ ariaLabel, onClick }: { ariaLabel: string; onClick: () => void }) {
  return (
    <div className="xk-rb-wisp">
      <button type="button" onClick={onClick} aria-label={ariaLabel}>
        <SafeImage
          src="/assets/identity/wisp-digital-specter-v1.webp"
          fallback="/images/articles/tech.svg"
          alt=""
          loading="lazy"
          fetchPriority="low"
        />
      </button>
    </div>
  )
}

function WebCreationFeature({
  eyebrow,
  title,
  text,
  cta,
  featuredLabel,
  offer,
}: {
  eyebrow: string
  title: string
  text: string
  cta: string
  featuredLabel: string
  offer: WebServiceOffer
}) {
  return (
    <section className="xk-rb-web" aria-labelledby="web-creation-home-title">
      <div className="xk-rb-web-copy">
        <small>{eyebrow}</small>
        <h2 id="web-creation-home-title">{title}</h2>
        <p>{text}</p>
        <Link to="/creacion-web">{cta} ↗</Link>
      </div>

      <Link to="/creacion-web" className="xk-rb-web-preview" aria-label={`${cta}: ${offer.title}`}>
        <SafeImage
          src={offer.image_url}
          fallback="/web-services/landing-premium.svg"
          alt={offer.image_alt || offer.title}
          fetchPriority="low"
        />
        <div>
          <span>
            <small>{featuredLabel}</small>
            <strong>{offer.title}</strong>
          </span>
          <b>{offer.price_label}</b>
        </div>
      </Link>
    </section>
  )
}
