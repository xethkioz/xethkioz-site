import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

export type HudAudioMode = 'muted' | 'enabled'
export type HudAccountStatus = 'guest' | 'connected' | 'loading'
export type HudAccountSource = 'supabase' | 'stored'

export interface HudAccountState {
  status: HudAccountStatus
  name: string
  email?: string
  source?: HudAccountSource
  checked?: boolean
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

const guestAccount: HudAccountState = { status: 'guest', name: 'XETHKIOZ', checked: true }

const readStoredSound = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_SOUND) === 'enabled'
}

const readStoredVolume = (): number => {
  if (typeof window === 'undefined') return 0.45
  const stored = Number(window.localStorage.getItem(STORAGE_VOLUME))
  if (!Number.isFinite(stored)) return 0.45
  return Math.min(1, Math.max(0, stored))
}

const readStoredAccount = (): HudAccountState => {
  if (typeof window === 'undefined') return guestAccount
  const status = window.localStorage.getItem(STORAGE_ACCOUNT_STATUS) === 'connected' ? 'connected' : 'guest'
  const name = window.localStorage.getItem(STORAGE_ACCOUNT_NAME)?.trim() || 'XETHKIOZ'
  const email = window.localStorage.getItem(STORAGE_ACCOUNT_EMAIL)?.trim() || undefined
  return status === 'connected'
    ? { status: 'loading', name, email, source: 'stored', checked: false }
    : { ...guestAccount, checked: false }
}

function accountFromSupabaseUser(user: { email?: string; user_metadata?: Record<string, unknown> } | null): HudAccountState {
  if (!user) return guestAccount
  const rawName = user.user_metadata?.display_name || user.user_metadata?.username
  const name = typeof rawName === 'string' && rawName.trim() ? rawName.trim() : user.email?.split('@')[0] || 'XETHKIOZ'
  return { status: 'connected', name, email: user.email, source: 'supabase', checked: true }
}

function writeStoredAccount(account: HudAccountState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_ACCOUNT_STATUS, account.status === 'connected' ? 'connected' : 'guest')
  window.localStorage.setItem(STORAGE_ACCOUNT_NAME, account.name)
  if (account.email) window.localStorage.setItem(STORAGE_ACCOUNT_EMAIL, account.email)
  if (!account.email || account.status !== 'connected') window.localStorage.removeItem(STORAGE_ACCOUNT_EMAIL)
}

export function HudProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState<boolean>(readStoredSound)
  const [volume, setVolumeState] = useState<number>(readStoredVolume)
  const [account, setAccount] = useState<HudAccountState>(readStoredAccount)

  async function refreshAccount() {
    if (!isSupabaseConfigured) {
      setAccount({ ...guestAccount, checked: true })
      return
    }

    setAccount((current) => ({ ...current, status: current.status === 'connected' ? 'connected' : 'loading', checked: false }))
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session?.user) {
      setAccount({ ...guestAccount, checked: true })
      return
    }
    setAccount(accountFromSupabaseUser(data.session.user))
  }

  useEffect(() => {
    window.localStorage.setItem(STORAGE_SOUND, soundOn ? 'enabled' : 'muted')
    document.documentElement.dataset.xethSound = soundOn ? 'enabled' : 'muted'
  }, [soundOn])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_VOLUME, String(volume))
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
      if (error || !data.session?.user) {
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

      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
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
  }), [soundOn, volume, account])

  return <HudContext.Provider value={value}>{children}</HudContext.Provider>
}

export function useHud() {
  const ctx = useContext(HudContext)
  if (!ctx) throw new Error('useHud must be used within HudProvider')
  return ctx
}
