import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const sections = [
  ['Física', 'Divulgación clara, visual y con fuentes.'],
  ['Tecnología', 'Hardware, software, innovación y herramientas útiles.'],
  ['Inteligencia Artificial', 'Modelos, automatización, usos reales y noticias verificadas.'],
  ['Proyectos', 'Los usuarios podrán subir proyectos para revisión de moderador o administrador.'],
]

export default function ScienceLab() {
  return (
    <div className="min-h-screen bg-[#02070d] text-sky-50">
      <SEO title="Ciencia y Tecnología" description="Portal de ciencia, tecnología, IA y proyectos de XETHKIOZ." url="/science" />
      <header className="sticky top-0 z-40 border-b border-sky-300/20 bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="font-display text-sm font-black uppercase tracking-[0.22em] text-sky-300 hover:text-white">← Volver al núcleo</Link>
          <span className="rounded-full border border-sky-300/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">Science & Tech</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <section className="rounded-[2rem] border border-sky-300/25 bg-black/55 p-7 shadow-[0_0_70px_rgba(14,165,233,.14)]">
          <p className="section-eyebrow text-sky-300">CIENCIA · TECNOLOGÍA · IA</p>
          <h1 className="mt-4 font-display text-4xl font-black md:text-6xl">Conocimiento sin ruido</h1>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-sky-100/75 md:text-base">Un área seria y clara, con administrador especializado para ciencia y tecnología, separada del contenido gamer y del ocio.</p>
        </section>
        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {sections.map(([title, text]) => (
            <article key={title} className="rounded-3xl border border-sky-300/20 bg-black/45 p-6">
              <h2 className="font-display text-2xl font-black text-sky-300">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-sky-100/70">{text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
