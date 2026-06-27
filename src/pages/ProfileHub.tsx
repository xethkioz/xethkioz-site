import SEO from '../components/SEO'
import FusionContentPanel from '../components/fusion/FusionContentPanel'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import { useLang } from '../lib/LangContext'

export default function ProfileHub() {
  const { t } = useLang()
  return (
    <FusionShell tone="gaming" backLabel={t.v7.backCore} label={t.v7.functionality.profileEngine}>
      <SEO title={t.v7.functionality.profileEngine} description={t.v7.functionality.profilePreview} url="/profile" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <FusionHero tone="gaming" eyebrow={t.v7.functionality.communityEngine} heading={t.v7.functionality.profileEngine} description={t.v7.functionality.profileDescription} />
      </main>
      <FusionContentPanel tone="gaming" mode="profile" />
    </FusionShell>
  )
}
