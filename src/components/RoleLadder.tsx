import { moderationPolicy, roleTiers, xpRules } from '../lib/roles'

export default function RoleLadder() {
  return (
    <section className="glass rounded-2xl border border-white/10 p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
        <div>
          <p className="section-eyebrow">Community Progression</p>
          <h2 className="font-display text-2xl md:text-3xl font-black gradient-text">Roles, XP e insignias</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl">
            Sistema base para premiar participación, apoyo real y conducta positiva sin convertir la moderación en un beneficio automático.
          </p>
        </div>
        <span className="rounded-full border border-neon/30 bg-neon/10 px-4 py-2 text-xs font-bold text-neon">
          RC1 Foundation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {roleTiers.map((tier) => (
          <article key={tier.role} className="rounded-xl border border-white/10 bg-black/25 p-4 hover:border-orange/50 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-3xl mb-2">{tier.icon}</div>
                <h3 className="font-display text-lg text-white">{tier.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{tier.minXp > 0 ? `${tier.minXp.toLocaleString('es-AR')} XP mínimo` : 'Asignación especial / base'}</p>
              </div>
              {tier.moderationEligible && <span className="text-[10px] rounded-full border border-green-400/40 bg-green-400/10 px-2 py-1 text-green-300">MOD READY</span>}
            </div>
            <p className="text-sm text-gray-400 mt-3">{tier.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tier.privileges.slice(0, 3).map((p) => (
                <span key={p} className="text-[11px] rounded-full border border-white/10 px-2 py-1 text-gray-300">{p}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="font-display text-white mb-3">Reglas de XP</h3>
          <div className="space-y-2">
            {xpRules.map((rule) => (
              <div key={rule.id} className="flex items-start justify-between gap-4 rounded-lg bg-black/25 p-3">
                <div>
                  <p className="text-sm font-bold text-white">{rule.action}</p>
                  <p className="text-xs text-gray-500">{rule.limit} • {rule.note}</p>
                </div>
                <span className="text-orange font-display">+{rule.points}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-green-400/20 bg-green-400/[0.04] p-4">
          <h3 className="font-display text-green-300 mb-3">Política de moderación</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            {moderationPolicy.map((item) => (
              <li key={item} className="flex gap-2"><span className="text-green-300">▸</span><span>{item}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
