import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { type Lang } from '../lib/i18n'
import { useLang } from '../lib/LangContext'

const publicNav = [
  { to: '/', labelKey: 'home', fallback: 'Inicio' },
  { to: '/news', labelKey: 'news', fallback: 'Noticias' },
  { to: '/gaming', labelKey: 'gaming', fallback: 'Gaming' },
  { to: '/tech', labelKey: 'tech', fallback: 'Tech' },
  { to: '/ai-lab', labelKey: null, fallback: 'IA' },
  { to: '/science', labelKey: null, fallback: 'Science' },
  { to: '/community', labelKey: 'community', fallback: 'Comunidad' },
]

const ecosystemNav = [
  { to: '/green-node', labelKey: null, fallback: 'Green Node' },
  { to: '/streaming', labelKey: 'streaming', fallback: 'Streaming' },
  { to: '/media', labelKey: 'media', fallback: 'Media' },
  { to: '/network', labelKey: null, fallback: 'Network' },
  { to: '/about', labelKey: 'about', fallback: 'Acerca' },
  { to: '/contact', labelKey: 'contact', fallback: 'Contacto' },
  { to: '/support', labelKey: null, fallback: 'Apoyar' },
]

const studioNav = [
  { to: '/cms', labelKey: null, fallback: 'CMS Studio' },
  { to: '/creator-studio', labelKey: null, fallback: 'Creator Studio' },
  { to: '/news-engine', labelKey: null, fallback: 'Fuentes' },
  { to: '/roles', labelKey: null, fallback: 'Roles' },
  { to: '/content-system', labelKey: null, fallback: 'Content OS' },
  { to: '/milestones', labelKey: null, fallback: 'Milestones' },
  { to: '/qa', labelKey: null, fallback: 'QA' },
]

type NavEntry = {
  to: string
  labelKey: string | null
  fallback: string
}

export default function Header() {
  const { lang, setLang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [ecosystemOpen, setEcosystemOpen] = useState(false)
  const [studioOpen, setStudioOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setLangOpen(false)
    setSearchOpen(false)
    setEcosystemOpen(false)
    setStudioOpen(false)
  }, [location.pathname])

  const langLabels: Record<Lang, string> = {
    es: 'ES',
    en: 'EN',
    zh: '中文',
  }

  const getLabel = (item: NavEntry) => {
    if (!item.labelKey) return item.fallback
    const nav = t.nav as Record<string, string>
    return nav[item.labelKey] || item.fallback
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (query) window.location.href = `/news?q=${encodeURIComponent(query)}`
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
      isActive ? 'text-orange neon-text-orange bg-orange/5' : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`

  const renderNavLink = (item: NavEntry) => (
    <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navClass}>
      {getLabel(item)}
    </NavLink>
  )

  const ecosystemActive = useMemo(() => ecosystemNav.some((item) => location.pathname === item.to), [location.pathname])
  const studioActive = useMemo(() => studioNav.some((item) => location.pathname === item.to), [location.pathname])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong border-b border-white/10 shadow-lg shadow-black/50' : 'bg-ink/85 md:bg-ink/45'
      }`}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-orange focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink">
        Ir al contenido
      </a>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20">
          <Link to="/" className="flex-shrink-0" aria-label="XETHKIOZ Home">
            <Logo size="md" className="transition-opacity hover:opacity-90" />
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Navegación principal">
            {publicNav.map(renderNavLink)}

            <div className="relative">
              <button type="button" onClick={() => setEcosystemOpen((v) => !v)} className={`rounded-md px-3 py-2 text-sm font-semibold transition-all ${ecosystemActive || ecosystemOpen ? 'bg-green-400/10 text-green-200' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`} aria-expanded={ecosystemOpen}>
                Ecosistema ▾
              </button>
              {ecosystemOpen && (
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-white/10 bg-ink-300/98 p-2 shadow-2xl shadow-black/70 backdrop-blur-xl">
                  <p className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[0.22em] text-green-300">Green Wisp Route</p>
                  {ecosystemNav.map((item) => (
                    <NavLink key={item.to} to={item.to} className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm transition-all ${isActive ? 'bg-green-400/10 text-green-200' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                      {getLabel(item)}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button type="button" onClick={() => setStudioOpen((v) => !v)} className={`rounded-md px-3 py-2 text-sm font-semibold transition-all ${studioActive || studioOpen ? 'bg-neon/10 text-neon' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`} aria-expanded={studioOpen}>
                Studio ▾
              </button>
              {studioOpen && (
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-white/10 bg-ink-300/98 p-2 shadow-2xl shadow-black/70 backdrop-blur-xl">
                  <p className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Backstage interno</p>
                  {studioNav.map((item) => (
                    <NavLink key={item.to} to={item.to} className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm transition-all ${isActive ? 'bg-neon/10 text-neon' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                      {getLabel(item)}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen((v) => !v)} className="rounded-md p-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange" aria-label="Buscar" aria-expanded={searchOpen}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            <div className="relative">
              <button onClick={() => setLangOpen((v) => !v)} className="rounded-md px-2.5 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white" aria-label="Selector de idioma" aria-expanded={langOpen}>
                {langLabels[lang]}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 min-w-[120px] overflow-hidden rounded-lg border border-white/10 glass-strong shadow-xl">
                  {(['es', 'en', 'zh'] as Lang[]).map((l) => (
                    <button key={l} onClick={() => { setLang(l); setLangOpen(false) }} className={`w-full px-4 py-2 text-left text-sm transition-colors ${lang === l ? 'bg-orange/20 text-orange' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setMobileOpen((v) => !v)} className="rounded-md p-2 text-gray-300 hover:bg-white/5 hover:text-white xl:hidden" aria-label="Abrir menú" aria-expanded={mobileOpen}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4 animate-fade-in">
            <div className="relative">
              <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar noticias, gaming, ciencia, IA..." className="input-field pr-12" autoFocus />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-orange hover:text-orange-300">→</button>
            </div>
          </form>
        )}

        {mobileOpen && (
          <nav className="max-h-[calc(100vh-5rem)] overflow-y-auto pb-4 animate-fade-in xl:hidden" aria-label="Navegación móvil">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Principal</p>
            <div className="grid grid-cols-2 gap-2">
              {publicNav.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'border-orange/30 bg-orange/20 text-orange' : 'border-transparent text-gray-300 hover:bg-white/5'}`}>
                  {getLabel(item)}
                </NavLink>
              ))}
            </div>
            <p className="mb-2 mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-green-300">Ecosistema</p>
            <div className="grid grid-cols-2 gap-2">
              {ecosystemNav.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'border-green-400/30 bg-green-400/10 text-green-200' : 'border-transparent text-gray-300 hover:bg-white/5'}`}>
                  {getLabel(item)}
                </NavLink>
              ))}
            </div>
            <details className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.22em] text-gray-500">Studio interno</summary>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {studioNav.map((item) => (
                  <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-lg border px-3 py-2 text-xs transition-colors ${isActive ? 'border-neon/30 bg-neon/10 text-neon' : 'border-transparent text-gray-400 hover:bg-white/5'}`}>
                    {getLabel(item)}
                  </NavLink>
                ))}
              </div>
            </details>
          </nav>
        )}
      </div>
    </header>
  )
}
