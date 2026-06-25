import { Link } from 'react-router-dom'
import { XETHKIOZ_NETWORK_PORTALS } from '../lib/siteConfig'

const accentClasses: Record<string, string> = {
  orange: 'border-orange/30 bg-orange/10 text-orange',
  blue: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  green: 'border-green-400/30 bg-green-400/10 text-green-300',
  red: 'border-red-400/30 bg-red-400/10 text-red-300',
  cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  purple: 'border-neon/30 bg-neon/10 text-neon',
}

export default function NetworkPortalHub() {
  return (
    <section className="my-10 rounded-3xl border border-white/10 bg-ink-300/80 p-5 md:p-7 shadow-[0_0_44px_rgba(138,43,226,0.10)]">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-eyebrow">XETHKIOZ NETWORK</p>
          <h2 className="font-display text-2xl md:text-4xl font-black text-white">Un ecosistema, varios portales</h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-400">
            Gaming, tecnología, ciencia, IA, creación y nodos experimentales con una misma cuenta, reputación y CMS.
          </p>
        </div>
        <Link to="/roles" className="btn-secondary w-fit">Ver roles y XP</Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {XETHKIOZ_NETWORK_PORTALS.map((portal) => (
          <Link
            key={portal.id}
            to={portal.path}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-5 transition-all hover:-translate-y-1 hover:border-orange/35 hover:bg-white/[0.04]"
          >
            <div className="absolute inset-0 grid-bg opacity-10" />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${accentClasses[portal.accent] || accentClasses.orange}`}>
                  {portal.status}
                </span>
                {portal.id === 'green-node' && <span className="text-green-300 animate-pulse">✦ hidden</span>}
              </div>
              <h3 className="font-display text-xl font-black text-white group-hover:text-orange">{portal.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{portal.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
