import { NavLink } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'

const navItems = [
  { to: '/cms', es: ['Dashboard', 'Resumen editorial'], en: ['Dashboard', 'Editorial overview'], end: true },
  { to: '/cms/generate', es: ['Nueva noticia', 'Crear borrador'], en: ['New article', 'Create draft'] },
  { to: '/cms/news', es: ['Noticias', 'Borradores y publicadas'], en: ['Articles', 'Drafts and published'] },
  { to: '/cms/review', es: ['Revisión', 'Aprobar o pedir ajustes'], en: ['Review', 'Approve or request changes'] },
  { to: '/cms/news/new', es: ['Editor', 'Editor base'], en: ['Editor', 'Base editor'] },
  { to: '/cms/users', es: ['Usuarios', 'Roles y permisos'], en: ['Users', 'Roles and permissions'] },
  { to: '/cms/traffic', es: ['Tráfico técnico', 'IP, equipos y compatibilidad'], en: ['Technical traffic', 'IP, devices and compatibility'] },
  { to: '/cms/nexus-safety', es: ['Seguridad Nexus', 'Reportes y moderación'], en: ['Nexus safety', 'Reports and moderation'] },
  { to: '/cms/ads', es: ['Publicidades', 'Sponsors y banners'], en: ['Advertising', 'Sponsors and banners'] },
  { to: '/cms/web-services', es: ['Creación Web', 'Propuestas e imágenes'], en: ['Web Creation', 'Solutions and images'] },
  { to: '/cms/web-quotes', es: ['Presupuestos', 'Consultas comerciales'], en: ['Quotes', 'Commercial inquiries'] },
] as const

const copy = {
  es: { title: 'CMS Studio', description: 'Centro editorial profesional.', navigation: 'Navegación del CMS' },
  en: { title: 'CMS Studio', description: 'Professional editorial center.', navigation: 'CMS navigation' },
} as const

export default function CmsSidebar() {
  const { lang } = useLang()
  const t = copy[lang]

  return (
    <aside className="border-b border-purple-500/20 bg-slate-950/95 p-4 text-white lg:min-h-screen lg:w-80 lg:border-b-0 lg:border-r">
      <div className="rounded-3xl border border-orange-400/30 bg-black/40 p-5 shadow-2xl shadow-purple-950/30">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-orange-300">XETHKIOZ</p>
        <h2 className="mt-3 text-2xl font-black">{t.title}</h2>
        <p className="mt-2 text-sm text-purple-100">{t.description}</p>
      </div>

      <nav className="mt-5 grid gap-2" aria-label={t.navigation}>
        {navItems.map((item) => {
          const [label, description] = item[lang]
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={'end' in item ? item.end : undefined}
              className={({ isActive }) =>
                `rounded-2xl border px-4 py-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                  isActive
                    ? 'border-orange-400/70 bg-orange-500/15 text-white shadow-lg shadow-orange-950/30'
                    : 'border-purple-500/15 bg-white/[0.03] text-purple-100 hover:border-purple-400/40 hover:bg-purple-500/10'
                }`
              }
            >
              <span className="block text-sm font-black uppercase tracking-[0.16em]">{label}</span>
              <span className="mt-1 block text-xs text-purple-200/80">{description}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
