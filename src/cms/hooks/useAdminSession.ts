import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient'

type AdminSessionState = {
  user: User | null
  isAdmin: boolean
  loading: boolean
  ready: boolean
  logout: () => Promise<void>
}

function hasAdminRole(user: User | null) {
  if (!user) return false

  const appRole = user.app_metadata?.role
  const userRole = user.user_metadata?.role

  return appRole === 'admin' || userRole === 'admin'
}

export function useAdminSession(): AdminSessionState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadSession() {
      if (!isSupabaseConfigured) {
        if (active) {
          setUser(null)
          setLoading(false)
        }
        return
      }

      const { data } = await supabase.auth.getUser()

      if (active) {
        setUser(data.user ?? null)
        setLoading(false)
      }
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const isAdmin = useMemo(() => hasAdminRole(user), [user])

  return {
    user,
    isAdmin,
    loading,
    ready: isSupabaseConfigured,
    logout,
  }
}
