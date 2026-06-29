const placeholders = [
  { title: 'Borradores', status: 'draft', note: 'Listado real en PR #11' },
  { title: 'En revisión', status: 'review', note: 'Workflow en PR #14' },
  { title: 'Publicadas', status: 'published', note: 'Publicación en PR #14' },
]

export default function CmsNewsList() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Noticias</p>
        <h2 className="mt-3 text-3xl font-black">Listado editorial</h2>
        <p className="mt-2 text-sm text-purple-100">Placeholder de filtros, estados y paginación.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {placeholders.map((item) => (
          <article key={item.status} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-200">{item.status}</p>
            <h3 className="mt-3 text-xl font-black text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-purple-100">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
