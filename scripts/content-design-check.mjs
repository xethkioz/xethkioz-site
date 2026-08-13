import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const district = read('src/components/NexusDistrict.tsx')
const pulse = read('src/components/PortalPulseRail.tsx')
const gaming = read('src/pages/GamingHub.tsx')
const science = read('src/pages/ScienceLab.tsx')
const home = read('src/pages/Home.tsx')
const accessibility = read('src/accessibility.css')
const browserTest = read('tests/e2e/content-design.spec.ts')
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

check('Nexus links preserve localized routes', district.includes('const { lang, localizePath } = useLang()') && district.includes('to={localizePath(item.to)}'))
check('Science district prioritizes sourced news', district.indexOf("title: 'Noticias con fuentes'") < district.indexOf("title: 'Herramientas y respuestas'"))
check('Home exposes four public primary portals', home.includes("id: 'comicon'") && home.includes('4 PORTALES PRINCIPALES ACTIVOS') && !district.includes("title: 'Green Node', detail: 'Archivos"))
check('Home exposes an ordered six-section index', home.includes('xk-rb-section-map') && home.includes("label: 'Guías'") && home.includes("href: '#contact'"))
check('Home content shortcuts avoid duplicated portal destinations', district.includes("title: 'Guías Gaming'") && district.includes("to: '/gaming/guides'") && district.includes("title: 'Noticias'") && district.includes("title: 'Comunidad'"))
check('Home defers non-essential portal artwork', home.includes("portal.id === 'gaming' || portal.id === 'pets'") && home.includes("loading={isImmediate ? 'eager' : 'lazy'}"))
check('Home uses honest privacy status language', home.includes('PRIVACIDAD Y NAVEGACIÓN VERIFICADAS') && !home.includes('SISTEMA SEGURO 24/7'))
check('Home loads only three recent articles through a deferred import', district.includes("import('../services/news/publicNewsService')") && district.includes("fetchPublishedNews('all')") && district.includes('articles.slice(0, 3)'))
check('Home identifies Spanish-only editorial content in English', district.includes('LATEST FROM THE SPANISH NEWSROOM') && district.includes('Open Spanish news'))
check('Home reserves the editorial radar before data arrives', district.includes('data-home-recent-radar') && district.includes('min-h-[210px]'))
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
check('Gaming hero reserves height before image decoding', accessibility.includes('.xk-gaming-hero {') && accessibility.includes('min-height: clamp(620px, 72vh, 780px)'))
check('Gaming hero illustration is removed from document flow', accessibility.includes('.xk-gaming-hero > .xk-anime-hero-media') && accessibility.includes('position: absolute') && accessibility.includes('inset: 0') && accessibility.includes('object-fit: cover'))
check('Gaming mobile hero keeps a stable minimum height', accessibility.includes('min-height: 640px'))

check('Science primary content precedes external network and learning modules', science.indexOf('data-science-primary-content') < science.indexOf('xk-argenciencia-link') && science.indexOf('data-science-primary-content') < science.indexOf('xk-learning-routes'))
check('Science gives each learning card a concrete destination', science.includes("title: 'Explorar con chicos'") && science.includes("to: '/news?category=science'") && science.includes("to: '#tech-stack'") && science.includes("to: '#lab-assistant'") && science.includes("to: '/news?category=tech'"))
check('Science localizes translated assistant and home links', science.includes('localizePath(assistant.link)') && science.includes("localizePath('/')"))

check('Browser tests cover ordered Home content and editorial radar', browserTest.includes('ordena guías, noticias y comunidad') && browserTest.includes('data-home-recent-radar'))
check('Browser tests cover streamlined Gaming hierarchy', browserTest.includes('una sola navegación antes del contenido') && browserTest.includes('Especificaciones en verificación'))
check('Browser tests cover content-first Science order', browserTest.includes('radar verificable antes de módulos secundarios') && browserTest.includes('compareDocumentPosition'))
check('Browser tests cover distinct Science learning destinations', browserTest.includes('destino distinto y concreto') && browserTest.includes("'#tech-stack'"))

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
