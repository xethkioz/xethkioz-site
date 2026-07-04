import { createClient } from '@supabase/supabase-js'

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
}

function getRedirectUrl(request: any) {
  const host = request.headers['x-forwarded-host'] || request.headers.host || 'xethkioz.com.ar'
  const protocol = request.headers['x-forwarded-proto'] || 'https'
  return `${protocol}://${host}/account?mode=signin`
}

function safeEmail(value: unknown) {
  if (typeof value !== 'string') return ''
  const email = value.trim().toLowerCase()
  return /\S+@\S+\.\S+/.test(email) ? email : ''
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const expectedToken = process.env.XETHKIOZ_ADMIN_RECOVERY_TOKEN
  const receivedToken = request.headers['x-xeth-admin-token']
  if (!expectedToken || receivedToken !== expectedToken) {
    response.status(401).json({ ok: false, error: 'Unauthorized' })
    return
  }

  const supabaseUrl = getSupabaseUrl()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    response.status(500).json({ ok: false, error: 'Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Vercel.' })
    return
  }

  const email = safeEmail(request.body?.email)
  if (!email) {
    response.status(400).json({ ok: false, error: 'Valid email required.' })
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
    response.status(500).json({ ok: false, error: error.message })
    return
  }

  response.status(200).json({
    ok: true,
    email,
    actionLink: data.properties?.action_link ?? null,
    note: 'Link administrativo temporal. No compartir publicamente.',
  })
}
