/**
 * XETHKIOZ Alpha 3.6 Auth Nexus contracts.
 *
 * Framework-free identity model shared by Supabase, EventBus and UI.
 * Keep this file deterministic: no React imports, no DOM access, no shader state.
 */

export type XethkiozSubscriptionTier = 'BASIC' | 'CREATOR' | 'ARCHITECT'
export type XethkiozUserRole = 'GUEST' | 'CONTRIBUTOR' | 'ADMIN'

export interface ProfileRow {
  id: string
  subscription_tier: XethkiozSubscriptionTier
  role: XethkiozUserRole
  created_at: string
  updated_at: string
}

export interface ProfileInsert {
  id: string
  subscription_tier?: XethkiozSubscriptionTier
  role?: XethkiozUserRole
  created_at?: string
  updated_at?: string
}

export interface ProfileUpdate {
  subscription_tier?: XethkiozSubscriptionTier
  role?: XethkiozUserRole
  updated_at?: string
}

export interface AuthPermissionSet {
  readonly canReadPublicArticles: boolean
  readonly canInsertArticles: boolean
  readonly canModifyCategories: boolean
  readonly canDispatchCriticalShaderEvents: boolean
}

export type AuthEventSource = 'supabase-auth-nexus'

export interface XethkiozAuthorizedSession {
  readonly userId: string
  readonly email: string | null
  readonly subscriptionTier: XethkiozSubscriptionTier
  readonly tier: XethkiozSubscriptionTier
  readonly role: XethkiozUserRole
  readonly permissions: AuthPermissionSet
  readonly authorizedAt: number
  readonly source: AuthEventSource
}

export interface AuthNexusDatabaseExtension {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
    }
  }
}

export const DEFAULT_GUEST_PROFILE = Object.freeze({
  subscription_tier: 'BASIC',
  role: 'GUEST',
} satisfies Pick<ProfileRow, 'subscription_tier' | 'role'>)

export const SUBSCRIPTION_TIERS = Object.freeze(['BASIC', 'CREATOR', 'ARCHITECT'] as const)
export const USER_ROLES = Object.freeze(['GUEST', 'CONTRIBUTOR', 'ADMIN'] as const)

export function isSubscriptionTier(value: string): value is XethkiozSubscriptionTier {
  return SUBSCRIPTION_TIERS.includes(value as XethkiozSubscriptionTier)
}

export function isUserRole(value: string): value is XethkiozUserRole {
  return USER_ROLES.includes(value as XethkiozUserRole)
}

export function resolvePermissions(
  subscriptionTier: XethkiozSubscriptionTier,
  role: XethkiozUserRole,
): AuthPermissionSet {
  const isAdmin = role === 'ADMIN'
  const isCreator = subscriptionTier === 'CREATOR' || subscriptionTier === 'ARCHITECT'

  return Object.freeze({
    canReadPublicArticles: true,
    canInsertArticles: isCreator || isAdmin,
    canModifyCategories: isAdmin,
    canDispatchCriticalShaderEvents: isAdmin || subscriptionTier === 'ARCHITECT',
  } satisfies AuthPermissionSet)
}

export function createAuthorizedSession(input: {
  readonly userId: string
  readonly email?: string | null
  readonly subscriptionTier?: string | null
  readonly role?: string | null
  readonly now?: () => number
}): XethkiozAuthorizedSession {
  const rawSubscriptionTier = input.subscriptionTier ?? ''
  const rawRole = input.role ?? ''
  const subscriptionTier: XethkiozSubscriptionTier = isSubscriptionTier(rawSubscriptionTier)
    ? rawSubscriptionTier
    : DEFAULT_GUEST_PROFILE.subscription_tier
  const role: XethkiozUserRole = isUserRole(rawRole) ? rawRole : DEFAULT_GUEST_PROFILE.role

  return Object.freeze({
    userId: input.userId,
    email: input.email ?? null,
    subscriptionTier,
    tier: subscriptionTier,
    role,
    permissions: resolvePermissions(subscriptionTier, role),
    authorizedAt: input.now?.() ?? performance.now(),
    source: 'supabase-auth-nexus',
  } satisfies XethkiozAuthorizedSession)
}


export function isAuthorizedSessionPayload(value: unknown): value is XethkiozAuthorizedSession {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<XethkiozAuthorizedSession>
  return (
    typeof candidate.userId === 'string' &&
    candidate.userId.length >= 16 &&
    isSubscriptionTier(String(candidate.subscriptionTier ?? candidate.tier ?? '')) &&
    isUserRole(String(candidate.role ?? '')) &&
    candidate.source === 'supabase-auth-nexus' &&
    typeof candidate.authorizedAt === 'number' &&
    typeof candidate.permissions === 'object' &&
    candidate.permissions !== null
  )
}

export function mapAuthErrorForUser(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()
  if (normalized.includes('invalid login') || normalized.includes('invalid credentials')) {
    return 'Credenciales inválidas. Revisá el email y la contraseña.'
  }
  if (normalized.includes('email not confirmed')) {
    return 'La cuenta todavía no fue confirmada. Revisá tu email.'
  }
  if (normalized.includes('network') || normalized.includes('fetch') || normalized.includes('timeout')) {
    return 'No se pudo conectar con el Nexus. Probá de nuevo en unos segundos.'
  }
  if (normalized.includes('profile')) {
    return 'La sesión inició, pero no se pudo cargar el perfil. Reintentá en unos segundos.'
  }
  return 'No se pudo completar la operación de autenticación.'
}
