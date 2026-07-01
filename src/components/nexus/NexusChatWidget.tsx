import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useLang } from '../../lib/LangContext'
import { authNexusService } from '../../services/auth/authNexusService'
import type { XethkiozAuthorizedSession } from '../../services/auth/authSchema'
import { isSupabaseConfigured, supabase } from '../../services/supabaseClient'

type NexusMessage = {
  id: string
  room: string
  nickname: string
  text: string
  translatedText?: string
  type: 'user' | 'bot' | 'system'
  createdAt: string
}

type ChatMessageRow = {
  id: string
  room_id: string
  display_name: string
  role: string | null
  body: string
  created_at: string
}

type ChatStatus = 'setup' | 'syncing' | 'online' | 'local' | 'error'

type ChatRoom = {
  id: string
  es: string
  en: string
}

const rooms = [
  { id: 'general', es: 'General', en: 'General' },
  { id: 'gaming', es: 'Gaming', en: 'Gaming' },
  { id: 'ia', es: 'IA', en: 'AI' },
  { id: 'science', es: 'Ciencia', en: 'Science' },
  { id: 'streaming', es: 'Streaming', en: 'Streaming' },
  { id: 'asia', es: 'Asia Gaming', en: 'Asia Gaming' },
  { id: 'green-node', es: 'Green Node', en: 'Green Node' },
  { id: 'fun', es: 'Memes', en: 'Memes' },
] satisfies ChatRoom[]

const LOCAL_STORAGE_MESSAGES = 'xethkioz.nexus.local.messages.v3'

const copy = {
  es: {
    title: 'Nexus Chat',
    nickname: 'Apodo',
    input: 'Mensaje para la comunidad',
    send: 'Enviar',
    open: 'Abrir XETHKIOZ Nexus Chat',
    empty: 'Sala lista. Escribí el primer mensaje.',
    localReady: 'Modo local activo. Para chat compartido hay que activar Supabase Realtime.',
    setup: 'Supabase no está configurado en producción.',
    sendError: 'No se pudo enviar al chat global. Se guardó localmente.',
    reservedName: 'Nombre reservado. Solo el administrador puede usar XETHKIOZ o variantes similares.',
    status: {
      setup: 'SETUP',
      syncing: 'SINCRONIZANDO',
      online: 'ONLINE',
      local: 'LOCAL',
      error: 'ERROR',
    } satisfies Record<ChatStatus, string>,
  },
  en: {
    title: 'Nexus Chat',
    nickname: 'Nickname',
    input: 'Message for the community',
    send: 'Send',
    open: 'Open XETHKIOZ Nexus Chat',
    empty: 'Room ready. Send the first message.',
    localReady: 'Local mode active. Enable Supabase Realtime for shared chat.',
    setup: 'Supabase is not configured in production.',
    sendError: 'Could not send to global chat. Saved locally.',
    reservedName: 'Reserved name. Only the administrator can use XETHKIOZ or similar variants.',
    status: {
      setup: 'SETUP',
      syncing: 'SYNCING',
      online: 'ONLINE',
      local: 'LOCAL',
      error: 'ERROR',
    } satisfies Record<ChatStatus, string>,
  },
} as const

function normalizeIdentity(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()
}

function isReservedXethkiozName(value: string) {
  const normalized = normalizeIdentity(value)
  return normalized.includes('xethkioz') || normalized.includes('xethkios') || normalized.includes('xethkio') || normalized === 'xeth' || normalized.startsWith('xethk')
}

function cleanNickname(value: string) {
  return value.replace(/[^\p{L}\p{N}_\-. ]/gu, '').trim().slice(0, 32) || 'Visitante'
}

function resolveSafeNickname(value: string, session: XethkiozAuthorizedSession | null) {
  const clean = cleanNickname(value)
  const isAdmin = session?.role === 'ADMIN'
  if (isReservedXethkiozName(clean) && !isAdmin) return { nickname: 'Visitante', reserved: true }
  if (isReservedXethkiozName(clean) && isAdmin) return { nickname: 'XETHKIOZ', reserved: false }
  return { nickname: clean, reserved: false }
}

function cleanText(value: string) {
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, 500)
}

function makeId(prefix = 'msg') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function systemMessage(text: string, room = 'general'): NexusMessage {
  return { id: makeId('system'), room, nickname: 'NEXUS', text, type: 'system', createdAt: new Date().toISOString() }
}

function rowToMessage(row: ChatMessageRow): NexusMessage {
  return {
    id: row.id,
    room: row.room_id,
    nickname: row.display_name || 'Visitante',
    text: row.body,
    type: 'user',
    createdAt: row.created_at,
  }
}

function localUserMessage(room: string, nickname: string, text: string): NexusMessage {
  return { id: makeId('local'), room, nickname, text, type: 'user', createdAt: new Date().toISOString() }
}

function readLocalMessages(): NexusMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = window.localStorage.getItem(LOCAL_STORAGE_MESSAGES)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed.slice(-80) : []
  } catch {
    return []
  }
}

function persistLocalMessages(messages: NexusMessage[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOCAL_STORAGE_MESSAGES, JSON.stringify(messages.slice(-80)))
}

function addUniqueMessage(current: NexusMessage[], next: NexusMessage) {
  if (current.some((message) => message.id === next.id)) return current
  return [...current.slice(-79), next]
}

export default function NexusChatWidget() {
  const { lang } = useLang()
  const t = copy[lang]
  const [open, setOpen] = useState(false)
  const [room, setRoom] = useState('general')
  const [nickname, setNickname] = useState(() => (typeof window === 'undefined' ? 'Visitante' : window.localStorage.getItem('xethkioz.nexus.nickname') || 'Visitante'))
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState<ChatStatus>(isSupabaseConfigured ? 'syncing' : 'local')
  const [session, setSession] = useState<XethkiozAuthorizedSession | null>(() => authNexusService.getSnapshot())
  const [reservedWarning, setReservedWarning] = useState<string | null>(null)
  const [messages, setMessages] = useState<NexusMessage[]>(() => {
    const local = readLocalMessages()
    return local.length ? local : [systemMessage(isSupabaseConfigured ? copy.es.empty : copy.es.localReady, 'general')]
  })

  useEffect(() => {
    const stopAuthListener = authNexusService.startAuthStateListener()
    const unsubscribe = authNexusService.onChange(setSession)
    void authNexusService.hydrateCurrentSession().catch(() => undefined)
    return () => {
      unsubscribe()
      stopAuthListener()
    }
  }, [])

  const nicknameResolution = useMemo(() => resolveSafeNickname(nickname, session), [nickname, session])

  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem('xethkioz.nexus.nickname', nicknameResolution.nickname)
  }, [nicknameResolution.nickname])

  useEffect(() => {
    persistLocalMessages(messages)
  }, [messages])

  useEffect(() => {
    if (!open) return undefined

    if (!isSupabaseConfigured) {
      setStatus('local')
      setMessages((current) => addUniqueMessage(current, systemMessage(t.localReady, room)))
      return undefined
    }

    let active = true
    setStatus('syncing')

    async function loadMessages() {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, room_id, display_name, role, body, created_at')
        .eq('room_id', room)
        .order('created_at', { ascending: true })
        .limit(80)

      if (!active) return

      if (error) {
        console.error('[NexusChatWidget] chat load failed', error)
        setStatus('error')
        setMessages((current) => addUniqueMessage(current, systemMessage(t.sendError, room)))
        return
      }

      const hydrated = (data ?? []).map((row) => rowToMessage(row as ChatMessageRow))
      setMessages(hydrated.length ? hydrated : [systemMessage(t.empty, room)])
      setStatus('online')
    }

    void loadMessages()

    const channel = supabase
      .channel(`xethkioz-nexus-chat-${room}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${room}` }, (payload) => {
        const next = rowToMessage(payload.new as ChatMessageRow)
        setMessages((current) => addUniqueMessage(current, next))
      })
      .subscribe((nextStatus) => {
        if (!active) return
        if (nextStatus === 'SUBSCRIBED') setStatus('online')
        if (nextStatus === 'CHANNEL_ERROR' || nextStatus === 'TIMED_OUT' || nextStatus === 'CLOSED') setStatus('error')
      })

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [open, room, t.empty, t.localReady, t.sendError])

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = cleanText(draft)
    if (!text) return

    const safeNickname = nicknameResolution.nickname
    if (nicknameResolution.reserved) {
      setReservedWarning(t.reservedName)
      setNickname('Visitante')
      setMessages((current) => addUniqueMessage(current, systemMessage(t.reservedName, room)))
      return
    }

    setReservedWarning(null)
    setDraft('')

    if (!isSupabaseConfigured) {
      setMessages((current) => addUniqueMessage(current, localUserMessage(room, safeNickname, text)))
      setStatus('local')
      return
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ room_id: room, user_id: session?.userId ?? null, display_name: safeNickname, role: session?.role === 'ADMIN' ? 'member' : 'guest', body: text })
      .select('id, room_id, display_name, role, body, created_at')
      .single()

    if (error || !data) {
      console.error('[NexusChatWidget] chat send failed', error)
      setMessages((current) => addUniqueMessage(addUniqueMessage(current, localUserMessage(room, safeNickname, text)), systemMessage(t.sendError, room)))
      setStatus('error')
      return
    }

    setMessages((current) => addUniqueMessage(current, rowToMessage(data as ChatMessageRow)))
    setStatus('online')
  }

  const visibleMessages = messages.filter((message) => message.room === room || message.type === 'system').slice(-80)

  return (
    <div className="fixed bottom-5 right-5 z-[75] font-mono text-[#F0F0F5]">
      {open && (
        <section className="mb-4 w-[calc(100vw-2.5rem)] max-w-[390px] overflow-hidden rounded-3xl border border-[#8B5CF6]/60 bg-[#0A0A0F]/95 shadow-[0_0_10px_#8B5CF6,0_18px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl" aria-label="XETHKIOZ Nexus Chat">
          <header className="border-b border-[#8B5CF6]/30 bg-gradient-to-r from-[#8B5CF6]/20 via-black/40 to-[#FF6B1A]/15 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#FF6B1A]">XETHKIOZ</p>
                <h2 className="mt-1 text-lg font-black uppercase tracking-[0.18em] text-white">{t.title}</h2>
              </div>
              <span className={`rounded-full border px-2 py-1 text-[10px] uppercase ${status === 'online' ? 'border-[#32FF8A]/40 text-[#32FF8A]' : status === 'error' ? 'border-red-400/40 text-red-200' : 'border-yellow-300/30 text-yellow-200'}`}>{t.status[status]}</span>
            </div>
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
              <input value={nickname} onChange={(event) => { setNickname(event.target.value); setReservedWarning(null) }} className="rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-white outline-none focus:border-[#8B5CF6]" placeholder={t.nickname} />
              <select value={room} onChange={(event) => setRoom(event.target.value)} className="rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-white outline-none focus:border-[#FF6B1A]">
                {rooms.map((item) => <option key={item.id} value={item.id}>{item[lang].toUpperCase()}</option>)}
              </select>
            </div>
            {reservedWarning ? <p className="mt-2 rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-[10px] leading-relaxed text-red-100">{reservedWarning}</p> : null}
          </header>
          <div className="grid gap-3 p-3">
            <div className="max-h-[340px] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/35 p-3">
              {visibleMessages.map((message) => (
                <article key={message.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex justify-between text-[10px] uppercase tracking-[0.16em] text-gray-500"><span className="text-[#F0F0F5]">{message.nickname}</span><span>{new Date(message.createdAt).toLocaleTimeString(lang === 'es' ? 'es-AR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span></div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed">{message.text}</p>
                  {message.translatedText && <p className="mt-2 rounded-xl border border-[#8B5CF6]/20 bg-black/30 px-3 py-2 text-[11px] text-violet-100">TR: {message.translatedText}</p>}
                </article>
              ))}
            </div>
            <form onSubmit={sendMessage} className="grid grid-cols-[1fr_auto] gap-2">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={500} className="rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-xs text-white outline-none placeholder:text-gray-600 focus:border-[#8B5CF6]" placeholder={t.input} />
              <button type="submit" className="rounded-2xl border border-[#FF6B1A]/50 bg-[#FF6B1A]/15 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#FF6B1A]">{t.send}</button>
            </form>
          </div>
        </section>
      )}
      <button type="button" onClick={() => setOpen((current) => !current)} className="ml-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#8B5CF6]/70 bg-[#0A0A0F] text-xl shadow-[0_0_10px_#8B5CF6,0_0_32px_rgba(255,107,26,0.22)] transition hover:scale-105 hover:border-[#FF6B1A] hover:text-[#FF6B1A]" aria-expanded={open} aria-label={t.open}>N</button>
    </div>
  )
}
