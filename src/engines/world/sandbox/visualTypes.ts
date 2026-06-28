/**
 * XETHKIOZ Fusion Platform — Alpha 3.3 Visual Runtime Sandbox Core
 *
 * This file contains only data contracts for the isolated sandbox visual runtime.
 * It intentionally avoids React state, DOM references and production runtime imports.
 */

export enum ActivePortalBehavior {
  GAMING = 'GAMING',
  SCIENCE = 'SCIENCE',
  GREEN_NODE = 'GREEN_NODE',
}

export interface Vector2 {
  readonly x: number
  readonly y: number
}

export interface MutableVector2 {
  x: number
  y: number
}

export interface Particle {
  id: number
  position: MutableVector2
  velocity: MutableVector2
  acceleration: MutableVector2
  life: number
  maxLife: number
  size: number
  alpha: number
  hue: number
  energy: number
  binary?: 0 | 1
  glitch?: number
}

export type ParticleBufferField =
  | 'x'
  | 'y'
  | 'vx'
  | 'vy'
  | 'ax'
  | 'ay'
  | 'life'
  | 'maxLife'
  | 'size'
  | 'alpha'
  | 'hue'
  | 'energy'
  | 'binary'
  | 'glitch'

export interface ParticleBufferLayout {
  readonly stride: number
  readonly offsets: Readonly<Record<ParticleBufferField, number>>
}

export const PARTICLE_BUFFER_LAYOUT: ParticleBufferLayout = {
  stride: 14,
  offsets: {
    x: 0,
    y: 1,
    vx: 2,
    vy: 3,
    ax: 4,
    ay: 5,
    life: 6,
    maxLife: 7,
    size: 8,
    alpha: 9,
    hue: 10,
    energy: 11,
    binary: 12,
    glitch: 13,
  },
} as const

export interface ParticleView {
  readonly buffer: Float32Array
  readonly index: number
  readonly base: number
  readonly layout: ParticleBufferLayout
}

export interface ForceContext {
  readonly dt: number
  readonly elapsed: number
  readonly behavior: ActivePortalBehavior
  readonly pointer?: Vector2
  readonly seed: number
}

export type Force = (particle: Particle, context: ForceContext) => Particle
export type BufferForce = (view: ParticleView, context: ForceContext) => void

export interface EmitterContext {
  readonly dt: number
  readonly elapsed: number
  readonly behavior: ActivePortalBehavior
  readonly origin: Vector2
  readonly pointer?: Vector2
  readonly pointerVelocity?: Vector2
  readonly seed: number
}

export interface EmissionRequest {
  readonly count: number
  readonly origin: Vector2
  readonly spread: number
  readonly energy: number
  readonly hue: number
  readonly size: number
  readonly maxLife: number
}

export interface Emitter {
  readonly id: string
  readonly emit: (context: EmitterContext) => EmissionRequest[]
}

export interface PortalBehaviorPreset {
  readonly densityMultiplier: number
  readonly velocityMultiplier: number
  readonly gravity: number
  readonly pulseIntensity: number
  readonly noiseIntensity: number
  readonly repulsionIntensity: number
  readonly baseHue: number
  readonly binaryMode: boolean
  readonly glitchIntensity: number
}

export const PORTAL_BEHAVIOR_PRESETS: Readonly<Record<ActivePortalBehavior, PortalBehaviorPreset>> = {
  [ActivePortalBehavior.GAMING]: {
    densityMultiplier: 0.6,
    velocityMultiplier: 1,
    gravity: 6,
    pulseIntensity: 0.65,
    noiseIntensity: 0.42,
    repulsionIntensity: 0.9,
    baseHue: 280,
    binaryMode: false,
    glitchIntensity: 0.08,
  },
  [ActivePortalBehavior.SCIENCE]: {
    densityMultiplier: 0.25,
    velocityMultiplier: 0.45,
    gravity: 1.5,
    pulseIntensity: 0.25,
    noiseIntensity: 0.18,
    repulsionIntensity: 0.35,
    baseHue: 200,
    binaryMode: false,
    glitchIntensity: 0.02,
  },
  [ActivePortalBehavior.GREEN_NODE]: {
    densityMultiplier: 0.5,
    velocityMultiplier: 0.85,
    gravity: 0,
    pulseIntensity: 0.8,
    noiseIntensity: 0.75,
    repulsionIntensity: 1.2,
    baseHue: 125,
    binaryMode: true,
    glitchIntensity: 0.85,
  },
} as const

export interface VisualConfiguration {
  readonly maxParticles: number
  readonly behavior: ActivePortalBehavior
  readonly seed: number
  readonly bounds: {
    readonly width: number
    readonly height: number
  }
  readonly origin: Vector2
  readonly forceScale: number
  readonly emitterScale: number
}

export interface VisualRuntimeMetrics {
  readonly activeParticles: number
  readonly emittedParticles: number
  readonly recycledParticles: number
  readonly elapsed: number
  readonly lastDt: number
  readonly behavior: ActivePortalBehavior
}
