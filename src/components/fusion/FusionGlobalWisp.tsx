import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useHud } from '../../lib/HudContext'
import { useWisp } from '../../providers/WispProvider'
import type { WispMood } from '../../lib/WispEngineContext'

const routeMood: Record<string, WispMood> = {
  '/': 'watching',
  '/gaming': 'guiding',
  '/science': 'guiding',
  '/fun': 'guiding',
  '/green-node': 'GREEN_MODE',
}

export default function FusionGlobalWisp() {
  const { account } = useHud()
  const { setMood, setFocusRoute, registerEvent, triggerGreenPortal } = useWisp()
  const [portalOpen, setPortalOpen] = useState(false)
  const [portalPoint, setPortalPoint] = useState({ x: '50%', y: '50%' })
  const navigationTimer = useRef<number | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const nextMood = location.pathname === '/green-node'
      ? 'GREEN_MODE'
      : account.status === 'connected'
        ? 'connected'
        : routeMood[location.pathname] || 'idle'

    setMood(nextMood)
    setPortalOpen(false)
    setFocusRoute(location.pathname)
    registerEvent('route-watch', `route:${location.pathname}`, location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, account.status])

  useEffect(() => () => {
    if (navigationTimer.current !== null) window.clearTimeout(navigationTimer.current)
  }, [])

  const openPortal = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPortalPoint({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` })
    setPortalOpen(true)
    triggerGreenPortal()
    if (navigationTimer.current !== null) window.clearTimeout(navigationTimer.current)
    navigationTimer.current = window.setTimeout(() => navigate('/green-node'), 720)
  }

  return (
    <>
      <div
        className={`xk-wisp-portal ${portalOpen ? 'is-open' : ''}`}
        style={{ '--portal-x': portalPoint.x, '--portal-y': portalPoint.y } as CSSProperties}
        aria-hidden="true"
      />
      <button
        type="button"
        className="xk-wisp"
        onClick={openPortal}
        onMouseEnter={() => registerEvent('portal-hover', 'wisp-organic-hover', location.pathname)}
        aria-label="Abrir portal Wisp hacia Green Node"
        title="Wisp"
      >
        <span className="sr-only">Wisp</span>
        <span className="xk-wisp-aura" aria-hidden="true" />
        <span className="xk-wisp-horn xk-wisp-horn-left" aria-hidden="true" />
        <span className="xk-wisp-horn xk-wisp-horn-right" aria-hidden="true" />
        <span className="xk-wisp-face" aria-hidden="true">
          <i className="xk-wisp-eye xk-wisp-eye-left" />
          <i className="xk-wisp-eye xk-wisp-eye-right" />
          <i className="xk-wisp-mouth" />
        </span>
        <span className="xk-wisp-code" aria-hidden="true">0110<br />W1SP<br />0x66</span>
        <span className="xk-wisp-tail" aria-hidden="true" />
      </button>
    </>
  )
}
