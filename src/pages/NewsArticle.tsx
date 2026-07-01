import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import FusionShell from '../components/fusion/FusionShell'
import { useLang } from '../lib/LangContext'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'
import {
  fetchPublishedNewsBySlug,
  formatPublicNewsDate,
  publicNewsCategoryLabels,
  type PublicNewsArticle,
  type PublicNewsContentBlock,
} from '../services/news/publicNewsService'

type Engagement = {
  views: number
  hype: number
  useful: number
}

const copy = {
  es: {
    back: 'Volver a noticias',
    loading: 'Cargando noticia...',
    notFound: 'No se encontró la noticia publicada.',
    source: 'Fuente',
    sources: 'Fuentes',
    published: 'Publicado',
    ai: 'Contenido asistido por IA',
    views: 'vistas',
    hype: 'Hype',
    useful: 'Útil',
    engagementPending: 'Interacciones pendientes de activar en Supabase.',
  },
  en: {
    back: 'Back to news',
    loading: 'Loading article...',
    notFound: 'Published article not found.',
    source: 'Source',
    sources: 'Sources',
    published: 'Published',
    ai: 'AI-assisted content',
    views: 'views',
    hype: 'Hype',
    useful: 'Useful',
    engagementPending: 'Engagement pending Supabase activation.',
  },
} as const

function renderContentBlock(block: PublicNewsContentBlock, index: number) {
  if (block.type === 'heading') {
    return <h2 key={`${block.type}-${index}`} className="mt-8 text-2xl font-black uppercase tracking-[0.08em] text-white">{block.text}</h2>
  }

  if (block.type === 'quote') {
    return <blockquote key={`${block.type}-${index}`} className="mt-6 border-l-2 border-orange-300 bg-orange-500/10 px-5 py-4 text-orange-50">{block.text}</blockquote>
  }

  if (block.type === 'list') {
    const items = block.text.split(/\n|;|•/g).map((item) => item.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
    return (
      <ul key={`${block.type}-${index}`} className="mt-5 space-y-2 text-slate-200">
        {(items.length ? items : [block.text]).map((item) => <li key={item} className="flex gap-3"><span className="text-orange-300">▣</span><span>{item}</span></li>)}
      </ul>
    )
  }

  return <p key={`${block.type}-${index}`} className="mt-5 text-base leading-8 text-slate-200">{block.text}</p>
}

function readReacted(articleId: string, metric: 'hype' | 'useful') {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(`xethkioz.news.reaction.${articleId}.${metric}`) === '1'
}

function markReacted(articleId: string, metric: 'hype' | 'useful') {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(`xethkioz.news.reaction.${articleId}.${metric}`, '1')
}

async function incrementEngagement(articleId: string, metric: 'views' | 'hype' | 'useful') {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase.rpc('increment_news_article_engagement', {
    target_article_id: articleId,
    target_metric: metric,
  })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return null
  return { views: Number(row.views ?? 0), hype: Number(row.hype ?? 0), useful: Number(row.useful ?? 0) } satisfies Engagement
}

export default function NewsArticle() {
  const { slug } = useParams()
  const { lang } = useLang()
  const ui = copy[lang]
  const labels = publicNewsCategoryLabels[lang]
  const [article, setArticle] = useState<PublicNewsArticle | null>(null)
  const [engagement, setEngagement] = useState<Engagement | null>(null)
  const [engagementReady, setEngagementReady] = useState(true)
  const [reacted, setReacted] = useState({ hype: false, useful: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadArticle() {
      if (!slug) {
        setError(ui.notFound)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const nextArticle = await fetchPublishedNewsBySlug(slug)
        if (active) {
          setArticle(nextArticle)
          setError(nextArticle ? null : ui.notFound)
          if (nextArticle) setReacted({ hype: readReacted(nextArticle.id, 'hype'), useful: readReacted(nextArticle.id, 'useful') })
        }
      } catch (caughtError) {
        if (active) setError(caughtError instanceof Error ? caughtError.message : ui.notFound)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadArticle()

    return () => {
      active = false
    }
  }, [slug, ui.notFound])

  useEffect(() => {
    if (!article) return
    let active = true

    async function registerView() {
      try {
        const sessionKey = `xethkioz.news.view.${article.id}`
        const shouldCountView = typeof window === 'undefined' || window.sessionStorage.getItem(sessionKey) !== '1'
        const nextEngagement = shouldCountView
          ? await incrementEngagement(article.id, 'views')
          : null
        if (typeof window !== 'undefined' && shouldCountView) window.sessionStorage.setItem(sessionKey, '1')
        if (active && nextEngagement) setEngagement(nextEngagement)
      } catch {
        if (active) setEngagementReady(false)
      }
    }

    void registerView()

    return () => {
      active = false
    }
  }, [article])

  async function handleReaction(metric: 'hype' | 'useful') {
    if (!article || reacted[metric]) return
    try {
      const nextEngagement = await incrementEngagement(article.id, metric)
      markReacted(article.id, metric)
      setReacted((current) => ({ ...current, [metric]: true }))
      if (nextEngagement) setEngagement(nextEngagement)
    } catch {
      setEngagementReady(false)
    }
  }

  return (
    <FusionShell tone="science" backLabel={ui.back} label="XETHKIOZ NEWS">
      <SEO title={article ? `${article.title} · XETHKIOZ` : 'Noticia · XETHKIOZ'} description={article?.summary ?? ui.notFound} url={slug ? `/news/${slug}` : '/news'} />
      <main className="mx-auto max-w-5xl px-4 py-12 text-white sm:px-6">
        <Link to="/news" className="font-mono text-xs font-black uppercase tracking-[0.18em] text-orange-300 transition hover:text-orange-100">← {ui.back}</Link>

        {loading ? <p className="mt-8 rounded-3xl border border-violet-500/20 bg-white/[0.04] p-5 text-violet-100">{ui.loading}</p> : null}
        {error ? <p className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}

        {article ? (
          <article className="mt-8 overflow-hidden rounded-[2rem] border border-violet-500/25 bg-[#0B0A0F] p-6 shadow-[0_0_70px_rgba(124,58,237,.18)] md:p-9">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
              <span className="rounded-full border border-orange-400/40 px-3 py-1 text-orange-200">{labels[article.category]}</span>
              <span>{ui.published}: {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
              {article.ai_generated ? <span className="rounded-full border border-violet-400/35 px-3 py-1 text-violet-100">{ui.ai}</span> : null}
              {engagement ? <span>{engagement.views} {ui.views}</span> : null}
            </div>

            <h1 className="mt-6 text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl">{article.title}</h1>
            {article.summary ? <p className="mt-5 border-l-2 border-orange-300 pl-5 text-lg leading-8 text-slate-200">{article.summary}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" disabled={reacted.hype} onClick={() => void handleReaction('hype')} className="rounded-full border border-orange-400/40 bg-orange-500/10 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-orange-100 transition hover:bg-orange-500/20 disabled:opacity-55">
                🔥 {ui.hype} {engagement ? engagement.hype : ''}
              </button>
              <button type="button" disabled={reacted.useful} onClick={() => void handleReaction('useful')} className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-emerald-100 transition hover:bg-emerald-500/20 disabled:opacity-55">
                ✅ {ui.useful} {engagement ? engagement.useful : ''}
              </button>
              {!engagementReady ? <span className="rounded-full border border-yellow-400/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-yellow-100">{ui.engagementPending}</span> : null}
            </div>

            <section className="mt-8 border-t border-white/10 pt-4">
              {article.content.length ? article.content.map(renderContentBlock) : <p className="text-slate-300">{article.summary}</p>}
            </section>

            {article.tags.length ? (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                {article.tags.map((tag) => <span key={tag} className="rounded-full border border-violet-400/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-violet-100">#{tag}</span>)}
              </div>
            ) : null}

            {article.source_urls.length ? (
              <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="font-mono text-xs font-black uppercase tracking-[0.22em] text-orange-300">{article.source_urls.length === 1 ? ui.source : ui.sources}</h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {article.source_urls.map((sourceUrl) => (
                    <li key={sourceUrl} className="break-all">
                      <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-violet-200 transition hover:text-orange-200">{sourceUrl}</a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>
        ) : null}
      </main>
    </FusionShell>
  )
}
