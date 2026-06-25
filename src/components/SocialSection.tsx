import { useLang } from '../lib/LangContext'
import { useSocialLinks } from '../lib/hooks'
export default function SocialSection() {
  const { t } = useLang()
  const { socials } = useSocialLinks()
  const cfg: Record<string, { color: string; bg: string; emoji: string }> = {
    Threads: { color: 'text-white', bg: 'bg-black border-white/30', emoji: '💬' },
    Instagram: { color: 'text-pink-400', bg: 'bg-gradient-to-br from-pink-500/20 to-purple-600/20 border-pink-500/30', emoji: '📸' },
    TikTok: { color: 'text-white', bg: 'bg-black border-white/30', emoji: '🎵' },
    YouTube: { color: 'text-red-500', bg: 'bg-red-600/10 border-red-500/30', emoji: '▶️' },
    Twitch: { color: 'text-neon-400', bg: 'bg-neon-500/10 border-neon-500/30', emoji: '🎮' },
    Kick: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', emoji: '🟢' },
  }
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8"><p className="section-eyebrow">{t.sections.social}</p><h2 className="font-display text-2xl md:text-3xl font-bold gradient-text-mix mb-2">🌎 {t.sections.network}</h2><p className="text-sm text-gray-400">{t.sections.networkDesc}</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {socials.map((s) => { const c = cfg[s.platform] || cfg.Threads; return (
          <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className={`group glass border rounded-xl p-5 text-center card-hover hover:scale-105 ${c.bg}`}>
            <div className="text-3xl mb-2">{c.emoji}</div><div className={`text-sm font-bold ${c.color}`}>{s.platform}</div><div className="text-xs text-gray-500 mt-1">{s.handle}</div>{s.followers && <div className="text-xs text-orange mt-2 font-semibold">{s.followers}</div>}
          </a>
        )})}
      </div>
      <div className="mt-6 text-center"><span className="inline-block px-6 py-3 glass border border-orange/30 rounded-full text-orange font-display font-bold text-sm">🔥 1.6M+ views on Threads</span></div>
    </section>
  )
}
