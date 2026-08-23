import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

const analytics = read('src/components/Analytics.tsx')
const api = read('api/visit-log.ts')
const edge = read('supabase/functions/visit-log/index.ts')
const config = read('supabase/config.toml')
const migration = read('supabase/migrations/20260724153500_privacy_preserving_visit_telemetry.sql')
const retentionSchedule = read('supabase/migrations/20260823173000_maintenance_retention_and_expiry.sql')

check('browser telemetry uses only the same-origin proxy', analytics.includes("const TELEMETRY_ENDPOINT = '/api/visit-log'") && !analytics.includes('/functions/v1/visit-log'))
check('browser telemetry no longer reads public Supabase credentials', !analytics.includes('VITE_SUPABASE_URL') && !analytics.includes('VITE_SUPABASE_ANON_KEY'))
check('telemetry events have UUID idempotency keys', analytics.includes('crypto.randomUUID') && analytics.includes('eventId'))
check('failed telemetry is retried without unbounded loops', analytics.includes('MAX_SEND_ATTEMPTS = 3') && analytics.includes("window.addEventListener('online'"))
check('successful and rejected telemetry states are persisted', analytics.includes("'pending' | 'sent' | 'dropped'") && analytics.includes("persistEventState(storageKey, 'sent'"))

check('collector permits POST only', api.includes("request.method !== 'POST'") && api.includes("response.setHeader('Allow', 'POST')"))
check('collector rejects untrusted origins', api.includes('isTrustedSiteRequest') && api.includes("error: 'ORIGIN_NOT_ALLOWED'"))
check('collector requires JSON media type', api.includes("contentType.startsWith('application/json')") && api.includes("error: 'UNSUPPORTED_MEDIA_TYPE'"))
check('collector enforces a four KiB payload budget', api.includes('MAX_BODY_BYTES = 4_096') && api.includes('Buffer.byteLength'))
check('collector validates UUID event ids and local routes', api.includes('uuidPattern') && api.includes('cleanRoute'))
check('collector excludes automated clients', api.includes('isAutomatedClient') && api.includes("ignored: 'automated-client'"))
check('collector anonymizes IPv4 and IPv6 before storage', api.includes('anonymizeIp') && api.includes("return `${octets[0]}.${octets[1]}.${octets[2]}.0`") && api.includes('expanded.slice(0, 3)'))
check('collector uses the protected ingestion RPC', api.includes('/rest/v1/rpc/xethkioz_record_site_visit') && !api.includes('/rest/v1/site_visit_logs'))
check('collector exposes no raw IP or user-agent in responses', !api.includes('ip_address: getRawIp') && !api.includes('user_agent: userAgent'))
check('collector has instance and database rate-limit handling', api.includes('INSTANCE_LIMIT') && api.includes("result?.status === 'rate_limited'"))
check('retention RPC is invoked only from the root route', api.includes("if (route !== '/'"))

check('legacy Edge ingestion is retired', edge.includes("error: 'ENDPOINT_RETIRED'") && edge.includes('status: 410'))
check('retired Edge function requires a JWT', /\[functions\.visit-log\][\s\S]*?verify_jwt\s*=\s*true/.test(config))

check('database adds unique idempotency keys', migration.includes('site_visit_logs_event_id_unique') && migration.includes('where event_id is not null'))
check('database serializes network rate checks', migration.includes('pg_advisory_xact_lock') && migration.includes("interval '1 minute'"))
check('database stores only redacted user agent values', migration.includes("'redacted'") && migration.includes('Never a complete client IP'))
check('ingestion RPC is service-role only', migration.includes('revoke all on function public.xethkioz_record_site_visit') && migration.includes('to service_role'))
check('retention marker survives runtime cold starts', migration.includes("cleanup_key constant text := 'visit_log_retention_cleanup'") && migration.includes("interval '6 hours'"))
check('retention cleanup is concurrency-safe', migration.includes('hashtextextended(cleanup_key, 0)') && migration.includes('on conflict (key) do update'))
check('cleanup RPC is service-role only', migration.includes('revoke all on function public.xethkioz_cleanup_site_visits()') && migration.includes('grant execute on function public.xethkioz_cleanup_site_visits() to service_role'))
check('30-day retention is scheduled and replay-safe', retentionSchedule.includes("xethkioz-site-visit-retention-30d") && retentionSchedule.includes('cron.unschedule') && retentionSchedule.includes('cron.schedule') && retentionSchedule.includes('xethkioz_cleanup_site_visits'))
check('expired Huellas notice is resolved without deletion', retentionSchedule.includes("set status = 'resolved'") && retentionSchedule.includes("and expires_at < now()"))

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`Telemetry security audit failed: ${failed} checks failed.`)
  process.exit(1)
}

console.log('XETHKIOZ telemetry security audit PASS')
