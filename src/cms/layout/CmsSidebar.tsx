import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/cms', label: 'Dashboard', description: 'Resumen editorial', end: true },
  { to: '/cms/generate', label: 'Nueva noticia', description: 'Crear borrador' },
  { to: '/cms/news', label: 'Noticias', description: 'Borradores y publicadas' },
  { to: '/cms/review', label: 'Revisión', description: 'Aprobar o pedir ajustes' },
  { to: '/cms/news/new', label: 'Editor', description: 'Editor base' },
  { to: '/cms/users', label: 'Usuarios', description: 'Roles y permisos' },
  { to: '/cms/ads', label: 'Publicidades', description: 'Sponsors y banners' },
]

export default function CmsSidebar() {
  return (
    <aside className="border-b border-purple-500/20 bg-slate-950/95 p-4 text-white lg:min-h-screen lg:w-80 lg:border-b-0 lg:border-r">
      <div className="rounded-3xl border border-orange-400/30 bg-black/40 p-5 shadow-2xl shadow-purple-950/30">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-orange-300">XETHKIOZ</p>
        <h2 className="mt-3 text-2xl font-black">CMS Studio</h2>
        <p className="mt-2 text-sm text-purple-100">Centro editorial profesional.</p>
      </div>

      <nav className="mt-5 grid gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `rounded-2xl border px-4 py-3 transition ${
                isActive
                  ? 'border-orange-400/70 bg-orange-500/15 text-white shadow-lg shadow-orange-950/30'
                  : 'border-purple-500/15 bg-white/[0.03] text-purple-100 hover:border-purple-400/40 hover:bg-purple-500/10'
              }`
            }
          >
            <span className="block text-sm font-black uppercase tracking-[0.16em]">{item.label}</span>
            <span className="mt-1 block text-xs text-purple-200/80">{item.description}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
