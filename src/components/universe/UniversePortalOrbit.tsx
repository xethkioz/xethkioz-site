import { useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SafeImage from '../SafeImage'
import { useLang } from '../../lib/LangContext'
import { UNIVERSE_PORTALS, type UniversePortalId } from '../../lib/universePortals'
import { useWisp } from '../../providers/WispProvider'
import './MagicPortalNexus.css'

type PortalPresentation = {
  frame?: string
  position: string
  tier: 'primary' | 'secondary'
  rune: string
}

const PORTAL_PRESENTATION: Record<UniversePortalId, PortalPresentation> = {
  gaming: {
    frame: '/assets/portal-games-clean-v1.webp',
    position: '50% 52%',
    tier: 'primary',
    rune: 'ᚷ',
  },
  science: {
    frame: '/assets/portal-science-clean-v1.webp',
    position: '50% 48%',
    tier: 'primary',
    rune: '✦',
  },
  fun: {
    frame: '/assets/portal-fun-chaos-v2.webp',
    position: '50% 52%',
    tier: 'primary',
    rune: '☄',
  },
  nexus: {
    position: '50% 42%',
    tier: 'secondary',
    rune: '界',
  },
  web: {
    position: '50% 48%',
    tier: 'secondary',
    rune: '創',
  },
  green: {
    position: '50% 42%',
    tier: 'secondary',
    rune: '禁',
  },
}

// The former setInterval orbital rotation was intentionally removed: portals stay stable and visible.
// Motion effects are disabled by prefers-reduced-motion: reduce in MagicPortalNexus.css.
export function UniversePortalOrbit() {
  const { lang } = useLang()
  const navigate = useNavigate()
  const { triggerGreenPortal } = useWisp()
  const [activeIndex, setActiveIndex] = useState(0)
  const active = UNIVERSE_PORTALS[activeIndex]
  const activePresentation = PORTAL_PRESENTATION[active.id]

  function move(direction: 1 | -1) {
    setActiveIndex((current) => (current + direction + UNIVERSE_PORTALS.length) % UNIVERSE_PORTALS.length)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      move(1)
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      move(-1)
    }
    if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(UNIVERSE_PORTALS.length - 1)
    }
  }

  function openGreenNode() {
    triggerGreenPortal()
    window.setTimeout(() => navigate('/green-node'), 450)
  }

  return (
    <section
      id="portals"
      className="xk-universe-gate xk-magic-portal-nexus"
      aria-labelledby="universe-gate-title"
      style={{ '--universe-tone': active.tone } as CSSProperties}
    >
      <header className="xk-universe-gate-head xk-magic-portal-head">
        <div>
          <p>XETHKIOZ // PORTAL NEXUS</p>
          <h2 id="universe-gate-title">
            {lang === 'es' ? 'Elegí qué mundo querés atravesar.' : 'Choose the world you want to cross.'}
          </h2>
        </div>
        <span><i /> {lang === 'es' ? '6 PORTALES ACTIVOS' : '6 ACTIVE PORTALS'}</span>
      </header>

      <div className="xk-universe-stage xk-magic-portal-stage">
        <div className="xk-universe-cosmos xk-magic-portal-atmosphere" aria-hidden="true">
          <i /><i /><i /><b /><b />
        </div>

        <div
          className="xk-universe-satellites xk-magic-portal-grid"
          role="tablist"
          aria-label={lang === 'es' ? 'Portales de XETHKIOZ' : 'XETHKIOZ portals'}
          onKeyDown={handleKeyDown}
        >
          {UNIVERSE_PORTALS.map((portal, index) => {
            const presentation = PORTAL_PRESENTATION[portal.id]
            const selected = index === activeIndex

            return (
              <button
                key={portal.id}
                id={`universe-tab-${portal.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="universe-active-portal"
                tabIndex={selected ? 0 : -1}
                className="xk-magic-portal-card"
                data-tier={presentation.tier}
                data-portal={portal.id}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                style={{ '--portal-tone': portal.tone } as CSSProperties}
              >
                <span className="xk-magic-portal-aura" aria-hidden="true" />
                <span className="xk-magic-portal-gate">
                  <span className="xk-magic-portal-world">
                    <SafeImage
                      src={portal.image}
                      fallback="/images/articles/fallback.svg"
                      alt=""
                      style={{ objectPosition: presentation.position }}
                    />
                    <span className="xk-magic-portal-depth" aria-hidden="true" />
                  </span>
                  {presentation.frame ? (
                    <SafeImage
                      src={presentation.frame}
                      fallback="/images/articles/fallback.svg"
                      alt=""
                      className="xk-magic-portal-frame"
                    />
                  ) : (
                    <span className="xk-magic-portal-forged-frame" aria-hidden="true">
                      <i>{presentation.rune}</i><i>✦</i><i>{presentation.rune}</i><i>✦</i>
                    </span>
                  )}
                  <span className="xk-magic-portal-particles" aria-hidden="true"><i /><i /><i /><i /></span>
                </span>

                <span className="xk-magic-portal-caption">
                  <small>{portal.code} // {portal.signal[lang]}</small>
                  <strong>{portal.title[lang]}</strong>
                  <span>{portal.subtitle[lang]}</span>
                  <b>{selected ? (lang === 'es' ? 'PORTAL SELECCIONADO' : 'PORTAL SELECTED') : (lang === 'es' ? 'ELEGIR PORTAL' : 'CHOOSE PORTAL')}</b>
                </span>
              </button>
            )
          })}
        </div>

        <article
          id="universe-active-portal"
          className="xk-universe-active xk-magic-active-panel"
          role="tabpanel"
          aria-labelledby={`universe-tab-${active.id}`}
          aria-live="polite"
          style={{ '--portal-tone': active.tone } as CSSProperties}
        >
          <Link
            to={active.id === 'green' ? '#' : active.route}
            className="xk-universe-core xk-magic-active-gate"
            onClick={active.id === 'green' ? (event) => { event.preventDefault(); openGreenNode() } : undefined}
            aria-label={`${lang === 'es' ? 'Atravesar' : 'Cross'} ${active.title[lang]}`}
          >
            <span className="xk-universe-core-image xk-magic-active-image">
              <SafeImage
                key={active.id}
                src={active.image}
                fallback="/images/articles/fallback.svg"
                alt=""
                style={{ objectPosition: activePresentation.position }}
              />
            </span>
            <i aria-hidden="true" /><b aria-hidden="true" />
          </Link>

          <div className="xk-magic-active-copy">
            <p>{active.code} // {active.signal[lang]}</p>
            <h3>{active.title[lang]}</h3>
            <span>{active.subtitle[lang]}</span>
            {active.id === 'green' ? (
              <button type="button" onClick={openGreenNode}>
                {lang === 'es' ? 'INTERCEPTAR Y ATRAVESAR' : 'INTERCEPT AND CROSS'} <b>↗</b>
              </button>
            ) : (
              <Link to={active.route}>
                {lang === 'es' ? 'ATRAVESAR PORTAL' : 'CROSS PORTAL'} <b>↗</b>
              </Link>
            )}
          </div>
        </article>
      </div>

      <p className="xk-universe-instruction xk-magic-portal-instruction">
        {lang === 'es'
          ? 'Todos los mundos permanecen visibles · elegí un umbral · usá las flechas para recorrerlos'
          : 'Every world remains visible · choose a threshold · use arrow keys to explore'}
      </p>
    </section>
  )
}
