import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sandbox = path.join(root, 'src', 'engines', 'world', 'sandbox')
const requiredFiles = [
  'shaderContracts.ts',
  'ShaderManager.ts',
  'postProcessPipeline.ts',
  'glitchShader.glsl',
]

const checks = []
function addCheck(name, pass, detail) {
  checks.push({ name, pass, detail })
}
function read(file) {
  return fs.readFileSync(path.join(sandbox, file), 'utf8')
}

for (const file of requiredFiles) {
  addCheck(`${file} exists`, fs.existsSync(path.join(sandbox, file)), 'Alpha 3.3 shader modules must remain isolated in sandbox/.')
}

const contracts = read('shaderContracts.ts')
const manager = read('ShaderManager.ts')
const pipeline = read('postProcessPipeline.ts')
const shader = read('glitchShader.glsl')
const index = read('index.ts')
const combinedTs = contracts + manager + pipeline

addCheck('Shader effect contracts exist', ['PortalTransition', 'ChromaticAberration', 'DigitalGlitch', 'CRTMonitorLook'].every((name) => contracts.includes(name)), 'Official shader effect flags must be typed.')
addCheck('WebGL2 ShaderManager exists', /class ShaderManager/.test(manager) && /WebGL2RenderingContext/.test(manager), 'ShaderManager must be a pure WebGL2 compiler/cache.')
addCheck('Strict compile and link errors exist', /COMPILE_STATUS/.test(manager) && /LINK_STATUS/.test(manager) && /console\.error/.test(manager), 'Sandbox shader failures must be visible in development console.')
addCheck('Program cache exists', /Map<string, ShaderProgramRecord>/.test(manager) && /getProgram/.test(manager), 'Compiled programs must be cached.')
addCheck('Render-to-texture pipeline exists', /class PostProcessPipeline/.test(pipeline) && /createFramebuffer/.test(pipeline) && /framebufferTexture2D/.test(pipeline), 'Pipeline must use FBO render-to-texture pass chaining.')
addCheck('Sequential pass rendering exists', /activePasses/.test(pipeline) && /drawPass/.test(pipeline), 'Post-process filters must apply sequentially.')
addCheck('GLSL ES 3.00 shader exists', /#version 300 es/.test(shader) && /u_time/.test(shader) && /u_resolution/.test(shader) && /u_texture/.test(shader), 'Green Node shader must declare required uniforms.')
addCheck('Glitch and chromatic aberration implemented', /redOffset/.test(shader) && /blueOffset/.test(shader) && /noise/.test(shader), 'Shader must separate color channels and distort with procedural noise.')
addCheck('No React imports in shader pipeline', !/from ['"]react/.test(combinedTs), 'Shader pipeline must not depend on React or Stage re-renders.')
addCheck('Sandbox exports shader modules', ['shaderContracts', 'ShaderManager', 'postProcessPipeline'].every((name) => index.includes(name)), 'Index exports must be discoverable for review.')

console.log('# XETHKIOZ Shader Pipeline Sandbox Check')
console.log(`Generated: ${new Date().toISOString()}\n`)
for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} - ${check.name}`)
  console.log(`  ${check.detail}`)
}
const failed = checks.filter((check) => !check.pass)
console.log(`\nResult: ${failed.length === 0 ? 'PASS' : 'FAIL'}`)
if (failed.length > 0) process.exit(1)
