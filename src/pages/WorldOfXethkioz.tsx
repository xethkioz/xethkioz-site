import FantasyNavigation from '../components/FantasyNavigation'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { PUBLIC_ATMOSPHERE_ART } from '../lib/publicArtwork'
import './PremiumFantasyShell.css'
import { useLang } from '../lib/LangContext'
import './WorldOfXethkiozPortal.css'
import './WorldPortalCinematic.css'
import './ElementalRealmsMedia.css'

// Public promotional material only. Never import game data or internal lore here.
const atmosphereArt = PUBLIC_ATMOSPHERE_ART.src
const copy = {
  es: {
    description: 'Portal oficial de World of Xethkioz: Elemental Realms, un Action RPG 3D single player independiente en desarrollo con Unreal Engine 5.8.3.',
    home: 'Volver a XETHKIOZ', login: 'Iniciar sesión', language: 'Cambiar a inglés',
    status: 'ACTION RPG 3D · SINGLE PLAYER · UNREAL ENGINE 5.8.3', title: 'Atravesá Elemental Realms.',
    lead: 'Exploración, combate y descubrimiento en un mundo elemental que ya está tomando forma dentro de Unreal Engine.', elementalTagline: 'DOS FORMAS · UNA ESENCIA · INFINITAS VARIANTES', elements: ['Fuego', 'Hielo', 'Brote', 'Penumbra'],
    explore: 'Conocé la visión', follow: 'Seguí el desarrollo', caption: 'ILUSTRACIÓN PROMOCIONAL · NO ES GAMEPLAY',
    nav: ['Elemental Realms', 'Visión del fundador', 'Veyr', 'Desarrollo', 'Preguntas'],
    visionLabel: '01 / ELEMENTAL REALMS', visionTitle: 'Un mundo elemental.\nUna aventura construida paso a paso.',
    visionBody: 'World of Xethkioz: Elemental Realms es un Action RPG 3D single player independiente. La exploración, el movimiento, el combate y el descubrimiento se construyen sobre un mundo de fantasía elemental cuyo desarrollo avanza mapa por mapa.',
    principles: [['Exploración', 'Terreno, caminos, agua y zonas de descubrimiento forman parte del recorrido jugable.'], ['Movimiento', 'Caminar, correr, saltar, nadar y bucear ya fueron comprobados dentro del Mapa 1.'], ['Progresión', 'El proyecto avanza por etapas: primero cerrar y validar el Mapa 1; después abrir el camino al Mapa 2.']],
    worldLabel: '02 / VISIÓN DEL FUNDADOR', worldTitle: 'La visión detrás de World of Xethkioz: Elemental Realms.',
    worldBody: 'Una explicación directa sobre el propósito del proyecto, su identidad y la dirección general del universo, contada por su creador.',
    founderNote: 'PRESENTACIÓN OFICIAL · 05:04 · CON SUBTÍTULOS',
    guideLabel: '03 / UNA PRESENCIA', guideTitle: 'Veyr.',
    guideBody: 'Entre lo visible y lo desconocido, una presencia acompaña el recorrido. Veyr observa, guía y deja señales en los márgenes del mundo. No revela su origen, pero su huella aparece donde la energía despierta y donde la historia todavía guarda silencio.',
    guideAction: 'Abrir el chat de la comunidad', guideNote: 'La guía de la web. El misterio del juego permanece intacto.',
    devLabel: '04 / EL CAMINO', devTitle: 'Un mundo en construcción.',
    devBody: 'El estado público actual corresponde a Elemental Realms. El Mapa 1 continúa en desarrollo dentro de Unreal Engine 5.8.3 y todavía no está certificado al 100 %.',
    currentLabel: 'ESTADO ACTUAL · ELEMENTAL REALMS',
    alpha2Label: 'ALPHA 2 · ELEMENTAL REALMS',
    alpha2Title: 'El mundo toma forma.',
    alpha2Body: 'Esta captura de Alpha 2 muestra una etapa más reciente de Elemental Realms. Movimiento, entorno, escala y lectura visual siguen evolucionando; todavía puede incluir assets, animaciones, iluminación, comportamiento, balance e interfaz provisionales.',
    alpha2Meta: 'ALPHA 2 · 01:24 · CAPTURA DE DESARROLLO',
    alpha2Note: 'DESARROLLO EN CURSO · NO REPRESENTA LA CALIDAD FINAL · NO ES UNA VERSIÓN PÚBLICA',
    preAlphaLabel: 'PRE-ALPHA · REGISTRO DE DESARROLLO',
    preAlphaTitle: 'Antes de Elemental Realms.',
    preAlphaBody: 'Esta captura anterior queda como registro de evolución. Permite comparar el camino recorrido, pero no representa el estado actual del juego.',
    preAlphaMeta: 'PRE-ALPHA · 02:34 · REGISTRO HISTÓRICO',
    preAlphaNote: 'MATERIAL TEMPRANO · NO REPRESENTA LA CALIDAD ACTUAL NI FINAL',
    developmentArtLabel: 'ELEMENTAL REALMS · DIRECCIÓN VISUAL',
    developmentArtTitle: 'Dos formas. Una esencia. Infinitas variantes.',
    developmentArtBody: 'Una pieza promocional de desarrollo que resume la identidad elemental y la idea de variación del universo. Es arte de presentación; no es una captura de gameplay.',
    developmentArtAlt: 'Arte promocional de World of Xethkioz: Elemental Realms con criaturas elementales y variantes visuales',
    milestones: [['Mapa 1', 'El bosque de Elemental Realms está en desarrollo activo. La locomoción terrestre y acuática ya fue comprobada; todavía faltan pulido, contenido y validación global.'], ['Sistemas jugables', 'Caminar, correr, saltar, nadar y bucear funcionan en las pruebas actuales. Trepar sigue pendiente y las transiciones acuáticas todavía necesitan polish.'], ['Próxima etapa', 'Riberas, vegetación, combate, clima, noche y rendimiento siguen en revisión. El Mapa 2 permanece cerrado hasta completar y validar el Mapa 1.']],
    visualLabel: 'ARTE VISUAL PÚBLICO', visualTitle: 'Tres ecos de un mundo más grande.',
    visualCards: [['Naturaleza viva', 'Biomas orgánicos, energía latente y cristales que sugieren un territorio en expansión.'], ['Horizontes suspendidos', 'Altura, vacío, plataformas flotantes y una arquitectura visual pensada para el asombro.'], ['Umbral nocturno', 'Una lectura más oscura del mismo universo, con tensión, silencio y resonancias ocultas.']],
    support: 'Apoyar el proyecto', supportNote: 'El apoyo es voluntario. No es una preventa ni concede ventajas dentro del juego.',
    faqLabel: 'ANTES DE CRUZAR', faqTitle: 'Lo que podés saber hoy.',
    faq: [
      ['¿Qué es Elemental Realms?', 'Es la identidad actual del proyecto: World of Xethkioz: Elemental Realms, un Action RPG 3D single player independiente en desarrollo.'],
      ['¿En qué estado está el juego?', 'El Mapa 1 está jugable y en desarrollo activo dentro de Unreal Engine 5.8.3, pero todavía no está certificado al 100 %.'],
      ['¿Qué movimiento funciona hoy?', 'Caminar, correr, saltar, nadar y bucear fueron comprobados dentro del Mapa 1. Trepar todavía está pendiente.'],
      ['¿Ya se puede jugar?', 'No existe una descarga pública. Los accesos, pruebas o lanzamientos se anunciarán por los canales oficiales cuando corresponda.'],
      ['¿Estas imágenes son capturas del juego?', 'Las imágenes son ilustraciones promocionales. Los videos PRE-ALPHA y ALPHA 2 son capturas de desarrollo rotuladas por etapa; ninguno representa la calidad final de Elemental Realms.'],
      ['¿Dónde se publican los avances?', 'En esta web y en los perfiles oficiales enlazados al pie, con prioridad en Threads e Instagram.'],
      ['¿Por qué no se muestra todo el universo?', 'La historia, los personajes definitivos y los materiales de producción se mantienen reservados para cuidar el proyecto y la experiencia de descubrimiento.'],
    ],
    closing: 'El próximo capítulo empieza acá.', rights: 'Todos los derechos reservados.', privacy: 'Privacidad', contact: 'Contacto',
  },
  en: {
    description: 'Official portal for World of Xethkioz: Elemental Realms, an independent 3D single-player action RPG in development with Unreal Engine 5.8.3.',
    home: 'Back to XETHKIOZ', login: 'Sign in', language: 'Switch to Spanish',
    status: '3D ACTION RPG · SINGLE PLAYER · UNREAL ENGINE 5.8.3', title: 'Cross into Elemental Realms.',
    lead: 'Exploration, combat and discovery inside an elemental world now taking shape in Unreal Engine.', elementalTagline: 'TWO FORMS · ONE ESSENCE · ENDLESS VARIANTS', elements: ['Fire', 'Ice', 'Growth', 'Shadow'],
    explore: 'Watch the vision', follow: 'Follow development', caption: 'PROMOTIONAL ILLUSTRATION · NOT GAMEPLAY',
    nav: ['Elemental Realms', 'Founder vision', 'Veyr', 'Development', 'Questions'],
    visionLabel: '01 / ELEMENTAL REALMS', visionTitle: 'An elemental world.\nAn adventure built step by step.',
    visionBody: 'World of Xethkioz: Elemental Realms is an independent 3D single-player action RPG. Exploration, movement, combat and discovery are being built across an elemental fantasy world, one map at a time.',
    principles: [['Exploration', 'Terrain, paths, water and discovery zones are part of the playable journey.'], ['Movement', 'Walking, running, jumping, swimming and diving have already been verified inside Map 1.'], ['Progression', 'Development advances in stages: finish and validate Map 1 first, then open the way to Map 2.']],
    worldLabel: '02 / FOUNDER VISION', worldTitle: 'The vision behind World of Xethkioz: Elemental Realms.',
    worldBody: 'A direct explanation of the project, its identity and the overall direction of the universe, presented by its creator.',
    founderNote: 'OFFICIAL PRESENTATION · 05:04 · CAPTIONS INCLUDED',
    guideLabel: '03 / A PRESENCE', guideTitle: 'Veyr.',
    guideBody: 'Between the visible and the unknown, a presence accompanies the journey. Veyr watches, guides and leaves traces along the edges of the world. Her origin remains unrevealed, but her presence appears wherever energy awakens and where the story still keeps its silence.',
    guideAction: 'Open the community chat', guideNote: 'A guide on the website. The mystery of the game stays intact.',
    devLabel: '04 / THE JOURNEY', devTitle: 'A world in the making.',
    devBody: 'The current public development state corresponds to Elemental Realms. Map 1 remains under active development in Unreal Engine 5.8.3 and is not yet certified as 100% complete.',
    currentLabel: 'CURRENT STATE · ELEMENTAL REALMS',
    alpha2Label: 'ALPHA 2 · ELEMENTAL REALMS',
    alpha2Title: 'The world is taking shape.',
    alpha2Body: 'This Alpha 2 capture shows a more recent stage of Elemental Realms. Movement, environment, scale and visual readability continue to evolve; assets, animation, lighting, behavior, balance and UI may still be provisional.',
    alpha2Meta: 'ALPHA 2 · 01:24 · DEVELOPMENT CAPTURE',
    alpha2Note: 'WORK IN PROGRESS · NOT FINAL QUALITY · NOT A PUBLIC BUILD',
    preAlphaLabel: 'PRE-ALPHA · DEVELOPMENT RECORD',
    preAlphaTitle: 'Before Elemental Realms.',
    preAlphaBody: 'This earlier capture remains as a record of the project evolution. It helps show the progress, but does not represent the current state of the game.',
    preAlphaMeta: 'PRE-ALPHA · 02:34 · HISTORICAL CAPTURE',
    preAlphaNote: 'EARLY MATERIAL · NOT CURRENT OR FINAL QUALITY',
    developmentArtLabel: 'ELEMENTAL REALMS · VISUAL DIRECTION',
    developmentArtTitle: 'Two forms. One essence. Infinite variants.',
    developmentArtBody: 'A promotional development piece summarizing the elemental identity and the idea of variation across the universe. It is presentation art, not a gameplay screenshot.',
    developmentArtAlt: 'Promotional art for World of Xethkioz: Elemental Realms featuring elemental creatures and visual variants',
    milestones: [['Map 1', 'The Elemental Realms forest is in active development. Land and water locomotion has been verified; polish, content and full-map validation are still ongoing.'], ['Playable systems', 'Walking, running, jumping, swimming and diving work in current tests. Climbing remains pending and water transitions still need polish.'], ['Next stage', 'Shorelines, vegetation, combat, weather, night and performance remain under review. Map 2 stays closed until Map 1 is completed and validated.']],
    visualLabel: 'PUBLIC VISUAL ART', visualTitle: 'Three echoes of a much larger world.',
    visualCards: [['Living nature', 'Organic biomes, latent energy and crystals suggesting a territory still expanding.'], ['Suspended horizons', 'Height, open voids, floating platforms and visual architecture designed around a sense of wonder.'], ['Night threshold', 'A darker reading of the same universe, shaped by tension, silence and hidden resonances.']],
    support: 'Support the project', supportNote: 'Support is voluntary. It is not a preorder and grants no gameplay advantages.',
    faqLabel: 'BEFORE YOU CROSS', faqTitle: 'What we can share today.',
    faq: [
      ['What is Elemental Realms?', 'It is the current identity of the project: World of Xethkioz: Elemental Realms, an independent 3D single-player action RPG in development.'],
      ['What is the current development state?', 'Map 1 is playable and under active development in Unreal Engine 5.8.3, but it is not yet certified as 100% complete.'],
      ['Which movement systems work today?', 'Walking, running, jumping, swimming and diving have been verified inside Map 1. Climbing remains pending.'],
      ['Is the game available to play?', 'There is no public download. Access, tests or releases will be announced through official channels when appropriate.'],
      ['Are these images game screenshots?', 'The images are promotional illustrations. The PRE-ALPHA and ALPHA 2 videos are development captures labeled by stage; neither represents the final quality of Elemental Realms.'],
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
  return (
    <>
      <SEO title="World of Xethkioz: Elemental Realms" description={t.description} url="/world-of-xethkioz" image="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" />
      <main className="wox-portal" data-public-presentation="fantasy">
        <FantasyNavigation />
        <section className="wox-portal-hero" aria-labelledby="wox-portal-title">
          <picture className="woxp-hero-art" aria-hidden="true"><img src="/assets/xethkioz-world-panorama-2026.webp" alt="" width="1672" height="941" fetchPriority="high" decoding="async" /></picture>
          <div className="woxp-hero-shade" aria-hidden="true" />
          <div className="wox-portal-hero-copy">
            <p className="woxp-world-name">WORLD OF XETHKIOZ <strong>ELEMENTAL REALMS</strong><span aria-hidden="true">✦</span></p>
            <p className="woxp-kicker woxp-game-status">{t.status}</p>
            <div className="woxp-ornament" aria-hidden="true">◆</div>
            <h1 id="wox-portal-title">{t.title}</h1>
            <p className="woxp-lead">{t.lead}</p>
            <div className="woxp-elemental-lockup" aria-label={lang === 'es' ? 'Energías elementales' : 'Elemental energies'}><small>{t.elementalTagline}</small><div>{t.elements.map((element, index) => <span key={element} data-element={['fire','ice','growth','shadow'][index]}>{element}</span>)}</div></div>
            <div className="woxp-actions"><a className="woxp-button" href="#mundo">{t.explore}<span aria-hidden="true">↗</span></a><a className="woxp-text-link" href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">{t.follow} ↗</a></div>
          </div>
          <p className="woxp-art-caption">{t.caption}</p>
        </section>
        <nav className="wox-portal-anchor-nav" aria-label={lang === 'es' ? 'Capítulos del juego' : 'Game chapters'}>{anchors.map((anchor, index) => <a key={anchor} href={`#${anchor}`}><span aria-hidden="true">0{index + 1}</span>{t.nav[index]}</a>)}</nav>
        <section id="historia" className="wox-portal-story woxp-section">
          <div><p className="woxp-kicker">{t.visionLabel}</p><h2>{t.visionTitle}</h2></div>
          <div><p className="woxp-body">{t.visionBody}</p><div className="woxp-principles">{t.principles.map(([name, text], index) => <article key={name}><span aria-hidden="true">0{index + 1}</span><div><h3>{name}</h3><p>{text}</p></div></article>)}</div></div>
        </section>
        <section id="mundo" className="woxp-founder woxp-section">
          <header className="woxp-founder-head"><div><p className="woxp-kicker">{t.worldLabel}</p><h2>{t.worldTitle}</h2></div><p className="woxp-body">{t.worldBody}</p></header>
          <div className="woxp-founder-media">
            <video className="woxp-founder-video" controls playsInline preload="metadata" poster="/assets/world-of-xethkioz/founder/founder-vision-poster.webp" aria-label={lang === 'es' ? 'Video: visión del fundador de World of Xethkioz: Elemental Realms' : 'Video: World of Xethkioz: Elemental Realms founder vision'}>
              <source src="/assets/world-of-xethkioz/founder/founder-vision.mp4" type="video/mp4" />
            </video>
            <div className="woxp-founder-meta"><span>{t.founderNote}</span><span>WORLD OF XETHKIOZ · ELEMENTAL REALMS</span></div>
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
          <p className="woxp-kicker">{t.currentLabel}</p>
          <div className="woxp-development">{t.milestones.map(([name, text], index) => <article key={name} className="woxp-development-card"><span aria-hidden="true">0{index + 1}</span><i aria-hidden="true" /><div><h3>{name}</h3><p>{text}</p></div></article>)}</div>
          <div className="woxp-build-history" aria-label={lang === 'es' ? 'Evolución pública del desarrollo' : 'Public development evolution'}>
            <article className="woxp-alpha2-feature">
              <div className="woxp-build-copy"><p className="woxp-kicker">{t.alpha2Label}</p><h3>{t.alpha2Title}</h3><p className="woxp-body">{t.alpha2Body}</p><small className="woxp-note">{t.alpha2Note}</small></div>
              <div className="woxp-founder-media woxp-alpha2-media">
                <video className="woxp-founder-video woxp-alpha2-video" controls playsInline preload="metadata" poster="/assets/world-of-xethkioz/media/elemental-realms-alpha-2-poster.webp" aria-label={lang === 'es' ? 'Video: Alpha 2 de World of Xethkioz: Elemental Realms' : 'Video: World of Xethkioz: Elemental Realms Alpha 2'}>
                  <source src="/assets/world-of-xethkioz/media/elemental-realms-alpha-2.mp4" type="video/mp4" />
                </video>
                <div className="woxp-founder-meta"><span>{t.alpha2Meta}</span><span>ALPHA 2</span></div>
              </div>
            </article>
            <article className="woxp-prealpha-card">
              <div className="woxp-build-copy"><p className="woxp-kicker">{t.preAlphaLabel}</p><h3>{t.preAlphaTitle}</h3><p className="woxp-body">{t.preAlphaBody}</p><small className="woxp-note">{t.preAlphaNote}</small></div>
              <div className="woxp-founder-media">
                <video className="woxp-founder-video woxp-alpha-video woxp-prealpha-video" controls playsInline preload="metadata" poster="/assets/world-of-xethkioz/development/alpha-5-demo-poster.webp" aria-label={lang === 'es' ? 'Video: registro Pre-Alpha de World of Xethkioz: Elemental Realms' : 'Video: World of Xethkioz: Elemental Realms Pre-Alpha record'}>
                  <source src="/assets/world-of-xethkioz/development/alpha-5-demo.mp4" type="video/mp4" />
                </video>
                <div className="woxp-founder-meta"><span>{t.preAlphaMeta}</span><span>PRE-ALPHA</span></div>
              </div>
            </article>
          </div>
          <figure className="woxp-elemental-development">
            <img src="/assets/world-of-xethkioz/media/elemental-realms-development.webp" alt={t.developmentArtAlt} width="1920" height="1080" loading="lazy" decoding="async" />
            <figcaption><div><p className="woxp-kicker">{t.developmentArtLabel}</p><h3>{t.developmentArtTitle}</h3><p className="woxp-body">{t.developmentArtBody}</p></div><small>{t.caption}</small></figcaption>
          </figure>
          <div className="woxp-public-showcase" aria-labelledby="woxp-visual-title">
            <div className="woxp-public-showcase-title"><p className="woxp-kicker">{t.visualLabel}</p><h3 id="woxp-visual-title">{t.visualTitle}</h3></div>
            <div className="woxp-concept-gallery">
              {[0, 1, 2].map(index => <figure key={index} className={`woxp-concept-card woxp-concept-${index + 1}`}><img src={atmosphereArt} alt={t.visualCards[index][0]} width="800" height="800" loading="lazy" decoding="async" /><figcaption><small>0{index + 1}</small><div><strong>{t.visualCards[index][0]}</strong><span>{t.visualCards[index][1]}</span></div><i aria-hidden="true">↗</i></figcaption></figure>)}
            </div>
            <p className="woxp-showcase-note">{t.caption}</p>
          </div>
        </section>
        <section id="preguntas" className="woxp-faq woxp-section"><header><p className="woxp-kicker">{t.faqLabel}</p><h2>{t.faqTitle}</h2><p className="woxp-faq-aside">{lang === 'es' ? 'Algunas respuestas también forman parte del viaje.' : 'Some answers are part of the journey too.'}</p></header><div className="woxp-faq-list">{t.faq.map(([question, answer], index) => <details key={question}><summary><span className="woxp-faq-index" aria-hidden="true">0{index + 1}</span><strong>{question}</strong><span className="woxp-faq-toggle" aria-hidden="true">＋</span></summary><p>{answer}</p></details>)}</div></section>
        <section className="woxp-closing woxp-section"><picture className="woxp-closing-art" aria-hidden="true"><img src={atmosphereArt} alt="" width="800" height="800" loading="lazy" decoding="async" /></picture><div className="woxp-closing-shade" aria-hidden="true" /><div className="woxp-closing-copy"><span aria-hidden="true">✦</span><h2>{t.closing}</h2><div className="woxp-actions"><a className="woxp-button" href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">{t.follow} ↗</a><Link className="woxp-support-button" to={localizePath('/support')}>{t.support} ↗</Link></div><p className="woxp-note">{t.supportNote}</p></div></section>

      </main>
    </>
  )
}
