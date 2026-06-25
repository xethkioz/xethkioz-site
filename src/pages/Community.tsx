import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import SEO from '../components/SEO'

type CardItem = {
  icon: string
  label: string
  slug: string
  description: string
  active?: boolean
}

export default function Community() {
  const { t } = useLang()

  const features: CardItem[] = [
    { icon: '👤', label: t.community.profiles, slug: 'perfiles', description: 'Cuentas, identidad y perfil público.', active: true },
    { icon: '💬', label: 'Chat flotante', slug: 'chat-flotante', description: 'Salas tipo Discord: General, Gaming, IA, Ciencia y Streaming.', active: true },
    { icon: '💬', label: t.community.comments, slug: 'comentarios', description: 'Debate en noticias y publicaciones.' },
    { icon: '🗣️', label: t.community.forums, slug: 'foros', description: 'Temas por juegos, tech e IA.' },
    { icon: '📊', label: t.community.polls, slug: 'encuestas', description: 'Votaciones para decidir contenido.' },
    { icon: '🎉', label: t.community.events, slug: 'eventos', description: 'Eventos, directos y encuentros.' },
    { icon: '🏆', label: t.community.contests, slug: 'concursos', description: 'Desafíos y concursos gamer.' },
    { icon: '⭐', label: t.community.memberships, slug: 'membresias', description: 'Roles, beneficios y niveles.' },
    { icon: '📈', label: t.community.rankings, slug: 'rankings', description: 'Rankings de comunidad y creadores.' },
  ]

  const future: CardItem[] = [
    { icon: '🛒', label: t.footer.store, slug: 'tienda-online', description: 'Productos y recursos digitales.' },
    { icon: '🔗', label: t.footer.affiliateLinks, slug: 'links-afiliados', description: 'Recomendaciones y alianzas.' },
    { icon: '📰', label: t.footer.sponsored, slug: 'articulos-patrocinados', description: 'Sponsors y branded content.' },
    { icon: '📺', label: t.footer.premium, slug: 'contenido-premium', description: 'Contenido exclusivo futuro.' },
    { icon: '🎧', label: t.footer.podcast, slug: 'podcast', description: 'Audio y debates digitales.' },
    { icon: '🎓', label: t.footer.courses, slug: 'cursos', description: 'Aprendizaje y recursos.' },
    { icon: '🎤', label: 'Interviews', slug: 'interviews', description: 'Entrevistas a creadores.' },
    { icon: '📡', label: 'Live Events', slug: 'live-events', description: 'Eventos y coberturas en vivo.' },
    { icon: '💝', label: t.footer.donations, slug: 'donaciones', description: 'Apoyo al proyecto.' },
  ]

  const renderCard = (item: CardItem, accent: 'orange' | 'neon', index: number) => (
    <Link
      key={item.slug}
      to={`/community/${item.slug}`}
      className={`group glass rounded-xl p-5 text-center card-hover animate-fade-up border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-500 ${
        accent === 'orange'
          ? 'border-white/10 hover:border-orange focus:ring-orange'
          : 'border-neon/20 hover:border-neon focus:ring-neon'
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
      aria-label={`Abrir ${item.label}`}
    >
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
      <div className="text-sm font-semibold text-white mb-1">{item.label}</div>
      <p className="text-xs text-gray-500 min-h-[2rem]">{item.description}</p>
      <div className={`text-xs mt-3 font-display ${accent === 'orange' ? 'text-orange' : 'text-neon'}`}>
        {item.active ? 'Activo' : 'Ver función'} →
      </div>
    </Link>
  )

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={t.community.title} description={t.community.desc} url="/community" />

      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🌎</div>
        <p className="section-eyebrow">XETHKIOZ NETWORK</p>
        <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-4">{t.community.title}</h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-6">{t.community.desc}</p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/creator" className="btn-primary">
            Crear cuenta de creador
          </Link>
          <Link to="/contact" className="btn-secondary">
            Proponer una colaboración
          </Link>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="section-title gradient-text">{t.community.features}</h2>
            <p className="text-sm text-gray-500">Cada bloque ahora tiene una página funcional y un llamado a la acción.</p>
          </div>
          <Link to="/creator" className="text-sm text-orange hover:neon-text-orange transition-all">
            Panel de creador →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((f, i) => renderCard(f, 'orange', i))}
        </div>
      </section>

      <section>
        <h2 className="section-title gradient-text-purple mb-6 text-center">{t.footer.monetization}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {future.map((f, i) => renderCard(f, 'neon', i))}
        </div>
      </section>
    </div>
  )
}
