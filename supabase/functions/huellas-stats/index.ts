const ALLOWED_HOSTS = new Set([
  'xethkioz.com.ar',
  'www.xethkioz.com.ar',
  'xethkioz-site.vercel.app',
  'xethkioz.netlify.app',
  'localhost',
  '127.0.0.1',
])

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const botPattern = /\b(bot|crawler|spider|slurp|bingpreview|facebookexternalhit|facebot|googleother|google-inspectiontool|headlesschrome|lighthouse|pagespeed|pingdom|uptimerobot|vercel-screenshot)\b/i
const MAX_BODY_BYTES = 512
const UPSTREAM_TIMEOUT_MS = 8_000

function isAllowedOrigin(rawOrigin: string) {
  try {
    const origin = new URL(rawOrigin)
    const hostname = origin.hostname.toLowerCase()
    if (origin.protocol !== 'https:' && !ALLOWED_HOSTS.has(hostname)) return false
    return ALLOWED_HOSTS.has(hostname)
      || /^xethkioz-site-[a-z0-9-]+-xethkioz-site\.vercel\.app$/i.test(hostname)
      || /^deploy-preview-\d+--xethkioz\.netlify\.app$/i.test(hostname)
  } catch {
    return false
  }
}

function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': origin,
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type': 'application/json; charset=utf-8',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Referrer-Policy': 'no-referrer',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  }
}

function json(origin: string, status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) })
}

function ipv4Prefix(candidate: string) {
  const octets = candidate.split('.')
  if (octets.length !== 4) return null
  const numbers = octets.map(Number)
  if (numbers.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) return null
  return `${numbers[0]}.${numbers[1]}.${numbers[2]}.0`
}

function anonymizeIp(rawValue: string | null) {
  const candidate = String(rawValue || '').split(',')[0].trim().replace(/^\[|\]$/g, '')
  if (!candidate) return null

  const mapped = candidate.match(/(\d{1,3}(?:\.\d{1,3}){3})$/)?.[1]
  if (mapped) {
    const prefix = ipv4Prefix(mapped)
    if (prefix) return prefix
  }

  const v4 = ipv4Prefix(candidate)
  if (v4) return v4

  const address = candidate.split('%')[0].toLowerCase()
  if (!/^[0-9a-f:]+$/.test(address) || !address.includes(':')) return null
  const [left = '', right = ''] = address.split('::')
  const leftParts = left ? left.split(':') : []
  const rightParts = right ? right.split(':') : []
  if (leftParts.some((part) => part.length > 4) || rightParts.some((part) => part.length > 4)) return null
  const missing = Math.max(0, 8 - leftParts.length - rightParts.length)
  const expanded = [...leftParts, ...Array.from({ length: missing }, () => '0'), ...rightParts]
    .map((part) => (part || '0').replace(/^0+([0-9a-f])/i, '$1'))
  return `${expanded.slice(0, 3).join(':')}::`
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get('origin') || ''
  if (!isAllowedOrigin(origin)) {
    return new Response(JSON.stringify({ ok: false, error: 'ORIGIN_NOT_ALLOWED' }), {
      status: 403,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) })
  }
  if (request.method !== 'POST') {
    return json(origin, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' })
  }

  const contentType = request.headers.get('content-type')?.toLowerCase() || ''
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (!contentType.startsWith('application/json')) {
    return json(origin, 415, { ok: false, error: 'UNSUPPORTED_MEDIA_TYPE' })
  }
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json(origin, 413, { ok: false, error: 'PAYLOAD_TOO_LARGE' })
  }

  let payload: Record<string, unknown>
  try {
    const rawBody = await request.text()
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json(origin, 413, { ok: false, error: 'PAYLOAD_TOO_LARGE' })
    }
    payload = JSON.parse(rawBody)
  } catch {
    return json(origin, 400, { ok: false, error: 'INVALID_REQUEST' })
  }

  const wantsRegistration = payload.registerVisit === true
  const eventId = typeof payload.eventId === 'string' ? payload.eventId.trim() : ''
  if (wantsRegistration && !uuidPattern.test(eventId)) {
    return json(origin, 400, { ok: false, error: 'INVALID_REQUEST' })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')?.replace(/\/+$/, '') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  if (!supabaseUrl || !serviceKey) {
    return json(origin, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
  }

  const automated = botPattern.test(request.headers.get('user-agent') || '')
  const endpoint = wantsRegistration && !automated ? 'register_huellas_visit' : 'get_huellas_stats'
  const networkPrefix = anonymizeIp(
    request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for')
      || request.headers.get('x-real-ip'),
  )
  const rpcBody = endpoint === 'register_huellas_visit'
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
      body: JSON.stringify(rpcBody),
      signal: controller.signal,
    })
    if (!upstream.ok) {
      console.error(JSON.stringify({ level: 'error', message: 'Huellas Edge RPC failed', status: upstream.status }))
      return json(origin, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
    }

    const stats = await upstream.json()
    if (!stats || typeof stats !== 'object' || stats.status === 'invalid') {
      return json(origin, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
    }

    return json(origin, 200, {
      ok: true,
      visits: Math.max(0, Number(stats.visits) || 0),
      active_posts: Math.max(0, Number(stats.active_posts) || 0),
      reunited: Math.max(0, Number(stats.reunited) || 0),
      adoptions: Math.max(0, Number(stats.adoptions) || 0),
      counted: stats.status === 'accepted' || stats.status === 'duplicate',
      rateLimited: stats.status === 'rate_limited',
    })
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'Huellas Edge unavailable',
      reason: error instanceof Error ? error.name : 'unknown',
    }))
    return json(origin, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
  } finally {
    clearTimeout(timeout)
  }
})
