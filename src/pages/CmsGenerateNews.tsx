import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import { useLang } from '../lib/LangContext'

const categories = [
  'gaming',
  'tech',
  'science',
  'ai',
  'community',
  'green',
  'programming',
]

export default function CmsGenerateNews() {
  const { t } = useLang()

  return (
    <FusionShell tone="green" backLabel={t.v7.backCore} label="CMS News Generator">
      <SEO
        title="CMS News Generator"
        description="Generador visual de borradores para el News Engine de XETHKIOZ."
        url="/cms/generate"
      />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <FusionHero
          tone="green"
          eyebrow="CMS Profesional"
          heading="Generador de noticias"
          description="Primer panel visual para preparar borradores del News Engine sin tocar SQL ni consola."
        />

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-emerald-400/30 bg-slate-950/80 p-6 shadow-2xl shadow-emerald-950/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Phase CMS-1</p>
                <h2 className="mt-2 text-2xl font-black text-white">Crear borrador</h2>
              </div>
              <span className="rounded-full border border-orange-400/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-200">
                Visual scaffold
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-emerald-100">
                Categoría
                <select className="rounded-2xl border border-emerald-400/20 bg-black/50 px-4 py-3 text-white outline-none focus:border-orange-300">
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-emerald-100">
                Tema principal
                <input
                  className="rounded-2xl border border-emerald-400/20 bg-black/50 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-300"
                  placeholder="Ej: nueva actualización de League of Legends"
                  disabled
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-emerald-100">
                Fuentes
                <textarea
                  className="min-h-28 rounded-2xl border border-emerald-400/20 bg-black/50 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-300"
                  placeholder="Una URL por línea"
                  disabled
                />
              </label>

              <div className="rounded-2xl border border-dashed border-emerald-400/30 bg-emerald-950/20 p-4 text-sm text-emerald-100">
                Este primer PR solo crea el panel visual y la ruta. La conexión real con <code>/api/generate-news</code> entra en CMS-2.
              </div>
            </div>
          </article>

          <aside className="space-y-4 rounded-3xl border border-purple-400/25 bg-purple-950/20 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-purple-200">Workflow</p>
            <h3 className="text-xl font-black text-white">Flujo editorial</h3>
            <ol className="space-y-3 text-sm text-purple-100">
              <li>1. Generar draft desde el CMS.</li>
              <li>2. Revisar bloques y fuentes.</li>
              <li>3. Enviar a revisión.</li>
              <li>4. Publicar cuando esté aprobado.</li>
            </ol>
            <Link
              to="/cms"
              className="inline-flex rounded-full border border-emerald-300/40 px-4 py-2 text-sm font-bold text-emerald-100 hover:border-orange-300 hover:text-orange-200"
            >
              Volver al CMS
            </Link>
          </aside>
        </section>
      </main>
    </FusionShell>
  )
}
