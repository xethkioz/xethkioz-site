import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'

export type NexusDistrictTone = 'home' | 'gaming' | 'fun' | 'science' | 'green'
type Lang = 'es' | 'en'
type DistrictLink = { code: string; glyph: string; title: string; detail: string; to: string }

const districtLinks: Record<Lang, Record<NexusDistrictTone, DistrictLink[]>> = {
  es: {
    home: [
      { code: '01', glyph: 'G', title: 'Gaming', detail: 'Noticias, guías y directos', to: '/gaming' },
      { code: '02', glyph: 'S', title: 'Science & Tech', detail: 'Ciencia, IA y tecnología', to: '/science' },
      { code: '03', glyph: 'F', title: 'Diversión', detail: 'Memes, clips y rarezas', to: '/fun' },
    ],
    gaming: [
      { code: 'LIVE', glyph: '●', title: 'Directos y videos', detail: 'Kick, YouTube y estado del canal', to: '/gaming?section=live' },
      { code: 'RADAR', glyph: '⌁', title: 'Noticias Gaming', detail: 'Lanzamientos y señales verificadas', to: '/news?category=gaming' },
      { code: 'PARTY', glyph: '◆', title: 'Comunidad', detail: 'Grupos, perfiles y compañeros', to: '/community' },
    ],
    fun: [
      { code: 'MEME', glyph: '☺', title: 'Meme Arcade', detail: 'Humor y publicaciones de la comunidad', to: '/fun#meme-wall' },
      { code: 'CLIP', glyph: '▶', title: 'Clip semanal', detail: 'Videos y momentos destacados', to: '/fun#weekly-clip' },
      { code: 'CLUB', glyph: '?!', title: 'Comunidad', detail: 'Entrá, participá y compartí', to: '/community' },
    ],
    science: [
      { code: 'DATA', glyph: '⌁', title: 'Noticias con fuentes', detail: 'Ciencia y tecnología verificadas', to: '/news?category=science' },
      { code: 'TOOLS', glyph: 'AI', title: 'Herramientas y respuestas', detail: 'IA práctica y recursos locales', to: '/science#lab-assistant' },
      { code: 'BUILD', glyph: 'WEB', title: 'Creación Web', detail: 'Ideas convertidas en proyectos', to: '/creacion-web' },
    ],
    green: [
      { code: 'ARCHIVO', glyph: '13', title: 'Expedientes', detail: 'Casos y archivos clasificados', to: '/green-node?view=dossiers#archive' },
      { code: 'SEÑAL', glyph: '>_', title: 'Terminal', detail: 'Intervenir la transmisión', to: '/green-node?view=terminal#terminal' },
      { code: 'PRUEBA', glyph: 'EYE', title: 'Evidencia', detail: 'Separar fuente, hipótesis y ficción', to: '/green-node?view=signals#evidence' },
    ],
  },
  en: {
    home: [
      { code: '01', glyph: 'G', title: 'Gaming', detail: 'News, guides and streams', to: '/gaming' },
      { code: '02', glyph: 'S', title: 'Science & Tech', detail: 'Science, AI and technology', to: '/science' },
      { code: '03', glyph: 'F', title: 'Fun', detail: 'Memes, clips and oddities', to: '/fun' },
    ],
    gaming: [
      { code: 'LIVE', glyph: '●', title: 'Streams and videos', detail: 'Kick, YouTube and channel status', to: '/gaming?section=live' },
      { code: 'RADAR', glyph: '⌁', title: 'Gaming news', detail: 'Releases and verified signals', to: '/news?category=gaming' },
      { code: 'PARTY', glyph: '◆', title: 'Community', detail: 'Groups, profiles and teammates', to: '/community' },
    ],
    fun: [
      { code: 'MEME', glyph: '☺', title: 'Meme Arcade', detail: 'Humor and community posts', to: '/fun#meme-wall' },
      { code: 'CLIP', glyph: '▶', title: 'Weekly clip', detail: 'Videos and featured moments', to: '/fun#weekly-clip' },
      { code: 'CLUB', glyph: '?!', title: 'Community', detail: 'Join, participate and share', to: '/community' },
    ],
    science: [
      { code: 'DATA', glyph: '⌁', title: 'Sourced news', detail: 'Verified science and technology', to: '/news?category=science' },
      { code: 'TOOLS', glyph: 'AI', title: 'Tools and answers', detail: 'Practical AI and local resources', to: '/science#lab-assistant' },
      { code: 'BUILD', glyph: 'WEB', title: 'Web Creation', detail: 'Ideas transformed into projects', to: '/creacion-web' },
    ],
    green: [
      { code: 'FILES', glyph: '13', title: 'Case files', detail: 'Cases and classified archives', to: '/green-node?view=dossiers#archive' },
      { code: 'SIGNAL', glyph: '>_', title: 'Terminal', detail: 'Intervene in the transmission', to: '/green-node?view=terminal#terminal' },
      { code: 'PROOF', glyph: 'EYE', title: 'Evidence', detail: 'Separate source, hypothesis and fiction', to: '/green-node?view=signals#evidence' },
    ],
  },
}

const headings: Record<Lang, Record<NexusDistrictTone, { eyebrow: string; title: string; status: string }>> = {
  es: {
    home: { eyebrow: 'ACCESOS RÁPIDOS', title: 'Elegí qué parte de XETHKIOZ querés explorar.', status: '3 PORTALES' },
    gaming: { eyebrow: 'SIGUIENTE MISIÓN', title: 'Elegí qué hacer ahora en Gaming.', status: '3 RUTAS' },
    fun: { eyebrow: 'ENTRADA DIRECTA', title: 'Encontrá memes, clips o comunidad sin rodeos.', status: '3 RUTAS' },
    science: { eyebrow: 'PROFUNDIZAR', title: 'Fuentes, herramientas y proyectos en un solo lugar.', status: '3 RUTAS' },
    green: { eyebrow: 'ARCHIVO NEGRO', title: 'Elegí cómo investigar la señal.', status: '3 ACCESOS' },
  },
  en: {
    home: { eyebrow: 'QUICK ACCESS', title: 'Choose which part of XETHKIOZ to explore.', status: '3 PORTALS' },
    gaming: { eyebrow: 'NEXT MISSION', title: 'Choose what to do next in Gaming.', status: '3 ROUTES' },
    fun: { eyebrow: 'DIRECT ACCESS', title: 'Find memes, clips or community without detours.', status: '3 ROUTES' },
    science: { eyebrow: 'GO DEEPER', title: 'Sources, tools and projects in one place.', status: '3 ROUTES' },
    green: { eyebrow: 'BLACK ARCHIVE', title: 'Choose how to investigate the signal.', status: '3 ACCESS POINTS' },
  },
}

export function NexusDistrict({ tone, compact = false }: { tone: NexusDistrictTone; compact?: boolean }) {
  const { lang, localizePath } = useLang()
  const heading = headings[lang][tone]
  const links = districtLinks[lang][tone]
  const accessLabel = lang === 'es' ? `${heading.title} — accesos` : `${heading.title} — access points`

  return (
    <section className={`xk-nexus-district is-${tone}${compact ? ' is-compact' : ''}`} aria-labelledby={`nexus-${tone}-title`}>
      <div className="xk-nexus-skyline" aria-hidden="true"><i /><i /><i /><i /><i /><span /><span /><b /><b /></div>
      <header className="xk-nexus-district-head">
        <div><p>{heading.eyebrow}</p><h2 id={`nexus-${tone}-title`}>{heading.title}</h2></div>
        <span><i aria-hidden="true" />{heading.status}</span>
      </header>
      <nav className="xk-nexus-signs" aria-label={accessLabel}>
        {links.map((item, index) => (
          <Link key={`${item.code}-${item.title}`} to={localizePath(item.to)} className={`xk-nexus-sign sign-${index + 1}`}>
            <small>{item.code}</small><i aria-hidden="true">{item.glyph}</i><strong>{item.title}</strong><span>{item.detail}</span><b aria-hidden="true">→</b>
          </Link>
        ))}
      </nav>
    </section>
  )
}
