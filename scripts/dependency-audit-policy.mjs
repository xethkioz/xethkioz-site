import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outputArgIndex = process.argv.indexOf('--output')
const outputPath = outputArgIndex >= 0 && process.argv[outputArgIndex + 1]
  ? path.resolve(root, process.argv[outputArgIndex + 1])
  : path.resolve(root, 'npm-audit.json')

const ALLOWED_ADVISORY_SOURCE = 1124282
const ALLOWED_ADVISORY_ID = 'GHSA-qwww-vcr4-c8h2'
const PINNED_ROUTER_VERSION = '7.18.1'
const EXCEPTION_EXPIRES_AT = Date.parse('2026-08-31T23:59:59Z')
const forbiddenRuntimeSignals = [
  '@react-router/',
  'react-server-dom-',
  'ServerRouter',
  'HydratedRouter',
  'createRequestHandler',
  'unstable_RSC',
  'RSCRoute',
]

function fail(message, details) {
  console.error(`FAIL dependency audit policy: ${message}`)
  if (details) console.error(details)
  process.exit(1)
}

function read(relative) {
  return fs.readFileSync(path.join(root, relative), 'utf8')
}

function collectSourceFiles(directory) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...collectSourceFiles(fullPath))
    else if (/\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) files.push(fullPath)
  }
  return files
}

const packageJson = JSON.parse(read('package.json'))
const packageLock = JSON.parse(read('package-lock.json'))
const directVersion = packageJson.dependencies?.['react-router-dom']
const lockedDomVersion = packageLock.packages?.['node_modules/react-router-dom']?.version
const lockedRouterVersion = packageLock.packages?.['node_modules/react-router']?.version

if (directVersion !== PINNED_ROUTER_VERSION || lockedDomVersion !== PINNED_ROUTER_VERSION || lockedRouterVersion !== PINNED_ROUTER_VERSION) {
  fail('the scoped exception is valid only for the exact audited React Router 7.18.1 dependency graph', {
    directVersion,
    lockedDomVersion,
    lockedRouterVersion,
  })
}

if (Date.now() > EXCEPTION_EXPIRES_AT) {
  fail('the temporary React Router RSC-only exception expired on 2026-08-31 and must be reviewed')
}

const mainEntry = read('src/main.tsx')
if (!mainEntry.includes("import { BrowserRouter } from 'react-router-dom'") || !mainEntry.includes('<BrowserRouter>')) {
  fail('XETHKIOZ must remain in React Router Declarative Mode while this exception is active')
}

const sourceCorpus = collectSourceFiles(path.join(root, 'src'))
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n')
const forbiddenSignal = forbiddenRuntimeSignals.find((signal) => sourceCorpus.includes(signal))
if (forbiddenSignal) fail(`RSC or Framework Mode signal detected: ${forbiddenSignal}`)

const audit = spawnSync('npm', ['audit', '--omit=dev', '--json'], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
})
const rawReport = audit.stdout?.trim() || audit.stderr?.trim()
if (!rawReport) fail('npm audit returned no JSON report')

let report
try {
  report = JSON.parse(rawReport)
} catch (error) {
  fail('npm audit returned invalid JSON', error instanceof Error ? error.message : String(error))
}
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)

const vulnerabilities = report.vulnerabilities ?? {}
const names = Object.keys(vulnerabilities)
if (!names.length) {
  console.log('PASS dependency audit policy: no production vulnerabilities reported')
  process.exit(0)
}

const unexpected = []
for (const [name, vulnerability] of Object.entries(vulnerabilities)) {
  if (name === 'react-router') {
    const via = Array.isArray(vulnerability.via) ? vulnerability.via : []
    const allowed = via.length > 0 && via.every((item) => (
      typeof item === 'object'
      && item !== null
      && item.source === ALLOWED_ADVISORY_SOURCE
      && String(item.url || '').endsWith(`/${ALLOWED_ADVISORY_ID}`)
      && String(item.title || '').includes('RSC Mode')
    ))
    if (!allowed) unexpected.push({ name, via })
    continue
  }

  if (name === 'react-router-dom') {
    const via = Array.isArray(vulnerability.via) ? vulnerability.via : []
    const allowed = via.length > 0 && via.every((item) => item === 'react-router')
    if (!allowed) unexpected.push({ name, via })
    continue
  }

  unexpected.push({ name, via: vulnerability.via })
}

if (unexpected.length) {
  fail('one or more production advisories are outside the approved RSC-only exception', JSON.stringify(unexpected, null, 2))
}

const totals = report.metadata?.vulnerabilities ?? {}
if ((totals.critical ?? 0) > 0) fail('critical production vulnerability detected')

console.log(`PASS dependency audit policy: only ${ALLOWED_ADVISORY_ID} remains, limited to unused React Router RSC Mode and expiring 2026-08-31`)
console.log('Installed mode: BrowserRouter declarative SPA; no Framework/RSC runtime signals found.')
