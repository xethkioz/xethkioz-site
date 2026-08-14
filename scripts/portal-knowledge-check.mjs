import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const catalog = read('src/data/portalKnowledgeCatalog.ts')
const component = read('src/components/PortalKnowledgeBriefing.tsx')
const css = read('src/components/PortalKnowledgeBriefing.css')
const petsBootstrap = read('public/mascotas/app.js')

const routes = {
  gaming: 'src/pages/GamingHub.tsx',
  science: 'src/pages/ScienceLab.tsx',
  comicon: 'src/pages/ComicUniverse.tsx',
  green: 'src/pages/GreenNode.tsx',
  pets: 'src/pages/MascotasPortal.tsx',
  web: 'src/pages/WebCreation.tsx',
  nexus: 'src/pages/NexusCity.tsx',
}

const approvedHosts = new Set([
  'help.steampowered.com',
  'support.xbox.com',
  'science.nasa.gov',
  'www.nist.gov',
  'www.marvel.com',
  'www.dcuniverseinfinite.com',
  'www.cisa.gov',
  'owasp.org',
  'www.argentina.gob.ar',
  'www.w3.org',
  'web.dev',
  'discord.com',
])

const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

for (const [sector, pagePath] of Object.entries(routes)) {
  const page = read(pagePath)
  check(`${sector} has catalog entries`, catalog.includes(`  ${sector}: [`))
  check(`${sector} renders the verified briefing`, page.includes(`<PortalKnowledgeBriefing sector="${sector}"`))
}

const urls = [...catalog.matchAll(/sourceUrl: '([^']+)'/g)].map((match) => match[1])
check('catalog contains at least fifteen substantial guides', urls.length >= 15)
check('every guide uses HTTPS', urls.every((url) => url.startsWith('https://')))
check('every guide points to an approved primary source', urls.every((url) => approvedHosts.has(new URL(url).hostname)))
check('component labels official sources', component.includes('{t.source}: {guide.sourceLabel}'))
check('external sources are isolated from opener', component.includes('rel="noopener noreferrer"'))
check('guide cards do not add image requests', !component.includes('<img') && !component.includes('SafeImage'))
check('closed guides preserve a lightweight first view', component.includes('<details') && css.includes('content-visibility: auto'))
check('mobile and reduced-motion states are defined', css.includes('@media (max-width: 640px)') && css.includes('@media (prefers-reduced-motion: reduce)'))
check('Spanish and English copy are both present', catalog.includes("type KnowledgeLang = 'es' | 'en'") && component.includes("lang = 'es'"))
check('public Mascotas portal exposes the verified-guide contract and version', petsBootstrap.includes("setAttribute('data-knowledge-sector', 'pets')") && petsBootstrap.includes('XETHKIOZ v11.0') && petsBootstrap.includes('content-visibility:auto'))

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`[audit:portal-knowledge] ${failed} checks failed.`)
  process.exit(1)
}

console.log(`[audit:portal-knowledge] PASS — ${urls.length} guides across ${Object.keys(routes).length} portal sectors.`)
