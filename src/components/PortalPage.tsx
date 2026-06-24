import { useState } from 'react'
import { useLang } from '../lib/LangContext'
import { useArticles, useCategories } from '../lib/hooks'
import ArticleCard from './ArticleCard'
import { ArticleGridSkeleton, ErrorDisplay } from './Skeletons'
import SEO from './SEO'
import type { Article } from '../lib/types'
interface PortalPageProps { portal: 'gaming' | 'tech' | 'science'; title: string; emoji: string; description: string; accent: 'orange' | 'neon' }
export default function PortalPage({ portal, title, emoji, description, accent }: PortalPageProps) {
  const { t } = useLang()
  const { categories, loading: catLoading } = useCategories(portal)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { articles, loading, error, retry } = useArticles({ portal, limit: 30 })
  const filtered = activeCategory ? articles.filter((a) => a.category?.slug === activeCategory) : articles
  const featured = filtered.filter((a: Article) => a.is_featured).slice(0, 1)
  const rest = filtered.filter((a: Article) => !featured.includes(a))
  const ac = accent === 'orange' ? 'text-orange border-orange' : 'text-neon border-neon'
  const ab = accent === 'orange' ? 'bg-orange/10' : 'bg-neon/10'
  const at = accent === 'orange' ? 'text-orange' : 'text-neon'
  if (error) return <ErrorDisplay message={t.common.noContent} onRetry={retry} />
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={title} description={description} />
      <div className="text-center mb-10"><div className="text-5xl mb-3">{emoji}</div><h1 className={`font-display text-3xl md:text-5xl font-bold mb-3 ${at}`}>{title}</h1><p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">{description}</p></div>
      {catLoading ? <div className="flex justify-center gap-2 mb-10">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-10 w-24 rounded-full skeleton-shimmer" />)}</div> : categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${!activeCategory ? `${ac} ${ab}` : 'border-white/10 text-gray-400 hover:text-white'}`}>{t.news.all}</button>
          {categories.map((c) => <button key={c.id} onClick={() => setActiveCategory(c.slug)} className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${activeCategory === c.slug ? `${ac} ${ab}` : 'border-white/10 text-gray-400 hover:text-white'}`}>{c.name}</button>)}
        </div>
      )}
      {loading ? <ArticleGridSkeleton count={6} />
      : filtered.length === 0 ? <div className="text-center py-20 text-gray-500">{t.common.noContent}</div>
      : <>{featured[0] && <div className="mb-8"><ArticleCard article={featured[0]} variant="featured" /></div>}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{rest.map((a: Article) => <ArticleCard key={a.id} article={a} />)}</div></>}
    </div>
  )
}
