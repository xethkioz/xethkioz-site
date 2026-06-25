import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'

type Feature = {
  slug: string
  icon: string
  title: string
  section: 'Comunidad' | 'Monetización'
  status: 'Activo' | 'Preparado' | 'Próximamente'
  description: string
  actions: { label: string; to: string; primary?: boolean }[]
}

const features: Feature[] = [
  { slug: 'chat-flotante', icon: '💬', title: 'Chat flotante de comunidad', section: 'Comunidad', status: 'Activo', description: 'Base visual del chat comunitario tipo Discord. Incluye salas por tema, mensajes locales, emojis y preparación para Supabase Realtime.', actions: [{ label: 'Volver a la comunidad', to: '/community', primary: true }, { label: 'Ver noticias', to: '/news' }] },
  { slug: 'perfiles', icon: '👤', title: 'Perfiles de Usuario', section: 'Comunidad', status: 'Activo', description: 'Base para que cada usuario o creador tenga una identidad dentro de XETHKIOZ.', actions: [{ label: 'Crear cuenta de creador', to: '/creator', primary: true }, { label: 'Ver comunidad', to: '/community' }] },
  { slug: 'comentarios', icon: '💬', title: 'Comentarios', section: 'Comunidad', status: 'Preparado', description: 'Espacio pensado para comentar noticias, streams, artículos y debates gaming.', actions: [{ label: 'Crear cuenta para comentar', to: '/creator', primary: true }, { label: 'Leer noticias', to: '/news' }] },
  { slug: 'foros', icon: '🗣️', title: 'Foros', section: 'Comunidad', status: 'Preparado', description: 'Foros para MMORPG, cooperativos, tecnología, IA, esports y proyectos de la comunidad.', actions: [{ label: 'Unirme como miembro', to: '/creator', primary: true }, { label: 'Contactar a XETHKIOZ', to: '/contact' }] },
  { slug: 'encuestas', icon: '📊', title: 'Encuestas', section: 'Comunidad', status: 'Preparado', description: 'Votaciones para decidir próximos juegos, temas de videos, streams y rankings.', actions: [{ label: 'Participar con cuenta', to: '/creator', primary: true }, { label: 'Ver comunidad', to: '/community' }] },
  { slug: 'eventos', icon: '🎉', title: 'Eventos', section: 'Comunidad', status: 'Preparado', description: 'Eventos digitales para directos, torneos, especiales y encuentros de la comunidad.', actions: [{ label: 'Registrar interés', to: '/creator', primary: true }, { label: 'Ver streaming', to: '/streaming' }] },
  { slug: 'concursos', icon: '🏆', title: 'Concursos', section: 'Comunidad', status: 'Preparado', description: 'Concursos y desafíos para incentivar participación, creatividad y contenido gamer.', actions: [{ label: 'Crear perfil', to: '/creator', primary: true }, { label: 'Contactar', to: '/contact' }] },
  { slug: 'membresias', icon: '⭐', title: 'Membresías', section: 'Comunidad', status: 'Preparado', description: 'Base para futuras membresías con beneficios, roles y contenido especial.', actions: [{ label: 'Crear cuenta', to: '/creator', primary: true }, { label: 'Ver planes futuros', to: '/community' }] },
  { slug: 'rankings', icon: '📈', title: 'Rankings Comunitarios', section: 'Comunidad', status: 'Preparado', description: 'Rankings para creadores, miembros activos, clips, juegos y participación.', actions: [{ label: 'Participar', to: '/creator', primary: true }, { label: 'Ver comunidad', to: '/community' }] },
  { slug: 'tienda-online', icon: '🛒', title: 'Tienda Online', section: 'Monetización', status: 'Preparado', description: 'Área futura para productos digitales, merchandising y recursos de XETHKIOZ.', actions: [{ label: 'Solicitar información', to: '/contact', primary: true }, { label: 'Volver', to: '/community' }] },
  { slug: 'links-afiliados', icon: '🔗', title: 'Links de Afiliados', section: 'Monetización', status: 'Preparado', description: 'Sistema para recomendar productos, hardware, juegos y servicios con enlaces afiliados.', actions: [{ label: 'Proponer alianza', to: '/contact', primary: true }, { label: 'Ver tecnología', to: '/tech' }] },
  { slug: 'articulos-patrocinados', icon: '📰', title: 'Artículos Patrocinados', section: 'Monetización', status: 'Preparado', description: 'Espacio para publicaciones patrocinadas claramente identificadas y transparentes.', actions: [{ label: 'Contactar por sponsor', to: '/contact', primary: true }, { label: 'Ver noticias', to: '/news' }] },
  { slug: 'contenido-premium', icon: '📺', title: 'Contenido Premium', section: 'Monetización', status: 'Preparado', description: 'Contenido exclusivo, análisis, guías y beneficios para miembros.', actions: [{ label: 'Crear cuenta', to: '/creator', primary: true }, { label: 'Ver media', to: '/media' }] },
  { slug: 'podcast', icon: '🎧', title: 'Podcast', section: 'Monetización', status: 'Preparado', description: 'Base para episodios sobre gaming, IA, tecnología, actualidad y cultura digital.', actions: [{ label: 'Proponer tema', to: '/contact', primary: true }, { label: 'Ver comunidad', to: '/community' }] },
  { slug: 'cursos', icon: '🎓', title: 'Cursos', section: 'Monetización', status: 'Preparado', description: 'Futuros cursos sobre creación de contenido, streaming, IA, gaming y proyectos digitales.', actions: [{ label: 'Quiero recibir novedades', to: '/creator', primary: true }, { label: 'Contactar', to: '/contact' }] },
  { slug: 'interviews', icon: '🎤', title: 'Interviews', section: 'Monetización', status: 'Preparado', description: 'Entrevistas a creadores, gamers, streamers, proyectos y referentes de tecnología.', actions: [{ label: 'Proponer entrevista', to: '/contact', primary: true }, { label: 'Ver comunidad', to: '/community' }] },
  { slug: 'live-events', icon: '📡', title: 'Live Events', section: 'Monetización', status: 'Preparado', description: 'Eventos en vivo, coberturas, directos y activaciones especiales.', actions: [{ label: 'Ver streaming', to: '/streaming', primary: true }, { label: 'Crear cuenta', to: '/creator' }] },
  { slug: 'donaciones', icon: '💝', title: 'Donaciones', section: 'Monetización', status: 'Activo', description: 'Área para apoyar el crecimiento de XETHKIOZ con PayPal, Mercado Pago o propuestas de patrocinio.', actions: [{ label: 'Apoyar ahora', to: '/support', primary: true }, { label: 'Contactar por sponsor', to: '/contact' }] },
]

export default function CommunityFeature() {
  const { featureSlug } = useParams()
  const feature = features.find((item) => item.slug === featureSlug)

  if (!feature) {
    return (
      <div className="animate-fade-in max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <SEO title="Función no encontrada" />
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="font-display text-3xl font-bold gradient-text mb-3">Función no encontrada</h1>
        <p className="text-gray-400 mb-6">La sección que buscás todavía no existe o cambió de ubicación.</p>
        <Link to="/community" className="btn-primary">Volver a Comunidad</Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SEO title={feature.title} description={feature.description} url={`/community/${feature.slug}`} />

      <section className="glass border border-orange/20 rounded-2xl p-8 md:p-10 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange/10 via-transparent to-neon/10 pointer-events-none" />
        <div className="relative">
          <div className="text-6xl mb-4">{feature.icon}</div>
          <p className="section-eyebrow">{feature.section}</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-4">{feature.title}</h1>
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-display border border-orange/30 bg-orange/10 text-orange mb-5">
            {feature.status}
          </span>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">{feature.description}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {feature.actions.map((action) => (
              <Link key={action.label} to={action.to} className={action.primary ? 'btn-primary' : 'btn-secondary'}>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {['Preparado para Supabase', 'Mobile first', 'Escalable para v4.0'].map((item) => (
          <div key={item} className="glass border border-white/10 rounded-xl p-5 text-center">
            <div className="text-orange text-xl mb-2">✦</div>
            <div className="text-sm font-semibold text-white">{item}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
