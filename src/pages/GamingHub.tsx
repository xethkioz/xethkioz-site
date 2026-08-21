import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import PublicAdSlot from '../components/ads/PublicAdSlot'
import PortalKnowledgeBriefing from '../components/PortalKnowledgeBriefing'
import GamingGuideRotation from '../components/gaming/GamingGuideRotation'
import { useLang } from '../lib/LangContext'
import { STREAM_LINKS } from '../lib/siteConfig'
import { supabase } from '../lib/supabase'
import type { Stream } from '../lib/types'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { fetchPublishedNews, formatPublicNewsDate, type PublicNewsArticle } from '../services/news/publicNewsService'

type GamingSection = 'overview' | 'guides' | 'live' | 'news' | 'community'

const content = {
  es: {
    title: 'NEXUS GAMING',
    kicker: 'TEMPORADA 01 // EL PORTAL ESTÁ ABIERTO',
    description: 'Noticias, guías, directos y comunidad gamer organizados por ruta para encontrar rápido qué jugar o hacer.',
    heroAlt: 'Guerrero anime frente a un portal gamer de neón',
    switchLanguage: 'Cambiar a inglés',
    switchCode: 'EN',
    back: 'Salir del nexus',
    guides: 'Guías',
    radar: 'Radar gamer',
    community: 'Buscar escuadrón',
    dispatch: 'RADAR GAMING',
    read: 'Abrir noticia',
    signal: 'noticias en radar',
    heroActionsLabel: 'Accesos principales de Gaming',
    heroGuides: 'ABRIR GUÍAS',
    heroRadar: 'VER RADAR',
    systemStatus: 'Resumen de Gaming',
    nexusLink: 'RUTAS DISPONIBLES',
    routeCount: '5',
    stream: {
      label: 'RADAR_STREAM',
      syncing: 'SINCRONIZANDO',
      liveCms: 'SEÑAL MARCADA EN VIVO EN EL CMS',
      standby: 'CANAL EN ESPERA',
      heading: 'Directos y videos en un solo punto',
      liveDescription: 'La señal está marcada como activa en el CMS. Podés entrar al canal y seguir la transmisión.',
      standbyDescription: 'Abrí Kick para comprobar el directo o continuá con los últimos videos de YouTube.',
      openLive: 'ENTRAR AL DIRECTO',
      openKick: 'ABRIR KICK',
      latestVod: 'VER ÚLTIMO VOD',
      openYoutube: 'VER YOUTUBE',
      live: 'LIVE',
      offline: 'ESPERA',
    },
    utilityLabel: 'Opciones para participar en Gaming',
    communityInfo: {
      eyebrow: 'PARTY_READY // ANTES DE ENTRAR',
      title: 'Prepará tu perfil para encontrar grupo',
      text: 'Tres datos simples ayudan a conectar con personas que buscan la misma experiencia.',
      items: [
        ['PERFIL', 'Usá un nombre reconocible y una presentación breve'],
        ['JUEGO', 'Indicá servidor, plataforma y horario habitual'],
        ['CONVIVENCIA', 'Respetá las reglas y evitá compartir datos privados'],
      ],
    },
    party: {
      eyebrow: 'PARTY_BOARD // BUILDS & SERVIDORES',
      title: 'Entrá a jugar con la comunidad',
      items: [
        { code: '4 GUÍAS', title: 'WoW, Diablo IV, FFXIV y Path of Exile', action: 'Abrir biblioteca', to: '/gaming/guides' },
        { code: 'RADAR', title: 'Estrenos y juegos que vienen', action: 'Ver tendencias', to: '/news?category=gaming' },
        { code: 'PARTY', title: 'Compartí tu build y armá grupo', action: 'Entrar a la comunidad', to: '/community' },
      ],
    },
    featured: 'NOTICIA DESTACADA',
    offline: 'NEXUS OFFLINE // Las señales volverán en breve.',
    sponsor: 'SPONSOR DE XETHKIOZ GAMING',
    sectionLabel: 'Secciones de Gaming',
    sections: { overview: 'Inicio', guides: 'Guías', live: 'Directos', news: 'Radar', community: 'Comunidad' },
    start: {
      eyebrow: 'NEXUS GAMING // ELEGÍ UNA RUTA',
      title: 'Todo Gaming, sin perderte',
      description: 'Abrí solamente la sección que necesitás. El resto permanece fuera del camino.',
      cards: [
        { id: 'guides', code: 'BUILD', title: 'Guías y builds completas', detail: 'WoW, Diablo IV, FFXIV y PoE 2 por clase, equipo y rotación.', action: 'ABRIR GUÍAS', to: '/gaming/guides' },
        { id: 'news', code: 'RADAR', title: 'Noticias y lanzamientos', detail: 'Señales gaming verificadas y ordenadas por fecha.', action: 'VER RADAR', to: '?section=news' },
        { id: 'live', code: 'LIVE', title: 'Directos y videos', detail: 'Kick, YouTube y estado de transmisión.', action: 'ABRIR SEÑAL', to: '?section=live' },
        { id: 'community', code: 'PARTY', title: 'Comunidad y escuadrones', detail: 'Buscá grupo, compartí builds y entrá al Nexus.', action: 'BUSCAR PARTY', to: '?section=community' },
      ],
    },
  },
  en: {
    title: 'GAMING NEXUS',
    kicker: 'SEASON 01 // THE PORTAL IS OPEN',
    description: 'Gaming news, guides, streams and community organized by route so you can quickly find what to play or do.',
    heroAlt: 'Anime warrior standing before a neon gaming portal',
    switchLanguage: 'Switch to Spanish',
    switchCode: 'ES',
    back: 'Leave the nexus',
    guides: 'Guides',
    radar: 'Gaming radar',
    community: 'Find a squad',
    dispatch: 'GAMING RADAR',
    read: 'Open story',
    signal: 'stories in radar',
    heroActionsLabel: 'Primary Gaming shortcuts',
    heroGuides: 'OPEN GUIDES',
    heroRadar: 'OPEN RADAR',
    systemStatus: 'Gaming summary',
    nexusLink: 'AVAILABLE ROUTES',
    routeCount: '5',
    stream: {
      label: 'STREAM_RADAR',
      syncing: 'SYNCING',
      liveCms: 'SIGNAL MARKED LIVE IN THE CMS',
      standby: 'CHANNEL STANDBY',
      heading: 'Streams and videos in one place',
      liveDescription: 'The signal is marked active in the CMS. Open the channel to follow the broadcast.',
      standbyDescription: 'Open Kick to check the live channel or continue with the latest YouTube videos.',
      openLive: 'ENTER LIVE STREAM',
      openKick: 'OPEN KICK',
      latestVod: 'WATCH LATEST VOD',
      openYoutube: 'OPEN YOUTUBE',
      live: 'LIVE',
      offline: 'STANDBY',
    },
    utilityLabel: 'Ways to participate in Gaming',
    communityInfo: {
      eyebrow: 'PARTY_READY // BEFORE JOINING',
      title: 'Prepare your profile to find a group',
      text: 'Three simple details help connect you with people looking for the same experience.',
      items: [
        ['PROFILE', 'Use a recognizable name and a short introduction'],
        ['GAME', 'Add your server, platform and usual schedule'],
        ['SAFETY', 'Follow the rules and avoid sharing private data'],
      ],
    },
    party: {
      eyebrow: 'PARTY_BOARD // BUILDS & SERVERS',
      title: 'Join the community and play',
      items: [
        { code: '4 GUIDES', title: 'WoW, Diablo IV, FFXIV and Path of Exile', action: 'Open library', to: '/gaming/guides' },
        { code: 'RADAR', title: 'Releases and upcoming games', action: 'View trends', to: '/news?category=gaming' },
        { code: 'PARTY', title: 'Share your build and form a group', action: 'Enter the community', to: '/community' },
      ],
    },
    featured: 'FEATURED STORY',
    offline: 'NEXUS OFFLINE // Signals will return shortly.',
    sponsor: 'XETHKIOZ GAMING SPONSOR',
    sectionLabel: 'Gaming sections',
    sections: { overview: 'Start', guides: 'Guides', live: 'Live', news: 'Radar', community: 'Community' },
    start: {
      eyebrow: 'GAMING NEXUS // CHOOSE A ROUTE',
      title: 'All of Gaming, without getting lost',
      description: 'Open only the section you need. Everything else stays out of the way.',
      cards: [
        { id: 'guides', code: 'BUILD', title: 'Complete guides and builds', detail: 'WoW, Diablo IV, FFXIV and PoE 2 by class, gear and rotation.', action: 'OPEN GUIDES', to: '/gaming/guides' },
        { id: 'news', code: 'RADAR', title: 'News and releases', detail: 'Verified gaming signals ordered by date.', action: 'OPEN RADAR', to: '?section=news' },
        { id: 'live', code: 'LIVE', title: 'Streams and videos', detail: 'Kick, YouTube and live status.', action: 'OPEN SIGNAL', to: '?section=live' },
        { id: 'community', code: 'PARTY', title: 'Community and squads', detail: 'Find a group, share builds and enter the Nexus.', action: 'FIND PARTY', to: '?section=community' },
      ],
    },
  },
} as const

export default function GamingHub() {
  const { lang, setLang, localizePath } = useLang()
  const t = content[lang]
  const [published, setPublished] = useState<PublicNewsArticle[]>([])
  const [liveStream, setLiveStream] = useState<Stream | null>(null)
  const [latestVod, setLatestVod] = useState<Stream | null>(null)
  const [streamRadarReady, setStreamRadarReady] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedSection = searchParams.get('section')
  const activeSection: GamingSection = requestedSection === 'guides' || requestedSection === 'live' || requestedSection === 'news' || requestedSection === 'community' ? requestedSection : 'overview'
  const seen = new Set<string>()
  const articles = [...published, ...getCuratedExternalNews('gaming')]
    .filter((article) => !seen.has(article.slug) && Boolean(seen.add(article.slug)))
    .slice(0, 7)
  const streamStatus = streamRadarReady
    ? (liveStream ? t.stream.liveCms : t.stream.standby)
    : t.stream.syncing
  const streamDescription = liveStream ? t.stream.liveDescription : t.stream.standbyDescription

  useEffect(() => {
    if (activeSection !== 'news') return
    let alive = true
    void fetchPublishedNews('gaming').then((next) => { if (alive) setPublished(next) }).catch(() => undefined)
    return () => { alive = false }
  }, [activeSection])

  useEffect(() => {
    if (activeSection !== 'live') return
    let alive = true
    setStreamRadarReady(false)
    void (async () => {
      try {
        const { data } = await supabase.from('streams').select('*').order('published_at', { ascending: false }).limit(12)
        if (!alive) return
        const streams = (data ?? []) as Stream[]
        setLiveStream(streams.find((stream) => stream.is_live) ?? null)
        setLatestVod(streams.find((stream) => !stream.is_live) ?? null)
      } catch {
        // Keep the public channel links available when the CMS radar is unreachable.
      } finally {
        if (alive) setStreamRadarReady(true)
      }
    })()
    return () => { alive = false }
  }, [activeSection])

  function selectSection(section: GamingSection) {
    const next = new URLSearchParams(searchParams)
    if (section === 'overview') next.delete('section')
    else next.set('section', section)
    setSearchParams(next, { replace: true })
  }

  return (
    <>
      <SEO title={t.title} description={t.description} url="/gaming" />
      <main className="xk-page xk-anime-page xk-anime-gaming px-4 py-8 sm:px-6 lg:px-8">
        <div className="xk-anime-speedlines" aria-hidden="true" />
        <div className="xk-gaming-ambient" aria-hidden="true"><i /><i /><i /><b /><b /></div>
        <div className="mx-auto max-w-7xl">
          <section className="xk-anime-hero xk-gaming-hero">
            <SafeImage src="/assets/identity/gaming-anime-nexus-v1.webp" fallback="/images/articles/gaming.svg" alt={t.heroAlt} className="xk-anime-hero-media" loading="eager" fetchPriority="high" />
            <div className="xk-anime-hero-shade" aria-hidden="true" />
            <div className="xk-anime-scanlines" aria-hidden="true" />
            <span className="xk-energy-slash" aria-hidden="true" />
            <div className="xk-gaming-runes" aria-hidden="true"><i>01</i><i>界</i><i>XP</i><i>◆</i></div>
            <div className="xk-anime-hero-content">
              <div className="flex items-center justify-between gap-4">
                <p className="xk-anime-kicker"><span className="xk-live-dot" aria-hidden="true" />{t.kicker}</p>
                <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="xk-hud-button" aria-label={t.switchLanguage} title={t.switchLanguage}>{t.switchCode}</button>
              </div>
              <p className="xk-anime-kanji" aria-hidden="true">異界</p>
              <h1 className="xk-anime-title" data-text={t.title}>{t.title}</h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-200 md:text-base">{t.description}</p>
              <div className="xk-gaming-hero-actions" aria-label={t.heroActionsLabel}>
                <Link to={localizePath('/gaming/guides')}><span aria-hidden="true">⚔</span>{t.heroGuides}</Link>
                <button type="button" onClick={() => selectSection('news')}><span aria-hidden="true">⌁</span>{t.heroRadar}</button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="xk-hud-chip"><span aria-hidden="true">◉</span> {articles.length} {t.signal}</span>
                <span className="xk-hud-chip xk-hud-chip-violet">MMORPG / RPG / ESPORTS</span>
              </div>
            </div>
            <div className="xk-hero-status" aria-label={t.systemStatus}><span>{t.nexusLink}</span><b>{t.routeCount}</b><i aria-hidden="true" /></div>
          </section>

          <nav className="xk-gaming-section-nav" aria-label={t.sectionLabel}>
            {(Object.keys(t.sections) as GamingSection[]).map((section) => <button key={section} type="button" onClick={() => selectSection(section)} aria-pressed={activeSection === section}><span>{section === 'overview' ? '◈' : section === 'guides' ? '⚔' : section === 'live' ? '●' : section === 'news' ? '⌁' : '◆'}</span><b>{t.sections[section]}</b></button>)}
          </nav>

          {activeSection === 'overview' ? <section className="xk-gaming-start" aria-labelledby="gaming-start-title"><header><small>{t.start.eyebrow}</small><h2 id="gaming-start-title">{t.start.title}</h2><p>{t.start.description}</p></header><div>{t.start.cards.map((card) => card.id === 'guides' ? <Link key={card.id} to={localizePath(card.to)}><span>{card.code}</span><b>{card.title}</b><small>{card.detail}</small><strong>{card.action} →</strong></Link> : <button key={card.id} type="button" onClick={() => selectSection(card.id as GamingSection)}><span>{card.code}</span><b>{card.title}</b><small>{card.detail}</small><strong>{card.action} →</strong></button>)}</div></section> : null}
          {activeSection === 'guides' ? <GamingGuideRotation lang={lang} /> : null}

          {activeSection === 'live' ? <section className="xk-creator-signal" aria-labelledby="creator-signal-title">
            <div className="xk-creator-signal-copy">
              <p aria-live="polite"><span className={liveStream ? 'is-live' : ''} aria-hidden="true" /> {t.stream.label} // {streamStatus}</p>
              <h2 id="creator-signal-title">{t.stream.heading}</h2>
              <span>{streamDescription}</span>
              <div>
                <a href={liveStream?.channel_url || STREAM_LINKS.kick} target="_blank" rel="noreferrer noopener">{liveStream ? t.stream.openLive : t.stream.openKick} ↗</a>
                <a href={latestVod?.channel_url || STREAM_LINKS.youtube} target="_blank" rel="noreferrer noopener">{latestVod ? t.stream.latestVod : t.stream.openYoutube} ↗</a>
              </div>
            </div>
            <div className="xk-stream-orbit" aria-hidden="true"><i /><i /><span>{liveStream ? t.stream.live : t.stream.offline}</span></div>
          </section> : null}

          {activeSection === 'community' ? <section className="xk-gaming-utility-grid" aria-label={t.utilityLabel}>
            <article className="xk-armory-panel">
              <p>{t.communityInfo.eyebrow}</p>
              <h2>{t.communityInfo.title}</h2>
              <span>{t.communityInfo.text}</span>
              <div>
                {t.communityInfo.items.map(([label, value], index) => <div key={label}><b>0{index + 1}</b><small>{label}</small><strong>{value}</strong></div>)}
              </div>
            </article>
            <article className="xk-build-board">
              <p>{t.party.eyebrow}</p>
              <h2>{t.party.title}</h2>
              <div>
                {t.party.items.map((item) => <Link key={item.code} to={localizePath(item.to)}><span>{item.code}</span><b>{item.title}</b><small>{item.action} →</small></Link>)}
              </div>
            </article>
          </section> : null}

          {activeSection === 'news' ? <section className="mt-10">
            <div className="xk-anime-section-title"><span>ON AIR</span><h2>{t.dispatch}</h2><i aria-hidden="true" /></div>
            {articles.length > 0 && <div className="xk-gaming-feed">
              <article className="xk-gaming-feature group">
                <SafeImage src={articles[0].cover_image_url} fallback="/images/articles/gaming.svg" alt={articles[0].cover_image_alt || articles[0].title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="xk-feed-shade" aria-hidden="true" />
                <span className="xk-feature-rank" aria-hidden="true">S</span>
                <div className="xk-feature-copy"><span>{t.featured} // {formatPublicNewsDate(articles[0].published_at ?? articles[0].created_at, lang)}</span><h3>{articles[0].title}</h3><p>{articles[0].summary}</p><Link to={`/news/${articles[0].slug}`}>{t.read} →</Link></div>
              </article>
              <div className="xk-gaming-rail">{articles.slice(1).map((article, index) => <article key={article.slug} className="xk-gaming-brief">
                <span className="xk-brief-number" aria-hidden="true">{String(index + 2).padStart(2, '0')}<i>{['A', 'A', 'B', 'B', 'C', 'C'][index]}</i></span>
                <SafeImage src={article.cover_image_url} fallback="/images/articles/gaming.svg" alt={article.cover_image_alt || article.title} className="xk-brief-image" />
                <div><small>{formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</small><h3>{article.title}</h3><Link to={`/news/${article.slug}`}>{t.read} →</Link></div>
              </article>)}</div>
            </div>}
            {articles.length === 0 && <p className="xk-empty-signal" role="status">{t.offline}</p>}
          </section> : null}

          {activeSection === 'news' ? <div className="mt-10"><PublicAdSlot slotId="section-sidebar" fallbackLabel={t.sponsor} /></div> : null}
          <PortalKnowledgeBriefing sector="gaming" lang={lang} />
          <nav className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.18em]" aria-label={lang === 'es' ? 'Navegación de Gaming' : 'Gaming navigation'}>
            <Link to={localizePath('/')} className="xk-hud-button">{t.back}</Link>
            <Link to={localizePath('/gaming/guides')} className="xk-hud-button">{t.guides}</Link>
            <Link to="/news?category=gaming" className="xk-hud-button">{t.radar}</Link>
            <Link to={localizePath('/community')} className="xk-hud-button">{t.community}</Link>
          </nav>
        </div>
      </main>
    </>
  )
}
