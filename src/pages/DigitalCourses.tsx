import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import PortalNavigation from '../components/portals/PortalNavigation'
import DigitalCourseOrder, { type DigitalOrderItem } from '../components/services/DigitalCourseOrder'
import { DIGITAL_PRICES, DIGITAL_USD_TO_ARS, digitalArsLabel } from '../lib/digitalPrices'
import './PortalInteriors.css'
import './DigitalCourses.css'

export default function DigitalCourses() {
  const { lang, localizePath } = useLang()
  const es = lang === 'es'
  const aiCourses = es ? [
    { title: 'ChatGPT para el día a día', description: 'Aprendé a organizar ideas, escribir textos y resolver tareas cotidianas con ChatGPT.' },
    { title: 'ChatGPT para automatizar tareas', description: 'Identificá tareas repetitivas y diseñá flujos de trabajo que te ayuden a ahorrar tiempo.' },
    { title: 'Creá tu web con ChatGPT', description: 'Pasá de una idea a la base de tu sitio web, trabajando su estructura, contenido y primeras mejoras.' },
    { title: 'Multi-IA: herramientas que trabajan juntas', description: 'Explorá distintas herramientas de inteligencia artificial y cómo combinarlas según lo que necesite tu proyecto.' },
  ] : [
    { title: 'ChatGPT for everyday life', description: 'Learn to organize ideas, write texts and tackle everyday tasks with ChatGPT.' },
    { title: 'Automate tasks with ChatGPT', description: 'Identify repetitive tasks and design workflows that help you save time.' },
    { title: 'Build your website with ChatGPT', description: 'Take an idea to the foundation of your website, working on its structure, content and first improvements.' },
    { title: 'Multi-AI: tools working together', description: 'Explore different artificial intelligence tools and how to combine them to suit your project.' },
  ]
  const baseProjects = es ? [
    { title: 'PyME en Argentina: base para empezar', description: 'Una estructura inicial para ordenar tu idea de negocio, los recursos, las tareas y las necesidades de una pequeña empresa en Argentina.' },
    { title: 'Tu proyecto a medida: base esencial', description: 'Un punto de partida básico adaptado a tu idea, con objetivos, etapas y tareas para avanzar de forma ordenada.' },
    { title: 'Huerta en casa: del plan a la práctica', description: 'Una base para organizar tu huerta doméstica: espacio disponible, materiales y tareas de cuidado.' },
  ] : [
    { title: 'Small business in Argentina: a starting point', description: 'An initial structure to organize your business idea, resources, tasks and the needs of a small business in Argentina.' },
    { title: 'Your custom project: the essentials', description: 'A basic starting point tailored to your idea, with goals, stages and tasks to help you make steady progress.' },
    { title: 'A home garden: from plan to practice', description: 'A foundation for organizing your home vegetable garden: available space, materials and care tasks.' },
  ]
  const orderItems: DigitalOrderItem[] = [
    ...aiCourses.map((course, index) => ({ id: `course-${index + 1}`, title: course.title, kind: 'course' as const })),
    ...baseProjects.map((project, index) => ({ id: `project-${index + 1}`, title: project.title, kind: 'project' as const, custom: index === 1 })),
  ]

  return <main className="portal-page portal-digital portal-courses" data-portal-theme="ice">
    <SEO
      title={es ? 'Cursos digitales' : 'Digital courses'}
      description={es ? `Cursos de IA: USD ${DIGITAL_PRICES.course.usd} por curso. Proyectos base para presentar: USD ${DIGITAL_PRICES.project.usd} por proyecto. Entrega después del pago y contacto por correo.` : `AI courses: USD ${DIGITAL_PRICES.course.usd} per course. Project foundations to present: USD ${DIGITAL_PRICES.project.usd} per project. Delivery after payment and email contact.`}
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
          <p className="digital-course__price"><span>USD</span> {DIGITAL_PRICES.course.usd}</p>
          <p className="digital-course__local-price">{digitalArsLabel(DIGITAL_PRICES.course.ars, lang)} · {es ? 'por cada curso' : 'per course'}</p>
          <p className="digital-course__intro">{es ? 'Nivel básico a intermedio. Cuatro propuestas para llevar la IA a la práctica.' : 'Beginner to intermediate level. Four courses to put AI into practice.'}</p>
          <ol className="digital-course__list">
            {aiCourses.map(course => <li key={course.title}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </li>)}
          </ol>
          <p className="digital-course__status">{es ? 'Entrega dentro de las 24 horas, después de confirmar el pago y el contacto por correo electrónico.' : 'Delivery within 24 hours after payment and email contact are confirmed.'}</p>
          <a className="portal-button digital-course__request" href="#course-order">{es ? 'Solicitar un curso' : 'Request a course'}</a>
        </section>
        <section className="digital-course" aria-labelledby="base-projects-title">
          <p className="portal-eyebrow">02 / {es ? 'PROYECTOS' : 'PROJECTS'}</p>
          <h2 id="base-projects-title">{es ? 'Proyectos Base' : 'Base Projects'}</h2>
          <p className="digital-course__type">{es ? 'Proyectos base para presentar' : 'Project foundations to present'}</p>
          <p className="digital-course__price"><span>USD</span> {DIGITAL_PRICES.project.usd}</p>
          <p className="digital-course__local-price">{digitalArsLabel(DIGITAL_PRICES.project.ars, lang)} · {es ? 'por cada proyecto base' : 'per base project'}</p>
          <p className="digital-course__intro">{es ? 'Tres bases listas para presentar, organizar tu idea y dar los primeros pasos.' : 'Three foundations to present, organize your idea and take the first steps.'}</p>
          <ol className="digital-course__list">
            {baseProjects.map(project => <li key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </li>)}
          </ol>
          <p className="digital-course__status">{es ? 'Entrega dentro de las 48 horas, después de confirmar el pago y el contacto por correo electrónico.' : 'Delivery within 48 hours after payment and email contact are confirmed.'}</p>
          <a className="portal-button digital-course__request" href="#course-order">{es ? 'Solicitar un proyecto' : 'Request a project'}</a>
        </section>
      </div>
      <p className="digital-courses__conversion">{es ? `Precios en pesos calculados con un dólar fijo de ${digitalArsLabel(DIGITAL_USD_TO_ARS, lang)}, acordado para este catálogo.` : `Peso prices use the fixed conversion of ${digitalArsLabel(DIGITAL_USD_TO_ARS, lang)} per USD agreed for this catalog.`}</p>
      <DigitalCourseOrder items={orderItems} />
    </div>
  </main>
}
