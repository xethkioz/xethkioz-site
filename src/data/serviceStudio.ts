export type StudioLang = 'es' | 'en'
export type ServiceId = 'web' | 'ia' | 'contenido' | 'pc'
type Bilingual = Record<StudioLang, string>
export type StudioService = { id: ServiceId; code: string; title: Bilingual; intro: Bilingual; scope: Record<StudioLang, readonly string[]>; limit: Bilingual }
export type StudioExtra = { id: string; title: Bilingual; for: readonly ServiceId[] }
export type StudioSelection = { services: ServiceId[]; extras: string[] }
export const STUDIO_SELECTION_KEY = 'xethkioz.services.selection.v1'
export const STUDIO_INSTAGRAM = 'https://www.instagram.com/xethkioz/'
export const STUDIO_SERVICES: readonly StudioService[] = [
  { id: 'web', code: '01', title: { es: 'Creación web', en: 'Web creation' },
    intro: { es: 'Un lugar propio para mostrar tu marca y recibir consultas.', en: 'Your own place to present your brand and receive inquiries.' },
    scope: { es: ['Web de presentación adaptable a celular', 'Estructura, contacto y contenido organizado', 'Diseño, revisiones y guía según alcance acordado'], en: ['A mobile-ready presentation website', 'Structure, contact and organized content', 'Design, revisions and guidance within agreed scope'] },
    limit: { es: 'Dominio, alojamiento, tienda, pagos, reservas e integraciones se evalúan y cotizan por separado.', en: 'Domain, hosting, store, payments, bookings and integrations are assessed and quoted separately.' } },
  { id: 'ia', code: '02', title: { es: 'IA aplicada', en: 'Practical AI' },
    intro: { es: 'Aprendé a usar IA para una tarea que realmente necesitás resolver.', en: 'Learn to use AI for a task you actually need to solve.' },
    scope: { es: ['Objetivo y herramientas adecuados a tu caso', 'Ejercicios guiados con datos de ejemplo', 'Prompts, plantillas y revisión de respuestas'], en: ['A goal and tools suited to your use case', 'Guided exercises with sample data', 'Prompts, templates and response review'] },
    limit: { es: 'Acompañamiento práctico, no certificación oficial ni promesa de ingresos. Las suscripciones externas no están incluidas. No necesitamos datos sensibles.', en: 'Practical guidance, not official certification or an income promise. External subscriptions are not included. Sensitive data is not required.' } },
  { id: 'contenido', code: '03', title: { es: 'Contenido y diseño', en: 'Content & design' },
    intro: { es: 'Dale coherencia a lo que publicás, desde un texto hasta una pieza visual.', en: 'Make what you publish feel coherent, from copy to a visual piece.' },
    scope: { es: ['Textos y piezas para redes', 'Flyers, banners o edición según el pedido', 'Formatos y revisiones definidos en la propuesta'], en: ['Copy and visual pieces for social media', 'Flyers, banners or editing for your brief', 'Formats and revisions defined in the proposal'] },
    limit: { es: 'No incluye automáticamente gestión mensual de cuentas, publicidad paga ni atención de mensajes. Sólo se utiliza material propio o autorizado.', en: 'Monthly account management, paid advertising and inbox handling are not automatically included. Only owned or authorized material is used.' } },
  { id: 'pc', code: '04', title: { es: 'Soporte de PC', en: 'PC support' },
    intro: { es: 'Ayuda concreta para entender un problema y ordenar tu entorno de trabajo.', en: 'Practical help to understand an issue and organize your workspace.' },
    scope: { es: ['Diagnóstico inicial de un problema definido', 'Asistencia con Windows y configuración básica', 'Pasos de mejora y explicación de lo realizado'], en: ['Initial diagnosis of a specific issue', 'Windows and basic configuration assistance', 'Improvement steps and an explanation of the work'] },
    limit: { es: 'Sujeto a diagnóstico y acceso autorizado. No garantiza reparación, recuperación de archivos ni una cantidad de FPS. No envíes contraseñas por el formulario.', en: 'Subject to diagnosis and authorized access. No guaranteed repair, file recovery or FPS figure. Do not send passwords through the form.' } },
]
export const STUDIO_EXTRAS: readonly StudioExtra[] = [
  { id: 'identidad', title: { es: 'Identidad visual', en: 'Visual identity' }, for: ['web', 'contenido'] },
  { id: 'textos', title: { es: 'Textos para mi marca', en: 'Brand copy' }, for: ['web', 'contenido'] },
  { id: 'formatos', title: { es: 'Adaptaciones para redes', en: 'Social media adaptations' }, for: ['contenido', 'web'] },
  { id: 'plantilla', title: { es: 'Plantilla reutilizable', en: 'Reusable template' }, for: ['ia', 'contenido'] },
  { id: 'capacitacion', title: { es: 'Sesión de acompañamiento', en: 'Guided session' }, for: ['web', 'ia', 'pc'] },
  { id: 'seguimiento', title: { es: 'Seguimiento posterior', en: 'Follow-up support' }, for: ['web', 'ia', 'pc', 'contenido'] },
]
export const STUDIO_BUNDLES: readonly { id: string; title: Bilingual; services: ServiceId[]; note: Bilingual }[] = [
  { id: 'presencia', title: { es: 'Lanzar mi marca', en: 'Launch my brand' }, services: ['web', 'contenido'], note: { es: 'Web + contenido para presentarte.', en: 'Web + content to introduce your brand.' } },
  { id: 'herramientas', title: { es: 'Trabajar mejor', en: 'Work better' }, services: ['ia', 'pc'], note: { es: 'IA práctica + soporte de tu entorno.', en: 'Practical AI + workspace support.' } },
  { id: 'crear', title: { es: 'Crear con intención', en: 'Create with purpose' }, services: ['contenido', 'ia'], note: { es: 'Contenido + herramientas para continuar.', en: 'Content + tools to keep creating.' } },
]
export function normalizeSelection(value: unknown): StudioSelection {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const requested = Array.isArray(input.services) ? input.services.slice(0, 20) : []
  const services = STUDIO_SERVICES.filter(service => requested.includes(service.id)).map(service => service.id)
  const extraIds = Array.isArray(input.extras) ? input.extras.slice(0, 20) : []
  const extras = STUDIO_EXTRAS.filter(extra => extraIds.includes(extra.id) && extra.for.some(id => services.includes(id))).map(extra => extra.id)
  return { services, extras }
}
export function readStudioSelection(): StudioSelection {
  if (typeof window === 'undefined') return { services: [], extras: [] }
  const params = new URLSearchParams(window.location.search)
  if (params.has('servicios')) return normalizeSelection({ services: (params.get('servicios') || '').split(','), extras: (params.get('extras') || '').split(',') })
  try { return normalizeSelection(JSON.parse(sessionStorage.getItem(STUDIO_SELECTION_KEY) || '{}')) } catch { return { services: [], extras: [] } }
}
export function studioBriefHeader(selection: StudioSelection, lang: StudioLang): string {
  const safe = normalizeSelection(selection)
  const names = STUDIO_SERVICES.filter(s => safe.services.includes(s.id)).map(s => s.title[lang]).join(' + ')
  const extras = STUDIO_EXTRAS.filter(e => safe.extras.includes(e.id)).map(e => e.title[lang]).join(', ')
  return lang === 'es'
    ? `CONSULTA DE SERVICIOS XETHKIOZ\nServicios: ${names}\nExtras a evaluar: ${extras || 'Sin extras'}\nModalidad: presupuesto a medida, sin compra ni cobro automático.\n\nMi proyecto:\n`
    : `XETHKIOZ SERVICE INQUIRY\nServices: ${names}\nExtras to assess: ${extras || 'No extras'}\nMode: custom quote, no automatic purchase or charge.\n\nMy project:\n`
}
export function studioDetailsLimit(selection: StudioSelection): number {
  return 2000 - Math.max(studioBriefHeader(selection, 'es').length, studioBriefHeader(selection, 'en').length)
}
export function buildStudioBrief(selection: StudioSelection, lang: StudioLang, details: string): string {
  const clean = details.trim()
  if (clean.length > studioDetailsLimit(selection)) throw new Error('BRIEF_TOO_LONG')
  return studioBriefHeader(selection, lang) + clean
}
export function studioSelectionUrl(selection: StudioSelection, lang: StudioLang): string {
  const safe = normalizeSelection(selection)
  const url = new URL(`${lang === 'en' ? '/en' : ''}/creacion-web`, 'https://www.xethkioz.com.ar')
  url.searchParams.set('servicios', safe.services.join(','))
  if (safe.extras.length) url.searchParams.set('extras', safe.extras.join(','))
  url.hash = 'presupuesto'
  return url.toString()
}
export async function copyStudioText(value: string): Promise<boolean> {
  try { if (!navigator.clipboard?.writeText) return false; await navigator.clipboard.writeText(value); return true } catch { return false }
}
