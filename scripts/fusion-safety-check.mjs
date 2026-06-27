import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
const exists = (file) => fs.existsSync(path.join(root, file))

const checks = []
const add = (name, passed, details) => checks.push({ name, passed, details })

const app = read(path.join(root, 'src/App.tsx'))
const home = read(path.join(root, 'src/pages/Home.tsx'))
const header = read(path.join(root, 'src/components/Header.tsx'))
const portalGate = read(path.join(root, 'src/components/fusion/FusionPortalGate.tsx'))
const wispEntity = read(path.join(root, 'src/components/fusion/FusionWispEntity.tsx'))
const worldStage = read(path.join(root, 'src/components/fusion/FusionWorldStage.tsx'))
const globalWisp = read(path.join(root, 'src/components/fusion/FusionGlobalWisp.tsx'))
const globalStatus = read(path.join(root, 'src/components/fusion/FusionGlobalStatus.tsx'))
const fusionConfig = read(path.join(root, 'src/lib/fusionConfig.ts'))
const designSystem = read(path.join(root, 'src/lib/designSystem.ts'))

add('Global Header remains outside routes', app.includes('<Header />') && app.indexOf('<Header />') < app.indexOf('<Routes>'), 'Header must render from AppShell before Routes so controls exist in every portal.')
add('Public routes remain scoped', ['/gaming', '/science', '/fun', '/green-node'].every((route) => app.includes(`path="${route}"`)), 'Expected public routes are present.')
add('FusionPortalGate component exists', exists('src/components/fusion/FusionPortalGate.tsx') && portalGate.includes('FusionPortalGate'), 'Portal UI must be a reusable React component, not duplicated markup.')
add('Home uses real portal component', (home.includes('<FusionPortalGate') || worldStage.includes('<FusionPortalGate')) && !home.includes('alpha6-portal-world'), 'Home must use reusable portal components through a React/CSS layer, not a flattened concept-art image as UI.')
add('Green Wisp remains global route access', ((home.includes('<FusionWispEntity') || worldStage.includes('<FusionWispEntity') || globalWisp.includes('<FusionWispEntity')) && wispEntity.includes("'/green-node'")), 'Wisp must remain a global Easter Egg access path to Green Node.')
add('Global status remains outside routes', app.includes('<FusionGlobalStatus />') && globalStatus.includes('FusionGlobalStatus'), 'System status must render globally through AppShell.')
add('Header contains required controls', header.includes('setLang') && (header.includes('toggleSound') || header.includes('setSoundOn')) && header.includes('account'), 'Language, sound and account controls must remain global.')
add('Guardrails documented', fusionConfig.includes('FUSION_GUARDRAILS') && designSystem.includes('designGuardrails'), 'Project guardrails must remain in code, not only in notes.')

const failed = checks.filter((check) => !check.passed)

console.log('# XETHKIOZ Fusion Safety Check')
console.log(`Generated: ${new Date().toISOString()}\n`)
for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} - ${check.name}`)
  console.log(`  ${check.details}`)
}
console.log(`\nResult: ${failed.length === 0 ? 'PASS' : 'FAIL'}`)

if (failed.length > 0) process.exit(1)
