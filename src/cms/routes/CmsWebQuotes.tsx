import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { supabase } from '../../services/supabaseClient'
import type { WebQuoteRequest, WebQuoteStatus } from '../../types/webServices'
import { useAdminSession } from '../hooks'

const statusOptions: WebQuoteStatus[] = ['new', 'contacted', 'quoted', 'won', 'lost', 'spam', 'archived']
const quoteFields = [
  'id', 'service_id', 'service_slug', 'name', 'email', 'whatsapp', 'business_name', 'project_type',
  'budget_range', 'contact_preference', 'details', 'status', 'source', 'internal_notes', 'created_at', 'updated_at',
].join(', ')

const statusLabels: Record<WebQuoteStatus, string> = {
  new: 'Nueva',
  contacted: 'Contactada',
  quoted: 'Presupuestada',
  won: 'Ganada',
  lost: 'Perdida',
  spam: 'Spam',
  archived: 'Archivada',
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function whatsappHref(value: string | null) {
  if (!value) return null
  const digits = value.replace(/\D/g, '')
  return digits.length >= 8 ? `https://wa.me/${digits}` : null
}

export default function CmsWebQuotes() {
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
    setLoading(true)
    setError(null)

    const { data, error: loadError } = await supabase
      .from('web_quote_requests')
      .select(quoteFields)
      .order('created_at', { ascending: false })
      .limit(300)
      .overrideTypes<WebQuoteRequest[], { merge: false }>()

    if (loadError) {
      setQuotes([])
      setError(loadError.message)
    } else {
      const nextQuotes = data ?? []
      setQuotes(nextQuotes)
      const nextId = preferredId && nextQuotes.some((quote) => quote.id === preferredId)
        ? preferredId
        : selectedId && nextQuotes.some((quote) => quote.id === selectedId)
          ? selectedId
          : nextQuotes[0]?.id ?? null
      setSelectedId(nextId)
    }

    setLoading(false)
  }

  useEffect(() => {
    void loadQuotes()
  }, [])

  const selectedQuote = quotes.find((quote) => quote.id === selectedId) ?? null
  const selectedWhatsAppHref = whatsappHref(selectedQuote?.whatsapp ?? null)

  useEffect(() => {
    setNotes(selectedQuote?.internal_notes ?? '')
    setNextStatus(selectedQuote?.status ?? 'new')
  }, [selectedQuote?.id, selectedQuote?.internal_notes, selectedQuote?.status])

  const stats = useMemo(() => ({
    total: quotes.length,
    new: quotes.filter((quote) => quote.status === 'new').length,
    active: quotes.filter((quote) => ['contacted', 'quoted'].includes(quote.status)).length,
    won: quotes.filter((quote) => quote.status === 'won').length,
  }), [quotes])

  const visibleQuotes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return quotes.filter((quote) => {
      if (filterStatus !== 'all' && quote.status !== filterStatus) return false
      if (!normalizedSearch) return true
      return [quote.name, quote.email, quote.business_name, quote.service_slug, quote.project_type]
        .some((value) => value?.toLowerCase().includes(normalizedSearch))
    })
  }, [filterStatus, quotes, search])

  async function saveQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedQuote || !canManageWebServices) {
      setError('Solo ADMIN puede actualizar solicitudes.')
      return
    }

    setSaving(true)
    setError(null)
    setMessage(null)

    const { error: updateError } = await supabase
      .from('web_quote_requests')
      .update({
        status: nextStatus,
        internal_notes: notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedQuote.id)

    if (updateError) setError(updateError.message)
    else {
      setMessage('Solicitud actualizada correctamente.')
      await loadQuotes(selectedQuote.id)
    }
    setSaving(false)
  }

  return (
    <section className="space-y-6 text-white">
      <div className="rounded-3xl border border-purple-400/25 bg-black/40 p-6 shadow-2xl shadow-purple-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">CREACIÓN WEB · CONSULTAS</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">Bandeja de presupuestos</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">Solicitudes privadas recibidas desde el formulario público. La información de contacto nunca se expone en el frontend.</p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">Rol actual: <strong>{role}</strong> · Gestión: <strong>{canManageWebServices ? 'habilitada' : 'solo lectura'}</strong></p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Total', stats.total],
          ['Nuevas', stats.new],
          ['En proceso', stats.active],
          ['Ganadas', stats.won],
        ].map(([label, value]) => <article key={String(label)} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></article>)}
      </div>

      {error ? <p role="alert" className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}
      {message ? <p role="status" className="rounded-3xl border border-orange-400/30 bg-orange-400/10 p-5 text-orange-100">{message}</p> : null}

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-black/30 p-5 md:grid-cols-[1fr_auto]">
        <label className="grid gap-2 text-xs font-black uppercase tracking-[0.15em] text-purple-200">Buscar<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, email, marca, servicio…" className="min-h-12 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none placeholder:text-white/25 focus:border-orange-300" /></label>
        <label className="grid gap-2 text-xs font-black uppercase tracking-[0.15em] text-purple-200">Estado<select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value as 'all' | WebQuoteStatus)} className="min-h-12 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none focus:border-orange-300"><option value="all">TODAS</option>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status].toUpperCase()}</option>)}</select></label>
      </div>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100">Cargando solicitudes…</p> : null}

      <div className="grid min-h-[520px] gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          {visibleQuotes.map((quote) => (
            <button key={quote.id} type="button" onClick={() => setSelectedId(quote.id)} className={`w-full rounded-3xl border p-5 text-left transition ${selectedId === quote.id ? 'border-orange-400/55 bg-orange-400/10 shadow-[0_0_24px_rgba(255,106,0,.12)]' : 'border-white/10 bg-white/[0.035] hover:border-purple-400/35 hover:bg-purple-500/[0.07]'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-black text-white">{quote.name}</p>
                  <p className="mt-1 truncate text-xs text-purple-200">{quote.business_name || quote.email}</p>
                </div>
                <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.14em] text-orange-200">{statusLabels[quote.status]}</span>
              </div>
              <p className="mt-4 text-xs text-white/45">{quote.service_slug || quote.project_type} · {formatDate(quote.created_at)}</p>
            </button>
          ))}
          {!loading && visibleQuotes.length === 0 ? <p className="rounded-3xl border border-yellow-400/25 bg-yellow-400/10 p-5 text-sm text-yellow-100">No hay solicitudes para este filtro.</p> : null}
        </div>

        {selectedQuote ? (
          <article className="h-fit rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.055] to-black/35 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-orange-300">Solicitud · {statusLabels[selectedQuote.status]}</p>
                <h3 className="mt-3 text-3xl font-black">{selectedQuote.name}</h3>
                <p className="mt-2 text-sm text-purple-100">{selectedQuote.business_name || 'Sin marca informada'}</p>
              </div>
              <p className="text-xs text-white/45">{formatDate(selectedQuote.created_at)}</p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-purple-200">Email</p><a href={`mailto:${selectedQuote.email}`} className="mt-2 block break-all text-sm text-orange-200 underline">{selectedQuote.email}</a></div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-purple-200">WhatsApp</p>{selectedWhatsAppHref ? <a href={selectedWhatsAppHref} target="_blank" rel="noreferrer" className="mt-2 block text-sm text-orange-200 underline">{selectedQuote.whatsapp}</a> : <p className="mt-2 text-sm text-white/45">{selectedQuote.whatsapp || 'No informado'}</p>}</div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-purple-200">Tipo / propuesta</p><p className="mt-2 text-sm text-white/75">{selectedQuote.project_type} · {selectedQuote.service_slug || 'sin selección'}</p></div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-purple-200">Inversión / contacto</p><p className="mt-2 text-sm text-white/75">{selectedQuote.budget_range} · {selectedQuote.contact_preference}</p></div>
            </div>

            <div className="mt-5 rounded-2xl border border-purple-400/20 bg-purple-500/[0.07] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-purple-200">Necesidad del proyecto</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">{selectedQuote.details}</p>
            </div>

            <form onSubmit={saveQuote} className="mt-6 border-t border-white/10 pt-6">
              <fieldset disabled={!canManageWebServices || saving} className="grid gap-5 disabled:opacity-55">
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.15em] text-purple-200">Estado<select value={nextStatus} onChange={(event) => setNextStatus(event.target.value as WebQuoteStatus)} className="min-h-12 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none focus:border-orange-300">{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status].toUpperCase()}</option>)}</select></label>
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.15em] text-purple-200">Notas internas<textarea rows={6} maxLength={3000} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Seguimiento, alcance conversado, monto enviado…" className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-medium leading-6 normal-case tracking-normal text-white outline-none placeholder:text-white/25 focus:border-orange-300" /></label>
              </fieldset>
              <button disabled={!canManageWebServices || saving} type="submit" className="mt-5 rounded-full bg-orange px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:shadow-glow-action disabled:opacity-40">{saving ? 'Guardando…' : 'Guardar seguimiento'}</button>
            </form>
          </article>
        ) : (
          <div className="grid min-h-[360px] place-items-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-purple-100/60">Seleccioná una solicitud para ver el detalle.</div>
        )}
      </div>
    </section>
  )
}
