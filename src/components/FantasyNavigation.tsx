import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { PUBLIC_NAVIGATION } from '../lib/publicNavigation'
import './FantasyNavigation.css'

export default function FantasyNavigation() {
  const { lang, setLang, localizePath } = useLang()
  const location = useLocation()
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)
  useEffect(() => setMenuOpen(false), [location.pathname, location.search, location.hash])
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setMenuOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 1280px)')
    const resize = () => { if (desktop.matches) setMenuOpen(false) }
    document.addEventListener('pointerdown', outside)
    desktop.addEventListener('change', resize)
    return () => { document.removeEventListener('pointerdown', outside); desktop.removeEventListener('change', resize) }
  }, [])
  useEffect(() => {
    document.documentElement.toggleAttribute('data-fantasy-menu-open', menuOpen)
    return () => document.documentElement.removeAttribute('data-fantasy-menu-open')
  }, [menuOpen])
  const links = PUBLIC_NAVIGATION.map(item => {
    const label = item[lang]
    const className = item.id === 'game' ? 'xkf-game-link' : item.id === 'support' ? 'xkf-support-link' : undefined
    if ('external' in item) return <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>{label}<span aria-hidden="true">↗</span></a>
    if ('document' in item) return <a key={item.id} href={item.href} className={className}>{label}</a>
    const href = localizePath(item.href)
    return <Link key={item.id} to={href} className={className} aria-current={location.pathname === href ? 'page' : undefined}>{label}</Link>
  })
  return (
    <header ref={header} className="xkf-header" onKeyDown={event => {
      if (event.key === 'Escape' && menuOpen) { event.preventDefault(); close(); toggle.current?.focus() }
    }} onBlur={event => {
      if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) close()
    }}>
      <Link to={localizePath('/')} className="xkf-brand" aria-label={lang === 'es' ? 'Volver a XETHKIOZ' : 'Back to XETHKIOZ'}><span aria-hidden="true">✦</span>XETHKIOZ</Link>
      <button ref={toggle} className="xkf-mobile" type="button" aria-controls={menuId} aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}>
        {lang === 'es' ? 'Menú' : 'Menu'}<span aria-hidden="true">{menuOpen ? '−' : '+'}</span>
      </button>
      <div className="xkf-actions"><button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}>{lang === 'es' ? 'EN' : 'ES'}</button><Link to="/login">{lang === 'es' ? 'Entrar' : 'Sign in'}</Link></div>
      <nav className="xkf-desktop" aria-label={lang === 'es' ? 'Ecosistema XETHKIOZ' : 'XETHKIOZ ecosystem'}>{links}</nav>
      <nav id={menuId} className="xkf-mobile-panel" hidden={!menuOpen} aria-label={lang === 'es' ? 'Ecosistema XETHKIOZ móvil' : 'Mobile XETHKIOZ ecosystem'} onClick={event => {
        if ((event.target as HTMLElement).closest('a')) close()
      }}>{links}</nav>
    </header>
  )
}
