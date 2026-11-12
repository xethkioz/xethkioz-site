import { Link } from 'react-router-dom'
import { usePrivacyConsent } from '../lib/PrivacyConsentContext'
import { useLang } from '../lib/LangContext'
import { SITE_VERSION, SOCIAL_LINKS } from '../lib/siteConfig'
export default function Footer() {
  const { openSettings } = usePrivacyConsent()
  const { lang, localizePath } = useLang()
  const privacySettings = 'Cookies'
  return <footer className="border-t border-slate-200 bg-white px-6 py-8 text-slate-600">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 text-xs">
      <span>© {new Date().getFullYear()} XETHKIOZ · Creá, compartí, descubrí. · {SITE_VERSION}</span>
      <nav aria-label="Redes oficiales" className="flex flex-wrap gap-5">{SOCIAL_LINKS.filter((social) => social.name === 'Threads' || social.name === 'Instagram').map((social) => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">{social.name}</a>)}</nav>
      <nav aria-label="Información legal" className="flex flex-wrap gap-5"><Link to="/explorar">Explorar</Link><Link to={localizePath('/privacy')}>{lang === 'es' ? 'Privacidad' : 'Privacy'}</Link><Link to={localizePath('/editorial-policy')}>{lang === 'es' ? 'Publicaciones' : 'Publishing policy'}</Link><button type="button" onClick={openSettings}>{privacySettings}</button></nav>
    </div>
  </footer>
}
