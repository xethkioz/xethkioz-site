import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import { useWisp } from '../providers/WispProvider'
import ExperienceControls from './ExperienceControls'

const navigation = {
  es: [
    { to: '/', label: 'INICIO' },
    { to: '/gaming', label: 'JUEGOS' },
    { to: 'https://argenciencia.com/', label: 'CIENCIA & TECH', external: true },
    { to: '/comicon', label: 'COMICON' },
    { to: '/fun', label: 'HUELLAS DE PUAN' },
    { to: '/creacion-web', label: 'CREACIÓN WEB' },
  ],
  en: [
    { to: '/', label: 'HOME' },
    { to: '/gaming', label: 'GAMING' },
    { to: 'https://argenciencia.com/', label: 'SCIENCE & TECH', external: true },
    { to: '/comicon', label: 'COMICON' },
    { to: '/fun', label: 'PETS' },
    { to: '/creacion-web', label: 'WEB CREATION' },
  ],
} as const

const launcher = {
  es: [
    { to: '/', label: 'Inicio', icon: '⌂' },
    { to: '/gaming', label: 'Juegos', icon: '🎮' },
    { to: 'https://argenciencia.com/', label: 'ArgenCiencia', icon: '◈', external: true },
    { to: '/comicon', label: 'COMICON', icon: '✹' },
    { to: '/fun', label: 'Mascotas', icon: '🐾' },
    { to: '/creacion-web', label: 'Creación web', icon: '▣' },
  ],
  en: [
    { to: '/', label: 'Home', icon: '⌂' },
    { to: '/gaming', label: 'Gaming', icon: '🎮' },
    { to: 'https://argenciencia.com/', label: 'ArgenCiencia', icon: '◈', external: true },
    { to: '/comicon', label: 'COMICON', icon: '✹' },
    { to: '/fun', label: 'Pets', icon: '🐾' },
    { to: '/creacion-web', label: 'Web creation', icon: '▣' },
  ],
} as const

const labels = {
  es: {
    launcher: 'Lanzador XETHKIOZ',
    header: 'Navegación principal de XETHKIOZ',
    brand: 'Ir al inicio de XETHKIOZ',
    topNav: 'Navegación principal',
    mobileNav: 'Navegación móvil principal',
    green: 'Abrir Green Node mediante Wisp',
    greenShort: 'WISP NEXUS',
    switchLanguage: 'Cambiar a inglés',
    login: 'INICIAR SESIÓN',
    account: 'Abrir cuenta o perfil',
  },
  en: {
    launcher: 'XETHKIOZ launcher',
    header: 'XETHKIOZ primary navigation',
    brand: 'Go to XETHKIOZ home',
    topNav: 'Primary navigation',
    mobileNav: 'Primary mobile navigation',
    green: 'Open Green Node through Wisp',
    greenShort: 'WISP NEXUS',
    switchLanguage: 'Switch to Spanish',
    login: 'SIGN IN',
    account: 'Open account or profile',
  },
} as const

export default function Header() {
  const { lang, setLang, localizePath } = useLang()
  const { account } = useHud()
  const { triggerGreenPortal } = useWisp()
  const navigate = useNavigate()
  const nav = navigation[lang].map((item) => 'external' in item ? item : ({ ...item, to: localizePath(item.to) }))
  const rail = launcher[lang].map((item) => 'external' in item ? item : ({ ...item, to: localizePath(item.to) }))
  const t = labels[lang]

  const switchLang = () => setLang(lang === 'es' ? 'en' : 'es')
  const openGreen = () => {
    triggerGreenPortal()
    window.setTimeout(() => navigate('/green-node'), 420)
  }
  const openAccount = () => {
    navigate(account.status === 'connected' ? '/profile' : '/account?mode=signin')
  }

  return (
    <>
      <aside className="fixed left-4 top-1/2 z-[72] hidden -translate-y-1/2 flex-col gap-3 rounded-[2rem] border border-white/10 bg-black/45 p-2 shadow-[0_0_34px_rgba(139,92,246,.22)] backdrop-blur-xl md:flex" aria-label={t.launcher}>
        {rail.map((item) => (
          'external' in item ? (
            <a key={item.to} href={item.to} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-lg text-white transition hover:border-[#22d3ee] hover:shadow-[0_0_18px_rgba(34,211,238,.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300" title={item.label}>
              <span aria-hidden="true">{item.icon}</span>
            </a>
          ) : (
            <NavLink key={item.to} to={item.to} aria-label={item.label} className={({ isActive }) => `grid h-12 w-12 place-items-center rounded-2xl border bg-white/[0.035] text-lg text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${isActive ? 'border-[#FF6B1A] shadow-[0_0_18px_rgba(255,107,26,.5)]' : 'border-white/10 hover:border-[#8B5CF6] hover:shadow-[0_0_18px_rgba(139,92,246,.55)]'}`} title={item.label}>
              <span aria-hidden="true">{item.icon}</span>
            </NavLink>
          )
        ))}
        <button type="button" onClick={openGreen} aria-label={t.green} className="grid h-12 w-12 place-items-center rounded-2xl border border-[#32FF8A]/35 bg-[#32FF8A]/10 text-lg text-[#32FF8A] transition hover:border-[#32FF8A] hover:shadow-[0_0_20px_rgba(50,255,138,.65)]" title="Green Node">
          <span aria-hidden="true">✦</span>
        </button>
      </aside>

      <header className="xk-aaa-header pointer-events-none sticky top-0 z-[65] px-3 py-3 md:px-8 md:py-4" aria-label={t.header}>
        <div className="pointer-events-auto mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[2rem] border border-white/10 bg-black/70 px-4 py-3 shadow-[0_0_28px_rgba(0,0,0,.35)] backdrop-blur-xl sm:gap-3 lg:grid-cols-[auto_1fr_auto] lg:gap-4 lg:bg-black/28 lg:px-6">
          <Link to={localizePath('/')} className="xk-broken-logo min-w-0 justify-self-start truncate font-black uppercase leading-none tracking-[0.08em] text-xl min-[360px]:text-2xl sm:text-3xl md:text-4xl" aria-label={t.brand}>
            XETHKIOZ
          </Link>

          <nav className="hidden justify-self-center rounded-full border border-white/10 bg-black/35 px-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gray-300 lg:flex" aria-label={t.topNav}>
            {nav.map((item) => (
              'external' in item ? (
                <a key={item.to} href={item.to} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 transition hover:bg-cyan-400/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">
                  {item.label} ↗
                </a>
              ) : (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${isActive ? 'bg-[#8B5CF6]/20 text-white shadow-[0_0_14px_rgba(139,92,246,.35)]' : 'hover:bg-[#8B5CF6]/15 hover:text-white'}`}>
                  {item.label}
                </NavLink>
              )
            ))}
            <button type="button" onClick={openGreen} aria-label={t.green} className="rounded-full px-4 py-2 text-[#32FF8A] transition hover:bg-[#32FF8A]/10 hover:shadow-[0_0_14px_rgba(50,255,138,.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#32FF8A]">
              {t.greenShort}
            </button>
          </nav>

          <div className="xk-header-actions flex justify-self-end gap-1.5 font-mono text-[10px] font-black uppercase tracking-[0.14em] sm:gap-2 sm:text-[11px] sm:tracking-[0.16em]">
            <ExperienceControls />
            <button type="button" onClick={switchLang} aria-label={t.switchLanguage} title={t.switchLanguage} className="rounded-full border border-white/10 bg-white/[0.035] px-2 py-2 text-white transition hover:border-[#8B5CF6] hover:text-[#8B5CF6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 sm:px-3">
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <button type="button" onClick={openAccount} aria-label={t.account} className="rounded-full border border-[#FF6B1A]/40 bg-[#FF6B1A]/10 px-2 py-2 text-[#FFB47A] transition hover:border-[#FF6B1A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 sm:px-3">
              <span className="xk-account-full">{account.status === 'connected' ? account.name : t.login}</span><span className="xk-account-compact" aria-hidden="true">{account.status === 'connected' ? '●' : '↪'}</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="xk-mobile-dock" aria-label={t.mobileNav}>
        {rail.map((item) => (
          'external' in item ? (
            <a key={item.to} href={item.to} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
              <span aria-hidden="true">{item.icon}</span>
              <small>{item.label}</small>
            </a>
          ) : (
            <NavLink key={item.to} to={item.to} aria-label={item.label} className={({ isActive }) => isActive ? 'is-active' : undefined}>
              <span aria-hidden="true">{item.icon}</span>
              <small>{item.label}</small>
            </NavLink>
          )
        ))}
      </nav>
    </>
  )
}
