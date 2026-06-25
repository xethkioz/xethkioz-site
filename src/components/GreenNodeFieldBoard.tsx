import { GREEN_NODE_CONFIG, GREEN_NODE_EASTER_EGGS } from '../lib/siteConfig'

const tracks = [
  { name: 'Ubuntu / Linux', command: 'apt policy knowledge', detail: 'Notas, guías, terminal, open source, homelab y administración básica.' },
  { name: 'Programación', command: 'cat /dev/code', detail: 'Python, TypeScript, Bash, automatización, lógica y snippets educativos.' },
  { name: 'Cyber defensivo', command: 'nmap --legal localhost', detail: 'CTF, buenas prácticas, OSINT ético, hardening y defensa. No intrusión.' },
  { name: 'Misterios documentales', command: 'grep -R evidence archives/', detail: 'Teorías, casos y misterios analizados como hipótesis, nunca como verdad absoluta.' },
]

export default function GreenNodeFieldBoard() {
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-3xl border border-green-400/20 bg-black/55 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-green-400">field modules</p>
        <h2 className="mt-3 font-display text-2xl font-black text-green-100">Mapa editorial del nodo</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {tracks.map((track) => (
            <div key={track.name} className="rounded-2xl border border-green-400/15 bg-green-950/10 p-4">
              <h3 className="font-display text-lg font-black text-green-100">{track.name}</h3>
              <code className="mt-2 block rounded-lg border border-green-400/10 bg-black/55 px-3 py-2 text-xs text-green-300">$ {track.command}</code>
              <p className="mt-3 text-sm leading-relaxed text-green-100/70">{track.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-green-400/20 bg-black/55 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-green-400">audio protocol</p>
        <h2 className="mt-3 font-display text-2xl font-black text-green-100">Ambiente sonoro</h2>
        <p className="mt-3 text-sm leading-relaxed text-green-100/70">
          El link de YouTube queda como referencia estética. Para LIVE usar audio propio o generado por IA sin copyright: drones graves, glitch, CRT, radio lejana, suspenso y pulsos electrónicos.
        </p>
        <a href={GREEN_NODE_CONFIG.youtubeReference} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-2 font-mono text-xs font-bold text-green-200 hover:bg-green-400/20">
          referencia musical externa
        </a>
        <div className="mt-5 space-y-2">
          {GREEN_NODE_EASTER_EGGS.slice(0, 4).map((egg) => (
            <div key={egg.trigger} className="rounded-xl border border-green-400/10 bg-black/35 px-3 py-2">
              <span className="font-mono text-xs text-green-300">{egg.trigger}</span>
              <p className="text-xs text-green-100/55">{egg.effect}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
