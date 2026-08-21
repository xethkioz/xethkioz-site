import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import SafeImage from '../components/SafeImage'
import SEO from '../components/SEO'
import PortalKnowledgeBriefing from '../components/PortalKnowledgeBriefing'
import { UniverseTransitRail } from '../components/universe/UniverseTransitRail'
import { PortalPulseRail } from '../components/PortalPulseRail'
import { useLang } from '../lib/LangContext'
import { loadPublishedWebServices } from '../services/webServices'
import type { WebServiceOffer } from '../types/webServices'

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
    processTitle: 'Un proceso claro, sin perder la magia.',
    process: [
      ['01 · Descubrimiento', 'Entendemos tu proyecto, audiencia, contenido y objetivo comercial.'],
      ['02 · Diseño', 'Definimos estructura, identidad visual y experiencia responsive antes de construir.'],
      ['03 · Desarrollo', 'Implementamos, probamos rendimiento, accesibilidad, formularios y SEO base.'],
      ['04 · Lanzamiento', 'Publicamos, verificamos el recorrido completo y dejamos una base preparada para crecer.'],
    ],
    quoteEyebrow: 'Contanos tu idea',
    quoteTitle: 'Recibí un presupuesto pensado para tu proyecto.',
    quoteText: 'Completá estos datos y revisamos alcance, tiempos y necesidades. No es una respuesta automática: analizamos cada consulta.',
    quoteStep: 'Paso',
    quoteSteps: ['Proyecto', 'Contacto'],
    requestProgress: 'Progreso de la solicitud',
    projectStepTitle: 'Primero, definamos la idea.',
    projectStepText: 'Elegí una referencia y contanos qué resultado necesitás conseguir.',
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
    details: '¿Qué necesitás construir?',
    detailsPlaceholder: 'Contanos qué hacés, qué secciones imaginás, si ya tenés logo/contenido y qué resultado esperás de la página.',
    consent: 'Acepto que XETHKIOZ use estos datos únicamente para responder esta solicitud de presupuesto.',
    privacyLabel: 'Privacidad',
    honeypot: 'Sitio web de la empresa',
    submit: 'Enviar solicitud',
    submitting: 'Enviando…',
    success: 'Solicitud recibida. Te vamos a contactar con los próximos pasos.',
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
    processTitle: 'A clear process without losing the magic.',
    process: [
      ['01 · Discovery', 'We understand your project, audience, content and commercial goal.'],
      ['02 · Design', 'We define structure, visual identity and responsive experience before building.'],
      ['03 · Development', 'We implement and test performance, accessibility, forms and baseline SEO.'],
      ['04 · Launch', 'We publish, verify the complete journey and leave a foundation ready to grow.'],
    ],
    quoteEyebrow: 'Tell us your idea',
    quoteTitle: 'Get a quote designed around your project.',
    quoteText: 'Share the essentials and we will review scope, timing and needs. This is not an automated response: every inquiry is assessed.',
    quoteStep: 'Step',
    quoteSteps: ['Project', 'Contact'],
    requestProgress: 'Request progress',
    projectStepTitle: 'First, let’s define the idea.',
    projectStepText: 'Choose a reference and tell us what outcome you need to achieve.',
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
    details: 'What do you need to build?',
    detailsPlaceholder: 'Tell us what you do, the sections you imagine, whether you already have a logo/content and what result you expect.',
    consent: 'I agree that XETHKIOZ may use this information only to respond to this quote request.',
    privacyLabel: 'Privacy',
    honeypot: 'Company website',
    submit: 'Send request',
    submitting: 'Sending…',
    success: 'Request received. We will contact you with the next steps.',
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
  const { lang } = useLang()
  const t = copy[lang]
  const quoteFormRef = useRef<HTMLFormElement>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
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

  const displayOffers = useMemo(() => offers.map((offer) => localizeOffer(offer, lang)), [lang, offers])
  const selectedOffer = useMemo(() => displayOffers.find((offer) => offer.id === form.serviceId) ?? null, [displayOffers, form.serviceId])
  const heroOffer = displayOffers[0]

  function updateForm<Key extends keyof QuoteForm>(field: Key, value: QuoteForm[Key]) {
    setForm((current) => ({ ...current, [field]: value }))
    if (submitState.status !== 'idle') setSubmitState({ status: 'idle', message: '' })
  }

  function chooseOffer(offer: WebServiceOffer) {
    setForm((current) => ({ ...current, serviceId: offer.id, projectType: projectTypeByOfferSlug[offer.slug] ?? current.projectType }))
    setQuoteStep(1)
    setSubmitState({ status: 'idle', message: '' })
    scrollTo('presupuesto')
  }

  function focusStep(step: QuoteStep) {
    setQuoteStep(step)
    setSubmitState({ status: 'idle', message: '' })
    window.requestAnimationFrame(() => stepHeadingRef.current?.focus())
  }

  function continueQuote() {
    if (!quoteFormRef.current?.reportValidity()) {
      setSubmitState({ status: 'error', message: t.invalidError })
      return
    }
    focusStep(2)
  }

  function resetQuote() {
    setForm({ ...emptyForm, serviceId: offers[0]?.id ?? '' })
    focusStep(1)
  }

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (quoteStep === 1) {
      continueQuote()
      return
    }
    setSubmitState({ status: 'submitting', message: t.submitting })

    try {
      const response = await fetch('/api/web-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedOffer?.id ?? null,
          serviceSlug: selectedOffer?.slug ?? null,
          name: form.name,
          email: form.email,
          whatsapp: form.whatsapp,
          businessName: form.businessName,
          projectType: form.projectType,
          budgetRange: form.budgetRange,
          contactPreference: form.contactPreference,
          details: form.details,
          consent: form.consent,
          companyWebsite: form.companyWebsite,
          source: '/creacion-web',
        }),
      })
      const payload = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null
      if (!response.ok || !payload?.ok) throw new Error(payload?.error || 'REQUEST_FAILED')
      setSubmitState({ status: 'success', message: t.success })
      setForm((current) => ({ ...emptyForm, serviceId: current.serviceId, projectType: current.projectType, budgetRange: current.budgetRange }))
    } catch (error) {
      const code = error instanceof Error ? error.message : 'REQUEST_FAILED'
      const messages: Record<string, string> = {
        INVALID_REQUEST: t.invalidError,
        WHATSAPP_REQUIRED: t.whatsappError,
        RATE_LIMITED: t.rateError,
        SERVICE_UNAVAILABLE: t.unavailableError,
      }
      setSubmitState({ status: 'error', message: messages[code] ?? t.genericError })
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#07070c] text-white">
      <SEO
        title={lang === 'es' ? 'Creación Web · Diseño y desarrollo a medida' : 'Web Creation · Custom design and development'}
        description={lang === 'es' ? 'Diseño y desarrollo de páginas web, landing pages, tiendas online y sitios profesionales con presupuesto personalizado.' : 'Design and development of websites, landing pages, online stores and professional sites with a custom quote.'}
        url="/creacion-web"
        image="/web-services/creacion-web-og.png"
      />

      <section className="relative isolate px-5 pb-24 pt-36 md:px-10 md:pt-44 lg:px-14" aria-labelledby="web-creation-title">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_18%,rgba(255,106,0,.18),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(139,92,246,.24),transparent_31%),linear-gradient(180deg,#08070d_0%,#0c0914_70%,#07070c_100%)]" />
        <div className="xk-noise absolute inset-0 -z-10 opacity-[0.12]" aria-hidden="true" />
        <div className="mx-auto grid max-w-[1500px] items-center gap-14 xl:grid-cols-[0.92fr_1.08fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-purple-200 transition hover:text-orange-300"><span aria-hidden="true">←</span> {t.backHome}</Link>
            <p className="mt-10 font-mono text-xs font-black uppercase tracking-[0.34em] text-orange-300">{t.eyebrow}</p>
            <h1 id="web-creation-title" className="mt-5 max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.045em] sm:text-6xl lg:text-7xl">{t.title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 md:text-lg">{t.intro}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => scrollTo('propuestas')} className="rounded-full bg-gradient-to-r from-orange-500 to-orange-300 px-7 py-4 font-mono text-xs font-black uppercase tracking-[0.18em] text-black shadow-[0_0_34px_rgba(255,106,0,.28)] transition hover:scale-[1.02] hover:shadow-[0_0_52px_rgba(255,106,0,.48)]">{t.heroPrimary} →</button>
              <button type="button" onClick={() => scrollTo('presupuesto')} className="rounded-full border border-purple-400/50 bg-purple-500/10 px-7 py-4 font-mono text-xs font-black uppercase tracking-[0.18em] text-purple-100 transition hover:border-purple-300 hover:bg-purple-500/20">{t.heroSecondary}</button>
            </div>
            <p className="mt-8 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">{t.heroBadge}</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-orange-500/15 via-purple-500/20 to-cyan-400/10 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-black/55 p-2 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl sm:p-3">
              <div className="flex h-9 items-center gap-2 border-b border-white/10 px-3" aria-hidden="true"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" /><span className="h-2.5 w-2.5 rounded-full bg-purple-400" /><span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /><span className="ml-3 h-3 flex-1 rounded-full bg-white/[0.06]" /></div>
              <SafeImage src={heroOffer?.image_url} fallback="/web-services/landing-premium.svg" alt={heroOffer?.image_alt || t.heroAlt} loading="eager" fetchPriority="high" className="aspect-[12/7.6] w-full rounded-[1.35rem] object-cover" />
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 md:px-10 lg:px-14"><UniverseTransitRail /></div>

      <section className="relative z-10 mt-4 px-5 md:px-10 lg:px-14" aria-label={t.commitmentsLabel}>
        <div className="mx-auto grid max-w-[1500px] gap-3 rounded-[2rem] border border-white/10 bg-[#0c0914]/90 p-3 shadow-[0_28px_90px_rgba(0,0,0,.45)] backdrop-blur-xl md:grid-cols-3">
          {t.trust.map(([title, description], index) => <article key={title} className="rounded-[1.4rem] border border-white/[0.07] bg-white/[0.035] p-5"><div className="flex items-start gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-orange-300/30 bg-orange-400/10 font-mono text-xs font-black text-orange-200" aria-hidden="true">0{index + 1}</span><div><h2 className="font-mono text-xs font-black uppercase tracking-[0.15em] text-white">{title}</h2><p className="mt-2 text-xs leading-5 text-white/55">{description}</p></div></div></article>)}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-16 md:px-10 lg:px-14"><PortalPulseRail tone="gold" eyebrow={t.loop.eyebrow} title={t.loop.title} description={t.loop.description} items={t.loop.items} /></div>

      <section id="propuestas" className="scroll-mt-28 px-5 py-16 md:px-10 lg:px-14" aria-labelledby="web-catalog-title">
        <div className="mx-auto max-w-[1500px]">
          <div className="max-w-3xl"><p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-purple-300">{t.catalogEyebrow}</p><h2 id="web-catalog-title" className="mt-4 text-4xl font-black tracking-[-0.035em] md:text-6xl">{t.catalogTitle}</h2><p className="mt-5 text-base leading-7 text-white/65 md:text-lg">{t.catalogText}</p></div>
          {catalogNotice ? <p className="mt-8 max-w-3xl rounded-2xl border border-orange-400/25 bg-orange-400/[0.07] px-5 py-4 text-sm leading-6 text-orange-100" role="status"><strong className="mr-2 font-black uppercase tracking-[0.12em]">{t.fallbackNotice}:</strong>{lang === 'es' ? catalogNotice : t.fallbackDescription}</p> : null}
          {catalogLoading ? <div className="mt-12 grid gap-7 lg:grid-cols-3" role="status" aria-live="polite" aria-busy="true"><span className="sr-only">{t.catalogLoading}</span>{[0, 1, 2].map((item) => <div key={item} aria-hidden="true" className="h-[580px] animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.035]" />)}</div> : displayOffers.length ? <div className="mt-12 grid gap-7 lg:grid-cols-3">
            {displayOffers.map((offer) => <article key={offer.id} className="group flex overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.065] to-white/[0.025] shadow-[0_28px_80px_rgba(0,0,0,.32)] transition hover:-translate-y-1 hover:border-purple-400/40"><div className="flex w-full flex-col"><div className="relative overflow-hidden border-b border-white/10"><SafeImage src={offer.image_url} fallback="/web-services/landing-premium.svg" alt={offer.image_alt} className="aspect-[12/7.4] w-full object-cover transition duration-700 group-hover:scale-[1.035]" />{offer.featured ? <span className="absolute left-4 top-4 rounded-full border border-orange-300/40 bg-black/70 px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-orange-200 backdrop-blur">{t.featured}</span> : null}</div><div className="flex flex-1 flex-col p-6 md:p-7">{offer.eyebrow ? <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-orange-300">{offer.eyebrow}</p> : null}<h3 className="mt-3 text-3xl font-black tracking-[-0.025em]">{offer.title}</h3><p className="mt-4 text-sm leading-6 text-white/65">{offer.summary}</p><p className="mt-5 font-mono text-xs font-black uppercase tracking-[0.14em] text-purple-200">{offer.price_label}</p>{offer.delivery_label ? <p className="mt-2 text-xs text-white/45">{offer.delivery_label}</p> : null}<div className="mt-6 border-t border-white/10 pt-5"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/45">{t.included}</p><ul className="mt-4 space-y-3 text-sm text-white/70">{offer.features.map((feature) => <li key={feature} className="flex gap-3"><span className="text-orange-300" aria-hidden="true">◆</span><span>{feature}</span></li>)}</ul></div><button type="button" onClick={() => chooseOffer(offer)} className="mt-8 w-full rounded-full border border-purple-400/45 bg-purple-500/10 px-5 py-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-purple-100 transition hover:border-orange-300 hover:bg-orange-400/10 hover:text-orange-100">{offer.cta_label} →</button></div></div></article>)}
          </div> : <p className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-white/65" role="status">{t.catalogEmpty}</p>}
        </div>
      </section>

      <section id="proceso" className="scroll-mt-28 border-y border-white/10 bg-white/[0.025] px-5 py-16 md:px-10 lg:px-14" aria-labelledby="web-process-title">
        <div className="mx-auto max-w-[1500px]"><p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.processEyebrow}</p><h2 id="web-process-title" className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.035em] md:text-6xl">{t.processTitle}</h2><ol className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{t.process.map(([title, description]) => <li key={title} className="rounded-[1.75rem] border border-white/10 bg-black/25 p-6"><h3 className="font-mono text-xs font-black uppercase tracking-[0.16em] text-purple-200">{title}</h3><p className="mt-4 text-sm leading-6 text-white/60">{description}</p></li>)}</ol></div>
      </section>

      <section id="presupuesto" className="scroll-mt-28 px-5 py-16 md:px-10 lg:px-14" aria-labelledby="web-quote-title">
        <div className="mx-auto grid max-w-[1500px] gap-12 xl:grid-cols-[0.72fr_1.28fr]">
          <div><p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-purple-300">{t.quoteEyebrow}</p><h2 id="web-quote-title" className="mt-4 text-4xl font-black tracking-[-0.035em] md:text-6xl">{t.quoteTitle}</h2><p className="mt-6 max-w-xl text-base leading-8 text-white/65">{t.quoteText}</p><div className="mt-8 rounded-[1.75rem] border border-orange-400/20 bg-orange-400/[0.055] p-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-200">{t.privacyLabel}</p><p className="mt-3 text-sm leading-6 text-orange-50/70">{t.privacy}</p></div></div>

          <form ref={quoteFormRef} onSubmit={submitQuote} aria-busy={submitState.status === 'submitting'} className="rounded-[2rem] border border-white/12 bg-gradient-to-br from-purple-500/[0.08] via-black/40 to-orange-500/[0.055] p-6 shadow-[0_35px_100px_rgba(0,0,0,.45)] md:p-9">
            <div className="border-b border-white/10 pb-6"><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/45">{t.quoteStep} {quoteStep} / 2</p><ol className="mt-4 grid grid-cols-2 gap-3" aria-label={t.requestProgress}>{t.quoteSteps.map((label, index) => { const step = (index + 1) as QuoteStep; const active = quoteStep === step; const completed = quoteStep > step; return <li key={label} aria-current={active ? 'step' : undefined} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-[0.12em] ${active ? 'border-orange-300/45 bg-orange-400/10 text-orange-100' : completed ? 'border-purple-300/30 bg-purple-400/10 text-purple-100' : 'border-white/10 bg-black/20 text-white/35'}`}><span className={`grid h-7 w-7 place-items-center rounded-full font-mono text-[10px] ${active ? 'bg-orange-300 text-black' : completed ? 'bg-purple-400 text-black' : 'bg-white/10 text-white/50'}`} aria-hidden={completed}>{completed ? '✓' : step}</span>{label}</li> })}</ol></div>

            {submitState.status === 'success' ? <div role="status" aria-live="polite" className="py-10 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-orange-300/40 bg-orange-400/10 text-2xl text-orange-200" aria-hidden="true">✓</span><h3 className="mt-6 text-3xl font-black tracking-[-0.025em]">{t.successTitle}</h3><p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/65">{t.success}</p><button type="button" onClick={resetQuote} className="mt-7 rounded-full border border-purple-400/45 bg-purple-500/10 px-6 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-purple-100 transition hover:border-orange-300 hover:text-orange-100">{t.newRequest}</button></div> : <>
              <div className="pt-7"><h3 ref={stepHeadingRef} tabIndex={-1} className="text-2xl font-black tracking-[-0.02em] outline-none md:text-3xl">{quoteStep === 1 ? t.projectStepTitle : t.contactStepTitle}</h3><p className="mt-3 text-sm leading-6 text-white/55">{quoteStep === 1 ? t.projectStepText : t.contactStepText}</p></div>
              {quoteStep === 1 ? <div className="mt-7 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100 md:col-span-2">{t.service}<select value={form.serviceId} onChange={(event) => updateForm('serviceId', event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-orange-300"><option value="">{t.servicePlaceholder}</option>{displayOffers.map((offer) => <option key={offer.id} value={offer.id}>{offer.title}</option>)}</select></label>
                {selectedOffer ? <div className="flex items-center gap-4 rounded-2xl border border-orange-300/20 bg-orange-400/[0.055] p-4 md:col-span-2"><SafeImage src={selectedOffer.image_url} fallback="/web-services/landing-premium.svg" alt="" className="h-16 w-24 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-orange-200">{t.selectedOffer}</p><p className="mt-1 truncate text-sm font-black text-white">{selectedOffer.title}</p></div><button type="button" onClick={() => scrollTo('propuestas')} className="shrink-0 text-[10px] font-black uppercase tracking-[0.12em] text-purple-200 underline decoration-purple-300/40 underline-offset-4">{t.changeOffer}</button></div> : null}
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100">{t.projectType}<select value={form.projectType} onChange={(event) => updateForm('projectType', event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-orange-300">{t.projectTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100">{t.budget}<select value={form.budgetRange} onChange={(event) => updateForm('budgetRange', event.target.value)} className="min-h-12 rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition focus:border-orange-300">{t.budgets.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100 md:col-span-2"><span className="flex items-end justify-between gap-4"><span>{t.details}</span><span className="font-mono text-[9px] font-medium normal-case tracking-normal text-white/35">{form.details.length} / 2000 {t.characters}</span></span><textarea required minLength={20} maxLength={2000} rows={7} value={form.details} onChange={(event) => updateForm('details', event.target.value)} placeholder={t.detailsPlaceholder} className="rounded-2xl border border-white/12 bg-[#0d0b14] px-4 py-3 text-sm font-medium leading-6 normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-orange-300" /></label>
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
          </form>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 md:px-10 lg:px-14">
        <PortalKnowledgeBriefing sector="web" lang={lang} />
      </div>

      <section className="border-t border-white/10 bg-white/[0.02] px-5 py-16 md:px-10 lg:px-14" aria-labelledby="web-faq-title"><div className="mx-auto grid max-w-[1500px] gap-12 xl:grid-cols-[0.7fr_1.3fr]"><div><p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.faqEyebrow}</p><h2 id="web-faq-title" className="mt-4 max-w-xl text-4xl font-black tracking-[-0.035em] md:text-6xl">{t.faqTitle}</h2></div><div className="space-y-3">{t.faqs.map(([question, answer], index) => <details key={question} className="group rounded-[1.5rem] border border-white/10 bg-black/25 open:border-purple-400/35 open:bg-purple-500/[0.055]"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-left text-base font-black marker:hidden md:px-6"><span className="flex items-center gap-4"><span className="font-mono text-[10px] text-orange-300" aria-hidden="true">0{index + 1}</span>{question}</span><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-purple-200 transition group-open:rotate-45 group-open:border-orange-300/40 group-open:text-orange-200" aria-hidden="true">+</span></summary><p className="px-5 pb-6 pr-14 text-sm leading-7 text-white/60 md:px-6 md:pr-20">{answer}</p></details>)}</div></div></section>
    </main>
  )
}
