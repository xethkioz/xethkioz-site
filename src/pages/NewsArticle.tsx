import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import FusionShell from '../components/fusion/FusionShell'
import { useLang } from '../lib/LangContext'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import {
  fetchPublishedNewsBySlug,
  formatPublicNewsDate,
  publicNewsCategoryLabels,
  type PublicNewsArticle,
  type PublicNewsContentBlock,
} from '../services/news/publicNewsService'

const copy = {
  es: {
    back: 'Volver a noticias',
    loading: 'Cargando noticia...',
    notFound: 'No se encontró la noticia publicada.',
    source: 'Fuente original',
    sources: 'Fuentes originales',
    published: 'Publicado',
    ai: 'Contenido asistido por IA',
    external: 'Radar externo curado',
  },
  en: {
    back: 'Back to news',
    loading: 'Loading article...',
    notFound: 'Published article not found.',
    source: 'Original source',
    sources: 'Original sources',
    published: 'Published',
    ai: 'AI-assisted content',
    external: 'Curated external radar',
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

export default function NewsArticle() {
  const { slug } = useParams()
  const { lang } = useLang()
  const ui = copy[lang]
  const labels = publicNewsCategoryLabels[lang]
  const [article, setArticle] = useState<PublicNewsArticle | null>(null)
  const [isExternal, setIsExternal] = useState(false)
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
        const externalArticle = getCuratedExternalNews().find((item) => item.slug === slug) ?? null
        const nextArticle = externalArticle ?? await fetchPublishedNewsBySlug(slug)
        if (active) {
          setArticle(nextArticle)
          setIsExternal(Boolean(externalArticle))
          setError(nextArticle ? null : ui.notFound)
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
              {isExternal ? <span className="rounded-full border border-orange-400/35 px-3 py-1 text-orange-100">{ui.external}</span> : null}
              {article.ai_generated ? <span className="rounded-full border border-violet-400/35 px-3 py-1 text-violet-100">{ui.ai}</span> : null}
            </div>

            <h1 className="mt-6 text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl">{article.title}</h1>
            {article.summary ? <p className="mt-5 border-l-2 border-orange-300 pl-5 text-lg leading-8 text-slate-200">{article.summary}</p> : null}

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
