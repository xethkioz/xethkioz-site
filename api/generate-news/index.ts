import { createClient } from '@supabase/supabase-js'

type NewsCategory = 'gaming' | 'tech' | 'science' | 'ai' | 'community' | 'green' | 'programming'
type Language = 'es' | 'en'

type ContentBlock = {
  type: 'paragraph' | 'heading' | 'list' | 'quote'
  text: string
}

type GenerateNewsRequest = {
  category?: NewsCategory
  topic?: string
  title?: string
  summary?: string
  content?: ContentBlock[]
  tags?: string[]
  source_urls?: string[]
  useLLM?: boolean
  language?: Language
}

type RateEntry = {
  count: number
  resetAt: number
}

const allowedCategories: NewsCategory[] = ['gaming', 'tech', 'science', 'ai', 'community', 'green', 'programming']
const allowedLanguages: Language[] = ['es', 'en']
const rateBucket = new Map<string, RateEntry>()
const idempotencyBucket = new Map<string, { expiresAt: number; response: unknown }>()

const WINDOW_MS = 60_000
const USER_LIMIT = 10
const IP_LIMIT = 30
const IDEMPOTENCY_MS = 5 * 60_000
const MAX_IDEMPOTENCY_KEY_LENGTH = 128

function json(res: any, status: number, body: unknown) {
  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.status(status).json(body)
}

function getTraceId() {
  return `trace_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

function sanitizeText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim()
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function validateBody(body: unknown) {
  const details: string[] = []

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Body must be a JSON object']
  }

  const value = body as GenerateNewsRequest

  if (!value.category || !allowedCategories.includes(value.category)) details.push('Invalid category')
  if (!value.topic || typeof value.topic !== 'string' || value.topic.trim().length < 3 || value.topic.length > 200) {
    details.push('Topic is required and must be between 3 and 200 chars')
  }
  if (value.title && (typeof value.title !== 'string' || value.title.length > 220)) details.push('Invalid title')
  if (value.summary && (typeof value.summary !== 'string' || value.summary.length > 500)) details.push('Invalid summary')
  if (value.language && !allowedLanguages.includes(value.language)) details.push('Invalid language')
  if (value.useLLM === true) details.push('LLM generation is not available in phase 1')
  if (value.tags && (!Array.isArray(value.tags) || value.tags.length > 10 || value.tags.some((tag) => typeof tag !== 'string' || tag.trim().length === 0 || tag.length > 40))) {
    details.push('Invalid tags')
  }
  if (
    value.source_urls &&
    (!Array.isArray(value.source_urls) || value.source_urls.length > 20 || value.source_urls.some((url) => typeof url !== 'string' || !isValidUrl(url)))
  ) {
    details.push('Invalid source_urls')
  }
  if (
    value.content &&
    (!Array.isArray(value.content) ||
      value.content.length > 20 ||
      value.content.some((block) =>
        !block ||
        !['paragraph', 'heading', 'list', 'quote'].includes(block.type) ||
        typeof block.text !== 'string' ||
        block.text.trim().length === 0 ||
        block.text.length > 1500,
      ))
  ) {
    details.push('Invalid content blocks')
  }

  return details
}

function buildTemplate(category: NewsCategory, topic: string, language: Language): ContentBlock[] {
  if (language === 'en') {
    return [
      { type: 'heading', text: `What happened with ${topic}` },
      { type: 'paragraph', text: `This draft summarizes the key points around ${topic} for the XETHKIOZ editorial workflow.` },
      { type: 'heading', text: 'Why it matters' },
      { type: 'paragraph', text: `The topic is relevant to the ${category} vertical and should be reviewed before publication.` },
      { type: 'heading', text: 'Editorial note' },
      { type: 'paragraph', text: 'Verify sources, update context, add images and confirm final angle before publishing.' },
    ]
  }

  return [
    { type: 'heading', text: `Qué pasó con ${topic}` },
    { type: 'paragraph', text: `Este borrador resume los puntos principales sobre ${topic} para el flujo editorial de XETHKIOZ.` },
    { type: 'heading', text: 'Por qué importa' },
    { type: 'paragraph', text: `El tema es relevante para la vertical ${category} y debe revisarse antes de publicarse.` },
    { type: 'heading', text: 'Nota editorial' },
    { type: 'paragraph', text: 'Verificar fuentes, actualizar contexto, sumar imágenes y confirmar el enfoque final antes de publicar.' },
  ]
}

function checkRateLimit(key: string, limit: number) {
  const now = Date.now()
  const current = rateBucket.get(key)

  if (!current || current.resetAt <= now) {
    rateBucket.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true, retryAfter: 0 }
  }

  if (current.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) }
  }

  current.count += 1
  return { ok: true, retryAfter: 0 }
}

function cleanupBuckets() {
  const now = Date.now()
  for (const [key, value] of rateBucket.entries()) {
    if (value.resetAt <= now) rateBucket.delete(key)
  }
  for (const [key, value] of idempotencyBucket.entries()) {
    if (value.expiresAt <= now) idempotencyBucket.delete(key)
  }
}

function getBearerToken(req: any) {
  const header = req.headers.authorization || req.headers.Authorization
  if (!header || typeof header !== 'string' || !header.startsWith('Bearer ')) return null
  const token = header.slice('Bearer '.length).trim()
  return token.length > 0 && token.length <= 8192 ? token : null
}

function getClientIp(req: any) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown-ip'
}

function isAdmin(user: any) {
  const appRole = user?.app_metadata?.role
  const userRole = user?.user_metadata?.role
  return appRole === 'admin' || userRole === 'admin'
}

export default async function handler(req: any, res: any) {
  const traceId = getTraceId()
  cleanupBuckets()

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'METHOD_NOT_ALLOWED' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return json(res, 500, { error: 'INTERNAL_ERROR', traceId })
  }

  const token = getBearerToken(req)
  if (!token) return json(res, 401, { error: 'UNAUTHORIZED' })

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: authData, error: authError } = await supabase.auth.getUser(token)
  if (authError || !authData?.user) return json(res, 401, { error: 'UNAUTHORIZED' })
  if (!isAdmin(authData.user)) return json(res, 403, { error: 'FORBIDDEN' })

  const userId = authData.user.id
  const ip = getClientIp(req)
  const userRate = checkRateLimit(`user:${userId}`, USER_LIMIT)
  const ipRate = checkRateLimit(`ip:${ip}`, IP_LIMIT)

  if (!userRate.ok || !ipRate.ok) {
    const retryAfter = Math.max(userRate.retryAfter, ipRate.retryAfter)
    res.setHeader('Retry-After', String(retryAfter))
    return json(res, 429, { error: 'RATE_LIMITED', retryAfter })
  }

  const rawIdempotencyKey = req.headers['idempotency-key']
  const idempotencyKey = typeof rawIdempotencyKey === 'string' ? rawIdempotencyKey.trim() : ''
  if (idempotencyKey.length > MAX_IDEMPOTENCY_KEY_LENGTH) {
    return json(res, 400, { error: 'VALIDATION_ERROR', details: ['Idempotency-Key is too long'] })
  }
  if (idempotencyKey) {
    const cached = idempotencyBucket.get(`${userId}:${idempotencyKey}`)
    if (cached && cached.expiresAt > Date.now()) return json(res, 201, cached.response)
  }

  const validationErrors = validateBody(req.body)
  if (validationErrors.length > 0) return json(res, 400, { error: 'VALIDATION_ERROR', details: validationErrors })

  const body = req.body as GenerateNewsRequest
  const category = body.category as NewsCategory
  const language = body.language || 'es'
  const rawTopic = sanitizeText((body.topic || '').trim())
  const title = sanitizeText((body.title || rawTopic).trim())
  const summary = body.summary ? sanitizeText(body.summary) : `Borrador editorial sobre ${rawTopic}.`
  const baseSlug = slugify(title || rawTopic)
  const slug = baseSlug || `news-${Date.now().toString(36)}`

  const { data: existingSlug, error: slugLookupError } = await supabase.from('news_articles').select('id').eq('slug', slug).maybeSingle()
  if (slugLookupError) {
    console.error('[generate-news:slug-check]', traceId, slugLookupError)
    return json(res, 500, { error: 'INTERNAL_ERROR', traceId })
  }
  if (existingSlug) {
    return json(res, 409, { error: 'SLUG_CONFLICT', suggestion: `${slug}-${Date.now().toString(36).slice(-4)}` })
  }

  const content = body.content && body.content.length > 0
    ? body.content.map((block) => ({ type: block.type, text: sanitizeText(block.text) }))
    : buildTemplate(category, rawTopic, language)

  const payload = {
    slug,
    title,
    summary,
    content,
    category,
    author_id: userId,
    status: 'draft',
    tags: (body.tags || []).map((tag) => sanitizeText(tag)),
    source_urls: body.source_urls || [],
    ai_generated: false,
    review_status: 'pending',
    metrics: {},
  }

  const { data: article, error: insertError } = await supabase
    .from('news_articles')
    .insert(payload)
    .select('id, slug, status, created_at')
    .single()

  if (insertError || !article) {
    console.error('[generate-news]', traceId, insertError)
    return json(res, 500, { error: 'INTERNAL_ERROR', traceId })
  }

  const { error: auditError } = await supabase.from('news_audit_log').insert({
    article_id: article.id,
    actor_id: userId,
    action: 'generate_news_draft',
    payload: { category, sourceCount: payload.source_urls.length, aiGenerated: false },
  })

  if (auditError) {
    console.error('[generate-news:audit-log]', traceId, auditError)
  }

  const response = {
    id: article.id,
    slug: article.slug,
    status: article.status,
    previewUrl: `/news/${article.slug}?preview=1`,
    createdAt: article.created_at,
  }

  if (idempotencyKey) {
    idempotencyBucket.set(`${userId}:${idempotencyKey}`, { expiresAt: Date.now() + IDEMPOTENCY_MS, response })
  }

  return json(res, 201, response)
}
