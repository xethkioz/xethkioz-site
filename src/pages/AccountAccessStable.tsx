import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { useHud } from '../lib/HudContext'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_POLICY_SUMMARY,
  assessPassword,
  passwordPolicyError,
} from '../services/auth/passwordPolicy'

type Mode = 'signin' | 'signup' | 'reset' | 'update-password'

function readMode(value: string | null): Mode {
  if (value === 'signin' || value === 'reset' || value === 'update-password') return value
  return 'signup'
}

function redirectUrl(path: string) {
  if (typeof window === 'undefined') return undefined
  return `${window.location.origin}${path}`
}

function safeRedirect(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/profile'
  return value
}

function friendlyError(error: unknown) {
  const raw = error instanceof Error ? error.message : 'No se pudo completar la operación.'
  const lower = raw.toLowerCase()
  if (lower.includes('invalid login credentials')) return 'Credenciales inválidas. Revisá email/contraseña o usá reenviar confirmación.'
  if (lower.includes('email not confirmed')) return 'Cuenta pendiente de confirmación. Usá reenviar confirmación.'
  if (lower.includes('rate limit')) return 'Demasiados intentos. Esperá unos minutos.'
  if (lower.includes('weak password') || lower.includes('password should be') || lower.includes('xethkioz_password_policy')) return PASSWORD_POLICY_SUMMARY
  return raw
}

export default function AccountAccessStable() {
  const { account, toggleAccount, refreshAccount } = useHud()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const target = useMemo(() => safeRedirect(params.get('redirect')), [params])
  const [mode, setMode] = useState<Mode>(() => readMode(params.get('mode')))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isSignup = mode === 'signup'
  const isSignin = mode === 'signin'
  const isReset = mode === 'reset'
  const isUpdate = mode === 'update-password'
  const emailOk = /\S+@\S+\.\S+/.test(email)
  const passwordAssessment = useMemo(() => assessPassword(password), [password])
  const loginPasswordOk = password.length > 0
  const match = password === confirmPassword
  const canSubmit = isSupabaseConfigured && !loading && (
    isReset
      ? emailOk
      : isUpdate
        ? passwordAssessment.valid && match
        : isSignup
          ? emailOk && passwordAssessment.valid && match
          : emailOk && loginPasswordOk
  )

  useEffect(() => {
    const next = readMode(params.get('mode'))
    if (next !== mode) setMode(next)
  }, [mode, params])

  useEffect(() => {
    if (account.email && !email) setEmail(account.email)
  }, [account.email, email])

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update-password')
        setParams({ mode: 'update-password' }, { replace: true })
        setMessage('Link detectado. Escribí una contraseña nueva.')
      }
    })
    return () => data.subscription.unsubscribe()
  }, [setParams])

  function changeMode(next: Mode) {
    setMode(next)
    setPassword('')
    setConfirmPassword('')
    setError(null)
    setMessage(null)
    setParams(next === 'signup' ? {} : { mode: next }, { replace: true })
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (!isSupabaseConfigured) {
      setError('Supabase no está configurado.')
      return
    }
    if (!isUpdate && !emailOk) {
      setError('Ingresá un email válido.')
      return
    }
    if (isSignin && !loginPasswordOk) {
      setError('Ingresá tu contraseña.')
      return
    }
    if (isSignup || isUpdate) {
      const policyError = passwordPolicyError(password)
      if (policyError) {
        setError(policyError)
        return
      }
    }
    if ((isSignup || isUpdate) && !match) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      if (isSignup) {
        const displayName = name.trim() || email.split('@')[0] || 'XETHKIOZ User'
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectUrl('/account?mode=signin'),
            data: { display_name: displayName, username: displayName, role: 'user', source: 'xethkioz-web' },
          },
        })
        if (signUpError) throw signUpError
        if (data.session) {
          await refreshAccount()
          navigate(target, { replace: true })
        } else {
          setMessage('Cuenta creada. Revisá el correo de confirmación. Si no llega, usá reenviar confirmación.')
          changeMode('signin')
        }
        return
      }

      if (isReset) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: redirectUrl('/account?mode=update-password'),
        })
        if (resetError) throw resetError
        setMessage('Si el email existe, se enviará un correo de recuperación.')
        return
      }

      if (isUpdate) {
        const { error: updateError } = await supabase.auth.updateUser({ password })
        if (updateError) throw updateError
        await refreshAccount()
        setMessage('Contraseña actualizada. Ya podés ingresar.')
        changeMode('signin')
        return
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (loginError) throw loginError
      await refreshAccount()
      navigate(target, { replace: true })
    } catch (caught) {
      setError(friendlyError(caught))
    } finally {
      setLoading(false)
    }
  }

  const showStrongPasswordPolicy = isSignup || isUpdate

  return (
    <>
      <SEO title="Cuenta XETHKIOZ" description="Acceso, registro y recuperación de cuenta XETHKIOZ." url="/account" />
      <main className="min-h-screen bg-fusionBg px-4 py-28 text-gray-200 sm:px-6">
        <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_420px]">
          <article className="panel-cyber border-l-2 border-l-orange p-8">
            <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-orange">XETHKIOZ_ACCOUNT_CORE</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-wider text-white md:text-5xl">Cuenta XETHKIOZ</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">Sistema estable de cuenta, perfil, roles y comunidad.</p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-gray-300">
              Estado actual: <strong>{account.status}</strong>{account.email ? ` · ${account.email}` : ''}
            </div>
          </article>

          <form onSubmit={submit} className="panel-cyber flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-1 rounded-3xl border border-white/10 bg-black/30 p-1">
              <button type="button" onClick={() => changeMode('signup')} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${isSignup ? 'bg-orange text-black' : 'text-gray-400 hover:text-white'}`}>Crear</button>
              <button type="button" onClick={() => changeMode('signin')} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${isSignin ? 'bg-neon text-black' : 'text-gray-400 hover:text-white'}`}>Ingresar</button>
            </div>

            {isSignup ? <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-orange" placeholder="Nombre visible" autoComplete="nickname" /> : null}
            {!isUpdate ? <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-orange" placeholder="tu@email.com" autoComplete="email" required /> : null}
            {!isReset ? <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-orange" placeholder={isUpdate ? 'Nueva contraseña' : 'Contraseña'} autoComplete={isSignin ? 'current-password' : 'new-password'} minLength={showStrongPasswordPolicy ? PASSWORD_MIN_LENGTH : 1} aria-describedby={showStrongPasswordPolicy ? 'password-policy' : undefined} aria-invalid={showStrongPasswordPolicy && password.length > 0 && !passwordAssessment.valid} required /> : null}
            {(isSignup || isUpdate) ? <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-orange" placeholder="Repetir contraseña" autoComplete="new-password" minLength={PASSWORD_MIN_LENGTH} required /> : null}

            {showStrongPasswordPolicy ? (
              <div id="password-policy" className="rounded-xl border border-white/10 bg-black/30 p-3" aria-live="polite">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Seguridad de contraseña</p>
                <ul className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  {passwordAssessment.rules.map((rule) => (
                    <li key={rule.key} className={rule.passed ? 'text-green-300' : 'text-gray-500'}>
                      <span aria-hidden="true">{rule.passed ? '✓' : '○'}</span> {rule.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
            {message ? <p className="rounded-xl border border-green-400/30 bg-green-400/10 p-3 text-sm text-green-200">{message}</p> : null}

            <button type="submit" disabled={!canSubmit} className="rounded-full bg-orange px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:shadow-glow-action disabled:cursor-not-allowed disabled:opacity-40">
              {loading ? 'Procesando...' : isReset ? 'Enviar recuperación' : isUpdate ? 'Actualizar contraseña' : isSignup ? 'Crear cuenta' : 'Ingresar'}
            </button>

            {!isReset && !isUpdate ? <button type="button" onClick={() => changeMode('reset')} className="font-mono text-xs uppercase tracking-[0.18em] text-orange hover:text-white">Recuperar contraseña</button> : null}
            {!isUpdate ? <Link to="/confirm-email" className="text-center font-mono text-xs uppercase tracking-[0.18em] text-neon hover:text-white">Reenviar confirmación</Link> : null}
            {(isReset || isUpdate) ? <button type="button" onClick={() => changeMode('signin')} className="font-mono text-xs uppercase tracking-[0.18em] text-gray-400 hover:text-orange">Volver a ingresar</button> : null}
            {account.status === 'connected' ? <button type="button" onClick={toggleAccount} className="font-mono text-xs uppercase tracking-[0.18em] text-red-200 hover:text-white">Cerrar sesión</button> : null}
            <Link to="/profile" className="text-center font-mono text-xs uppercase tracking-[0.18em] text-gray-500 hover:text-orange">Ver perfil</Link>
          </form>
        </section>
      </main>
    </>
  )
}
