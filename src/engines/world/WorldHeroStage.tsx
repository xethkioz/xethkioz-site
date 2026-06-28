import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, LazyMotion, MotionConfig, domMax, motion, useMotionValue, useTransform } from 'framer-motion'
import { AvatarRenderer, type AvatarPoseId } from '../profile/AvatarRenderer'
import { useLang } from '../../lib/LangContext'
import { WorldFloatingRelic, WorldStageBackdrop, WorldWispMotion } from './components'
import { useCameraMotion } from './hooks'
import './WorldHeroStage.css'

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
      description: 'El avatar blande una espada neón y combate al dragón guardián en una escena pixel art cinematográfica.',
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
      description: 'The avatar wields a neon sword and fights the guardian dragon in a cinematic pixel art scene.',
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

function shouldUseHeroVideo() {
  if (typeof window === 'undefined') return false
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return !reducedMotion && !connection?.saveData
}

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
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const transitionTimer = useRef<number | null>(null)

  const activeAction = useMemo(() => getActionById(roleActions, activeActionId), [activeActionId, roleActions])
  const wispState = getWispState(activeAction.id)
  const wispSeed = useMemo(() => activeAction.pose * WORLD_WISP_SEED_FACTOR, [activeAction.pose])

  const fallbackX = useMotionValue(0)
  const fallbackY = useMotionValue(0)
  const avatarX = useTransform(camera?.smoothX ?? fallbackX, [-1, 1], [-14, 14])
  const avatarY = useTransform(camera?.smoothY ?? fallbackY, [-1, 1], [-8, 8])
  const hudX = useTransform(camera?.smoothX ?? fallbackX, [-1, 1], [-4, 4])
  const hudY = useTransform(camera?.smoothY ?? fallbackY, [-1, 1], [-3, 3])

  useEffect(() => {
    setVideoEnabled(shouldUseHeroVideo())
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
          className="xeth-pixel-hero min-h-[760px] p-3 sm:p-5 md:p-7"
          onPointerMove={handleStagePointerMove}
          onPointerLeave={handleStagePointerLeave}
        >
          <div className="xeth-pixel-frame relative z-10 flex min-h-[700px] w-full flex-col items-center justify-between px-4 py-8 sm:px-6 md:px-10">
            <div className="xeth-pixel-fallback" aria-hidden="true" />
            {videoEnabled && (
              <video
                className="xeth-hero-video pointer-events-none absolute inset-0 h-full w-full object-cover opacity-65 transition-opacity duration-700"
                data-ready={videoReady ? 'true' : 'false'}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/og-image.svg"
                onCanPlay={() => setVideoReady(true)}
                onError={() => setVideoReady(false)}
                aria-hidden="true"
              >
                <source src="/media/xethkioz-world-loop-mobile.mp4" media="(max-width: 720px)" type="video/mp4" />
                <source src="/media/xethkioz-world-loop-720p.mp4" type="video/mp4" />
              </video>
            )}

            <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_18%,rgba(0,0,0,0.54)_78%)]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-8 top-6 z-[2] flex justify-between font-mono text-[9px] uppercase tracking-[0.28em] text-white/25" aria-hidden="true">
              <span>WORLD_ENGINE // PIXEL_GATE</span>
              <span>VIDEO_LOOP_SAFE_MODE</span>
            </div>

            <motion.div className="relative z-10 mt-8 flex select-none flex-col items-center gap-3 text-center" style={{ x: hudX, y: hudY }}>
              <h1
                id="world-gate-title"
                className="xeth-pixel-title bg-gradient-to-r from-violet-400 via-slate-100 to-orange-400 bg-clip-text text-5xl font-black uppercase tracking-[0.08em] text-transparent md:text-8xl lg:text-9xl"
              >
                XETHKIOZ
              </h1>
              <p className="max-w-4xl font-mono text-[10px] uppercase tracking-[0.22em] text-orange-300 md:text-xs">
                {lang === 'es'
                  ? '"No quiero que se vea como una web... quiero que parezca un universo."'
                  : '"It should not look like a website... it should feel like a universe."'}
              </p>
            </motion.div>

            <div className="relative z-10 flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-7 py-6">
              <motion.div className="relative flex flex-col items-center gap-2 will-change-transform" style={{ x: avatarX, y: avatarY }}>
                <WorldWispMotion
                  camera={camera}
                  state={wispState}
                  size="lg"
                  seed={wispSeed}
                  particleCount={WORLD_WISP_PARTICLE_COUNT}
                  className="absolute -right-8 -top-7 z-20"
                />

                <WorldFloatingRelic camera={camera} intensity={10} className="xeth-pixel-card bg-black/45 p-2" disabled>
                  <AvatarRenderer currentPose={activeAction.pose} glitchActive={isChanging} label="XETHKIOZ role avatar" />
                </WorldFloatingRelic>

                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-gray-500">
                  {lang === 'es' ? 'Ecosistema Avatar Layer' : 'Ecosystem Avatar Layer'}
                </span>
              </motion.div>

              <motion.div className="flex w-full max-w-5xl flex-col gap-4 will-change-transform" style={{ x: hudX, y: hudY }}>
                <div className="xeth-pixel-card flex min-h-[82px] flex-col justify-center rounded-xl border border-violet-500/15 bg-[#11101A]/82 p-4 backdrop-blur-sm">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeAction.id}
                      initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
                      transition={{ duration: 0.24 }}
                      className="text-sm font-semibold leading-relaxed text-slate-200"
                      aria-live="polite"
                    >
                      {activeAction.description}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={lang === 'es' ? 'Acciones del avatar' : 'Avatar actions'}>
                  {roleActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleActionChange(action)}
                      className={`xeth-pixel-button rounded-lg border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                        activeAction.id === action.id
                          ? 'border-violet-400 bg-violet-500/24 text-white shadow-[0_0_15px_rgba(139,92,246,0.34)]'
                          : 'border-violet-500/15 bg-[#14121d]/90 text-gray-400 hover:border-gray-500 hover:text-white'
                      }`}
                      aria-pressed={activeAction.id === action.id}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2" aria-label={lang === 'es' ? 'Accesos principales' : 'Main access'}>
                  <Link className="btn-primary rounded-xl px-5 py-3 text-xs uppercase tracking-[0.18em]" to="/gaming">
                    {lang === 'es' ? 'Entrar a Juegos' : 'Enter Games'}
                  </Link>
                  <Link className="btn-secondary rounded-xl px-5 py-3 text-xs uppercase tracking-[0.18em]" to="/news">
                    {lang === 'es' ? 'Ver Noticias' : 'Read News'}
                  </Link>
                  <Link className="rounded-xl border border-white/10 bg-black/40 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-200 transition hover:border-orange/60 hover:text-orange" to="/login">
                    {lang === 'es' ? 'Crear Cuenta' : 'Create Account'}
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </WorldStageBackdrop>
      </MotionConfig>
    </LazyMotion>
  )
}

export default WorldHeroStage
