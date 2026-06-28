import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.existsSync(path.join(root, file)) ? fs.readFileSync(path.join(root, file), 'utf8') : ''
const exists = (file) => fs.existsSync(path.join(root, file))

const checks = []
const add = (name, passed, details) => checks.push({ name, passed, details })

const wisp = read('src/components/fusion/FusionWispEntity.tsx')
const home = read('src/pages/Home.tsx')
const legacyWorldStage = read('src/components/fusion/FusionWorldStage.tsx')
const worldGateV5 = read('src/engines/world/WorldGateV5.tsx')
const worldHeroStage = read('src/engines/world/WorldHeroStage.tsx')
const globalWisp = read('src/components/fusion/FusionGlobalWisp.tsx')
const css = read('src/index.css')
const fusionConfig = read('src/lib/fusionConfig.ts')

add('FusionWispEntity exists', exists('src/components/fusion/FusionWispEntity.tsx') && wisp.includes('FusionWispEntity'), 'Wisp must be a reusable component.')
add('Wisp supports states', ['idle', 'watching', 'connected', 'guiding', 'alert', 'sleeping'].every((token) => wisp.includes(token)), 'Wisp must expose stable visual states for future interaction and AI/event hooks.')
add(
  'Home uses reusable Wisp through the active World Gate layer',
  (legacyWorldStage.includes('<FusionWispEntity') || globalWisp.includes('<FusionWispEntity') || worldGateV5.includes('<WispHUD') || worldHeroStage.includes('<WorldWispMotion'))
    && (home.includes('<FusionWorldStage') || home.includes('<WorldGateV5'))
    && !home.includes('className="green-wisp-secret"'),
  'Home must use reusable Wisp/World Wisp components through the current World Gate layer, not hardcode old Wisp markup.',
)
add(
  'Wisp routes to Green Node',
  (wisp.includes("'/green-node'") || worldGateV5.includes("'/green-node'"))
    && (legacyWorldStage.includes('wispLabel') || globalWisp.includes('wispLabel') || globalWisp.includes('t.v7.core.wispLabel') || worldGateV5.includes('green-node')),
  'Wisp access must remain hidden route access to Green Node.',
)
add('Wisp CSS is present', css.includes('.fusion-wisp-entity') && css.includes('@keyframes fusionWispDrift'), 'Wisp must have lightweight CSS animation, not an image-only UI.')
add('Guardrail documented', fusionConfig.includes('reusable entity component'), 'Wisp rule must be present in fusionConfig guardrails.')

const failed = checks.filter((check) => !check.passed)

console.log('# XETHKIOZ Wisp Entity Check')
console.log(`Generated: ${new Date().toISOString()}\n`)
for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} - ${check.name}`)
  console.log(`  ${check.details}`)
}
console.log(`\nResult: ${failed.length === 0 ? 'PASS' : 'FAIL'}`)

if (failed.length > 0) process.exit(1)
