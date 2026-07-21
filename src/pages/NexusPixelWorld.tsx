import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import NexusBabyDemonWisp from './NexusBabyDemonWisp'
import NexusPixelInventoryLayer from './NexusPixelInventoryLayer'
import {
  areas,
  AVATAR_STORAGE_KEY,
  isBlocked,
  npcsForArea,
  objectsForArea,
  QUEST_STORAGE_KEY,
  readQuestState,
  TILE_SIZE,
  tileKindAt,
  WORLD_CHANNEL,
  type AreaId,
  type Direction,
  type NpcDefinition,
  type NpcId,
  type Point,
  type QuestState,
  type WorldObject,
} from '../game/nexusPixelRpg'
import { describeAutotile, readNexusVisualTheme } from '../game/nexusVisualTheme'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import { addWispXp, getDisplayName } from '../lib/realtimeCommunity'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'
import './NexusPixelWorld.css'
import './NexusPixelRpg.css'

type PixelPeer = {
  key: string
  name: string
  area: AreaId
  x: number
  y: number
  direction: Direction
  skin: string
  outfit: string
  bubble: string
}

type DialogueAction = 'start-quest' | 'complete-quest' | null

type DialogueState = {
  npcId: NpcId
  name: string
  role: string
  text: string
  action: DialogueAction
}

const outfitColors: Record<string, string> = {
  'outfit-nexus-runner': '#8b5cf6',
  'outfit-cyber-ronin': '#22d3ee',
  'outfit-void-cultist': '#32ff8a',
}

const portalRoutes = {
  gaming: '/gaming',
  science: '/science',
  fun: '/fun',
  home: '/',
} as const

const copy = {
  es: {
    title: 'Plaza Nexus · Aventura pixel social',
    description: 'Explorá Nexus City como una aventura 2D con interiores, NPCs, misiones, chat y presencia multijugador.',
    eyebrow: 'NEXUS CITY // AVENTURA PIXEL 02',
    heading: 'Plaza Nexus',
    intro: 'Un mundo social cenital con edificios transitables, personajes, señales y progreso persistente.',
    back: 'Volver a Nexus City',
    online: 'exploradores en esta zona',
    offline: 'modo local',
    action: 'Interactuar',
    enter: 'Entrar',
    activate: 'Activar',
    talk: 'Hablar',
    chatLabel: 'Mensaje para esta zona',
    chatPlaceholder: 'Decí algo…',
    send: 'Enviar',
    localChat: 'La presencia online está temporalmente en modo local.',
    collision: 'Ese camino está bloqueado.',
    welcome: 'Llegaste a Plaza Nexus.',
    mapLabel: 'Mapa cenital interactivo de Nexus City',
    mobileControls: 'Controles de movimiento táctiles',
    area: 'Zona actual',
    quest: {
      eyebrow: 'MISIÓN PRINCIPAL // 01',
      title: 'Reactivar las señales',
      locked: 'Hablá con el Guía Wisp en la Plaza.',
      active: 'Activá las tres balizas de la Plaza.',
      return: 'Las señales están activas. Volvé con el Guía Wisp.',
      complete: 'Misión completada. La Plaza recuperó su energía.',
      beacons: 'Balizas',
      reward: 'Recompensa: 60 XP Wisp',
      startedNotice: 'Misión iniciada: reactivá las tres balizas.',
      needsGuide: 'Primero hablá con el Guía Wisp.',
      beaconActive: 'Baliza reactivada.',
      beaconAlready: 'Esta baliza ya está sincronizada.',
      rewardNotice: 'Misión completada. Recibiste 60 XP Wisp.',
    },
    dialogue: {
      accept: 'Aceptar misión',
      complete: 'Completar misión',
      close: 'Cerrar',
      guideStart: 'Las señales violeta, cian y naranja perdieron sincronía. Activá las tres balizas de la Plaza y volvé conmigo.',
      guideProgress: 'La Plaza sigue inestable. Buscá las balizas marcadas con un cristal brillante.',
      guideReturn: 'Excelente. Las tres frecuencias vuelven a resonar. Cerrá el circuito para estabilizar el Nexus.',
      guideComplete: 'La Plaza está viva otra vez. Este fue tu primer paso como explorador del Nexus.',
    },
  },
  en: {
    title: 'Nexus Plaza · Social pixel adventure',
    description: 'Explore Nexus City as a 2D adventure with interiors, NPCs, quests, chat and multiplayer presence.',
    eyebrow: 'NEXUS CITY // PIXEL ADVENTURE 02',
    heading: 'Nexus Plaza',
    intro: 'A top-down social world with walkable buildings, characters, signals and persistent progress.',
    back: 'Back to Nexus City',
    online: 'explorers in this area',
    offline: 'local mode',
    action: 'Interact',
    enter: 'Enter',
    activate: 'Activate',
    talk: 'Talk',
    chatLabel: 'Message for this area',
    chatPlaceholder: 'Say something…',
    send: 'Send',
    localChat: 'Online presence is temporarily running in local mode.',
    collision: 'That path is blocked.',
    welcome: 'You reached Nexus Plaza.',
    mapLabel: 'Interactive top-down map of Nexus City',
    mobileControls: 'Touch movement controls',
    area: 'Current area',
    quest: {
      eyebrow: 'MAIN QUEST // 01',
      title: 'Reactivate the signals',
      locked: 'Talk to the Wisp Guide in the Plaza.',
      active: 'Activate all three Plaza beacons.',
      return: 'The signals are active. Return to the Wisp Guide.',
      complete: 'Quest complete. The Plaza recovered its energy.',
      beacons: 'Beacons',
      reward: 'Reward: 60 Wisp XP',
      startedNotice: 'Quest started: reactivate all three beacons.',
      needsGuide: 'Talk to the Wisp Guide first.',
      beaconActive: 'Beacon reactivated.',
      beaconAlready: 'This beacon is already synchronized.',
      rewardNotice: 'Quest complete. You received 60 Wisp XP.',
    },
    dialogue: {
      accept: 'Accept quest',
      complete: 'Complete quest',
      close: 'Close',
      guideStart: 'The violet, cyan and orange signals lost synchronization. Activate all three Plaza beacons and return to me.',
      guideProgress: 'The Plaza remains unstable. Look for the beacons marked by a bright crystal.',
      guideReturn: 'Excellent. All three frequencies are resonating again. Close the circuit to stabilize the Nexus.',
      guideComplete: 'The Plaza is alive again. This was your first step as a Nexus explorer.',
    },
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

function parsePeer(value: unknown): PixelPeer | null {
  if (!value || typeof value !== 'object') return null
  const peer = value as Record<string, unknown>
  const key = String(peer.key || '')
  const direction = String(peer.direction || 'down')
  const areaValue = String(peer.area || 'plaza')
  const area: AreaId = areaValue === 'guild' || areaValue === 'lab' || areaValue === 'arcade' ? areaValue : 'plaza'
  const definition = areas[area]
  if (!key) return null
  return {
    key,
    name: String(peer.name || 'Explorer').slice(0, 28),
    area,
    x: Math.max(1, Math.min(definition.width - 2, Number(peer.x) || definition.spawn.x)),
    y: Math.max(1, Math.min(definition.height - 2, Number(peer.y) || definition.spawn.y)),
    direction: direction === 'up' || direction === 'left' || direction === 'right' ? direction : 'down',
    skin: String(peer.skin || '#c98f68'),
    outfit: String(peer.outfit || '#8b5cf6'),
    bubble: String(peer.bubble || '').slice(0, 120),
  }
}

function findSafeAdjacent(area: AreaId, point: Point): Point | null {
  const candidates = [
    { x: point.x - 1, y: point.y },
    { x: point.x + 1, y: point.y },
    { x: point.x, y: point.y + 1 },
    { x: point.x, y: point.y - 1 },
  ]
  return candidates.find((candidate) => !isBlocked(area, candidate.x, candidate.y)) ?? null
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
  const [visualTheme] = useState(readNexusVisualTheme)
  const [area, setArea] = useState<AreaId>('plaza')
  const [position, setPosition] = useState(areas.plaza.spawn)
  const [direction, setDirection] = useState<Direction>('down')
  const [peers, setPeers] = useState<PixelPeer[]>([])
  const [bubble, setBubble] = useState('')
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState<string>(t.welcome)
  const [realtime, setRealtime] = useState(false)
  const [dialogue, setDialogue] = useState<DialogueState | null>(null)
  const [quest, setQuest] = useState<QuestState>(readQuestState)

  const displayName = account.status === 'connected' ? account.name : getDisplayName()
  const areaDefinition = areas[area]
  const areaObjects = useMemo(() => objectsForArea(area), [area])
  const areaNpcs = useMemo(() => npcsForArea(area), [area])
  const nearbyNpc = useMemo(() => areaNpcs.find((npc) => Math.abs(npc.x - position.x) + Math.abs(npc.y - position.y) <= 1), [areaNpcs, position])
  const nearbyObject = useMemo(() => areaObjects.find((item) => Math.abs(item.x - position.x) + Math.abs(item.y - position.y) <= 1), [areaObjects, position])
  const visiblePeers = useMemo(() => peers.filter((peer) => peer.area === area), [area, peers])

  const tiles = useMemo(() => Array.from({ length: areaDefinition.width * areaDefinition.height }, (_, index) => {
    const x = index % areaDefinition.width
    const y = Math.floor(index / areaDefinition.width)
    const kind = tileKindAt(area, x, y)
    return { x, y, kind, visual: describeAutotile(area, x, y, kind) }
  }), [area, areaDefinition.height, areaDefinition.width])

  const signal = useMemo(() => ({
    key: account.userId || clientKey,
    name: displayName,
    area,
    x: position.x,
    y: position.y,
    direction,
    skin: avatar.skin,
    outfit: avatar.outfit,
    bubble,
  }), [account.userId, area, avatar.outfit, avatar.skin, bubble, clientKey, direction, displayName, position.x, position.y])

  useEffect(() => {
    addWispXp(10, 'visit', '/nexus-city/room/xethkioz')
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(quest))
    } catch {
      // Quest progress remains active in memory when browser storage is unavailable.
    }
  }, [quest])

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
        setPeers([...new Map(next.map((peer) => [peer.key, peer])).values()].slice(0, 40))
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
    if (dialogue) return
    setDirection(nextDirection)
    const delta = nextDirection === 'left' ? [-1, 0] : nextDirection === 'right' ? [1, 0] : nextDirection === 'up' ? [0, -1] : [0, 1]
    setPosition((current) => {
      const next = { x: current.x + delta[0], y: current.y + delta[1] }
      if (isBlocked(area, next.x, next.y)) {
        setNotice(t.collision)
        return current
      }
      return next
    })
  }

  function changeArea(nextArea: AreaId, spawn?: Point) {
    const destination = areas[nextArea]
    setArea(nextArea)
    setPosition(spawn ?? destination.spawn)
    setDirection('up')
    setDialogue(null)
    setNotice(`${destination.label[lang]} · ${destination.subtitle[lang]}`)
    try {
      const visitKey = `xethkioz.nexus-pixel.area.${nextArea}`
      if (!window.sessionStorage.getItem(visitKey)) {
        window.sessionStorage.setItem(visitKey, '1')
        addWispXp(2, 'visit', `/nexus-city/room/xethkioz#${nextArea}`)
      }
    } catch {
      // Area transitions remain functional without optional session progression.
    }
  }

  function openNpcDialogue(npc: NpcDefinition) {
    if (npc.id !== 'wisp-guide') {
      setDialogue({ npcId: npc.id, name: npc.name[lang], role: npc.role[lang], text: npc.dialogue[lang], action: null })
      return
    }

    if (!quest.started) {
      setDialogue({ npcId: npc.id, name: npc.name[lang], role: npc.role[lang], text: t.dialogue.guideStart, action: 'start-quest' })
      return
    }

    if (quest.activated.length < 3) {
      setDialogue({ npcId: npc.id, name: npc.name[lang], role: npc.role[lang], text: t.dialogue.guideProgress, action: null })
      return
    }

    if (!quest.completed) {
      setDialogue({ npcId: npc.id, name: npc.name[lang], role: npc.role[lang], text: t.dialogue.guideReturn, action: 'complete-quest' })
      return
    }

    setDialogue({ npcId: npc.id, name: npc.name[lang], role: npc.role[lang], text: t.dialogue.guideComplete, action: null })
  }

  function performDialogueAction() {
    if (!dialogue?.action) {
      setDialogue(null)
      return
    }

    if (dialogue.action === 'start-quest') {
      setQuest((current) => ({ ...current, started: true }))
      setNotice(t.quest.startedNotice)
      addWispXp(5, 'mission', '/nexus-city/room/xethkioz#signal-quest-start')
      setDialogue(null)
      return
    }

    if (dialogue.action === 'complete-quest') {
      if (!quest.rewarded) addWispXp(60, 'mission', '/nexus-city/room/xethkioz#signal-quest-complete')
      setQuest((current) => ({ ...current, completed: true, rewarded: true }))
      setNotice(t.quest.rewardNotice)
      setDialogue(null)
    }
  }

  function activateBeacon(item: WorldObject) {
    if (!item.beaconId) return
    if (!quest.started) {
      setNotice(t.quest.needsGuide)
      return
    }
    if (quest.activated.includes(item.beaconId)) {
      setNotice(t.quest.beaconAlready)
      return
    }
    setQuest((current) => ({ ...current, activated: [...current.activated, item.beaconId!] }))
    setNotice(`${item.label[lang]} · ${t.quest.beaconActive}`)
    addWispXp(5, 'mission', `/nexus-city/room/xethkioz#beacon-${item.beaconId}`)
  }

  function interact() {
    if (dialogue) {
      performDialogueAction()
      return
    }
    if (nearbyNpc) {
      openNpcDialogue(nearbyNpc)
      return
    }
    if (!nearbyObject) return
    if (nearbyObject.beaconId) {
      activateBeacon(nearbyObject)
      return
    }
    setNotice(`${nearbyObject.label[lang]} · ${nearbyObject.detail[lang]}`)
    if (nearbyObject.targetArea) {
      changeArea(nearbyObject.targetArea, nearbyObject.targetSpawn)
      return
    }
    if (nearbyObject.target) navigate(portalRoutes[nearbyObject.target])
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName))) return
      const key = event.key.toLowerCase()
      const next = key === 'arrowleft' || key === 'a' ? 'left' : key === 'arrowright' || key === 'd' ? 'right' : key === 'arrowup' || key === 'w' ? 'up' : key === 'arrowdown' || key === 's' ? 'down' : null
      if (next) {
        event.preventDefault()
        move(next)
        return
      }
      if (key === 'e' || key === 'enter' || key === ' ') {
        event.preventDefault()
        interact()
      }
      if (key === 'escape' && dialogue) setDialogue(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

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

  function focusEntity(point: Point, callback: () => void) {
    const adjacent = findSafeAdjacent(area, point)
    if (adjacent) setPosition(adjacent)
    callback()
  }

  const questStatus = !quest.started
    ? t.quest.locked
    : quest.completed
      ? t.quest.complete
      : quest.activated.length === 3
        ? t.quest.return
        : t.quest.active

  const questProgress = quest.completed ? 100 : quest.started ? Math.round((quest.activated.length / 3) * 80) + 10 : 0
  const wispStage = !quest.started ? 'idle' : quest.completed ? 'complete' : quest.activated.length === 3 ? 'ready' : 'quest'
  const cameraX = position.x * TILE_SIZE + TILE_SIZE / 2
  const cameraY = position.y * TILE_SIZE + TILE_SIZE / 2
  const worldStyle = {
    width: areaDefinition.width * TILE_SIZE,
    height: areaDefinition.height * TILE_SIZE,
    transform: `translate3d(calc(50% - ${cameraX}px), calc(50% - ${cameraY}px), 0)`,
  } as CSSProperties

  const nearbyLabel = nearbyNpc?.name[lang] ?? nearbyObject?.label[lang]
  const nearbyDetail = nearbyNpc?.role[lang] ?? nearbyObject?.detail[lang]
  const nearbyAction = nearbyNpc ? t.talk : nearbyObject?.beaconId ? t.activate : t.enter

  return (
    <main className={`xk-pixel-page is-${visualTheme}`}>
      <SEO title={t.title} description={t.description} url="/nexus-city/room/xethkioz" />
      <header className="xk-pixel-header">
        <div>
          <Link to="/nexus-city">← {t.back}</Link>
          <p>{t.eyebrow}</p>
          <h1>{t.heading}</h1>
          <span>{t.intro}</span>
        </div>
        <strong className={realtime ? 'is-live' : ''}><i aria-hidden="true" /> {realtime ? `${visiblePeers.length + 1} ${t.online}` : t.offline}</strong>
      </header>

      <section className="xk-pixel-game" aria-label={t.mapLabel}>
        <div className="xk-pixel-viewport">
          <div className="xk-pixel-area-badge"><small>{t.area}</small><strong>{areaDefinition.label[lang]}</strong><span>{areaDefinition.subtitle[lang]}</span></div>
          <div className={`xk-pixel-world ${areaDefinition.className}`} style={worldStyle}>
            {tiles.map((tile) => <span key={`${area}-${tile.x}-${tile.y}`} className={`xk-pixel-tile is-${tile.kind} ${visualTheme === 'emeraldcraft-v2' ? tile.visual.classes : ''}`} data-mask={visualTheme === 'emeraldcraft-v2' ? tile.visual.mask : undefined} data-variant={visualTheme === 'emeraldcraft-v2' ? tile.visual.variant : undefined} style={{ left: tile.x * TILE_SIZE, top: tile.y * TILE_SIZE }} aria-hidden="true" />)}
            <NexusPixelInventoryLayer area={area} position={position} lang={lang} questCompleted={quest.completed} onNotice={setNotice} />

            {areaObjects.map((item) => {
              const activeBeacon = item.beaconId && quest.activated.includes(item.beaconId)
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`xk-pixel-object ${item.className}${nearbyObject?.id === item.id ? ' is-nearby' : ''}${activeBeacon ? ' is-activated' : ''}`}
                  style={{ left: item.x * TILE_SIZE, top: item.y * TILE_SIZE }}
                  onClick={() => focusEntity(item, () => setNotice(`${item.label[lang]} · ${item.detail[lang]}`))}
                  aria-label={`${item.label[lang]}: ${item.detail[lang]}`}
                >
                  <span aria-hidden="true">{item.glyph}</span>
                </button>
              )
            })}

            {areaNpcs.map((npc) => (
              <button
                type="button"
                key={npc.id}
                className={`xk-pixel-npc ${npc.className}${nearbyNpc?.id === npc.id ? ' is-nearby' : ''}`}
                style={{ left: npc.x * TILE_SIZE, top: npc.y * TILE_SIZE }}
                onClick={() => focusEntity(npc, () => openNpcDialogue(npc))}
                aria-label={`${npc.name[lang]}: ${npc.role[lang]}`}
              >
                {npc.id === 'wisp-guide' && visualTheme === 'emeraldcraft-v2' ? <NexusBabyDemonWisp nearby={nearbyNpc?.id === npc.id} stage={wispStage} /> : <><i aria-hidden="true" /><b aria-hidden="true">{npc.glyph}</b><em aria-hidden="true" /></>}<small>{npc.name[lang]}</small>
              </button>
            ))}

            {visiblePeers.map((peer) => (
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

          {dialogue ? (
            <section className="xk-pixel-dialogue" role="dialog" aria-modal="true" aria-labelledby="pixel-dialogue-name">
              <div><span aria-hidden="true">{dialogue.npcId === 'wisp-guide' ? '✧' : dialogue.name.slice(0, 1)}</span></div>
              <article><small>{dialogue.role}</small><h2 id="pixel-dialogue-name">{dialogue.name}</h2><p>{dialogue.text}</p></article>
              <button type="button" onClick={performDialogueAction}>{dialogue.action === 'start-quest' ? t.dialogue.accept : dialogue.action === 'complete-quest' ? t.dialogue.complete : t.dialogue.close} →</button>
            </section>
          ) : null}
        </div>

        <aside className="xk-pixel-hud">
          <div className="xk-pixel-status" role="status" aria-live="polite">
            <small>{nearbyLabel ?? 'NEXUS_SIGNAL'}</small>
            <p>{nearbyDetail ?? notice}</p>
            <span>{areaDefinition.label[lang]} · X {position.x.toString().padStart(2, '0')} · Y {position.y.toString().padStart(2, '0')}</span>
            {nearbyLabel ? <button type="button" onClick={interact}>{nearbyAction} →</button> : null}
          </div>

          <section className={`xk-pixel-quest${quest.completed ? ' is-complete' : ''}`} aria-labelledby="pixel-quest-title">
            <small>{t.quest.eyebrow}</small><h2 id="pixel-quest-title">{t.quest.title}</h2><p>{questStatus}</p>
            <div role="progressbar" aria-valuenow={questProgress} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${questProgress}%` }} /></div>
            <span>{t.quest.beacons}: {quest.activated.length}/3</span><strong>{t.quest.reward}</strong>
          </section>

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
            <button type="button" className="is-action" onClick={interact} disabled={!nearbyNpc && !nearbyObject && !dialogue}>A</button>
          </div>
        </aside>
      </section>
    </main>
  )
}
