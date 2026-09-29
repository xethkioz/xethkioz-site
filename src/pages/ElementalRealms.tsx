import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import PortalNavigation from '../components/portals/PortalNavigation'
import PortalEffects from '../components/portals/PortalEffects'
import './PortalInteriors.css'

// Public presentation only. The game repository and internal documents stay private.
export default function ElementalRealms() {
  const { lang } = useLang()
  const es = lang === 'es'
  const { hash } = useLocation()
  const [historyOpen, setHistoryOpen] = useState(hash === '#mundo')
  useEffect(() => { if (hash === '#mundo') setHistoryOpen(true) }, [hash])
  const faq = es ? [
    ['¿Ya se puede jugar?', 'Todavía no hay una descarga pública. Las pruebas y futuros lanzamientos se anunciarán en los canales oficiales.'],
    ['¿Qué muestra la Alpha 2?', 'Una captura del desarrollo de Elemental Realms. Los sistemas, el arte y la interfaz todavía pueden cambiar; no representa la calidad final.'],
    ['¿Dónde sigo los avances?', 'En esta web, Threads e Instagram. Los enlaces oficiales están al pie de la página.'],
  ] : [
    ['Can I play it yet?', 'There is no public download yet. Tests and future releases will be announced through the official channels.'],
    ['What does Alpha 2 show?', 'A development capture of Elemental Realms. Systems, art and UI can still change; it does not represent final quality.'],
    ['Where can I follow development?', 'On this website, Threads and Instagram. Official links are at the bottom of the page.'],
  ]
  return <main className="portal-page portal-game wox-portal" data-public-presentation="fantasy" data-portal-theme="fire">
    <SEO title="World of Xethkioz: Elemental Realms" description={es ? 'Un Action RPG 3D single player independiente en desarrollo. Mirá la Demo Alpha 2 y conocé a Veyr y B-Rabbit.' : 'An independent single-player 3D action RPG in development. Watch the Alpha 2 Demo and meet Veyr and B-Rabbit.'} url="/world-of-xethkioz/elemental-realms" image="/assets/world-of-xethkioz/media/elemental-realms-alpha-2-poster.webp"/>
    <PortalNavigation/>
    <section className="portal-game__hero portal-content" aria-labelledby="game-title">
      <div className="portal-game__intro"><p className="portal-eyebrow">WORLD OF XETHKIOZ</p><h1 id="game-title">Elemental<br/>Realms<span aria-hidden="true">.</span></h1><p>{es ? 'Explorá. Descubrí. Dejá tu huella.' : 'Explore. Discover. Leave your mark.'}</p><div className="portal-game__tags"><span>ACTION RPG 3D</span><span>SINGLE PLAYER</span><span>{es ? 'EN DESARROLLO' : 'IN DEVELOPMENT'}</span></div><a className="portal-game__follow" href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">{es ? 'Seguí los avances' : 'Follow development'} ↗</a><PortalEffects tone="fire" count={7}/></div>
      <figure id="alpha-2" className="portal-game__demo">
        <div className="portal-game__demo-heading"><span>DEMO ALPHA 2</span><span>{es ? 'CAPTURA DE DESARROLLO' : 'DEVELOPMENT CAPTURE'}</span></div>
        <video className="woxp-alpha2-video" controls playsInline preload="metadata" poster="/assets/world-of-xethkioz/media/elemental-realms-alpha-2-poster.webp" aria-label={es ? 'Demo Alpha 2 de Elemental Realms' : 'Elemental Realms Alpha 2 Demo'}><source src="/assets/world-of-xethkioz/media/elemental-realms-alpha-2.mp4" type="video/mp4"/>{es ? 'Tu navegador no permite reproducir este video.' : 'Your browser cannot play this video.'}</video>
        <figcaption>{es ? 'Desarrollo en curso. No representa la calidad final ni es una versión pública.' : 'Work in progress. Not final quality. NOT A PUBLIC BUILD.'}</figcaption>
      </figure>
    </section>
    <div className="portal-content">
      <section id="historia" className="portal-game__vision portal-section"><h2>{es ? 'Un mundo por descubrir.' : 'A world to discover.'}</h2><p>{es ? 'Un proyecto independiente que construyo paso a paso. Fantasía elemental, exploración y combate en una aventura para un jugador. La Alpha 2 es una ventana al trabajo en marcha, no una promesa del resultado final.' : 'An independent project I am building step by step. Elemental fantasy, exploration and combat in a single-player adventure. Alpha 2 is a window into ongoing work, not a promise of the final result.'}</p></section>
      <section id="convergencia" className="portal-section portal-game__characters" aria-labelledby="characters-title">
        <header><p className="portal-eyebrow">{es ? 'DOS PERSONALIDADES. MUCHOS PROBLEMAS.' : 'TWO PERSONALITIES. PLENTY OF TROUBLE.'}</p><h2 id="characters-title">Veyr <span>&</span> B-Rabbit</h2></header>
        <div className="portal-character-grid">
          <article className="portal-character is-veyr"><div className="portal-character__portrait"><img src="/assets/portals/veyr-companion.webp" alt={es ? 'Ilustración promocional de Veyr, el compañero divertido' : 'Promotional illustration of Veyr, the playful companion'} width="520" height="520" loading="lazy" decoding="async"/></div><div className="portal-character__copy"><small>{es ? 'EL «BUENO»' : 'THE “GOOD” ONE'}</small><h3>Veyr</h3><p>{es ? 'Curioso, divertido y bastante caótico. Te acompaña, hace chistes, canta… y a veces se queda dormido. Ayudar no tiene por qué ser aburrido.' : 'Curious, playful and rather chaotic. He keeps you company, jokes, sings… and sometimes falls asleep. Helping does not have to be boring.'}</p></div></article>
          <article className="portal-character is-rabbit"><div className="portal-character__portrait"><img src="/assets/portals/b-rabbit-counterpart.webp" alt={es ? 'Ilustración promocional de B-Rabbit, el contrapunto travieso' : 'Promotional illustration of B-Rabbit, the mischievous counterpart'} width="520" height="520" loading="lazy" decoding="async"/></div><div className="portal-character__copy"><small>{es ? 'EL «MALO»' : 'THE “BAD” ONE'}</small><h3>B-Rabbit</h3><p>{es ? 'El contrapunto travieso. Canta, provoca y puede alterar temporalmente al jugador. Donde Veyr intenta ayudar, B-Rabbit encuentra una forma de complicarlo.' : 'The mischievous counterpart. He sings, provokes and can temporarily affect the player. Where Veyr tries to help, B-Rabbit finds a way to complicate things.'}</p></div></article>
        </div><p className="portal-art-note">{es ? 'ILUSTRACIONES PROMOCIONALES · NO ES GAMEPLAY' : 'PROMOTIONAL ILLUSTRATIONS · NOT GAMEPLAY'}</p>
      </section>
      <section id="arte-visual" className="portal-section portal-game__progress" aria-labelledby="progress-title"><div><p className="portal-eyebrow">{es ? 'ESTADO ACTUAL' : 'CURRENT STATE'}</p><h2 id="progress-title">{es ? 'Una aventura en construcción.' : 'An adventure in the making.'}</h2></div><div><p>{es ? 'Mapa 1 en desarrollo. Caminar, correr, saltar, nadar y bucear forman parte de las pruebas actuales. Trepar sigue pendiente; combate, clima y rendimiento continúan en revisión.' : 'Map 1 is in development. Walking, running, jumping, swimming and diving are part of current tests. Climbing is pending; combat, weather and performance remain under review.'}</p><details className="portal-game__history" open={historyOpen} onToggle={event => setHistoryOpen(event.currentTarget.open)}><summary>{es ? 'Visión del creador y archivo Pre-Alpha' : 'Creator vision and Pre-Alpha archive'} <span aria-hidden="true">+</span></summary>{historyOpen && <div className="portal-game__archive"><section id="mundo"><h3>{es ? 'Visión del fundador' : 'Founder vision'}</h3><video controls playsInline preload="none" poster="/assets/world-of-xethkioz/founder/founder-vision-poster.webp" aria-label={es ? 'Presentación del creador' : 'Creator presentation'}><source src="/assets/world-of-xethkioz/founder/founder-vision.mp4" type="video/mp4"/></video></section><section><h3>Pre-Alpha</h3><video controls playsInline preload="none" poster="/assets/world-of-xethkioz/development/alpha-5-demo-poster.webp" aria-label={es ? 'Archivo Pre-Alpha, no es el estado actual' : 'Pre-Alpha archive, not the current state'}><source src="/assets/world-of-xethkioz/development/alpha-5-demo.mp4" type="video/mp4"/></video><p>{es ? 'Registro histórico. No representa el estado actual.' : 'Historical record. Not the current state.'}</p></section></div>}</details></div></section>
      <section id="preguntas" className="portal-section portal-game__faq" aria-labelledby="faq-title"><h2 id="faq-title">{es ? 'Antes de entrar al mundo.' : 'Before entering the world.'}</h2><div>{faq.map(([q,a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
    </div>
  </main>
}
