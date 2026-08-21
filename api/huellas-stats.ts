import { isIP } from 'node:net'

type RateEntry = {
  count: number
  resetAt: number
}

type HuellasStats = {
  visits?: number
  active_posts?: number
  reunited?: number
  adoptions?: number
  status?: 'accepted' | 'duplicate' | 'rate_limited' | 'invalid'
}

const rateBucket = new Map<string, RateEntry>()
const RATE_WINDOW_MS = 60_000
const INSTANCE_LIMIT = 20
const MAX_BODY_BYTES = 512
const UPSTREAM_TIMEOUT_MS = 8_000
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

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

function isAutomatedClient(userAgent: string) {
  return /\b(bot|crawler|spider|slurp|bingpreview|facebookexternalhit|facebot|googleother|google-inspectiontool|headlesschrome|lighthouse|pagespeed|pingdom|uptimerobot|vercel-screenshot)\b/i.test(userAgent)
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

  const body = request.body && typeof request.body === 'object' && !Array.isArray(request.body)
    ? request.body
    : null
  if (!body || Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) {
    return response.status(body ? 413 : 400).json({ ok: false, error: body ? 'PAYLOAD_TOO_LARGE' : 'INVALID_REQUEST' })
  }

  const wantsRegistration = body.registerVisit === true
  const eventId = typeof body.eventId === 'string' ? body.eventId.trim() : ''
  if (wantsRegistration && !uuidPattern.test(eventId)) {
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

  const automated = isAutomatedClient(String(request.headers['user-agent'] || ''))
  const endpoint = wantsRegistration && !automated ? 'register_huellas_visit' : 'get_huellas_stats'
  const payload = endpoint === 'register_huellas_visit'
    ? { p_event_id: eventId, p_network_prefix: networkPrefix }
    : {}
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const upstream = await fetch(`${supabaseUrl}/rest/v1/rpc/${endpoint}`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!upstream.ok) {
      console.error(JSON.stringify({ level: 'error', message: 'Huellas metrics RPC failed', status: upstream.status }))
      return response.status(503).json({ ok: false, error: 'SERVICE_UNAVAILABLE' })
    }

    const stats = await upstream.json() as HuellasStats
    if (!stats || typeof stats !== 'object' || stats.status === 'invalid') {
      return response.status(503).json({ ok: false, error: 'SERVICE_UNAVAILABLE' })
    }

    return response.status(200).json({
      ok: true,
      visits: Math.max(0, Number(stats.visits) || 0),
      active_posts: Math.max(0, Number(stats.active_posts) || 0),
      reunited: Math.max(0, Number(stats.reunited) || 0),
      adoptions: Math.max(0, Number(stats.adoptions) || 0),
      counted: stats.status === 'accepted' || stats.status === 'duplicate',
      rateLimited: stats.status === 'rate_limited',
    })
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', message: 'Huellas metrics unavailable', reason: error instanceof Error ? error.name : 'unknown' }))
    return response.status(503).json({ ok: false, error: 'SERVICE_UNAVAILABLE' })
  } finally {
    clearTimeout(timeout)
  }
}
