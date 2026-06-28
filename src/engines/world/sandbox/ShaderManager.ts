import { DEFAULT_SHADER_RUNTIME_UNIFORM_PROFILE, type ShaderProgramRecord, type ShaderRuntimeUniformProfile } from './shaderContracts'

/**
 * Pure WebGL2 shader compiler/cache for the sandbox bunker.
 *
 * React must never own program compilation. The Scheduler or a native canvas
 * bootstrapper creates this manager once, then reuses cached WebGLProgram
 * instances during frame execution.
 */
export class ShaderManager {
  private readonly programs = new Map<string, ShaderProgramRecord>()
  private runtimeUniformProfile: ShaderRuntimeUniformProfile = DEFAULT_SHADER_RUNTIME_UNIFORM_PROFILE

  constructor(private readonly gl: WebGL2RenderingContext) {}

  getProgram(id: string): WebGLProgram | null {
    return this.programs.get(id)?.program ?? null
  }

  hasProgram(id: string): boolean {
    return this.programs.has(id)
  }

  compileProgram(id: string, vertexSource: string, fragmentSource: string): WebGLProgram {
    const cached = this.getProgram(id)
    if (cached) return cached

    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexSource, `${id}:vertex`)
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentSource, `${id}:fragment`)
    const program = this.gl.createProgram()

    if (!program) {
      this.gl.deleteShader(vertexShader)
      this.gl.deleteShader(fragmentShader)
      throw new Error(`[ShaderManager] Failed to allocate WebGLProgram for ${id}`)
    }

    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)

    const linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS) as boolean
    if (!linked) {
      const log = this.gl.getProgramInfoLog(program) ?? 'Unknown WebGLProgram link error'
      console.error(`[ShaderManager] Program link failed (${id})\n${log}`)
      this.gl.deleteProgram(program)
      this.gl.deleteShader(vertexShader)
      this.gl.deleteShader(fragmentShader)
      throw new Error(`[ShaderManager] Program link failed for ${id}`)
    }

    this.gl.detachShader(program, vertexShader)
    this.gl.detachShader(program, fragmentShader)
    this.gl.deleteShader(vertexShader)
    this.gl.deleteShader(fragmentShader)

    this.programs.set(id, { id, program, vertexSource, fragmentSource })
    return program
  }

  setRuntimeUniformProfile(profile: ShaderRuntimeUniformProfile): void {
    this.runtimeUniformProfile = Object.freeze({ ...profile })
  }

  getRuntimeUniformProfile(): ShaderRuntimeUniformProfile {
    return this.runtimeUniformProfile
  }

  disposeProgram(id: string): void {
    const record = this.programs.get(id)
    if (!record) return
    this.gl.deleteProgram(record.program)
    this.programs.delete(id)
  }

  disposeAll(): void {
    for (const id of this.programs.keys()) {
      this.disposeProgram(id)
    }
  }

  private compileShader(type: number, source: string, label: string): WebGLShader {
    const shader = this.gl.createShader(type)
    if (!shader) {
      throw new Error(`[ShaderManager] Failed to allocate shader ${label}`)
    }

    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    const compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS) as boolean
    if (!compiled) {
      const log = this.gl.getShaderInfoLog(shader) ?? 'Unknown WebGLShader compile error'
      console.error(`[ShaderManager] Shader compile failed (${label})\n${log}`)
      this.gl.deleteShader(shader)
      throw new Error(`[ShaderManager] Shader compile failed for ${label}`)
    }

    return shader
  }
}

export const FULLSCREEN_TRIANGLE_VERTEX_SHADER = `#version 300 es
precision highp float;

const vec2 POSITIONS[3] = vec2[3](
  vec2(-1.0, -1.0),
  vec2( 3.0, -1.0),
  vec2(-1.0,  3.0)
);

out vec2 v_uv;

void main() {
  vec2 position = POSITIONS[gl_VertexID];
  v_uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`
