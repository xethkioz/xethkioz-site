import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import Logo from './Logo'
import type { Lang } from '../lib/i18n'

export default function Header() {
  const { lang, setLang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
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
  }, [location.pathname])

  const navItems = [
    { to: '/', label: t.nav.home },
    { to: '/gaming', label: t.nav.gaming },
    { to: '/tech', label: t.nav.tech },
    { to: '/science', label: t.nav.science },
    { to: '/news', label: t.nav.news },
    { to: '/streaming', label: t.nav.streaming },
    { to: '/media', label: t.nav.media },
    { to: '/community', label: t.nav.community },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
    { to: '/support', label: 'Apoyar' },
  ]

  const langLabels: Record<Lang, string> = {
    es: '🇪🇸 ES',
    en: '🇺🇸 EN',
    zh: '🇨🇳 中文',
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (query) window.location.href = `/news?q=${encodeURIComponent(query)}`
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-lg shadow-black/50 border-b border-white/10' : 'bg-ink/70 md:bg-transparent'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-orange focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink"
      >
        Skip to content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3">
          <Link to="/" className="flex-shrink-0" aria-label="XETHKIOZ Home">
            <Logo size="md" className="hover:opacity-90 transition-opacity" />
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive ? 'text-orange neon-text-orange' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-gray-300 hover:text-orange transition-colors rounded-md hover:bg-white/5"
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1 px-2.5 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-md hover:bg-white/5 transition-all"
                aria-label="Change language"
                aria-expanded={langOpen}
              >
                {langLabels[lang]}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-32 glass-strong rounded-lg shadow-xl border border-white/10 overflow-hidden z-50">
                  {(Object.keys(langLabels) as Lang[]).map((language) => (
                    <button
                      key={language}
                      onClick={() => {
                        setLang(language)
                        setLangOpen(false)
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/10 transition-colors ${
                        lang === language ? 'text-orange' : 'text-gray-300'
                      }`}
                    >
                      {langLabels[language]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/creator" className="hidden md:inline-flex px-3 py-2 rounded-md text-sm font-semibold text-orange border border-orange/30 hover:bg-orange/10 transition-all">
              Crear cuenta
            </Link>

            <Link to="/support" className="hidden md:inline-flex px-3 py-2 rounded-md text-sm font-semibold text-neon border border-neon/30 hover:bg-neon/10 transition-all">
              Apoyar
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="xl:hidden p-2 text-gray-300 hover:text-white rounded-md hover:bg-white/5 transition-colors"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4 animate-fade-in">
            <form onSubmit={handleSearch} role="search">
              <label className="sr-only" htmlFor="site-search">
                {t.search.placeholder}
              </label>
              <input
                id="site-search"
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="input-field"
              />
            </form>
          </div>
        )}

        {mobileOpen && (
          <nav id="mobile-navigation" className="xl:hidden pb-4 animate-fade-in" aria-label="Mobile navigation">
            <div className="flex flex-col gap-0.5 glass-strong rounded-lg p-3 border border-white/10">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
                      isActive ? 'text-orange bg-orange/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 grid grid-cols-1 gap-2 border-t border-white/10 pt-3">
                <NavLink to="/creator" className="btn-primary text-center text-sm">Crear cuenta / Iniciar sesión</NavLink>
                <NavLink to="/support" className="btn-secondary text-center text-sm">Patrocinar o donar</NavLink>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
