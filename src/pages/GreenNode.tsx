import SEO from '../components/SEO'
import { GreenPortal } from '../engines/green'
import { useLang } from '../lib/LangContext'

export default function GreenNode() {
  const { t } = useLang()
  const portal = t.v7.portals.green
  return (
    <>
      <SEO title={portal.title} description={portal.seoDescription} url="/green-node" />
      <GreenPortal />
    </>
  )
}
