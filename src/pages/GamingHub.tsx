import SEO from '../components/SEO'
import FusionFeatureGrid from '../components/fusion/FusionFeatureGrid'
import FusionHero from '../components/fusion/FusionHero'
import FusionContentPanel from '../components/fusion/FusionContentPanel'
import FusionShell from '../components/fusion/FusionShell'
import FusionStatusRail from '../components/fusion/FusionStatusRail'
import { useLang } from '../lib/LangContext'

export default function GamingHub() {
  const { t } = useLang()
  const portal = t.v7.portals.games
  return (
    <FusionShell tone="gaming" backLabel={t.v7.backCore} label={portal.label}>
      <SEO title={portal.title} description={portal.seoDescription} url="/gaming" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <FusionHero tone="gaming" eyebrow={portal.eyebrow} heading={portal.heading} description={portal.description} />
        <FusionStatusRail items={['Noticias por plataforma', 'Guías con moderación', 'Embeds para streams']} />
        <FusionFeatureGrid tone="gaming" items={portal.sections} columns={2} />
      </main>
      <FusionContentPanel tone="gaming" portal="gaming" />
    </FusionShell>
  )
}
