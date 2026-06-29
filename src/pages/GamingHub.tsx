import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

type NewsItem = { title: string; summary: string; tag: string }
type SectionBlock = { id: string; title: string; text: string; items: NewsItem[] }

const content: Record<'es' | 'en', { title: string; description: string; back: string; news: string; community: string; open: string; blocks: SectionBlock[] }> = {
  es: {
    title: 'Juegos',
    description: 'Radar gamer, guías, builds y Asia Gaming con noticias de prueba categorizadas.',
    back: 'Volver',
    news: 'Noticias',
    community: 'Comunidad',
    open: 'Abrir sección',
    blocks: [
      {
        id: 'radar',
        title: 'Radar gamer',
        text: 'Noticias rápidas, lanzamientos, MMORPG, esports y juegos para stream.',
        items: [
          { title: 'MMORPG de mundo abierto ganan espacio en LATAM', summary: 'Tendencia demo para probar cómo se listan lanzamientos, servidores y betas regionales.', tag: 'MMORPG' },
          { title: 'El calendario gamer concentra estrenos fuertes', summary: 'Bloque preparado para publicar fechas, plataformas y ventanas de lanzamiento.', tag: 'Lanzamientos' },
          { title: 'Los juegos cooperativos vuelven al radar', summary: 'Nota de prueba para medir interés en experiencias PvE, survival y raids casuales.', tag: 'Co-op' },
          { title: 'Battle royale y extracción compiten por streamers', summary: 'Entrada demo para comparar retención, clips y comunidad.', tag: 'Streaming' },
          { title: 'Mobile competitivo crece por comunidad', summary: 'Artículo de prueba para cubrir Mobile Legends, Wild Rift y torneos rápidos.', tag: 'Mobile' },
        ],
      },
      {
        id: 'guides',
        title: 'Guías y builds',
        text: 'Espacio preparado para guías, tops, comparativas y builds por comunidad.',
        items: [
          { title: 'Build inicial para jugadores que vuelven', summary: 'Formato demo para guías simples: equipo recomendado, rol y errores comunes.', tag: 'Build' },
          { title: 'Top de clases para empezar sin frustrarse', summary: 'Plantilla para rankings por dificultad, utilidad y estilo de juego.', tag: 'Top' },
          { title: 'Guía rápida de optimización gráfica', summary: 'Contenido de prueba para FPS, latencia, escalado y calidad visual.', tag: 'PC' },
          { title: 'Cómo armar una party equilibrada', summary: 'Modelo de guía para tanques, soportes, daño y coordinación básica.', tag: 'Co-op' },
          { title: 'Comparativa: consola, PC y mobile', summary: 'Bloque demo para explicar ventajas, costos y experiencia real.', tag: 'Comparativa' },
        ],
      },
      {
        id: 'asia',
        title: 'Asia Gaming',
        text: 'Señales de Corea, Japón, China y SEA para LATAM antes de que exploten.',
        items: [
          { title: 'Corea marca tendencia en RPG online', summary: 'Demo para cubrir betas, publishers y señales tempranas del mercado asiático.', tag: 'Corea' },
          { title: 'China empuja nuevos mundos de fantasía', summary: 'Entrada de prueba para videojuegos con estética wuxia, acción y mundo abierto.', tag: 'China' },
          { title: 'Japón mantiene fuerte el RPG de autor', summary: 'Contenido demo para lanzamientos, remasters y sagas clásicas.', tag: 'Japón' },
          { title: 'SEA acelera el mobile esports', summary: 'Nota de prueba para torneos, comunidades y títulos de alto alcance.', tag: 'SEA' },
          { title: 'LATAM mira cada vez más al gaming asiático', summary: 'Artículo demo para conectar tendencias orientales con audiencia hispanohablante.', tag: 'LATAM' },
        ],
      },
    ],
  },
  en: {
    title: 'Games',
    description: 'Gaming radar, guides, builds and Asia Gaming with categorized test news.',
    back: 'Back',
    news: 'News',
    community: 'Community',
    open: 'Open section',
    blocks: [
      {
        id: 'radar',
        title: 'Gaming radar',
        text: 'Quick news, releases, MMORPGs, esports and stream-ready games.',
        items: [
          { title: 'Open-world MMORPGs gain traction in LATAM', summary: 'Demo trend to test releases, servers and regional beta coverage.', tag: 'MMORPG' },
          { title: 'The gaming calendar stacks major releases', summary: 'Block prepared for dates, platforms and launch windows.', tag: 'Releases' },
          { title: 'Co-op games return to the radar', summary: 'Test note to measure interest in PvE, survival and casual raids.', tag: 'Co-op' },
          { title: 'Battle royale and extraction compete for streamers', summary: 'Demo entry to compare retention, clips and community interest.', tag: 'Streaming' },
          { title: 'Competitive mobile grows through community', summary: 'Test article for Mobile Legends, Wild Rift and fast tournaments.', tag: 'Mobile' },
        ],
      },
      {
        id: 'guides',
        title: 'Guides and builds',
        text: 'Prepared space for guides, tops, comparisons and community builds.',
        items: [
          { title: 'Starter build for returning players', summary: 'Demo guide format: recommended gear, role and common mistakes.', tag: 'Build' },
          { title: 'Best classes to start without frustration', summary: 'Ranking template by difficulty, utility and playstyle.', tag: 'Top' },
          { title: 'Quick graphics optimization guide', summary: 'Test content for FPS, latency, scaling and visual quality.', tag: 'PC' },
          { title: 'How to build a balanced party', summary: 'Guide model for tanks, supports, damage and basic coordination.', tag: 'Co-op' },
          { title: 'Comparison: console, PC and mobile', summary: 'Demo block to explain advantages, costs and real experience.', tag: 'Comparison' },
        ],
      },
      {
        id: 'asia',
        title: 'Asia Gaming',
        text: 'Signals from Korea, Japan, China and SEA for LATAM before they explode.',
        items: [
          { title: 'Korea sets the pace in online RPGs', summary: 'Demo for betas, publishers and early Asian market signals.', tag: 'Korea' },
          { title: 'China pushes new fantasy worlds', summary: 'Test entry for wuxia-inspired action and open-world games.', tag: 'China' },
          { title: 'Japan keeps author-driven RPGs strong', summary: 'Demo content for releases, remasters and classic franchises.', tag: 'Japan' },
          { title: 'SEA accelerates mobile esports', summary: 'Test note for tournaments, communities and high-reach titles.', tag: 'SEA' },
          { title: 'LATAM looks more at Asian gaming', summary: 'Demo article connecting Eastern trends with Spanish-speaking audiences.', tag: 'LATAM' },
        ],
      },
    ],
  },
}

export default function GamingHub() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const active = t.blocks.find((block) => block.id === activeId) ?? t.blocks[0]

  return (
    <>
      <SEO title={`${t.title} · XETHKIOZ`} description={t.description} url="/gaming" />
      <section className="xk-page xk-pixel px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border-4 border-red-500/70 bg-black/65 p-6 shadow-[0_0_28px_rgba(239,68,68,.22)] md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#32FF8A]">PLAYER_ONE_READY</p>
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-[#32FF8A]/40 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#32FF8A]">{lang.toUpperCase()}</button>
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.12em] text-white md:text-6xl">{t.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">{t.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.blocks.map((block) => (
              <button key={block.id} type="button" onClick={() => setActiveId(block.id)} className={`xk-card rounded-none border-4 p-5 text-left shadow-[8px_8px_0_rgba(50,255,138,.28)] transition ${active.id === block.id ? 'border-[#32FF8A]/80 bg-[#08130c]' : 'border-[#8B5CF6]/50 bg-black/55 hover:border-red-400/80'}`}>
                <h2 className="text-xl font-black uppercase text-white">{block.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{block.text}</p>
                <span className="mt-4 inline-flex font-mono text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
              </button>
            ))}
          </div>

          <section className="mt-8 rounded-[2rem] border border-[#32FF8A]/30 bg-black/65 p-5 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/70">{active.title} // 5 demo news</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {active.items.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-red-300">{item.tag}</span>
                  <h3 className="mt-3 text-base font-black uppercase text-white">{item.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-300">{item.summary}</p>
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
