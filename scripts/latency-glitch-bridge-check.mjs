import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'src/engines/world/sandbox/PerformanceMonitor.ts',
  'src/engines/world/sandbox/RuntimeBridge.ts',
  'src/engines/world/sandbox/shaderContracts.ts',
  'src/engines/world/sandbox/portalEventContracts.ts',
]

const failures = []

for (const file of requiredFiles) {
  if (!existsSync(file)) failures.push(`Missing ${file}`)
}

function expectContains(file, terms) {
  if (!existsSync(file)) return
  const content = readFileSync(file, 'utf8')
  for (const term of terms) {
    if (!content.includes(term)) failures.push(`${file} missing token: ${term}`)
  }
}

expectContains('src/engines/world/sandbox/shaderContracts.ts', [
  'networkLatency',
  'latencyGlitchBoost',
  'frameSmoothing',
])

expectContains('src/engines/world/sandbox/portalEventContracts.ts', [
  'NETWORK_LATENCY_CHANGED',
  'NetworkLatencyChangedPayload',
])

expectContains('src/engines/world/sandbox/PerformanceMonitor.ts', [
  'latencyProbeIntervalMs',
  'createSupabaseLatencyProbe',
  'NETWORK_LATENCY_CHANGED',
  'performance.now()',
])

expectContains('src/engines/world/sandbox/RuntimeBridge.ts', [
  'handleNetworkLatencyChanged',
  'resolveLatencyCurve',
  'BASIC',
  'ARCHITECT',
  'setRuntimeUniformProfile',
])

if (failures.length) {
  console.error('[audit:latency-glitch-bridge] FAIL')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('[audit:latency-glitch-bridge] PASS')
