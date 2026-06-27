import SEO from '../components/SEO'
import FusionFeatureGrid from '../components/fusion/FusionFeatureGrid'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import FusionStatusRail from '../components/fusion/FusionStatusRail'
import { useLang } from '../lib/LangContext'

export default function FunPortal() {
  const { t } = useLang()
  const portal = t.v7.portals.fun
  return (
    <FusionShell tone="fun" backLabel={t.v7.backCore} label={portal.label}>
      <SEO title={portal.title} description={portal.seoDescription} url="/fun" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <FusionHero tone="fun" eyebrow={portal.eyebrow} heading={portal.heading} description={portal.description} />
        <FusionStatusRail items={['Memes +12', 'Videos cortos', 'Creaciones digitales']} />
        <FusionFeatureGrid tone="fun" items={portal.sections} columns={3} />
      </main>
    </FusionShell>
  )
}
