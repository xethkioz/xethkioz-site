import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import SafeImage from '../components/SafeImage'
import SEO from '../components/SEO'
import PortalKnowledgeBriefing from '../components/PortalKnowledgeBriefing'
import { useLang } from '../lib/LangContext'
import { loadPublishedWebServices } from '../services/webServices'
import type { WebServiceOffer } from '../types/webServices'

import EditorialCrosslinks from '../components/EditorialCrosslinks'
import './EditorialFantasy.css'
import ServiceStudio, { StudioSelectionSummary } from '../components/services/ServiceStudio'
import { STUDIO_SELECTION_KEY, STUDIO_INSTAGRAM, normalizeSelection, readStudioSelection, buildStudioBrief, studioDetailsLimit, type StudioSelection } from '../data/serviceStudio'

type QuoteForm = {
  serviceId: string
  name: string
  email: string
  whatsapp: string
  businessName: string
  projectType: string
  budgetRange: string
  contactPreference: string
  details: string
  consent: boolean
  companyWebsite: string
}

type SubmitState =
  | { status: 'idle'; message: '' }
  | { status: 'submitting'; message: string }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

type QuoteStep = 1 | 2

type OfferTranslation = Pick<WebServiceOffer, 'eyebrow' | 'title' | 'summary' | 'description' | 'image_alt' | 'price_label' | 'delivery_label' | 'features' | 'cta_label'>

const emptyForm: QuoteForm = {
  serviceId: '',
  name: '',
  email: '',
  whatsapp: '',
  businessName: '',
  projectType: 'landing',
  budgetRange: 'to-define',
  contactPreference: 'email',
  details: '',
  consent: false,
  companyWebsite: '',
}

const projectTypeByOfferSlug: Record<string, QuoteForm['projectType']> = {
  'landing-premium': 'landing',
  'tienda-online': 'ecommerce',
  'sitio-profesional': 'corporate',
}

const englishOfferTranslations: Record<string, OfferTranslation> = {
  'landing-premium': {
    eyebrow: 'Digital presence',
    title: 'Premium landing page',
    summary: 'A fast, conversion-focused page built to turn visits into inquiries, bookings or sales.',
    description: 'Ideal for professionals, launches, events and campaigns that need a clear proposal with an original identity.',
    image_alt: 'Example of a premium landing page for a creative brand',
    price_label: 'Custom quote',
    delivery_label: 'Estimated delivery: 2–4 weeks',
    features: ['Responsive design', 'Contact form', 'Baseline technical SEO', 'Analytics and metrics'],
    cta_label: 'I want a landing page',
  },
  'tienda-online': {
    eyebrow: 'Online sales',
    title: 'Digital store',
    summary: 'A catalog, cart and buying experience designed to sell from every screen.',
    description: 'A scalable commercial foundation for displaying products, receiving orders and connecting payment methods according to the project.',
    image_alt: 'Example of a modern online store with a product catalog',
    price_label: 'Personalized quote',
    delivery_label: 'Estimated delivery: 4–8 weeks',
    features: ['Manageable catalog', 'Cart and checkout', 'Payment integration', 'Mobile optimization'],
    cta_label: 'I want to sell online',
  },
  'sitio-profesional': {
    eyebrow: 'Brand and trust',
    title: 'Professional website',
    summary: 'A complete website to explain who you are, present services and build trust with your audience.',
    description: 'Designed for companies, studios, personal projects and teams that need multiple sections and maintainable content.',
    image_alt: 'Example of a professional website for a service company',
    price_label: 'Custom quote',
    delivery_label: 'Estimated delivery: 3–6 weeks',
    features: ['Multi-page architecture', 'Manageable sections', 'Accessibility and performance', 'Ready to grow'],
    cta_label: 'I want my website',
  },
}

const copy = {
  es: {
    eyebrow: 'XETHKIOZ · CREACIÓN WEB',
    title: 'Tu próxima página no debería parecerse a todas las demás.',
    intro: 'Diseñamos experiencias web con identidad, velocidad y una estrategia clara para transformar visitas en oportunidades reales.',
    heroPrimary: 'Ver propuestas',
    heroSecondary: 'Pedir presupuesto',
    backHome: 'Volver al inicio',
    heroBadge: 'Diseño + desarrollo + acompañamiento',
    heroAlt: 'Ejemplo de una página web creada por XETHKIOZ',
    commitmentsLabel: 'Compromisos del servicio',
    trust: [
      ['Respuesta humana', 'Revisamos cada idea y respondemos con un alcance real.'],
      ['Pensado para mobile', 'Diseño responsive, rendimiento y accesibilidad desde el inicio.'],
      ['Sin compromiso', 'Primero entendemos el proyecto; después definimos inversión y tiempos.'],
    ],
    loop: {
      eyebrow: 'CREATION_LOOP // DE IDEA A PRESENCIA',
      title: 'No vendemos una plantilla: construimos una dirección',
      description: 'Podés mirar propuestas, entender el proceso o contar tu proyecto. Siempre sabés cuál es el siguiente paso.',
      items: [
        { code: 'LOOK', title: 'Ver propuestas', detail: 'Referencias visuales con objetivos distintos', to: '/creacion-web#propuestas', action: 'Explorar' },
        { code: 'FLOW', title: 'Conocer el proceso', detail: 'Descubrimiento, diseño, desarrollo y salida', to: '/creacion-web#proceso', action: 'Entender' },
        { code: 'START', title: 'Contar mi idea', detail: 'Presupuesto privado y respuesta humana', to: '/creacion-web#presupuesto', action: 'Empezar' },
      ],
    },
    catalogEyebrow: 'Soluciones visuales',
    catalogTitle: 'Elegí una base. La hacemos completamente tuya.',
    catalogText: 'Estas imágenes son referencias de estilo: cada proyecto se adapta a la marca, el contenido y los objetivos del cliente.',
    fallbackNotice: 'Catálogo temporal',
    fallbackDescription: 'Las propuestas base están disponibles mientras el catálogo administrable termina de sincronizarse.',
    catalogLoading: 'Cargando propuestas',
    catalogEmpty: 'No hay propuestas disponibles en este momento.',
    featured: 'Destacada',
    included: 'Incluye',
    processEyebrow: 'Cómo trabajamos',
    processTitle: 'Elegís, conversamos y recién después contratás.',
    process: [
      ['01 · Tu selección', 'Elegís servicios y extras. Enviás una consulta privada sin comprar ni pagar.'],
      ['02 · Propuesta', 'Revisamos disponibilidad y acordamos alcance, entregables, revisiones, precio y tiempos.'],
      ['03 · Confirmación', 'Decidís si avanzar. El medio de pago y las condiciones se confirman con la propuesta aceptada.'],
      ['04 · Trabajo y entrega', 'Realizamos el servicio acordado, revisamos el resultado y entregamos con indicaciones de uso.'],
    ],
    quoteEyebrow: 'Tu próxima idea, en marcha',
    quoteTitle: 'Del proyecto a una propuesta concreta.',
    quoteText: 'Revisamos tu selección y lo que necesitás resolver. Recibís alcance, entregables, precio y condiciones antes de decidir. Enviar esta solicitud no confirma una compra.',
    quoteStep: 'Paso',
    quoteSteps: ['Proyecto', 'Contacto'],
    requestProgress: 'Progreso de la solicitud',
    projectStepTitle: 'Primero, definamos la idea.',
    projectStepText: 'Revisá los servicios elegidos y contanos qué necesitás resolver. No adjuntes contraseñas ni información privada.',
    contactStepTitle: 'Ahora, ¿cómo te contactamos?',
    contactStepText: 'Usamos estos datos únicamente para responder tu solicitud.',
    nextStep: 'Continuar con mis datos',
    previousStep: 'Volver al proyecto',
    selectedOffer: 'Propuesta seleccionada',
    changeOffer: 'Cambiar propuesta',
    characters: 'caracteres',
    service: 'Propuesta de referencia',
    servicePlaceholder: 'Quiero orientación',
    name: 'Nombre y apellido',
    email: 'Email',
    whatsapp: 'WhatsApp (opcional)',
    business: 'Marca, negocio o proyecto (opcional)',
    projectType: 'Tipo de proyecto',
    budget: 'Rango de inversión',
    contact: 'Preferencia de contacto',
    details: '¿Qué necesitás resolver?',
    detailsPlaceholder: 'Contanos de tu proyecto, la tarea que necesitás resolver y el material disponible. Para soporte técnico, describí el problema sin enviar contraseñas.',
    consent: 'Acepto que XETHKIOZ use estos datos únicamente para responder esta solicitud de presupuesto.',
    privacyLabel: 'Privacidad',
    honeypot: 'Sitio web de la empresa',
    submit: 'Enviar solicitud',
    submitting: 'Enviando…',
    success: 'Solicitud recibida. Revisaremos alcance y disponibilidad. Todavía no hay una compra ni un pago.',
    successTitle: 'Tu idea ya está en camino.',
    newRequest: 'Enviar otra solicitud',
    genericError: 'No pudimos enviar la solicitud. Revisá los datos e intentá nuevamente.',
    invalidError: 'Revisá los campos marcados antes de continuar.',
    whatsappError: 'Ingresá un WhatsApp o elegí otra preferencia de contacto.',
    rateError: 'Recibimos varias solicitudes seguidas. Esperá unos minutos antes de intentar nuevamente.',
    unavailableError: 'El servicio está temporalmente ocupado. Intentá nuevamente en unos minutos.',
    projectTypes: [
      ['landing', 'Landing page'],
      ['corporate', 'Sitio profesional / corporativo'],
      ['ecommerce', 'Tienda online'],
      ['portfolio', 'Portfolio / marca personal'],
      ['redesign', 'Rediseño de un sitio existente'],
      ['other', 'Otro / necesito orientación'],
    ],
    budgets: [
      ['to-define', 'Necesito definirlo con ustedes'],
      ['starter', 'Proyecto inicial'],
      ['growth', 'Proyecto de crecimiento'],
      ['advanced', 'Proyecto avanzado / integraciones'],
    ],
    contacts: [['email', 'Email'], ['whatsapp', 'WhatsApp'], ['either', 'Cualquiera de los dos']],
    privacy: 'Tus datos no se publican ni se comparten en el catálogo.',
    faqEyebrow: 'Preguntas frecuentes',
    faqTitle: 'Lo importante, antes de empezar.',
    faqs: [
      ['¿Puedo combinar servicios sin contratar una web?', 'Sí. IA, contenido y soporte básico de PC también se consultan de forma independiente. Elegí uno o varios servicios y revisamos el alcance.'],
      ['¿Seleccionar un servicio ya genera una compra?', 'No. Es una solicitud de propuesta. El precio, los plazos, los entregables y cualquier pago se acuerdan antes de empezar. Los aportes voluntarios al proyecto son otra cosa y no pagan estos servicios.'],
      ['¿Cuánto cuesta una página web?', 'Depende del alcance, cantidad de secciones, contenido e integraciones. Por eso primero entendemos el proyecto y después enviamos una propuesta clara, sin costos ocultos.'],
      ['¿Necesito tener logo, textos e imágenes?', 'No necesariamente. Podemos trabajar con el material que ya tengas y definir juntos qué piezas faltan antes de comenzar el diseño.'],
      ['¿La página funciona bien en celular?', 'Sí. Cada propuesta se diseña y prueba para mobile, tablet y escritorio, cuidando velocidad, lectura, accesibilidad y formularios.'],
      ['¿Puedo actualizar el contenido después?', 'Sí. Según el proyecto podemos incluir secciones administrables y dejar una base preparada para sumar páginas, productos o integraciones.'],
    ],
  },
  en: {
    eyebrow: 'XETHKIOZ · WEB CREATION',
    title: 'Your next website should not look like everyone else’s.',
    intro: 'We design web experiences with identity, speed and a clear strategy to turn visits into real opportunities.',
    heroPrimary: 'Explore solutions',
    heroSecondary: 'Request a quote',
    backHome: 'Back to home',
    heroBadge: 'Design + development + support',
    heroAlt: 'Example of a website created by XETHKIOZ',
    commitmentsLabel: 'Service commitments',
    trust: [
      ['Human response', 'Every idea is reviewed and answered with a realistic scope.'],
      ['Mobile first', 'Responsive design, performance and accessibility from day one.'],
      ['No commitment', 'We understand the project before defining investment and timing.'],
    ],
    loop: {
      eyebrow: 'CREATION_LOOP // FROM IDEA TO PRESENCE',
      title: 'We do not sell a template: we build a direction',
      description: 'Explore solutions, understand the process or tell us about your project. You always know the next step.',
      items: [
        { code: 'LOOK', title: 'View solutions', detail: 'Visual references for different goals', to: '/creacion-web#propuestas', action: 'Explore' },
        { code: 'FLOW', title: 'Understand the process', detail: 'Discovery, design, development and launch', to: '/creacion-web#proceso', action: 'Learn' },
        { code: 'START', title: 'Share my idea', detail: 'Private quote and human response', to: '/creacion-web#presupuesto', action: 'Start' },
      ],
    },
    catalogEyebrow: 'Visual solutions',
    catalogTitle: 'Choose a starting point. We make it completely yours.',
    catalogText: 'These images are style references: every project is tailored to the client’s brand, content and goals.',
    fallbackNotice: 'Temporary catalog',
    fallbackDescription: 'The base solutions remain available while the manageable catalog finishes syncing.',
    catalogLoading: 'Loading solutions',
    catalogEmpty: 'No solutions are available right now.',
    featured: 'Featured',
    included: 'Includes',
    processEyebrow: 'How we work',
    processTitle: 'Choose, discuss, then decide to hire.',
    process: [
      ['01 · Your selection', 'Choose services and extras. Send a private inquiry without buying or paying.'],
      ['02 · Proposal', 'We review availability and agree scope, deliverables, revisions, price and timing.'],
      ['03 · Confirmation', 'You decide whether to proceed. Payment method and terms are confirmed with the accepted proposal.'],
      ['04 · Work & delivery', 'We perform the agreed service, review the result and deliver with usage guidance.'],
    ],
    quoteEyebrow: 'Tell us your idea',
    quoteTitle: 'From your project to a clear proposal.',
    quoteText: 'We review your selection and what you need to solve. You receive scope, deliverables, price and terms before deciding. Sending this request does not confirm a purchase.',
    quoteStep: 'Step',
    quoteSteps: ['Project', 'Contact'],
    requestProgress: 'Request progress',
    projectStepTitle: 'First, let’s define the idea.',
    projectStepText: 'Review your selected services and tell us what you need to solve. Do not include passwords or private information.',
    contactStepTitle: 'Now, how should we contact you?',
    contactStepText: 'We use this information only to reply to your request.',
    nextStep: 'Continue with my details',
    previousStep: 'Back to project',
    selectedOffer: 'Selected solution',
    changeOffer: 'Change solution',
    characters: 'characters',
    service: 'Reference solution',
    servicePlaceholder: 'I need guidance',
    name: 'Full name',
    email: 'Email',
    whatsapp: 'WhatsApp (optional)',
    business: 'Brand, business or project (optional)',
    projectType: 'Project type',
    budget: 'Investment range',
    contact: 'Contact preference',
    details: 'What do you need to solve?',
    detailsPlaceholder: 'Tell us about your project, the task you need to solve and available material. For technical support, describe the issue without sending passwords.',
    consent: 'I agree that XETHKIOZ may use this information only to respond to this quote request.',
    privacyLabel: 'Privacy',
    honeypot: 'Company website',
    submit: 'Send request',
    submitting: 'Sending…',
    success: 'Request received. We will review scope and availability. No purchase or payment has been made.',
    successTitle: 'Your idea is already moving.',
    newRequest: 'Send another request',
    genericError: 'We could not send the request. Check the information and try again.',
    invalidError: 'Check the highlighted fields before continuing.',
    whatsappError: 'Enter a WhatsApp number or choose another contact preference.',
    rateError: 'We received several requests in a row. Wait a few minutes before trying again.',
    unavailableError: 'The service is temporarily busy. Please try again in a few minutes.',
    projectTypes: [
      ['landing', 'Landing page'],
      ['corporate', 'Professional / corporate site'],
      ['ecommerce', 'Online store'],
      ['portfolio', 'Portfolio / personal brand'],
      ['redesign', 'Existing site redesign'],
      ['other', 'Other / I need guidance'],
    ],
    budgets: [
      ['to-define', 'I need help defining it'],
      ['starter', 'Starter project'],
      ['growth', 'Growth project'],
      ['advanced', 'Advanced project / integrations'],
    ],
    contacts: [['email', 'Email'], ['whatsapp', 'WhatsApp'], ['either', 'Either one']],
    privacy: 'Your information is never published or shared in the catalog.',
    faqEyebrow: 'Frequently asked questions',
    faqTitle: 'The important things, before we start.',
    faqs: [
      ['Can I combine services without ordering a website?', 'Yes. AI guidance, content and basic PC support can be requested independently. Choose one or more services and we will review scope.'],
      ['Does selecting a service create a purchase?', 'No. It is a proposal request. Price, timing, deliverables and any payment are agreed before work starts. Voluntary project contributions are separate and do not pay for these services.'],
      ['How much does a website cost?', 'It depends on scope, number of sections, content and integrations. We understand the project first and then send a clear proposal without hidden costs.'],
      ['Do I need a logo, copy and images?', 'Not necessarily. We can work with what you already have and define together which pieces are missing before design begins.'],
      ['Will the website work well on mobile?', 'Yes. Every solution is designed and tested for mobile, tablet and desktop, with attention to speed, readability, accessibility and forms.'],
      ['Can I update the content later?', 'Yes. Depending on the project, we can include manageable sections and leave a foundation ready for more pages, products or integrations.'],
    ],
  },
} as const

function scrollTo(id: string) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}

function localizeOffer(offer: WebServiceOffer, lang: 'es' | 'en'): WebServiceOffer {
  if (lang === 'es') return offer
  const translation = englishOfferTranslations[offer.slug]
  return translation ? { ...offer, ...translation } : offer
}

export default function WebCreation() {
  const { lang, localizePath } = useLang()
  const t = copy[lang]
  const quoteFormRef = useRef<HTMLFormElement>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const [selection, setSelection] = useState<StudioSelection>(readStudioSelection)
  const [starterSelected, setStarterSelected] = useState(false)
  const [requestId, setRequestId] = useState('')
  const busyRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)
  const [offers, setOffers] = useState<WebServiceOffer[]>([])
  const [catalogNotice, setCatalogNotice] = useState<string | null>(null)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [form, setForm] = useState<QuoteForm>(emptyForm)
  const [quoteStep, setQuoteStep] = useState<QuoteStep>(1)
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle', message: '' })

  useEffect(() => {
    let active = true
    loadPublishedWebServices().then((result) => {
      if (!active) return
      setOffers(result.offers)
      setCatalogNotice(result.notice)
      setForm((current) => current.serviceId ? current : { ...current, serviceId: result.offers[0]?.id ?? '' })
      setCatalogLoading(false)
    }).catch(() => {
      if (!active) return
      setOffers([])
      setCatalogNotice(t.fallbackDescription)
      setCatalogLoading(false)
    })
    return () => { active = false }
  }, [t.fallbackDescription])

  useEffect(() => {
    try { sessionStorage.setItem(STUDIO_SELECTION_KEY, JSON.stringify(normalizeSelection(selection))) } catch { /* Selection remains usable without browser storage. */ }
  }, [selection])
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; abortRef.current?.abort() } }, [])

  function updateSelection(value: StudioSelection) {
    if (busyRef.current) return
    setStarterSelected(false)
    setSelection(normalizeSelection(value))
    if (submitState.status === 'success') { setRequestId(''); setForm(emptyForm); setQuoteStep(1) }
    setSubmitState({ status: 'idle', message: '' })
  }

  const displayOffers = useMemo(() => offers.map((offer) => localizeOffer(offer, lang)), [lang, offers])
  const selectedOffer = useMemo(() => selection.services.includes('web') ? displayOffers.find((offer) => offer.id === form.serviceId) ?? null : null, [displayOffers, form.serviceId, selection.services])
  const detailsLimit = studioDetailsLimit(selection, starterSelected)

  function updateForm<Key extends keyof QuoteForm>(field: Key, value: QuoteForm[Key]) {
    if (busyRef.current) return
    setForm((current) => ({ ...current, [field]: value }))
    if (submitState.status !== 'idle') setSubmitState({ status: 'idle', message: '' })
  }

  function chooseOffer(offer: WebServiceOffer) {
    if (busyRef.current) return
    setStarterSelected(false)
    updateSelection({ ...selection, services: [...selection.services, 'web'] })
    setForm((current) => ({ ...current, serviceId: offer.id, projectType: projectTypeByOfferSlug[offer.slug] ?? current.projectType }))
    setQuoteStep(1)
    setSubmitState({ status: 'idle', message: '' })
    scrollTo('presupuesto')
  }

  function chooseStarterOffer() {
    if (busyRef.current) return
    const landing = offers.find((offer) => offer.slug === 'landing-premium')
    updateSelection({ services: ['web', 'contenido'], extras: [] })
    setStarterSelected(true)
    setForm((current) => ({ ...current, serviceId: landing?.id ?? '', projectType: 'landing', budgetRange: 'starter' }))
    focusStep(1)
    scrollTo('presupuesto')
  }

  function focusStep(step: QuoteStep) {
    if (busyRef.current) return
    setQuoteStep(step)
    setSubmitState({ status: 'idle', message: '' })
    window.requestAnimationFrame(() => stepHeadingRef.current?.focus())
  }

  function validateProject() {
    if (!selection.services.length) {
      setSubmitState({ status: 'error', message: lang === 'es' ? 'Elegí al menos un servicio antes de continuar.' : 'Choose at least one service before continuing.' })
      return false
    }
    if (form.details.trim().length < 20 || form.details.length > detailsLimit) {
      setSubmitState({ status: 'error', message: lang === 'es' ? `Escribí entre 20 y ${detailsLimit} caracteres sobre tu proyecto.` : `Write between 20 and ${detailsLimit} characters about your project.` })
      return false
    }
    return true
  }

  function continueQuote() {
    if (busyRef.current || !validateProject()) return
    if (!quoteFormRef.current?.reportValidity()) {
      setSubmitState({ status: 'error', message: t.invalidError })
      return
    }
    focusStep(2)
  }

  function resetQuote() {
    if (busyRef.current) return
    setStarterSelected(false)
    setSelection({ services: [], extras: [] })
    setRequestId('')
    setForm({ ...emptyForm, serviceId: offers[0]?.id ?? '' })
    focusStep(1)
  }

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busyRef.current) return
    if (quoteStep === 1) { continueQuote(); return }
    if (!validateProject() || !quoteFormRef.current?.reportValidity()) return
    busyRef.current = true
    const controller = new AbortController()
    abortRef.current = controller
    const timeout = window.setTimeout(() => controller.abort(), 15_000)
    setSubmitState({ status: 'submitting', message: t.submitting })
    try {
      const response = await fetch('/api/web-quote', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({
          serviceId: selectedOffer?.id ?? null, serviceSlug: selectedOffer?.slug ?? null,
          name: form.name, email: form.email, whatsapp: form.whatsapp, businessName: form.businessName,
          projectType: selection.services.includes('web') ? form.projectType : 'other',
          budgetRange: form.budgetRange, contactPreference: form.contactPreference,
          details: buildStudioBrief(selection, lang, form.details, starterSelected), consent: form.consent,
          companyWebsite: form.companyWebsite, source: '/creacion-web',
        }),
      })
      const payload = await response.json().catch(() => null) as { ok?: boolean; error?: string; requestId?: string } | null
      const validReference = typeof payload?.requestId === 'string' && /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(payload.requestId)
      if (response.status !== 201 || payload?.ok !== true || !validReference) throw new Error(payload?.error || 'REQUEST_FAILED')
      if (!mountedRef.current) return
      setRequestId(payload!.requestId!)
      setSubmitState({ status: 'success', message: t.success })
      setForm((current) => ({ ...emptyForm, serviceId: current.serviceId, projectType: current.projectType }))
    } catch (error) {
      if (!mountedRef.current) return
      const code = controller.signal.aborted ? 'REQUEST_TIMEOUT' : error instanceof Error ? error.message : 'REQUEST_FAILED'
      const messages: Record<string, string> = {
        INVALID_REQUEST: t.invalidError, WHATSAPP_REQUIRED: t.whatsappError,
        RATE_LIMITED: t.rateError, SERVICE_UNAVAILABLE: t.unavailableError,
        BRIEF_TOO_LONG: lang === 'es' ? 'Acortá la descripción para incluir todos los servicios seleccionados.' : 'Shorten the description to include every selected service.',
        REQUEST_TIMEOUT: lang === 'es' ? 'No pudimos confirmar el envío a tiempo. Consultá por Instagram antes de reenviar para evitar duplicados.' : 'We could not confirm the submission in time. Check with us on Instagram before resending to avoid duplicates.',
      }
      setSubmitState({ status: 'error', message: messages[code] ?? t.genericError })
    } finally {
      window.clearTimeout(timeout)
      if (abortRef.current === controller) abortRef.current = null
      busyRef.current = false
    }
  }

  return (
    <main className="xke-page xke-services xks-page min-h-screen overflow-hidden bg-[#07070c] text-white">
      <SEO
        title={lang === 'es' ? 'Creación Web y Servicios Digitales' : 'Web Creation & Digital Services'}
        description={lang === 'es' ? 'Creación web, acompañamiento con IA, contenido para redes y soporte básico de PC. Elegí servicios y solicitá una propuesta a medida.' : 'Web creation, practical AI guidance, social content and basic PC support. Choose services and request a custom proposal.'}
        url="/creacion-web"
        image="/web-services/creacion-web-og.png"
      />

      <ServiceStudio lang={lang} selection={selection} onChange={updateSelection} onQuote={() => { if (!busyRef.current) { focusStep(1); scrollTo('presupuesto') } }} onStarterQuote={chooseStarterOffer} />
      <details className="xks-reference-catalog"><summary>{lang === 'es' ? '¿Buscás una web? Mirá las referencias de estructura.' : 'Need a website? Explore structure references.'}</summary><p>{lang === 'es' ? 'Orientaciones visuales, no trabajos reales de clientes. Alcance, integraciones y plazos sujetos a propuesta.' : 'Visual directions, not actual client work. Scope, integrations and timing are subject to a proposal.'}</p>{catalogLoading ? <p role="status">{t.catalogLoading}</p> : <div className="xks-reference-options">{displayOffers.map(offer => <button type="button" key={offer.id} onClick={() => chooseOffer(offer)}>{offer.title}<small>{lang === 'es' ? 'Agregar creación web y usar esta referencia →' : 'Add web creation and use this reference →'}</small></button>)}</div>}{catalogNotice && <p role="status">{lang === 'es' ? 'Mostramos referencias base; la disponibilidad se confirma al responder tu consulta.' : 'Showing base references; availability is confirmed when we reply to your inquiry.'}</p>}</details>

      <section id="proceso" className="scroll-mt-28 border-y border-white/10 bg-white/[0.025] px-5 py-16 md:px-10 lg:px-14" aria-labelledby="web-process-title">
        <div className="mx-auto max-w-[1500px]"><p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.processEyebrow}</p><h2 id="web-process-title" className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.035em] md:text-6xl">{t.processTitle}</h2><ol className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{t.process.map(([title, description]) => <li key={title} className="rounded-[1.75rem] border border-white/10 bg-black/25 p-6"><h3 className="font-mono text-xs font-black uppercase tracking-[0.16em] text-purple-200">{title}</h3><p className="mt-4 text-sm leading-6 text-white/60">{description}</p></li>)}</ol></div>
      </section>

      <section id="presupuesto" className="scroll-mt-28 px-5 py-16 md:px-10 lg:px-14" aria-labelledby="web-quote-title">
        <div className="mx-auto grid max-w-[1500px] gap-12 xl:grid-cols-[0.72fr_1.28fr]">
          <div><p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-purple-300">{t.quoteEyebrow}</p><h2 id="web-quote-title" className="mt-4 text-4xl font-black tracking-[-0.035em] md:text-6xl">{t.quoteTitle}</h2><p className="mt-6 max-w-xl text-base leading-8 text-white/65">{t.quoteText}</p><div className="mt-8 rounded-[1.75rem] border border-orange-400/20 bg-orange-400/[0.055] p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-200">{t.privacyLabel}</p><p className="mt-3 text-sm leading-6 text-orange-50/70">{t.privacy}</p></div></div>

          <form ref={quoteFormRef} onSubmit={submitQuote} aria-busy={submitState.status === 'submitting'} className="rounded-[2rem] border border-white/12 bg-gradient-to-br from-purple-500/[0.08] via-black/40 to-orange-500/[0.055] p-6 shadow-[0_35px_100px_rgba(0,0,0,.45)] md:p-9">
            <div className="border-b border-white/10 pb-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/45">{t.quoteStep} {quoteStep} / 2</p><ol className="mt-4 grid grid-cols-2 gap-3" aria-label={t.requestProgress}>{t.quoteSteps.map((label, index) => { const step = (index + 1) as QuoteStep; const active = quoteStep === step; const completed = quoteStep > step; return <li key={label} aria-current={active ? 'step' : undefined} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-[0.12em] ${active ? 'border-orange-300/45 bg-orange-400/10 text-orange-100' : completed ? 'border-purple-300/30 bg-purple-400/10 text-purple-100' : 'border-white/10 bg-black/20 text-white/35'}`}><span className={`grid h-7 w-7 place-items-center rounded-full font-mono text-[10px] ${active ? 'bg-orange-300 text-black' : completed ? 'bg-purple-400 text-black' : 'bg-white/10 text-white/50'}`} aria-hidden={completed}>{completed ? '✓' : step}</span>{label}</li> })}</ol></div>

            <StudioSelectionSummary selection={selection} lang={lang} />
            {starterSelected && <p className="xks-starter-reference">{lang === 'es' ? 'Consultás por Landing Esencial · USD 350 de referencia. Contanos sobre tu negocio para confirmar el presupuesto final en pesos.' : 'Asking about the Essential Landing Page · USD 350 reference price. Tell us about your business to confirm the final quote.'}</p>}
            {submitState.status === 'success' ? <div role="status" aria-live="polite" className="py-10 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-orange-300/40 bg-orange-400/10 text-2xl text-orange-200" aria-hidden="true">✓</span><h3 className="mt-6 text-3xl font-black tracking-[-0.025em]">{t.successTitle}</h3><p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/65">{t.success}</p><p className="xks-reference-id">{lang === 'es' ? 'Referencia: ' : 'Reference: '}{requestId}</p><button type="button" onClick={resetQuote} className="mt-7 rounded-full border border-purple-400/45 bg-purple-500/10 px-6 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-purple-100 transition hover:border-orange-300 hover:text-orange-100">{t.newRequest}</button></div> : <>
              <div className="pt-7"><h3 ref={stepHeadingRef} tabIndex={-1} className="text-2xl font-black tracking-[-0.02em] outline-none md:text-3xl">{quoteStep === 1 ? t.projectStepTitle : t.contactStepTitle}</h3><p className="mt-3 text-sm leading-6 text-white/55">{quoteStep === 1 ? t.projectStepText : t.contactStepText}</p></div>
              {quoteStep === 1 ? <div className="mt-7 grid gap-5 md:grid-cols-2">
                {selection.services.includes('web') ? <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100 md:col-span-2">{t.service}<select value={form.serviceId} onChange={(event) => updateForm('serviceId', event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-orange-300"><option value="">{t.servicePlaceholder}</option>{displayOffers.map((offer) => <option key={offer.id} value={offer.id}>{offer.title}</option>)}</select></label> : null}
                {selectedOffer ? <div className="flex items-center gap-4 rounded-2xl border border-orange-300/20 bg-orange-400/[0.055] p-4 md:col-span-2"><SafeImage src={selectedOffer.image_url} fallback="/web-services/landing-premium.svg" alt="" className="h-16 w-24 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-orange-200">{t.selectedOffer}</p><p className="mt-1 truncate text-sm font-black text-white">{selectedOffer.title}</p></div><button type="button" onClick={() => scrollTo('propuestas')} className="shrink-0 text-[10px] font-black uppercase tracking-[0.12em] text-purple-200 underline decoration-purple-300/40 underline-offset-4">{t.changeOffer}</button></div> : null}
                {selection.services.includes('web') ? <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100">{t.projectType}<select value={form.projectType} onChange={(event) => updateForm('projectType', event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-orange-300">{t.projectTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label> : null}
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100">{t.budget}<select value={form.budgetRange} onChange={(event) => updateForm('budgetRange', event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-orange-300">{t.budgets.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100 md:col-span-2"><span className="flex items-end justify-between gap-4"><span>{t.details}</span><span className="font-mono text-[9px] font-medium normal-case tracking-normal text-white/35">{form.details.length} / {detailsLimit} {t.characters}</span></span><textarea required minLength={20} maxLength={detailsLimit} rows={6} value={form.details} onChange={(event) => updateForm('details', event.target.value)} placeholder={t.detailsPlaceholder} className="rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium leading-6 normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-orange-300" /></label>
              </div> : <div className="mt-7 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100">{t.name}<input required minLength={2} maxLength={80} autoComplete="name" value={form.name} onChange={(event) => updateForm('name', event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-orange-300" /></label>
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100">{t.email}<input required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-orange-300" /></label>
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100">{t.whatsapp}<input required={form.contactPreference === 'whatsapp'} type="tel" maxLength={40} autoComplete="tel" value={form.whatsapp} onChange={(event) => updateForm('whatsapp', event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-orange-300" placeholder="+54 9 …" /></label>
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100">{t.business}<input maxLength={120} autoComplete="organization" value={form.businessName} onChange={(event) => updateForm('businessName', event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-orange-300" /></label>
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100 md:col-span-2">{t.contact}<select value={form.contactPreference} onChange={(event) => updateForm('contactPreference', event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-orange-300">{t.contacts.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label className="flex items-start gap-3 text-sm leading-6 text-white/65 md:col-span-2"><input required type="checkbox" checked={form.consent} onChange={(event) => updateForm('consent', event.target.checked)} className="mt-1 h-4 w-4 accent-orange-500" /><span>{t.consent}</span></label>
              </div>}
              <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label>{t.honeypot}<input tabIndex={-1} autoComplete="off" value={form.companyWebsite} onChange={(event) => updateForm('companyWebsite', event.target.value)} /></label></div>
              {submitState.status === 'submitting' ? <p className="sr-only" role="status" aria-live="polite">{submitState.message}</p> : null}
              {submitState.status === 'error' ? <p role="alert" className="mt-5 rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-100">{submitState.message}</p> : null}
              {quoteStep === 1 ? <button type="button" onClick={continueQuote} className="mt-7 w-full rounded-full bg-gradient-to-r from-orange-500 to-orange-300 px-7 py-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-black shadow-[0_0_34px_rgba(255,106,0,.25)] transition hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(255,106,0,.42)]">{t.nextStep} →</button> : <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row"><button type="button" onClick={() => focusStep(1)} className="rounded-full border border-purple-400/40 bg-purple-500/[0.07] px-6 py-4 font-mono text-xs font-black uppercase tracking-[0.14em] text-purple-100 transition hover:border-purple-300 sm:w-auto">← {t.previousStep}</button><button disabled={submitState.status === 'submitting'} type="submit" className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 px-7 py-4 font-mono text-xs font-black uppercase tracking-[0.18em] text-black shadow-[0_0_34px_rgba(255,106,0,.25)] transition hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(255,106,0,.42)] disabled:cursor-wait disabled:opacity-60">{submitState.status === 'submitting' ? t.submitting : `${t.submit} →`}</button></div>}
            </>}
            <div className="xks-manual-fallback"><p>{lang === 'es' ? 'La consulta no tiene costo. El inicio del trabajo y cualquier pago requieren una propuesta aceptada. No envíes contraseñas, datos bancarios ni documentación confidencial.' : 'The inquiry is free. Starting work and any payment require an accepted proposal. Do not send passwords, banking details or confidential documents.'}</p><a href={STUDIO_INSTAGRAM} target="_blank" rel="noopener noreferrer">{lang === 'es' ? 'También podés consultar por Instagram: @xethkioz' : 'You can also inquire on Instagram: @xethkioz'} ↗</a></div>
          </form>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 md:px-10 lg:px-14">
        <PortalKnowledgeBriefing sector="web" lang={lang} />
      </div>

      <section className="border-t border-white/10 bg-white/[0.02] px-5 py-16 md:px-10 lg:px-14" aria-labelledby="web-faq-title"><div className="mx-auto grid max-w-[1500px] gap-12 xl:grid-cols-[0.7fr_1.3fr]"><div><p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.faqEyebrow}</p><h2 id="web-faq-title" className="mt-4 max-w-xl text-4xl font-black tracking-[-0.035em] md:text-6xl">{t.faqTitle}</h2></div><div className="space-y-3">{t.faqs.map(([question, answer], index) => <details key={question} className="group rounded-[1.5rem] border border-white/10 bg-black/25 open:border-purple-400/35 open:bg-purple-500/[0.055]"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-left text-base font-black marker:hidden md:px-6"><span className="flex items-center gap-4"><span className="font-mono text-[10px] text-orange-300" aria-hidden="true">0{index + 1}</span>{question}</span><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-purple-200 transition group-open:rotate-45 group-open:border-orange-300/40 group-open:text-orange-200" aria-hidden="true">+</span></summary><p className="px-5 pb-6 pr-14 text-sm leading-7 text-white/60 md:px-6 md:pr-20">{answer}</p></details>)}</div></div></section>
      <EditorialCrosslinks />
    </main>
  )
}
