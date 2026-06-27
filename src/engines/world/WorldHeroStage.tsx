import { useMemo, useState } from 'react'
import { AvatarRenderer, type AvatarPoseId } from '../profile/AvatarRenderer'
import { useLang } from '../../lib/LangContext'

type RoleActionId = 'walk' | 'fightDragon' | 'forge' | 'magic' | 'fish'

interface RoleAction {
  id: RoleActionId
  label: string
  pose: AvatarPoseId
  description: string
}

const roleActionCopy: Record<'es' | 'en', RoleAction[]> = {
  es: [
    { id: 'walk', label: '🌲 Caminar por el bosque', pose: 1, description: 'El avatar explora senderos oscuros del ecosistema y detecta señales de portales activos.' },
    { id: 'fightDragon', label: '🐉 Pelear con dragón', pose: 4, description: 'La espada de energía se activa frente al guardián verde de la Matrix.' },
    { id: 'forge', label: '⚒️ Forjar espada', pose: 8, description: 'El núcleo templa recursos, assets y componentes antes de enviarlos a producción.' },
    { id: 'magic', label: '🔮 Practicar hechicería', pose: 12, description: 'El avatar manipula corrientes de datos, señales Wisp y rutas del World Gate.' },
    { id: 'fish', label: '🎣 Pescar en el vacío', pose: 20, description: 'Pausa de baja energía para observar métricas, comunidad y señales de contenido.' },
  ],
  en: [
    { id: 'walk', label: '🌲 Walk the forest', pose: 1, description: 'The avatar explores dark ecosystem paths and detects active portal signals.' },
    { id: 'fightDragon', label: '🐉 Fight dragon', pose: 4, description: 'The energy sword activates before the green guardian of the Matrix.' },
    { id: 'forge', label: '⚒️ Forge sword', pose: 8, description: 'The core tempers resources, assets and components before production.' },
    { id: 'magic', label: '🔮 Practice magic', pose: 12, description: 'The avatar manipulates data currents, Wisp signals and World Gate routes.' },
    { id: 'fish', label: '🎣 Fish the void', pose: 20, description: 'Low-energy pause to watch metrics, community and content signals.' },
  ],
}

export function WorldHeroStage() {
  const { lang } = useLang()
  const roleActions = useMemo(() => roleActionCopy[lang], [lang])
  const [activeAction, setActiveAction] = useState<RoleAction>(roleActions[0])
  const [isCasting, setIsCasting] = useState(false)

  function handleActionChange(action: RoleAction) {
    setIsCasting(true)
    setActiveAction(action)
    window.setTimeout(() => setIsCasting(false), 420)
  }

  return (
    <section className="panel-cyber relative flex flex-col items-center gap-8 overflow-hidden border border-fusionSurface-muted bg-gradient-to-b from-fusionSurface-base via-fusionBg to-fusionBg p-6 md:p-8" aria-labelledby="world-gate-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(139,92,246,0.16),transparent_34%),radial-gradient(circle_at_75%_80%,rgba(249,115,22,0.08),transparent_34%)]" />
      <div className="absolute left-4 top-3 font-mono text-[9px] uppercase tracking-[0.28em] text-gray-600">WORLD_ENGINE // STAGE_CORE</div>

      <div className="relative z-10 mt-6 flex flex-col items-center gap-2 text-center">
        <h1 id="world-gate-title" className="select-none bg-gradient-to-r from-fusionAccent-tech-primary via-white to-fusionAccent-tech-secondary bg-clip-text text-5xl font-black uppercase tracking-[0.12em] text-transparent drop-shadow-[0_0_20px_rgba(139,92,246,0.26)] md:text-7xl">
          XETHKIOZ
        </h1>
        <p className="max-w-3xl font-mono text-xs uppercase tracking-[0.22em] text-fusionAccent-tech-secondary">
          {lang === 'es' ? '"No quiero que se vea como una web... quiero que parezca un universo."' : '"It should not look like a website... it should feel like a universe."'}
        </p>
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center gap-8 py-4 lg:flex-row">
        <AvatarRenderer currentPose={activeAction.pose} glitchActive={isCasting} />
        <div className="flex w-full flex-1 flex-col gap-4">
          <div className="min-h-[86px] rounded-xl border border-fusionSurface-muted bg-black/20 p-4">
            <p className="text-sm leading-relaxed text-gray-300">{activeAction.description}</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={lang === 'es' ? 'Acciones del avatar' : 'Avatar actions'}>
            {roleActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionChange(action)}
                className={`rounded-lg border px-3 py-2 font-mono text-xs uppercase tracking-[0.08em] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fusionAccent-tech-primary ${
                  activeAction.id === action.id
                    ? 'border-fusionAccent-tech-primary bg-fusionAccent-tech-primary/10 text-white shadow-glow-tech'
                    : 'border-fusionSurface-muted bg-fusionSurface-base text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorldHeroStage
