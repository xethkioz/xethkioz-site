/**
 * Pure temporal orchestrator for the Alpha 3.3 sandbox visual runtime.
 *
 * The simulation stores particles in one Float32Array using a struct-of-arrays-like
 * fixed stride. React should never own these values; an external Scheduler passes
 * dt, and Canvas/WebGL renderers can read the buffer without triggering UI renders.
 */

import {
  ActivePortalBehavior,
  PARTICLE_BUFFER_LAYOUT,
  PORTAL_BEHAVIOR_PRESETS,
  type EmitterContext,
  type ParticleBufferLayout,
  type ParticleView,
  type Vector2,
  type VisualConfiguration,
  type VisualRuntimeMetrics,
} from './visualTypes'
import {
  applyGravityToBuffer,
  applyNoiseFieldToBuffer,
  applyPulseToBuffer,
  applyRepulsionToBuffer,
} from './visualForces'
import { createDefaultVisualEmitterRegistry, type VisualEmitterRegistry } from './visualEmitters'

const DEFAULT_MAX_PARTICLES = 512
const DEFAULT_BOUNDS = { width: 1280, height: 720 } as const
const DEFAULT_ORIGIN = { x: 640, y: 360 } as const
const RECYCLE_PADDING = 96

function clampDt(dt: number): number {
  return Math.min(0.05, Math.max(0, dt))
}

function pseudoRandom(seed: number): number {
  const n = Math.sin(seed * 12.9898) * 43758.5453123
  return n - Math.floor(n)
}

export class VisualRuntimeSimulation {
  readonly layout: ParticleBufferLayout = PARTICLE_BUFFER_LAYOUT
  readonly buffer: Float32Array
  readonly registry: VisualEmitterRegistry

  private readonly maxParticles: number
  private behavior: ActivePortalBehavior
  private seed: number
  private bounds: VisualConfiguration['bounds']
  private origin: Vector2
  private forceScale: number
  private emitterScale: number
  private elapsed = 0
  private activeParticles = 0
  private emittedParticles = 0
  private recycledParticles = 0
  private pointer?: Vector2
  private pointerVelocity?: Vector2

  constructor(configuration: Partial<VisualConfiguration> = {}, registry = createDefaultVisualEmitterRegistry()) {
    this.maxParticles = configuration.maxParticles ?? DEFAULT_MAX_PARTICLES
    this.behavior = configuration.behavior ?? ActivePortalBehavior.GAMING
    this.seed = configuration.seed ?? 7331
    this.bounds = configuration.bounds ?? DEFAULT_BOUNDS
    this.origin = configuration.origin ?? DEFAULT_ORIGIN
    this.forceScale = configuration.forceScale ?? 1
    this.emitterScale = configuration.emitterScale ?? 1
    this.registry = registry
    this.buffer = new Float32Array(this.maxParticles * this.layout.stride)
  }

  configure(configuration: Partial<VisualConfiguration>): void {
    this.behavior = configuration.behavior ?? this.behavior
    this.seed = configuration.seed ?? this.seed
    this.bounds = configuration.bounds ?? this.bounds
    this.origin = configuration.origin ?? this.origin
    this.forceScale = configuration.forceScale ?? this.forceScale
    this.emitterScale = configuration.emitterScale ?? this.emitterScale
  }

  setPointer(pointer?: Vector2, pointerVelocity?: Vector2): void {
    this.pointer = pointer
    this.pointerVelocity = pointerVelocity
  }

  step(dt: number): VisualRuntimeMetrics {
    const safeDt = clampDt(dt)
    this.elapsed += safeDt

    this.dispatchEmitters(safeDt)
    this.applyForces(safeDt)
    this.integrate(safeDt)

    return this.getMetrics(safeDt)
  }

  getMetrics(lastDt = 0): VisualRuntimeMetrics {
    return {
      activeParticles: this.activeParticles,
      emittedParticles: this.emittedParticles,
      recycledParticles: this.recycledParticles,
      elapsed: this.elapsed,
      lastDt,
      behavior: this.behavior,
    }
  }

  reset(): void {
    this.buffer.fill(0)
    this.elapsed = 0
    this.activeParticles = 0
    this.emittedParticles = 0
    this.recycledParticles = 0
  }

  private dispatchEmitters(dt: number): void {
    const context: EmitterContext = {
      dt,
      elapsed: this.elapsed,
      behavior: this.behavior,
      origin: this.origin,
      pointer: this.pointer,
      pointerVelocity: this.pointerVelocity,
      seed: this.seed,
    }

    const requests = this.registry.emitAll(context)
    for (const request of requests) {
      const scaledCount = Math.round(request.count * this.emitterScale)
      for (let i = 0; i < scaledCount; i += 1) {
        this.spawnParticle(request.origin, request.spread, request.energy, request.hue, request.size, request.maxLife)
      }
    }
  }

  private applyForces(dt: number): void {
    const preset = PORTAL_BEHAVIOR_PRESETS[this.behavior]
    const pulseCenter = this.origin
    const pulseWave = Math.sin(this.elapsed * 2.4) * preset.pulseIntensity * this.forceScale

    for (let index = 0; index < this.activeParticles; index += 1) {
      const view = this.createView(index)
      const base = view.base
      const { ax, ay } = this.layout.offsets

      this.buffer[base + ax] = 0
      this.buffer[base + ay] = 0

      applyGravityToBuffer(view, preset.gravity * this.forceScale)
      applyPulseToBuffer(view, pulseCenter, 180, pulseWave)
      applyNoiseFieldToBuffer(view, this.seed + index + Math.floor(this.elapsed * 10), preset.noiseIntensity * this.forceScale)

      if (this.pointer) {
        applyRepulsionToBuffer(view, this.pointer, 140, preset.repulsionIntensity * 85 * this.forceScale)
      }

      // dt-scaled acceleration dampening keeps numerical integration stable and
      // prevents force spikes when the Scheduler temporarily stalls.
      this.buffer[base + ax] *= dt
      this.buffer[base + ay] *= dt
    }
  }

  private integrate(dt: number): void {
    const { x, y, vx, vy, ax, ay, life, maxLife, alpha, glitch } = this.layout.offsets
    const preset = PORTAL_BEHAVIOR_PRESETS[this.behavior]
    let index = 0

    while (index < this.activeParticles) {
      const base = index * this.layout.stride

      this.buffer[base + vx] += this.buffer[base + ax]
      this.buffer[base + vy] += this.buffer[base + ay]
      this.buffer[base + x] += this.buffer[base + vx] * dt * 60
      this.buffer[base + y] += this.buffer[base + vy] * dt * 60
      this.buffer[base + life] += dt

      const progress = this.buffer[base + life] / Math.max(this.buffer[base + maxLife], 0.001)
      this.buffer[base + alpha] = Math.max(0, 1 - progress)
      this.buffer[base + glitch] = preset.glitchIntensity * (0.5 + pseudoRandom(this.seed + index + this.elapsed) * 0.5)

      if (this.shouldRecycle(base)) {
        this.recycle(index)
        continue
      }

      index += 1
    }
  }

  private spawnParticle(origin: Vector2, spread: number, energy: number, hue: number, size: number, maxLife: number): void {
    const preset = PORTAL_BEHAVIOR_PRESETS[this.behavior]
    const slot = this.activeParticles < this.maxParticles ? this.activeParticles : this.recycledParticles % this.maxParticles
    const base = slot * this.layout.stride
    const angle = pseudoRandom(this.seed + this.emittedParticles * 3.17) * Math.PI * 2
    const distance = pseudoRandom(this.seed + this.emittedParticles * 9.91) * spread
    const speed = (0.35 + pseudoRandom(this.seed + this.emittedParticles * 1.7) * 1.4) * preset.velocityMultiplier
    const { x, y, vx, vy, ax, ay, life, maxLife: maxLifeOffset, size: sizeOffset, alpha, hue: hueOffset, energy: energyOffset, binary, glitch } = this.layout.offsets

    this.buffer[base + x] = origin.x + Math.cos(angle) * distance
    this.buffer[base + y] = origin.y + Math.sin(angle) * distance
    this.buffer[base + vx] = Math.cos(angle) * speed
    this.buffer[base + vy] = Math.sin(angle) * speed
    this.buffer[base + ax] = 0
    this.buffer[base + ay] = 0
    this.buffer[base + life] = 0
    this.buffer[base + maxLifeOffset] = maxLife
    this.buffer[base + sizeOffset] = size
    this.buffer[base + alpha] = 1
    this.buffer[base + hueOffset] = hue
    this.buffer[base + energyOffset] = energy
    this.buffer[base + binary] = preset.binaryMode ? Math.round(pseudoRandom(this.seed + this.emittedParticles)) : 0
    this.buffer[base + glitch] = preset.glitchIntensity

    if (this.activeParticles < this.maxParticles) this.activeParticles += 1
    this.emittedParticles += 1
  }

  private shouldRecycle(base: number): boolean {
    const { x, y, life, maxLife } = this.layout.offsets
    const px = this.buffer[base + x]
    const py = this.buffer[base + y]
    const expired = this.buffer[base + life] >= this.buffer[base + maxLife]
    const outside =
      px < -RECYCLE_PADDING ||
      px > this.bounds.width + RECYCLE_PADDING ||
      py < -RECYCLE_PADDING ||
      py > this.bounds.height + RECYCLE_PADDING

    return expired || outside
  }

  private recycle(index: number): void {
    const lastIndex = this.activeParticles - 1
    const targetBase = index * this.layout.stride
    const sourceBase = lastIndex * this.layout.stride

    if (index !== lastIndex) {
      this.buffer.copyWithin(targetBase, sourceBase, sourceBase + this.layout.stride)
    }

    this.buffer.fill(0, sourceBase, sourceBase + this.layout.stride)
    this.activeParticles -= 1
    this.recycledParticles += 1
  }

  private createView(index: number): ParticleView {
    return {
      buffer: this.buffer,
      index,
      base: index * this.layout.stride,
      layout: this.layout,
    }
  }
}
