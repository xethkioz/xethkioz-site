import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import PublicAdSlot from '../components/ads/PublicAdSlot'
import { PortalPulseRail } from '../components/PortalPulseRail'
import { useLang } from '../lib/LangContext'
import { addWispXp } from '../lib/realtimeCommunity'
import { STREAM_LINKS } from '../lib/siteConfig'
import { supabase } from '../lib/supabase'
import type { Stream } from '../lib/types'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { fetchPublishedNews, formatPublicNewsDate, type PublicNewsArticle } from '../services/news/publicNewsService'

type SectionBlock = { id: string; code: string; title: string; text: string; icon: string }

const content = {
  es: {
    title: 'NEXUS GAMING', kicker: 'TEMPORADA 01 // EL PORTAL ESTÁ ABIERTO', description: 'Entrá al radar donde los lanzamientos, MMORPG, esports y señales de Asia se sienten como una misión.', back: 'Salir del nexus', news: 'Todas las noticias', community: 'Buscar escuadrón', active: 'RUTA ACTIVA', dispatch: 'TRANSMISIONES DEL NEXUS', read: 'Abrir misión', signal: 'señales en vivo',
    blocks: [
      { id: 'radar', code: '01', title: 'Radar gamer', text: 'Lanzamientos, industria y mundos que están por abrir sus puertas.', icon: '◈' },
      { id: 'guides', code: '02', title: 'Guías y builds', text: 'Estrategias, comparativas y configuraciones elegidas por la comunidad.', icon: '⚔' },
      { id: 'asia', code: '03', title: 'Asia Gaming', text: 'Señales de Corea, Japón, China y SEA antes de que lleguen al resto.', icon: '界' },
    ],
  },
  en: {
    title: 'GAMING NEXUS', kicker: 'SEASON 01 // THE PORTAL IS OPEN', description: 'Enter the radar where releases, MMORPGs, esports and signals from Asia feel like a mission.', back: 'Leave nexus', news: 'All news', community: 'Find a squad', active: 'ACTIVE ROUTE', dispatch: 'NEXUS TRANSMISSIONS', read: 'Open mission', signal: 'live signals',
    blocks: [
      { id: 'radar', code: '01', title: 'Gaming radar', text: 'Releases, industry moves and worlds about to open their gates.', icon: '◈' },
      { id: 'guides', code: '02', title: 'Guides and builds', text: 'Strategies, comparisons and community-picked configurations.', icon: '⚔' },
      { id: 'asia', code: '03', title: 'Asia Gaming', text: 'Signals from Korea, Japan, China and SEA before they reach everyone.', icon: '界' },
    ],
  },
} satisfies Record<'es' | 'en', object>

export default function GamingHub() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const [published, setPublished] = useState<PublicNewsArticle[]>([])
  const [liveStream, setLiveStream] = useState<Stream | null>(null)
  const [latestVod, setLatestVod] = useState<Stream | null>(null)
  const [streamRadarReady, setStreamRadarReady] = useState(false)
  const active = t.blocks.find((block) => block.id === activeId) ?? t.blocks[0]
  const seen = new Set<string>()
  const articles = [...published, ...getCuratedExternalNews('gaming')].filter((article) => !seen.has(article.slug) && Boolean(seen.add(article.slug))).slice(0, 7)

  useEffect(() => {
    let alive = true
    void fetchPublishedNews('gaming').then((next) => { if (alive) setPublished(next) }).catch(() => undefined)
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
  }, [])

  function selectBlock(id: string) {
    setActiveId(id)
    addWispXp(2, 'portal', `/gaming#${id}`)
  }

  function moveMissionFocus(currentIndex: number, direction: 1 | -1) {
    const nextIndex = (currentIndex + direction + t.blocks.length) % t.blocks.length
    const next = t.blocks[nextIndex]
    selectBlock(next.id)
    document.getElementById(`gaming-tab-${next.id}`)?.focus()
  }

  return <>
    <SEO title={`${t.title} · XETHKIOZ`} description={t.description} url="/gaming" />
    <main className="xk-page xk-anime-page xk-anime-gaming px-4 py-8 sm:px-6 lg:px-8">
      <div className="xk-anime-speedlines" aria-hidden="true" />
      <div className="xk-gaming-ambient" aria-hidden="true"><i /><i /><i /><b /><b /></div>
      <div className="mx-auto max-w-7xl">
        <section className="xk-anime-hero xk-gaming-hero">
          <SafeImage src="/assets/identity/gaming-anime-nexus-v1.webp" fallback="/images/articles/gaming.svg" alt="Guerrero anime frente a un portal gamer de neón" className="xk-anime-hero-media" loading="eager" fetchPriority="high" />
          <div className="xk-anime-hero-shade" />
          <div className="xk-anime-scanlines" aria-hidden="true" />
          <span className="xk-energy-slash" aria-hidden="true" />
          <div className="xk-gaming-runes" aria-hidden="true"><i>01</i><i>界</i><i>XP</i><i>∞</i></div>
          <div className="xk-anime-hero-content">
            <div className="flex items-center justify-between gap-4">
              <p className="xk-anime-kicker"><span className="xk-live-dot" />{t.kicker}</p>
              <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="xk-hud-button">{lang.toUpperCase()}</button>
            </div>
            <p className="xk-anime-kanji" aria-hidden="true">異界</p>
            <h1 className="xk-anime-title" data-text={t.title}>{t.title}</h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-200 md:text-base">{t.description}</p>
            <div className="mt-7 flex flex-wrap gap-3"><span className="xk-hud-chip">◉ {articles.length} {t.signal}</span><span className="xk-hud-chip xk-hud-chip-violet">MMORPG / RPG / ESPORTS</span></div>
          </div>
          <div className="xk-hero-status" aria-hidden="true"><span>NEXUS LINK</span><b>98.7%</b><i /></div>
        </section>

        <div className="xk-gaming-ticker" aria-hidden="true"><div>NEXUS ONLINE ◆ NEW WORLDS DETECTED ◆ ASIA SIGNAL ACQUIRED ◆ RAID PARTY REQUIRED ◆ NEXUS ONLINE ◆ NEW WORLDS DETECTED ◆ ASIA SIGNAL ACQUIRED ◆ RAID PARTY REQUIRED ◆</div></div>

        <section className="xk-creator-signal" aria-labelledby="creator-signal-title">
          <div className="xk-creator-signal-copy">
            <p><span className={liveStream ? 'is-live' : ''} /> STREAM_RADAR // {streamRadarReady ? (liveStream ? 'SEÑAL MARCADA EN VIVO EN EL CMS' : 'CANAL EN ESPERA') : 'SINCRONIZANDO'}</p>
            <h2 id="creator-signal-title">Directos, VOD y comunidad en un solo punto</h2>
            <span>{liveStream ? liveStream.title : 'Abrí Kick para comprobar el directo. Si el canal está offline, podés seguir con los últimos videos y noticias sin salir del Nexus.'}</span>
            <div>
              <a href={liveStream?.channel_url || STREAM_LINKS.kick} target="_blank" rel="noreferrer">{liveStream ? 'ENTRAR AL DIRECTO' : 'ABRIR KICK'} ↗</a>
              <a href={latestVod?.channel_url || STREAM_LINKS.youtube} target="_blank" rel="noreferrer">{latestVod ? 'VER ÚLTIMO VOD' : 'VER YOUTUBE'} ↗</a>
            </div>
          </div>
          <div className="xk-stream-orbit" aria-hidden="true"><i /><i /><span>{liveStream ? 'LIVE' : 'STANDBY'}</span></div>
        </section>

        <PortalPulseRail
          tone="violet"
          eyebrow="PLAYER_LOOP // ELEGÍ TU PRÓXIMA MISIÓN"
          title="Que entrar a Gaming siempre tenga algo para hacer"
          description="Seguí la señal, buscá escuadrón o llevate una guía. Cada acción alimenta el recorrido de tu perfil."
          items={[
            { code: 'LIVE', title: 'Perseguir la señal', detail: 'Directos y últimos videos', to: STREAM_LINKS.kick, action: 'Abrir canal' },
            { code: 'PARTY', title: 'Armar escuadrón', detail: 'Comunidad, servidores y compañeros', to: '/community', action: 'Entrar' },
            { code: 'BUILD', title: 'Preparar personaje', detail: 'Noticias, builds y archivo gamer', to: '/news?category=gaming', action: 'Explorar' },
          ]}
        />

        <section className="xk-mission-board" aria-label={t.active}>
          <div className="xk-mission-tabs" role="tablist" aria-label={t.active}>
            {t.blocks.map((block, index) => <button key={block.id} id={`gaming-tab-${block.id}`} type="button" role="tab" aria-selected={active.id === block.id} aria-controls="gaming-active-mission" tabIndex={active.id === block.id ? 0 : -1} onClick={() => selectBlock(block.id)} onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveMissionFocus(index, 1) }
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveMissionFocus(index, -1) }
            }} className="xk-mission-tab">
              <span>{block.code}</span><b>{block.icon}</b><em>{block.title}</em>
            </button>)}
          </div>
          <div id="gaming-active-mission" className="xk-active-mission" role="tabpanel" aria-labelledby={`gaming-tab-${active.id}`} aria-live="polite">
            <b className="xk-mission-emblem" aria-hidden="true">{active.icon}</b>
            <p>{t.active} // {active.code}</p><h2>{active.title}</h2><span>{active.text}</span>
            <div className="xk-mission-progress"><i /><i /><i /></div>
          </div>
        </section>

        <section className="xk-gaming-utility-grid" aria-label="Armería y tablero de juego">
          <article className="xk-armory-panel">
            <p>ARMORY // MI SETUP</p>
            <h2>Hardware sin humo</h2>
            <span>La ficha queda preparada para sumar componentes y enlaces afiliados, pero los modelos se publicarán recién cuando estén confirmados.</span>
            <div>
              {[['PC PRINCIPAL', 'Especificaciones en verificación'], ['PERIFÉRICOS', 'Mouse, teclado y audio por confirmar'], ['PRODUCCIÓN', 'OBS + flujo audiovisual del ecosistema']].map(([label, value], index) => <div key={label}><b>0{index + 1}</b><small>{label}</small><strong>{value}</strong></div>)}
            </div>
          </article>
          <article className="xk-build-board">
            <p>PARTY_BOARD // BUILDS & SERVIDORES</p>
            <h2>Entrá a jugar con la comunidad</h2>
            <div>
              <Link to="/news?category=gaming"><span>POE 2</span><b>Builds y guías documentadas</b><small>Explorar archivo →</small></Link>
              <Link to="/community"><span>MU ONLINE</span><b>Punto de encuentro del servidor</b><small>Buscar escuadrón →</small></Link>
              <Link to="/community"><span>MMORPG</span><b>Compartí tu build y armá party</b><small>Entrar al Nexus →</small></Link>
            </div>
          </article>
        </section>

        <section className="mt-10">
          <div className="xk-anime-section-title"><span>ON AIR</span><h2>{t.dispatch}</h2><i /></div>
          {articles.length > 0 && <div className="xk-gaming-feed">
            <article className="xk-gaming-feature group">
              <SafeImage src={articles[0].cover_image_url} fallback="/images/articles/gaming.svg" alt={articles[0].cover_image_alt || articles[0].title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="xk-feed-shade" /><span className="xk-feature-rank">S</span><div className="xk-feature-copy"><span>FEATURED RAID // {formatPublicNewsDate(articles[0].published_at ?? articles[0].created_at, lang)}</span><h3>{articles[0].title}</h3><p>{articles[0].summary}</p><Link to={`/news/${articles[0].slug}`}>{t.read} →</Link></div>
            </article>
            <div className="xk-gaming-rail">{articles.slice(1).map((article, index) => <article key={article.slug} className="xk-gaming-brief">
              <span className="xk-brief-number">{String(index + 2).padStart(2, '0')}<i>{['A', 'A', 'B', 'B', 'C', 'C'][index]}</i></span><SafeImage src={article.cover_image_url} fallback="/images/articles/gaming.svg" alt={article.cover_image_alt || article.title} className="xk-brief-image" /><div><small>{formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</small><h3>{article.title}</h3><Link to={`/news/${article.slug}`}>{t.read} →</Link></div>
            </article>)}</div>
          </div>}
          {articles.length === 0 && <p className="xk-empty-signal" role="status">NEXUS OFFLINE // Las transmisiones volverán en breve.</p>}
        </section>

        <div className="mt-10"><PublicAdSlot slotId="section-sidebar" fallbackLabel="XETHKIOZ GAMING SPONSOR" /></div>
        <nav className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.18em]"><Link to="/" className="xk-hud-button">{t.back}</Link><Link to="/news" className="xk-hud-button">{t.news}</Link><Link to="/community" className="xk-hud-button">{t.community}</Link></nav>
      </div>
    </main>
  </>
}
