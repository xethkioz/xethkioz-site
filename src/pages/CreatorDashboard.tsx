import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

type Profile = {
  display_name?: string | null
  username?: string | null
  role?: string | null
  status?: string | null
}

export default function CreatorDashboard() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

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
      setEmail(user.email || '')

      const { data } = await supabase
        .from('profiles')
        .select('display_name, username, role, status')
        .eq('id', user.id)
        .maybeSingle()

      if (!active) return
      setProfile(data || null)
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [navigate])

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="glass border border-white/10 rounded-xl p-5">
          <div className="text-2xl mb-2">👤</div>
          <h2 className="font-display text-lg font-bold text-white mb-1">Perfil</h2>
          <p className="text-sm text-gray-400">Usuario: {profile?.username || 'Pendiente'}</p>
          <p className="text-sm text-gray-400">Rol: {profile?.role || 'Miembro'}</p>
          <p className="text-sm text-gray-400">Estado: {profile?.status || 'Activo'}</p>
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

      <section className="glass border border-neon/20 rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-2xl font-bold text-neon mb-3">Próximas funciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
          <p>✅ Perfil público editable.</p>
          <p>✅ Comentarios en noticias.</p>
          <p>✅ Chat flotante para usuarios registrados.</p>
          <p>✅ Panel de creador para publicar contenido.</p>
        </div>
        <Link to="/community" className="inline-flex mt-6 text-orange hover:neon-text-orange">Volver a Comunidad →</Link>
      </section>
    </div>
  )
}
