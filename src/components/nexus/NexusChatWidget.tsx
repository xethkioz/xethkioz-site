import { useEffect, useRef, useState, type FormEvent } from 'react'

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

declare global {
  interface Window { io?: NexusFactory }
}

const CHAT_URL = (import.meta.env.VITE_NEXUS_CHAT_URL as string | undefined)?.replace(/\/$/, '')
const rooms = ['global', 'gaming', 'tech', 'green-zone']

function cleanNickname(value: string) {
  return value.replace(/[^\p{L}\p{N}_\-. ]/gu, '').trim().slice(0, 20) || 'Visitante'
}

function cleanText(value: string) {
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, 420)
}

function systemMessage(text: string, room = 'global'): NexusMessage {
  return { id: `system-${Date.now()}`, room, nickname: 'NEXUS', text, type: 'system', createdAt: new Date().toISOString() }
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
  const [open, setOpen] = useState(false)
  const [room, setRoom] = useState('global')
  const [nickname, setNickname] = useState(() => (typeof window === 'undefined' ? 'Visitante' : window.localStorage.getItem('xethkioz.nexus.nickname') || 'Visitante'))
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState(CHAT_URL ? 'offline' : 'setup')
  const [messages, setMessages] = useState<NexusMessage[]>([systemMessage(CHAT_URL ? 'Canal Nexus preparado.' : 'Falta configurar VITE_NEXUS_CHAT_URL.')])
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
      socket.on('disconnect', () => setStatus('offline'))
      socket.on('connect_error', () => setStatus('error'))
      socket.on('nexus:history', (payload: { messages?: NexusMessage[] }) => setMessages(payload.messages?.length ? payload.messages : [systemMessage('Sala lista.', room)]))
      socket.on('nexus:message', (message: NexusMessage) => setMessages((current) => [...current.slice(-79), message]))
      socket.on('nexus:error', (payload: { message?: string }) => setMessages((current) => [...current.slice(-79), systemMessage(payload.message || 'Error temporal.', room)]))
    }).catch(() => setStatus('error'))
    return () => { cancelled = true; socketRef.current?.disconnect(); socketRef.current = null }
  }, [open, room, nickname])

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = cleanText(draft)
    if (!text) return
    if (!CHAT_URL || !socketRef.current?.connected) {
      setMessages((current) => [...current.slice(-79), systemMessage(CHAT_URL ? 'Servidor Nexus sin conexión.' : 'Configurar VITE_NEXUS_CHAT_URL para activar tiempo real.', room)])
      setDraft('')
      return
    }
    socketRef.current.emit('nexus:message', { room, nickname: cleanNickname(nickname), text })
    setDraft('')
  }

  return (
    <div className="fixed bottom-5 right-5 z-[75] font-mono text-[#F0F0F5]">
      {open && (
        <section className="mb-4 w-[calc(100vw-2.5rem)] max-w-[390px] overflow-hidden rounded-3xl border border-[#8B5CF6]/60 bg-[#0A0A0F]/95 shadow-[0_0_10px_#8B5CF6,0_18px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl" aria-label="XETHKIOZ Nexus Chat">
          <header className="border-b border-[#8B5CF6]/30 bg-gradient-to-r from-[#8B5CF6]/20 via-black/40 to-[#FF6B1A]/15 p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.32em] text-[#FF6B1A]">XETHKIOZ</p><h2 className="mt-1 text-lg font-black uppercase tracking-[0.18em] text-white">Nexus Chat</h2></div><span className="rounded-full border border-[#8B5CF6]/30 px-2 py-1 text-[10px] uppercase text-gray-300">{status}</span></div><div className="mt-4 grid grid-cols-[1fr_auto] gap-2"><input value={nickname} onChange={(event) => setNickname(event.target.value)} className="rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-white outline-none focus:border-[#8B5CF6]" placeholder="Apodo" /><select value={room} onChange={(event) => { setRoom(event.target.value); setMessages([systemMessage(`Sala ${event.target.value}.`, event.target.value)]) }} className="rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-white outline-none focus:border-[#FF6B1A]">{rooms.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}</select></div></header>
          <div className="grid gap-3 p-3"><div className="max-h-[340px] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-black/35 p-3">{messages.map((message) => <article key={message.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"><div className="flex justify-between text-[10px] uppercase tracking-[0.16em] text-gray-500"><span className="text-[#F0F0F5]">{message.nickname}</span><span>{new Date(message.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span></div><p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed">{message.text}</p>{message.translatedText && <p className="mt-2 rounded-xl border border-[#8B5CF6]/20 bg-black/30 px-3 py-2 text-[11px] text-violet-100">TR: {message.translatedText}</p>}</article>)}</div><form onSubmit={sendMessage} className="grid grid-cols-[1fr_auto] gap-2"><input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={420} className="rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-xs text-white outline-none placeholder:text-gray-600 focus:border-[#8B5CF6]" placeholder="Mensaje o comando Nexus" /><button type="submit" className="rounded-2xl border border-[#FF6B1A]/50 bg-[#FF6B1A]/15 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#FF6B1A]">Send</button></form></div>
        </section>
      )}
      <button type="button" onClick={() => setOpen((current) => !current)} className="ml-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#8B5CF6]/70 bg-[#0A0A0F] text-xl shadow-[0_0_10px_#8B5CF6,0_0_32px_rgba(255,107,26,0.22)] transition hover:scale-105 hover:border-[#FF6B1A] hover:text-[#FF6B1A]" aria-expanded={open} aria-label="Abrir XETHKIOZ Nexus Chat">N</button>
    </div>
  )
}
