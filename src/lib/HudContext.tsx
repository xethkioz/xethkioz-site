import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

export type HudAudioMode = 'muted' | 'enabled'
export type HudAccountStatus = 'guest' | 'connected' | 'loading'
export type HudAccountSource = 'supabase' | 'stored'

export interface HudAccountState {
  status: HudAccountStatus
  name: string
  userId?: string
  email?: string
  source?: HudAccountSource
  checked?: boolean
  issue?: 'network'
}

interface HudContextType {
  soundOn: boolean
  audioMode: HudAudioMode
  volume: number
  account: HudAccountState
  toggleSound: () => void
  setVolume: (value: number) => void
  toggleAccount: () => void
  setAccountName: (value: string) => void
  refreshAccount: () => Promise<void>
}

const HudContext = createContext<HudContextType | undefined>(undefined)

const STORAGE_SOUND = 'xethkioz.hud.sound'
const STORAGE_VOLUME = 'xethkioz.hud.volume'
const STORAGE_ACCOUNT_STATUS = 'xethkioz.hud.account.status'
const STORAGE_ACCOUNT_NAME = 'xethkioz.hud.account.name'
const STORAGE_ACCOUNT_EMAIL = 'xethkioz.hud.account.email'
const STORAGE_ACCOUNT_USER_ID = 'xethkioz.hud.account.user-id'

const guestAccount: HudAccountState = { status: 'guest', name: 'XETHKIOZ', checked: true }

const safeStorage = {
  get(key: string) {
    if (typeof window === 'undefined') return null
    try { return window.localStorage.getItem(key) } catch { return null }
  },
  set(key: string, value: string) {
    if (typeof window === 'undefined') return
    try { window.localStorage.setItem(key, value) } catch { /* Supabase remains the session source. */ }
  },
  remove(key: string) {
    if (typeof window === 'undefined') return
    try { window.localStorage.removeItem(key) } catch { /* Optional HUD cache. */ }
  },
}

const readStoredSound = (): boolean => {
  return safeStorage.get(STORAGE_SOUND) === 'enabled'
}

const readStoredVolume = (): number => {
  const stored = Number(safeStorage.get(STORAGE_VOLUME))
  if (!Number.isFinite(stored)) return 0.45
  return Math.min(1, Math.max(0, stored))
}

const readStoredAccount = (): HudAccountState => {
  if (typeof window === 'undefined') return guestAccount
  const status = safeStorage.get(STORAGE_ACCOUNT_STATUS) === 'connected' ? 'connected' : 'guest'
  const name = safeStorage.get(STORAGE_ACCOUNT_NAME)?.trim() || 'XETHKIOZ'
  const email = safeStorage.get(STORAGE_ACCOUNT_EMAIL)?.trim() || undefined
  const userId = safeStorage.get(STORAGE_ACCOUNT_USER_ID)?.trim() || undefined
  return status === 'connected'
    ? { status: 'connected', name, email, userId, source: 'stored', checked: false }
    : { ...guestAccount, checked: false }
}

function accountFromSupabaseUser(user: { id?: string; email?: string; user_metadata?: Record<string, unknown> } | null): HudAccountState {
  if (!user) return guestAccount
  const rawName = user.user_metadata?.display_name || user.user_metadata?.username
  const name = typeof rawName === 'string' && rawName.trim() ? rawName.trim() : user.email?.split('@')[0] || 'XETHKIOZ'
  return { status: 'connected', name, userId: user.id, email: user.email, source: 'supabase', checked: true }
}

function writeStoredAccount(account: HudAccountState) {
  safeStorage.set(STORAGE_ACCOUNT_STATUS, account.status === 'connected' ? 'connected' : 'guest')
  safeStorage.set(STORAGE_ACCOUNT_NAME, account.name)
  if (account.email) safeStorage.set(STORAGE_ACCOUNT_EMAIL, account.email)
  if (!account.email || account.status !== 'connected') safeStorage.remove(STORAGE_ACCOUNT_EMAIL)
  if (account.userId) safeStorage.set(STORAGE_ACCOUNT_USER_ID, account.userId)
  if (!account.userId || account.status !== 'connected') safeStorage.remove(STORAGE_ACCOUNT_USER_ID)
}

export function HudProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState<boolean>(readStoredSound)
  const [volume, setVolumeState] = useState<number>(readStoredVolume)
  const [account, setAccount] = useState<HudAccountState>(readStoredAccount)

  const refreshAccount = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setAccount({ ...guestAccount, checked: true })
      return
    }

    setAccount((current) => ({ ...current, status: current.status === 'connected' ? 'connected' : 'loading', checked: false, issue: undefined }))
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      setAccount((current) => current.status === 'connected'
        ? { ...current, checked: true, issue: 'network' }
        : { ...guestAccount, checked: true, issue: 'network' })
      return
    }
    if (!data.session?.user) {
      setAccount({ ...guestAccount, checked: true })
      return
    }
    setAccount(accountFromSupabaseUser(data.session.user))
  }, [])

  useEffect(() => {
    safeStorage.set(STORAGE_SOUND, soundOn ? 'enabled' : 'muted')
    document.documentElement.dataset.xethSound = soundOn ? 'enabled' : 'muted'
  }, [soundOn])

  useEffect(() => {
    safeStorage.set(STORAGE_VOLUME, String(volume))
    document.documentElement.style.setProperty('--xeth-audio-volume', String(volume))
  }, [volume])

  useEffect(() => {
    writeStoredAccount(account)
    document.documentElement.dataset.xethAccount = account.status
  }, [account])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAccount({ ...guestAccount, checked: true })
      return undefined
    }

    let active = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) {
        setAccount((current) => current.status === 'connected'
          ? { ...current, checked: true, issue: 'network' }
          : { ...guestAccount, checked: true, issue: 'network' })
        return
      }
      if (!data.session?.user) {
        setAccount({ ...guestAccount, checked: true })
        return
      }
      setAccount(accountFromSupabaseUser(data.session.user))
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setAccount(accountFromSupabaseUser(session.user))
        return
      }

      if (event === 'SIGNED_OUT') {
        setAccount({ ...guestAccount, checked: true })
        return
      }

      if (event === 'INITIAL_SESSION' && !session?.user) {
        setAccount({ ...guestAccount, checked: true })
      }
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void refreshAccount()
    }
    const refreshWhenOnline = () => void refreshAccount()
    window.addEventListener('online', refreshWhenOnline)
    window.addEventListener('pageshow', refreshWhenOnline)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    return () => {
      window.removeEventListener('online', refreshWhenOnline)
      window.removeEventListener('pageshow', refreshWhenOnline)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [refreshAccount])

  const value = useMemo<HudContextType>(() => ({
    soundOn,
    audioMode: soundOn ? 'enabled' : 'muted',
    volume,
    account,
    toggleSound: () => setSoundOn((current) => !current),
    setVolume: (next) => setVolumeState(Math.min(1, Math.max(0, next))),
    toggleAccount: () => {
      if (account.status === 'connected' && isSupabaseConfigured) {
        void supabase.auth.signOut().finally(() => setAccount({ ...guestAccount, checked: true }))
        return
      }
      if (account.status === 'connected') {
        setAccount({ ...guestAccount, checked: true })
        return
      }
      if (typeof window !== 'undefined') window.location.assign('/account?mode=signin')
    },
    setAccountName: (next) => setAccount((current) => ({ ...current, name: next.trim() || current.name })),
    refreshAccount,
  }), [soundOn, volume, account, refreshAccount])

  return <HudContext.Provider value={value}>{children}</HudContext.Provider>
}

export function useHud() {
  const ctx = useContext(HudContext)
  if (!ctx) throw new Error('useHud must be used within HudProvider')
  return ctx
}
