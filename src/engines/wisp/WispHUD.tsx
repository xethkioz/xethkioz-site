import { cyberAnimations } from '../../design'
import { useLang } from '../../lib/LangContext'
import { useWisp } from '../../providers/WispProvider'

export function WispHUD() {
  const { lang } = useLang()
  const { state, energy, activateGreenMode, registerEvent } = useWisp()
  const isGreenMode = state === 'GREEN_MODE'

  const copy = lang === 'es'
    ? {
        title: 'WISP_ENGINE_v2.0',
        status: isGreenMode ? 'GREEN_MODE' : `WISP: ${state}`,
        body: isGreenMode
          ? 'Canal verde abierto. Preparando salto a Green Node.'
          : 'Entidad activa. Observa señales, portales y flujo del ecosistema.',
        action: 'Abrir portal verde',
      }
    : {
        title: 'WISP_ENGINE_v2.0',
        status: isGreenMode ? 'GREEN_MODE' : `WISP: ${state}`,
        body: isGreenMode
          ? 'Green channel open. Preparing jump to Green Node.'
          : 'Active entity. Watching signals, portals and ecosystem flow.',
        action: 'Open green portal',
      }

  return (
    <section className="panel-cyber group relative flex min-h-[250px] flex-col items-center justify-center overflow-hidden p-6 text-center" aria-label={copy.title}>
      <div className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-gray-600">{copy.title}</div>
      <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-fusionAccent-tech-primary/40 to-transparent" />

      <button
        type="button"
        className="relative flex h-28 w-28 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fusionAccent-greenNode"
        aria-label={copy.action}
        onClick={() => {
          registerEvent('green-mode', 'wisp-hud:green-mode', '/green-node')
          activateGreenMode()
        }}
      >
        <span className={`absolute h-24 w-24 rounded-full bg-gradient-to-br from-fusionAccent-tech-primary to-fusionAccent-tech-secondary opacity-80 blur-md ${isGreenMode ? cyberAnimations.wisp.greenMode : cyberAnimations.wisp.watching}`} />
        <span className={`relative h-16 w-16 rounded-full border bg-fusionBg/70 ${isGreenMode ? 'border-fusionAccent-greenNode shadow-glow-green' : 'border-white/20 shadow-glow-tech-subtle'}`} />
        <span className="absolute bottom-3 h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full rounded-full bg-fusionAccent-greenNode transition-all duration-500" style={{ width: `${energy}%` }} />
        </span>
      </button>

      <div className="mt-6">
        <p className={`font-mono text-xs uppercase tracking-[0.22em] ${isGreenMode ? 'text-fusionAccent-greenNode' : 'text-fusionAccent-tech-primary'}`}>{copy.status}</p>
        <p className="mx-auto mt-2 max-w-[230px] text-xs text-gray-500">{copy.body}</p>
      </div>
    </section>
  )
}

export default WispHUD
