import type { CSSProperties, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import type { WispMood } from '../../lib/WispEngineContext'

export type FusionWispState = WispMood
export const FUSION_WISP_STATES: FusionWispState[] = ['idle', 'watching', 'connected', 'guiding', 'alert', 'sleeping', 'GREEN_MODE']

export interface FusionWispEntityProps {
  to?: string
  label: string
  state?: FusionWispState
  energy?: number
  message?: string
  onFocusSignal?: () => void
  onActivate?: () => void
}

export default function FusionWispEntity({
  to = '/green-node',
  label,
  state = 'idle',
  energy = 37,
  message,
  onFocusSignal,
  onActivate,
}: FusionWispEntityProps) {
  const stateClass = state === 'GREEN_MODE' ? 'green-mode' : state

  const handleClick = (_event: MouseEvent<HTMLAnchorElement>) => {
    onActivate?.()
    onFocusSignal?.()
  }

  return (
    <Link
      to={to}
      aria-label={`${label} · ${state}`}
      className={`fusion-wisp-entity fusion-wisp-${stateClass}`}
      title={label}
      onMouseEnter={onFocusSignal}
      onFocus={onFocusSignal}
      onClick={handleClick}
      style={{ '--wisp-energy': `${energy}%` } as CSSProperties}
    >
      <span className="fusion-wisp-orbit fusion-wisp-orbit-one" aria-hidden="true" />
      <span className="fusion-wisp-orbit fusion-wisp-orbit-two" aria-hidden="true" />
      <span className="fusion-wisp-signal" aria-hidden="true" />
      <span className="fusion-wisp-core" aria-hidden="true">
        <span className="fusion-wisp-eye left" />
        <span className="fusion-wisp-eye right" />
      </span>
      <span className="fusion-wisp-tail fusion-wisp-tail-one" aria-hidden="true" />
      <span className="fusion-wisp-tail fusion-wisp-tail-two" aria-hidden="true" />
      <span className="fusion-wisp-sparks" aria-hidden="true" />
      <span className="fusion-wisp-meter" aria-hidden="true"><i /></span>
      {message && <span className="fusion-wisp-bubble" aria-hidden="true">{message}</span>}
      <span className="sr-only">{label}</span>
    </Link>
  )
}
