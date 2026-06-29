import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'

type CmsNewsArticle = {
  id: string
  slug: string
  title: string
  summary: string | null
  category: string
  status: 'draft' | 'review' | 'published' | 'archived'
  review_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  published_at: string | null
}

const statusLabels: Record<CmsNewsArticle['status'], string> = {
  draft: 'Borrador',
  review: 'En revisión',
  published: 'Publicada',
  archived: 'Archivada',
}

function formatDate(value: string | null) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export default function CmsNewsList() {
  const [articles, setArticles] = useState<CmsNewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadArticles() {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('news_articles')
        .select('id, slug, title, summary, category, status, review_status, created_at, published_at')
        .order('created_at', { ascending: false })
        .limit(50)

      if (!active) return

      if (queryError) {
        setError(queryError.message)
        setArticles([])
      } else {
        setArticles((data ?? []) as CmsNewsArticle[])
      }

      setLoading(false)
    }

    void loadArticles()

    return () => {
      active = false
    }
  }, [])

  const stats = useMemo(() => ({
    total: articles.length,
    draft: articles.filter((article) => article.status === 'draft').length,
    review: articles.filter((article) => article.status === 'review').length,
    published: articles.filter((article) => article.status === 'published').length,
  }), [articles])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Noticias</p>
          <h2 className="mt-3 text-3xl font-black">Listado editorial real</h2>
          <p className="mt-2 text-sm text-purple-100">Lee borradores y publicaciones desde Supabase.</p>
        </div>
        <Link to="/cms/generate" className="rounded-full bg-orange px-5 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-black transition hover:shadow-glow-action">
          Nueva noticia
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Total</p><strong className="mt-2 block text-3xl">{stats.total}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Borradores</p><strong className="mt-2 block text-3xl">{stats.draft}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Revisión</p><strong className="mt-2 block text-3xl">{stats.review}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Publicadas</p><strong className="mt-2 block text-3xl">{stats.published}</strong></article>
      </div>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100">Cargando noticias...</p> : null}
      {error ? <p className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">No se pudo cargar news_articles: {error}</p> : null}

      {!loading && !error && articles.length === 0 ? (
        <article className="rounded-3xl border border-orange-400/20 bg-orange-500/10 p-6 text-orange-50">
          <h3 className="text-xl font-black">Todavía no hay borradores</h3>
          <p className="mt-2 text-sm text-orange-50/80">Creá la primera noticia desde el generador editorial.</p>
        </article>
      ) : null}

      <div className="space-y-4">
        {articles.map((article) => (
          <article key={article.id} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">{article.category} · {statusLabels[article.status]}</p>
                <h3 className="mt-2 text-2xl font-black text-white">{article.title}</h3>
                {article.summary ? <p className="mt-2 max-w-3xl text-sm leading-6 text-purple-100">{article.summary}</p> : null}
              </div>
              <div className="flex shrink-0 flex-col gap-2 text-xs text-purple-100 md:text-right">
                <span>Review: {article.review_status}</span>
                <span>Creada: {formatDate(article.created_at)}</span>
                <Link to={`/cms/news/${article.id}`} className="rounded-full border border-purple-400/40 px-4 py-2 text-center font-black uppercase tracking-[0.16em] text-purple-100 transition hover:bg-purple-500/10">
                  Editar
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
