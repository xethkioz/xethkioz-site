import FantasyNavigation from '../components/FantasyNavigation'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { PUBLIC_ATMOSPHERE_ART } from '../lib/publicArtwork'
import './PremiumFantasyShell.css'
import { useLang } from '../lib/LangContext'
import { SITE_VERSION, SOCIAL_LINKS } from '../lib/siteConfig'
import './WorldOfXethkiozPortal.css'

// Public promotional material only. Never import game data or internal lore here.
const atmosphereArt = PUBLIC_ATMOSPHERE_ART.src
const socialNames = ['Threads', 'Instagram', 'TikTok Principal', 'YouTube']
const copy = {
  es: {
    description: 'El portal oficial de World of Xethkioz. Fantasía, atmósfera y novedades de un Action RPG independiente en desarrollo.',
    home: 'Volver a XETHKIOZ', login: 'Iniciar sesión', language: 'Cambiar a inglés',
    status: 'ACTION RPG INDEPENDIENTE', title: 'Atravesá el umbral.',
    lead: 'Hay mundos que se miran. Y otros que invitan a perderse. World of Xethkioz está tomando forma.',
    explore: 'Conocé la visión', follow: 'Seguí el desarrollo', caption: 'ILUSTRACIÓN PROMOCIONAL · NO ES GAMEPLAY',
    nav: ['La visión', 'Visión del fundador', 'Veyr', 'Desarrollo', 'Preguntas'],
    visionLabel: '01 / LA VISIÓN', visionTitle: 'La fantasía se vive.\nNo se explica toda de una vez.',
    visionBody: 'Un proyecto independiente que reúne imaginación, arte y tecnología. Este espacio es una primera mirada a su atmósfera; la historia y sus sorpresas se descubren a su debido tiempo.',
    principles: [['Imaginación', 'Una identidad propia, construida con intención.'], ['Atmósfera', 'Luz, arquitectura y silencio que invitan a mirar más allá.'], ['Descubrimiento', 'Compartir lo esencial. Reservar lo inesperado.']],
    worldLabel: '02 / VISIÓN DEL FUNDADOR', worldTitle: 'La visión detrás de World of Xethkioz.',
    worldBody: 'Una explicación directa sobre el propósito del proyecto, su identidad y la dirección general del universo, contada por su creador.',
    founderNote: 'VIDEO DEL CREADOR · 00:35 · CON SUBTÍTULOS',
    guideLabel: '03 / UNA PRESENCIA', guideTitle: 'Veyr.',
    guideBody: 'Entre lo visible y lo desconocido, una presencia acompaña el recorrido. Veyr observa, guía y deja señales en los márgenes del mundo. No revela su origen, pero su huella aparece donde la energía despierta y donde la historia todavía guarda silencio.',
    guideAction: 'Abrir el chat de la comunidad', guideNote: 'La guía de la web. El misterio del juego permanece intacto.',
    devLabel: '04 / EL CAMINO', devTitle: 'Un mundo en construcción.',
    devBody: 'El desarrollo sigue adelante. Los avances que se puedan compartir se publicarán en nuestros canales oficiales, cuando estén listos para presentarse.',
    milestones: [['Dirección artística', 'La identidad visual combina fantasía, misterio y una estética oscura con energía etérea. La dirección del proyecto prioriza atmósfera, símbolos y coherencia de mundo antes que la exposición total del contenido.'], ['Experiencia de juego', 'World of Xethkioz apunta a una experiencia Action RPG con exploración, progresión y descubrimiento. El objetivo es construir una aventura que combine combate, mundo vivo y capas narrativas en evolución.'], ['Novedades públicas', 'Los avances que puedan compartirse se publicarán en esta web y en los canales oficiales de XETHKIOZ, con prioridad en Threads e Instagram. Cada publicación mostrará sólo material seguro y preparado para difusión.']],
    visualLabel: 'ARTE VISUAL PÚBLICO', visualTitle: 'Tres ecos de un mundo más grande.',
    visualCards: [['Naturaleza viva', 'Biomas orgánicos, energía latente y cristales que sugieren un territorio en expansión.'], ['Horizontes suspendidos', 'Altura, vacío, plataformas flotantes y una arquitectura visual pensada para el asombro.'], ['Umbral nocturno', 'Una lectura más oscura del mismo universo, con tensión, silencio y resonancias ocultas.']],
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
    status: 'INDEPENDENT ACTION RPG', title: 'Cross the threshold.',
    lead: 'Some worlds are made to be seen. Others invite you to lose yourself. World of Xethkioz is taking shape.',
    explore: 'Watch the vision', follow: 'Follow development', caption: 'PROMOTIONAL ILLUSTRATION · NOT GAMEPLAY',
    nav: ['The vision', 'Founder vision', 'Veyr', 'Development', 'Questions'],
    visionLabel: '01 / THE VISION', visionTitle: 'Fantasy is an experience.\nNot everything is revealed at once.',
    visionBody: 'An independent project bringing imagination, art and technology together. This is a first look at its atmosphere; the story and its surprises will unfold in their own time.',
    principles: [['Imagination', 'A distinct identity, built with intention.'], ['Atmosphere', 'Light, architecture and silence inviting a closer look.'], ['Discovery', 'Share the essentials. Preserve the unexpected.']],
    worldLabel: '02 / FOUNDER VISION', worldTitle: 'The vision behind World of Xethkioz.',
    worldBody: 'A direct explanation of the project, its identity and the overall direction of the universe, presented by its creator.',
    founderNote: 'CREATOR VIDEO · 00:35 · CAPTIONS INCLUDED',
    guideLabel: '03 / A PRESENCE', guideTitle: 'Veyr.',
    guideBody: 'Between the visible and the unknown, a presence accompanies the journey. Veyr watches, guides and leaves traces along the edges of the world. Her origin remains unrevealed, but her presence appears wherever energy awakens and where the story still keeps its silence.',
    guideAction: 'Open the community chat', guideNote: 'A guide on the website. The mystery of the game stays intact.',
    devLabel: '04 / THE JOURNEY', devTitle: 'A world in the making.',
    devBody: 'Development continues. Updates suitable for sharing will appear on our official channels, when they are ready to be presented.',
    milestones: [['Art direction', 'The visual identity blends fantasy, mystery and a dark aesthetic with ethereal energy. The project prioritizes atmosphere, symbols and world coherence before exposing the full scope of its content.'], ['Game experience', 'World of Xethkioz is being shaped as an Action RPG built around exploration, progression and discovery, combining combat, a living world and evolving narrative layers.'], ['Public updates', 'Shareable progress will be published on this website and XETHKIOZ official channels, primarily Threads and Instagram. Every post will contain only material cleared for public release.']],
    visualLabel: 'PUBLIC VISUAL ART', visualTitle: 'Three echoes of a much larger world.',
    visualCards: [['Living nature', 'Organic biomes, latent energy and crystals suggesting a territory still expanding.'], ['Suspended horizons', 'Height, open voids, floating platforms and visual architecture designed around a sense of wonder.'], ['Night threshold', 'A darker reading of the same universe, shaped by tension, silence and hidden resonances.']],
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
  const { lang, localizePath } = useLang()
  const t = copy[lang]
  const socials = socialNames.flatMap(name => SOCIAL_LINKS.filter(item => item.name === name))
  return (
    <>
      <SEO title="World of Xethkioz" description={t.description} url="/world-of-xethkioz" image="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" />
      <main className="wox-portal" data-public-presentation="fantasy">
        <FantasyNavigation />
        <section className="wox-portal-hero" aria-labelledby="wox-portal-title">
          <picture className="woxp-hero-art" aria-hidden="true"><img src={atmosphereArt} alt="" width="800" height="800" fetchPriority="high" decoding="async" /></picture>
          <div className="woxp-hero-shade" aria-hidden="true" />
          <div className="wox-portal-hero-copy">
            <picture className="woxp-game-logo-wrap"><img src="/assets/world-of-xethkioz/world-of-xethkioz-logo.png" alt="World of Xethkioz" className="woxp-game-logo" width="1584" height="483" decoding="async" /></picture>
            <p className="woxp-kicker woxp-game-status">{t.status}</p>
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
        <section id="mundo" className="woxp-founder woxp-section">
          <header className="woxp-founder-head"><div><p className="woxp-kicker">{t.worldLabel}</p><h2>{t.worldTitle}</h2></div><p className="woxp-body">{t.worldBody}</p></header>
          <div className="woxp-founder-media">
            <video className="woxp-founder-video" controls playsInline preload="metadata" poster="/assets/world-of-xethkioz/founder/founder-vision-poster.webp" aria-label={lang === 'es' ? 'Video: visión del fundador de World of Xethkioz' : 'Video: World of Xethkioz founder vision'}>
              <source src="/assets/world-of-xethkioz/founder/founder-vision.mp4" type="video/mp4" />
            </video>
            <div className="woxp-founder-meta"><span>{t.founderNote}</span><span>WORLD OF XETHKIOZ</span></div>
          </div>
        </section>
        <section id="convergencia" className="wox-portal-cast woxp-section">
          <picture className="woxp-veyr-atmosphere" aria-hidden="true"><img src={atmosphereArt} alt="" width="800" height="800" loading="lazy" decoding="async" /></picture>
          <div className="woxp-veyr-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="woxp-veyr-character" aria-hidden="true"><span className="woxp-veyr-aura" /><img src="/assets/world-of-xethkioz/characters/veyr-good.webp" alt="" width="1086" height="1448" loading="lazy" decoding="async" /></div>
          <div className="woxp-veyr-copy"><p className="woxp-kicker">{t.guideLabel}</p><h2>{t.guideTitle}</h2><p className="woxp-body">{t.guideBody}</p><button className="woxp-text-link" type="button" onClick={() => window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general' } }))}>{t.guideAction} ↗</button><small className="woxp-note">{t.guideNote}</small></div>
        </section>
        <section id="arte-visual" className="wox-portal-art woxp-section">
          <header className="woxp-art-head"><div><p className="woxp-kicker">{t.devLabel}</p><h2>{t.devTitle}</h2></div><div><p className="woxp-body">{t.devBody}</p><a className="woxp-text-link" href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">Threads ↗</a></div></header>
          <div className="woxp-public-showcase" aria-labelledby="woxp-visual-title">
            <div className="woxp-public-showcase-title"><p className="woxp-kicker">{t.visualLabel}</p><h3 id="woxp-visual-title">{t.visualTitle}</h3></div>
            <div className="woxp-concept-gallery">
              {[0, 1, 2].map(index => <figure key={index} className={`woxp-concept-card woxp-concept-${index + 1}`}><img src={atmosphereArt} alt={t.visualCards[index][0]} width="800" height="800" loading="lazy" decoding="async" /><figcaption><small>0{index + 1}</small><div><strong>{t.visualCards[index][0]}</strong><span>{t.visualCards[index][1]}</span></div><i aria-hidden="true">↗</i></figcaption></figure>)}
            </div>
            <p className="woxp-showcase-note">{t.caption}</p>
          </div>
          <div className="woxp-development">{t.milestones.map(([name, text], index) => <article key={name} className="woxp-development-card"><span aria-hidden="true">0{index + 1}</span><i aria-hidden="true" /><div><h3>{name}</h3><p>{text}</p></div></article>)}</div>
        </section>
        <section id="preguntas" className="woxp-faq woxp-section"><header><p className="woxp-kicker">{t.faqLabel}</p><h2>{t.faqTitle}</h2><p className="woxp-faq-aside">{lang === 'es' ? 'Algunas respuestas también forman parte del viaje.' : 'Some answers are part of the journey too.'}</p></header><div className="woxp-faq-list">{t.faq.map(([question, answer], index) => <details key={question}><summary><span className="woxp-faq-index" aria-hidden="true">0{index + 1}</span><strong>{question}</strong><span className="woxp-faq-toggle" aria-hidden="true">＋</span></summary><p>{answer}</p></details>)}</div></section>
        <section className="woxp-closing woxp-section"><picture className="woxp-closing-art" aria-hidden="true"><img src={atmosphereArt} alt="" width="800" height="800" loading="lazy" decoding="async" /></picture><div className="woxp-closing-shade" aria-hidden="true" /><div className="woxp-closing-copy"><span aria-hidden="true">✦</span><h2>{t.closing}</h2><div className="woxp-actions"><a className="woxp-button" href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">{t.follow} ↗</a><Link className="woxp-support-button" to={localizePath('/support')}>{t.support} ↗</Link></div><p className="woxp-note">{t.supportNote}</p></div></section>
        <footer className="wox-portal-footer"><div className="woxp-footer-brand"><Link to={localizePath('/')} className="woxp-brand"><span aria-hidden="true">✦</span>XETHKIOZ</Link><p>© {new Date().getFullYear()} XETHKIOZ. {t.rights}</p><small>{SITE_VERSION} · Premium Fantasy</small></div><nav aria-label={lang === 'es' ? 'Redes oficiales y enlaces' : 'Official channels and links'}><a href="https://www.xethkioz.com.ar">WEB</a>{socials.map(item => <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer">{item.name === 'TikTok Principal' ? 'TikTok' : item.name}</a>)}<Link to={localizePath('/privacy')}>{t.privacy}</Link><Link to={localizePath('/contact')}>{t.contact}</Link></nav></footer>
      </main>
    </>
  )
}
