export type WispPortalKey = 'home' | 'gaming' | 'tech' | 'ai' | 'science' | 'green-node' | 'community' | 'studio'

export type WispForm = {
  key: WispPortalKey
  name: string
  label: string
  aura: string
  message: string
  actionLabel: string
  route: string
}

export const GREEN_WISP_FORMS: Record<WispPortalKey, WispForm> = {
  home: {
    key: 'home',
    name: 'XETHKIOZ Wisp',
    label: 'Forma etérea base',
    aura: 'violeta / naranja / verde',
    message: 'Soy la forma etérea de XETHKIOZ. Te guío por el ecosistema sin tapar el contenido.',
    actionLabel: 'Explorar el ecosistema',
    route: '/news',
  },
  gaming: {
    key: 'gaming',
    name: 'Battle Wisp',
    label: 'Modo Gaming',
    aura: 'naranja eléctrico',
    message: 'Detecté ruta gamer: noticias, directos, comunidad y próximos análisis.',
    actionLabel: 'Ir a Gaming',
    route: '/gaming',
  },
  tech: {
    key: 'tech',
    name: 'Tech Wisp',
    label: 'Modo Tecnología',
    aura: 'azul / violeta',
    message: 'Hardware, software, IA aplicada y herramientas para creadores.',
    actionLabel: 'Ir a Tech Lab',
    route: '/tech',
  },
  ai: {
    key: 'ai',
    name: 'Neural Wisp',
    label: 'Modo IA',
    aura: 'violeta / azul eléctrico',
    message: 'IA, automatización y asistentes integrados al futuro del portal.',
    actionLabel: 'Ir a AI Lab',
    route: '/ai-lab',
  },
  science: {
    key: 'science',
    name: 'Evidence Wisp',
    label: 'Modo Ciencia',
    aura: 'blanco / celeste',
    message: 'Ciencia, evidencia y divulgación clara para una comunidad curiosa.',
    actionLabel: 'Ir a Science Lab',
    route: '/science',
  },
  'green-node': {
    key: 'green-node',
    name: 'Green Wisp',
    label: 'Forma evolucionada',
    aura: 'verde hacker',
    message: 'Entraste al nodo donde la forma etérea evoluciona: Linux, programación, ciberseguridad defensiva y laboratorio.',
    actionLabel: 'Abrir Green Node',
    route: '/green-node',
  },
  community: {
    key: 'community',
    name: 'Signal Wisp',
    label: 'Modo Comunidad',
    aura: 'verde / naranja',
    message: 'Conecta usuarios, chat público, eventos y reputación sin romper la experiencia.',
    actionLabel: 'Ir a Comunidad',
    route: '/community',
  },
  studio: {
    key: 'studio',
    name: 'Core Wisp',
    label: 'Modo Interno',
    aura: 'verde / violeta',
    message: 'Herramientas internas de CMS, QA y roadmap. Visibles solo como backstage del ecosistema.',
    actionLabel: 'Ir al CMS',
    route: '/cms',
  },
}

export function getWispPortalForPath(pathname: string): WispForm {
  if (pathname.startsWith('/green-node')) return GREEN_WISP_FORMS['green-node']
  if (pathname.startsWith('/gaming') || pathname.startsWith('/streaming')) return GREEN_WISP_FORMS.gaming
  if (pathname.startsWith('/tech')) return GREEN_WISP_FORMS.tech
  if (pathname.startsWith('/ai-lab')) return GREEN_WISP_FORMS.ai
  if (pathname.startsWith('/science')) return GREEN_WISP_FORMS.science
  if (pathname.startsWith('/community')) return GREEN_WISP_FORMS.community
  if (pathname.startsWith('/cms') || pathname.startsWith('/admin') || pathname.startsWith('/qa') || pathname.startsWith('/milestones') || pathname.startsWith('/content-system')) return GREEN_WISP_FORMS.studio
  return GREEN_WISP_FORMS.home
}

export const v7Principles = [
  'Un propósito por pantalla.',
  'Contenido primero; herramientas internas fuera de la experiencia pública.',
  'Green Wisp es XETHKIOZ en forma etérea y evoluciona según el portal.',
  'Rendimiento, móvil y estabilidad antes de sumar funciones.',
  'Cada release se revisa dos veces antes de publicarse.',
]
