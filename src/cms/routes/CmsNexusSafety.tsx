import { useEffect, useMemo, useState } from 'react'
import { useLang } from '../../lib/LangContext'
import { supabase } from '../../services/supabaseClient'
import { useAdminSession } from '../hooks'

type ReportStatus = 'new' | 'reviewing' | 'resolved' | 'dismissed'
type SafetyReport = { id: string; reporter_id: string; subject_user_id: string | null; room_id: string | null; direct_message_id: string | null; evidence_snapshot: string | null; category: string; detail: string; status: ReportStatus; created_at: string; resolved_at: string | null }
type PublicIdentity = { user_id: string; handle: string; display_name: string }

const copy = {
  es: {
    restrictedEyebrow: 'TRUST & SAFETY // RESTRINGIDO',
    restrictedTitle: 'Acceso de moderación requerido',
    restrictedText: 'Esta cola contiene reportes privados y solo está disponible para roles MODERATOR o ADMIN.',
    eyebrow: 'NEXUS CITY / TRUST & SAFETY',
    title: 'Moderación de la ciudad',
    description: 'Cola privada para investigar señales concretas. Los detalles no se publican, no se usan para exhibir personas y requieren revisión humana.',
    syncing: 'Sincronizando…',
    refresh: 'Actualizar cola',
    filterLabel: 'Filtrar reportes privados',
    statuses: { new: 'Nuevos', reviewing: 'En revisión', resolved: 'Resueltos', dismissed: 'Descartados' } as Record<ReportStatus, string>,
    all: 'Todos',
    loading: 'Cargando cola privada…',
    empty: 'No hay reportes en este estado.',
    noSubject: 'Sin sujeto',
    privateProfile: 'Perfil privado',
    subject: 'Sujeto',
    reporter: 'Reportante',
    room: 'Sala',
    evidence: 'Evidencia aportada por el reportante',
    take: 'Tomar caso',
    resolve: 'Resolver',
    dismiss: 'Descartar',
    updated: 'Estado del reporte actualizado.',
    categories: {
      harassment: 'Acoso',
      spam: 'Spam',
      'unsafe-content': 'Contenido inseguro',
      impersonation: 'Suplantación',
      other: 'Otro',
    } as Record<string, string>,
    queueLabel: 'Reportes privados de seguridad',
  },
  en: {
    restrictedEyebrow: 'TRUST & SAFETY // RESTRICTED',
    restrictedTitle: 'Moderation access required',
    restrictedText: 'This queue contains private reports and is only available to MODERATOR or ADMIN roles.',
    eyebrow: 'NEXUS CITY / TRUST & SAFETY',
    title: 'City moderation',
    description: 'Private queue for investigating specific signals. Details are not published, are not used to expose people and require human review.',
    syncing: 'Syncing…',
    refresh: 'Refresh queue',
    filterLabel: 'Filter private reports',
    statuses: { new: 'New', reviewing: 'In review', resolved: 'Resolved', dismissed: 'Dismissed' } as Record<ReportStatus, string>,
    all: 'All',
    loading: 'Loading private queue…',
    empty: 'There are no reports in this status.',
    noSubject: 'No subject',
    privateProfile: 'Private profile',
    subject: 'Subject',
    reporter: 'Reporter',
    room: 'Room',
    evidence: 'Evidence submitted by the reporter',
    take: 'Take case',
    resolve: 'Resolve',
    dismiss: 'Dismiss',
    updated: 'Report status updated.',
    categories: {
      harassment: 'Harassment',
      spam: 'Spam',
      'unsafe-content': 'Unsafe content',
      impersonation: 'Impersonation',
      other: 'Other',
    } as Record<string, string>,
    queueLabel: 'Private safety reports',
  },
} as const

export default function CmsNexusSafety() {
  const { lang } = useLang()
  const t = copy[lang]
  const { canModerate, loading: sessionLoading } = useAdminSession()
  const [reports, setReports] = useState<SafetyReport[]>([])
  const [identities, setIdentities] = useState<Map<string, PublicIdentity>>(new Map())
  const [filter, setFilter] = useState<ReportStatus | 'all'>('new')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busyId, setBusyId] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (sessionLoading) return
    if (!canModerate) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    setError('')
    const load = async () => {
      const { data, error: reportError } = await supabase.from('nexus_safety_reports').select('id,reporter_id,subject_user_id,room_id,direct_message_id,evidence_snapshot,category,detail,status,created_at,resolved_at').order('created_at', { ascending: false }).limit(250)
      if (!active) return
      if (reportError) {
        setError(reportError.message)
        setLoading(false)
        return
      }
      const rows = (data || []) as SafetyReport[]
      setReports(rows)
      const ids = [...new Set(rows.flatMap((row) => [row.reporter_id, row.subject_user_id]).filter(Boolean))] as string[]
      if (ids.length) {
        const { data: profileData } = await supabase.from('nexus_public_directory').select('user_id,handle,display_name').in('user_id', ids)
        if (active) setIdentities(new Map(((profileData || []) as PublicIdentity[]).map((item) => [item.user_id, item])))
      } else if (active) setIdentities(new Map())
      setLoading(false)
    }
    void load()
    return () => { active = false }
  }, [canModerate, refreshKey, sessionLoading])

  const visibleReports = useMemo(() => filter === 'all' ? reports : reports.filter((report) => report.status === filter), [filter, reports])
  const counts = useMemo<Record<ReportStatus | 'all', number>>(() => ({
    all: reports.length,
    new: reports.filter((report) => report.status === 'new').length,
    reviewing: reports.filter((report) => report.status === 'reviewing').length,
    resolved: reports.filter((report) => report.status === 'resolved').length,
    dismissed: reports.filter((report) => report.status === 'dismissed').length,
  }), [reports])

  const updateStatus = async (report: SafetyReport, status: ReportStatus) => {
    setBusyId(report.id)
    setError('')
    setMessage('')
    const closed = status === 'resolved' || status === 'dismissed'
    const resolvedAt = closed ? new Date().toISOString() : null
    const { error: updateError } = await supabase.from('nexus_safety_reports').update({ status, resolved_at: resolvedAt }).eq('id', report.id)
    setBusyId('')
    if (updateError) {
      setError(updateError.message)
      return
    }
    setReports((current) => current.map((item) => item.id === report.id ? { ...item, status, resolved_at: resolvedAt } : item))
    setMessage(t.updated)
  }

  const identityLabel = (id: string | null) => {
    if (!id) return t.noSubject
    const identity = identities.get(id)
    return identity ? `${identity.display_name} · @${identity.handle}` : `${t.privateProfile} · ${id.slice(0, 8)}`
  }

  const statusActionLabel = (status: ReportStatus) => status === 'reviewing' ? t.take : status === 'resolved' ? t.resolve : t.dismiss
  const categoryLabel = (category: string) => t.categories[category] ?? category
  const locale = lang === 'es' ? 'es-AR' : 'en-US'

  if (!sessionLoading && !canModerate) return <section className="rounded-3xl border border-red-400/25 bg-red-500/[.06] p-8 text-white" aria-labelledby="safety-restricted-title"><p className="text-xs font-black uppercase tracking-[.25em] text-red-300">{t.restrictedEyebrow}</p><h1 id="safety-restricted-title" className="mt-3 text-3xl font-black">{t.restrictedTitle}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">{t.restrictedText}</p></section>

  return <section className="space-y-6 text-white" aria-labelledby="cms-safety-title" aria-busy={loading || sessionLoading}>
    <header className="flex flex-col gap-5 rounded-3xl border border-rose-400/25 bg-[radial-gradient(circle_at_90%_0%,rgba(244,63,94,.14),transparent_35%),rgba(0,0,0,.35)] p-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[.3em] text-rose-300">{t.eyebrow}</p><h1 id="cms-safety-title" className="mt-3 text-3xl font-black md:text-4xl">{t.title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-rose-100/70">{t.description}</p></div><button type="button" onClick={() => setRefreshKey((current) => current + 1)} disabled={loading} className="min-h-11 rounded-full border border-rose-300/35 bg-rose-400/10 px-5 font-mono text-xs font-black uppercase tracking-[.16em] text-rose-100 disabled:opacity-50">{loading ? t.syncing : t.refresh}</button></header>

    <nav className="flex flex-wrap gap-2" aria-label={t.filterLabel}>{(['all', 'new', 'reviewing', 'resolved', 'dismissed'] as const).map((status) => <button key={status} type="button" onClick={() => setFilter(status)} aria-pressed={filter === status} className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[.12em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${filter === status ? 'border-rose-300 bg-rose-400/15 text-white' : 'border-white/10 text-white/50'}`}>{status === 'all' ? t.all : t.statuses[status]} · {counts[status] || 0}</button>)}</nav>

    {error ? <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200" role="alert">{error}</p> : null}
    {message ? <p className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-100" role="status" aria-live="polite">{message}</p> : null}
    {loading ? <p className="rounded-2xl border border-white/10 p-6 text-white/55" role="status" aria-live="polite">{t.loading}</p> : null}
    {!loading && visibleReports.length === 0 ? <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/45" role="status">{t.empty}</p> : null}

    <div className="grid gap-4" aria-label={t.queueLabel}>{visibleReports.map((report) => <article key={report.id} className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-rose-300/30 bg-rose-400/10 px-3 py-1 font-mono text-[10px] font-black uppercase text-rose-200">{categoryLabel(report.category)}</span><time dateTime={report.created_at} className="font-mono text-[10px] uppercase tracking-[.12em] text-white/35">{new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(report.created_at))}</time><b className="font-mono text-[10px] uppercase text-cyan-200">{t.statuses[report.status]}</b></div><h2 className="mt-4 text-lg font-black">{t.subject}: {identityLabel(report.subject_user_id)}</h2><p className="mt-1 text-xs text-white/40">{t.reporter}: {identityLabel(report.reporter_id)}{report.room_id ? ` · ${t.room}: ${report.room_id}` : ''}</p><blockquote className="mt-4 border-l-2 border-rose-400/50 bg-rose-500/[.04] px-4 py-3 text-sm leading-6 text-white/75">{report.detail}</blockquote>{report.evidence_snapshot ? <div className="mt-3 rounded-xl border border-amber-300/20 bg-amber-300/[.05] p-3"><small className="font-mono text-[9px] font-black uppercase tracking-[.12em] text-amber-200">{t.evidence}</small><p className="mt-2 whitespace-pre-wrap break-words text-sm text-white/80">{report.evidence_snapshot}</p></div> : null}<p className="mt-3 font-mono text-[10px] text-white/25">ID {report.id}{report.direct_message_id ? ` · DM ${report.direct_message_id}` : ''}</p></div><div className="flex flex-wrap gap-2 xl:max-w-64 xl:justify-end">{(['reviewing', 'resolved', 'dismissed'] as ReportStatus[]).map((status) => <button key={status} type="button" onClick={() => void updateStatus(report, status)} disabled={busyId === report.id || report.status === status} className="min-h-10 rounded-xl border border-white/15 px-3 text-[10px] font-black uppercase tracking-[.1em] text-white/70 transition hover:border-rose-300 disabled:opacity-30">{statusActionLabel(status)}</button>)}</div></article>)}</div>
  </section>
}
