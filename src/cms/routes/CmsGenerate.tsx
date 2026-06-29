export default function CmsGenerate() {
  return (
    <section className="rounded-3xl border border-orange-400/30 bg-black/40 p-6 shadow-2xl shadow-orange-950/20">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Nueva noticia</p>
      <h2 className="mt-3 text-3xl font-black">Generador visual</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
        Placeholder de la futura UI que consumirá <code className="rounded bg-white/10 px-2 py-1">/api/generate-news</code>.
        El formulario real llega en PR #13 para mantener esta entrega limpia y segura.
      </p>
      <div className="mt-6 rounded-2xl border border-purple-500/20 bg-white/[0.03] p-5 text-sm text-purple-100">
        Campos previstos: categoría, tema, título opcional, resumen, tags, fuentes y lenguaje.
      </div>
    </section>
  )
}
