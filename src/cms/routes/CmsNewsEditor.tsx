import { useParams } from 'react-router-dom'

export default function CmsNewsEditor() {
  const { id } = useParams()
  const isNew = !id

  return (
    <section className="rounded-3xl border border-purple-500/20 bg-black/35 p-6 text-white shadow-2xl shadow-purple-950/20">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Editor</p>
      <h2 className="mt-3 text-3xl font-black">{isNew ? 'Nuevo artículo' : 'Editar artículo'}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
        Placeholder del editor por bloques. PR #12 agregará edición de título, resumen, categoría, tags y contenido JSON estructurado.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-purple-500/20 bg-white/[0.03] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">Estado</p>
          <p className="mt-2 text-sm text-purple-100">Sin conexión a datos reales en PR #10.</p>
        </div>
        <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-200">Artículo</p>
          <p className="mt-2 text-sm text-orange-50/90">{id ? `ID solicitado: ${id}` : 'Modo creación visual reservado para PR #12.'}</p>
        </div>
      </div>
    </section>
  )
}
