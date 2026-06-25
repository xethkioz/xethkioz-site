
import { Link } from 'react-router-dom'
import { contentLanes, editorialWorkflow, networkHomeSlots, roleEscalationRules } from '../lib/contentOps'

const statusClass: Record<string, string> = {
  ready: 'border-green-400/25 bg-green-400/10 text-green-300',
  'cms-ready': 'border-orange/25 bg-orange/10 text-orange',
  'automation-ready': 'border-cyan-300/25 bg-cyan-300/10 text-cyan-200',
  'editorial-review': 'border-neon/25 bg-neon/10 text-neon',
  'needs-source': 'border-sky-300/25 bg-sky-300/10 text-sky-200',
  partial: 'border-yellow-300/25 bg-yellow-300/10 text-yellow-200',
  review: 'border-orange/25 bg-orange/10 text-orange',
}

export default function ContentOpsDashboard() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-orange/20 bg-ink-300/80 p-5 md:p-7 shadow-[0_0_40px_rgba(255,106,0,.08)]">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-eyebrow">RC1.6 Content OS</p>
            <h2 className="font-display text-2xl md:text-4xl font-black text-white">Sistema editorial modular</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
              Esta capa ordena qué tipo de contenido vive en cada portal y cómo debe avanzar desde captura hasta publicación, SEO, redes y medición.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/cms" className="btn-primary text-sm">Abrir CMS</Link>
            <Link to="/news-engine" className="btn-secondary text-sm">Fuentes</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {contentLanes.map((lane) => (
            <article key={lane.id} className="rounded-2xl border border-white/10 bg-black/25 p-5 transition hover:-translate-y-1 hover:border-orange/35">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-3xl">{lane.icon}</span>
                <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${statusClass[lane.status] || statusClass.review}`}>{lane.status}</span>
              </div>
              <h3 className="font-display text-xl font-black text-white">{lane.title}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">{lane.portal}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{lane.description}</p>
              <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-gray-400">
                <strong className="text-white">DB:</strong> {lane.database}
              </div>
              <p className="mt-3 text-xs text-orange">Siguiente: {lane.nextStep}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <div className="glass rounded-3xl border border-white/10 p-5 md:p-7">
          <p className="section-eyebrow">Workflow</p>
          <h2 className="font-display text-2xl font-black text-white">Flujo de publicación</h2>
          <div className="mt-5 space-y-3">
            {editorialWorkflow.map((item, index) => (
              <div key={item.step} className="flex gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange text-sm font-black text-ink">{index + 1}</span>
                <div>
                  <h3 className="font-display text-white font-bold">{item.step}</h3>
                  <p className="text-sm text-gray-400">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl border border-white/10 p-5 md:p-7">
          <p className="section-eyebrow">Home Slots</p>
          <h2 className="font-display text-2xl font-black text-white">Qué muestra la portada</h2>
          <div className="mt-5 space-y-3">
            {networkHomeSlots.map((slot) => (
              <Link key={slot.slot} to={slot.route} className="block rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-orange/35 hover:bg-white/[0.04]">
                <strong className="text-white">{slot.slot}</strong>
                <p className="mt-1 text-sm text-gray-400">{slot.content}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-neon/20 bg-neon/5 p-5 md:p-7">
        <p className="section-eyebrow">Community Rules</p>
        <h2 className="font-display text-2xl font-black text-white">Escalafón sin romper la confianza</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {roleEscalationRules.map((rule) => (
            <div key={rule} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-relaxed text-gray-300">
              <span className="mr-2 text-green-300">✓</span>{rule}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
