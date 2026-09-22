import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import PortalKnowledgeBriefing from '../components/PortalKnowledgeBriefing'
import GamingGuideRotation from '../components/gaming/GamingGuideRotation'
import EditorialCrosslinks from '../components/EditorialCrosslinks'
import { useLang } from '../lib/LangContext'
import { SOCIAL_LINKS } from '../lib/siteConfig'
import './EditorialFantasy.css'

type GamingSection = 'overview' | 'guides' | 'news' | 'community'

const content = {
  es: {
    title: 'Biblioteca gamer',
    kicker: 'XETHKIOZ · EXPLORAR Y JUGAR',
    description: 'Guías, gaming y comunidad organizados en un espacio simple para encontrar rápido qué jugar, qué leer y dónde seguir XETHKIOZ.',
    heroAlt: 'Ilustración editorial de un portal de fantasía',
    heroActionsLabel: 'Accesos principales de Gaming',
    heroGuides: 'ABRIR GUÍAS',
    heroRadar: 'VER REDES',
    sectionLabel: 'Secciones de Gaming',
    sections: { overview: 'Inicio', guides: 'Guías', news: 'Radar', community: 'Comunidad' },
    start: {
      eyebrow: 'Biblioteca gamer // ELEGÍ UNA RUTA',
      title: 'Todo Gaming, sin perderte',
      description: 'Abrí solamente la sección que necesitás. El resto permanece fuera del camino.',
      cards: [
        { id: 'guides', code: 'BUILD', title: 'Guías y builds completas', detail: 'WoW, Diablo IV, FFXIV y PoE 2 por clase, equipo y rotación.', action: 'ABRIR GUÍAS', to: '/gaming/guides' },
        { id: 'news', code: 'RADAR', title: 'Radar XETHKIOZ', detail: 'Novedades, opinión y avances que compartimos primero en Threads e Instagram.', action: 'VER REDES', to: '' },
        { id: 'community', code: 'RED', title: 'Comunidad XETHKIOZ', detail: 'Seguinos, comentá y acompañá el crecimiento del proyecto desde nuestras redes oficiales.', action: 'SUMARME', to: '' },
      ],
    },
    socialRadar: {
      eyebrow: 'RADAR XETHKIOZ // SEÑAL ABIERTA',
      title: 'Lo nuevo aparece primero en nuestras redes.',
      text: 'Threads concentra noticias, opinión y avances rápidos. Instagram reúne las piezas visuales, publicaciones destacadas y momentos del universo XETHKIOZ.',
      note: 'Dos canales reales. Sin feeds duplicados ni secciones vacías.',
      threads: 'ABRIR THREADS',
      instagram: 'ABRIR INSTAGRAM',
    },
    socialCommunity: {
      eyebrow: 'COMUNIDAD // SEGUÍ EL PROYECTO',
      title: 'Acompañá XETHKIOZ mientras crece.',
      text: 'Si te interesan gaming, tecnología, IA y World of Xethkioz, seguinos y participá desde las redes oficiales. Cada interacción ayuda a que el proyecto llegue a más gente.',
      note: 'Seguinos, comentá y compartí lo que te interese.',
      threads: 'SEGUIR EN THREADS',
      instagram: 'SEGUIR EN INSTAGRAM',
    },
  },
  en: {
    title: 'Gaming library',
    kicker: 'XETHKIOZ · EXPLORE AND PLAY',
    description: 'Guides, gaming and community in a simpler space for finding what to play, what to read and where to follow XETHKIOZ.',
    heroAlt: 'Editorial illustration of a fantasy portal',
    heroActionsLabel: 'Primary Gaming shortcuts',
    heroGuides: 'OPEN GUIDES',
    heroRadar: 'OPEN SOCIALS',
    sectionLabel: 'Gaming sections',
    sections: { overview: 'Start', guides: 'Guides', news: 'Radar', community: 'Community' },
    start: {
      eyebrow: 'Gaming library // CHOOSE A ROUTE',
      title: 'All of Gaming, without getting lost',
      description: 'Open only the section you need. Everything else stays out of the way.',
      cards: [
        { id: 'guides', code: 'BUILD', title: 'Complete guides and builds', detail: 'WoW, Diablo IV, FFXIV and PoE 2 by class, gear and rotation.', action: 'OPEN GUIDES', to: '/gaming/guides' },
        { id: 'news', code: 'RADAR', title: 'XETHKIOZ radar', detail: 'Updates, opinions and project progress shared first on Threads and Instagram.', action: 'OPEN SOCIALS', to: '' },
        { id: 'community', code: 'NETWORK', title: 'XETHKIOZ community', detail: 'Follow, comment and be part of the project growth through our official channels.', action: 'JOIN IN', to: '' },
      ],
    },
    socialRadar: {
      eyebrow: 'XETHKIOZ RADAR // OPEN SIGNAL',
      title: 'New updates appear on our social channels first.',
      text: 'Threads carries fast news, opinions and project progress. Instagram brings together visual pieces, featured posts and moments from the XETHKIOZ universe.',
      note: 'Two real channels. No duplicate feeds or empty sections.',
      threads: 'OPEN THREADS',
      instagram: 'OPEN INSTAGRAM',
    },
    socialCommunity: {
      eyebrow: 'COMMUNITY // FOLLOW THE PROJECT',
      title: 'Grow with XETHKIOZ.',
      text: 'If gaming, technology, AI and World of Xethkioz are your thing, follow and join us on the official channels. Every interaction helps the project reach more people.',
      note: 'Follow, comment and share what matters to you.',
      threads: 'FOLLOW ON THREADS',
      instagram: 'FOLLOW ON INSTAGRAM',
    },
  },
} as const

export default function GamingHub() {
  const { lang, localizePath } = useLang()
  const t = content[lang]
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedSection = searchParams.get('section')
  const activeSection: GamingSection = requestedSection === 'guides' || requestedSection === 'news' || requestedSection === 'community' ? requestedSection : 'overview'
  const threadsUrl = SOCIAL_LINKS.find((item) => item.name === 'Threads')?.url ?? 'https://www.threads.com/@xethkioz'
  const instagramUrl = SOCIAL_LINKS.find((item) => item.name === 'Instagram')?.url ?? 'https://www.instagram.com/xethkioz'

  function selectSection(section: GamingSection) {
    const next = new URLSearchParams(searchParams)
    if (section === 'overview') next.delete('section')
    else next.set('section', section)
    setSearchParams(next, { replace: true })
  }

  return (
    <>
      <SEO title={t.title} description={t.description} url="/gaming" />
      <main className="xke-page xke-gaming xk-page xk-anime-page xk-anime-gaming px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="xk-anime-hero xk-gaming-hero">
            <SafeImage src="/assets/portal-games-world-v3.webp" fallback="/images/articles/gaming.svg" alt={t.heroAlt} className="xk-anime-hero-media" loading="eager" fetchPriority="high" />
            <div className="xk-anime-hero-shade" aria-hidden="true" />
            <div className="xk-anime-hero-content">
              <p className="xk-anime-kicker">{t.kicker}</p>
              <h1 className="xk-anime-title" data-text={t.title}>{t.title}</h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-200 md:text-base">{t.description}</p>
              <div className="xk-gaming-hero-actions" aria-label={t.heroActionsLabel}>
                <Link to={localizePath('/gaming/guides')}><span aria-hidden="true">⚔</span>{t.heroGuides}</Link>
                <button type="button" onClick={() => selectSection('news')}><span aria-hidden="true">⌁</span>{t.heroRadar}</button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="xk-hud-chip">{lang === 'es' ? 'PC · Consolas · Mobile' : 'PC · Consoles · Mobile'}</span>
                <span className="xk-hud-chip xk-hud-chip-violet">MMORPG / RPG / ESPORTS</span>
              </div>
            </div>
          </section>

          <nav className="xk-gaming-section-nav" aria-label={t.sectionLabel}>
            {(Object.keys(t.sections) as GamingSection[]).map((section) => (
              <button key={section} type="button" onClick={() => selectSection(section)} aria-pressed={activeSection === section}>
                <span>{section === 'overview' ? '◈' : section === 'guides' ? '⚔' : section === 'news' ? '⌁' : '◆'}</span>
                <b>{t.sections[section]}</b>
              </button>
            ))}
          </nav>

          {activeSection === 'overview' ? (
            <section className="xk-gaming-start" aria-labelledby="gaming-start-title">
              <header><small>{t.start.eyebrow}</small><h2 id="gaming-start-title">{t.start.title}</h2><p>{t.start.description}</p></header>
              <div>
                {t.start.cards.map((card) => card.id === 'guides'
                  ? <Link key={card.id} to={localizePath(card.to)}><span>{card.code}</span><b>{card.title}</b><small>{card.detail}</small><strong>{card.action} →</strong></Link>
                  : <button key={card.id} type="button" onClick={() => selectSection(card.id as GamingSection)}><span>{card.code}</span><b>{card.title}</b><small>{card.detail}</small><strong>{card.action} →</strong></button>)}
              </div>
            </section>
          ) : null}

          {activeSection === 'guides' ? <GamingGuideRotation lang={lang} /> : null}

          {activeSection === 'news' ? (
            <section className="xk-gaming-social-route is-radar" aria-labelledby="gaming-radar-social-title">
              <div className="xk-gaming-social-copy">
                <p>{t.socialRadar.eyebrow}</p>
                <h2 id="gaming-radar-social-title">{t.socialRadar.title}</h2>
                <span>{t.socialRadar.text}</span>
                <small>{t.socialRadar.note}</small>
              </div>
              <div className="xk-gaming-social-links">
                <a href={threadsUrl} target="_blank" rel="noreferrer noopener"><i aria-hidden="true">TH</i><span><b>Threads</b><small>@xethkioz</small></span><strong>{t.socialRadar.threads} ↗</strong></a>
                <a href={instagramUrl} target="_blank" rel="noreferrer noopener"><i aria-hidden="true">IG</i><span><b>Instagram</b><small>@xethkioz</small></span><strong>{t.socialRadar.instagram} ↗</strong></a>
              </div>
            </section>
          ) : null}

          {activeSection === 'community' ? (
            <section className="xk-gaming-social-route is-community" aria-labelledby="gaming-community-social-title">
              <div className="xk-gaming-social-copy">
                <p>{t.socialCommunity.eyebrow}</p>
                <h2 id="gaming-community-social-title">{t.socialCommunity.title}</h2>
                <span>{t.socialCommunity.text}</span>
                <small>{t.socialCommunity.note}</small>
              </div>
              <div className="xk-gaming-social-links">
                <a href={threadsUrl} target="_blank" rel="noreferrer noopener"><i aria-hidden="true">TH</i><span><b>Threads</b><small>@xethkioz</small></span><strong>{t.socialCommunity.threads} ↗</strong></a>
                <a href={instagramUrl} target="_blank" rel="noreferrer noopener"><i aria-hidden="true">IG</i><span><b>Instagram</b><small>@xethkioz</small></span><strong>{t.socialCommunity.instagram} ↗</strong></a>
              </div>
            </section>
          ) : null}

          {activeSection === 'overview' || activeSection === 'guides' ? <PortalKnowledgeBriefing sector="gaming" lang={lang} /> : null}
          {activeSection === 'overview' || activeSection === 'guides' ? <EditorialCrosslinks /> : null}
        </div>
      </main>
    </>
  )
}
