import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from './supabase'
import type { ChatMessage } from './types'

export type PresenceSnapshot = {
  route: string
  onlineTotal: number
  routeOnline: number
  wispLevel: number
  wispName: string
  energy: number
}

const CLIENT_ID_KEY = 'xethkioz_client_id'
const DISPLAY_NAME_KEY = 'xethkioz_display_name'
const LOCAL_MESSAGES_KEY = 'xethkioz_realtime_chat_cache_v2'
const PRESENCE_KEY = 'xethkioz_presence_clients_v2'
const WISP_XP_KEY = 'xethkioz_wisp_xp_v1'
const CHAT_CHANNEL = 'xethkioz-community-chat-v2'
const PRESENCE_CHANNEL = 'xethkioz-presence-v2'

const WISP_LEVELS = [
  { min: 0, name: 'Spark' },
  { min: 120, name: 'Echo' },
  { min: 320, name: 'Portal Keeper' },
  { min: 720, name: 'Green Guardian' },
  { min: 1400, name: 'Core Entity' },
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
    user: String(raw?.user || raw?.display_name || 'Visitante'),
    role: normalizeRole(raw?.role),
    text: String(raw?.text || raw?.body || '').slice(0, 280),
    created_at: String(raw?.created_at || new Date().toISOString()),
  }
}

function uniqueMessages(messages: ChatMessage[]) {
  const map = new Map<string, ChatMessage>()
  for (const message of messages) {
    if (!message.text.trim()) continue
    map.set(message.id, message)
  }
  return [...map.values()].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).slice(-160)
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

export function useRealtimeChat(seed: ChatMessage[], activeRoom: string) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => (typeof window === 'undefined' ? seed : readLocalMessages(seed)))
  const [status, setStatus] = useState<'local' | 'hybrid' | 'realtime'>('local')
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    writeLocalMessages(messages)
  }, [messages])

  useEffect(() => {
    const bc = createBroadcastChannel(CHAT_CHANNEL)
    channelRef.current = bc
    if (bc) {
      bc.onmessage = (event) => {
        const message = normalizeMessage(event.data)
        setMessages((current) => uniqueMessages([...current, message]))
      }
    }

    const storageHandler = (event: StorageEvent) => {
      if (event.key === LOCAL_MESSAGES_KEY) setMessages(readLocalMessages(seed))
    }
    window.addEventListener('storage', storageHandler)

    let ignore = false
    const loadSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('xeth_chat_messages')
          .select('id, room, user, role, text, created_at')
          .order('created_at', { ascending: false })
          .limit(120)
        if (!ignore && !error && data) {
          setMessages((current) => uniqueMessages([...current, ...data.map(normalizeMessage)]))
          setStatus('hybrid')
        }
      } catch {
        if (!ignore) setStatus('local')
      }
    }
    loadSupabase()

    let realtime: ReturnType<typeof supabase.channel> | null = null
    try {
      realtime = supabase
        .channel('xeth_chat_messages_public')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'xeth_chat_messages' }, (payload) => {
          setStatus('realtime')
          setMessages((current) => uniqueMessages([...current, normalizeMessage(payload.new)]))
        })
        .subscribe((state) => {
          if (state === 'SUBSCRIBED') setStatus((current) => current === 'local' ? 'hybrid' : current)
        })
    } catch {
      realtime = null
      setStatus('local')
    }

    return () => {
      ignore = true
      try { bc?.close() } catch {}
      window.removeEventListener('storage', storageHandler)
      if (realtime) supabase.removeChannel(realtime)
    }
  }, [seed])

  const sendMessage = async (text: string) => {
    const clean = text.trim().slice(0, 280)
    if (!clean) return
    const message: ChatMessage = {
      id: safeRandomId('local'),
      room: activeRoom,
      user: getDisplayName(),
      role: 'guest',
      text: clean,
      created_at: new Date().toISOString(),
    }

    setMessages((current) => uniqueMessages([...current, message]))
    try { channelRef.current?.postMessage(message) } catch {}

    try {
      const { error } = await supabase.from('xeth_chat_messages').insert({
        id: message.id,
        room: message.room,
        user: message.user,
        role: message.role,
        text: message.text,
      })
      if (!error) setStatus('realtime')
    } catch {
      setStatus((current) => current === 'realtime' ? 'hybrid' : 'local')
    }
  }

  const activeMessages = useMemo(() => messages.filter((m) => m.room === activeRoom).slice(-18), [messages, activeRoom])
  return { messages, activeMessages, sendMessage, status }
}

function getWispData() {
  const xp = Number(storageGet(WISP_XP_KEY) || '0') || 0
  const levelIndex = WISP_LEVELS.reduce((level, item, index) => xp >= item.min ? index : level, 0)
  const level = levelIndex + 1
  const next = WISP_LEVELS[levelIndex + 1]?.min ?? WISP_LEVELS[levelIndex].min + 800
  const currentMin = WISP_LEVELS[levelIndex].min
  const energy = Math.min(100, Math.round(((xp - currentMin) / Math.max(1, next - currentMin)) * 100))
  return { xp, level, name: WISP_LEVELS[levelIndex].name, energy }
}

export function addWispXp(points: number) {
  const current = Number(storageGet(WISP_XP_KEY) || '0') || 0
  const next = Math.max(0, current + points)
  storageSet(WISP_XP_KEY, String(next))
  try { window.dispatchEvent(new CustomEvent('xethkioz:wisp-xp', { detail: next })) } catch {}
  return getWispData()
}

function readPresence() {
  const now = Date.now()
  const clients = safeParse<Record<string, { route: string; seen: number }>>(storageGet(PRESENCE_KEY), {})
  return Object.fromEntries(Object.entries(clients).filter(([, value]) => now - value.seen < 18000))
}

function writePresence(route: string) {
  const id = getClientId()
  const clients = readPresence()
  clients[id] = { route, seen: Date.now() }
  storageSet(PRESENCE_KEY, JSON.stringify(clients))
  return clients
}

export function usePresence(route: string): PresenceSnapshot {
  const [snapshot, setSnapshot] = useState<PresenceSnapshot>(() => {
    if (typeof window === 'undefined') return { route, onlineTotal: 1, routeOnline: 1, wispLevel: 1, wispName: 'Spark', energy: 0 }
    const data = getWispData()
    return { route, onlineTotal: 1, routeOnline: 1, wispLevel: data.level, wispName: data.name, energy: data.energy }
  })

  useEffect(() => {
    const clientId = getClientId()
    const bc = createBroadcastChannel(PRESENCE_CHANNEL)

    const update = () => {
      const clients = writePresence(route)
      const wisp = getWispData()
      const onlineTotal = Math.max(1, Object.keys(clients).length)
      const routeOnline = Math.max(1, Object.values(clients).filter((client) => client.route === route).length)
      setSnapshot({ route, onlineTotal, routeOnline, wispLevel: wisp.level, wispName: wisp.name, energy: wisp.energy })
      try { bc?.postMessage({ clientId, route, seen: Date.now() }) } catch {}
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === PRESENCE_KEY || event.key === WISP_XP_KEY) update()
    }
    const onWispXp = () => update()
    if (bc) bc.onmessage = update
    update()
    const timer = window.setInterval(update, 5000)
    window.addEventListener('storage', onStorage)
    window.addEventListener('xethkioz:wisp-xp', onWispXp as EventListener)

    let realtime: ReturnType<typeof supabase.channel> | null = null
    try {
      realtime = supabase.channel(`presence:${route}`, { config: { presence: { key: clientId } } })
      realtime.on('presence', { event: 'sync' }, () => {
        const state = realtime?.presenceState() ?? {}
        const wisp = getWispData()
        setSnapshot((current) => ({ ...current, onlineTotal: Math.max(current.onlineTotal, Object.keys(state).length), routeOnline: Math.max(1, Object.keys(state).length), wispLevel: wisp.level, wispName: wisp.name, energy: wisp.energy }))
      }).subscribe(async (status) => {
        if (status === 'SUBSCRIBED') await realtime?.track({ route, online_at: new Date().toISOString(), name: getDisplayName() })
      })
    } catch {}

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('xethkioz:wisp-xp', onWispXp as EventListener)
      try { bc?.close() } catch {}
      if (realtime) supabase.removeChannel(realtime)
    }
  }, [route])

  return snapshot
}
