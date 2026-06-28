import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const checks = []
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const exists = (relative) => fs.existsSync(path.join(root, relative))
function check(name, ok, detail = '') { checks.push({ name, ok: Boolean(ok), detail }) }
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function runNodeAudit(name, scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
    shell: false,
    windowsHide: true,
  })
  const ok = result.status === 0
  const stdout = result.stdout ?? ''
  const stderr = result.stderr ?? ''
  const errorMessage = result.error ? `\n${result.error.message}` : ''
  check(name, ok, ok ? 'PASS' : `${stdout}\n${stderr}${errorMessage}`.slice(0, 1600))
  if (!ok) process.stderr.write(`${name} failed\n${stdout}\n${stderr}${errorMessage}\n`)
}

const pkg = JSON.parse(read('package.json'))
const sql = read('database/migrations/20260628_alpha36_auth_nexus_profiles_rls.sql')
const supabaseSql = read('supabase/migrations/20260628_alpha36_auth_nexus_profiles_rls.sql')
const authService = read('src/services/auth/authNexusService.ts')
const authUi = read('src/components/auth/XethkiozNexusAuth.tsx')
const runtimeBridge = read('src/engines/world/sandbox/RuntimeBridge.ts')
const perf = read('src/engines/world/sandbox/PerformanceMonitor.ts')
const shaderManager = read('src/engines/world/sandbox/ShaderManager.ts')
const contracts = read('src/engines/world/sandbox/portalEventContracts.ts')

check('RC-Live version stamped', pkg.version.includes('rc-live'))
check('production audit script registered', pkg.scripts['audit:production-ready'] === 'node scripts/production-ready-check.mjs')
check('database and supabase auth migrations match', sql === supabaseSql)
check('profiles RLS enabled', sql.includes('alter table public.profiles enable row level security'))
check('public profile projection exists', sql.includes('create or replace view public.public_profiles'))
check('privilege update guard exists', sql.includes('xethkioz_guard_profile_privilege_update'))
check('no unrestricted public profiles read policy', !/create\s+policy\s+\"profiles_public_read\"/i.test(sql))
check('self insert restricted to BASIC/GUEST', sql.includes('profiles_self_insert_basic_only') && sql.includes("subscription_tier = 'BASIC'") && sql.includes("role = 'GUEST'"))
check('safe auth event source guard', read('src/services/auth/authSchema.ts').includes("source: 'supabase-auth-nexus'") && read('src/services/auth/authSchema.ts').includes('isAuthorizedSessionPayload'))
check('auth service fetches profiles before event emit', authService.includes("from('profiles')") && authService.includes('USER_SESSION_AUTHORIZED'))
check('auth service has no unknown cast', !authService.includes('as unknown as'))
check('auth UI has loading and safe error mapping', /isLoading|loading/i.test(authUi) && authUi.includes('mapAuthErrorForUser'))
check('runtime bridge validates auth payload', runtimeBridge.includes('isAuthorizedSessionPayload') && runtimeBridge.includes('Ignored malformed USER_SESSION_AUTHORIZED'))
check('runtime bridge validates portal payload', runtimeBridge.includes('Ignored malformed PORTAL_STATE_CHANGED'))
check('shader manager supports networkLatency uniform', read('src/engines/world/sandbox/shaderContracts.ts').includes('networkLatency') && shaderManager.includes('setRuntimeUniformProfile'))
check('performance monitor has latency timeout', perf.includes('withTimeout') && perf.includes('Latency probe timeout'))
check('performance monitor throttles critical reports', perf.includes('lastCriticalDropReportAt'))
const strictPackageAudit = process.env.XETHKIOZ_STRICT_PACKAGE_AUDIT === '1'
if (strictPackageAudit) {
  check('no env files packaged', !exists('.env') && !exists('.env.local') && !exists('.env.production'))
} else {
  check('env files protected by .gitignore', read('.gitignore').includes('.env'))
}
if (strictPackageAudit) {
  check('node_modules absent before packaging', !exists('node_modules'))
  check('dist absent before packaging', !exists('dist'))
} else {
  check('node_modules package exclusion is covered by .gitignore', read('.gitignore').includes('node_modules/'))
  check('dist package exclusion is covered by .gitignore', read('.gitignore').includes('dist/'))
}

runNodeAudit('security hardening audit', 'scripts/security-hardening-check.mjs')
runNodeAudit('auth nexus audit', 'scripts/auth-nexus-check.mjs')
runNodeAudit('latency glitch audit', 'scripts/latency-glitch-bridge-check.mjs')
runNodeAudit('supabase hydration audit', 'scripts/supabase-hydration-check.mjs')
runNodeAudit('eventbus telemetry audit', 'scripts/eventbus-telemetry-check.mjs')
runNodeAudit('shader pipeline audit', 'scripts/shader-pipeline-sandbox-check.mjs')
runNodeAudit('visual runtime audit', 'scripts/visual-runtime-sandbox-check.mjs')
runNodeAudit('news factory audit', 'scripts/news-factory-check.mjs')

let failed = 0
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.name}`)
  if (!item.ok) {
    failed += 1
    if (item.detail) console.log(item.detail)
  }
}

if (failed) {
  console.error(`Production-ready audit failed: ${failed} checks failed.`)
  process.exit(1)
}

console.log('XETHKIOZ RC-Live production-ready audit PASS')
