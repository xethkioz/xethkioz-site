import { type FusionTone, fusionToneClass } from '../../lib/designSystem'

type FeatureItem = readonly [string, string]

interface FusionFeatureGridProps {
  tone: FusionTone
  items: readonly FeatureItem[]
  columns?: 2 | 3
}

export default function FusionFeatureGrid({ tone, items, columns = 2 }: FusionFeatureGridProps) {
  return (
    <section className={`fusion-feature-grid ${fusionToneClass[tone]} mt-8 grid grid-cols-1 gap-5 ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
      {items.map(([title, text]) => (
        <article key={title} className="fusion-feature-card rounded-3xl border bg-black/46 p-6">
          <h2 className="font-display text-2xl font-black">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed">{text}</p>
        </article>
      ))}
    </section>
  )
}
