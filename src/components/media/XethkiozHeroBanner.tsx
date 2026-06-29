export default function XethkiozHeroBanner() {
  return (
    <section className="panel-cyber relative overflow-hidden border-fusionAccent-tech-primary/30 p-0 shadow-glow-tech-subtle" aria-label="XETHKIOZ media banner">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,126,41,0.22),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.24),transparent_32%),linear-gradient(120deg,rgba(5,5,8,0.98),rgba(18,8,31,0.92),rgba(5,5,8,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px] opacity-50" />
      <div className="absolute -left-20 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-fusionAccent-tech-secondary/20 blur-3xl" />
      <div className="absolute -right-12 top-0 h-60 w-60 rounded-full bg-fusionAccent-tech-primary/20 blur-3xl" />

      <div className="relative grid min-h-[260px] grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[1.4fr_0.8fr] md:px-10 md:py-10">
        <div className="flex flex-col justify-center gap-4">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.32em] text-fusionAccent-tech-secondary">
            XETHKIOZ // LIVE MEDIA CORE
          </p>
          <div>
            <h2 className="font-display text-3xl font-black uppercase tracking-[0.14em] text-white md:text-5xl">
              Gaming Is My Passion
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.24em] text-fusionAccent-tech-primary md:text-sm">
              Beyond The Game • Noticias • Tecnología • Comunidad
            </p>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">
            Portal vivo de XETHKIOZ: contenido gamer, tecnología, ciencia, streaming y mundos ocultos conectados por Wisp.
          </p>
        </div>

        <div className="relative flex min-h-[180px] items-center justify-center">
          <div className="absolute h-36 w-36 rounded-full border border-fusionAccent-tech-primary/30 bg-fusionSurface-base/40 shadow-glow-tech" />
          <div className="absolute h-52 w-52 animate-pulse rounded-full border border-fusionAccent-tech-secondary/20" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border border-fusionAccent-tech-secondary/50 bg-black/35 shadow-glow-action">
            <span className="font-display text-5xl font-black text-fusionAccent-tech-secondary drop-shadow-[0_0_18px_rgba(255,126,41,0.55)]">X</span>
          </div>
        </div>
      </div>
    </section>
  )
}
