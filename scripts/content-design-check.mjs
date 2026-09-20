import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const district = read('src/components/NexusDistrict.tsx')
const pulse = read('src/components/PortalPulseRail.tsx')
const gaming = read('src/pages/GamingHub.tsx')
const green = read('src/pages/GreenNode.tsx')
const science = read('src/pages/ScienceLab.tsx')
const home = read('src/pages/Home.tsx')
const navigation = read('src/components/FantasyNavigation.tsx')
const destinations = read('src/lib/publicNavigation.ts')
const rootDocument = read('index.html')
const routeCssLoader = read('src/components/RouteCssLoader.tsx')
const accessibility = read('src/accessibility.css')
const browserTest = read('tests/e2e/content-design.spec.ts')
const landingCss = read('src/pages/WorldOfXethkiozLanding.css')
const globalCss = read('src/index.css')
const mainEntry = read('src/main.tsx')
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

check('Nexus links preserve localized routes', district.includes('const { lang, localizePath } = useLang()') && district.includes('to={localizePath(item.to)}'))
check('Science district prioritizes sourced news', district.indexOf("title: 'Noticias con fuentes'") < district.indexOf("title: 'Herramientas y respuestas'"))
check('Home exposes three compact public portals', destinations.includes("href: '/gaming'") && destinations.includes('https://argenciencia.com/') && destinations.includes("href: '/mascotas/'") && !home.includes("id: 'comicon'"))
check('Home is centered on World of Xethkioz', home.includes('world-of-xethkioz-logo.svg') && home.includes('DESCUBRIR WORLD OF XETHKIOZ') && home.includes("localizePath('/world-of-xethkioz')") && !home.includes('EL GAMING ES'))
check('Home content shortcuts avoid duplicated portal destinations', district.includes("title: 'Guías Gaming'") && district.includes("to: '/gaming/guides'") && district.includes("title: 'Noticias'") && district.includes("title: 'Comunidad'"))
check('Home removes heavyweight portal theatre artwork', !home.includes('xk-rb-portals') && !home.includes('PrimaryPortal'))
check('Home uses a lightweight transparent World logo', home.includes('world-of-xethkioz-logo.webp') && fs.existsSync(path.join(root, 'public/assets/world-of-xethkioz/world-of-xethkioz-logo.svg')))
check('Home does not hide Mascotas behind a legacy override', !rootDocument.includes('huellas-portal-inline.css') && !fs.existsSync(path.join(root, 'public/huellas-portal-inline.css')) && !fs.existsSync(path.join(root, 'public/huellas-portal-image.js')))
check('Home uses static promotional art without autoplay', !home.includes('<video') && !home.includes('autoPlay') && home.includes('/assets/portal-games-world-v3.webp') && landingCss.includes('prefers-reduced-motion: reduce'))
check('Home avoids fake safety or simulated live claims', !home.includes('SISTEMA SEGURO 24/7') && !home.includes('JUGADORES CONECTADOS') && !home.includes('PRIVACIDAD Y NAVEGACIÓN VERIFICADAS'))
check('Home exposes the existing Nexus chat launcher', home.includes('xethkioz:nexus-chat-open'))
check('Home dedicated landing CSS stays below 32 kB source', Buffer.byteLength(landingCss, 'utf8') <= 32 * 1024)
check(
  'Home landing CSS excludes retired section and grid selectors',
  !landingCss.includes('.wox-section-dock')
    && !landingCss.includes('.wox-section')
    && !landingCss.includes('.wox-region-grid')
    && !landingCss.includes('.wox-atlas-grid')
    && !landingCss.includes('.wox-forms-grid')
    && !landingCss.includes('.wox-cast-grid')
    && !landingCss.includes('.wox-ecosystem-grid')
    && !landingCss.includes('.wox-bg-shade')
    && !landingCss.includes('.wox-noise')
    && !landingCss.includes('.is-quiet'),
)
check(
  'Home loads only the dedicated World landing stylesheet',
  home.includes("import './WorldOfXethkiozLanding.css'")
    && !home.includes('WorldOfXethkiozHome.css')
    && !home.includes('WorldOfXethkiozAAA.css')
    && !home.includes('WorldOfXethkiozBackgroundTuning.css'),
)
check('Global entry no longer loads obsolete World visibility fixes', !mainEntry.includes("import './visibility-fixes.css'"))
check(
  'Global CSS keeps obsolete World Home artwork removed',
  !globalCss.includes('.xeth-world')
    && !globalCss.includes('.xeth-dragon')
    && !globalCss.includes('.green-wisp-secret')
    && !globalCss.includes('.portal-ring-card'),
)
check(
  'Modern Fusion portal CSS remains available',
  globalCss.includes('.wow-portal {')
    && globalCss.includes('.portal-vortex {')
    && globalCss.includes('.portal-runes {')
    && globalCss.includes('.portal-title {'),
)
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
check('Gaming names the article count clearly and defers portal data by section', gaming.includes("signal: 'noticias en radar'") && gaming.includes("activeSection !== 'news'") && gaming.includes("activeSection !== 'live'"))
check('Gaming replaces unverified hardware placeholders', gaming.includes('Prepará tu perfil para encontrar grupo') && !gaming.includes('Especificaciones en verificación'))
check('Gaming localizes translated internal links', gaming.includes("localizePath('/gaming/guides')") && gaming.includes("localizePath('/community')"))
check('Gaming hero reserves height before image decoding', accessibility.includes('.xk-gaming-hero {') && accessibility.includes('min-height: clamp(620px, 72vh, 780px)'))
check('Gaming hero illustration is removed from document flow', accessibility.includes('.xk-gaming-hero > .xk-anime-hero-media') && accessibility.includes('position: absolute') && accessibility.includes('inset: 0') && accessibility.includes('object-fit: cover'))
check('Gaming mobile hero keeps a stable minimum height', accessibility.includes('min-height: 640px'))
check('Localized English portals load their route-owned visual styles', routeCssLoader.includes("pathname.startsWith('/en/')") && routeCssLoader.includes('pathname.slice(3)'))

check('Green Node keeps one primary section navigator instead of a duplicate district', !green.includes('NexusDistrict') && green.includes('xk-green-view-nav'))
check('Green Node clears the desktop launcher without changing mobile spacing', green.includes('lg:pl-24 lg:pr-8'))
check('Science primary content precedes external network and learning modules', science.indexOf('data-science-primary-content') < science.indexOf('xk-argenciencia-link') && science.indexOf('data-science-primary-content') < science.indexOf('xk-learning-routes'))
check('Science gives each learning card a concrete destination', science.includes("title: 'Explorar con chicos'") && science.includes("to: '/news?category=science'") && science.includes("to: '#tech-stack'") && science.includes("to: '#lab-assistant'") && science.includes("to: '/news?category=tech'"))
check('Science localizes translated assistant and home links', science.includes('localizePath(assistant.link)') && science.includes("localizePath('/')"))

check('Browser tests cover localized Gaming hierarchy', browserTest.includes('una sola navegación antes del contenido') && browserTest.includes("toHaveCSS('display', 'grid')"))
check('Browser tests cover the streamlined Green Node entry', browserTest.includes('Green Node evita navegación duplicada'))
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
