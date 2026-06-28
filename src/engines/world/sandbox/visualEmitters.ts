/**
 * Dynamic emitter registry for the Alpha 3.3 sandbox visual runtime.
 * Emitters return compact emission requests; the simulation owns the buffer.
 */

import {
  ActivePortalBehavior,
  PORTAL_BEHAVIOR_PRESETS,
  type Emitter,
  type EmitterContext,
  type EmissionRequest,
} from './visualTypes'

const TWO_PI = Math.PI * 2

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function velocityMagnitude(context: EmitterContext): number {
  const vx = context.pointerVelocity?.x ?? 0
  const vy = context.pointerVelocity?.y ?? 0
  return Math.sqrt(vx * vx + vy * vy)
}

export class VisualEmitterRegistry {
  private readonly emitters = new Map<string, Emitter>()

  register(emitter: Emitter): void {
    this.emitters.set(emitter.id, emitter)
  }

  unregister(id: string): void {
    this.emitters.delete(id)
  }

  get(id: string): Emitter | undefined {
    return this.emitters.get(id)
  }

  emitAll(context: EmitterContext): EmissionRequest[] {
    const requests: EmissionRequest[] = []

    for (const emitter of this.emitters.values()) {
      requests.push(...emitter.emit(context))
    }

    return requests
  }

  clear(): void {
    this.emitters.clear()
  }
}

export const WispEmitter: Emitter = {
  id: 'WispEmitter',
  emit(context) {
    const preset = PORTAL_BEHAVIOR_PRESETS[context.behavior]
    const count = Math.max(1, Math.round(3 * preset.densityMultiplier))

    return [
      {
        count,
        origin: context.origin,
        spread: 18,
        energy: 0.7,
        hue: preset.baseHue + 18,
        size: 2.8,
        maxLife: 1.6,
      },
    ]
  },
}

export const PortalEmitter: Emitter = {
  id: 'PortalEmitter',
  emit(context) {
    const preset = PORTAL_BEHAVIOR_PRESETS[context.behavior]
    const orbitPhase = (context.elapsed * preset.velocityMultiplier + context.seed * 0.01) % TWO_PI
    const orbitRadius = context.behavior === ActivePortalBehavior.SCIENCE ? 46 : 72
    const origin = {
      x: context.origin.x + Math.cos(orbitPhase) * orbitRadius,
      y: context.origin.y + Math.sin(orbitPhase) * orbitRadius,
    }

    return [
      {
        count: Math.max(1, Math.round(5 * preset.densityMultiplier)),
        origin,
        spread: context.behavior === ActivePortalBehavior.GREEN_NODE ? 8 : 24,
        energy: context.behavior === ActivePortalBehavior.GREEN_NODE ? 0.95 : 0.62,
        hue: preset.baseHue,
        size: context.behavior === ActivePortalBehavior.GREEN_NODE ? 1.4 : 2.2,
        maxLife: context.behavior === ActivePortalBehavior.SCIENCE ? 2.4 : 1.2,
      },
    ]
  },
}

export const CursorEmitter: Emitter = {
  id: 'CursorEmitter',
  emit(context) {
    if (!context.pointer) return []

    const speed = velocityMagnitude(context)
    const normalizedSpeed = clamp(speed / 900, 0, 1)
    if (normalizedSpeed <= 0.02) return []

    const preset = PORTAL_BEHAVIOR_PRESETS[context.behavior]

    return [
      {
        count: Math.max(1, Math.round(10 * normalizedSpeed * preset.densityMultiplier)),
        origin: context.pointer,
        spread: 10 + normalizedSpeed * 28,
        energy: 0.55 + normalizedSpeed * 0.45,
        hue: preset.baseHue + normalizedSpeed * 40,
        size: 1.2 + normalizedSpeed * 2.4,
        maxLife: 0.45 + normalizedSpeed * 0.75,
      },
    ]
  },
}

export function createDefaultVisualEmitterRegistry(): VisualEmitterRegistry {
  const registry = new VisualEmitterRegistry()
  registry.register(WispEmitter)
  registry.register(PortalEmitter)
  registry.register(CursorEmitter)
  return registry
}
