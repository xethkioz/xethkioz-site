import { Link } from 'react-router-dom'
import { GREEN_NODE_EASTER_EGGS, LIVE_INTERNAL_LINKS, NETWORK_SECTORS_DETAILED, SOCIAL_LINKS } from '../lib/siteConfig'

const statusTone: Record<string, string> = {
  'core-live': 'border-orange/40 bg-orange/10 text-orange',
  'formal-division': 'border-sky-300/40 bg-sky-300/10 text-sky-200',
  'hidden-egg': 'border-green-300/40 bg-green-400/10 text-green-200',
  planned: 'border-cyan-300/40 bg-cyan-300/10 text-cyan-200',
  branch: 'border-neon/40 bg-neon/10 text-neon',
  foundation: 'border-white/20 bg-white/5 text-gray-200',
}

export default function NetworkIntegrityPanel() {
  return (
    <section className="space-y-6">
      <div className="glass rounded-3xl border border-white/10 p-5 md:p-7">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-eyebrow">Network Integrity</p>
            <h2 className="font-display text-2xl md:text-4xl font-black text-white">Revisión modular del ecosistema</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
              Esta capa deja documentado qué función cumple cada sector, qué estilo visual debe respetar y qué queda pendiente antes de publicar LIVE.
            </p>
          </div>
          <span className="w-fit rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-green-300">
            RC1.4 audit ready
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {NETWORK_SECTORS_DETAILED.map((sector) => (
            <Link key={sector.id} to={sector.route} className="group rounded-2xl border border-white/10 bg-black/25 p-5 transition-all hover:-translate-y-1 hover:border-orange/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-3xl">{sector.icon}</span>
                  <h3 className="mt-3 font-display text-xl font-black text-white group-hover:text-orange">{sector.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">{sector.tone}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${statusTone[sector.status] || statusTone.foundation}`}>
                  {sector.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {sector.focus.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-gray-300">{item}</span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-400"><strong className="text-gray-200">Próximo:</strong> {sector.next}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <div className="glass rounded-3xl border border-white/10 p-5 md:p-6">
          <p className="section-eyebrow">Live Links</p>
          <h2 className="font-display text-2xl font-black text-white">Rutas internas críticas</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
            {LIVE_INTERNAL_LINKS.map((route) => (
              <Link key={route} to={route} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 font-mono text-xs text-gray-300 transition hover:border-orange/40 hover:text-orange">
                {route}
              </Link>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-orange/20 bg-orange/5 p-4 text-sm leading-relaxed text-gray-300">
            Regla: si una ruta aparece en header, footer, cards o CTA, debe estar registrada acá o en el sitemap antes de hacer deploy LIVE.
          </div>
        </div>

        <div className="glass rounded-3xl border border-white/10 p-5 md:p-6">
          <p className="section-eyebrow">Social Links</p>
          <h2 className="font-display text-2xl font-black text-white">Redes oficiales centralizadas</h2>
          <div className="mt-4 space-y-2">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm transition hover:border-neon/40">
                <span className="text-gray-200"><span className="mr-2">{link.icon}</span>{link.name}</span>
                <span className="font-mono text-xs text-gray-500">{link.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl border border-green-300/20 bg-green-950/10 p-5 md:p-6">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-green-300">Green Node EGG Matrix</p>
        <h2 className="mt-2 font-display text-2xl font-black text-green-100">Wisp, portal y comandos secretos</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {GREEN_NODE_EASTER_EGGS.map((egg) => (
            <div key={egg.trigger} className="rounded-2xl border border-green-300/15 bg-black/45 p-4">
              <div className="flex items-center justify-between gap-2">
                <strong className="font-mono text-green-200">{egg.trigger}</strong>
                <span className="rounded-full border border-green-300/20 bg-green-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-green-300">{egg.state}</span>
              </div>
              <p className="mt-2 text-sm text-green-100/70">{egg.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-green-500/80">{egg.effect}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
