import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'src/services/auth/authSchema.ts',
  'src/services/auth/authNexusService.ts',
  'src/services/auth/passwordPolicy.ts',
  'src/components/auth/XethkiozNexusAuth.tsx',
  'src/pages/AccountAccessStable.tsx',
  'supabase/migrations/20260628_alpha36_auth_nexus_profiles_rls.sql',
]

const missing = requiredFiles.filter((file) => !existsSync(file))
if (missing.length > 0) {
  console.error('[audit:auth-nexus] Missing files:', missing.join(', '))
  process.exit(1)
}

const contracts = readFileSync('src/services/auth/authSchema.ts', 'utf8')
const service = readFileSync('src/services/auth/authNexusService.ts', 'utf8')
const passwordPolicy = readFileSync('src/services/auth/passwordPolicy.ts', 'utf8')
const accountAccess = readFileSync('src/pages/AccountAccessStable.tsx', 'utf8')
const nexusAuth = readFileSync('src/components/auth/XethkiozNexusAuth.tsx', 'utf8')
const bridge = readFileSync('src/engines/world/sandbox/RuntimeBridge.ts', 'utf8')
const events = readFileSync('src/engines/world/sandbox/portalEventContracts.ts', 'utf8')
const sql = readFileSync('supabase/migrations/20260628_alpha36_auth_nexus_profiles_rls.sql', 'utf8')

const checks = [
  ['subscription tiers', contracts.includes("'BASIC'") && contracts.includes("'CREATOR'") && contracts.includes("'ARCHITECT'")],
  ['user roles', contracts.includes("'GUEST'") && contracts.includes("'CONTRIBUTOR'") && contracts.includes("'ADMIN'")],
  ['permissions resolver', contracts.includes('resolvePermissions') && contracts.includes('canDispatchCriticalShaderEvents')],
  ['authorized event', events.includes('USER_SESSION_AUTHORIZED') && service.includes('USER_SESSION_AUTHORIZED')],
  ['auth state listener', service.includes('onAuthStateChange') && service.includes('handleAuthStateChange')],
  ['strong password length', passwordPolicy.includes('PASSWORD_MIN_LENGTH = 12')],
  ['strong password character classes', passwordPolicy.includes('LOWERCASE_PATTERN') && passwordPolicy.includes('UPPERCASE_PATTERN') && passwordPolicy.includes('DIGIT_PATTERN') && passwordPolicy.includes('SYMBOL_PATTERN')],
  ['service signup guard', service.includes('async signUp') && service.includes('assertStrongPassword(credentials.password)')],
  ['account signup and recovery guard', accountAccess.includes('passwordPolicyError(password)') && accountAccess.includes("isSignup || isUpdate")],
  ['legacy signin compatibility', accountAccess.includes('loginPasswordOk = password.length > 0') && nexusAuth.includes("mode === 'login' ? password.length > 0")],
  ['accessible password feedback', accountAccess.includes('aria-describedby') && accountAccess.includes('passwordAssessment.rules') && nexusAuth.includes('nexus-password-policy')],
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
