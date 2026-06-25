import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { dynamicNewsPipeline } from '../lib/networkBlueprint'

const modules = [
  { title: 'Modelos y herramientas', body: 'Comparativas de IA, modelos generativos, asistentes, automatización y novedades relevantes para creadores.' },
  { title: 'Prompts y workflows', body: 'Biblioteca futura de prompts, flujos para redactar noticias, preparar imágenes, resumir fuentes y publicar contenido.' },
  { title: 'IA editorial', body: 'Borradores asistidos, SEO, categorías, etiquetas, traducciones y control humano antes de publicar.' },
  { title: 'Automatización segura', body: 'Tareas programadas, revisión de fuentes, alertas, calendario editorial y conexión futura con Supabase.' },
]

const rules = [
  'Toda noticia creada con IA debe tener revisión humana antes de publicarse.',
  'La IA puede resumir y ordenar, pero no reemplaza la verificación de fuentes.',
  'Separar contenido propio, contenido externo con atribución y borradores generados.',
  'Mantener registro del origen de cada fuente, fecha de consulta y estado editorial.',
]

export default function AILab() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="AI Lab"
        description="XETHKIOZ AI Lab: modelos, prompts, automatización editorial, herramientas de IA y flujos de producción para el ecosistema."
        url="/ai-lab"
        image="/images/articles/ai-newsroom.svg"
      />

      <section className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-ink-300 p-6 md:p-10 shadow-[0_0_60px_rgba(34,211,238,.12)]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,.18),transparent_35%),radial-gradient(circle_at_20%_70%,rgba(168,85,247,.16),transparent_34%)]" />
        <div className="relative max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300">XETHKIOZ Network / AI Division</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-black text-white">AI Lab</h1>
          <p className="mt-4 max-w-3xl text-gray-300 leading-relaxed">
            Laboratorio para inteligencia artificial aplicada a noticias, creación de contenido, automatización, prompts, análisis de fuentes y producción editorial. Este módulo prepara el camino para que XETHKIOZ publique más rápido sin perder control humano.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/content-system" className="btn-primary text-sm">Conectar con Content OS</Link>
            <Link to="/cms" className="btn-secondary text-sm">Ir al CMS Studio</Link>
            <Link to="/network" className="btn-secondary text-sm">Network Hub</Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((module) => (
          <article key={module.title} className="glass rounded-2xl border border-cyan-300/15 p-5">
            <h2 className="font-display text-xl font-black text-white">{module.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">{module.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_.9fr] gap-5">
        <div className="glass rounded-2xl border border-white/10 p-5">
          <p className="section-eyebrow">Pipeline futuro</p>
          <h2 className="font-display text-2xl font-black text-white">IA como asistente editorial</h2>
          <div className="mt-4 space-y-3">
            {dynamicNewsPipeline.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-xl border border-cyan-300/15 bg-black/25 p-4 text-sm text-gray-300">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-black text-ink">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl border border-white/10 p-5">
          <p className="section-eyebrow">Reglas de seguridad editorial</p>
          <h2 className="font-display text-2xl font-black text-white">IA con control humano</h2>
          <div className="mt-4 space-y-3">
            {rules.map((rule) => (
              <p key={rule} className="rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-gray-300">{rule}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
