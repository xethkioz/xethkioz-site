import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const ACCESS_DELAY_MS = 1750
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
  '/': { bottom: '6rem', left: '1.25rem' },
  '/network': { top: '8rem', right: '1.5rem' },
  '/science': { bottom: '7rem', right: '1.25rem' },
  '/gaming': { bottom: '6.5rem', left: '1.25rem' },
  '/tech': { top: '8.5rem', left: '1.25rem' },
  '/community': { bottom: '8.2rem', right: '1.25rem' },
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

  const position = useMemo(() => routePositions[location.pathname] ?? { bottom: '6rem', left: '1.25rem' }, [location.pathname])
  const signalLabel = discovered ? 'GREEN NODE REMEMBERED' : clicks >= 2 ? 'SIGNAL STABILIZED' : 'UNSTABLE GREEN SIGNAL'

  useEffect(() => {
    setDiscovered(window.localStorage.getItem(WISP_DISCOVERY_KEY) === 'true')
    setClicks(getClicks())
  }, [])

  useEffect(() => {
    setVisible(false)
    const delay = location.pathname === '/network' ? 650 : 1250
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
        className="green-wisp group fixed z-[75] h-16 w-16 rounded-full border border-green-300/40 bg-black/70 shadow-[0_0_35px_rgba(0,255,102,0.42)] backdrop-blur-md transition-all hover:scale-110 hover:border-green-200"
        style={position}
        aria-label="Abrir nodo oculto XETHKIOZ Green Node"
        title={discovered ? 'GREEN NODE DISCOVERED' : 'ACCESS GREEN NODE'}
      >
        <span className="absolute inset-0 rounded-full bg-green-400/10 blur-xl group-hover:bg-green-300/20" />
        <span className="absolute inset-2 rounded-full border border-green-300/20" />
        <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-300 shadow-[0_0_22px_rgba(0,255,102,1)]" />
        <span className="absolute -right-1 top-2 h-2 w-2 rounded-full bg-green-200/80 blur-[1px] animate-ping" />
        <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-green-300/80 blur-[1px] animate-pulse" />
        <span className="green-wisp-tail" />
        <span className="green-wisp-tail green-wisp-tail-secondary" />
        <span className="absolute -left-2 bottom-2 h-1.5 w-1.5 rounded-full bg-green-500/80 blur-[1px] animate-pulse" />
        {clicks > 0 && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-green-300/30 bg-black/85 px-2 py-0.5 font-mono text-[9px] text-green-300">{clicks}</span>}
        {discovered && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border border-black bg-green-200 shadow-[0_0_12px_rgba(0,255,102,1)]" />}
        <span className="sr-only">Green Node</span>
      </button>

      {hint && !opening && (
        <div className="fixed z-[74] max-w-[245px] rounded-xl border border-green-300/30 bg-black/85 px-4 py-3 font-mono text-[11px] text-green-200 shadow-[0_0_28px_rgba(0,255,102,.18)]" style={{ ...position, transform: 'translate(4.8rem, -0.4rem)' }}>
          <span className="block text-green-400">{signalLabel}</span>
          {discovered ? 'node remembered · click to reopen' : clicks >= 2 ? 'click to open portal · type greennode' : 'follow the wisp · type greennode or wisp'}
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
            <p className="font-mono text-xs uppercase tracking-[0.45em] text-green-300">ACCESSING HIDDEN NODE</p>
            <h2 className="mt-4 font-display text-3xl md:text-6xl font-black text-green-200 drop-shadow-[0_0_18px_rgba(0,255,102,.9)]">
              XETHKIOZ // GREEN NODE
            </h2>
            <p className="mt-3 font-mono text-sm text-green-400/80">sudo portal --open --clearance=visitor --mode=educational</p>
            <div className="mx-auto mt-5 h-1 max-w-sm overflow-hidden rounded-full bg-green-950">
              <span className="block h-full animate-[portalProgress_1.55s_ease-out_forwards] bg-green-300 shadow-[0_0_18px_rgba(0,255,102,1)]" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
