export type EditorialPriority = 'alta' | 'media' | 'baja'
export type EditorialStatus = 'listo' | 'en-progreso' | 'pendiente' | 'revision'

export interface EditorialSlot {
  id: string
  portal: string
  title: string
  priority: EditorialPriority
  status: EditorialStatus
  goal: string
  nextAction: string
}

export interface PublishingLane {
  id: string
  name: string
  cadence: string
  source: string
  output: string
  owner: string
}

export const editorialSlots: EditorialSlot[] = [
  {
    id: 'home-hero',
    portal: 'Home',
    title: 'Hero principal',
    priority: 'alta',
    status: 'revision',
    goal: 'Mostrar una sola historia fuerte y tres accesos claros: noticias, comunidad y Network.',
    nextAction: 'Elegir una noticia destacada real y reemplazar el contenido temporal.',
  },
  {
    id: 'gaming-daily',
    portal: 'Gaming & Tech',
    title: 'Radar gamer diario',
    priority: 'alta',
    status: 'en-progreso',
    goal: 'Cargar noticias reales de gaming, hardware, IA aplicada al juego y lanzamientos.',
    nextAction: 'Seleccionar 5 titulares diarios y convertir 1 en artículo propio.',
  },
  {
    id: 'science-formal',
    portal: 'Science Lab',
    title: 'Informes verificados',
    priority: 'alta',
    status: 'en-progreso',
    goal: 'Separar ciencia formal de noticias gamer con fuentes, revisión y evidencia.',
    nextAction: 'Cargar 3 informes base con fuente, DOI/enlace y fecha de revisión.',
  },
  {
    id: 'green-node-editorial',
    portal: 'Green Node',
    title: 'Logs educativos',
    priority: 'media',
    status: 'revision',
    goal: 'Linux, programación, OSINT ético y misterios documentales sin promover daño.',
    nextAction: 'Agregar entradas introductorias: Ubuntu, terminal, verificación y protocolo.',
  },
  {
    id: 'creator-workflow',
    portal: 'Creator Studio',
    title: 'Flujo de redes',
    priority: 'media',
    status: 'pendiente',
    goal: 'Preparar publicaciones para Instagram, Threads, TikTok, YouTube y Kick desde un mismo plan.',
    nextAction: 'Definir plantillas de texto corto, carrusel y video.',
  },
  {
    id: 'community-loop',
    portal: 'Comunidad',
    title: 'XP, chat y retorno',
    priority: 'alta',
    status: 'en-progreso',
    goal: 'Que el usuario no solo lea: que vuelva por chat, niveles, insignias y misiones.',
    nextAction: 'Conectar Supabase Realtime y crear misiones semanales.',
  },
]

export const publishingLanes: PublishingLane[] = [
  {
    id: 'quick-news',
    name: 'Noticia rápida',
    cadence: 'Diaria',
    source: 'Fuentes aprobadas + revisión humana',
    output: 'Artículo corto, SEO básico, link de fuente y post para Threads',
    owner: 'Editor',
  },
  {
    id: 'deep-report',
    name: 'Informe profundo',
    cadence: 'Semanal',
    source: 'Papers, fuentes oficiales, documentación técnica',
    output: 'Informe largo con referencias y versión para redes',
    owner: 'Editor / Science Lab',
  },
  {
    id: 'stream-pack',
    name: 'Pack de streaming',
    cadence: 'Antes de cada directo',
    source: 'Calendario, juego del día, clips, CTA',
    output: 'Banner, texto redes, título Kick/Twitch y miniatura',
    owner: 'Creator Studio',
  },
  {
    id: 'green-log',
    name: 'Green Node log',
    cadence: '2 por semana',
    source: 'Linux, programación, ciberseguridad defensiva, OSINT ético',
    output: 'Entrada educativa con reglas de seguridad y fuente',
    owner: 'Researcher',
  },
]

export const rc23QualityGates = [
  'Home entendible en menos de 5 segundos',
  'Header principal con jerarquía clara',
  'Green Node oculto, no listado como sección normal',
  'Science Lab con tono formal y fuentes visibles',
  'CMS preparado para cargar contenido sin tocar código',
  'Chat funcionando en local multi-pestaña y preparado para Supabase Realtime',
  'Wisp visible sin tapar contenido principal',
  'README y CHANGELOG ordenados por versión',
  'SQL documentado e incremental',
]
