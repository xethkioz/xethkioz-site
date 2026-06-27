import { useLocation } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
import { useHud } from '../../lib/HudContext'
import FusionWispEntity from './FusionWispEntity'

export default function FusionGlobalWisp() {
  const { t } = useLang()
  const { account } = useHud()
  const location = useLocation()
  const state = account.status === 'connected' ? 'connected' : location.pathname === '/green-node' ? 'watching' : 'idle'

  return (
    <div className="fusion-global-wisp" aria-label={t.v7.core.wispLabel}>
      <FusionWispEntity label={t.v7.core.wispLabel} state={state} />
    </div>
  )
}
