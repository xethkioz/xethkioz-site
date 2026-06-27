import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'

const copy = {
  es: {
    back: '⏴ Volver al Núcleo',
    label: 'FUSION_ALPHA_2.0 // PORTAL_GAMING',
    title: 'Gaming sin mezclar el resto',
    subtitle: 'Noticias, guías, transmisiones e imágenes listas para crecer con el CMS.',
    cards: [
      ['Noticias de videojuegos', '// Esperando sincronización con NewsEngine de Supabase...'],
      ['Guías de videojuegos', '// Lógica de comentarios protegida por RLS lista para inyección...'],
      ['Videos de transmisiones', '// Embeds asíncronos desacoplados para evitar lag de carga...'],
      ['Imágenes · Wallpapers', '// Destino de subida: Supabase Storage Bucket /public-media...'],
    ],
    chatTitle: 'Ecosistema Chat',
    chatLine: '¡La V5 está quedando tremenda!',
    placeholder: 'Escribe en el ecosistema...',
  },
  en: {
    back: '⏴ Back to Core',
    label: 'FUSION_ALPHA_2.0 // PORTAL_GAMING',
    title: 'Gaming without mixing the rest',
    subtitle: 'News, guides, streams and images ready to grow with the CMS.',
    cards: [
      ['Game news', '// Waiting for Supabase NewsEngine synchronization...'],
      ['Game guides', '// RLS-protected comment logic ready for injection...'],
      ['Stream videos', '// Decoupled async embeds to prevent load lag...'],
      ['Images · Wallpapers', '// Upload target: Supabase Storage Bucket /public-media...'],
    ],
    chatTitle: 'Ecosystem Chat',
    chatLine: 'V5 is looking massive!',
    placeholder: 'Write in the ecosystem...',
  },
} as const

export function GamingPortal() {
  const { lang } = useLang()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const ui = copy[lang]

  return (
    <div className="relative min-h-screen bg-fusionBg pb-12 text-gray-300 selection:bg-fusionAccent-tech-primary/30">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-4 pt-24 sm:px-6">
        <Link to="/" className="font-mono text-xs uppercase tracking-[0.22em] text-fusionAccent-tech-primary hover:underline">{ui.back}</Link>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-600">{ui.label}</div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-4 pt-12 sm:px-6">
        <section className="panel-cyber flex flex-col gap-3 border-l-2 border-l-fusionAccent-tech-primary p-8">
          <h1 className="text-4xl font-black uppercase tracking-wide text-white">{ui.title}</h1>
          <p className="max-w-2xl text-sm text-gray-400">{ui.subtitle}</p>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ui.cards.map(([title, body]) => (
            <article key={title} className="panel-cyber flex flex-col gap-2 p-6">
              <h2 className="border-b border-fusionSurface-muted pb-2 text-lg font-bold uppercase text-white">{title}</h2>
              <p className="font-mono text-xs text-gray-400">{body}</p>
            </article>
          ))}
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {isChatOpen && (
          <section className="panel-cyber flex h-96 w-80 animate-[pulse_0.2s_ease-out] flex-col justify-between overflow-hidden border border-fusionAccent-tech-primary/40 shadow-glow-tech" aria-label={ui.chatTitle}>
            <div className="flex items-center justify-between border-b border-fusionSurface-muted bg-fusionSurface-base p-3">
              <span className="font-mono text-xs font-bold uppercase text-white">{ui.chatTitle}</span>
              <span className="h-2 w-2 rounded-full bg-fusionAccent-tech-secondary animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-gray-400">
              <span className="text-fusionAccent-tech-primary">Invitado_07:</span> {ui.chatLine}
            </div>
            <div className="border-t border-fusionSurface-muted bg-fusionBg p-2">
              <input type="text" placeholder={ui.placeholder} disabled className="w-full rounded border border-fusionSurface-muted bg-fusionSurface-base p-2 font-mono text-xs text-gray-500" />
            </div>
          </section>
        )}
        <button type="button" onClick={() => setIsChatOpen((value) => !value)} className="flex h-12 w-12 items-center justify-center rounded-full border border-fusionAccent-tech-primary/60 bg-fusionSurface-base text-white shadow-glow-tech transition duration-300 hover:border-fusionAccent-tech-primary" aria-label={isChatOpen ? 'Cerrar chat' : 'Abrir chat'}>
          <span>{isChatOpen ? '✕' : '💬'}</span>
        </button>
      </div>
    </div>
  )
}

export default GamingPortal
