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
    action: 'Abrir Green Node con Wisp, Custodio del Green Node',
    marker: 'WISP',
    node: 'WISP // GREEN NODE',
    status: 'TE ESTABA ESPERANDO',
    helpAction: 'Pedir ayuda al WISP para usar Green Node',
    helpMarker: 'GUÍA WISP',
    helpStatus: 'TOCÁ PARA REABRIR EL RECORRIDO',
  },
  en: {
    action: 'Open Green Node with Wisp, Custodian of the Green Node',
    marker: 'WISP',
    node: 'WISP // GREEN NODE',
    status: 'I WAS WAITING FOR YOU',
    helpAction: 'Ask WISP how to use Green Node',
    helpMarker: 'WISP GUIDE',
    helpStatus: 'TAP TO REOPEN THE TOUR',
  },
} as const

export default function FusionGlobalWisp() {
  const { account } = useHud()
  const { lang, localizePath } = useLang()
  const { mood, energy, setMood, setFocusRoute, registerEvent, triggerGreenPortal } = useWisp()
  const [portalOpen, setPortalOpen] = useState(false)
  const [portalPoint, setPortalPoint] = useState({ x: '50%', y: '50%' })
  const navigationTimer = useRef<number | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const t = labels[lang]
  const localizedGreenNode = localizePath('/green-node')
  const normalizedPath = location.pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  const insideGreenNode = normalizedPath === '/green-node'
  const homeEntry = normalizedPath === '/'
  const actionLabel = insideGreenNode ? t.helpAction : t.action

  useEffect(() => {
    const nextMood = normalizedPath === '/green-node'
      ? 'GREEN_MODE'
      : account.status === 'connected'
        ? 'connected'
        : routeMood[normalizedPath] || 'idle'

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
      registerEvent('portal-hover', 'wisp-green-guide-open', localizedGreenNode)
      window.dispatchEvent(new CustomEvent(WISP_GREEN_GUIDE_EVENT))
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    setPortalPoint({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` })
    setPortalOpen(true)
    triggerGreenPortal()
    registerEvent('green-unlock', 'wisp-hack-zone-open', localizedGreenNode)
    if (navigationTimer.current !== null) window.clearTimeout(navigationTimer.current)
    navigationTimer.current = window.setTimeout(() => navigate(localizedGreenNode), 720)
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
        className={`xk-wisp xk-wisp-${moodClass}${homeEntry ? ' is-home-entry' : ''}${insideGreenNode ? ' is-inside-node' : ''}${portalOpen ? ' is-opening' : ''}`}
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
              src="/assets/world-of-xethkioz/veyr/veyr-wisp-poster.webp"
              fallback="/assets/identity/wisp-digital-specter-v1.webp"
              className="xk-wisp-specter xk-wisp-specter-veyr"
              alt=""
              loading={location.pathname === '/' ? 'eager' : 'lazy'}
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
