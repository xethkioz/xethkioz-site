import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import PublicAdSlot from '../components/ads/PublicAdSlot'
import PortalWispGuide from '../components/PortalWispGuide'
import FunGameGateway from '../components/fun/FunGameGateway'
import './FunNexusFusion.css'
import { PortalPulseRail } from '../components/PortalPulseRail'
import { NexusDistrict } from '../components/NexusDistrict'
import { useLang } from '../lib/LangContext'
import { addWispXp } from '../lib/realtimeCommunity'
import { SOCIAL_LINKS } from '../lib/siteConfig'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { fetchPublishedNews, formatPublicNewsDate, type PublicNewsArticle } from '../services/news/publicNewsService'

type HumorMode = 'gaming' | 'adulto' | 'trabajo'
type FunPortalMode = 'play' | 'memes'
type MemeSection = 'home' | 'arcade' | 'clips' | 'wall'

const NexusCity = lazy(() => import('./NexusCity'))

const humorDeck: Record<'es' | 'en', Record<HumorMode, readonly string[]>> = {
  es: {
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
  },
  en: {
    gaming: [
      'I do not have a backlog. I have a museum of questionable financial decisions.',
      'The build said “budget”. Three hours later I was applying for a loan in Wraeclast.',
      'I entered for one quick quest and left with a new profession, two pets and less sleep.',
    ],
    adulto: [
      'As a kid I wanted to be an adult. Several tutorial pages were clearly missing.',
      'My body is not aging. It is unlocking new ambient sound effects.',
      'The real hard mode begins when you lie down and remember an unpaid bill.',
    ],
    trabajo: [
      'Coffee does not solve problems, but it lets you inspect them in higher definition.',
      'A meeting that could have been a message: the final boss of every office.',
      'I gave 100% today: 12% to each of the eight things I was doing.',
    ],
  },
}

const content = {
  es: {
    title: 'Diversión y juego',
    description: 'Entrá a Plaza Nexus y seguí bajando para encontrar memes, chistes, clips y rarezas servidos con energía de caos.',
    heroAlt: 'Espíritu anime de internet saliendo de un teléfono con energía de meme',
    switchLanguage: 'Cambiar a inglés',
    switchCode: 'EN',
    badge: 'CAOS AUTORIZADO',
    back: 'Escapar del caos',
    stream: 'TRANSMISIÓN ILEGAL DE HUMOR',
    read: 'Ver el episodio',
    react: 'JAJA +1',
    reacted: 'REACCIÓN ENVIADA',
    reactionRegistered: 'Reacción enviada',
    shareReady: 'Listo para compartir',
    shareCancelled: 'Compartir cancelado',
    share: 'COMPARTIR',
    chaos: 'CAOSÓMETRO',
    unleash: 'Liberar caos',
    unstable: 'INESTABLE',
    channelsLabel: 'Canales de memes',
    chaosLines: [
      'El algoritmo encontró un meme prohibido.',
      'Un duende digital robó el Wi-Fi del servidor.',
      'La dignidad abandonó el chat. Todo funciona.',
      'El Wisp se rio. Esto ya es preocupante.',
    ],
    blocks: [
      { id: 'memes', code: '01', title: 'Memes rápidos', icon: '爆' },
      { id: 'clips', code: '02', title: 'Clips y videos', icon: '映' },
      { id: 'legends', code: '03', title: 'Rarezas', icon: '怪' },
    ],
    marquee: 'SEÑAL DE MEMES ◆ SOBRECARGA DE REACCIONES ◆ CULTURA DE INTERNET',
    arcade: {
      eyebrow: 'ARCADE_DEL_CAOS // PARTIDA RÁPIDA',
      title: 'No vengas solo a mirar',
      description: 'Elegí tu tipo de humor, generá una dosis y mantené viva la racha. No necesita cuenta ni comparte datos.',
      streak: 'RACHA',
      humorLabel: 'Tipo de humor',
      modes: { gaming: 'Gaming', adulto: 'Adultos', trabajo: 'Trabajo' } as Record<HumorMode, string>,
      next: 'OTRA DOSIS DE CAOS',
    },
    battle: {
      eyebrow: 'MEME_BATTLE // ELEGÍ AL CAMPEÓN',
      player: 'JUGADOR',
      chosen: 'ELEGIDO',
      choose: 'ESTE GANA',
      reset: 'NUEVO DUELO',
      voteRegistered: 'Voto registrado en el duelo de memes',
    },
    loop: {
      eyebrow: 'CHAOS_LOOP // NO MIRES SIN PARTICIPAR',
      title: 'Acá el humor se toca, se vota y se comparte',
      description: 'Elegí una dosis rápida: el clip destacado, un meme para robar o la sala donde nace el próximo desastre.',
      items: [
        { code: 'WEEK', title: 'Clip de la semana', detail: 'El momento que no sobrevivió al stream', to: '/fun?mode=memes&section=clips#weekly-clip', action: 'Reproducir' },
        { code: 'STEAL', title: 'Robar un meme', detail: 'Compartilo con marca XETHKIOZ', to: '/fun?mode=memes&section=wall#meme-wall', action: 'Elegir' },
        { code: 'LOL', title: 'Entrar al caos', detail: 'Comentá y proponé el próximo meme', to: '/community', action: 'Participar' },
      ],
    },
    weekly: {
      label: 'CLIP DE LA SEMANA',
      eyebrow: 'SELECCIÓN DEL CAOS // EP.01',
      steal: 'ROBAR MEME / COMPARTIR',
    },
    social: {
      eyebrow: 'SOCIAL_WALL // SEÑALES CURADAS',
      title: 'El caos sigue en todas las pantallas',
      description: 'Accesos directos a los canales oficiales. El contenido automático llegará cuando cada plataforma tenga una integración estable.',
      external: 'Abrir canal externo',
    },
    empty: 'MEME_CORE OFFLINE // El caos está recargando.',
    sponsor: 'SPONSOR DE XETHKIOZ FUN',
    modes: { aria: 'Elegir modo de Diversión', eyebrow: 'FUN_OS // DOS EXPERIENCIAS, UN PORTAL', title: '¿Qué querés hacer hoy?', play: 'MODO JUEGOS', playDetail: 'Plaza Nexus, misiones, avatar y mundo social', memes: 'MODO MEMES', memesDetail: 'Humor, duelos, clips y contenido para compartir', loading: 'Cargando Plaza Nexus…', expand: 'EXPLORAR NEXUS CITY', collapse: 'CERRAR NEXUS CITY' },
    sections: { aria: 'Elegir sección de Memes', home: 'PORTADA', homeDetail: 'Qué hay en Meme Core', arcade: 'ARCADE', arcadeDetail: 'Chistes y duelo', clips: 'CLIPS', clipsDetail: 'Selección y redes', wall: 'MURO', wallDetail: 'Todos los memes' },
  },
  en: {
    title: 'Fun & Play',
    description: 'Enter Nexus Plaza, then keep scrolling for memes, jokes, clips and oddities powered by pure chaos.',
    heroAlt: 'Anime internet spirit bursting from a phone with meme energy',
    switchLanguage: 'Switch to Spanish',
    switchCode: 'ES',
    badge: 'CHAOS AUTHORIZED',
    back: 'Escape the chaos',
    stream: 'ILLEGAL HUMOR BROADCAST',
    read: 'Watch episode',
    react: 'LOL +1',
    reacted: 'REACTION SENT',
    reactionRegistered: 'Reaction sent',
    shareReady: 'Ready to share',
    shareCancelled: 'Share cancelled',
    share: 'SHARE',
    chaos: 'CHAOS METER',
    unleash: 'Unleash chaos',
    unstable: 'UNSTABLE',
    channelsLabel: 'Meme channels',
    chaosLines: [
      'The algorithm found a forbidden meme.',
      'A digital gremlin stole the server Wi-Fi.',
      'Dignity left the chat. Everything works.',
      'The Wisp laughed. This is concerning.',
    ],
    blocks: [
      { id: 'memes', code: '01', title: 'Quick memes', icon: '爆' },
      { id: 'clips', code: '02', title: 'Clips & videos', icon: '映' },
      { id: 'legends', code: '03', title: 'Oddities', icon: '怪' },
    ],
    marquee: 'MEME SIGNAL ◆ REACTION OVERLOAD ◆ INTERNET CULTURE',
    arcade: {
      eyebrow: 'CHAOS_ARCADE // QUICK MATCH',
      title: 'Do not just stand there watching',
      description: 'Choose your humor type, generate a dose and keep the streak alive. No account is required and no data is shared.',
      streak: 'STREAK',
      humorLabel: 'Humor type',
      modes: { gaming: 'Gaming', adulto: 'Adult life', trabajo: 'Work' } as Record<HumorMode, string>,
      next: 'ANOTHER DOSE OF CHAOS',
    },
    battle: {
      eyebrow: 'MEME_BATTLE // CHOOSE THE CHAMPION',
      player: 'PLAYER',
      chosen: 'CHOSEN',
      choose: 'THIS ONE WINS',
      reset: 'NEW BATTLE',
      voteRegistered: 'Vote registered in the meme battle',
    },
    loop: {
      eyebrow: 'CHAOS_LOOP // DO NOT WATCH WITHOUT JOINING',
      title: 'Here humor is touched, voted on and shared',
      description: 'Choose a quick dose: the featured clip, a meme to steal or the room where the next disaster begins.',
      items: [
        { code: 'WEEK', title: 'Clip of the week', detail: 'The moment that did not survive the stream', to: '/fun?mode=memes&section=clips#weekly-clip', action: 'Play' },
        { code: 'STEAL', title: 'Steal a meme', detail: 'Share it with the XETHKIOZ mark', to: '/fun?mode=memes&section=wall#meme-wall', action: 'Choose' },
        { code: 'LOL', title: 'Enter the chaos', detail: 'Comment and propose the next meme', to: '/community', action: 'Join' },
      ],
    },
    weekly: {
      label: 'CLIP OF THE WEEK',
      eyebrow: "EDITOR'S CHAOS PICK // EP.01",
      steal: 'STEAL MEME / SHARE',
    },
    social: {
      eyebrow: 'SOCIAL_WALL // CURATED SIGNALS',
      title: 'The chaos continues across every screen',
      description: 'Direct access to official channels. Automatic content will arrive when each platform has a stable integration.',
      external: 'Open external channel',
    },
    empty: 'MEME_CORE OFFLINE // Chaos is reloading.',
    sponsor: 'XETHKIOZ FUN SPONSOR',
    modes: { aria: 'Choose Fun mode', eyebrow: 'FUN_OS // TWO EXPERIENCES, ONE PORTAL', title: 'What do you want to do today?', play: 'GAME MODE', playDetail: 'Nexus Plaza, missions, avatar and social world', memes: 'MEME MODE', memesDetail: 'Humor, battles, clips and shareable content', loading: 'Loading Nexus Plaza…', expand: 'EXPLORE NEXUS CITY', collapse: 'CLOSE NEXUS CITY' },
    sections: { aria: 'Choose a Memes section', home: 'HOME', homeDetail: 'What is inside Meme Core', arcade: 'ARCADE', arcadeDetail: 'Jokes and battle', clips: 'CLIPS', clipsDetail: 'Weekly pick and socials', wall: 'WALL', wallDetail: 'Every meme' },
  },
} as const

export default function FunPortal() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedMode = searchParams.get('mode')
  const activeMode: FunPortalMode = requestedMode === 'memes' || (!requestedMode && typeof window !== 'undefined' && ['#humor', '#weekly-clip', '#meme-wall'].includes(window.location.hash)) ? 'memes' : 'play'
  const requestedSection = searchParams.get('section')
  const hashSection: MemeSection = typeof window !== 'undefined' && window.location.hash === '#weekly-clip' ? 'clips' : typeof window !== 'undefined' && window.location.hash === '#meme-wall' ? 'wall' : 'home'
  const activeMemeSection: MemeSection = requestedSection === 'arcade' || requestedSection === 'clips' || requestedSection === 'wall' ? requestedSection : requestedSection === 'home' ? 'home' : hashSection
  const jokes = humorDeck[lang]
  const [showNexusHub, setShowNexusHub] = useState(false)
  const [reacted, setReacted] = useState<Set<string>>(() => new Set())
  const [chaosIndex, setChaosIndex] = useState(0)
  const [reactionAnnouncement, setReactionAnnouncement] = useState('')
  const [humorMode, setHumorMode] = useState<HumorMode>('gaming')
  const [jokeIndex, setJokeIndex] = useState(0)
  const [laughStreak, setLaughStreak] = useState(0)
  const [battleVote, setBattleVote] = useState<string | null>(null)
  const [published, setPublished] = useState<PublicNewsArticle[]>([])
  const seen = new Set<string>()
  const articles = [...published, ...getCuratedExternalNews('community')]
    .filter((article) => !seen.has(article.slug) && Boolean(seen.add(article.slug)))
    .slice(0, 7)
  const humorModes = Object.keys(jokes) as HumorMode[]
  const memeSections: ReadonlyArray<{ id: MemeSection; label: string; detail: string }> = [
    { id: 'home', label: t.sections.home, detail: t.sections.homeDetail },
    { id: 'arcade', label: t.sections.arcade, detail: t.sections.arcadeDetail },
    { id: 'clips', label: t.sections.clips, detail: t.sections.clipsDetail },
    { id: 'wall', label: t.sections.wall, detail: t.sections.wallDetail },
  ]

  function selectPortalMode(mode: FunPortalMode) {
    const next = new URLSearchParams(searchParams)
    next.set('mode', mode)
    if (mode === 'play') next.delete('section')
    else if (!next.has('section')) next.set('section', 'home')
    setSearchParams(next)
    addWispXp(1, 'portal', `/fun?mode=${mode}`)
    window.requestAnimationFrame(() => document.getElementById('fun-mode-content')?.focus({ preventScroll: true }))
  }

  function selectMemeSection(section: MemeSection) {
    const next = new URLSearchParams(searchParams)
    next.set('mode', 'memes')
    next.set('section', section)
    setSearchParams(next)
    addWispXp(1, 'portal', `/fun?mode=memes&section=${section}`)
    window.requestAnimationFrame(() => document.getElementById('meme-section-content')?.focus({ preventScroll: true }))
  }

  function navigateWithLumina(destination: string) {
    if (destination === 'play') {
      selectPortalMode('play')
      return
    }
    const section = destination.replace('memes-', '')
    if (section === 'home' || section === 'arcade' || section === 'clips' || section === 'wall') selectMemeSection(section)
  }

  useEffect(() => {
    let alive = true
    void fetchPublishedNews('community').then((next) => { if (alive) setPublished(next) }).catch(() => undefined)
    return () => { alive = false }
  }, [])

  function react(slug: string) {
    if (reacted.has(slug)) return
    setReacted((current) => new Set(current).add(slug))
    const article = articles.find((item) => item.slug === slug)
    setReactionAnnouncement(`${t.reactionRegistered}: ${article?.title ?? slug}`)
    addWispXp(1, 'mission', `/fun#reaction-${slug}`)
  }

  function unleashChaos() {
    setChaosIndex((current) => (current + 1) % t.chaosLines.length)
    addWispXp(1, 'mission', '/fun#chaos-meter')
  }

  function generateJoke() {
    setJokeIndex((current) => (current + 1) % jokes[humorMode].length)
    setLaughStreak((current) => current + 1)
    addWispXp(1, 'mission', `/fun#humor-${humorMode}`)
  }

  function selectHumorMode(mode: HumorMode) {
    setHumorMode(mode)
    setJokeIndex(0)
  }

  function voteBattle(slug: string) {
    if (battleVote) return
    setBattleVote(slug)
    setReactionAnnouncement(t.battle.voteRegistered)
    addWispXp(2, 'mission', `/fun#battle-${slug}`)
  }

  async function shareArticle(article: PublicNewsArticle) {
    const url = `${window.location.origin}/news/${article.slug}`
    const shareData = { title: article.title, text: `${article.title} · XETHKIOZ`, url }
    try {
      if (navigator.share) await navigator.share(shareData)
      else window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${url}`)}`, '_blank', 'noopener,noreferrer')
      setReactionAnnouncement(`${t.shareReady}: ${article.title}`)
      addWispXp(2, 'mission', `/fun#share-${article.slug}`)
    } catch {
      setReactionAnnouncement(t.shareCancelled)
    }
  }

  function moveHumorFocus(currentIndex: number, direction: 1 | -1) {
    const nextIndex = (currentIndex + direction + humorModes.length) % humorModes.length
    const next = humorModes[nextIndex]
    selectHumorMode(next)
    document.getElementById(`humor-tab-${next}`)?.focus()
  }

  return (
    <>
      <SEO title={t.title} description={t.description} url="/fun" />
      <main className="xk-page xk-anime-page xk-anime-memes px-4 py-8 sm:px-6 lg:px-8">
        <div className="xk-manga-burst" aria-hidden="true" />
        <div className="xk-meme-ambient" aria-hidden="true"><i /><i /><i /><b>!</b><b>?</b><b>爆</b></div>
        <div className="mx-auto max-w-7xl">
          <section className="xk-fun-mode-switcher" aria-labelledby="fun-mode-title">
            <div><small>{t.modes.eyebrow}</small><h2 id="fun-mode-title">{t.modes.title}</h2></div>
            <div role="tablist" aria-label={t.modes.aria}>
              <button type="button" role="tab" aria-selected={activeMode === 'play'} aria-controls="fun-mode-content" onClick={() => selectPortalMode('play')}><span aria-hidden="true">▶</span><b>{t.modes.play}</b><small>{t.modes.playDetail}</small></button>
              <button type="button" role="tab" aria-selected={activeMode === 'memes'} aria-controls="fun-mode-content" onClick={() => selectPortalMode('memes')}><span aria-hidden="true">爆</span><b>{t.modes.memes}</b><small>{t.modes.memesDetail}</small></button>
            </div>
          </section>

          <PortalWispGuide variant="fun" activeDestination={activeMode === 'play' ? 'play' : `memes-${activeMemeSection}`} onNavigate={navigateWithLumina} />

          <div id="fun-mode-content" tabIndex={-1} className={`xk-fun-mode-content is-${activeMode}`}>
            {activeMode === 'play' ? <>
              <FunGameGateway lang={lang} />
              <button type="button" className="xk-nexus-expand" aria-expanded={showNexusHub} onClick={() => setShowNexusHub((current) => !current)}>{showNexusHub ? t.modes.collapse : t.modes.expand} <span aria-hidden="true">{showNexusHub ? '−' : '+'}</span></button>
              {showNexusHub ? <Suspense fallback={<div className="xk-fun-mode-loading" role="status"><i aria-hidden="true" />{t.modes.loading}</div>}><NexusCity embedded /></Suspense> : null}
            </> : null}

            {activeMode === 'memes' ? <>

          <section id="humor" className="xk-anime-hero xk-meme-hero scroll-mt-24" aria-labelledby="fun-title">
            <SafeImage src="/assets/identity/memes-anime-chaos-v1.webp" fallback="/images/articles/community.svg" alt={t.heroAlt} className="xk-anime-hero-media" loading="eager" fetchPriority="high" />
            <div className="xk-anime-hero-shade" aria-hidden="true" /><div className="xk-halftone" aria-hidden="true" />
            <div className="xk-meme-hero-sprites" aria-hidden="true"><span>HA!</span><span>?!</span><span>LOL</span></div>
            <div className="xk-anime-hero-content">
              <div className="flex items-center justify-between gap-4">
                <p className="xk-meme-warning"><span aria-hidden="true">⚠</span> MEME_CORE.EXE</p>
                <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="xk-sticker-button" aria-label={t.switchLanguage} title={t.switchLanguage}>{t.switchCode}</button>
              </div>
              <p className="xk-anime-kanji xk-meme-kanji" aria-hidden="true">混沌</p>
              <h1 id="fun-title" className="xk-meme-title" data-text="MEMES">MEMES!</h1>
              <p className="xk-speech-bubble">{t.description}</p>
              <span className="xk-chaos-stamp">{t.badge}</span>
            </div>
          </section>

          <nav className="xk-meme-section-nav" aria-label={t.sections.aria}>
            {memeSections.map((section) => <button key={section.id} type="button" aria-current={activeMemeSection === section.id ? 'page' : undefined} onClick={() => selectMemeSection(section.id)}><b>{section.label}</b><small>{section.detail}</small></button>)}
          </nav>

          <div id="meme-section-content" tabIndex={-1}>
          {activeMemeSection === 'home' ? <>
            <NexusDistrict tone="fun" />
            <div className="xk-meme-marquee" aria-hidden="true"><div>{t.marquee} ◆ {t.marquee} ◆</div></div>
            <PortalPulseRail tone="orange" eyebrow={t.loop.eyebrow} title={t.loop.title} description={t.loop.description} items={t.loop.items} />
          </> : null}

          {activeMemeSection === 'arcade' ? <>
          <section id="fun-chaos-panel" className="xk-chaos-console" aria-labelledby="fun-chaos-title">
            <h2 id="fun-chaos-title" className="sr-only">MEME CORE ARCADE</h2>
            <div className="xk-chaos-gauge"><div><span>{t.chaos}</span><b>96%</b></div><i aria-hidden="true"><em style={{ width: '96%' }} /></i><small>MEME_CORE // ARCADE // {t.unstable}</small></div>
            <div className="xk-chaos-output"><span aria-hidden="true">☄</span><p role="status" aria-live="polite" aria-atomic="true">{t.chaosLines[chaosIndex]}</p><button type="button" onClick={unleashChaos}>{t.unleash} →</button></div>
          </section>

          <section className="xk-fun-arcade" aria-labelledby="fun-arcade-title">
            <div className="xk-fun-arcade-head"><div><p>{t.arcade.eyebrow}</p><h2 id="fun-arcade-title">{t.arcade.title}</h2><span>{t.arcade.description}</span></div><b><small>{t.arcade.streak}</small>{laughStreak}</b></div>
            <div className="xk-humor-machine">
              <div role="tablist" aria-label={t.arcade.humorLabel}>{humorModes.map((mode, index) => <button key={mode} id={`humor-tab-${mode}`} type="button" role="tab" aria-selected={humorMode === mode} aria-controls="humor-output" tabIndex={humorMode === mode ? 0 : -1} onClick={() => selectHumorMode(mode)} onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveHumorFocus(index, 1) }
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveHumorFocus(index, -1) }
              }}>{t.arcade.modes[mode]}</button>)}</div>
              <blockquote id="humor-output" role="tabpanel" aria-labelledby={`humor-tab-${humorMode}`} aria-live="polite">“{jokes[humorMode][jokeIndex]}”</blockquote>
              <button type="button" onClick={generateJoke}>{t.arcade.next} →</button>
            </div>
            {articles.length >= 2 ? <div className="xk-meme-battle"><p>{t.battle.eyebrow}</p><div>{articles.slice(0, 2).map((article, index) => <article key={article.slug} className={battleVote === article.slug ? 'is-winner' : ''}><SafeImage src={article.cover_image_url} fallback="/images/articles/community-chat.svg" alt={article.cover_image_alt || article.title} className="h-full w-full object-cover" /><span>{t.battle.player} {index + 1}</span><h3>{article.title}</h3><button type="button" disabled={Boolean(battleVote)} onClick={() => voteBattle(article.slug)}>{battleVote === article.slug ? `${t.battle.chosen} ✓` : t.battle.choose}</button></article>)}</div>{battleVote ? <button type="button" onClick={() => setBattleVote(null)}>{t.battle.reset} ↻</button> : null}</div> : null}
          </section>
          </> : null}

          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{reactionAnnouncement}</p>

          {activeMemeSection === 'clips' ? <>
          {articles[0] && <section id="weekly-clip" className="xk-weekly-clip scroll-mt-28" aria-labelledby="weekly-clip-title">
            <div className="xk-weekly-clip-media"><SafeImage src={articles[0].cover_image_url} fallback="/news/memes/argentina-duendes-cuartos.svg" alt={articles[0].cover_image_alt || articles[0].title} className="h-full w-full object-cover" /><span>XETHKIOZ</span><b>{t.weekly.label.split(' ').map((word) => <span key={word}>{word}<br /></span>)}</b></div>
            <div><p>{t.weekly.eyebrow}</p><h2 id="weekly-clip-title">{articles[0].title}</h2><span>{articles[0].summary}</span><div><Link to={`/news/${articles[0].slug}`}>{t.read} →</Link><button type="button" onClick={() => void shareArticle(articles[0])}>{t.weekly.steal} ↗</button></div></div>
          </section>}

          <section className="xk-social-wall" aria-labelledby="social-wall-title">
            <div><p>{t.social.eyebrow}</p><h2 id="social-wall-title">{t.social.title}</h2><span>{t.social.description}</span></div>
            <div>{SOCIAL_LINKS.filter((social) => ['TikTok Principal', 'Threads', 'Instagram', 'YouTube'].includes(social.name)).map((social) => <a key={social.name} href={social.url} target="_blank" rel="noreferrer noopener" aria-label={`${t.social.external}: ${social.name}`}><span aria-hidden="true">{social.icon}</span><b>{social.name}</b><small>{social.handle} <span aria-hidden="true">↗</span></small></a>)}</div>
          </section>
          </> : null}

          {activeMemeSection === 'wall' ? <>
          <section id="meme-wall" className="mt-12 scroll-mt-28" aria-labelledby="meme-wall-title">
            <div className="xk-anime-section-title xk-meme-section-title"><span>LIVE!</span><h2 id="meme-wall-title">{t.stream}</h2><i aria-hidden="true" /></div>
            <div className="xk-meme-bento">{articles.map((article, index) => <article key={article.slug} className={`xk-meme-card xk-meme-card-${index + 1}${reacted.has(article.slug) ? ' is-reacted' : ''}`}>
              <div className="xk-meme-image-wrap"><SafeImage src={article.cover_image_url} fallback="/news/memes/argentina-duendes-cuartos.svg" alt={article.cover_image_alt || article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span aria-hidden="true">{['LOL!', 'WTF?!', 'JAJA', 'NOOO', 'GG!', 'BRUH', 'XD'][index % 7]}</span><small>XETHKIOZ</small></div>
              <div className="xk-meme-copy"><small>EP.{String(index + 1).padStart(2, '0')} // {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</small><h3>{article.title}</h3>{index === 0 && <p>{article.summary}</p>}<div><Link to={`/news/${article.slug}`}>{t.read} →</Link><button type="button" onClick={() => react(article.slug)} disabled={reacted.has(article.slug)}>{reacted.has(article.slug) ? t.reacted : t.react}</button><button type="button" onClick={() => void shareArticle(article)}>{t.share} ↗</button></div></div>
            </article>)}</div>
            {articles.length === 0 && <p className="xk-empty-signal xk-empty-signal-meme" role="status">{t.empty}</p>}
          </section>

          <div className="mt-10"><PublicAdSlot slotId="section-sidebar" fallbackLabel={t.sponsor} /></div>
          </> : null}
          </div>
            </> : null}
          </div>
          <Link to="/" className="xk-sticker-button mt-8 inline-flex">{t.back}</Link>
        </div>
      </main>
    </>
  )
}
