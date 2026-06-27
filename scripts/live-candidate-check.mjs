import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const checks = [
  ['src/pages/Home.tsx', ['WorldGateV5']],
  ['src/components/fusion/FusionWorldStageV5.tsx', ['getPortalRegistry', 'panel-cyber']],
  ['src/engines/portal/portalRegistry.ts', ['portalRegistry', 'wispWatching']],
  ['src/design/designTokens.ts', ['designTokens', 'fusionAccent']],
  ['src/components/fusion/FusionWispEntity.tsx', ['fusion-wisp-entity']],
  ['src/components/fusion/FusionGlobalWisp.tsx', ['FusionGlobalWisp', 'FusionWispEntity']],
  ['src/components/fusion/FusionGlobalStatus.tsx', ['FusionGlobalStatus', 'FUSION_STAGE']],
  ['src/components/Header.tsx', ['useHud', 'fusion-hud-panel']],
  ['src/lib/HudContext.tsx', ['localStorage', 'xethkioz.hud.sound', 'xethkioz.hud.account.status']],
]

const failures = []
for (const [file, needles] of checks) {
  const path = join(root, file)
  if (!existsSync(path)) {
    failures.push(`${file}: missing`)
    continue
  }
  const content = readFileSync(path, 'utf8')
  for (const needle of needles) {
    if (!content.includes(needle)) failures.push(`${file}: missing ${needle}`)
  }
}

const home = readFileSync(join(root, 'src/pages/Home.tsx'), 'utf8')
if (home.includes('alpha6-portal-world') || home.includes('<img')) {
  failures.push('Home must not use flattened concept image UI or direct image-based interface.')
}

mkdirSync(join(root, 'docs/QA'), { recursive: true })
const report = [
  '# Fusion Alpha 1.0 Live Candidate Check',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  failures.length ? '## Result: FAILED' : '## Result: PASSED',
  '',
  ...((failures.length ? failures : ['All live-candidate guardrails passed.']).map((line) => `- ${line}`)),
  '',
].join('\n')
writeFileSync(join(root, 'docs/QA/FUSION_ALPHA_1_0_LIVE_CHECK.md'), report)

if (failures.length) {
  console.error(report)
  process.exit(1)
}
console.log(report)
