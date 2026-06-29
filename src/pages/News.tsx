import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import { useLang } from '../lib/LangContext'
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

const copy = {
  es: {
    seoTitle: 'Noticias · XETHKIOZ',
    seoDescription: 'Noticias publicadas por el CMS de XETHKIOZ.',
    eyebrow: 'NEWS_ENGINE // PUBLIC_FEED',
    heading: 'Noticias publicadas',
    description: 'Feed público conectado a Supabase. Todo lo aprobado en el CMS aparece acá automáticamente.',
    statusReady: 'CMS público conectado',
    statusSetup: 'Supabase no configurado: el feed público queda en modo espera.',
    loading: 'Cargando noticias publicadas...',
    emptyTitle: 'Todavía no hay noticias publicadas',
    emptyText: 'Publicá un artículo desde /cms/news o ejecutá el seed demo en Supabase para probar el flujo completo.',
    read: 'Leer noticia',
    ai: 'IA',
    sources: 'fuentes',
    published: 'Publicado',
  },
  en: {
    seoTitle: 'News · XETHKIOZ',
    seoDescription: 'News published by the XETHKIOZ CMS.',
    eyebrow: 'NEWS_ENGINE // PUBLIC_FEED',
    heading: 'Published news',
    description: 'Public feed connected to Supabase. Every CMS-approved article appears here automatically.',
    statusReady: 'Public CMS connected',
    statusSetup: 'Supabase not configured: public feed is waiting.',
    loading: 'Loading published news...',
    emptyTitle: 'No published news yet',
    emptyText: 'Publish an article from /cms/news or run the demo seed in Supabase to test the full flow.',
    read: 'Read article',
    ai: 'AI',
    sources: 'sources',
    published: 'Published',
  },
} as const

export default function News() {
  const { lang, t } = useLang()
  const ui = copy[lang]
  const labels = publicNewsCategoryLabels[lang]
  const [filter, setFilter] = useState<Filter>('all')
  const [articles, setArticles] = useState<PublicNewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadNews() {
      setLoading(true)
      setError(null)
      try {
        const nextArticles = await fetchPublishedNews(filter)
        if (active) setArticles(nextArticles)
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : 'No se pudo cargar el feed público.')
          setArticles([])
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

  const featured = articles[0] ?? null
  const remainingArticles = useMemo(() => articles.slice(featured ? 1 : 0), [articles, featured])

  return (
    <FusionShell tone="science" backLabel={t.v7.backCore} label={t.v7.functionality.newsEngine}>
      <SEO title={ui.seoTitle} description={ui.seoDescription} url="/news" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <FusionHero tone="science" eyebrow={ui.eyebrow} heading={ui.heading} description={ui.description} />

        <section className="mt-8 rounded-[2rem] border border-violet-500/20 bg-black/45 p-5 text-white shadow-[0_0_40px_rgba(124,58,237,.14)] md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-300">PUBLICATION_STATUS</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.08em]">{isPublicNewsSupabaseConfigured ? ui.statusReady : ui.statusSetup}</h2>
            </div>
            <Link to="/cms/news" className="rounded-full border border-orange-400/40 px-4 py-3 text-center font-mono text-xs font-black uppercase tracking-[0.18em] text-orange-200 transition hover:bg-orange-500/10">
              CMS
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {(['all', ...publicNewsCategories] as Filter[]).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] font-black uppercase tracking-[0.16em] transition ${filter === category ? 'border-orange-300 bg-orange-500/15 text-orange-100' : 'border-white/10 text-slate-400 hover:border-violet-300 hover:text-white'}`}
              >
                {labels[category]}
              </button>
            ))}
          </div>
        </section>

        {loading ? <p className="mt-8 rounded-3xl border border-violet-500/20 bg-white/[0.04] p-5 text-violet-100">{ui.loading}</p> : null}
        {error ? <p className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}

        {!loading && !error && articles.length === 0 ? (
          <article className="mt-8 rounded-[2rem] border border-orange-400/25 bg-orange-500/10 p-8 text-orange-50">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-200">EMPTY_FEED</p>
            <h2 className="mt-3 text-3xl font-black uppercase">{ui.emptyTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-orange-50/80">{ui.emptyText}</p>
          </article>
        ) : null}

        {featured ? (
          <article className="mt-8 overflow-hidden rounded-[2rem] border border-orange-400/30 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,.18),transparent_34%),linear-gradient(135deg,rgba(124,58,237,.16),rgba(0,0,0,.76))] p-6 text-white shadow-[0_0_50px_rgba(249,115,22,.12)] md:p-8">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-orange-200">
              <span className="rounded-full border border-orange-400/40 px-3 py-1">{labels[featured.category]}</span>
              <span>{ui.published}: {formatPublicNewsDate(featured.published_at ?? featured.created_at, lang)}</span>
              {featured.ai_generated ? <span className="rounded-full border border-violet-400/35 px-3 py-1 text-violet-100">{ui.ai}</span> : null}
            </div>
            <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl">{featured.title}</h2>
            {featured.summary ? <p className="mt-4 max-w-4xl text-base leading-7 text-slate-200 md:text-lg">{featured.summary}</p> : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/news/${featured.slug}`} className="rounded-full bg-orange px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-black transition hover:shadow-glow-action">
                {ui.read}
              </Link>
              {featured.source_urls.length ? <span className="rounded-full border border-white/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-slate-300">{featured.source_urls.length} {ui.sources}</span> : null}
            </div>
          </article>
        ) : null}

        {remainingArticles.length > 0 ? (
          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {remainingArticles.map((article) => (
              <article key={article.id} className="rounded-[1.5rem] border border-violet-500/20 bg-white/[0.04] p-5 text-white transition hover:-translate-y-1 hover:border-orange-300/40 hover:bg-white/[0.06]">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  <span className="text-orange-300">{labels[article.category]}</span>
                  <span>{formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                </div>
                <h3 className="mt-3 text-2xl font-black leading-tight">{article.title}</h3>
                {article.summary ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{article.summary}</p> : null}
                <Link to={`/news/${article.slug}`} className="mt-5 inline-flex rounded-full border border-violet-400/40 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-violet-100 transition hover:bg-violet-500/10">
                  {ui.read}
                </Link>
              </article>
            ))}
          </section>
        ) : null}
      </main>
    </FusionShell>
  )
}
