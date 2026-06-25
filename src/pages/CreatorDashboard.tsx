import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

type Profile = {
  display_name?: string | null
  username?: string | null
  role?: string | null
  status?: string | null
  bio?: string | null
  avatar_url?: string | null
}

type Status = 'idle' | 'saving' | 'success' | 'error'

const normalizeUsername = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9_.-]/g, '').slice(0, 24)

export default function CreatorDashboard() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [emailConfirmed, setEmailConfirmed] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    displayName: '',
    username: '',
    role: 'Miembro de comunidad',
    bio: '',
    avatarUrl: '',
  })

  useEffect(() => {
    let active = true

    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user

      if (!user) {
        navigate('/creator', { replace: true })
        return
      }

      if (!active) return

      const metadata = user.user_metadata || {}
      const baseProfile: Profile = {
        display_name: metadata.display_name || '',
        username: metadata.username || '',
        role: metadata.role || 'Miembro de comunidad',
        status: user.email_confirmed_at ? 'active' : 'pending_email_confirmation',
        bio: metadata.bio || '',
        avatar_url: metadata.avatar_url || '',
      }

      setUserId(user.id)
      setEmail(user.email || '')
      setEmailConfirmed(Boolean(user.email_confirmed_at))

      const { data } = await supabase
        .from('creator_profiles')
        .select('display_name, username, role, status, bio, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      const current = data || baseProfile
      setProfile(current)
      setForm({
        displayName: current.display_name || '',
        username: current.username || '',
        role: current.role || 'Miembro de comunidad',
        bio: current.bio || '',
        avatarUrl: current.avatar_url || '',
      })

      if (!data) {
        await supabase.from('creator_profiles').upsert({
          id: user.id,
          email: user.email || '',
          display_name: baseProfile.display_name || user.email?.split('@')[0] || 'Usuario XETHKIOZ',
          username: normalizeUsername(baseProfile.username || user.email?.split('@')[0] || `user_${user.id.slice(0, 6)}`),
          role: baseProfile.role || 'Miembro de comunidad',
          status: baseProfile.status || 'active',
          bio: baseProfile.bio || null,
          avatar_url: baseProfile.avatar_url || null,
        })
      }

      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [navigate])

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: field === 'username' ? normalizeUsername(value) : value }))
  }

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('saving')
    setMessage('')

    if (!userId) return

    const displayName = form.displayName.trim() || email.split('@')[0] || 'Usuario XETHKIOZ'
    const username = normalizeUsername(form.username || displayName)

    const { error } = await supabase.from('creator_profiles').upsert({
      id: userId,
      email,
      display_name: displayName,
      username,
      role: form.role,
      status: emailConfirmed ? 'active' : 'pending_email_confirmation',
      bio: form.bio.trim() || null,
      avatar_url: form.avatarUrl.trim() || null,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      setStatus('error')
      setMessage(error.message)
      return
    }

    setProfile({ display_name: displayName, username, role: form.role, status: emailConfirmed ? 'active' : 'pending_email_confirmation', bio: form.bio, avatar_url: form.avatarUrl })
    setStatus('success')
    setMessage('Perfil actualizado correctamente.')
  }

  const resendConfirmation = async () => {
    setStatus('saving')
    setMessage('')

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/creator/panel` },
    })

    if (error) {
      setStatus('error')
      setMessage(error.message)
      return
    }

    setStatus('success')
    setMessage('Te reenviamos el correo de confirmación. Revisá Recibidos y Spam. Marcá el mensaje como “No es spam”.')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/creator', { replace: true })
  }

  if (loading) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <SEO title="Panel de Usuario" />
        <div className="text-orange font-display text-xl">Cargando panel...</div>
      </div>
    )
  }

  const displayName = profile?.display_name || email || 'Usuario XETHKIOZ'

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <SEO title="Panel de Usuario XETHKIOZ" description="Panel privado para miembros y creadores de la comunidad XETHKIOZ." url="/creator/panel" />

      <section className="glass border border-orange/20 rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="section-eyebrow">XETHKIOZ ACCOUNT</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-2">Panel de Usuario</h1>
            <p className="text-gray-400">Bienvenido, <span className="text-white font-semibold">{displayName}</span>.</p>
          </div>
          <button type="button" onClick={signOut} className="btn-secondary">Cerrar sesión</button>
        </div>
      </section>

      {!emailConfirmed && (
        <section className="glass border border-yellow-500/30 bg-yellow-500/5 rounded-2xl p-5 mb-6">
          <h2 className="font-display text-lg font-bold text-yellow-300 mb-2">Confirmá tu correo</h2>
          <p className="text-sm text-gray-400 mb-4">
            Tu cuenta inició sesión, pero todavía falta confirmar el email. Si Gmail lo mandó a Spam, abrilo y tocá “No es spam”.
          </p>
          <button type="button" onClick={resendConfirmation} disabled={status === 'saving'} className="btn-primary disabled:opacity-50">
            Reenviar confirmación
          </button>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="glass border border-white/10 rounded-xl p-5">
          <div className="text-2xl mb-2">👤</div>
          <h2 className="font-display text-lg font-bold text-white mb-1">Perfil</h2>
          <p className="text-sm text-gray-400">Usuario: {profile?.username || 'Pendiente'}</p>
          <p className="text-sm text-gray-400">Rol: {profile?.role || 'Miembro'}</p>
          <p className="text-sm text-gray-400">Estado: {emailConfirmed ? 'Correo confirmado' : 'Correo pendiente'}</p>
        </div>
        <div className="glass border border-white/10 rounded-xl p-5">
          <div className="text-2xl mb-2">📰</div>
          <h2 className="font-display text-lg font-bold text-white mb-1">Contenido</h2>
          <p className="text-sm text-gray-400">La creación de noticias y publicaciones se habilitará en el panel Admin/Creator de v3.8.</p>
        </div>
        <div className="glass border border-white/10 rounded-xl p-5">
          <div className="text-2xl mb-2">💬</div>
          <h2 className="font-display text-lg font-bold text-white mb-1">Comunidad</h2>
          <p className="text-sm text-gray-400">Comentarios, chat y perfil público quedan preparados para la fase v3.7/v3.8.</p>
        </div>
      </div>

      <section className="glass border border-orange/20 rounded-2xl p-6 md:p-8 mb-6">
        <h2 className="font-display text-2xl font-bold text-orange mb-4">Editar perfil</h2>
        <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre visible</label>
            <input value={form.displayName} onChange={(e) => update('displayName', e.target.value)} className="input-field" placeholder="Alexis / XETHKIOZ" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Usuario</label>
            <input value={form.username} onChange={(e) => update('username', e.target.value)} className="input-field" placeholder="xethkioz" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Rol</label>
            <select value={form.role} onChange={(e) => update('role', e.target.value)} className="input-field">
              <option>Miembro de comunidad</option>
              <option>Creador de contenido</option>
              <option>Streamer</option>
              <option>Editor de noticias</option>
              <option>Colaborador gamer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Avatar URL</label>
            <input value={form.avatarUrl} onChange={(e) => update('avatarUrl', e.target.value)} className="input-field" placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Biografía</label>
            <textarea rows={4} value={form.bio} onChange={(e) => update('bio', e.target.value)} className="input-field resize-none" placeholder="Contá quién sos dentro de la comunidad XETHKIOZ..." />
          </div>
          {message && (
            <div className={`md:col-span-2 rounded-lg border p-3 text-sm ${status === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
              {message}
            </div>
          )}
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
            <button type="submit" disabled={status === 'saving'} className="btn-primary disabled:opacity-50">
              {status === 'saving' ? 'Guardando...' : 'Guardar perfil'}
            </button>
            <Link to="/community" className="btn-secondary text-center">Volver a Comunidad</Link>
          </div>
        </form>
      </section>

      <section className="glass border border-neon/20 rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-2xl font-bold text-neon mb-3">Próximas funciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
          <p>✅ Perfil público editable.</p>
          <p>✅ Comentarios en noticias.</p>
          <p>✅ Chat flotante para usuarios registrados.</p>
          <p>✅ Panel de creador para publicar contenido.</p>
        </div>
      </section>
    </div>
  )
}
