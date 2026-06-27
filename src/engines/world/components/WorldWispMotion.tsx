import { memo, useMemo } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
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
  className?: string
  seed?: number
  particleCount?: number
  showParticleField?: boolean
}

const sizeClasses: Record<NonNullable<WorldWispMotionProps['size']>, string> = {
  sm: 'h-12 w-12',
  md: 'h-20 w-20',
  lg: 'h-28 w-28',
}

const PARTICLE_MIN = 24
const PARTICLE_MAX = 40
const DEFAULT_PARTICLE_COUNT = 32
const DEFAULT_SEED = 3072026

const layerDistribution: WispLayer[] = ['background', 'background', 'middle', 'middle', 'foreground']

const layerConfig: Record<
  WispLayer,
  {
    size: readonly [number, number]
    speed: readonly [number, number]
    amplitude: readonly [number, number]
    drift: readonly [number, number]
    opacity: readonly [number, number]
    blur: readonly [number, number]
  }
> = {
  background: {
    size: [3, 7],
    speed: [7.2, 10.5],
    amplitude: [8, 18],
    drift: [-14, 14],
    opacity: [0.12, 0.28],
    blur: [0, 1.5],
  },
  middle: {
    size: [5, 10],
    speed: [5.4, 8.2],
    amplitude: [14, 28],
    drift: [-24, 24],
    opacity: [0.22, 0.42],
    blur: [0.5, 2.2],
  },
  foreground: {
    size: [8, 15],
    speed: [3.8, 6.3],
    amplitude: [20, 42],
    drift: [-38, 38],
    opacity: [0.28, 0.55],
    blur: [2.2, 4.2],
  },
}

function clampParticleCount(value: number) {
  return Math.max(PARTICLE_MIN, Math.min(PARTICLE_MAX, Math.round(value)))
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0

  return function random() {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function range(random: () => number, min: number, max: number) {
  return min + (max - min) * random()
}

function pickLayer(random: () => number): WispLayer {
  return layerDistribution[Math.floor(random() * layerDistribution.length)] ?? 'middle'
}

function createWispParticles(seed: number, count: number): WispParticle[] {
  const random = createSeededRandom(seed)

  return Array.from({ length: clampParticleCount(count) }, (_, id) => {
    const layer = pickLayer(random)
    const config = layerConfig[layer]

    return {
      id,
      layer,
      x: range(random, 3, 97),
      y: range(random, 8, 96),
      size: range(random, config.size[0], config.size[1]),
      speed: range(random, config.speed[0], config.speed[1]),
      amplitude: range(random, config.amplitude[0], config.amplitude[1]),
      drift: range(random, config.drift[0], config.drift[1]),
      opacity: range(random, config.opacity[0], config.opacity[1]),
      blur: range(random, config.blur[0], config.blur[1]),
      delay: range(random, 0, 6.5),
    }
  })
}

function getLayerClassName(layer: WispLayer) {
  if (layer === 'foreground') return 'bg-violet-400/50 shadow-[0_0_18px_rgba(139,92,246,0.32)]'
  if (layer === 'middle') return 'bg-violet-500/35 shadow-[0_0_12px_rgba(139,92,246,0.28)]'
  return 'bg-violet-500/20 shadow-[0_0_8px_rgba(139,92,246,0.18)]'
}

function WorldWispMotionComponent({
  state = 'idle',
  label = 'Wisp visual entity',
  size = 'md',
  showTrail = true,
  className = '',
  seed = DEFAULT_SEED,
  particleCount = DEFAULT_PARTICLE_COUNT,
  showParticleField = true,
  ...motionProps
}: WorldWispMotionProps) {
  const particles = useMemo(
    () => createWispParticles(seed, particleCount),
    [seed, particleCount],
  )

  return (
    <motion.div
      className={`pointer-events-none relative flex items-center justify-center overflow-hidden ${sizeClasses[size]} ${className}`}
      aria-label={label}
      role="img"
      {...motionProps}
    >
      {showParticleField && (
        <div aria-hidden="true" className="absolute inset-[-45%] overflow-hidden rounded-full">
          {particles.map((particle) => (
            <motion.span
              key={`${seed}-${particle.id}`}
              variants={worldMotionVariants.wispCore}
              animate={state}
              className={`absolute rounded-full will-change-transform ${getLayerClassName(particle.layer)}`}
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
                style={{
                  rotate: `${particle.drift}deg`,
                  scaleX: Math.max(0.55, particle.amplitude / 28),
                }}
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

      <motion.span
        aria-hidden="true"
        variants={worldMotionVariants.wispCore}
        animate={state}
        className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl"
      />

      <motion.span
        variants={worldMotionVariants.wispCore}
        animate={state}
        className="relative h-1/2 w-1/2 rounded-full bg-gradient-to-br from-white via-violet-200 to-violet-500 shadow-[0_0_32px_rgba(139,92,246,.72)]"
      />

      <motion.span
        aria-hidden="true"
        variants={worldMotionVariants.wispCore}
        animate={state}
        className="absolute h-3/4 w-3/4 rounded-full border border-violet-500/35"
      />
    </motion.div>
  )
}

export const WorldWispMotion = memo(WorldWispMotionComponent)

export default WorldWispMotion
