import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const component = read('src/components/NexusDistrict.tsx')
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

check('Nexus links preserve localized routes', component.includes('const { lang, localizePath } = useLang()') && component.includes('to={localizePath(item.to)}'))
check('Gaming live access opens the live section', component.includes("to: '/gaming?section=live'"))
check('Science prioritizes sourced news', component.indexOf("title: 'Noticias con fuentes'") < component.indexOf("title: 'Herramientas y respuestas'"))
check('Home exposes only the three public primary portals', !component.includes("title: 'Green Node', detail: 'Archivos"))
check('Decorative transit rail is removed', !component.includes('UniverseTransitRail') && !component.includes('xk-nexus-transit'))
check('Simulated live status language is removed', !/JUGADORES CONECTADOS|PLAYERS CONNECTED|INVESTIGACIÓN ACTIVA|RESEARCH ACTIVE/.test(component))
check('Section headings describe a concrete user action', component.includes('Elegí qué hacer ahora en Gaming') && component.includes('Fuentes, herramientas y proyectos'))

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
