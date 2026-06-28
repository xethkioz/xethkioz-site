/**
 * XETHKIOZ Alpha 3.4 EventBus telemetry contracts.
 *
 * These types define the sandbox bridge between Supabase-driven portal state,
 * the runtime EventBus and the WebGL shader stack. They are intentionally
 * framework-agnostic: React remains a passive consumer and never owns shader
 * state mutations.
 */

export type PortalNodeId = 'GAMING' | 'IA' | 'SCIENCE' | 'GREEN_NODE' | 'HARDWARE' | 'OFFERS' | 'URGENT'

export type PortalRuntimeEventType = 'PORTAL_STATE_CHANGED' | 'CRITICAL_PERFORMANCE_DROP' | 'USER_SESSION_AUTHORIZED' | 'NETWORK_LATENCY_CHANGED'

export interface PortalStateChangedPayload {
  readonly previousPortal: PortalNodeId | null
  readonly nextPortal: PortalNodeId
  /** Source system that produced the transition; Supabase is the normal live source. */
  readonly source: 'supabase' | 'scheduler' | 'manual' | 'sandbox'
  /** Monotonic timestamp supplied by the EventBus or bridge. */
  readonly timestamp: number
  /** Optional CMS article id that caused the transition. */
  readonly articleId?: string
  /** 0..1 intensity requested by the portal orchestrator. */
  readonly intensity: number
}

export interface NetworkLatencyChangedPayload {
  readonly latencyMs: number
  readonly previousLatencyMs: number | null
  readonly source: 'supabase' | 'manual' | 'sandbox'
  readonly timestamp: number
  readonly thresholdMs: number
  readonly tier?: import('../../../services/auth/authSchema').XethkiozSubscriptionTier
}

export interface CriticalPerformanceDropPayload {
  readonly frameTimeMs: number
  readonly shaderTimeMs: number
  readonly consecutiveFrames: number
  readonly thresholdMs: number
  readonly timestamp: number
  readonly activePortal?: PortalNodeId
  readonly activeEffects: readonly string[]
}

export interface PortalRuntimeEventMap {
  readonly PORTAL_STATE_CHANGED: PortalStateChangedPayload
  readonly CRITICAL_PERFORMANCE_DROP: CriticalPerformanceDropPayload
  readonly USER_SESSION_AUTHORIZED: import('../../../services/auth/authSchema').XethkiozAuthorizedSession
  readonly NETWORK_LATENCY_CHANGED: NetworkLatencyChangedPayload
}

export type PortalRuntimeEvent<TType extends PortalRuntimeEventType = PortalRuntimeEventType> = {
  readonly type: TType
  readonly payload: PortalRuntimeEventMap[TType]
}

export type PortalRuntimeEventHandler<TType extends PortalRuntimeEventType> = (
  event: PortalRuntimeEvent<TType>,
) => void

export interface PortalEventBusLike {
  readonly on?: <TType extends PortalRuntimeEventType>(
    type: TType,
    handler: PortalRuntimeEventHandler<TType>,
  ) => (() => void) | void
  readonly off?: <TType extends PortalRuntimeEventType>(
    type: TType,
    handler: PortalRuntimeEventHandler<TType>,
  ) => void
  readonly emit?: <TType extends PortalRuntimeEventType>(
    type: TType,
    payload: PortalRuntimeEventMap[TType],
  ) => void
  readonly dispatch?: <TType extends PortalRuntimeEventType>(event: PortalRuntimeEvent<TType>) => void
}

export const PORTAL_EVENT_TYPES = Object.freeze({
  PORTAL_STATE_CHANGED: 'PORTAL_STATE_CHANGED',
  CRITICAL_PERFORMANCE_DROP: 'CRITICAL_PERFORMANCE_DROP',
  USER_SESSION_AUTHORIZED: 'USER_SESSION_AUTHORIZED',
  NETWORK_LATENCY_CHANGED: 'NETWORK_LATENCY_CHANGED',
} satisfies Record<PortalRuntimeEventType, PortalRuntimeEventType>)

export const PORTAL_NODE_SHADER_INTENSITY = Object.freeze({
  GAMING: 0.34,
  IA: 0.28,
  SCIENCE: 0.18,
  GREEN_NODE: 1,
  HARDWARE: 0.24,
  OFFERS: 0.22,
  URGENT: 0.88,
} satisfies Record<PortalNodeId, number>)
