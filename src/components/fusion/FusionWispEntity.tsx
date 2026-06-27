import { Link } from 'react-router-dom'

export type FusionWispState = 'idle' | 'watching' | 'connected'

export interface FusionWispEntityProps {
  to?: string
  label: string
  state?: FusionWispState
}

export default function FusionWispEntity({ to = '/green-node', label, state = 'idle' }: FusionWispEntityProps) {
  return (
    <Link to={to} aria-label={label} className={`fusion-wisp-entity fusion-wisp-${state}`} title={label}>
      <span className="fusion-wisp-orbit fusion-wisp-orbit-one" aria-hidden="true" />
      <span className="fusion-wisp-orbit fusion-wisp-orbit-two" aria-hidden="true" />
      <span className="fusion-wisp-core" aria-hidden="true">
        <span className="fusion-wisp-eye left" />
        <span className="fusion-wisp-eye right" />
      </span>
      <span className="fusion-wisp-tail fusion-wisp-tail-one" aria-hidden="true" />
      <span className="fusion-wisp-tail fusion-wisp-tail-two" aria-hidden="true" />
      <span className="fusion-wisp-sparks" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </Link>
  )
}
