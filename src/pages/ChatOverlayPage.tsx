import { Link, useLocation } from 'react-router-dom'
import SEO from '../components/SEO'
import ChatOverlay from '../components/ChatOverlay'

export default function ChatOverlayPage() {
  const location = useLocation()
  const obsMode = new URLSearchParams(location.search).get('obs') === '1'
  const obsUrl = `${window.location.origin}/chat-overlay?obs=1`

  if (obsMode) {
    return (
      <div className="min-h-screen bg-transparent p-4">
        <SEO title="Chat Overlay OBS" description="Overlay para OBS de XETHKIOZ." url="/chat-overlay" />
        <ChatOverlay obsMode />
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO title="Chat Overlay" description="Overlay visual para streams de XETHKIOZ en OBS, Kick y Twitch." url="/chat-overlay" />
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-eyebrow">OBS / KICK / TWITCH</p>
          <h1 className="font-display text-3xl md:text-5xl font-black gradient-text">Centro de prueba del Chat Overlay</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">Esta página sirve para revisar cómo se ve el overlay antes de agregarlo como fuente de navegador en OBS.</p>
        </div>
        <a href={obsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-center text-sm">Abrir modo OBS</a>
      </div>
      <ChatOverlay />
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          ['URL para OBS', obsUrl],
          ['Tamaño recomendado', 'Browser Source: 420x720 para chat lateral o 900x520 para escena completa.'],
          ['Estado Alpha 4', 'Overlay PRO revisado. La conexión real del chat queda preparada para Supabase Realtime.'],
        ].map(([title, text]) => (
          <div key={title} className="glass border border-white/10 rounded-2xl p-5">
            <h2 className="font-display text-lg font-bold text-white mb-2">{title}</h2>
            <p className="text-sm text-gray-400 break-words">{text}</p>
          </div>
        ))}
      </section>
      <div className="mt-8"><Link to="/streaming" className="text-orange hover:neon-text-orange">← Volver a Streaming</Link></div>
    </div>
  )
}
