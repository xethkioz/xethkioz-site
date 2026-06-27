import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.existsSync(path.join(root, file)) ? fs.readFileSync(path.join(root, file), 'utf8') : ''
const exists = (file) => fs.existsSync(path.join(root, file))
const checks = []
const add = (name, passed, details) => checks.push({ name, passed, details })

const app = read('src/App.tsx')
const engine = read('src/lib/WispEngineContext.tsx')
const entity = read('src/components/fusion/FusionWispEntity.tsx')
const global = read('src/components/fusion/FusionGlobalWisp.tsx')
const status = read('src/components/fusion/FusionGlobalStatus.tsx')
const css = read('src/index.css')

add('WispEngineContext exists', exists('src/lib/WispEngineContext.tsx') && engine.includes('WispEngineProvider'), 'Wisp must have an engine/provider, not only visual markup.')
add('Wisp states cover future AI/event integration', ['idle','watching','connected','guiding','alert','sleeping'].every((token) => engine.includes(token) && entity.includes(token)), 'Wisp Engine must expose stable states.')
add('Wisp events are persisted', engine.includes('WispEvent') && engine.includes('localStorage') && engine.includes('registerEvent'), 'Engine must store basic event trail for future AI hooks.')
add('Provider wraps AppShell', ((app.includes('<WispEngineProvider>') && app.indexOf('<WispEngineProvider>') < app.indexOf('<AppShell />')) || (app.includes('<WispProvider>') && app.indexOf('<WispProvider>') < app.indexOf('<AppShell />'))), 'Wisp Engine/WispProvider must be global.')
add('Global Wisp consumes engine', global.includes('useWispEngine') && global.includes('registerEvent'), 'Global Wisp must react to routes/account/event signals.')
add('Status panel exposes Wisp state', status.includes('mood') && status.includes('energy') && status.includes('t.v7.wisp.status'), 'Global status must show Wisp state/energy.')
add('Wisp visual has state UI', css.includes('.fusion-wisp-guiding') && css.includes('.fusion-wisp-meter') && css.includes('.fusion-wisp-bubble'), 'Wisp visual must communicate state without becoming decorative only.')

const failed = checks.filter((check) => !check.passed)
console.log('# XETHKIOZ Wisp Engine Check')
console.log(`Generated: ${new Date().toISOString()}\n`)
for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} - ${check.name}`)
  console.log(`  ${check.details}`)
}
console.log(`\nResult: ${failed.length === 0 ? 'PASS' : 'FAIL'}`)
if (failed.length) process.exit(1)
