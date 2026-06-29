import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient'

type AdminSessionState = {
  user: User | null
  isAdmin: boolean
  loading: boolean
  ready: boolean
  logout: () => Promise<void>
}

function hasMetadataAdminRole(user: User | null) {
  if (!user) return false

  const appRole = String(user.app_metadata?.role ?? '').toLowerCase()
  const userRole = String(user.user_metadata?.role ?? '').toLowerCase()

  return appRole === 'admin' || userRole === 'admin'
}

async function resolveProfileAdminRole(user: User | null) {
  if (!user || !isSupabaseConfigured) return false
  if (hasMetadataAdminRole(user)) return true

  const { data, error } = await supabase
    .from('profiles')
    .select('role, subscription_tier')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.warn('[XETHKIOZ CMS] No se pudo validar profiles.role para admin:', error.message)
    return false
  }

  const role = String(data?.role ?? '').toLowerCase()
  const tier = String(data?.subscription_tier ?? '').toUpperCase()

  return role === 'admin' || tier === 'ARCHITECT'
}

export function useAdminSession(): AdminSessionState {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function applyUser(nextUser: User | null) {
      if (!active) return
      setLoading(true)
      const admin = await resolveProfileAdminRole(nextUser)
      if (!active) return
      setUser(nextUser)
      setIsAdmin(admin)
      setLoading(false)
    }

    async function loadSession() {
      if (!isSupabaseConfigured) {
        if (active) {
          setUser(null)
          setIsAdmin(false)
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
    setIsAdmin(false)
  }, [])

  return {
    user,
    isAdmin,
    loading,
    ready: isSupabaseConfigured,
    logout,
  }
}
