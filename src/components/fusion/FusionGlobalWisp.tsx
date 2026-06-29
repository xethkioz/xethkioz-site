import { useEffect, useState } from 'react'
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
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const nextMood = location.pathname === '/green-node'
      ? 'GREEN_MODE'
      : account.status === 'connected'
        ? 'connected'
        : routeMood[location.pathname] || 'idle'

    setMood(nextMood)
    setFocusRoute(location.pathname)
    registerEvent('route-watch', `route:${location.pathname}`, location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, account.status])

  const openPortal = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPortalPoint({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` })
    setPortalOpen(true)
    triggerGreenPortal()
    window.setTimeout(() => navigate('/green-node'), 720)
  }

  return (
    <>
      <div
        className={`xk-wisp-portal ${portalOpen ? 'is-open' : ''}`}
        style={{ '--portal-x': portalPoint.x, '--portal-y': portalPoint.y } as React.CSSProperties}
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
      </button>
    </>
  )
}
