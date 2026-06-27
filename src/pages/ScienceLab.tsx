import SEO from '../components/SEO'
import { SciencePortal } from '../engines/science'
import { useLang } from '../lib/LangContext'

export default function ScienceLab() {
  const { t } = useLang()
  const portal = t.v7.portals.science
  return (
    <>
      <SEO title={portal.title} description={portal.seoDescription} url="/science" />
      <SciencePortal />
    </>
  )
}
