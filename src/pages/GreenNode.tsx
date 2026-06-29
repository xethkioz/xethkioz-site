import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const nodes = [
  'Linux / Open Source',
  'Programación',
  'Privacidad digital educativa',
  'Investigación documental',
]

export default function GreenNode() {
  return (
    <>
      <SEO title="Green Node · XETHKIOZ" description="Zona verde oculta de XETHKIOZ con estilo neon green aislado." url="/green-node" />
      <section className="xk-green-shell px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="xk-green-frame rounded-[2rem] bg-black/78 p-6 md:p-10">
            <div className="xk-green-content">
              <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#32FF8A]/70">REALITY_OVERRIDE // WISP_ACCESS_GRANTED</p>
              <h1 className="mt-5 font-mono text-4xl font-black uppercase tracking-[0.18em] text-[#D8FFE8] md:text-6xl">Green Node</h1>
              <p className="mt-5 max-w-3xl font-mono text-sm leading-relaxed text-[#B9FFD1] md:text-base">
                Nodo aislado. La realidad puede vibrar en los bordes, pero el contenido central permanece limpio, nítido y legible.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                {nodes.map((node) => (
                  <article key={node} className="rounded-2xl border border-[#32FF8A]/35 bg-[#031006]/80 p-5 font-mono shadow-[0_0_18px_rgba(50,255,138,.12)]">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/55">node.signal</p>
                    <h2 className="mt-3 text-lg font-black uppercase tracking-[0.12em] text-[#D8FFE8]">{node}</h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#B9FFD1]/80">Contenido educativo, defensivo y documental. Sin ruido visual y sin confundir hipótesis con hechos.</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-[#32FF8A]/25 bg-black/70 p-5 font-mono text-xs leading-relaxed text-[#B9FFD1]">
                Seguridad editorial: este nodo opera separado de Juegos, Tecnología/Ciencia y Memes. Sus efectos visuales no se heredan fuera de esta sección.
              </div>

              <Link to="/" className="mt-8 inline-flex rounded-full border border-[#32FF8A]/50 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#D8FFE8] transition hover:bg-[#32FF8A]/10 hover:shadow-[0_0_18px_rgba(50,255,138,.24)]">
                Cerrar portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
