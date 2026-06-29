import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLang } from '../../lib/LangContext'

type NexusMessage = {
  id: string
  room: string
  nickname: string
  text: string
  translatedText?: string
  type: 'user' | 'bot' | 'system'
  createdAt: string
}

type NexusSocket = {
  connected: boolean
  on: (event: string, callback: (...args: any[]) => void) => NexusSocket
  emit: (event: string, payload?: unknown) => void
  disconnect: () => void
}

type NexusFactory = (url: string, options?: Record<string, unknown>) => NexusSocket

type ChatStatus = 'standby' | 'connecting' | 'online' | 'local' | 'setup'

declare global {
  interface Window { io?: NexusFactory }
}

const DEFAULT_CHAT_URL = 'https://xethkioz-nexus-chat.onrender.com'
const CHAT_URL = ((import.meta.env.VITE_NEXUS_CHAT_URL as string | undefined) || DEFAULT_CHAT_URL).replace(/\/$/, '')
const rooms = ['global', 'gaming', 'tech', 'green-zone']

const copy = {
  es: {
    title: 'Nexus Chat',
    nickname: 'Apodo',
    input: 'Mensaje o comando Nexus',
    send: 'Enviar',
    open: 'Abrir XETHKIOZ Nexus Chat',
    ready: 'Nexus local listo. El tiempo real se activa cuando el servidor responde.',
    setup: 'Falta configurar VITE_NEXUS_CHAT_URL.',
    roomReady: 'Sala lista.',
    roomPrefix: 'Sala',
    temporaryError: 'Señal temporal inestable.',
    localSaved: 'Mensaje guardado en modo local. Realtime pendiente de activación.',
    status: {
      standby: 'NEXUS LOCAL',
      connecting: 'SINCRONIZANDO',
      online: 'ONLINE',
      local: 'MODO LOCAL',
      setup: 'SETUP',
    } satisfies Record<ChatStatus, string>,
  },
  en: {
    title: 'Nexus Chat',
    nickname: 'Nickname',
    input: 'Message or Nexus command',
    send: 'Send',
    open: 'Open XETHKIOZ Nexus Chat',
    ready: 'Local Nexus ready. Realtime activates when the server responds.',
    setup: 'VITE_NEXUS_CHAT_URL is missing.',
    roomReady: 'Room ready.',
    roomPrefix: 'Room',
    temporaryError: 'Temporary unstable signal.',
    localSaved: 'Message saved in local mode. Realtime activation pending.',
    status: {
      standby: 'LOCAL NEXUS',
      connecting: 'SYNCING',
      online: 'ONLINE',
      local: 'LOCAL MODE',
      setup: 'SETUP',
    } satisfies Record<ChatStatus, string>,
  },
} as const

function cleanNickname(value: string) {
  return value.replace(/[^\p{L}\p{N}_\-. ]/gu, '').trim().slice(0, 20) || 'Visitante'
}

function cleanText(value: string) {
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, 420)
}

function systemMessage(text: string, room = 'global'): NexusMessage {
  return { id: `system-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, room, nickname: 'NEXUS', text, type: 'system', createdAt: new Date().toISOString() }
}

function localUserMessage(room: string, nickname: string, text: string): NexusMessage {
  return { id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, room, nickname, text, type: 'user', createdAt: new Date().toISOString() }
}

function loadClient(url: string) {
  return new Promise<NexusFactory>((resolve, reject) => {
    if (window.io) { resolve(window.io); return }
    const script = document.createElement('script')
    script.src = `${url}/socket.io/socket.io.js`
    script.async = true
    script.onload = () => window.io ? resolve(window.io) : reject(new Error('Nexus client unavailable'))
    script.onerror = () => reject(new Error('Nexus client failed'))
    document.head.appendChild(script)
  })
}

export default function NexusChatWidget() {
  const { lang } = useLang()
  const t = copy[lang]
  const [open, setOpen] = useState(false)
  const [room, setRoom] = useState('global')
  const [nickname, setNickname] = useState(() => (typeof window === 'undefined' ? 'Visitante' : window.localStorage.getItem('xethkioz.nexus.nickname') || 'Visitante'))
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState<ChatStatus>(CHAT_URL ? 'standby' : 'setup')
  const [messages, setMessages] = useState<NexusMessage[]>(() => [systemMessage(CHAT_URL ? t.ready : t.setup)])
  const socketRef = useRef<NexusSocket | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem('xethkioz.nexus.nickname', cleanNickname(nickname))
  }, [nickname])

  useEffect(() => {
    if (!open || !CHAT_URL) return
    let cancelled = false
    setStatus('connecting')
    loadClient(CHAT_URL).then((factory) => {
      if (cancelled) return
      const socket = factory(CHAT_URL, { transports: ['websocket', 'polling'], reconnectionAttempts: 5, auth: { room, nickname: cleanNickname(nickname) } })
      socketRef.current = socket
      socket.on('connect', () => { setStatus('online'); socket.emit('nexus:join', { room, nickname: cleanNickname(nickname) }) })
      socket.on('disconnect', () => setStatus('local'))
      socket.on('connect_error', () => setStatus('local'))
      socket.on('nexus:history', (payload: { messages?: NexusMessage[] }) => setMessages(payload.messages?.length ? payload.messages : [systemMessage(t.roomReady, room)]))
      socket.on('nexus:message', (message: NexusMessage) => setMessages((current) => [...current.slice(-79), message]))
      socket.on('nexus:error', (payload: { message?: string }) => setMessages((current) => [...current.slice(-79), systemMessage(payload.message || t.temporaryError, room)]))
    }).catch(() => setStatus('local'))
    return () => { cancelled = true; socketRef.current?.disconnect(); socketRef.current = null }
  }, [open, room, nickname, t.roomReady, t.temporaryError])

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = cleanText(draft)
    if (!text) return

    const safeNickname = cleanNickname(nickname)

    if (!CHAT_URL || !socketRef.current?.connected) {
      setMessages((current) => [
        ...current.slice(-78),
        localUserMessage(room, safeNickname, text),
        systemMessage(CHAT_URL ? t.localSaved : t.setup, room),
      ])
      setStatus(CHAT_URL ? 'local' : 'setup')
      setDraft('')
      return
    }

    socketRef.current.emit('nexus:message', { room, nickname: safeNickname, text })
    setDraft('')
  }

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
              <span className={`rounded-full border px-2 py-1 text-[10px] uppercase ${status === 'online' ? 'border-[#32FF8A]/40 text-[#32FF8A]' : 'border-[#8B5CF6]/30 text-gray-300'}`}>{t.status[status]}</span>
            </div>
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
              <input value={nickname} onChange={(event) => setNickname(event.target.value)} className="rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-white outline-none focus:border-[#8B5CF6]" placeholder={t.nickname} />
              <select value={room} onChange={(event) => { setRoom(event.target.value); setMessages([systemMessage(`${t.roomPrefix} ${event.target.value}.`, event.target.value)]) }} className="rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-white outline-none focus:border-[#FF6B1A]">
                {rooms.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}
              </select>
            </div>
          </header>
          <div className="grid gap-3 p-3">
            <div className="max-h-[340px] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/35 p-3">
              {messages.map((message) => (
                <article key={message.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex justify-between text-[10px] uppercase tracking-[0.16em] text-gray-500"><span className="text-[#F0F0F5]">{message.nickname}</span><span>{new Date(message.createdAt).toLocaleTimeString(lang === 'es' ? 'es-AR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span></div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed">{message.text}</p>
                  {message.translatedText && <p className="mt-2 rounded-xl border border-[#8B5CF6]/20 bg-black/30 px-3 py-2 text-[11px] text-violet-100">TR: {message.translatedText}</p>}
                </article>
              ))}
            </div>
            <form onSubmit={sendMessage} className="grid grid-cols-[1fr_auto] gap-2">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={420} className="rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-xs text-white outline-none placeholder:text-gray-600 focus:border-[#8B5CF6]" placeholder={t.input} />
              <button type="submit" className="rounded-2xl border border-[#FF6B1A]/50 bg-[#FF6B1A]/15 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#FF6B1A]">{t.send}</button>
            </form>
          </div>
        </section>
      )}
      <button type="button" onClick={() => setOpen((current) => !current)} className="ml-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#8B5CF6]/70 bg-[#0A0A0F] text-xl shadow-[0_0_10px_#8B5CF6,0_0_32px_rgba(255,107,26,0.22)] transition hover:scale-105 hover:border-[#FF6B1A] hover:text-[#FF6B1A]" aria-expanded={open} aria-label={t.open}>N</button>
    </div>
  )
}
