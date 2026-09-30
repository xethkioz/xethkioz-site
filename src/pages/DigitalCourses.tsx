import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import PortalNavigation from '../components/portals/PortalNavigation'
import './PortalInteriors.css'
import './DigitalCourses.css'

export default function DigitalCourses() {
  const { lang, localizePath } = useLang()
  const es = lang === 'es'

  return <main className="portal-page portal-digital portal-courses" data-portal-theme="ice">
    <SEO
      title={es ? 'Cursos digitales' : 'Digital courses'}
      description={es ? 'Cursos de inteligencia artificial por USD 15 y Proyectos Base prearmados por USD 50. Contenido en preparación.' : 'Artificial intelligence courses for USD 15 and ready-made Base Projects for USD 50. Content in preparation.'}
      url="/digital/cursos"
      image="/assets/portals/ice-portal.webp"
    />
    <PortalNavigation />
    <div className="portal-content">
      <Link className="digital-courses__back" to={localizePath('/digital')}>{es ? 'Volver a Xethkioz Digital' : 'Back to Xethkioz Digital'}</Link>
      <header className="digital-courses__heading">
        <p className="portal-eyebrow">XETHKIOZ DIGITAL / {es ? 'APRENDIZAJE' : 'LEARNING'}</p>
        <h1>{es ? 'Cursos digitales' : 'Digital courses'}</h1>
        <p>{es ? 'Inteligencia artificial y proyectos prearmados.' : 'Artificial intelligence and ready-made projects.'}</p>
      </header>
      <div className="digital-courses__grid">
        <section className="digital-course" aria-labelledby="ai-course-title">
          <p className="portal-eyebrow">01 / {es ? 'CURSOS' : 'COURSES'}</p>
          <h2 id="ai-course-title">{es ? 'IA — Inteligencia Artificial' : 'AI — Artificial Intelligence'}</h2>
          <p className="digital-course__type">{es ? 'Cursos' : 'Courses'}</p>
          <p className="digital-course__price"><span>USD</span> 15</p>
          <p className="digital-course__status">{es ? 'Contenido en preparación' : 'Content in preparation'}</p>
        </section>
        <section className="digital-course" aria-labelledby="base-projects-title">
          <p className="portal-eyebrow">02 / {es ? 'PROYECTOS' : 'PROJECTS'}</p>
          <h2 id="base-projects-title">{es ? 'Proyectos Base' : 'Base Projects'}</h2>
          <p className="digital-course__type">{es ? 'Proyectos prearmados' : 'Ready-made projects'}</p>
          <p className="digital-course__price"><span>USD</span> 50</p>
          <p className="digital-course__status">{es ? 'Contenido en preparación' : 'Content in preparation'}</p>
        </section>
      </div>
    </div>
  </main>
}
