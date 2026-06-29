import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

type PortalArticle = {
  title: string
  summary: string
  tag: string
  status: string
}

type PortalCategory = {
  id: string
  title: string
  text: string
  kicker: string
  articles: PortalArticle[]
}

type GamingCopy = {
  seoTitle: string
  seoDescription: string
  eyebrow: string
  title: string
  description: string
  openLabel: string
  selectedLabel: string
  readLabel: string
  back: string
  news: string
  community: string
  categories: PortalCategory[]
}

const copy: Record<'es' | 'en', GamingCopy> = {
  es: {
    seoTitle: 'Juegos · XETHKIOZ',
    seoDescription: 'Gaming Hub de XETHKIOZ con categorías reales y noticias segmentadas.',
    eyebrow: 'PLAYER_ONE_READY',
    title: 'Juegos',
    description: 'Radar gamer vivo: categorías navegables, noticias separadas por tema y acceso rápido a comunidad.',
    openLabel: 'Abrir categoría',
    selectedLabel: 'Categoría activa',
    readLabel: 'Ver noticias completas',
    back: 'Volver',
    news: 'Noticias',
    community: 'Comunidad',
    categories: [
      {
        id: 'radar',
        kicker: 'GAMING RADAR',
        title: 'Radar gamer',
        text: 'Noticias rápidas, lanzamientos, MMORPG, esports y juegos para stream.',
        articles: [
          { title: 'Lanzamientos para seguir esta semana', summary: 'Selección editorial de juegos nuevos, betas y actualizaciones con potencial para contenido diario.', tag: 'Lanzamientos', status: 'Publicado' },
          { title: 'MMORPG que pueden explotar en LATAM', summary: 'Radar de mundos persistentes, cooperativos y servidores con comunidad activa.', tag: 'MMORPG', status: 'En revisión' },
          { title: 'Esports y mobile: señales de tendencia', summary: 'Lo que se mueve en competitivo, mobile y clips cortos para stream.', tag: 'Esports', status: 'Borrador' },
        ],
      },
      {
        id: 'guides',
        kicker: 'GUIDES / BUILDS',
        title: 'Guías y builds',
        text: 'Guías, tops, comparativas y builds por comunidad.',
        articles: [
          { title: 'Builds recomendadas por rol', summary: 'Formato preparado para guías por personaje, clase, arma o estilo de juego.', tag: 'Builds', status: 'Publicado' },
          { title: 'Top semanal para jugar en stream', summary: 'Lista editable de juegos con buen ritmo para directo, clips y debate.', tag: 'Tops', status: 'En revisión' },
          { title: 'Comparativas de plataformas', summary: 'PC, Xbox, PlayStation, Nintendo y mobile comparados con foco gamer real.', tag: 'Comparativas', status: 'Borrador' },
        ],
      },
      {
        id: 'asia',
        kicker: 'ASIA SIGNAL',
        title: 'Asia Gaming',
        text: 'Señales de Corea, Japón, China y SEA para LATAM antes de que exploten.',
        articles: [
          { title: 'Corea y China: próximos RPG online', summary: 'Seguimiento de anuncios, betas cerradas y ports globales.', tag: 'Asia RPG', status: 'Publicado' },
          { title: 'Japón: cultura, anime y gaming', summary: 'Cruce de videojuegos, franquicias, anime y comunidad hispanohablante.', tag: 'Japón', status: 'En revisión' },
          { title: 'SEA mobile: meta antes del mainstream', summary: 'Lectura de tendencias mobile, MOBA y gacha antes de llegar fuerte a LATAM.', tag: 'SEA', status: 'Borrador' },
        ],
      },
    ],
  },
  en: {
    seoTitle: 'Games · XETHKIOZ',
    seoDescription: 'XETHKIOZ Gaming Hub with real categories and segmented news.',
    eyebrow: 'PLAYER_ONE_READY',
    title: 'Games',
    description: 'A live gaming radar: clickable categories, topic-based news and quick access to community.',
    openLabel: 'Open category',
    selectedLabel: 'Active category',
    readLabel: 'View full news',
    back: 'Back',
    news: 'News',
    community: 'Community',
    categories: [
      {
        id: 'radar',
        kicker: 'GAMING RADAR',
        title: 'Gaming radar',
        text: 'Quick news, releases, MMORPGs, esports and games for streaming.',
        articles: [
          { title: 'Releases to watch this week', summary: 'Editorial selection of new games, betas and updates with daily content potential.', tag: 'Releases', status: 'Published' },
          { title: 'MMORPGs that could break out in LATAM', summary: 'Radar for persistent worlds, co-op systems and active communities.', tag: 'MMORPG', status: 'In review' },
          { title: 'Esports and mobile trend signals', summary: 'What is moving in competitive gaming, mobile and short-form clips.', tag: 'Esports', status: 'Draft' },
        ],
      },
      {
        id: 'guides',
        kicker: 'GUIDES / BUILDS',
        title: 'Guides and builds',
        text: 'Guides, tops, comparisons and community builds.',
        articles: [
          { title: 'Recommended builds by role', summary: 'Format ready for guides by character, class, weapon or playstyle.', tag: 'Builds', status: 'Published' },
          { title: 'Weekly stream picks', summary: 'Editable list of games with strong rhythm for livestreams, clips and debate.', tag: 'Tops', status: 'In review' },
          { title: 'Platform comparisons', summary: 'PC, Xbox, PlayStation, Nintendo and mobile compared from a real gamer angle.', tag: 'Comparisons', status: 'Draft' },
        ],
      },
      {
        id: 'asia',
        kicker: 'ASIA SIGNAL',
        title: 'Asia Gaming',
        text: 'Signals from Korea, Japan, China and SEA for LATAM before they explode.',
        articles: [
          { title: 'Korea and China: next online RPGs', summary: 'Tracking announcements, closed betas and global ports.', tag: 'Asia RPG', status: 'Published' },
          { title: 'Japan: culture, anime and gaming', summary: 'Where games, franchises, anime and Spanish-speaking community intersect.', tag: 'Japan', status: 'In review' },
          { title: 'SEA mobile: meta before mainstream', summary: 'Reading mobile, MOBA and gacha trends before they hit LATAM hard.', tag: 'SEA', status: 'Draft' },
        ],
      },
    ],
  },
}

export default function GamingHub() {
  const { lang } = useLang()
  const t = copy[lang]
  const [selectedId, setSelectedId] = useState(t.categories[0].id)
  const activeCategory = useMemo(() => t.categories.find((category) => category.id === selectedId) ?? t.categories[0], [selectedId, t.categories])

  return (
    <>
      <SEO title={t.seoTitle} description={t.seoDescription} url="/gaming" />
      <section className="xk-page xk-pixel px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border-4 border-red-500/70 bg-black/65 p-6 shadow-[0_0_28px_rgba(239,68,68,.22)] md:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#32FF8A]">{t.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.12em] text-white md:text-6xl">{t.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">{t.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.categories.map((category) => {
              const isActive = category.id === activeCategory.id
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedId(category.id)}
                  className={`xk-card rounded-none border-4 bg-black/55 p-5 text-left shadow-[8px_8px_0_rgba(50,255,138,.28)] transition hover:-translate-y-1 ${isActive ? 'border-[#32FF8A] shadow-[8px_8px_0_rgba(255,107,26,.34)]' : 'border-[#8B5CF6]/50'}`}
                  aria-pressed={isActive}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF6B1A]">{isActive ? t.selectedLabel : t.openLabel}</p>
                  <h2 className="mt-3 text-xl font-black uppercase text-white">{category.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">{category.text}</p>
                </button>
              )
            })}
          </div>

          <section className="mt-8 rounded-[2rem] border border-[#32FF8A]/30 bg-black/55 p-5 shadow-[0_0_34px_rgba(50,255,138,.12)] md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#32FF8A]">{activeCategory.kicker}</p>
            <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-[0.08em] text-white">{activeCategory.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">{activeCategory.text}</p>
              </div>
              <Link to="/news" className="inline-flex rounded-full border border-red-500/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-red-200 hover:bg-red-500/10">{t.readLabel}</Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {activeCategory.articles.map((article) => (
                <article key={article.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#32FF8A]/50 hover:bg-white/[0.07]">
                  <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                    <span className="rounded-full border border-[#FF6B1A]/35 px-3 py-1 text-[#FF6B1A]">{article.tag}</span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-gray-400">{article.status}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-black uppercase leading-tight text-white">{article.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">{article.summary}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.18em]">
            <Link to="/" className="rounded-full border border-white/10 px-4 py-3 text-gray-300 hover:border-[#32FF8A] hover:text-[#32FF8A]">{t.back}</Link>
            <Link to="/news" className="rounded-full border border-red-500/40 px-4 py-3 text-red-200 hover:bg-red-500/10">{t.news}</Link>
            <Link to="/community" className="rounded-full border border-[#8B5CF6]/40 px-4 py-3 text-violet-200 hover:bg-[#8B5CF6]/10">{t.community}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
