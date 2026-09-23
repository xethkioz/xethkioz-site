import FantasyNavigation from '../components/FantasyNavigation'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SEO from '../components/SEO'
import './PremiumFantasyShell.css'
import { useLang } from '../lib/LangContext'
import './WorldOfXethkiozLanding.css'
import './HomePremiumClosure.css'
import './HomeGateway.css'
import './HomePortalCinematic.css'

function openNexusChat() {
  window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general' } }))
}

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
    partnersEyebrow: 'COLABORACIONES / REFERIDOS',
    partnersTitle: 'Herramientas que impulsan el proyecto.',
    partnersNote: 'Enlaces promocionales y de referido. Si usás estos accesos, podés apoyar indirectamente a XETHKIOZ sin costo extra para vos.',
    tripoRole: 'IA 3D para crear modelos y prototipos',
    starlinkRole: 'Conectividad para crear, subir y trabajar',
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
    partnersEyebrow: 'COLLABORATIONS / REFERRALS',
    partnersTitle: 'Tools helping power the project.',
    partnersNote: 'Promotional and referral links. Using these links can indirectly support XETHKIOZ at no extra cost to you.',
    tripoRole: '3D AI for models and prototyping',
    starlinkRole: 'Connectivity for creating, uploading and working',
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
  const gamePath = localizePath('/world-of-xethkioz')
  const studioPath = localizePath('/creacion-web')

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
          </div>
          <div className="xk-world-signature"><img src="/assets/world-of-xethkioz/world-of-xethkioz-logo.png" alt="World of Xethkioz" width="1584" height="483" decoding="async" /><span>{t.worldNote}</span></div>
          <small className="wox-art-credit">{t.caption}</small>
        </section>

        <nav className="xk-hero-doors" aria-label={lang === 'es' ? 'Red de portales: elegí un proyecto' : 'Portal network: choose a project'}>
          <header className="xk-doors-heading"><p>{lang === 'es' ? 'TRES RUTAS / UN MISMO UNIVERSO CREATIVO' : 'THREE ROUTES / ONE CREATIVE UNIVERSE'}</p><h2>{lang === 'es' ? 'Elegí por dónde empezar.' : 'Choose where to begin.'}</h2></header>
          <div className="xk-doors-grid">
            <Link className="is-world" to={gamePath} onMouseEnter={() => setFeaturedPortal('world')} onFocus={() => setFeaturedPortal('world')}><span className="xk-door-index">01 <small>{lang === 'es' ? 'EL JUEGO' : 'THE GAME'}</small></span><span className="xk-door-copy"><strong>World of Xethkioz</strong><em>{lang === 'es' ? 'Entrar al universo' : 'Enter the world'}</em></span><span className="xk-door-arrow" aria-hidden="true">↗</span></Link>
            <a className="is-veyr" href="#veyr" onMouseEnter={() => setFeaturedPortal('veyr')} onFocus={() => setFeaturedPortal('veyr')} onMouseLeave={() => setFeaturedPortal('world')} onBlur={() => setFeaturedPortal('world')}><span className="xk-door-index">02 <small>{lang === 'es' ? 'IA LOCAL' : 'LOCAL AI'}</small></span><span className="xk-door-copy"><strong>VEYR</strong><em>{t.veyrLabel}</em></span><span className="xk-door-arrow" aria-hidden="true">↓</span></a>
            <Link className="is-studio" to={`${studioPath}#landing-esencial`} onMouseEnter={() => setFeaturedPortal('studio')} onFocus={() => setFeaturedPortal('studio')} onMouseLeave={() => setFeaturedPortal('world')} onBlur={() => setFeaturedPortal('world')}><span className="xk-door-index">03 <small>{lang === 'es' ? 'CREACIÓN' : 'CREATION'}</small></span><span className="xk-door-copy"><strong>XETHKIOZ Studio</strong><em>{t.studioLabel}</em></span><span className="xk-door-arrow" aria-hidden="true">↗</span></Link>
          </div>
        </nav>

        <aside className="wox-utility-rail" aria-label={lang === 'es' ? 'Accesos rápidos' : 'Quick access'}><button type="button" onClick={openNexusChat}><span aria-hidden="true">◉</span><b>CHAT</b></button><Link to={localizePath('/green-node')}><span aria-hidden="true">◇</span><b>GREEN NODE</b></Link></aside>

        <div className="wox-content">
          <section id="veyr" className="xk-veyr-story" aria-labelledby="xk-veyr-title">
            <div className="xk-veyr-copy"><p>{t.veyrEyebrow}</p><h2 id="xk-veyr-title">VEYR<span>IA LOCAL</span></h2><h3>{t.veyrTitle}</h3><p>{t.veyrText}</p><details><summary>{t.veyrDetails}<span aria-hidden="true">+</span></summary><ul>{t.veyrPoints.map(point => <li key={point}>{point}</li>)}</ul></details></div>
            <picture className="xk-veyr-art" aria-hidden="true"><img src="/assets/xethkioz-veyr-local-atmosphere-2026.webp" alt="" width="1916" height="821" loading="lazy" decoding="async" /></picture>
            <small className="xk-veyr-caption">{lang === 'es' ? 'VISUALIZACIÓN CONCEPTUAL · IA LOCAL EN DESARROLLO' : 'CONCEPT VISUALIZATION · LOCAL AI IN DEVELOPMENT'}</small>
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

          <aside className="xk-partner-corner" aria-labelledby="xk-partner-title">
            <div className="xk-partner-copy"><p>{t.partnersEyebrow}</p><h2 id="xk-partner-title">{t.partnersTitle}</h2><small>{t.partnersNote}</small></div>
            <div className="xk-partner-links">
              <a href="https://www.xethkioz.com.ar/tripo" target="_blank" rel="sponsored noopener noreferrer" aria-label={lang === 'es' ? 'Abrir promoción de Tripo' : 'Open Tripo promotion'}>
                <span className="xk-partner-brand is-tripo"><img src="/assets/partners/tripo-logo.png" alt="" width="48" height="48" loading="lazy" decoding="async" /><strong>Tripo</strong></span>
                <small>{t.tripoRole}</small><b aria-hidden="true">↗</b>
              </a>
              <a href="https://www.xethkioz.com.ar/starlink" target="_blank" rel="sponsored noopener noreferrer" aria-label={lang === 'es' ? 'Abrir referido de Starlink' : 'Open Starlink referral'}>
                <span className="xk-partner-brand is-starlink"><img src="/assets/partners/starlink-logo.png" alt="Starlink" width="612" height="101" loading="lazy" decoding="async" /></span>
                <small>{t.starlinkRole}</small><b aria-hidden="true">↗</b>
              </a>
            </div>
          </aside>

        </div>
      </main>
    </>
  )
}
