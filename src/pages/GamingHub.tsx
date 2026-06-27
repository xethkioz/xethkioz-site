import SEO from '../components/SEO'
import { GamingPortal } from '../engines/gaming'
import { useLang } from '../lib/LangContext'

export default function GamingHub() {
  const { t } = useLang()
  const portal = t.v7.portals.games
  return (
    <>
      <SEO title={portal.title} description={portal.seoDescription} url="/gaming" />
      <GamingPortal />
    </>
  )
}
