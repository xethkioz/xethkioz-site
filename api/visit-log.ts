function cleanText(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : null
}

function detectClient(userAgent: string) {
  const ua = userAgent.toLowerCase()
  const os = /android/.test(ua) ? 'Android' : /iphone|ipad|ios/.test(ua) ? 'iOS' : /windows/.test(ua) ? 'Windows' : /mac os|macintosh/.test(ua) ? 'macOS' : /linux/.test(ua) ? 'Linux' : 'Otro'
  const browser = /edg\//.test(ua) ? 'Edge' : /firefox\//.test(ua) ? 'Firefox' : /opr\//.test(ua) ? 'Opera' : /chrome\//.test(ua) ? 'Chrome' : /safari\//.test(ua) ? 'Safari' : 'Otro'
  return { os, browser }
}

function getIp(request: any) {
  const raw = String(request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || '').split(',')[0].trim()
  return raw.length <= 45 && /^[0-9a-f:.]+$/i.test(raw) ? raw : null
}

function isTrustedSiteRequest(request: any) {
  const source = String(request.headers.origin || request.headers.referer || '').trim()
  if (!source) return request.headers['sec-fetch-site'] === 'same-origin'
  try {
    const hostname = new URL(source).hostname.toLowerCase()
    return hostname === 'xethkioz.com.ar'
      || hostname === 'www.xethkioz.com.ar'
      || hostname === 'localhost'
      || hostname === '127.0.0.1'
      || hostname.endsWith('.vercel.app')
  } catch {
    return false
  }
}

export default async function handler(request: any, response: any) {
  response.setHeader('Cache-Control', 'no-store')
  if (request.method !== 'POST') return response.status(405).json({ ok: false })
  if (!isTrustedSiteRequest(request)) return response.status(403).json({ ok: false })

  const supabaseUrl = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return response.status(204).end()

  const body = request.body && typeof request.body === 'object' ? request.body : {}
  const route = cleanText(body.route, 240)
  if (!route || !route.startsWith('/')) return response.status(400).json({ ok: false })

  const userAgent = cleanText(request.headers['user-agent'], 700) || 'desconocido'
  const client = detectClient(userAgent)
  const row = {
    route,
    ip_address: getIp(request),
    user_agent: userAgent,
    device_type: ['mobile', 'tablet', 'desktop'].includes(body.deviceType) ? body.deviceType : 'unknown',
    os_family: client.os,
    browser_family: client.browser,
    viewport_width: Number.isInteger(body.viewportWidth) ? Math.max(0, Math.min(10000, body.viewportWidth)) : null,
    viewport_height: Number.isInteger(body.viewportHeight) ? Math.max(0, Math.min(10000, body.viewportHeight)) : null,
    language: cleanText(body.language, 24),
    timezone: cleanText(body.timezone, 80),
    referrer_host: cleanText(body.referrerHost, 180),
    country_code: cleanText(request.headers['x-vercel-ip-country'], 3),
    region_code: cleanText(request.headers['x-vercel-ip-country-region'], 16),
  }
  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }
  const stored = await fetch(`${supabaseUrl}/rest/v1/site_visit_logs`, { method: 'POST', headers, body: JSON.stringify(row) })
  if (!stored.ok) {
    console.error('visit-log insert failed', stored.status)
    return response.status(202).json({ ok: false })
  }
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  await fetch(`${supabaseUrl}/rest/v1/site_visit_logs?visited_at=lt.${encodeURIComponent(cutoff)}`, { method: 'DELETE', headers }).catch(() => undefined)
  return response.status(202).json({ ok: true })
}
