import { useEffect, useMemo, useState } from 'react'
import { useAdminSession } from '../hooks'
import { supabase } from '../../services/supabaseClient'

type ProfileRole = 'GUEST' | 'USER' | 'CONTRIBUTOR' | 'EDITOR' | 'MODERATOR' | 'ADMIN'
type SubscriptionTier = 'BASIC' | 'CREATOR' | 'ARCHITECT'

type ProfileRow = {
  id: string
  role: string | null
  subscription_tier: string | null
  created_at: string | null
  updated_at: string | null
}

const roleOptions: ProfileRole[] = ['GUEST', 'USER', 'CONTRIBUTOR', 'EDITOR', 'MODERATOR', 'ADMIN']
const tierOptions: SubscriptionTier[] = ['BASIC', 'CREATOR', 'ARCHITECT']

function normalizeRole(value: string | null): ProfileRole {
  const role = String(value ?? 'GUEST').toUpperCase()
  return roleOptions.includes(role as ProfileRole) ? role as ProfileRole : 'GUEST'
}

function normalizeTier(value: string | null): SubscriptionTier {
  const tier = String(value ?? 'BASIC').toUpperCase()
  return tierOptions.includes(tier as SubscriptionTier) ? tier as SubscriptionTier : 'BASIC'
}

function formatDate(value: string | null) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function roleDescription(role: string | null) {
  const normalized = normalizeRole(role)
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
  const [draftAccess, setDraftAccess] = useState<Record<string, { role: ProfileRole; tier: SubscriptionTier }>>({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadProfiles() {
    setLoading(true)
    setError(null)

    const { data, error: queryError } = await supabase
      .from('profiles')
      .select('id, role, subscription_tier, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(100)

    if (queryError) {
      setError(queryError.message)
      setProfiles([])
      setDraftAccess({})
    } else {
      const nextProfiles = (data ?? []) as ProfileRow[]
      setProfiles(nextProfiles)
      setDraftAccess(Object.fromEntries(nextProfiles.map((profile) => [profile.id, { role: normalizeRole(profile.role), tier: normalizeTier(profile.subscription_tier) }])))
    }

    setLoading(false)
  }

  useEffect(() => {
    void loadProfiles()
  }, [])

  const stats = useMemo(() => ({
    total: profiles.length,
    admins: profiles.filter((profile) => normalizeRole(profile.role) === 'ADMIN').length,
    moderators: profiles.filter((profile) => normalizeRole(profile.role) === 'MODERATOR').length,
    contributors: profiles.filter((profile) => ['CONTRIBUTOR', 'EDITOR'].includes(normalizeRole(profile.role))).length,
  }), [profiles])

  function updateDraft(id: string, next: Partial<{ role: ProfileRole; tier: SubscriptionTier }>) {
    setDraftAccess((current) => ({
      ...current,
      [id]: {
        role: next.role ?? current[id]?.role ?? 'GUEST',
        tier: next.tier ?? current[id]?.tier ?? 'BASIC',
      },
    }))
  }

  async function saveProfileAccess(profile: ProfileRow) {
    if (!canDelete) {
      setError('Solo ADMIN puede cambiar roles.')
      return
    }

    const next = draftAccess[profile.id]
    if (!next) return

    const confirmation = window.confirm(`Confirmar cambio de acceso\n\nUsuario: ${profile.id}\nRol: ${normalizeRole(profile.role)} → ${next.role}\nTier: ${normalizeTier(profile.subscription_tier)} → ${next.tier}`)
    if (!confirmation) return

    setSavingId(profile.id)
    setError(null)
    setMessage(null)

    const { error: rpcError } = await supabase.rpc('xethkioz_admin_set_profile_access', {
      target_user_id: profile.id,
      next_role: next.role,
      next_subscription_tier: next.tier,
    })

    if (rpcError) {
      setError(`No se pudo actualizar el rol: ${rpcError.message}`)
    } else {
      setMessage('Rol actualizado correctamente.')
      await loadProfiles()
    }

    setSavingId(null)
  }

  return (
    <section className="space-y-6 text-white">
      <div className="rounded-3xl border border-purple-500/20 bg-black/35 p-6 shadow-2xl shadow-purple-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">USERS / ROLES</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">Usuarios y permisos</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">Panel de auditoría y gestión de perfiles. Los cambios de rol usan una RPC admin protegida en Supabase.</p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">Rol actual: <strong>{role}</strong> · Gestión de roles: <strong>{canDelete ? 'ADMIN habilitado' : 'solo lectura'}</strong></p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Total</p><strong className="mt-2 block text-3xl">{stats.total}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Admins</p><strong className="mt-2 block text-3xl">{stats.admins}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Mods</p><strong className="mt-2 block text-3xl">{stats.moderators}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Editorial</p><strong className="mt-2 block text-3xl">{stats.contributors}</strong></article>
      </div>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100">Cargando perfiles...</p> : null}
      {error ? <p className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}
      {message ? <p className="rounded-3xl border border-green-500/30 bg-green-500/10 p-5 text-green-100">{message}</p> : null}

      {!loading && !error && profiles.length === 0 ? (
        <article className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-6 text-yellow-100">
          <h3 className="text-xl font-black">No hay perfiles visibles</h3>
          <p className="mt-2 text-sm leading-6">Puede deberse a RLS o a que todavía no hay usuarios registrados.</p>
        </article>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {profiles.map((profile) => {
          const draft = draftAccess[profile.id] ?? { role: normalizeRole(profile.role), tier: normalizeTier(profile.subscription_tier) }
          const changed = draft.role !== normalizeRole(profile.role) || draft.tier !== normalizeTier(profile.subscription_tier)
          return (
            <article key={profile.id} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="break-all font-mono text-xs text-purple-200">{profile.id}</p>
                  <h3 className="mt-2 text-2xl font-black uppercase text-white">{normalizeRole(profile.role)} · {normalizeTier(profile.subscription_tier)}</h3>
                  <p className="mt-2 text-sm leading-6 text-purple-100">{roleDescription(profile.role)}</p>
                  <p className="mt-3 text-xs text-purple-200">Creado: {formatDate(profile.created_at)}</p>
                  <p className="mt-1 text-xs text-purple-200">Actualizado: {formatDate(profile.updated_at)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-purple-100 md:min-w-72">
                  <strong className="text-orange-200">Acceso</strong>
                  <div className="mt-3 grid gap-3">
                    <label className="grid gap-1 uppercase tracking-[0.14em] text-purple-200">
                      Rol
                      <select value={draft.role} onChange={(event) => updateDraft(profile.id, { role: event.target.value as ProfileRole })} disabled={!canDelete || savingId === profile.id} className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white disabled:opacity-60">
                        {roleOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                    <label className="grid gap-1 uppercase tracking-[0.14em] text-purple-200">
                      Tier
                      <select value={draft.tier} onChange={(event) => updateDraft(profile.id, { tier: event.target.value as SubscriptionTier })} disabled={!canDelete || savingId === profile.id} className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white disabled:opacity-60">
                        {tierOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                    <button type="button" disabled={!canDelete || !changed || savingId === profile.id} onClick={() => void saveProfileAccess(profile)} className="rounded-full border border-orange-400/50 bg-orange-500/10 px-4 py-2 font-black uppercase tracking-[0.16em] text-orange-100 transition hover:bg-orange-500/20 disabled:opacity-40">
                      {savingId === profile.id ? 'Guardando...' : changed ? 'Guardar rol' : 'Sin cambios'}
                    </button>
                    <p className="text-[11px] leading-5 text-purple-200">Eliminar usuario no se gestiona desde frontend; debe hacerse desde Auth/Admin server.</p>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
