import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const blocks = [
  { title: 'Radar gamer', text: 'Noticias rápidas, lanzamientos, MMORPG, esports y juegos para stream.' },
  { title: 'Guías y builds', text: 'Espacio preparado para guías, tops, comparativas y builds por comunidad.' },
  { title: 'Asia Gaming', text: 'Señales de Corea, Japón, China y SEA para LATAM antes de que exploten.' },
]

export default function GamingHub() {
  return (
    <>
      <SEO title="Juegos · XETHKIOZ" description="Gaming Hub de XETHKIOZ con estilo pixel art, rojo, morado y verde." url="/gaming" />
      <section className="xk-page xk-pixel px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border-4 border-red-500/70 bg-black/65 p-6 shadow-[0_0_28px_rgba(239,68,68,.22)] md:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#32FF8A]">PLAYER_ONE_READY</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.12em] text-white md:text-6xl">Juegos</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">
              Modo pixel art: menos carga visual, más lectura, más foco en comunidad gamer.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {blocks.map((block) => (
              <article key={block.title} className="xk-card rounded-none border-4 border-[#8B5CF6]/50 bg-black/55 p-5 shadow-[8px_8px_0_rgba(50,255,138,.28)]">
                <h2 className="text-xl font-black uppercase text-white">{block.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{block.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.18em]">
            <Link to="/" className="rounded-full border border-white/10 px-4 py-3 text-gray-300 hover:border-[#32FF8A] hover:text-[#32FF8A]">Volver</Link>
            <Link to="/news" className="rounded-full border border-red-500/40 px-4 py-3 text-red-200 hover:bg-red-500/10">Noticias</Link>
            <Link to="/community" className="rounded-full border border-[#8B5CF6]/40 px-4 py-3 text-violet-200 hover:bg-[#8B5CF6]/10">Comunidad</Link>
          </div>
        </div>
      </section>
    </>
  )
}
