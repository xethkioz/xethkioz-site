import { createClient } from '@supabase/supabase-js'

type RateEntry = {
  count: number
  resetAt: number
}

const rateBucket = new Map<string, RateEntry>()
const WINDOW_MS = 60_000
const IP_LIMIT = 5
const ALLOWED_HOSTS = new Set(['xethkioz.com.ar', 'www.xethkioz.com.ar'])

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
}

function getRedirectUrl(request: any) {
  const configuredSiteUrl = process.env.XETHKIOZ_SITE_URL?.trim()
  if (configuredSiteUrl) {
    try {
      const url = new URL(configuredSiteUrl)
      if (url.protocol === 'https:' && ALLOWED_HOSTS.has(url.hostname)) {
        return `${url.origin}/account?mode=signin`
      }
    } catch {
      // Fall through to the safe production origin.
    }
  }

  const forwardedHost = request.headers['x-forwarded-host']
  const hostHeader = typeof forwardedHost === 'string' ? forwardedHost.split(',')[0].trim() : request.headers.host
  const host = typeof hostHeader === 'string' ? hostHeader.split(':')[0].toLowerCase() : ''
  const safeHost = ALLOWED_HOSTS.has(host) ? host : 'xethkioz.com.ar'

  return `https://${safeHost}/account?mode=signin`
}

function safeEmail(value: unknown) {
  if (typeof value !== 'string') return ''
  const email = value.trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254 ? email : ''
}

function getClientIp(request: any) {
  const forwarded = request.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim()
  return request.socket?.remoteAddress || 'unknown-ip'
}

function checkRateLimit(key: string) {
  const now = Date.now()
  const current = rateBucket.get(key)

  if (!current || current.resetAt <= now) {
    rateBucket.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true, retryAfter: 0 }
  }

  if (current.count >= IP_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) }
  }

  current.count += 1
  return { ok: true, retryAfter: 0 }
}

export default async function handler(request: any, response: any) {
  response.setHeader('Cache-Control', 'no-store, max-age=0')

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    response.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' })
    return
  }

  const ip = getClientIp(request)
  const rate = checkRateLimit(`ip:${ip}`)
  if (!rate.ok) {
    response.setHeader('Retry-After', String(rate.retryAfter))
    response.status(429).json({ ok: false, error: 'RATE_LIMITED', retryAfter: rate.retryAfter })
    return
  }

  const expectedToken = process.env.XETHKIOZ_ADMIN_RECOVERY_TOKEN
  const receivedToken = request.headers['x-xeth-admin-token']
  if (!expectedToken || typeof receivedToken !== 'string' || receivedToken.length > 512 || receivedToken !== expectedToken) {
    response.status(401).json({ ok: false, error: 'UNAUTHORIZED' })
    return
  }

  const supabaseUrl = getSupabaseUrl()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    response.status(500).json({ ok: false, error: 'INTERNAL_ERROR' })
    return
  }

  const email = safeEmail(request.body?.email)
  if (!email) {
    response.status(400).json({ ok: false, error: 'VALID_EMAIL_REQUIRED' })
    return
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: getRedirectUrl(request) },
  })

  if (error) {
    console.error('[admin-auth-link]', error)
    response.status(500).json({ ok: false, error: 'INTERNAL_ERROR' })
    return
  }

  response.status(200).json({
    ok: true,
    email,
    actionLink: data.properties?.action_link ?? null,
    note: 'Link administrativo temporal. No compartir públicamente.',
  })
}
