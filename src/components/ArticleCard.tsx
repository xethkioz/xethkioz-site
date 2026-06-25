import { Link } from 'react-router-dom'
import type { Article } from '../lib/types'
import { useLang } from '../lib/LangContext'
import SafeImage, { articleFallback } from './SafeImage'
interface ArticleCardProps { article: Article; variant?: 'default' | 'featured' | 'compact' | 'horizontal' | 'hero' }
function fd(d: string) { return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) }
export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { t } = useLang()
  const imgFallback = articleFallback(article.category?.portal, article.category?.slug)
  const img = article.cover_image
  const date = fd(article.published_at)
  if (variant === 'hero') return (
    <Link to={`/article/${article.slug}`} className="group relative block overflow-hidden rounded-2xl news-card card-hover h-full min-h-[400px]">
      <div className="absolute inset-0"><SafeImage src={img} fallback={imgFallback} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">{article.category && <span className="tag-orange">{article.category.name}</span>}{article.is_trending && <span className="tag border-red-500/50 text-red-400 bg-red-500/10">🔥 {t.home.trending}</span>}</div>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-3 line-clamp-3 group-hover:text-orange transition-colors">{article.title}</h2>
        <p className="text-sm md:text-base text-gray-300 line-clamp-2 mb-4 max-w-2xl">{article.excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400">{article.author && <span className="font-medium text-gray-300">{article.author.name}</span>}<span>•</span><span>{date}</span><span>•</span><span>{article.views.toLocaleString()} {t.home.views}</span></div>
      </div>
    </Link>
  )
  if (variant === 'featured') return (
    <Link to={`/article/${article.slug}`} className="group relative block overflow-hidden rounded-2xl news-card card-hover">
      <div className="aspect-[16/10] overflow-hidden"><SafeImage src={img} fallback={imgFallback} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        {article.category && <span className="tag-orange mb-3">{article.category.name}</span>}
        <h2 className="font-display text-lg md:text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-orange transition-colors">{article.title}</h2>
        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{article.excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400"><span>{article.author?.name}</span><span>•</span><span>{date}</span><span>•</span><span>{article.views.toLocaleString()} {t.home.views}</span></div>
      </div>
    </Link>
  )
  if (variant === 'compact') return (
    <Link to={`/article/${article.slug}`} className="group flex gap-3 items-start">
      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg"><SafeImage src={img} fallback={imgFallback} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /></div>
      <div className="flex-1 min-w-0">{article.category && <span className="text-xs text-orange font-medium">{article.category.name}</span>}<h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-orange transition-colors leading-snug">{article.title}</h3><span className="text-xs text-gray-500">{date}</span></div>
    </Link>
  )
  if (variant === 'horizontal') return (
    <Link to={`/article/${article.slug}`} className="group flex flex-col sm:flex-row gap-4 overflow-hidden rounded-xl news-card-purple card-hover">
      <div className="sm:w-48 aspect-[16/10] sm:aspect-auto overflow-hidden flex-shrink-0"><SafeImage src={img} fallback={imgFallback} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /></div>
      <div className="flex-1 p-4">{article.category && <span className="tag-purple mb-2">{article.category.name}</span>}<h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-neon transition-colors line-clamp-2">{article.title}</h3><p className="text-sm text-gray-400 line-clamp-2 mb-2">{article.excerpt}</p><div className="flex items-center gap-2 text-xs text-gray-500"><span>{article.author?.name}</span><span>•</span><span>{date}</span></div></div>
    </Link>
  )
  return (
    <Link to={`/article/${article.slug}`} className="group flex flex-col overflow-hidden rounded-xl news-card card-hover h-full">
      <div className="aspect-[16/10] overflow-hidden relative"><SafeImage src={img} fallback={imgFallback} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />{article.is_featured && <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold text-ink bg-orange rounded">⭐</span>}</div>
      <div className="flex-1 p-4 flex flex-col">{article.category && <span className="tag-orange self-start mb-2">{article.category.name}</span>}<h3 className="font-display text-base font-bold text-white mb-2 group-hover:text-orange transition-colors line-clamp-2 leading-snug">{article.title}</h3><p className="text-sm text-gray-400 line-clamp-2 mb-3 flex-1">{article.excerpt}</p><div className="flex items-center gap-2 text-xs text-gray-500"><span>{article.author?.name}</span><span>•</span><span>{date}</span><span>•</span><span>{article.views.toLocaleString()} {t.home.views}</span></div></div>
    </Link>
  )
}
