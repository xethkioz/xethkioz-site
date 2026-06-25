
import { STREAM_LINKS, SOCIAL_LINKS } from './siteConfig'

export type ContentLaneId = 'own-news' | 'external-radar' | 'science-report' | 'green-node-log' | 'video-stream' | 'community-post'
export type ContentStatus = 'ready' | 'needs-source' | 'editorial-review' | 'cms-ready' | 'automation-ready'

export interface ContentLane {
  id: ContentLaneId
  title: string
  portal: string
  icon: string
  status: ContentStatus
  description: string
  owner: string
  nextStep: string
  database: string
}

export const contentLanes: ContentLane[] = [
  {
    id: 'own-news',
    title: 'Noticias propias',
    portal: 'Gaming & Technology / AI Lab / Asia Gaming',
    icon: '📰',
    status: 'cms-ready',
    description: 'Contenido escrito por XETHKIOZ desde CMS, con autor, portada, categoría, tags, SEO y publicación programada.',
    owner: 'Editor / Admin',
    nextStep: 'Conectar formulario CMS con tabla articles y media.',
    database: 'articles, categories, authors, media, tags'
  },
  {
    id: 'external-radar',
    title: 'Radar externo diario',
    portal: 'News Engine',
    icon: '📡',
    status: 'automation-ready',
    description: 'Fuentes externas usadas como disparador editorial: titular, fuente, URL, resumen propio y estado de revisión. No copia artículos completos.',
    owner: 'News Bot + Revisión humana',
    nextStep: 'Activar RSS/API por fuente aprobada y guardar solo metadatos + resumen propio.',
    database: 'news_sources, external_items, editorial_queue'
  },
  {
    id: 'science-report',
    title: 'Informes Science Lab',
    portal: 'Science Lab',
    icon: '🔬',
    status: 'needs-source',
    description: 'Informes formales con fuente, evidencia, DOI/enlace, fecha de revisión y separación clara entre datos, hipótesis y divulgación.',
    owner: 'Editor científico / Admin',
    nextStep: 'Agregar campos evidence_level, source_url, reviewed_at y editorial_note.',
    database: 'science_reports, science_sources, article_sources'
  },
  {
    id: 'green-node-log',
    title: 'Green Node logs',
    portal: 'Green Node',
    icon: '🟢',
    status: 'editorial-review',
    description: 'Linux, programación, ciberseguridad defensiva, OSINT ético y misterios documentales etiquetados como hecho, hipótesis o análisis.',
    owner: 'Researcher / Moderator',
    nextStep: 'Conectar terminal EGGs y Wisp a logs/achievements sin invadir UX.',
    database: 'green_node_entries, wisp_events, achievements'
  },
  {
    id: 'video-stream',
    title: 'Videos y directos',
    portal: 'Creator Studio / Streaming',
    icon: '📺',
    status: 'cms-ready',
    description: 'Miniaturas, embeds, directos Kick/Twitch/YouTube, clips, shorts y recursos para OBS/overlay.',
    owner: 'Creator / Admin',
    nextStep: 'Normalizar video_id, platform, thumbnail y canonical_url.',
    database: 'videos, streams, media'
  },
  {
    id: 'community-post',
    title: 'Comunidad y red social',
    portal: 'Community OS',
    icon: '💬',
    status: 'editorial-review',
    description: 'Publicaciones de usuarios, comentarios, XP, reacciones, donadores, moderadores temporales y reputación.',
    owner: 'Moderador / Sistema',
    nextStep: 'Activar realtime + políticas RLS por rol.',
    database: 'community_posts, comments, reactions, xp_logs, user_roles'
  }
]

export const editorialWorkflow = [
  { step: 'Captura', detail: 'CMS manual, fuente externa, enlace, video o informe Science Lab.' },
  { step: 'Validación', detail: 'Verificar fuente, autoría, fecha, licencia de imagen y si corresponde atribución.' },
  { step: 'Edición', detail: 'Redactar texto propio, clasificar portal, agregar etiquetas y separar hecho/opinión/rumor.' },
  { step: 'SEO', detail: 'Meta title, description, canonical, OpenGraph, keywords, JSON-LD y artículo relacionado.' },
  { step: 'Publicación', detail: 'Publicar ahora, programar o dejar en borrador; luego distribuir a redes oficiales.' },
  { step: 'Medición', detail: 'Guardar vistas, reacciones, comentarios, shares, XP y señales para ranking.' },
]

export const networkHomeSlots = [
  { slot: 'Hero principal', content: 'Noticia propia o informe central con imagen fuerte y CTA.', route: '/' },
  { slot: 'Tendencias', content: 'Mix de gaming, tecnología, IA y streaming con mayor interacción.', route: '/news' },
  { slot: 'Science Highlight', content: 'Informe serio con fuente y nivel de evidencia.', route: '/science' },
  { slot: 'Green Signal', content: 'No visible como menú: solo Wisp/EGG y microseñales.', route: '/green-node' },
  { slot: 'Creator Live', content: 'Estado Kick/Twitch/YouTube y clips recientes.', route: '/streaming' },
  { slot: 'Community Pulse', content: 'Chat, salas, ranking y roles activos.', route: '/community' },
]

export const roleEscalationRules = [
  'La donación suma reputación y beneficios, pero no otorga moderación automática.',
  'Moderador temporal requiere actividad positiva, reportes útiles, historial limpio y aprobación admin.',
  'Editor puede publicar contenido propio solo con revisión o permiso explícito.',
  'Science Lab exige mayor trazabilidad: fuente, fecha y evidencia antes de publicar.',
  'Green Node usa seguridad defensiva y análisis documental; no admite guías ofensivas ni intrusión.',
]

export const officialLinkTargets = [
  { label: 'Web oficial', url: 'https://xethkioz.com.ar', type: 'canonical' },
  ...SOCIAL_LINKS.map((item) => ({ label: item.name, url: item.url, type: item.verified ? 'verified-social' : 'pending-social' })),
  { label: 'Twitch directo', url: STREAM_LINKS.twitch, type: 'streaming' },
  { label: 'Kick directo', url: STREAM_LINKS.kick, type: 'streaming' },
]

export const finalQaChecklist = [
  { area: 'Rutas', check: 'Todas las rutas principales cargan: /, /network, /news, /science, /green-node, /cms, /roles, /streaming.', status: 'ready' },
  { area: 'Links', check: 'Redes oficiales centralizadas en siteConfig; YouTube queda marcado como pendiente si no se confirma URL final.', status: 'review' },
  { area: 'SQL', check: 'Baseline creada; RC1.6 agrega seeds y tablas puente para contenido editorial.', status: 'ready' },
  { area: 'Green Node', check: 'Wisp no debe bloquear navegación, respeta reduce-motion y documenta EGGs.', status: 'ready' },
  { area: 'Science Lab', check: 'Mantener estética formal y exigir fuentes antes de publicar como informe.', status: 'ready' },
  { area: 'CMS', check: 'UI lista como studio; conexión real a Supabase queda siguiente fase.', status: 'partial' },
  { area: 'Producción', check: 'Antes de LIVE: npm install, npm run build, revisar .env, Netlify y Supabase migrations.', status: 'review' },
]
