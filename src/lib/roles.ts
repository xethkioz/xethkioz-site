export type XethRole =
  | 'guest'
  | 'member'
  | 'collaborator'
  | 'donor'
  | 'ambassador'
  | 'temp_moderator'
  | 'moderator'
  | 'editor'
  | 'admin'
  | 'sponsor'

export interface RoleTier {
  role: XethRole
  label: string
  icon: string
  minXp: number
  color: string
  description: string
  privileges: string[]
  moderationEligible?: boolean
}

export interface XpRule {
  id: string
  action: string
  points: number
  limit: string
  note: string
}

export const roleTiers: RoleTier[] = [
  { role: 'guest', label: 'Visitante', icon: '👁️', minXp: 0, color: 'gray', description: 'Puede leer contenido público.', privileges: ['Lectura pública', 'Acceso a noticias', 'Vista limitada del chat'] },
  { role: 'member', label: 'Miembro', icon: '🎮', minXp: 100, color: 'orange', description: 'Usuario registrado de la comunidad.', privileges: ['Perfil público', 'Comentarios', 'Reacciones', 'Chat general'] },
  { role: 'collaborator', label: 'Colaborador', icon: '📝', minXp: 750, color: 'neon', description: 'Puede sugerir noticias y recursos para revisión.', privileges: ['Enviar borradores', 'Reportar fuentes', 'Insignia de colaborador'] },
  { role: 'donor', label: 'Donador', icon: '💜', minXp: 1200, color: 'purple', description: 'Apoya el proyecto y recibe reconocimiento visible.', privileges: ['Insignia donador', 'Color de nombre', 'Prioridad en sorteos', 'Sala de apoyo'] },
  { role: 'ambassador', label: 'Embajador', icon: '🚀', minXp: 2500, color: 'orange', description: 'Miembro activo que ayuda a difundir XETHKIOZ.', privileges: ['Insignia embajador', 'Menciones destacadas', 'Acceso anticipado'] },
  { role: 'temp_moderator', label: 'Moderador Temporal', icon: '🛡️', minXp: 4000, color: 'green', description: 'Rol temporal por actividad positiva y confianza.', privileges: ['Moderar chat por evento', 'Marcar reportes', 'Ayudar en directos'], moderationEligible: true },
  { role: 'moderator', label: 'Moderador', icon: '🔰', minXp: 6500, color: 'green', description: 'Cuida la comunidad y aplica reglas.', privileges: ['Moderar comentarios', 'Moderar chat', 'Gestionar reportes'], moderationEligible: true },
  { role: 'editor', label: 'Editor', icon: '📰', minXp: 9000, color: 'neon', description: 'Puede publicar y editar contenido editorial.', privileges: ['Publicar noticias', 'Editar multimedia', 'Gestionar SEO'] },
  { role: 'sponsor', label: 'Sponsor', icon: '🤝', minXp: 0, color: 'gold', description: 'Marca o aliado que apoya el ecosistema.', privileges: ['Perfil sponsor', 'Menciones pactadas', 'Panel de campañas'] },
  { role: 'admin', label: 'Administrador', icon: '👑', minXp: 0, color: 'red', description: 'Control total del ecosistema.', privileges: ['Control total', 'Roles y permisos', 'Configuración del sitio'] },
]

export const xpRules: XpRule[] = [
  { id: 'daily-login', action: 'Inicio de sesión diario', points: 10, limit: '1 vez por día', note: 'Premia constancia sin fomentar spam.' },
  { id: 'article-read', action: 'Leer artículo completo', points: 5, limit: '20 por día', note: 'Cuenta cuando llega al final del artículo.' },
  { id: 'comment', action: 'Comentar con calidad', points: 15, limit: '10 por día', note: 'Los comentarios eliminados descuentan XP.' },
  { id: 'reaction-received', action: 'Recibir reacción positiva', points: 3, limit: '50 por día', note: 'Evita abuso con límite diario.' },
  { id: 'share', action: 'Compartir noticia', points: 20, limit: '5 por día', note: 'Futuro tracking por URL compartida.' },
  { id: 'chat-participation', action: 'Participar en chat', points: 8, limit: '10 por día', note: 'Solo mensajes válidos, no spam.' },
  { id: 'useful-report', action: 'Reportar error o fuente útil', points: 50, limit: 'Manual', note: 'Validado por moderación.' },
  { id: 'donation', action: 'Apoyo/donación', points: 100, limit: 'Manual', note: 'Suma al historial, pero no otorga moderación automática.' },
]

export const moderationPolicy = [
  'La moderación temporal nunca se entrega solo por donar.',
  'Debe existir historial positivo, actividad real y aprobación del equipo.',
  'Toda acción de moderación queda registrada en logs.',
  'Los roles pueden expirar o ser revocados por mal uso.',
]
