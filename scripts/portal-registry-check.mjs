import { readFileSync } from 'node:fs'

const registry = readFileSync('src/engines/portal/portalRegistry.ts', 'utf8')
const worldGate = readFileSync('src/components/fusion/FusionWorldStageV5.tsx', 'utf8')

const requiredPortals = ['gaming', 'science', 'green', 'fun']
const missing = requiredPortals.filter((portal) => !registry.includes(`id: '${portal}'`))

if (missing.length) {
  console.error(`FAIL portal registry missing: ${missing.join(', ')}`)
  process.exit(1)
}

if (!worldGate.includes('getPortalRegistry')) {
  console.error('FAIL World Gate V5 must consume Portal Registry')
  process.exit(1)
}

if (!registry.includes('unlockCondition') || !registry.includes('wispWatching')) {
  console.error('FAIL Green Node unlock condition must remain registry-driven')
  process.exit(1)
}

console.log('PASS audit:portal')
