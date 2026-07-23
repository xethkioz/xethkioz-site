import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const srcDir = path.join(root, 'src')
const mainPath = path.join(srcDir, 'main.tsx')
const redesignSourcePath = path.join(srcDir, 'xethkioz-redesign.css')

function walk(directory, predicate, output = []) {
  if (!fs.existsSync(directory)) return output
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(absolute, predicate, output)
    else if (predicate(absolute)) output.push(absolute)
  }
  return output
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, '/')
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length
}

function classPrefix(className) {
  const parts = className.split('-')
  if (parts[0] === 'xk' && parts.length >= 2) return `xk-${parts[1]}`
  return parts[0]
}

const mainSource = fs.readFileSync(mainPath, 'utf8')
const directImports = [...mainSource.matchAll(/import\s+['"](.+?\.css)['"]/g)].map((match) => match[1])
const globalCssFiles = directImports.map((specifier) => path.resolve(srcDir, specifier))
const codeFiles = walk(srcDir, (file) => /\.(?:ts|tsx)$/.test(file))
const codeByFile = new Map(codeFiles.map((file) => [relative(file), fs.readFileSync(file, 'utf8')]))

const records = []
const aggregatePrefixes = new Map()
const allClasses = new Map()

for (const cssFile of globalCssFiles) {
  if (!fs.existsSync(cssFile)) {
    records.push({ file: relative(cssFile), missing: true })
    continue
  }

  const css = fs.readFileSync(cssFile, 'utf8')
  const classes = [...css.matchAll(/\.([_a-zA-Z][\w-]*)/g)].map((match) => match[1])
  const uniqueClasses = [...new Set(classes)]
  const prefixCounts = new Map()

  for (const className of classes) {
    const prefix = classPrefix(className)
    prefixCounts.set(prefix, (prefixCounts.get(prefix) ?? 0) + 1)
    aggregatePrefixes.set(prefix, (aggregatePrefixes.get(prefix) ?? 0) + 1)
  }

  for (const className of uniqueClasses) {
    const references = []
    for (const [sourceFile, source] of codeByFile) {
      if (source.includes(className)) references.push(sourceFile)
    }
    allClasses.set(className, { cssFile: relative(cssFile), references })
  }

  records.push({
    file: relative(cssFile),
    bytes: Buffer.byteLength(css),
    lines: css.split(/\r?\n/).length,
    ruleBlocks: countMatches(css, /[^@{}][^{}]*\{/g),
    mediaQueries: countMatches(css, /@media\b/g),
    keyframes: countMatches(css, /@keyframes\b/g),
    uniqueClasses: uniqueClasses.length,
    topPrefixes: [...prefixCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12),
  })
}

const totalBytes = records.reduce((sum, record) => sum + (record.bytes ?? 0), 0)
const unreferenced = [...allClasses.entries()]
  .filter(([, value]) => value.references.length === 0)
  .map(([className, value]) => ({ className, cssFile: value.cssFile }))
const pageScoped = [...allClasses.entries()]
  .filter(([, value]) => value.references.length > 0 && value.references.every((file) => file.startsWith('src/pages/')))
  .map(([className, value]) => ({ className, cssFile: value.cssFile, pages: value.references }))

console.log(`CSS GLOBAL INVENTORY: ${records.length} direct source(s), ${totalBytes.toLocaleString('en-US')} raw bytes.`)
for (const record of records.sort((a, b) => (b.bytes ?? 0) - (a.bytes ?? 0))) {
  if (record.missing) {
    console.log(`MISSING ${record.file}`)
    continue
  }
  console.log(`SOURCE ${record.file}: ${record.bytes.toLocaleString('en-US')} B, ${record.lines} lines, ${record.uniqueClasses} classes, ${record.keyframes} keyframes, ${record.mediaQueries} media queries.`)
  console.log(`  prefixes: ${record.topPrefixes.map(([prefix, count]) => `${prefix}:${count}`).join(', ') || 'none'}`)
}

console.log(`TOP GLOBAL PREFIXES: ${[...aggregatePrefixes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 24).map(([prefix, count]) => `${prefix}:${count}`).join(', ')}`)
console.log(`CANDIDATE PAGE-SCOPED CLASSES: ${pageScoped.length}. Sample: ${pageScoped.slice(0, 30).map((item) => `${item.className}→${[...new Set(item.pages)].join('|')}`).join(', ') || 'none'}`)
console.log(`UNREFERENCED CLASS TOKENS (heuristic only): ${unreferenced.length}. Sample: ${unreferenced.slice(0, 30).map((item) => `${item.className}@${item.cssFile}`).join(', ') || 'none'}`)

if (fs.existsSync(redesignSourcePath)) {
  const redesign = fs.readFileSync(redesignSourcePath, 'utf8')
  const markers = [...redesign.matchAll(/\/\*\s*([\s\S]*?)\s*\*\//g)].map((match, index, matches) => {
    const start = match.index ?? 0
    const nextStart = matches[index + 1]?.index ?? redesign.length
    return {
      start,
      bytesToNext: nextStart - start,
      label: match[1].replace(/\s+/g, ' ').trim(),
    }
  })
  console.log(`CSS SECTION MARKERS (${markers.length}): ${markers.map((marker) => `${marker.start}:${marker.bytesToNext}B:${marker.label}`).join(' | ')}`)
}

console.log('NOTE: page-scoped and unreferenced results are diagnostic only; dynamic class composition requires manual confirmation before moving or deleting CSS.')
