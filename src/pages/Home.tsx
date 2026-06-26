import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { useArticles, useStreams } from '../lib/hooks'
import ArticleCard from '../components/ArticleCard'
import SocialSection from '../components/SocialSection'
import Logo from '../components/Logo'
import SEO from '../components/SEO'
import { ArticleGridSkeleton, ErrorDisplay } from '../components/Skeletons'
import SafeImage from '../components/SafeImage'
import ActivityPulsePanel from '../components/ActivityPulsePanel'
import { editorialLanes, homeKpis, homePortals } from '../lib/editorialModel'

const portalAccent = {
  orange: 'border-orange/30 bg-orange/10 text-orange hover:border-orange/70',
  purple: 'border-neon/30 bg-neon/10 text-neon hover:border-neon/70',
  blue: 'border-sky-400/30 bg-sky-400/10 text-sky-200 hover:border-sky-300/70',
  green: 'border-green-400/30 bg-green-400/10 text-green-200 hover:border-green-300/70',
} as const

function SectionHeader({ eyebrow, title, actionTo, actionLabel }: { eyebrow?: string; title: string; actionTo?: string; actionLabel?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2 className="section-title gradient-text">{title}</h2>
      </div>
      {actionTo && actionLabel && <Link to={actionTo} className="text-sm text-orange hover:neon-text-orange transition-all whitespace-nowrap">{actionLabel} →</Link>}
    </div>
  )
}

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

      <section className="relative overflow-hidden px-4 pt-10 pb-10 md:pt-14 md:pb-14">
        <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.04fr_.96fr]">
          <div className="animate-fade-up">
            <div className="mb-5 flex justify-center overflow-visible px-2 lg:justify-start">
              <Logo size="xl" className="animate-glow-pulse max-w-full" />
            </div>
            <h1 className="sr-only">XETHKIOZ - Gaming, tecnología, ciencia y streaming</h1>
            <p className="section-eyebrow">XETHKIOZ NETWORK / RC3</p>
            <h2 className="font-display text-3xl font-black leading-tight text-white md:text-6xl">
              Gaming, tecnología, ciencia y comunidad en una sola plataforma.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              🚀 {t.slogan}. La portada ahora trabaja como hub editorial: menos saturación, más jerarquía, portales claros y rutas listas para CMS, roles, chat y automatización.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/news" className="btn-primary">Ver noticias</Link>
              <Link to="/cms" className="btn-secondary">CMS Studio</Link>
              <Link to="/network" className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 font-semibold text-gray-200 transition-all hover:border-orange/40 hover:text-orange">Mapa Network</Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-orange/25 bg-ink-300 shadow-[0_0_45px_rgba(255,106,0,0.12)] animate-fade-up" style={{ animationDelay: '0.08s' }}>
            <video
              className="h-full min-h-[270px] w-full object-cover opacity-95"
              src="/videos/xethkioz-pixel-banner.mp4"
              poster="/images/articles/gaming.svg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="XETHKIOZ pixel art animated banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
              <p className="section-eyebrow mb-1">LIVE WORLD</p>
              <h2 className="font-display text-2xl font-black text-white drop-shadow-lg md:text-3xl">El portal está vivo</h2>
              <p className="mt-1 max-w-xl text-sm text-gray-300">Noticias, comunidad, streaming y laboratorios conectados bajo una misma identidad.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {homeKpis.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
              <p className="mt-2 font-display text-2xl font-black text-white">{item.value}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <ActivityPulsePanel />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <SectionHeader eyebrow="Portales principales" title="Elegí el nodo de entrada" actionTo="/network" actionLabel={t.home.viewAll} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {homePortals.map((portal) => (
            <Link key={portal.title} to={portal.path} className={`group rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1 ${portalAccent[portal.accent]}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-4xl">{portal.icon}</span>
                <span className="rounded-full border border-current/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] opacity-80">{portal.eyebrow}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-black text-white group-hover:text-current">{portal.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">{portal.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {portal.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[10px] text-gray-300">{tag}</span>)}
              </div>
            </Link>
          ))}
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <SectionHeader eyebrow="XETHKIOZ NEWS" title={t.sections.featuredNews} actionTo="/news" actionLabel={t.home.viewAll} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><ArticleCard article={hero} variant="hero" /></div>
            <div className="flex flex-col gap-4">{side.map((a) => <ArticleCard key={a.id} article={a} variant="compact" />)}</div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <SectionHeader eyebrow="Content OS" title="Carriles editoriales RC3" actionTo="/content-system" actionLabel="Sistema" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {editorialLanes.map((lane) => (
            <Link key={lane.label} to={lane.route} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all hover:border-orange/40 hover:bg-orange/5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-black text-white">{lane.label}</h3>
                <span className="rounded-full border border-orange/30 bg-orange/10 px-2 py-1 text-[10px] font-bold uppercase text-orange">{lane.state}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{lane.detail}</p>
            </Link>
          ))}
        </div>
      </section>

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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <SectionHeader title={`🔥 ${t.sections.trendingNews}`} actionTo="/news" actionLabel={t.home.viewAll} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SectionHeader title={`📰 ${t.sections.latestNews}`} />
            {latestLoading ? (
              <ArticleGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latest.slice(0, 4).map((a) => <ArticleCard key={a.id} article={a} />)}
              </div>
            )}
          </div>
          {editorsPicks.length > 0 && (
            <aside className="rounded-3xl border border-neon/20 bg-neon/5 p-5">
              <h2 className="section-title gradient-text-purple mb-6">⭐ {t.sections.editorsPicks}</h2>
              <div className="flex flex-col gap-4">{editorsPicks.map((a) => <ArticleCard key={a.id} article={a} variant="compact" />)}</div>
            </aside>
          )}
        </div>
      </section>

      {(streamsLoading || streams.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <SectionHeader title={`📺 ${t.sections.featuredStreams}`} actionTo="/streaming" actionLabel={t.home.viewAll} />
          {streamsLoading ? (
            <ArticleGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {streams.slice(0, 3).map((s) => (
                <a key={s.id} href={s.channel_url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-xl news-card card-hover">
                  <div className="aspect-video overflow-hidden">
                    <SafeImage src={s.thumbnail} fallback="/images/articles/streaming.svg" alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-16">
          <SectionHeader title={`📈 ${t.sections.popularArticles}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{popular.map((a) => <ArticleCard key={a.id} article={a} variant="horizontal" />)}</div>
        </section>
      )}
    </div>
  )
}
