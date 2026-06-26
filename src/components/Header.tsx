import { useState } from 'react'
import { type Lang } from '../lib/i18n'
import { useLang } from '../lib/LangContext'

export default function Header() {
  const { lang, setLang, t } = useLang()
  const [soundOn, setSoundOn] = useState(false)
  const nextLang: Record<Lang, Lang> = { es: 'en', en: 'es' }

  return (
    <header className="fixed right-3 top-3 z-50 sm:right-5 sm:top-5" aria-label={t.v7.controls.panel}>
      <div className="xeth-control-panel flex items-center gap-2 rounded-full border border-white/10 bg-black/65 p-1.5 shadow-[0_0_26px_rgba(138,46,255,.16)] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setLang(nextLang[lang])}
          className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-gray-100 transition hover:border-orange hover:text-orange focus:outline-none focus:ring-2 focus:ring-orange/50"
          aria-label={t.v7.controls.language}
          title={t.v7.controls.language}
        >
          {lang.toUpperCase()}
        </button>
        <button
          type="button"
          onClick={() => setSoundOn((value) => !value)}
          className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-gray-100 transition hover:border-neon hover:text-neon focus:outline-none focus:ring-2 focus:ring-neon/50"
          aria-label={soundOn ? t.v7.controls.soundOff : t.v7.controls.soundOn}
          title={t.v7.controls.soundTitle}
        >
          {soundOn ? t.v7.controls.on : t.v7.controls.off}
        </button>
        <button
          type="button"
          className="rounded-full border border-orange/30 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-orange/90 transition hover:bg-orange/10 focus:outline-none focus:ring-2 focus:ring-orange/40"
          aria-label={t.v7.controls.account}
          title={t.v7.controls.accountPending}
        >
          {t.v7.controls.account}
        </button>
      </div>
    </header>
  )
}
