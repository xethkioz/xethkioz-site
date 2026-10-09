import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
import { usePortalEffects } from './PortalEffects'
import './PortalSystem.css'

export default function PortalNavigation({ home = false }: { home?: boolean }) {
  const { lang, setLang, localizePath } = useLang()
  const es = lang === 'es'
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const effects = usePortalEffects()
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    document.documentElement.toggleAttribute('data-fantasy-menu-open', open)
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !ref.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => { document.documentElement.removeAttribute('data-fantasy-menu-open'); document.removeEventListener('pointerdown', outside) }
  }, [open])
  return <header onBlur={event => { if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setOpen(false) }} ref={ref} className={`portal-navigation${home ? ' is-home' : ''}`} onKeyDown={event => { if (event.key === 'Escape' && open) { setOpen(false); toggleRef.current?.focus() } }}>
    {home ? <span className="portal-navigation__signature" aria-hidden="true">✦ <span>{es ? 'UN UNIVERSO SIN LÍMITES' : 'ONE BOUNDLESS UNIVERSE'}</span></span> : <Link className="portal-navigation__back" to={localizePath('/')}><span aria-hidden="true">←</span> {es ? 'Portales' : 'Portals'}</Link>}
    {!home && <nav className="portal-navigation__destinations" aria-label={es ? 'Portales principales' : 'Main portals'}>
      <Link data-tone="innercircle" aria-current={pathname.includes('aion2/innercircle') ? 'page' : undefined} to={localizePath('/aion2/innercircle')}>InnerCircle</Link>
      <a data-tone="nature" href="/mascotas/">{es ? 'Mascotas' : 'Pets'}</a>
      <Link data-tone="ice" aria-current={pathname.includes('digital') || pathname.includes('creacion-web') ? 'page' : undefined} to={localizePath('/digital')}>Digital</Link>
      <Link data-tone="node" aria-current={pathname.includes('green-node') ? 'page' : undefined} to={localizePath('/green-node')}>Green Node</Link>
    </nav>}
    <div className="portal-navigation__controls">
      <button type="button" className="portal-effects-toggle" onClick={effects.toggle} aria-pressed={effects.enabled} aria-disabled={effects.systemPaused} title={effects.systemPaused ? (es ? 'Efectos pausados por movimiento reducido o ahorro de datos' : 'Effects paused by reduced motion or data saver') : es ? 'Activar o pausar efectos visuales' : 'Enable or pause visual effects'}>{es ? 'Efectos' : 'Effects'} <span aria-hidden="true">{effects.enabled ? '✦' : '○'}</span></button>
      <button type="button" aria-label={es ? 'Cambiar a inglés' : 'Switch to Spanish'} onClick={() => setLang(es ? 'en' : 'es')}>{es ? 'EN' : 'ES'}</button>
      <button ref={toggleRef} type="button" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(value => !value)}>{es ? 'Menú' : 'Menu'} <span aria-hidden="true">{open ? '−' : '+'}</span></button>
    </div>
    <nav id={menuId} className="portal-navigation__more" hidden={!open} aria-label={es ? 'Más de XETHKIOZ' : 'More from XETHKIOZ'} onClick={() => setOpen(false)}>
      <Link to="/news">{es ? 'Noticias' : 'News (ES)'}</Link><Link to={localizePath('/gaming')}>{es ? 'Biblioteca gamer' : 'Gaming library'}</Link><Link to={localizePath('/community')}>{es ? 'Comunidad' : 'Community'}</Link><Link to="/account">{es ? 'Mi cuenta' : 'My account'}</Link>
    </nav>
  </header>
}
