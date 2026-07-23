import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import SafeImage from '../SafeImage'
import { guideGames, radarGames, type GuideLang } from '../../data/gamingGuideCatalog'
import './GamingGuideRotation.css'

type RotationItem = {
  id: string
  title: string
  code: string
  description: string
  meta: string
  image: string
  color: string
  to: string
  kind: 'guide' | 'radar'
}

const copy = {
  es: {
    eyebrow: 'GAME_SELECT // ARCHIVO PRINCIPAL',
    title: 'Cuatro mundos con guías. Cinco señales bajo vigilancia.',
    description: 'Elegí un juego del menú rotativo. WoW, Diablo IV, Final Fantasy XIV y Path of Exile tienen biblioteca propia; el resto vive en el radar editorial.',
    guide: 'GUÍA COMPLETA',
    radar: 'RADAR ACTIVO',
    openGuide: 'ABRIR GUÍA',
    openRadar: 'VER NOTICIAS',
    guidesLabel: 'Juegos con biblioteca de guías',
    radarLabel: 'Juegos bajo seguimiento editorial',
    previous: 'Juego anterior',
    next: 'Juego siguiente',
    pause: 'Pausar rotación automática',
    resume: 'Reanudar rotación automática',
  },
  en: {
    eyebrow: 'GAME_SELECT // PRIMARY ARCHIVE',
    title: 'Four worlds with guides. Five signals under watch.',
    description: 'Choose a game from the rotating menu. WoW, Diablo IV, Final Fantasy XIV and Path of Exile have dedicated libraries; the rest lives in the editorial radar.',
    guide: 'FULL GUIDE',
    radar: 'ACTIVE RADAR',
    openGuide: 'OPEN GUIDE',
    openRadar: 'VIEW NEWS',
    guidesLabel: 'Games with a guide library',
    radarLabel: 'Games under editorial watch',
    previous: 'Previous game',
    next: 'Next game',
    pause: 'Pause automatic rotation',
    resume: 'Resume automatic rotation',
  },
} as const

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function GamingGuideRotation({ lang }: { lang: GuideLang }) {
  const t = copy[lang]
  const items = useMemo<RotationItem[]>(() => [
    ...guideGames.map((game) => ({
      id: game.id,
      title: game.title,
      code: game.code,
      description: game.subtitle[lang],
      meta: game.status[lang],
      image: game.image,
      color: game.color,
      to: `/gaming/guides?game=${game.id}`,
      kind: 'guide' as const,
    })),
    ...radarGames.map((game) => ({
      id: game.id,
      title: game.title,
      code: game.code,
      description: game.description[lang],
      meta: game.focus[lang],
      image: game.image,
      color: game.color,
      to: `/news?category=gaming&game=${encodeURIComponent(game.query)}`,
      kind: 'radar' as const,
    })),
  ], [lang])
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(prefersReducedMotion)
  const [interactionPaused, setInteractionPaused] = useState(false)
  const active = items[activeIndex] ?? items[0]
  const rotationPaused = paused || interactionPaused

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => {
      if (preference.matches) setPaused(true)
    }

    preference.addEventListener('change', syncPreference)
    return () => preference.removeEventListener('change', syncPreference)
  }, [])

  useEffect(() => {
    if (rotationPaused) return undefined
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % items.length), 6200)
    return () => window.clearInterval(timer)
  }, [items.length, rotationPaused])

  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + items.length) % items.length)
  }

  const selectGame = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <section
      className="xk-game-rotation"
      aria-labelledby="game-rotation-title"
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteractionPaused(false)
      }}
      style={{ '--rotation-accent': active.color } as CSSProperties}
    >
      <header className="xk-game-rotation-head">
        <div><p>{t.eyebrow}</p><h2 id="game-rotation-title">{t.title}</h2><span>{t.description}</span></div>
        <div>
          <button type="button" onClick={() => move(-1)} aria-label={t.previous}>←</button>
          <button type="button" onClick={() => setPaused((current) => !current)} aria-label={paused ? t.resume : t.pause} aria-pressed={paused}>{paused ? '▶' : 'Ⅱ'}</button>
          <button type="button" onClick={() => move(1)} aria-label={t.next}>→</button>
        </div>
      </header>

      <article className="xk-game-rotation-stage">
        <SafeImage src={active.image} fallback="/images/articles/gaming.svg" alt={`${lang === 'es' ? 'Arte representativo de' : 'Representative art for'} ${active.title}`} className="xk-game-rotation-image" />
        <div className="xk-game-rotation-shade" aria-hidden="true" />
        <div className="xk-game-rotation-copy">
          <small>{active.kind === 'guide' ? t.guide : t.radar} // {active.code}</small>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
          <span>{active.meta}</span>
          <Link to={active.to}>{active.kind === 'guide' ? t.openGuide : t.openRadar} <b>→</b></Link>
        </div>
        <strong className="xk-game-rotation-count">{String(activeIndex + 1).padStart(2, '0')}<small>/ {String(items.length).padStart(2, '0')}</small></strong>
      </article>

      <div className="xk-game-rotation-groups">
        <div><p>{t.guidesLabel}</p><nav aria-label={t.guidesLabel}>{guideGames.map((game) => {
          const index = items.findIndex((item) => item.id === game.id)
          const isActive = active.id === game.id
          return <button key={game.id} type="button" className={isActive ? 'is-active' : ''} aria-pressed={isActive} onClick={() => selectGame(index)}><span style={{ background: game.color }} aria-hidden="true" /><b>{game.title}</b><small>{game.code}</small></button>
        })}</nav></div>
        <div><p>{t.radarLabel}</p><nav aria-label={t.radarLabel}>{radarGames.map((game) => {
          const index = items.findIndex((item) => item.id === game.id)
          const isActive = active.id === game.id
          return <button key={game.id} type="button" className={isActive ? 'is-active' : ''} aria-pressed={isActive} onClick={() => selectGame(index)}><span style={{ background: game.color }} aria-hidden="true" /><b>{game.title}</b><small>{game.code}</small></button>
        })}</nav></div>
      </div>
    </section>
  )
}
