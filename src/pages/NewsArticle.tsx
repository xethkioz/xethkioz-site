import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import FusionShell from '../components/fusion/FusionShell'
import { useLang } from '../lib/LangContext'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import {
  fetchPublishedNewsBySlug,
  formatPublicNewsDate,
  getPublicNewsReadingMetrics,
  isPublicNewsEditorialChecklist,
  publicNewsCategoryLabels,
  publicNewsReadingDepthLabels,
  type PublicNewsArticle,
  type PublicNewsContentBlock,
} from '../services/news/publicNewsService'

type ArticleErrorKind = 'not-found' | 'load' | null

const copy = {
  es: {
    back: 'Volver a noticias',
    home: 'Volver al inicio',
    loading: 'Cargando noticia...',
    notFoundTitle: 'Noticia no encontrada',
    notFound: 'La publicación no existe, todavía no está disponible o fue retirada del radar público.',
    loadFailedTitle: 'No pudimos abrir la noticia',
    loadFailed: 'Hubo un problema temporal al consultar el radar. Podés volver al listado y reintentar desde allí.',
    source: 'Fuente original',
    sources: 'Fuentes originales',
    published: 'Publicado',
    ai: 'Contenido asistido por IA',
    external: 'Radar externo curado',
    sourceLabel: 'Fuente',
    words: 'palabras',
    reviewed: 'Revisado por XETHKIOZ',
    verification: 'Verificación directa',
    consultOriginal: 'Consultar la fuente original',
    primarySource: 'Fuente primaria',
    humanContext: 'Contexto humano',
    visibleLimits: 'Límites visibles',
  },
  en: {
    back: 'Back to news',
    home: 'Back to home',
    loading: 'Loading article...',
    notFoundTitle: 'Article not found',
    notFound: 'This publication does not exist, is not public yet or was removed from the public radar.',
    loadFailedTitle: 'We could not open this article',
    loadFailed: 'A temporary problem interrupted the radar request. Return to the news list and retry from there.',
    source: 'Original source',
    sources: 'Original sources',
    published: 'Published',
    ai: 'AI-assisted content',
    external: 'Curated external radar',
    sourceLabel: 'Source',
    words: 'words',
    reviewed: 'Reviewed by XETHKIOZ',
    verification: 'Direct verification',
    consultOriginal: 'Read the original source',
    primarySource: 'Primary source',
    humanContext: 'Human context',
    visibleLimits: 'Visible limits',
  },
} as const

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

function getArticleWorld(article: PublicNewsArticle) {
  if (article.category === 'gaming') return { className: 'is-gaming', district: '遊戯区 // GAMING DISTRICT', mode: 'MISIÓN EDITORIAL' }
  if (article.category === 'community') return { className: 'is-fun', district: '笑街 // CHAOS ALLEY', mode: 'TRANSMISIÓN VIRAL' }
  if (article.category === 'green') return { className: 'is-green', district: '禁制区 // GREEN NODE', mode: 'EXPEDIENTE CLASIFICADO' }
  return { className: 'is-science', district: '未来区 // FUTURE LAB', mode: 'INFORME DE CAMPO' }
}

function renderContentBlock(block: PublicNewsContentBlock, index: number) {
  if (block.type === 'heading') return <h2 key={`${block.type}-${index}`} className="mt-8 text-2xl font-black uppercase tracking-[0.08em] text-white">{block.text}</h2>
  if (block.type === 'quote') return <blockquote key={`${block.type}-${index}`} className="mt-6 border-l-2 border-orange-300 bg-orange-500/10 px-5 py-4 text-orange-50">{block.text}</blockquote>
  if (block.type === 'list') {
    const items = block.text.split(/\n|;|•/g).map((item) => item.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
    return <ul key={`${block.type}-${index}`} className="mt-5 space-y-2 text-slate-200">{(items.length ? items : [block.text]).map((item) => <li key={item} className="flex gap-3"><span className="text-orange-300">▣</span><span>{item}</span></li>)}</ul>
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
  const [errorKind, setErrorKind] = useState<ArticleErrorKind>(null)
  const world = article ? getArticleWorld(article) : null
  const readingBlocks = article?.content.filter((block) => !isPublicNewsEditorialChecklist(block)) ?? []
  const reading = article ? getPublicNewsReadingMetrics(article) : null
  const readingDepthLabels = publicNewsReadingDepthLabels[lang]

  useEffect(() => {
    let active = true
    async function loadArticle() {
      if (!slug) {
        setArticle(null)
        setIsExternal(false)
        setError(ui.notFound)
        setErrorKind('not-found')
        setLoading(false)
        return
      }
      setArticle(null)
      setIsExternal(false)
      setLoading(true)
      setError(null)
      setErrorKind(null)
      try {
        const externalArticle = getCuratedExternalNews().find((item) => item.slug === slug) ?? null
        const nextArticle = externalArticle ?? await fetchPublishedNewsBySlug(slug)
        if (active) {
          setArticle(nextArticle)
          setIsExternal(Boolean(externalArticle))
          setError(nextArticle ? null : ui.notFound)
          setErrorKind(nextArticle ? null : 'not-found')
        }
      } catch {
        if (active) {
          setArticle(null)
          setIsExternal(false)
          setError(ui.loadFailed)
          setErrorKind('load')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadArticle()
    return () => { active = false }
  }, [slug, ui.loadFailed, ui.notFound])

  const fallbackTitle = errorKind === 'load' ? ui.loadFailedTitle : ui.notFoundTitle

  return (
    <FusionShell tone="science">
      <SEO title={article?.title ?? fallbackTitle} description={article?.summary ?? error ?? ui.notFound} image={article?.cover_image_url ?? undefined} url={slug ? `/news/${slug}` : '/news'} type={article ? 'article' : 'website'} publishedTime={article?.published_at ?? article?.created_at ?? undefined} author="Alexis Díaz · XETHKIOZ" tags={article?.tags} />
      <main className={`xk-news-dossier ${world?.className ?? ''} mx-auto max-w-7xl px-4 py-10 text-white sm:px-6 md:py-12`}>
        <div className="xk-news-city" aria-hidden="true"><i /><i /><i /><span /><span /></div>
        <Link to="/news" className="font-mono text-xs font-black uppercase tracking-[0.18em] text-orange-300 transition hover:text-orange-100">← {ui.back}</Link>
        {loading ? <p className="mt-8 rounded-3xl border border-violet-500/20 bg-white/[0.04] p-5 text-violet-100" role="status" aria-live="polite">{ui.loading}</p> : null}
        {!loading && error && !article ? (
          <section className="mt-8 overflow-hidden rounded-[2rem] border border-red-400/25 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,.16),transparent_36%),linear-gradient(135deg,rgba(124,58,237,.14),rgba(0,0,0,.92))] p-6 text-center shadow-[0_0_60px_rgba(124,58,237,.15)] md:p-10" role="alert" aria-labelledby="news-error-title">
            <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-orange-300">NEWS_ENGINE // {errorKind === 'load' ? 'SIGNAL_INTERRUPTED' : 'FILE_NOT_FOUND'}</p>
            <div className="mx-auto mt-6 grid h-20 w-20 place-items-center rounded-3xl border border-white/15 bg-black/45 text-3xl" aria-hidden="true">{errorKind === 'load' ? '⌁' : '404'}</div>
            <h1 id="news-error-title" className="mt-6 text-3xl font-black uppercase tracking-[-0.03em] text-white md:text-5xl">{fallbackTitle}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">{error}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/news" className="rounded-full border border-orange-300/50 bg-orange-500/10 px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-orange-100 transition hover:bg-orange-500/20">{ui.back}</Link>
              <Link to="/" className="rounded-full border border-violet-300/35 px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-violet-100 transition hover:bg-violet-500/10">{ui.home}</Link>
            </div>
          </section>
        ) : null}
        {article ? (
          <article className="xk-news-archive mt-8 overflow-hidden rounded-[2rem] border border-violet-500/25 bg-[#0B0A0F] p-4 shadow-[0_0_70px_rgba(124,58,237,.18)] sm:p-6 md:p-9">
            <header className="xk-news-worldbar"><p>{world?.district}</p><span><i />{world?.mode}</span><b>FILE // {article.slug.slice(-12).toUpperCase()}</b></header>
            {article.cover_image_url ? (
              <div className="xk-news-cover mb-7 overflow-hidden rounded-[1.5rem] border border-orange-400/25 bg-black/40">
                <SafeImage src={article.cover_image_url} fallback="/images/articles/fallback.svg" alt={article.cover_image_alt || article.title} className="h-full w-full object-cover" loading="eager" />
              </div>
            ) : (
              <div className="mb-7 overflow-hidden rounded-[1.5rem] border border-orange-400/25 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,.28),transparent_34%),linear-gradient(135deg,rgba(124,58,237,.2),rgba(0,0,0,.9))] p-5 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-black/45 text-3xl md:h-16 md:w-16">{getArticleMark(article)}</div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-200">{labels[article.category]}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-300">{ui.sourceLabel}: {getSourceHost(article)}</p>
                    </div>
                  </div>
                  <span className="hidden rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-300 sm:inline-flex">{formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
              <span className="rounded-full border border-orange-400/40 px-3 py-1 text-orange-200">{labels[article.category]}</span>
              <span>{ui.published}: {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
              {isExternal ? <span className="rounded-full border border-orange-400/35 px-3 py-1 text-orange-100">{ui.external}</span> : null}
              {article.ai_generated ? <span className="rounded-full border border-violet-400/35 px-3 py-1 text-violet-100">{ui.ai}</span> : null}
            </div>
            <h1 className="mt-6 text-3xl font-black uppercase leading-[1] tracking-[-0.04em] sm:text-4xl md:text-6xl">{article.title}</h1>
            {article.summary ? <p className="mt-5 border-l-2 border-orange-300 pl-5 text-base leading-8 text-slate-200 md:text-lg">{article.summary}</p> : null}
            <div className="xk-news-simple-meta">
              {reading ? <span>{readingDepthLabels[reading.depth]} · {reading.minutes} min</span> : null}
              <span>{reading?.words ?? 0} {ui.words}</span>
              <span>{ui.sourceLabel}: {getSourceHost(article)}</span>
              <span>{ui.reviewed}</span>
            </div>
            {article.source_urls[0] ? (
              <a href={article.source_urls[0]} target="_blank" rel="noreferrer" className="xk-news-source-cta">
                <span><small>{ui.verification}</small>{ui.consultOriginal}</span>
                <b>{getSourceHost(article)} ↗</b>
              </a>
            ) : null}
            <section className="xk-news-prose xk-news-prose-simple">{readingBlocks.length ? readingBlocks.map(renderContentBlock) : <p className="text-slate-300">{article.summary}</p>}</section>
            <div className="xk-news-trustline" aria-label="Protocolo editorial"><span>{ui.primarySource}</span><i /><span>{ui.humanContext}</span><i /><span>{ui.visibleLimits}</span></div>
            {article.tags.length ? <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-5">{article.tags.map((tag) => <span key={tag} className="rounded-full border border-violet-400/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-violet-100">#{tag}</span>)}</div> : null}
            {article.source_urls.length ? (
              <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="font-mono text-xs font-black uppercase tracking-[0.22em] text-orange-300">{article.source_urls.length === 1 ? ui.source : ui.sources}</h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">{article.source_urls.map((sourceUrl) => <li key={sourceUrl} className="break-all"><a href={sourceUrl} target="_blank" rel="noreferrer" className="text-violet-200 transition hover:text-orange-200">{getSourceHost({ ...article, source_urls: [sourceUrl] })} · {sourceUrl}</a></li>)}</ul>
              </section>
            ) : null}
          </article>
        ) : null}
      </main>
    </FusionShell>
  )
}
