import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import PortalKnowledgeBriefing from '../components/PortalKnowledgeBriefing'
import OriginalComicFeature from '../components/comicon/OriginalComicFeature'
import ComiconLibrary from '../components/comicon/ComiconLibrary'
import { useLang } from '../lib/LangContext'
import { getPublicNewsReadingMetrics, publicNewsReadingDepthLabels, type PublicNewsArticle } from '../services/news/publicNewsService'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import './ComicUniverse.css'

type ChannelId = 'all' | 'marvel' | 'dc' | 'anime' | 'screen' | 'comics'
type ComiconView = 'overview' | 'comic' | 'archive' | 'news'

const channelOrder: ChannelId[] = ['all', 'marvel', 'dc', 'anime', 'screen', 'comics']
const viewOrder: ComiconView[] = ['overview', 'comic', 'archive', 'news']

const channelTags: Record<Exclude<ChannelId, 'all'>, string[]> = {
  marvel: ['marvel', 'mcu', 'x-men', 'avengers', 'spider-man'],
  dc: ['dc', 'dc-universe', 'dcu', 'batman', 'superman'],
  anime: ['anime', 'manga', 'japon', 'japan', 'shonen', 'seinen'],
  screen: ['cine', 'peliculas', 'series', 'streaming', 'movies', 'tv'],
  comics: ['comic', 'comics', 'tcg', 'coleccionables', 'cosplay', 'convenciones'],
}

const copy = {
  es: {
    seoTitle: 'Universo COMICON · Marvel, DC, Anime y cultura fan',
    seoDescription: 'Portal XETHKIOZ de Marvel, DC Universe, anime, manga, cine, series, cómics y cultura fan.',
    eyebrow: 'XK-04 // MULTIVERSE SIGNAL',
    titleTop: 'UNIVERSO',
    titleBottom: 'COMICON',
    intro: 'Noticias, estrenos, teorías, personajes y cultura fan reunidos en un universo propio. Cada publicación mantiene fuente, contexto y aviso de spoilers.',
    status: 'PORTAL EN LÍNEA',
    feed: 'Radar completo',
    heroAlt: 'Xethkioz dividido entre un superhéroe de luz y un villano de oscuridad, ilustrado en estilo cómic anime.',
    channelsLabel: 'Canales del multiverso',
    sectionsLabel: 'Secciones de Universo COMICON',
    overviewTitle: 'Elegí qué querés explorar',
    overviewText: 'La portada ahora funciona como un mapa: entrá al cómic original, al archivo de personajes o a las noticias sin recorrer todo el portal de una vez.',
    latestTitle: 'Últimas transmisiones',
    sections: {
      overview: { label: 'Portada', glyph: '⌂', description: 'Mapa y últimas señales' },
      comic: { label: 'Cómic original', glyph: '✎', description: 'La historia propia de XETHKIOZ' },
      archive: { label: 'Archivo', glyph: '▦', description: 'Personajes, obras y canales' },
      news: { label: 'Noticias', glyph: '◉', description: 'Estrenos y cultura fan' },
    },
    contentTitle: 'Transmisiones del universo',
    contentText: 'Las publicaciones aprobadas desde el CMS aparecen automáticamente en este panel.',
    loading: 'Sincronizando señales del multiverso…',
    emptyTitle: 'El portal está listo para su primera publicación',
    emptyText: 'La categoría Universo COMICON ya está conectada al CMS. Las noticias publicadas aparecerán acá, ordenadas por Marvel, DC, Anime y los demás canales.',
    noChannelTitle: 'Todavía no hay señales en este canal',
    noChannelText: 'Probá otro universo o volvé a ver todas las publicaciones.',
    read: 'Abrir transmisión',
    officialSource: 'Fuente oficial',
    source: 'fuente',
    sources: 'fuentes',
    minutes: 'min',
    editorialTitle: 'Código editorial del multiverso',
    editorialRules: [
      'Diferenciar anuncios oficiales, rumores y teorías.',
      'Avisar antes de revelar spoilers importantes.',
      'Acreditar artistas, autores, estudios y fuentes.',
      'No presentar fan art ni filtraciones como material oficial.',
    ],
    channels: {
      all: { label: 'Todo', glyph: '✦', title: 'Todo el multiverso', description: 'La señal completa, sin filtros.' },
      marvel: { label: 'Marvel', glyph: 'M', title: 'Marvel', description: 'MCU, cómics, héroes, villanos y próximos estrenos.' },
      dc: { label: 'DC Universe', glyph: 'DC', title: 'DC Universe', description: 'DCU, Elseworlds, cómics y mundos animados.' },
      anime: { label: 'Anime + Manga', glyph: 'ア', title: 'Anime y Manga', description: 'Series, películas, estudios, autores y cultura japonesa.' },
      screen: { label: 'Cine + Series', glyph: '▶', title: 'Cine y Series', description: 'Adaptaciones, streaming, trailers y calendarios.' },
      comics: { label: 'Cómics + Fan', glyph: '#', title: 'Cómics y Cultura Fan', description: 'Editoriales, TCG, cosplay, convenciones y coleccionismo.' },
    },
  },
  en: {
    seoTitle: 'COMICON Universe · Marvel, DC, Anime and fan culture',
    seoDescription: 'XETHKIOZ portal for Marvel, DC Universe, anime, manga, movies, series, comics and fan culture.',
    eyebrow: 'XK-04 // MULTIVERSE SIGNAL',
    titleTop: 'COMICON',
    titleBottom: 'UNIVERSE',
    intro: 'News, releases, theories, characters and fan culture gathered in a universe of their own. Every post keeps its source, context and spoiler warning.',
    status: 'PORTAL ONLINE',
    feed: 'Complete radar',
    heroAlt: 'Xethkioz split between a light superhero and a dark villain, illustrated in comic anime style.',
    channelsLabel: 'Multiverse channels',
    sectionsLabel: 'COMICON Universe sections',
    overviewTitle: 'Choose what you want to explore',
    overviewText: 'The front page now works as a map: enter the original comic, character archive or news without scrolling through the entire portal at once.',
    latestTitle: 'Latest transmissions',
    sections: {
      overview: { label: 'Overview', glyph: '⌂', description: 'Map and latest signals' },
      comic: { label: 'Original comic', glyph: '✎', description: 'XETHKIOZ original story' },
      archive: { label: 'Archive', glyph: '▦', description: 'Characters, works and channels' },
      news: { label: 'News', glyph: '◉', description: 'Releases and fan culture' },
    },
    contentTitle: 'Universe transmissions',
    contentText: 'CMS-approved posts appear automatically in this panel.',
    loading: 'Synchronizing multiverse signals…',
    emptyTitle: 'The portal is ready for its first post',
    emptyText: 'The COMICON Universe category is already connected to the CMS. Published stories will appear here, organized across Marvel, DC, Anime and every other channel.',
    noChannelTitle: 'No signals in this channel yet',
    noChannelText: 'Try another universe or return to all posts.',
    read: 'Open transmission',
    officialSource: 'Official source',
    source: 'source',
    sources: 'sources',
    minutes: 'min',
    editorialTitle: 'Multiverse editorial code',
    editorialRules: [
      'Separate official announcements, rumors and theories.',
      'Warn readers before revealing major spoilers.',
      'Credit artists, authors, studios and sources.',
      'Never present fan art or leaks as official material.',
    ],
    channels: {
      all: { label: 'All', glyph: '✦', title: 'The whole multiverse', description: 'The complete signal, without filters.' },
      marvel: { label: 'Marvel', glyph: 'M', title: 'Marvel', description: 'MCU, comics, heroes, villains and upcoming releases.' },
      dc: { label: 'DC Universe', glyph: 'DC', title: 'DC Universe', description: 'DCU, Elseworlds, comics and animated worlds.' },
      anime: { label: 'Anime + Manga', glyph: 'ア', title: 'Anime and Manga', description: 'Shows, movies, studios, authors and Japanese culture.' },
      screen: { label: 'Movies + TV', glyph: '▶', title: 'Movies and TV', description: 'Adaptations, streaming, trailers and calendars.' },
      comics: { label: 'Comics + Fans', glyph: '#', title: 'Comics and Fan Culture', description: 'Publishers, TCG, cosplay, conventions and collecting.' },
    },
  },
} as const

function normalizeToken(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function matchesChannel(article: PublicNewsArticle, channel: ChannelId) {
  if (channel === 'all') return true
  const haystack = article.tags.map(normalizeToken)
  return channelTags[channel].some((tag) => haystack.includes(normalizeToken(tag)))
}

function formatArticleDate(value: string, lang: 'es' | 'en') {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium' }).format(date)
}

function mergeUniqueArticles(primary: PublicNewsArticle[], fallback: PublicNewsArticle[]) {
  const slugs = new Set<string>()
  return [...primary, ...fallback]
    .filter((article) => {
      if (slugs.has(article.slug)) return false
      slugs.add(article.slug)
      return true
    })
    .sort((a, b) => new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime())
}

function getSourceHost(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return value
  }
}

export default function ComicUniverse() {
  const { lang } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const fallbackArticles = useMemo(() => getCuratedExternalNews('comicon'), [])
  const [articles, setArticles] = useState<PublicNewsArticle[]>(fallbackArticles)
  const [loading, setLoading] = useState(true)
  const t = copy[lang]
  const requestedChannel = searchParams.get('channel') as ChannelId | null
  const activeChannel = requestedChannel && channelOrder.includes(requestedChannel) ? requestedChannel : 'all'
  const requestedView = searchParams.get('view') as ComiconView | null
  const activeView = requestedView && viewOrder.includes(requestedView) ? requestedView : 'overview'

  useEffect(() => {
    let active = true
    setLoading(true)
    void import('../services/news/publicNewsService')
      .then(({ fetchPublishedNews }) => fetchPublishedNews('comicon'))
      .then((nextArticles) => {
        if (active) setArticles(mergeUniqueArticles(nextArticles, fallbackArticles))
      })
      .catch(() => {
        if (active) setArticles(fallbackArticles)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [fallbackArticles])

  const visibleArticles = useMemo(
    () => articles.filter((article) => matchesChannel(article, activeChannel)),
    [activeChannel, articles],
  )
  const displayedArticles = activeView === 'overview' ? visibleArticles.slice(0, 3) : visibleArticles

  function selectView(view: ComiconView) {
    const next = new URLSearchParams(searchParams)
    if (view === 'overview') next.delete('view')
    else next.set('view', view)
    if (view !== 'archive' && view !== 'news') next.delete('channel')
    setSearchParams(next, { replace: true })
    window.requestAnimationFrame(() => document.getElementById(`comicon-view-${view}`)?.focus({ preventScroll: true }))
  }

  function selectChannel(channel: ChannelId) {
    const next = new URLSearchParams(searchParams)
    if (channel === 'all') next.delete('channel')
    else next.set('channel', channel)
    setSearchParams(next, { replace: true })
    const target = activeView === 'archive' ? 'comicon-library-title' : 'comicon-content-title'
    window.requestAnimationFrame(() => document.getElementById(target)?.focus({ preventScroll: true }))
  }

  return (
    <main className="xk-comicon">
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        url="/comicon"
        image="/assets/xethkioz-light-shadow-comic-anime.webp"
        tags={['Marvel', 'DC Universe', 'anime', 'manga', 'cómics', 'cine', 'series']}
      />

      <div className="xk-comicon-grid" aria-hidden="true" />
      <div className="xk-comicon-shell">
        <section className="xk-comicon-hero" aria-labelledby="comicon-title">
          <div className="xk-comicon-hero-copy">
            <p>{t.eyebrow}</p>
            <h1 id="comicon-title"><span>{t.titleTop}</span>{t.titleBottom}</h1>
            <strong><i aria-hidden="true" /> {t.status}</strong>
            <div>{t.intro}</div>
            <nav aria-label={t.channelsLabel}>
              <button type="button" onClick={() => selectView('comic')}>{lang === 'es' ? 'Cómic original' : 'Original comic'} ↓</button>
              <button type="button" onClick={() => selectView('news')}>{t.feed} ↓</button>
            </nav>
          </div>

          <figure className="xk-comicon-art">
            <SafeImage
              src="/assets/xethkioz-light-shadow-comic-anime.webp"
              fallback="/assets/portal-comicon-world.svg"
              alt={t.heroAlt}
              loading="eager"
              fetchPriority="high"
            />
          </figure>
        </section>

        <nav className="xk-comicon-section-nav" aria-label={t.sectionsLabel}>
          {viewOrder.map((view) => {
            const item = t.sections[view]
            return (
              <button key={view} type="button" aria-current={activeView === view ? 'page' : undefined} onClick={() => selectView(view)}>
                <i aria-hidden="true">{item.glyph}</i>
                <span><b>{item.label}</b><small>{item.description}</small></span>
              </button>
            )
          })}
        </nav>

        {activeView === 'overview' ? (
          <section id="comicon-view-overview" tabIndex={-1} className="xk-comicon-overview" aria-labelledby="comicon-overview-title">
            <header><p>MULTIVERSE_MAP // 03</p><h2 id="comicon-overview-title">{t.overviewTitle}</h2><span>{t.overviewText}</span></header>
            <div>
              {viewOrder.slice(1).map((view) => {
                const item = t.sections[view]
                return <button key={view} type="button" onClick={() => selectView(view)}><i aria-hidden="true">{item.glyph}</i><span><b>{item.label}</b><small>{item.description}</small></span><strong aria-hidden="true">→</strong></button>
              })}
            </div>
          </section>
        ) : null}

        {activeView === 'comic' ? <div id="comicon-view-comic" tabIndex={-1}><OriginalComicFeature lang={lang} /></div> : null}

        {activeView === 'archive' || activeView === 'news' ? <section id={`comicon-view-${activeView}`} tabIndex={-1} className="xk-comicon-channels" aria-labelledby="comicon-channels-title">
          <header>
            <p>CHANNEL_SELECTOR // 05</p>
            <h2 id="comicon-channels-title">{t.channelsLabel}</h2>
          </header>
          <div>
            {channelOrder.map((channel) => {
              const item = t.channels[channel]
              return (
                <button
                  key={channel}
                  type="button"
                  data-channel={channel}
                  aria-pressed={activeChannel === channel}
                  onClick={() => selectChannel(channel)}
                >
                  <i aria-hidden="true">{item.glyph}</i>
                  <span><b>{item.title}</b><small>{item.description}</small></span>
                </button>
              )
            })}
          </div>
        </section> : null}

        {activeView === 'archive' ? <ComiconLibrary lang={lang} channel={activeChannel} /> : null}

        {activeView === 'overview' || activeView === 'news' ? <section id="comicon-transmissions" tabIndex={-1} className="xk-comicon-transmissions" aria-labelledby="comicon-content-title">
          <header>
            <div><p>LIVE_EDITORIAL_FEED</p><h2 id="comicon-content-title">{activeView === 'overview' ? t.latestTitle : t.contentTitle}</h2></div>
            <span>{t.contentText}</span>
          </header>

          {loading ? <p className="xk-comicon-loading" role="status">{t.loading}</p> : null}

          {!loading && articles.length === 0 ? (
            <div className="xk-comicon-empty">
              <span aria-hidden="true">01</span>
              <div><h3>{t.emptyTitle}</h3><p>{t.emptyText}</p></div>
            </div>
          ) : null}

          {!loading && articles.length > 0 && visibleArticles.length === 0 ? (
            <div className="xk-comicon-empty">
              <span aria-hidden="true">00</span>
              <div><h3>{t.noChannelTitle}</h3><p>{t.noChannelText}</p></div>
            </div>
          ) : null}

          {displayedArticles.length > 0 ? (
            <div className="xk-comicon-articles">
              {displayedArticles.map((article) => {
                const reading = getPublicNewsReadingMetrics(article)
                const officialSource = article.source_urls[0]
                return (
                  <article key={article.id}>
                    <SafeImage
                      src={article.cover_image_url || '/assets/portal-comicon-world.svg'}
                      fallback="/images/articles/fallback.svg"
                      alt={article.cover_image_alt || ''}
                      loading="lazy"
                      fetchPriority="low"
                    />
                    <div>
                      <p><b>{t.channels[activeChannel].label}</b><span>{formatArticleDate(article.published_at ?? article.created_at, lang)}</span></p>
                      <h3>{article.title}</h3>
                      <div>{article.summary}</div>
                      <small>{reading.minutes} {t.minutes} · {publicNewsReadingDepthLabels[lang][reading.depth]} · {article.source_urls.length} {article.source_urls.length === 1 ? t.source : t.sources}</small>
                      <div className="xk-comicon-article-actions">
                        <Link to={`/news/${article.slug}`}>{t.read} ↗</Link>
                        {officialSource ? <a href={officialSource} target="_blank" rel="noopener noreferrer">{t.officialSource}: {getSourceHost(officialSource)} ↗</a> : null}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : null}
          {activeView === 'overview' && visibleArticles.length > displayedArticles.length ? <button className="xk-comicon-more" type="button" onClick={() => selectView('news')}>{lang === 'es' ? 'Ver todas las noticias' : 'View all news'} →</button> : null}
        </section> : null}

        {activeView === 'overview' ? <PortalKnowledgeBriefing sector="comicon" lang={lang} /> : null}

        {activeView === 'news' ? <aside className="xk-comicon-editorial" aria-labelledby="comicon-editorial-title">
          <div><span aria-hidden="true">!</span><h2 id="comicon-editorial-title">{t.editorialTitle}</h2></div>
          <ul>{t.editorialRules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
        </aside> : null}
      </div>
    </main>
  )
}
