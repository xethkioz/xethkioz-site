import FantasyNavigation from '../components/FantasyNavigation'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import './PremiumFantasyShell.css'
import { useLang } from '../lib/LangContext'
import { SITE_VERSION, SOCIAL_LINKS } from '../lib/siteConfig'
import './WorldOfXethkiozLanding.css'
import './HomePremiumClosure.css'

function openNexusChat() {
  window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general' } }))
}

const socialNames = ['Threads', 'Instagram', 'TikTok Principal', 'YouTube']
const copy = {
  es: {
    seo: 'World of Xethkioz · Action RPG en desarrollo',
    description: 'Entrá al universo XETHKIOZ. Fantasía, videojuegos, tecnología y un Action RPG independiente en desarrollo.',
    status: 'ACTION RPG INDEPENDIENTE',
    soul: 'Más allá de lo conocido.',
    lead: 'Fantasía, acción y exploración. Descubrí la primera mirada a un Action RPG independiente en desarrollo.',
    explore: 'DESCUBRIR WORLD OF XETHKIOZ',
    follow: 'SEGUIR EN THREADS',
    ecosystemEyebrow: 'ECOSISTEMA XETHKIOZ',
    ecosystemTitle: 'Explorá más allá del juego.',
    ecosystemText: 'Noticias, guías, creación digital y proyectos que expanden el universo XETHKIOZ.',
    routes: [
      { code: '01', kicker: 'UNIVERSO PRINCIPAL', title: 'World of Xethkioz', description: 'La visión central del proyecto: fantasía, exploración, atmósfera y desarrollo independiente.', action: 'Explorar el juego', route: '/world-of-xethkioz', glyph: '✦', tone: 'world' },
      { code: '02', kicker: 'ACTUALIDAD', title: 'Noticias y miradas', description: 'Gaming, tecnología y cultura digital con contexto, fuentes y una mirada propia.', action: 'Ver noticias', route: '/news', glyph: '⌁', tone: 'news' },
      { code: '03', kicker: 'RECURSOS', title: 'Biblioteca gamer', description: 'Guías, builds y rutas para encontrar rápido qué jugar, mejorar y descubrir.', action: 'Explorar biblioteca', route: '/gaming', glyph: '◇', tone: 'gaming' },
      { code: '04', kicker: 'ESTUDIO DIGITAL', title: 'Tu proyecto en la web', description: 'Web, IA aplicada, contenido y soporte digital con identidad y alcance acordado.', action: 'Ver servicios', route: '/creacion-web', glyph: '◈', tone: 'studio' },
    ],
    supportEyebrow: 'PRODUCCIÓN INDEPENDIENTE',
    supportTitle: 'Ayudá a expandir este mundo.',
    supportText: 'Cada apoyo ayuda a sostener el desarrollo, mejorar la web, crear nuevo arte visual y seguir expandiendo World of Xethkioz.',
    supportNote: 'Es un apoyo voluntario al proyecto. No es una compra dentro del juego ni una preventa.',
    supportPillars: ['Desarrollo independiente', 'Arte y universo original', 'Comunidad y expansión'],
    supportPrimary: 'APOYAR EL PROYECTO',
    supportSecondary: 'SEGUIR NOVEDADES',
    footerBrand: 'Gaming, tecnología, noticias y creación digital con identidad propia.',
    footerBrandDetail: 'Universos en desarrollo, contenido original y proyectos impulsados por creatividad, tecnología e IA.',
    footerWorld: 'WORLD OF XETHKIOZ',
    footerEcosystem: 'ECOSISTEMA',
    footerCommunity: 'COMUNIDAD',
    footerRights: 'Todos los derechos reservados.',
    caption: 'ILUSTRACIÓN PROMOCIONAL · NO ES GAMEPLAY',
  },
  en: {
    seo: 'World of Xethkioz · Action RPG in development',
    description: 'Enter the XETHKIOZ universe. Fantasy, gaming, technology and an independent action RPG in development.',
    status: 'INDEPENDENT ACTION RPG',
    soul: 'Beyond the familiar.',
    lead: 'Fantasy, action and exploration. Discover a first look at an independent action RPG in development.',
    explore: 'DISCOVER WORLD OF XETHKIOZ',
    follow: 'FOLLOW ON THREADS',
    ecosystemEyebrow: 'XETHKIOZ ECOSYSTEM',
    ecosystemTitle: 'Explore beyond the game.',
    ecosystemText: 'News, guides, digital creation and projects expanding the XETHKIOZ universe.',
    routes: [
      { code: '01', kicker: 'MAIN UNIVERSE', title: 'World of Xethkioz', description: 'The core vision of the project: fantasy, exploration, atmosphere and independent development.', action: 'Explore the game', route: '/world-of-xethkioz', glyph: '✦', tone: 'world' },
      { code: '02', kicker: 'CURRENT', title: 'News and perspectives', description: 'Gaming, technology and digital culture with context, sources and an independent perspective.', action: 'Open news', route: '/news', glyph: '⌁', tone: 'news' },
      { code: '03', kicker: 'RESOURCES', title: 'Gaming library', description: 'Guides, builds and routes to quickly find what to play, improve and discover.', action: 'Explore library', route: '/gaming', glyph: '◇', tone: 'gaming' },
      { code: '04', kicker: 'DIGITAL STUDIO', title: 'Your project, online', description: 'Web, practical AI, content and digital support with identity and an agreed scope.', action: 'View services', route: '/creacion-web', glyph: '◈', tone: 'studio' },
    ],
    supportEyebrow: 'INDEPENDENT PRODUCTION',
    supportTitle: 'Help expand this world.',
    supportText: 'Every contribution helps sustain development, improve the website, create new visual art and keep expanding World of Xethkioz.',
    supportNote: 'Support is voluntary. It is not an in-game purchase or a preorder.',
    supportPillars: ['Independent development', 'Original art and universe', 'Community and expansion'],
    supportPrimary: 'SUPPORT THE PROJECT',
    supportSecondary: 'FOLLOW UPDATES',
    footerBrand: 'Gaming, technology, news and digital creation with an identity of its own.',
    footerBrandDetail: 'Worlds in development, original content and projects powered by creativity, technology and AI.',
    footerWorld: 'WORLD OF XETHKIOZ',
    footerEcosystem: 'ECOSYSTEM',
    footerCommunity: 'COMMUNITY',
    footerRights: 'All rights reserved.',
    caption: 'PROMOTIONAL ILLUSTRATION · NOT GAMEPLAY',
  },
} as const

export default function Home() {
  const { lang, localizePath } = useLang()
  const t = copy[lang]
  const socials = socialNames.flatMap(name => SOCIAL_LINKS.filter(item => item.name === name))
  const gamePath = localizePath('/world-of-xethkioz')
  const worldLinks = [
    [lang === 'es' ? 'La visión' : 'The vision', `${gamePath}#historia`],
    [lang === 'es' ? 'Atmósfera' : 'Atmosphere', `${gamePath}#mundo`],
    ['Veyr', `${gamePath}#convergencia`],
    [lang === 'es' ? 'Desarrollo' : 'Development', `${gamePath}#arte-visual`],
    [lang === 'es' ? 'Preguntas' : 'Questions', `${gamePath}#preguntas`],
  ] as const

  return (
    <>
      <SEO title={t.seo} description={t.description} url="/" image="/assets/world-of-xethkioz/world-of-xethkioz-logo.webp" />
      <main className="wox-home" data-public-presentation="fantasy">
        <FantasyNavigation />
        <section className="wox-hero" aria-labelledby="wox-title">
          <picture className="wox-bg" aria-hidden="true"><img src="/assets/portal-games-world-v3.webp" alt="" width="800" height="800" fetchPriority="high" decoding="async" /></picture>
          <h1 id="wox-title" className="sr-only">World of Xethkioz</h1>
          <div className="wox-hero-core">
            <picture className="wox-logo-wrap"><img src="/assets/world-of-xethkioz/world-of-xethkioz-logo.svg" alt="World of Xethkioz" className="wox-world-logo" width="1800" height="520" decoding="async" /></picture>
            <p className="wox-status">{t.status}</p>
            <div className="wox-fantasy-rule" aria-hidden="true">◆</div>
            <h2>{t.soul}</h2><p className="wox-lead">{t.lead}</p>
            <div className="wox-actions"><Link to={gamePath}>{t.explore} <span aria-hidden="true">↗</span></Link><a href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">{t.follow} <span aria-hidden="true">↗</span></a></div>
            <div className="wox-hero-specs" aria-label={lang === 'es' ? 'Presentación del proyecto' : 'Project overview'}><span>ACTION RPG</span><span>{lang === 'es' ? 'FANTASÍA' : 'FANTASY'}</span><span>{lang === 'es' ? 'EN DESARROLLO' : 'IN DEVELOPMENT'}</span></div>
          </div>
          <small className="wox-art-credit">{t.caption}</small>
        </section>

        <aside className="wox-utility-rail" aria-label={lang === 'es' ? 'Accesos rápidos' : 'Quick access'}><button type="button" onClick={openNexusChat}><span aria-hidden="true">◉</span><b>CHAT</b></button><Link to={localizePath('/green-node')}><span aria-hidden="true">◇</span><b>GREEN NODE</b></Link></aside>

        <div className="wox-content">
          <section className="wox-ecosystem" aria-labelledby="ecosystem-title">
            <header className="wox-ecosystem-head"><p>{t.ecosystemEyebrow}</p><h2 id="ecosystem-title">{t.ecosystemTitle}</h2><span>{t.ecosystemText}</span></header>
            <nav className="wox-ecosystem-grid" aria-label={lang === 'es' ? 'Explorar el ecosistema XETHKIOZ' : 'Explore the XETHKIOZ ecosystem'}>
              {t.routes.map(item => <Link key={item.code} className={`wox-ecosystem-card is-${item.tone}`} to={localizePath(item.route)}>
                <div className="wox-ecosystem-card-top"><small>{item.code}</small><span>{item.kicker}</span></div>
                <i aria-hidden="true">{item.glyph}</i>
                <h3>{item.title}</h3><p>{item.description}</p>
                <strong>{item.action}<span aria-hidden="true">↗</span></strong>
              </Link>)}
            </nav>
          </section>

          <section id="support" className="wox-support-premium" aria-labelledby="support-title">
            <div className="wox-support-copy"><p>{t.supportEyebrow}</p><h2 id="support-title">{t.supportTitle}</h2><span>{t.supportText}</span><small>{t.supportNote}</small></div>
            <div className="wox-support-side">
              <ul>{t.supportPillars.map((pillar, index) => <li key={pillar}><span aria-hidden="true">0{index + 1}</span>{pillar}</li>)}</ul>
              <div className="wox-support-actions"><Link to={localizePath('/support')}>{t.supportPrimary}<span aria-hidden="true">↗</span></Link><a href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">{t.supportSecondary}<span aria-hidden="true">↗</span></a></div>
            </div>
            <div className="wox-support-sigil" aria-hidden="true"><span>✦</span></div>
          </section>

          <footer className="wox-footer-premium">
            <div className="wox-footer-brand"><strong><span aria-hidden="true">✦</span>XETHKIOZ</strong><p>{t.footerBrand}</p><small>{t.footerBrandDetail}</small><div className="wox-footer-tech"><span>© {new Date().getFullYear()} XETHKIOZ · {SITE_VERSION}</span><span>UNITY 6 · URP · 3D/2.5D</span></div></div>
            <nav aria-label={t.footerWorld}><h2>{t.footerWorld}</h2>{worldLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
            <nav aria-label={t.footerEcosystem}><h2>{t.footerEcosystem}</h2><Link to={localizePath('/news')}>{lang === 'es' ? 'Noticias' : 'News'}</Link><Link to={localizePath('/gaming')}>{lang === 'es' ? 'Biblioteca gamer' : 'Gaming library'}</Link><a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer">ArgenCiencia ↗</a><a href="/mascotas/">{lang === 'es' ? 'Mascotas' : 'Pets'}</a><Link to={localizePath('/creacion-web')}>{lang === 'es' ? 'Creación web' : 'Web creation'}</Link><Link to={localizePath('/green-node')}>Green Node</Link></nav>
            <nav className="wox-footer-social" aria-label={t.footerCommunity}><h2>{t.footerCommunity}</h2><a href="https://www.xethkioz.com.ar">Web</a>{socials.map(item => <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer">{item.name === 'TikTok Principal' ? 'TikTok' : item.name}</a>)}<Link to={localizePath('/support')}>{lang === 'es' ? 'Apoyar proyecto' : 'Support project'}</Link><Link to={localizePath('/contact')}>{lang === 'es' ? 'Contacto' : 'Contact'}</Link></nav>
            <div className="wox-footer-bottom"><span>{t.footerRights}</span><span>{t.caption}</span><nav aria-label={lang === 'es' ? 'Enlaces legales' : 'Legal links'}><Link to={localizePath('/privacy')}>{lang === 'es' ? 'Privacidad' : 'Privacy'}</Link><Link to={localizePath('/contact')}>{lang === 'es' ? 'Contacto' : 'Contact'}</Link></nav></div>
          </footer>
        </div>
      </main>
    </>
  )
}
