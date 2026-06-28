import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'src/services/auth/authSchema.ts',
  'src/services/auth/authNexusService.ts',
  'src/components/auth/XethkiozNexusAuth.tsx',
  'supabase/migrations/20260628_alpha36_auth_nexus_profiles_rls.sql',
]

const missing = requiredFiles.filter((file) => !existsSync(file))
if (missing.length > 0) {
  console.error('[audit:auth-nexus] Missing files:', missing.join(', '))
  process.exit(1)
}

const contracts = readFileSync('src/services/auth/authSchema.ts', 'utf8')
const service = readFileSync('src/services/auth/authNexusService.ts', 'utf8')
const bridge = readFileSync('src/engines/world/sandbox/RuntimeBridge.ts', 'utf8')
const events = readFileSync('src/engines/world/sandbox/portalEventContracts.ts', 'utf8')
const sql = readFileSync('supabase/migrations/20260628_alpha36_auth_nexus_profiles_rls.sql', 'utf8')

const checks = [
  ['subscription tiers', contracts.includes("'BASIC'") && contracts.includes("'CREATOR'") && contracts.includes("'ARCHITECT'")],
  ['user roles', contracts.includes("'GUEST'") && contracts.includes("'CONTRIBUTOR'") && contracts.includes("'ADMIN'")],
  ['permissions resolver', contracts.includes('resolvePermissions') && contracts.includes('canDispatchCriticalShaderEvents')],
  ['authorized event', events.includes('USER_SESSION_AUTHORIZED') && service.includes('USER_SESSION_AUTHORIZED')],
  ['auth state listener', service.includes('onAuthStateChange') && service.includes('handleAuthStateChange')],
  ['bridge permission guard', bridge.includes('canDispatchCriticalShaderEvents') && bridge.includes('Critical shader transition downgraded')],
  ['profiles table', sql.includes('create table if not exists public.profiles') && sql.includes('id uuid primary key')],
  ['RLS enabled', sql.includes('alter table public.profiles enable row level security')],
  ['creator article insert', sql.includes('articles_creator_insert') && sql.includes('xethkioz_can_create_article')],
  ['admin categories write', sql.includes('categories_admin_write') && sql.includes('xethkioz_is_admin')],
]

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name)
if (failed.length > 0) {
  console.error('[audit:auth-nexus] Failed checks:', failed.join(', '))
  process.exit(1)
}

console.log('[audit:auth-nexus] PASS')
