import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig, domMax, motion, useMotionValue, useTransform } from 'framer-motion'
import { AvatarRenderer, type AvatarPoseId } from '../profile/AvatarRenderer'
import { useLang } from '../../lib/LangContext'
import { WorldFloatingRelic, WorldStageBackdrop, WorldWispMotion } from './components'
import { useCameraMotion } from './hooks'

type RoleActionId = 'walk' | 'fightDragon' | 'forge' | 'magic' | 'fish'

interface RoleAction {
  id: RoleActionId
  label: string
  pose: AvatarPoseId
  description: string
}

const roleActionCopy: Record<'es' | 'en', RoleAction[]> = {
  es: [
    {
      id: 'walk',
      label: '🌲 Caminar por el bosque',
      pose: 1,
      description: 'El avatar camina por el bosque, explorando senderos ocultos del universo y detectando portales activos.',
    },
    {
      id: 'fightDragon',
      label: '🐉 Pelear con dragón',
      pose: 4,
      description: 'El avatar blande una espada neón y combate al dragón guardián de la Matrix verde en una escena cinematográfica.',
    },
    {
      id: 'forge',
      label: '⚒️ Forjar espada',
      pose: 8,
      description: 'El núcleo forja una espada de energía, templando recursos, assets y componentes antes de enviarlos a producción.',
    },
    {
      id: 'magic',
      label: '🔮 Practicar hechicería',
      pose: 12,
      description: 'El avatar practica alta hechicería manipulando flujos mágicos de datos, señales Wisp y rutas del World Gate.',
    },
    {
      id: 'fish',
      label: '🎣 Pescar en el río',
      pose: 20,
      description: 'El avatar descansa pescando junto al río, observando métricas, comunidad y señales del ecosistema.',
    },
  ],
  en: [
    {
      id: 'walk',
      label: '🌲 Walk the forest',
      pose: 1,
      description: 'The avatar walks through the forest, exploring hidden universe paths and detecting active portals.',
    },
    {
      id: 'fightDragon',
      label: '🐉 Fight dragon',
      pose: 4,
      description: 'The avatar wields a neon sword and fights the green Matrix guardian dragon in a cinematic scene.',
    },
    {
      id: 'forge',
      label: '⚒️ Forge sword',
      pose: 8,
      description: 'The core forges an energy sword, tempering resources, assets and components before production.',
    },
    {
      id: 'magic',
      label: '🔮 Practice magic',
      pose: 12,
      description: 'The avatar practices high magic by manipulating data currents, Wisp signals and World Gate routes.',
    },
    {
      id: 'fish',
      label: '🎣 Fish the river',
      pose: 20,
      description: 'The avatar rests by the river, watching metrics, community activity and ecosystem signals.',
    },
  ],
}

function getActionById(actions: RoleAction[], activeId: RoleActionId) {
  return actions.find((action) => action.id === activeId) ?? actions[0]
}

function getWispState(actionId: RoleActionId) {
  if (actionId === 'fightDragon' || actionId === 'magic') return 'surge'
  if (actionId === 'forge') return 'focus'
  return 'idle'
}

const WORLD_STAGE_LAYOUT_GROUP_ID = 'xethkioz-alpha-3-world-stage'
const WORLD_WISP_PARTICLE_COUNT = 32
const WORLD_WISP_SEED_FACTOR = 97

const worldMotionConfig = {
  transition: {
    type: 'spring',
    stiffness: 180,
    damping: 22,
    mass: 0.9,
  },
} as const

export function WorldHeroStage() {
  const { lang } = useLang()
  const camera = useCameraMotion()
  const { resetPointer, setPointerFromEvent } = camera
  const roleActions = useMemo(() => roleActionCopy[lang], [lang])
  const [activeActionId, setActiveActionId] = useState<RoleActionId>('walk')
  const [isChanging, setIsChanging] = useState(false)
  const transitionTimer = useRef<number | null>(null)

  const activeAction = useMemo(() => getActionById(roleActions, activeActionId), [activeActionId, roleActions])
  const wispState = getWispState(activeAction.id)
  const wispSeed = useMemo(() => activeAction.pose * WORLD_WISP_SEED_FACTOR, [activeAction.pose])

  const fallbackX = useMotionValue(0)
  const fallbackY = useMotionValue(0)
  const avatarX = useTransform(camera?.smoothX ?? fallbackX, [-1, 1], [-18, 18])
  const avatarY = useTransform(camera?.smoothY ?? fallbackY, [-1, 1], [-10, 10])
  const hudX = useTransform(camera?.smoothX ?? fallbackX, [-1, 1], [-4, 4])
  const hudY = useTransform(camera?.smoothY ?? fallbackY, [-1, 1], [-3, 3])

  useEffect(() => {
    return () => {
      if (transitionTimer.current) {
        window.clearTimeout(transitionTimer.current)
      }
    }
  }, [])

  const handleActionChange = useCallback((action: RoleAction) => {
    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current)
    }

    setIsChanging(true)
    setActiveActionId(action.id)
    transitionTimer.current = window.setTimeout(() => setIsChanging(false), 320)
  }, [])

  const handleStagePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      setPointerFromEvent(event)
    },
    [setPointerFromEvent],
  )

  const handleStagePointerLeave = useCallback(() => {
    resetPointer()
  }, [resetPointer])

  return (
    <LazyMotion features={domMax}>
      <MotionConfig {...worldMotionConfig}>
        <WorldStageBackdrop
          camera={camera}
          labelId="world-gate-title"
          theme="gaming"
          onPointerMove={handleStagePointerMove}
          onPointerLeave={handleStagePointerLeave}
        >
      <motion.div className="relative z-10 mt-6 flex select-none flex-col items-center gap-2 text-center" style={{ x: hudX, y: hudY }}>
        <h1
          id="world-gate-title"
          className="bg-gradient-to-r from-violet-400 via-slate-100 to-orange-400 bg-clip-text text-6xl font-black uppercase tracking-[0.08em] text-transparent drop-shadow-[0_0_25px_rgba(139,92,246,0.4)] md:text-8xl"
        >
          XETHKIOZ
        </h1>
        <p className="max-w-3xl font-mono text-xs uppercase tracking-[0.22em] text-orange-300">
          {lang === 'es'
            ? '"No quiero que se vea como una web... quiero que parezca un universo."'
            : '"It should not look like a website... it should feel like a universe."'}
        </p>
      </motion.div>

      <LayoutGroup id={WORLD_STAGE_LAYOUT_GROUP_ID}>
        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center gap-8 py-2 lg:flex-row">
        <motion.div className="relative flex flex-col items-center gap-2 will-change-transform" style={{ x: avatarX, y: avatarY }}>
          <WorldWispMotion
            camera={camera}
            state={wispState}
            size="lg"
            seed={wispSeed}
            particleCount={WORLD_WISP_PARTICLE_COUNT}
            className="absolute -right-6 -top-4 z-20"
          />

          <WorldFloatingRelic camera={camera} intensity={10} className="p-2" disabled>
            <AvatarRenderer currentPose={activeAction.pose} glitchActive={isChanging} label="XETHKIOZ role avatar" />
          </WorldFloatingRelic>

          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-gray-500">
            {lang === 'es' ? 'Ecosistema Avatar Layer' : 'Ecosystem Avatar Layer'}
          </span>
        </motion.div>

        <motion.div className="flex w-full flex-1 flex-col gap-4 will-change-transform" style={{ x: hudX, y: hudY }}>
          <div className="flex min-h-[76px] flex-col justify-center rounded-xl border border-violet-500/10 bg-[#16141F]/70 p-4 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeAction.id}
                initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
                transition={{ duration: 0.24 }}
                className="text-sm leading-relaxed text-slate-300"
                aria-live="polite"
              >
                {activeAction.description}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label={lang === 'es' ? 'Acciones del avatar' : 'Avatar actions'}>
            {roleActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionChange(action)}
                className={`rounded-lg border px-3 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  activeAction.id === action.id
                    ? 'border-violet-400 bg-violet-500/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'border-violet-500/10 bg-[#16141F] text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
                aria-pressed={activeAction.id === action.id}
              >
                {action.label}
              </button>
            ))}
          </div>
        </motion.div>
        </div>
      </LayoutGroup>
        </WorldStageBackdrop>
      </MotionConfig>
    </LazyMotion>
  )
}

export default WorldHeroStage
