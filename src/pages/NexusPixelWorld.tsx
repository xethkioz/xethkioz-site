import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import { addWispXp, getDisplayName } from '../lib/realtimeCommunity'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'
import './NexusPixelWorld.css'

type Direction = 'up' | 'down' | 'left' | 'right'
type TileKind = 'grass' | 'path' | 'plaza' | 'water' | 'tree' | 'roof' | 'wall' | 'floor'
type PortalTarget = 'gaming' | 'science' | 'fun' | 'home'

type PixelPeer = {
  key: string
  name: string
  x: number
  y: number
  direction: Direction
  skin: string
  outfit: string
  bubble: string
}

type WorldObject = {
  id: string
  x: number
  y: number
  glyph: string
  target?: PortalTarget
  label: { es: string; en: string }
  detail: { es: string; en: string }
  blocking?: boolean
  className: string
}

const WORLD_WIDTH = 28
const WORLD_HEIGHT = 20
const TILE_SIZE = 40
const START = { x: 13, y: 12 }
const WORLD_CHANNEL = 'xethkioz:nexus-pixel-plaza:v1'
const AVATAR_STORAGE_KEY = 'xethkioz.nexus-city.avatar.v1'

const outfitColors: Record<string, string> = {
  'outfit-nexus-runner': '#8b5cf6',
  'outfit-cyber-ronin': '#22d3ee',
  'outfit-void-cultist': '#32ff8a',
}

const portals: Record<PortalTarget, string> = {
  gaming: '/gaming',
  science: '/science',
  fun: '/fun',
  home: '/',
}

const objects: WorldObject[] = [
  {
    id: 'portal-core', x: 13, y: 8, glyph: '◉', target: 'home', blocking: true, className: 'is-core',
    label: { es: 'Portal central', en: 'Central portal' },
    detail: { es: 'Volver a la Red de Portales', en: 'Return to the Portal Network' },
  },
  {
    id: 'gaming-gate', x: 22, y: 7, glyph: '⚔', target: 'gaming', className: 'is-gaming',
    label: { es: 'Distrito Gaming', en: 'Gaming District' },
    detail: { es: 'Entrar al mundo Gaming', en: 'Enter the Gaming world' },
  },
  {
    id: 'science-gate', x: 6, y: 12, glyph: '⚛', target: 'science', className: 'is-science',
    label: { es: 'Laboratorio Futuro', en: 'Future Laboratory' },
    detail: { es: 'Entrar a Ciencia y Tecnología', en: 'Enter Science and Technology' },
  },
  {
    id: 'fun-gate', x: 21, y: 12, glyph: '爆', target: 'fun', className: 'is-fun',
    label: { es: 'Callejón del Caos', en: 'Chaos Alley' },
    detail: { es: 'Entrar al mundo de Memes', en: 'Enter the Meme world' },
  },
  {
    id: 'plaza-sign', x: 11, y: 11, glyph: '!', blocking: true, className: 'is-sign',
    label: { es: 'Cartel de la Plaza', en: 'Plaza sign' },
    detail: { es: 'WASD, flechas o controles táctiles', en: 'WASD, arrows or touch controls' },
  },
  {
    id: 'fountain', x: 15, y: 12, glyph: '✦', blocking: true, className: 'is-fountain',
    label: { es: 'Fuente Wisp', en: 'Wisp Fountain' },
    detail: { es: 'La energía del Nexus fluye por acá', en: 'Nexus energy flows through here' },
  },
]

const copy = {
  es: {
    title: 'Plaza Nexus · Mundo pixel social',
    description: 'Explorá una plaza social 2D de XETHKIOZ con movimiento por casillas, portales, chat y presencia multijugador.',
    eyebrow: 'NEXUS CITY // PROTOTIPO PIXEL 01',
    heading: 'Plaza Nexus',
    intro: 'Exploración cenital, movimiento por casillas y comunidad en tiempo real. Inspiración retro, identidad visual completamente XETHKIOZ.',
    back: 'Volver a Nexus City',
    online: 'exploradores conectados',
    offline: 'modo local',
    controls: 'Moverse',
    interact: 'Interactuar',
    action: 'Entrar',
    chatLabel: 'Mensaje para la plaza',
    chatPlaceholder: 'Decí algo…',
    send: 'Enviar',
    localChat: 'La presencia online está temporalmente en modo local.',
    collision: 'Ese camino está bloqueado.',
    welcome: 'Llegaste a Plaza Nexus.',
    mapLabel: 'Mapa cenital interactivo de Plaza Nexus',
    mobileControls: 'Controles de movimiento táctiles',
  },
  en: {
    title: 'Nexus Plaza · Social pixel world',
    description: 'Explore a 2D XETHKIOZ social plaza with grid movement, portals, chat and multiplayer presence.',
    eyebrow: 'NEXUS CITY // PIXEL PROTOTYPE 01',
    heading: 'Nexus Plaza',
    intro: 'Top-down exploration, grid movement and real-time community. Retro inspiration with a completely original XETHKIOZ identity.',
    back: 'Back to Nexus City',
    online: 'explorers online',
    offline: 'local mode',
    controls: 'Move',
    interact: 'Interact',
    action: 'Enter',
    chatLabel: 'Message for the plaza',
    chatPlaceholder: 'Say something…',
    send: 'Send',
    localChat: 'Online presence is temporarily running in local mode.',
    collision: 'That path is blocked.',
    welcome: 'You reached Nexus Plaza.',
    mapLabel: 'Interactive top-down map of Nexus Plaza',
    mobileControls: 'Touch movement controls',
  },
} as const

function getClientKey() {
  const key = 'xethkioz.nexus-pixel-client.v1'
  try {
    const saved = window.sessionStorage.getItem(key)
    if (saved) return saved
    const next = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `pixel-${Date.now()}-${Math.random().toString(16).slice(2)}`
    window.sessionStorage.setItem(key, next)
    return next
  } catch {
    return `pixel-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

function readAvatar() {
  try {
    const state = JSON.parse(window.localStorage.getItem(AVATAR_STORAGE_KEY) || '{}') as Record<string, unknown>
    return {
      skin: String(state.skin || '#c98f68'),
      outfit: outfitColors[String(state.outfit)] || '#8b5cf6',
    }
  } catch {
    return { skin: '#c98f68', outfit: '#8b5cf6' }
  }
}

function tileKindAt(x: number, y: number): TileKind {
  if (x === 0 || y === 0 || x === WORLD_WIDTH - 1 || y === WORLD_HEIGHT - 1) return 'tree'

  if (x >= 2 && x <= 6 && y >= 2 && y <= 6) return 'water'
  if (x >= 18 && x <= 25 && y >= 2 && y <= 6) return y === 6 && x === 22 ? 'floor' : (y === 2 ? 'roof' : 'wall')
  if (x >= 3 && x <= 9 && y >= 13 && y <= 18) return y === 13 && x === 6 ? 'floor' : (y === 18 ? 'roof' : 'wall')
  if (x >= 18 && x <= 24 && y >= 13 && y <= 18) return y === 13 && x === 21 ? 'floor' : (y === 18 ? 'roof' : 'wall')

  if (x >= 10 && x <= 17 && y >= 6 && y <= 14) return 'plaza'
  if (x >= 12 && x <= 14) return 'path'
  if (y >= 8 && y <= 10) return 'path'
  if (x >= 6 && x <= 12 && y >= 11 && y <= 13) return 'path'
  if (x >= 14 && x <= 22 && y >= 11 && y <= 15) return 'path'
  return 'grass'
}

function isBlocked(x: number, y: number) {
  const tile = tileKindAt(x, y)
  if (['water', 'tree', 'roof', 'wall'].includes(tile)) return true
  return objects.some((item) => item.x === x && item.y === y && item.blocking)
}

function parsePeer(value: unknown): PixelPeer | null {
  if (!value || typeof value !== 'object') return null
  const peer = value as Record<string, unknown>
  const key = String(peer.key || '')
  const direction = String(peer.direction || 'down')
  if (!key) return null
  return {
    key,
    name: String(peer.name || 'Explorer').slice(0, 28),
    x: Math.max(1, Math.min(WORLD_WIDTH - 2, Number(peer.x) || START.x)),
    y: Math.max(1, Math.min(WORLD_HEIGHT - 2, Number(peer.y) || START.y)),
    direction: direction === 'up' || direction === 'left' || direction === 'right' ? direction : 'down',
    skin: String(peer.skin || '#c98f68'),
    outfit: String(peer.outfit || '#8b5cf6'),
    bubble: String(peer.bubble || '').slice(0, 120),
  }
}

export default function NexusPixelWorld() {
  const { lang } = useLang()
  const t = copy[lang]
  const { account } = useHud()
  const navigate = useNavigate()
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const bubbleTimerRef = useRef<number | null>(null)
  const [clientKey] = useState(getClientKey)
  const [avatar] = useState(readAvatar)
  const [position, setPosition] = useState(START)
  const [direction, setDirection] = useState<Direction>('down')
  const [peers, setPeers] = useState<PixelPeer[]>([])
  const [bubble, setBubble] = useState('')
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState<string>(t.welcome)
  const [realtime, setRealtime] = useState(false)

  const displayName = account.status === 'connected' ? account.name : getDisplayName()
  const nearbyObject = useMemo(() => objects.find((item) => Math.abs(item.x - position.x) + Math.abs(item.y - position.y) <= 1), [position])

  const tiles = useMemo(() => Array.from({ length: WORLD_WIDTH * WORLD_HEIGHT }, (_, index) => {
    const x = index % WORLD_WIDTH
    const y = Math.floor(index / WORLD_WIDTH)
    return { x, y, kind: tileKindAt(x, y) }
  }), [])

  const signal = useMemo(() => ({
    key: account.userId || clientKey,
    name: displayName,
    x: position.x,
    y: position.y,
    direction,
    skin: avatar.skin,
    outfit: avatar.outfit,
    bubble,
  }), [account.userId, avatar.outfit, avatar.skin, bubble, clientKey, direction, displayName, position.x, position.y])

  useEffect(() => {
    addWispXp(10, 'visit', '/nexus-city/room/xethkioz')
  }, [])

  useEffect(() => () => {
    if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return
    const channel = supabase.channel(WORLD_CHANNEL, { config: { presence: { key: signal.key } } })
    channelRef.current = channel

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const next = Object.values(state)
          .flat()
          .map(parsePeer)
          .filter((peer): peer is PixelPeer => Boolean(peer && peer.key !== signal.key))
        setPeers([...new Map(next.map((peer) => [peer.key, peer])).values()].slice(0, 30))
      })
      .on('broadcast', { event: 'world-chat' }, ({ payload }) => {
        const peer = parsePeer(payload)
        if (!peer || peer.key === signal.key) return
        setPeers((current) => [...current.filter((item) => item.key !== peer.key), peer])
      })
      .subscribe(async (status) => {
        const live = status === 'SUBSCRIBED'
        setRealtime(live)
        if (live) await channel.track(signal)
      })

    return () => {
      channelRef.current = null
      setRealtime(false)
      void supabase.removeChannel(channel)
    }
  }, [signal.key])

  useEffect(() => {
    if (!channelRef.current || !realtime) return
    void channelRef.current.track(signal)
  }, [realtime, signal])

  function move(nextDirection: Direction) {
    setDirection(nextDirection)
    const delta = nextDirection === 'left' ? [-1, 0] : nextDirection === 'right' ? [1, 0] : nextDirection === 'up' ? [0, -1] : [0, 1]
    setPosition((current) => {
      const next = { x: current.x + delta[0], y: current.y + delta[1] }
      if (isBlocked(next.x, next.y)) {
        setNotice(t.collision)
        return current
      }
      return next
    })
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName))) return
      const key = event.key.toLowerCase()
      const next = key === 'arrowleft' || key === 'a' ? 'left' : key === 'arrowright' || key === 'd' ? 'right' : key === 'arrowup' || key === 'w' ? 'up' : key === 'arrowdown' || key === 's' ? 'down' : null
      if (!next) return
      event.preventDefault()
      move(next)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [t.collision])

  function interact() {
    if (!nearbyObject) return
    setNotice(`${nearbyObject.label[lang]} · ${nearbyObject.detail[lang]}`)
    if (nearbyObject.target) navigate(portals[nearbyObject.target])
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = message.trim().slice(0, 120)
    if (!next) return
    setBubble(next)
    setMessage('')
    setNotice(next)
    if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current)
    bubbleTimerRef.current = window.setTimeout(() => setBubble(''), 5000)
    if (channelRef.current && realtime) {
      void channelRef.current.send({ type: 'broadcast', event: 'world-chat', payload: { ...signal, bubble: next } })
    }
  }

  const cameraX = position.x * TILE_SIZE + TILE_SIZE / 2
  const cameraY = position.y * TILE_SIZE + TILE_SIZE / 2
  const worldStyle = {
    width: WORLD_WIDTH * TILE_SIZE,
    height: WORLD_HEIGHT * TILE_SIZE,
    transform: `translate3d(calc(50% - ${cameraX}px), calc(50% - ${cameraY}px), 0)`,
  } as CSSProperties

  return (
    <main className="xk-pixel-page">
      <SEO title={t.title} description={t.description} url="/nexus-city/room/xethkioz" />
      <header className="xk-pixel-header">
        <div>
          <Link to="/nexus-city">← {t.back}</Link>
          <p>{t.eyebrow}</p>
          <h1>{t.heading}</h1>
          <span>{t.intro}</span>
        </div>
        <strong className={realtime ? 'is-live' : ''}><i aria-hidden="true" /> {realtime ? `${peers.length + 1} ${t.online}` : t.offline}</strong>
      </header>

      <section className="xk-pixel-game" aria-label={t.mapLabel}>
        <div className="xk-pixel-viewport">
          <div className="xk-pixel-world" style={worldStyle}>
            {tiles.map((tile) => <span key={`${tile.x}-${tile.y}`} className={`xk-pixel-tile is-${tile.kind}`} style={{ left: tile.x * TILE_SIZE, top: tile.y * TILE_SIZE }} aria-hidden="true" />)}

            {objects.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`xk-pixel-object ${item.className}${nearbyObject?.id === item.id ? ' is-nearby' : ''}`}
                style={{ left: item.x * TILE_SIZE, top: item.y * TILE_SIZE }}
                onClick={() => {
                  setPosition({ x: Math.max(1, item.x - 1), y: item.y })
                  setNotice(`${item.label[lang]} · ${item.detail[lang]}`)
                }}
                aria-label={`${item.label[lang]}: ${item.detail[lang]}`}
              >
                <span aria-hidden="true">{item.glyph}</span>
              </button>
            ))}

            {peers.map((peer) => (
              <div key={peer.key} className={`xk-pixel-avatar is-peer is-${peer.direction}`} style={{ left: peer.x * TILE_SIZE, top: peer.y * TILE_SIZE, '--pixel-skin': peer.skin, '--pixel-outfit': peer.outfit } as CSSProperties}>
                {peer.bubble ? <p>{peer.bubble}</p> : null}
                <i aria-hidden="true" /><b aria-hidden="true" /><em aria-hidden="true" /><small>{peer.name}</small>
              </div>
            ))}

            <div className={`xk-pixel-avatar is-player is-${direction}`} style={{ left: position.x * TILE_SIZE, top: position.y * TILE_SIZE, '--pixel-skin': avatar.skin, '--pixel-outfit': avatar.outfit } as CSSProperties}>
              {bubble ? <p>{bubble}</p> : null}
              <i aria-hidden="true" /><b aria-hidden="true" /><em aria-hidden="true" /><small>{displayName}</small>
            </div>
          </div>
        </div>

        <aside className="xk-pixel-hud">
          <div className="xk-pixel-status" role="status" aria-live="polite">
            <small>{nearbyObject ? nearbyObject.label[lang] : 'NEXUS_SIGNAL'}</small>
            <p>{nearbyObject ? nearbyObject.detail[lang] : notice}</p>
            <span>X {position.x.toString().padStart(2, '0')} · Y {position.y.toString().padStart(2, '0')}</span>
            {nearbyObject ? <button type="button" onClick={interact}>{t.action} →</button> : null}
          </div>

          <form className="xk-pixel-chat" onSubmit={sendMessage}>
            <label htmlFor="pixel-world-chat">{t.chatLabel}</label>
            <div><input id="pixel-world-chat" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={120} placeholder={t.chatPlaceholder} /><button type="submit">{t.send}</button></div>
            {!realtime ? <small>{t.localChat}</small> : null}
          </form>

          <div className="xk-pixel-controls" aria-label={t.mobileControls}>
            <button type="button" aria-label="Up" onClick={() => move('up')}>▲</button>
            <button type="button" aria-label="Left" onClick={() => move('left')}>◀</button>
            <button type="button" aria-label="Down" onClick={() => move('down')}>▼</button>
            <button type="button" aria-label="Right" onClick={() => move('right')}>▶</button>
            <button type="button" className="is-action" onClick={interact} disabled={!nearbyObject}>A</button>
          </div>
        </aside>
      </section>
    </main>
  )
}
