import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

export type HudAudioMode = 'muted' | 'enabled'
export type HudAccountStatus = 'guest' | 'connected' | 'loading'

export interface HudAccountState {
  status: HudAccountStatus
  name: string
  email?: string
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
}

const HudContext = createContext<HudContextType | undefined>(undefined)

const STORAGE_SOUND = 'xethkioz.hud.sound'
const STORAGE_VOLUME = 'xethkioz.hud.volume'
const STORAGE_ACCOUNT_STATUS = 'xethkioz.hud.account.status'
const STORAGE_ACCOUNT_NAME = 'xethkioz.hud.account.name'

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
  if (typeof window === 'undefined') return { status: 'guest', name: 'XETHKIOZ' }
  const status = window.localStorage.getItem(STORAGE_ACCOUNT_STATUS) === 'connected' ? 'connected' : 'guest'
  const name = window.localStorage.getItem(STORAGE_ACCOUNT_NAME)?.trim() || 'XETHKIOZ'
  return { status, name }
}

function accountFromSupabaseUser(user: { email?: string; user_metadata?: Record<string, unknown> } | null): HudAccountState {
  if (!user) return { status: 'guest', name: 'XETHKIOZ' }
  const rawName = user.user_metadata?.display_name || user.user_metadata?.username
  const name = typeof rawName === 'string' && rawName.trim() ? rawName.trim() : user.email?.split('@')[0] || 'XETHKIOZ'
  return { status: 'connected', name, email: user.email }
}

export function HudProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState<boolean>(readStoredSound)
  const [volume, setVolumeState] = useState<number>(readStoredVolume)
  const [account, setAccount] = useState<HudAccountState>(readStoredAccount)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_SOUND, soundOn ? 'enabled' : 'muted')
    document.documentElement.dataset.xethSound = soundOn ? 'enabled' : 'muted'
  }, [soundOn])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_VOLUME, String(volume))
    document.documentElement.style.setProperty('--xeth-audio-volume', String(volume))
  }, [volume])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_ACCOUNT_STATUS, account.status === 'connected' ? 'connected' : 'guest')
    window.localStorage.setItem(STORAGE_ACCOUNT_NAME, account.name)
    document.documentElement.dataset.xethAccount = account.status
  }, [account])

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    let active = true

    setAccount((current) => ({ ...current, status: current.status === 'connected' ? 'connected' : 'loading' }))

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setAccount(accountFromSupabaseUser(data.session?.user ?? null))
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccount(accountFromSupabaseUser(session?.user ?? null))
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
        void supabase.auth.signOut().then(() => setAccount({ status: 'guest', name: 'XETHKIOZ' }))
        return
      }
      if (typeof window !== 'undefined') window.location.assign('/login')
    },
    setAccountName: (next) => setAccount((current) => ({ ...current, name: next.trim() || current.name })),
  }), [soundOn, volume, account])

  return <HudContext.Provider value={value}>{children}</HudContext.Provider>
}

export function useHud() {
  const ctx = useContext(HudContext)
  if (!ctx) throw new Error('useHud must be used within HudProvider')
  return ctx
}
