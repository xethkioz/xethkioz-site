import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

type Mode = 'signup' | 'signin'
type Status = 'idle' | 'loading' | 'success' | 'error'

export default function CreatorAccount() {
  const [mode, setMode] = useState<Mode>('signup')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
    role: 'Creador de contenido',
  })

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              display_name: form.displayName,
              username: form.username,
              role: form.role,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          await supabase.from('creator_profiles').upsert({
            id: data.user.id,
            display_name: form.displayName,
            username: form.username,
            email: form.email,
            role: form.role,
            status: 'pending',
          })
        }

        setStatus('success')
        setMessage('Cuenta creada. Revisá tu correo para confirmar el acceso si Supabase lo solicita.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })

        if (error) throw error

        setStatus('success')
        setMessage('Sesión iniciada correctamente. Ya podés volver al panel de comunidad.')
      }
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'No se pudo completar la operación.')
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
          Registrá tu perfil para participar en la comunidad, publicar ideas, preparar contenido y activar futuras funciones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <section className="lg:col-span-3 glass border border-orange/20 rounded-2xl p-6 md:p-8">
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${mode === 'signup' ? 'border-orange text-orange bg-orange/10' : 'border-white/10 text-gray-400 hover:text-white'}`}
            >
              Crear cuenta
            </button>
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${mode === 'signin' ? 'border-neon text-neon bg-neon/10' : 'border-white/10 text-gray-400 hover:text-white'}`}
            >
              Iniciar sesión
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <>
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {message && (
              <div className={`rounded-lg border p-3 text-sm ${status === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
                {message}
              </div>
            )}

            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-50">
              {status === 'loading' ? 'Procesando...' : mode === 'signup' ? 'Crear mi cuenta de creador' : 'Entrar al panel'}
            </button>
          </form>
        </section>

        <aside className="lg:col-span-2 space-y-4">
          <div className="glass border border-white/10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-white mb-3">Qué se activa con tu cuenta</h2>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>✅ Perfil de creador preparado para comunidad.</li>
              <li>✅ Base para comentarios, foros y rankings.</li>
              <li>✅ Futuro acceso a contenido premium y eventos.</li>
              <li>✅ Integración con Supabase Auth.</li>
            </ul>
          </div>

          <div className="glass border border-neon/20 rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-neon mb-3">Estado</h2>
            <p className="text-sm text-gray-400">
              Esta es la primera versión funcional del panel. Las funciones sociales avanzadas quedan preparadas para la siguiente fase.
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
