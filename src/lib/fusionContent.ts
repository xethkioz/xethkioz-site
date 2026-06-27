import { type Lang } from './i18n'

export type FusionPortalId = 'gaming' | 'science' | 'fun' | 'green'
export type EvidenceLevel = 'documented' | 'hypothesis' | 'speculative'
export type ContentStatus = 'published' | 'review' | 'draft'

export interface FusionArticle {
  id: string
  portal: FusionPortalId
  title: string
  summary: string
  category: string
  source: string
  status: ContentStatus
  evidence?: EvidenceLevel
  readMinutes: number
  xp: number
}

export interface FusionMission {
  id: string
  portal: FusionPortalId | 'core'
  title: string
  description: string
  rewardXp: number
}

export interface CmsQueueItem {
  id: string
  title: string
  portal: FusionPortalId
  status: ContentStatus
  owner: string
}

const articles: Record<Lang, FusionArticle[]> = {
  es: [
    { id: 'g-001', portal: 'gaming', title: 'Xbox, PC y Mobile: radar semanal de lanzamientos', summary: 'Panel preparado para noticias dinámicas por plataforma, con fuente, categoría y tiempo de lectura.', category: 'Gaming News', source: 'XETHKIOZ Editorial', status: 'published', readMinutes: 4, xp: 35 },
    { id: 'g-002', portal: 'gaming', title: 'Cómo cubrir un directo sin romper la web', summary: 'Estructura para integrar Kick, Twitch, YouTube y clips sin convertir la página en un muro de embeds pesados.', category: 'Streaming', source: 'Live Ops', status: 'review', readMinutes: 3, xp: 25 },
    { id: 's-001', portal: 'science', title: 'IA local, GPUs y flujo real para creadores', summary: 'Artículo base para explicar IA local, modelos ligeros y límites prácticos del hardware actual.', category: 'IA', source: 'Science Lab', status: 'published', evidence: 'documented', readMinutes: 5, xp: 45 },
    { id: 's-002', portal: 'science', title: 'UAP, documentos y pensamiento crítico', summary: 'Modelo editorial para separar documentos, hipótesis y teorías populares sin vender especulación como hecho.', category: 'Mystery Lab', source: 'Research Desk', status: 'review', evidence: 'hypothesis', readMinutes: 6, xp: 40 },
    { id: 'f-001', portal: 'fun', title: 'Duendes, aventuras y leyendas digitales', summary: 'Slot preparado para integrar el video de duendes/aventuras como pieza narrativa del Fun Portal.', category: 'Aventuras', source: 'Fun Portal', status: 'draft', evidence: 'speculative', readMinutes: 2, xp: 20 },
    { id: 'gr-001', portal: 'green', title: 'Linux básico: entrar al Green Node sin miedo', summary: 'Contenido inicial para usuarios que descubren el Wisp y quieren aprender terminal, privacidad y herramientas.', category: 'Linux', source: 'Green Node', status: 'published', evidence: 'documented', readMinutes: 4, xp: 50 },
  ],
  en: [
    { id: 'g-001', portal: 'gaming', title: 'Xbox, PC and Mobile: weekly release radar', summary: 'Panel ready for dynamic platform news with source, category, and reading time.', category: 'Gaming News', source: 'XETHKIOZ Editorial', status: 'published', readMinutes: 4, xp: 35 },
    { id: 'g-002', portal: 'gaming', title: 'How to cover a livestream without breaking the site', summary: 'Structure for Kick, Twitch, YouTube and clips without turning the page into a heavy embed wall.', category: 'Streaming', source: 'Live Ops', status: 'review', readMinutes: 3, xp: 25 },
    { id: 's-001', portal: 'science', title: 'Local AI, GPUs and real creator workflow', summary: 'Base article to explain local AI, lightweight models and practical hardware limits.', category: 'AI', source: 'Science Lab', status: 'published', evidence: 'documented', readMinutes: 5, xp: 45 },
    { id: 's-002', portal: 'science', title: 'UAP, documents and critical thinking', summary: 'Editorial model to separate documents, hypotheses and popular theories without selling speculation as fact.', category: 'Mystery Lab', source: 'Research Desk', status: 'review', evidence: 'hypothesis', readMinutes: 6, xp: 40 },
    { id: 'f-001', portal: 'fun', title: 'Goblins, adventures and digital legends', summary: 'Slot prepared to integrate the goblins/adventures video as a narrative Fun Portal piece.', category: 'Adventures', source: 'Fun Portal', status: 'draft', evidence: 'speculative', readMinutes: 2, xp: 20 },
    { id: 'gr-001', portal: 'green', title: 'Linux basics: enter Green Node safely', summary: 'Initial content for users who discover the Wisp and want to learn terminal, privacy and tools.', category: 'Linux', source: 'Green Node', status: 'published', evidence: 'documented', readMinutes: 4, xp: 50 },
  ],
}

const missions: Record<Lang, FusionMission[]> = {
  es: [
    { id: 'm-read', portal: 'core', title: 'Leer 3 artículos', description: 'Base del sistema de progreso: leer, guardar y participar.', rewardXp: 120 },
    { id: 'm-portal', portal: 'gaming', title: 'Elegir portal favorito', description: 'La comunidad futura podrá personalizar su entrada al ecosistema.', rewardXp: 80 },
    { id: 'm-wisp', portal: 'green', title: 'Descubrir el Wisp', description: 'Misión oculta para activar rutas especiales del Green Node.', rewardXp: 150 },
  ],
  en: [
    { id: 'm-read', portal: 'core', title: 'Read 3 articles', description: 'Progression baseline: read, save and participate.', rewardXp: 120 },
    { id: 'm-portal', portal: 'gaming', title: 'Choose favorite portal', description: 'Future community users will personalize their ecosystem entry.', rewardXp: 80 },
    { id: 'm-wisp', portal: 'green', title: 'Discover the Wisp', description: 'Hidden mission to activate special Green Node paths.', rewardXp: 150 },
  ],
}

const queue: Record<Lang, CmsQueueItem[]> = {
  es: [
    { id: 'cms-1', title: 'Review Gaming: noticia con fuente pendiente', portal: 'gaming', status: 'review', owner: 'Editor' },
    { id: 'cms-2', title: 'Science Lab: artículo con evidencia documentada', portal: 'science', status: 'draft', owner: 'Science Admin' },
    { id: 'cms-3', title: 'Fun Portal: video duendes/aventuras', portal: 'fun', status: 'draft', owner: 'Media Ops' },
  ],
  en: [
    { id: 'cms-1', title: 'Gaming review: sourced news pending', portal: 'gaming', status: 'review', owner: 'Editor' },
    { id: 'cms-2', title: 'Science Lab: documented evidence article', portal: 'science', status: 'draft', owner: 'Science Admin' },
    { id: 'cms-3', title: 'Fun Portal: goblins/adventures video', portal: 'fun', status: 'draft', owner: 'Media Ops' },
  ],
}

export function getFusionArticles(lang: Lang, portal?: FusionPortalId) {
  return articles[lang].filter((article) => !portal || article.portal === portal)
}

export function getFusionMissions(lang: Lang) {
  return missions[lang]
}

export function getFusionCmsQueue(lang: Lang) {
  return queue[lang]
}

export function getStatusLabel(status: ContentStatus, lang: Lang) {
  const labels: Record<Lang, Record<ContentStatus, string>> = {
    es: { published: 'Publicado', review: 'En revisión', draft: 'Borrador' },
    en: { published: 'Published', review: 'In review', draft: 'Draft' },
  }
  return labels[lang][status]
}

export function getEvidenceLabel(level: EvidenceLevel | undefined, lang: Lang) {
  if (!level) return ''
  const labels: Record<Lang, Record<EvidenceLevel, string>> = {
    es: { documented: 'Documentado', hypothesis: 'Hipótesis', speculative: 'Especulativo' },
    en: { documented: 'Documented', hypothesis: 'Hypothesis', speculative: 'Speculative' },
  }
  return labels[lang][level]
}
