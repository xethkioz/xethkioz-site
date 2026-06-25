import { useLang } from '../lib/LangContext'
import SEO from '../components/SEO'

export default function About() {
  const { t } = useLang()

  const stats = [
    { value: '1.6M+', label: 'Views on Threads' },
    { value: '4', label: 'Kids' },
    { value: '3', label: 'Portals' },
    { value: '∞', label: 'Passion' },
  ]

  const values = [
    { icon: '🎮', title: 'Gaming', desc: 'Esports, reviews, and the best of gaming culture' },
    { icon: '🚀', title: 'Technology', desc: 'AI, hardware, innovation, and future tech' },
    { icon: '🔬', title: 'Science', desc: 'Space, medicine, biology, and discoveries' },
  ]

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={t.about.title} description={t.about.bio} />

      <div className="text-center mb-12">
        <div className="text-5xl mb-3">🚀</div>
        <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">
          {t.about.title}
        </h1>
      </div>

      <section className="glass border border-white/10 rounded-2xl overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="aspect-square md:aspect-auto overflow-hidden bg-ink-300">
            <img
              src="/images/xethkioz-about.webp"
              alt="Alexis Diaz, founder of XETHKIOZ"
              className="w-full h-full object-cover object-center md:object-[50%_35%]"
              loading="eager"
            />
          </div>

          <div className="md:col-span-2 p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-2">Alexis Díaz</h2>
            <p className="text-orange font-medium mb-4">{t.about.founder}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="tag-orange">🇦🇷 Argentine</span>
              <span className="tag-purple">🎮 Gamer</span>
              <span className="tag border-white/20 text-gray-300">🏥 Hospital Worker</span>
              <span className="tag border-white/20 text-gray-300">👨‍👧‍👦 Father of 4</span>
            </div>

            <p className="text-gray-400 leading-relaxed">{t.about.bio}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="glass border border-white/10 rounded-xl p-6 text-center">
            <div className="font-display text-3xl font-bold gradient-text mb-1">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="glass border border-orange/20 rounded-2xl p-8 mb-8">
        <h2 className="font-display text-xl font-bold text-orange mb-4">{t.about.mission}</h2>
        <p className="text-gray-400 leading-relaxed">{t.about.missionText}</p>
      </section>

      <h2 className="font-display text-xl font-bold text-white mb-4 text-center">
        {t.about.values}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {values.map((v) => (
          <div key={v.title} className="glass border border-white/10 rounded-xl p-6 text-center card-hover">
            <div className="text-3xl mb-3">{v.icon}</div>
            <h3 className="font-display font-bold text-white mb-2">{v.title}</h3>
            <p className="text-xs text-gray-500">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
