import { useLang } from '../lib/LangContext'
import { useStreams } from '../lib/hooks'
import { StreamGridSkeleton, ErrorDisplay } from '../components/Skeletons'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import ChatOverlay from '../components/ChatOverlay'
import { Link } from 'react-router-dom'
export default function Streaming() {
  const { t } = useLang()
  const { streams, loading, error, retry } = useStreams()
  const { streams: liveStreams, loading: liveLoading } = useStreams({ live: true })
  const { streams: featuredStreams, loading: featuredLoading } = useStreams({ featured: true })
  const platforms = ['youtube', 'twitch', 'kick']
  const pc: Record<string, string> = { youtube: 'bg-red-600', twitch: 'bg-neon-600', kick: 'bg-green-600' }
  if (error) return <ErrorDisplay message={t.common.noContent} onRetry={retry} />
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={t.streaming.title} description="YouTube • Kick • Twitch" />
      <div className="text-center mb-10"><div className="text-5xl mb-3">📺</div><h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">{t.streaming.title}</h1><p className="text-gray-400">YouTube • Kick • Twitch</p><div className="mt-5 flex flex-col sm:flex-row justify-center gap-3"><Link to="/streaming/chat-overlay" className="btn-primary">Ver Chat Overlay</Link><a href="https://kick.com/xethkioz" target="_blank" rel="noopener noreferrer" className="btn-secondary">Abrir Kick</a></div></div>
      <div className="mb-12"><ChatOverlay compact /></div>
      {loading ? (
        <>
          <section className="mb-12"><h2 className="section-title flex items-center gap-2 mb-6"><span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />Live</h2><StreamGridSkeleton count={3} /></section>
          {platforms.map((p) => (
            <section key={p} className="mb-12"><h2 className="section-title mb-6 capitalize"><span className={`inline-block w-2 h-6 ${pc[p]} rounded mr-2 align-middle`} />{p}</h2><StreamGridSkeleton count={4} /></section>
          ))}
        </>
      ) : (
        <>
          {liveStreams.length > 0 && <section className="mb-12"><h2 className="section-title text-red-500 mb-6 flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />{t.streaming.live}</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{liveStreams.map((s) => <a key={s.id} href={s.channel_url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-xl news-card border-red-500/30 card-hover"><div className="aspect-video overflow-hidden"><SafeImage src={s.thumbnail} fallback="/images/articles/streaming.svg" alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /></div><span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded animate-pulse">{t.streaming.live}</span><div className="p-4"><h3 className="font-display text-sm font-bold text-white group-hover:text-orange transition-colors">{s.title}</h3><p className="text-xs text-gray-500 mt-1">{s.channel_name}</p></div></a>)}</div></section>}
          {platforms.map((p) => { const ps = streams.filter((s) => s.platform === p); if (!ps.length) return null; return (
            <section key={p} className="mb-12"><h2 className="section-title mb-6 capitalize"><span className={`inline-block w-2 h-6 ${pc[p]} rounded mr-2 align-middle`} />{p}</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{ps.map((s) => <a key={s.id} href={s.channel_url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-xl news-card card-hover"><div className="aspect-video overflow-hidden"><SafeImage src={s.thumbnail} fallback="/images/articles/streaming.svg" alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /></div><span className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold text-white ${pc[p]} rounded uppercase`}>{s.platform}</span><div className="p-4"><h3 className="font-display text-sm font-bold text-white group-hover:text-orange transition-colors line-clamp-2">{s.title}</h3><p className="text-xs text-gray-500 mt-1">{s.channel_name}</p><p className="text-xs text-gray-600 mt-1">{s.views.toLocaleString()} {t.home.views}</p></div></a>)}</div></section>
          )})}
          {!featuredLoading && featuredStreams.length > 0 && <section className="mb-12"><h2 className="section-title gradient-text mb-6">⭐ {t.streaming.highlights}</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{featuredStreams.map((s) => <a key={s.id} href={s.channel_url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-xl news-card border-orange/30 card-hover"><div className="aspect-video overflow-hidden"><SafeImage src={s.thumbnail} fallback="/images/articles/streaming.svg" alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /></div><span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white bg-orange rounded">⭐</span><div className="p-4"><h3 className="font-display text-sm font-bold text-white group-hover:text-orange transition-colors line-clamp-2">{s.title}</h3><p className="text-xs text-gray-500 mt-1">{s.channel_name}</p></div></a>)}</div></section>}
        </>
      )}
    </div>
  )
}
