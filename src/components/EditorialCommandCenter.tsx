import { Link } from 'react-router-dom'
import { editorialSlots, publishingLanes, rc23QualityGates } from '../lib/editorialPlan'

const priorityClass = {
  alta: 'border-red-400/25 bg-red-400/10 text-red-200',
  media: 'border-orange/25 bg-orange/10 text-orange',
  baja: 'border-green-400/25 bg-green-400/10 text-green-300',
}

const statusClass = {
  listo: 'border-green-400/25 bg-green-400/10 text-green-300',
  'en-progreso': 'border-cyan-300/25 bg-cyan-300/10 text-cyan-200',
  pendiente: 'border-white/10 bg-white/5 text-gray-300',
  revision: 'border-neon/25 bg-neon/10 text-neon',
}

export default function EditorialCommandCenter() {
  const highPriority = editorialSlots.filter((slot) => slot.priority === 'alta').length
  const inProgress = editorialSlots.filter((slot) => slot.status === 'en-progreso' || slot.status === 'revision').length

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-orange/20 bg-ink-300/85 p-5 md:p-7 shadow-[0_0_42px_rgba(255,106,0,.10)]">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_.7fr] lg:items-center">
          <div>
            <p className="section-eyebrow">RC2.3 Editorial Command Center</p>
            <h2 className="font-display text-2xl md:text-4xl font-black text-white">Centro de carga y pulido de contenido</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
              Esta capa ordena qué falta completar para que XETHKIOZ deje de parecer una maqueta y empiece a sentirse como un portal vivo: contenido real, fuentes, videos, Science Lab formal, Green Node controlado y comunidad.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-orange/20 bg-black/25 p-4 text-center">
              <p className="font-display text-3xl font-black text-orange">{highPriority}</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">prioridad alta</p>
            </div>
            <div className="rounded-2xl border border-neon/20 bg-black/25 p-4 text-center">
              <p className="font-display text-3xl font-black text-neon">{inProgress}</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">en progreso</p>
            </div>
          </div>
        </div>
        <div className="relative mt-5 flex flex-wrap gap-2">
          <Link to="/cms" className="btn-primary text-sm">Abrir CMS</Link>
          <Link to="/content-system" className="btn-secondary text-sm">Content OS</Link>
          <Link to="/milestones" className="btn-secondary text-sm">Milestones</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {editorialSlots.map((slot) => (
          <article key={slot.id} className="rounded-2xl border border-white/10 bg-black/25 p-5 transition hover:-translate-y-1 hover:border-orange/30">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-500">{slot.portal}</p>
              <div className="flex gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${priorityClass[slot.priority]}`}>{slot.priority}</span>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${statusClass[slot.status]}`}>{slot.status}</span>
              </div>
            </div>
            <h3 className="font-display text-xl font-black text-white">{slot.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{slot.goal}</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-ink/50 p-3 text-xs text-gray-300">
              <span className="font-black text-orange">Siguiente acción:</span> {slot.nextAction}
            </div>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_.85fr]">
        <div className="rounded-3xl border border-neon/20 bg-ink-300/70 p-5">
          <p className="section-eyebrow mb-3">Publishing lanes</p>
          <div className="space-y-3">
            {publishingLanes.map((lane) => (
              <div key={lane.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-black text-white">{lane.name}</h3>
                  <span className="rounded-full border border-orange/20 bg-orange/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-orange">{lane.cadence}</span>
                </div>
                <p className="mt-2 text-xs text-gray-400"><b className="text-gray-200">Fuente:</b> {lane.source}</p>
                <p className="mt-1 text-xs text-gray-400"><b className="text-gray-200">Salida:</b> {lane.output}</p>
                <p className="mt-1 text-xs text-gray-500">Responsable: {lane.owner}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-green-400/20 bg-green-400/5 p-5">
          <p className="section-eyebrow mb-3 text-green-300">Quality gates</p>
          <div className="space-y-2">
            {rc23QualityGates.map((gate) => (
              <div key={gate} className="rounded-xl border border-green-400/15 bg-black/25 px-3 py-2 text-xs text-green-100">
                ✅ {gate}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
