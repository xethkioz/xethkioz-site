import { isSupabaseConfigured, supabase } from '../supabaseClient'

export type PublicNewsCategory = 'gaming' | 'tech' | 'science' | 'ai' | 'community' | 'green' | 'programming'
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
}

export const publicNewsCategories = ['gaming', 'tech', 'science', 'ai', 'community', 'green', 'programming'] as const

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
  },
} as const

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
    tags: ['test24h', 'programacion', 'docs'],
    source_urls: [],
    ai_generated: false,
    created_at: TEST_24H_PUBLISHED_AT,
  },
]

function isTest24hActive() {
  return Date.now() < new Date(TEST_24H_UNTIL).getTime()
}

function getPublicTestArticles(category?: PublicNewsCategory | 'all') {
  if (!isTest24hActive()) return []
  if (category && category !== 'all') return publicTestArticles.filter((article) => article.category === category)
  return publicTestArticles
}

function mergeArticles(primary: PublicNewsArticle[], fallback: PublicNewsArticle[], limit: number) {
  const seen = new Set<string>()
  return [...fallback, ...primary]
    .filter((article) => {
      if (seen.has(article.slug)) return false
      seen.add(article.slug)
      return true
    })
    .slice(0, limit)
}

export function isPublicNewsCategory(value: string): value is PublicNewsCategory {
  return publicNewsCategories.includes(value as PublicNewsCategory)
}

export function normalizePublicNewsCategory(value: string | null | undefined): PublicNewsCategory {
  if (!value) return 'gaming'
  if (value === 'ia') return 'ai'
  if (value === 'hardware') return 'tech'
  if (value === 'deals') return 'gaming'
  return isPublicNewsCategory(value) ? value : 'gaming'
}

function normalizeContent(value: unknown): PublicNewsContentBlock[] {
  if (!Array.isArray(value)) return []
  return value
    .map((block) => {
      if (!block || typeof block !== 'object') return null
      const candidate = block as Partial<PublicNewsContentBlock>
      const type = candidate.type === 'heading' || candidate.type === 'list' || candidate.type === 'quote' ? candidate.type : 'paragraph'
      const text = typeof candidate.text === 'string' ? candidate.text.trim() : ''
      if (!text) return null
      return { type, text } satisfies PublicNewsContentBlock
    })
    .filter((block): block is PublicNewsContentBlock => Boolean(block))
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : []
}

export function normalizePublicNewsArticle(row: RawNewsArticle): PublicNewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: normalizeContent(row.content),
    category: normalizePublicNewsCategory(row.category),
    status: row.status,
    published_at: row.published_at,
    tags: normalizeStringArray(row.tags),
    source_urls: normalizeStringArray(row.source_urls),
    ai_generated: Boolean(row.ai_generated),
    created_at: row.created_at,
  }
}

export function formatPublicNewsDate(value: string | null | undefined, lang: 'es' | 'en') {
  if (!value) return lang === 'es' ? 'Sin fecha' : 'No date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export async function fetchPublishedNews(category?: PublicNewsCategory | 'all', limit = 36): Promise<PublicNewsArticle[]> {
  const testArticles = getPublicTestArticles(category)
  if (!isSupabaseConfigured) return testArticles.slice(0, limit)

  let query = supabase
    .from('news_articles')
    .select('id, slug, title, summary, content, category, status, published_at, tags, source_urls, ai_generated, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (category && category !== 'all') query = query.eq('category', category)

  const { data, error } = await query
  if (error) {
    if (testArticles.length) return testArticles.slice(0, limit)
    throw error
  }

  const cmsArticles = ((data ?? []) as RawNewsArticle[]).map(normalizePublicNewsArticle)
  return mergeArticles(cmsArticles, testArticles, limit)
}

export async function fetchPublishedNewsBySlug(slug: string): Promise<PublicNewsArticle | null> {
  const testArticle = getPublicTestArticles().find((article) => article.slug === slug)
  if (testArticle) return testArticle
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('news_articles')
    .select('id, slug, title, summary, content, category, status, published_at, tags, source_urls, ai_generated, created_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) throw error
  return data ? normalizePublicNewsArticle(data as RawNewsArticle) : null
}

export { isSupabaseConfigured as isPublicNewsSupabaseConfigured }
