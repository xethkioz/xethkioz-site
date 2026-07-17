import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import PublicAdSlot from '../components/ads/PublicAdSlot'
import { PortalPulseRail } from '../components/PortalPulseRail'
import { NexusDistrict } from '../components/NexusDistrict'
import { useLang } from '../lib/LangContext'
import { addWispXp } from '../lib/realtimeCommunity'
import { SOCIAL_LINKS } from '../lib/siteConfig'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { fetchPublishedNews, formatPublicNewsDate, type PublicNewsArticle } from '../services/news/publicNewsService'

const content = {
  es: { description: 'El lado más caótico de internet: memes, clips y rarezas servidos como un episodio anime fuera de control.', badge: 'CAOS AUTORIZADO', back: 'Escapar del caos', stream: 'TRANSMISIÓN ILEGAL DE HUMOR', read: 'Ver el episodio', react: 'JAJA +1', reacted: 'REACCIÓN ENVIADA', chaos: 'CAOSÓMETRO', unleash: 'Liberar caos', chaosLines: ['El algoritmo encontró un meme prohibido.', 'Un duende digital robó el Wi-Fi del servidor.', 'La dignidad abandonó el chat. Todo funciona.', 'El Wisp se rio. Esto ya es preocupante.'], blocks: [{ id: 'memes', code: '01', title: 'Memes rápidos', icon: '爆' }, { id: 'clips', code: '02', title: 'Clips y videos', icon: '映' }, { id: 'legends', code: '03', title: 'Rarezas', icon: '怪' }] },
  en: { description: 'The most chaotic side of the internet: memes, clips and oddities served like an out-of-control anime episode.', badge: 'CHAOS AUTHORIZED', back: 'Escape the chaos', stream: 'ILLEGAL HUMOR BROADCAST', read: 'Watch episode', react: 'LOL +1', reacted: 'REACTION SENT', chaos: 'CHAOS METER', unleash: 'Unleash chaos', chaosLines: ['The algorithm found a forbidden meme.', 'A digital gremlin stole the server Wi-Fi.', 'Dignity left the chat. Everything works.', 'The Wisp laughed. This is concerning.'], blocks: [{ id: 'memes', code: '01', title: 'Quick memes', icon: '爆' }, { id: 'clips', code: '02', title: 'Clips & videos', icon: '映' }, { id: 'legends', code: '03', title: 'Oddities', icon: '怪' }] },
} as const

const humorDeck = {
  gaming: [
    'Yo no tengo backlog: tengo un museo de decisiones económicas cuestionables.',
    'La build decía “barata”. Tres horas después estoy pidiendo un préstamo en Wraeclast.',
    'Entré a hacer una misión rápida y salí con otra profesión, dos mascotas y sueño atrasado.',
  ],
  adulto: [
    'De chico quería ser adulto. Claramente faltaban páginas en el tutorial.',
    'Mi cuerpo no envejece: desbloquea sonidos ambientales nuevos.',
    'El verdadero modo difícil empieza cuando te acostás y recordás una cuenta sin pagar.',
  ],
  trabajo: [
    'El café no resuelve problemas, pero permite mirarlos con más definición.',
    'Reunión que pudo ser mensaje: el jefe final de toda oficina.',
    'Hoy di el 100%: 12% a cada una de las ocho cosas que estaba haciendo.',
  ],
} as const

export default function FunPortal() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState<string>('memes')
  const [reacted, setReacted] = useState<Set<string>>(() => new Set())
  const [chaosIndex, setChaosIndex] = useState(0)
  const [reactionAnnouncement, setReactionAnnouncement] = useState('')
  const [humorMode, setHumorMode] = useState<keyof typeof humorDeck>('gaming')
  const [jokeIndex, setJokeIndex] = useState(0)
  const [laughStreak, setLaughStreak] = useState(0)
  const [battleVote, setBattleVote] = useState<string | null>(null)
  const [published, setPublished] = useState<PublicNewsArticle[]>([])
  const seen = new Set<string>()
  const articles = [...published, ...getCuratedExternalNews('community')].filter((article) => !seen.has(article.slug) && Boolean(seen.add(article.slug))).slice(0, 7)
  const activeIndex = Math.max(0, t.blocks.findIndex((block) => block.id === activeId))
  const active = t.blocks[activeIndex]

  useEffect(() => {
    let alive = true
    void fetchPublishedNews('community').then((next) => { if (alive) setPublished(next) }).catch(() => undefined)
    return () => { alive = false }
  }, [])

  function selectBlock(id: string) { setActiveId(id); addWispXp(2, 'portal', `/fun#${id}`) }
  function react(slug: string) {
    if (reacted.has(slug)) return
    setReacted((current) => new Set(current).add(slug))
    const article = articles.find((item) => item.slug === slug)
    setReactionAnnouncement(`${t.reacted}: ${article?.title ?? slug}`)
    addWispXp(1, 'mission', `/fun#reaction-${slug}`)
  }
  function unleashChaos() {
    setChaosIndex((current) => (current + 1) % t.chaosLines.length)
    addWispXp(1, 'mission', '/fun#chaos-meter')
  }
  function generateJoke() {
    setJokeIndex((current) => (current + 1) % humorDeck[humorMode].length)
    setLaughStreak((current) => current + 1)
    addWispXp(1, 'mission', `/fun#humor-${humorMode}`)
  }
  function voteBattle(slug: string) {
    if (battleVote) return
    setBattleVote(slug)
    setReactionAnnouncement('Voto registrado en el duelo de memes')
    addWispXp(2, 'mission', `/fun#battle-${slug}`)
  }
  async function shareArticle(article: PublicNewsArticle) {
    const url = `${window.location.origin}/news/${article.slug}`
    const shareData = { title: article.title, text: `${article.title} · XETHKIOZ`, url }
    try {
      if (navigator.share) await navigator.share(shareData)
      else window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${url}`)}`, '_blank', 'noopener,noreferrer')
      setReactionAnnouncement(`Listo para compartir: ${article.title}`)
      addWispXp(2, 'mission', `/fun#share-${article.slug}`)
    } catch {
      setReactionAnnouncement('Compartir cancelado')
    }
  }
  function moveChannelFocus(currentIndex: number, direction: 1 | -1) {
    const nextIndex = (currentIndex + direction + t.blocks.length) % t.blocks.length
    const next = t.blocks[nextIndex]
    selectBlock(next.id)
    document.getElementById(`fun-tab-${next.id}`)?.focus()
  }

  return <>
    <SEO title="Memes · XETHKIOZ" description={t.description} url="/fun" />
    <main className="xk-page xk-anime-page xk-anime-memes px-4 py-8 sm:px-6 lg:px-8">
      <div className="xk-manga-burst" aria-hidden="true" />
      <div className="xk-meme-ambient" aria-hidden="true"><i /><i /><i /><b>!</b><b>?</b><b>爆</b></div>
      <div className="mx-auto max-w-7xl">
        <section className="xk-anime-hero xk-meme-hero">
          <SafeImage src="/assets/identity/memes-anime-chaos-v1.webp" fallback="/images/articles/community.svg" alt="Espíritu anime de internet saliendo de un teléfono con energía de meme" className="xk-anime-hero-media" loading="eager" fetchPriority="high" />
          <div className="xk-anime-hero-shade" /><div className="xk-halftone" aria-hidden="true" />
          <div className="xk-meme-hero-sprites" aria-hidden="true"><span>HA!</span><span>?!</span><span>LOL</span></div>
          <div className="xk-anime-hero-content">
            <div className="flex items-center justify-between gap-4"><p className="xk-meme-warning">⚠ MEME_CORE.EXE</p><button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="xk-sticker-button">{lang.toUpperCase()}</button></div>
            <p className="xk-anime-kanji xk-meme-kanji" aria-hidden="true">混沌</p>
            <h1 className="xk-meme-title" data-text="MEMES">MEMES!</h1>
            <p className="xk-speech-bubble">{t.description}</p>
            <span className="xk-chaos-stamp">{t.badge}</span>
          </div>
        </section>

        <NexusDistrict tone="fun" />
        <div className="xk-meme-marquee" aria-hidden="true"><div>MEME SIGNAL ◆ REACTION OVERLOAD ◆ INTERNET CULTURE ◆ MEME SIGNAL ◆ REACTION OVERLOAD ◆ INTERNET CULTURE ◆</div></div>

        <section className="xk-manga-tabs" role="tablist" aria-label="Meme channels">
          {t.blocks.map((block, index) => <button key={block.id} id={`fun-tab-${block.id}`} type="button" role="tab" aria-selected={activeId === block.id} aria-controls="fun-chaos-panel" tabIndex={activeId === block.id ? 0 : -1} onClick={() => selectBlock(block.id)} onKeyDown={(event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveChannelFocus(index, 1) }
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveChannelFocus(index, -1) }
          }} className="xk-manga-tab"><span>{block.icon}</span><small>CH.{block.code}</small><b>{block.title}</b></button>)}
        </section>

        <section id="fun-chaos-panel" className="xk-chaos-console" role="tabpanel" aria-labelledby={`fun-tab-${active.id}`}>
          <div className="xk-chaos-gauge"><div><span>{t.chaos}</span><b>{[87, 96, 73][activeIndex]}%</b></div><i><em style={{ width: `${[87, 96, 73][activeIndex]}%` }} /></i><small>MEME_CORE // {activeId.toUpperCase()} // UNSTABLE</small></div>
          <div className="xk-chaos-output"><span aria-hidden="true">☄</span><p role="status" aria-live="polite" aria-atomic="true">{t.chaosLines[chaosIndex]}</p><button type="button" onClick={unleashChaos}>{t.unleash} →</button></div>
        </section>

        <section className="xk-fun-arcade" aria-labelledby="fun-arcade-title">
          <div className="xk-fun-arcade-head"><div><p>ARCADE_DEL_CAOS // PARTIDA RÁPIDA</p><h2 id="fun-arcade-title">No vengas sólo a mirar</h2><span>Elegí tu tipo de humor, generá una dosis y mantené viva la racha. No necesita cuenta ni comparte datos.</span></div><b><small>RACHA</small>{laughStreak}</b></div>
          <div className="xk-humor-machine">
            <div role="tablist" aria-label="Tipo de humor">{(Object.keys(humorDeck) as Array<keyof typeof humorDeck>).map((mode) => <button key={mode} type="button" role="tab" aria-selected={humorMode === mode} onClick={() => { setHumorMode(mode); setJokeIndex(0) }}>{mode}</button>)}</div>
            <blockquote aria-live="polite">“{humorDeck[humorMode][jokeIndex]}”</blockquote>
            <button type="button" onClick={generateJoke}>OTRA DOSIS DE CAOS →</button>
          </div>
          {articles.length >= 2 ? <div className="xk-meme-battle"><p>MEME_BATTLE // ELEGÍ AL CAMPEÓN</p><div>{articles.slice(0, 2).map((article, index) => <article key={article.slug} className={battleVote === article.slug ? 'is-winner' : ''}><SafeImage src={article.cover_image_url} fallback="/images/articles/community-chat.svg" alt={article.cover_image_alt || article.title} className="h-full w-full object-cover" /><span>PLAYER {index + 1}</span><h3>{article.title}</h3><button type="button" disabled={Boolean(battleVote)} onClick={() => voteBattle(article.slug)}>{battleVote === article.slug ? 'ELEGIDO ✓' : 'ESTE GANA'}</button></article>)}</div>{battleVote ? <button type="button" onClick={() => setBattleVote(null)}>NUEVO DUELO ↻</button> : null}</div> : null}
        </section>

        <PortalPulseRail
          tone="orange"
          eyebrow="CHAOS_LOOP // NO MIRES SIN PARTICIPAR"
          title="Acá el humor se toca, se vota y se comparte"
          description="Elegí una dosis rápida: el clip destacado, un meme para robar o la sala donde nace el próximo desastre."
          items={[
            { code: 'WEEK', title: 'Clip de la semana', detail: 'El momento que no sobrevivió al stream', to: '/fun#weekly-clip', action: 'Reproducir' },
            { code: 'STEAL', title: 'Robar un meme', detail: 'Compartilo con marca XETHKIOZ', to: '/fun#meme-wall', action: 'Elegir' },
            { code: 'LOL', title: 'Entrar al caos', detail: 'Comentá y proponé el próximo meme', to: '/community', action: 'Participar' },
          ]}
        />
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{reactionAnnouncement}</p>

        {articles[0] && <section id="weekly-clip" className="xk-weekly-clip scroll-mt-28" aria-labelledby="weekly-clip-title">
          <div className="xk-weekly-clip-media"><SafeImage src={articles[0].cover_image_url} fallback="/news/memes/argentina-duendes-cuartos.svg" alt={articles[0].cover_image_alt || articles[0].title} className="h-full w-full object-cover" /><span>XETHKIOZ</span><b>CLIP<br />DE LA<br />SEMANA</b></div>
          <div><p>EDITOR'S CHAOS PICK // EP.01</p><h2 id="weekly-clip-title">{articles[0].title}</h2><span>{articles[0].summary}</span><div><Link to={`/news/${articles[0].slug}`}>{t.read} →</Link><button type="button" onClick={() => void shareArticle(articles[0])}>ROBAR MEME / COMPARTIR ↗</button></div></div>
        </section>}

        <section className="xk-social-wall" aria-labelledby="social-wall-title">
          <div><p>SOCIAL_WALL // SEÑALES CURADAS</p><h2 id="social-wall-title">El caos sigue en todas las pantallas</h2><span>Accesos directos a los canales oficiales. El contenido automático llegará cuando cada plataforma tenga una integración estable.</span></div>
          <div>{SOCIAL_LINKS.filter((social) => ['TikTok Principal', 'Threads', 'Instagram', 'YouTube'].includes(social.name)).map((social) => <a key={social.name} href={social.url} target="_blank" rel="noreferrer"><span>{social.icon}</span><b>{social.name}</b><small>{social.handle} ↗</small></a>)}</div>
        </section>

        <section id="meme-wall" className="mt-12 scroll-mt-28">
          <div className="xk-anime-section-title xk-meme-section-title"><span>LIVE!</span><h2>{t.stream}</h2><i /></div>
          <div className="xk-meme-bento">{articles.map((article, index) => <article key={article.slug} className={`xk-meme-card xk-meme-card-${index + 1}${reacted.has(article.slug) ? ' is-reacted' : ''}`}>
            <div className="xk-meme-image-wrap"><SafeImage src={article.cover_image_url} fallback="/news/memes/argentina-duendes-cuartos.svg" alt={article.cover_image_alt || article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span>{['LOL!', 'WTF?!', 'JAJA', 'NOOO', 'GG!', 'BRUH', 'XD'][index % 7]}</span><small>XETHKIOZ</small></div>
            <div className="xk-meme-copy"><small>EP.{String(index + 1).padStart(2, '0')} // {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</small><h3>{article.title}</h3>{index === 0 && <p>{article.summary}</p>}<div><Link to={`/news/${article.slug}`}>{t.read} →</Link><button type="button" onClick={() => react(article.slug)} disabled={reacted.has(article.slug)}>{reacted.has(article.slug) ? t.reacted : t.react}</button><button type="button" onClick={() => void shareArticle(article)}>COMPARTIR ↗</button></div></div>
          </article>)}</div>
          {articles.length === 0 && <p className="xk-empty-signal xk-empty-signal-meme" role="status">MEME_CORE OFFLINE // El caos está recargando.</p>}
        </section>

        <div className="mt-10"><PublicAdSlot slotId="section-sidebar" fallbackLabel="XETHKIOZ FUN SPONSOR" /></div>
        <Link to="/" className="xk-sticker-button mt-8 inline-flex">{t.back}</Link>
      </div>
    </main>
  </>
}
