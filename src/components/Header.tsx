import './HeaderFantasy.css'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import ExperienceControls from './ExperienceControls'

const navigation = {
  es: [
    { to: '/', label: 'INICIO' },
    { to: '/gaming', label: 'JUEGOS' },
    { to: '/mascotas/', label: 'HUELLAS DE PUAN', document: true },
    { to: 'https://argenciencia.com/', label: 'CIENCIA & TECH', external: true },
    { to: '/creacion-web', label: 'CREACIÓN WEB' },
  ],
  en: [
    { to: '/', label: 'Home' },
    { to: '/gaming', label: 'Gaming' },
    { to: '/mascotas/', label: 'Pets', document: true },
    { to: 'https://argenciencia.com/', label: 'Science & Tech', external: true },
    { to: '/creacion-web', label: 'Web creation' },
  ],
} as const

const launcher = {
  es: [
    { to: '/', label: 'Inicio', icon: '⌂' },
    { to: '/gaming', label: 'Juegos', icon: '🎮' },
    { to: 'https://argenciencia.com/', label: 'ArgenCiencia', icon: '◈', external: true },
    { to: '/mascotas/', label: 'Mascotas', icon: '🐾', document: true },
    { to: '/creacion-web', label: 'Creación web', icon: '▣' },
  ],
  en: [
    { to: '/', label: 'Home', icon: '⌂' },
    { to: '/gaming', label: 'Gaming', icon: '🎮' },
    { to: 'https://argenciencia.com/', label: 'ArgenCiencia', icon: '◈', external: true },
    { to: '/mascotas/', label: 'Pets', icon: '🐾', document: true },
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
  const navigate = useNavigate()
  const nav = navigation[lang].map((item) => 'external' in item || 'document' in item ? item : ({ ...item, to: localizePath(item.to) }))
  const rail = launcher[lang].map((item) => 'external' in item || 'document' in item ? item : ({ ...item, to: localizePath(item.to) }))
  const t = labels[lang]

  const switchLang = () => setLang(lang === 'es' ? 'en' : 'es')
  const openAccount = () => {
    navigate(account.status === 'connected' ? '/profile' : '/account?mode=signin')
  }

  return (
    <>
      <header className="xk-aaa-header pointer-events-none sticky top-0 z-[65] px-3 py-3 md:px-8 md:py-4" aria-label={t.header}>
        <div className="pointer-events-auto mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[2rem] border border-white/10 bg-black/70 px-4 py-3 shadow-[0_0_28px_rgba(0,0,0,.35)] backdrop-blur-xl sm:gap-3 lg:grid-cols-[auto_1fr_auto] lg:gap-4 lg:bg-black/28 lg:px-6">
          <Link to={localizePath('/')} className="xk-broken-logo min-w-0 justify-self-start truncate font-black uppercase leading-none tracking-[0.08em] text-xl min-[360px]:text-2xl sm:text-3xl md:text-4xl" aria-label={t.brand}>
            XETHKIOZ
          </Link>

          <nav className="hidden justify-self-center rounded-full border border-white/10 bg-black/35 px-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gray-300 lg:flex" aria-label={t.topNav}>
            <NavLink to={localizePath('/')} className={({ isActive }) => `rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${isActive ? 'bg-[#8B5CF6]/20 text-white shadow-[0_0_14px_rgba(139,92,246,.35)]' : 'hover:bg-[#8B5CF6]/15 hover:text-white'}`}>
              {lang === 'es' ? 'INICIO' : 'HOME'}
            </NavLink>
            <Link className="xk-game-portal-link" to={localizePath('/world-of-xethkioz')}>{lang === 'es' ? 'EL JUEGO' : 'THE GAME'}</Link>
            {nav.slice(1).map((item) => (
              'external' in item ? (
                <a key={item.to} href={item.to} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 transition hover:bg-cyan-400/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">
                  {item.label} ↗
                </a>
              ) : 'document' in item ? (
                <a key={item.to} href={item.to} className="rounded-full px-4 py-2 transition hover:bg-emerald-400/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">
                  {item.label}
                </a>
              ) : (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${isActive ? 'bg-[#8B5CF6]/20 text-white shadow-[0_0_14px_rgba(139,92,246,.35)]' : 'hover:bg-[#8B5CF6]/15 hover:text-white'}`}>
                  {item.label}
                </NavLink>
              )
            ))}
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
          ) : 'document' in item ? (
            <a key={item.to} href={item.to} aria-label={item.label}>
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
