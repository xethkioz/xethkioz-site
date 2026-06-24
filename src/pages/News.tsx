import { useState, useMemo } from 'react'
import { useLang } from '../lib/LangContext'
import { useArticles, useCategories } from '../lib/hooks'
import ArticleCard from '../components/ArticleCard'
import { ArticleGridSkeleton, CategorySkeleton, ErrorDisplay } from '../components/Skeletons'
import SEO from '../components/SEO'
export default function News() {
  const { t } = useLang()
  const { articles, loading, error, retry } = useArticles({ limit: 50 })
  const { categories, loading: catLoading } = useCategories()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const filtered = useMemo(() => {
    let r = articles
    if (activeCategory) r = r.filter((a) => a.category?.slug === activeCategory)
    if (search) { const q = search.toLowerCase(); r = r.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q) || a.tags.some((tag) => tag.toLowerCase().includes(q))) }
    return r
  }, [articles, activeCategory, search])
  const featured = filtered.filter((a) => a.is_featured).slice(0, 1)
  const rest = filtered.filter((a) => !featured.includes(a))
  if (error) return <ErrorDisplay message={t.common.noContent} onRetry={retry} />
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={t.news.title} description={t.news.subtitle} />
      <div className="text-center mb-8"><p className="section-eyebrow">XETHKIOZ</p><h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">📰 {t.news.title}</h1><p className="text-gray-400 text-sm md:text-base">{t.news.subtitle}</p></div>
      <div className="max-w-2xl mx-auto mb-8"><div className="relative"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search.placeholder} className="input-field pl-12 rounded-full" /><svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div></div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${!activeCategory ? 'text-orange border-orange bg-orange/10' : 'border-white/10 text-gray-400 hover:text-white'}`}>{t.news.all}</button>
        {catLoading ? [...Array(5)].map((_, i) => <CategorySkeleton key={i} />) : categories.map((c) => <button key={c.id} onClick={() => setActiveCategory(c.slug)} className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${activeCategory === c.slug ? 'text-orange border-orange bg-orange/10' : 'border-white/10 text-gray-400 hover:text-white'}`}>{c.name}</button>)}
      </div>
      {loading ? <ArticleGridSkeleton count={6} />
      : filtered.length === 0 ? <div className="text-center py-20 text-gray-500">{t.search.noResults}</div>
      : <>{featured[0] && <div className="mb-8"><ArticleCard article={featured[0]} variant="featured" /></div>}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{rest.map((a) => <ArticleCard key={a.id} article={a} />)}</div></>}
    </div>
  )
}
