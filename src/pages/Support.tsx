import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import { DONATION_LINKS } from '../lib/siteConfig'

const paypalUrl = DONATION_LINKS.paypal
const mercadoPagoUrl = DONATION_LINKS.mercadoPago

const copy = {
  es: {
    seoTitle: 'Apoyá XETHKIOZ',
    seoDescription: 'Donaciones, patrocinios y colaboraciones para ayudar a crecer el proyecto XETHKIOZ.',
    eyebrow: 'XETHKIOZ SUPPORT',
    title: 'Apoyá el crecimiento del proyecto',
    intro: 'XETHKIOZ es una plataforma independiente de gaming, tecnología, IA, streaming y comunidad. Cada aporte ayuda a sostener la web, mejorar el contenido y construir nuevas funciones dentro de la Red de Portales.',
    paypal: 'Donar con PayPal',
    mercadoPago: 'Donar con Mercado Pago',
    helpTitle: '¿En qué ayuda tu aporte?',
    helpItems: ['Mantener online xethkioz.com.ar.', 'Crear noticias, análisis, videos y carruseles.', 'Mejorar la comunidad, perfiles y comentarios.', 'Financiar herramientas, IA, hosting y producción.'],
    cards: [
      ['🎮', 'Donaciones', 'Para quienes quieren acompañar el proyecto de forma directa.', 'Aportar ahora', 'paypal'],
      ['🤝', 'Patrocinios', 'Para marcas, negocios, empresas o creadores que quieran aparecer en XETHKIOZ.', 'Consultar patrocinio', 'contact'],
      ['🚀', 'Colaboraciones', 'Para trabajar contenido, entrevistas, streams, notas o proyectos audiovisuales.', 'Proponer colaboración', 'contact'],
    ],
    sponsorTitle: 'Opciones para patrocinadores',
    sponsorOptions: ['Logo o mención en secciones seleccionadas', 'Presencia en artículos, videos o streams', 'Campañas para gaming, tecnología, IA o comunidad', 'Espacios para marcas locales, regionales o digitales'],
  },
  en: {
    seoTitle: 'Support XETHKIOZ',
    seoDescription: 'Donations, sponsorships and collaborations that help the XETHKIOZ project grow.',
    eyebrow: 'XETHKIOZ SUPPORT',
    title: 'Support the project’s growth',
    intro: 'XETHKIOZ is an independent platform for gaming, technology, AI, streaming and community. Every contribution helps keep the website online, improve content and build new features across the Portal Network.',
    paypal: 'Donate with PayPal',
    mercadoPago: 'Donate with Mercado Pago',
    helpTitle: 'What does your contribution support?',
    helpItems: ['Keeping xethkioz.com.ar online.', 'Creating news, analysis, videos and carousels.', 'Improving the community, profiles and comments.', 'Funding tools, AI, hosting and production.'],
    cards: [
      ['🎮', 'Donations', 'For people who want to support the project directly.', 'Contribute now', 'paypal'],
      ['🤝', 'Sponsorships', 'For brands, businesses, companies or creators that want a presence in XETHKIOZ.', 'Ask about sponsorship', 'contact'],
      ['🚀', 'Collaborations', 'For content, interviews, streams, articles or audiovisual projects.', 'Propose a collaboration', 'contact'],
    ],
    sponsorTitle: 'Options for sponsors',
    sponsorOptions: ['Logo or mention in selected sections', 'Presence in articles, videos or streams', 'Campaigns for gaming, technology, AI or community', 'Placements for local, regional or digital brands'],
  },
} as const

export default function Support() {
  const { lang } = useLang()
  const t = copy[lang]

  return (
    <main className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 py-8 text-white">
      <SEO title={t.seoTitle} description={t.seoDescription} url="/support" />

      <section className="relative overflow-hidden rounded-3xl glass border border-orange/25 p-6 md:p-10 mb-8" aria-labelledby="support-title">
        <div className="absolute inset-0 bg-gradient-to-br from-orange/15 via-transparent to-neon/15 pointer-events-none" aria-hidden="true" />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="section-eyebrow">{t.eyebrow}</p>
            <h1 id="support-title" className="font-display text-3xl md:text-5xl font-black gradient-text mb-4">{t.title}</h1>
            <p className="text-gray-300 leading-relaxed mb-6">{t.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={paypalUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-center">{t.paypal}</a>
              <a href={mercadoPagoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-center">{t.mercadoPago}</a>
            </div>
          </div>

          <div className="glass-strong rounded-2xl border border-white/10 p-6">
            <div className="text-5xl mb-4" aria-hidden="true">💜</div>
            <h2 className="font-display text-xl font-bold text-white mb-3">{t.helpTitle}</h2>
            <ul className="space-y-3 text-sm text-gray-400">{t.helpItems.map((item) => <li key={item}><span aria-hidden="true">✅</span> {item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" aria-label={lang === 'es' ? 'Formas de apoyar XETHKIOZ' : 'Ways to support XETHKIOZ'}>
        {t.cards.map(([icon, title, description, action, destination]) => <article key={title} className="glass border border-white/10 rounded-2xl p-6 card-hover"><div className="text-3xl mb-3" aria-hidden="true">{icon}</div><h2 className="font-display text-lg font-bold text-white mb-2">{title}</h2><p className="text-sm text-gray-400 mb-4">{description}</p>{destination === 'paypal' ? <a href={paypalUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-orange hover:neon-text-orange">{action} →</a> : <Link to="/contact" className="text-sm text-orange hover:neon-text-orange">{action} →</Link>}</article>)}
      </section>

      <section className="glass border border-white/10 rounded-2xl p-6 md:p-8" aria-labelledby="sponsor-options-title">
        <h2 id="sponsor-options-title" className="font-display text-2xl font-bold gradient-text-purple mb-4">{t.sponsorTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{t.sponsorOptions.map((item) => <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"><span className="text-orange" aria-hidden="true">✦</span><span className="text-sm text-gray-300">{item}</span></div>)}</div>
      </section>
    </main>
  )
}
