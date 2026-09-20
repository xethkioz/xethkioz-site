import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { PUBLIC_NAVIGATION } from '../lib/publicNavigation'
import './FantasyNavigation.css'

export default function FantasyNavigation() {
  const { lang, setLang, localizePath } = useLang()
  const location = useLocation()
  const disclosure = useRef<HTMLDetailsElement>(null)
  const close = () => { if (disclosure.current) disclosure.current.open = false }
  useEffect(close, [location.pathname, location.search, location.hash])
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !disclosure.current?.contains(event.target)) close()
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [])
  const links = PUBLIC_NAVIGATION.map(item => {
    const label = item[lang]
    const className = item.id === 'game' ? 'xkf-game-link' : undefined
    if ('external' in item) return <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>{label}<span aria-hidden="true">↗</span></a>
    if ('document' in item) return <a key={item.id} href={item.href} className={className}>{label}</a>
    const href = localizePath(item.href)
    return <Link key={item.id} to={href} className={className} aria-current={location.pathname === href ? 'page' : undefined}>{label}</Link>
  })
  return (
    <header className="xkf-header">
      <Link to={localizePath('/')} className="xkf-brand" aria-label={lang === 'es' ? 'Volver a XETHKIOZ' : 'Back to XETHKIOZ'}><span aria-hidden="true">✦</span>XETHKIOZ</Link>
      <div className="xkf-actions"><button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}>{lang === 'es' ? 'EN' : 'ES'}</button><Link to="/login">{lang === 'es' ? 'Entrar' : 'Sign in'}</Link></div>
      <nav className="xkf-desktop" aria-label={lang === 'es' ? 'Ecosistema XETHKIOZ' : 'XETHKIOZ ecosystem'}>{links}</nav>
      <details ref={disclosure} className="xkf-mobile" onKeyDown={event => {
        if (event.key === 'Escape' && disclosure.current?.open) {
          event.preventDefault(); close(); disclosure.current.querySelector('summary')?.focus()
        }
      }} onBlur={event => {
        if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) close()
      }}>
        <summary>{lang === 'es' ? 'Menú' : 'Menu'}<span aria-hidden="true">＋</span></summary>
        <nav aria-label={lang === 'es' ? 'Ecosistema XETHKIOZ móvil' : 'Mobile XETHKIOZ ecosystem'} onClick={event => {
          if ((event.target as HTMLElement).closest('a')) close()
        }}>{links}</nav>
      </details>
    </header>
  )
}
