import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'
import { useAdminSession } from '../hooks'
import SEO from '../../components/SEO'

type Project = {
  id: string; author_name: string; title: string; summary: string
  external_url: string; category: string; license: string
  status: string; created_at: string; rejection_reason?: string | null
}
type Report = {
  id: string; project_id: string; reason: string; created_at: string
}
type QueueResponse = { ok?: boolean; error?: string; queue?: Project[]; reports?: Report[]; reportedProjects?: Project[] }

async function moderationAction(body: Record<string, unknown>): Promise<QueueResponse> {
  const { data, error } = await supabase.functions.invoke('creator-moderation', { body })
  if (error) throw new Error('No se pudo conectar con moderación. Revisá la función Edge y los permisos.')
  const response = data as QueueResponse
  if (!response?.ok) throw new Error(response?.error || 'Moderación temporalmente no disponible.')
  return response
}

export default function CreatorModeration() {
  const { canModerate, loading: checking } = useAdminSession()
  const [queue, setQueue] = useState<Project[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [reportedProjects, setReportedProjects] = useState<Project[]>([])
  const [busy, setBusy] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({})
  const [reason, setReason] = useState<Record<string, string>>({})

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await moderationAction({ action: 'list' })
      setQueue(result.queue || [])
      setReports(result.reports || [])
      setReportedProjects(result.reportedProjects || [])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error de moderación.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!canModerate) {
      if (!checking) setLoading(false)
      return
    }
    void refresh()
  }, [canModerate, checking, refresh])

  async function decide(project: Project, decision: 'approve' | 'reject') {
    if (busy || !reviewed[project.id]) return
    if (decision === 'reject' && (reason[project.id] || '').trim().length < 10) {
      setError('Para rechazar, explicá el motivo con al menos 10 caracteres.')
      return
    }
    setBusy(project.id)
    setError('')
    setNotice('')
    try {
      await moderationAction({ action: 'review', projectId: project.id, decision, reason: (reason[project.id] || '').trim(), reviewed: true })
      setNotice(decision === 'approve' ? 'Proyecto aprobado y publicado.' : 'Proyecto devuelto para correcciones.')
      await refresh()
      setReviewed((old) => ({ ...old, [project.id]: false }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se guardó la decisión.')
    } finally {
      setBusy('')
    }
  }

  async function resolve(report: Report, decision: 'dismiss' | 'remove') {
    if (busy) return
    const note = (reason[report.id] || '').trim()
    if (note.length < 10) {
      setError('Escribí un motivo de al menos 10 caracteres para resolver el reporte.')
      return
    }
    if (decision === 'remove' && !reviewed[report.id]) {
      setError('Primero verificá la publicación y marcá la casilla de revisión.')
      return
    }
    setBusy(report.id)
    setError('')
    setNotice('')
    try {
      await moderationAction({ action: 'resolve_report', reportId: report.id, decision, reason: note, reviewed: Boolean(reviewed[report.id]) })
      setNotice(decision === 'remove' ? 'Proyecto despublicado y reporte cerrado.' : 'Reporte revisado y archivado.')
      await refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo resolver el reporte.')
    } finally {
      setBusy('')
    }
  }

  if (checking || loading && !canModerate) return <p role="status" className="p-8 text-purple-200">Validando acceso a moderación…</p>
  if (!canModerate) return <section role="alert" className="m-8 rounded-2xl border border-orange-500/50 bg-slate-950 p-8 text-white"><h1 className="text-2xl font-bold">Acceso restringido</h1><p>Solo cuentas con rol MODERATOR o ADMIN pueden revisar las creaciones.</p></section>

  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 text-white">
    <SEO title="Moderación de creadores · XETHKIOZ" url="/cms/creator-moderation" />
    <header>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">CREATOR NETWORK / CONTROL</p>
      <h1 className="mt-2 text-3xl font-black md:text-4xl">Revisión de creaciones</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Los enlaces llevan a archivos externos: revisá su dominio, permisos, derechos de uso y comportamiento antes de aprobar. XETHKIOZ no analiza automáticamente el contenido de cada nube.</p>
      <button type="button" onClick={() => void refresh()} disabled={loading || Boolean(busy)} className="mt-4 rounded-xl border border-violet-400/40 px-4 py-2 text-sm font-bold">Actualizar cola</button>
    </header>
    {error && <p role="alert" className="rounded-xl border border-red-500/50 bg-red-950/60 p-4 text-sm">{error}</p>}
    {notice && <p role="status" className="rounded-xl border border-emerald-500/50 bg-emerald-950/60 p-4 text-sm">{notice}</p>}
    <section>
      <h2 className="text-2xl font-bold">Pendientes de revisión ({queue.length})</h2>
      {loading ? <p role="status" className="mt-4">Cargando solicitudes…</p> : !queue.length ? <p className="mt-5 text-slate-300">No hay solicitudes pendientes.</p> : (
        <div className="mt-5 grid gap-5">{queue.map((project) => {
          let host = ''
          try { host = new URL(project.external_url).hostname } catch { host = 'Enlace no válido' }
          return <article key={project.id} className="rounded-2xl border border-violet-400/20 bg-slate-900/85 p-6">
            <div className="flex flex-wrap justify-between gap-4"><div><small className="text-violet-300">{project.category} · {project.author_name}</small><h3 className="mt-2 text-xl font-bold">{project.title}</h3></div><small>{new Date(project.created_at).toLocaleDateString('es-AR')}</small></div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">{project.summary}</p>
            <p className="mt-4 text-xs text-slate-400">Licencia declarada: {project.license}</p>
            <p className="mt-4 text-xs font-bold text-orange-300">Dominio externo: {host}</p>
            <a className="mt-2 inline-block break-all text-sm text-sky-300 underline" href={project.external_url} target="_blank" rel="noopener noreferrer nofollow">Inspeccionar archivo en la nube ↗</a>
            <label className="mt-6 flex items-start gap-3 text-xs leading-6 text-slate-200"><input type="checkbox" className="mt-1" checked={Boolean(reviewed[project.id])} onChange={(e) => setReviewed((old) => ({ ...old, [project.id]: e.target.checked }))} />Confirmo que revisé manualmente la ficha, el destino y los permisos. La aprobación no certifica que el archivo esté libre de malware.</label>
            <label className="mt-4 block text-xs font-bold">Motivo de rechazo o nota interna
              <textarea className="mt-2 block min-h-20 w-full rounded-xl border border-slate-600 bg-slate-950 p-3 text-sm" maxLength={500} value={reason[project.id] || ''} onChange={(e) => setReason((old) => ({ ...old, [project.id]: e.target.value }))} placeholder="Explicá al creador qué debe corregir…" />
            </label>
            <div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={!reviewed[project.id] || Boolean(busy)} onClick={() => void decide(project, 'approve')} className="rounded-xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white disabled:opacity-40">Aprobar y publicar</button><button type="button" disabled={!reviewed[project.id] || Boolean(busy)} onClick={() => void decide(project, 'reject')} className="rounded-xl bg-orange-800 px-4 py-3 text-xs font-bold text-white disabled:opacity-40">Solicitar correcciones</button></div>
          </article>
        })}</div>
      )}
    </section>
    <section>
      <h2 className="text-2xl font-bold">Denuncias pendientes ({reports.length})</h2>
      {!reports.length && <p className="mt-5 text-slate-300">No hay denuncias nuevas.</p>}
      <div className="mt-4 grid gap-4">{reports.map((report) => {
        const project = reportedProjects.find((p) => p.id === report.project_id)
        return <article key={report.id} className="rounded-2xl border border-red-400/25 bg-slate-900 p-5">
          <h3 className="text-lg font-bold">{project?.title || 'Publicación reportada'}</h3>
          <p className="mt-2 text-xs text-orange-300">Motivo: {report.reason}</p>
          <p className="mt-2 text-xs text-slate-300">{project?.status === 'published' ? 'Publicación actualmente visible.' : 'Publicación ya retirada o pendiente.'}</p>
          {project?.external_url && <a className="mt-3 inline-block break-all text-xs text-sky-300 underline" href={project.external_url} target="_blank" rel="noopener noreferrer nofollow">Revisar destino externo ↗</a>}
          <label className="mt-4 block text-sm">Resolución y motivo
            <textarea className="mt-2 block min-h-20 w-full rounded-lg border border-slate-600 bg-slate-950 p-3 text-sm" maxLength={500} value={reason[report.id] || ''} onChange={(e) => setReason((old) => ({ ...old, [report.id]: e.target.value }))} />
          </label>
          <label className="mt-3 flex items-start gap-2 text-xs"><input type="checkbox" className="mt-1" checked={Boolean(reviewed[report.id])} onChange={(e) => setReviewed((old) => ({ ...old, [report.id]: e.target.checked }))} /> Revisé la publicación y el enlace externo.</label>
          <div className="mt-4 flex flex-wrap gap-3"><button type="button" className="rounded-lg border border-emerald-400/60 px-4 py-2 text-sm" disabled={Boolean(busy)} onClick={() => void resolve(report, 'dismiss')}>Descartar reporte</button><button type="button" className="rounded-lg bg-red-800 px-4 py-2 text-sm" disabled={Boolean(busy) || !reviewed[report.id] || project?.status !== 'published'} onClick={() => void resolve(report, 'remove')}>Despublicar proyecto</button></div>
        </article>
      })}</div>
    </section>
    <Link className="text-sm text-violet-300 underline" to="/cms">Volver al CMS</Link>
  </main>
}
