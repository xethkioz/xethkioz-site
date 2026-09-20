import { useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import './PremiumFantasyShell.css'
import { useLang } from '../lib/LangContext'
import { SITE_VERSION, SOCIAL_LINKS } from '../lib/siteConfig'
import './WorldOfXethkiozPortal.css'

// Public promotional material only. Never import game data or internal lore here.
const atmosphereArt = '/assets/portal-games-world-v3.webp'
const socialNames = ['Threads', 'Instagram', 'TikTok Principal', 'YouTube']
const copy = {
  es: {
    description: 'El portal oficial de World of Xethkioz. Fantasía, atmósfera y novedades de un Action RPG independiente en desarrollo.',
    home: 'Volver a XETHKIOZ', login: 'Iniciar sesión', language: 'Cambiar a inglés',
    status: 'ACTION RPG INDEPENDIENTE · EN DESARROLLO', title: 'Atravesá el umbral.',
    lead: 'Hay mundos que se miran. Y otros que invitan a perderse. World of Xethkioz está tomando forma.',
    explore: 'Descubrí la atmósfera', follow: 'Seguí el desarrollo', caption: 'ILUSTRACIÓN PROMOCIONAL · NO ES GAMEPLAY',
    nav: ['La visión', 'Atmósfera', 'Veyr', 'Desarrollo', 'Preguntas'],
    visionLabel: '01 / LA VISIÓN', visionTitle: 'La fantasía se vive.\nNo se explica toda de una vez.',
    visionBody: 'Un proyecto independiente que reúne imaginación, arte y tecnología. Este espacio es una primera mirada a su atmósfera; la historia y sus sorpresas se descubren a su debido tiempo.',
    principles: [['Imaginación', 'Una identidad propia, construida con intención.'], ['Atmósfera', 'Luz, arquitectura y silencio que invitan a mirar más allá.'], ['Descubrimiento', 'Compartir lo esencial. Reservar lo inesperado.']],
    worldLabel: '02 / ESTUDIO DE ATMÓSFERA', worldTitle: 'Detenete. Mirá más cerca.',
    worldBody: 'Tres miradas sobre una ilustración del ecosistema XETHKIOZ. No representa un mapa ni el aspecto definitivo del juego.',
    tabs: ['Panorama', 'Arquitectura', 'Luz'],
    descriptions: ['Una escena para imaginar lo que puede existir más allá.', 'Formas, piedra y profundidad: detalles que construyen una atmósfera.', 'La luz violeta recorre el paisaje y cambia la forma de mirarlo.'],
    guideLabel: '03 / UNA PRESENCIA', guideTitle: 'Veyr.',
    guideBody: 'Entre lo visible y lo desconocido, una presencia acompaña el recorrido. Su historia todavía guarda silencio.',
    guideAction: 'Abrir el chat de la comunidad', guideNote: 'La guía de la web. El misterio del juego permanece intacto.',
    devLabel: '04 / EL CAMINO', devTitle: 'Un mundo en construcción.',
    devBody: 'El desarrollo sigue adelante. Los avances que se puedan compartir se publicarán en nuestros canales oficiales, cuando estén listos para presentarse.',
    milestones: [['Dirección artística', 'En desarrollo'], ['Experiencia de juego', 'En desarrollo'], ['Novedades públicas', 'En nuestros canales']],
    support: 'Apoyar el proyecto', supportNote: 'El apoyo es voluntario. No es una preventa ni concede ventajas dentro del juego.',
    faqLabel: 'ANTES DE CRUZAR', faqTitle: 'Lo que podés saber hoy.',
    faq: [
      ['¿Ya se puede jugar?', 'Esta página no ofrece una descarga pública. Los accesos, pruebas o lanzamientos se anunciarán por los canales oficiales cuando corresponda.'],
      ['¿Estas imágenes son capturas del juego?', 'No. Son ilustraciones promocionales del ecosistema XETHKIOZ, no gameplay ni una promesa del aspecto definitivo.'],
      ['¿Dónde se publican los avances?', 'En esta web y en los perfiles oficiales enlazados al pie, con prioridad en Threads e Instagram.'],
      ['¿Por qué no se muestra todo el universo?', 'La historia, los personajes definitivos y los materiales de producción se mantienen reservados para cuidar el proyecto y la experiencia de descubrimiento.'],
    ],
    closing: 'El próximo capítulo empieza acá.', rights: 'Todos los derechos reservados.', privacy: 'Privacidad', contact: 'Contacto',
  },
  en: {
    description: 'The official World of Xethkioz portal. Fantasy, atmosphere and updates from an independent action RPG in development.',
    home: 'Back to XETHKIOZ', login: 'Sign in', language: 'Switch to Spanish',
    status: 'INDEPENDENT ACTION RPG · IN DEVELOPMENT', title: 'Cross the threshold.',
    lead: 'Some worlds are made to be seen. Others invite you to lose yourself. World of Xethkioz is taking shape.',
    explore: 'Explore the atmosphere', follow: 'Follow development', caption: 'PROMOTIONAL ILLUSTRATION · NOT GAMEPLAY',
    nav: ['The vision', 'Atmosphere', 'Veyr', 'Development', 'Questions'],
    visionLabel: '01 / THE VISION', visionTitle: 'Fantasy is an experience.\nNot everything is revealed at once.',
    visionBody: 'An independent project bringing imagination, art and technology together. This is a first look at its atmosphere; the story and its surprises will unfold in their own time.',
    principles: [['Imagination', 'A distinct identity, built with intention.'], ['Atmosphere', 'Light, architecture and silence inviting a closer look.'], ['Discovery', 'Share the essentials. Preserve the unexpected.']],
    worldLabel: '02 / ATMOSPHERE STUDY', worldTitle: 'Pause. Look a little closer.',
    worldBody: 'Three perspectives on one illustration from the XETHKIOZ ecosystem. It is not a game map or a representation of the final game.',
    tabs: ['Panorama', 'Architecture', 'Light'],
    descriptions: ['A scene to imagine what might lie beyond.', 'Form, stone and depth: the details that create an atmosphere.', 'Violet light crosses the landscape and changes how we see it.'],
    guideLabel: '03 / A PRESENCE', guideTitle: 'Veyr.',
    guideBody: 'Between the visible and the unknown, a presence accompanies the journey. Her story remains unspoken.',
    guideAction: 'Open the community chat', guideNote: 'A guide on the website. The mystery of the game stays intact.',
    devLabel: '04 / THE JOURNEY', devTitle: 'A world in the making.',
    devBody: 'Development continues. Updates suitable for sharing will appear on our official channels, when they are ready to be presented.',
    milestones: [['Art direction', 'In development'], ['Game experience', 'In development'], ['Public updates', 'On our channels']],
    support: 'Support the project', supportNote: 'Support is voluntary. It is not a preorder and grants no gameplay advantages.',
    faqLabel: 'BEFORE YOU CROSS', faqTitle: 'What we can share today.',
    faq: [
      ['Is the game available to play?', 'This page does not offer a public download. Access, tests or launches will be announced through official channels when appropriate.'],
      ['Are these images game screenshots?', 'No. They are promotional illustrations from the XETHKIOZ ecosystem, not gameplay or a promise of the final visual appearance.'],
      ['Where are updates published?', 'On this website and the official profiles linked below, primarily Threads and Instagram.'],
      ['Why is the entire universe not shown?', 'The story, final characters and production materials remain private to protect the project and the experience of discovery.'],
    ],
    closing: 'The next chapter starts here.', rights: 'All rights reserved.', privacy: 'Privacy', contact: 'Contact',
  },
} as const
const anchors = ['historia', 'mundo', 'convergencia', 'arte-visual', 'preguntas']

export default function WorldOfXethkioz() {
  const { lang, setLang, localizePath } = useLang()
  const [view, setView] = useState(0)
  const t = copy[lang]
  const socials = socialNames.flatMap(name => SOCIAL_LINKS.filter(item => item.name === name))
  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowRight: (index + 1) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 }
    if (!(event.key in keys)) return
    event.preventDefault()
    const next = keys[event.key]
    setView(next)
    document.getElementById(`atmosphere-tab-${next}`)?.focus()
  }
  return (
    <>
      <SEO title="World of Xethkioz" description={t.description} url="/world-of-xethkioz" image="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" />
      <main className="wox-portal" data-public-presentation="fantasy">
        <header className="woxp-masthead">
          <Link to={localizePath('/')} aria-label={t.home} className="woxp-brand"><span aria-hidden="true">✦</span> XETHKIOZ</Link>
          <span className="woxp-masthead-center">WORLD OF XETHKIOZ</span>
          <div><button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={t.language}>{lang === 'es' ? 'EN' : 'ES'}</button><Link to="/login">{t.login}</Link></div>
        </header>
        <section className="wox-portal-hero" aria-labelledby="wox-portal-title">
          <picture className="woxp-hero-art" aria-hidden="true"><img src={atmosphereArt} alt="" width="800" height="800" fetchPriority="high" decoding="async" /></picture>
          <div className="woxp-hero-shade" aria-hidden="true" />
          <div className="wox-portal-hero-copy">
            <p className="woxp-kicker">{t.status}</p>
            <p className="woxp-game-name">WORLD OF <strong>XETHKIOZ</strong></p>
            <div className="woxp-ornament" aria-hidden="true">◆</div>
            <h1 id="wox-portal-title">{t.title}</h1>
            <p className="woxp-lead">{t.lead}</p>
            <div className="woxp-actions"><a className="woxp-button" href="#mundo">{t.explore}<span aria-hidden="true">↗</span></a><a className="woxp-text-link" href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">{t.follow} ↗</a></div>
          </div>
          <p className="woxp-art-caption">{t.caption}</p>
          <a className="woxp-scroll-cue" href="#historia" aria-label={t.nav[0]}>↓</a>
        </section>
        <nav className="wox-portal-anchor-nav" aria-label={lang === 'es' ? 'Capítulos del juego' : 'Game chapters'}>{anchors.map((anchor, index) => <a key={anchor} href={`#${anchor}`}><span aria-hidden="true">0{index + 1}</span>{t.nav[index]}</a>)}</nav>
        <section id="historia" className="wox-portal-story woxp-section">
          <div><p className="woxp-kicker">{t.visionLabel}</p><h2>{t.visionTitle}</h2></div>
          <div><p className="woxp-body">{t.visionBody}</p><div className="woxp-principles">{t.principles.map(([name, text], index) => <article key={name}><span aria-hidden="true">0{index + 1}</span><div><h3>{name}</h3><p>{text}</p></div></article>)}</div></div>
        </section>
        <section id="mundo" className="wox-portal-world woxp-section">
          <header><p className="woxp-kicker">{t.worldLabel}</p><h2>{t.worldTitle}</h2><p className="woxp-body">{t.worldBody}</p></header>
          <div className="woxp-atmosphere" data-view={view}>
            <div className="woxp-view-tabs" role="tablist" aria-label={lang === 'es' ? 'Detalle de la ilustración' : 'Illustration details'}>{t.tabs.map((label, index) => <button key={label} id={`atmosphere-tab-${index}`} role="tab" type="button" aria-selected={view === index} aria-controls="atmosphere-panel" tabIndex={view === index ? 0 : -1} onClick={() => setView(index)} onKeyDown={event => moveTab(event, index)}>{label}</button>)}</div>
            <div id="atmosphere-panel" role="tabpanel" aria-labelledby={`atmosphere-tab-${view}`} tabIndex={0}>
              <figure><img className={`woxp-atmosphere-image woxp-crop-${view}`} src={atmosphereArt} alt={t.descriptions[view]} width="800" height="800" loading="lazy" decoding="async" /><figcaption><small>{t.caption}</small><p>{t.descriptions[view]}</p></figcaption></figure>
            </div>
          </div>
        </section>
        <section id="convergencia" className="wox-portal-cast woxp-section">
          <div className="woxp-veyr-seal" aria-hidden="true"><span /><img src="/assets/world-of-xethkioz/web-art/veyr-green-sigil.svg" alt="" width="240" height="240" loading="lazy" decoding="async" /></div>
          <div><p className="woxp-kicker">{t.guideLabel}</p><h2>{t.guideTitle}</h2><p className="woxp-body">{t.guideBody}</p><button className="woxp-text-link" type="button" onClick={() => window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general' } }))}>{t.guideAction} ↗</button><small className="woxp-note">{t.guideNote}</small></div>
        </section>
        <section id="arte-visual" className="wox-portal-art woxp-section">
          <div><p className="woxp-kicker">{t.devLabel}</p><h2>{t.devTitle}</h2><p className="woxp-body">{t.devBody}</p><a className="woxp-text-link" href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">Threads ↗</a></div>
          <div className="woxp-development">{t.milestones.map(([name, state], index) => <div key={name}><span aria-hidden="true">0{index + 1}</span><h3>{name}</h3><small>{state}</small></div>)}</div>
        </section>
        <section id="preguntas" className="woxp-faq woxp-section"><header><p className="woxp-kicker">{t.faqLabel}</p><h2>{t.faqTitle}</h2></header><div>{t.faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">＋</span></summary><p>{answer}</p></details>)}</div></section>
        <section className="woxp-closing woxp-section"><span aria-hidden="true">✦</span><h2>{t.closing}</h2><div className="woxp-actions"><a className="woxp-button" href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">{t.follow} ↗</a><Link className="woxp-text-link" to={localizePath('/support')}>{t.support} ↗</Link></div><p className="woxp-note">{t.supportNote}</p></section>
        <footer className="wox-portal-footer"><div><Link to={localizePath('/')} className="woxp-brand">XETHKIOZ</Link><p>© {new Date().getFullYear()} XETHKIOZ. {t.rights}</p><small>{SITE_VERSION} · Premium Fantasy</small></div><nav aria-label={lang === 'es' ? 'Redes oficiales y enlaces' : 'Official channels and links'}><a href="https://www.xethkioz.com.ar">WEB</a>{socials.map(item => <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer">{item.name === 'TikTok Principal' ? 'TikTok' : item.name}</a>)}<Link to={localizePath('/privacy')}>{t.privacy}</Link><Link to={localizePath('/contact')}>{t.contact}</Link></nav></footer>
      </main>
    </>
  )
}
