import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { useWisp } from '../providers/WispProvider'

type Portal = {
  title: string
  subtitle: string
  route: string
  video: string
  icon: string
  ring: string
  shadow: string
  text: string
}

const portals: Portal[] = [
  {
    title: 'JUEGOS',
    subtitle: 'Noticias · Guías · Videos · Imágenes',
    route: '/gaming',
    video: '/assets/portal-games.mp4',
    icon: '🎮',
    ring: 'ring-purple-500',
    shadow: 'shadow-[0_0_60px_rgba(139,92,246,0.8)] hover:shadow-[0_0_95px_rgba(139,92,246,1)]',
    text: 'text-purple-300',
  },
  {
    title: 'CIENCIA Y TECNOLOGÍA',
    subtitle: 'Física · Tecnología · IA · Proyectos',
    route: '/science',
    video: '/assets/portal-science.mp4',
    icon: '⚛',
    ring: 'ring-cyan-400',
    shadow: 'shadow-[0_0_60px_rgba(34,211,238,0.8)] hover:shadow-[0_0_95px_rgba(34,211,238,1)]',
    text: 'text-cyan-300',
  },
  {
    title: 'DIVERSIÓN',
    subtitle: 'Memes · Videos · Arte · Humor',
    route: '/fun',
    video: '/assets/portal-fun.mp4',
    icon: '☻',
    ring: 'ring-orange-400',
    shadow: 'shadow-[0_0_60px_rgba(251,146,60,0.8)] hover:shadow-[0_0_95px_rgba(251,146,60,1)]',
    text: 'text-orange-300',
  },
]

const navItems = [
  { label: 'HOME', to: '/' },
  { label: 'JUEGOS', to: '/gaming' },
  { label: 'CIENCIA & TECH', to: '/science' },
  { label: 'DIVERSIÓN', to: '/fun' },
]

const sideItems = [
  { label: 'Inicio', to: '/', icon: '⌂' },
  { label: 'Juegos', to: '/gaming', icon: '🎮' },
  { label: 'Ciencia', to: '/science', icon: '⚛' },
  { label: 'Diversión', to: '/fun', icon: '☻' },
]

export default function Home() {
  const navigate = useNavigate()
  const { triggerGreenPortal } = useWisp()

  const openWisp = () => {
    triggerGreenPortal()
    window.setTimeout(() => navigate('/green-node'), 450)
  }

  return (
    <>
      <SEO
        title="XETHKIOZ Web v1.0 · Ecosistema"
        description="Web inmersiva de XETHKIOZ con portales vivos, Green Wisp y navegación AAA."
        url="/"
        image="/assets/xethkioz-cover.png"
      />

      <section className="relative min-h-[100svh] overflow-hidden bg-[#0A0A0F] text-white">
        <video
          className="fixed inset-0 -z-50 h-full w-full object-cover"
          src="/assets/bg-dragon-animated.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />

        <div className="fixed inset-0 -z-40 bg-black/60" />
        <div className="fixed inset-0 -z-30 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),transparent_38%,#0A0A0F_92%)]" />
        <div className="xk-noise fixed inset-0 -z-20 opacity-[0.17]" />

        <LeftLauncher onWisp={openWisp} />

        <header className="relative z-30 flex items-center justify-between px-5 py-5 md:px-10 lg:px-14">
          <Link to="/" className="group">
            <div className="text-4xl font-black italic tracking-tight md:text-5xl">
              <span className="bg-gradient-to-br from-orange-500 via-orange-300 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(255,107,26,0.65)]">
                X
              </span>
              <span className="bg-gradient-to-r from-purple-300 via-purple-500 to-violet-700 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(139,92,246,0.7)]">
                ETHKIOZ
              </span>
            </div>
            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-white/70">
              Gaming Is My Passion · Beyond The Game
            </p>
          </Link>

          <nav className="hidden rounded-full border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-xl lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10 hover:text-orange-300"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={openWisp}
              className="rounded-full px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-green-300 transition hover:bg-green-400/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
            >
              WISP NEXUS
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden h-11 w-11 place-items-center rounded-xl border border-white/10 bg-black/30 backdrop-blur-xl transition hover:border-orange-400/60 hover:shadow-[0_0_20px_rgba(251,146,60,0.4)] md:grid">
              ⌕
            </button>
            <button className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] backdrop-blur-xl transition hover:border-purple-400">
              ES
            </button>
            <Link
              to="/login"
              className="rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-purple-200 backdrop-blur-xl transition hover:bg-purple-500/20 hover:shadow-[0_0_22px_rgba(139,92,246,0.55)]"
            >
              Login
            </Link>
          </div>
        </header>

        <main className="relative z-20 mx-auto grid min-h-[calc(100svh-170px)] max-w-[1680px] grid-cols-1 gap-8 px-5 pb-36 pt-6 md:px-10 lg:grid-cols-[1fr_340px] lg:px-14">
          <section className="flex flex-col justify-center">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-black uppercase tracking-[0.38em] text-green-300 drop-shadow-[0_0_14px_rgba(34,197,94,0.8)]">
                Bienvenido al ecosistema
              </p>

              <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.92] tracking-[0.04em] md:text-7xl lg:text-8xl">
                <span className="block text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.35)]">
                  El gaming
                </span>
                <span className="block bg-gradient-to-r from-orange-400 via-purple-400 to-violet-700 bg-clip-text text-transparent drop-shadow-[0_0_34px_rgba(139,92,246,0.65)]">
                  es mi pasión
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
                Tres portales. Un universo. Miles de historias por descubrir.
              </p>

              <button className="mt-8 rounded-xl border border-orange-400/60 bg-orange-500/10 px-7 py-4 font-mono text-sm font-black uppercase tracking-[0.18em] text-orange-300 shadow-[0_0_28px_rgba(251,146,60,0.28)] transition hover:scale-[1.03] hover:bg-orange-500/20 hover:shadow-[0_0_45px_rgba(251,146,60,0.55)]">
                Explorar ecosistema →
              </button>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {portals.map((portal) => (
                <PortalCard key={portal.title} portal={portal} />
              ))}
            </div>
          </section>

          <WispPanel onClick={openWisp} />
        </main>

        <StatsBar />
      </section>
    </>
  )
}

function PortalCard({ portal }: { portal: Portal }) {
  return (
    <Link to={portal.route} className="group block">
      <article
        className={[
          'relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-full ring-4',
          portal.ring,
          portal.shadow,
          'transition-all duration-300 ease-out hover:scale-105',
        ].join(' ')}
      >
        <video
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
          src={portal.video}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.76)_78%)]" />

        <div className="absolute inset-x-0 top-8 z-10 flex justify-center">
          <div className="grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-black/35 text-3xl backdrop-blur-md">
            {portal.icon}
          </div>
        </div>

        <div className="absolute inset-x-7 bottom-8 z-10 text-center">
          <h2 className={`text-3xl font-black uppercase italic tracking-[0.08em] ${portal.text}`}>
            {portal.title}
          </h2>
          <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/85">
            {portal.subtitle}
          </p>

          <div className="mt-7 rounded-xl border border-current bg-black/35 px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.16em] backdrop-blur-md transition group-hover:bg-white/10">
            Entrar al portal →
          </div>
        </div>
      </article>
    </Link>
  )
}

function WispPanel({ onClick }: { onClick: () => void }) {
  return (
    <aside className="relative hidden self-center overflow-hidden rounded-[2rem] border border-green-500/30 bg-black/35 p-7 shadow-[0_0_50px_rgba(34,197,94,0.25)] backdrop-blur-md lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.16),transparent_60%)]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.34em] text-green-300">
          Green Wisp
        </p>

        <img
          src="/assets/green-wisp.png"
          alt="Green Wisp"
          className="animate-float my-8 h-40 w-40 object-contain drop-shadow-[0_0_45px_rgba(34,197,94,0.95)]"
          draggable={false}
        />

        <p className="max-w-[240px] text-sm leading-relaxed text-white/75">
          Soy tu guía. Hay secretos que solo los curiosos encuentran.
        </p>

        <button
          type="button"
          onClick={onClick}
          className="mt-7 rounded-xl border border-green-400/60 bg-green-500/15 px-6 py-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-green-100 shadow-[0_0_28px_rgba(34,197,94,0.45)] transition hover:scale-105 hover:bg-green-500/25 hover:shadow-[0_0_50px_rgba(34,197,94,0.85)]"
        >
          Tocar al Wisp
          <span className="mt-1 block text-[9px] text-yellow-300">Solo para curiosos</span>
        </button>
      </div>
    </aside>
  )
}

function LeftLauncher({ onWisp }: { onWisp: () => void }) {
  return (
    <aside className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 rounded-[1.6rem] border border-white/10 bg-black/35 p-2 shadow-[0_0_30px_rgba(139,92,246,0.25)] backdrop-blur-xl md:flex">
      {sideItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          title={item.label}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/40 text-xl text-white/75 transition hover:border-purple-400 hover:text-purple-200 hover:shadow-[0_0_22px_rgba(139,92,246,0.65)]"
        >
          {item.icon}
        </Link>
      ))}

      <button
        type="button"
        onClick={onWisp}
        title="Green Node"
        className="grid h-12 w-12 place-items-center rounded-2xl border border-green-500/40 bg-green-500/10 text-xl text-green-300 transition hover:border-green-300 hover:shadow-[0_0_25px_rgba(34,197,94,0.8)]"
      >
        ✦
      </button>
    </aside>
  )
}

function StatsBar() {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/70 px-5 py-4 font-mono text-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1680px] flex-col items-center justify-between gap-3 text-center md:flex-row">
        <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-xs uppercase tracking-[0.18em]">
          <span>+25K XETHKIOZERS</span>
          <span>1,248 NOTICIAS</span>
          <span>+3.6K CONTENIDO</span>
          <span>24/7 SISTEMA SEGURO</span>
        </div>

        <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">
          © 2026 Alexis Ivan Diaz Sellanes Santajulia. XETHKIOZ Web v1.0. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
