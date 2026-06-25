import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { useArticles, useStreams } from '../lib/hooks'
import ArticleCard from '../components/ArticleCard'
import SocialSection from '../components/SocialSection'
import Logo from '../components/Logo'
import SEO from '../components/SEO'
import { ArticleGridSkeleton, ErrorDisplay } from '../components/Skeletons'

export default function Home() {
  const { t } = useLang()

  const { articles: featured, loading: featuredLoading, error: featuredError, retry: retryFeatured } = useArticles({ featured: true, limit: 5 })
  const { articles: trending, loading: trendingLoading, error: trendingError, retry: retryTrending } = useArticles({ trending: true, limit: 6 })
  const { articles: latest, loading: latestLoading } = useArticles({ limit: 8 })
  const { articles: editorsPicks } = useArticles({ editorsPick: true, limit: 4 })
  const { articles: popular } = useArticles({ popular: true, limit: 4 })
  const { streams, loading: streamsLoading } = useStreams({ featured: true })

  const hero = featured[0]
  const side = featured.slice(1, 5)

  return (
    <div className="animate-fade-in">
      <SEO />

      <section className="relative px-4 pt-10 pb-12 md:pt-14 md:pb-16 overflow-visible">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto w-full">
          <div className="text-center mb-8 md:mb-10 animate-fade-up">
            <div className="flex justify-center mb-5 px-2 overflow-visible">
              <Logo size="xl" className="animate-glow-pulse max-w-full" />
            </div>
            <h1 className="sr-only">XETHKIOZ - Gaming, tecnología, ciencia y streaming</h1>
            <p className="font-display text-base sm:text-lg md:text-2xl text-gray-300 tracking-wide">
              🚀 {t.slogan}
            </p>
            <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
              <span className="h-1 w-12 bg-orange rounded-full" />
              <span className="h-1 w-4 bg-neon rounded-full" />
              <span className="h-1 w-12 bg-orange rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <Link
              to="/gaming"
              className="group relative overflow-hidden rounded-2xl glass border-2 border-orange/30 hover:border-orange transition-all duration-500 animate-fade-up min-h-[260px]"
              style={{ animationDelay: '0.15s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange/20 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative h-full p-6 sm:p-8 md:p-10 flex flex-col">
                <div className="text-4xl sm:text-5xl mb-4">🎮</div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-orange transition-colors">
                  {t.home.gamingPortal}
                </h2>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Gaming News • Esports • Reviews • MMORPG • Pokémon • LoL • Mobile Legends • Fortnite • GTA • Streaming
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Esports', 'LoL', 'Pokémon', 'MLBB', 'Fortnite', 'GTA', 'MMORPG', 'Reviews'].map((tag) => (
                    <span key={tag} className="tag-orange text-xs">{tag}</span>
                  ))}
                </div>
                <span className="mt-auto inline-flex items-center gap-2 text-orange font-semibold group-hover:gap-3 transition-all">
                  {t.home.enterGaming}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link
              to="/tech"
              className="group relative overflow-hidden rounded-2xl glass border-2 border-neon/30 hover:border-neon transition-all duration-500 animate-fade-up min-h-[260px]"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon/20 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative h-full p-6 sm:p-8 md:p-10 flex flex-col">
                <div className="text-4xl sm:text-5xl mb-4">🚀</div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-neon transition-colors">
                  {t.home.techPortal}
                </h2>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Artificial Intelligence • Technology • Science • Space • Innovation • Medicine • Future Technology • Discoveries
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['AI', 'Hardware', 'Space', 'Medicine', 'Biology', 'Physics', 'Innovation', 'Future'].map((tag) => (
                    <span key={tag} className="tag-purple text-xs">{tag}</span>
                  ))}
                </div>
                <span className="mt-auto inline-flex items-center gap-2 text-neon font-semibold group-hover:gap-3 transition-all">
                  {t.home.enterTech}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {featuredError && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <ErrorDisplay message={featuredError.message} onRetry={retryFeatured} />
        </section>
      )}

      {featuredLoading && !featuredError && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <ArticleGridSkeleton count={3} />
        </section>
      )}

      {hero && !featuredLoading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <p className="section-eyebrow">XETHKIOZ NEWS</p>
              <h2 className="section-title gradient-text">{t.sections.featuredNews}</h2>
            </div>
            <Link to="/news" className="text-sm text-orange hover:neon-text-orange transition-all whitespace-nowrap">
              {t.home.viewAll} →
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><ArticleCard article={hero} variant="hero" /></div>
            <div className="flex flex-col gap-4">{side.map((a) => <ArticleCard key={a.id} article={a} variant="compact" />)}</div>
          </div>
        </section>
      )}

      {trendingError && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <ErrorDisplay message={trendingError.message} onRetry={retryTrending} />
        </section>
      )}

      {trendingLoading && !trendingError && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <ArticleGridSkeleton count={6} />
        </section>
      )}

      {trending.length > 0 && !trendingLoading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-6 gap-4">
            <h2 className="section-title gradient-text">🔥 {t.sections.trendingNews}</h2>
            <Link to="/news" className="text-sm text-orange hover:neon-text-orange transition-all whitespace-nowrap">
              {t.home.viewAll} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="section-title gradient-text mb-6">📰 {t.sections.latestNews}</h2>
            {latestLoading ? (
              <ArticleGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latest.slice(0, 4).map((a) => <ArticleCard key={a.id} article={a} />)}
              </div>
            )}
          </div>
          {editorsPicks.length > 0 && (
            <div>
              <h2 className="section-title gradient-text-purple mb-6">⭐ {t.sections.editorsPicks}</h2>
              <div className="flex flex-col gap-4">{editorsPicks.map((a) => <ArticleCard key={a.id} article={a} variant="compact" />)}</div>
            </div>
          )}
        </div>
      </section>

      {(streamsLoading || streams.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-6 gap-4">
            <h2 className="section-title gradient-text">📺 {t.sections.featuredStreams}</h2>
            <Link to="/streaming" className="text-sm text-orange hover:neon-text-orange transition-all whitespace-nowrap">
              {t.home.viewAll} →
            </Link>
          </div>
          {streamsLoading ? (
            <ArticleGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {streams.slice(0, 3).map((s) => (
                <a key={s.id} href={s.channel_url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-xl news-card card-hover">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={s.thumbnail || 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  {s.is_live && <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded animate-pulse">{t.home.liveBadge}</span>}
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold text-white bg-black/60 rounded uppercase">{s.platform}</span>
                  <div className="p-4">
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-orange transition-colors line-clamp-2">{s.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{s.channel_name}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}

      <SocialSection />

      {popular.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="section-title gradient-text mb-6">📈 {t.sections.popularArticles}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{popular.map((a) => <ArticleCard key={a.id} article={a} variant="horizontal" />)}</div>
        </section>
      )}
    </div>
  )
}
