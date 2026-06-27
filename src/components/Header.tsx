import { Link } from 'react-router-dom'
import { type Lang } from '../lib/i18n'
import { useLang } from '../lib/LangContext'
import { useHud } from '../lib/HudContext'
import { FUSION_LABEL } from '../lib/fusionConfig'

export default function Header() {
  const { lang, setLang, t } = useLang()
  const { soundOn, toggleSound, volume, setVolume, account, toggleAccount } = useHud()
  const nextLang: Record<Lang, Lang> = { es: 'en', en: 'es' }
  const accountText = account.status === 'connected' ? account.name : t.v7.controls.login

  return (
    <header className="fixed right-3 top-3 z-50 sm:right-5 sm:top-5" aria-label={t.v7.controls.panel}>
      <div className="xeth-control-panel fusion-hud-panel flex items-center gap-2 rounded-full border border-white/10 bg-black/65 p-1.5 shadow-[0_0_26px_rgba(138,46,255,.16)] backdrop-blur-xl">
        <span className="hidden rounded-full border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-green-200/80 xl:inline-flex" title={FUSION_LABEL}>
          {FUSION_LABEL}
        </span>
        <nav className="fusion-hud-nav hidden items-center gap-1 lg:flex" aria-label="Fusion quick nav">
          <Link to="/news">NEWS</Link>
          <Link to="/community">COM</Link>
          <Link to="/profile">XP</Link>
          <Link to="/cms">CMS</Link>
        </nav>
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
          onClick={toggleSound}
          className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-gray-100 transition hover:border-neon hover:text-neon focus:outline-none focus:ring-2 focus:ring-neon/50"
          aria-label={soundOn ? t.v7.controls.soundOff : t.v7.controls.soundOn}
          title={t.v7.controls.soundTitle}
        >
          {soundOn ? t.v7.controls.on : t.v7.controls.off}
        </button>
        <label className="fusion-volume-control hidden items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-gray-300 md:inline-flex" title={t.v7.controls.soundTitle}>
          <span>{Math.round(volume * 100)}</span>
          <input
            aria-label={t.v7.controls.volume}
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </label>
        <button
          type="button"
          onClick={toggleAccount}
          className="fusion-account-button rounded-full border border-orange/30 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-orange/90 transition hover:bg-orange/10 focus:outline-none focus:ring-2 focus:ring-orange/40"
          aria-label={account.status === 'connected' ? t.v7.controls.accountConnected : t.v7.controls.login}
          title={account.status === 'connected' ? t.v7.controls.accountConnected : t.v7.controls.accountPending}
        >
          {accountText}
        </button>
      </div>
    </header>
  )
}
