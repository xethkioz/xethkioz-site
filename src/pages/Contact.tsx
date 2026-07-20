import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import { SOCIAL_LINKS } from '../lib/siteConfig'

const copy = {
  es: {
    seoTitle: 'Contacto, colaboraciones y sponsors',
    seoDescription: 'Contactá a XETHKIOZ para publicidad, colaboraciones, prensa y creación web.',
    eyebrow: 'COMM LINK // CONTACTO',
    title: 'Abramos una señal directa.',
    intro: 'Elegí el canal según lo que quieras construir. No hay formularios decorativos: cada acceso lleva a una vía real.',
    cards: [
      ['SPONSOR // ADS', 'Publicidad con identidad', 'Campañas para gaming, tecnología, negocios regionales y creadores, con espacios identificados y sin disfrazarlos de noticia.', 'Proponer campaña', 'mailto:xethkioz@gmail.com?subject=Propuesta%20de%20sponsor%20para%20XETHKIOZ', 'external'],
      ['WEB // BUSINESS', 'Necesito una página', 'Landing pages, sitios profesionales y tiendas con presupuesto privado desde el sistema de Creación Web.', 'Pedir presupuesto', '/creacion-web', 'internal'],
      ['PRESS // CREATOR', 'Prensa y colaboración', 'Entrevistas, directos, lanzamientos, pruebas, eventos y proyectos que encajen con la Red de Portales.', 'Enviar propuesta', 'mailto:xethkioz@gmail.com?subject=Colaboraci%C3%B3n%20con%20XETHKIOZ', 'external'],
    ],
    socialTitle: 'Encontrá XETHKIOZ en la red',
    externalLabel: 'Abrir canal externo',
  },
  en: {
    seoTitle: 'Contact, collaborations and sponsors',
    seoDescription: 'Contact XETHKIOZ about advertising, collaborations, press and web creation.',
    eyebrow: 'COMM LINK // CONTACT',
    title: 'Let’s open a direct signal.',
    intro: 'Choose the channel that matches what you want to build. There are no decorative forms: every option leads to a real contact path.',
    cards: [
      ['SPONSOR // ADS', 'Advertising with identity', 'Campaigns for gaming, technology, regional businesses and creators, with clearly identified placements that are never disguised as news.', 'Propose a campaign', 'mailto:xethkioz@gmail.com?subject=Sponsor%20proposal%20for%20XETHKIOZ', 'external'],
      ['WEB // BUSINESS', 'I need a website', 'Landing pages, professional sites and stores with a private quote through the Web Creation system.', 'Request a quote', '/creacion-web', 'internal'],
      ['PRESS // CREATOR', 'Press and collaboration', 'Interviews, live streams, launches, tests, events and projects that fit the Portal Network.', 'Send a proposal', 'mailto:xethkioz@gmail.com?subject=Collaboration%20with%20XETHKIOZ', 'external'],
    ],
    socialTitle: 'Find XETHKIOZ across the network',
    externalLabel: 'Open external channel',
  },
} as const

export default function Contact() {
  const { lang } = useLang()
  const t = copy[lang]

  return <main className="xk-trust-page mx-auto max-w-5xl px-4 py-12 text-white sm:px-6">
    <SEO title={t.seoTitle} description={t.seoDescription} url="/contact" />
    <p>{t.eyebrow}</p><h1>{t.title}</h1><p className="xk-trust-lead">{t.intro}</p>
    <div className="xk-contact-grid">
      {t.cards.map(([code, title, description, action, route, kind]) => <article key={code}><small>{code}</small><h2>{title}</h2><p>{description}</p>{kind === 'internal' ? <Link to={route}>{action} →</Link> : <a href={route}>{action} →</a>}</article>)}
    </div>
    <section aria-labelledby="contact-social-title"><h2 id="contact-social-title">{t.socialTitle}</h2><div className="mt-5 flex flex-wrap gap-3">{SOCIAL_LINKS.filter((item) => item.name !== 'Web').map((item) => <a key={item.name} href={item.url} target="_blank" rel="noreferrer noopener" aria-label={`${t.externalLabel}: ${item.name}`} className="rounded-full border border-violet-400/25 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[.14em] text-violet-100"><span aria-hidden="true">{item.icon}</span> {item.name}</a>)}</div></section>
  </main>
}
