import { type FusionTone, fusionToneClass } from '../../lib/designSystem'

type LevelItem = readonly [string, string, string]

interface FusionLevelGridProps {
  tone: FusionTone
  levels: readonly LevelItem[]
}

export default function FusionLevelGrid({ tone, levels }: FusionLevelGridProps) {
  return (
    <section className={`fusion-level-grid ${fusionToneClass[tone]} mt-8 grid grid-cols-1 gap-5 md:grid-cols-3`}>
      {levels.map(([level, title, text]) => (
        <article key={level} className="fusion-level-card rounded-3xl border bg-black/65 p-6 shadow-xl">
          <p className="fusion-level-kicker font-mono text-xs font-black uppercase tracking-[0.26em]">{level}</p>
          <h2 className="mt-3 font-display text-2xl font-black">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed">{text}</p>
        </article>
      ))}
    </section>
  )
}
