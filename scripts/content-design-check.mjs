import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const district = read('src/components/NexusDistrict.tsx')
const pulse = read('src/components/PortalPulseRail.tsx')
const browserTest = read('tests/e2e/content-design.spec.ts')
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

check('Nexus links preserve localized routes', district.includes('const { lang, localizePath } = useLang()') && district.includes('to={localizePath(item.to)}'))
check('Gaming live access opens the live section', district.includes("to: '/gaming?section=live'"))
check('Science prioritizes sourced news', district.indexOf("title: 'Noticias con fuentes'") < district.indexOf("title: 'Herramientas y respuestas'"))
check('Home exposes only the three public primary portals', !district.includes("title: 'Green Node', detail: 'Archivos"))
check('Decorative transit rail is removed', !district.includes('UniverseTransitRail') && !district.includes('xk-nexus-transit'))
check('Simulated live status language is removed', !/JUGADORES CONECTADOS|PLAYERS CONNECTED|INVESTIGACIÓN ACTIVA|RESEARCH ACTIVE/.test(district))
check('Section headings describe a concrete user action', district.includes('Elegí qué hacer ahora en Gaming') && district.includes('Fuentes, herramientas y proyectos'))
check('Portal action rails preserve localized internal routes', pulse.includes('const { localizePath } = useLang()') && pulse.includes('localizePath(item.to)'))
check('Portal action rails keep external destinations explicit', pulse.includes('const external = /^https?:') && pulse.includes('target="_blank"'))
check('Browser tests cover simplified Home access', browserTest.includes('tres accesos principales') && browserTest.includes("toHaveCount(3)"))
check('Browser tests cover localized Gaming and Science routes', browserTest.includes('/en/gaming?section=live') && browserTest.includes('/en/creacion-web'))

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`Content design audit failed: ${failed} checks failed.`)
  process.exit(1)
}

console.log('XETHKIOZ content design audit PASS')
