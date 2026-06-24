import { useLang } from '../lib/LangContext'
import SEO from '../components/SEO'
export default function Community() {
  const { t } = useLang()
  const features = [{ icon: '👤', label: t.community.profiles }, { icon: '💬', label: t.community.comments }, { icon: '🗣️', label: t.community.forums }, { icon: '📊', label: t.community.polls }, { icon: '🎉', label: t.community.events }, { icon: '🏆', label: t.community.contests }, { icon: '⭐', label: t.community.memberships }, { icon: '📈', label: t.community.rankings }]
  const future = [{ icon: '🛒', label: t.footer.store }, { icon: '🔗', label: t.footer.affiliateLinks }, { icon: '📰', label: t.footer.sponsored }, { icon: '📺', label: t.footer.premium }, { icon: '🎧', label: t.footer.podcast }, { icon: '🎓', label: t.footer.courses }, { icon: '🎤', label: 'Interviews' }, { icon: '📡', label: 'Live Events' }, { icon: '💝', label: t.footer.donations }]
  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={t.community.title} description={t.community.desc} />
      <div className="text-center mb-12"><div className="text-5xl mb-3">🌎</div><h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-4">{t.community.title}</h1><p className="text-gray-400 max-w-2xl mx-auto">{t.community.desc}</p></div>
      <section className="mb-12"><h2 className="section-title gradient-text mb-6 text-center">{t.community.features}</h2><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{features.map((f, i) => <div key={f.label} className="glass border border-white/10 rounded-xl p-6 text-center card-hover hover:border-orange animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}><div className="text-3xl mb-3">{f.icon}</div><div className="text-sm font-semibold text-white">{f.label}</div><div className="text-xs text-orange mt-2 font-display">{t.footer.future}</div></div>)}</div></section>
      <section><h2 className="section-title gradient-text-purple mb-6 text-center">{t.footer.monetization}</h2><div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{future.map((f, i) => <div key={f.label} className="glass border border-neon/20 rounded-xl p-6 text-center card-hover hover:border-neon animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}><div className="text-3xl mb-3">{f.icon}</div><div className="text-sm font-semibold text-white">{f.label}</div><div className="text-xs text-neon mt-2 font-display">{t.footer.future}</div></div>)}</div></section>
    </div>
  )
}
