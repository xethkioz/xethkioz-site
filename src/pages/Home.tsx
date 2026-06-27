import SEO from '../components/SEO'
import { WorldGateV5 } from '../engines/world'
import { useLang } from '../lib/LangContext'
import { FUSION_LABEL } from '../lib/fusionConfig'

export default function Home() {
  const { lang } = useLang()
  const description = lang === 'es'
    ? 'XETHKIOZ Fusion V5: World Gate modular, limpio, bilingüe y preparado para Portal Engine, Wisp Engine, CMS y comunidad.'
    : 'XETHKIOZ Fusion V5: modular clean World Gate prepared for Portal Engine, Wisp Engine, CMS and community.'

  return (
    <>
      <SEO
        title={`XETHKIOZ ${FUSION_LABEL} · World Gate V5`}
        description={description}
        url="/"
        image="/images/articles/xethkioz-cover.svg"
      />
      <WorldGateV5 />
    </>
  )
}
