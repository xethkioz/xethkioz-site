import { Link } from 'react-router-dom'
import { platformMilestones } from '../lib/milestones'

const statusLabel = {
  stable: 'Estable',
  'in-progress': 'En progreso',
  planned: 'Planificado',
  blocked: 'Bloqueado',
}

export default function MilestoneRoadmap() {
  return (
    <section className="glass rounded-3xl border border-white/10 p-5 md:p-7">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-eyebrow">Roadmap operativo</p>
          <h2 className="font-display text-2xl md:text-3xl font-black text-white">Milestones hacia XETHKIOZ v4.0 Stable</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
            Esta vista organiza el progreso por sistemas. Evita sumar pantallas sueltas y mantiene el proyecto preparado para crecer hacia v5.0.
          </p>
        </div>
        <Link to="/qa" className="btn-secondary text-sm">Ver QA</Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {platformMilestones.map((milestone) => (
          <article key={milestone.id} className="rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:-translate-y-1 hover:border-orange/40">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-orange">{milestone.label}</span>
              <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-bold text-gray-300">{statusLabel[milestone.status]}</span>
            </div>
            <h3 className="font-display text-xl font-black text-white">{milestone.title}</h3>
            <p className="mt-2 min-h-[74px] text-sm leading-relaxed text-gray-400">{milestone.objective}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-orange to-neon" style={{ width: `${milestone.progress}%` }} />
            </div>
            <p className="mt-2 text-xs font-bold text-gray-500">{milestone.progress}% preparado</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {milestone.routes.slice(0, 3).map((route) => (
                <Link key={route} to={route.replace(':slug', 'league-of-legends-worlds-2025')} className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-gray-400 hover:border-orange hover:text-orange">
                  {route}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
