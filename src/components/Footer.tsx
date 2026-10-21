import { Link } from 'react-router-dom'
import { usePrivacyConsent } from '../lib/PrivacyConsentContext'
export default function Footer() {
  const { openSettings } = usePrivacyConsent()
  return <footer className="border-t border-slate-200 bg-white px-6 py-8 text-slate-600">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 text-xs">
      <span>© {new Date().getFullYear()} XETHKIOZ · Creá, compartí, descubrí.</span>
      <nav aria-label="Información legal" className="flex flex-wrap gap-5"><Link to="/explorar">Explorar</Link><Link to="/privacy">Privacidad</Link><Link to="/editorial-policy">Publicaciones</Link><button type="button" onClick={openSettings}>Cookies</button></nav>
    </div>
  </footer>
}
