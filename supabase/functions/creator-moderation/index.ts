import { createClient } from 'npm:@supabase/supabase-js@2.110.7'

type Decision = 'approve' | 'reject'
type ReportDecision = 'remove' | 'dismiss'
type Body = { action?: unknown; projectId?: unknown; reportId?: unknown; decision?: unknown; reason?: unknown; reviewed?: unknown }
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const MAX_BODY = 2048
const LIMIT = 60
const WINDOW_MS = 60 * 60_000
const usage = new Map<string, { n: number; expires: number }>()

function originIsAllowed(origin: string) {
  return origin === 'https://xethkioz.com.ar' || origin === 'https://www.xethkioz.com.ar'
    || origin === 'http://localhost:5173' || origin === 'http://127.0.0.1:5173'
    || /^https:\/\/[a-z0-9-]+-xethkioz-site\.vercel\.app$/i.test(origin)
}
function headers(req: Request) {
  const origin = req.headers.get('origin') || ''
  const out: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Vary': 'Origin',
  }
  if (originIsAllowed(origin)) out['Access-Control-Allow-Origin'] = origin
  return out
}
function json(req: Request, status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), { status, headers: headers(req) })
}
function bearer(req: Request) {
  const match = /^Bearer (.+)$/i.exec(req.headers.get('authorization') || '')
  return match?.[1]?.trim() || ''
}
function secretKey() {
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim()
  if (legacy) return legacy
  try {
    const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}') as Record<string, string>
    return keys.default || Object.values(keys).find((value) => value.startsWith('sb_secret_')) || ''
  } catch { return '' }
}
function safeExternalUrl(raw: unknown) {
  if (typeof raw !== 'string' || raw.length < 9 || raw.length > 2048) return false
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return false
    const host = url.hostname.toLowerCase()
    if (!host.includes('.') || host === 'localhost' || host.endsWith('.local') || host.endsWith('.localhost') || host.endsWith('.internal')) return false
    if (/^(?:0|10|127|169\.254|192\.168)\./.test(host) || /^172\.(?:1[6-9]|2\d|3[01])\./.test(host)) return false
    if (host.startsWith('[') || host.startsWith('0x') || /^(\d+\.){3}\d+$/.test(host)) return false
    return !/[\u0000-\u001f]/.test(raw)
  } catch { return false }
}
function throttled(id: string) {
  const now = Date.now()
  if (usage.size > 2000) for (const [key, bucket] of usage) if (bucket.expires < now) usage.delete(key)
  const item = usage.get(id)
  if (!item || item.expires <= now) { usage.set(id, { n: 1, expires: now + WINDOW_MS }); return false }
  if (item.n >= LIMIT) return true
  item.n += 1
  return false
}
function validUuid(x: unknown): x is string { return typeof x === 'string' && UUID.test(x) }
function cleanNote(value: unknown) { return typeof value === 'string' ? value.trim().slice(0, 500) : '' }

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') || ''
  if (req.method === 'OPTIONS') {
    if (!originIsAllowed(origin)) return json(req, 403, { ok: false, error: 'ORIGIN_NOT_ALLOWED' })
    return new Response(null, { status: 204, headers: {
      ...headers(req),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'apikey, authorization, content-type, x-client-info',
      'Access-Control-Max-Age': '3600',
    } })
  }
  if (req.method !== 'POST') return json(req, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' })
  if (!origin || !originIsAllowed(origin)) return json(req, 403, { ok: false, error: 'ORIGIN_NOT_ALLOWED' })
  const length = Number(req.headers.get('content-length') || '0')
  if (length > MAX_BODY) return json(req, 413, { ok: false, error: 'PAYLOAD_TOO_LARGE' })
  const token = bearer(req)
  const supabaseUrl = Deno.env.get('SUPABASE_URL')?.trim() || ''
  const key = secretKey()
  if (!supabaseUrl || !key) return json(req, 503, { ok: false, error: 'NOT_CONFIGURED' })
  if (!token) return json(req, 401, { ok: false, error: 'UNAUTHORIZED' })
  const admin = createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } })
  // Auth is revalidated on the server, rather than trusting app roles supplied by browser.
  const { data: userData, error: authError } = await admin.auth.getUser(token)
  const caller = userData?.user
  if (authError || !caller) return json(req, 401, { ok: false, error: 'UNAUTHORIZED' })
  const role = String(caller.app_metadata?.role || '').toLowerCase()
  if (role !== 'admin' && role !== 'moderator') return json(req, 403, { ok: false, error: 'MODERATOR_REQUIRED' })
  if (throttled(caller.id)) return json(req, 429, { ok: false, error: 'RATE_LIMITED' })
  let body: Body
  try {
    const raw = await req.text()
    if (raw.length > MAX_BODY) return json(req, 413, { ok: false, error: 'PAYLOAD_TOO_LARGE' })
    body = JSON.parse(raw) as Body
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw Error('Not an object')
  } catch { return json(req, 400, { ok: false, error: 'INVALID_JSON' }) }

  try {
    if (body.action === 'list') {
      const [projects, reports, allReported] = await Promise.all([
        admin.from('creator_projects').select('id,author_id,author_name,title,summary,external_url,category,license,status,created_at,rejection_reason')
          .eq('status', 'pending_review').order('created_at', { ascending: true }).limit(50),
        admin.from('creator_project_reports').select('id,project_id,reason,created_at')
          .is('resolved_at', null).order('created_at', { ascending: true }).limit(50),
        admin.from('creator_projects').select('id,title,external_url,status').eq('status', 'published').limit(150),
      ])
      if (projects.error || reports.error || allReported.error) return json(req, 503, { ok: false, error: 'DATABASE_UNAVAILABLE' })
      return json(req, 200, { ok: true, queue: projects.data, reports: reports.data, reportedProjects: allReported.data })
    }

    if (body.action === 'review') {
      const id = body.projectId
      const decision = body.decision as Decision
      const reason = cleanNote(body.reason)
      if (!validUuid(id) || !['approve', 'reject'].includes(decision) || body.reviewed !== true)
        return json(req, 400, { ok: false, error: 'INVALID_REVIEW' })
      if (decision === 'reject' && reason.length < 10)
        return json(req, 400, { ok: false, error: 'REJECTION_REASON_REQUIRED' })
      const { data: project, error: projectError } = await admin.from('creator_projects').select('id,author_id,external_url,status').eq('id', id).maybeSingle()
      if (projectError || !project || project.status !== 'pending_review') return json(req, 409, { ok: false, error: 'PROJECT_CHANGED' })
      if (project.author_id === caller.id) return json(req, 403, { ok: false, error: 'SELF_REVIEW_DENIED' })
      if (decision === 'approve' && !safeExternalUrl(project.external_url)) return json(req, 400, { ok: false, error: 'UNSAFE_EXTERNAL_URL' })
      const next = decision === 'approve' ? 'published' : 'rejected'
      const patch = {
        status: next,
        published_at: decision === 'approve' ? new Date().toISOString() : null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: caller.id,
        rejection_reason: decision === 'reject' ? reason : null,
        updated_at: new Date().toISOString(),
      }
      const { data: changed, error: updateError } = await admin.from('creator_projects').update(patch)
        .eq('id', id).eq('status', 'pending_review').select('id').maybeSingle()
      if (updateError || !changed) return json(req, 409, { ok: false, error: 'PROJECT_CHANGED' })
      const { error: auditError } = await admin.from('creator_moderation_events').insert({
        project_id: id, reviewer_id: caller.id, action: decision === 'approve' ? 'approved' : 'rejected', note: reason,
      })
      if (auditError) {
        console.error('[creator-moderation] Audit write failed')
        return json(req, 503, { ok: false, error: 'AUDIT_WRITE_FAILED' })
      }
      return json(req, 200, { ok: true, projectId: id, status: next })
    }

    if (body.action === 'resolve_report') {
      const id = body.reportId
      const decision = body.decision as ReportDecision
      const reason = cleanNote(body.reason)
      if (!validUuid(id) || !['remove', 'dismiss'].includes(decision) || reason.length < 10)
        return json(req, 400, { ok: false, error: 'INVALID_RESOLUTION' })
      if (decision === 'remove' && body.reviewed !== true) return json(req, 400, { ok: false, error: 'MANUAL_REVIEW_REQUIRED' })
      const { data: report, error: reportError } = await admin.from('creator_project_reports')
        .select('id,project_id,resolved_at').eq('id', id).maybeSingle()
      if (reportError || !report || report.resolved_at) return json(req, 409, { ok: false, error: 'REPORT_CHANGED' })
      if (decision === 'remove') {
        const { data: project } = await admin.from('creator_projects').select('id,author_id,status').eq('id', report.project_id).maybeSingle()
        if (!project || project.status !== 'published') return json(req, 409, { ok: false, error: 'PROJECT_NOT_PUBLIC' })
        if (project.author_id === caller.id) return json(req, 403, { ok: false, error: 'SELF_REVIEW_DENIED' })
        const { data: removed, error: removalError } = await admin.from('creator_projects').update({
          status: 'rejected', published_at: null, rejection_reason: reason,
          reviewed_by: caller.id, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        }).eq('id', report.project_id).eq('status', 'published').select('id').maybeSingle()
        if (removalError || !removed) return json(req, 409, { ok: false, error: 'PROJECT_CHANGED' })
      }
      const { error: resolvedError } = await admin.from('creator_project_reports').update({
        resolved_at: new Date().toISOString(), resolved_by: caller.id, resolution: decision === 'remove' ? 'removed' : 'dismissed',
      }).eq('id', id).is('resolved_at', null)
      if (resolvedError) return json(req, 503, { ok: false, error: 'REPORT_RESOLUTION_FAILED' })
      const { error: auditError } = await admin.from('creator_moderation_events').insert({
        project_id: report.project_id, reviewer_id: caller.id,
        action: decision === 'remove' ? 'unpublished' : 'report_dismissed', note: reason,
      })
      if (auditError) return json(req, 503, { ok: false, error: 'AUDIT_WRITE_FAILED' })
      return json(req, 200, { ok: true, reportId: id })
    }

    return json(req, 400, { ok: false, error: 'UNKNOWN_ACTION' })
  } catch (error) {
    console.error('[creator-moderation] Operation failed', error instanceof Error ? error.message : String(error))
    return json(req, 503, { ok: false, error: 'SERVICE_UNAVAILABLE' })
  }
})
