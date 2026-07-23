import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useLang } from '../../lib/LangContext'
import { supabase } from '../../services/supabaseClient'
import { useAdminSession } from '../hooks'

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

const copy = {
  es: {
    eyebrow: 'USUARIOS / ROLES',
    title: 'Usuarios y permisos',
    description: 'Panel de auditoría, invitaciones y gestión de perfiles. Las acciones privilegiadas se validan en un backend privado de Supabase.',
    inviteTitle: 'Invitar una cuenta',
    inviteDescription: 'Supabase enviará un enlace de acceso. Por seguridad, las cuentas ADMIN sólo se asignan después de verificar al usuario.',
    email: 'Correo',
    emailPlaceholder: 'persona@ejemplo.com',
    inviteRole: 'Rol inicial',
    inviteTier: 'Tier inicial',
    invite: 'Enviar invitación',
    inviting: 'Enviando…',
    inviteSuccess: 'Invitación enviada correctamente.',
    inviteError: 'No se pudo enviar la invitación',
    currentRole: 'Rol actual',
    roleManagement: 'Gestión de roles',
    adminEnabled: 'ADMIN habilitado',
    readOnly: 'solo lectura',
    stats: { total: 'Total', admins: 'Admins', moderators: 'Mods', editorial: 'Editorial' },
    search: 'Buscar perfiles',
    searchPlaceholder: 'ID, rol o tier',
    results: 'resultados',
    loading: 'Cargando perfiles…',
    emptyTitle: 'No hay perfiles visibles',
    emptyText: 'Puede deberse a RLS o a que todavía no hay usuarios registrados.',
    noResultsTitle: 'Sin resultados',
    noResultsText: 'No hay perfiles que coincidan con la búsqueda.',
    created: 'Creado',
    updated: 'Actualizado',
    access: 'Acceso',
    role: 'Rol',
    tier: 'Tier',
    saving: 'Guardando…',
    save: 'Guardar acceso',
    unchanged: 'Sin cambios',
    noDate: 'Sin fecha',
    adminOnly: 'Solo ADMIN puede cambiar roles.',
    confirmTitle: 'Confirmar cambio de acceso',
    user: 'Usuario',
    roleChange: 'Rol',
    tierChange: 'Tier',
    updateError: 'No se pudo actualizar el rol',
    updateSuccess: 'Acceso actualizado correctamente.',
    noDelete: 'Eliminar usuarios no se gestiona desde frontend; debe hacerse desde Auth/Admin server.',
    descriptions: {
      ADMIN: 'Control total: publicar, aprobar, eliminar, publicidades y roles.',
      MODERATOR: 'Revisa y modera. No elimina ni publica directamente.',
      EDITOR: 'Edita contenido y lo envía a revisión.',
      CONTRIBUTOR: 'Crea borradores y los envía a revisión.',
      USER: 'Usuario registrado con panel personal.',
      GUEST: 'Visitante o perfil básico.',
    } as Record<ProfileRole, string>,
    listLabel: 'Perfiles y permisos del CMS',
  },
  en: {
    eyebrow: 'USERS / ROLES',
    title: 'Users and permissions',
    description: 'Profile auditing, invitations and access management. Privileged actions are verified by a private Supabase backend.',
    inviteTitle: 'Invite an account',
    inviteDescription: 'Supabase will send an access link. For safety, ADMIN accounts are assigned only after the user is verified.',
    email: 'Email',
    emailPlaceholder: 'person@example.com',
    inviteRole: 'Initial role',
    inviteTier: 'Initial tier',
    invite: 'Send invitation',
    inviting: 'Sending…',
    inviteSuccess: 'Invitation sent successfully.',
    inviteError: 'Could not send the invitation',
    currentRole: 'Current role',
    roleManagement: 'Role management',
    adminEnabled: 'ADMIN enabled',
    readOnly: 'read only',
    stats: { total: 'Total', admins: 'Admins', moderators: 'Mods', editorial: 'Editorial' },
    search: 'Search profiles',
    searchPlaceholder: 'ID, role or tier',
    results: 'results',
    loading: 'Loading profiles…',
    emptyTitle: 'No visible profiles',
    emptyText: 'This may be caused by RLS or because no users have registered yet.',
    noResultsTitle: 'No results',
    noResultsText: 'No profiles match the search.',
    created: 'Created',
    updated: 'Updated',
    access: 'Access',
    role: 'Role',
    tier: 'Tier',
    saving: 'Saving…',
    save: 'Save access',
    unchanged: 'No changes',
    noDate: 'No date',
    adminOnly: 'Only ADMIN can change roles.',
    confirmTitle: 'Confirm access change',
    user: 'User',
    roleChange: 'Role',
    tierChange: 'Tier',
    updateError: 'Could not update the role',
    updateSuccess: 'Access updated successfully.',
    noDelete: 'User deletion is not managed from the frontend; use the Auth/Admin server.',
    descriptions: {
      ADMIN: 'Full control: publish, approve, delete, advertising and roles.',
      MODERATOR: 'Reviews and moderates. Cannot delete or publish directly.',
      EDITOR: 'Edits content and submits it for review.',
      CONTRIBUTOR: 'Creates drafts and submits them for review.',
      USER: 'Registered user with a personal dashboard.',
      GUEST: 'Visitor or basic profile.',
    } as Record<ProfileRole, string>,
    listLabel: 'CMS profiles and permissions',
  },
} as const

function normalizeRole(value: string | null): ProfileRole {
  const role = String(value ?? 'GUEST').toUpperCase()
  return roleOptions.includes(role as ProfileRole) ? role as ProfileRole : 'GUEST'
}

function normalizeTier(value: string | null): SubscriptionTier {
  const tier = String(value ?? 'BASIC').toUpperCase()
  return tierOptions.includes(tier as SubscriptionTier) ? tier as SubscriptionTier : 'BASIC'
}

function formatDate(value: string | null, lang: 'es' | 'en', fallback: string) {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

async function readFunctionError(error: unknown, fallback: string) {
  const context = error && typeof error === 'object' && 'context' in error
    ? (error as { context?: unknown }).context
    : null

  if (context instanceof Response) {
    try {
      const payload = await context.clone().json() as { error?: string }
      if (payload.error) return `${fallback}: ${payload.error}`
    } catch {
      // The generic SDK error remains useful if the response is not JSON.
    }
  }

  const message = error instanceof Error ? error.message : String(error || '')
  return message ? `${fallback}: ${message}` : fallback
}

export default function CmsUsersPanel() {
  const { lang } = useLang()
  const t = copy[lang]
  const { role, canDelete } = useAdminSession()
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [draftAccess, setDraftAccess] = useState<Record<string, { role: ProfileRole; tier: SubscriptionTier }>>({})
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<Exclude<ProfileRole, 'ADMIN'>>('USER')
  const [inviteTier, setInviteTier] = useState<SubscriptionTier>('BASIC')
  const [inviting, setInviting] = useState(false)
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

  useEffect(() => { void loadProfiles() }, [])

  const stats = useMemo(() => ({
    total: profiles.length,
    admins: profiles.filter((profile) => normalizeRole(profile.role) === 'ADMIN').length,
    moderators: profiles.filter((profile) => normalizeRole(profile.role) === 'MODERATOR').length,
    contributors: profiles.filter((profile) => ['CONTRIBUTOR', 'EDITOR'].includes(normalizeRole(profile.role))).length,
  }), [profiles])

  const visibleProfiles = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return profiles
    return profiles.filter((profile) => `${profile.id} ${normalizeRole(profile.role)} ${normalizeTier(profile.subscription_tier)}`.toLowerCase().includes(query))
  }, [profiles, search])

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
      setError(t.adminOnly)
      return
    }
    const next = draftAccess[profile.id]
    if (!next) return
    const confirmation = window.confirm(`${t.confirmTitle}\n\n${t.user}: ${profile.id}\n${t.roleChange}: ${normalizeRole(profile.role)} → ${next.role}\n${t.tierChange}: ${normalizeTier(profile.subscription_tier)} → ${next.tier}`)
    if (!confirmation) return

    setSavingId(profile.id)
    setError(null)
    setMessage(null)
    const { error: functionError } = await supabase.functions.invoke('admin-users', {
      body: {
        action: 'set_profile_access',
        targetUserId: profile.id,
        role: next.role,
        tier: next.tier,
      },
    })

    if (functionError) setError(await readFunctionError(functionError, t.updateError))
    else {
      setMessage(t.updateSuccess)
      await loadProfiles()
    }
    setSavingId(null)
  }

  async function inviteUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canDelete || !inviteEmail.trim()) return

    setInviting(true)
    setError(null)
    setMessage(null)
    const { error: functionError } = await supabase.functions.invoke('admin-users', {
      body: {
        action: 'invite_user',
        email: inviteEmail.trim(),
        role: inviteRole,
        tier: inviteTier,
      },
    })

    if (functionError) {
      setError(await readFunctionError(functionError, t.inviteError))
    } else {
      setInviteEmail('')
      setMessage(t.inviteSuccess)
      await loadProfiles()
    }
    setInviting(false)
  }

  return (
    <section className="space-y-6 text-white" aria-labelledby="cms-users-title" aria-busy={loading}>
      <div className="rounded-3xl border border-purple-500/20 bg-black/35 p-6 shadow-2xl shadow-purple-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.eyebrow}</p>
        <h2 id="cms-users-title" className="mt-3 text-3xl font-black md:text-4xl">{t.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">{t.description}</p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">{t.currentRole}: <strong>{role}</strong> · {t.roleManagement}: <strong>{canDelete ? t.adminEnabled : t.readOnly}</strong></p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[[t.stats.total, stats.total], [t.stats.admins, stats.admins], [t.stats.moderators, stats.moderators], [t.stats.editorial, stats.contributors]].map(([label, value]) => <article key={String(label)} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></article>)}
      </div>

      <form onSubmit={(event) => void inviteUser(event)} className="rounded-3xl border border-orange-400/25 bg-orange-400/[0.06] p-5">
        <h3 className="text-xl font-black text-white">{t.inviteTitle}</h3>
        <p className="mt-2 text-sm leading-6 text-purple-100">{t.inviteDescription}</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,.8fr)_minmax(0,.8fr)_auto] lg:items-end">
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-200">
            {t.email}
            <input type="email" required autoComplete="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder={t.emailPlaceholder} disabled={!canDelete || inviting} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300 disabled:opacity-60" />
          </label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-200">
            {t.inviteRole}
            <select value={inviteRole} onChange={(event) => setInviteRole(event.target.value as Exclude<ProfileRole, 'ADMIN'>)} disabled={!canDelete || inviting} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white disabled:opacity-60">
              {roleOptions.filter((option) => option !== 'ADMIN').map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-purple-200">
            {t.inviteTier}
            <select value={inviteTier} onChange={(event) => setInviteTier(event.target.value as SubscriptionTier)} disabled={!canDelete || inviting} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white disabled:opacity-60">
              {tierOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <button type="submit" disabled={!canDelete || inviting || !inviteEmail.trim()} className="rounded-full border border-orange-400/50 bg-orange-500/15 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-orange-100 transition hover:bg-orange-500/25 disabled:opacity-40">
            {inviting ? t.inviting : t.invite}
          </button>
        </div>
      </form>

      <label className="grid gap-2 rounded-3xl border border-purple-500/20 bg-white/[0.04] p-4 text-xs font-black uppercase tracking-[0.16em] text-purple-200">
        {t.search}
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchPlaceholder} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
        {!loading ? <span className="normal-case tracking-normal text-purple-200/65" role="status" aria-live="polite">{visibleProfiles.length} {t.results}</span> : null}
      </label>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100" role="status" aria-live="polite">{t.loading}</p> : null}
      {error ? <p className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200" role="alert">{error}</p> : null}
      {message ? <p className="rounded-3xl border border-green-500/30 bg-green-500/10 p-5 text-green-100" role="status" aria-live="polite">{message}</p> : null}

      {!loading && !error && profiles.length === 0 ? <article className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-6 text-yellow-100" role="status"><h3 className="text-xl font-black">{t.emptyTitle}</h3><p className="mt-2 text-sm leading-6">{t.emptyText}</p></article> : null}
      {!loading && profiles.length > 0 && visibleProfiles.length === 0 ? <article className="rounded-3xl border border-dashed border-purple-400/20 p-6 text-purple-100" role="status"><h3 className="text-xl font-black">{t.noResultsTitle}</h3><p className="mt-2 text-sm">{t.noResultsText}</p></article> : null}

      <div className="grid gap-4 xl:grid-cols-2" aria-label={t.listLabel}>
        {visibleProfiles.map((profile) => {
          const currentRole = normalizeRole(profile.role)
          const currentTier = normalizeTier(profile.subscription_tier)
          const draft = draftAccess[profile.id] ?? { role: currentRole, tier: currentTier }
          const changed = draft.role !== currentRole || draft.tier !== currentTier
          return (
            <article key={profile.id} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="break-all font-mono text-xs text-purple-200">{profile.id}</p>
                  <h3 className="mt-2 text-2xl font-black uppercase text-white">{currentRole} · {currentTier}</h3>
                  <p className="mt-2 text-sm leading-6 text-purple-100">{t.descriptions[currentRole]}</p>
                  <p className="mt-3 text-xs text-purple-200">{t.created}: <time dateTime={profile.created_at ?? undefined}>{formatDate(profile.created_at, lang, t.noDate)}</time></p>
                  <p className="mt-1 text-xs text-purple-200">{t.updated}: <time dateTime={profile.updated_at ?? undefined}>{formatDate(profile.updated_at, lang, t.noDate)}</time></p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-purple-100 md:min-w-72">
                  <strong className="text-orange-200">{t.access}</strong>
                  <div className="mt-3 grid gap-3">
                    <label className="grid gap-1 uppercase tracking-[0.14em] text-purple-200">{t.role}<select value={draft.role} onChange={(event) => updateDraft(profile.id, { role: event.target.value as ProfileRole })} disabled={!canDelete || savingId === profile.id} className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white disabled:opacity-60">{roleOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                    <label className="grid gap-1 uppercase tracking-[0.14em] text-purple-200">{t.tier}<select value={draft.tier} onChange={(event) => updateDraft(profile.id, { tier: event.target.value as SubscriptionTier })} disabled={!canDelete || savingId === profile.id} className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white disabled:opacity-60">{tierOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                    <button type="button" disabled={!canDelete || !changed || savingId === profile.id} onClick={() => void saveProfileAccess(profile)} className="rounded-full border border-orange-400/50 bg-orange-500/10 px-4 py-2 font-black uppercase tracking-[0.16em] text-orange-100 transition hover:bg-orange-500/20 disabled:opacity-40">{savingId === profile.id ? t.saving : changed ? t.save : t.unchanged}</button>
                    <p className="text-[11px] leading-5 text-purple-200">{t.noDelete}</p>
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
