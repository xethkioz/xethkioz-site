import { SCIENCE_LAB_POLICY } from '../lib/siteConfig'
import { scienceEditorialChecks, scienceReportFields } from '../lib/networkBlueprint'

const sourceExamples = [
  { type: 'Paper revisado', use: 'Cuando existe publicación científica formal', risk: 'Bajo si se cita contexto y limitaciones' },
  { type: 'Preprint', use: 'Para avances recientes todavía no revisados', risk: 'Medio: siempre marcar como preliminar' },
  { type: 'Institucional', use: 'NASA, ESA, OMS, universidades, organismos públicos', risk: 'Bajo/medio según alcance del comunicado' },
  { type: 'Divulgación', use: 'Explicación para público general', risk: 'Requiere verificar fuente original' },
]

export default function ScienceSourceBoard() {
  return (
    <section className="rounded-3xl border border-sky-200/10 bg-slate-900/75 p-5 md:p-7 shadow-[0_0_30px_rgba(14,165,233,.08)]">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">Policy Board</p>
          <h2 className="font-display text-2xl md:text-4xl font-black text-white">{SCIENCE_LAB_POLICY.name}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{SCIENCE_LAB_POLICY.rule}</p>
        </div>
        <span className="w-fit rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-200">
          tono: {SCIENCE_LAB_POLICY.tone}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-display text-lg font-black text-white">Campos obligatorios</h3>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SCIENCE_LAB_POLICY.requiredFields.map((field) => (
              <span key={field} className="rounded-xl border border-sky-300/15 bg-sky-300/5 px-3 py-2 text-sm text-slate-300">{field}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <h3 className="font-display text-lg font-black text-white">Checklist editorial</h3>
          <ul className="mt-4 space-y-2">
            {scienceEditorialChecks.map((check) => (
              <li key={check} className="flex gap-2 text-sm leading-relaxed text-slate-300"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky-300" />{check}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sourceExamples.map((source) => (
          <div key={source.type} className="rounded-2xl border border-sky-200/10 bg-slate-950/60 p-4">
            <strong className="text-sky-100">{source.type}</strong>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{source.use}</p>
            <p className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-slate-500">Riesgo: {source.risk}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-sky-300/15 bg-sky-300/5 p-4">
        <h3 className="font-display text-lg font-black text-sky-100">Campos CMS previstos</h3>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          {scienceReportFields.map((field) => (
            <div key={field.label} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm">
              <span className="font-bold text-slate-200">{field.label}: </span><span className="font-mono text-xs text-slate-400">{field.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
