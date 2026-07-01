import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient'

type CmsRole = 'GUEST' | 'USER' | 'CONTRIBUTOR' | 'EDITOR' | 'MODERATOR' | 'ADMIN'

type AdminSessionState = {
  user: User | null
  role: CmsRole
  tier: string
  isAdmin: boolean
  canAccessCms: boolean
  canPublish: boolean
  canDelete: boolean
  canManageAds: boolean
  canModerate: boolean
  loading: boolean
  ready: boolean
  logout: () => Promise<void>
}

function normalizeRole(value: unknown): CmsRole {
  const role = String(value ?? '').toUpperCase()
  if (role === 'ADMIN' || role === 'MODERATOR' || role === 'EDITOR' || role === 'CONTRIBUTOR' || role === 'USER') return role
  return 'GUEST'
}

function hasMetadataAdminRole(user: User | null) {
  if (!user) return false
  const appRole = String(user.app_metadata?.role ?? '').toLowerCase()
  const userRole = String(user.user_metadata?.role ?? '').toLowerCase()
  return appRole === 'admin' || userRole === 'admin'
}

async function resolveProfileAccess(user: User | null) {
  if (!user || !isSupabaseConfigured) return { role: 'GUEST' as CmsRole, tier: 'BASIC' }
  if (hasMetadataAdminRole(user)) return { role: 'ADMIN' as CmsRole, tier: 'ARCHITECT' }

  const { data, error } = await supabase
    .from('profiles')
    .select('role, subscription_tier')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.warn('[XETHKIOZ CMS] No se pudo validar profiles.role:', error.message)
    return { role: 'GUEST' as CmsRole, tier: 'BASIC' }
  }

  return {
    role: normalizeRole(data?.role),
    tier: String(data?.subscription_tier ?? 'BASIC').toUpperCase(),
  }
}

export function useAdminSession(): AdminSessionState {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<CmsRole>('GUEST')
  const [tier, setTier] = useState('BASIC')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function applyUser(nextUser: User | null) {
      if (!active) return
      setLoading(true)
      const access = await resolveProfileAccess(nextUser)
      if (!active) return
      setUser(nextUser)
      setRole(access.role)
      setTier(access.tier)
      setLoading(false)
    }

    async function loadSession() {
      if (!isSupabaseConfigured) {
        if (active) {
          setUser(null)
          setRole('GUEST')
          setTier('BASIC')
          setLoading(false)
        }
        return
      }

      const { data } = await supabase.auth.getUser()
      await applyUser(data.user ?? null)
    }

    void loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      void applyUser(session?.user ?? null)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    setUser(null)
    setRole('GUEST')
    setTier('BASIC')
  }, [])

  const isAdmin = role === 'ADMIN' || tier === 'ARCHITECT'
  const isModerator = role === 'MODERATOR' || isAdmin
  const isEditorial = role === 'CONTRIBUTOR' || role === 'EDITOR' || role === 'MODERATOR' || isAdmin
  const isCreatorTier = tier === 'CREATOR' || tier === 'ARCHITECT'

  return {
    user,
    role,
    tier,
    isAdmin,
    canAccessCms: Boolean(user) && (isEditorial || isCreatorTier),
    canPublish: isAdmin,
    canDelete: isAdmin,
    canManageAds: isAdmin,
    canModerate: isModerator,
    loading,
    ready: isSupabaseConfigured,
    logout,
  }
}
