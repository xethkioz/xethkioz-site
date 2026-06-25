import { DATABASE_BASELINE_MODULES, RC15_REVIEW_CHECKLIST, SITE_VERSION } from '../lib/siteConfig'

const statusClass: Record<string, string> = {
  core: 'border-orange/30 bg-orange/10 text-orange',
  required: 'border-red-300/30 bg-red-400/10 text-red-200',
  pipeline: 'border-blue-300/30 bg-blue-400/10 text-blue-200',
  formal: 'border-sky-300/30 bg-sky-300/10 text-sky-200',
  special: 'border-green-300/30 bg-green-400/10 text-green-200',
  'realtime-ready': 'border-purple-300/30 bg-purple-400/10 text-purple-200',
  community: 'border-pink-300/30 bg-pink-400/10 text-pink-200',
  admin: 'border-yellow-300/30 bg-yellow-400/10 text-yellow-200',
}

export default function DatabaseBaselinePanel() {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/30 p-5 md:p-7">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-eyebrow">Database Baseline</p>
          <h2 className="font-display text-2xl font-black text-white md:text-4xl">Supabase listo para XETHKIOZ Network</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
            {SITE_VERSION} consolida el punto de partida para CMS, noticias externas, Science Lab formal, Green Node, comunidad, XP y roles. Esta vista funciona como checklist técnico antes de tocar producción.
          </p>
        </div>
        <span className="rounded-full border border-green-300/30 bg-green-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-200">
          baseline rc1.5
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {DATABASE_BASELINE_MODULES.map((item) => (
          <article key={item.table} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-mono text-sm font-black text-white">{item.table}</h3>
              <span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-wider ${statusClass[item.status] ?? 'border-white/10 text-gray-300'}`}>{item.status}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.purpose}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-ink-400/60 p-4">
        <h3 className="font-display text-xl font-black text-white">Checklist antes de LIVE</h3>
        <ul className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          {RC15_REVIEW_CHECKLIST.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-gray-300"><span className="text-green-300">✓</span>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
