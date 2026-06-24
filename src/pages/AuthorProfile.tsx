import { useParams, Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { useAuthor, useArticles } from '../lib/hooks'
import ArticleCard from '../components/ArticleCard'
import { AuthorSkeleton, ArticleGridSkeleton, ErrorDisplay } from '../components/Skeletons'
import SEO from '../components/SEO'
export default function AuthorProfile() {
  const { slug } = useParams()
  const { t } = useLang()
  const { author, loading, error, retry } = useAuthor(slug)
  const { articles } = useArticles({ limit: 50 })
  const aa = articles.filter((a) => a.author?.slug === slug)
  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20"><AuthorSkeleton /></div>
  if (error) return <ErrorDisplay message={t.errors.notFoundDesc} onRetry={retry} />
  if (!author) return <div className="max-w-4xl mx-auto px-4 py-20 text-center"><p className="text-gray-500 mb-4">{t.errors.notFoundDesc}</p><Link to="/authors" className="text-orange hover:underline">← {t.common.back}</Link></div>
  return (
    <div className="animate-fade-in">
      <SEO title={author.name} description={author.bio || ''} type="article" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/authors" className="text-sm text-orange hover:neon-text-orange mb-6 inline-block">← {t.common.back}</Link>
        <div className="glass border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="aspect-square md:aspect-auto overflow-hidden">{author.avatar_url && <img src={author.avatar_url} alt={author.name} className="w-full h-full object-cover" />}</div>
            <div className="md:col-span-2 p-8"><h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">{author.name}</h1><p className="text-orange font-medium mb-4">{author.role}</p><p className="text-gray-400 leading-relaxed">{author.bio}</p><div className="mt-4 text-sm text-gray-500">{aa.length} {t.author.articles}</div></div>
          </div>
        </div>
      </div>
      {aa.length > 0 && <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12"><h2 className="section-title gradient-text mb-6">{t.author.articlesBy} {author.name}</h2><ArticleGridSkeleton count={3} /></section>}
    </div>
  )
}
