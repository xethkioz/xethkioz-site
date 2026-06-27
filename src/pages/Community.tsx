import SEO from '../components/SEO'
import FusionContentPanel from '../components/fusion/FusionContentPanel'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import { useLang } from '../lib/LangContext'

export default function Community() {
  const { t } = useLang()
  return (
    <FusionShell tone="fun" backLabel={t.v7.backCore} label={t.v7.functionality.communityEngine}>
      <SEO title={t.v7.functionality.communityEngine} description={t.v7.functionality.communityDescription} url="/community" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <FusionHero tone="fun" eyebrow={t.v7.functionality.progressSystem} heading={t.v7.functionality.communityEngine} description={t.v7.functionality.communityDescription} />
      </main>
      <FusionContentPanel tone="fun" mode="community" />
    </FusionShell>
  )
}
