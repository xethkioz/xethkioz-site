import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import { addWispXp, getDisplayName, usePresence } from '../lib/realtimeCommunity'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

type RoomTheme = 'violet' | 'cyan' | 'orange' | 'green'
type RoomEmote = 'wave' | 'dance' | 'glitch'
type RoomObject = keyof typeof furnitureGlyph
type ProfileRow = { user_id: string; handle: string; display_name: string; status_text: string; avatar_state: Record<string, unknown> }
type RoomRow = { owner_id: string; room_state: { theme?: RoomTheme; furniture?: string[] }; access: 'open' | 'contacts' | 'private'; updated_at: string }
type PageState = 'loading' | 'ready' | 'locked' | 'missing'
type LivePeer = { key: string; name: string; x: number; y: number; skin: string; outfit: string; aura: string; emote: RoomEmote | null }
type CapsuleMessage = { id: string; display_name: string; body: string; created_at: string }

const themeColors: Record<RoomTheme, string> = { violet: '#8b5cf6', cyan: '#22d3ee', orange: '#f97316', green: '#32ff8a' }
const furnitureGlyph = { arcade: '▣', console: '⌁', plant: '♧', portal: '◉' } as const
const outfitColors: Record<string, string> = { 'outfit-nexus-runner': '#8b5cf6', 'outfit-cyber-ronin': '#22d3ee', 'outfit-void-cultist': '#32ff8a' }
const auraColors: Record<string, string> = { 'aura-neon-pulse': '#f97316', 'aura-green-malware': '#32ff8a' }
const emoteGlyph: Record<RoomEmote, string> = { wave: '✦', dance: '♫', glitch: '▧' }

const copy = {
  es: {
    explorer: 'EXPLORADOR',
    loading: 'NEXUS // NEGOCIANDO ACCESO…',
    missingTitle: 'Cápsula no encontrada',
    missingDescription: 'Esta cápsula de Nexus City no está disponible.',
    missingCode: 'SALA // SEÑAL_NO_ENCONTRADA',
    missingHeading: 'La cápsula no existe.',
    missingText: 'El identificador puede haber cambiado o su pasaporte no es público.',
    lockedDescription: 'Acceso protegido por el propietario.',
    lockedCode: 'SALA // ACCESO_DENEGADO',
    lockedHeading: 'La puerta está cerrada.',
    lockedText: 'Esta cápsula es privada, requiere ser contacto o todavía no fue publicada.',
    backPassport: 'VOLVER AL PASAPORTE',
    capsule: 'Cápsula Nexus',
    officialDescription: 'Entrá al Atrio oficial de Nexus City: una plaza social viva dentro de la Red de Portales XETHKIOZ.',
    capsuleDescription: 'Visitá la cápsula de',
    officialRoute: 'SISTEMA // ATRIO OFICIAL',
    capsuleRoute: 'CÁPSULA',
    access: { open: 'ABIERTA', contacts: 'CONTACTOS', private: 'PRIVADA' } as Record<RoomRow['access'], string>,
    inAtrium: 'EN EL ATRIO',
    inCapsule: 'EN LA CÁPSULA',
    invite: 'INVITAR',
    sharedWorld: 'MUNDO COMPARTIDO',
    personalWorld: 'MUNDO PERSONAL',
    themes: { violet: 'VIOLETA', cyan: 'CIAN', orange: 'NARANJA', green: 'VERDE' } as Record<RoomTheme, string>,
    atriumStatus: 'La plaza central está encendida. Exploradores, señales y mundos convergen acá.',
    floatingSignal: 'Una señal flota dentro del Nexus.',
    stageLabel: 'Cápsula interactiva. Usá flechas o WASD, o tocá el escenario para mover el avatar.',
    stageInstructions: 'TOCÁ EL ESCENARIO · FLECHAS / WASD',
    activate: 'Activar',
    objects: { arcade: 'arcade', console: 'consola Nexus', plant: 'bio-neón', portal: 'mini portal' } as Record<RoomObject, string>,
    objectCopy: {
      arcade: 'Arcade activada: una nueva partida busca jugadores.',
      console: 'Consola enlazada al chat de la cápsula.',
      plant: 'El bio-neón está reaccionando a tu presencia.',
      portal: 'El mini portal está cargando una ruta desconocida.',
    } as Record<RoomObject, string>,
    liveChat: 'CÁPSULA // CHAT EN VIVO',
    silent: 'Canal en silencio. Dejá la primera señal.',
    reply: 'RESPONDER EN EL CHAT',
    you: 'VOS',
    moveUp: 'Mover arriba',
    moveLeft: 'Mover a la izquierda',
    moveDown: 'Mover abajo',
    moveRight: 'Mover a la derecha',
    atriumChat: 'CHAT DEL ATRIO',
    capsuleChat: 'CHAT DE LA CÁPSULA',
    inviteChat: 'INVITAR DESDE EL CHAT',
    editCapsule: 'EDITAR MI CÁPSULA',
    emotes: { wave: 'SALUDAR', dance: 'BAILAR', glitch: 'GLITCH' } as Record<RoomEmote, string>,
    emoteSent: 'transmitido a la cápsula.',
    inviteText: 'Estoy en la cápsula de',
    linkReady: 'Enlace de invitación listo.',
    shareError: 'No se pudo compartir desde este navegador.',
  },
  en: {
    explorer: 'EXPLORER',
    loading: 'NEXUS // NEGOTIATING ACCESS…',
    missingTitle: 'Capsule not found',
    missingDescription: 'This Nexus City capsule is unavailable.',
    missingCode: 'ROOM // SIGNAL_NOT_FOUND',
    missingHeading: 'The capsule does not exist.',
    missingText: 'The handle may have changed or its passport is not public.',
    lockedDescription: 'Access protected by the owner.',
    lockedCode: 'ROOM // ACCESS_DENIED',
    lockedHeading: 'The door is locked.',
    lockedText: 'This capsule is private, requires an accepted contact, or has not been published.',
    backPassport: 'BACK TO PASSPORT',
    capsule: 'Nexus Capsule',
    officialDescription: 'Enter the official Nexus City Atrium: a living social plaza inside the XETHKIOZ Portal Network.',
    capsuleDescription: 'Visit the capsule of',
    officialRoute: 'SYSTEM // OFFICIAL ATRIUM',
    capsuleRoute: 'CAPSULE',
    access: { open: 'OPEN', contacts: 'CONTACTS', private: 'PRIVATE' } as Record<RoomRow['access'], string>,
    inAtrium: 'IN THE ATRIUM',
    inCapsule: 'IN CAPSULE',
    invite: 'INVITE',
    sharedWorld: 'SHARED WORLD',
    personalWorld: 'PERSONAL WORLD',
    themes: { violet: 'VIOLET', cyan: 'CYAN', orange: 'ORANGE', green: 'GREEN' } as Record<RoomTheme, string>,
    atriumStatus: 'The central plaza is online. Explorers, signals and worlds converge here.',
    floatingSignal: 'A signal floats inside the Nexus.',
    stageLabel: 'Interactive capsule. Use arrows or WASD, or tap the stage to move the avatar.',
    stageInstructions: 'TAP THE STAGE · ARROWS / WASD',
    activate: 'Activate',
    objects: { arcade: 'arcade', console: 'Nexus console', plant: 'bio-neon', portal: 'mini portal' } as Record<RoomObject, string>,
    objectCopy: {
      arcade: 'Arcade active: a new game is looking for players.',
      console: 'Console linked to the capsule chat.',
      plant: 'The bio-neon is reacting to your presence.',
      portal: 'The mini portal is charging an unknown route.',
    } as Record<RoomObject, string>,
    liveChat: 'CAPSULE // LIVE CHAT',
    silent: 'Silent channel. Leave the first signal.',
    reply: 'REPLY IN CHAT',
    you: 'YOU',
    moveUp: 'Move up',
    moveLeft: 'Move left',
    moveDown: 'Move down',
    moveRight: 'Move right',
    atriumChat: 'ATRIUM CHAT',
    capsuleChat: 'CAPSULE CHAT',
    inviteChat: 'INVITE FROM CHAT',
    editCapsule: 'EDIT MY CAPSULE',
    emotes: { wave: 'WAVE', dance: 'DANCE', glitch: 'GLITCH' } as Record<RoomEmote, string>,
    emoteSent: 'transmitted to the capsule.',
    inviteText: 'I am inside the capsule of',
    linkReady: 'Invitation link ready.',
    shareError: 'This browser could not share the link.',
  },
} as const

const officialProfile: ProfileRow = { user_id: 'system-xethkioz', handle: 'xethkioz', display_name: 'XETHKIOZ ATRIUM', status_text: '', avatar_state: {} }
const officialRoom: RoomRow = { owner_id: 'system-xethkioz', room_state: { theme: 'green', furniture: ['arcade', 'console', 'plant', 'portal'] }, access: 'open', updated_at: '2026-07-19T00:00:00.000Z' }

function safeHandle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24)
}

function roomClientKey() {
  const storageKey = 'xethkioz.nexus-room-client.v1'
  try {
    const current = window.sessionStorage.getItem(storageKey)
    if (current) return current
    const next = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `room-${Date.now()}-${Math.random().toString(16).slice(2)}`
    window.sessionStorage.setItem(storageKey, next)
    return next
  } catch {
    return `room-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

function livePeer(value: unknown, fallbackName: string): LivePeer | null {
  if (!value || typeof value !== 'object') return null
  const peer = value as Record<string, unknown>
  const key = String(peer.key || '')
  if (!key) return null
  const emote = String(peer.emote || '')
  return {
    key,
    name: String(peer.name || fallbackName).slice(0, 28),
    x: Math.min(92, Math.max(8, Number(peer.x) || 50)),
    y: Math.min(82, Math.max(26, Number(peer.y) || 70)),
    skin: String(peer.skin || '#c98f68'),
    outfit: String(peer.outfit || '#8b5cf6'),
    aura: String(peer.aura || '#f97316'),
    emote: emote === 'wave' || emote === 'dance' || emote === 'glitch' ? emote : null,
  }
}

function capsuleMessage(value: unknown, fallbackName: string): CapsuleMessage | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const id = String(row.id || '')
  const body = String(row.body || '').trim().slice(0, 500)
  if (!id || !body) return null
  return {
    id,
    display_name: String(row.display_name || fallbackName).trim().slice(0, 40) || fallbackName,
    body,
    created_at: String(row.created_at || new Date().toISOString()),
  }
}

export default function NexusRoom() {
  const { handle = '' } = useParams()
  const { lang } = useLang()
  const t = copy[lang]
  const { account } = useHud()
  const roomHandle = safeHandle(handle)
  const isOfficialAtrium = roomHandle === 'xethkioz'
  const presence = usePresence(`/nexus-city/room/${roomHandle}`, `capsule-${roomHandle}`)
  const stageRef = useRef<HTMLDivElement>(null)
  const liveChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const emoteTimerRef = useRef<number | null>(null)
  const objectTimerRef = useRef<number | null>(null)
  const [clientKey] = useState(roomClientKey)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [room, setRoom] = useState<RoomRow | null>(null)
  const [viewerAvatar, setViewerAvatar] = useState<Record<string, unknown>>({ skin: '#c98f68', outfit: 'outfit-nexus-runner', aura: 'aura-neon-pulse' })
  const [livePeers, setLivePeers] = useState<LivePeer[]>([])
  const [capsuleMessages, setCapsuleMessages] = useState<CapsuleMessage[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [position, setPosition] = useState({ x: 50, y: 70 })
  const [activeEmote, setActiveEmote] = useState<RoomEmote | null>(null)
  const [activeObject, setActiveObject] = useState<RoomObject | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => () => {
    if (emoteTimerRef.current) window.clearTimeout(emoteTimerRef.current)
    if (objectTimerRef.current) window.clearTimeout(objectTimerRef.current)
  }, [])

  useEffect(() => {
    if (!account.userId || !isSupabaseConfigured) return
    let active = true
    supabase.from('nexus_avatar_profiles').select('state').eq('user_id', account.userId).maybeSingle().then(({ data }) => {
      if (active && data?.state && typeof data.state === 'object') setViewerAvatar(data.state as Record<string, unknown>)
    })
    return () => { active = false }
  }, [account.userId])

  useEffect(() => {
    if (isOfficialAtrium) {
      setProfile(officialProfile)
      setRoom(officialRoom)
      setPageState('ready')
      addWispXp(5, 'visit', '/nexus-city/room/xethkioz')
      return
    }
    if (!roomHandle || !isSupabaseConfigured) {
      setPageState('missing')
      return
    }
    let active = true
    const load = async () => {
      setPageState('loading')
      let profileResult = await supabase.from('nexus_public_directory').select('user_id,handle,display_name,status_text,avatar_state').eq('handle', roomHandle).maybeSingle()
      if (!profileResult.data && account.userId) profileResult = await supabase.from('nexus_public_profiles').select('user_id,handle,display_name,status_text,avatar_state').eq('handle', roomHandle).eq('user_id', account.userId).maybeSingle()
      if (!active) return
      if (profileResult.error || !profileResult.data) {
        setProfile(null)
        setPageState('missing')
        return
      }
      const nextProfile = profileResult.data as ProfileRow
      setProfile(nextProfile)
      const roomResult = await supabase.from('nexus_rooms').select('owner_id,room_state,access,updated_at').eq('owner_id', nextProfile.user_id).maybeSingle()
      if (!active) return
      if (roomResult.error || !roomResult.data) {
        setRoom(null)
        setPageState('locked')
        return
      }
      setRoom(roomResult.data as RoomRow)
      setPageState('ready')
      addWispXp(5, 'visit', `/nexus-city/room/${roomHandle}`)
    }
    void load()
    return () => { active = false }
  }, [account.userId, isOfficialAtrium, roomHandle])

  useEffect(() => {
    if (pageState !== 'ready') return
    const move = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName))) return
      const key = event.key.toLowerCase()
      if (!['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'w', 'a', 's', 'd'].includes(key)) return
      event.preventDefault()
      setPosition((current) => ({
        x: Math.min(92, Math.max(8, current.x + (key === 'arrowleft' || key === 'a' ? -4 : key === 'arrowright' || key === 'd' ? 4 : 0))),
        y: Math.min(82, Math.max(26, current.y + (key === 'arrowup' || key === 'w' ? -4 : key === 'arrowdown' || key === 's' ? 4 : 0))),
      }))
    }
    window.addEventListener('keydown', move)
    return () => window.removeEventListener('keydown', move)
  }, [pageState])

  const viewerSignal = useMemo(() => ({
    key: account.userId || clientKey,
    name: account.name || getDisplayName(),
    x: position.x,
    y: position.y,
    skin: String(viewerAvatar.skin || '#c98f68'),
    outfit: outfitColors[String(viewerAvatar.outfit)] || '#8b5cf6',
    aura: auraColors[String(viewerAvatar.aura)] || '#f97316',
    emote: activeEmote,
  }), [account.name, account.userId, activeEmote, clientKey, position.x, position.y, viewerAvatar])

  useEffect(() => {
    if (pageState !== 'ready' || !isSupabaseConfigured) return
    const channel = supabase.channel(`xethkioz:capsule-live:${roomHandle}`, { config: { presence: { key: viewerSignal.key } } })
    liveChannelRef.current = channel
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const peers = Object.values(state).flat().map((value) => livePeer(value, t.explorer)).filter((peer): peer is LivePeer => Boolean(peer && peer.key !== viewerSignal.key))
        setLivePeers([...new Map(peers.map((peer) => [peer.key, peer])).values()].slice(0, 20))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') await channel.track(viewerSignal)
      })
    return () => {
      liveChannelRef.current = null
      setLivePeers([])
      void supabase.removeChannel(channel)
    }
  }, [pageState, roomHandle, t.explorer, viewerSignal.key])

  useEffect(() => {
    if (pageState !== 'ready' || !liveChannelRef.current) return
    void liveChannelRef.current.track(viewerSignal)
  }, [pageState, viewerSignal])

  useEffect(() => {
    if (pageState !== 'ready' || !isSupabaseConfigured) return
    let active = true
    const capsuleRoom = `capsule-${roomHandle}`
    setCapsuleMessages([])
    supabase.from('chat_messages')
      .select('id,display_name,body,created_at')
      .eq('room_id', capsuleRoom)
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (!active || !data) return
        setCapsuleMessages(data.map((value) => capsuleMessage(value, t.explorer)).filter((message): message is CapsuleMessage => Boolean(message)).reverse())
      })

    const channel = supabase.channel(`xethkioz:capsule-stage-chat:${roomHandle}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${capsuleRoom}` }, (payload) => {
        const message = capsuleMessage(payload.new, t.explorer)
        if (message) setCapsuleMessages((current) => [...current.filter((item) => item.id !== message.id), message].slice(-4))
      })
      .subscribe()
    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [pageState, roomHandle, t.explorer])

  const roomTheme = room?.room_state?.theme || 'violet'
  const roomObjects = Array.isArray(room?.room_state?.furniture)
    ? room.room_state.furniture.filter((item): item is RoomObject => typeof item === 'string' && item in furnitureGlyph).slice(0, 4)
    : []
  const visualStyle = useMemo(() => ({
    '--room-tone': themeColors[roomTheme],
    '--room-outfit': outfitColors[String(viewerAvatar.outfit)] || '#8b5cf6',
    '--room-skin': String(viewerAvatar.skin || '#c98f68'),
    '--room-aura': auraColors[String(viewerAvatar.aura)] || '#f97316',
  } as CSSProperties), [roomTheme, viewerAvatar])

  const moveToPointer = (event: MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    setPosition({ x: Math.min(92, Math.max(8, ((event.clientX - rect.left) / rect.width) * 100)), y: Math.min(82, Math.max(26, ((event.clientY - rect.top) / rect.height) * 100)) })
  }

  const nudge = (x: number, y: number) => setPosition((current) => ({ x: Math.min(92, Math.max(8, current.x + x)), y: Math.min(82, Math.max(26, current.y + y)) }))

  const performEmote = (emote: RoomEmote) => {
    if (emoteTimerRef.current) window.clearTimeout(emoteTimerRef.current)
    setActiveEmote(emote)
    setNotice(`${t.emotes[emote]} ${t.emoteSent}`)
    emoteTimerRef.current = window.setTimeout(() => setActiveEmote(null), 2800)
  }

  const openCapsuleChat = () => {
    window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: `capsule-${roomHandle}` } }))
  }

  const activateObject = (item: RoomObject, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (objectTimerRef.current) window.clearTimeout(objectTimerRef.current)
    setActiveObject(item)
    setNotice(t.objectCopy[item])
    if (item === 'console') openCapsuleChat()
    objectTimerRef.current = window.setTimeout(() => setActiveObject(null), 3200)
  }

  const shareRoom = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: `${profile?.display_name || 'Nexus'} · Nexus City`, text: lang === 'es' ? 'Entrá a esta cápsula de Nexus City.' : 'Enter this Nexus City capsule.', url })
      else await navigator.clipboard.writeText(url)
      setNotice(t.linkReady)
    } catch {
      setNotice(t.shareError)
    }
  }

  const inviteToChat = () => {
    window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general', draft: `📍 ${t.inviteText} @${roomHandle}: /nexus-city/room/${roomHandle}` } }))
  }

  if (pageState === 'loading') return <main className="xk-room-page" aria-busy="true"><p className="xk-room-loader" role="status" aria-live="polite">{t.loading}</p></main>
  if (pageState === 'missing' || !profile) return <main className="xk-room-page"><SEO title={t.missingTitle} description={t.missingDescription} url={`/nexus-city/room/${roomHandle}`} /><section className="xk-room-denied" aria-labelledby="room-missing-title"><small>{t.missingCode}</small><h1 id="room-missing-title">{t.missingHeading}</h1><p>{t.missingText}</p><Link to="/nexus-city">← NEXUS CITY</Link></section></main>
  if (pageState === 'locked' || !room) return <main className="xk-room-page"><SEO title={`${t.capsule} · ${profile.display_name}`} description={t.lockedDescription} url={`/nexus-city/room/${roomHandle}`} /><section className="xk-room-denied is-locked" aria-labelledby="room-locked-title"><small>{t.lockedCode}</small><h1 id="room-locked-title">{t.lockedHeading}</h1><p>{t.lockedText}</p><div><Link to={`/nexus-city/u/${roomHandle}`}>{t.backPassport}</Link><Link to="/nexus-city">NEXUS CITY</Link></div></section></main>

  const description = isOfficialAtrium ? t.officialDescription : `${t.capsuleDescription} @${profile.handle} en Nexus City.`
  const statusText = isOfficialAtrium ? t.atriumStatus : (profile.status_text || t.floatingSignal)

  return <main className="xk-room-page" style={visualStyle}>
    <SEO title={isOfficialAtrium ? `${profile.display_name} · Nexus City` : `${profile.display_name} · ${t.capsule}`} description={description} url={`/nexus-city/room/${profile.handle}`} tags={['Nexus City', 'XETHKIOZ', 'virtual room', profile.handle]} />
    <section className="xk-living-room" aria-labelledby="living-room-title">
      <header><div><Link to={isOfficialAtrium ? '/nexus-city' : `/nexus-city/u/${profile.handle}`}>← {isOfficialAtrium ? 'NEXUS CITY' : `@${profile.handle}`}</Link><small>{isOfficialAtrium ? t.officialRoute : `${t.capsuleRoute} // ${t.access[room.access]}`}</small></div><div><span className={presence.realtime ? 'is-live' : ''}><span aria-hidden="true">●</span> {Math.max(presence.roomOnline, livePeers.length + 1)} {isOfficialAtrium ? t.inAtrium : t.inCapsule}</span><button type="button" onClick={shareRoom}>{t.invite} ↗</button></div></header>
      <div className="xk-living-room-copy"><small>{isOfficialAtrium ? t.sharedWorld : t.personalWorld} // {t.themes[roomTheme]}</small><h1 id="living-room-title">{profile.display_name}</h1><p>{statusText}</p></div>
      <div ref={stageRef} className={`xk-living-room-stage${activeObject ? ` is-object-${activeObject}` : ''}`} onClick={moveToPointer} role="application" aria-label={t.stageLabel} tabIndex={0}>
        <div className="xk-room-skyline" aria-hidden="true"><i /><i /><i /><i /><i /><span /></div>
        {roomObjects.map((item) => <button type="button" key={item} onClick={(event) => activateObject(item, event)} className={`xk-room-object is-${item}${activeObject === item ? ' is-active' : ''}`} aria-label={`${t.activate} ${t.objects[item]}`}>{furnitureGlyph[item] || '◇'}</button>)}
        <aside className="xk-room-transmission" aria-live="polite"><small>{t.liveChat}</small>{capsuleMessages.length ? capsuleMessages.map((message) => <p key={message.id}><b>@{message.display_name}</b><span>{message.body}</span></p>) : <p className="is-empty"><span>{t.silent}</span></p>}<button type="button" onClick={(event) => { event.stopPropagation(); openCapsuleChat() }}>{t.reply} →</button></aside>
        {livePeers.map((peer) => <div key={peer.key} className={`xk-room-player xk-room-peer${peer.emote ? ` is-emote-${peer.emote}` : ''}`} style={{ left: `${peer.x}%`, top: `${peer.y}%`, '--room-skin': peer.skin, '--room-outfit': peer.outfit, '--room-aura': peer.aura } as CSSProperties}><i aria-hidden="true" /><span aria-hidden="true" /><b aria-hidden="true" /><em aria-hidden="true" /><small>{peer.name}</small>{peer.emote ? <strong aria-hidden="true">{emoteGlyph[peer.emote]}</strong> : null}</div>)}
        <div className={`xk-room-player${activeEmote ? ` is-emote-${activeEmote}` : ''}`} style={{ left: `${position.x}%`, top: `${position.y}%` }}><i aria-hidden="true" /><span aria-hidden="true" /><b aria-hidden="true" /><em aria-hidden="true" /><small>{t.you}</small>{activeEmote ? <strong aria-hidden="true">{emoteGlyph[activeEmote]}</strong> : null}</div>
        <p>{t.stageInstructions}</p>
      </div>
      <div className="xk-room-command"><div><button type="button" aria-label={t.moveUp} onClick={() => nudge(0, -5)}>▲</button><span><button type="button" aria-label={t.moveLeft} onClick={() => nudge(-5, 0)}>◀</button><button type="button" aria-label={t.moveDown} onClick={() => nudge(0, 5)}>▼</button><button type="button" aria-label={t.moveRight} onClick={() => nudge(5, 0)}>▶</button></span></div><div><button type="button" onClick={openCapsuleChat}>{isOfficialAtrium ? t.atriumChat : t.capsuleChat}</button><button type="button" onClick={inviteToChat}>{t.inviteChat}</button>{!isOfficialAtrium && account.userId === profile.user_id ? <Link to="/nexus-city#social-loop">{t.editCapsule}</Link> : null}</div><div className="xk-room-emotes">{(['wave', 'dance', 'glitch'] as RoomEmote[]).map((emote) => <button type="button" key={emote} onClick={() => performEmote(emote)} aria-pressed={activeEmote === emote}><span aria-hidden="true">{emoteGlyph[emote]}</span> {t.emotes[emote]}</button>)}</div>{notice ? <p role="status" aria-live="polite" aria-atomic="true">{notice}</p> : null}</div>
    </section>
  </main>
}
