export const SITE_VERSION = 'v4.0.0-rc.1.7'
export const SITE_RELEASE = 'XETHKIOZ Network Layout Isolation + Green Node Video Polish'
export const SITE_BUILD_DATE = '2026-06-25'
export const SITE_DOMAIN = 'https://xethkioz.com.ar'

export const DONATION_LINKS = {
  paypal: 'https://www.paypal.com/ncp/payment/5ZYB8NGEGC8AS',
  mercadoPago: 'https://link.mercadopago.com.ar/xethkioz',
}

export const SOCIAL_LINKS = [
  { name: 'Web', handle: 'xethkioz.com.ar', url: SITE_DOMAIN, icon: '🌐', verified: true },
  { name: 'Instagram', handle: '@xethkioz', url: 'https://www.instagram.com/xethkioz', icon: '📸', verified: true },
  { name: 'Threads', handle: '@xethkioz', url: 'https://www.threads.com/@xethkioz', icon: '🧵', verified: true },
  { name: 'TikTok Principal', handle: '@xethkioz0', url: 'https://www.tiktok.com/@xethkioz0', icon: '🎵', verified: true },
  { name: 'TikTok Asia', handle: '@xethkioz.asia', url: 'https://www.tiktok.com/@xethkioz.asia', icon: '🌏', verified: true },
  { name: 'YouTube', handle: '@XETHKIOZ', url: 'https://www.youtube.com/@XETHKIOZ', icon: '▶️', verified: false },
  { name: 'Twitch', handle: 'xethkioz', url: 'https://www.twitch.tv/xethkioz', icon: '🟣', verified: true },
  { name: 'Kick', handle: 'xethkioz', url: 'https://kick.com/xethkioz', icon: '🟢', verified: true },
]

export const STREAM_LINKS = {
  twitch: 'https://www.twitch.tv/xethkioz',
  kick: 'https://kick.com/xethkioz',
  youtube: 'https://www.youtube.com/@XETHKIOZ',
  tiktok: 'https://www.tiktok.com/@xethkioz0',
}

export const XETHKIOZ_STATS = {
  threadsViews: '1.6M+',
  instagramViews: '46K+',
  averageShortViews: '40K–70K',
  projectTagline: 'Gaming • Tecnología • IA • Ciencia • Streaming',
}

export const CONTENT_SECTIONS = {
  gaming: ['Esports', 'MMORPG', 'Pokémon', 'LoL', 'Mobile Legends', 'Fortnite', 'GTA VI', 'Asia Gaming'],
  tech: ['IA', 'Hardware', 'Ciberseguridad', 'Software', 'Streaming Tech', 'Creadores'],
  science: ['Astronomía', 'Espacio', 'Medicina', 'Biología', 'Fake News', 'Pensamiento crítico'],
  streaming: ['Kick', 'Twitch', 'YouTube', 'Shorts', 'OBS', 'Clips'],
}


export const XETHKIOZ_NETWORK_PORTALS = [
  {
    id: 'gaming-tech',
    name: 'Gaming & Technology',
    path: '/gaming',
    status: 'core',
    accent: 'orange',
    description: 'Portal principal: gaming, tecnología, hardware, IA aplicada, streaming y cultura gamer.'
  },
  {
    id: 'science-lab',
    name: 'Science Lab',
    path: '/science',
    status: 'formal',
    accent: 'blue',
    description: 'Divulgación científica profesional, informes, fuentes verificables y análisis responsable.'
  },
  {
    id: 'green-node',
    name: 'Green Node',
    path: '/green-node',
    status: 'hidden',
    accent: 'green',
    description: 'Linux, programación, ciberseguridad educativa, OSINT y misterios documentales.'
  },
  {
    id: 'asia-gaming',
    name: 'Asia Gaming',
    path: '/gaming?focus=asia',
    status: 'branch',
    accent: 'red',
    description: 'Gaming asiático, esports mobile, tendencias de Corea, Japón, China y SEA.'
  },
  {
    id: 'ai-lab',
    name: 'AI Lab',
    path: '/tech?focus=ai',
    status: 'planned',
    accent: 'cyan',
    description: 'Modelos, prompts, automatizaciones y herramientas de IA.'
  },

  {
    id: 'content-os',
    name: 'Content OS',
    path: '/content-system',
    status: 'branch',
    accent: 'orange',
    description: 'Sistema editorial que separa noticias propias, radar externo, informes, videos, comunidad y SEO.'
  },
  {
    id: 'creator-studio',
    name: 'Creator Studio',
    path: '/streaming',
    status: 'branch',
    accent: 'purple',
    description: 'OBS, Kick, Twitch, YouTube, audio, video y producción de contenido.'
  }
] as const

export const GREEN_NODE_CONFIG = {
  name: 'XETHKIOZ // GREEN NODE',
  slug: 'green-node',
  path: '/green-node',
  accessLabel: '>_',
  safetyNote: 'Contenido educativo y documental. Ciberseguridad defensiva, programación, Linux y análisis crítico de misterios. No se promueve actividad ilegal ni se presentan hipótesis como hechos.',
  musicReference: 'Usar audio propio/IA sin copyright; el enlace de YouTube queda solo como referencia estética.',
  youtubeReference: 'https://www.youtube.com/watch?v=AijCmiLi544',
  accessMethods: ['wisp-click', 'terminal-command', 'future-secret-keyword'],
}

export const VERIFIED_LINKS = [
  { area: 'Dominio', label: 'Web oficial', url: SITE_DOMAIN, status: 'confirmed' },
  { area: 'Gaming & Tech', label: 'Portal Gaming', url: '/gaming', status: 'internal' },
  { area: 'Science Lab', label: 'Portal Ciencia', url: '/science', status: 'internal' },
  { area: 'Network', label: 'Mapa del ecosistema', url: '/network', status: 'internal' },
  { area: 'Content OS', label: 'Sistema editorial', url: '/content-system', status: 'internal' },
  { area: 'QA', label: 'Revisión final', url: '/qa', status: 'internal' },
  { area: 'Green Node', label: 'Acceso oculto por Wisp', url: '/green-node', status: 'hidden' },
  { area: 'Streaming', label: 'Twitch', url: STREAM_LINKS.twitch, status: 'confirmed' },
  { area: 'Streaming', label: 'Kick', url: STREAM_LINKS.kick, status: 'confirmed' },
  { area: 'Redes', label: 'Instagram', url: 'https://www.instagram.com/xethkioz', status: 'confirmed' },
  { area: 'Redes', label: 'Threads', url: 'https://www.threads.com/@xethkioz', status: 'confirmed' },
  { area: 'Redes', label: 'TikTok principal', url: 'https://www.tiktok.com/@xethkioz0', status: 'confirmed' },
  { area: 'Redes', label: 'TikTok Asia', url: 'https://www.tiktok.com/@xethkioz.asia', status: 'confirmed' },
] as const



export const NETWORK_SECTORS_DETAILED = [
  {
    id: 'gaming-tech',
    icon: '🎮',
    title: 'Gaming & Technology',
    tone: 'violeta / naranja',
    route: '/gaming',
    status: 'core-live',
    priority: 'Portal principal',
    focus: ['Noticias gamer', 'Hardware', 'IA aplicada', 'Streaming', 'Esports', 'Asia Gaming'],
    next: 'Cerrar contenido editorial y conectar CMS con artículos reales.'
  },
  {
    id: 'science-lab',
    icon: '🔬',
    title: 'Science Lab',
    tone: 'azul / blanco / institucional',
    route: '/science',
    status: 'formal-division',
    priority: 'Alta',
    focus: ['Informes', 'Fuentes', 'Evidencia', 'Papers', 'Divulgación responsable'],
    next: 'Separar estética y preparar campos DOI/fuente/nivel de evidencia.'
  },
  {
    id: 'green-node',
    icon: '🟢',
    title: 'Green Node',
    tone: 'verde neón / negro / glitch',
    route: '/green-node',
    status: 'hidden-egg',
    priority: 'Experiencia especial',
    focus: ['Ubuntu', 'Linux', 'Programación', 'Ciberseguridad educativa', 'OSINT', 'Misterios documentales'],
    next: 'Mejorar Wisp, portal y lógica de desbloqueo sin saturar el header.'
  },
  {
    id: 'ai-lab',
    icon: '🤖',
    title: 'AI Lab',
    tone: 'cian / violeta',
    route: '/tech?focus=ai',
    status: 'planned',
    priority: 'Media',
    focus: ['Modelos', 'Prompts', 'Automatización', 'Redacción asistida', 'SEO IA'],
    next: 'Nacer como módulo interno del CMS antes de tener página propia.'
  },

  {
    id: 'content-os',
    icon: '🧭',
    title: 'Content OS',
    tone: 'naranja / documentación / QA',
    route: '/content-system',
    status: 'rc1.6',
    priority: 'Alta',
    focus: ['Noticias propias', 'Radar externo', 'Science reports', 'Videos', 'SEO', 'QA'],
    next: 'Conectar CMS real, cola editorial y automatizaciones controladas.'
  },
  {
    id: 'creator-studio',
    icon: '🎥',
    title: 'Creator Studio',
    tone: 'violeta / magenta',
    route: '/streaming',
    status: 'branch',
    priority: 'Media',
    focus: ['OBS', 'Kick', 'Twitch', 'YouTube', 'Overlays', 'Audio y video'],
    next: 'Unificar herramientas de stream, clips y panel de recursos.'
  },
  {
    id: 'community-os',
    icon: '💬',
    title: 'Community OS',
    tone: 'naranja / violeta / roles',
    route: '/community',
    status: 'foundation',
    priority: 'Alta',
    focus: ['Perfiles', 'XP', 'Insignias', 'Chat', 'Moderación', 'Donadores'],
    next: 'Conectar reputación con Supabase y reglas de moderación temporal.'
  }
] as const

export const GREEN_NODE_EASTER_EGGS = [
  { trigger: 'click-wisp', label: 'Wisp flotante', effect: 'Abre portal verde y redirige a /green-node', state: 'activo' },
  { trigger: 'greennode', label: 'Secuencia secreta', effect: 'Escribiendo greennode en cualquier página se activa el portal', state: 'activo' },
  { trigger: 'sudo truth', label: 'Terminal EGG', effect: 'Activa respuesta documental: truth requires evidence', state: 'activo mock' },
  { trigger: 'matrix', label: 'Glitch EGG', effect: 'Prepara modo visual hacker / scanlines', state: 'activo mock' },
  { trigger: '42', label: 'Analyst fragment', effect: 'Referencia oculta y futuro logro', state: 'preparado' },
  { trigger: 'ubuntu', label: 'Linux branch', effect: 'Abre línea editorial Ubuntu/Linux/Open Source', state: 'activo mock' },
]

export const LIVE_INTERNAL_LINKS = [
  '/', '/news', '/gaming', '/tech', '/science', '/streaming', '/media', '/community', '/network', '/news-engine', '/roles', '/cms', '/live-checklist', '/chat-overlay', '/green-node'
] as const

export const SCIENCE_LAB_POLICY = {
  name: 'Science Lab Editorial Policy',
  tone: 'formal, verificable, sobrio y separado del lenguaje gamer',
  requiredFields: ['fuente', 'fecha', 'autor', 'nivel de evidencia', 'enlace original', 'contexto', 'limitaciones'],
  allowedEvidence: ['paper revisado', 'preprint', 'comunicado institucional', 'informe técnico', 'divulgación', 'opinión editorial marcada'],
  rule: 'No publicar afirmaciones científicas como absolutas si la evidencia es preliminar o especulativa.',
}


export const DATABASE_BASELINE_MODULES = [
  { table: 'profiles', purpose: 'Identidad única del usuario en toda la red.', status: 'core' },
  { table: 'roles / permissions', purpose: 'Admin, editor, moderador, autor, donador, sponsor y usuario.', status: 'required' },
  { table: 'articles / categories / tags', purpose: 'Contenido propio y editorial del CMS.', status: 'core' },
  { table: 'external_news_items', purpose: 'Noticias externas con atribución y revisión humana.', status: 'pipeline' },
  { table: 'science_reports / science_sources', purpose: 'Informes formales con evidencia, fuente, DOI y revisión.', status: 'formal' },
  { table: 'network_modules', purpose: 'Mapa de XETHKIOZ Network y portales internos.', status: 'core' },
  { table: 'wisp_events / green_node_unlocks', purpose: 'EGG, acceso oculto, portal verde y logros futuros.', status: 'special' },
  { table: 'chat_rooms / chat_messages', purpose: 'Comunidad y futuro Supabase Realtime.', status: 'realtime-ready' },
  { table: 'xp_events / achievements', purpose: 'Escalafón, insignias, reputación y moderación temporal.', status: 'community' },
  { table: 'cms_publication_jobs', purpose: 'Borradores, programación, revisión y publicación.', status: 'admin' },
] as const

export const RC15_REVIEW_CHECKLIST = [
  'No publicar LIVE sin ejecutar npm run build en Windows local.',
  'No subir .env, node_modules, dist ni tsconfig.tsbuildinfo.',
  'Aplicar migraciones SQL en Supabase solo después de backup.',
  'Verificar rutas internas principales: /, /network, /science, /green-node, /cms, /roles, /news-engine.',
  'Mantener Green Node como experiencia educativa/documental, no como guía ofensiva.',
  'Mantener Science Lab con tono formal, fuentes y evidencia.',
] as const
