import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const memes = [
  'Cuando el build falla pero vos ya dijiste “está todo OK”.',
  '404 de sueño, 200 de ganas.',
  'El Wisp no buguea: aparece donde quiere.',
]

export default function FunPortal() {
  return (
    <>
      <SEO title="Memes · XETHKIOZ" description="Sección de memes y cosas graciosas de XETHKIOZ." url="/fun" />
      <section className="xk-page px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="xk-section-panel overflow-hidden rounded-[2rem] border border-yellow-300/45 bg-[linear-gradient(135deg,rgba(234,179,8,.16),rgba(139,92,246,.12),rgba(50,255,138,.08))] p-6 shadow-[0_0_28px_rgba(234,179,8,.16)] md:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#32FF8A]">MEME_CORE // HUMOR CONTROLADO</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.16em] text-white md:text-6xl">Memes</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">
              Zona amarilla del ecosistema: humor, clips y descansos. El chiste carga rápido, porque sino no da gracia.
            </p>
            <div className="mt-6 inline-flex rounded-full border border-yellow-300/40 bg-black/35 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-yellow-200">
              chascarrillo.exe ejecutado con éxito
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {memes.map((meme) => (
              <article key={meme} className="xk-card rounded-3xl border border-yellow-300/30 bg-black/55 p-5 transition hover:-translate-y-1 hover:rotate-[.35deg] hover:shadow-[0_0_18px_rgba(234,179,8,.18)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF6B1A]">meme.log</p>
                <p className="mt-4 text-sm leading-relaxed text-gray-200">{meme}</p>
              </article>
            ))}
          </div>

          <Link to="/" className="mt-8 inline-flex rounded-full border border-yellow-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-yellow-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">
            Volver antes de que se ponga serio
          </Link>
        </div>
      </section>
    </>
  )
}
