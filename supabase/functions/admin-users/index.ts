import { createClient } from 'npm:@supabase/supabase-js@2.110.7'

type ProfileRole = 'GUEST' | 'USER' | 'CONTRIBUTOR' | 'EDITOR' | 'MODERATOR' | 'ADMIN'
type SubscriptionTier = 'BASIC' | 'CREATOR' | 'ARCHITECT'
type RateEntry = { count: number; resetAt: number }

const roleOptions = new Set<ProfileRole>(['GUEST', 'USER', 'CONTRIBUTOR', 'EDITOR', 'MODERATOR', 'ADMIN'])
const inviteRoleOptions = new Set<ProfileRole>(['GUEST', 'USER', 'CONTRIBUTOR', 'EDITOR', 'MODERATOR'])
const tierOptions = new Set<SubscriptionTier>(['BASIC', 'CREATOR', 'ARCHITECT'])
const rateBucket = new Map<string, RateEntry>()
const WINDOW_MS = 60 * 60_000
const ADMIN_LIMIT = 30
const MAX_BODY_BYTES = 4_096

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
    'Referrer-Policy': 'no-referrer',
    Vary: 'Origin',
    'X-Content-Type-Options': 'nosniff',
  }
  if (isAllowedOrigin(origin)) headers['Access-Control-Allow-Origin'] = origin
  return headers
}

function json(request: Request, status: number, payload: unknown, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(payload), { status, headers: { ...responseHeaders(request), ...extraHeaders } })
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

function getBearerToken(request: Request) {
  const header = request.headers.get('authorization') || ''
  return header.startsWith('Bearer ') ? header.slice(7).trim() : ''
}

function normalizeRole(value: unknown): ProfileRole | null {
  const role = String(value ?? '').trim().toUpperCase() as ProfileRole
  return roleOptions.has(role) ? role : null
}

function normalizeTier(value: unknown): SubscriptionTier | null {
  const tier = String(value ?? '').trim().toUpperCase() as SubscriptionTier
  return tierOptions.has(tier) ? tier : null
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function isEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function checkRateLimit(userId: string) {
  const now = Date.now()
  const current = rateBucket.get(userId)
  if (!current || current.resetAt <= now) {
    rateBucket.set(userId, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true, retryAfter: 0 }
  }
  if (current.count >= ADMIN_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) }
  }
  current.count += 1
  return { ok: true, retryAfter: 0 }
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get('origin') || ''

  if (request.method === 'OPTIONS') {
    if (!isAllowedOrigin(origin)) return json(request, 403, { ok: false })
    return new Response(null, {
      status: 204,
      headers: {
        ...responseHeaders(request),
        'Access-Control-Allow-Headers': 'apikey, authorization, content-type, x-client-info',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  if (request.method !== 'POST') return json(request, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' }, { Allow: 'POST, OPTIONS' })
  if (!origin || !isAllowedOrigin(origin)) return json(request, 403, { ok: false, error: 'ORIGIN_NOT_ALLOWED' })

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return json(request, 413, { ok: false, error: 'PAYLOAD_TOO_LARGE' })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')?.trim() || ''
  const secretKey = getSecretKey()
  const token = getBearerToken(request)
  if (!supabaseUrl || !secretKey) return json(request, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
  if (!token) return json(request, 401, { ok: false, error: 'UNAUTHORIZED' })

  const admin = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: authData, error: authError } = await admin.auth.getUser(token)
  const caller = authData?.user
  if (authError || !caller) return json(request, 401, { ok: false, error: 'UNAUTHORIZED' })

  const metadataAdmin = String(caller.app_metadata?.role ?? '').toLowerCase() === 'admin'
  const { data: profile } = await admin.from('profiles').select('role').eq('id', caller.id).maybeSingle()
  const profileAdmin = String(profile?.role ?? '').toUpperCase() === 'ADMIN'
  if (!metadataAdmin && !profileAdmin) return json(request, 403, { ok: false, error: 'FORBIDDEN' })

  const rate = checkRateLimit(caller.id)
  if (!rate.ok) return json(request, 429, { ok: false, error: 'RATE_LIMITED' }, { 'Retry-After': String(rate.retryAfter) })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json(request, 400, { ok: false, error: 'INVALID_REQUEST' })
  }

  if (body.action === 'set_profile_access') {
    const targetUserId = body.targetUserId
    const nextRole = normalizeRole(body.role)
    const nextTier = normalizeTier(body.tier)
    if (!isUuid(targetUserId) || !nextRole || !nextTier) return json(request, 400, { ok: false, error: 'INVALID_ACCESS_CHANGE' })
    if (targetUserId === caller.id && nextRole !== 'ADMIN') return json(request, 409, { ok: false, error: 'SELF_ADMIN_LOCKOUT_BLOCKED' })

    const { data: targetAuth, error: targetAuthError } = await admin.auth.admin.getUserById(targetUserId)
    if (targetAuthError || !targetAuth.user) return json(request, 404, { ok: false, error: 'USER_NOT_FOUND' })

    const previousMetadata = targetAuth.user.app_metadata || {}
    const nextMetadata = { ...previousMetadata, role: nextRole === 'ADMIN' ? 'admin' : nextRole.toLowerCase() }
    const { error: metadataError } = await admin.auth.admin.updateUserById(targetUserId, { app_metadata: nextMetadata })
    if (metadataError) return json(request, 503, { ok: false, error: 'AUTH_UPDATE_FAILED' })

    const { data: updatedProfile, error: profileError } = await admin
      .from('profiles')
      .update({ role: nextRole, subscription_tier: nextTier, updated_at: new Date().toISOString() })
      .eq('id', targetUserId)
      .select('id, role, subscription_tier, updated_at')
      .maybeSingle()

    if (profileError || !updatedProfile) {
      await admin.auth.admin.updateUserById(targetUserId, { app_metadata: previousMetadata })
      return json(request, 503, { ok: false, error: 'PROFILE_UPDATE_FAILED' })
    }

    return json(request, 200, { ok: true, profile: updatedProfile })
  }

  if (body.action === 'invite_user') {
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const nextRole = normalizeRole(body.role)
    const nextTier = normalizeTier(body.tier)
    if (!isEmail(email) || !nextRole || !inviteRoleOptions.has(nextRole) || !nextTier) {
      return json(request, 400, { ok: false, error: 'INVALID_INVITATION' })
    }

    const { data: invitation, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: 'https://www.xethkioz.com.ar/confirm-email',
    })
    if (inviteError || !invitation.user) {
      console.error('[admin-users] Invitation failed', { code: inviteError?.code, message: inviteError?.message })
      return json(request, 409, { ok: false, error: 'INVITATION_FAILED' })
    }

    const { data: invitedProfile, error: accessError } = await admin
      .from('profiles')
      .update({ role: nextRole, subscription_tier: nextTier, updated_at: new Date().toISOString() })
      .eq('id', invitation.user.id)
      .select('id')
      .maybeSingle()

    if (accessError || !invitedProfile) {
      console.error('[admin-users] Invited profile access failed', { code: accessError?.code, message: accessError?.message })
      return json(request, 202, { ok: true, invited: true, accessPending: true })
    }

    return json(request, 201, { ok: true, invited: true, accessPending: false })
  }

  return json(request, 400, { ok: false, error: 'UNKNOWN_ACTION' })
})
