import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import { DONATION_LINKS } from '../lib/siteConfig'
import './SupportFantasy.css'

const copy = {
  es: {
    seoTitle: 'Apoyá el proyecto | XETHKIOZ',
    seoDescription: 'Formas voluntarias de acompañar World of Xethkioz, la web y su contenido independiente.',
    eyebrow: 'PRODUCCIÓN INDEPENDIENTE', title: 'Un mundo por crear. Un impulso compartido.',
    intro: 'Detrás de World of Xethkioz hay un proyecto independiente que crece con trabajo, creatividad y comunidad. Tu apoyo acompaña el desarrollo y ayuda a sostener la web y sus contenidos.',
    back: 'Descubrir World of Xethkioz', contribute: 'Elegí cómo acompañar',
    voluntary: 'El aporte es voluntario. No es una preventa, una inversión ni una compra de ventajas dentro del juego.',
    paypal: 'Aportar con PayPal', mercadoPago: 'Aportar con Mercado Pago',
    payments: 'El aporte se realiza en el sitio del proveedor. Revisá allí el importe y los datos antes de confirmar.',
    alias: 'Alias de Mercado Pago', helpTitle: 'Lo que ayudás a sostener',
    help: [['01', 'Desarrollo y arte', 'Tiempo, herramientas y producción del proyecto.'], ['02', 'Una web independiente', 'Infraestructura, mantenimiento y mejoras de la experiencia.'], ['03', 'Contenido y comunidad', 'Noticias de gaming, tecnología e IA, y espacios para encontrarnos.']],
    freeTitle: 'Compartir también es apoyar.', freeText: 'Seguir las novedades, compartir una publicación o acercar una idea también suma. No hace falta aportar dinero para ser parte.',
    follow: 'Seguir en Threads', contact: 'Proponer una colaboración',
    sponsorTitle: '¿Tu marca quiere acompañar?', sponsorText: 'Conversemos sobre una colaboración o patrocinio con un alcance acordado. Las propuestas comerciales se identifican como tales.',
    sponsor: 'Consultar patrocinio',
  },
  en: {
    seoTitle: 'Support the project | XETHKIOZ',
    seoDescription: 'Voluntary ways to support World of Xethkioz, the website and independent content.',
    eyebrow: 'INDEPENDENT PRODUCTION', title: 'A world to create. A shared beginning.',
    intro: 'World of Xethkioz is an independent project built through work, creativity and community. Your support helps its development and sustains the website and its content.',
    back: 'Discover World of Xethkioz', contribute: 'Choose how to contribute',
    voluntary: 'Support is voluntary. It is not a preorder, an investment or a purchase of gameplay advantages.',
    paypal: 'Contribute with PayPal', mercadoPago: 'Contribute with Mercado Pago',
    payments: 'Contributions take place on the provider’s website. Review the amount and recipient details there before confirming.',
    alias: 'Mercado Pago alias', helpTitle: 'What your support helps sustain',
    help: [['01', 'Development and art', 'Time, tools and project production.'], ['02', 'An independent website', 'Infrastructure, maintenance and experience improvements.'], ['03', 'Content and community', 'Gaming, technology and AI news, and spaces to connect.']],
    freeTitle: 'Sharing is support, too.', freeText: 'Following updates, sharing a post or suggesting an idea helps as well. You do not need to contribute money to take part.',
    follow: 'Follow on Threads', contact: 'Suggest a collaboration',
    sponsorTitle: 'Would your brand like to help?', sponsorText: 'Let’s discuss a collaboration or sponsorship with an agreed scope. Commercial placements are identified as such.',
    sponsor: 'Ask about sponsorship',
  },
} as const

export default function Support() {
  const { lang, localizePath } = useLang()
  const t = copy[lang]
  return (
    <main className="xks-support">
      <SEO title={t.seoTitle} description={t.seoDescription} url={localizePath('/support')} />
      <Link className="xks-back" to={localizePath('/world-of-xethkioz')}>← {t.back}</Link>
      <section className="xks-hero" aria-labelledby="support-title">
        <div className="xks-intro"><p className="xks-eyebrow">{t.eyebrow}</p><h1 id="support-title">{t.title}</h1><p className="xks-lead">{t.intro}</p></div>
        <div className="xks-contribute" aria-labelledby="support-methods-title">
          <span className="xks-mark" aria-hidden="true">✦</span><h2 id="support-methods-title">{t.contribute}</h2>
          <p className="xks-voluntary">{t.voluntary}</p>
          <a className="xks-primary" href={DONATION_LINKS.paypal} target="_blank" rel="noopener noreferrer">{t.paypal}<span aria-hidden="true">↗</span></a>
          <a className="xks-secondary" href={DONATION_LINKS.mercadoPago} target="_blank" rel="noopener noreferrer">{t.mercadoPago}<span aria-hidden="true">↗</span></a>
          <p className="xks-alias">{t.alias}: <code>xethkioz</code></p>
          <p className="xks-payment-note">{t.payments}</p>
        </div>
      </section>
      <section className="xks-purpose" aria-labelledby="support-purpose-title">
        <h2 id="support-purpose-title">{t.helpTitle}</h2>
        <ol>{t.help.map(([number, title, detail]) => <li key={number}><span aria-hidden="true">{number}</span><h3>{title}</h3><p>{detail}</p></li>)}</ol>
      </section>
      <section className="xks-share" aria-labelledby="support-share-title">
        <div><p className="xks-eyebrow">XETHKIOZ · {lang === 'es' ? 'COMUNIDAD' : 'COMMUNITY'}</p><h2 id="support-share-title">{t.freeTitle}</h2><p>{t.freeText}</p></div>
        <div className="xks-share-actions"><a className="xks-primary" href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">{t.follow}<span aria-hidden="true">↗</span></a><Link className="xks-text-link" to={localizePath('/contact')}>{t.contact} ↗</Link></div>
      </section>
      <section className="xks-sponsor" aria-labelledby="sponsor-options-title"><h2 id="sponsor-options-title">{t.sponsorTitle}</h2><p>{t.sponsorText}</p><Link className="xks-text-link" to={localizePath('/contact')}>{t.sponsor} ↗</Link></section>
    </main>
  )
}
