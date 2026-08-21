import { Link } from 'react-router-dom'
import { addWispXp } from '../../lib/realtimeCommunity'
import './FunGameGateway.css'

type FunGameGatewayProps = {
  lang: 'es' | 'en'
}

const copy = {
  es: {
    eyebrow: 'XETHKIOZ PLAY // PORTAL DE DIVERSIÓN',
    title: 'La aventura empieza acá.',
    description: 'Entrá a Plaza Nexus: una aventura social pixel inspirada en los RPG portátiles, con Casa Wisp, consumibles, Gran Sala pública y salas privadas por invitación.',
    primary: 'JUGAR AHORA',
    secondary: 'VER MEMES Y CHISTES',
    status: 'MUNDO EN LÍNEA',
    preview: 'Vista previa pixel de Plaza Nexus',
    signal: 'PORTAL DE JUEGO ACTIVO',
    features: ['RPG cenital', 'Gran Sala', 'Casa Wisp', 'Salas VIP'],
    ticker: 'JUEGO · MEMES · CLIPS · CAOS · COMUNIDAD',
  },
  en: {
    eyebrow: 'XETHKIOZ PLAY // FUN PORTAL',
    title: 'The adventure starts here.',
    description: 'Enter Nexus Plaza: a handheld-inspired social pixel adventure with Wisp House, consumables, a public Grand Hall and invite-only private rooms.',
    primary: 'PLAY NOW',
    secondary: 'SEE MEMES & JOKES',
    status: 'WORLD ONLINE',
    preview: 'Pixel preview of Nexus Plaza',
    signal: 'GAME PORTAL ACTIVE',
    features: ['Top-down RPG', 'Grand Hall', 'Wisp House', 'VIP rooms'],
    ticker: 'GAME · MEMES · CLIPS · CHAOS · COMMUNITY',
  },
} as const

export default function FunGameGateway({ lang }: FunGameGatewayProps) {
  const t = copy[lang]

  return (
    <section className="xk-fun-game-gateway" aria-labelledby="fun-game-title">
      <div className="xk-fun-game-copy">
        <div className="xk-fun-game-status">
          <i aria-hidden="true" />
          <span>{t.status}</span>
        </div>
        <p className="xk-fun-game-eyebrow">{t.eyebrow}</p>
        <h1 id="fun-game-title">{t.title}</h1>
        <p className="xk-fun-game-description">{t.description}</p>

        <ul className="xk-fun-game-features" aria-label={lang === 'es' ? 'Características del juego' : 'Game features'}>
          {t.features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>

        <div className="xk-fun-game-actions">
          <Link
            to="/nexus-city/room/xethkioz"
            onClick={() => addWispXp(5, 'portal', '/nexus-city')}
          >
            {t.primary} <span aria-hidden="true">▶</span>
          </Link>
          <Link to="/community">{t.secondary} <span aria-hidden="true">→</span></Link>
        </div>
      </div>

      <Link
        to="/nexus-city/room/xethkioz"
        className="xk-fun-game-portal"
        aria-label={`${t.primary}: ${t.preview}`}
        onClick={() => addWispXp(5, 'portal', '/nexus-city')}
      >
        <span className="xk-fun-game-energy" aria-hidden="true" />
        <span className="xk-fun-game-confetti" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>
        <span className="xk-fun-game-scene" role="img" aria-label={t.preview}>
          <span className="xk-fun-game-water" aria-hidden="true" />
          <span className="xk-fun-game-path" aria-hidden="true" />
          <span className="xk-fun-game-building is-guild" aria-hidden="true"><i /><b>G</b></span>
          <span className="xk-fun-game-building is-lab" aria-hidden="true"><i /><b>LAB</b></span>
          <span className="xk-fun-game-building is-arcade" aria-hidden="true"><i /><b>!</b></span>
          <span className="xk-fun-game-trees" aria-hidden="true"><i /><i /><i /><i /><i /></span>
          <span className="xk-fun-game-player" aria-hidden="true"><i /><b /></span>
          <span className="xk-fun-game-wisp" aria-hidden="true"><i /><i /><b /><em /></span>
          <span className="xk-fun-game-sparkles" aria-hidden="true"><i /><i /><i /></span>
        </span>
        <span className="xk-fun-game-portal-label"><small>{t.signal}</small><b>{t.primary} ↗</b></span>
      </Link>

      <div className="xk-fun-game-ticker" aria-hidden="true"><span>{t.ticker} ◆ {t.ticker} ◆</span></div>
    </section>
  )
}
