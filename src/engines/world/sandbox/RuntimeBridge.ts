import type { ShaderManager } from './ShaderManager'
import type { ShaderRuntimeUniformProfile } from './shaderContracts'
import { isAuthorizedSessionPayload, type XethkiozAuthorizedSession, type XethkiozSubscriptionTier } from '../../../services/auth/authSchema'
import {
  PORTAL_NODE_SHADER_INTENSITY,
  type NetworkLatencyChangedPayload,
  type PortalEventBusLike,
  type PortalNodeId,
  type PortalRuntimeEvent,
  type PortalStateChangedPayload,
} from './portalEventContracts'

export interface RuntimeBridgeOptions {
  readonly eventBus: PortalEventBusLike
  readonly shaderManager: ShaderManager
  readonly transitionLerp?: number
  readonly now?: () => number
}

/**
 * EventBus -> ShaderManager bridge.
 *
 * This class is intentionally React-free. It listens to portal transitions and
 * network telemetry, then writes uniform profiles directly into ShaderManager
 * for the Scheduler/WebGL loop to consume on the next frame.
 */
export class RuntimeBridge {
  private readonly eventBus: PortalEventBusLike
  private readonly shaderManager: ShaderManager
  private readonly transitionLerp: number
  private readonly now: () => number
  private unsubscribe: (() => void) | null = null
  private unsubscribeAuth: (() => void) | null = null
  private unsubscribeLatency: (() => void) | null = null
  private authorizedSession: XethkiozAuthorizedSession | null = null
  private disposed = false
  private currentPortal: PortalNodeId | null = null
  private currentLatency: NetworkLatencyChangedPayload | null = null
  private currentProfile: ShaderRuntimeUniformProfile = Object.freeze({
    glitchIntensity: 0,
    chromaticAberration: 0,
    digitalInterference: 0,
    crtIntensity: 0,
    portalTransition: 0,
    networkLatency: 0,
    latencyGlitchBoost: 0,
    frameSmoothing: 0,
    timestamp: 0,
  })

  constructor(options: RuntimeBridgeOptions) {
    this.eventBus = options.eventBus
    this.shaderManager = options.shaderManager
    this.transitionLerp = clamp01(options.transitionLerp ?? 0.14)
    this.now = options.now ?? (() => performance.now())
  }

  connect(): void {
    if (this.disposed) throw new Error('[RuntimeBridge] Cannot connect a disposed bridge')
    if (this.unsubscribe) return

    const portalHandler = (event: PortalRuntimeEvent<'PORTAL_STATE_CHANGED'>): void => {
      this.handlePortalStateChanged(event.payload)
    }
    const authHandler = (event: PortalRuntimeEvent<'USER_SESSION_AUTHORIZED'>): void => {
      this.handleAuthorizedSession(event.payload)
    }
    const latencyHandler = (event: PortalRuntimeEvent<'NETWORK_LATENCY_CHANGED'>): void => {
      this.handleNetworkLatencyChanged(event.payload)
    }

    const maybeUnsubscribe = this.eventBus.on?.('PORTAL_STATE_CHANGED', portalHandler)
    this.unsubscribe = typeof maybeUnsubscribe === 'function'
      ? maybeUnsubscribe
      : () => this.eventBus.off?.('PORTAL_STATE_CHANGED', portalHandler)

    const maybeUnsubscribeAuth = this.eventBus.on?.('USER_SESSION_AUTHORIZED', authHandler)
    this.unsubscribeAuth = typeof maybeUnsubscribeAuth === 'function'
      ? maybeUnsubscribeAuth
      : () => this.eventBus.off?.('USER_SESSION_AUTHORIZED', authHandler)

    const maybeUnsubscribeLatency = this.eventBus.on?.('NETWORK_LATENCY_CHANGED', latencyHandler)
    this.unsubscribeLatency = typeof maybeUnsubscribeLatency === 'function'
      ? maybeUnsubscribeLatency
      : () => this.eventBus.off?.('NETWORK_LATENCY_CHANGED', latencyHandler)
  }

  disconnect(): void {
    this.unsubscribe?.()
    this.unsubscribeAuth?.()
    this.unsubscribeLatency?.()
    this.unsubscribe = null
    this.unsubscribeAuth = null
    this.unsubscribeLatency = null
  }

  dispose(): void {
    this.disconnect()
    this.disposed = true
  }

  getCurrentPortal(): PortalNodeId | null {
    return this.currentPortal
  }

  getCurrentUniformProfile(): ShaderRuntimeUniformProfile {
    return this.currentProfile
  }

  handlePortalStateChanged(payload: PortalStateChangedPayload): void {
    if (this.disposed) return
    if (!Number.isFinite(payload.intensity) || !Number.isFinite(payload.timestamp)) {
      console.warn('[RuntimeBridge] Ignored malformed PORTAL_STATE_CHANGED payload')
      return
    }
    this.currentPortal = payload.nextPortal

    const targetProfile = this.mergeLatencyProfile(this.createTargetProfile(payload))
    this.currentProfile = lerpProfile(this.currentProfile, targetProfile, payload.nextPortal === 'GREEN_NODE' ? 1 : this.transitionLerp)
    this.injectProfile('[RuntimeBridge] Failed to inject portal shader uniforms')
  }

  handleNetworkLatencyChanged(payload: NetworkLatencyChangedPayload): void {
    if (this.disposed) return
    this.currentLatency = payload
    this.recomputeLatencyProfile()
  }

  handleAuthorizedSession(payload: XethkiozAuthorizedSession): void {
    if (this.disposed) return
    if (!isAuthorizedSessionPayload(payload)) {
      console.warn('[RuntimeBridge] Ignored malformed USER_SESSION_AUTHORIZED event')
      return
    }

    this.authorizedSession = payload
    this.applyAuthorizedSessionProfile()
    this.recomputeLatencyProfile()
  }

  private applyAuthorizedSessionProfile(): void {
    if (!this.authorizedSession) return

    const tierProfile = resolveTierVisualProfile(this.authorizedSession.subscriptionTier, this.currentProfile, this.now())
    this.currentProfile = Object.freeze({
      ...this.currentProfile,
      ...tierProfile,
      timestamp: tierProfile.timestamp,
    })
    this.injectProfile('[RuntimeBridge] Failed to inject authorized session shader profile')
  }

  private recomputeLatencyProfile(): void {
    if (!this.currentLatency) return
    this.currentProfile = this.mergeLatencyProfile(this.currentProfile)
    this.injectProfile('[RuntimeBridge] Failed to inject latency shader uniforms')
  }

  private createTargetProfile(payload: PortalStateChangedPayload): ShaderRuntimeUniformProfile {
    const criticalPortal = payload.nextPortal === 'GREEN_NODE' || payload.nextPortal === 'URGENT'
    const canDispatchCritical = this.authorizedSession?.permissions.canDispatchCriticalShaderEvents ?? false
    const permissionScale = criticalPortal && !canDispatchCritical ? 0.45 : 1
    if (criticalPortal && !canDispatchCritical) {
      console.warn('[RuntimeBridge] Critical shader transition downgraded: missing authorized session permissions')
    }
    const normalizedIntensity = clamp01((payload.intensity || PORTAL_NODE_SHADER_INTENSITY[payload.nextPortal]) * permissionScale)
    const timestamp = payload.timestamp || this.now()

    if (payload.nextPortal === 'GREEN_NODE') {
      return Object.freeze({
        glitchIntensity: normalizedIntensity,
        chromaticAberration: 0.85 * normalizedIntensity,
        digitalInterference: 1,
        crtIntensity: 0.44,
        portalTransition: 1,
        networkLatency: this.currentProfile.networkLatency,
        latencyGlitchBoost: this.currentProfile.latencyGlitchBoost,
        frameSmoothing: this.currentProfile.frameSmoothing,
        timestamp,
      })
    }

    if (payload.nextPortal === 'URGENT') {
      return Object.freeze({
        glitchIntensity: 0.48 * normalizedIntensity,
        chromaticAberration: 0.42 * normalizedIntensity,
        digitalInterference: 0.36,
        crtIntensity: 0.12,
        portalTransition: 0.72,
        networkLatency: this.currentProfile.networkLatency,
        latencyGlitchBoost: this.currentProfile.latencyGlitchBoost,
        frameSmoothing: this.currentProfile.frameSmoothing,
        timestamp,
      })
    }

    return Object.freeze({
      glitchIntensity: 0.04 * normalizedIntensity,
      chromaticAberration: 0.12 * normalizedIntensity,
      digitalInterference: 0.05,
      crtIntensity: 0,
      portalTransition: 0.35 * normalizedIntensity,
      networkLatency: this.currentProfile.networkLatency,
      latencyGlitchBoost: this.currentProfile.latencyGlitchBoost,
      frameSmoothing: this.currentProfile.frameSmoothing,
      timestamp,
    })
  }

  private mergeLatencyProfile(base: ShaderRuntimeUniformProfile): ShaderRuntimeUniformProfile {
    if (!this.currentLatency) return base

    const tier = this.authorizedSession?.subscriptionTier ?? this.currentLatency.tier ?? 'BASIC'
    const curve = resolveLatencyCurve(this.currentLatency.latencyMs, this.currentLatency.thresholdMs, tier)

    return Object.freeze({
      ...base,
      glitchIntensity: clamp01(base.glitchIntensity + curve.glitchBoost),
      chromaticAberration: clamp01(base.chromaticAberration + curve.chromaticBoost),
      digitalInterference: clamp01(base.digitalInterference + curve.interferenceBoost),
      networkLatency: this.currentLatency.latencyMs,
      latencyGlitchBoost: curve.glitchBoost,
      frameSmoothing: curve.frameSmoothing,
      timestamp: this.currentLatency.timestamp || this.now(),
    })
  }

  private injectProfile(errorLabel: string): void {
    try {
      this.shaderManager.setRuntimeUniformProfile(this.currentProfile)
    } catch (error) {
      console.error(errorLabel, error)
    }
  }
}


export function resolveTierVisualProfile(
  tier: XethkiozSubscriptionTier,
  current: ShaderRuntimeUniformProfile,
  timestamp: number,
): Partial<ShaderRuntimeUniformProfile> & Pick<ShaderRuntimeUniformProfile, 'timestamp'> {
  if (tier === 'ARCHITECT') {
    return Object.freeze({
      glitchIntensity: Math.min(current.glitchIntensity, 0.08),
      chromaticAberration: Math.max(current.chromaticAberration, 0.08),
      digitalInterference: Math.min(current.digitalInterference, 0.12),
      crtIntensity: Math.max(current.crtIntensity, 0.04),
      frameSmoothing: Math.max(current.frameSmoothing, 0.55),
      timestamp,
    })
  }

  if (tier === 'CREATOR') {
    return Object.freeze({
      glitchIntensity: Math.min(current.glitchIntensity, 0.22),
      chromaticAberration: Math.max(current.chromaticAberration, 0.05),
      frameSmoothing: Math.max(current.frameSmoothing, 0.2),
      timestamp,
    })
  }

  return Object.freeze({
    glitchIntensity: Math.max(current.glitchIntensity, current.latencyGlitchBoost),
    frameSmoothing: Math.min(current.frameSmoothing, 0.08),
    timestamp,
  })
}

export function resolveLatencyCurve(
  latencyMs: number,
  thresholdMs: number,
  tier: XethkiozSubscriptionTier,
): {
  readonly glitchBoost: number
  readonly chromaticBoost: number
  readonly interferenceBoost: number
  readonly frameSmoothing: number
} {
  const normalized = clamp01((latencyMs - 100) / Math.max(1, thresholdMs - 100))
  const tierMultiplier = tier === 'BASIC' ? 1.35 : tier === 'CREATOR' ? 1 : 0.48
  const smoothing = tier === 'ARCHITECT' ? clamp01(normalized * 0.72) : tier === 'CREATOR' ? clamp01(normalized * 0.28) : 0

  return Object.freeze({
    glitchBoost: clamp01(normalized * 0.38 * tierMultiplier),
    chromaticBoost: clamp01(normalized * 0.22 * tierMultiplier),
    interferenceBoost: clamp01(normalized * 0.3 * tierMultiplier),
    frameSmoothing: smoothing,
  })
}

function lerpProfile(
  current: ShaderRuntimeUniformProfile,
  target: ShaderRuntimeUniformProfile,
  amount: number,
): ShaderRuntimeUniformProfile {
  const t = clamp01(amount)
  return Object.freeze({
    glitchIntensity: lerp(current.glitchIntensity, target.glitchIntensity, t),
    chromaticAberration: lerp(current.chromaticAberration, target.chromaticAberration, t),
    digitalInterference: lerp(current.digitalInterference, target.digitalInterference, t),
    crtIntensity: lerp(current.crtIntensity, target.crtIntensity, t),
    portalTransition: lerp(current.portalTransition, target.portalTransition, t),
    networkLatency: lerp(current.networkLatency, target.networkLatency, t),
    latencyGlitchBoost: lerp(current.latencyGlitchBoost, target.latencyGlitchBoost, t),
    frameSmoothing: lerp(current.frameSmoothing, target.frameSmoothing, t),
    timestamp: target.timestamp,
  })
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(1, Math.max(0, value))
}
