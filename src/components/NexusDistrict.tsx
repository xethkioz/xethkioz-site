import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { UniverseTransitRail } from './universe/UniverseTransitRail'

export type NexusDistrictTone = 'home' | 'gaming' | 'fun' | 'science' | 'green'
type Lang = 'es' | 'en'
type DistrictLink = { code: string; glyph: string; title: string; detail: string; to: string }

const districtLinks: Record<Lang, Record<NexusDistrictTone, DistrictLink[]>> = {
  es: {
    home: [
      { code: '遊戯区', glyph: '01', title: 'Gaming District', detail: 'Misiones · builds · directos', to: '/gaming' },
      { code: '未来区', glyph: '02', title: 'Future Lab', detail: 'Ciencia · IA · tecnología', to: '/science' },
      { code: '笑街', glyph: '03', title: 'Chaos Alley', detail: 'Memes · clips · rarezas', to: '/fun' },
      { code: '禁制区', glyph: '13', title: 'Green Node', detail: 'Archivos · señales · anomalías', to: '/green-node' },
    ],
    gaming: [
      { code: '接続', glyph: 'LIVE', title: 'Arena Online', detail: 'Directos y transmisiones', to: '/gaming' },
      { code: '任務', glyph: 'XP', title: 'Mission Board', detail: 'Noticias, guías y builds', to: '/news?category=gaming' },
      { code: '部隊', glyph: 'CO-OP', title: 'Squad Station', detail: 'Comunidad y compañeros', to: '/community' },
    ],
    fun: [
      { code: '笑い', glyph: 'LOL', title: 'Meme Arcade', detail: 'Humor para robar y compartir', to: '/fun#meme-wall' },
      { code: '放送', glyph: 'CLIP', title: 'Viral Broadcast', detail: 'El clip de la semana', to: '/fun#weekly-clip' },
      { code: '混沌', glyph: '?!', title: 'Chaos Club', detail: 'Entrá al desastre colectivo', to: '/community' },
    ],
    science: [
      { code: '未来', glyph: 'AI', title: 'Future Lab', detail: 'IA aplicada y herramientas', to: '/science#lab-assistant' },
      { code: '解析', glyph: 'DATA', title: 'Signal Analysis', detail: 'Noticias con fuentes', to: '/news?category=science' },
      { code: '創造', glyph: 'WEB', title: 'Creation Studio', detail: 'Ideas convertidas en sistemas', to: '/creacion-web' },
    ],
    green: [
      { code: '禁制', glyph: '13', title: 'Restricted Archive', detail: 'Expedientes clasificados', to: '/green-node#archive' },
      { code: '異常', glyph: '>_', title: 'Signal Terminal', detail: 'Intervenir la transmisión', to: '/green-node#terminal' },
      { code: '検証', glyph: 'EYE', title: 'Evidence Room', detail: 'Fuente, hipótesis o ficción', to: '/green-node#evidence' },
    ],
  },
  en: {
    home: [
      { code: '遊戯区', glyph: '01', title: 'Gaming District', detail: 'Missions · builds · streams', to: '/gaming' },
      { code: '未来区', glyph: '02', title: 'Future Lab', detail: 'Science · AI · technology', to: '/science' },
      { code: '笑街', glyph: '03', title: 'Chaos Alley', detail: 'Memes · clips · oddities', to: '/fun' },
      { code: '禁制区', glyph: '13', title: 'Green Node', detail: 'Files · signals · anomalies', to: '/green-node' },
    ],
    gaming: [
      { code: '接続', glyph: 'LIVE', title: 'Online Arena', detail: 'Live streams and broadcasts', to: '/gaming' },
      { code: '任務', glyph: 'XP', title: 'Mission Board', detail: 'News, guides and builds', to: '/news?category=gaming' },
      { code: '部隊', glyph: 'CO-OP', title: 'Squad Station', detail: 'Community and teammates', to: '/community' },
    ],
    fun: [
      { code: '笑い', glyph: 'LOL', title: 'Meme Arcade', detail: 'Humor to steal and share', to: '/fun#meme-wall' },
      { code: '放送', glyph: 'CLIP', title: 'Viral Broadcast', detail: 'Clip of the week', to: '/fun#weekly-clip' },
      { code: '混沌', glyph: '?!', title: 'Chaos Club', detail: 'Join the collective disaster', to: '/community' },
    ],
    science: [
      { code: '未来', glyph: 'AI', title: 'Future Lab', detail: 'Applied AI and tools', to: '/science#lab-assistant' },
      { code: '解析', glyph: 'DATA', title: 'Signal Analysis', detail: 'News with visible sources', to: '/news?category=science' },
      { code: '創造', glyph: 'WEB', title: 'Creation Studio', detail: 'Ideas transformed into systems', to: '/creacion-web' },
    ],
    green: [
      { code: '禁制', glyph: '13', title: 'Restricted Archive', detail: 'Classified case files', to: '/green-node#archive' },
      { code: '異常', glyph: '>_', title: 'Signal Terminal', detail: 'Intervene in the transmission', to: '/green-node#terminal' },
      { code: '検証', glyph: 'EYE', title: 'Evidence Room', detail: 'Source, hypothesis or fiction', to: '/green-node#evidence' },
    ],
  },
}

const headings: Record<Lang, Record<NexusDistrictTone, { eyebrow: string; title: string; status: string }>> = {
  es: {
    home: { eyebrow: 'XETHKIOZ // NEXUS CITY', title: 'Elegí un distrito. Entrá a la Red de Portales.', status: 'RED ACTIVA' },
    gaming: { eyebrow: '遊戯区 // GAMING DISTRICT', title: 'La ciudad nunca deja de jugar.', status: 'JUGADORES CONECTADOS' },
    fun: { eyebrow: '笑街 // CHAOS ALLEY', title: 'Una avenida donde todo puede ser meme.', status: 'SOBRECARGA DE RISAS' },
    science: { eyebrow: '未来研究区 // FUTURE LAB', title: 'El futuro se investiga con las luces encendidas.', status: 'INVESTIGACIÓN ACTIVA' },
    green: { eyebrow: '禁制記録 // RESTRICTED SECTOR', title: 'La señal prohibida vive debajo de la ciudad.', status: 'ANOMALÍA DETECTADA' },
  },
  en: {
    home: { eyebrow: 'XETHKIOZ // NEXUS CITY', title: 'Choose a district. Enter the Portal Network.', status: 'NETWORK ONLINE' },
    gaming: { eyebrow: '遊戯区 // GAMING DISTRICT', title: 'The city never stops playing.', status: 'PLAYERS CONNECTED' },
    fun: { eyebrow: '笑街 // CHAOS ALLEY', title: 'An avenue where anything can become a meme.', status: 'LAUGHTER OVERLOAD' },
    science: { eyebrow: '未来研究区 // FUTURE LAB', title: 'The future is researched with the lights on.', status: 'RESEARCH ACTIVE' },
    green: { eyebrow: '禁制記録 // RESTRICTED SECTOR', title: 'The forbidden signal lives beneath the city.', status: 'ANOMALY DETECTED' },
  },
}

export function NexusDistrict({ tone, compact = false }: { tone: NexusDistrictTone; compact?: boolean }) {
  const { lang } = useLang()
  const heading = headings[lang][tone]
  const links = districtLinks[lang][tone]
  const accessLabel = lang === 'es' ? `${heading.title} — accesos` : `${heading.title} — access points`
  const transit = lang === 'es'
    ? '次の駅 · PRÓXIMO DISTRITO · SEÑAL ACTIVA · 次の駅 · PRÓXIMO DISTRITO · SEÑAL ACTIVA'
    : '次の駅 · NEXT DISTRICT · SIGNAL ACTIVE · 次の駅 · NEXT DISTRICT · SIGNAL ACTIVE'

  return (
    <section className={`xk-nexus-district is-${tone}${compact ? ' is-compact' : ''}`} aria-labelledby={`nexus-${tone}-title`}>
      <div className="xk-nexus-skyline" aria-hidden="true"><i /><i /><i /><i /><i /><span /><span /><b /><b /></div>
      <header className="xk-nexus-district-head">
        <div><p>{heading.eyebrow}</p><h2 id={`nexus-${tone}-title`}>{heading.title}</h2></div>
        <span><i aria-hidden="true" />{heading.status}</span>
      </header>
      <nav className="xk-nexus-signs" aria-label={accessLabel}>
        {links.map((item, index) => (
          <Link key={`${item.code}-${item.title}`} to={item.to} className={`xk-nexus-sign sign-${index + 1}`}>
            <small>{item.code}</small><i aria-hidden="true">{item.glyph}</i><strong>{item.title}</strong><span>{item.detail}</span><b aria-hidden="true">↗</b>
          </Link>
        ))}
      </nav>
      <div className="xk-nexus-transit" aria-hidden="true"><span>NEXUS LINE 7</span><i /><b>{transit}</b></div>
      {tone !== 'home' ? <UniverseTransitRail compact /> : null}
    </section>
  )
}
