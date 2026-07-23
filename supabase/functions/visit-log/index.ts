import { createClient } from 'npm:@supabase/supabase-js@2.110.7'

type RateEntry = { count: number; resetAt: number }

const rateBucket = new Map<string, RateEntry>()
const WINDOW_MS = 15 * 60_000
const IP_LIMIT = 120
const MAX_BODY_BYTES = 4_096
const CLEANUP_INTERVAL_MS = 6 * 60 * 60_000
const CLEANUP_SETTING_KEY = 'visit_log_retention_cleanup'
let lastCleanupAt = 0

function isAllowedOrigin(origin: string) {
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
    Vary: 'Origin',
    'X-Content-Type-Options': 'nosniff',
  }
  if (isAllowedOrigin(origin)) headers['Access-Control-Allow-Origin'] = origin
  return headers
}

function json(request: Request, status: number, payload: unknown, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(payload), { status, headers: { ...responseHeaders(request), ...extraHeaders } })
}

function safeText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null
  const normalized = value.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim()
  return normalized ? normalized.slice(0, maxLength) : null
}

function safeInteger(value: unknown) {
  return Number.isInteger(value) ? Math.max(0, Math.min(10_000, Number(value))) : null
}

function getSecretKey() {
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim()
  if (legacy) return legacy
  try {
    const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}') as Record<string, string>
    return keys.default || Object.values(keys).find((value) => value.startsWith('sb_secret_')) || ''
  } catch {
    return ''
  }
}

function getIp(request: Request) {
  const raw = request.headers.get('cf-connecting-ip')
    || request.headers.get('x-client-ip')
    || request.headers.get('x-forwarded-for')
    || request.headers.get('x-real-ip')
    || ''
  const first = raw.split(',')[0].trim()
  return first.length <= 45 && /^[0-9a-f:.]+$/i.test(first) ? first : null
}

function isAutomatedClient(userAgent: string) {
  return /\b(bot|crawler|spider|slurp|bingpreview|facebookexternalhit|facebot|googleother|google-inspectiontool|headlesschrome|lighthouse|pagespeed|pingdom|uptimerobot|vercel-screenshot)\b/i.test(userAgent)
}

function detectClient(userAgent: string) {
  const ua = userAgent.toLowerCase()
  const os = /android/.test(ua) ? 'Android' : /iphone|ipad|ios/.test(ua) ? 'iOS' : /windows/.test(ua) ? 'Windows' : /mac os|macintosh/.test(ua) ? 'macOS' : /linux/.test(ua) ? 'Linux' : 'Otro'
  const browser = /edg\//.test(ua) ? 'Edge' : /firefox\//.test(ua) ? 'Firefox' : /opr\//.test(ua) ? 'Opera' : /chrome\//.test(ua) ? 'Chrome' : /safari\//.test(ua) ? 'Safari' : 'Otro'
  return { os, browser }
}

function checkRateLimit(ip: string) {
  const now = Date.now()
  const current = rateBucket.get(ip)
  if (!current || current.resetAt <= now) {
    rateBucket.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (current.count >= IP_LIMIT) return false
  current.count += 1
  return true
}

async function cleanupExpiredVisits(admin: ReturnType<typeof createClient>) {
  const now = Date.now()
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) return
  lastCleanupAt = now

  const { data: marker, error: markerReadError } = await admin
    .from('site_settings')
    .select('updated_at')
    .eq('key', CLEANUP_SETTING_KEY)
    .maybeSingle()

  if (markerReadError) {
    console.error('[visit-log] Cleanup marker read failed', { code: markerReadError.code, message: markerReadError.message })
    return
  }

  const persistedCleanupAt = marker?.updated_at ? Date.parse(String(marker.updated_at)) : 0
  if (Number.isFinite(persistedCleanupAt) && now - persistedCleanupAt < CLEANUP_INTERVAL_MS) return

  const cleanupIso = new Date(now).toISOString()
  const { error: markerWriteError } = await admin
    .from('site_settings')
    .upsert({
      key: CLEANUP_SETTING_KEY,
      value: { last_cleanup_at: cleanupIso, retention_days: 30 },
      updated_at: cleanupIso,
    }, { onConflict: 'key' })

  if (markerWriteError) {
    console.error('[visit-log] Cleanup marker write failed', { code: markerWriteError.code, message: markerWriteError.message })
    return
  }

  const retentionCutoff = new Date(now - 30 * 24 * 60 * 60_000).toISOString()
  const { error: cleanupError } = await admin.from('site_visit_logs').delete().lt('visited_at', retentionCutoff)
  if (cleanupError) console.error('[visit-log] Retention cleanup failed', { code: cleanupError.code, message: cleanupError.message })
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get('origin') || ''

  if (request.method === 'OPTIONS') {
    if (!isAllowedOrigin(origin)) return json(request, 403, { ok: false })
    return new Response(null, {
      status: 204,
      headers: {
        ...responseHeaders(request),
        'Access-Control-Allow-Headers': 'apikey, content-type',
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

  if (request.method !== 'POST') return json(request, 405, { ok: false }, { Allow: 'GET, POST, OPTIONS' })
  if (!origin || !isAllowedOrigin(origin)) return json(request, 403, { ok: false, error: 'ORIGIN_NOT_ALLOWED' })

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return json(request, 413, { ok: false, error: 'PAYLOAD_TOO_LARGE' })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json(request, 400, { ok: false, error: 'INVALID_REQUEST' })
  }

  const route = safeText(body.route, 240)
  if (!route?.startsWith('/')) return json(request, 400, { ok: false, error: 'INVALID_ROUTE' })

  const userAgent = safeText(request.headers.get('user-agent'), 700) || 'desconocido'
  if (isAutomatedClient(userAgent)) return json(request, 202, { ok: true, ignored: 'automated-client' })

  const ip = getIp(request)
  if (ip && !checkRateLimit(ip)) return json(request, 429, { ok: false, error: 'RATE_LIMITED' }, { 'Retry-After': '900' })
  if (!supabaseUrl || !secretKey) return json(request, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })

  const client = detectClient(userAgent)
  const deviceType = ['mobile', 'tablet', 'desktop'].includes(String(body.deviceType)) ? String(body.deviceType) : 'unknown'
  const admin = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })

  if (ip) {
    const duplicateCutoff = new Date(Date.now() - 5_000).toISOString()
    const { count } = await admin.from('site_visit_logs').select('id', { count: 'exact', head: true }).eq('ip_address', ip).eq('route', route).gte('visited_at', duplicateCutoff)
    if ((count ?? 0) > 0) return json(request, 202, { ok: true, deduplicated: true })
  }

  const { error } = await admin.from('site_visit_logs').insert({
    route,
    ip_address: ip,
    user_agent: userAgent,
    device_type: deviceType,
    os_family: client.os,
    browser_family: client.browser,
    viewport_width: safeInteger(body.viewportWidth),
    viewport_height: safeInteger(body.viewportHeight),
    language: safeText(body.language, 24),
    timezone: safeText(body.timezone, 80),
    referrer_host: safeText(body.referrerHost, 180),
    country_code: safeText(request.headers.get('cf-ipcountry'), 3),
    region_code: safeText(request.headers.get('x-sb-edge-region'), 16),
  })

  if (error) {
    console.error('[visit-log] Insert failed', { code: error.code, message: error.message })
    return json(request, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
  }

  if (route === '/') await cleanupExpiredVisits(admin)
  return json(request, 202, { ok: true })
})
