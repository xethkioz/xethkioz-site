import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from './supabase'
import type { ChatMessage } from './types'

export type RealtimeStatus = 'local' | 'broadcast' | 'database' | 'realtime'

export type PresenceSnapshot = {
  route: string
  onlineTotal: number
  routeOnline: number
  roomOnline: number
  wispLevel: number
  wispName: string
  energy: number
  realtime: boolean
}

export type WispEvent = {
  id: string
  type: 'visit' | 'chat' | 'portal' | 'daily' | 'mission'
  route: string
  points: number
  created_at: string
}

const CLIENT_ID_KEY = 'xethkioz_client_id'
const DISPLAY_NAME_KEY = 'xethkioz_display_name'
const LOCAL_MESSAGES_KEY = 'xethkioz_realtime_chat_cache_v4'
const PRESENCE_KEY = 'xethkioz_presence_clients_v4'
const WISP_XP_KEY = 'xethkioz_wisp_xp_v2'
const CHAT_BC_CHANNEL = 'xethkioz-community-chat-v4'
const PRESENCE_BC_CHANNEL = 'xethkioz-presence-v4'
const REALTIME_CHAT_PREFIX = 'xethkioz:chat:'
const REALTIME_PRESENCE_CHANNEL = 'xethkioz:presence:global'

const WISP_LEVELS = [
  { min: 0, name: 'Spark' },
  { min: 120, name: 'Echo' },
  { min: 320, name: 'Portal Keeper' },
  { min: 720, name: 'Green Guardian' },
  { min: 1400, name: 'Core Entity' },
  { min: 2600, name: 'Network Spirit' },
]

function canUseBrowserStorage() {
  return typeof window !== 'undefined' && !!window.localStorage
}

function storageGet(key: string) {
  try { return canUseBrowserStorage() ? window.localStorage.getItem(key) : null } catch { return null }
}

function storageSet(key: string, value: string) {
  try { if (canUseBrowserStorage()) window.localStorage.setItem(key, value) } catch {}
}

function safeRandomId(prefix = 'visitor') {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  } catch {}
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getClientId() {
  let id = storageGet(CLIENT_ID_KEY)
  if (!id) {
    id = safeRandomId('visitor')
    storageSet(CLIENT_ID_KEY, id)
  }
  return id
}

export function getDisplayName() {
  let name = storageGet(DISPLAY_NAME_KEY)
  if (!name) {
    name = `Visitante-${Math.floor(1000 + Math.random() * 8999)}`
    storageSet(DISPLAY_NAME_KEY, name)
  }
  return name
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try { return JSON.parse(value) as T } catch { return fallback }
}

function normalizeRole(role: unknown): ChatMessage['role'] {
  if (role === 'host' || role === 'mod' || role === 'member' || role === 'guest') return role
  return 'guest'
}

function normalizeMessage(raw: any): ChatMessage {
  return {
    id: String(raw?.id || `msg-${Date.now()}`),
    room: String(raw?.room || raw?.room_id || 'general'),
    user: String(raw?.user || raw?.display_name || raw?.username || 'Visitante'),
    role: normalizeRole(raw?.role),
    text: String(raw?.text || raw?.body || raw?.message || '').slice(0, 280),
    created_at: String(raw?.created_at || new Date().toISOString()),
  }
}

function uniqueMessages(messages: ChatMessage[]) {
  const map = new Map<string, ChatMessage>()
  for (const message of messages) {
    if (!message.text.trim()) continue
    map.set(message.id, message)
  }
  return [...map.values()]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-220)
}

function readLocalMessages(seed: ChatMessage[]) {
  return uniqueMessages([...seed, ...safeParse<ChatMessage[]>(storageGet(LOCAL_MESSAGES_KEY), [])])
}

function writeLocalMessages(messages: ChatMessage[]) {
  storageSet(LOCAL_MESSAGES_KEY, JSON.stringify(uniqueMessages(messages)))
}

function createBroadcastChannel(name: string) {
  try {
    return typeof window !== 'undefined' && 'BroadcastChannel' in window ? new BroadcastChannel(name) : null
  } catch {
    return null
  }
}

function getWispData() {
  const xp = Number(storageGet(WISP_XP_KEY) || '0') || 0
  const levelIndex = WISP_LEVELS.reduce((level, item, index) => xp >= item.min ? index : level, 0)
  const level = levelIndex + 1
  const next = WISP_LEVELS[levelIndex + 1]?.min ?? WISP_LEVELS[levelIndex].min + 1000
  const currentMin = WISP_LEVELS[levelIndex].min
  const energy = Math.min(100, Math.round(((xp - currentMin) / Math.max(1, next - currentMin)) * 100))
  return { xp, level, name: WISP_LEVELS[levelIndex].name, energy }
}

export function addWispXp(points: number, eventType: WispEvent['type'] = 'visit', route = typeof window !== 'undefined' ? window.location.pathname : '/') {
  const current = Number(storageGet(WISP_XP_KEY) || '0') || 0
  const next = Math.max(0, current + points)
  storageSet(WISP_XP_KEY, String(next))
  const event: WispEvent = { id: safeRandomId('wisp-event'), type: eventType, route, points, created_at: new Date().toISOString() }
  try { window.dispatchEvent(new CustomEvent('xethkioz:wisp-xp', { detail: { xp: next, event } })) } catch {}
  if (isSupabaseConfigured) {
    try {
      supabase.from('xeth_wisp_events').insert({
        id: event.id,
        client_id: getClientId(),
        event_type: event.type,
        route: event.route,
        points: event.points,
      }).then(() => undefined)
    } catch {}
  }
  return getWispData()
}

function readPresenceLocal() {
  const now = Date.now()
  const clients = safeParse<Record<string, { route: string; room?: string; seen: number }>>(storageGet(PRESENCE_KEY), {})
  return Object.fromEntries(Object.entries(clients).filter(([, value]) => now - value.seen < 18000))
}

function writePresenceLocal(route: string, room: string) {
  const id = getClientId()
  const clients = readPresenceLocal()
  clients[id] = { route, room, seen: Date.now() }
  storageSet(PRESENCE_KEY, JSON.stringify(clients))
  return clients
}

function snapshotFromLocal(route: string, room: string): PresenceSnapshot {
  const clients = readPresenceLocal()
  const wisp = getWispData()
  const onlineTotal = Math.max(1, Object.keys(clients).length)
  const routeOnline = Math.max(1, Object.values(clients).filter((client) => client.route === route).length)
  const roomOnline = Math.max(1, Object.values(clients).filter((client) => client.room === room).length)
  return { route, onlineTotal, routeOnline, roomOnline, wispLevel: wisp.level, wispName: wisp.name, energy: wisp.energy, realtime: false }
}

export function useRealtimeChat(seed: ChatMessage[], activeRoom: string) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => (typeof window === 'undefined' ? seed : readLocalMessages(seed)))
  const [status, setStatus] = useState<RealtimeStatus>('local')
  const channelRef = useRef<BroadcastChannel | null>(null)
  const roomRef = useRef(activeRoom)

  useEffect(() => { roomRef.current = activeRoom }, [activeRoom])
  useEffect(() => { writeLocalMessages(messages) }, [messages])

  useEffect(() => {
    const bc = createBroadcastChannel(CHAT_BC_CHANNEL)
    channelRef.current = bc
    if (bc) {
      bc.onmessage = (event) => {
        const message = normalizeMessage(event.data)
        setMessages((current) => uniqueMessages([...current, message]))
        setStatus((current) => current === 'realtime' ? current : 'broadcast')
      }
    }

    const storageHandler = (event: StorageEvent) => {
      if (event.key === LOCAL_MESSAGES_KEY) setMessages(readLocalMessages(seed))
    }
    window.addEventListener('storage', storageHandler)

    return () => {
      try { bc?.close() } catch {}
      window.removeEventListener('storage', storageHandler)
    }
  }, [seed])

  useEffect(() => {
    let ignore = false
    let realtime: ReturnType<typeof supabase.channel> | null = null

    const loadSupabaseHistory = async () => {
      if (!isSupabaseConfigured) return
      try {
        const { data, error } = await supabase
          .from('xeth_chat_messages')
          .select('id, room, user, role, text, created_at')
          .eq('room', activeRoom)
          .order('created_at', { ascending: false })
          .limit(80)
        if (!ignore && !error && data) {
          setMessages((current) => uniqueMessages([...current, ...data.map(normalizeMessage)]))
          setStatus((current) => current === 'realtime' ? current : 'database')
        }
      } catch {}
    }

    loadSupabaseHistory()

    if (isSupabaseConfigured) {
      try {
        realtime = supabase
          .channel(`${REALTIME_CHAT_PREFIX}${activeRoom}`)
          .on('broadcast', { event: 'message' }, (payload) => {
            const message = normalizeMessage(payload.payload)
            setMessages((current) => uniqueMessages([...current, message]))
            setStatus('realtime')
          })
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'xeth_chat_messages', filter: `room=eq.${activeRoom}` }, (payload) => {
            const message = normalizeMessage(payload.new)
            setMessages((current) => uniqueMessages([...current, message]))
            setStatus('realtime')
          })
          .subscribe((state) => {
            if (state === 'SUBSCRIBED') setStatus((current) => current === 'local' ? 'broadcast' : current)
          })
      } catch {
        realtime = null
      }
    }

    return () => {
      ignore = true
      if (realtime) supabase.removeChannel(realtime)
    }
  }, [activeRoom, seed])

  const sendMessage = useCallback(async (text: string) => {
    const clean = text.trim().slice(0, 280)
    if (!clean) return
    const message: ChatMessage = {
      id: safeRandomId('msg'),
      room: roomRef.current,
      user: getDisplayName(),
      role: 'guest',
      text: clean,
      created_at: new Date().toISOString(),
    }

    setMessages((current) => uniqueMessages([...current, message]))
    try { channelRef.current?.postMessage(message) } catch {}

    if (isSupabaseConfigured) {
      try {
        const broadcast = supabase.channel(`${REALTIME_CHAT_PREFIX}${message.room}`)
        await broadcast.send({ type: 'broadcast', event: 'message', payload: message })
        setStatus('realtime')
        supabase.removeChannel(broadcast)
      } catch {
        setStatus((current) => current === 'realtime' ? 'realtime' : 'broadcast')
      }

      try {
        const { error } = await supabase.from('xeth_chat_messages').insert({
          id: message.id,
          room: message.room,
          user: message.user,
          role: message.role,
          text: message.text,
        })
        if (!error) setStatus('realtime')
      } catch {}
    }
  }, [])

  const activeMessages = useMemo(() => messages.filter((m) => m.room === activeRoom).slice(-22), [messages, activeRoom])
  return { messages, activeMessages, sendMessage, status }
}

export function usePresence(route: string, room = 'general'): PresenceSnapshot {
  const [snapshot, setSnapshot] = useState<PresenceSnapshot>(() => {
    if (typeof window === 'undefined') return { route, onlineTotal: 1, routeOnline: 1, roomOnline: 1, wispLevel: 1, wispName: 'Spark', energy: 0, realtime: false }
    writePresenceLocal(route, room)
    return snapshotFromLocal(route, room)
  })

  useEffect(() => {
    const clientId = getClientId()
    const name = getDisplayName()
    const bc = createBroadcastChannel(PRESENCE_BC_CHANNEL)

    const applyLocal = () => {
      writePresenceLocal(route, room)
      setSnapshot(snapshotFromLocal(route, room))
      try { bc?.postMessage({ clientId, route, room, seen: Date.now() }) } catch {}
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === PRESENCE_KEY || event.key === WISP_XP_KEY) applyLocal()
    }
    const onWispXp = () => applyLocal()
    if (bc) bc.onmessage = applyLocal

    applyLocal()
    const timer = window.setInterval(applyLocal, 5000)
    window.addEventListener('storage', onStorage)
    window.addEventListener('xethkioz:wisp-xp', onWispXp as EventListener)

    let realtime: ReturnType<typeof supabase.channel> | null = null
    if (isSupabaseConfigured) {
      try {
        realtime = supabase.channel(REALTIME_PRESENCE_CHANNEL, { config: { presence: { key: clientId } } })
        realtime
          .on('presence', { event: 'sync' }, () => {
            const state = realtime?.presenceState() ?? {}
            const entries = Object.values(state).flat() as Array<{ route?: string; room?: string }>
            const wisp = getWispData()
            setSnapshot({
              route,
              onlineTotal: Math.max(1, entries.length),
              routeOnline: Math.max(1, entries.filter((client) => client.route === route).length),
              roomOnline: Math.max(1, entries.filter((client) => client.room === room).length),
              wispLevel: wisp.level,
              wispName: wisp.name,
              energy: wisp.energy,
              realtime: true,
            })
          })
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              await realtime?.track({ route, room, name, online_at: new Date().toISOString() })
            }
          })
      } catch {}

      try {
        supabase.from('xeth_presence_routes').upsert({
          client_id: clientId,
          display_name: name,
          route,
          room,
          last_seen: new Date().toISOString(),
        }).then(() => undefined)
      } catch {}
    }

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('xethkioz:wisp-xp', onWispXp as EventListener)
      try { bc?.close() } catch {}
      if (realtime) supabase.removeChannel(realtime)
    }
  }, [route, room])

  return snapshot
}
