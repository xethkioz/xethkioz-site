import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
import { useHud } from '../../lib/HudContext'
import { useWispEngine, type WispMood } from '../../lib/WispEngineContext'
import FusionWispEntity from './FusionWispEntity'

const routeMood: Record<string, WispMood> = {
  '/': 'watching',
  '/gaming': 'guiding',
  '/science': 'guiding',
  '/fun': 'guiding',
  '/green-node': 'connected',
}

export default function FusionGlobalWisp() {
  const { t } = useLang()
  const { account } = useHud()
  const { mood, energy, setMood, setFocusRoute, registerEvent } = useWispEngine()
  const location = useLocation()

  useEffect(() => {
    const nextMood = account.status === 'connected' ? 'connected' : routeMood[location.pathname] || 'idle'
    setMood(nextMood)
    setFocusRoute(location.pathname)
    registerEvent('route-watch', `route:${location.pathname}`, location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, account.status])

  const message = location.pathname === '/green-node'
    ? t.v7.wisp.connected
    : mood === 'guiding'
      ? t.v7.wisp.guiding
      : t.v7.wisp.idle

  return (
    <div className="fusion-global-wisp" aria-label={t.v7.core.wispLabel}>
      <FusionWispEntity
        label={t.v7.core.wispLabel}
        state={mood}
        energy={energy}
        message={message}
        onFocusSignal={() => registerEvent('portal-hover', 'wisp-focus', location.pathname)}
      />
    </div>
  )
}
