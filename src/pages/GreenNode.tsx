import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { greenNodeEntries } from '../lib/mockData'
import GreenNodeCommandConsole from '../components/GreenNodeCommandConsole'
import { greenNodeAccessLog, greenNodeProtocol } from '../lib/networkBlueprint'
import { GREEN_NODE_CONFIG } from '../lib/siteConfig'
import GreenNodeFieldBoard from '../components/GreenNodeFieldBoard'
import { greenNodeMatrix } from '../lib/editorialModel'

const terminalLines = [
  'booting xethkioz-green-node...',
  'loading ubuntu_kernel_notes.md',
  'mount /matrix/linux-programming-security --read-only',
  'mount /archives/conspiracy-research --read-only',
  'osint: ethical_mode=true',
  'cybersecurity: defensive_only=true',
  'network.chrome=isolated',
  'news.rotation=ready_for_cms',
  'access_level: VISITOR',
]

const nodeNav = [
  { href: '#terminal', label: 'Terminal' },
  { href: '#fields', label: 'Módulos' },
  { href: '#protocol', label: 'Protocolo' },
  { href: '#access', label: 'Logs' },
]

export default function GreenNode() {
  return (
    <div className="green-node-shell min-h-screen text-green-100">
      <SEO
        title="Green Node"
        description="XETHKIOZ Green Node: Linux, programación, ciberseguridad educativa, OSINT y misterios documentales con estética hacker cyberpunk."
        url="/green-node"
        image="/images/articles/xethkioz-cover.svg"
      />

      <div className="border-b border-green-400/20 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="font-mono text-sm font-black uppercase tracking-[0.28em] text-green-300 hover:text-green-100">
            ← XETHKIOZ
          </Link>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Green Node navigation">
            {nodeNav.map((item) => (
              <a key={item.href} href={item.href} className="rounded-lg border border-green-400/20 bg-green-400/5 px-3 py-2 font-mono text-xs text-green-300 hover:bg-green-400/10">
                {item.label}
              </a>
            ))}
            <Link to="/network" className="rounded-lg border border-green-400/20 bg-black px-3 py-2 font-mono text-xs text-green-200 hover:border-green-300">
              Network
            </Link>
          </nav>
          <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-green-300">
            public matrix
          </span>
        </div>
      </div>

      <section className="relative min-h-screen overflow-hidden border-b border-green-400/20">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-screen"
          src="/videos/green-node-banner.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,255,102,.18),rgba(0,0,0,.74)_50%,#000_92%)]" />
        <div className="absolute inset-0 green-scanlines" />
        <div className="absolute left-1/2 top-1/2 h-[54vw] max-h-[680px] w-[54vw] max-w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-400/20 shadow-[0_0_120px_rgba(0,255,102,.22),inset_0_0_100px_rgba(0,255,102,.12)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-[1.05fr_.95fr] sm:px-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-green-300">hidden branch / educational mode</p>
            <h1 className="mt-5 font-display text-4xl font-black leading-tight text-green-100 md:text-7xl drop-shadow-[0_0_20px_rgba(0,255,102,.75)]">
              {GREEN_NODE_CONFIG.name}
            </h1>
            <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-green-200/80 md:text-base">
              Programación, Ubuntu, Linux, open source, ciberseguridad defensiva, OSINT responsable y análisis documental de misterios. Este nodo está aislado del portal principal para sentirse como una terminal oculta dentro de XETHKIOZ Network.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#terminal" className="rounded-lg border border-green-300/40 bg-green-400/10 px-5 py-3 font-mono text-sm font-bold text-green-200 shadow-[0_0_22px_rgba(0,255,102,.25)] hover:bg-green-400/20">Abrir terminal</a>
              <Link to="/news-engine" className="rounded-lg border border-green-700/50 bg-black/55 px-5 py-3 font-mono text-sm text-green-300 hover:border-green-300/60">Fuentes externas</Link>
              <Link to="/network" className="rounded-lg border border-green-700/50 bg-black/55 px-5 py-3 font-mono text-sm text-green-300 hover:border-green-300/60">Volver al Network Hub</Link>
            </div>
          </div>

          <div id="terminal" className="rounded-3xl border border-green-400/30 bg-black/85 p-5 shadow-[0_0_45px_rgba(0,255,102,.18)]">
            <div className="mb-4 flex items-center gap-2 border-b border-green-400/20 pb-3">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-auto font-mono text-xs text-green-500">visitor@xethkioz:~</span>
            </div>
            <div className="space-y-2 font-mono text-sm">
              {terminalLines.map((line) => (
                <p key={line}><span className="text-green-500">$</span> <span className="text-green-200">{line}</span></p>
              ))}
              <p className="pt-2 text-green-400 animate-pulse">█</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <section id="fields" className="mb-10 rounded-3xl border border-green-400/20 bg-black/60 p-5">
          <GreenNodeFieldBoard />
        </section>

        <section className="mb-10 rounded-3xl border border-green-400/20 bg-black/60 p-5">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-green-400">technology matrix</p>
              <h2 className="mt-2 font-display text-2xl font-black text-green-100">Green Node 2.0: matriz de conocimiento</h2>
            </div>
            <Link to="/cms" className="rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-2 font-mono text-xs font-bold text-green-200 hover:bg-green-400/20">Conectar con CMS</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {greenNodeMatrix.map((block) => (
              <article key={block.group} className="rounded-2xl border border-green-400/15 bg-green-950/10 p-4">
                <h3 className="font-display text-lg font-black text-green-100">{block.group}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {block.items.map((item) => <span key={item} className="rounded-full border border-green-400/15 bg-black/30 px-2.5 py-1 font-mono text-[10px] text-green-300">{item}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {greenNodeEntries.map((entry) => (
            <article key={entry.id} className="rounded-3xl border border-green-400/20 bg-black/55 p-6 shadow-[0_0_28px_rgba(0,255,102,.08)]">
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-green-300">{entry.category}</span>
                <span className="font-mono text-[10px] text-green-700">node-{entry.id}</span>
              </div>
              <h3 className="font-display text-xl font-black text-green-100">{entry.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-green-100/70">{entry.excerpt}</p>
              <pre className="mt-5 overflow-hidden rounded-2xl border border-green-400/15 bg-green-950/20 p-3 font-mono text-xs text-green-300">{entry.command}</pre>
            </article>
          ))}
        </section>

        <section id="protocol" className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <GreenNodeCommandConsole />
          <div className="rounded-3xl border border-green-400/20 bg-black/55 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-green-400">green protocol</p>
            <h2 className="mt-3 font-display text-2xl font-black text-green-100">Reglas para no romper el enfoque</h2>
            <div className="mt-5 space-y-3">
              {greenNodeProtocol.map((item) => (
                <div key={item} className="rounded-2xl border border-green-400/15 bg-green-950/10 p-4 font-mono text-xs leading-relaxed text-green-100/75">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="access" className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {greenNodeAccessLog.map((item) => (
            <div key={item.event} className="rounded-3xl border border-green-400/20 bg-black/55 p-6 shadow-[0_0_28px_rgba(0,255,102,.08)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-500">access vector</p>
              <h3 className="mt-3 font-display text-xl font-black text-green-100">{item.label}</h3>
              <p className="mt-2 font-mono text-xs text-green-500">{item.event}</p>
              <p className="mt-3 text-sm leading-relaxed text-green-100/70">{item.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-green-400/20 bg-black/55 p-6">
            <h2 className="font-display text-2xl font-black text-green-100">Audio ambiental</h2>
            <p className="mt-3 text-sm leading-relaxed text-green-100/70">
              El enlace de YouTube queda como referencia estética. Para producción se recomienda subir un loop propio o generado por IA sin copyright: drones graves, interferencia, CRT, terminal y suspenso. No se incrusta automáticamente audio externo para evitar copyright y autoplay invasivo.
            </p>
          </div>
          <div className="rounded-3xl border border-green-400/20 bg-black/55 p-6">
            <h2 className="font-display text-2xl font-black text-green-100">Easter eggs activos</h2>
            <p className="mt-3 font-mono text-sm text-green-300">sudo truth · whoami · matrix · ubuntu · 42 · greennode · wisp</p>
            <p className="mt-3 text-sm leading-relaxed text-green-100/70">
              El Wisp verde es la entrada principal. Green Node no vive en el menú común: se descubre, se activa y queda como experiencia paralela.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
