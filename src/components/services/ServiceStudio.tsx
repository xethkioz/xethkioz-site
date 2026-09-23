import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STUDIO_SERVICES, STUDIO_EXTRAS, STUDIO_BUNDLES, STUDIO_INSTAGRAM, normalizeSelection, studioSelectionUrl, copyStudioText, type StudioSelection, type StudioLang, type ServiceId } from '../../data/serviceStudio'
import './ServiceStudio.css'

type Props = { lang: StudioLang; selection: StudioSelection; onChange: (value: StudioSelection) => void; onQuote: () => void; onStarterQuote: () => void }
export function StudioSelectionSummary({ selection, lang }: { selection: StudioSelection; lang: StudioLang }) {
  const selected = STUDIO_SERVICES.filter(s => selection.services.includes(s.id))
  const extras = STUDIO_EXTRAS.filter(e => selection.extras.includes(e.id))
  return <div className="xks-selection-summary"><strong>{lang === 'es' ? 'Tu selección' : 'Your selection'}</strong><p>{selected.map(s => s.title[lang]).join(' + ') || (lang === 'es' ? 'Elegí al menos un servicio.' : 'Choose at least one service.')}</p>{extras.length > 0 && <small>{lang === 'es' ? 'Extras a evaluar: ' : 'Extras to assess: '}{extras.map(e => e.title[lang]).join(' · ')}</small>}<small>{lang === 'es' ? 'Precio y plazos: a definir en una propuesta. Esta selección no genera un cobro.' : 'Price and timing: defined in a proposal. This selection does not trigger a charge.'}</small></div>
}
export default function ServiceStudio({ lang, selection, onChange, onQuote, onStarterQuote }: Props) {
  const es = lang === 'es'
  const [filter, setFilter] = useState<'all' | ServiceId>('all')
  const [demo, setDemo] = useState<'marca' | 'creador' | 'negocio'>('marca')
  const [copyStatus, setCopyStatus] = useState('')
  const [shareFallback, setShareFallback] = useState('')
  const visible = STUDIO_SERVICES.filter(s => filter === 'all' || s.id === filter)
  const selected = STUDIO_SERVICES.filter(s => selection.services.includes(s.id))
  const availableExtras = STUDIO_EXTRAS.filter(extra => extra.for.some(id => selection.services.includes(id)))
  function change(value: StudioSelection) { onChange(normalizeSelection(value)); setCopyStatus(''); setShareFallback('') }
  function toggleService(id: ServiceId) { change({ ...selection, services: selection.services.includes(id) ? selection.services.filter(s => s !== id) : [...selection.services, id] }) }
  function toggleExtra(id: string) { change({ ...selection, extras: selection.extras.includes(id) ? selection.extras.filter(e => e !== id) : [...selection.extras, id] }) }
  async function share() { const url = studioSelectionUrl(selection, lang); const copied = await copyStudioText(url); setShareFallback(copied ? '' : url); setCopyStatus(copied ? (es ? 'Enlace copiado. No contiene datos de contacto.' : 'Link copied. It contains no contact details.') : (es ? 'Copiá el enlace de selección que aparece debajo.' : 'Copy the selection link shown below.')) }
  const demos = { marca: { es: ['Tu marca.', 'Tu lugar en la web.', 'Identidad propia'], en: ['Your brand.', 'Your place on the web.', 'Your own identity'] }, creador: { es: ['Ideas que', 'merecen verse.', 'Contenido con intención'], en: ['Ideas worth', 'being seen.', 'Purposeful content'] }, negocio: { es: ['Lo que hacés,', 'bien presentado.', 'Una propuesta clara'], en: ['What you do,', 'clearly presented.', 'A clear proposal'] } } as const
  const preview = demos[demo][lang]
  return <>
    <section className="xks-hero" aria-labelledby="web-creation-title">
      <div className="xks-hero-copy">
        <Link className="xks-back" to={es ? '/' : '/en'}>← {es ? 'Volver a XETHKIOZ' : 'Back to XETHKIOZ'}</Link>
        <p className="xks-eyebrow"><span aria-hidden="true">✦</span> XETHKIOZ / {es ? 'ESTUDIO DIGITAL' : 'DIGITAL STUDIO'}</p>
        <h1 id="web-creation-title">{es ? 'Tu idea merece' : 'Your idea deserves'}<br /><em>{es ? 'verse diferente.' : 'to look different.'}</em></h1>
        <p className="xks-lead">{es ? 'Web, contenido e inteligencia artificial con identidad propia. Elegí lo que necesitás y armemos una propuesta para tu proyecto.' : 'Web, content and artificial intelligence with an identity of their own. Choose what you need and let’s shape a proposal for your project.'}</p>
        <div className="xks-actions"><a className="xks-button xks-primary" href="#propuestas">{es ? 'Armar mi proyecto' : 'Build my project'} <span aria-hidden="true">↗</span></a><a className="xks-button xks-secondary" href={STUDIO_INSTAGRAM} target="_blank" rel="noopener noreferrer">{es ? 'Hablar con Alexis' : 'Talk to Alexis'}</a></div>
        <p className="xks-trust-line">{es ? 'Atención personal · Alcance acordado · Sin cobros automáticos' : 'Personal attention · Agreed scope · No automatic charges'}</p>
      </div>
      <div className="xks-showcase">
        <div className="xks-showcase-top"><span>{es ? 'UNA IDEA. DISTINTAS POSIBILIDADES.' : 'ONE IDEA. DIFFERENT POSSIBILITIES.'}</span><span aria-hidden="true">✧</span></div>
        <div className={`xks-browser xks-demo-${demo}`} role="img" aria-label={es ? `Demostración de estructura: ${preview.join(' ')}` : `Structure demonstration: ${preview.join(' ')}`}>
          <div className="xks-browser-chrome" aria-hidden="true"><i /><i /><i /><span>{es ? 'tu-marca / inicio' : 'your-brand / home'}</span></div>
          <div className="xks-demo-scene"><span className="xks-demo-kicker">{preview[2]}</span><strong>{preview[0]}<br /><em>{preview[1]}</em></strong><div className="xks-demo-line" /><div className="xks-demo-line short" /><div className="xks-orb" aria-hidden="true"><i /><b>✦</b></div></div>
          <div className="xks-demo-tiles" aria-hidden="true"><span>01 <i /></span><span>02 <i /></span><span>03 <i /></span></div>
        </div>
        <div className="xks-demo-options" role="group" aria-label={es ? 'Cambiar demostración de estructura' : 'Change structure demonstration'}>{(['marca', 'creador', 'negocio'] as const).map(id => <button type="button" key={id} aria-pressed={demo === id} onClick={() => setDemo(id)}>{({ marca: es ? 'Marca' : 'Brand', creador: es ? 'Creador' : 'Creator', negocio: es ? 'Negocio' : 'Business' })[id]}</button>)}</div>
        <p className="xks-demo-note">{es ? 'Demostración de estructura. No es un trabajo de cliente ni una plantilla a la venta.' : 'Structure demonstration. Not client work or a template for sale.'}</p>
      </div>
    </section>
    <section id="landing-esencial" className="xks-launch-offer" aria-labelledby="xks-launch-title">
      <div className="xks-launch-copy">
        <p className="xks-launch-kicker">{es ? 'XETHKIOZ STUDIO / PAQUETE INICIAL' : 'XETHKIOZ STUDIO / STARTER PACKAGE'}</p>
        <h2 id="xks-launch-title">{es ? 'Landing Esencial' : 'Essential Landing Page'}</h2>
        <p>{es ? 'Una página clara para presentar tu negocio y recibir consultas. Diseño propio, liviano y pensado para el celular.' : 'A clear page to introduce your business and receive inquiries. Original design, lightweight and built for mobile.'}</p>
        <ul>
          {(es ? ['Una página de hasta cinco secciones y botón de contacto', 'Textos revisados y tres piezas de lanzamiento para redes', 'SEO básico, dos rondas de cambios y 30 días de corrección de errores'] : ['One page with up to five sections and a contact button', 'Reviewed copy and three launch posts for social media', 'Basic SEO, two revision rounds and 30 days of bug fixes']).map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}
        </ul>
        <p className="xks-launch-limit">{es ? 'Dominio, alojamiento, tienda, turnos, campañas pagas y mantenimiento posterior se acuerdan por separado.' : 'Domain, hosting, store, bookings, paid ads and ongoing maintenance are agreed separately.'}</p>
      </div>
      <div className="xks-launch-checkout">
        <span>{es ? 'Precio base de referencia' : 'Reference starting price'}</span>
        <strong>USD 350</strong>
        <p>{es ? 'Presupuesto final en pesos según alcance confirmado. Dos proyectos simultáneos como máximo.' : 'Final quote in local currency after confirming scope. Up to two projects at a time.'}</p>
        <button type="button" className="xks-button xks-primary" onClick={onStarterQuote}>{es ? 'Consultar por este paquete' : 'Ask about this package'} <span aria-hidden="true">→</span></button>
        <small>{es ? 'Consulta gratuita · 50 % al aceptar la propuesta y 50 % a la entrega · Plazo estimado: 10 a 15 días hábiles desde que recibimos material y anticipo.' : 'Free inquiry · 50% after accepting the proposal and 50% on delivery · Estimated time: 10–15 business days after materials and deposit arrive.'}</small>
      </div>
    </section>
    <nav className="xks-local-nav" aria-label={es ? 'Explorar servicios' : 'Explore services'}><a href="#propuestas">{es ? 'Servicios' : 'Services'}</a><a href="#mi-proyecto">{es ? 'Mi selección' : 'My selection'} <span>{selected.length}</span></a><a href="#proceso">{es ? 'Cómo contratar' : 'How to hire'}</a><a href="#web-faq-title">{es ? 'Preguntas frecuentes' : 'FAQ'}</a></nav>
    <section id="propuestas" className="xks-catalog" aria-labelledby="web-catalog-title">
      <header className="xks-section-heading"><p className="xks-eyebrow">{es ? 'DE UNA NECESIDAD A UNA SOLUCIÓN' : 'FROM A NEED TO A SOLUTION'}</p><h2 id="web-catalog-title">{es ? 'Un estudio. Más posibilidades.' : 'One studio. More possibilities.'}</h2><p>{es ? 'Contratá un servicio o combiná varios. El precio, los entregables y los tiempos se acuerdan antes de empezar.' : 'Hire one service or combine several. Price, deliverables and timing are agreed before we start.'}</p></header>
      <div className="xks-bundles" aria-label={es ? 'Combinaciones sugeridas' : 'Suggested combinations'}>{STUDIO_BUNDLES.map(bundle => <button type="button" key={bundle.id} onClick={() => change({ services: [...selection.services, ...bundle.services], extras: selection.extras })}><span>{bundle.title[lang]}</span><small>{bundle.note[lang]}</small><b aria-hidden="true">＋</b></button>)}</div>
      <div className="xks-filters" role="group" aria-label={es ? 'Filtrar servicios' : 'Filter services'}><button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>{es ? 'Todos' : 'All'}</button>{STUDIO_SERVICES.map(service => <button type="button" key={service.id} aria-pressed={filter === service.id} onClick={() => setFilter(service.id)}>{service.title[lang]}</button>)}</div>
      <div className="xks-shop-layout"><div className="xks-products">
        <div className="xks-cards">{visible.map(service => { const active = selection.services.includes(service.id); return <article key={service.id} className={`xks-card xks-card-${service.id}${active ? ' is-selected' : ''}`} data-service={service.id}>
          <div className="xks-card-top"><span className="xks-service-symbol" aria-hidden="true">{({ web: '⌘', ia: '✦', contenido: '◈', pc: '⊞' })[service.id]}</span><small>{service.code} / XETHKIOZ</small></div>
          <h3>{service.title[lang]}</h3><p>{service.intro[lang]}</p>
          <ul>{service.scope[lang].map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
          <details><summary>{es ? 'Alcance y límites' : 'Scope & limits'} <span aria-hidden="true">＋</span></summary><p>{service.limit[lang]}</p></details>
          <div className="xks-card-bottom"><span>{es ? 'A medida' : 'Custom quote'}<small>{es ? 'Según alcance' : 'Based on scope'}</small></span><button type="button" aria-pressed={active} aria-label={`${active ? (es ? 'Quitar' : 'Remove') : (es ? 'Agregar' : 'Add')} ${service.title[lang]}`} onClick={() => toggleService(service.id)}>{active ? (es ? 'Agregado ✓' : 'Added ✓') : (es ? 'Agregar ＋' : 'Add ＋')}</button></div>
        </article> })}</div>
        {availableExtras.length > 0 && <fieldset className="xks-extras"><legend>{es ? 'Completá tu propuesta' : 'Complete your proposal'}</legend><p>{es ? 'Extras opcionales, sujetos a evaluación y presupuesto. No se agregan importes ni compromisos automáticamente.' : 'Optional extras, subject to assessment and a quote. No amounts or commitments are added automatically.'}</p><div>{availableExtras.map(extra => <label key={extra.id}><input type="checkbox" checked={selection.extras.includes(extra.id)} onChange={() => toggleExtra(extra.id)} /><span>{extra.title[lang]}</span></label>)}</div></fieldset>}
      </div>
      <aside id="mi-proyecto" className="xks-basket" aria-labelledby="xks-basket-title">
        <div className="xks-basket-heading"><span aria-hidden="true">◇</span><h3 id="xks-basket-title">{es ? 'Tu proyecto empieza acá.' : 'Your project starts here.'}</h3></div>
        <p className="xks-count" role="status" aria-live="polite">{selected.length} {es ? (selected.length === 1 ? 'servicio seleccionado' : 'servicios seleccionados') : (selected.length === 1 ? 'service selected' : 'services selected')}</p>
        {selected.length ? <ul className="xks-basket-items">{selected.map(service => <li key={service.id}><span>{service.title[lang]}</span><button type="button" aria-label={`${es ? 'Quitar' : 'Remove'} ${service.title[lang]} ${es ? 'de mi selección' : 'from my selection'}`} onClick={() => toggleService(service.id)}>×</button></li>)}</ul> : <p className="xks-empty">{es ? 'Elegí los servicios que necesitás. Podés combinarlos y ajustar tu selección sin compromiso.' : 'Choose the services you need. Combine them and adjust your selection without commitment.'}</p>}
        {selection.extras.length > 0 && <p className="xks-basket-extras">{es ? 'Extras: ' : 'Extras: '}{STUDIO_EXTRAS.filter(extra => selection.extras.includes(extra.id)).map(extra => extra.title[lang]).join(' · ')}</p>}
        <div className="xks-basket-total"><small>{es ? 'Inversión' : 'Investment'}</small><strong>{es ? 'A cotizar' : 'To be quoted'}</strong></div>
        <p className="xks-basket-note">{es ? 'Primero revisamos alcance y disponibilidad. Recibirás una propuesta antes de contratar o pagar.' : 'We first review scope and availability. You receive a proposal before hiring or paying.'}</p>
        <button type="button" className="xks-button xks-primary" disabled={!selected.length} onClick={onQuote}>{es ? 'Solicitar mi propuesta' : 'Request my proposal'} <span aria-hidden="true">→</span></button>
        {selected.length > 0 && <div className="xks-basket-tools"><button type="button" onClick={() => void share()}>{es ? 'Compartir selección' : 'Share selection'}</button><button type="button" onClick={() => change({ services: [], extras: [] })}>{es ? 'Vaciar selección' : 'Clear selection'}</button></div>}
        {copyStatus && <p className="xks-feedback" role="status">{copyStatus}</p>}
        {shareFallback && <label className="xks-share-fallback">{es ? 'Enlace de selección' : 'Selection link'}<input readOnly value={shareFallback} onFocus={event => event.currentTarget.select()} /></label>}
        <a className="xks-direct" href={STUDIO_INSTAGRAM} target="_blank" rel="noopener noreferrer">{es ? '¿Necesitás orientación? Escribime.' : 'Need guidance? Send me a message.'} ↗</a>
      </aside></div>
    </section>
  </>
}
