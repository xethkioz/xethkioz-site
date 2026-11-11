import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { PlatformFrame } from '../creator/CreatorPlatform'
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
          ? name.trim().length >= 3 && name.trim().length <= 70 && emailOk && passwordAssessment.valid && match
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
    // Keep the internal creator destination when switching sign-up/sign-in modes.
    setParams((current) => {
      const nextParams = new URLSearchParams()
      const destination = current.get('redirect')
      if (destination) nextParams.set('redirect', safeRedirect(destination))
      if (next !== 'signup') nextParams.set('mode', next)
      return nextParams
    }, { replace: true })
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
    if (isSignup && (name.trim().length < 3 || name.trim().length > 70)) {
      setError('Elegí un nombre público entre 3 y 70 caracteres. No uses tu email como nombre visible.')
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
        const displayName = name.trim()
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectUrl('/account?mode=signin&redirect=' + encodeURIComponent(target)),
            data: { display_name: displayName, username: displayName, role: 'user', source: 'xethkioz-web' },
          },
        })
        if (signUpError) throw signUpError
        if (data.session) {
          await refreshAccount()
          navigate(target, { replace: true })
        } else {
          changeMode('signin')
          setMessage('Cuenta creada. Revisá el correo de confirmación. Si no llega, usá reenviar confirmación.')
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
        changeMode('signin')
        setMessage('Contraseña actualizada. Ya podés ingresar.')
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
      <SEO title="Cuenta XETHKIOZ" description="Creá tu cuenta de creador, ingresá o recuperá tu acceso." url="/account" noIndex />
      <PlatformFrame>
      <main className="min-h-[70vh] bg-[#f7f7fc] px-4 py-16 text-slate-800 sm:px-6">
        <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_420px]">
          <article className="rounded-[28px] border border-violet-200 bg-white p-8 shadow-[0_16px_52px_rgba(90,70,160,0.08)]">
            <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-violet-700">TU ESPACIO CREATIVO · XETHKIOZ</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-wider text-slate-900 md:text-5xl">Tu cuenta de creador.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-500">Registrate, organizá tus creaciones y compartí tus proyectos. Los archivos siempre permanecen en tu propia nube.</p>
            <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-xs text-slate-600">
              Estado actual: <strong>{account.status}</strong>{account.email ? ` · ${account.email}` : ''}
            </div>
          </article>

          <form onSubmit={submit} className="flex flex-col gap-4 rounded-[28px] border border-violet-200 bg-white p-6 shadow-[0_16px_52px_rgba(90,70,160,0.08)]">
            <div className="grid grid-cols-2 gap-1 rounded-3xl border border-violet-200 bg-violet-50 p-1">
              <button type="button" onClick={() => changeMode('signup')} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${isSignup ? 'bg-violet-700 text-white' : 'text-slate-500 hover:text-violet-950'}`}>Crear</button>
              <button type="button" onClick={() => changeMode('signin')} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${isSignin ? 'bg-violet-700 text-white' : 'text-slate-500 hover:text-violet-950'}`}>Ingresar</button>
            </div>

            {isSignup ? <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500" placeholder="Nombre visible (mínimo 3 caracteres)" autoComplete="nickname" minLength={3} maxLength={70} required /> : null}
            {!isUpdate ? <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500" placeholder="tu@email.com" autoComplete="email" required /> : null}
            {!isReset ? <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500" placeholder={isUpdate ? 'Nueva contraseña' : 'Contraseña'} autoComplete={isSignin ? 'current-password' : 'new-password'} minLength={showStrongPasswordPolicy ? PASSWORD_MIN_LENGTH : 1} aria-describedby={showStrongPasswordPolicy ? 'password-policy' : undefined} aria-invalid={showStrongPasswordPolicy && password.length > 0 && !passwordAssessment.valid} required /> : null}
            {(isSignup || isUpdate) ? <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500" placeholder="Repetir contraseña" autoComplete="new-password" minLength={PASSWORD_MIN_LENGTH} required /> : null}

            {showStrongPasswordPolicy ? (
              <div id="password-policy" className="rounded-xl border border-violet-200 bg-violet-50 p-3" aria-live="polite">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Seguridad de contraseña</p>
                <ul className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  {passwordAssessment.rules.map((rule) => (
                    <li key={rule.key} className={rule.passed ? 'text-emerald-700' : 'text-slate-500'}>
                      <span aria-hidden="true">{rule.passed ? '✓' : '○'}</span> {rule.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700">{error}</p> : null}
            {message ? <p className="rounded-xl border border-green-400/30 bg-green-400/10 p-3 text-sm text-emerald-700">{message}</p> : null}

            <button type="submit" disabled={!canSubmit} className="rounded-full bg-violet-700 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-40">
              {loading ? 'Procesando...' : isReset ? 'Enviar recuperación' : isUpdate ? 'Actualizar contraseña' : isSignup ? 'Crear cuenta' : 'Ingresar'}
            </button>

            {!isReset && !isUpdate ? <button type="button" onClick={() => changeMode('reset')} className="font-mono text-xs uppercase tracking-[0.18em] text-violet-700 hover:text-violet-950">Recuperar contraseña</button> : null}
            {!isUpdate ? <Link to="/confirm-email" className="text-center font-mono text-xs uppercase tracking-[0.18em] text-violet-700 hover:text-violet-950">Reenviar confirmación</Link> : null}
            {(isReset || isUpdate) ? <button type="button" onClick={() => changeMode('signin')} className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 hover:text-violet-700">Volver a ingresar</button> : null}
            {account.status === 'connected' ? <button type="button" onClick={toggleAccount} className="font-mono text-xs uppercase tracking-[0.18em] text-red-700 hover:text-violet-950">Cerrar sesión</button> : null}
            <Link to="/mis-proyectos" className="text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-500 hover:text-violet-700">Mis proyectos</Link>
          </form>
        </section>
      </main>
      </PlatformFrame>
    </>
  )
}
