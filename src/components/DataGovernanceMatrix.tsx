import { databaseBaselineModules, serviceBacklog } from '../lib/milestones'

export default function DataGovernanceMatrix() {
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <div className="glass rounded-3xl border border-white/10 p-5 md:p-7">
        <p className="section-eyebrow">SQL / Supabase</p>
        <h2 className="font-display text-2xl md:text-3xl font-black text-white">Baseline de datos por modulo</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">
          La base queda separada por dominio: identidad, editorial, ciencia, Green Node, comunidad y creator tools. Esto evita mezclar datos cuando el ecosistema crezca.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {databaseBaselineModules.map((module) => (
            <article key={module.name} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-black text-white">{module.name}</h3>
                <span className="rounded-full border border-orange/30 bg-orange/10 px-2 py-1 text-[10px] font-bold uppercase text-orange">{module.priority}</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">{module.purpose}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {module.tables.map((table) => (
                  <code key={table} className="rounded-md border border-white/10 bg-black/35 px-2 py-1 text-[11px] text-gray-300">{table}</code>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl border border-white/10 p-5 md:p-7">
        <p className="section-eyebrow">Servicios posteriores</p>
        <h2 className="font-display text-2xl font-black text-white">Backlog funcional</h2>
        <div className="mt-5 space-y-3">
          {serviceBacklog.map((item) => (
            <div key={item.service} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-white">{item.service}</strong>
                <span className="rounded-full border border-neon/20 bg-neon/10 px-2 py-1 text-[10px] font-bold uppercase text-neon">{item.state}</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">{item.next}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
