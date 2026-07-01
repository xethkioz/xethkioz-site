import { useEffect, useMemo, useState } from 'react'
import { useAdminSession } from '../hooks'
import { supabase } from '../../services/supabaseClient'

type ProfileRow = {
  id: string
  role: string | null
  subscription_tier: string | null
  created_at: string | null
  updated_at: string | null
}

function formatDate(value: string | null) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function roleDescription(role: string | null) {
  const normalized = String(role ?? 'GUEST').toUpperCase()
  if (normalized === 'ADMIN') return 'Control total: publicar, aprobar, eliminar, ads y roles.'
  if (normalized === 'MODERATOR') return 'Revisa y modera. No elimina ni publica directo.'
  if (normalized === 'EDITOR') return 'Edita contenido y envía a revisión.'
  if (normalized === 'CONTRIBUTOR') return 'Crea borradores y envía a revisión.'
  if (normalized === 'USER') return 'Usuario registrado con panel personal.'
  return 'Visitante o perfil básico.'
}

export default function CmsUsersPanel() {
  const { role, canDelete } = useAdminSession()
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadProfiles() {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('id, role, subscription_tier, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(100)

      if (!active) return

      if (queryError) {
        setError(queryError.message)
        setProfiles([])
      } else {
        setProfiles((data ?? []) as ProfileRow[])
      }

      setLoading(false)
    }

    void loadProfiles()

    return () => {
      active = false
    }
  }, [])

  const stats = useMemo(() => ({
    total: profiles.length,
    admins: profiles.filter((profile) => String(profile.role).toUpperCase() === 'ADMIN').length,
    moderators: profiles.filter((profile) => String(profile.role).toUpperCase() === 'MODERATOR').length,
    contributors: profiles.filter((profile) => ['CONTRIBUTOR', 'EDITOR'].includes(String(profile.role).toUpperCase())).length,
  }), [profiles])

  return (
    <section className="space-y-6 text-white">
      <div className="rounded-3xl border border-purple-500/20 bg-black/35 p-6 shadow-2xl shadow-purple-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">USERS / ROLES</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">Usuarios y permisos</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
          Panel de auditoría de perfiles. Los cambios de rol deben quedar limitados a ADMIN y protegidos por RLS en Supabase.
        </p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">Rol actual: <strong>{role}</strong> · Gestión de roles: <strong>{canDelete ? 'ADMIN habilitado' : 'solo lectura'}</strong></p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Total</p><strong className="mt-2 block text-3xl">{stats.total}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Admins</p><strong className="mt-2 block text-3xl">{stats.admins}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Mods</p><strong className="mt-2 block text-3xl">{stats.moderators}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Editorial</p><strong className="mt-2 block text-3xl">{stats.contributors}</strong></article>
      </div>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100">Cargando perfiles...</p> : null}
      {error ? <p className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">No se pudo cargar profiles: {error}</p> : null}

      {!loading && !error && profiles.length === 0 ? (
        <article className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-6 text-yellow-100">
          <h3 className="text-xl font-black">No hay perfiles visibles</h3>
          <p className="mt-2 text-sm leading-6">Puede deberse a RLS o a que todavía no hay usuarios registrados.</p>
        </article>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {profiles.map((profile) => (
          <article key={profile.id} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="break-all font-mono text-xs text-purple-200">{profile.id}</p>
                <h3 className="mt-2 text-2xl font-black uppercase text-white">{profile.role ?? 'GUEST'} · {profile.subscription_tier ?? 'BASIC'}</h3>
                <p className="mt-2 text-sm leading-6 text-purple-100">{roleDescription(profile.role)}</p>
                <p className="mt-3 text-xs text-purple-200">Creado: {formatDate(profile.created_at)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-purple-100 md:max-w-xs">
                <strong className="text-orange-200">Acciones</strong>
                <p className="mt-2">Cambio de rol: próximo bloque con RPC admin y confirmación doble.</p>
                <p className="mt-2">Eliminar usuario: no recomendado desde frontend; debe hacerse desde Auth/Admin server.</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
