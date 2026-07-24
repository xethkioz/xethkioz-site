import { isIP } from 'node:net'

type RateEntry = {
  count: number
  resetAt: number
}

type IngestionResult = {
  status?: string
  retry_after?: number
}

const rateBucket = new Map<string, RateEntry>()
const RATE_WINDOW_MS = 60_000
const INSTANCE_LIMIT = 40
const MAX_BODY_BYTES = 4_096
const UPSTREAM_TIMEOUT_MS = 8_000
const CLEANUP_INTERVAL_MS = 6 * 60 * 60_000
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
let lastCleanupAt = 0

function cleanText(value: unknown, max: number) {
  if (typeof value !== 'string') return null
  const cleaned = value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned ? cleaned.slice(0, max) : null
}

function cleanRoute(value: unknown) {
  const route = cleanText(value, 240)
  if (!route || !route.startsWith('/') || route.startsWith('//') || route.includes('\\')) return null

  try {
    const parsed = new URL(route, 'https://www.xethkioz.com.ar')
    if (parsed.origin !== 'https://www.xethkioz.com.ar') return null
    const normalized = `${parsed.pathname}${parsed.search}`
    return normalized.length <= 240 ? normalized : null
  } catch {
    return null
  }
}

function cleanHostname(value: unknown) {
  const hostname = cleanText(value, 180)?.toLowerCase() || null
  if (!hostname) return null
  return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(hostname)
    ? hostname
    : null
}

function detectClient(userAgent: string) {
  const ua = userAgent.toLowerCase()
  const os = /android/.test(ua) ? 'Android' : /iphone|ipad|ios/.test(ua) ? 'iOS' : /windows/.test(ua) ? 'Windows' : /mac os|macintosh/.test(ua) ? 'macOS' : /linux/.test(ua) ? 'Linux' : 'Otro'
  const browser = /edg\//.test(ua) ? 'Edge' : /firefox\//.test(ua) ? 'Firefox' : /opr\//.test(ua) ? 'Opera' : /chrome\//.test(ua) ? 'Chrome' : /safari\//.test(ua) ? 'Safari' : 'Otro'
  return { os, browser }
}

function getRawIp(request: any) {
  const candidate = String(request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || '')
    .split(',')[0]
    .trim()
    .replace(/^\[|\]$/g, '')
  return isIP(candidate) ? candidate : null
}

function anonymizeIp(rawIp: string | null) {
  if (!rawIp) return null

  const mappedIpv4 = rawIp.match(/(\d{1,3}(?:\.\d{1,3}){3})$/)?.[1]
  if (mappedIpv4 && isIP(mappedIpv4) === 4) {
    const octets = mappedIpv4.split('.')
    return `${octets[0]}.${octets[1]}.${octets[2]}.0`
  }

  if (isIP(rawIp) === 4) {
    const octets = rawIp.split('.')
    return `${octets[0]}.${octets[1]}.${octets[2]}.0`
  }

  const address = rawIp.split('%')[0].toLowerCase()
  const [left = '', right = ''] = address.split('::')
  const leftParts = left ? left.split(':') : []
  const rightParts = right ? right.split(':') : []
  const missing = Math.max(0, 8 - leftParts.length - rightParts.length)
  const expanded = [...leftParts, ...Array.from({ length: missing }, () => '0'), ...rightParts]
    .map((part) => (part || '0').replace(/^0+([0-9a-f])/i, '$1'))

  return `${expanded.slice(0, 3).join(':')}::`
}

function isTrustedHostname(hostname: string) {
  return hostname === 'xethkioz.com.ar'
    || hostname === 'www.xethkioz.com.ar'
    || hostname === 'localhost'
    || hostname === '127.0.0.1'
    || /^xethkioz-site-[a-z0-9-]+-xethkioz-site\.vercel\.app$/i.test(hostname)
    || hostname === 'xethkioz-site.vercel.app'
}

function isTrustedSiteRequest(request: any) {
  const source = String(request.headers.origin || request.headers.referer || '').trim()
  if (!source) return request.headers['sec-fetch-site'] === 'same-origin'

  try {
    return isTrustedHostname(new URL(source).hostname.toLowerCase())
  } catch {
    return false
  }
}

function checkRateLimit(key: string) {
  const now = Date.now()
  const current = rateBucket.get(key)
  if (!current || current.resetAt <= now) {
    rateBucket.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { ok: true, retryAfter: 0 }
  }
  if (current.count >= INSTANCE_LIMIT) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) }
  }
  current.count += 1
  return { ok: true, retryAfter: 0 }
}

function applyResponseHeaders(response: any) {
  response.setHeader('Cache-Control', 'no-store, max-age=0')
  response.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
  response.setHeader('Referrer-Policy', 'no-referrer')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
}

async function maybeCleanupExpiredVisits(supabaseUrl: string, serviceKey: string, route: string) {
  const now = Date.now()
  if (route !== '/' || now - lastCleanupAt < CLEANUP_INTERVAL_MS) return
  lastCleanupAt = now

  const cleanup = await fetch(`${supabaseUrl}/rest/v1/rpc/xethkioz_cleanup_site_visits`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
  }).catch(() => null)

  if (!cleanup?.ok) {
    console.error(JSON.stringify({ level: 'warning', message: 'visit telemetry retention cleanup failed', status: cleanup?.status || 0 }))
  }
}

export default async function handler(request: any, response: any) {
  applyResponseHeaders(response)

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' })
  }

  if (!isTrustedSiteRequest(request)) {
    return response.status(403).json({ ok: false, error: 'ORIGIN_NOT_ALLOWED' })
  }

  const contentType = String(request.headers['content-type'] || '').toLowerCase()
  if (!contentType.startsWith('application/json')) {
    return response.status(415).json({ ok: false, error: 'UNSUPPORTED_MEDIA_TYPE' })
  }

  const contentLength = Number(request.headers['content-length'] || 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return response.status(413).json({ ok: false, error: 'PAYLOAD_TOO_LARGE' })
  }

  const body = request.body && typeof request.body === 'object' && !Array.isArray(request.body) ? request.body : null
  if (!body || Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) {
    return response.status(body ? 413 : 400).json({ ok: false, error: body ? 'PAYLOAD_TOO_LARGE' : 'INVALID_REQUEST' })
  }

  const eventId = cleanText(body.eventId, 36)
  const route = cleanRoute(body.route)
  const deviceType = ['mobile', 'tablet', 'desktop'].includes(body.deviceType) ? body.deviceType : 'unknown'
  const viewportWidth = Number.isInteger(body.viewportWidth) ? Math.max(0, Math.min(10_000, body.viewportWidth)) : null
  const viewportHeight = Number.isInteger(body.viewportHeight) ? Math.max(0, Math.min(10_000, body.viewportHeight)) : null
  const language = cleanText(body.language, 24)
  const timezone = cleanText(body.timezone, 80)
  const referrerHost = cleanHostname(body.referrerHost)

  if (!eventId || !uuidPattern.test(eventId) || !route) {
    return response.status(400).json({ ok: false, error: 'INVALID_REQUEST' })
  }

  const networkPrefix = anonymizeIp(getRawIp(request))
  const rate = checkRateLimit(networkPrefix || 'unknown-network')
  if (!rate.ok) {
    response.setHeader('Retry-After', String(rate.retryAfter))
    return response.status(429).json({ ok: false, error: 'RATE_LIMITED', retryAfter: rate.retryAfter })
  }

  const supabaseUrl = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    return response.status(503).json({ ok: false, error: 'SERVICE_UNAVAILABLE' })
  }

  const userAgent = cleanText(request.headers['user-agent'], 700) || 'unknown'
  const client = detectClient(userAgent)
  const countryCode = cleanText(request.headers['x-vercel-ip-country'], 3)?.toUpperCase() || null
  const regionCode = cleanText(request.headers['x-vercel-ip-country-region'], 16)?.toUpperCase() || null
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const stored = await fetch(`${supabaseUrl}/rest/v1/rpc/xethkioz_record_site_visit`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_event_id: eventId,
        p_route: route,
        p_network_prefix: networkPrefix,
        p_device_type: deviceType,
        p_os_family: client.os,
        p_browser_family: client.browser,
        p_viewport_width: viewportWidth,
        p_viewport_height: viewportHeight,
        p_language: language,
        p_timezone: timezone,
        p_referrer_host: referrerHost,
        p_country_code: countryCode,
        p_region_code: regionCode,
      }),
      signal: controller.signal,
    })

    if (!stored.ok) {
      console.error(JSON.stringify({ level: 'error', message: 'visit telemetry RPC failed', status: stored.status }))
      return response.status(503).json({ ok: false, error: 'SERVICE_UNAVAILABLE' })
    }

    const payload = await stored.json().catch(() => []) as IngestionResult[]
    const result = payload[0]
    if (result?.status === 'rate_limited') {
      const retryAfter = Math.max(1, Number(result.retry_after) || 60)
      response.setHeader('Retry-After', String(retryAfter))
      return response.status(429).json({ ok: false, error: 'RATE_LIMITED', retryAfter })
    }
    if (result?.status === 'invalid') {
      return response.status(400).json({ ok: false, error: 'INVALID_REQUEST' })
    }
    if (result?.status !== 'accepted' && result?.status !== 'duplicate') {
      return response.status(503).json({ ok: false, error: 'SERVICE_UNAVAILABLE' })
    }

    await maybeCleanupExpiredVisits(supabaseUrl, serviceKey, route)
    return response.status(202).json({ ok: true, duplicate: result.status === 'duplicate' })
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', message: 'visit telemetry unavailable', reason: error instanceof Error ? error.name : 'unknown' }))
    return response.status(503).json({ ok: false, error: 'SERVICE_UNAVAILABLE' })
  } finally {
    clearTimeout(timeout)
  }
}
