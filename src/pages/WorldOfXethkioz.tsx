import FantasyNavigation from '../components/FantasyNavigation'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import './PremiumFantasyShell.css'
import './WorldOfXethkiozHub.css'

const copy = {
  es: {
    description: 'World of Xethkioz es el universo creativo de XETHKIOZ. Elemental Realms es su proyecto jugable actual: un Action RPG 3D single player independiente en desarrollo.',
    eyebrow: 'UNIVERSO / WORLD OF XETHKIOZ',
    title: 'Un universo. Distintos mundos por descubrir.',
    lead: 'World of Xethkioz es el marco principal donde nacen nuestros mundos, personajes y proyectos. Elemental Realms es la primera gran puerta pública de ese universo.',
    projectLabel: 'PROYECTO ACTUAL',
    projectTitle: 'Elemental Realms',
    projectBody: 'Un Action RPG 3D single player centrado en exploración, movimiento, combate y descubrimiento. Su Mapa 1 continúa en desarrollo activo y se muestra públicamente por etapas.',
    projectMeta: ['ACTION RPG 3D', 'SINGLE PLAYER', 'UNREAL ENGINE 5.8.3', 'EN DESARROLLO'],
    projectAction: 'Entrar a Elemental Realms',
    projectStatus: 'ALPHA EN DESARROLLO · MATERIAL PÚBLICO SELECCIONADO',
    universeLabel: 'EL UNIVERSO',
    universeTitle: 'World of Xethkioz es más grande que un solo juego.',
    universeBody: 'Esta sección funciona como puerta de entrada al universo completo. Cada proyecto tendrá su propia identidad, etapa y espacio, sin mezclar información interna con lo que ya puede mostrarse al público.',
    pillars: [
      ['Universo', 'La identidad general que conecta los proyectos de World of Xethkioz.'],
      ['Proyecto', 'Elemental Realms es el desarrollo jugable activo que hoy ocupa el centro de la producción.'],
      ['Evolución', 'La web se irá ampliando cuando nuevos capítulos, mundos o experiencias estén listos para mostrarse.'],
    ],
    routeLabel: 'ALPHA 2 / RUTA ACTUAL',
    routeTitle: 'Mirá la Demo Alpha 2 y cruzá a Elemental Realms.',
    routeBody: 'La Demo Alpha 2 muestra una etapa reciente del desarrollo. Es material de trabajo y no representa la calidad final. Desde acá podés entrar al portal completo del juego, ver su visión, Veyr y el estado actual del proyecto.',
    alpha2Meta: 'ALPHA 2 · 01:24 · CAPTURA DE DESARROLLO',
    routeAction: 'Abrir proyecto',
    back: 'Volver a XETHKIOZ',
    follow: 'Seguir avances',
    caption: 'ARTE PROMOCIONAL · NO ES GAMEPLAY',
  },
  en: {
    description: 'World of Xethkioz is the creative universe of XETHKIOZ. Elemental Realms is its current playable project: an independent 3D single-player action RPG in development.',
    eyebrow: 'UNIVERSE / WORLD OF XETHKIOZ',
    title: 'One universe. Different worlds to discover.',
    lead: 'World of Xethkioz is the main framework where our worlds, characters and projects are created. Elemental Realms is the first major public gateway into that universe.',
    projectLabel: 'CURRENT PROJECT',
    projectTitle: 'Elemental Realms',
    projectBody: 'A 3D single-player action RPG focused on exploration, movement, combat and discovery. Map 1 remains under active development and is shown publicly in selected stages.',
    projectMeta: ['3D ACTION RPG', 'SINGLE PLAYER', 'UNREAL ENGINE 5.8.3', 'IN DEVELOPMENT'],
    projectAction: 'Enter Elemental Realms',
    projectStatus: 'ALPHA IN DEVELOPMENT · SELECTED PUBLIC MATERIAL',
    universeLabel: 'THE UNIVERSE',
    universeTitle: 'World of Xethkioz is bigger than a single game.',
    universeBody: 'This section is the entry point to the wider universe. Each project will have its own identity, development stage and space, without mixing internal production material with what is ready for the public.',
    pillars: [
      ['Universe', 'The main identity connecting World of Xethkioz projects.'],
      ['Project', 'Elemental Realms is the active playable development currently at the center of production.'],
      ['Evolution', 'The website will expand as new chapters, worlds or experiences become ready to reveal.'],
    ],
    routeLabel: 'ALPHA 2 / CURRENT ROUTE',
    routeTitle: 'Watch the Alpha 2 Demo and cross into Elemental Realms.',
    routeBody: 'The Alpha 2 Demo shows a recent development stage. It is work-in-progress material and does not represent final quality. From here you can enter the full game portal, explore its vision, Veyr and the current project state.',
    alpha2Meta: 'ALPHA 2 · 01:24 · DEVELOPMENT CAPTURE',
    routeAction: 'Open project',
    back: 'Back to XETHKIOZ',
    follow: 'Follow development',
    caption: 'PROMOTIONAL ART · NOT GAMEPLAY',
  },
} as const

export default function WorldOfXethkioz() {
  const { lang, localizePath } = useLang()
  const t = copy[lang]
  const elementalPath = localizePath('/world-of-xethkioz/elemental-realms')

  return (
    <>
      <SEO
        title="World of Xethkioz"
        description={t.description}
        url="/world-of-xethkioz"
        image="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp"
      />
      <main className="wox-universe-hub" data-public-presentation="fantasy">
        <FantasyNavigation />

        <section className="woxu-hero" aria-labelledby="woxu-title">
          <picture className="woxu-hero-art" aria-hidden="true">
            <img src="/assets/xethkioz-world-panorama-2026.webp" alt="" width="1672" height="941" fetchPriority="high" decoding="async" />
          </picture>
          <div className="woxu-hero-shade" aria-hidden="true" />
          <div className="woxu-hero-copy">
            <p className="woxu-eyebrow">{t.eyebrow}</p>
            <img className="woxu-logo" src="/assets/world-of-xethkioz/world-of-xethkioz-logo.png" alt="World of Xethkioz" width="1584" height="483" decoding="async" />
            <h1 id="woxu-title">{t.title}</h1>
            <p>{t.lead}</p>
            <div className="woxu-actions">
              <Link className="woxu-primary" to={elementalPath}>{t.projectAction}<span aria-hidden="true">↗</span></Link>
              <a className="woxu-secondary" href="#universo">{t.universeLabel}<span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <small className="woxu-caption">{t.caption}</small>
        </section>

        <nav className="woxu-path" aria-label={lang === 'es' ? 'Ruta del universo' : 'Universe route'}>
          <Link to={localizePath('/')}>XETHKIOZ</Link>
          <span aria-hidden="true">/</span>
          <strong>WORLD OF XETHKIOZ</strong>
          <span aria-hidden="true">/</span>
          <Link to={elementalPath}>ELEMENTAL REALMS</Link>
        </nav>

        <section className="woxu-project" aria-labelledby="woxu-project-title">
          <div className="woxu-project-art">
            <img src="/assets/world-of-xethkioz/media/elemental-realms-development.webp" alt="" width="1920" height="1080" loading="lazy" decoding="async" />
            <span>{t.projectStatus}</span>
          </div>
          <div className="woxu-project-copy">
            <p className="woxu-kicker">{t.projectLabel}</p>
            <p className="woxu-world-mark">WORLD OF XETHKIOZ <span>→</span></p>
            <h2 id="woxu-project-title">{t.projectTitle}</h2>
            <p>{t.projectBody}</p>
            <div className="woxu-meta">{t.projectMeta.map(item => <span key={item}>{item}</span>)}</div>
            <Link className="woxu-project-link" to={elementalPath}>{t.projectAction}<span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section id="universo" className="woxu-universe" aria-labelledby="woxu-universe-title">
          <header>
            <p className="woxu-kicker">{t.universeLabel}</p>
            <h2 id="woxu-universe-title">{t.universeTitle}</h2>
            <p>{t.universeBody}</p>
          </header>
          <div className="woxu-pillars">
            {t.pillars.map(([title, body], index) => (
              <article key={title}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="woxu-route" aria-labelledby="woxu-route-title">
          <div className="woxu-route-media">
            <video controls playsInline preload="metadata" poster="/assets/world-of-xethkioz/media/elemental-realms-alpha-2-poster.webp" aria-label={lang === 'es' ? 'Video: Demo Alpha 2 de World of Xethkioz: Elemental Realms' : 'Video: World of Xethkioz: Elemental Realms Alpha 2 Demo'}>
              <source src="/assets/world-of-xethkioz/media/elemental-realms-alpha-2.mp4" type="video/mp4" />
            </video>
            <span>{t.alpha2Meta}</span>
          </div>
          <div className="woxu-route-copy">
            <p className="woxu-kicker">{t.routeLabel}</p>
            <h2 id="woxu-route-title">{t.routeTitle}</h2>
            <p>{t.routeBody}</p>
            <div className="woxu-actions">
              <Link className="woxu-primary" to={elementalPath}>{t.routeAction}<span aria-hidden="true">↗</span></Link>
              <a className="woxu-secondary" href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">{t.follow}<span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <footer className="woxu-footer">
          <Link to={localizePath('/')}>← {t.back}</Link>
          <span>WORLD OF XETHKIOZ · XETHKIOZ</span>
        </footer>
      </main>
    </>
  )
}
