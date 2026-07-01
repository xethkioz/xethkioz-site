/**
 * XETHKIOZ Auth Nexus contracts.
 * Shared identity and permission model for Supabase, EventBus, CMS and UI.
 */

export type XethkiozSubscriptionTier = 'BASIC' | 'CREATOR' | 'ARCHITECT'
export type XethkiozUserRole = 'GUEST' | 'USER' | 'CONTRIBUTOR' | 'EDITOR' | 'MODERATOR' | 'ADMIN'

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
  readonly canAccessProfilePanel: boolean
  readonly canAccessCms: boolean
  readonly canInsertArticles: boolean
  readonly canEditOwnDrafts: boolean
  readonly canEditAnyArticle: boolean
  readonly canSubmitForReview: boolean
  readonly canApproveArticles: boolean
  readonly canPublishArticles: boolean
  readonly canDeleteArticles: boolean
  readonly canManageAds: boolean
  readonly canModerateChat: boolean
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
export const USER_ROLES = Object.freeze(['GUEST', 'USER', 'CONTRIBUTOR', 'EDITOR', 'MODERATOR', 'ADMIN'] as const)

export function isSubscriptionTier(value: string): value is XethkiozSubscriptionTier {
  return SUBSCRIPTION_TIERS.includes(value as XethkiozSubscriptionTier)
}

export function isUserRole(value: string): value is XethkiozUserRole {
  return USER_ROLES.includes(value as XethkiozUserRole)
}

export function resolvePermissions(subscriptionTier: XethkiozSubscriptionTier, role: XethkiozUserRole): AuthPermissionSet {
  const isUser = role !== 'GUEST'
  const isContributor = role === 'CONTRIBUTOR' || role === 'EDITOR' || role === 'MODERATOR' || role === 'ADMIN'
  const isEditor = role === 'EDITOR' || role === 'MODERATOR' || role === 'ADMIN'
  const isModerator = role === 'MODERATOR' || role === 'ADMIN'
  const isAdmin = role === 'ADMIN'
  const isCreatorTier = subscriptionTier === 'CREATOR' || subscriptionTier === 'ARCHITECT'

  return Object.freeze({
    canReadPublicArticles: true,
    canAccessProfilePanel: isUser || isContributor || isEditor || isModerator || isAdmin,
    canAccessCms: isContributor || isCreatorTier || isAdmin,
    canInsertArticles: isContributor || isCreatorTier || isAdmin,
    canEditOwnDrafts: isContributor || isCreatorTier || isAdmin,
    canEditAnyArticle: isEditor || isAdmin,
    canSubmitForReview: isContributor || isCreatorTier || isAdmin,
    canApproveArticles: isAdmin,
    canPublishArticles: isAdmin,
    canDeleteArticles: isAdmin,
    canManageAds: isAdmin,
    canModerateChat: isModerator || isAdmin,
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
  if (normalized.includes('invalid login') || normalized.includes('invalid credentials')) return 'Credenciales inválidas. Revisá el email y la contraseña.'
  if (normalized.includes('email not confirmed')) return 'La cuenta todavía no fue confirmada. Revisá tu email.'
  if (normalized.includes('network') || normalized.includes('fetch') || normalized.includes('timeout')) return 'No se pudo conectar con el Nexus. Probá de nuevo en unos segundos.'
  if (normalized.includes('profile')) return 'La sesión inició, pero no se pudo cargar el perfil. Reintentá en unos segundos.'
  return 'No se pudo completar la operación de autenticación.'
}
