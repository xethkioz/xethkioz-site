type RateEntry = {
  count: number
  resetAt: number
}

type EdgeResult = {
  status: number
  payload: { ok?: boolean; error?: string; retryAfter?: number; requestId?: string; provider?: string }
}

const rateBucket = new Map<string, RateEntry>()
const WINDOW_MS = 15 * 60_000
const IP_LIMIT = 5
const EMAIL_LIMIT = 3
const MAX_BODY_BYTES = 32_000
const EDGE_TIMEOUT_MS = 10_000

const allowedProjectTypes = new Set(['landing', 'corporate', 'ecommerce', 'portfolio', 'redesign', 'other'])
const allowedBudgetRanges = new Set(['to-define', 'starter', 'growth', 'advanced'])
const allowedContactPreferences = new Set(['email', 'whatsapp', 'either'])
const allowedEdgeErrors = new Set(['INVALID_REQUEST', 'WHATSAPP_REQUIRED', 'PAYLOAD_TOO_LARGE', 'RATE_LIMITED', 'METHOD_NOT_ALLOWED', 'SERVICE_UNAVAILABLE'])
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
}

function getSupabasePublicKey() {
  return process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
}

function getClientIp(request: any) {
  const forwarded = request.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim()
  return request.socket?.remoteAddress || 'unknown-ip'
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

function safeText(value: unknown, maxLength: number, preserveLines = false) {
  if (typeof value !== 'string') return ''
  const withoutControlCharacters = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  const normalized = preserveLines
    ? withoutControlCharacters.replace(/\r\n?/g, '\n').trim()
    : withoutControlCharacters.replace(/\s+/g, ' ').trim()
  return normalized.slice(0, maxLength)
}

function safeEmail(value: unknown) {
  const email = safeText(value, 254).toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : ''
}

function safeSlug(value: unknown) {
  const slug = safeText(value, 100).toLowerCase()
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null
}

function json(response: any, status: number, payload: unknown) {
  response.status(status).json(payload)
}

async function invokeQuoteEdge(method: 'GET' | 'POST', payload: unknown, clientIp: string): Promise<EdgeResult> {
  const supabaseUrl = getSupabaseUrl()
  const publicKey = getSupabasePublicKey()
  if (!supabaseUrl || !publicKey) return { status: 503, payload: { ok: false, error: 'SERVICE_UNAVAILABLE' } }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), EDGE_TIMEOUT_MS)

  try {
    const edgeResponse = await fetch(`${supabaseUrl}/functions/v1/submit-web-quote`, {
      method,
      headers: {
        apikey: publicKey,
        Authorization: `Bearer ${publicKey}`,
        'Content-Type': 'application/json',
        'X-Client-IP': clientIp,
        'X-XETHKIOZ-Proxy': 'vercel-web-quote-v1',
      },
      body: method === 'POST' ? JSON.stringify(payload) : undefined,
      signal: controller.signal,
    })

    const edgePayload = await edgeResponse.json().catch(() => ({ ok: false, error: 'SERVICE_UNAVAILABLE' }))
    return { status: edgeResponse.status, payload: edgePayload }
  } finally {
    clearTimeout(timeout)
  }
}

export default async function handler(request: any, response: any) {
  response.setHeader('Cache-Control', 'no-store, max-age=0')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  if (request.method === 'GET') {
    try {
      const result = await invokeQuoteEdge('GET', null, getClientIp(request))
      const healthy = result.status === 200 && result.payload?.ok === true
      json(response, healthy ? 200 : 503, healthy
        ? { ok: true, provider: result.payload.provider || 'supabase-edge' }
        : { ok: false, error: 'SERVICE_UNAVAILABLE' })
    } catch (error) {
      console.error('[web-quote] Edge health check failed', error)
      json(response, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
    }
    return
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST')
    json(response, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' })
    return
  }

  const contentLength = Number(request.headers['content-length'] || 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    json(response, 413, { ok: false, error: 'PAYLOAD_TOO_LARGE' })
    return
  }

  const honeypot = safeText(request.body?.companyWebsite, 200)
  if (honeypot) {
    json(response, 202, { ok: true })
    return
  }

  const ip = getClientIp(request)
  const ipRate = checkRateLimit(`ip:${ip}`, IP_LIMIT)
  if (!ipRate.ok) {
    response.setHeader('Retry-After', String(ipRate.retryAfter))
    json(response, 429, { ok: false, error: 'RATE_LIMITED', retryAfter: ipRate.retryAfter })
    return
  }

  const name = safeText(request.body?.name, 80)
  const email = safeEmail(request.body?.email)
  const whatsapp = safeText(request.body?.whatsapp, 40) || null
  const businessName = safeText(request.body?.businessName, 120) || null
  const projectType = safeText(request.body?.projectType, 32)
  const budgetRange = safeText(request.body?.budgetRange, 32)
  const contactPreference = safeText(request.body?.contactPreference, 16)
  const details = safeText(request.body?.details, 2000, true)
  const serviceIdValue = safeText(request.body?.serviceId, 36)
  const serviceId = serviceIdValue && uuidPattern.test(serviceIdValue) ? serviceIdValue : null
  const serviceSlug = safeSlug(request.body?.serviceSlug)
  const consent = request.body?.consent === true

  if (
    name.length < 2
    || !email
    || details.length < 20
    || !allowedProjectTypes.has(projectType)
    || !allowedBudgetRanges.has(budgetRange)
    || !allowedContactPreferences.has(contactPreference)
    || !consent
  ) {
    json(response, 400, { ok: false, error: 'INVALID_REQUEST' })
    return
  }

  if (contactPreference === 'whatsapp' && !whatsapp) {
    json(response, 400, { ok: false, error: 'WHATSAPP_REQUIRED' })
    return
  }

  const emailRate = checkRateLimit(`email:${email}`, EMAIL_LIMIT)
  if (!emailRate.ok) {
    response.setHeader('Retry-After', String(emailRate.retryAfter))
    json(response, 429, { ok: false, error: 'RATE_LIMITED', retryAfter: emailRate.retryAfter })
    return
  }

  try {
    const result = await invokeQuoteEdge('POST', {
      serviceId,
      serviceSlug,
      name,
      email,
      whatsapp,
      businessName,
      projectType,
      budgetRange,
      contactPreference,
      details,
      consent,
      companyWebsite: '',
      source: '/creacion-web',
    }, ip)

    if (result.status === 201 && result.payload?.ok && result.payload.requestId) {
      json(response, 201, { ok: true, requestId: result.payload.requestId })
      return
    }

    const safeError = allowedEdgeErrors.has(String(result.payload?.error)) ? result.payload.error : 'SERVICE_UNAVAILABLE'
    if (result.status === 429 && result.payload.retryAfter) response.setHeader('Retry-After', String(result.payload.retryAfter))
    json(response, result.status >= 400 && result.status < 500 ? result.status : 502, { ok: false, error: safeError })
  } catch (error) {
    console.error('[web-quote] Edge proxy failed', error)
    json(response, 502, { ok: false, error: 'SERVICE_UNAVAILABLE' })
  }
}
