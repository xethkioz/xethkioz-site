/**
 * XETHKIOZ Alpha 3.7 Shader Pipeline contracts.
 *
 * Framework-agnostic post-process contracts. Network telemetry is represented
 * as numeric uniforms so the Scheduler/WebGL layer can react without React
 * state updates or DOM re-rendering.
 */

export type ShaderEffectId =
  | 'PortalTransition'
  | 'ChromaticAberration'
  | 'DigitalGlitch'
  | 'CRTMonitorLook'

export interface ShaderResolution {
  readonly width: number
  readonly height: number
}

export interface ShaderTimeUniforms {
  /** Elapsed seconds supplied by the external Scheduler. */
  readonly time: number
  /** Delta seconds from the previous frame. */
  readonly dt: number
}

export interface PortalTransitionConfig {
  readonly enabled: boolean
  /** Normalized 0..1 phase where 0 is closed and 1 is fully transitioned. */
  readonly progress: number
  /** Distortion strength applied around the transition ring. */
  readonly distortion: number
  /** Softness of the portal edge in normalized texture units. */
  readonly edgeSoftness: number
}

export interface ChromaticAberrationConfig {
  readonly enabled: boolean
  /** Pixel offset intensity for R/B channel separation. */
  readonly intensity: number
  /** Directional bias in normalized screen space. */
  readonly direction: readonly [number, number]
}

export interface DigitalGlitchConfig {
  readonly enabled: boolean
  /** 0..1 amount of scanline tearing and horizontal displacement. */
  readonly intensity: number
  /** Stable seed, normally derived from portal/world-state id. */
  readonly seed: number
  /** 0..1 probability of block jumps per frame. */
  readonly blockiness: number
}

export interface CRTMonitorLookConfig {
  readonly enabled: boolean
  readonly scanlineIntensity: number
  readonly vignette: number
  readonly curvature: number
}

export interface ShaderRuntimeUniformProfile {
  readonly glitchIntensity: number
  readonly chromaticAberration: number
  readonly digitalInterference: number
  readonly crtIntensity: number
  readonly portalTransition: number
  /** Latest Supabase/network latency sample in milliseconds. */
  readonly networkLatency: number
  /** 0..1 extra glitch amplification derived from network instability. */
  readonly latencyGlitchBoost: number
  /** 0..1 frame interpolation compensation, stronger for ARCHITECT tier. */
  readonly frameSmoothing: number
  readonly timestamp: number
}

export const DEFAULT_SHADER_RUNTIME_UNIFORM_PROFILE: ShaderRuntimeUniformProfile = Object.freeze({
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

export interface ShaderEffectFlags {
  readonly PortalTransition: boolean
  readonly ChromaticAberration: boolean
  readonly DigitalGlitch: boolean
  readonly CRTMonitorLook: boolean
}

export interface ShaderPostProcessConfiguration {
  readonly resolution: ShaderResolution
  readonly effects: {
    readonly PortalTransition: PortalTransitionConfig
    readonly ChromaticAberration: ChromaticAberrationConfig
    readonly DigitalGlitch: DigitalGlitchConfig
    readonly CRTMonitorLook: CRTMonitorLookConfig
  }
}

export interface ShaderPassDescriptor {
  readonly id: ShaderEffectId
  readonly fragmentSource: string
  readonly enabled: boolean
}

export interface ShaderProgramRecord {
  readonly id: string
  readonly program: WebGLProgram
  readonly vertexSource: string
  readonly fragmentSource: string
}

export interface PostProcessFrameContext extends ShaderTimeUniforms {
  readonly sourceTexture: WebGLTexture
  readonly outputFramebuffer: WebGLFramebuffer | null
  readonly configuration: ShaderPostProcessConfiguration
}

export const DEFAULT_SHADER_EFFECT_FLAGS: ShaderEffectFlags = Object.freeze({
  PortalTransition: false,
  ChromaticAberration: false,
  DigitalGlitch: true,
  CRTMonitorLook: false,
})

export const DEFAULT_SHADER_CONFIGURATION: ShaderPostProcessConfiguration = Object.freeze({
  resolution: Object.freeze({ width: 1, height: 1 }),
  effects: Object.freeze({
    PortalTransition: Object.freeze({ enabled: false, progress: 0, distortion: 0, edgeSoftness: 0.08 }),
    ChromaticAberration: Object.freeze({ enabled: false, intensity: 1.5, direction: Object.freeze([1, 0]) as readonly [number, number] }),
    DigitalGlitch: Object.freeze({ enabled: true, intensity: 0.18, seed: 13, blockiness: 0.35 }),
    CRTMonitorLook: Object.freeze({ enabled: false, scanlineIntensity: 0.22, vignette: 0.35, curvature: 0.08 }),
  }),
})

export function getShaderEffectFlags(configuration: ShaderPostProcessConfiguration): ShaderEffectFlags {
  return {
    PortalTransition: configuration.effects.PortalTransition.enabled,
    ChromaticAberration: configuration.effects.ChromaticAberration.enabled,
    DigitalGlitch: configuration.effects.DigitalGlitch.enabled,
    CRTMonitorLook: configuration.effects.CRTMonitorLook.enabled,
  }
}
