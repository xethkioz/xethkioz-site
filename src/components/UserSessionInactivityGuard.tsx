import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'

export const PROFILE_INACTIVITY_MS = 5 * 60_000
export const PROFILE_LOGOUT_GRACE_SECONDS = 10
const CHANNEL_NAME = 'xethkioz-auth-session'
const E2E_SESSION_KEY = 'xethkioz.e2e.auth-session'
type SupabaseClientModule = typeof import('../services/supabaseClient')
let supabaseModulePromise: Promise<SupabaseClientModule> | null = null

type SessionMessage = { type: 'continued' | 'signed-out'; at: number }

function hasE2eSession() {
  return import.meta.env.VITE_E2E_AUTH_SESSION === '1'
    && typeof window !== 'undefined'
    && window.sessionStorage.getItem(E2E_SESSION_KEY) === 'connected'
}

function loadSupabaseModule() {
  supabaseModulePromise ??= import('../services/supabaseClient')
  return supabaseModulePromise
}

export default function UserSessionInactivityGuard() {
  const location = useLocation()
  const navigate = useNavigate()
  const { lang } = useLang()
  const { account, refreshAccount, signOutAccount } = useHud()
  const [warningOpen, setWarningOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(PROFILE_LOGOUT_GRACE_SECONDS)
  const inactivityTimer = useRef<number | undefined>()
  const countdownTimer = useRef<number | undefined>()
  const continueButton = useRef<HTMLButtonElement>(null)
  const isVerified = account.status === 'connected' && account.source === 'supabase' && account.checked === true
  const armed = location.pathname === '/profile' && (isVerified || hasE2eSession())

  const clearTimers = useCallback(() => {
    window.clearTimeout(inactivityTimer.current)
    window.clearInterval(countdownTimer.current)
    inactivityTimer.current = undefined
    countdownTimer.current = undefined
  }, [])

  const broadcast = useCallback((message: SessionMessage) => {
    if (typeof BroadcastChannel === 'undefined') return
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channel.postMessage(message)
    channel.close()
  }, [])

  const signOutForInactivity = useCallback(async () => {
    clearTimers()
    setWarningOpen(false)
    window.sessionStorage.removeItem(E2E_SESSION_KEY)
    await signOutAccount()
    broadcast({ type: 'signed-out', at: Date.now() })
    navigate('/account?mode=signin&reason=inactive', { replace: true })
  }, [broadcast, clearTimers, navigate, signOutAccount])

  const openWarning = useCallback(() => {
    clearTimers()
    setSecondsLeft(PROFILE_LOGOUT_GRACE_SECONDS)
    setWarningOpen(true)
  }, [clearTimers])

  const scheduleWarning = useCallback(() => {
    clearTimers()
    if (!armed || warningOpen) return
    inactivityTimer.current = window.setTimeout(openWarning, PROFILE_INACTIVITY_MS)
  }, [armed, clearTimers, openWarning, warningOpen])

  const continueSession = useCallback(async () => {
    if (!hasE2eSession()) {
      const { isSupabaseConfigured, supabase } = await loadSupabaseModule()
      if (!isSupabaseConfigured) {
        await signOutForInactivity()
        return
      }
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session?.user) {
        await signOutForInactivity()
        return
      }
      await refreshAccount()
    }

    setWarningOpen(false)
    setSecondsLeft(PROFILE_LOGOUT_GRACE_SECONDS)
    broadcast({ type: 'continued', at: Date.now() })
  }, [broadcast, refreshAccount, signOutForInactivity])

  useEffect(() => {
    if (!armed) {
      clearTimers()
      setWarningOpen(false)
      return undefined
    }

    scheduleWarning()
    const activityEvents: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart', 'scroll']
    const resetFromActivity = () => {
      if (!warningOpen) scheduleWarning()
    }
    activityEvents.forEach((eventName) => window.addEventListener(eventName, resetFromActivity, { passive: true }))
    return () => {
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetFromActivity))
      clearTimers()
    }
  }, [armed, clearTimers, scheduleWarning, warningOpen])

  useEffect(() => {
    if (!warningOpen) {
      scheduleWarning()
      return undefined
    }

    window.requestAnimationFrame(() => continueButton.current?.focus())
    countdownTimer.current = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          void signOutForInactivity()
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(countdownTimer.current)
  }, [scheduleWarning, signOutForInactivity, warningOpen])

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return undefined
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channel.onmessage = (event: MessageEvent<SessionMessage>) => {
      if (event.data?.type === 'continued') {
        setWarningOpen(false)
        setSecondsLeft(PROFILE_LOGOUT_GRACE_SECONDS)
        scheduleWarning()
      }
      if (event.data?.type === 'signed-out') {
        setWarningOpen(false)
        void refreshAccount()
        navigate('/account?mode=signin&reason=inactive', { replace: true })
      }
    }
    return () => channel.close()
  }, [navigate, refreshAccount, scheduleWarning])

  useEffect(() => {
    if (!warningOpen) return undefined
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        continueButton.current?.focus()
        return
      }
      if (event.key !== 'Tab') return
      const dialog = document.getElementById('xeth-session-warning')
      const focusable = dialog?.querySelectorAll<HTMLElement>('button:not([disabled])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', trapFocus)
    return () => window.removeEventListener('keydown', trapFocus)
  }, [warningOpen])

  if (!warningOpen) return null

  const copy = lang === 'es'
    ? {
        title: '¿Seguís conectado?',
        body: 'El panel estuvo inactivo durante 5 minutos. Confirmá que seguís acá para mantener la sesión.',
        countdown: `La sesión se cerrará automáticamente en ${secondsLeft} segundos.`,
        continue: 'Continuar conectado',
        signOut: 'Cerrar sesión ahora',
      }
    : {
        title: 'Are you still connected?',
        body: 'The user panel has been inactive for 5 minutes. Confirm that you are still here to keep the session active.',
        countdown: `The session will close automatically in ${secondsLeft} seconds.`,
        continue: 'Stay connected',
        signOut: 'Sign out now',
      }

  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center bg-black/85 px-4 backdrop-blur-sm">
      <section
        id="xeth-session-warning"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="xeth-session-warning-title"
        aria-describedby="xeth-session-warning-description xeth-session-warning-countdown"
        className="w-full max-w-md rounded-3xl border border-orange-400/40 bg-[#0A0A0F] p-6 text-white shadow-[0_0_50px_rgba(255,107,26,.24)]"
      >
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-orange-300">XETHKIOZ SESSION GUARD</p>
        <h2 id="xeth-session-warning-title" className="mt-3 text-2xl font-black uppercase tracking-wide">{copy.title}</h2>
        <p id="xeth-session-warning-description" className="mt-3 text-sm leading-relaxed text-gray-300">{copy.body}</p>
        <p id="xeth-session-warning-countdown" role="status" aria-live="assertive" className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 font-mono text-sm text-red-100">
          {copy.countdown}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button ref={continueButton} type="button" onClick={() => { void continueSession() }} className="rounded-full bg-orange px-5 py-3 text-sm font-black uppercase tracking-wider text-black">
            {copy.continue}
          </button>
          <button type="button" onClick={() => { void signOutForInactivity() }} className="rounded-full border border-white/15 px-5 py-3 text-sm font-black uppercase tracking-wider text-gray-200 hover:border-red-300 hover:text-white">
            {copy.signOut}
          </button>
        </div>
      </section>
    </div>
  )
}
