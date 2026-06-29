import { Link, useNavigate } from 'react-router-dom'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import { useWisp } from '../providers/WispProvider'

const nav = [
  { to: '/', label: 'HOME' },
  { to: '/gaming', label: 'GAMES' },
  { to: '/science', label: 'SCIENCE & TECH' },
  { to: '/fun', label: 'FUN' },
]

const rail = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/gaming', label: 'Juegos', icon: '🎮' },
  { to: '/science', label: 'Ciencia', icon: '◈' },
  { to: '/fun', label: 'Memes', icon: '☻' },
]

export default function Header() {
  const { lang, setLang } = useLang()
  const { account, toggleAccount } = useHud()
  const { triggerGreenPortal } = useWisp()
  const navigate = useNavigate()

  const switchLang = () => setLang(lang === 'es' ? 'en' : 'es')
  const openGreen = () => {
    triggerGreenPortal()
    window.setTimeout(() => navigate('/green-node'), 420)
  }

  return (
    <>
      <aside className="fixed left-4 top-1/2 z-[72] hidden -translate-y-1/2 flex-col gap-3 rounded-[2rem] border border-white/10 bg-black/45 p-2 shadow-[0_0_34px_rgba(139,92,246,.22)] backdrop-blur-xl md:flex" aria-label="XETHKIOZ launcher">
        {rail.map((item) => (
          <Link key={item.to} to={item.to} className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.035] text-lg text-white transition hover:border-[#8B5CF6] hover:shadow-[0_0_18px_rgba(139,92,246,.55)]" title={item.label}>
            {item.icon}
          </Link>
        ))}
        <button type="button" onClick={openGreen} className="grid h-12 w-12 place-items-center rounded-2xl border border-[#32FF8A]/35 bg-[#32FF8A]/10 text-lg text-[#32FF8A] transition hover:border-[#32FF8A] hover:shadow-[0_0_20px_rgba(50,255,138,.65)]" title="Green Node">
          ✦
        </button>
      </aside>

      <header className="xk-aaa-header pointer-events-none fixed inset-x-0 top-0 z-[65] px-4 py-4 md:px-8" aria-label="XETHKIOZ navegación principal">
        <div className="pointer-events-auto mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-4 rounded-[2rem] border border-white/10 bg-black/28 px-4 py-3 shadow-[0_0_28px_rgba(0,0,0,.35)] backdrop-blur-xl lg:grid-cols-[auto_1fr_auto] lg:px-6">
          <Link to="/" className="xk-broken-logo justify-self-start font-black uppercase leading-none tracking-[0.08em] text-3xl md:text-4xl" aria-label="XETHKIOZ Home">
            XETHKIOZ
          </Link>

          <nav className="hidden justify-self-center rounded-full border border-white/10 bg-black/35 px-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gray-300 lg:flex" aria-label="Top nav">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} className="rounded-full px-4 py-2 transition hover:bg-[#8B5CF6]/15 hover:text-white hover:shadow-[0_0_14px_rgba(139,92,246,.35)]">
                {item.label}
              </Link>
            ))}
            <button type="button" onClick={openGreen} className="rounded-full px-4 py-2 text-[#32FF8A] transition hover:bg-[#32FF8A]/10 hover:shadow-[0_0_14px_rgba(50,255,138,.45)]">
              WISP NEXUS
            </button>
          </nav>

          <div className="flex justify-self-end gap-2 font-mono text-[11px] font-black uppercase tracking-[0.16em]">
            <button type="button" onClick={switchLang} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-white transition hover:border-[#8B5CF6] hover:text-[#8B5CF6]">
              {lang.toUpperCase()}
            </button>
            <button type="button" onClick={toggleAccount} className="rounded-full border border-[#FF6B1A]/40 bg-[#FF6B1A]/10 px-3 py-2 text-[#FFB47A] transition hover:border-[#FF6B1A] hover:text-white">
              {account.status === 'connected' ? account.name : 'LOGIN'}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
