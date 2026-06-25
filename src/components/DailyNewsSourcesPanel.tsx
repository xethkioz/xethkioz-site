import { dailyUpdateRules, NEWS_SOURCE_GROUPS, trustedNewsSources } from '../lib/newsSources'

export default function DailyNewsSourcesPanel() {
  const grouped = trustedNewsSources.reduce<Record<string, typeof trustedNewsSources>>((acc, source) => {
    const label = NEWS_SOURCE_GROUPS[source.kind]
    acc[label] = acc[label] || []
    acc[label].push(source)
    return acc
  }, {})

  return (
    <section className="glass rounded-2xl border border-white/10 p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
        <div>
          <p className="section-eyebrow">Dynamic News Engine</p>
          <h2 className="font-display text-2xl md:text-3xl font-black gradient-text">Fuentes diarias preparadas</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl">
            Base editorial para revisar noticias externas, generar resúmenes propios y mantener atribución clara a cada fuente original.
          </p>
        </div>
        <span className="rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-xs font-bold text-green-300">
          {trustedNewsSources.length} fuentes iniciales
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.entries(grouped).map(([group, sources]) => (
          <div key={group} className="rounded-xl border border-white/10 bg-black/25 p-4">
            <h3 className="font-display text-lg text-white mb-3">{group}</h3>
            <div className="space-y-3">
              {sources.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg border border-white/10 bg-white/[0.03] p-3 hover:border-orange/60 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-sm text-white">{source.name}</strong>
                    <span className={`text-[10px] uppercase tracking-wider rounded-full px-2 py-1 border ${
                      source.status === 'ready' ? 'border-green-400/40 text-green-300' : source.status === 'api-needed' ? 'border-red-400/40 text-red-300' : 'border-orange/40 text-orange'
                    }`}>
                      {source.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{source.notes}</p>
                  <p className="text-[11px] text-gray-500 mt-2">{source.region} • {source.language.toUpperCase()}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-orange/20 bg-orange/5 p-4">
        <h3 className="font-display text-orange mb-2">Reglas editoriales para fuentes externas</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
          {dailyUpdateRules.map((rule) => (
            <li key={rule} className="flex gap-2"><span className="text-orange">•</span><span>{rule}</span></li>
          ))}
        </ul>
      </div>
    </section>
  )
}
