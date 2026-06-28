import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'

const copy = {
  es: {
    back: '⏴ Volver al Núcleo',
    label: 'XETHKIOZ // PORTAL_GAMING',
    title: 'Juegos, guías y directos',
    subtitle: 'El sector principal del ecosistema: noticias gamer, streams, guías, comunidad y contenido preparado para el futuro CMS.',
    cards: [
      ['Noticias de videojuegos', 'Cobertura de lanzamientos, actualizaciones, rumores verificados y debates de comunidad.', '/news'],
      ['Guías y builds', 'Espacio listo para guías de Mobile Legends, League of Legends, MMORPG, shooters y aventuras.', '/gaming'],
      ['Directos y clips', 'Base para integrar Twitch, Kick, Shorts y momentos destacados sin bloquear la carga inicial.', '/community'],
      ['Galería gamer', 'Área futura para wallpapers, capturas, banners y piezas visuales oficiales de XETHKIOZ.', '/profile'],
    ],
    chatTitle: 'Chat local de prueba',
    chatLine: 'Probando señal del ecosistema gaming.',
    placeholder: 'Escribí un mensaje local...',
    send: 'Enviar',
  },
  en: {
    back: '⏴ Back to Core',
    label: 'XETHKIOZ // GAMING_PORTAL',
    title: 'Games, guides and live content',
    subtitle: 'The main ecosystem sector: gaming news, streams, guides, community and content ready for the future CMS.',
    cards: [
      ['Game news', 'Launches, updates, verified rumors and community debates.', '/news'],
      ['Guides and builds', 'Ready for Mobile Legends, League of Legends, MMORPG, shooters and adventure guides.', '/gaming'],
      ['Streams and clips', 'Base for Twitch, Kick, Shorts and highlights without blocking initial load.', '/community'],
      ['Gaming gallery', 'Future home for wallpapers, screenshots, banners and official XETHKIOZ visuals.', '/profile'],
    ],
    chatTitle: 'Local test chat',
    chatLine: 'Testing the gaming ecosystem signal.',
    placeholder: 'Write a local message...',
    send: 'Send',
  },
} as const

export function GamingPortal() {
  const { lang } = useLang()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const ui = copy[lang]

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const clean = draft.trim()
    if (!clean) return
    setMessages((current) => [...current.slice(-4), clean])
    setDraft('')
  }

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
          {ui.cards.map(([title, body, route]) => (
            <Link key={title} to={route} className="panel-cyber group flex min-h-[150px] flex-col gap-3 p-6 transition duration-300 hover:-translate-y-1 hover:border-fusionAccent-tech-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fusionAccent-tech-primary">
              <h2 className="border-b border-fusionSurface-muted pb-2 text-lg font-bold uppercase text-white transition group-hover:text-fusionAccent-tech-primary">{title}</h2>
              <p className="text-sm leading-relaxed text-gray-400">{body}</p>
            </Link>
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
              <p><span className="text-fusionAccent-tech-primary">Sistema:</span> {ui.chatLine}</p>
              {messages.map((message, index) => (
                <p key={`${message}-${index}`} className="mt-2"><span className="text-fusionAccent-tech-secondary">Invitado:</span> {message}</p>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-fusionSurface-muted bg-fusionBg p-2">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} type="text" placeholder={ui.placeholder} className="min-w-0 flex-1 rounded border border-fusionSurface-muted bg-fusionSurface-base p-2 font-mono text-xs text-gray-200 outline-none focus:border-fusionAccent-tech-primary" />
              <button type="submit" className="rounded border border-fusionAccent-tech-primary/60 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fusionAccent-tech-primary transition hover:bg-fusionAccent-tech-primary hover:text-black">{ui.send}</button>
            </form>
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
