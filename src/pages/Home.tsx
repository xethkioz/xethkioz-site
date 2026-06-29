import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { useWisp } from '../providers/WispProvider'

type PortalTone = 'games' | 'science' | 'fun'

type PortalNode = {
  tone: PortalTone
  title: string
  kicker: string
  route: string
  cta: string
  description: string
  scene: 'gamer' | 'planet' | 'urban'
}

const portals: PortalNode[] = [
  {
    tone: 'games',
    title: 'GAMES',
    kicker: 'Cyber Gamer District',
    route: '/gaming',
    cta: 'ENTRAR AL PORTAL',
    description: 'Noticias, juegos, builds, streams y comunidad gamer.',
    scene: 'gamer',
  },
  {
    tone: 'science',
    title: 'SCIENCE & TECHNOLOGY',
    kicker: 'Quantum Core Lab',
    route: '/science',
    cta: 'ABRIR NÚCLEO',
    description: 'IA, ciencia, hardware, datos y pensamiento crítico.',
    scene: 'planet',
  },
  {
    tone: 'fun',
    title: 'FUN / MEMES',
    kicker: 'Neon Chaos Alley',
    route: '/fun',
    cta: 'ACTIVAR PORTAL',
    description: 'Memes, clips, humor y contenido social.',
    scene: 'urban',
  },
]

const stats = ['+25K XETHKIOZERS', '1,248 NOTICIAS', '+3.6K CONTENIDO', '24/7 SISTEMA SEGURO']

export default function Home() {
  const { triggerGreenPortal } = useWisp()
  const navigate = useNavigate()

  const touchWisp = () => {
    triggerGreenPortal()
    window.setTimeout(() => navigate('/green-node'), 520)
  }

  return (
    <>
      <SEO
        title="XETHKIOZ Web v1.0 · Nexus Portals"
        description="Interfaz de portales de XETHKIOZ con Games, Science & Technology, Fun/Memes y Green Wisp."
        url="/"
        image="/images/articles/xethkioz-cover.svg"
      />
      <div className="xk-aaa-stage min-h-[100svh] overflow-hidden px-4 pb-28 pt-32 text-white md:px-8 lg:pl-24 lg:pr-8">
        <div className="xk-smoke-layer" aria-hidden="true" />
        <main className="relative z-10 mx-auto grid min-h-[calc(100svh-220px)] max-w-[1660px] grid-cols-1 items-center gap-8 xl:grid-cols-[1fr_320px]">
          <section className="flex flex-col gap-8">
            <div className="max-w-4xl">
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.38em] text-[#32FF8A]">XETHKIOZ NEXUS // PORTAL UI</p>
              <h1 className="mt-4 max-w-5xl text-4xl font-black uppercase leading-[0.95] tracking-[0.08em] text-white drop-shadow-[0_0_28px_rgba(139,92,246,.35)] md:text-6xl xl:text-7xl">
                Gaming Is My Passion
              </h1>
              <p className="mt-5 max-w-2xl font-mono text-xs uppercase tracking-[0.22em] text-[#FFB16D] md:text-sm">
                Beyond The Game · Choose your portal
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {portals.map((portal) => (
                <PortalNodeCard key={portal.title} portal={portal} />
              ))}
            </div>
          </section>

          <aside className="xk-wisp-module justify-self-center xl:justify-self-end" aria-label="Green Wisp Nexus">
            <div className="xk-wisp-module-grid" aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#32FF8A]/70">GREEN WISP</p>
            <div className="xk-green-wisp-orb my-8" aria-hidden="true"><span /></div>
            <p className="max-w-[250px] text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-[#B9FFD1]/80">
              Una señal verde se mueve entre mundos. El acceso oculto responde a los curiosos.
            </p>
            <button type="button" onClick={touchWisp} className="xk-wisp-touch mt-7">
              TOCAR AL WISP
              <small>SOLO PARA CURIOSOS</small>
            </button>
          </aside>
        </main>

        <section className="xk-bottom-stats" aria-label="Estadísticas XETHKIOZ">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {stats.map((item) => <span key={item}>{item}</span>)}
          </div>
          <p>© 2026 Alexis Ivan Diaz Sellanes Santajulia. XETHKIOZ Web v1.0. Todos los derechos reservados.</p>
        </section>
      </div>
    </>
  )
}

function PortalNodeCard({ portal }: { portal: PortalNode }) {
  return (
    <Link to={portal.route} className={`xk-portal-node xk-portal-${portal.tone}`} aria-label={`${portal.cta} ${portal.title}`}>
      <div className="xk-portal-aura" />
      <div className="xk-portal-ring" />
      <div className="xk-portal-inner"><PortalScene scene={portal.scene} /></div>
      <div className="xk-portal-copy">
        <p>{portal.kicker}</p>
        <h2>{portal.title}</h2>
        <span>{portal.description}</span>
        <strong>{portal.cta}</strong>
      </div>
    </Link>
  )
}

function PortalScene({ scene }: { scene: PortalNode['scene'] }) {
  if (scene === 'planet') {
    return <div className="xk-scene-planet" aria-hidden="true"><span className="orbit one" /><span className="orbit two" /><span className="core" /></div>
  }
  if (scene === 'urban') {
    return <div className="xk-scene-urban" aria-hidden="true"><span className="sun" /><span className="tower a" /><span className="tower b" /><span className="tower c" /></div>
  }
  return <div className="xk-scene-gamer" aria-hidden="true"><span className="city a" /><span className="city b" /><span className="avatar" /><span className="head" /><span className="visor" /></div>
}
