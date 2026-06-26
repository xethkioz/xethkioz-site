export type MilestoneStatus = 'stable' | 'in-progress' | 'planned' | 'blocked'

export type PlatformMilestone = {
  id: string
  label: string
  title: string
  status: MilestoneStatus
  progress: number
  objective: string
  deliverables: string[]
  routes: string[]
  databaseScope: string[]
  qaFocus: string[]
}

export const platformMilestones: PlatformMilestone[] = [
  {
    id: 'core-platform',
    label: 'Milestone A',
    title: 'Core Platform',
    status: 'in-progress',
    progress: 72,
    objective: 'Consolidar la arquitectura base de XETHKIOZ Network antes de cargar contenido masivo o conectar automatizaciones externas.',
    deliverables: ['Layouts por portal', 'Header simplificado', 'Network Hub', 'Green Node aislado', 'Science Lab formal', 'base SQL consolidada'],
    routes: ['/', '/network', '/science', '/green-node', '/cms', '/qa'],
    databaseScope: ['profiles', 'roles', 'permissions', 'network_portals', 'platform_milestones', 'audit_checks'],
    qaFocus: ['rutas limpias', 'navegacion', 'build', 'responsive', 'links internos'],
  },
  {
    id: 'content-platform',
    label: 'Milestone B',
    title: 'Content Platform',
    status: 'in-progress',
    progress: 44,
    objective: 'Transformar el sitio en un portal vivo: noticias propias, radar externo con atribucion, informes Science Lab y multimedia.',
    deliverables: ['CMS editorial', 'Content OS', 'fuentes verificadas', 'SEO por articulo', 'borradores', 'programacion'],
    routes: ['/content-system', '/news-engine', '/cms', '/news', '/article/:slug'],
    databaseScope: ['articles', 'article_versions', 'categories', 'tags', 'sources', 'media_assets', 'editorial_queue'],
    qaFocus: ['atribucion', 'SEO', 'imagenes', 'slugs', 'borradores', 'publicacion'],
  },
  {
    id: 'community-platform',
    label: 'Milestone C',
    title: 'Community Platform',
    status: 'planned',
    progress: 31,
    objective: 'Convertir la comunidad en una red social tecnologica: perfiles, XP, insignias, reputacion, chat y moderacion.',
    deliverables: ['perfiles', 'XP', 'insignias', 'roles', 'chat por salas', 'moderadores temporales'],
    routes: ['/community', '/roles', '/support'],
    databaseScope: ['profiles', 'xp_logs', 'achievements', 'user_badges', 'chat_rooms', 'chat_messages', 'moderation_actions'],
    qaFocus: ['RLS', 'abuso', 'permisos', 'moderacion', 'privacidad'],
  },
  {
    id: 'creator-ecosystem',
    label: 'Milestone D',
    title: 'Creator Ecosystem',
    status: 'planned',
    progress: 24,
    objective: 'Unificar herramientas para crear, publicar y promocionar contenido en redes, streams y portales de XETHKIOZ.',
    deliverables: ['AI Lab', 'Creator Studio', 'calendario editorial', 'prompts', 'plantillas', 'overlays'],
    routes: ['/ai-lab', '/creator-studio', '/streaming', '/chat-overlay'],
    databaseScope: ['creator_tasks', 'prompt_templates', 'stream_events', 'video_assets', 'campaigns'],
    qaFocus: ['flujo creador', 'links redes', 'OBS', 'assets', 'automatizaciones'],
  },
  {
    id: 'production-ready',
    label: 'Milestone E',
    title: 'Production Ready',
    status: 'planned',
    progress: 18,
    objective: 'Cerrar la version 4.0 estable con pruebas de produccion, seguridad, performance, accesibilidad y deploy LIVE.',
    deliverables: ['auditoria final', 'sitemap', 'robots', 'OpenGraph', 'Lighthouse', 'Netlify deploy', 'runbook'],
    routes: ['/qa', '/live-checklist', '/network'],
    databaseScope: ['audit_checks', 'system_settings', 'analytics_events', 'backups'],
    qaFocus: ['performance', 'seguridad', 'SEO', 'accesibilidad', 'Netlify', 'Supabase'],
  },
]

export const databaseBaselineModules = [
  {
    name: 'Identity & Roles',
    tables: ['profiles', 'roles', 'permissions', 'user_roles', 'moderation_actions'],
    purpose: 'Unificar usuarios, staff, autores, moderadores, donadores y administradores.',
    priority: 'Alta',
  },
  {
    name: 'Editorial Core',
    tables: ['articles', 'article_versions', 'categories', 'tags', 'article_tags', 'sources', 'editorial_queue'],
    purpose: 'Permitir noticias propias, radar externo, borradores IA, programadas e informes.',
    priority: 'Alta',
  },
  {
    name: 'Science Evidence',
    tables: ['science_reports', 'science_references', 'evidence_levels', 'report_reviews'],
    purpose: 'Separar informes cientificos con fuentes, DOI, revision y nivel de evidencia.',
    priority: 'Alta',
  },
  {
    name: 'Green Node',
    tables: ['green_node_logs', 'green_node_resources', 'green_node_eggs', 'terminal_sessions'],
    purpose: 'Gestionar recursos Linux/programacion/ciberseguridad educativa y EGGs del nodo.',
    priority: 'Media',
  },
  {
    name: 'Community & Rewards',
    tables: ['xp_logs', 'achievements', 'user_badges', 'chat_rooms', 'chat_messages', 'reactions'],
    purpose: 'Construir progresion, reputacion, chat, logros y moderacion temporal.',
    priority: 'Alta',
  },
  {
    name: 'Creator & Streams',
    tables: ['stream_events', 'video_assets', 'creator_tasks', 'prompt_templates', 'campaigns'],
    purpose: 'Centralizar OBS, Kick, Twitch, YouTube, shorts, campañas y recursos de creador.',
    priority: 'Media',
  },
] as const

export const serviceBacklog = [
  { service: 'Noticias diarias', state: 'Foundation', next: 'Conectar RSS/API y cola editorial con atribucion visible.' },
  { service: 'CMS real', state: 'Foundation', next: 'Agregar editor, borradores, programacion, SEO y versionado.' },
  { service: 'Chat Realtime', state: 'Mock listo', next: 'Conectar Supabase Realtime con salas por portal.' },
  { service: 'XP e insignias', state: 'Modelo definido', next: 'Persistir eventos y calcular niveles por reglas.' },
  { service: 'Green Node EGG', state: 'Activo visual', next: 'Guardar desbloqueos, logs y futuras recompensas.' },
  { service: 'Science Reports', state: 'Layout listo', next: 'Agregar fuentes, DOI, nivel de evidencia y revision editorial.' },
  { service: 'AI Editorial', state: 'Planificado', next: 'Crear flujo seguro: enlace -> borrador -> revision humana.' },
  { service: 'Creator Studio', state: 'Foundation', next: 'Calendario, prompts, overlays, videos y publicaciones cruzadas.' },
] as const
