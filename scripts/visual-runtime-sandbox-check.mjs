import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sandbox = path.join(root, 'src', 'engines', 'world', 'sandbox')
const requiredFiles = [
  'visualTypes.ts',
  'visualForces.ts',
  'visualEmitters.ts',
  'visualSimulationLoop.ts',
]

const checks = []
function addCheck(name, pass, detail) {
  checks.push({ name, pass, detail })
}
function read(file) {
  return fs.readFileSync(path.join(sandbox, file), 'utf8')
}

for (const file of requiredFiles) {
  addCheck(`${file} exists`, fs.existsSync(path.join(sandbox, file)), 'Alpha 3.3 visual runtime modules must remain isolated in sandbox/.')
}

const types = read('visualTypes.ts')
const forces = read('visualForces.ts')
const emitters = read('visualEmitters.ts')
const loop = read('visualSimulationLoop.ts')
const index = read('index.ts')

addCheck('Portal behavior presets exist', /ActivePortalBehavior/.test(types) && /GAMING/.test(types) && /SCIENCE/.test(types) && /GREEN_NODE/.test(types), 'Gaming, Science and Green Node presets are required.')
addCheck('Float32Array buffer contract exists', /Float32Array/.test(types) && /PARTICLE_BUFFER_LAYOUT/.test(types), 'Simulation must use flat native buffers.')
addCheck('Force catalog implemented', ['applyGravity', 'applyPulse', 'applyNoiseField', 'applyRepulsion'].every((name) => forces.includes(`function ${name}`)), 'Official XETHKIOZ procedural forces must exist.')
addCheck('Emitter catalog implemented', ['WispEmitter', 'PortalEmitter', 'CursorEmitter', 'VisualEmitterRegistry'].every((name) => emitters.includes(name)), 'Dynamic emitters and hot registry must exist.')
addCheck('Pure simulation loop exists', /class VisualRuntimeSimulation/.test(loop) && /step\(dt: number\)/.test(loop), 'External Scheduler must drive the simulation with dt.')
addCheck('No React imports in visual runtime', !/from ['"]react/.test(types + forces + emitters + loop), 'Sandbox simulation must not depend on React state or re-renders.')
addCheck('Sandbox exports Alpha 3.3 modules', ['visualTypes', 'visualForces', 'visualEmitters', 'visualSimulationLoop'].every((name) => index.includes(name)), 'Index exports must be discoverable for Gemini/GitHub review.')

console.log('# XETHKIOZ Visual Runtime Sandbox Check')
console.log(`Generated: ${new Date().toISOString()}\n`)
for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} - ${check.name}`)
  console.log(`  ${check.detail}`)
}
const failed = checks.filter((check) => !check.pass)
console.log(`\nResult: ${failed.length === 0 ? 'PASS' : 'FAIL'}`)
if (failed.length > 0) process.exit(1)
