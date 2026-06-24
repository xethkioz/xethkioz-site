import { useState } from 'react'
import { useLang } from '../lib/LangContext'
import { useMedia } from '../lib/hooks'
import { MediaGridSkeleton, ErrorDisplay } from '../components/Skeletons'
import SEO from '../components/SEO'
export default function Media() {
  const { t } = useLang()
  const [activeType, setActiveType] = useState<string | null>(null)
  const { media, loading, error, retry } = useMedia(activeType || undefined)
  const types = [{ key: 'image', label: t.media.images, icon: '🖼️' }, { key: 'video', label: t.media.videos, icon: '🎬' }, { key: 'short', label: t.media.shorts, icon: '📱' }, { key: 'reel', label: t.media.reels, icon: '🎞️' }, { key: 'carousel', label: t.media.carousels, icon: '🎠' }]
  const tb: Record<string, string> = { image: 'bg-blue-600', video: 'bg-red-600', short: 'bg-orange', reel: 'bg-neon', carousel: 'bg-green-600' }
  if (error) return <ErrorDisplay message={t.common.noContent} onRetry={retry} />
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={t.media.title} description={t.media.library} />
      <div className="text-center mb-10"><div className="text-5xl mb-3">🎬</div><h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">{t.media.title}</h1><p className="text-gray-400">{t.media.library}</p></div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button onClick={() => setActiveType(null)} className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${!activeType ? 'text-orange border-orange bg-orange/10' : 'border-white/10 text-gray-400 hover:text-white'}`}>{t.news.all}</button>
        {types.map((tp) => <button key={tp.key} onClick={() => setActiveType(tp.key)} className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${activeType === tp.key ? 'text-orange border-orange bg-orange/10' : 'border-white/10 text-gray-400 hover:text-white'}`}>{tp.icon} {tp.label}</button>)}
      </div>
      {loading ? <MediaGridSkeleton count={6} />
      : media.length === 0 ? <div className="text-center py-20 text-gray-500">{t.common.noContent}</div>
      : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{media.map((m) => <div key={m.id} className="group relative overflow-hidden rounded-xl news-card card-hover"><div className="aspect-[4/3] overflow-hidden"><img src={m.thumbnail || m.url} alt={m.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" /></div>{m.is_featured && <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white bg-orange rounded">⭐ {t.media.featured}</span>}<span className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold text-white ${tb[m.type]} rounded uppercase`}>{m.type}</span><div className="p-4"><h3 className="font-display text-sm font-bold text-white group-hover:text-orange transition-colors">{m.title}</h3>{m.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{m.description}</p>}</div></div>)}</div>}
    </div>
  )
}
