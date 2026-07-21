type BabyDemonStage = 'idle' | 'quest' | 'ready' | 'complete'

type NexusBabyDemonWispProps = {
  nearby: boolean
  stage: BabyDemonStage
}

export default function NexusBabyDemonWisp({ nearby, stage }: NexusBabyDemonWispProps) {
  return (
    <span className={`xk-baby-demon-v2 is-${stage}${nearby ? ' is-awake' : ''}`} aria-hidden="true">
      <span className="xk-baby-demon-aura" />
      <span className="xk-baby-demon-shadow" />
      <span className="xk-baby-demon-tail"><i /></span>
      <span className="xk-baby-demon-wing is-left"><i /></span>
      <span className="xk-baby-demon-wing is-right"><i /></span>
      <span className="xk-baby-demon-body"><i className="is-belly" /><i className="is-foot-left" /><i className="is-foot-right" /></span>
      <span className="xk-baby-demon-head">
        <i className="xk-baby-demon-horn is-left" />
        <i className="xk-baby-demon-horn is-right" />
        <i className="xk-baby-demon-ear is-left" />
        <i className="xk-baby-demon-ear is-right" />
        <i className="xk-baby-demon-eye is-left" />
        <i className="xk-baby-demon-eye is-right" />
        <i className="xk-baby-demon-mouth" />
      </span>
      <span className="xk-baby-demon-spark is-one" />
      <span className="xk-baby-demon-spark is-two" />
      <span className="xk-baby-demon-spark is-three" />
    </span>
  )
}
