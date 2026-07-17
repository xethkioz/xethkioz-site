import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminSession } from '../hooks'
import { supabase } from '../../services/supabaseClient'

type ReviewArticle = {
  id: string
  slug: string
  title: string
  summary: string | null
  category: string
  status: 'draft' | 'review' | 'published' | 'archived'
  review_status: 'pending' | 'approved' | 'rejected'
  editor_notes: string | null
  created_at: string
  published_at: string | null
  content: Array<{ type?: string; text?: string }>
  source_urls: string[]
}

function getDepth(article: ReviewArticle) {
  const words = article.content.reduce((total, block) => total + String(block.text ?? '').trim().split(/\s+/).filter(Boolean).length, 0)
  const headings = article.content.filter((block) => block.type === 'heading').length
  return { words, headings, ready: words >= 220 && headings >= 3 && article.source_urls.length > 0 }
}

function formatDate(value: string | null) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export default function CmsReviewQueue() {
  const { role, canPublish } = useAdminSession()
  const [articles, setArticles] = useState<ReviewArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [queueMode, setQueueMode] = useState<'review' | 'depth'>('depth')

  async function loadArticles() {
    setLoading(true)
    setError(null)

    const { data, error: queryError } = await supabase
      .from('news_articles')
      .select('id, slug, title, summary, category, status, review_status, editor_notes, created_at, published_at, content, source_urls')
      .order('created_at', { ascending: false })
      .limit(200)

    if (queryError) {
      setError(queryError.message)
      setArticles([])
    } else {
      setArticles((data ?? []) as ReviewArticle[])
    }

    setLoading(false)
  }

  useEffect(() => {
    void loadArticles()
  }, [])

  const visibleArticles = useMemo(() => articles.filter((article) => queueMode === 'depth' ? !getDepth(article).ready : article.status === 'review' || article.review_status === 'pending'), [articles, queueMode])
  const stats = useMemo(() => ({
    total: articles.length,
    pending: articles.filter((article) => article.review_status === 'pending').length,
    review: articles.filter((article) => article.status === 'review').length,
    rejected: articles.filter((article) => article.review_status === 'rejected').length,
    thin: articles.filter((article) => !getDepth(article).ready).length,
  }), [articles])

  async function updateArticle(article: ReviewArticle, next: Partial<Pick<ReviewArticle, 'status' | 'review_status' | 'published_at' | 'editor_notes'>>) {
    setSavingId(article.id)
    setError(null)
    setMessage(null)

    const { error: updateError } = await supabase
      .from('news_articles')
      .update(next)
      .eq('id', article.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setMessage('Revisión actualizada correctamente.')
      await loadArticles()
    }

    setSavingId(null)
  }

  async function approveAndPublish(article: ReviewArticle) {
    if (!canPublish) {
      setError('Solo ADMIN puede aprobar y publicar directamente.')
      return
    }

    await updateArticle(article, {
      status: 'published',
      review_status: 'approved',
      published_at: article.published_at ?? new Date().toISOString(),
    })
  }

  async function rejectArticle(article: ReviewArticle) {
    await updateArticle(article, {
      status: 'review',
      review_status: 'rejected',
      editor_notes: article.editor_notes ? `${article.editor_notes}\nRequiere ajustes.` : 'Requiere ajustes.',
    })
  }

  return (
    <section className="space-y-6 text-white">
      <div className="rounded-3xl border border-purple-500/20 bg-black/35 p-6 shadow-2xl shadow-purple-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">REVIEW QUEUE</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">Aprobación editorial</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
          Cola de revisión para noticias y publicaciones. ADMIN puede aprobar/publicar. Moderadores y editores pueden revisar, editar y rechazar para corrección, sin eliminar ni publicar directo.
        </p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">Rol actual: <strong>{role}</strong> · Publicar directo: <strong>{canPublish ? 'sí' : 'no'}</strong></p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setQueueMode('depth')} className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[.14em] ${queueMode === 'depth' ? 'border-orange-300 bg-orange-400/10 text-orange-100' : 'border-white/10 text-purple-200'}`}>Profundidad ({stats.thin})</button>
          <button type="button" onClick={() => setQueueMode('review')} className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[.14em] ${queueMode === 'review' ? 'border-yellow-300 bg-yellow-400/10 text-yellow-100' : 'border-white/10 text-purple-200'}`}>Revisión ({stats.review})</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Total</p><strong className="mt-2 block text-3xl">{stats.total}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Pendientes</p><strong className="mt-2 block text-3xl">{stats.pending}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">En revisión</p><strong className="mt-2 block text-3xl">{stats.review}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Rechazadas</p><strong className="mt-2 block text-3xl">{stats.rejected}</strong></article>
      </div>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100">Cargando cola de revisión...</p> : null}
      {error ? <p className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}
      {message ? <p className="rounded-3xl border border-green-500/30 bg-green-500/10 p-5 text-green-100">{message}</p> : null}

      {!loading && !error && visibleArticles.length === 0 ? (
        <article className="rounded-3xl border border-green-400/25 bg-green-400/10 p-6 text-green-50">
          <h3 className="text-xl font-black">No hay contenido pendiente</h3>
          <p className="mt-2 text-sm text-green-50/80">La cola está limpia.</p>
        </article>
      ) : null}

      <div className="space-y-4">
        {visibleArticles.map((article) => (
          <article key={article.id} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">{article.category} · {article.status} · {article.review_status}</p>
                <h3 className="mt-2 text-2xl font-black text-white">{article.title}</h3>
                {article.summary ? <p className="mt-2 max-w-4xl text-sm leading-6 text-purple-100">{article.summary}</p> : null}
                {article.editor_notes ? <p className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-purple-100">Notas: {article.editor_notes}</p> : null}
                <p className="mt-3 text-xs text-purple-200">Creada: {formatDate(article.created_at)}</p>
                <p className={`mt-3 font-mono text-[10px] font-black uppercase tracking-[.13em] ${getDepth(article).ready ? 'text-green-300' : 'text-orange-300'}`}>DEPTH // {getDepth(article).words}/220 palabras · {getDepth(article).headings}/3 capítulos · {article.source_urls.length} fuentes</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 xl:max-w-xs xl:justify-end">
                <Link to={`/cms/news/${article.id}`} className="rounded-full border border-purple-400/40 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.16em] text-purple-100 transition hover:bg-purple-500/10">Editar</Link>
                {canPublish ? <button disabled={savingId === article.id || !getDepth(article).ready} type="button" onClick={() => void approveAndPublish(article)} className="rounded-full border border-green-400/50 bg-green-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-green-100 transition hover:bg-green-400/20 disabled:opacity-40">Aprobar/Publicar</button> : null}
                <button disabled={savingId === article.id} type="button" onClick={() => void rejectArticle(article)} className="rounded-full border border-yellow-400/50 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-yellow-100 transition hover:bg-yellow-400/20 disabled:opacity-40">Marcar ajustes</button>
                {article.status === 'published' ? <Link to={`/news/${article.slug}`} className="rounded-full border border-orange-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-orange-100 transition hover:bg-orange-500/10">Ver pública</Link> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
