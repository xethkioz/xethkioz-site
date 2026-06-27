import { memo, useMemo } from 'react'
import { motion, type HTMLMotionProps, type MotionValue, useMotionValue, useTransform } from 'framer-motion'
import type { WorldCameraMotion } from '../hooks'
import { worldMotionVariants, type WispMotionState } from './worldMotionVariants'

export type WispLayer = 'background' | 'middle' | 'foreground'

type WispParticle = {
  id: number
  layer: WispLayer
  x: number
  y: number
  size: number
  speed: number
  amplitude: number
  drift: number
  opacity: number
  blur: number
  delay: number
}

export interface WorldWispMotionProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  state?: WispMotionState
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showTrail?: boolean
  showParticles?: boolean
  particleCount?: number
  seed?: number
  camera?: WorldCameraMotion
  className?: string
}

const sizeClasses: Record<NonNullable<WorldWispMotionProps['size']>, string> = {
  sm: 'h-12 w-12',
  md: 'h-20 w-20',
  lg: 'h-28 w-28',
}

const layerClassName: Record<WispLayer, string> = {
  background: 'bg-violet-500/20 shadow-[0_0_8px_rgba(139,92,246,0.24)]',
  middle: 'bg-violet-400/35 shadow-[0_0_10px_rgba(139,92,246,0.32)]',
  foreground: 'bg-violet-300/50 shadow-[0_0_14px_rgba(139,92,246,0.42)]',
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5
    let result = state
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

const clampParticleCount = (value: number) => Math.max(24, Math.min(40, Math.round(value)))

function createParticle(id: number, random: () => number): WispParticle {
  const layerRoll = random()
  const layer: WispLayer = layerRoll < 0.34 ? 'background' : layerRoll < 0.74 ? 'middle' : 'foreground'

  const layerSettings = {
    background: { size: [2, 4], speed: [9, 15], opacity: [0.14, 0.26], blur: [0.2, 0.8], amplitude: [8, 16] },
    middle: { size: [3, 6], speed: [6, 11], opacity: [0.24, 0.42], blur: [0.4, 1.2], amplitude: [12, 24] },
    foreground: { size: [5, 9], speed: [4, 8], opacity: [0.34, 0.58], blur: [1.2, 2.4], amplitude: [16, 32] },
  }[layer]

  const range = (min: number, max: number) => min + random() * (max - min)

  return {
    id,
    layer,
    x: range(4, 96),
    y: range(6, 94),
    size: range(layerSettings.size[0], layerSettings.size[1]),
    speed: range(layerSettings.speed[0], layerSettings.speed[1]),
    amplitude: range(layerSettings.amplitude[0], layerSettings.amplitude[1]),
    drift: range(-28, 28),
    opacity: range(layerSettings.opacity[0], layerSettings.opacity[1]),
    blur: range(layerSettings.blur[0], layerSettings.blur[1]),
    delay: range(0, 7),
  }
}

function getParticlesByLayer(particles: WispParticle[], layer: WispLayer) {
  return particles.filter((particle) => particle.layer === layer)
}

function ParticleLayer({ particles, x, y, state, seed }: { particles: WispParticle[]; x: MotionValue<number>; y: MotionValue<number>; state: WispMotionState; seed: number }) {
  return (
    <motion.div aria-hidden="true" className="absolute inset-0 will-change-transform" style={{ x, y }}>
      {particles.map((particle) => (
        <motion.span
          key={`${seed}-${particle.id}`}
          variants={worldMotionVariants.wispCore}
          animate={state}
          className={`absolute rounded-full will-change-transform ${layerClassName[particle.layer]}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            filter: `blur(${particle.blur}px)`,
          }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            repeatType: 'mirror',
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        >
          <motion.span
            aria-hidden="true"
            variants={worldMotionVariants.lightTrail}
            initial="initial"
            animate="enter"
            className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-violet-400/45 to-transparent blur-[1px]"
            style={{ rotate: `${particle.drift}deg`, scaleX: Math.max(0.55, particle.amplitude / 28) }}
            transition={{
              duration: particle.speed * 0.62,
              repeat: Infinity,
              repeatDelay: particle.speed * 0.12,
              delay: particle.delay * 0.35,
              ease: 'easeInOut',
            }}
          />
        </motion.span>
      ))}
    </motion.div>
  )
}

function WorldWispMotionComponent({
  state = 'idle',
  label = 'Wisp visual entity',
  size = 'md',
  showTrail = true,
  showParticles = true,
  particleCount = 32,
  seed = 3097,
  camera,
  className = '',
  ...motionProps
}: WorldWispMotionProps) {
  const safeParticleCount = clampParticleCount(particleCount)
  const particles = useMemo(() => {
    const random = createSeededRandom(seed)
    return Array.from({ length: safeParticleCount }, (_, index) => createParticle(index, random))
  }, [safeParticleCount, seed])

  const fallbackX = useMotionValue(0)
  const fallbackY = useMotionValue(0)
  const sourceX = camera?.smoothX ?? fallbackX
  const sourceY = camera?.smoothY ?? fallbackY

  const backgroundX = useTransform(sourceX, [-1, 1], [-5, 5])
  const backgroundY = useTransform(sourceY, [-1, 1], [-3, 3])
  const middleX = useTransform(sourceX, [-1, 1], [-12, 12])
  const middleY = useTransform(sourceY, [-1, 1], [-7, 7])
  const foregroundX = useTransform(sourceX, [-1, 1], [-22, 22])
  const foregroundY = useTransform(sourceY, [-1, 1], [-13, 13])

  return (
    <motion.div
      className={`pointer-events-none relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
      aria-label={label}
      role="img"
      {...motionProps}
    >
      {showParticles && (
        <div aria-hidden="true" className="absolute inset-[-45%] overflow-hidden rounded-full">
          <ParticleLayer particles={getParticlesByLayer(particles, 'background')} x={backgroundX} y={backgroundY} state={state} seed={seed} />
          <ParticleLayer particles={getParticlesByLayer(particles, 'middle')} x={middleX} y={middleY} state={state} seed={seed} />
          <ParticleLayer particles={getParticlesByLayer(particles, 'foreground')} x={foregroundX} y={foregroundY} state={state} seed={seed} />
        </div>
      )}

      {showTrail && (
        <motion.span
          aria-hidden="true"
          variants={worldMotionVariants.lightTrail}
          initial="initial"
          animate="enter"
          className="absolute h-1 w-28 origin-left rounded-full bg-gradient-to-r from-transparent via-violet-500/60 to-transparent blur-sm"
        />
      )}

      <motion.span aria-hidden="true" variants={worldMotionVariants.wispCore} animate={state} className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl" />
      <motion.span variants={worldMotionVariants.wispCore} animate={state} className="relative h-1/2 w-1/2 rounded-full bg-gradient-to-br from-white via-violet-200 to-violet-500 shadow-[0_0_32px_rgba(139,92,246,.72)]" />
      <motion.span aria-hidden="true" variants={worldMotionVariants.wispCore} animate={state} className="absolute h-3/4 w-3/4 rounded-full border border-violet-500/35" />
    </motion.div>
  )
}

export const WorldWispMotion = memo(WorldWispMotionComponent)
WorldWispMotion.displayName = 'WorldWispMotion'

export default WorldWispMotion
