import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
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

const PAGE_SIZE = 10

const copy = {
  es: {
    eyebrow: 'Noticias',
    title: 'Listado editorial real',
    description: 'Lee borradores, revisiones y publicaciones desde Supabase. Las publicadas aparecen en el feed público.',
    publicFeed: 'Ver feed público',
    create: 'Nueva noticia',
    stats: { total: 'Total', draft: 'Borradores', review: 'Revisión', published: 'Publicadas', archived: 'Archivadas' },
    search: 'Buscar',
    searchPlaceholder: 'Título, resumen, slug o categoría',
    status: 'Estado',
    category: 'Categoría',
    all: 'Todos',
    allCategories: 'Todas',
    statuses: { draft: 'Borrador', review: 'En revisión', published: 'Publicada', archived: 'Archivada' } as Record<NewsStatus, string>,
    reviewStatuses: { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada' } as Record<ReviewStatus, string>,
    categories: { gaming: 'Gaming', tech: 'Tecnología', science: 'Ciencia', ai: 'IA', community: 'Comunidad', green: 'Green Node', programming: 'Programación' } as Record<string, string>,
    loading: 'Cargando noticias…',
    loadError: 'No se pudo cargar news_articles',
    emptyTitle: 'Todavía no hay borradores',
    emptyText: 'Creá la primera noticia desde el generador editorial.',
    noResultsTitle: 'Sin resultados para esos filtros',
    noResultsText: 'Probá limpiar búsqueda, estado o categoría.',
    reviewLabel: 'Revisión',
    created: 'Creada',
    published: 'Publicada',
    edit: 'Editar',
    viewPublic: 'Ver pública',
    showing: 'Mostrando',
    of: 'de',
    results: 'resultados',
    page: 'Página',
    previous: 'Anterior',
    next: 'Siguiente',
    pagination: 'Paginación de noticias del CMS',
    listLabel: 'Listado de noticias del CMS',
  },
  en: {
    eyebrow: 'Articles',
    title: 'Live editorial list',
    description: 'Reads drafts, reviews and publications from Supabase. Published articles appear in the public feed.',
    publicFeed: 'View public feed',
    create: 'New article',
    stats: { total: 'Total', draft: 'Drafts', review: 'Review', published: 'Published', archived: 'Archived' },
    search: 'Search',
    searchPlaceholder: 'Title, summary, slug or category',
    status: 'Status',
    category: 'Category',
    all: 'All',
    allCategories: 'All',
    statuses: { draft: 'Draft', review: 'In review', published: 'Published', archived: 'Archived' } as Record<NewsStatus, string>,
    reviewStatuses: { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' } as Record<ReviewStatus, string>,
    categories: { gaming: 'Gaming', tech: 'Technology', science: 'Science', ai: 'AI', community: 'Community', green: 'Green Node', programming: 'Programming' } as Record<string, string>,
    loading: 'Loading articles…',
    loadError: 'Could not load news_articles',
    emptyTitle: 'No drafts yet',
    emptyText: 'Create the first article from the editorial generator.',
    noResultsTitle: 'No results for these filters',
    noResultsText: 'Try clearing the search, status or category.',
    reviewLabel: 'Review',
    created: 'Created',
    published: 'Published',
    edit: 'Edit',
    viewPublic: 'View public',
    showing: 'Showing',
    of: 'of',
    results: 'results',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    pagination: 'CMS article pagination',
    listLabel: 'CMS article list',
  },
} as const

function formatDate(value: string | null, lang: 'es' | 'en') {
  if (!value) return lang === 'es' ? 'Sin fecha' : 'No date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

export default function CmsNewsList() {
  const { lang } = useLang()
  const t = copy[lang]
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
    return () => { active = false }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, categoryFilter, searchTerm])

  const categories = useMemo(() => {
    const unique = Array.from(new Set(articles.map((article) => article.category).filter(Boolean)))
    return unique.sort((a, b) => a.localeCompare(b, lang === 'es' ? 'es' : 'en'))
  }, [articles, lang])

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
      return matchesStatus && matchesCategory && (!query || searchable.includes(query))
    })
  }, [articles, categoryFilter, searchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visibleArticles = filteredArticles.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const categoryLabel = (category: string) => t.categories[category] ?? category

  return (
    <section className="space-y-6" aria-labelledby="cms-news-list-title" aria-busy={loading}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.eyebrow}</p>
          <h2 id="cms-news-list-title" className="mt-3 text-3xl font-black">{t.title}</h2>
          <p className="mt-2 text-sm text-purple-100">{t.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/news" className="rounded-full border border-purple-400/40 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-purple-100 transition hover:bg-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300">{t.publicFeed}</Link>
          <Link to="/cms/generate" className="rounded-full bg-orange px-5 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-black transition hover:shadow-glow-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200">{t.create}</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {([
          [t.stats.total, stats.total], [t.stats.draft, stats.draft], [t.stats.review, stats.review], [t.stats.published, stats.published], [t.stats.archived, stats.archived],
        ] as const).map(([label, value]) => <article key={label} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></article>)}
      </div>

      <div className="grid gap-3 rounded-3xl border border-purple-500/20 bg-black/30 p-4 md:grid-cols-[1.2fr_.8fr_.8fr]" role="search">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-200">
          {t.search}
          <input className="rounded-2xl border border-purple-500/25 bg-slate-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange-400" placeholder={t.searchPlaceholder} type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-200">
          {t.status}
          <select className="rounded-2xl border border-purple-500/25 bg-slate-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange-400" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
            <option value="all">{t.all}</option>
            {(Object.keys(t.statuses) as NewsStatus[]).map((status) => <option key={status} value={status}>{t.statuses[status]}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-200">
          {t.category}
          <select className="rounded-2xl border border-purple-500/25 bg-slate-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange-400" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">{t.allCategories}</option>
            {categories.map((category) => <option key={category} value={category}>{categoryLabel(category)}</option>)}
          </select>
        </label>
      </div>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100" role="status" aria-live="polite">{t.loading}</p> : null}
      {error ? <p className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200" role="alert">{t.loadError}: {error}</p> : null}

      {!loading && !error && articles.length === 0 ? <article className="rounded-3xl border border-orange-400/20 bg-orange-500/10 p-6 text-orange-50" role="status"><h3 className="text-xl font-black">{t.emptyTitle}</h3><p className="mt-2 text-sm text-orange-50/80">{t.emptyText}</p></article> : null}
      {!loading && !error && articles.length > 0 && filteredArticles.length === 0 ? <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-6 text-purple-100" role="status"><h3 className="text-xl font-black text-white">{t.noResultsTitle}</h3><p className="mt-2 text-sm">{t.noResultsText}</p></article> : null}

      <div className="space-y-4" aria-label={t.listLabel}>
        {visibleArticles.map((article) => (
          <article key={article.id} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">{categoryLabel(article.category)} · {t.statuses[article.status]}</p>
                <h3 className="mt-2 text-2xl font-black text-white">{article.title}</h3>
                {article.summary ? <p className="mt-2 max-w-3xl text-sm leading-6 text-purple-100">{article.summary}</p> : null}
              </div>
              <div className="flex shrink-0 flex-col gap-2 text-xs text-purple-100 md:text-right">
                <span>{t.reviewLabel}: {t.reviewStatuses[article.review_status]}</span>
                <span>{t.created}: <time dateTime={article.created_at}>{formatDate(article.created_at, lang)}</time></span>
                {article.published_at ? <span>{t.published}: <time dateTime={article.published_at}>{formatDate(article.published_at, lang)}</time></span> : null}
                <Link to={`/cms/news/${article.id}`} className="rounded-full border border-purple-400/40 px-4 py-2 text-center font-black uppercase tracking-[0.16em] text-purple-100 transition hover:bg-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300">{t.edit}</Link>
                {article.status === 'published' ? <Link to={`/news/${article.slug}`} className="rounded-full border border-orange-400/40 px-4 py-2 text-center font-black uppercase tracking-[0.16em] text-orange-100 transition hover:bg-orange-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">{t.viewPublic}</Link> : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && !error && filteredArticles.length > PAGE_SIZE ? (
        <nav className="flex flex-col gap-3 rounded-3xl border border-purple-500/20 bg-black/30 p-4 text-sm text-purple-100 md:flex-row md:items-center md:justify-between" aria-label={t.pagination}>
          <span role="status" aria-live="polite">{t.showing} {visibleArticles.length} {t.of} {filteredArticles.length} {t.results} · {t.page} {safePage} {t.of} {totalPages}</span>
          <div className="flex gap-2">
            <button className="rounded-full border border-purple-400/40 px-4 py-2 font-bold transition disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300" type="button" disabled={safePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>{t.previous}</button>
            <button className="rounded-full border border-orange-400/40 px-4 py-2 font-bold text-orange-100 transition disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-orange-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300" type="button" disabled={safePage >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>{t.next}</button>
          </div>
        </nav>
      ) : null}
    </section>
  )
}
