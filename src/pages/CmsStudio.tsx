import SEO from '../components/SEO'
import FusionContentPanel from '../components/fusion/FusionContentPanel'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import { useLang } from '../lib/LangContext'

export default function CmsStudio() {
  const { t } = useLang()
  return (
    <FusionShell tone="green" backLabel={t.v7.backCore} label={t.v7.functionality.cmsEngine}>
      <SEO title={t.v7.functionality.cmsEngine} description={t.v7.functionality.cmsDescription} url="/cms" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <FusionHero tone="green" eyebrow={t.v7.functionality.editorialQueue} heading={t.v7.functionality.cmsEngine} description={t.v7.functionality.cmsDescription} />
      </main>
      <FusionContentPanel tone="green" mode="cms" />
    </FusionShell>
  )
}
