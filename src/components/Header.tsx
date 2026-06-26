import { useState } from 'react'
import { type Lang } from '../lib/i18n'
import { useLang } from '../lib/LangContext'

export default function Header() {
  const { lang, setLang } = useLang()
  const [soundOn, setSoundOn] = useState(false)

  const nextLang: Record<Lang, Lang> = {
    es: 'en',
    en: 'es',
  }

  return (
    <header className="fixed right-3 top-3 z-50 sm:right-5 sm:top-5" aria-label="Controles XETHKIOZ">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/55 p-1.5 shadow-[0_0_26px_rgba(138,46,255,.16)] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setLang(nextLang[lang])}
          className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-gray-100 transition hover:border-orange hover:text-orange"
          aria-label="Cambiar idioma"
        >
          {lang.toUpperCase()}
        </button>
        <button
          type="button"
          onClick={() => setSoundOn((value) => !value)}
          className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-gray-100 transition hover:border-neon hover:text-neon"
          aria-label={soundOn ? 'Desactivar sonido' : 'Activar sonido'}
          title="Audio base preparado para V7"
        >
          {soundOn ? 'ON' : 'OFF'}
        </button>
        <a
          href="/admin"
          className="rounded-full border border-orange/30 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-orange transition hover:bg-orange/10"
          aria-label="Cuenta o administración"
        >
          Cuenta
        </a>
      </div>
    </header>
  )
}
