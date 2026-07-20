import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
import { UNIVERSE_PORTALS } from '../../lib/universePortals'

export function UniverseTransitRail({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang()
  const location = useLocation()
  const navigationLabel = lang === 'es'
    ? 'Navegación entre portales XETHKIOZ'
    : 'XETHKIOZ portal navigation'
  const networkLabel = lang === 'es' ? 'RED DE PORTALES' : 'PORTAL NETWORK'

  return (
    <nav className={`xk-universe-transit-rail${compact ? ' is-compact' : ''}`} aria-label={navigationLabel}>
      <div><span>{networkLabel}</span><i /> <b aria-hidden="true">◆</b></div>
      <div>
        {UNIVERSE_PORTALS.map((portal) => {
          const active = location.pathname === portal.route || location.pathname.startsWith(`${portal.route}/`)
          return (
            <Link
              key={portal.id}
              to={portal.route}
              aria-current={active ? 'page' : undefined}
              style={{ '--node-tone': portal.tone } as CSSProperties}
            >
              <i aria-hidden="true">{portal.glyph}</i>
              <span><small>{portal.code}</small><strong>{portal.title[lang]}</strong></span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
