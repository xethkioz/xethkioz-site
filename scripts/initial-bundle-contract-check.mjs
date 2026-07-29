import fs from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const distDir = path.resolve(process.cwd(), 'dist')
const assetsDir = path.join(distDir, 'assets')
const publicHtmlFiles = [
  'index.html',
  'seo-shells/gaming.html',
  'seo-shells/gaming-guides.html',
  'seo-shells/science.html',
  'seo-shells/comicon.html',
  'seo-shells/fun.html',
  'seo-shells/news.html',
  'seo-shells/community.html',
  'seo-shells/about.html',
  'seo-shells/contact.html',
  'seo-shells/support.html',
  'seo-shells/privacy.html',
  'seo-shells/editorial-policy.html',
  'creacion-web.html',
]

const MAX_INITIAL_CSS_BYTES = 225_000
const MAX_INITIAL_CSS_GZIP_BYTES = 41_500
const routeCssChunks = [
  { label: 'Home shell', pattern: /^home-shell-[^/]+\.css$/i },
  { label: 'Gaming and Fun shell', pattern: /^gaming-fun-shell-[^/]+\.css$/i },
  { label: 'Gaming sections shell', pattern: /^gaming-sections-shell-[^/]+\.css$/i },
  { label: 'Science shell', pattern: /^science-shell-[^/]+\.css$/i },
  { label: 'Green Node shell', pattern: /^green-node-shell-[^/]+\.css$/i },
  { label: 'Nexus district shell', pattern: /^nexus-district-shell-[^/]+\.css$/i },
  { label: 'Editorial shell', pattern: /^editorial-shell-[^/]+\.css$/i },
  { label: 'Fun Nexus shell', pattern: /^fun-nexus-shell-[^/]+\.css$/i },
  { label: 'Passport shell', pattern: /^passport-shell-[^/]+\.css$/i },
  { label: 'Room shell', pattern: /^room-shell-[^/]+\.css$/i },
]

const issues = []
const initialScriptPattern = /<script[^>]+src="([^"]+)"/g
const initialStylesheetPattern = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g
const forbiddenInitialChunks = [
  { label: 'Supabase', pattern: /\/(?:assets\/)?(?:supabase|supabaseClient)-[^/"']+\.js(?:\?|$)/i },
  { label: 'Framer Motion', pattern: /\/(?:assets\/)?motion-[^/"']+\.js(?:\?|$)/i },
]

function readManifest() {
  const manifestPath = path.join(distDir, '.vite', 'manifest.json')
  if (!fs.existsSync(manifestPath)) return null
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
}

function findStaticImportChain(manifest, startKey, targetKeys) {
  const queue = [[startKey]]
  const visited = new Set()
  while (queue.length) {
    const chain = queue.shift()
    const current = chain.at(-1)
    if (!current || visited.has(current)) continue
    visited.add(current)
    if (targetKeys.has(current)) return chain
    const imports = manifest[current]?.imports ?? []
    for (const imported of imports) queue.push([...chain, imported])
  }
  return null
}

function assetPathFromHref(href) {
  const pathname = href.split('?')[0]
  return path.join(distDir, pathname.replace(/^\//, ''))
}

for (const relativePath of publicHtmlFiles) {
  const absolutePath = path.join(distDir, relativePath)
  if (!fs.existsSync(absolutePath)) {
    issues.push(`${relativePath} was not generated.`)
    continue
  }

  const html = fs.readFileSync(absolutePath, 'utf8')
  const scripts = [...html.matchAll(initialScriptPattern)].map((match) => match[1])
  const stylesheets = [...html.matchAll(initialStylesheetPattern)].map((match) => match[1])

  for (const rule of forbiddenInitialChunks) {
    const forbidden = scripts.filter((src) => rule.pattern.test(src))
    if (forbidden.length) issues.push(`${relativePath} preloads ${rule.label}: ${forbidden.join(', ')}`)
  }
  for (const routeChunk of routeCssChunks) {
    const leaked = stylesheets.filter((href) => routeChunk.pattern.test(path.basename(href.split('?')[0])))
    if (leaked.length) issues.push(`${relativePath} preloads route CSS ${routeChunk.label}: ${leaked.join(', ')}`)
  }
}

const mainHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')
if (!mainHtml.includes('/assets/main-')) issues.push('index.html is missing the main application bundle.')
if (!mainHtml.includes('/assets/vendor-')) issues.push('index.html is missing the React vendor bundle.')

const mainStylesheets = [...mainHtml.matchAll(initialStylesheetPattern)].map((match) => match[1])
const mainCssHref = mainStylesheets.find((href) => /\/assets\/main-[^/]+\.css(?:\?|$)/i.test(href))
if (!mainCssHref) {
  issues.push('index.html is missing the initial main CSS asset.')
} else {
  const mainCssPath = assetPathFromHref(mainCssHref)
  if (!fs.existsSync(mainCssPath)) {
    issues.push(`Initial CSS asset was not generated: ${mainCssHref}`)
  } else {
    const mainCss = fs.readFileSync(mainCssPath)
    const gzipBytes = gzipSync(mainCss).byteLength
    if (mainCss.byteLength > MAX_INITIAL_CSS_BYTES) issues.push(`Initial CSS raw budget exceeded: ${mainCss.byteLength} > ${MAX_INITIAL_CSS_BYTES} bytes.`)
    if (gzipBytes > MAX_INITIAL_CSS_GZIP_BYTES) issues.push(`Initial CSS gzip budget exceeded: ${gzipBytes} > ${MAX_INITIAL_CSS_GZIP_BYTES} bytes.`)
    console.log(`DIAG initial CSS: ${mainCss.byteLength} raw bytes, ${gzipBytes} gzip bytes.`)
  }
}

const assetNames = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : []
for (const routeChunk of routeCssChunks) {
  if (!assetNames.some((name) => routeChunk.pattern.test(name))) issues.push(`Expected route CSS chunk was not emitted: ${routeChunk.label}.`)
}

const manifest = readManifest()
if (manifest) {
  const entries = Object.entries(manifest)
  const mainEntry = entries.find(([key, value]) => value.isEntry && (value.src === 'index.html' || key === 'index.html'))?.[0]
  const monitoredEntries = entries.filter(([, value]) => /(?:^|\/)(?:supabase(?:Client)?|motion)-[^/]+\.js$/i.test(value.file))
  const monitoredKeys = new Set(monitoredEntries.map(([key]) => key))
  if (mainEntry && monitoredKeys.size) {
    const chain = findStaticImportChain(manifest, mainEntry, monitoredKeys)
    if (chain) {
      const readable = chain.map((key) => `${key} [${manifest[key]?.file ?? 'unknown'}]`).join(' -> ')
      issues.push(`Static heavy-library import chain: ${readable}`)
    }
  }
}

if (issues.length) {
  issues.forEach((issue) => console.error(`FAIL ${issue}`))
  console.error(`Initial bundle contract failed: ${issues.length} issue(s).`)
  process.exit(1)
}

console.log(`PASS initial bundle: ${publicHtmlFiles.length} public HTML entries avoid heavy libraries and route-only CSS; initial CSS stays under 225 kB raw / 41.5 kB gzip.`)
