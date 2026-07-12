import { createClient } from 'npm:@supabase/supabase-js@2.108.2'

type RateEntry = {
  count: number
  resetAt: number
}

const rateBucket = new Map<string, RateEntry>()
const WINDOW_MS = 15 * 60_000
const IP_LIMIT = 10
const EMAIL_LIMIT = 3
const MAX_BODY_BYTES = 32_000

const allowedProjectTypes = new Set(['landing', 'corporate', 'ecommerce', 'portfolio', 'redesign', 'other'])
const allowedBudgetRanges = new Set(['to-define', 'starter', 'growth', 'advanced'])
const allowedContactPreferences = new Set(['email', 'whatsapp', 'either'])
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isAllowedOrigin(origin: string) {
  if (!origin) return true
  if (origin === 'https://www.xethkioz.com.ar' || origin === 'https://xethkioz.com.ar') return true
  if (origin === 'http://localhost:5173' || origin === 'http://127.0.0.1:5173') return true
  return /^https:\/\/[a-z0-9-]+-xethkioz-site\.vercel\.app$/i.test(origin)
}

function responseHeaders(request: Request) {
  const origin = request.headers.get('origin') || ''
  const headers: Record<string, string> = {
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type': 'application/json; charset=utf-8',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
  }
  if (origin && isAllowedOrigin(origin)) headers['Access-Control-Allow-Origin'] = origin
  return headers
}

function json(request: Request, status: number, payload: unknown, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...responseHeaders(request), ...extraHeaders },
  })
}

function getSecretKey() {
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim()
  if (legacy) return legacy

  try {
    const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}') as Record<string, string>
    return secretKeys.default || Object.values(secretKeys).find((value) => value.startsWith('sb_secret_')) || ''
  } catch {
    return ''
  }
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

Deno.serve(async (request: Request) => {
  const origin = request.headers.get('origin') || ''
  if (!isAllowedOrigin(origin)) return json(request, 403, { ok: false, error: 'ORIGIN_NOT_ALLOWED' })

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...responseHeaders(request),
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')?.trim() || ''
  const secretKey = getSecretKey()

  if (request.method === 'GET') {
    return supabaseUrl && secretKey
      ? json(request, 200, { ok: true, provider: 'supabase-edge' })
      : json(request, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
  }

  if (request.method !== 'POST') {
    return json(request, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' }, { Allow: 'GET, POST, OPTIONS' })
  }

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json(request, 413, { ok: false, error: 'PAYLOAD_TOO_LARGE' })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json(request, 400, { ok: false, error: 'INVALID_REQUEST' })
  }

  if (safeText(body.companyWebsite, 200)) return json(request, 202, { ok: true })

  const clientIp = safeText(request.headers.get('x-client-ip') || request.headers.get('x-forwarded-for'), 80)
  if (clientIp) {
    const ipRate = checkRateLimit(`ip:${clientIp}`, IP_LIMIT)
    if (!ipRate.ok) return json(request, 429, { ok: false, error: 'RATE_LIMITED', retryAfter: ipRate.retryAfter }, { 'Retry-After': String(ipRate.retryAfter) })
  }

  const name = safeText(body.name, 80)
  const email = safeEmail(body.email)
  const whatsapp = safeText(body.whatsapp, 40) || null
  const businessName = safeText(body.businessName, 120) || null
  const projectType = safeText(body.projectType, 32)
  const budgetRange = safeText(body.budgetRange, 32)
  const contactPreference = safeText(body.contactPreference, 16)
  const details = safeText(body.details, 2000, true)
  const serviceIdValue = safeText(body.serviceId, 36)
  const serviceId = serviceIdValue && uuidPattern.test(serviceIdValue) ? serviceIdValue : null
  const serviceSlug = safeSlug(body.serviceSlug)
  const consent = body.consent === true

  if (
    name.length < 2
    || !email
    || details.length < 20
    || !allowedProjectTypes.has(projectType)
    || !allowedBudgetRanges.has(budgetRange)
    || !allowedContactPreferences.has(contactPreference)
    || !consent
  ) return json(request, 400, { ok: false, error: 'INVALID_REQUEST' })

  if (contactPreference === 'whatsapp' && !whatsapp) {
    return json(request, 400, { ok: false, error: 'WHATSAPP_REQUIRED' })
  }

  const emailRate = checkRateLimit(`email:${email}`, EMAIL_LIMIT)
  if (!emailRate.ok) return json(request, 429, { ok: false, error: 'RATE_LIMITED', retryAfter: emailRate.retryAfter }, { 'Retry-After': String(emailRate.retryAfter) })

  if (!supabaseUrl || !secretKey) {
    console.error('[submit-web-quote] Missing Supabase server configuration')
    return json(request, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
  }

  const admin = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const cutoff = new Date(Date.now() - WINDOW_MS).toISOString()
  const { count: recentRequestCount, error: countError } = await admin
    .from('web_quote_requests')
    .select('id', { count: 'exact', head: true })
    .eq('email', email)
    .gte('created_at', cutoff)

  if (countError) {
    console.error('[submit-web-quote] Rate check failed', { code: countError.code, message: countError.message })
    return json(request, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
  }

  if ((recentRequestCount ?? 0) >= EMAIL_LIMIT) {
    const retryAfter = Math.ceil(WINDOW_MS / 1000)
    return json(request, 429, { ok: false, error: 'RATE_LIMITED', retryAfter }, { 'Retry-After': String(retryAfter) })
  }

  const { data, error } = await admin
    .from('web_quote_requests')
    .insert({
      service_id: serviceId,
      service_slug: serviceSlug,
      name,
      email,
      whatsapp,
      business_name: businessName,
      project_type: projectType,
      budget_range: budgetRange,
      contact_preference: contactPreference,
      details,
      status: 'new',
      source: '/creacion-web',
      consent_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) {
    console.error('[submit-web-quote] Insert failed', { code: error.code, message: error.message })
    return json(request, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
  }

  return json(request, 201, { ok: true, requestId: data.id })
})
