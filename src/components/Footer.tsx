import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import { SOCIAL_LINKS } from '../lib/siteConfig'

const copy = {
  es: {
    description: 'Gaming, tecnología, ciencia, humor y archivos extraños conectados por una Red de Portales independiente creada en Argentina.',
    support: 'Apoyar el proyecto',
    informationLabel: 'Información',
    trust: 'Confianza',
    about: 'Quiénes somos',
    editorial: 'Política editorial',
    privacy: 'Privacidad y cookies',
    contact: 'Contacto y sponsors',
    socialLabel: 'Redes',
    external: 'Señales externas',
    rss: 'RSS de noticias',
    rights: 'Todos los derechos reservados.',
  },
  en: {
    description: 'Gaming, technology, science, humor and unusual archives connected through an independent Portal Network created in Argentina.',
    support: 'Support the project',
    informationLabel: 'Information',
    trust: 'Trust',
    about: 'About us',
    editorial: 'Editorial policy',
    privacy: 'Privacy and cookies',
    contact: 'Contact and sponsors',
    socialLabel: 'Social networks',
    external: 'External signals',
    rss: 'News RSS feed',
    rights: 'All rights reserved.',
  },
} as const

export default function Footer() {
  const { lang } = useLang()
  const t = copy[lang]

  return (
    <footer className="xk-footer-clean border-t border-white/10 bg-[#0A0A0F] px-5 py-10 text-gray-400">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <p className="font-black tracking-[.14em] text-white">XETHKIOZ</p>
          <span className="mt-3 block max-w-md text-sm leading-6">{t.description}</span>
          <Link to="/support" className="mt-4 inline-flex font-mono text-[10px] font-black uppercase tracking-[.16em] text-orange-300">{t.support} →</Link>
        </div>

        <nav aria-label={t.informationLabel}>
          <p className="font-mono text-[10px] font-black uppercase tracking-[.18em] text-violet-300">{t.trust}</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link to="/about">{t.about}</Link>
            <Link to="/editorial-policy">{t.editorial}</Link>
            <Link to="/privacy">{t.privacy}</Link>
            <Link to="/contact">{t.contact}</Link>
          </div>
        </nav>

        <nav aria-label={t.socialLabel}>
          <p className="font-mono text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">{t.external}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {SOCIAL_LINKS.filter((item) => item.name !== 'Web').slice(0, 6).map((item) => <a key={item.name} href={item.url} target="_blank" rel="noreferrer noopener">{item.name}</a>)}
          </div>
          <a href="/feed.xml" className="mt-3 inline-flex text-sm text-orange-200">{t.rss}</a>
        </nav>
      </div>

      <p className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-center font-mono text-[9px] uppercase tracking-[0.12em]">© 2026 Alexis Ivan Diaz Sellanes Santajulia · XETHKIOZ · {t.rights}</p>
    </footer>
  )
}
