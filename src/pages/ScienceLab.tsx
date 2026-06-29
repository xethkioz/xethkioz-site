import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const systems = [
  { label: 'IA / Modelos', value: 'análisis, prompts, automatización' },
  { label: 'Ciencia', value: 'fuentes, evidencia, contexto' },
  { label: 'Tecnología', value: 'hardware, software, infraestructura' },
]

export default function ScienceLab() {
  return (
    <>
      <SEO title="Tecnología y Ciencia · XETHKIOZ" description="Sección técnica de XETHKIOZ con estilo blueprint, azul, morado y verde." url="/science" />
      <section className="xk-page xk-blueprint px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="xk-section-panel rounded-[2rem] border border-blue-400/45 bg-[#06111f]/80 p-6 shadow-[0_0_28px_rgba(59,130,246,.18)] md:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#32FF8A]">DATA_TERMINAL // BLUEPRINT</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.16em] text-white md:text-6xl">Tecnología / Ciencia</h1>
            <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-blue-100/80">
              Diseño frío y técnico: lectura clara, líneas finas y estructura preparada para informes, IA y divulgación.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {systems.map((item) => (
              <article key={item.label} className="xk-card rounded-3xl border border-blue-300/30 bg-black/50 p-5 shadow-[0_0_16px_rgba(139,92,246,.12)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8B5CF6]">{item.label}</p>
                <p className="mt-4 font-mono text-sm leading-relaxed text-gray-300">{item.value}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-[#32FF8A]/25 bg-black/45 p-5 font-mono text-xs leading-relaxed text-gray-300">
            Estado: sección estabilizada para contenido verificable. Sin paneles de sistema visibles en producción.
          </div>

          <Link to="/" className="mt-8 inline-flex rounded-full border border-blue-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-blue-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">
            Volver al núcleo
          </Link>
        </div>
      </section>
    </>
  )
}
