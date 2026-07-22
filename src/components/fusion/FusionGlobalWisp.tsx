import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SafeImage from '../SafeImage'
import { useHud } from '../../lib/HudContext'
import { useLang } from '../../lib/LangContext'
import { useWisp } from '../../providers/WispProvider'
import type { WispMood } from '../../lib/WispEngineContext'
import { WISP_GREEN_GUIDE_EVENT } from '../../lib/wispGuide'
import './FusionGlobalWisp.css'

const routeMood: Record<string, WispMood> = {
  '/': 'watching',
  '/gaming': 'guiding',
  '/science': 'guiding',
  '/fun': 'guiding',
  '/green-node': 'GREEN_MODE',
}

const outerRunes = ['ᚺ', 'ᚨ', 'ᚲ', 'ᚲ', 'ᛉ', 'ᛟ', 'ᚾ', 'ᛖ']
const innerRunes = ['0x66', 'XK', '06', 'NODE', 'W1SP', 'ROOT']

const labels = {
  es: {
    action: 'Abrir la Zona Hack y entrar a Green Node',
    marker: 'ZONA HACK',
    node: 'XK-06 // GREEN NODE',
    status: 'VECTOR DE ACCESO LISTO',
    helpAction: 'Pedir ayuda al WISP para usar Green Node',
    helpMarker: 'GUÍA WISP',
    helpStatus: 'TOCÁ PARA REABRIR EL RECORRIDO',
  },
  en: {
    action: 'Open the Hack Zone and enter Green Node',
    marker: 'HACK ZONE',
    node: 'XK-06 // GREEN NODE',
    status: 'ACCESS VECTOR READY',
    helpAction: 'Ask WISP how to use Green Node',
    helpMarker: 'WISP GUIDE',
    helpStatus: 'TAP TO REOPEN THE TOUR',
  },
} as const

export default function FusionGlobalWisp() {
  const { account } = useHud()
  const { lang } = useLang()
  const { mood, energy, setMood, setFocusRoute, registerEvent, triggerGreenPortal } = useWisp()
  const [portalOpen, setPortalOpen] = useState(false)
  const [portalPoint, setPortalPoint] = useState({ x: '50%', y: '50%' })
  const navigationTimer = useRef<number | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const t = labels[lang]
  const insideGreenNode = location.pathname === '/green-node'
  const actionLabel = insideGreenNode ? t.helpAction : t.action

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
    if (insideGreenNode) {
      registerEvent('portal-hover', 'wisp-green-guide-open', '/green-node')
      window.dispatchEvent(new CustomEvent(WISP_GREEN_GUIDE_EVENT))
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    setPortalPoint({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` })
    setPortalOpen(true)
    triggerGreenPortal()
    registerEvent('green-unlock', 'wisp-hack-zone-open', '/green-node')
    if (navigationTimer.current !== null) window.clearTimeout(navigationTimer.current)
    navigationTimer.current = window.setTimeout(() => navigate('/green-node'), 720)
  }

  const focusWisp = () => registerEvent('portal-hover', 'wisp-hack-zone-focus', location.pathname)
  const moodClass = mood === 'GREEN_MODE' ? 'green-mode' : mood
  const clampedEnergy = Math.max(0, Math.min(100, energy))
  const wispStyle = {
    '--wisp-energy': `${clampedEnergy}%`,
    '--wisp-energy-level': clampedEnergy / 100,
  } as CSSProperties

  return (
    <>
      <div
        className={`xk-wisp-portal ${portalOpen ? 'is-open' : ''}`}
        style={{ '--portal-x': portalPoint.x, '--portal-y': portalPoint.y } as CSSProperties}
        aria-hidden="true"
      />
      <button
        type="button"
        className={`xk-wisp xk-wisp-${moodClass}${location.pathname === '/' ? ' is-home-entry' : ''}${location.pathname === '/green-node' ? ' is-inside-node' : ''}${portalOpen ? ' is-opening' : ''}`}
        style={wispStyle}
        onClick={openPortal}
        onMouseEnter={focusWisp}
        onFocus={focusWisp}
        aria-label={actionLabel}
        aria-pressed={portalOpen}
        title={actionLabel}
      >
        <span className="sr-only">{actionLabel}</span>

        <span className="xk-wisp-home-marker" aria-hidden="true">
          <b>{insideGreenNode ? t.helpMarker : t.marker}</b>
          <small>{t.node}</small>
        </span>

        <span className="xk-wisp-field" aria-hidden="true">
          <span className="xk-wisp-energy-cloud" />
          <span className="xk-wisp-energy-arc xk-wisp-energy-arc-outer" />
          <span className="xk-wisp-energy-arc xk-wisp-energy-arc-inner" />

          <span className="xk-wisp-rune-ring xk-wisp-rune-ring-outer">
            {outerRunes.map((rune, index) => (
              <i key={`${rune}-${index}`} style={{ '--rune-angle': `${index * 45}deg` } as CSSProperties}>{rune}</i>
            ))}
          </span>

          <span className="xk-wisp-rune-ring xk-wisp-rune-ring-inner">
            {innerRunes.map((rune, index) => (
              <i key={`${rune}-${index}`} style={{ '--rune-angle': `${index * 60}deg` } as CSSProperties}>{rune}</i>
            ))}
          </span>

          <span className="xk-wisp-specter-wrap">
            <SafeImage
              src="/assets/identity/wisp-digital-specter-v1.webp"
              fallback="/images/articles/tech.svg"
              className="xk-wisp-specter"
              alt=""
              loading="eager"
              fetchPriority={location.pathname === '/' ? 'high' : 'low'}
            />
            <span className="xk-wisp-scanline" />
            <span className="xk-wisp-glitch-slice" />
          </span>

          <span className="xk-wisp-particles">
            {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
          </span>
        </span>

        <span className="xk-wisp-terminal" aria-hidden="true">
          <b>{insideGreenNode ? t.helpMarker : t.marker}</b>
          <span>{t.node}</span>
          <i>{insideGreenNode ? t.helpStatus : t.status}</i>
        </span>
      </button>
    </>
  )
}
