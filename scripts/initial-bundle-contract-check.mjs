import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')
const publicHtmlFiles = [
  'index.html',
  'seo-shells/gaming.html',
  'seo-shells/gaming-guides.html',
  'seo-shells/science.html',
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

const issues = []
const initialScriptPattern = /<script[^>]+src="([^"]+)"/g
const forbiddenInitialChunks = /\/(?:assets\/)?(?:supabase|supabaseClient)-[^/"']+\.js(?:\?|$)/i

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

for (const relativePath of publicHtmlFiles) {
  const absolutePath = path.join(distDir, relativePath)
  if (!fs.existsSync(absolutePath)) {
    issues.push(`${relativePath} was not generated.`)
    continue
  }

  const html = fs.readFileSync(absolutePath, 'utf8')
  const scripts = [...html.matchAll(initialScriptPattern)].map((match) => match[1])
  const forbidden = scripts.filter((src) => forbiddenInitialChunks.test(src))
  if (forbidden.length) issues.push(`${relativePath} preloads Supabase: ${forbidden.join(', ')}`)
}

const mainHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')
if (!mainHtml.includes('/assets/main-')) issues.push('index.html is missing the main application bundle.')
if (!mainHtml.includes('/assets/vendor-')) issues.push('index.html is missing the React vendor bundle.')

const manifest = readManifest()
if (manifest) {
  const entries = Object.entries(manifest)
  const mainEntry = entries.find(([key, value]) => value.isEntry && (value.src === 'index.html' || key === 'index.html'))?.[0]
  const supabaseKeys = new Set(entries.filter(([, value]) => /(?:^|\/)supabase-[^/]+\.js$/i.test(value.file)).map(([key]) => key))
  if (mainEntry && supabaseKeys.size) {
    const chain = findStaticImportChain(manifest, mainEntry, supabaseKeys)
    if (chain) {
      const readable = chain.map((key) => `${key} [${manifest[key]?.file ?? 'unknown'}]`).join(' -> ')
      issues.push(`Static Supabase import chain: ${readable}`)
    }
  }
}

if (issues.length) {
  issues.forEach((issue) => console.error(`FAIL ${issue}`))
  console.error(`Initial bundle contract failed: ${issues.length} issue(s).`)
  process.exit(1)
}

console.log(`PASS initial bundle: ${publicHtmlFiles.length} public HTML entries avoid Supabase preload.`)
