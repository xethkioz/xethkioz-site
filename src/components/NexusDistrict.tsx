import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import type { PublicNewsArticle } from '../services/news/publicNewsService'

export type NexusDistrictTone = 'home' | 'gaming' | 'fun' | 'science' | 'green'
type Lang = 'es' | 'en'
type DistrictLink = { code: string; glyph: string; title: string; detail: string; to: string }

const districtLinks: Record<Lang, Record<NexusDistrictTone, DistrictLink[]>> = {
  es: {
    home: [
      { code: 'GUÍA', glyph: '≡', title: 'Guías Gaming', detail: 'Builds, rutas y progreso', to: '/gaming/guides' },
      { code: 'NEWS', glyph: '⌁', title: 'Noticias', detail: 'Radar editorial y análisis', to: '/news' },
      { code: 'RED', glyph: '◆', title: 'Comunidad', detail: 'Perfiles, grupos y conexión', to: '/community' },
    ],
    gaming: [
      { code: 'LIVE', glyph: '●', title: 'Directos y videos', detail: 'Kick, YouTube y estado del canal', to: '/gaming?section=live' },
      { code: 'RADAR', glyph: '⌁', title: 'Noticias Gaming', detail: 'Lanzamientos y señales verificadas', to: '/news?category=gaming' },
      { code: 'PARTY', glyph: '◆', title: 'Comunidad', detail: 'Grupos, perfiles y compañeros', to: '/community' },
    ],
    fun: [
      { code: 'MEME', glyph: '☺', title: 'Meme Arcade', detail: 'Humor y publicaciones de la comunidad', to: '/nexus-city' },
      { code: 'CLIP', glyph: '▶', title: 'Clip semanal', detail: 'Videos y momentos destacados', to: '/news?category=community' },
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
      { code: 'GUIDE', glyph: '≡', title: 'Gaming Guides', detail: 'Builds, routes and progression', to: '/gaming/guides' },
      { code: 'NEWS', glyph: '⌁', title: 'News', detail: 'Editorial radar and analysis', to: '/news' },
      { code: 'NET', glyph: '◆', title: 'Community', detail: 'Profiles, groups and connection', to: '/community' },
    ],
    gaming: [
      { code: 'LIVE', glyph: '●', title: 'Streams and videos', detail: 'Kick, YouTube and channel status', to: '/gaming?section=live' },
      { code: 'RADAR', glyph: '⌁', title: 'Gaming news', detail: 'Releases and verified signals', to: '/news?category=gaming' },
      { code: 'PARTY', glyph: '◆', title: 'Community', detail: 'Groups, profiles and teammates', to: '/community' },
    ],
    fun: [
      { code: 'MEME', glyph: '☺', title: 'Meme Arcade', detail: 'Humor and community posts', to: '/en/nexus-city' },
      { code: 'CLIP', glyph: '▶', title: 'Weekly clip', detail: 'Videos and featured moments', to: '/news?category=community' },
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
    home: { eyebrow: 'CONTENIDO ORDENADO', title: 'Entrá directo a guías, noticias o comunidad.', status: '3 RUTAS' },
    gaming: { eyebrow: 'SIGUIENTE MISIÓN', title: 'Elegí qué hacer ahora en Gaming.', status: '3 RUTAS' },
    fun: { eyebrow: 'ENTRADA DIRECTA', title: 'Encontrá memes, clips o comunidad sin rodeos.', status: '3 RUTAS' },
    science: { eyebrow: 'PROFUNDIZAR', title: 'Fuentes, herramientas y proyectos en un solo lugar.', status: '3 RUTAS' },
    green: { eyebrow: 'ARCHIVO NEGRO', title: 'Elegí cómo investigar la señal.', status: '3 ACCESOS' },
  },
  en: {
    home: { eyebrow: 'ORGANIZED CONTENT', title: 'Go directly to guides, news or community.', status: '3 ROUTES' },
    gaming: { eyebrow: 'NEXT MISSION', title: 'Choose what to do next in Gaming.', status: '3 ROUTES' },
    fun: { eyebrow: 'DIRECT ACCESS', title: 'Find memes, clips or community without detours.', status: '3 ROUTES' },
    science: { eyebrow: 'GO DEEPER', title: 'Sources, tools and projects in one place.', status: '3 ROUTES' },
    green: { eyebrow: 'BLACK ARCHIVE', title: 'Choose how to investigate the signal.', status: '3 ACCESS POINTS' },
  },
}

const homeNewsCopy = {
  es: { eyebrow: 'ÚLTIMAS PUBLICACIONES', title: 'Lo nuevo en XETHKIOZ', loading: 'Actualizando radar...', empty: 'El radar editorial no está disponible.', all: 'Ver todas las noticias' },
  en: { eyebrow: 'LATEST FROM THE SPANISH NEWSROOM', title: 'New on XETHKIOZ', loading: 'Updating radar...', empty: 'The editorial radar is unavailable.', all: 'Open Spanish news' },
} as const

function formatDate(value: string | null, lang: Lang) {
  const date = new Date(value ?? '')
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium' }).format(date)
}

export function NexusDistrict({ tone, compact = false }: { tone: NexusDistrictTone; compact?: boolean }) {
  const { lang, localizePath } = useLang()
  const [homeArticles, setHomeArticles] = useState<PublicNewsArticle[]>([])
  const [homeRadarReady, setHomeRadarReady] = useState(tone !== 'home')
  const heading = headings[lang][tone]
  const links = districtLinks[lang][tone]
  const accessLabel = lang === 'es' ? `${heading.title} — accesos` : `${heading.title} — access points`
  const radarCopy = homeNewsCopy[lang]

  useEffect(() => {
    if (tone !== 'home') return
    let active = true
    setHomeRadarReady(false)

    void import('../services/news/publicNewsService')
      .then(({ fetchPublishedNews }) => fetchPublishedNews('all'))
      .then((articles) => {
        if (active) setHomeArticles(articles.slice(0, 3))
      })
      .catch(() => {
        if (active) setHomeArticles([])
      })
      .finally(() => {
        if (active) setHomeRadarReady(true)
      })

    return () => { active = false }
  }, [tone])

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

      {tone === 'home' ? (
        <section className="mt-6 min-h-[210px] rounded-[1.5rem] border border-white/10 bg-black/35 p-4 md:p-5" aria-labelledby="home-recent-radar-title" data-home-recent-radar>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-orange-300">{radarCopy.eyebrow}</p><h3 id="home-recent-radar-title" className="mt-1 text-xl font-black text-white">{radarCopy.title}</h3></div>
            <Link to="/news" className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-orange-200 hover:text-white">{radarCopy.all} →</Link>
          </div>
          {!homeRadarReady ? <p className="mt-6 font-mono text-xs text-slate-400" role="status">{radarCopy.loading}</p> : null}
          {homeRadarReady && homeArticles.length === 0 ? <p className="mt-6 text-sm text-slate-400" role="status">{radarCopy.empty}</p> : null}
          {homeArticles.length > 0 ? <div className="mt-4 grid gap-3 md:grid-cols-3">{homeArticles.map((article) => <Link key={article.slug} to={`/news/${article.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-orange-300/35 hover:bg-white/[0.055]"><small className="font-mono text-[9px] uppercase tracking-[0.16em] text-violet-200">{article.category} · {formatDate(article.published_at ?? article.created_at, lang)}</small><strong className="mt-2 line-clamp-3 block text-sm leading-5 text-white">{article.title}</strong></Link>)}</div> : null}
        </section>
      ) : null}
    </section>
  )
}
