import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_POLICY_SUMMARY,
  assessPassword,
  passwordPolicyError,
} from '../services/auth/passwordPolicy'

type Mode = 'signup' | 'signin'
type Status = 'idle' | 'loading' | 'success' | 'error'

const SIGNUP_COOLDOWN_MS = 10 * 60 * 1000

export default function CreatorAccount() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signin')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [alreadyLogged, setAlreadyLogged] = useState(false)
  const [form, setForm] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
    role: 'Creador de contenido',
  })
  const passwordAssessment = useMemo(() => assessPassword(form.password), [form.password])
  const emailOk = /\S+@\S+\.\S+/.test(form.email)
  const canSubmit = status !== 'loading'
    && !(mode === 'signup' && status === 'success')
    && emailOk
    && (mode === 'signup' ? passwordAssessment.valid : form.password.length > 0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setAlreadyLogged(true)
    })
  }, [])

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode)
    setStatus('idle')
    setMessage('')
    update('password', '')
  }

  const cooldownKey = () => `xethkioz_signup_${form.email.trim().toLowerCase()}`

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    const email = form.email.trim().toLowerCase()
    const password = form.password

    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus('error')
      setMessage('Ingresá un email válido.')
      return
    }

    if (mode === 'signup') {
      const policyError = passwordPolicyError(password)
      if (policyError) {
        setStatus('error')
        setMessage(policyError)
        return
      }
    } else if (!password) {
      setStatus('error')
      setMessage('Ingresá tu contraseña.')
      return
    }

    try {
      if (mode === 'signup') {
        const lastSignup = Number(localStorage.getItem(cooldownKey()) || '0')
        const elapsed = Date.now() - lastSignup

        if (lastSignup && elapsed < SIGNUP_COOLDOWN_MS) {
          const minutes = Math.ceil((SIGNUP_COOLDOWN_MS - elapsed) / 60000)
          setStatus('error')
          setMessage(`Ya enviamos una solicitud para este correo. Esperá ${minutes} min antes de volver a intentarlo para evitar correos repetidos.`)
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/creator/panel`,
            data: {
              display_name: form.displayName.trim(),
              username: form.username.trim(),
              role: form.role,
            },
          },
        })

        if (error) throw error
        localStorage.setItem(cooldownKey(), String(Date.now()))

        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            display_name: form.displayName.trim(),
            username: form.username.trim(),
            email,
            role: form.role,
            status: data.session ? 'active' : 'pending_email_confirmation',
          })
        }

        setStatus('success')

        if (data.session) {
          setMessage('Cuenta creada e iniciada correctamente. Entrando al panel...')
          setAlreadyLogged(true)
          setTimeout(() => navigate('/creator/panel'), 700)
        } else {
          setMessage('Cuenta creada. Revisá tu correo y confirmá el acceso antes de iniciar sesión. No vuelvas a tocar Crear cuenta: puede reenviar correos.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) throw error

        setStatus('success')
        setAlreadyLogged(true)
        setMessage('Sesión iniciada correctamente. Entrando al panel...')
        setTimeout(() => navigate('/creator/panel'), 500)
      }
    } catch (error) {
      const raw = error instanceof Error ? error.message : 'No se pudo completar la operación.'
      const normalized = raw.toLowerCase()
      setStatus('error')
      setMessage(normalized.includes('weak password') || normalized.includes('password should be') ? PASSWORD_POLICY_SUMMARY : raw)
    }
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="Panel de Creador"
        description="Creá o iniciá sesión en tu cuenta de creador dentro de la comunidad XETHKIOZ."
        url="/creator"
      />

      <div className="text-center mb-8">
        <div className="text-5xl mb-3">👑</div>
        <p className="section-eyebrow">XETHKIOZ COMMUNITY</p>
        <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-4">
          Panel de Creador
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Iniciá sesión o registrá tu perfil para participar en la comunidad, preparar contenido y activar futuras funciones.
        </p>
      </div>

      {alreadyLogged && (
        <div className="glass border border-green-500/30 rounded-2xl p-4 mb-6 text-green-300 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <span>Ya tenés una sesión activa en XETHKIOZ.</span>
          <Link to="/creator/panel" className="btn-primary text-center">Ir al panel</Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <section className="lg:col-span-3 glass border border-orange/20 rounded-2xl p-6 md:p-8">
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => changeMode('signup')}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${mode === 'signup' ? 'border-orange text-orange bg-orange/10' : 'border-white/10 text-gray-400 hover:text-white'}`}
            >
              Crear cuenta
            </button>
            <button
              type="button"
              onClick={() => changeMode('signin')}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${mode === 'signin' ? 'border-neon text-neon bg-neon/10' : 'border-white/10 text-gray-400 hover:text-white'}`}
            >
              Iniciar sesión
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="rounded-lg border border-orange/30 bg-orange/10 p-3 text-sm text-orange">
                  Tocá Crear cuenta una sola vez. Si el correo de confirmación cae en Spam, marcá “No es spam” y confirmá desde ahí.
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre visible</label>
                  <input
                    required
                    value={form.displayName}
                    onChange={(e) => update('displayName', e.target.value)}
                    className="input-field"
                    placeholder="Alexis / XETHKIOZ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Usuario</label>
                  <input
                    required
                    value={form.username}
                    onChange={(e) => update('username', e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                    className="input-field"
                    placeholder="xethkioz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Rol inicial</label>
                  <select
                    value={form.role}
                    onChange={(e) => update('role', e.target.value)}
                    className="input-field"
                  >
                    <option>Creador de contenido</option>
                    <option>Streamer</option>
                    <option>Editor de noticias</option>
                    <option>Colaborador gamer</option>
                    <option>Miembro de comunidad</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
              <input
                type="password"
                required
                minLength={mode === 'signup' ? PASSWORD_MIN_LENGTH : 1}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="input-field"
                placeholder={mode === 'signup' ? '12+ caracteres con mayúscula, número y símbolo' : 'Tu contraseña'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                aria-describedby={mode === 'signup' ? 'creator-password-policy' : undefined}
                aria-invalid={mode === 'signup' && form.password.length > 0 && !passwordAssessment.valid}
              />
            </div>

            {mode === 'signup' ? (
              <div id="creator-password-policy" className="rounded-lg border border-white/10 bg-black/25 p-3" aria-live="polite">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-400">Seguridad de contraseña</p>
                <ul className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  {passwordAssessment.rules.map((rule) => (
                    <li key={rule.key} className={rule.passed ? 'text-green-300' : 'text-gray-500'}>
                      <span aria-hidden="true">{rule.passed ? '✓' : '○'}</span> {rule.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {message && (
              <div className={`rounded-lg border p-3 text-sm ${status === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
                {message}
              </div>
            )}

            <button type="submit" disabled={!canSubmit} className="btn-primary w-full disabled:opacity-50">
              {status === 'loading' ? 'Procesando...' : mode === 'signup' ? status === 'success' ? 'Solicitud enviada' : 'Crear mi cuenta de creador' : 'Entrar al panel'}
            </button>
          </form>
        </section>

        <aside className="lg:col-span-2 space-y-4">
          <div className="glass border border-white/10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-white mb-3">Qué se activa con tu cuenta</h2>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>✅ Perfil de usuario preparado.</li>
              <li>✅ Base para comentarios, foros y rankings.</li>
              <li>✅ Futuro acceso a chat flotante y eventos.</li>
              <li>✅ Integración con Supabase Auth.</li>
            </ul>
          </div>

          <div className="glass border border-neon/20 rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-neon mb-3">Estado</h2>
            <p className="text-sm text-gray-400">
              Hotfix v3.6.2: el login ahora redirige al panel y el registro evita múltiples envíos de correo.
            </p>
            <Link to="/community" className="inline-flex mt-4 text-sm text-orange hover:neon-text-orange">
              Volver a Comunidad →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
