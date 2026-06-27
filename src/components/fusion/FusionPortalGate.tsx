import { useState } from 'react'
import { Link } from 'react-router-dom'

export type FusionPortalTone = 'violet' | 'blue' | 'orange' | 'green'

export interface FusionPortalGateProps {
  to: string
  title: string
  subtitle: string
  tone: FusionPortalTone
  icon: string
  enterLabel: string
  ariaLabel?: string
  panels?: string[]
}

export default function FusionPortalGate({
  to,
  title,
  subtitle,
  tone,
  icon,
  enterLabel,
  ariaLabel,
  panels = [],
}: FusionPortalGateProps) {
  const [greenAwake, setGreenAwake] = useState(false)
  const isGreen = tone === 'green'

  return (
    <Link
      to={to}
      className={`wow-portal wow-portal-${tone} ${isGreen ? 'wow-portal-guarded' : ''} ${greenAwake ? 'is-goblin-looking' : ''} group`}
      aria-label={ariaLabel || `${enterLabel}: ${title}`}
      aria-disabled={isGreen && !greenAwake}
      onMouseEnter={() => isGreen && setGreenAwake(true)}
      onFocus={() => isGreen && setGreenAwake(true)}
      onClick={(event) => {
        if (isGreen && !greenAwake) {
          event.preventDefault()
          setGreenAwake(true)
        }
      }}
    >
      <span className="portal-stone-top" aria-hidden="true" />
      <span className="portal-vortex" aria-hidden="true" />
      <span className="portal-runes" aria-hidden="true" />
      <span className="portal-depth" aria-hidden="true" />
      {isGreen && (
        <>
          <span className="portal-gold-fountain" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="portal-goblin" aria-hidden="true">
            <b className="goblin-hood" />
            <b className="goblin-face">
              <i />
              <i />
            </b>
            <b className="goblin-hand goblin-hand-left" />
            <b className="goblin-hand goblin-hand-right" />
          </span>
        </>
      )}
      <span className="portal-icon" aria-hidden="true">{icon}</span>
      <span className="portal-title">{title}</span>
      <span className="portal-subtitle">{subtitle}</span>
      {panels.length > 0 && (
        <span className="portal-panel-list" aria-hidden="true">
          {panels.slice(0, 4).map((panel) => (
            <span key={panel}>{panel}</span>
          ))}
        </span>
      )}
      <span className="portal-enter">{isGreen && !greenAwake ? 'Mirame primero' : enterLabel}</span>
    </Link>
  )
}
