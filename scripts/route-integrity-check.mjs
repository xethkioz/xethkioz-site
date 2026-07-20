import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const srcRoot = path.join(root, 'src')
const appPath = path.join(srcRoot, 'App.tsx')
const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx']

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function normalizeRoute(value) {
  const clean = value.split('#')[0].split('?')[0].trim()
  if (!clean) return '/'
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash
}

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null

  const base = path.resolve(path.dirname(fromFile), specifier)
  const candidates = [
    base,
    ...sourceExtensions.map((extension) => `${base}${extension}`),
    ...sourceExtensions.map((extension) => path.join(base, `index${extension}`)),
  ]

  return candidates.find((candidate) => {
    if (!candidate.startsWith(srcRoot)) return false
    return fs.existsSync(candidate) && fs.statSync(candidate).isFile()
  }) ?? null
}

function collectReachableFiles(entryFile) {
  const reachable = new Set()
  const pending = [entryFile]
  const importPatterns = [
    /\bfrom\s*['"](\.[^'"]+)['"]/g,
    /\bimport\s*['"](\.[^'"]+)['"]/g,
    /\bimport\s*\(\s*['"](\.[^'"]+)['"]\s*\)/g,
  ]

  while (pending.length) {
    const current = pending.pop()
    if (!current || reachable.has(current)) continue
    reachable.add(current)

    const source = read(current)
    for (const pattern of importPatterns) {
      pattern.lastIndex = 0
      let match
      while ((match = pattern.exec(source)) !== null) {
        const resolved = resolveImport(current, match[1])
        if (resolved && !reachable.has(resolved)) pending.push(resolved)
      }
    }
  }

  return reachable
}

function collectDeclaredRoutes(appSource) {
  const routes = new Set(['/'])
  const routePattern = /<Route\b[^>]*\bpath=['"]([^'"]+)['"]/g
  let match

  while ((match = routePattern.exec(appSource)) !== null) {
    const route = match[1]
    if (route === '*') continue
    if (route.startsWith('/')) {
      routes.add(normalizeRoute(route))
      continue
    }

    // App.tsx currently contains relative child routes only below /cms.
    routes.add(normalizeRoute(`/cms/${route}`))
  }

  return [...routes]
}

function routeRegex(routePattern) {
  const escaped = routePattern
    .split('/')
    .map((segment) => {
      if (!segment) return ''
      if (segment === '*') return '.*'
      if (segment.startsWith(':')) return '[^/]+'
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    })
    .join('/')

  return new RegExp(`^${escaped}/?$`)
}

function isRouteDeclared(destination, declaredRoutes) {
  return declaredRoutes.some((route) => routeRegex(route).test(destination))
}

function shouldIgnoreDestination(destination) {
  return [
    '/assets/',
    '/api/',
    '/favicon',
    '/manifest.',
    '/opensearch.',
    '/robots.',
    '/sitemap',
    '/feed.',
    '/og-',
    '/web-services/',
  ].some((prefix) => destination.startsWith(prefix))
}

function collectDestinations(filePath, source) {
  const destinations = []
  const patterns = [
    { kind: 'jsx', regex: /\b(?:to|href)=['"]([^'"]+)['"]/g },
    { kind: 'jsx-expression', regex: /\b(?:to|href)=\{\s*['"]([^'"]+)['"]\s*\}/g },
    { kind: 'object', regex: /\b(?:to|href|route)\s*:\s*['"]([^'"]+)['"]/g },
    { kind: 'navigate', regex: /\bnavigate\(\s*['"]([^'"]+)['"]/g },
    { kind: 'assign', regex: /\b(?:assign|replace)\(\s*['"]([^'"]+)['"]/g },
  ]

  for (const { kind, regex } of patterns) {
    let match
    while ((match = regex.exec(source)) !== null) {
      const raw = match[1].trim()
      if (!raw || raw.startsWith('#') || raw.startsWith('?')) continue
      if (/^(?:https?:|mailto:|tel:|data:|blob:)/i.test(raw)) continue
      if (raw.includes('${') || raw.includes(':handle') || raw.includes(':slug') || raw.includes(':id')) continue

      let route = raw
      if (!route.startsWith('/')) {
        const relativeFile = path.relative(root, filePath).replaceAll('\\', '/')
        if (!relativeFile.startsWith('src/cms/')) continue
        if (route === '.' || route === '..' || route.startsWith('../')) continue
        route = `/cms/${route.replace(/^\.\//, '')}`
      }

      const normalized = normalizeRoute(route)
      if (shouldIgnoreDestination(normalized)) continue
      destinations.push({ kind, raw, normalized })
    }
  }

  return destinations
}

if (!fs.existsSync(appPath)) {
  console.error('FAIL route integrity: src/App.tsx was not found.')
  process.exit(1)
}

const reachableFiles = collectReachableFiles(appPath)
const declaredRoutes = collectDeclaredRoutes(read(appPath))
const failures = []
let checkedDestinations = 0

for (const filePath of reachableFiles) {
  const source = read(filePath)
  const destinations = collectDestinations(filePath, source)

  for (const destination of destinations) {
    checkedDestinations += 1
    if (isRouteDeclared(destination.normalized, declaredRoutes)) continue

    failures.push({
      file: path.relative(root, filePath).replaceAll('\\', '/'),
      destination: destination.raw,
      normalized: destination.normalized,
      kind: destination.kind,
    })
  }
}

if (failures.length) {
  console.error(`FAIL route integrity: ${failures.length} undeclared internal destination(s).`)
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.destination} -> ${failure.normalized} (${failure.kind})`)
  }
  process.exit(1)
}

console.log(`PASS route integrity: ${declaredRoutes.length} routes, ${reachableFiles.size} reachable modules, ${checkedDestinations} internal destinations.`)
