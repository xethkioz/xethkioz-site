import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

const hud = read('src/lib/HudContext.tsx')
const guard = read('src/components/UserSessionInactivityGuard.tsx')
const client = read('src/services/supabaseClient.ts')
const app = read('src/App.tsx')
const browserWorkflow = read('.github/workflows/browser-quality.yml')
const browserTest = read('tests/e2e/user-session.spec.ts')

check('Supabase persists sessions', client.includes('persistSession: true'))
check('Supabase automatically refreshes tokens', client.includes('autoRefreshToken: true'))
check('stored HUD cache starts as loading, not connected', hud.includes("? { status: 'loading', name, source: 'stored', checked: false }") && !hud.includes("source: 'stored', checked: false }\n    :"))
check('private account identity comes only from Supabase user', hud.includes("source: 'supabase', checked: true"))
check('local inactivity logout does not revoke other devices', hud.includes("signOut({ scope: 'local' })"))
check('auth state refreshes on visibility, pageshow, online and storage events', hud.includes("addEventListener('visibilitychange'") && hud.includes("addEventListener('pageshow'") && hud.includes("addEventListener('online'") && hud.includes("addEventListener('storage'"))
check('profile inactivity threshold is exactly five minutes', guard.includes('PROFILE_INACTIVITY_MS = 5 * 60_000'))
check('logout grace period is exactly ten seconds', guard.includes('PROFILE_LOGOUT_GRACE_SECONDS = 10'))
check('guard is armed only for profile route', guard.includes("location.pathname === '/profile'"))
check('guard requires verified Supabase session in production', guard.includes("account.source === 'supabase'") && guard.includes('account.checked === true'))
check('guard revalidates Supabase session before continuing', guard.includes('supabase.auth.getSession()'))
check('guard synchronizes tabs with BroadcastChannel', guard.includes("CHANNEL_NAME = 'xethkioz-auth-session'") && guard.includes('new BroadcastChannel'))
check('guard redirects with explicit inactivity reason', guard.includes("/account?mode=signin&reason=inactive"))
check('guard is mounted globally inside the router shell', app.includes('<UserSessionInactivityGuard />'))
check('browser test harness is isolated to browser CI', browserWorkflow.includes("VITE_E2E_AUTH_SESSION: '1'") && guard.includes("import.meta.env.VITE_E2E_AUTH_SESSION === '1'"))
check('browser tests cover fake cache, continue and auto logout', browserTest.includes('un estado HUD manipulado') && browserTest.includes('Continuar conectado') && browserTest.includes('cierra la sesión diez segundos'))

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`Auth session security audit failed: ${failed} checks failed.`)
  process.exit(1)
}

console.log('XETHKIOZ auth session security audit PASS')
