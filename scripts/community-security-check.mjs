import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

const statsClient = read('public/mascotas/stats.js')
const statsApi = read('api/huellas-stats.ts')
const statsEdge = read('supabase/functions/huellas-stats/index.ts')
const community = read('src/lib/realtimeCommunity.ts')
const profile = read('src/pages/ProfileHub.tsx')
const migration = read('supabase/migrations/20260821155622_secure_public_metrics_and_activity.sql')
const cleanup = read('supabase/migrations/20260821164237_retire_legacy_public_writes.sql')
const finalRpcHardening = read('supabase/migrations/20260828170000_harden_readonly_huellas_rpc.sql')
const statsInvokerHardening = read('supabase/migrations/20260828170100_harden_huellas_stats_security_invoker.sql')
const passwordPolicy = read('docs/SECURITY/AUTH_PASSWORD_POLICY_2026-07-23.md')

check('Huellas browser uses same-origin metrics as its primary path', statsClient.includes("fetch('/api/huellas-stats'") && !statsClient.includes('/rest/v1/rpc/'))
check('Huellas browser sends an idempotency event id', statsClient.includes('crypto.randomUUID()') && statsClient.includes('eventId'))
check('Huellas browser rejects non-JSON fallbacks without console errors', statsClient.includes("contentType.includes('application/json')") && !statsClient.includes('console.error'))
check('Huellas endpoint accepts POST only and rejects foreign origins', statsApi.includes("request.method !== 'POST'") && statsApi.includes('isTrustedSiteRequest'))
check('Huellas endpoint rate-limits before the database call', statsApi.includes('checkRateLimit') && statsApi.includes('INSTANCE_LIMIT'))
check('Huellas endpoint stores only an anonymized network prefix', statsApi.includes('anonymizeIp') && !statsApi.includes('p_raw_ip'))
check('Huellas write path requires the server-only service key', statsApi.includes('SUPABASE_SERVICE_ROLE_KEY') && statsApi.includes('canRegister = wantsRegistration') && !statsClient.includes('SUPABASE_KEY'))
check('Huellas preview fallback is read-only', statsApi.includes("const endpoint = canRegister ? 'register_huellas_visit' : 'get_huellas_stats'") && cleanup.includes('mutating visit RPC is private'))
check('Huellas uses the Edge writer only when Vercel cannot register', statsClient.includes('stats.registrationAvailable === false') && statsClient.includes('registerThroughEdge(eventId)'))
check('Huellas Edge writer applies origin, bot, payload and IP controls', statsEdge.includes('isAllowedOrigin') && statsEdge.includes('botPattern') && statsEdge.includes('MAX_BODY_BYTES') && statsEdge.includes('anonymizeIp'))
check('Huellas Edge writer keeps the service key outside the browser', statsEdge.includes("Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')") && !statsClient.includes('SUPABASE_SERVICE_ROLE_KEY'))
check('Huellas mutating RPC is service-role only after rollout', migration.includes('grant execute on function public.register_huellas_visit(uuid, inet) to service_role') && cleanup.includes('drop function if exists public.register_huellas_visit()'))
check('Huellas visit counting is idempotent and network-limited', migration.includes('private.huellas_visit_events') && migration.includes("interval '24 hours'") && migration.includes('recent_network_count >= 5'))
check('Huellas private event storage has defense-in-depth RLS', migration.includes('alter table private.huellas_visit_events enable row level security') && migration.includes('force row level security'))
check('Huellas compatibility grant is explicit during additive rollout', migration.includes('grant execute on function public.get_huellas_stats() to anon, authenticated, service_role'))
check('Huellas compatibility grant was retired before the final least-privilege design', finalRpcHardening.includes('from public, anon, authenticated') && finalRpcHardening.includes('grant execute on function public.get_huellas_stats() to service_role'))
check('Huellas read aggregate runs with caller privileges', /create or replace function public\.get_huellas_stats\(\)[\s\S]*?security invoker/i.test(statsInvokerHardening) && !/^\s*security definer\b/im.test(statsInvokerHardening))
check('Huellas raw stats expose only the singleton row through RLS', statsInvokerHardening.includes('grant select on table public.huellas_stats to anon, authenticated') && statsInvokerHardening.includes('using (id = 1)'))
check('Huellas read RPC is explicitly callable by browser and service roles', statsInvokerHardening.includes('grant execute on function public.get_huellas_stats() to anon, authenticated, service_role'))

check('client XP uses the protected claim RPC', community.includes(".rpc('xethkioz_claim_activity'") && !community.includes("from('user_activity_events').insert"))
check('anonymous XP is no longer persisted as authoritative data', !community.includes("from('xeth_wisp_events').insert"))
check('connected profile uses server XP instead of local maximum', profile.includes('isConnected ? syncedXp : progress.xp') && !profile.includes('Math.max(progress.xp, syncedXp)'))
check('server events update the connected profile', community.includes('xethkioz:wisp-server-event') && profile.includes('xethkioz:wisp-server-event'))
check('database owns the XP award map and daily cap', migration.includes("when 'daily' then 25") && migration.includes('daily_points + award > 250'))
check('activity claim queries have compound indexes', migration.includes('user_activity_events_user_type_time_idx') && migration.includes('user_activity_events_user_type_route_time_idx'))
check('authenticated users cannot insert arbitrary activity rows after rollout', cleanup.includes('revoke insert on table public.user_activity_events from authenticated'))
check('guest chat policy applies only to anon', /create policy chat_messages_guest_insert[\s\S]*?to anon[\s\S]*?with check/.test(migration))
check('free-plan password limitation remains documented honestly', passwordPolicy.includes('plan **Free**') && passwordPolicy.includes('no afirma ni simula'))

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`Community security audit failed: ${failed} checks failed.`)
  process.exit(1)
}

console.log('XETHKIOZ community security audit PASS')
