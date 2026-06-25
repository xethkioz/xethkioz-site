import SEO from '../components/SEO'
import ChatOverlay from '../components/ChatOverlay'

export default function ChatOverlayPage() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO title="Chat Overlay" description="Overlay visual para streams de XETHKIOZ en OBS, Kick y Twitch." url="/streaming/chat-overlay" />
      <ChatOverlay />
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          ['OBS listo', 'Usalo como referencia visual para una escena de navegador o placa de stream.'],
          ['Links reales', 'Incluye Kick, Twitch, TikTok, TikTok Asia, Instagram y Threads.'],
          ['Comunidad', 'Pensado para mostrar chat, CTA y métricas sin tapar el gameplay.'],
        ].map(([title, text]) => (
          <div key={title} className="glass border border-white/10 rounded-2xl p-5">
            <h2 className="font-display text-lg font-bold text-white mb-2">{title}</h2>
            <p className="text-sm text-gray-400">{text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
