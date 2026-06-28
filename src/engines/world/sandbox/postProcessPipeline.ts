import { FULLSCREEN_TRIANGLE_VERTEX_SHADER, ShaderManager } from './ShaderManager'
import type { ShaderPassDescriptor, ShaderPostProcessConfiguration } from './shaderContracts'

interface FramebufferTarget {
  readonly framebuffer: WebGLFramebuffer
  readonly texture: WebGLTexture
  readonly width: number
  readonly height: number
}

interface PipelineUniformLocations {
  readonly texture: WebGLUniformLocation | null
  readonly time: WebGLUniformLocation | null
  readonly resolution: WebGLUniformLocation | null
  readonly intensity: WebGLUniformLocation | null
  readonly seed: WebGLUniformLocation | null
}

/**
 * Secondary render-to-texture post-process channel.
 *
 * The caller provides a base texture. The pipeline ping-pongs through two FBOs
 * and applies every active fragment shader sequentially, then writes the final
 * pass to the default framebuffer or to an explicitly supplied output target.
 */
export class PostProcessPipeline {
  private readonly shaderManager: ShaderManager
  private readonly uniformCache = new Map<string, PipelineUniformLocations>()
  private targets: [FramebufferTarget, FramebufferTarget] | null = null
  private width = 1
  private height = 1
  private disposed = false

  constructor(private readonly gl: WebGL2RenderingContext) {
    this.shaderManager = new ShaderManager(gl)
  }

  resize(width: number, height: number): void {
    const nextWidth = Math.max(1, Math.floor(width))
    const nextHeight = Math.max(1, Math.floor(height))
    if (this.targets && this.width === nextWidth && this.height === nextHeight) return

    this.releaseTargets()
    this.width = nextWidth
    this.height = nextHeight
    this.targets = [this.createTarget(nextWidth, nextHeight), this.createTarget(nextWidth, nextHeight)]
  }

  render(
    sourceTexture: WebGLTexture,
    passes: readonly ShaderPassDescriptor[],
    configuration: ShaderPostProcessConfiguration,
    time: number,
    outputFramebuffer: WebGLFramebuffer | null = null,
  ): void {
    if (this.disposed) return
    this.resize(configuration.resolution.width, configuration.resolution.height)
    const targets = this.targets
    if (!targets) return

    const activePasses = passes.filter((pass) => pass.enabled)
    if (activePasses.length === 0) {
      this.blitTextureToTarget(sourceTexture, outputFramebuffer)
      return
    }

    let readTexture = sourceTexture
    for (let index = 0; index < activePasses.length; index += 1) {
      const pass = activePasses[index]
      const isFinalPass = index === activePasses.length - 1
      const writeFramebuffer = isFinalPass ? outputFramebuffer : targets[index % 2].framebuffer

      this.drawPass(pass, readTexture, writeFramebuffer, configuration, time)
      if (!isFinalPass) {
        readTexture = targets[index % 2].texture
      }
    }
  }

  dispose(): void {
    if (this.disposed) return
    this.releaseTargets()
    this.shaderManager.disposeAll()
    this.uniformCache.clear()
    this.disposed = true
  }

  private drawPass(
    pass: ShaderPassDescriptor,
    inputTexture: WebGLTexture,
    outputFramebuffer: WebGLFramebuffer | null,
    configuration: ShaderPostProcessConfiguration,
    time: number,
  ): void {
    const program = this.shaderManager.compileProgram(pass.id, FULLSCREEN_TRIANGLE_VERTEX_SHADER, pass.fragmentSource)
    const uniforms = this.getUniforms(pass.id, program)

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, outputFramebuffer)
    this.gl.viewport(0, 0, this.width, this.height)
    this.gl.disable(this.gl.DEPTH_TEST)
    this.gl.disable(this.gl.CULL_FACE)
    this.gl.useProgram(program)

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, inputTexture)
    if (uniforms.texture) this.gl.uniform1i(uniforms.texture, 0)
    if (uniforms.time) this.gl.uniform1f(uniforms.time, time)
    if (uniforms.resolution) this.gl.uniform2f(uniforms.resolution, this.width, this.height)
    if (uniforms.intensity) this.gl.uniform1f(uniforms.intensity, this.resolveIntensity(pass.id, configuration))
    if (uniforms.seed) this.gl.uniform1f(uniforms.seed, this.resolveSeed(pass.id, configuration))

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  private blitTextureToTarget(sourceTexture: WebGLTexture, outputFramebuffer: WebGLFramebuffer | null): void {
    const passthrough = `#version 300 es
precision highp float;
uniform sampler2D u_texture;
in vec2 v_uv;
out vec4 outColor;
void main() { outColor = texture(u_texture, v_uv); }
`
    this.drawPass({ id: 'DigitalGlitch', fragmentSource: passthrough, enabled: true }, sourceTexture, outputFramebuffer, {
      resolution: { width: this.width, height: this.height },
      effects: {
        PortalTransition: { enabled: false, progress: 0, distortion: 0, edgeSoftness: 0 },
        ChromaticAberration: { enabled: false, intensity: 0, direction: [0, 0] },
        DigitalGlitch: { enabled: false, intensity: 0, seed: 0, blockiness: 0 },
        CRTMonitorLook: { enabled: false, scanlineIntensity: 0, vignette: 0, curvature: 0 },
      },
    }, 0)
  }

  private getUniforms(id: string, program: WebGLProgram): PipelineUniformLocations {
    const cached = this.uniformCache.get(id)
    if (cached) return cached
    const uniforms: PipelineUniformLocations = {
      texture: this.gl.getUniformLocation(program, 'u_texture'),
      time: this.gl.getUniformLocation(program, 'u_time'),
      resolution: this.gl.getUniformLocation(program, 'u_resolution'),
      intensity: this.gl.getUniformLocation(program, 'u_intensity'),
      seed: this.gl.getUniformLocation(program, 'u_seed'),
    }
    this.uniformCache.set(id, uniforms)
    return uniforms
  }

  private createTarget(width: number, height: number): FramebufferTarget {
    const texture = this.gl.createTexture()
    const framebuffer = this.gl.createFramebuffer()
    if (!texture || !framebuffer) {
      throw new Error('[PostProcessPipeline] Failed to allocate framebuffer target')
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null)

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer)
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0)
    const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)

    if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
      this.gl.deleteTexture(texture)
      this.gl.deleteFramebuffer(framebuffer)
      throw new Error(`[PostProcessPipeline] Incomplete framebuffer: ${status}`)
    }

    return { framebuffer, texture, width, height }
  }

  private releaseTargets(): void {
    if (!this.targets) return
    for (const target of this.targets) {
      this.gl.deleteTexture(target.texture)
      this.gl.deleteFramebuffer(target.framebuffer)
    }
    this.targets = null
  }

  private resolveIntensity(id: string, configuration: ShaderPostProcessConfiguration): number {
    if (id === 'ChromaticAberration') return configuration.effects.ChromaticAberration.intensity
    if (id === 'DigitalGlitch') return configuration.effects.DigitalGlitch.intensity
    if (id === 'CRTMonitorLook') return configuration.effects.CRTMonitorLook.scanlineIntensity
    return configuration.effects.PortalTransition.distortion
  }

  private resolveSeed(id: string, configuration: ShaderPostProcessConfiguration): number {
    if (id === 'DigitalGlitch') return configuration.effects.DigitalGlitch.seed
    if (id === 'PortalTransition') return configuration.effects.PortalTransition.progress
    return 0
  }
}
