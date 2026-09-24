import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const failures = []
const warnings = []

function fail(message) { failures.push(message) }
function warn(message) { warnings.push(message) }
function read(relative) { return fs.readFileSync(path.join(root, relative), 'utf8') }
function exists(relative) { return fs.existsSync(path.join(root, relative)) }

function walk(relative, acc = []) {
  const absolute = path.join(root, relative)
  if (!fs.existsSync(absolute)) return acc
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', '.netlify', '.vercel', 'coverage', 'playwright-report', 'test-results'].includes(entry.name)) continue
    const child = path.join(relative, entry.name)
    if (entry.isDirectory()) walk(child, acc)
    else acc.push(child.replaceAll('\\\\', '/'))
  }
  return acc
}

const files = walk('.')
const pkg = JSON.parse(read('package.json'))
const lock = JSON.parse(read('package-lock.json'))
const siteConfig = read('src/lib/siteConfig.ts')
const seo = read('src/components/SEO.tsx')
const readme = read('README.md')

const publicVersion = siteConfig.match(/SITE_VERSION\s*=\s*['"]v([^'"]+)['"]/)?.[1]
if (pkg.version !== lock.version || pkg.version !== lock.packages?.['']?.version || pkg.version !== publicVersion) {
  fail(`Version mismatch: package=${pkg.version}, lock=${lock.version}, lockRoot=${lock.packages?.['']?.version}, site=${publicVersion}`)
}
if (!readme.includes(`v${pkg.version}`)) fail(`README does not mention current version v${pkg.version}`)

const nodeVersion = exists('.nvmrc') ? read('.nvmrc').trim() : ''
if (nodeVersion !== '22') fail(`.nvmrc must stay on Node 22 (found "${nodeVersion || 'missing'}")`)

if (!siteConfig.includes("SITE_DOMAIN = 'https://www.xethkioz.com.ar'")) fail('siteConfig canonical domain must use https://www.xethkioz.com.ar')
if (!seo.includes("SITE_URL = 'https://www.xethkioz.com.ar'")) fail('SEO canonical origin must use https://www.xethkioz.com.ar')

const allowedEnvExamples = new Set(['.env.example', 'services/nexus/.env.example'])
for (const file of files) {
  const normalized = file.replace(/^\.\//, '')
  const base = path.basename(normalized)
  if (/^\.env(?:\.|$)/.test(base) && !allowedEnvExamples.has(normalized)) fail(`Environment file must not be committed: ${normalized}`)
  if (/\.(?:pem|p12|pfx)$/i.test(normalized) || /(?:^|\/)(?:id_rsa|id_ed25519)$/i.test(normalized)) fail(`Private credential material must not be committed: ${normalized}`)
}

const privateGameExtensions = new Set(['.blend', '.blend1', '.fbx', '.obj', '.glb', '.gltf', '.stl', '.unity', '.prefab', '.unitypackage', '.psd', '.kra'])
for (const file of files) {
  if (privateGameExtensions.has(path.extname(file).toLowerCase())) fail(`Private/source game asset extension detected: ${file}`)
}

const legacyDir = 'database/migrations'
if (exists(legacyDir)) {
  const datedLegacy = fs.readdirSync(path.join(root, legacyDir))
    .filter((name) => /^20\d{6}/.test(name))
    .sort()
  const postFreeze = datedLegacy.filter((name) => name.slice(0, 8) > '20260717')
  if (postFreeze.length) fail(`database/migrations is frozen historical storage; new migrations belong in supabase/migrations: ${postFreeze.join(', ')}`)

  let mirrored = 0
  for (const name of datedLegacy) {
    const legacy = path.join(root, legacyDir, name)
    const canonical = path.join(root, 'supabase/migrations', name)
    if (!fs.existsSync(canonical)) continue
    mirrored += 1
    if (!fs.readFileSync(legacy).equals(fs.readFileSync(canonical))) fail(`Historical/canonical migration drift: ${name}`)
  }
  if (mirrored) warn(`${mirrored} historical migrations are intentionally mirrored; do not delete until applied-history reconciliation is complete.`)
}

const mediaExtensions = new Set(['.mp4', '.webm', '.mov', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'])
const media = files
  .filter((file) => file.startsWith('public/') && mediaExtensions.has(path.extname(file).toLowerCase()))
  .map((file) => {
    const absolute = path.join(root, file)
    const size = fs.statSync(absolute).size
    const hash = size >= 100_000 ? crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex') : ''
    return { file, size, hash }
  })

const byHash = new Map()
for (const item of media.filter((item) => item.hash)) {
  const group = byHash.get(item.hash) ?? []
  group.push(item)
  byHash.set(item.hash, group)
}
for (const group of byHash.values()) {
  if (group.length > 1) fail(`Duplicate public media blob: ${group.map((item) => item.file).join(' | ')}`)
}
for (const item of media) {
  if (item.size > 50 * 1024 * 1024) fail(`Public media exceeds 50 MiB repository limit: ${item.file} (${Math.round(item.size / 1024 / 1024)} MiB)`)
  else if (item.size > 20 * 1024 * 1024) warn(`Large public media should move to object storage/CDN when practical: ${item.file} (${Math.round(item.size / 1024 / 1024)} MiB)`)
}

for (const message of warnings) console.warn(`WARN repository hygiene: ${message}`)
if (failures.length) {
  for (const message of failures) console.error(`FAIL repository hygiene: ${message}`)
  process.exit(1)
}
console.log(`PASS repository hygiene: version, Node, secrets, migration boundary and media checks passed (${warnings.length} warning(s)).`)
