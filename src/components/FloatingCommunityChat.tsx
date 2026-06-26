import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { communityRooms, starterChatMessages } from '../lib/mockData'
import { addWispXp, usePresence, useRealtimeChat } from '../lib/realtimeCommunity'
import type { ChatMessage } from '../lib/types'

const roleClasses: Record<ChatMessage['role'], string> = {
  host: 'text-orange border-orange/40 bg-orange/10',
  mod: 'text-neon border-neon/40 bg-neon/10',
  member: 'text-green-300 border-green-500/30 bg-green-500/10',
  guest: 'text-gray-300 border-white/10 bg-white/5',
}

const roomByPath: Record<string, string> = {
  '/gaming': 'gaming',
  '/tech': 'ia',
  '/ai-lab': 'ia',
  '/science': 'science',
  '/streaming': 'streaming',
  '/green-node': 'green-node',
  '/creator-studio': 'streaming',
}

function roomForPath(pathname: string) {
  const match = Object.entries(roomByPath).find(([path]) => pathname.startsWith(path))
  return match?.[1] ?? 'general'
}

function modeLabel(status: 'local' | 'broadcast' | 'database' | 'realtime') {
  if (status === 'realtime') return 'Realtime global'
  if (status === 'database') return 'Historial Supabase'
  if (status === 'broadcast') return 'Broadcast navegador'
  return 'Local seguro'
}

export default function FloatingCommunityChat() {
  const location = useLocation()
  const isOverlay = location.pathname.includes('chat-overlay')
  const [open, setOpen] = useState(false)
  const [activeRoom, setActiveRoom] = useState(() => roomForPath(location.pathname))
  const [text, setText] = useState('')
  const { activeMessages, sendMessage, status } = useRealtimeChat(starterChatMessages, activeRoom)
  const presence = usePresence(location.pathname, activeRoom)

  const room = communityRooms.find((r) => r.id === activeRoom) || communityRooms[0]
  const recommendedRoom = useMemo(() => roomForPath(location.pathname), [location.pathname])

  useEffect(() => {
    setActiveRoom(recommendedRoom)
  }, [recommendedRoom])

  if (isOverlay) return null

  const send = async (event: FormEvent) => {
    event.preventDefault()
    const clean = text.trim()
    if (!clean) return
    await sendMessage(clean)
    addWispXp(8)
    setText('')
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3">
      {open && (
        <section className="w-[min(94vw,440px)] overflow-hidden rounded-3xl border border-orange/30 bg-ink-300/95 shadow-[0_0_45px_rgba(255,106,0,0.22)] backdrop-blur-xl animate-fade-in">
          <div className="relative border-b border-white/10 p-4">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="section-eyebrow mb-1">COMUNIDAD EN VIVO</p>
                <h2 className="font-display text-xl font-black text-white">Chat XETHKIOZ</h2>
                <p className="text-xs text-gray-400">
                  {presence.routeOnline} mirando esta página · {presence.roomOnline} en sala · {presence.onlineTotal} online · {modeLabel(status)}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg border border-white/10 px-2 py-1 text-xs text-gray-400 hover:text-white">Cerrar</button>
            </div>
            <div className="relative mt-3 rounded-2xl border border-green-400/20 bg-green-500/5 p-2 font-mono text-[10px] text-green-200">
              Wisp Lv.{presence.wispLevel} · {presence.wispName} · energía {presence.energy}% · sala sugerida: {recommendedRoom}
            </div>
          </div>

          <div className="grid grid-cols-[118px_1fr] min-h-[386px]">
            <aside className="border-r border-white/10 bg-black/20 p-2 space-y-1">
              {communityRooms.map((r) => (
                <button key={r.id} onClick={() => setActiveRoom(r.id)} className={`w-full rounded-xl px-2 py-2 text-left text-xs transition-all ${activeRoom === r.id ? 'bg-orange/15 text-orange border border-orange/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                  <span className="mr-1">{r.icon}</span>{r.name}
                </button>
              ))}
              <Link to="/community" className="mt-3 block rounded-xl border border-neon/30 bg-neon/10 px-2 py-2 text-center text-[11px] font-bold text-neon hover:bg-neon/20">Ver comunidad</Link>
            </aside>

            <div className="flex min-h-[386px] flex-col">
              <div className="border-b border-white/10 p-3">
                <div className="flex items-center gap-2"><span>{room.icon}</span><h3 className="font-display text-sm font-bold text-white">{room.name}</h3></div>
                <p className="mt-1 text-[11px] text-gray-500">{room.description}</p>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {activeMessages.map((m) => (
                  <div key={m.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{m.user}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${roleClasses[m.role]}`}>{m.role}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-300">{m.text}</p>
                    <p className="mt-1 font-mono text-[9px] text-gray-600">{new Date(m.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={send} className="border-t border-white/10 p-3">
                <div className="mb-2 flex gap-1 text-lg" aria-label="Emojis rápidos">
                  {['🎮','🔥','🤖','🔬','👑','⚡','🟢'].map((emoji) => <button key={emoji} type="button" onClick={() => setText((v) => `${v}${emoji}`)} className="rounded-md border border-white/10 px-1.5 hover:bg-white/10">{emoji}</button>)}
                </div>
                <div className="flex gap-2">
                  <input value={text} onChange={(e) => setText(e.target.value)} maxLength={280} placeholder="Escribí en la comunidad..." className="input-field py-2 text-xs" />
                  <button className="btn-primary px-3 py-2 text-xs">Enviar</button>
                </div>
                <p className="mt-2 text-[10px] text-gray-600">RC2.4: Realtime global activo cuando Supabase tenga aplicada la migración y Realtime habilitado.</p>
              </form>
            </div>
          </div>
        </section>
      )}

      <button onClick={() => setOpen((value) => !value)} className="group flex items-center gap-2 rounded-full border border-orange/40 bg-ink-300/95 px-4 py-3 text-sm font-bold text-white shadow-[0_0_28px_rgba(255,106,0,0.25)] backdrop-blur-xl transition-all hover:border-orange hover:scale-105">
        <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60"/><span className="relative inline-flex h-3 w-3 rounded-full bg-green-400"/></span>
        💬 Chat · {presence.routeOnline} mirando
      </button>
    </div>
  )
}
