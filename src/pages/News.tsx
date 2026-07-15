import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SafeImage from '../components/SafeImage'
import SEO from '../components/SEO'
import PublicAdSlot from '../components/ads/PublicAdSlot'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import { useLang } from '../lib/LangContext'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import {
  fetchPublishedNews,
  formatPublicNewsDate,
  isPublicNewsSupabaseConfigured,
  publicNewsCategories,
  publicNewsCategoryLabels,
  type PublicNewsArticle,
  type PublicNewsCategory,
} from '../services/news/publicNewsService'

type Filter = PublicNewsCategory | 'all'
const INITIAL_VISIBLE_ARTICLES = 10

const copy = {
  es: {
    seoTitle: 'Noticias · XETHKIOZ',
    seoDescription: 'Radar público de noticias, memes y tecnología curado por XETHKIOZ.',
    eyebrow: 'NEWS_ENGINE // HYBRID_FEED',
    heading: 'Radar XETHKIOZ',
    description: 'Feed híbrido: noticias propias del CMS + radar externo curado con fuente visible. Lectura ampliada dentro de XETHKIOZ y link a la fuente original.',
    statusReady: 'CMS + radar externo activo',
    statusSetup: 'Radar externo activo. Supabase queda como capa editorial opcional.',
    loading: 'Cargando radar público...',
    emptyTitle: 'Todavía no hay contenido publicado',
    emptyText: 'El radar externo debería mostrar contenido aunque Supabase no responda. Revisar build si esto aparece.',
    read: 'Leer completa',
    ai: 'IA',
    sources: 'fuentes',
    published: 'Publicado',
    source: 'Fuente',
    search: 'Buscar por título, tema o fuente',
    searchLabel: 'Buscar noticias',
    clearSearch: 'Limpiar búsqueda',
    results: 'resultados',
    topics: 'Temas activos',
    noResultsTitle: 'No encontramos noticias con esos filtros',
    noResultsText: 'Probá otra palabra o volvé a ver todas las categorías.',
    showMore: 'Cargar más noticias',
    showing: 'Mostrando',
    of: 'de',
  },
  en: {
    seoTitle: 'News · XETHKIOZ',
    seoDescription: 'XETHKIOZ curated public radar for news, memes and technology.',
    eyebrow: 'NEWS_ENGINE // HYBRID_FEED',
    heading: 'XETHKIOZ Radar',
    description: 'Hybrid feed: CMS articles plus curated external radar with visible sources. Expanded reading inside XETHKIOZ and link to original source.',
    statusReady: 'CMS + external radar active',
    statusSetup: 'External radar active. Supabase remains optional editorial layer.',
    loading: 'Loading public radar...',
    emptyTitle: 'No published content yet',
    emptyText: 'The external radar should show content even if Supabase is unavailable. Check build if this appears.',
    read: 'Read full article',
    ai: 'AI',
    sources: 'sources',
    published: 'Published',
    source: 'Source',
    search: 'Search by title, topic or source',
    searchLabel: 'Search news',
    clearSearch: 'Clear search',
    results: 'results',
    topics: 'Active topics',
    noResultsTitle: 'No news matched those filters',
    noResultsText: 'Try another keyword or return to all categories.',
    showMore: 'Load more news',
    showing: 'Showing',
    of: 'of',
  },
} as const

function mergeUniqueArticles(primary: PublicNewsArticle[], fallback: PublicNewsArticle[]) {
  const seen = new Set<string>()
  return [...primary, ...fallback].filter((article) => {
    if (seen.has(article.slug)) return false
    seen.add(article.slug)
    return true
  }).sort((left, right) => {
    const leftDate = new Date(left.published_at ?? left.created_at).getTime()
    const rightDate = new Date(right.published_at ?? right.created_at).getTime()
    return (Number.isFinite(rightDate) ? rightDate : 0) - (Number.isFinite(leftDate) ? leftDate : 0)
  })
}

function getSourceHost(article: PublicNewsArticle) {
  const first = article.source_urls[0]
  if (!first) return 'XETHKIOZ'
  try {
    return new URL(first).hostname.replace(/^www\./, '')
  } catch {
    return first
  }
}

function getArticleMark(article: PublicNewsArticle) {
  if (article.category === 'gaming') return '🎮'
  if (article.category === 'ai') return '🤖'
  if (article.category === 'tech') return '⚙️'
  if (article.category === 'science') return '🔬'
  if (article.category === 'community') return '😂'
  if (article.category === 'green') return '🟢'
  return '⌨️'
}

function ArticleThumb({ article, large = false }: { article: PublicNewsArticle; large?: boolean }) {
  if (article.cover_image_url) {
    return (
      <div className={`overflow-hidden rounded-2xl border border-orange-400/25 bg-black/50 ${large ? 'h-72 md:h-96' : 'h-44'}`}>
        <SafeImage src={article.cover_image_url} alt={article.cover_image_alt || article.title} loading="lazy" fallback="/images/articles/fallback.svg" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-2xl border border-orange-400/25 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,.25),transparent_36%),linear-gradient(135deg,rgba(124,58,237,.18),rgba(0,0,0,.86))] ${large ? 'p-6 md:p-8' : 'p-4'}`}>
      <div className="flex items-center gap-3">
        <div className={`${large ? 'h-16 w-16 text-3xl' : 'h-12 w-12 text-2xl'} grid place-items-center rounded-2xl border border-white/15 bg-black/45`}>{getArticleMark(article)}</div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-orange-200">{article.category}</p>
          <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300">{getSourceHost(article)}</p>
        </div>
      </div>
    </div>
  )
}

export default function News() {
  const { lang, t } = useLang()
  const ui = copy[lang]
  const labels = publicNewsCategoryLabels[lang]
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedCategory = searchParams.get('category')
  const filter: Filter = requestedCategory && publicNewsCategories.includes(requestedCategory as PublicNewsCategory)
    ? requestedCategory as PublicNewsCategory
    : 'all'
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_ARTICLES)
  const [articles, setArticles] = useState<PublicNewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadNews() {
      setLoading(true)
      setError(null)
      const curatedArticles = getCuratedExternalNews(filter)
      try {
        const nextArticles = await fetchPublishedNews(filter)
        if (active) setArticles(mergeUniqueArticles(nextArticles, curatedArticles))
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : 'No se pudo cargar Supabase. Mostrando radar externo.')
          setArticles(curatedArticles)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadNews()

    return () => {
      active = false
    }
  }, [filter])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_ARTICLES)
  }, [filter, query])

  const filteredArticles = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(lang === 'es' ? 'es-AR' : 'en-US')
    if (!needle) return articles
    return articles.filter((article) => [
      article.title,
      article.summary ?? '',
      article.tags.join(' '),
      getSourceHost(article),
      labels[article.category],
    ].join(' ').toLocaleLowerCase(lang === 'es' ? 'es-AR' : 'en-US').includes(needle))
  }, [articles, lang, labels, query])

  const visibleArticles = filteredArticles.slice(0, visibleCount)
  const featured = visibleArticles[0] ?? null
  const remainingArticles = visibleArticles.slice(featured ? 1 : 0)
  const activeTopics = useMemo(() => {
    const counts = new Map<string, number>()
    articles.forEach((article) => article.tags.forEach((tag) => {
      const normalized = tag.trim()
      if (normalized) counts.set(normalized, (counts.get(normalized) ?? 0) + 1)
    }))
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 7)
  }, [articles])

  function selectFilter(category: Filter) {
    const next = new URLSearchParams(searchParams)
    if (category === 'all') next.delete('category')
    else next.set('category', category)
    setSearchParams(next, { replace: true })
  }

  function updateQuery(value: string) {
    setQuery(value)
    const next = new URLSearchParams(searchParams)
    const cleanValue = value.trim()
    if (cleanValue) next.set('q', cleanValue)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  return (
    <FusionShell tone="science" backLabel={t.v7.backCore} label={t.v7.functionality.newsEngine}>
      <SEO title={ui.seoTitle} description={ui.seoDescription} url="/news" />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12">
        <FusionHero tone="science" eyebrow={ui.eyebrow} heading={ui.heading} description={ui.description} />

        <section className="mt-8 rounded-[2rem] border border-violet-500/20 bg-black/45 p-5 text-white shadow-[0_0_40px_rgba(124,58,237,.14)] md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-300">PUBLICATION_STATUS</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.08em]">{isPublicNewsSupabaseConfigured ? ui.statusReady : ui.statusSetup}</h2>
            </div>
            <Link to="/cms/news" className="rounded-full border border-orange-400/40 px-4 py-3 text-center font-mono text-xs font-black uppercase tracking-[0.18em] text-orange-200 transition hover:bg-orange-500/10">CMS</Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="relative">
              <label htmlFor="news-search" className="sr-only">{ui.searchLabel}</label>
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" aria-hidden="true">⌕</span>
              <input id="news-search" type="search" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder={ui.search} className="min-h-12 w-full rounded-full border border-white/10 bg-black/45 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-300" />
              {query ? <button type="button" onClick={() => updateQuery('')} aria-label={ui.clearSearch} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white">×</button> : null}
            </div>
            <p role="status" className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">{filteredArticles.length} {ui.results}</p>
          </div>

          <div className="-mx-5 mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {(['all', ...publicNewsCategories] as Filter[]).map((category) => (
              <button key={category} type="button" onClick={() => selectFilter(category)} aria-pressed={filter === category} className={`shrink-0 snap-start rounded-full border px-4 py-2 font-mono text-[11px] font-black uppercase tracking-[0.16em] transition ${filter === category ? 'border-orange-300 bg-orange-500/15 text-orange-100' : 'border-white/10 text-slate-400 hover:border-violet-300 hover:text-white'}`}>{labels[category]}</button>
            ))}
          </div>

          {activeTopics.length ? (
            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-violet-200/70">{ui.topics}</p>
              <div className="-mx-5 mt-3 flex snap-x gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                {activeTopics.map(([topic, count]) => <button key={topic} type="button" onClick={() => updateQuery(topic)} className="shrink-0 snap-start rounded-full border border-violet-400/20 bg-violet-500/[0.06] px-3 py-1.5 text-[10px] font-bold text-violet-100 transition hover:border-orange-300/40 hover:text-orange-100">#{topic} <span className="text-white/35">{count}</span></button>)}
              </div>
            </div>
          ) : null}
        </section>

        {loading ? <p className="mt-8 rounded-3xl border border-violet-500/20 bg-white/[0.04] p-5 text-violet-100">{ui.loading}</p> : null}
        {error ? <p className="mt-8 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-yellow-100">{error}</p> : null}

        {!loading && articles.length === 0 ? (
          <article className="mt-8 rounded-[2rem] border border-orange-400/25 bg-orange-500/10 p-8 text-orange-50">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-200">EMPTY_FEED</p>
            <h2 className="mt-3 text-3xl font-black uppercase">{ui.emptyTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-orange-50/80">{ui.emptyText}</p>
          </article>
        ) : null}

        {!loading && articles.length > 0 && filteredArticles.length === 0 ? (
          <article className="mt-8 rounded-[2rem] border border-violet-400/25 bg-violet-500/[0.07] p-8 text-violet-50">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-200">NO_RESULTS</p>
            <h2 className="mt-3 text-3xl font-black uppercase">{ui.noResultsTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-violet-50/75">{ui.noResultsText}</p>
            <button type="button" onClick={() => { setQuery(''); selectFilter('all') }} className="mt-6 rounded-full border border-orange-300/40 px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-orange-100">{labels.all}</button>
          </article>
        ) : null}

        {featured ? (
          <article className="group mt-8 overflow-hidden rounded-[2rem] border border-orange-400/30 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,.18),transparent_34%),linear-gradient(135deg,rgba(124,58,237,.16),rgba(0,0,0,.76))] p-5 text-white shadow-[0_0_50px_rgba(249,115,22,.12)] md:p-8">
            <ArticleThumb article={featured} large />
            <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-orange-200">
              <span className="rounded-full border border-orange-400/40 px-3 py-1">{labels[featured.category]}</span>
              <span>{ui.published}: {formatPublicNewsDate(featured.published_at ?? featured.created_at, lang)}</span>
              <span>{ui.source}: {getSourceHost(featured)}</span>
              {featured.ai_generated ? <span className="rounded-full border border-violet-400/35 px-3 py-1 text-violet-100">{ui.ai}</span> : null}
            </div>
            <h2 className="mt-5 max-w-5xl text-3xl font-black uppercase leading-[1] tracking-[-0.04em] sm:text-4xl md:text-6xl">{featured.title}</h2>
            {featured.summary ? <p className="mt-4 max-w-4xl text-base leading-7 text-slate-200 md:text-lg">{featured.summary}</p> : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/news/${featured.slug}`} className="rounded-full bg-orange px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-black transition hover:shadow-glow-action">{ui.read}</Link>
              {featured.source_urls.length ? <span className="rounded-full border border-white/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-slate-300">{featured.source_urls.length} {ui.sources}</span> : null}
            </div>
          </article>
        ) : null}

        <div className="mt-8">
          <PublicAdSlot slotId="news-inline" fallbackLabel="XETHKIOZ NEWS SPONSOR" />
        </div>

        {remainingArticles.length > 0 ? (
          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {remainingArticles.map((article) => (
              <article key={article.id} className="group rounded-[1.5rem] border border-violet-500/20 bg-white/[0.04] p-4 text-white transition hover:-translate-y-1 hover:border-orange-300/40 hover:bg-white/[0.06] md:p-5">
                <ArticleThumb article={article} />
                <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  <span className="text-orange-300">{labels[article.category]}</span>
                  <span>{formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                  <span>{getSourceHost(article)}</span>
                </div>
                <h3 className="mt-3 text-xl font-black leading-tight md:text-2xl">{article.title}</h3>
                {article.summary ? <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-300">{article.summary}</p> : null}
                <Link to={`/news/${article.slug}`} className="mt-5 inline-flex rounded-full border border-violet-400/40 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-violet-100 transition hover:bg-violet-500/10">{ui.read}</Link>
              </article>
            ))}
          </section>
        ) : null}

        {filteredArticles.length > visibleArticles.length ? (
          <div className="mt-8 text-center">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{ui.showing} {visibleArticles.length} {ui.of} {filteredArticles.length}</p>
            <button type="button" onClick={() => setVisibleCount((current) => current + 9)} className="rounded-full border border-orange-300/40 bg-orange-500/[0.08] px-6 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-orange-100 transition hover:border-orange-200 hover:bg-orange-500/15 hover:shadow-[0_0_28px_rgba(249,115,22,.2)]">{ui.showMore} ↓</button>
          </div>
        ) : null}
      </main>
    </FusionShell>
  )
}
