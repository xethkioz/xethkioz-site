import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const district = read('src/components/NexusDistrict.tsx')
const pulse = read('src/components/PortalPulseRail.tsx')
const gaming = read('src/pages/GamingHub.tsx')
const browserTest = read('tests/e2e/content-design.spec.ts')
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

check('Nexus links preserve localized routes', district.includes('const { lang, localizePath } = useLang()') && district.includes('to={localizePath(item.to)}'))
check('Science prioritizes sourced news', district.indexOf("title: 'Noticias con fuentes'") < district.indexOf("title: 'Herramientas y respuestas'"))
check('Home exposes only the three public primary portals', !district.includes("title: 'Green Node', detail: 'Archivos"))
check('Decorative transit rail is removed', !district.includes('UniverseTransitRail') && !district.includes('xk-nexus-transit'))
check('Simulated live status language is removed', !/JUGADORES CONECTADOS|PLAYERS CONNECTED|INVESTIGACIÓN ACTIVA|RESEARCH ACTIVE/.test(district))
check('Section headings describe a concrete user action', district.includes('Fuentes, herramientas y proyectos'))
check('Portal action rails preserve localized internal routes', pulse.includes('const { localizePath } = useLang()') && pulse.includes('localizePath(item.to)'))
check('Portal action rails keep external destinations explicit', pulse.includes('const external = /^https?:') && pulse.includes('target="_blank"'))

check('Gaming removes duplicate Wisp and district navigation', !gaming.includes('PortalWispGuide') && !gaming.includes('<NexusDistrict'))
check('Gaming removes decorative ticker before content', !gaming.includes('xk-gaming-ticker'))
check('Gaming places section navigation before overview content', gaming.indexOf('xk-gaming-section-nav') < gaming.indexOf('xk-gaming-start'))
check('Gaming uses honest route count instead of fake percentage', gaming.includes('RUTAS DISPONIBLES') && !gaming.includes('98.7%'))
check('Gaming replaces unverified hardware placeholders', gaming.includes('Prepará tu perfil para encontrar grupo') && !gaming.includes('Especificaciones en verificación'))
check('Gaming localizes translated internal links', gaming.includes("localizePath('/gaming/guides')") && gaming.includes("localizePath('/community')"))

check('Browser tests cover simplified Home access', browserTest.includes('tres accesos principales') && browserTest.includes('toHaveCount(3)'))
check('Browser tests cover streamlined Gaming hierarchy', browserTest.includes('una sola navegación antes del contenido') && browserTest.includes('Especificaciones en verificación'))
check('Browser tests cover localized Science routes', browserTest.includes('/en/science#lab-assistant') && browserTest.includes('/en/creacion-web'))

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
