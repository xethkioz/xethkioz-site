import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'

type NewsStatus = 'draft' | 'review' | 'published' | 'archived'
type ReviewStatus = 'pending' | 'approved' | 'rejected'
type StatusFilter = 'all' | NewsStatus

type CmsNewsArticle = {
  id: string
  slug: string
  title: string
  summary: string | null
  category: string
  status: NewsStatus
  review_status: ReviewStatus
  created_at: string
  published_at: string | null
}

const statusLabels: Record<NewsStatus, string> = {
  draft: 'Borrador',
  review: 'En revisión',
  published: 'Publicada',
  archived: 'Archivada',
}

const PAGE_SIZE = 10

function formatDate(value: string | null) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

export default function CmsNewsList() {
  const [articles, setArticles] = useState<CmsNewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let active = true

    async function loadArticles() {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('news_articles')
        .select('id, slug, title, summary, category, status, review_status, created_at, published_at')
        .order('created_at', { ascending: false })
        .limit(100)

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

  useEffect(() => {
    setPage(1)
  }, [statusFilter, categoryFilter, searchTerm])

  const categories = useMemo(() => {
    const unique = Array.from(new Set(articles.map((article) => article.category).filter(Boolean)))
    return unique.sort((a, b) => a.localeCompare(b, 'es'))
  }, [articles])

  const stats = useMemo(() => ({
    total: articles.length,
    draft: articles.filter((article) => article.status === 'draft').length,
    review: articles.filter((article) => article.status === 'review').length,
    published: articles.filter((article) => article.status === 'published').length,
    archived: articles.filter((article) => article.status === 'archived').length,
  }), [articles])

  const filteredArticles = useMemo(() => {
    const query = normalizeText(searchTerm)

    return articles.filter((article) => {
      const matchesStatus = statusFilter === 'all' || article.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter
      const searchable = normalizeText(`${article.title} ${article.summary ?? ''} ${article.slug} ${article.category}`)
      const matchesSearch = !query || searchable.includes(query)

      return matchesStatus && matchesCategory && matchesSearch
    })
  }, [articles, categoryFilter, searchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visibleArticles = filteredArticles.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Noticias</p>
          <h2 className="mt-3 text-3xl font-black">Listado editorial real</h2>
          <p className="mt-2 text-sm text-purple-100">Lee borradores y publicaciones desde Supabase. Las publicadas aparecen en /news.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/news" className="rounded-full border border-purple-400/40 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-purple-100 transition hover:bg-purple-500/10">
            Ver feed público
          </Link>
          <Link to="/cms/generate" className="rounded-full bg-orange px-5 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-black transition hover:shadow-glow-action">
            Nueva noticia
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Total</p><strong className="mt-2 block text-3xl">{stats.total}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Borradores</p><strong className="mt-2 block text-3xl">{stats.draft}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Revisión</p><strong className="mt-2 block text-3xl">{stats.review}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Publicadas</p><strong className="mt-2 block text-3xl">{stats.published}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Archivadas</p><strong className="mt-2 block text-3xl">{stats.archived}</strong></article>
      </div>

      <div className="grid gap-3 rounded-3xl border border-purple-500/20 bg-black/30 p-4 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-200">
          Buscar
          <input
            className="rounded-2xl border border-purple-500/25 bg-slate-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange-400"
            placeholder="Título, resumen, slug o categoría"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-200">
          Estado
          <select
            className="rounded-2xl border border-purple-500/25 bg-slate-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange-400"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            <option value="all">Todos</option>
            <option value="draft">Borradores</option>
            <option value="review">En revisión</option>
            <option value="published">Publicadas</option>
            <option value="archived">Archivadas</option>
          </select>
        </label>

        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-200">
          Categoría
          <select
            className="rounded-2xl border border-purple-500/25 bg-slate-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange-400"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">Todas</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
      </div>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100">Cargando noticias...</p> : null}
      {error ? <p className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">No se pudo cargar news_articles: {error}</p> : null}

      {!loading && !error && articles.length === 0 ? (
        <article className="rounded-3xl border border-orange-400/20 bg-orange-500/10 p-6 text-orange-50">
          <h3 className="text-xl font-black">Todavía no hay borradores</h3>
          <p className="mt-2 text-sm text-orange-50/80">Creá la primera noticia desde el generador editorial.</p>
        </article>
      ) : null}

      {!loading && !error && articles.length > 0 && filteredArticles.length === 0 ? (
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-6 text-purple-100">
          <h3 className="text-xl font-black text-white">Sin resultados para esos filtros</h3>
          <p className="mt-2 text-sm">Probá limpiar búsqueda, estado o categoría.</p>
        </article>
      ) : null}

      <div className="space-y-4">
        {visibleArticles.map((article) => (
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
                {article.published_at ? <span>Publicada: {formatDate(article.published_at)}</span> : null}
                <Link to={`/cms/news/${article.id}`} className="rounded-full border border-purple-400/40 px-4 py-2 text-center font-black uppercase tracking-[0.16em] text-purple-100 transition hover:bg-purple-500/10">
                  Editar
                </Link>
                {article.status === 'published' ? (
                  <Link to={`/news/${article.slug}`} className="rounded-full border border-orange-400/40 px-4 py-2 text-center font-black uppercase tracking-[0.16em] text-orange-100 transition hover:bg-orange-500/10">
                    Ver pública
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && !error && filteredArticles.length > PAGE_SIZE ? (
        <nav className="flex flex-col gap-3 rounded-3xl border border-purple-500/20 bg-black/30 p-4 text-sm text-purple-100 md:flex-row md:items-center md:justify-between" aria-label="Paginación de noticias CMS">
          <span>
            Mostrando {visibleArticles.length} de {filteredArticles.length} resultados · Página {safePage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              className="rounded-full border border-purple-400/40 px-4 py-2 font-bold transition disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-purple-500/10"
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Anterior
            </button>
            <button
              className="rounded-full border border-orange-400/40 px-4 py-2 font-bold text-orange-100 transition disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-orange-500/10"
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Siguiente
            </button>
          </div>
        </nav>
      ) : null}
    </section>
  )
}
