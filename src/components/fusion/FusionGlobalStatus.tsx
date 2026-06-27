import { useLocation } from 'react-router-dom'
import { useHud } from '../../lib/HudContext'
import { useLang } from '../../lib/LangContext'
import { useWispEngine } from '../../lib/WispEngineContext'
import { FUSION_LABEL, FUSION_STAGE } from '../../lib/fusionConfig'

const routeLabel: Record<string, { es: string; en: string }> = {
  '/': { es: 'World Gate', en: 'World Gate' },
  '/gaming': { es: 'Portal Gaming', en: 'Gaming Portal' },
  '/science': { es: 'Science Lab', en: 'Science Lab' },
  '/fun': { es: 'Fun Portal', en: 'Fun Portal' },
  '/green-node': { es: 'Green Node', en: 'Green Node' },
}

export default function FusionGlobalStatus() {
  const location = useLocation()
  const { lang, t } = useLang()
  const { audioMode, account } = useHud()
  const { mood, energy } = useWispEngine()
  const current = routeLabel[location.pathname] || { es: 'Nodo desconocido', en: 'Unknown node' }
  const accountLabel = account.status === 'connected' ? account.name : t.v7.controls.guest

  return (
    <aside className="fusion-global-status" aria-label={t.v7.controls.systemStatus}>
      <span>{FUSION_LABEL}</span>
      <strong>{current[lang]}</strong>
      <ul>
        <li>{t.v7.controls.stage}: {FUSION_STAGE}</li>
        <li>{t.v7.controls.audio}: {audioMode === 'enabled' ? t.v7.controls.on : t.v7.controls.off}</li>
        <li>{t.v7.controls.account}: {accountLabel}</li>
        <li>{t.v7.wisp.status}: {mood === 'GREEN_MODE' ? 'GREEN_MODE' : t.v7.wisp.states[mood]} · {energy}%</li>
      </ul>
    </aside>
  )
}
