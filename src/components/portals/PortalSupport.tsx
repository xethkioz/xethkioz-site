import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
import { usePrivacyConsent } from '../../lib/PrivacyConsentContext'
import { DONATION_LINKS, SOCIAL_LINKS, SITE_VERSION } from '../../lib/siteConfig'

function SocialIcon({ name }: { name: string }) {
  const common = { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, 'aria-hidden': true as const }
  if (name === 'Instagram') return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>
  if (name === 'Threads') return <svg {...common}><path d="M19 7c-1-4-12-7-14 3-2 10 9 15 14 8 4-6-6-12-10-6-3 5 9 6 6-4-1-3-5-3-6-1"/></svg>
  if (name === 'TikTok Principal') return <svg {...common}><path d="M14 3v13a4 4 0 1 1-4-4M14 3c.4 3.8 2.8 5.5 6 5.5" strokeWidth="2.2"/></svg>
  if (name === 'Facebook') return <svg {...common}><path d="M14 21v-9h3l.7-4H14V6.5c0-1.7 1.3-1.8 3.7-1.7V1.5C12 1 9.5 2.8 9.5 7.3V8H7v4h2.5v9" fill="currentColor" stroke="none"/></svg>
  return <svg {...common}><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 6 3-6 3Z" fill="currentColor" stroke="none"/></svg>
}

export default function PortalSupport() {
  const { lang, localizePath } = useLang()
  const { openSettings } = usePrivacyConsent()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const es = lang === 'es'
  const channels = SOCIAL_LINKS.filter(item => ['Instagram', 'Threads', 'TikTok Principal', 'Facebook', 'YouTube'].includes(item.name))
  async function copyAlias() {
    try { await navigator.clipboard.writeText('xethkioz'); setCopied(true); setCopyError(false) }
    catch { setCopyError(true) }
  }
  return <footer className="portal-footer" aria-label={es ? 'Colaboración, redes y derechos' : 'Support, social channels and rights'}>
    <div className="portal-footer__community">
      <section className="portal-donations" aria-labelledby="portal-support-title">
        <h2 id="portal-support-title">{es ? 'Colaborá con XETHKIOZ' : 'Support XETHKIOZ'}</h2>
        <div className="portal-donations__buttons">
          <a className="portal-paypal" href={DONATION_LINKS.paypal} target="_blank" rel="noopener noreferrer" aria-label={es ? 'Aportar con PayPal, abre un sitio externo' : 'Support with PayPal, opens an external website'}><b aria-hidden="true">P</b><span>PayPal</span><small aria-hidden="true">↗</small></a>
          <a className="portal-mercadopago" href={DONATION_LINKS.mercadoPago} target="_blank" rel="noopener noreferrer" aria-label={es ? 'Aportar con Mercado Pago, abre un sitio externo' : 'Support with Mercado Pago, opens an external website'}><svg viewBox="0 0 32 24" width="30" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><ellipse cx="16" cy="12" rx="14" ry="10"/><path d="m3 12 7-4 6 2 5-2 8 4M10 8l-3 8 5 3 4-3 4 2 4-5-7-4-4 4-3-1"/></svg><span>mercado pago</span><small aria-hidden="true">↗</small></a>
        </div>
        <div className="portal-donations__note"><small>{es ? 'Aporte voluntario. No es una preventa.' : 'Voluntary support. Not a preorder.'}</small><Link to={localizePath('/support')}>{es ? 'Sobre los aportes' : 'About contributions'}</Link><button type="button" onClick={copyAlias}>{copied ? (es ? 'Alias copiado ✓' : 'Alias copied ✓') : 'Alias: xethkioz ⧉'}</button></div>
        <span className="sr-only" role="status">{copyError ? (es ? 'No se pudo copiar. El alias es xethkioz.' : 'Copy failed. The alias is xethkioz.') : copied ? (es ? 'Alias xethkioz copiado.' : 'Alias xethkioz copied.') : ''}</span>
      </section>
      <nav className="portal-socials" aria-label={es ? 'Redes oficiales de XETHKIOZ' : 'Official XETHKIOZ social channels'}>
        {channels.map(item => <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" title={item.handle}><span><SocialIcon name={item.name}/></span><small>{item.name === 'TikTok Principal' ? 'TikTok' : item.name}</small></a>)}
      </nav>
    </div>
    <div className="portal-footer__rights"><span>XETHKIOZ © {new Date().getFullYear()} · InnerCircle Community · {es ? 'Todos los derechos reservados.' : 'All rights reserved.'}</span><nav aria-label={es ? 'Información legal' : 'Legal information'}><a href="https://www.xethkioz.com.ar">xethkioz.com.ar</a><Link to={localizePath('/privacy')}>{es ? 'Privacidad' : 'Privacy'}</Link><button type="button" onClick={openSettings}>Cookies</button><small>{SITE_VERSION}</small></nav></div>
  </footer>
}
