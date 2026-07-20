import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
import { UNIVERSE_PORTALS } from '../../lib/universePortals'

export function UniverseTransitRail({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang()
  const location = useLocation()

  return (
    <nav className={`xk-universe-transit-rail${compact ? ' is-compact' : ''}`} aria-label={lang === 'es' ? 'Tránsito entre universos XETHKIOZ' : 'XETHKIOZ universe transit'}>
      <div><span>{lang === 'es' ? 'LÍNEA MULTIVERSO' : 'MULTIVERSE LINE'}</span><i /> <b>∞</b></div>
      <div>
        {UNIVERSE_PORTALS.map((portal) => {
          const active = location.pathname === portal.route || location.pathname.startsWith(`${portal.route}/`)
          return <Link key={portal.id} to={portal.route} aria-current={active ? 'page' : undefined} style={{ '--node-tone': portal.tone } as CSSProperties}>
            <i>{portal.glyph}</i><span><small>{portal.code}</small><strong>{portal.title[lang]}</strong></span>
          </Link>
        })}
      </div>
    </nav>
  )
}
