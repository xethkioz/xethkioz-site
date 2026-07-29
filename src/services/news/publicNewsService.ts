import { isSupabaseConfigured, supabase } from '../supabaseClient'

export type PublicNewsCategory = 'gaming' | 'tech' | 'science' | 'ai' | 'community' | 'green' | 'programming' | 'comicon'
export type PublicNewsStatus = 'draft' | 'review' | 'published' | 'archived'

export type PublicNewsContentBlock = {
  type: 'paragraph' | 'heading' | 'list' | 'quote'
  text: string
}

export type PublicNewsArticle = {
  id: string
  slug: string
  title: string
  summary: string | null
  content: PublicNewsContentBlock[]
  category: PublicNewsCategory
  status: PublicNewsStatus
  published_at: string | null
  tags: string[]
  source_urls: string[]
  ai_generated: boolean
  created_at: string
  cover_image_url?: string | null
  cover_image_alt?: string | null
}

export type PublicNewsReadingDepth = 'brief' | 'analysis' | 'dossier'

export type PublicNewsReadingMetrics = {
  words: number
  minutes: number
  depth: PublicNewsReadingDepth
}

type RawNewsArticle = {
  id: string
  slug: string
  title: string
  summary: string | null
  content: unknown
  category: string
  status: PublicNewsStatus
  published_at: string | null
  tags: string[] | null
  source_urls: string[] | null
  ai_generated: boolean | null
  created_at: string
  cover_image_url: string | null
  cover_image_alt: string | null
}

export const publicNewsCategories = ['gaming', 'tech', 'science', 'ai', 'community', 'green', 'programming', 'comicon'] as const

export const publicNewsCategoryLabels = {
  es: {
    all: 'Todas',
    gaming: 'Gaming',
    tech: 'Tecnología',
    science: 'Ciencia',
    ai: 'IA',
    community: 'Comunidad',
    green: 'Green Node',
    programming: 'Programación',
    comicon: 'Universo COMICON',
  },
  en: {
    all: 'All',
    gaming: 'Gaming',
    tech: 'Technology',
    science: 'Science',
    ai: 'AI',
    community: 'Community',
    green: 'Green Node',
    programming: 'Programming',
    comicon: 'COMICON Universe',
  },
} as const

export const publicNewsReadingDepthLabels = {
  es: {
    brief: 'Lectura breve',
    analysis: 'Análisis',
    dossier: 'Dossier profundo',
  },
  en: {
    brief: 'Quick brief',
    analysis: 'Analysis',
    dossier: 'Deep dossier',
  },
} as const

export function isPublicNewsEditorialChecklist(block: PublicNewsContentBlock) {
  if (block.type !== 'list') return false
  const normalized = block.text.toLocaleLowerCase('es')
  return normalized.includes('fuente primaria') && normalized.includes('límite')
}

export function getPublicNewsReadingMetrics(article: Pick<PublicNewsArticle, 'summary' | 'content'>): PublicNewsReadingMetrics {
  const body = article.content
    .filter((block) => !isPublicNewsEditorialChecklist(block))
    .map((block) => block.text)
  const words = [article.summary ?? '', ...body]
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length

  return {
    words,
    minutes: Math.max(1, Math.ceil(words / 180)),
    depth: words < 180 ? 'brief' : words < 400 ? 'analysis' : 'dossier',
  }
}

const TEST_24H_UNTIL = '2026-07-02T00:00:00.000Z'
const TEST_24H_PUBLISHED_AT = '2026-06-30T21:00:00.000Z'

const publicTestArticles: PublicNewsArticle[] = [
  {
    id: 'test-24h-gaming-001',
    slug: 'test-24h-gaming-radar-juegos-comunidad',
    title: 'TEST 24H · Radar gamer: juegos para probar la portada pública',
    summary: 'Publicación de prueba para validar que la sección Gaming aparece correctamente durante el test público de 24 horas.',
    content: [
      { type: 'heading', text: 'Objetivo del test' },
      { type: 'paragraph', text: 'Esta entrada valida el flujo público de noticias gaming dentro de XETHKIOZ. No es una noticia comercial ni una promoción externa.' },
      { type: 'list', text: 'Validar portada /news; validar filtro Gaming; validar apertura de artículo; validar lectura mobile' },
    ],
    category: 'gaming',
    status: 'published',
    published_at: TEST_24H_PUBLISHED_AT,
    tags: ['test24h', 'gaming', 'xethkioz'],
    source_urls: [],
    ai_generated: false,
    created_at: TEST_24H_PUBLISHED_AT,
  },
  {
    id: 'test-24h-gaming-002',
    slug: 'test-24h-gaming-builds-guias-stream',
    title: 'TEST 24H · Guías y builds: plantilla para futuros tops',
    summary: 'Entrada demo para probar cómo se verán futuras guías, builds, comparativas y tops de comunidad.',
    content: [
      { type: 'heading', text: 'Guías listas para evolucionar' },
      { type: 'paragraph', text: 'Este bloque prueba el formato de guías rápidas dentro del ecosistema, con estructura simple y clara para lectura pública.' },
      { type: 'list', text: 'Título fuerte; resumen corto; etiquetas; lectura individual' },
    ],
    category: 'gaming',
    status: 'published',
    published_at: TEST_24H_PUBLISHED_AT,
    tags: ['test24h', 'builds', 'gaming'],
    source_urls: [],
    ai_generated: false,
    created_at: TEST_24H_PUBLISHED_AT,
  },
  {
    id: 'test-24h-community-001',
    slug: 'test-24h-memes-cuando-el-build-pasa',
    title: 'TEST 24H · Meme: cuando el build pasa en Vercel',
    summary: 'Publicación de humor interno para probar la rama Memes / Comunidad sin mezclarla con noticias serias.',
    content: [
      { type: 'heading', text: 'Humor de desarrollo' },
      { type: 'paragraph', text: 'Cuando el deploy queda en verde después de varios ajustes, el Wisp deja de mirar desde la esquina y te da el visto bueno.' },
      { type: 'quote', text: 'Build verde, café frío, pero la web vive.' },
    ],
    category: 'community',
    status: 'published',
    published_at: TEST_24H_PUBLISHED_AT,
    tags: ['test24h', 'memes', 'comunidad'],
    source_urls: [],
    ai_generated: false,
    created_at: TEST_24H_PUBLISHED_AT,
  },
  {
    id: 'test-24h-community-002',
    slug: 'test-24h-memes-wisp-no-era-boton',
    title: 'TEST 24H · Meme: el Wisp no era botón, era destino',
    summary: 'Entrada de prueba para validar tono humorístico, lore interno y navegación pública.',
    content: [
      { type: 'heading', text: 'Lore liviano del ecosistema' },
      { type: 'paragraph', text: 'El Wisp funciona como guiño visual dentro de la marca. Esta publicación prueba cómo se verá el humor narrativo dentro del feed público.' },
    ],
    category: 'community',
    status: 'published',
    published_at: TEST_24H_PUBLISHED_AT,
    tags: ['test24h', 'wisp', 'meme'],
    source_urls: [],
    ai_generated: false,
    created_at: TEST_24H_PUBLISHED_AT,
  },
  {
    id: 'test-24h-science-001',
    slug: 'test-24h-ciencia-verificacion-y-fuentes',
    title: 'TEST 24H · Ciencia: verificar antes de compartir',
    summary: 'Publicación de prueba para validar la categoría Ciencia con enfoque de pensamiento crítico.',
    content: [
      { type: 'heading', text: 'Ciencia dentro de XETHKIOZ' },
      { type: 'paragraph', text: 'Este formato separa hipótesis, fuente, dato y opinión para evitar confundir rumor con información validada.' },
      { type: 'list', text: 'Fuente; contexto; límite; conclusión' },
    ],
    category: 'science',
    status: 'published',
    published_at: TEST_24H_PUBLISHED_AT,
    tags: ['test24h', 'ciencia', 'verificacion'],
    source_urls: [],
    ai_generated: false,
    created_at: TEST_24H_PUBLISHED_AT,
  },
  {
    id: 'test-24h-ai-001',
    slug: 'test-24h-ia-publicador-editorial',
    title: 'TEST 24H · IA: publicador editorial con revisión humana',
    summary: 'Entrada demo para validar la categoría IA y el futuro flujo de generación + revisión + publicación.',
    content: [
      { type: 'heading', text: 'IA con control editorial' },
      { type: 'paragraph', text: 'El objetivo es que la IA ayude a preparar borradores, pero que la publicación final mantenga revisión humana y coherencia de marca.' },
    ],
    category: 'ai',
    status: 'published',
    published_at: TEST_24H_PUBLISHED_AT,
    tags: ['test24h', 'ia', 'cms'],
    source_urls: [],
    ai_generated: true,
    created_at: TEST_24H_PUBLISHED_AT,
  },
  {
    id: 'test-24h-tech-001',
    slug: 'test-24h-tecnologia-vercel-supabase',
    title: 'TEST 24H · Tecnología: Vercel + Supabase en producción',
    summary: 'Publicación técnica de prueba para validar el estado del stack web y su lectura pública.',
    content: [
      { type: 'heading', text: 'Stack web bajo prueba' },
      { type: 'paragraph', text: 'Este artículo valida el flujo público del stack React, Vite, Vercel y Supabase sin exponer variables privadas.' },
      { type: 'list', text: 'React; Vite; Vercel; Supabase; CMS' },
    ],
    category: 'tech',
    status: 'published',
    published_at: TEST_24H_PUBLISHED_AT,
    tags: ['test24h', 'tech', 'vercel'],
    source_urls: [],
    ai_generated: false,
    created_at: TEST_24H_PUBLISHED_AT,
  },
  {
    id: 'test-24h-green-001',
    slug: 'test-24h-green-node-privacidad-basica',
    title: 'TEST 24H · Green Node: privacidad básica para creadores',
    summary: 'Entrada de prueba para validar la rama Green Node con contenido educativo y defensivo.',
    content: [
      { type: 'heading', text: 'Green Node educativo' },
      { type: 'paragraph', text: 'Este bloque prueba contenido de privacidad, backups y buenas prácticas defensivas para creadores.' },
    ],
    category: 'green',
    status: 'published',
    published_at: TEST_24H_PUBLISHED_AT,
    tags: ['test24h', 'green-node', 'privacidad'],
    source_urls: [],
    ai_generated: false,
    created_at: TEST_24H_PUBLISHED_AT,
  },
  {
    id: 'test-24h-programming-001',
    slug: 'test-24h-programacion-documentar-para-ias',
    title: 'TEST 24H · Programación: documentar para que otra IA entienda',
    summary: 'Entrada demo para validar contenido de programación, documentación y continuidad entre herramientas.',
    content: [
      { type: 'heading', text: 'Documentación como fuente de verdad' },
      { type: 'paragraph', text: 'Cada bloque técnico debe dejar claro qué se hizo, qué falta y qué no se debe tocar para mantener continuidad.' },
    ],
    category: 'programming',
    status: 'published',
    published_at: TEST_24H_PUBLISHED_AT,
    tags: ['test24h', 'programacion', 'documentacion'],
    source_urls: [],
    ai_generated: false,
    created_at: TEST_24H_PUBLISHED_AT,
  },
]

function normalizeContentType(value: unknown): PublicNewsContentBlock['type'] {
  if (value === 'heading' || value === 'list' || value === 'quote') return value
  return 'paragraph'
}

function normalizeContent(content: unknown): PublicNewsContentBlock[] {
  if (!Array.isArray(content)) return []
  return content
    .filter((block): block is Record<string, unknown> => Boolean(block) && typeof block === 'object')
    .map((block): PublicNewsContentBlock => ({
      type: normalizeContentType(block.type),
      text: typeof block.text === 'string' ? block.text : '',
    }))
    .filter((block) => block.text.trim().length > 0)
}

function normalizeCategory(value: string): PublicNewsCategory {
  if (publicNewsCategories.includes(value as PublicNewsCategory)) return value as PublicNewsCategory
  return 'community'
}

function mapRawArticle(article: RawNewsArticle): PublicNewsArticle {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    content: normalizeContent(article.content),
    category: normalizeCategory(article.category),
    status: article.status,
    published_at: article.published_at,
    tags: article.tags ?? [],
    source_urls: article.source_urls ?? [],
    ai_generated: Boolean(article.ai_generated),
    created_at: article.created_at,
    cover_image_url: article.cover_image_url,
    cover_image_alt: article.cover_image_alt,
  }
}

export const isPublicNewsSupabaseConfigured = isSupabaseConfigured

export function formatPublicNewsDate(value: string, locale: 'es' | 'en' = 'es') {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium' }).format(date)
}

export function getPublicTestArticles() {
  const now = Date.now()
  if (now > new Date(TEST_24H_UNTIL).getTime()) return []
  return publicTestArticles
}

export async function fetchPublishedNews(category?: PublicNewsCategory | 'all') {
  if (!isSupabaseConfigured) return getPublicTestArticles()

  let query = supabase
    .from('news_articles')
    .select('id, slug, title, summary, content, category, status, published_at, tags, source_urls, ai_generated, created_at, cover_image_url, cover_image_alt')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(60)

  if (category && category !== 'all') query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw error
  return [...(data ?? []).map((article) => mapRawArticle(article as RawNewsArticle)), ...getPublicTestArticles()]
}

export async function fetchPublishedNewsBySlug(slug: string) {
  if (!isSupabaseConfigured) return getPublicTestArticles().find((article) => article.slug === slug) ?? null

  const { data, error } = await supabase
    .from('news_articles')
    .select('id, slug, title, summary, content, category, status, published_at, tags, source_urls, ai_generated, created_at, cover_image_url, cover_image_alt')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) throw error
  if (!data) return getPublicTestArticles().find((article) => article.slug === slug) ?? null
  return mapRawArticle(data as RawNewsArticle)
}
