import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { usePrivacyConsent } from '../lib/PrivacyConsentContext'
import { SITE_VERSION, SOCIAL_LINKS } from '../lib/siteConfig'
import { stripEnglishPrefix } from '../lib/localizedRoutes'
import './Footer.css'

const copy = {
  es: { tagline: 'GAMING · TECNOLOGÍA · NOTICIAS', statement: 'BEYOND THE GAME', legal: 'Todos los derechos reservados.', about: 'Quiénes somos', editorial: 'Editorial', support: 'Apoyar', privacy: 'Privacidad', privacySettings: 'Cookies', contact: 'Contacto' },
  en: { tagline: 'GAMING · TECHNOLOGY · NEWS', statement: 'BEYOND THE GAME', legal: 'All rights reserved.', about: 'About', editorial: 'Editorial', support: 'Support', privacy: 'Privacy', privacySettings: 'Cookies', contact: 'Contact' },
} as const

const socialGlyphs: Record<string, string> = { Threads: '@', Instagram: 'IG', 'TikTok Principal': 'TK', YouTube: '▶', Web: '◎' }

export default function Footer() {
  const { lang, localizePath } = useLang()
  const { openSettings } = usePrivacyConsent()
  const pathname = stripEnglishPrefix(useLocation().pathname)
  const theme = pathname === '/world-of-xethkioz' ? 'world' : pathname === '/green-node' ? 'green' : pathname === '/creacion-web' ? 'studio' : pathname === '/science' ? 'science' : 'core'
  const t = copy[lang]
  const channels = SOCIAL_LINKS.filter((item) => ['Threads', 'Instagram', 'TikTok Principal', 'YouTube', 'Web'].includes(item.name))

  return (
    <footer className="xk-global-footer" data-theme={theme}>
      <div className="xk-global-footer__glow" aria-hidden="true" />
      <div className="xk-global-footer__frame">
        <Link className="xk-global-footer__brand" to={localizePath('/')} aria-label="XETHKIOZ — inicio">
          <span className="xk-global-footer__sigil" aria-hidden="true"><i /><b>X</b><i /></span>
          <span><strong>XETHKIOZ</strong><small>{t.tagline}</small></span>
        </Link>
        <nav className="xk-global-footer__social" aria-label={lang === 'es' ? 'Canales oficiales' : 'Official channels'}>
          {channels.map((item) => <a key={item.name} href={item.url} target="_blank" rel="noreferrer noopener" aria-label={`${item.name}: ${item.handle}`} title={`${item.name} · ${item.handle}`}><span aria-hidden="true">{socialGlyphs[item.name]}</span></a>)}
        </nav>
        <a className="xk-global-footer__domain" href="https://www.xethkioz.com.ar"><strong>WWW.XETHKIOZ.COM.AR</strong><small>{t.statement}</small></a>
        <div className="xk-global-footer__legal">
          <span>© {new Date().getFullYear()} XETHKIOZ · {t.legal}</span>
          <nav aria-label={lang === 'es' ? 'Enlaces legales' : 'Legal links'}><Link to={localizePath('/about')}>{t.about}</Link><Link to={localizePath('/editorial-policy')}>{t.editorial}</Link><Link to={localizePath('/support')}>{t.support}</Link><Link to={localizePath('/privacy')}>{t.privacy}</Link><button type="button" onClick={openSettings}>{t.privacySettings}</button><Link to={localizePath('/contact')}>{t.contact}</Link></nav>
          <small>{SITE_VERSION}</small>
        </div>
      </div>
    </footer>
  )
}
