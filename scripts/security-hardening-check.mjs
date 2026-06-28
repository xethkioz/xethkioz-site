import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const checks = []
function check(name, ok) { checks.push([name, Boolean(ok)]) }

const sql = read('database/migrations/20260628_alpha36_auth_nexus_profiles_rls.sql')
const authService = read('src/services/auth/authNexusService.ts')
const authSchema = read('src/services/auth/authSchema.ts')
const bridge = read('src/engines/world/sandbox/RuntimeBridge.ts')
const perf = read('src/engines/world/sandbox/PerformanceMonitor.ts')
const authUi = read('src/components/auth/XethkiozNexusAuth.tsx')
const contracts = read('src/engines/world/sandbox/portalEventContracts.ts')

check('profiles public read removed', !sql.includes('create policy "profiles_public_read"'))
check('profiles self insert locked to BASIC/GUEST', sql.includes('profiles_self_insert_basic_only') && sql.includes("subscription_tier = 'BASIC'") && sql.includes("role = 'GUEST'"))
check('profile privilege guard trigger exists', sql.includes('xethkioz_guard_profile_privilege_update'))
check('public profile projection excludes privileges', sql.includes('create or replace view public.public_profiles') && !/public_profiles[\s\S]*subscription_tier/.test(sql))
check('auth service uses typed profiles table', !authService.includes('as unknown as') && authService.includes("this.client.from('profiles')"))
check('authorized session source branded', authSchema.includes("source: 'supabase-auth-nexus'") && authSchema.includes('isAuthorizedSessionPayload'))
check('runtime bridge validates auth event payload', bridge.includes('isAuthorizedSessionPayload') && bridge.includes('Ignored malformed USER_SESSION_AUTHORIZED'))
check('runtime bridge rejects malformed portal event', bridge.includes('Ignored malformed PORTAL_STATE_CHANGED'))
check('latency probe has timeout', perf.includes('withTimeout') && perf.includes('Latency probe timeout'))
check('critical performance reports throttled', perf.includes('lastCriticalDropReportAt'))
check('auth UI maps production-safe errors', authUi.includes('mapAuthErrorForUser'))
check('portal event map is exhaustive', contracts.includes('PORTAL_STATE_CHANGED') && contracts.includes('CRITICAL_PERFORMANCE_DROP') && contracts.includes('USER_SESSION_AUTHORIZED') && contracts.includes('NETWORK_LATENCY_CHANGED'))

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`Security hardening audit failed: ${failed} checks failed.`)
  process.exit(1)
}
console.log('XETHKIOZ security hardening audit PASS')
