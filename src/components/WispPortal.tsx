import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { addWispXp, usePresence } from '../lib/realtimeCommunity'
import { getWispPortalForPath } from '../lib/greenWispCore'

const ACCESS_DELAY_MS = 1350
const SECRET_SEQUENCE = 'greennode'
const SECONDARY_SEQUENCE = 'wisp'
const WISP_CLICK_KEY = 'xethkioz-green-node-wisp-clicks'
const WISP_DISCOVERY_KEY = 'xethkioz-green-node-discovered'

type WispPosition = {
  bottom?: string
  top?: string
  left?: string
  right?: string
}

const routePositions: Record<string, WispPosition> = {
  '/': { bottom: '5.75rem', left: '1rem' },
  '/network': { top: '7.5rem', right: '1rem' },
  '/science': { bottom: '6.5rem', left: '1rem' },
  '/gaming': { bottom: '5.75rem', left: '1rem' },
  '/tech': { bottom: '5.75rem', left: '1rem' },
  '/ai-lab': { bottom: '5.75rem', left: '1rem' },
  '/community': { bottom: '8.2rem', left: '1rem' },
}

function getClicks() {
  const parsed = Number(window.localStorage.getItem(WISP_CLICK_KEY) || '0')
  return Number.isFinite(parsed) ? parsed : 0
}

export default function WispPortal() {
  const [opening, setOpening] = useState(false)
  const [hint, setHint] = useState(false)
  const [discovered, setDiscovered] = useState(false)
  const [sequence, setSequence] = useState('')
  const [clicks, setClicks] = useState(0)
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const insideGreenNode = location.pathname === '/green-node'
  const wispForm = useMemo(() => getWispPortalForPath(location.pathname), [location.pathname])
  const presence = usePresence(location.pathname)

  const position = useMemo(() => routePositions[location.pathname] ?? { bottom: '5.75rem', left: '1rem' }, [location.pathname])
  const signalLabel = discovered ? 'GREEN WISP REMEMBERED' : clicks >= 2 ? 'SIGNAL STABILIZED' : 'XETHKIOZ ETHEREAL SIGNAL'

  useEffect(() => {
    setDiscovered(window.localStorage.getItem(WISP_DISCOVERY_KEY) === 'true')
    setClicks(getClicks())
  }, [])

  useEffect(() => {
    setVisible(false)
    const delay = location.pathname === '/network' ? 350 : 850
    const timer = window.setTimeout(() => setVisible(true), delay)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  useEffect(() => {
    if (!opening) return
    window.localStorage.setItem(WISP_DISCOVERY_KEY, 'true')
    setDiscovered(true)
    const timer = window.setTimeout(() => navigate('/green-node?access=wisp&portal=opened&clearance=visitor'), ACCESS_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [opening, navigate])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (!/^[a-z0-9]$/.test(key)) return
      const next = (sequence + key).slice(-SECRET_SEQUENCE.length)
      setSequence(next)
      if (next === SECRET_SEQUENCE || next.endsWith(SECONDARY_SEQUENCE)) {
        window.localStorage.setItem(WISP_DISCOVERY_KEY, 'true')
        setDiscovered(true)
        addWispXp(42, 'portal')
        setOpening(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sequence])

  const handleOpen = () => {
    const nextClicks = clicks + 1
    setClicks(nextClicks)
    window.localStorage.setItem(WISP_CLICK_KEY, String(nextClicks))
    addWispXp(55 + presence.routeOnline * 3, 'portal')
    setOpening(true)
  }

  if (insideGreenNode || !visible || location.pathname === '/chat-overlay') return null

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        onMouseEnter={() => setHint(true)}
        onMouseLeave={() => setHint(false)}
        onFocus={() => setHint(true)}
        onBlur={() => setHint(false)}
        className="green-wisp group fixed z-[65] h-12 w-12 rounded-full border border-green-300/40 bg-black/70 shadow-[0_0_28px_rgba(0,255,102,0.36)] backdrop-blur-md transition-all hover:scale-110 hover:border-green-200 md:h-16 md:w-16"
        style={position}
        aria-label="Abrir Green Node con Green Wisp"
        title={discovered ? 'GREEN WISP DISCOVERED' : 'ACCESS GREEN NODE'}
      >
        <span className="absolute inset-0 rounded-full bg-green-400/10 blur-xl group-hover:bg-green-300/20" />
        <span className="absolute inset-2 rounded-full border border-green-300/20" />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-300 shadow-[0_0_22px_rgba(0,255,102,1)] md:h-3.5 md:w-3.5" />
        <span className="absolute -right-1 top-2 h-2 w-2 rounded-full bg-green-200/80 blur-[1px] animate-ping" />
        <span className="green-wisp-tail hidden md:block" />
        <span className="green-wisp-tail green-wisp-tail-secondary hidden md:block" />
        <span className="absolute -bottom-6 left-1/2 hidden min-w-[92px] -translate-x-1/2 rounded-full border border-green-300/30 bg-black/90 px-2 py-1 text-center font-mono text-[9px] leading-tight text-green-300 shadow-[0_0_14px_rgba(0,255,102,.24)] md:block">Lv.{presence.wispLevel} {presence.wispName}</span>
        {discovered && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border border-black bg-green-200 shadow-[0_0_12px_rgba(0,255,102,1)]" />}
        <span className="sr-only">Green Node</span>
      </button>

      {hint && !opening && (
        <div className="fixed z-[64] hidden max-w-[285px] rounded-xl border border-green-300/30 bg-black/85 px-4 py-3 font-mono text-[11px] text-green-200 shadow-[0_0_28px_rgba(0,255,102,.18)] md:block" style={{ ...position, transform: 'translate(4.8rem, -0.4rem)' }}>
          <span className="block text-green-400">{signalLabel}</span>
          <span className="mt-1 block text-green-100/80">{wispForm.name} · {wispForm.label}</span>
          <span className="mt-1 block text-green-300/70">{wispForm.message}</span>
          <Link to={wispForm.route} className="mt-2 inline-block text-green-200 underline decoration-green-400/50 underline-offset-4">{wispForm.actionLabel}</Link>
        </div>
      )}

      {opening && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.28),rgba(0,0,0,0.92)_45%,#000_72%)]" />
          <div className="absolute inset-0 green-scanlines" />
          <div className="green-portal-vortex" />
          <div className="green-portal-ring" />
          <div className="green-portal-ring green-portal-ring-delay" />
          <div className="green-portal-runes" />
          <div className="relative z-10 max-w-3xl px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.45em] text-green-300">GREEN WISP EVOLUTION</p>
            <h2 className="mt-4 font-display text-3xl font-black text-green-200 drop-shadow-[0_0_18px_rgba(0,255,102,.9)] md:text-6xl">
              XETHKIOZ // GREEN NODE
            </h2>
            <p className="mt-3 font-mono text-sm text-green-400/80">sudo portal --open --identity=ethereal-xethkioz --wisp=lv{presence.wispLevel}</p>
            <div className="mx-auto mt-5 h-1 max-w-sm overflow-hidden rounded-full bg-green-950">
              <span className="block h-full animate-[portalProgress_1.15s_ease-out_forwards] bg-green-300 shadow-[0_0_18px_rgba(0,255,102,1)]" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
