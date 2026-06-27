import { type FusionTone, fusionToneClass } from '../../lib/designSystem'

interface FusionHeroProps {
  tone: FusionTone
  eyebrow: string
  heading: string
  description: string
}

export default function FusionHero({ tone, eyebrow, heading, description }: FusionHeroProps) {
  return (
    <section className={`fusion-hero ${fusionToneClass[tone]} rounded-[2rem] border bg-black/56 p-7 shadow-xl`}>
      <p className="fusion-hero-eyebrow section-eyebrow">{eyebrow}</p>
      <h1 className="mt-4 font-display text-4xl font-black md:text-6xl">{heading}</h1>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed md:text-base">{description}</p>
    </section>
  )
}
