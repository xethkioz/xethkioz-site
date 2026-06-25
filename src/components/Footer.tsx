import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import Logo from './Logo'
import Newsletter from './Newsletter'
import { SITE_BUILD_DATE, SITE_RELEASE, SITE_VERSION, SOCIAL_LINKS } from '../lib/siteConfig'
export default function Footer() {
  const { t } = useLang()
  const quickLinks = [{ to: '/news', label: t.nav.news }, { to: '/streaming', label: t.nav.streaming }, { to: '/media', label: t.nav.media }, { to: '/community', label: t.nav.community }, { to: '/about', label: t.nav.about }, { to: '/contact', label: t.nav.contact }, { to: '/support', label: 'Apoyar / Sponsors' }, { to: '/authors', label: t.author.title }]
  const portals = [{ to: '/gaming', label: t.nav.gaming }, { to: '/tech', label: t.nav.tech }, { to: '/science', label: t.nav.science }]
  const monetization = [t.footer.store, t.footer.affiliateLinks, t.footer.sponsored, t.footer.donations, t.footer.premium, t.footer.podcast]
  const socials = SOCIAL_LINKS
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-ink-300">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <Newsletter />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <div><Logo size="md" /><p className="mt-4 text-sm text-gray-400 leading-relaxed">{t.footer.tagline}</p><div className="mt-4 flex flex-col gap-2"><Link to="/support" className="btn-primary text-center text-sm">Apoyar XETHKIOZ</Link><Link to="/creator" className="btn-secondary text-center text-sm">Crear cuenta</Link></div><div className="mt-4 flex flex-wrap gap-2">{socials.map((s) => <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium text-gray-300 border border-white/10 rounded-md hover:border-orange hover:text-orange transition-all">{s.name}</a>)}</div></div>
          <div><h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4">{t.footer.quickLinks}</h3><ul className="space-y-2">{quickLinks.map((l) => <li key={l.to}><Link to={l.to} className="text-sm text-gray-400 hover:text-orange transition-colors">{l.label}</Link></li>)}</ul></div>
          <div><h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4">{t.footer.portals}</h3><ul className="space-y-2">{portals.map((l) => <li key={l.to}><Link to={l.to} className="text-sm text-gray-400 hover:text-orange transition-colors">{l.label}</Link></li>)}</ul><h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-3 mt-6">{t.footer.monetization}</h3><ul className="space-y-2">{monetization.map((f) => <li key={f} className="text-sm text-gray-500 flex items-center gap-1.5"><span className="w-1 h-1 bg-orange/50 rounded-full" />{f}</li>)}</ul></div>
          <div><h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4">{t.footer.connect}</h3><p className="text-sm text-gray-400 mb-4">🔥 1.6M+ views on Threads</p><div className="flex flex-wrap gap-2">{socials.map((s) => <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-lg hover:border-neon hover:bg-neon/10 transition-all"><span className="text-sm">{s.icon}</span></a>)}</div></div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} XETHKIOZ. {t.footer.rights}</p>
            <p className="mt-1 text-[11px] text-gray-600">Versión {SITE_VERSION} · {SITE_RELEASE} · Build {SITE_BUILD_DATE}</p>
          </div>
          <p className="text-xs text-gray-500 font-display tracking-wider">GAMING • TECH • SCIENCE • STREAMING</p>
        </div>
      </div>
    </footer>
  )
}
