import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
import { supabase } from '../../services/supabaseClient'
import { useAdminSession } from '../hooks'

type ScheduleArticle = {
  id: string
  slug: string
  title: string
  summary: string | null
  category: string
  status: 'draft' | 'review' | 'published' | 'archived'
  review_status: 'pending' | 'approved' | 'rejected'
  published_at: string | null
  scheduled_at: string | null
  content: Array<{ type?: string; text?: string }>
  source_urls: string[]
}

type ScheduleDrafts = Record<string, string>

const copy = {
  es: {
    eyebrow: 'PROGRAMACIÓN EDITORIAL',
    title: 'Publicaciones futuras sin filtraciones',
    description: 'Prepará una fecha futura para artículos aprobados. La base de datos, la web pública, RSS y sitemap mantienen la noticia oculta hasta que llegue published_at.',
    role: 'Rol actual',
    adminRequired: 'Solo ADMIN puede programar o cancelar publicaciones.',
    loading: 'Cargando artículos programables…',
    loadError: 'No se pudo cargar la cola de programación.',
    emptyTitle: 'No hay artículos para programar',
    emptyText: 'Aprobá un artículo en la cola de revisión o editá uno que todavía no esté publicado.',
    scheduled: 'PROGRAMADA',
    ready: 'LISTA',
    blocked: 'BLOQUEADA',
    review: 'revisión',
    words: 'palabras',
    chapters: 'capítulos',
    sources: 'fuentes',
    date: 'Fecha y hora local',
    dateHint: 'La fecha se guarda en UTC. Debe estar al menos un minuto en el futuro.',
    schedule: 'Programar publicación',
    cancel: 'Cancelar programación',
    edit: 'Abrir editor',
    currentDate: 'Salida prevista',
    noDate: 'Sin fecha',
    scheduledMessage: 'Publicación programada. Permanecerá oculta hasta la fecha indicada.',
    cancelledMessage: 'Programación cancelada. El artículo volvió a revisión.',
    invalidDate: 'Elegí una fecha válida al menos un minuto en el futuro.',
    qualityBlocked: 'El artículo necesita aprobación, 220 palabras, 3 capítulos y al menos una fuente antes de programarse.',
    saveError: 'No se pudo actualizar la programación.',
    queueLabel: 'Cola de programación editorial',
    publishedProtection: 'Barrera pública activa',
    protectionText: 'RLS exige status = published y published_at <= now(). RSS y sitemap aplican la misma fecha.',
  },
  en: {
    eyebrow: 'EDITORIAL SCHEDULING',
    title: 'Future publications without leaks',
    description: 'Prepare a future date for approved articles. The database, public website, RSS and sitemap keep the article hidden until published_at arrives.',
    role: 'Current role',
    adminRequired: 'Only ADMIN can schedule or cancel publications.',
    loading: 'Loading schedulable articles…',
    loadError: 'Could not load the scheduling queue.',
    emptyTitle: 'No articles to schedule',
    emptyText: 'Approve an article in the review queue or edit one that has not been published yet.',
    scheduled: 'SCHEDULED',
    ready: 'READY',
    blocked: 'BLOCKED',
    review: 'review',
    words: 'words',
    chapters: 'chapters',
    sources: 'sources',
    date: 'Local date and time',
    dateHint: 'The date is stored in UTC. It must be at least one minute in the future.',
    schedule: 'Schedule publication',
    cancel: 'Cancel schedule',
    edit: 'Open editor',
    currentDate: 'Planned release',
    noDate: 'No date',
    scheduledMessage: 'Publication scheduled. It will remain hidden until the selected date.',
    cancelledMessage: 'Schedule cancelled. The article returned to review.',
    invalidDate: 'Choose a valid date at least one minute in the future.',
    qualityBlocked: 'The article needs approval, 220 words, 3 chapters and at least one source before scheduling.',
    saveError: 'Could not update the schedule.',
    queueLabel: 'Editorial scheduling queue',
    publishedProtection: 'Public barrier active',
    protectionText: 'RLS requires status = published and published_at <= now(). RSS and sitemap apply the same date.',
  },
} as const

function getDepth(article: ScheduleArticle) {
  const words = article.content.reduce((total, block) => total + String(block.text ?? '').trim().split(/\s+/).filter(Boolean).length, 0)
  const headings = article.content.filter((block) => block.type === 'heading').length
  const sources = article.source_urls.length
  return { words, headings, sources, ready: words >= 220 && headings >= 3 && sources > 0 && article.review_status === 'approved' }
}

function toLocalInput(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function formatDate(value: string | null, lang: 'es' | 'en', fallback: string) {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export default function CmsSchedule() {
  const { role, canPublish } = useAdminSession()
  const { lang } = useLang()
  const t = copy[lang]
  const [articles, setArticles] = useState<ScheduleArticle[]>([])
  const [drafts, setDrafts] = useState<ScheduleDrafts>({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadArticles() {
    setLoading(true)
    setError(null)

    const { data, error: queryError } = await supabase
      .from('news_articles')
      .select('id, slug, title, summary, category, status, review_status, published_at, scheduled_at, content, source_urls')
      .in('status', ['review', 'published'])
      .order('scheduled_at', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(150)

    if (queryError) {
      setArticles([])
      setError(`${t.loadError} ${queryError.message}`)
    } else {
      const now = Date.now()
      const rows = ((data ?? []) as ScheduleArticle[]).filter((article) => article.status === 'review' || (article.status === 'published' && article.published_at && new Date(article.published_at).getTime() > now))
      setArticles(rows)
      setDrafts(Object.fromEntries(rows.map((article) => [article.id, toLocalInput(article.scheduled_at ?? article.published_at)])))
    }

    setLoading(false)
  }

  useEffect(() => {
    void loadArticles()
  }, [lang])

  const counts = useMemo(() => ({
    scheduled: articles.filter((article) => article.status === 'published' && article.published_at && new Date(article.published_at).getTime() > Date.now()).length,
    ready: articles.filter((article) => article.status === 'review' && getDepth(article).ready).length,
    blocked: articles.filter((article) => article.status === 'review' && !getDepth(article).ready).length,
  }), [articles])

  async function scheduleArticle(article: ScheduleArticle) {
    if (!canPublish) {
      setError(t.adminRequired)
      return
    }
    const depth = getDepth(article)
    if (!depth.ready) {
      setError(t.qualityBlocked)
      return
    }
    const localValue = drafts[article.id]
    const date = new Date(localValue)
    if (!localValue || Number.isNaN(date.getTime()) || date.getTime() < Date.now() + 60_000) {
      setError(t.invalidDate)
      return
    }

    setSavingId(article.id)
    setError(null)
    setMessage(null)
    const iso = date.toISOString()
    const { error: updateError } = await supabase
      .from('news_articles')
      .update({ status: 'published', review_status: 'approved', scheduled_at: iso, published_at: iso })
      .eq('id', article.id)

    if (updateError) setError(`${t.saveError} ${updateError.message}`)
    else {
      setMessage(t.scheduledMessage)
      await loadArticles()
    }
    setSavingId(null)
  }

  async function cancelSchedule(article: ScheduleArticle) {
    if (!canPublish) {
      setError(t.adminRequired)
      return
    }
    setSavingId(article.id)
    setError(null)
    setMessage(null)
    const { error: updateError } = await supabase
      .from('news_articles')
      .update({ status: 'review', scheduled_at: null, published_at: null })
      .eq('id', article.id)

    if (updateError) setError(`${t.saveError} ${updateError.message}`)
    else {
      setMessage(t.cancelledMessage)
      await loadArticles()
    }
    setSavingId(null)
  }

  return (
    <section className="space-y-6 text-white" aria-labelledby="cms-schedule-title" aria-busy={loading}>
      <div className="rounded-3xl border border-orange-400/25 bg-black/40 p-6 shadow-2xl shadow-orange-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.eyebrow}</p>
        <h2 id="cms-schedule-title" className="mt-3 text-3xl font-black md:text-4xl">{t.title}</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-purple-100">{t.description}</p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">{t.role}: <strong>{role}</strong> · {canPublish ? t.publishedProtection : t.adminRequired}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.05] p-5"><p className="text-xs uppercase tracking-[0.2em] text-cyan-100">{t.scheduled}</p><strong className="mt-2 block text-3xl">{counts.scheduled}</strong></article>
        <article className="rounded-3xl border border-green-400/20 bg-green-400/[0.05] p-5"><p className="text-xs uppercase tracking-[0.2em] text-green-100">{t.ready}</p><strong className="mt-2 block text-3xl">{counts.ready}</strong></article>
        <article className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.05] p-5"><p className="text-xs uppercase tracking-[0.2em] text-yellow-100">{t.blocked}</p><strong className="mt-2 block text-3xl">{counts.blocked}</strong></article>
      </div>

      <aside className="rounded-3xl border border-green-400/25 bg-green-400/[0.06] p-5" aria-labelledby="schedule-protection-title">
        <h3 id="schedule-protection-title" className="font-black text-green-100">{t.publishedProtection}</h3>
        <p className="mt-2 text-sm leading-6 text-green-50/75">{t.protectionText}</p>
      </aside>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100" role="status" aria-live="polite">{t.loading}</p> : null}
      {error ? <p className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200" role="alert">{error}</p> : null}
      {message ? <p className="rounded-3xl border border-green-500/30 bg-green-500/10 p-5 text-green-100" role="status" aria-live="polite">{message}</p> : null}

      {!loading && !error && articles.length === 0 ? <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-6" role="status"><h3 className="text-xl font-black">{t.emptyTitle}</h3><p className="mt-2 text-sm text-purple-100">{t.emptyText}</p></article> : null}

      <div className="space-y-4" aria-label={t.queueLabel}>
        {articles.map((article) => {
          const depth = getDepth(article)
          const isScheduled = article.status === 'published' && Boolean(article.published_at) && new Date(article.published_at as string).getTime() > Date.now()
          return (
            <article key={article.id} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                <div>
                  <p className={`text-xs font-black uppercase tracking-[0.2em] ${isScheduled ? 'text-cyan-200' : depth.ready ? 'text-green-200' : 'text-yellow-200'}`}>{article.category} · {isScheduled ? t.scheduled : depth.ready ? t.ready : t.blocked}</p>
                  <h3 className="mt-2 text-2xl font-black">{article.title}</h3>
                  {article.summary ? <p className="mt-2 max-w-3xl text-sm leading-6 text-purple-100">{article.summary}</p> : null}
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-purple-200">{depth.words}/220 {t.words} · {depth.headings}/3 {t.chapters} · {depth.sources} {t.sources} · {t.review}: {article.review_status}</p>
                  {isScheduled ? <p className="mt-3 text-sm text-cyan-100">{t.currentDate}: <time dateTime={article.published_at as string}>{formatDate(article.published_at, lang, t.noDate)}</time></p> : null}
                  <Link to={`/cms/news/${article.id}`} className="mt-5 inline-flex rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100 transition hover:bg-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300">{t.edit}</Link>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-200">
                    {t.date}
                    <input type="datetime-local" value={drafts[article.id] ?? ''} onChange={(event) => setDrafts((current) => ({ ...current, [article.id]: event.target.value }))} disabled={!canPublish || isScheduled} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300 disabled:opacity-50" />
                    <span className="normal-case tracking-normal text-purple-200/60">{t.dateHint}</span>
                  </label>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {isScheduled ? <button type="button" disabled={!canPublish || savingId === article.id} onClick={() => void cancelSchedule(article)} className="rounded-full border border-red-400/45 bg-red-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-100 transition hover:bg-red-400/20 disabled:opacity-40">{t.cancel}</button> : <button type="button" disabled={!canPublish || savingId === article.id || !depth.ready} onClick={() => void scheduleArticle(article)} className="rounded-full border border-green-400/45 bg-green-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-green-100 transition hover:bg-green-400/20 disabled:opacity-40">{t.schedule}</button>}
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
