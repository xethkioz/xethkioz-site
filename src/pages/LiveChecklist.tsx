import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { SITE_DOMAIN, SITE_VERSION, SOCIAL_LINKS } from '../lib/siteConfig'

const groups = [
  {
    title: 'Contenido',
    items: ['Home con hero y secciones visibles', 'Gaming, Tech, Science y News con portadas', 'Media con miniaturas', 'Streaming con overlays y videos', 'Textos de prueba reducidos al mínimo'],
  },
  {
    title: 'Integración',
    items: ['Links reales centralizados', 'Botones principales revisados', 'Footer con redes oficiales', 'Rutas internas funcionales', 'Open Graph y sitemap preparados'],
  },
  {
    title: 'Comunidad',
    items: ['Chat flotante activo', 'Salas segmentadas', 'Base para Supabase Realtime', 'Moderación prevista', 'Login preparado para conectar roles'],
  },
  {
    title: 'Salida LIVE',
    items: ['npm install', 'npm run build', 'revisión visual en local', 'git status limpio', 'deploy en Netlify', 'prueba final en dominio oficial'],
  },
]

export default function LiveChecklist() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO title="Checklist LIVE" description="Revisión final antes de publicar XETHKIOZ v4.0 Alpha en producción." url="/live-checklist" />
      <section className="relative overflow-hidden rounded-3xl border border-orange/25 bg-ink-300 p-6 md:p-8 mb-8">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative">
          <p className="section-eyebrow">PUBLICACIÓN OFICIAL</p>
          <h1 className="font-display text-3xl md:text-6xl font-black gradient-text mb-4">Checklist antes del LIVE</h1>
          <p className="max-w-3xl text-gray-300">Página de control para revisar el proyecto antes de subirlo a {SITE_DOMAIN}. Mantiene visible lo que falta validar antes del deploy final.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={SITE_DOMAIN} target="_blank" rel="noopener noreferrer" className="btn-primary">Abrir dominio oficial</a>
            <Link to="/cms" className="btn-secondary">Abrir CMS Studio</Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {groups.map((group) => (
          <section key={group.title} className="glass rounded-2xl border border-white/10 p-5">
            <h2 className="font-display text-xl font-bold text-white mb-4">{group.title}</h2>
            <ul className="space-y-3">
              {group.items.map((item) => <li key={item} className="flex gap-2 text-sm text-gray-300"><span className="text-green-300">✓</span>{item}</li>)}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-[.8fr_1.2fr] gap-6">
        <div className="glass rounded-2xl border border-orange/20 p-6">
          <h2 className="font-display text-2xl font-bold text-white mb-3">Versión actual</h2>
          <p className="text-orange font-display text-3xl">{SITE_VERSION}</p>
          <p className="text-sm text-gray-400 mt-2">Alpha 4 queda pensada como punto de pulido antes de una futura beta.</p>
        </div>
        <div className="glass rounded-2xl border border-white/10 p-6">
          <h2 className="font-display text-2xl font-bold text-white mb-4">Redes a verificar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:border-orange/40 transition-all">
                <span className="text-xl">{link.icon}</span>
                <strong className="block text-sm text-white mt-1">{link.name}</strong>
                <span className="text-xs text-gray-500">{link.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
