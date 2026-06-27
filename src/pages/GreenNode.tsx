import SEO from '../components/SEO'
import FusionHero from '../components/fusion/FusionHero'
import FusionLevelGrid from '../components/fusion/FusionLevelGrid'
import FusionShell from '../components/fusion/FusionShell'
import FusionStatusRail from '../components/fusion/FusionStatusRail'
import { useLang } from '../lib/LangContext'

export default function GreenNode() {
  const { t } = useLang()
  const portal = t.v7.portals.green
  return (
    <FusionShell tone="green" backLabel={t.v7.backCore} label={portal.label}>
      <SEO title={portal.title} description={portal.seoDescription} url="/green-node" />
      <div className="green-node-video-layer" aria-hidden="true">
        <video className="green-node-video" autoPlay muted loop playsInline preload="metadata">
          <source src="/videos/green-wisp-nexus.mp4" type="video/mp4" />
        </video>
      </div>
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,rgba(50,255,138,.18),transparent_30%)]" />
        <FusionHero tone="green" eyebrow={portal.eyebrow} heading={portal.heading} description={portal.description} />
        <FusionStatusRail items={['Acceso oculto por Wisp', 'Enfoque educativo', 'Separado del universo principal']} />
        <FusionLevelGrid tone="green" levels={portal.levels} />
      </main>
    </FusionShell>
  )
}
