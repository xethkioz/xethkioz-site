/**
 * Procedural force matrix for the Alpha 3.3 sandbox visual runtime.
 *
 * All functions are deterministic and side-effect limited to the particle object
 * or the supplied Float32Array view. The vector math is intentionally compact:
 * acceleration is accumulated first, then integrated by the simulation loop.
 */

import {
  type Particle,
  type ParticleView,
  type Vector2,
  PARTICLE_BUFFER_LAYOUT,
} from './visualTypes'

const EPSILON = 0.0001

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function pseudoRandom2D(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123
  return n - Math.floor(n)
}

function applyVectorAcceleration(particle: Particle, x: number, y: number): Particle {
  particle.acceleration.x += x
  particle.acceleration.y += y
  return particle
}

function addBufferAcceleration(view: ParticleView, x: number, y: number): void {
  const { buffer, base } = view
  const { ax, ay } = PARTICLE_BUFFER_LAYOUT.offsets
  buffer[base + ax] += x
  buffer[base + ay] += y
}

/**
 * Constant linear acceleration. Positive values pull particles down the y axis;
 * negative values invert the field for anti-gravity portal effects.
 */
export function applyGravity(particle: Particle, value: number): Particle {
  return applyVectorAcceleration(particle, 0, value)
}

export function applyGravityToBuffer(view: ParticleView, value: number): void {
  addBufferAcceleration(view, 0, value)
}

/**
 * Radial shockwave. Direction is computed from center -> particle.
 * A positive force expands the wave; a negative force contracts it inward.
 */
export function applyPulse(particle: Particle, center: Vector2, radius: number, force: number): Particle {
  const dx = particle.position.x - center.x
  const dy = particle.position.y - center.y
  const distanceSq = dx * dx + dy * dy
  const safeRadius = Math.max(radius, EPSILON)

  if (distanceSq > safeRadius * safeRadius) return particle

  const distance = Math.sqrt(Math.max(distanceSq, EPSILON))
  const falloff = 1 - clamp(distance / safeRadius, 0, 1)
  const impulse = force * falloff

  return applyVectorAcceleration(particle, (dx / distance) * impulse, (dy / distance) * impulse)
}

export function applyPulseToBuffer(view: ParticleView, center: Vector2, radius: number, force: number): void {
  const { buffer, base } = view
  const { x, y } = PARTICLE_BUFFER_LAYOUT.offsets
  const dx = buffer[base + x] - center.x
  const dy = buffer[base + y] - center.y
  const distanceSq = dx * dx + dy * dy
  const safeRadius = Math.max(radius, EPSILON)

  if (distanceSq > safeRadius * safeRadius) return

  const distance = Math.sqrt(Math.max(distanceSq, EPSILON))
  const falloff = 1 - clamp(distance / safeRadius, 0, 1)
  const impulse = force * falloff
  addBufferAcceleration(view, (dx / distance) * impulse, (dy / distance) * impulse)
}

/**
 * Organic cyberpunk flow field. The pseudo-random angle is deterministic from
 * particle position + seed, so frames remain stable without external noise deps.
 */
export function applyNoiseField(particle: Particle, seed: number): Particle {
  const scale = 0.018
  const noise = pseudoRandom2D(particle.position.x * scale, particle.position.y * scale, seed)
  const angle = noise * Math.PI * 2
  const strength = 0.35 + particle.energy * 0.65

  return applyVectorAcceleration(particle, Math.cos(angle) * strength, Math.sin(angle) * strength)
}

export function applyNoiseFieldToBuffer(view: ParticleView, seed: number, intensity = 1): void {
  const { buffer, base } = view
  const { x, y, energy } = PARTICLE_BUFFER_LAYOUT.offsets
  const scale = 0.018
  const noise = pseudoRandom2D(buffer[base + x] * scale, buffer[base + y] * scale, seed)
  const angle = noise * Math.PI * 2
  const strength = (0.35 + buffer[base + energy] * 0.65) * intensity
  addBufferAcceleration(view, Math.cos(angle) * strength, Math.sin(angle) * strength)
}

/**
 * Cursor/stage interaction force. Direction is target -> particle; falloff is
 * strongest near the pointer and fades to zero at radius.
 */
export function applyRepulsion(
  particle: Particle,
  targetPosition: Vector2,
  radius: number,
  intensity: number,
): Particle {
  const dx = particle.position.x - targetPosition.x
  const dy = particle.position.y - targetPosition.y
  const distanceSq = dx * dx + dy * dy
  const safeRadius = Math.max(radius, EPSILON)

  if (distanceSq > safeRadius * safeRadius) return particle

  const distance = Math.sqrt(Math.max(distanceSq, EPSILON))
  const falloff = 1 - clamp(distance / safeRadius, 0, 1)
  const escape = intensity * falloff * falloff

  return applyVectorAcceleration(particle, (dx / distance) * escape, (dy / distance) * escape)
}

export function applyRepulsionToBuffer(
  view: ParticleView,
  targetPosition: Vector2,
  radius: number,
  intensity: number,
): void {
  const { buffer, base } = view
  const { x, y } = PARTICLE_BUFFER_LAYOUT.offsets
  const dx = buffer[base + x] - targetPosition.x
  const dy = buffer[base + y] - targetPosition.y
  const distanceSq = dx * dx + dy * dy
  const safeRadius = Math.max(radius, EPSILON)

  if (distanceSq > safeRadius * safeRadius) return

  const distance = Math.sqrt(Math.max(distanceSq, EPSILON))
  const falloff = 1 - clamp(distance / safeRadius, 0, 1)
  const escape = intensity * falloff * falloff
  addBufferAcceleration(view, (dx / distance) * escape, (dy / distance) * escape)
}
