import { SOCIAL_LINKS, STREAM_LINKS, XETHKIOZ_STATS } from '../lib/siteConfig'

const chatMessages = [
  { user: 'XETHKIOZ', text: 'Bienvenidos al directo. Gaming, tecnología, IA y comunidad en vivo.', badge: 'HOST' },
  { user: 'Comunidad', text: '¿Qué juego quieren que probemos hoy?', badge: 'CHAT' },
  { user: 'Asia Gaming', text: 'También seguimos tendencias de Corea, Japón, China y SEA.', badge: 'META' },
]

export default function ChatOverlay({ compact = false }: { compact?: boolean }) {
  const mainSocials = SOCIAL_LINKS.filter((s) => ['Instagram', 'Threads', 'TikTok Principal', 'TikTok Asia', 'Twitch', 'Kick'].includes(s.name))

  return (
    <section className={`relative overflow-hidden rounded-3xl border border-orange/25 bg-ink/95 shadow-2xl ${compact ? 'p-4' : 'p-6 md:p-8'}`}>
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange/20 blur-[90px]" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-neon/20 blur-[110px]" />

      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="section-eyebrow">STREAMING OVERLAY</p>
            <h2 className="font-display text-2xl md:text-4xl font-black gradient-text">Chat Overlay XETHKIOZ</h2>
            <p className="text-sm text-gray-400 mt-2">Diseñado para OBS, Kick, Twitch y escenas de comunidad.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" /> EN VIVO
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_.7fr] gap-5">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
            {chatMessages.map((message) => (
              <div key={message.user} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="font-display text-sm font-bold text-orange">{message.user}</span>
                  <span className="text-[10px] font-bold tracking-widest text-neon border border-neon/30 rounded-full px-2 py-0.5">{message.badge}</span>
                </div>
                <p className="text-sm text-gray-300">{message.text}</p>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <h3 className="font-display text-lg font-bold text-white mb-3">Seguí el proyecto</h3>
            <p className="text-sm text-gray-400 mb-4">Threads ya superó {XETHKIOZ_STATS.threadsViews} visualizaciones. Sumate al ecosistema.</p>
            <div className="grid grid-cols-2 gap-2">
              {mainSocials.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 hover:border-orange/60 transition-all">
                  <span className="block text-lg">{social.icon}</span>
                  <span className="block text-xs font-bold text-white truncate">{social.name}</span>
                  <span className="block text-[11px] text-gray-500 truncate">{social.handle}</span>
                </a>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={STREAM_LINKS.kick} target="_blank" rel="noopener noreferrer" className="btn-primary text-center text-sm">Kick</a>
              <a href={STREAM_LINKS.twitch} target="_blank" rel="noopener noreferrer" className="btn-secondary text-center text-sm">Twitch</a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
