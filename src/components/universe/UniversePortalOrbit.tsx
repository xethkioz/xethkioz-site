import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import SafeImage from '../SafeImage'
import { useLang } from '../../lib/LangContext'
import { UNIVERSE_PORTALS } from '../../lib/universePortals'

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(preference.matches)
    sync()
    preference.addEventListener('change', sync)
    return () => preference.removeEventListener('change', sync)
  }, [])
  return reduced
}

export function UniversePortalOrbit() {
  const { lang } = useLang()
  const reducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [manualPaused, setManualPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const paused = manualPaused || interacting
  const active = UNIVERSE_PORTALS[activeIndex]
  const progress = useMemo(() => `${activeIndex + 1} / ${UNIVERSE_PORTALS.length}`, [activeIndex])

  useEffect(() => {
    if (reducedMotion || paused) return undefined
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % UNIVERSE_PORTALS.length), 6500)
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion])

  function move(direction: 1 | -1, focusTab = false) {
    setActiveIndex((current) => {
      const next = (current + direction + UNIVERSE_PORTALS.length) % UNIVERSE_PORTALS.length
      if (focusTab) window.requestAnimationFrame(() => tabsRef.current[next]?.focus())
      return next
    })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); move(1, true) }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); move(-1, true) }
    if (event.key === 'Home') { event.preventDefault(); setActiveIndex(0); tabsRef.current[0]?.focus() }
    if (event.key === 'End') { event.preventDefault(); setActiveIndex(UNIVERSE_PORTALS.length - 1); tabsRef.current[UNIVERSE_PORTALS.length - 1]?.focus() }
  }

  return (
    <section
      id="portals"
      className="xk-universe-gate"
      aria-labelledby="universe-gate-title"
      style={{ '--universe-tone': active.tone } as CSSProperties}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false) }}
    >
      <header className="xk-universe-gate-head">
        <div><p>XETHKIOZ // WORLD SELECTOR</p><h2 id="universe-gate-title">{lang === 'es' ? 'El universo está girando.' : 'The universe is turning.'}</h2></div>
        <span><i /> {paused ? (lang === 'es' ? 'ÓRBITA EN PAUSA' : 'ORBIT PAUSED') : (lang === 'es' ? 'ÓRBITA AUTOMÁTICA' : 'AUTO ORBIT')} · {progress}</span>
      </header>

      <div className="xk-universe-stage">
        <div className="xk-universe-cosmos" aria-hidden="true"><i /><i /><i /><b /><b /></div>
        <Link to={active.route} className="xk-universe-core" aria-label={`${lang === 'es' ? 'Entrar a' : 'Enter'} ${active.title[lang]}`}>
          <span className="xk-universe-core-image"><SafeImage key={active.id} src={active.image} fallback="/images/articles/fallback.svg" alt="" /></span>
          <i aria-hidden="true" /><b aria-hidden="true" />
        </Link>

        <div className="xk-universe-satellites" role="tablist" aria-label={lang === 'es' ? 'Elegir portal del universo' : 'Choose universe portal'} onKeyDown={handleKeyDown}>
          {UNIVERSE_PORTALS.map((portal, index) => (
            <button
              key={portal.id}
              ref={(element) => { tabsRef.current[index] = element }}
              id={`universe-tab-${portal.id}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="universe-active-portal"
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              style={{ '--node-angle': `${index * 60}deg`, '--node-counter-angle': `${index * -60}deg`, '--node-tone': portal.tone } as CSSProperties}
            >
              <i>{portal.glyph}</i><span>{portal.code}</span><strong>{portal.title[lang]}</strong>
            </button>
          ))}
        </div>

        <article id="universe-active-portal" className="xk-universe-active" role="tabpanel" aria-labelledby={`universe-tab-${active.id}`} aria-live="polite">
          <p>{active.code} // {active.signal[lang]}</p>
          <h3>{active.title[lang]}</h3>
          <span>{active.subtitle[lang]}</span>
          <Link to={active.route}>{lang === 'es' ? 'ATRAVESAR PORTAL' : 'CROSS PORTAL'} <b>↗</b></Link>
        </article>

        <div className="xk-universe-controls">
          <button type="button" onClick={() => move(-1)} aria-label={lang === 'es' ? 'Portal anterior' : 'Previous portal'}>←</button>
          <button type="button" onClick={() => setManualPaused((current) => !current)} aria-pressed={manualPaused} aria-label={manualPaused ? (lang === 'es' ? 'Reanudar órbita' : 'Resume orbit') : (lang === 'es' ? 'Pausar órbita' : 'Pause orbit')}>{manualPaused ? '▶' : 'Ⅱ'}</button>
          <button type="button" onClick={() => move(1)} aria-label={lang === 'es' ? 'Portal siguiente' : 'Next portal'}>→</button>
        </div>
      </div>

      <p className="xk-universe-instruction">{lang === 'es' ? 'Elegí una señal · usá las flechas · la órbita se pausa cuando interactuás' : 'Choose a signal · use arrow keys · orbit pauses while you interact'}</p>
    </section>
  )
}
