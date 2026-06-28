import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sandbox = path.join(root, 'src', 'engines', 'world', 'sandbox')
const requiredFiles = [
  'portalEventContracts.ts',
  'PerformanceMonitor.ts',
  'RuntimeBridge.ts',
]
const checks = []
function addCheck(name, pass, detail) { checks.push({ name, pass, detail }) }
function read(file) { return fs.readFileSync(path.join(sandbox, file), 'utf8') }

for (const file of requiredFiles) {
  addCheck(`${file} exists`, fs.existsSync(path.join(sandbox, file)), 'Alpha 3.4 telemetry modules must remain isolated in sandbox/.')
}

const contracts = read('portalEventContracts.ts')
const monitor = read('PerformanceMonitor.ts')
const bridge = read('RuntimeBridge.ts')
const manager = read('ShaderManager.ts')
const shaderContracts = read('shaderContracts.ts')
const index = read('index.ts')
const combined = contracts + monitor + bridge

addCheck('Portal event contracts exist', ['PORTAL_STATE_CHANGED', 'CRITICAL_PERFORMANCE_DROP', 'PortalRuntimeEventMap', 'PortalEventBusLike'].every((token) => contracts.includes(token)), 'EventBus contracts must type portal and performance events.')
addCheck('Portal nodes are typed', ['GAMING', 'IA', 'SCIENCE', 'GREEN_NODE'].every((token) => contracts.includes(token)), 'Core portal payload nodes must be explicit.')
addCheck('PerformanceMonitor singleton exists', /class PerformanceMonitor/.test(monitor) && /static getInstance/.test(monitor), 'PerformanceMonitor must be a singleton wrapper around RAF.')
addCheck('RAF and performance.now are used', /requestAnimationFrame/.test(monitor) && /performance\.now/.test(monitor), 'Monitor must measure native frame timing outside React.')
addCheck('16.6ms warning threshold exists', /16\.6/.test(monitor) && /consecutiveSlowFrames/.test(monitor) && /console\.warn/.test(monitor), 'Monitor must alert after repeated budget violations.')
addCheck('WebGL timer extension is detected', /EXT_disjoint_timer_query_webgl2/.test(monitor), 'Monitor must detect EXT_disjoint_timer_query_webgl2 when available.')
addCheck('RuntimeBridge listens to EventBus', /class RuntimeBridge/.test(bridge) && /PORTAL_STATE_CHANGED/.test(bridge) && /eventBus\.on/.test(bridge), 'Bridge must subscribe to portal transitions.')
addCheck('GREEN_NODE activates shader profile', /GREEN_NODE/.test(bridge) && /glitchIntensity/.test(bridge) && /chromaticAberration/.test(bridge), 'Green Node must activate glitch/chromatic uniforms.')
addCheck('Other portals use lerp transition', /lerpProfile/.test(bridge) && /transitionLerp/.test(bridge), 'Non-critical transitions must soften intense effects.')
addCheck('ShaderManager accepts runtime uniforms', /setRuntimeUniformProfile/.test(manager) && /getRuntimeUniformProfile/.test(manager), 'Bridge must inject uniforms into ShaderManager directly.')
addCheck('Shader runtime uniform contract exists', /ShaderRuntimeUniformProfile/.test(shaderContracts), 'Uniform profile must be typed in shader contracts.')
addCheck('No React imports in EventBus telemetry core', !/from ['"]react/.test(combined), 'Telemetry bridge must not cause React re-renders.')
addCheck('Sandbox exports eventbus telemetry modules', ['portalEventContracts', 'PerformanceMonitor', 'RuntimeBridge'].every((name) => index.includes(name)), 'Index exports must expose Alpha 3.4 modules for audit/review.')

console.log('# XETHKIOZ EventBus Telemetry Sandbox Check')
console.log(`Generated: ${new Date().toISOString()}\n`)
for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} - ${check.name}`)
  console.log(`  ${check.detail}`)
}
const failed = checks.filter((check) => !check.pass)
console.log(`\nResult: ${failed.length === 0 ? 'PASS' : 'FAIL'}`)
if (failed.length > 0) process.exit(1)
