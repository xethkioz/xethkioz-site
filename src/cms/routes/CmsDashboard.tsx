const stats = [
  { label: 'Noticias totales', value: '0', hint: 'Se conectará en PR #11' },
  { label: 'Borradores', value: '0', hint: 'Pendiente de listado real' },
  { label: 'En revisión', value: '0', hint: 'Workflow en PR #14' },
  { label: 'Publicadas', value: '0', hint: 'Publicación manual futura' },
]

export default function CmsDashboard() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-purple-500/25 bg-black/40 p-6 shadow-2xl shadow-purple-950/30">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Dashboard editorial</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">Centro de mando del News Engine</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
          Scaffold inicial del CMS profesional. En esta fase validamos layout, navegación y protección admin sin tocar datos reales.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">{stat.label}</p>
            <strong className="mt-3 block text-4xl font-black text-white">{stat.value}</strong>
            <p className="mt-2 text-xs text-purple-200/80">{stat.hint}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
