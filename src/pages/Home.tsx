import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import './PremiumFantasyShell.css'
import { useLang } from '../lib/LangContext'
import { SITE_VERSION, SOCIAL_LINKS } from '../lib/siteConfig'
import './WorldOfXethkiozLanding.css'

function openNexusChat() {
  window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general' } }))
}
const socialNames = ['Threads', 'Instagram', 'TikTok Principal', 'YouTube']
const copy = {
  es: {
    seo: 'World of Xethkioz · Action RPG en desarrollo',
    description: 'Entrá al universo XETHKIOZ. Fantasía, videojuegos, tecnología y un Action RPG independiente en desarrollo.',
    status: 'ACTION RPG INDEPENDIENTE · EN DESARROLLO',
    soul: 'Más allá de lo conocido.',
    lead: 'Un mundo por descubrir. Un proyecto que crece con cada paso. El viaje comienza acá.',
    explore: 'EXPLORAR EL JUEGO', follow: 'SEGUIR EN THREADS',
    supportEyebrow: 'PRODUCCIÓN INDEPENDIENTE',
    supportTitle: 'Sé parte de lo que viene.',
    supportText: 'Acompañá el desarrollo, compartí el proyecto o ayudá a hacerlo crecer. El apoyo es voluntario; no es una preventa ni compra ventajas dentro del juego.',
    routes: [['01', 'Noticias y miradas', 'Gaming, tecnología y cultura digital.', '/news'], ['02', 'La biblioteca gamer', 'Guías para tu próxima aventura.', '/gaming'], ['03', 'Tu proyecto, en la web', 'Diseño y desarrollo con identidad.', '/creacion-web']],
    caption: 'ILUSTRACIÓN PROMOCIONAL · NO ES GAMEPLAY',
  },
  en: {
    seo: 'World of Xethkioz · Action RPG in development',
    description: 'Enter the XETHKIOZ universe. Fantasy, gaming, technology and an independent action RPG in development.',
    status: 'INDEPENDENT ACTION RPG · IN DEVELOPMENT',
    soul: 'Beyond the familiar.',
    lead: 'A world to discover. A project growing with every step. The journey starts here.',
    explore: 'EXPLORE THE GAME', follow: 'FOLLOW ON THREADS',
    supportEyebrow: 'INDEPENDENT PRODUCTION',
    supportTitle: 'Be part of what comes next.',
    supportText: 'Follow development, share the project or help it grow. Support is voluntary; it is not a preorder and buys no gameplay advantages.',
    routes: [['01', 'News and perspectives', 'Gaming, technology and digital culture.', '/news'], ['02', 'The gaming library', 'Guides for your next adventure.', '/gaming'], ['03', 'Your project, online', 'Web design and development with identity.', '/creacion-web']],
    caption: 'PROMOTIONAL ILLUSTRATION · NOT GAMEPLAY',
  },
} as const

export default function Home() {
  const { lang, setLang, localizePath } = useLang()
  const t = copy[lang]
  const socials = socialNames.flatMap(name => SOCIAL_LINKS.filter(item => item.name === name))
  return (
    <>
      <SEO title={t.seo} description={t.description} url="/" image="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" />
      <main className="wox-home" data-public-presentation="fantasy">
        <header className="wox-topbar">
          <Link to={localizePath('/')} className="wox-home-brand"><span aria-hidden="true">✦</span> XETHKIOZ</Link>
          <nav className="wox-ecosystem-nav" aria-label={lang === 'es' ? 'Ecosistema XETHKIOZ' : 'XETHKIOZ ecosystem'}>
            <Link to={localizePath('/world-of-xethkioz')}>{lang === 'es' ? 'JUEGO' : 'GAME'}</Link>
            <a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer">ARGENCIENCIA <span>↗</span></a>
            <Link to={localizePath('/gaming')}>{lang === 'es' ? 'BIBLIOTECA DE JUEGOS' : 'GAME LIBRARY'}</Link>
            <a href="/mascotas/">{lang === 'es' ? 'MASCOTAS' : 'PETS'}</a>
            <Link to={localizePath('/nexus-city')}>NEXUS CITY</Link>
            <Link to={localizePath('/green-node')}>GREEN NODE</Link>
            <Link to={localizePath('/creacion-web')}>{lang === 'es' ? 'CREACIÓN WEB' : 'WEB CREATION'}</Link>
            <Link to={localizePath('/support')}>{lang === 'es' ? 'DONACIONES' : 'DONATIONS'}</Link>
          </nav>
          <details className="wox-mobile-ecosystem">
            <summary>XETHKIOZ <span aria-hidden="true">＋</span></summary>
            <nav aria-label={lang === 'es' ? 'Ecosistema XETHKIOZ móvil' : 'Mobile XETHKIOZ ecosystem'}>
              <Link to={localizePath('/world-of-xethkioz')}>{lang === 'es' ? 'JUEGO' : 'GAME'}</Link>
              <a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer">ARGENCIENCIA <span>↗</span></a>
              <Link to={localizePath('/gaming')}>{lang === 'es' ? 'BIBLIOTECA DE JUEGOS' : 'GAME LIBRARY'}</Link>
              <a href="/mascotas/">{lang === 'es' ? 'MASCOTAS' : 'PETS'}</a>
              <Link to={localizePath('/nexus-city')}>NEXUS CITY</Link>
              <Link to={localizePath('/green-node')}>GREEN NODE</Link>
              <Link to={localizePath('/creacion-web')}>{lang === 'es' ? 'CREACIÓN WEB' : 'WEB CREATION'}</Link>
              <Link to={localizePath('/support')}>{lang === 'es' ? 'DONACIONES' : 'DONATIONS'}</Link>
            </nav>
          </details>
          <div className="wox-tools">
            <Link to="/news" className="wox-news-link">{lang === 'es' ? 'NOTICIAS' : 'NEWS'}</Link>
            <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}>{lang === 'es' ? 'EN' : 'ES'}</button>
            <Link to="/login">{lang === 'es' ? 'INICIAR SESIÓN' : 'SIGN IN'}</Link>
          </div>
        </header>
        <section className="wox-hero" aria-labelledby="wox-title">
          <picture className="wox-bg" aria-hidden="true"><img src="/assets/portal-games-world-v3.webp" alt="" width="800" height="800" fetchPriority="high" decoding="async" /></picture>
          <h1 id="wox-title" className="sr-only">World of Xethkioz</h1>
          <div className="wox-hero-core">
            <p className="wox-status">{t.status}</p>
            <picture className="wox-logo-wrap"><img src="/assets/world-of-xethkioz/world-of-xethkioz-logo.svg" alt="World of Xethkioz" className="wox-world-logo" width="1800" height="560" decoding="async" /></picture>
            <div className="wox-fantasy-rule" aria-hidden="true">◆</div>
            <h2>{t.soul}</h2><p className="wox-lead">{t.lead}</p>
            <div className="wox-actions"><Link to={localizePath('/world-of-xethkioz')}>{t.explore} <span aria-hidden="true">↗</span></Link><a href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">{t.follow} <span aria-hidden="true">↗</span></a></div>
            <div className="wox-hero-specs" aria-label={lang === 'es' ? 'Presentación del proyecto' : 'Project overview'}><span>ACTION RPG</span><span>{lang === 'es' ? 'FANTASÍA' : 'FANTASY'}</span><span>{lang === 'es' ? 'EN DESARROLLO' : 'IN DEVELOPMENT'}</span></div>
          </div>
          <small className="wox-art-credit">{t.caption}</small>
        </section>
        <aside className="wox-utility-rail" aria-label={lang === 'es' ? 'Accesos rápidos' : 'Quick access'}><button type="button" onClick={openNexusChat}><span aria-hidden="true">◉</span><b>CHAT</b></button><Link to={localizePath('/green-node')}><span aria-hidden="true">◇</span><b>GREEN NODE</b></Link></aside>
        <div className="wox-content">
          <nav className="wox-pathways" aria-label={lang === 'es' ? 'Más de XETHKIOZ' : 'More from XETHKIOZ'}>{t.routes.map(([number, name, description, route]) => <Link key={number} to={localizePath(route)}><small>{number}</small><div><h2>{name}</h2><p>{description}</p></div><span aria-hidden="true">↗</span></Link>)}</nav>
          <section id="support" className="wox-support-card" aria-labelledby="support-title"><div><p>{t.supportEyebrow}</p><h2 id="support-title">{t.supportTitle}</h2><span>{t.supportText}</span></div><Link to={localizePath('/support')}>{lang === 'es' ? 'VER FORMAS DE APOYAR' : 'SEE SUPPORT OPTIONS'}<span aria-hidden="true">↗</span></Link></section>
          <footer className="wox-footer"><div><strong>XETHKIOZ</strong><span>© {new Date().getFullYear()} XETHKIOZ · {SITE_VERSION}</span><small>{lang === 'es' ? 'Todos los derechos reservados. Ilustraciones promocionales; no son gameplay.' : 'All rights reserved. Promotional illustrations; not gameplay.'}</small><small className="wox-tech-seals">UNITY 6 · URP · 3D/2.5D</small></div><nav aria-label={lang === 'es' ? 'Enlaces del sitio y redes' : 'Site and social links'}><a href="https://www.xethkioz.com.ar">WEB</a>{socials.map(item => <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer">{item.name === 'TikTok Principal' ? 'TikTok' : item.name}</a>)}<Link to={localizePath('/support')}>{lang === 'es' ? 'Apoyar proyecto' : 'Support project'}</Link><Link to={localizePath('/privacy')}>{lang === 'es' ? 'Privacidad' : 'Privacy'}</Link><Link to={localizePath('/contact')}>{lang === 'es' ? 'Contacto' : 'Contact'}</Link></nav></footer>
        </div>
      </main>
    </>
  )
}
