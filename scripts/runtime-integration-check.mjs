import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.existsSync(path.join(root, file)) ? fs.readFileSync(path.join(root, file), 'utf8') : ''
const exists = (file) => fs.existsSync(path.join(root, file))

const checks = []
const add = (name, passed, details) => checks.push({ name, passed, details })

const app = read('src/App.tsx')
const runtimeIndex = read('src/engines/world/runtime/index.ts')
const integration = read('src/engines/world/runtime/WorldRuntimeIntegration.tsx')
const events = read('src/engines/world/runtime/worldRuntimeEvents.ts')
const scheduler = read('src/engines/world/runtime/worldScheduler.ts')

add('Runtime provider wraps app', app.includes('<WorldRuntimeProvider>') && app.includes('<WorldRuntimeIntegration />'), 'App must mount the World Runtime boundary and integration task runner.')
add('Engine providers wrap shell', ['<WorldStateProvider>', '<WorldOrchestratorProvider>', '<WorldThemeProvider>', '<LightingEngineProvider>'].every((token) => app.includes(token)), 'Core engine providers must be globally mounted before AppShell.')
add('Integration component exists', exists('src/engines/world/runtime/WorldRuntimeIntegration.tsx') && integration.includes('WorldRuntimeIntegration'), 'Sprint D requires a dedicated runtime integration component.')
add('Scheduler phase order is deterministic', ['"frame"', '"state"', '"orchestrator"', '"theme"', '"lighting"', '"camera"', '"ui"'].every((token) => scheduler.includes(token)), 'Scheduler must keep frame → state → orchestrator → theme → lighting → camera → ui.')
add('Runtime registers every phase', ['"frame"', '"state"', '"orchestrator"', '"theme"', '"lighting"', '"camera"', '"ui"'].every((token) => integration.includes(token)) && integration.includes('scheduler.register'), 'Runtime integration must register one task per phase.')
add('Phase metrics publish to Event Bus', events.includes('SCHEDULER_PHASE_METRIC') && integration.includes('bus.emit("SCHEDULER_PHASE_METRIC"'), 'Each phase must publish metrics through the World Event Bus.')
add('Runtime exports integration and scheduler', runtimeIndex.includes('WorldRuntimeIntegration') && runtimeIndex.includes('WorldScheduler'), 'Runtime index must expose Sprint D integration and scheduler contracts.')

const failed = checks.filter((check) => !check.passed)

console.log('# XETHKIOZ Runtime Integration Check')
console.log(`Generated: ${new Date().toISOString()}\n`)
for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} - ${check.name}`)
  console.log(`  ${check.details}`)
}
console.log(`\nResult: ${failed.length === 0 ? 'PASS' : 'FAIL'}`)

if (failed.length > 0) process.exit(1)
