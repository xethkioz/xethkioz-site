import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

const portalMeta = [
  { key: 'games' as const, to: '/gaming', cls: 'fusion-portal-games' },
  { key: 'science' as const, to: '/science', cls: 'fusion-portal-science' },
  { key: 'fun' as const, to: '/fun', cls: 'fusion-portal-fun' },
]

export default function Home() {
  const { t } = useLang()

  return (
    <div className="fusion-home min-h-screen bg-[#050608] text-white">
      <SEO
        title="XETHKIOZ Fusion Web 1.0"
        description="XETHKIOZ Fusion Web: gaming, ciencia, tecnología y comunidad en un ecosistema interactivo con Green Wisp oculto."
        url="/"
      />

      <section className="fusion-gate" aria-label="XETHKIOZ Fusion Web Gate">
        <div className="fusion-atmosphere" aria-hidden="true" />
        <div className="fusion-grid" aria-hidden="true" />
        <div className="fusion-embers" aria-hidden="true" />
        <div className="fusion-rift fusion-rift-left" aria-hidden="true" />
        <div className="fusion-rift fusion-rift-right" aria-hidden="true" />

        <div className="fusion-brand-block">
          <p className="fusion-kicker">Fusion Web 1.0</p>
          <h1>XETHKIOZ</h1>
          <p>{t.v7.core.description}</p>
        </div>

        <div className="fusion-battlefield" aria-hidden="true">
          <div className="fusion-dragon">
            <span className="dragon-wing dragon-wing-left" />
            <span className="dragon-wing dragon-wing-right" />
            <span className="dragon-head"><i /><i /></span>
            <span className="dragon-breath" />
          </div>

          <div className="fusion-avatar">
            <span className="avatar-aura" />
            <span className="avatar-body" />
            <span className="avatar-sword" />
            <span className="avatar-shadow" />
          </div>
        </div>

        <nav className="fusion-portals" aria-label={t.v7.core.choosePortal}>
          {portalMeta.map((portal) => {
            const data = t.v7.portals[portal.key]
            return (
              <Link key={portal.to} to={portal.to} className={`fusion-portal ${portal.cls}`} aria-label={`${t.v7.enter}: ${data.title}`}>
                <span className="portal-orb" aria-hidden="true">
                  <span className="portal-core" />
                  <span className="portal-ring portal-ring-one" />
                  <span className="portal-ring portal-ring-two" />
                  <span className="portal-runes" />
                </span>
                <span className="portal-copy">
                  <strong>{data.title}</strong>
                  <small>{data.subtitle}</small>
                </span>
              </Link>
            )
          })}
        </nav>

        <Link to="/green-node" className="fusion-wisp" aria-label={t.v7.core.wispLabel} title={t.v7.core.wispLabel}>
          <span className="wisp-core" />
          <span className="wisp-tail" />
          <span className="sr-only">{t.v7.core.wispLabel}</span>
        </Link>
      </section>
    </div>
  )
}
