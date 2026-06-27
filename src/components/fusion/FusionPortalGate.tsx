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
}

export default function FusionPortalGate({
  to,
  title,
  subtitle,
  tone,
  icon,
  enterLabel,
  ariaLabel,
}: FusionPortalGateProps) {
  return (
    <Link to={to} className={`wow-portal wow-portal-${tone} group`} aria-label={ariaLabel || `${enterLabel}: ${title}`}>
      <span className="portal-stone-top" aria-hidden="true" />
      <span className="portal-vortex" aria-hidden="true" />
      <span className="portal-runes" aria-hidden="true" />
      <span className="portal-depth" aria-hidden="true" />
      <span className="portal-icon" aria-hidden="true">{icon}</span>
      <span className="portal-title">{title}</span>
      <span className="portal-subtitle">{subtitle}</span>
      <span className="portal-enter">{enterLabel}</span>
    </Link>
  )
}
