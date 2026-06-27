import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.existsSync(path.join(root, file)) ? fs.readFileSync(path.join(root, file), 'utf8') : ''
const exists = (file) => fs.existsSync(path.join(root, file))
const checks = []
const add = (name, passed, details) => checks.push({ name, passed, details })

const app = read('src/App.tsx')
const header = read('src/components/Header.tsx')
const hud = read('src/lib/HudContext.tsx')
const fusionConfig = read('src/lib/fusionConfig.ts')
const css = read('src/index.css')
const globalStatus = read('src/components/fusion/FusionGlobalStatus.tsx')
const globalWisp = read('src/components/fusion/FusionGlobalWisp.tsx')

add('HudContext exists', exists('src/lib/HudContext.tsx') && hud.includes('HudProvider') && hud.includes('useHud'), 'HUD state must live in a reusable context.')
add('App wraps routes with HudProvider', app.includes('<HudProvider>') && app.includes('</HudProvider>'), 'HUD provider must sit above AppShell so every route can access global state.')
add('Header consumes HUD context', header.includes('useHud()') && header.includes('toggleSound') && !header.includes('useState(false)'), 'Header must not own local-only sound state.')
add('HUD persists sound and volume', hud.includes('localStorage') && hud.includes('xethkioz.hud.sound') && hud.includes('xethkioz.hud.volume'), 'Sound and volume must persist between routes and reloads.')
add('HUD persists login preview state', hud.includes('xethkioz.hud.account.status') && hud.includes('toggleAccount') && header.includes('toggleAccount'), 'Login preview must be persistent and controlled from global HUD context.')
add('HUD has visible volume foundation', header.includes('type="range"') && header.includes('setVolume'), 'Volume control foundation must be present without adding real audio tracks yet.')
add('Guardrail updated', fusionConfig.includes('HUD state must be global and persistent'), 'HUD rule must be documented in code guardrails.')
add('CSS has HUD polish', css.includes('.fusion-hud-panel') && css.includes('.fusion-volume-control'), 'HUD-specific CSS must be present and isolated.')
add('Global status component exists', globalStatus.includes('FusionGlobalStatus') && app.includes('<FusionGlobalStatus />'), 'System status must be globally visible through AppShell.')
add('Global Wisp component exists', globalWisp.includes('FusionGlobalWisp') && app.includes('<FusionGlobalWisp />'), 'Wisp must be globally visible through AppShell, not Home-only.')

const failed = checks.filter((check) => !check.passed)

console.log('# XETHKIOZ HUD Persistence Check')
console.log(`Generated: ${new Date().toISOString()}\n`)
for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} - ${check.name}`)
  console.log(`  ${check.details}`)
}
console.log(`\nResult: ${failed.length === 0 ? 'PASS' : 'FAIL'}`)

if (failed.length > 0) process.exit(1)
