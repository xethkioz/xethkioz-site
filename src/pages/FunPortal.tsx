import SEO from '../components/SEO'
import { FunPortal as FunPortalEngine } from '../engines/fun'
import { useLang } from '../lib/LangContext'

export default function FunPortal() {
  const { t } = useLang()
  const portal = t.v7.portals.fun
  return (
    <>
      <SEO title={portal.title} description={portal.seoDescription} url="/fun" />
      <FunPortalEngine />
    </>
  )
}
