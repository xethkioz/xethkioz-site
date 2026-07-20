import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useLang } from '../../lib/LangContext'
import { supabase } from '../../services/supabaseClient'
import type { WebQuoteRequest, WebQuoteStatus } from '../../types/webServices'
import { useAdminSession } from '../hooks'

const statusOptions: WebQuoteStatus[] = ['new', 'contacted', 'quoted', 'won', 'lost', 'spam', 'archived']
const quoteFields = ['id', 'service_id', 'service_slug', 'name', 'email', 'whatsapp', 'business_name', 'project_type', 'budget_range', 'contact_preference', 'details', 'status', 'source', 'internal_notes', 'created_at', 'updated_at'].join(', ')

const copy = {
  es: {
    eyebrow: 'CREACIÓN WEB · CONSULTAS', title: 'Bandeja de presupuestos', description: 'Solicitudes privadas recibidas desde el formulario público. La información de contacto nunca se expone en el frontend.',
    currentRole: 'Rol actual', management: 'Gestión', enabled: 'habilitada', readOnly: 'solo lectura', stats: { total: 'Total', new: 'Nuevas', active: 'En proceso', won: 'Ganadas' },
    statuses: { new: 'Nueva', contacted: 'Contactada', quoted: 'Presupuestada', won: 'Ganada', lost: 'Perdida', spam: 'Spam', archived: 'Archivada' } as Record<WebQuoteStatus, string>,
    search: 'Buscar', searchPlaceholder: 'Nombre, email, marca, servicio…', status: 'Estado', all: 'Todas', loading: 'Cargando solicitudes…', empty: 'No hay solicitudes para este filtro.',
    request: 'Solicitud', noBrand: 'Sin marca informada', email: 'Email', whatsapp: 'WhatsApp', notProvided: 'No informado', typeOffer: 'Tipo / propuesta', investmentContact: 'Inversión / contacto', noSelection: 'sin selección', projectNeed: 'Necesidad del proyecto', internalNotes: 'Notas internas', notesPlaceholder: 'Seguimiento, alcance conversado, monto enviado…',
    saving: 'Guardando…', save: 'Guardar seguimiento', adminOnly: 'Solo ADMIN puede actualizar solicitudes.', updated: 'Solicitud actualizada correctamente.', listLabel: 'Lista privada de solicitudes de presupuesto', detailLabel: 'Detalle privado de solicitud', results: 'resultados', source: 'Origen', updatedAt: 'Actualizada', privateNote: 'Datos privados: usalos únicamente para responder la consulta comercial.',
  },
  en: {
    eyebrow: 'WEB CREATION · INQUIRIES', title: 'Quote inbox', description: 'Private requests received from the public form. Contact information is never exposed on the public frontend.',
    currentRole: 'Current role', management: 'Management', enabled: 'enabled', readOnly: 'read only', stats: { total: 'Total', new: 'New', active: 'In progress', won: 'Won' },
    statuses: { new: 'New', contacted: 'Contacted', quoted: 'Quoted', won: 'Won', lost: 'Lost', spam: 'Spam', archived: 'Archived' } as Record<WebQuoteStatus, string>,
    search: 'Search', searchPlaceholder: 'Name, email, brand, service…', status: 'Status', all: 'All', loading: 'Loading requests…', empty: 'There are no requests for this filter.',
    request: 'Request', noBrand: 'No brand provided', email: 'Email', whatsapp: 'WhatsApp', notProvided: 'Not provided', typeOffer: 'Type / solution', investmentContact: 'Investment / contact', noSelection: 'no selection', projectNeed: 'Project need', internalNotes: 'Internal notes', notesPlaceholder: 'Follow-up, discussed scope, sent amount…',
    saving: 'Saving…', save: 'Save follow-up', adminOnly: 'Only ADMIN can update requests.', updated: 'Request updated successfully.', listLabel: 'Private quote request list', detailLabel: 'Private request details', results: 'results', source: 'Source', updatedAt: 'Updated', privateNote: 'Private data: use it only to answer the commercial inquiry.',
  },
} as const

function formatDate(value: string, lang: 'es' | 'en') {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}
function whatsappHref(value: string | null) { if (!value) return null; const digits = value.replace(/\D/g, ''); return digits.length >= 8 ? `https://wa.me/${digits}` : null }

export default function CmsWebQuotes() {
  const { lang } = useLang()
  const t = copy[lang]
  const { role, canManageWebServices } = useAdminSession()
  const [quotes, setQuotes] = useState<WebQuoteRequest[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | WebQuoteStatus>('all')
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState('')
  const [nextStatus, setNextStatus] = useState<WebQuoteStatus>('new')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadQuotes(preferredId?: string | null) {
    setLoading(true); setError(null)
    const { data, error: loadError } = await supabase.from('web_quote_requests').select(quoteFields).order('created_at', { ascending: false }).limit(300).overrideTypes<WebQuoteRequest[], { merge: false }>()
    if (loadError) { setQuotes([]); setError(loadError.message) }
    else {
      const nextQuotes = data ?? []; setQuotes(nextQuotes)
      const nextId = preferredId && nextQuotes.some((quote) => quote.id === preferredId) ? preferredId : selectedId && nextQuotes.some((quote) => quote.id === selectedId) ? selectedId : nextQuotes[0]?.id ?? null
      setSelectedId(nextId)
    }
    setLoading(false)
  }
  useEffect(() => { void loadQuotes() }, [])

  const selectedQuote = quotes.find((quote) => quote.id === selectedId) ?? null
  const selectedWhatsAppHref = whatsappHref(selectedQuote?.whatsapp ?? null)
  useEffect(() => { setNotes(selectedQuote?.internal_notes ?? ''); setNextStatus(selectedQuote?.status ?? 'new') }, [selectedQuote?.id, selectedQuote?.internal_notes, selectedQuote?.status])

  const stats = useMemo(() => ({ total: quotes.length, new: quotes.filter((quote) => quote.status === 'new').length, active: quotes.filter((quote) => ['contacted', 'quoted'].includes(quote.status)).length, won: quotes.filter((quote) => quote.status === 'won').length }), [quotes])
  const visibleQuotes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return quotes.filter((quote) => {
      if (filterStatus !== 'all' && quote.status !== filterStatus) return false
      if (!normalizedSearch) return true
      return [quote.name, quote.email, quote.business_name, quote.service_slug, quote.project_type].some((value) => value?.toLowerCase().includes(normalizedSearch))
    })
  }, [filterStatus, quotes, search])

  async function saveQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedQuote || !canManageWebServices) { setError(t.adminOnly); return }
    setSaving(true); setError(null); setMessage(null)
    const { error: updateError } = await supabase.from('web_quote_requests').update({ status: nextStatus, internal_notes: notes.trim() || null, updated_at: new Date().toISOString() }).eq('id', selectedQuote.id)
    if (updateError) setError(updateError.message)
    else { setMessage(t.updated); await loadQuotes(selectedQuote.id) }
    setSaving(false)
  }

  return <section className="space-y-6 text-white" aria-labelledby="cms-web-quotes-title" aria-busy={loading || saving}>
    <div className="rounded-3xl border border-purple-400/25 bg-black/40 p-6 shadow-2xl shadow-purple-950/20"><p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.eyebrow}</p><h2 id="cms-web-quotes-title" className="mt-3 text-3xl font-black md:text-4xl">{t.title}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">{t.description}</p><p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">{t.currentRole}: <strong>{role}</strong> · {t.management}: <strong>{canManageWebServices ? t.enabled : t.readOnly}</strong></p><p className="mt-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] p-4 text-xs text-cyan-100/75">{t.privateNote}</p></div>
    <div className="grid gap-4 md:grid-cols-4">{[[t.stats.total, stats.total], [t.stats.new, stats.new], [t.stats.active, stats.active], [t.stats.won, stats.won]].map(([label, value]) => <article key={String(label)} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></article>)}</div>
    {error ? <p role="alert" className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}{message ? <p role="status" aria-live="polite" className="rounded-3xl border border-orange-400/30 bg-orange-400/10 p-5 text-orange-100">{message}</p> : null}
    <div className="grid gap-4 rounded-3xl border border-white/10 bg-black/30 p-5 md:grid-cols-[1fr_auto]" role="search"><label className="grid gap-2 text-xs font-black uppercase tracking-[0.15em] text-purple-200">{t.search}<input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className="min-h-12 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none placeholder:text-white/25 focus:border-orange-300" /></label><label className="grid gap-2 text-xs font-black uppercase tracking-[0.15em] text-purple-200">{t.status}<select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as 'all' | WebQuoteStatus)} className="min-h-12 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none focus:border-orange-300"><option value="all">{t.all}</option>{statusOptions.map((status) => <option key={status} value={status}>{t.statuses[status]}</option>)}</select></label><p className="md:col-span-2 text-xs text-purple-200" role="status" aria-live="polite">{visibleQuotes.length} {t.results}</p></div>
    {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100" role="status" aria-live="polite">{t.loading}</p> : null}
    <div className="grid min-h-[520px] gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="space-y-3" aria-label={t.listLabel}>{visibleQuotes.map((quote) => <button key={quote.id} type="button" onClick={() => setSelectedId(quote.id)} aria-pressed={selectedId === quote.id} className={`w-full rounded-3xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${selectedId === quote.id ? 'border-orange-400/55 bg-orange-400/10 shadow-[0_0_24px_rgba(255,106,0,.12)]' : 'border-white/10 bg-white/[0.035] hover:border-purple-400/35 hover:bg-purple-500/[0.07]'}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-lg font-black text-white">{quote.name}</p><p className="mt-1 truncate text-xs text-purple-200">{quote.business_name || quote.email}</p></div><span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-orange-200">{t.statuses[quote.status]}</span></div><p className="mt-4 text-xs text-white/45">{quote.service_slug || quote.project_type} · <time dateTime={quote.created_at}>{formatDate(quote.created_at, lang)}</time></p></button>)}{!loading && visibleQuotes.length === 0 ? <p className="rounded-3xl border border-yellow-400/25 bg-yellow-400/10 p-5 text-sm text-yellow-100" role="status">{t.empty}</p> : null}</div>
      {selectedQuote ? <article className="h-fit rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.055] to-black/35 p-6 md:p-8" aria-label={t.detailLabel}><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">{t.request} · {t.statuses[selectedQuote.status]}</p><h3 className="mt-3 text-3xl font-black">{selectedQuote.name}</h3><p className="mt-2 text-sm text-purple-100">{selectedQuote.business_name || t.noBrand}</p></div><time dateTime={selectedQuote.created_at} className="text-xs text-white/45">{formatDate(selectedQuote.created_at, lang)}</time></div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-purple-200">{t.email}</p><a href={`mailto:${selectedQuote.email}`} className="mt-2 block break-all text-sm text-orange-200 underline">{selectedQuote.email}</a></div><div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-purple-200">{t.whatsapp}</p>{selectedWhatsAppHref ? <a href={selectedWhatsAppHref} target="_blank" rel="noreferrer noopener" className="mt-2 block text-sm text-orange-200 underline">{selectedQuote.whatsapp}</a> : <p className="mt-2 text-sm text-white/45">{selectedQuote.whatsapp || t.notProvided}</p>}</div><div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-purple-200">{t.typeOffer}</p><p className="mt-2 text-sm text-white/75">{selectedQuote.project_type} · {selectedQuote.service_slug || t.noSelection}</p></div><div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-purple-200">{t.investmentContact}</p><p className="mt-2 text-sm text-white/75">{selectedQuote.budget_range} · {selectedQuote.contact_preference}</p></div></div>
        <div className="mt-5 rounded-2xl border border-purple-400/20 bg-purple-500/[0.07] p-5"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-purple-200">{t.projectNeed}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">{selectedQuote.details}</p></div><p className="mt-3 text-[10px] text-white/35">{t.source}: {selectedQuote.source} · {t.updatedAt}: <time dateTime={selectedQuote.updated_at}>{formatDate(selectedQuote.updated_at, lang)}</time></p>
        <form onSubmit={saveQuote} className="mt-6 border-t border-white/10 pt-6"><fieldset disabled={!canManageWebServices || saving} className="grid gap-5 disabled:opacity-55"><label className="grid gap-2 text-xs font-black uppercase tracking-[0.15em] text-purple-200">{t.status}<select value={nextStatus} onChange={(e) => setNextStatus(e.target.value as WebQuoteStatus)} className="min-h-12 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none focus:border-orange-300">{statusOptions.map((status) => <option key={status} value={status}>{t.statuses[status]}</option>)}</select></label><label className="grid gap-2 text-xs font-black uppercase tracking-[0.15em] text-purple-200">{t.internalNotes}<textarea rows={6} maxLength={3000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.notesPlaceholder} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-medium leading-6 normal-case tracking-normal text-white outline-none placeholder:text-white/25 focus:border-orange-300" /></label></fieldset><button disabled={!canManageWebServices || saving} type="submit" className="mt-5 rounded-full bg-orange px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:shadow-glow-action disabled:opacity-40">{saving ? t.saving : t.save}</button></form>
      </article> : null}
    </div>
  </section>
}
