import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
import { useAdminSession } from '../hooks'

const copy = {
  es: {
    protected: 'Panel protegido',
    title: 'CMS Profesional XETHKIOZ',
    user: 'usuario',
    viewWeb: 'Ver web',
    viewWebLabel: 'Abrir la web pública de XETHKIOZ',
    logout: 'Salir',
    logoutLabel: 'Cerrar sesión del CMS',
    switchLanguage: 'Cambiar a inglés',
    switchCode: 'EN',
  },
  en: {
    protected: 'Protected dashboard',
    title: 'XETHKIOZ Professional CMS',
    user: 'user',
    viewWeb: 'View website',
    viewWebLabel: 'Open the public XETHKIOZ website',
    logout: 'Sign out',
    logoutLabel: 'Sign out of the CMS',
    switchLanguage: 'Switch to Spanish',
    switchCode: 'ES',
  },
} as const

export default function CmsHeader() {
  const { user, role, tier, logout } = useAdminSession()
  const { lang, setLang } = useLang()
  const t = copy[lang]

  return (
    <header className="border-b border-purple-500/20 bg-slate-950/80 px-5 py-4 text-white backdrop-blur-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.protected}</p>
          <h1 className="mt-1 text-xl font-black md:text-2xl">{t.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-2 text-purple-100">
            {user?.email ?? t.user}
          </span>
          <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-2 font-black uppercase tracking-[0.14em] text-orange-100">
            {role} · {tier}
          </span>
          <button
            type="button"
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            aria-label={t.switchLanguage}
            title={t.switchLanguage}
            className="rounded-full border border-cyan-400/35 bg-cyan-400/[0.06] px-4 py-2 font-bold text-cyan-100 transition hover:bg-cyan-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            {t.switchCode}
          </button>
          <Link aria-label={t.viewWebLabel} className="rounded-full border border-purple-400/30 px-4 py-2 font-bold text-purple-100 transition hover:bg-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300" to="/">
            {t.viewWeb}
          </Link>
          <button aria-label={t.logoutLabel} className="rounded-full border border-orange-400/50 bg-orange-500/10 px-4 py-2 font-bold text-orange-100 transition hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300" type="button" onClick={() => void logout()}>
            {t.logout}
          </button>
        </div>
      </div>
    </header>
  )
}
