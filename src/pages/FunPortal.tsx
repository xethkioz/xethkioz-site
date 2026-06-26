import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const sections = [
  ['Videos divertidos', 'Clips cortos, virales y livianos. En producción se usarán embeds o almacenamiento moderado.'],
  ['Imágenes y memes', 'Contenido de humor +12, con verificación previa antes de publicar.'],
  ['Creaciones digitales', 'Arte, edits, ideas y material compartido por la comunidad.'],
]

export default function FunPortal() {
  return (
    <div className="min-h-screen bg-[#080503] text-orange-50">
      <SEO title="Memes, Ocio y Diversión" description="Portal de humor, memes, videos cortos y creaciones digitales de XETHKIOZ." url="/fun" />
      <header className="sticky top-0 z-40 border-b border-orange/20 bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="font-display text-sm font-black uppercase tracking-[0.22em] text-orange hover:text-white">← Volver al núcleo</Link>
          <span className="rounded-full border border-orange/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-orange">Fun Portal</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <section className="rounded-[2rem] border border-orange/25 bg-black/55 p-7 shadow-[0_0_70px_rgba(255,122,0,.12)]">
          <p className="section-eyebrow text-orange">MEMES · OCIO · DIVERSIÓN</p>
          <h1 className="mt-4 font-display text-4xl font-black md:text-6xl">El portal más liviano del ecosistema</h1>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-orange-100/75 md:text-base">Zona comunitaria para reír, compartir ideas y subir creaciones sin mezclarlo con noticias serias o ciencia.</p>
        </section>
        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {sections.map(([title, text]) => (
            <article key={title} className="rounded-3xl border border-orange/20 bg-black/45 p-6">
              <h2 className="font-display text-2xl font-black text-orange">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-orange-100/70">{text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
