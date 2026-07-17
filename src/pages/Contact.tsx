import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { SOCIAL_LINKS } from '../lib/siteConfig'

export default function Contact() {
  return <main className="xk-trust-page mx-auto max-w-5xl px-4 py-12 text-white sm:px-6">
    <SEO title="Contacto, colaboraciones y sponsors" description="Contactá a XETHKIOZ para publicidad, colaboraciones, prensa y creación web." url="/contact" />
    <p>COMM LINK // CONTACTO</p><h1>Abramos una señal directa.</h1><p className="xk-trust-lead">Elegí el canal según lo que quieras construir. No hay formularios decorativos: cada acceso lleva a una vía real.</p>
    <div className="xk-contact-grid">
      <article><small>SPONSOR // ADS</small><h2>Publicidad con identidad</h2><p>Campañas para gaming, tecnología, negocios regionales y creadores, con espacios identificados y sin disfrazarlos de noticia.</p><a href="mailto:xethkioz@gmail.com?subject=Propuesta%20de%20sponsor%20para%20XETHKIOZ">Proponer campaña →</a></article>
      <article><small>WEB // BUSINESS</small><h2>Necesito una página</h2><p>Landing pages, sitios profesionales y tiendas con presupuesto privado desde el sistema de Creación Web.</p><Link to="/creacion-web">Pedir presupuesto →</Link></article>
      <article><small>PRESS // CREATOR</small><h2>Prensa y colaboración</h2><p>Entrevistas, directos, lanzamientos, pruebas, eventos y proyectos que encajen con el universo.</p><a href="mailto:xethkioz@gmail.com?subject=Colaboraci%C3%B3n%20con%20XETHKIOZ">Enviar propuesta →</a></article>
    </div>
    <section><h2>Encontrá XETHKIOZ en la red</h2><div className="mt-5 flex flex-wrap gap-3">{SOCIAL_LINKS.filter((item) => item.name !== 'Web').map((item) => <a key={item.name} href={item.url} target="_blank" rel="noreferrer" className="rounded-full border border-violet-400/25 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[.14em] text-violet-100">{item.icon} {item.name}</a>)}</div></section>
  </main>
}
