import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { PortalEventBusLike } from '../../engines/world/sandbox/portalEventContracts'
import { AuthNexusService, authNexusService } from '../../services/auth/authNexusService'
import { mapAuthErrorForUser, type XethkiozAuthorizedSession } from '../../services/auth/authSchema'

export interface XethkiozNexusAuthProps {
  readonly eventBus?: PortalEventBusLike
  readonly service?: AuthNexusService
  readonly onAuthorized?: (session: XethkiozAuthorizedSession) => void
}

type AuthMode = 'login' | 'register'

export function XethkiozNexusAuth({ eventBus, service, onAuthorized }: XethkiozNexusAuthProps) {
  const stableService = useMemo(() => service ?? (eventBus ? new AuthNexusService({ eventBus }) : authNexusService), [eventBus, service])
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<XethkiozAuthorizedSession | null>(() => stableService.getSnapshot())

  useEffect(() => {
    const stopAuthListener = stableService.startAuthStateListener()
    const unsubscribe = stableService.onChange((nextSession) => {
      setSession(nextSession)
      if (nextSession) onAuthorized?.(nextSession)
    })

    void stableService.hydrateCurrentSession().catch((nextError: unknown) => {
      setError(mapAuthErrorForUser(nextError))
    })

    return () => {
      unsubscribe()
      stopAuthListener()
    }
  }, [onAuthorized, stableService])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const credentials = { email, password }
      const nextSession = mode === 'login' ? await stableService.signIn(credentials) : await stableService.signUp(credentials)
      if (nextSession) onAuthorized?.(nextSession)
    } catch (nextError) {
      setError(mapAuthErrorForUser(nextError))
    } finally {
      setIsLoading(false)
    }
  }

  if (session) return null

  return (
    <section className="relative mx-auto w-full max-w-md overflow-hidden rounded-[1.75rem] border border-violet-500/25 bg-[#0B0A0F] p-6 text-white shadow-[0_0_60px_rgba(168,85,247,0.2)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.22),transparent_38%),linear-gradient(135deg,rgba(34,197,94,0.09),transparent_42%)]" />
      <div className="relative z-10">
        <div className="mb-6 border-b border-violet-500/20 pb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-green-300">XETHKIOZ NEXUS // 1990s AUTH TERMINAL</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.08em]">Identity Gateway</h2>
        </div>

<form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex rounded-xl border border-violet-500/20 bg-black/35 p-1 font-mono text-xs uppercase tracking-[0.16em]">
              <button type="button" className={`flex-1 rounded-lg px-3 py-2 ${mode === 'login' ? 'bg-violet-500/25 text-white' : 'text-slate-500'}`} disabled={isLoading} onClick={() => setMode('login')}>Login</button>
              <button type="button" className={`flex-1 rounded-lg px-3 py-2 ${mode === 'register' ? 'bg-orange-500/20 text-white' : 'text-slate-500'}`} disabled={isLoading} onClick={() => setMode('register')}>Registro</button>
            </div>

            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-violet-300">Email</span>
              <input className="mt-2 w-full rounded-xl border border-violet-500/20 bg-black/45 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-violet-300" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required autoComplete="email" />
            </label>

            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-orange-300">Password</span>
              <input className="mt-2 w-full rounded-xl border border-orange-500/20 bg-black/45 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-orange-300" value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={6} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            </label>

            {error ? <p className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-200">{error}</p> : null}

            <button type="submit" disabled={isLoading} className="w-full rounded-xl border border-green-300/30 bg-green-400/10 px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-green-200 transition hover:bg-green-400/20 disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? 'Handshake...' : mode === 'login' ? 'Authorize Session' : 'Create Nexus ID'}
            </button>
          </form>
      </div>
    </section>
  )
}

export default XethkiozNexusAuth
