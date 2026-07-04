import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'
import { useHud } from '../lib/HudContext'

type AuthMode = 'signin' | 'signup' | 'reset' | 'update-password'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'No se pudo completar la operación. Revisá los datos e intentá otra vez.'
}

function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/profile'
  return value
}

function getAuthRedirectUrl(path = '/account') {
  if (typeof window === 'undefined') return undefined
  return `${window.location.origin}${path}`
}

function getInitialMode(value: string | null): AuthMode {
  if (value === 'signin' || value === 'reset' || value === 'update-password') return value
  return 'signup'
}

function getFriendlyAuthError(message: string) {
  const normalized = message.toLowerCase()
  if (normalized.includes('invalid login credentials')) return 'Credenciales inválidas. Si creaste la cuenta y no confirmaste el correo, revisá spam/promociones o pedí recuperación de contraseña.'
  if (normalized.includes('email not confirmed')) return 'El correo todavía no está confirmado. Revisá tu email o reenviá el acceso desde recuperar contraseña.'
  if (normalized.includes('rate limit')) return 'Demasiados intentos seguidos. Esperá unos minutos y probá otra vez.'
  return message
}

export default function AccountAccess() {
  const { account, toggleAccount } = useHud()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const redirectTo = useMemo(() => getSafeRedirect(searchParams.get('redirect')), [searchParams])
  const [mode, setMode] = useState<AuthMode>(() => getInitialMode(searchParams.get('mode')))
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isSignup = mode === 'signup'
  const isSignin = mode === 'signin'
  const isReset = mode === 'reset'
  const isUpdatePassword = mode === 'update-password'
  const passwordReady = password.length >= 8
  const emailReady = /\S+@\S+\.\S+/.test(email)
  const passwordsMatch = !isSignup && !isUpdatePassword ? true : password === confirmPassword
  const canSubmit = isSupabaseConfigured && !loading && (isReset ? emailReady : emailReady && passwordReady && passwordsMatch)

  useEffect(() => {
    const nextMode = getInitialMode(searchParams.get('mode'))
    if (nextMode !== mode) setMode(nextMode)
  }, [mode, searchParams])

  useEffect(() => {
    if (account.email && !email) setEmail(account.email)
  }, [account.email, email])

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update-password')
        setSearchParams({ mode: 'update-password' }, { replace: true })
        setMessage('Link de recuperación detectado. Escribí tu nueva contraseña.')
      }
    })
    return () => data.subscription.unsubscribe()
  }, [setSearchParams])

  const statusLabel = useMemo(() => {
    if (!isSupabaseConfigured) return 'Supabase no está configurado en producción.'
    if (account.status === 'loading') return 'Buscando sesión activa...'
    if (account.status === 'connected') return `Sesión activa: ${account.name}`
    if (isReset) return 'Recuperación de contraseña: ingresá tu email y revisá el correo.'
    if (isUpdatePassword) return 'Actualización de contraseña: escribí una nueva clave.'
    return 'Listo para crear cuenta o iniciar sesión.'
  }, [account.name, account.status, isReset, isUpdatePassword])

  function changeMode(nextMode: AuthMode) {
    setError(null)
    setMessage(null)
    setPassword('')
    setConfirmPassword('')
    setMode(nextMode)
    setSearchParams(nextMode === 'signup' ? {} : { mode: nextMode }, { replace: true })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (!isSupabaseConfigured) {
      setError('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en Vercel.')
      return
    }

    if (!emailReady && !isUpdatePassword) {
      setError('Ingresá un email válido.')
      return
    }

    if (!isReset && !passwordReady) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if ((isSignup || isUpdatePassword) && !passwordsMatch) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      if (isSignup) {
        const cleanName = displayName.trim() || email.split('@')[0] || 'XETHKIOZ User'
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: getAuthRedirectUrl('/account?mode=signin'),
            data: {
              display_name: cleanName,
              username: cleanName,
              role: 'user',
              source: 'xethkioz-web',
            },
          },
        })

        if (signUpError) throw signUpError

        if (data.session) {
          setMessage('Cuenta creada. Sesión iniciada correctamente.')
          window.setTimeout(() => navigate(redirectTo, { replace: true }), 650)
        } else {
          setMessage('Cuenta creada. Te enviamos un correo de confirmación. Revisá spam/promociones. Si no llega, usá Recuperar contraseña para reenviar un acceso seguro.')
          changeMode('signin')
        }
      } else if (isReset) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: getAuthRedirectUrl('/account?mode=update-password'),
        })

        if (resetError) throw resetError
        setMessage('Si el email existe, Supabase enviará un correo para recuperar contraseña. Revisá spam/promociones.')
      } else if (isUpdatePassword) {
        const { error: updateError } = await supabase.auth.updateUser({ password })
        if (updateError) throw updateError
        setMessage('Contraseña actualizada. Ya podés ingresar con la nueva clave.')
        window.setTimeout(() => changeMode('signin'), 800)
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (signInError) throw signInError
        setMessage('Sesión iniciada correctamente.')
        window.setTimeout(() => navigate(redirectTo, { replace: true }), 650)
      }
    } catch (caughtError) {
      setError(getFriendlyAuthError(getErrorMessage(caughtError)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Cuenta XETHKIOZ" description="Crear cuenta, ingresar o recuperar acceso al ecosistema XETHKIOZ." url="/login" />
      <main className="min-h-screen bg-fusionBg px-4 py-28 text-gray-200 sm:px-6">
        <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_420px]">
          <div className="panel-cyber flex flex-col justify-center border-l-2 border-l-orange p-8">
            <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-orange">XETHKIOZ_ACCOUNT_CORE</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-wider text-white md:text-5xl">Cuenta XETHKIOZ</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
              Acceso base para perfiles, XP, comunidad, CMS futuro y funciones con IA. La autenticación usa Supabase Auth y no expone claves privadas en el navegador.
            </p>
            <div className="mt-6 grid gap-3 text-xs text-gray-400 sm:grid-cols-3">
              <span className="rounded-xl border border-white/10 bg-black/30 p-3">Perfil + nombre visible</span>
              <span className="rounded-xl border border-white/10 bg-black/30 p-3">Base para XP y roles</span>
              <span className="rounded-xl border border-white/10 bg-black/30 p-3">Sesión persistente segura</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="panel-cyber flex flex-col gap-4 p-6">
            <div className="grid grid-cols-2 gap-1 rounded-3xl border border-white/10 bg-black/30 p-1">
              <button type="button" onClick={() => changeMode('signup')} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${isSignup ? 'bg-orange text-black' : 'text-gray-400 hover:text-white'}`}>Crear</button>
              <button type="button" onClick={() => changeMode('signin')} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${isSignin ? 'bg-neon text-black' : 'text-gray-400 hover:text-white'}`}>Ingresar</button>
            </div>

            <p className="rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-gray-400">{statusLabel}</p>

            {account.status === 'connected' && !isUpdatePassword && (
              <div className="rounded-2xl border border-green-400/30 bg-green-400/10 p-4 text-sm text-green-100">
                <p className="font-bold">Ya estás dentro del ecosistema.</p>
                <p className="mt-1 text-green-100/75">{account.email ?? account.name}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/profile" className="rounded-full bg-green-300 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black">Ir al perfil</Link>
                  <button type="button" onClick={toggleAccount} className="rounded-full border border-green-300/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-green-100">Cerrar sesión</button>
                </div>
              </div>
            )}

            {isSignup && (
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                Nombre visible
                <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange" placeholder="XETHKIOZ User" autoComplete="nickname" />
              </label>
            )}

            {!isUpdatePassword && (
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                Email
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange" placeholder="tu@email.com" autoComplete="email" required />
              </label>
            )}

            {!isReset && (
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                {isUpdatePassword ? 'Nueva contraseña' : 'Contraseña'}
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange" placeholder="Mínimo 8 caracteres" autoComplete={isSignup || isUpdatePassword ? 'new-password' : 'current-password'} required />
              </label>
            )}

            {(isSignup || isUpdatePassword) && (
              <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                Repetir contraseña
                <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange" placeholder="Confirmar contraseña" autoComplete="new-password" required />
              </label>
            )}

            {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
            {message && <p className="rounded-xl border border-green-400/30 bg-green-400/10 p-3 text-sm text-green-200">{message}</p>}

            <button type="submit" disabled={!canSubmit} className="rounded-full bg-orange px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:shadow-glow-action disabled:cursor-not-allowed disabled:opacity-40">
              {loading ? 'Procesando...' : isSignup ? 'Crear cuenta' : isReset ? 'Enviar recuperación' : isUpdatePassword ? 'Actualizar contraseña' : 'Ingresar'}
            </button>

            {!isReset && !isUpdatePassword ? (
              <button type="button" onClick={() => changeMode('reset')} className="text-center font-mono text-xs uppercase tracking-[0.18em] text-orange transition hover:text-white">Recuperar contraseña</button>
            ) : null}

            {(isReset || isUpdatePassword) ? (
              <button type="button" onClick={() => changeMode('signin')} className="text-center font-mono text-xs uppercase tracking-[0.18em] text-gray-400 transition hover:text-orange">Volver a ingresar</button>
            ) : null}

            <Link to="/" className="text-center font-mono text-xs uppercase tracking-[0.18em] text-gray-500 transition hover:text-orange">Volver al núcleo</Link>
          </form>
        </section>
      </main>
    </>
  )
}
