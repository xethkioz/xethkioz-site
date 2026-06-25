import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { type Lang } from '../lib/i18n'
import { useLang } from '../lib/LangContext'

const primaryNav = [
  { to: '/', labelKey: 'home', fallback: 'Inicio' },
  { to: '/gaming', labelKey: 'gaming', fallback: 'Gaming & Tech' },
  { to: '/science', labelKey: null, fallback: 'Science Lab' },
  { to: '/network', labelKey: null, fallback: 'Network' },
  { to: '/streaming', labelKey: 'streaming', fallback: 'Streaming' },
  { to: '/community', labelKey: 'community', fallback: 'Comunidad' },
]

const moreNav = [
  { to: '/news', labelKey: 'news', fallback: 'Noticias' },
  { to: '/tech', labelKey: 'tech', fallback: 'Tech Lab' },
  { to: '/media', labelKey: 'media', fallback: 'Media' },
  { to: '/content-system', labelKey: null, fallback: 'Content OS' },
  { to: '/news-engine', labelKey: null, fallback: 'Fuentes' },
  { to: '/roles', labelKey: null, fallback: 'Roles' },
  { to: '/cms', labelKey: null, fallback: 'CMS Studio' },
  { to: '/qa', labelKey: null, fallback: 'QA' },
  { to: '/about', labelKey: 'about', fallback: 'About' },
  { to: '/contact', labelKey: 'contact', fallback: 'Contacto' },
  { to: '/support', labelKey: null, fallback: 'Apoyar' },
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
  const [moreOpen, setMoreOpen] = useState(false)
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
    setMoreOpen(false)

    if (location.pathname !== '/green-node') {
      try {
        window.sessionStorage.removeItem('xethkioz-green-node-portal-open')
      } catch {}
    }
  }, [location.pathname])

  const langLabels: Record<Lang, string> = {
    es: '🇪🇸 ES',
    en: '🇺🇸 EN',
    zh: '🇨🇳 中文',
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
    `px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
      isActive ? 'text-orange neon-text-orange bg-orange/5' : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`

  const renderNavLink = (item: NavEntry) => (
    <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navClass}>
      {getLabel(item)}
    </NavLink>
  )

  const moreActive = useMemo(() => moreNav.some((item) => location.pathname === item.to), [location.pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-lg shadow-black/50 border-b border-white/10' : 'bg-ink/80 md:bg-ink/35'
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

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
            {primaryNav.map(renderNavLink)}

            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  moreActive || moreOpen ? 'text-neon bg-neon/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                aria-expanded={moreOpen}
              >
                Más ▾
              </button>
              {moreOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-ink-300/98 p-2 shadow-2xl shadow-black/70 backdrop-blur-xl">
                  <p className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">XETHKIOZ Network</p>
                  <div className="grid grid-cols-1 gap-1">
                    {moreNav.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `rounded-xl px-3 py-2 text-sm transition-all ${
                            isActive ? 'bg-orange/15 text-orange' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`
                        }
                      >
                        {getLabel(item)}
                      </NavLink>
                    ))}
                  </div>
                  <div className="mt-2 rounded-xl border border-green-400/15 bg-green-400/5 px-3 py-2 text-[11px] text-green-300/75">
                    Green Node está oculto. Seguí el Wisp verde.
                  </div>
                </div>
              )}
            </div>
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
                className="px-2.5 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                aria-label="Language selector"
                aria-expanded={langOpen}
              >
                {langLabels[lang]}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 min-w-[140px] rounded-lg glass-strong border border-white/10 overflow-hidden shadow-xl">
                  {(['es', 'en', 'zh'] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false) }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        lang === l ? 'bg-orange/20 text-orange' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 text-gray-300 hover:text-white rounded-md hover:bg-white/5"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <form onSubmit={handleSearch} className="pb-4 animate-fade-in">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar noticias, gaming, ciencia, IA..."
                className="input-field pr-12"
                autoFocus
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-orange hover:text-orange-300">
                →
              </button>
            </div>
          </form>
        )}

        {mobileOpen && (
          <nav className="lg:hidden pb-4 animate-fade-in" aria-label="Mobile navigation">
            <div className="grid grid-cols-2 gap-2">
              {[...primaryNav, ...moreNav].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-orange/20 text-orange border border-orange/30' : 'text-gray-300 hover:bg-white/5 border border-transparent'
                    }`
                  }
                >
                  {getLabel(item)}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-green-400/15 bg-green-400/5 px-4 py-3 text-xs text-green-300/80">
              Green Node permanece oculto: buscá el Wisp verde.
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
