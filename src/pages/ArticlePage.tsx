import { useParams, Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { useArticle, useArticles } from '../lib/hooks'
import ArticleCard from '../components/ArticleCard'
import { ErrorDisplay } from '../components/Skeletons'
import SEO from '../components/SEO'
import SafeImage, { articleFallback, cleanImageUrl } from '../components/SafeImage'
import ReactionBar from '../components/ReactionBar'
export default function ArticlePage() {
  const { slug } = useParams()
  const { t } = useLang()
  const { article, loading, error, retry } = useArticle(slug)
  const { articles: related } = useArticles({ limit: 6 })
  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center"><div className="skeleton h-8 w-1/2 mx-auto mb-4 rounded skeleton-shimmer" /><div className="skeleton h-4 w-3/4 mx-auto mb-8 skeleton-shimmer" /><div className="skeleton h-64 w-full rounded-xl skeleton-shimmer" /></div>
  if (error) return <ErrorDisplay message={t.errors.notFoundDesc} onRetry={retry} />
  if (!article) return <div className="max-w-4xl mx-auto px-4 py-20 text-center"><p className="text-gray-500 mb-4">{t.errors.notFoundDesc}</p><Link to="/news" className="text-orange hover:underline">← {t.common.back}</Link></div>
  const date = new Date(article.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  const ra = related.filter((a) => a.id !== article.id && a.category?.slug === article.category?.slug).slice(0, 3)
  return (
    <div className="animate-fade-in">
      <SEO title={article.title} description={article.excerpt || ''} image={cleanImageUrl(article.cover_image, articleFallback(article.category?.portal, article.category?.slug))} type="article" publishedTime={article.published_at} author={article.author?.name} tags={article.tags} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/news" className="text-sm text-orange hover:neon-text-orange mb-6 inline-block">← {t.common.back}</Link>
        {article.category && <span className="tag-orange mb-4 inline-block">{article.category.name}</span>}
        <h1 className="font-display text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">{article.title}</h1>
        <p className="text-lg text-gray-400 mb-6 leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center gap-4 mb-8 text-sm text-gray-500 border-y border-white/10 py-4">
          {article.author?.avatar_url && <SafeImage src={article.author.avatar_url} fallback="/images/articles/fallback.svg" alt={article.author.name} className="w-10 h-10 rounded-full object-cover" />}
          <div><p className="text-white font-medium">{article.author?.name}</p><p>{t.news.publishedOn} {date} • {article.views.toLocaleString()} {t.home.views}</p></div>
        </div>
        <div className="rounded-2xl overflow-hidden mb-8 border border-white/10"><SafeImage src={article.cover_image} fallback={articleFallback(article.category?.portal, article.category?.slug)} alt={article.title} className="w-full h-auto object-cover" loading="eager" /></div>
        <div className="prose prose-invert max-w-none">{article.content.split('\n').map((p, i) => <p key={i} className="text-gray-300 leading-relaxed mb-4 text-base md:text-lg">{p}</p>)}</div>
        <ReactionBar articleId={article.id} />
        {article.tags.length > 0 && <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10"><span className="text-xs text-gray-500 font-display uppercase tracking-wider mr-2">{t.news.tags}:</span>{article.tags.map((tag) => <span key={tag} className="tag border-white/20 text-gray-400">#{tag}</span>)}</div>}
      </article>
      {ra.length > 0 && <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12"><h2 className="section-title gradient-text mb-6">{t.news.relatedArticles}</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{ra.map((a) => <ArticleCard key={a.id} article={a} />)}</div></section>}
    </div>
  )
}
