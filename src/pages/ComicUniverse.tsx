import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import { useLang } from '../lib/LangContext'
import type { PublicNewsArticle } from '../services/news/publicNewsService'
import './ComicUniverse.css'

type ChannelId = 'all' | 'marvel' | 'dc' | 'anime' | 'screen' | 'comics'

const channelOrder: ChannelId[] = ['all', 'marvel', 'dc', 'anime', 'screen', 'comics']

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
    contentTitle: 'Transmisiones del universo',
    contentText: 'Las publicaciones aprobadas desde el CMS aparecen automáticamente en este panel.',
    loading: 'Sincronizando señales del multiverso…',
    emptyTitle: 'El portal está listo para su primera publicación',
    emptyText: 'La categoría Universo COMICON ya está conectada al CMS. Las noticias publicadas aparecerán acá, ordenadas por Marvel, DC, Anime y los demás canales.',
    noChannelTitle: 'Todavía no hay señales en este canal',
    noChannelText: 'Probá otro universo o volvé a ver todas las publicaciones.',
    read: 'Abrir transmisión',
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
    contentTitle: 'Universe transmissions',
    contentText: 'CMS-approved posts appear automatically in this panel.',
    loading: 'Synchronizing multiverse signals…',
    emptyTitle: 'The portal is ready for its first post',
    emptyText: 'The COMICON Universe category is already connected to the CMS. Published stories will appear here, organized across Marvel, DC, Anime and every other channel.',
    noChannelTitle: 'No signals in this channel yet',
    noChannelText: 'Try another universe or return to all posts.',
    read: 'Open transmission',
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

function getReadingMinutes(article: PublicNewsArticle) {
  const words = [article.summary ?? '', ...article.content.map((block) => block.text)]
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length
  return Math.max(1, Math.ceil(words / 180))
}

export default function ComicUniverse() {
  const { lang, localizePath } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const [articles, setArticles] = useState<PublicNewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const t = copy[lang]
  const requestedChannel = searchParams.get('channel') as ChannelId | null
  const activeChannel = requestedChannel && channelOrder.includes(requestedChannel) ? requestedChannel : 'all'

  useEffect(() => {
    let active = true
    setLoading(true)
    void import('../services/news/publicNewsService')
      .then(({ fetchPublishedNews }) => fetchPublishedNews('comicon'))
      .then((nextArticles) => {
        if (active) setArticles(nextArticles)
      })
      .catch(() => {
        if (active) setArticles([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const visibleArticles = useMemo(
    () => articles.filter((article) => matchesChannel(article, activeChannel)),
    [activeChannel, articles],
  )

  function selectChannel(channel: ChannelId) {
    const next = new URLSearchParams(searchParams)
    if (channel === 'all') next.delete('channel')
    else next.set('channel', channel)
    setSearchParams(next, { replace: true })
    window.requestAnimationFrame(() => document.getElementById('comicon-transmissions')?.focus({ preventScroll: true }))
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
              <a href="#comicon-channels">{t.channelsLabel} ↓</a>
              <Link to={localizePath('/news?category=comicon')}>{t.feed} ↗</Link>
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

        <section id="comicon-channels" className="xk-comicon-channels" aria-labelledby="comicon-channels-title">
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
        </section>

        <section id="comicon-transmissions" tabIndex={-1} className="xk-comicon-transmissions" aria-labelledby="comicon-content-title">
          <header>
            <div><p>LIVE_EDITORIAL_FEED</p><h2 id="comicon-content-title">{t.contentTitle}</h2></div>
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

          {visibleArticles.length > 0 ? (
            <div className="xk-comicon-articles">
              {visibleArticles.map((article) => {
                const readingMinutes = getReadingMinutes(article)
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
                      <small>{readingMinutes} {t.minutes} · {article.source_urls.length} {article.source_urls.length === 1 ? t.source : t.sources}</small>
                      <Link to={`/news/${article.slug}`}>{t.read} ↗</Link>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : null}
        </section>

        <aside className="xk-comicon-editorial" aria-labelledby="comicon-editorial-title">
          <div><span aria-hidden="true">!</span><h2 id="comicon-editorial-title">{t.editorialTitle}</h2></div>
          <ul>{t.editorialRules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
        </aside>
      </div>
    </main>
  )
}
