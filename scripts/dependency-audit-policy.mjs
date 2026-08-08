import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outputArgIndex = process.argv.indexOf('--output')
const outputPath = outputArgIndex >= 0 && process.argv[outputArgIndex + 1]
  ? path.resolve(root, process.argv[outputArgIndex + 1])
  : path.resolve(root, 'npm-audit.json')

const PATCHED_ROUTER_VERSION = '7.18.2'

function fail(message, details) {
  console.error(`FAIL dependency audit policy: ${message}`)
  if (details) console.error(details)
  process.exit(1)
}

function read(relative) {
  return fs.readFileSync(path.join(root, relative), 'utf8')
}

const packageJson = JSON.parse(read('package.json'))
const packageLock = JSON.parse(read('package-lock.json'))
const directVersion = packageJson.dependencies?.['react-router-dom']
const lockedDomVersion = packageLock.packages?.['node_modules/react-router-dom']?.version
const lockedRouterVersion = packageLock.packages?.['node_modules/react-router']?.version

if (directVersion !== PATCHED_ROUTER_VERSION || lockedDomVersion !== PATCHED_ROUTER_VERSION || lockedRouterVersion !== PATCHED_ROUTER_VERSION) {
  fail(`React Router must remain pinned to the patched ${PATCHED_ROUTER_VERSION} dependency graph`, {
    directVersion,
    lockedDomVersion,
    lockedRouterVersion,
  })
}

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
const blocking = Object.entries(vulnerabilities)
  .filter(([, vulnerability]) => ['high', 'critical'].includes(String(vulnerability?.severity || '').toLowerCase()))
  .map(([name, vulnerability]) => ({
    name,
    severity: vulnerability.severity,
    range: vulnerability.range,
    fixAvailable: vulnerability.fixAvailable,
    via: vulnerability.via,
  }))

if (blocking.length) {
  fail('high or critical production dependency advisories remain', JSON.stringify(blocking, null, 2))
}

const totals = report.metadata?.vulnerabilities ?? {}
const moderate = totals.moderate ?? 0
const low = totals.low ?? 0
const info = totals.info ?? 0

if (moderate || low || info) {
  console.log(`WARN dependency audit policy: non-blocking production advisories remain (moderate=${moderate}, low=${low}, info=${info}).`)
}

console.log(`PASS dependency audit policy: React Router ${PATCHED_ROUTER_VERSION} is pinned and no high/critical production advisories remain.`)
