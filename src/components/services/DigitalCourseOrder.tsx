import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'

export type DigitalOrderItem = { id: string; title: string; kind: 'course' | 'project'; custom?: boolean }
const CONTACT_EMAIL = 'aidss1991@gmail.com'

export default function DigitalCourseOrder({ items }: { items: DigitalOrderItem[] }) {
  const { lang, localizePath } = useLang()
  const es = lang === 'es'
  const [selectedId, setSelectedId] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [brief, setBrief] = useState('')
  const [focus, setFocus] = useState('')
  const [notes, setNotes] = useState('')
  const [reference, setReference] = useState('')
  const [mailHref, setMailHref] = useState('')
  const item = items.find(product => product.id === selectedId)

  function prepareOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!item) return
    const phoneInput = event.currentTarget.elements.namedItem('digital-order-whatsapp') as HTMLInputElement
    const phoneDigits = whatsapp.replace(/\D/g, '').length
    if (phoneDigits < 7 || phoneDigits > 15) {
      phoneInput.setCustomValidity(es ? 'Ingresá un número de WhatsApp válido con código de país.' : 'Enter a valid WhatsApp number with country code.')
      phoneInput.reportValidity()
      return
    }
    const price = item.kind === 'course' ? 15 : 50
    const hours = item.kind === 'course' ? 24 : 48
    const lines = es ? [
      `Pedido: ${item.title}`,
      `Precio de referencia: USD ${price}`,
      `Email de contacto: ${email.trim()}`,
      `WhatsApp: ${whatsapp.trim()}`,
      ...(item.custom ? [`De qué trata el proyecto: ${brief.trim()}`, `Enfoque: ${focus.trim()}`] : []),
      `Comentarios: ${notes.trim() || 'Sin comentarios adicionales'}`,
      `Referencia de pago (a verificar): ${reference.trim() || 'Pendiente de coordinar'}`,
      '',
      `Entrega: dentro de ${hours} horas después de confirmar el pago y el contacto por correo.`,
      'Comprobante: adjuntar a este correo si el pago ya fue realizado.',
    ] : [
      `Order: ${item.title}`,
      `Reference price: USD ${price}`,
      `Contact email: ${email.trim()}`,
      `WhatsApp: ${whatsapp.trim()}`,
      ...(item.custom ? [`Project summary: ${brief.trim()}`, `Focus: ${focus.trim()}`] : []),
      `Comments: ${notes.trim() || 'No additional comments'}`,
      `Payment reference (to be verified): ${reference.trim() || 'To be arranged'}`,
      '',
      `Delivery: within ${hours} hours after payment and email contact are confirmed.`,
      'Receipt: attach it to this email if payment has already been made.',
    ]
    const subject = `${es ? 'Pedido' : 'Order'} · ${item.title}`
    setMailHref(`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`)
  }

  return <section id="course-order" className="digital-order" aria-labelledby="digital-order-title">
    <p className="portal-eyebrow">{es ? 'TU PRÓXIMO PASO' : 'YOUR NEXT STEP'}</p>
    <h2 id="digital-order-title">{es ? 'Prepará tu pedido' : 'Prepare your order'}</h2>
    <p>{es ? 'Elegí una propuesta y dejá tus datos de contacto. Te confirmaremos el medio de pago por correo.' : 'Choose an option and provide your contact details. We will confirm the payment method by email.'}</p>
    <p>{es ? 'Correo de atención:' : 'Contact email:'} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
    <form onSubmit={prepareOrder} onChange={() => setMailHref('')}>
      <div className="digital-order__fields">
        <label className="digital-order__wide" htmlFor="digital-order-product"><span id="digital-order-product-label">{es ? 'Curso o proyecto' : 'Course or project'}</span>
          <select id="digital-order-product" aria-labelledby="digital-order-product-label" required value={selectedId} onChange={event => setSelectedId(event.target.value)}>
            <option value="">{es ? 'Elegí una propuesta' : 'Choose an option'}</option>
            <optgroup label={es ? 'Cursos de IA · USD 15' : 'AI courses · USD 15'}>{items.filter(product => product.kind === 'course').map(product => <option key={product.id} value={product.id}>{product.title}</option>)}</optgroup>
            <optgroup label={es ? 'Proyectos Base · USD 50' : 'Base Projects · USD 50'}>{items.filter(product => product.kind === 'project').map(product => <option key={product.id} value={product.id}>{product.title}</option>)}</optgroup>
          </select>
        </label>
        <label htmlFor="digital-order-email">{es ? 'Tu correo electrónico' : 'Your email'}<input id="digital-order-email" type="email" required maxLength={254} autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} /></label>
        <label htmlFor="digital-order-whatsapp">WhatsApp<input id="digital-order-whatsapp" type="tel" required minLength={7} maxLength={30} pattern="[+0-9 ]{7,30}" autoComplete="tel" placeholder="+54 9 11 1234 5678" value={whatsapp} onChange={event => { event.currentTarget.setCustomValidity(''); setWhatsapp(event.target.value) }} /></label>
        {item?.custom && <>
          <label className="digital-order__wide" htmlFor="digital-order-brief">{es ? '¿De qué trata tu proyecto? (breve)' : 'What is your project about? (briefly)'}<textarea id="digital-order-brief" required minLength={10} maxLength={500} rows={3} value={brief} onChange={event => setBrief(event.target.value)} /></label>
          <label className="digital-order__wide" htmlFor="digital-order-focus">{es ? '¿A qué está enfocado?' : 'What is its focus?'}<input id="digital-order-focus" required minLength={3} maxLength={160} value={focus} onChange={event => setFocus(event.target.value)} /></label>
        </>}
        <label className="digital-order__wide" htmlFor="digital-order-notes">{es ? 'Comentarios o lo que necesitás (opcional)' : 'Comments or what you need (optional)'}<textarea id="digital-order-notes" maxLength={800} rows={3} value={notes} onChange={event => setNotes(event.target.value)} /></label>
        <label className="digital-order__wide" htmlFor="digital-order-reference">{es ? 'Referencia del pago, si ya abonaste (opcional)' : 'Payment reference, if already paid (optional)'}<input id="digital-order-reference" maxLength={100} value={reference} onChange={event => setReference(event.target.value)} /></label>
      </div>
      <label className="digital-order__consent"><input type="checkbox" required /> <span>{es ? 'Autorizo usar mi email y WhatsApp para responder y gestionar este pedido.' : 'I authorize use of my email and WhatsApp to reply to and manage this order.'} <Link to={localizePath('/privacy')}>{es ? 'Privacidad' : 'Privacy'}</Link></span></label>
      <button className="portal-button" type="submit">{es ? 'Preparar correo del pedido' : 'Prepare order email'}</button>
      <p className="digital-order__help">{es ? 'El pedido se envía desde tu app de correo. Adjuntá allí el comprobante si ya abonaste y enviá el mensaje. Prepararlo no confirma un pago.' : 'Send the order from your email app. Attach the receipt there if you have paid, then send the message. Preparing an order does not confirm payment.'}</p>
      {mailHref && <div className="digital-order__ready" role="status">
        <p>{es ? 'Tu correo está preparado. Abrilo, revisá los datos y enviá el pedido.' : 'Your email is prepared. Open it, review the details and send your order.'}</p>
        <a className="portal-button" href={mailHref}>{es ? 'Abrir en mi correo' : 'Open in my email app'}</a>
      </div>}
    </form>
  </section>
}
