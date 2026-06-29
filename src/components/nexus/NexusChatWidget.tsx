import { useState } from 'react'

const CHAT_URL = (import.meta.env.VITE_NEXUS_CHAT_URL as string | undefined)?.replace(/\/$/, '')

export default function NexusChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-5 right-5 z-[75] font-mono text-[#F0F0F5]">
      {open && (
        <section className="mb-4 w-[calc(100vw-2.5rem)] max-w-[390px] overflow-hidden rounded-3xl border border-[#8B5CF6]/60 bg-[#0A0A0F]/95 shadow-[0_0_10px_#8B5CF6,0_18px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl" aria-label="XETHKIOZ Nexus Chat">
          <header className="border-b border-[#8B5CF6]/30 bg-gradient-to-r from-[#8B5CF6]/20 via-black/40 to-[#FF6B1A]/15 p-4">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#FF6B1A]">XETHKIOZ</p>
            <h2 className="mt-1 text-lg font-black uppercase tracking-[0.18em] text-white">Nexus Chat</h2>
          </header>
          <div className="grid gap-3 p-3">
            <div className="rounded-2xl border border-white/10 bg-black/35 p-3 text-xs leading-relaxed text-gray-300">
              {CHAT_URL ? 'Backend configurado. Activando canal Nexus...' : 'Nexus Chat instalado. Falta configurar VITE_NEXUS_CHAT_URL.'}
            </div>
          </div>
        </section>
      )}
      <button type="button" onClick={() => setOpen((current) => !current)} className="ml-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#8B5CF6]/70 bg-[#0A0A0F] text-xl shadow-[0_0_10px_#8B5CF6,0_0_32px_rgba(255,107,26,0.22)] transition hover:scale-105 hover:border-[#FF6B1A] hover:text-[#FF6B1A]" aria-expanded={open} aria-label="Abrir XETHKIOZ Nexus Chat">
        N
      </button>
    </div>
  )
}
