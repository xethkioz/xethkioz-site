import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import PortalNavigation from '../components/portals/PortalNavigation'
import PortalEffects from '../components/portals/PortalEffects'
import './PortalInteriors.css'

export default function DigitalHub() {
  const { lang, localizePath } = useLang()
  const es = lang === 'es'
  return <main className="portal-page portal-digital" data-portal-theme="ice">
    <SEO title="Xethkioz Digital" description={es ? 'Creación web, VEYR Local / Remote y ArgenCiencia. Tecnología con identidad propia.' : 'Web creation, VEYR Local / Remote and ArgenCiencia. Technology with its own identity.'} url="/digital" image="/assets/portals/ice-portal.webp"/>
    <PortalNavigation/>
    <section className="portal-digital__hero portal-content" aria-labelledby="digital-title">
      <div><p className="portal-eyebrow">XETHKIOZ DIGITAL / {es ? 'PORTAL DE HIELO' : 'ICE PORTAL'}</p><h1 id="digital-title">{es ? 'Dale forma a tu próxima idea.' : 'Shape your next idea.'}</h1><p>{es ? 'Webs para proyectos reales. Una IA propia en desarrollo. Ciencia para seguir explorando.' : 'Websites for real projects. A local AI in development. Science to keep exploring.'}</p></div>
      <div className="portal-digital__art" aria-hidden="true"><img src="/assets/portals/ice-portal.webp" width="600" height="420" alt="" decoding="async"/><PortalEffects tone="ice"/></div>
    </section>
    <section className="portal-content portal-digital__services" aria-label={es ? 'Tecnología y proyectos' : 'Technology and projects'}>
      <article className="digital-service"><span className="digital-service__symbol" aria-hidden="true">⌘</span><p className="portal-eyebrow">01 / {es ? 'CREACIÓN' : 'CREATION'}</p><h2>{es ? 'Creación web' : 'Web creation'}</h2><p>{es ? 'Diseño, desarrollo y servicios digitales para tu negocio. Alcance y presupuesto acordados antes de empezar.' : 'Design, development and digital services for your business. Scope and budget agreed before work starts.'}</p><Link className="portal-button" to={localizePath('/creacion-web')}>{es ? 'Ver servicios y presupuestos' : 'Services and quotes'} <span aria-hidden="true">↗</span></Link></article>
      <article id="veyr" className="digital-service"><span className="digital-service__symbol" aria-hidden="true">◈</span><p className="portal-eyebrow">02 / {es ? 'PROYECTO PROPIO' : 'OUR PROJECT'}</p><h2>VEYR Local / Remote</h2><p>{es ? 'Un asistente para organizar trabajo e investigación en la PC, con herramientas remotas bajo autorización.' : 'An assistant for organizing work and research on a PC, with remote tools under user authorization.'}</p><details><summary>{es ? 'Conocer el proyecto' : 'About the project'}</summary><p>{es ? 'VEYR Local es el asistente de escritorio. VEYR Remote conecta herramientas a una sesión local autorizada. Ambos siguen en desarrollo; no hay una descarga pública ni se habilita acceso a tu equipo desde esta página.' : 'VEYR Local is the desktop assistant. VEYR Remote connects tools to an authorized local session. Both are in development; this page offers no public download and does not grant access to your device.'}</p><small>{es ? 'Proyecto de IA, separado de Veyr, el personaje del juego.' : 'AI project, separate from Veyr, the game character.'}</small></details></article>
      <article className="digital-service"><span className="digital-service__symbol" aria-hidden="true">✧</span><p className="portal-eyebrow">03 / {es ? 'CIENCIA' : 'SCIENCE'}</p><h2>ArgenCiencia</h2><p>{es ? 'Divulgación, informes y fuentes para mirar más allá de lo cotidiano.' : 'Science communication, reports and sources to look beyond the everyday.'}</p><a className="portal-button" href="https://argenciencia.com/" target="_blank" rel="noopener noreferrer">{es ? 'Abrir ArgenCiencia' : 'Open ArgenCiencia'} <span aria-hidden="true">↗</span></a><small>{es ? 'Sitio externo.' : 'External website.'}</small></article>
    </section>
  </main>
}
