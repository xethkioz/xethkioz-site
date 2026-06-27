import SEO from '../components/SEO'
import FusionContentPanel from '../components/fusion/FusionContentPanel'
import FusionHero from '../components/fusion/FusionHero'
import FusionShell from '../components/fusion/FusionShell'
import { useLang } from '../lib/LangContext'

export default function News() {
  const { t } = useLang()
  return (
    <FusionShell tone="science" backLabel={t.v7.backCore} label={t.v7.functionality.newsEngine}>
      <SEO title={t.v7.functionality.newsEngine} description={t.v7.functionality.newsDescription} url="/news" />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <FusionHero tone="science" eyebrow={t.v7.functionality.dynamicContent} heading={t.v7.functionality.newsEngine} description={t.v7.functionality.newsDescription} />
      </main>
      <FusionContentPanel tone="science" mode="news" />
    </FusionShell>
  )
}
