import FantasyNavigation from '../components/FantasyNavigation'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SEO from '../components/SEO'
import './PremiumFantasyShell.css'
import { useLang } from '../lib/LangContext'
import { SITE_VERSION, SOCIAL_LINKS } from '../lib/siteConfig'
import './WorldOfXethkiozLanding.css'
import './HomePremiumClosure.css'
import './HomeGateway.css'
import './HomePortalCinematic.css'

function openNexusChat() {
  window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general' } }))
}

const socialNames = ['Threads', 'Instagram', 'TikTok Principal', 'YouTube']
const copy = {
  es: {
    seo: 'XETHKIOZ · Gaming, tecnología y creación',
    description: 'Noticias y guías con mirada propia, World of Xethkioz en desarrollo, VEYR IA Local y creación web para proyectos reales.',
    status: 'GAMING · TECNOLOGÍA · CREACIÓN',
    soul: 'Más allá del juego.',
    lead: 'Soy Alexis. Creo un mundo para jugar, una IA local para trabajar y webs para hacer crecer proyectos reales.',
    explore: 'Explorar el juego',
    follow: 'Conocer VEYR',
    worldNote: 'ACTION RPG INDEPENDIENTE · EN DESARROLLO',
    veyrLabel: 'IA local en desarrollo',
    studioLabel: 'Crear tu web',
    veyrEyebrow: '02 / UNA IA PARA TRABAJAR EN LOCAL',
    veyrTitle: 'Un espacio para pensar y crear.',
    veyrText: 'VEYR es un asistente local que estamos desarrollando para organizar investigación, proyectos y herramientas en la PC. Hoy es una herramienta de trabajo en evolución, no un servicio público listo para contratar.',
    veyrDetails: '¿Qué estamos probando?',
    veyrPoints: ['Investigación con fuentes y revisión de evidencia', 'Continuidad de proyectos y archivos de trabajo', 'Herramientas conectadas bajo control del usuario'],
    veyrPanelTitle: 'Crear con criterio.',
    veyrPanelNote: 'Desarrollo local · Acceso público aún no disponible',
    studioEyebrow: '03 / XETHKIOZ STUDIO',
    studioTitle: 'Tu negocio también puede tener su lugar en la web.',
    studioText: 'Landing Esencial: una página clara, pensada para celular y para recibir consultas. Definimos alcance, precio final en pesos y fechas antes de empezar.',
    studioPrice: 'USD 350 de referencia',
    studioAction: 'Ver Landing Esencial',
    studioNote: 'Consulta gratuita. Dominio, alojamiento e integraciones se presupuestan aparte.',
    ecosystemEyebrow: 'SEGUÍ EXPLORANDO',
    ecosystemTitle: 'Contenido para entrar a tu ritmo.',
    ecosystemText: 'Noticias, guías y un espacio para aprender. Cada destino tiene una tarea clara.',
    routes: [
      { code: '01', kicker: 'ACTUALIDAD', title: 'Noticias', description: 'Gaming y tecnología con contexto, fuentes y una mirada propia.', action: 'Leer noticias', route: '/news', glyph: '⌁', tone: 'news' },
      { code: '02', kicker: 'PARA JUGAR MEJOR', title: 'Biblioteca gamer', description: 'Guías, builds y referencias para elegir y avanzar.', action: 'Abrir biblioteca', route: '/gaming', glyph: '◇', tone: 'gaming' },
      { code: '03', kicker: 'APRENDER', title: 'Green Node', description: 'Programación, Linux y seguridad digital explicados paso a paso.', action: 'Explorar Green Node', route: '/green-node', glyph: '✦', tone: 'green' },
    ],
    supportEyebrow: 'PRODUCCIÓN INDEPENDIENTE',
    supportTitle: 'Ayudá a sostener lo que viene.',
    supportText: 'Tu apoyo voluntario ayuda a seguir creando contenido y desarrollando estos proyectos.',
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
    seo: 'XETHKIOZ · Gaming, technology and creation',
    description: 'Gaming news and guides, World of Xethkioz in development, VEYR local AI and web creation for real projects.',
    status: 'GAMING · TECHNOLOGY · CREATION',
    soul: 'Beyond the game.',
    lead: 'I’m Alexis. I’m building a world to play, a local AI to work with, and websites that help real projects grow.',
    explore: 'Explore the game',
    follow: 'Meet VEYR',
    worldNote: 'INDEPENDENT ACTION RPG · IN DEVELOPMENT',
    veyrLabel: 'Local AI in development',
    studioLabel: 'Build your website',
    veyrEyebrow: '02 / A LOCAL AI WORKSPACE',
    veyrTitle: 'A place to think and create.',
    veyrText: 'VEYR is a local assistant we are developing to organize research, projects and tools on a PC. It is currently an evolving work tool, not a public service ready to hire.',
    veyrDetails: 'What are we testing?',
    veyrPoints: ['Research with sources and evidence review', 'Continuity for projects and working files', 'Connected tools controlled by the user'],
    veyrPanelTitle: 'Create with judgment.',
    veyrPanelNote: 'Local development · Public access not yet available',
    studioEyebrow: '03 / XETHKIOZ STUDIO',
    studioTitle: 'Give your business a place of its own online.',
    studioText: 'Essential Landing Page: a clear page built for mobile and inquiries. We agree scope, the final local-currency quote and dates before starting.',
    studioPrice: 'USD 350 reference price',
    studioAction: 'View Essential Landing Page',
    studioNote: 'Free inquiry. Domain, hosting and integrations are quoted separately.',
    ecosystemEyebrow: 'KEEP EXPLORING',
    ecosystemTitle: 'Content at your own pace.',
    ecosystemText: 'News, guides and a place to learn. Each destination has a clear purpose.',
    routes: [
      { code: '01', kicker: 'CURRENT', title: 'News', description: 'Gaming and technology with context, sources and an independent perspective.', action: 'Read news', route: '/news', glyph: '⌁', tone: 'news' },
      { code: '02', kicker: 'PLAY BETTER', title: 'Gaming library', description: 'Guides, builds and references to help you choose and progress.', action: 'Open library', route: '/gaming', glyph: '◇', tone: 'gaming' },
      { code: '03', kicker: 'LEARN', title: 'Green Node', description: 'Programming, Linux and digital security explained step by step.', action: 'Explore Green Node', route: '/green-node', glyph: '✦', tone: 'green' },
    ],
    supportEyebrow: 'INDEPENDENT PRODUCTION',
    supportTitle: 'Help sustain what comes next.',
    supportText: 'Your voluntary support helps us keep creating content and developing these projects.',
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
  const [featuredPortal, setFeaturedPortal] = useState<'world' | 'veyr' | 'studio'>('world')
  const t = copy[lang]
  const socials = socialNames.flatMap(name => SOCIAL_LINKS.filter(item => item.name === name))
  const gamePath = localizePath('/world-of-xethkioz')
  const studioPath = localizePath('/creacion-web')
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
      <main className="wox-home xk-gateway" data-public-presentation="fantasy">
        <FantasyNavigation />
        <section className="wox-hero" aria-labelledby="wox-title" data-featured-portal={featuredPortal}>
          <picture className="wox-bg" aria-hidden="true"><img src="/assets/xethkioz-world-panorama-2026.webp" alt="" width="1672" height="941" fetchPriority="high" decoding="async" /></picture>
          <div className="wox-hero-core">
            <p className="wox-status">{t.status}</p>
            <h1 id="wox-title"><span>XETHKIOZ</span>{t.soul}</h1><p className="wox-lead">{t.lead}</p>
            <div className="wox-actions"><Link to={gamePath}>{t.explore} <span aria-hidden="true">↗</span></Link></div>
            <nav className="xk-hero-doors" aria-label={lang === 'es' ? 'Red de portales: elegí un proyecto' : 'Portal network: choose a project'}>
              <p>{lang === 'es' ? 'RED DE PORTALES / ELEGÍ POR DÓNDE EMPEZAR' : 'PORTAL NETWORK / CHOOSE WHERE TO BEGIN'}</p>
              <Link className="is-world" to={gamePath} onMouseEnter={() => setFeaturedPortal('world')} onFocus={() => setFeaturedPortal('world')}><span className="xk-portal-face" aria-hidden="true"><i>W</i></span><span className="xk-portal-name"><small>01 / {lang === 'es' ? 'EL JUEGO' : 'THE GAME'}</small>World of Xethkioz<em>{lang === 'es' ? 'Entrar al universo' : 'Enter the world'} <b aria-hidden="true">↗</b></em></span></Link>
              <a className="is-veyr" href="#veyr" onMouseEnter={() => setFeaturedPortal('veyr')} onFocus={() => setFeaturedPortal('veyr')} onMouseLeave={() => setFeaturedPortal('world')} onBlur={() => setFeaturedPortal('world')}><span className="xk-portal-face" aria-hidden="true"><i>V</i></span><span className="xk-portal-name"><small>02 / {lang === 'es' ? 'IA LOCAL' : 'LOCAL AI'}</small>VEYR<em>{t.veyrLabel} <b aria-hidden="true">↓</b></em></span></a>
              <Link className="is-studio" to={`${studioPath}#landing-esencial`} onMouseEnter={() => setFeaturedPortal('studio')} onFocus={() => setFeaturedPortal('studio')} onMouseLeave={() => setFeaturedPortal('world')} onBlur={() => setFeaturedPortal('world')}><span className="xk-portal-face" aria-hidden="true"><i>✦</i></span><span className="xk-portal-name"><small>03 / {lang === 'es' ? 'CREACIÓN' : 'CREATION'}</small>XETHKIOZ Studio<em>{t.studioLabel} <b aria-hidden="true">↗</b></em></span></Link>
            </nav>
          </div>
          <div className="xk-world-signature"><img src="/assets/world-of-xethkioz/world-of-xethkioz-logo.png" alt="World of Xethkioz" width="1584" height="483" decoding="async" /><span>{t.worldNote}</span></div>
          <small className="wox-art-credit">{t.caption}</small>
        </section>

        <aside className="wox-utility-rail" aria-label={lang === 'es' ? 'Accesos rápidos' : 'Quick access'}><button type="button" onClick={openNexusChat}><span aria-hidden="true">◉</span><b>CHAT</b></button><Link to={localizePath('/green-node')}><span aria-hidden="true">◇</span><b>GREEN NODE</b></Link></aside>

        <div className="wox-content">
          <section id="veyr" className="xk-veyr-story" aria-labelledby="xk-veyr-title">
            <div className="xk-veyr-copy"><p>{t.veyrEyebrow}</p><h2 id="xk-veyr-title">VEYR<span>IA LOCAL</span></h2><h3>{t.veyrTitle}</h3><p>{t.veyrText}</p><details><summary>{t.veyrDetails}<span aria-hidden="true">+</span></summary><ul>{t.veyrPoints.map(point => <li key={point}>{point}</li>)}</ul></details></div>
            <div className="xk-veyr-visual" aria-hidden="true"><div><small>VEYR / {lang === 'es' ? 'IA LOCAL' : 'LOCAL AI'}</small><strong>{t.veyrPanelTitle}</strong><span>{t.veyrPanelNote}</span></div><i>V</i></div>
          </section>

          <section className="xk-studio-story" aria-labelledby="xk-studio-title"><div className="xk-studio-copy"><p>{t.studioEyebrow}</p><h2 id="xk-studio-title">{t.studioTitle}</h2><span>{t.studioText}</span><Link to={`${studioPath}#landing-esencial`}>{t.studioAction}<b aria-hidden="true">↗</b></Link></div><div className="xk-studio-aside"><span>LANDING ESENCIAL</span><strong>{t.studioPrice}</strong><small>{t.studioNote}</small></div></section>

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

          <nav className="xk-network-links" aria-label={lang === 'es' ? 'Otros destinos de la red' : 'More network destinations'}><span>{lang === 'es' ? 'TAMBIÉN EN LA RED' : 'ALSO IN THE NETWORK'}</span><a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer"><strong>ArgenCiencia</strong><small>{lang === 'es' ? 'Ciencia para explorar' : 'Science to explore'}</small><b aria-hidden="true">↗</b></a><a href="/mascotas/"><strong>{lang === 'es' ? 'Patitas / Mascotas' : 'Pets / Mascotas'}</strong><small>{lang === 'es' ? 'Un espacio para ellos' : 'A place for them'}</small><b aria-hidden="true">↗</b></a></nav>

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
            <nav aria-label={t.footerEcosystem}><h2>{t.footerEcosystem}</h2><a href="#veyr">VEYR IA</a><Link to={localizePath('/news')}>{lang === 'es' ? 'Noticias' : 'News'}</Link><Link to={localizePath('/gaming')}>{lang === 'es' ? 'Biblioteca gamer' : 'Gaming library'}</Link><a href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer">ArgenCiencia ↗</a><a href="/mascotas/">{lang === 'es' ? 'Mascotas' : 'Pets'}</a><Link to={localizePath('/creacion-web')}>{lang === 'es' ? 'Creación web' : 'Web creation'}</Link><Link to={localizePath('/green-node')}>Green Node</Link></nav>
            <nav className="wox-footer-social" aria-label={t.footerCommunity}><h2>{t.footerCommunity}</h2><a href="https://www.xethkioz.com.ar">Web</a>{socials.map(item => <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer">{item.name === 'TikTok Principal' ? 'TikTok' : item.name}</a>)}<Link to={localizePath('/support')}>{lang === 'es' ? 'Apoyar proyecto' : 'Support project'}</Link><Link to={localizePath('/contact')}>{lang === 'es' ? 'Contacto' : 'Contact'}</Link></nav>
            <div className="wox-footer-bottom"><span>{t.footerRights}</span><span>{t.caption}</span><nav aria-label={lang === 'es' ? 'Enlaces legales' : 'Legal links'}><Link to={localizePath('/privacy')}>{lang === 'es' ? 'Privacidad' : 'Privacy'}</Link><Link to={localizePath('/contact')}>{lang === 'es' ? 'Contacto' : 'Contact'}</Link></nav></div>
          </footer>
        </div>
      </main>
    </>
  )
}
