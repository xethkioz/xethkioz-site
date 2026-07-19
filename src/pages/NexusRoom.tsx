import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import { addWispXp, getDisplayName, usePresence } from '../lib/realtimeCommunity'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

type RoomTheme = 'violet' | 'cyan' | 'orange' | 'green'
type ProfileRow = { user_id: string; handle: string; display_name: string; status_text: string; avatar_state: Record<string, unknown> }
type RoomRow = { owner_id: string; room_state: { theme?: RoomTheme; furniture?: string[] }; access: 'open' | 'contacts' | 'private'; updated_at: string }
type PageState = 'loading' | 'ready' | 'locked' | 'missing'
type LivePeer = { key: string; name: string; x: number; y: number; skin: string; outfit: string; aura: string }

const themeColors: Record<RoomTheme, string> = { violet: '#8b5cf6', cyan: '#22d3ee', orange: '#f97316', green: '#32ff8a' }
const furnitureGlyph: Record<string, string> = { arcade: '▣', console: '⌁', plant: '♧', portal: '◉' }
const outfitColors: Record<string, string> = { 'outfit-nexus-runner': '#8b5cf6', 'outfit-cyber-ronin': '#22d3ee', 'outfit-void-cultist': '#32ff8a' }
const auraColors: Record<string, string> = { 'aura-neon-pulse': '#f97316', 'aura-green-malware': '#32ff8a' }

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

function livePeer(value: unknown): LivePeer | null {
  if (!value || typeof value !== 'object') return null
  const peer = value as Record<string, unknown>
  const key = String(peer.key || '')
  if (!key) return null
  return {
    key,
    name: String(peer.name || 'EXPLORER').slice(0, 28),
    x: Math.min(92, Math.max(8, Number(peer.x) || 50)),
    y: Math.min(82, Math.max(26, Number(peer.y) || 70)),
    skin: String(peer.skin || '#c98f68'),
    outfit: String(peer.outfit || '#8b5cf6'),
    aura: String(peer.aura || '#f97316'),
  }
}

export default function NexusRoom() {
  const { handle = '' } = useParams()
  const { lang } = useLang()
  const { account } = useHud()
  const roomHandle = safeHandle(handle)
  const presence = usePresence(`/nexus-city/room/${roomHandle}`, `capsule-${roomHandle}`)
  const stageRef = useRef<HTMLDivElement>(null)
  const liveChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const [clientKey] = useState(roomClientKey)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [room, setRoom] = useState<RoomRow | null>(null)
  const [viewerAvatar, setViewerAvatar] = useState<Record<string, unknown>>({ skin: '#c98f68', outfit: 'outfit-nexus-runner', aura: 'aura-neon-pulse' })
  const [livePeers, setLivePeers] = useState<LivePeer[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [position, setPosition] = useState({ x: 50, y: 70 })
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!account.userId || !isSupabaseConfigured) return
    let active = true
    supabase.from('nexus_avatar_profiles').select('state').eq('user_id', account.userId).maybeSingle().then(({ data }) => {
      if (active && data?.state && typeof data.state === 'object') setViewerAvatar(data.state as Record<string, unknown>)
    })
    return () => { active = false }
  }, [account.userId])

  useEffect(() => {
    if (!roomHandle || !isSupabaseConfigured) {
      setPageState('missing')
      return
    }
    let active = true
    const load = async () => {
      setPageState('loading')
      let profileResult = await supabase.from('nexus_public_directory').select('user_id,handle,display_name,status_text,avatar_state').eq('handle', roomHandle).maybeSingle()
      if (!profileResult.data && account.userId) {
        profileResult = await supabase.from('nexus_public_profiles').select('user_id,handle,display_name,status_text,avatar_state').eq('handle', roomHandle).eq('user_id', account.userId).maybeSingle()
      }
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
  }, [account.userId, roomHandle])

  useEffect(() => {
    if (pageState !== 'ready') return
    const move = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (!['arrowleft','arrowright','arrowup','arrowdown','w','a','s','d'].includes(key)) return
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
  }), [account.name, account.userId, clientKey, position.x, position.y, viewerAvatar])

  useEffect(() => {
    if (pageState !== 'ready' || !isSupabaseConfigured) return
    const channel = supabase.channel(`xethkioz:capsule-live:${roomHandle}`, { config: { presence: { key: viewerSignal.key } } })
    liveChannelRef.current = channel
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const peers = Object.values(state).flat().map(livePeer).filter((peer): peer is LivePeer => Boolean(peer && peer.key !== viewerSignal.key))
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
  }, [pageState, roomHandle, viewerSignal.key])

  useEffect(() => {
    if (pageState !== 'ready' || !liveChannelRef.current) return
    void liveChannelRef.current.track(viewerSignal)
  }, [pageState, viewerSignal])

  const roomTheme = room?.room_state?.theme || 'violet'
  const roomObjects = Array.isArray(room?.room_state?.furniture) ? room.room_state.furniture : []
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

  const shareRoom = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: `${profile?.display_name || 'Nexus'} · Nexus City`, text: lang === 'es' ? 'Entrá a esta cápsula de Nexus City.' : 'Enter this Nexus City capsule.', url })
      else await navigator.clipboard.writeText(url)
      setNotice(lang === 'es' ? 'Enlace de invitación listo.' : 'Invitation link ready.')
    } catch {
      setNotice(lang === 'es' ? 'No se pudo compartir desde este navegador.' : 'This browser could not share the link.')
    }
  }

  const inviteToChat = () => {
    window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general', draft: `📍 ${lang === 'es' ? 'Estoy en la cápsula de' : 'I am inside'} @${roomHandle}: /nexus-city/room/${roomHandle}` } }))
  }

  if (pageState === 'loading') return <main className="xk-room-page"><p className="xk-room-loader">NEXUS // NEGOTIATING ACCESS…</p></main>
  if (pageState === 'missing' || !profile) return <main className="xk-room-page"><SEO title="Cápsula no encontrada" description="Esta cápsula de Nexus City no está disponible." url={`/nexus-city/room/${roomHandle}`} /><section className="xk-room-denied"><small>ROOM // SIGNAL_NOT_FOUND</small><h1>{lang === 'es' ? 'La cápsula no existe.' : 'The capsule does not exist.'}</h1><p>{lang === 'es' ? 'El identificador puede haber cambiado o su pasaporte no es público.' : 'The handle may have changed or its passport is not public.'}</p><Link to="/nexus-city">← NEXUS CITY</Link></section></main>
  if (pageState === 'locked' || !room) return <main className="xk-room-page"><SEO title={`Cápsula de ${profile.display_name}`} description="Acceso protegido por el propietario." url={`/nexus-city/room/${roomHandle}`} /><section className="xk-room-denied is-locked"><small>ROOM // ACCESS_DENIED</small><h1>{lang === 'es' ? 'La puerta está cerrada.' : 'The door is locked.'}</h1><p>{lang === 'es' ? 'Esta cápsula es privada, requiere ser contacto o todavía no fue publicada.' : 'This capsule is private, requires an accepted contact, or has not been published.'}</p><div><Link to={`/nexus-city/u/${roomHandle}`}>{lang === 'es' ? 'VOLVER AL PASAPORTE' : 'BACK TO PASSPORT'}</Link><Link to="/nexus-city">NEXUS CITY</Link></div></section></main>

  return <main className="xk-room-page" style={visualStyle}>
    <SEO title={`${profile.display_name} · Cápsula Nexus`} description={`Visitá la cápsula de @${profile.handle} en Nexus City.`} url={`/nexus-city/room/${profile.handle}`} tags={['Nexus City','XETHKIOZ','virtual room',profile.handle]} />
    <section className="xk-living-room">
      <header><div><Link to={`/nexus-city/u/${profile.handle}`}>← @{profile.handle}</Link><small>CAPSULE // {room.access.toUpperCase()}</small></div><div><span className={presence.realtime ? 'is-live' : ''}>● {Math.max(presence.roomOnline, livePeers.length + 1)} {lang === 'es' ? 'EN LA CÁPSULA' : 'IN CAPSULE'}</span><button type="button" onClick={shareRoom}>{lang === 'es' ? 'INVITAR ↗' : 'INVITE ↗'}</button></div></header>
      <div className="xk-living-room-copy"><small>PERSONAL UNIVERSE // {roomTheme.toUpperCase()}</small><h1>{profile.display_name}</h1><p>{profile.status_text || (lang === 'es' ? 'Una señal flota dentro del Nexus.' : 'A signal floats inside the Nexus.')}</p></div>
      <div ref={stageRef} className="xk-living-room-stage" onClick={moveToPointer} role="application" aria-label={lang === 'es' ? 'Cápsula interactiva. Usá flechas o tocá el escenario para mover el avatar.' : 'Interactive capsule. Use arrows or tap the stage to move the avatar.'} tabIndex={0}>
        <div className="xk-room-skyline" aria-hidden="true"><i /><i /><i /><i /><i /><span /></div>
        {roomObjects.map((item) => <i key={item} className={`xk-room-object is-${item}`}>{furnitureGlyph[item] || '◇'}</i>)}
        {livePeers.map((peer) => <div key={peer.key} className="xk-room-player xk-room-peer" style={{ left: `${peer.x}%`, top: `${peer.y}%`, '--room-skin': peer.skin, '--room-outfit': peer.outfit, '--room-aura': peer.aura } as CSSProperties}><i /><span /><b /><em /><small>{peer.name}</small></div>)}
        <div className="xk-room-player" style={{ left: `${position.x}%`, top: `${position.y}%` }}><i /><span /><b /><em /><small>YOU</small></div>
        <p>{lang === 'es' ? 'TOCÁ EL ESCENARIO · FLECHAS / WASD' : 'TAP THE STAGE · ARROWS / WASD'}</p>
      </div>
      <div className="xk-room-command"><div><button type="button" onClick={() => nudge(0,-5)}>▲</button><span><button type="button" onClick={() => nudge(-5,0)}>◀</button><button type="button" onClick={() => nudge(0,5)}>▼</button><button type="button" onClick={() => nudge(5,0)}>▶</button></span></div><div><button type="button" onClick={inviteToChat}>{lang === 'es' ? 'INVITAR DESDE EL CHAT' : 'INVITE FROM CHAT'}</button>{account.userId === profile.user_id ? <Link to="/nexus-city#social-loop">{lang === 'es' ? 'EDITAR MI CÁPSULA' : 'EDIT MY CAPSULE'}</Link> : null}</div>{notice ? <p role="status">{notice}</p> : null}</div>
    </section>
  </main>
}
