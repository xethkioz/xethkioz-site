import Logo from '../Logo'
import FusionPortalGate, { type FusionPortalTone } from './FusionPortalGate'
import FusionStatusRail from './FusionStatusRail'

export interface FusionWorldPortal {
  to: string
  title: string
  subtitle: string
  tone: FusionPortalTone
  icon: string
  ariaLabel: string
  panels?: string[]
}

interface FusionWorldStageProps {
  eyebrow: string
  title: string
  description: string
  choosePortal: string
  enterLabel: string
  portals: FusionWorldPortal[]
}

export default function FusionWorldStage({
  eyebrow,
  title,
  description,
  choosePortal,
  enterLabel,
  portals,
}: FusionWorldStageProps) {
  return (
    <section className="fusion-live-stage" aria-label="XETHKIOZ World Gate">
      <div className="fusion-live-sky" aria-hidden="true" />
      <div className="fusion-live-grid" aria-hidden="true" />
      <div className="fusion-live-smoke fusion-live-smoke-a" aria-hidden="true" />
      <div className="fusion-live-smoke fusion-live-smoke-b" aria-hidden="true" />

      <div className="fusion-stage-header">
        <div>
          <Logo size="xl" />
          <p>Gaming Is My Passion • Beyond The Game</p>
        </div>
      </div>

      <FusionStatusRail items={['World Gate activo', 'Cyberpunk 3000', 'Portales reales', 'Sin imagen-UI pegada']} />

      <div className="fusion-live-battle" aria-hidden="true">
        <div className="fusion-live-dragon">
          <span className="fusion-live-dragon-wing wing-left" />
          <span className="fusion-live-dragon-wing wing-right" />
          <span className="fusion-live-dragon-neck" />
          <span className="fusion-live-dragon-head">
            <i className="eye-left" />
            <i className="eye-right" />
          </span>
          <span className="fusion-live-dragon-breath" />
        </div>

        <div className="fusion-live-avatar">
          <span className="fusion-avatar-aura" />
          <span className="fusion-avatar-core" />
          <span className="fusion-avatar-hood" />
          <span className="fusion-avatar-sword" />
        </div>
      </div>

      <div className="fusion-stage-copy">
        <p className="section-eyebrow">{eyebrow}</p>
        <h1>XETHKIOZ</h1>
        <span>{title}</span>
        <p>{description}</p>
      </div>

      <nav className="fusion-stage-portals" aria-label={choosePortal}>
        <p>{choosePortal}</p>
        <div>
          {portals.map((portal) => (
            <FusionPortalGate
              key={portal.to}
              to={portal.to}
              title={portal.title}
              subtitle={portal.subtitle}
              tone={portal.tone}
              icon={portal.icon}
              enterLabel={enterLabel}
              ariaLabel={portal.ariaLabel}
              panels={portal.panels}
            />
          ))}
        </div>
      </nav>
    </section>
  )
}
