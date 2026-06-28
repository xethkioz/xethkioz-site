import type {
  CriticalPerformanceDropPayload,
  NetworkLatencyChangedPayload,
  PortalEventBusLike,
  PortalNodeId,
} from './portalEventContracts'
import type { XethkiozSubscriptionTier } from '../../../services/auth/authSchema'

type TimerQueryExtension = {
  readonly TIME_ELAPSED_EXT: number
  readonly GPU_DISJOINT_EXT: number
  createQueryEXT?: () => WebGLQuery | null
  deleteQueryEXT?: (query: WebGLQuery | null) => void
  beginQueryEXT?: (target: number, query: WebGLQuery) => void
  endQueryEXT?: (target: number) => void
  getQueryObjectEXT?: (query: WebGLQuery, pname: number) => unknown
}

export interface PerformanceMonitorFrameMetrics {
  readonly frameTimeMs: number
  readonly shaderTimeMs: number
  readonly timestamp: number
  readonly consecutiveSlowFrames: number
  readonly networkLatencyMs: number
}

export interface SupabaseLatencyProbe {
  /** Pure probe; normally performs a cheap Supabase HEAD/RPC query outside React. */
  readonly ping: () => Promise<number>
  readonly source?: 'supabase' | 'manual' | 'sandbox'
}

export interface PerformanceMonitorOptions {
  readonly thresholdMs?: number
  readonly maxConsecutiveSlowFrames?: number
  readonly eventBus?: PortalEventBusLike
  readonly activePortal?: () => PortalNodeId | undefined
  readonly activeEffects?: () => readonly string[]
  readonly latencyThresholdMs?: number
  readonly latencyProbeIntervalMs?: number
  readonly latencyProbe?: SupabaseLatencyProbe
  readonly subscriptionTier?: () => XethkiozSubscriptionTier | undefined
}

/**
 * Singleton sandbox performance + network monitor.
 *
 * It owns native requestAnimationFrame and optional Supabase latency sampling.
 * No React state is mutated here. Latency samples are emitted into the EventBus
 * as NETWORK_LATENCY_CHANGED, allowing RuntimeBridge -> ShaderManager to react
 * with uniforms only.
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor | null = null

  static getInstance(options: PerformanceMonitorOptions = {}): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(options)
    } else {
      PerformanceMonitor.instance.configure(options)
    }
    return PerformanceMonitor.instance
  }

  private thresholdMs = 16.6
  private maxConsecutiveSlowFrames = 3
  private latencyThresholdMs = 500
  private latencyProbeIntervalMs = 2000
  private latencyProbe: SupabaseLatencyProbe | null = null
  private eventBus: PortalEventBusLike | null = null
  private activePortalResolver: (() => PortalNodeId | undefined) | null = null
  private activeEffectsResolver: (() => readonly string[]) | null = null
  private subscriptionTierResolver: (() => XethkiozSubscriptionTier | undefined) | null = null
  private rafId: number | null = null
  private running = false
  private lastTimestamp = 0
  private consecutiveSlowFrames = 0
  private frameCallback: ((dt: number, metrics: PerformanceMonitorFrameMetrics) => void) | null = null
  private shaderStart = 0
  private lastShaderTimeMs = 0
  private gl: WebGL2RenderingContext | null = null
  private timerExtension: TimerQueryExtension | null = null
  private lastLatencyProbeAt = 0
  private lastNetworkLatencyMs = 0
  private previousNetworkLatencyMs: number | null = null
  private latencyProbeInFlight = false
  private latencyProbeTimeoutMs = 5000
  private lastCriticalDropReportAt = 0

  private constructor(options: PerformanceMonitorOptions) {
    this.configure(options)
  }

  configure(options: PerformanceMonitorOptions): void {
    if (typeof options.thresholdMs === 'number') this.thresholdMs = options.thresholdMs
    if (typeof options.maxConsecutiveSlowFrames === 'number') {
      this.maxConsecutiveSlowFrames = Math.max(1, Math.floor(options.maxConsecutiveSlowFrames))
    }
    if (typeof options.latencyThresholdMs === 'number') this.latencyThresholdMs = Math.max(1, options.latencyThresholdMs)
    if (typeof options.latencyProbeIntervalMs === 'number') {
      this.latencyProbeIntervalMs = Math.max(250, Math.floor(options.latencyProbeIntervalMs))
    }
    if (options.latencyProbe) this.latencyProbe = options.latencyProbe
    if (options.eventBus) this.eventBus = options.eventBus
    if (options.activePortal) this.activePortalResolver = options.activePortal
    if (options.activeEffects) this.activeEffectsResolver = options.activeEffects
    if (options.subscriptionTier) this.subscriptionTierResolver = options.subscriptionTier
  }

  attachWebGLContext(gl: WebGL2RenderingContext): void {
    this.gl = gl
    this.timerExtension = gl.getExtension('EXT_disjoint_timer_query_webgl2') as TimerQueryExtension | null
  }

  attachLatencyProbe(probe: SupabaseLatencyProbe): void {
    this.latencyProbe = probe
  }

  start(callback: (dt: number, metrics: PerformanceMonitorFrameMetrics) => void): void {
    this.frameCallback = callback
    if (this.running) return
    this.running = true
    this.lastTimestamp = performance.now()
    this.lastLatencyProbeAt = this.lastTimestamp
    this.rafId = requestAnimationFrame(this.tick)
  }

  stop(): void {
    this.running = false
    if (this.rafId !== null) cancelAnimationFrame(this.rafId)
    this.rafId = null
    this.frameCallback = null
  }

  beginShaderSample(): void {
    this.shaderStart = performance.now()
    if (this.gl && this.timerExtension?.beginQueryEXT && this.timerExtension?.createQueryEXT) {
      // Extension is detected for future GPU timing; CPU timing remains the
      // sandbox-safe authoritative metric to avoid query stalls.
    }
  }

  endShaderSample(): number {
    if (this.shaderStart <= 0) return this.lastShaderTimeMs
    this.lastShaderTimeMs = performance.now() - this.shaderStart
    this.shaderStart = 0
    return this.lastShaderTimeMs
  }

  getNetworkLatencyMs(): number {
    return this.lastNetworkLatencyMs
  }

  getSnapshot(): PerformanceMonitorFrameMetrics {
    return {
      frameTimeMs: this.lastTimestamp > 0 ? performance.now() - this.lastTimestamp : 0,
      shaderTimeMs: this.lastShaderTimeMs,
      timestamp: performance.now(),
      consecutiveSlowFrames: this.consecutiveSlowFrames,
      networkLatencyMs: this.lastNetworkLatencyMs,
    }
  }

  private readonly tick = (timestamp: number): void => {
    if (!this.running) return

    const dt = Math.max(0, (timestamp - this.lastTimestamp) / 1000)
    const frameTimeMs = timestamp - this.lastTimestamp
    this.lastTimestamp = timestamp

    if (frameTimeMs > this.thresholdMs) {
      this.consecutiveSlowFrames += 1
    } else {
      this.consecutiveSlowFrames = 0
    }

    if (timestamp - this.lastLatencyProbeAt >= this.latencyProbeIntervalMs) {
      this.lastLatencyProbeAt = timestamp
      void this.sampleNetworkLatency(timestamp)
    }

    const metrics: PerformanceMonitorFrameMetrics = {
      frameTimeMs,
      shaderTimeMs: this.lastShaderTimeMs,
      timestamp,
      consecutiveSlowFrames: this.consecutiveSlowFrames,
      networkLatencyMs: this.lastNetworkLatencyMs,
    }

    if (this.consecutiveSlowFrames > this.maxConsecutiveSlowFrames) {
      this.reportCriticalDrop(metrics)
    }

    this.frameCallback?.(dt, metrics)
    this.rafId = requestAnimationFrame(this.tick)
  }

  private async sampleNetworkLatency(timestamp: number): Promise<void> {
    if (!this.latencyProbe || this.latencyProbeInFlight) return
    this.latencyProbeInFlight = true
    const startedAt = performance.now()

    try {
      const measuredLatency = await withTimeout(this.latencyProbe.ping(), this.latencyProbeTimeoutMs)
      const latencyMs = Number.isFinite(measuredLatency) && measuredLatency >= 0
        ? measuredLatency
        : performance.now() - startedAt
      this.publishLatency(latencyMs, timestamp)
    } catch (error) {
      const fallbackLatency = Math.min(this.latencyProbeTimeoutMs, performance.now() - startedAt)
      console.warn('[XETHKIOZ PerformanceMonitor] Supabase latency probe failed or timed out; publishing bounded fallback latency', error)
      this.publishLatency(fallbackLatency, timestamp)
    } finally {
      this.latencyProbeInFlight = false
    }
  }

  private publishLatency(latencyMs: number, timestamp: number): void {
    this.previousNetworkLatencyMs = this.lastNetworkLatencyMs || this.previousNetworkLatencyMs
    this.lastNetworkLatencyMs = latencyMs

    const payload: NetworkLatencyChangedPayload = {
      latencyMs,
      previousLatencyMs: this.previousNetworkLatencyMs,
      source: this.latencyProbe?.source ?? 'supabase',
      timestamp,
      thresholdMs: this.latencyThresholdMs,
      tier: this.subscriptionTierResolver?.(),
    }

    if (latencyMs > this.latencyThresholdMs) {
      console.warn(
        `%c[XETHKIOZ Network] High Supabase latency: ${latencyMs.toFixed(1)}ms > ${this.latencyThresholdMs}ms`,
        'color:#ff3344;font-weight:900;',
      )
    }

    this.eventBus?.emit?.('NETWORK_LATENCY_CHANGED', payload)
    this.eventBus?.dispatch?.({ type: 'NETWORK_LATENCY_CHANGED', payload })
  }

  private reportCriticalDrop(metrics: PerformanceMonitorFrameMetrics): void {
    if (metrics.timestamp - this.lastCriticalDropReportAt < 1000) return
    this.lastCriticalDropReportAt = metrics.timestamp
    const payload: CriticalPerformanceDropPayload = {
      frameTimeMs: metrics.frameTimeMs,
      shaderTimeMs: metrics.shaderTimeMs,
      consecutiveFrames: metrics.consecutiveSlowFrames,
      thresholdMs: this.thresholdMs,
      timestamp: metrics.timestamp,
      activePortal: this.activePortalResolver?.(),
      activeEffects: this.activeEffectsResolver?.() ?? [],
    }

    console.warn(
      `%c[XETHKIOZ PerformanceMonitor] CRITICAL_PERFORMANCE_DROP: frame=${payload.frameTimeMs.toFixed(2)}ms shader=${payload.shaderTimeMs.toFixed(2)}ms consecutive=${payload.consecutiveFrames}`,
      'color:#ff3344;font-weight:900;',
    )

    this.eventBus?.emit?.('CRITICAL_PERFORMANCE_DROP', payload)
    this.eventBus?.dispatch?.({ type: 'CRITICAL_PERFORMANCE_DROP', payload })
  }
}

/**
 * Small structural helper for the production Supabase client. The service may
 * inject this probe without importing the full client into React or WebGL code.
 */
export function createSupabaseLatencyProbe(input: { readonly ping: () => Promise<unknown> }): SupabaseLatencyProbe {
  return Object.freeze({
    source: 'supabase' as const,
    ping: async () => {
      const startedAt = performance.now()
      await input.ping()
      return performance.now() - startedAt
    },
  })
}


async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: number | undefined
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error(`Latency probe timeout after ${timeoutMs}ms`)), timeoutMs)
      }),
    ])
  } finally {
    if (typeof timeoutId === 'number') window.clearTimeout(timeoutId)
  }
}
