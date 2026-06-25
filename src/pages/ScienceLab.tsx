import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import { scienceReports, fallbackArticles } from '../lib/mockData'
import ScienceEvidenceMatrix from '../components/ScienceEvidenceMatrix'
import ScienceSourceBoard from '../components/ScienceSourceBoard'

const scienceArticles = fallbackArticles.filter((article) => article.category?.portal === 'science').slice(0, 6)

const fields = [
  ['Astronomía', 'Exploración espacial, observación del cielo y tecnología orbital.'],
  ['Medicina', 'Salud, IA clínica, biotecnología y avances con evidencia.'],
  ['Física', 'Energía, materia, cosmología y fenómenos fundamentales.'],
  ['Ambiente', 'Clima, biodiversidad, agua, territorio y datos verificables.'],
]

const scienceNav = [
  { href: '#informes', label: 'Informes' },
  { href: '#fuentes', label: 'Fuentes' },
  { href: '#campos', label: 'Campos' },
  { href: '#relacionadas', label: 'Relacionadas' },
]

export default function ScienceLab() {
  return (
    <div className="science-lab-shell min-h-screen animate-fade-in text-slate-100">
      <SEO
        title="Science Lab"
        description="XETHKIOZ Science Lab: informes, divulgación científica, fuentes verificables y análisis profesional."
        url="/science"
        image="/images/articles/science-lab.svg"
      />

      <header className="sticky top-0 z-50 border-b border-sky-200/15 bg-slate-950/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="font-display text-sm font-black uppercase tracking-[0.22em] text-white hover:text-sky-200">
            ← XETHKIOZ
          </Link>
          <nav className="hidden items-center gap-2 md:flex" aria-label="Science Lab navigation">
            {scienceNav.map((item) => (
              <a key={item.href} href={item.href} className="rounded-lg border border-sky-300/15 bg-sky-300/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-sky-200 hover:bg-sky-300/10">
                {item.label}
              </a>
            ))}
            <Link to="/network" className="rounded-lg border border-sky-300/15 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-sky-200 hover:bg-sky-300/10">
              Network
            </Link>
          </nav>
          <span className="rounded-full border border-sky-300/15 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-200">
            formal division
          </span>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-sky-300/15 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,.16),transparent_36%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,.12),transparent_34%)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-sky-300">XETHKIOZ NETWORK / FORMAL DIVISION</p>
            <h1 className="mt-5 font-display text-4xl font-black leading-tight text-white md:text-7xl">Science Lab</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
              Portal profesional para informes, divulgación científica y temas importantes con fuentes, contexto, limitaciones y nivel de evidencia. Funciona como una división formal dentro de XETHKIOZ Network, separada visualmente del área gamer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#informes" className="rounded-lg bg-sky-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-sky-200">Ver informes</a>
              <Link to="/cms" className="rounded-lg border border-sky-300/30 bg-sky-300/10 px-5 py-3 text-sm font-bold text-sky-200 hover:bg-sky-300/15">Cargar desde CMS</Link>
              <Link to="/network" className="rounded-lg border border-sky-300/30 px-5 py-3 text-sm font-bold text-sky-200 hover:bg-sky-300/10">Volver al Network Hub</Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <section id="campos" className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-4">
          {fields.map(([name, description]) => (
            <div key={name} className="rounded-2xl border border-sky-200/10 bg-slate-900/70 p-5">
              <h2 className="font-display text-lg font-black text-white">{name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
            </div>
          ))}
        </section>

        <section className="mb-12">
          <ScienceEvidenceMatrix />
        </section>

        <section id="fuentes" className="mb-12">
          <ScienceSourceBoard />
        </section>

        <section id="informes" className="mb-12">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">Informes y evidencia</p>
              <h2 className="font-display text-2xl font-black text-white md:text-4xl">Lectura profesional</h2>
            </div>
            <p className="max-w-2xl text-sm text-slate-400">
              Cada informe debe declarar fuente, tipo de evidencia y fecha. Este formato prepara la sección para papers, DOI, fuentes oficiales y revisión editorial.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {scienceReports.map((report) => (
              <article key={report.id} className="rounded-3xl border border-sky-200/10 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(14,165,233,.07)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-200">{report.field}</span>
                  <span className="text-xs text-slate-500">{new Date(report.published_at).toLocaleDateString('es-AR')}</span>
                </div>
                <h3 className="font-display text-xl font-black text-white">{report.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{report.summary}</p>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Nivel de evidencia</p>
                  <strong className="mt-1 block text-sm text-sky-200">{report.evidence_level}</strong>
                  <p className="mt-2 text-xs text-slate-500">Fuente: {report.source_name}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="relacionadas">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">Noticias relacionadas</p>
            <h2 className="font-display text-2xl font-black text-white md:text-4xl">Ciencia dentro de XETHKIOZ</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {scienceArticles.map((article) => (
              <Link key={article.id} to={`/article/${article.slug}`} className="group overflow-hidden rounded-3xl border border-sky-200/10 bg-slate-900/70 transition-all hover:-translate-y-1 hover:border-sky-300/30">
                <SafeImage src={article.cover_image} alt={article.title} className="h-44 w-full object-cover" fallback="/images/articles/science-lab.svg" />
                <div className="p-5">
                  <h3 className="font-display text-lg font-black text-white group-hover:text-sky-200">{article.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-400">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-sky-200/10 bg-slate-950 px-4 py-8 text-center text-xs text-slate-500">
        Science Lab opera como división formal de XETHKIOZ Network. Las afirmaciones científicas deben citar fuente, fecha, contexto y limitaciones.
      </footer>
    </div>
  )
}
