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
const provider = read('src/providers/WispProvider.tsx')
const css = read('src/xethkioz-redesign.css')

add('WispEngineContext exists', exists('src/lib/WispEngineContext.tsx') && engine.includes('WispEngineProvider'), 'Wisp must have an engine/provider, not only visual markup.')
add('Wisp states cover future AI/event integration', ['idle','watching','connected','guiding','alert','sleeping'].every((token) => engine.includes(token) && entity.includes(token)), 'Wisp Engine must expose stable states.')
add('Wisp events are persisted', engine.includes('WispEvent') && engine.includes('localStorage') && engine.includes('registerEvent'), 'Engine must store basic event trail for future AI hooks.')
add('Provider wraps AppShell', ((app.includes('<WispEngineProvider>') && app.indexOf('<WispEngineProvider>') < app.indexOf('<AppShell />')) || (app.includes('<WispProvider>') && app.indexOf('<WispProvider>') < app.indexOf('<AppShell />'))), 'Wisp Engine/WispProvider must be global.')
add('Global Wisp consumes engine', global.includes('useWisp()') && global.includes('registerEvent') && global.includes('setMood'), 'Global Wisp must react to routes/account/event signals.')
add('Provider exposes Wisp state', provider.includes('mood: engine.mood') && provider.includes('energy: engine.energy') && provider.includes('focusRoute: engine.focusRoute'), 'The global bridge must expose mood, energy and route state.')
add('Wisp visual has state UI', css.includes('.xk-wisp-aura') && css.includes('.xk-wisp-face') && css.includes('.xk-wisp-taunt') && css.includes('.xk-wisp-portal'), 'Wisp visual must communicate state without becoming decorative only.')

const failed = checks.filter((check) => !check.passed)
console.log('# XETHKIOZ Wisp Engine Check')
console.log(`Generated: ${new Date().toISOString()}\n`)
for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} - ${check.name}`)
  console.log(`  ${check.details}`)
}
console.log(`\nResult: ${failed.length === 0 ? 'PASS' : 'FAIL'}`)
if (failed.length) process.exit(1)
