import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { useAuthors, useArticles } from '../lib/hooks'
import { AuthorGridSkeleton, ErrorDisplay } from '../components/Skeletons'
import SEO from '../components/SEO'
export default function Authors() {
  const { t } = useLang()
  const { authors, loading, error, retry } = useAuthors()
  const { articles } = useArticles({ limit: 100 })
  if (error) return <ErrorDisplay message={t.common.noContent} onRetry={retry} />
  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={t.author.title} description="XETHKIOZ authors and contributors" />
      <div className="text-center mb-10"><div className="text-5xl mb-3">✍️</div><h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">{t.author.title}</h1></div>
      {loading ? <AuthorGridSkeleton count={3} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => { const count = articles.filter((a) => a.author?.slug === author.slug).length; return (
            <Link key={author.id} to={`/author/${author.slug}`} className="group glass border border-white/10 rounded-2xl overflow-hidden card-hover hover:border-orange">
              <div className="p-6 text-center">{author.avatar_url && <img src={author.avatar_url} alt={author.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-orange/30 group-hover:border-orange transition-colors" />}<h3 className="font-display text-lg font-bold text-white group-hover:text-orange transition-colors">{author.name}</h3><p className="text-sm text-neon font-medium mt-1">{author.role}</p><p className="text-xs text-gray-500 mt-3 line-clamp-3">{author.bio}</p><div className="mt-4 text-xs text-gray-400">{count} {t.author.articles}</div></div>
            </Link>
          )})}
        </div>
      )}
    </div>
  )
}
