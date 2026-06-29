import { Link } from 'react-router-dom'
import Logo from './Logo'

const navItems = [
  { to: '/gaming', label: 'Juegos' },
  { to: '/science', label: 'Tecnología/Ciencia' },
  { to: '/fun', label: 'Memes' },
]

export default function Header() {
  return (
    <header className="xk-header-clean sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0F]/88 backdrop-blur-xl" aria-label="XETHKIOZ navegación principal">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-4">
        <Link to="/" aria-label="Ir al inicio XETHKIOZ" className="rounded-full px-3 py-1 transition hover:scale-[1.015] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/60">
          <Logo size="md" />
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gray-300" aria-label="Secciones principales">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:border-[#8B5CF6]/70 hover:text-white hover:shadow-[0_0_10px_rgba(139,92,246,.35)]">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
