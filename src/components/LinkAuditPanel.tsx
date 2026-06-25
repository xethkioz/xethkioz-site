import { VERIFIED_LINKS, SOCIAL_LINKS } from '../lib/siteConfig'

const statusStyles: Record<string, string> = {
  confirmed: 'border-green-400/40 bg-green-400/10 text-green-300',
  internal: 'border-orange/40 bg-orange/10 text-orange',
  hidden: 'border-green-300/40 bg-black text-green-200 shadow-[0_0_18px_rgba(0,255,102,.18)]',
}

export default function LinkAuditPanel() {
  return (
    <section className="glass rounded-2xl border border-white/10 p-5 md:p-6" aria-labelledby="link-audit-title">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-eyebrow">Link Audit</p>
          <h2 id="link-audit-title" className="font-display text-2xl md:text-3xl font-black gradient-text">Mapa de enlaces funcionales</h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Registro editorial para revisar botones internos, redes oficiales, portales del ecosistema y accesos especiales antes de publicar LIVE.
          </p>
        </div>
        <span className="rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-xs font-bold text-green-300">
          {VERIFIED_LINKS.length + SOCIAL_LINKS.length} vínculos rastreados
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {VERIFIED_LINKS.map((link) => {
          const external = link.url.startsWith('http')
          return (
            <a
              key={`${link.area}-${link.label}`}
              href={link.url}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="group rounded-xl border border-white/10 bg-black/25 p-4 transition-colors hover:border-orange/50"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{link.area}</p>
                  <strong className="mt-1 block text-sm text-white group-hover:text-orange">{link.label}</strong>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${statusStyles[link.status] || statusStyles.internal}`}>
                  {link.status}
                </span>
              </div>
              <p className="mt-3 truncate font-mono text-xs text-gray-500">{link.url}</p>
            </a>
          )
        })}
      </div>

      <div className="mt-5 rounded-xl border border-neon/20 bg-neon/5 p-4">
        <h3 className="font-display text-neon">Regla LIVE</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">
          Antes de hacer merge a main, cada botón visible debe apuntar a una ruta interna existente o a una red confirmada. Green Node queda como acceso especial: existe ruta directa, pero la experiencia principal debe ser el Wisp.
        </p>
      </div>
    </section>
  )
}
