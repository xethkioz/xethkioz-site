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
const generateNews = read('api/generate-news/index.ts')
const adminSession = read('src/cms/hooks/useAdminSession.ts')
const adminUsers = read('supabase/functions/admin-users/index.ts')
const supabaseConfig = read('supabase/config.toml')
const adminConsistency = read('supabase/migrations/20260723120000_security_admin_consistency.sql')
const articlePolicyConsolidation = read('supabase/migrations/20260723121500_articles_policy_consolidation.sql')
const mainEntry = read('src/main.tsx')
const appShell = read('src/App.tsx')

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
check('news generation ignores editable user metadata roles', !generateNews.includes('user_metadata?.role') && generateNews.includes('app_metadata?.role'))
check('paid tiers do not grant administrator status', adminSession.includes("const isAdmin = role === 'ADMIN'") && !/const\s+isAdmin[^\n]*ARCHITECT/.test(adminSession))
check('admin account mutations require authenticated Edge function', supabaseConfig.includes('[functions.admin-users]') && supabaseConfig.includes('verify_jwt = true') && adminUsers.includes('admin.auth.getUser(token)'))
check('admin Edge function validates secure role metadata', adminUsers.includes('caller.app_metadata?.role') && !adminUsers.includes('caller.user_metadata?.role'))
check('privileged RLS helpers move outside the public API schema', adminConsistency.includes('set schema private') && adminConsistency.includes('revoke all on function private.xethkioz_has_role'))
check('legacy articles policy does not expose all rows to signed-in users', articlePolicyConsolidation.includes('articles_authenticated_read') && articlePolicyConsolidation.includes("status = 'published'") && !articlePolicyConsolidation.includes("or (select auth.uid()) is not null"))
check('legacy articles use one SELECT policy per audience', articlePolicyConsolidation.includes('articles_anon_published_read') && articlePolicyConsolidation.includes('to anon') && articlePolicyConsolidation.includes('to authenticated'))
check('safe boot renders error details as text', mainEntry.includes('details.textContent = message') && !mainEntry.includes('document.body.innerHTML'))
check('world runtime integration is mounted', appShell.includes('<WorldRuntimeIntegration />'))

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
