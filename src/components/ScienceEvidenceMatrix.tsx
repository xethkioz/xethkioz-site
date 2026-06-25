import { scienceEditorialChecks, scienceReportFields } from '../lib/networkBlueprint'

export default function ScienceEvidenceMatrix() {
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="science-matrix-title">
      <div className="rounded-3xl border border-sky-200/10 bg-slate-900/70 p-6">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">Matriz editorial</p>
        <h2 id="science-matrix-title" className="mt-3 font-display text-2xl font-black text-white">Cómo se valida un informe</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Science Lab queda preparado para informes más serios: cada pieza debe tener fuente, nivel de evidencia y contexto. La meta es divulgar sin exagerar.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {scienceReportFields.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
              <strong className="mt-2 block text-sm text-sky-100">{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-sky-200/10 bg-slate-900/70 p-6">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">Checklist antes de publicar</p>
        <ol className="mt-4 space-y-3">
          {scienceEditorialChecks.map((check, index) => (
            <li key={check} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-slate-300">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-300 text-xs font-black text-slate-950">{index + 1}</span>
              <span>{check}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
