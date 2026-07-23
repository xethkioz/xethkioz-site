import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = process.cwd()
const sourceRoot = path.join(root, 'src')
const files = []
const issues = []
let buttonCount = 0
let anchorCount = 0
let imageCount = 0
let bilingualObjectCount = 0

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(absolute)
    else if (entry.isFile() && absolute.endsWith('.tsx')) files.push(absolute)
  }
}

function lineFor(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
}

function report(sourceFile, node, message) {
  issues.push(`${path.relative(root, sourceFile.fileName)}:${lineFor(sourceFile, node)} ${message}`)
}

function attributesFor(node) {
  return node.attributes.properties.filter(ts.isJsxAttribute)
}

function attribute(attributes, name) {
  return attributes.find((item) => item.name.getText() === name)
}

function staticAttributeText(attributes, name) {
  const item = attribute(attributes, name)
  if (!item?.initializer) return ''
  if (ts.isStringLiteral(item.initializer)) return item.initializer.text
  return item.initializer.getText()
}

function objectProperties(node, sourceFile) {
  return new Map(
    node.properties
      .filter(ts.isPropertyAssignment)
      .map((property) => [
        property.name.getText(sourceFile).replaceAll(/['"]/g, ''),
        property.initializer,
      ]),
  )
}

function compareLocaleShape(sourceFile, owner, spanish, english, trail = '') {
  const spanishProperties = objectProperties(spanish, sourceFile)
  const englishProperties = objectProperties(english, sourceFile)
  const allKeys = new Set([...spanishProperties.keys(), ...englishProperties.keys()])

  for (const key of allKeys) {
    const nextTrail = trail ? `${trail}.${key}` : key
    const spanishValue = spanishProperties.get(key)
    const englishValue = englishProperties.get(key)
    if (!spanishValue || !englishValue) {
      report(sourceFile, owner, `locale object mismatch at ${nextTrail}`)
      continue
    }
    if (ts.isObjectLiteralExpression(spanishValue) && ts.isObjectLiteralExpression(englishValue)) {
      compareLocaleShape(sourceFile, owner, spanishValue, englishValue, nextTrail)
    }
  }
}

function visit(sourceFile, node) {
  if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
    const tag = node.tagName.getText(sourceFile)
    const attributes = attributesFor(node)

    if (tag === 'button') {
      buttonCount += 1
      if (!attribute(attributes, 'type')) report(sourceFile, node, '<button> must declare type')
    }

    if (tag === 'a') {
      anchorCount += 1
      if (!attribute(attributes, 'href')) report(sourceFile, node, '<a> must declare href')
      const target = staticAttributeText(attributes, 'target')
      const rel = staticAttributeText(attributes, 'rel')
      if (target.includes('_blank') && (!rel.includes('noopener') || !rel.includes('noreferrer'))) {
        report(sourceFile, node, 'external target="_blank" must declare noopener noreferrer')
      }
    }

    if (tag === 'img') {
      imageCount += 1
      if (!attribute(attributes, 'alt')) report(sourceFile, node, '<img> must declare alt')
    }

    if (tag === 'Link' || tag === 'NavLink') {
      if (!attribute(attributes, 'to')) report(sourceFile, node, `<${tag}> must declare to`)
    }
  }

  if (ts.isObjectLiteralExpression(node)) {
    const properties = objectProperties(node, sourceFile)
    const spanish = properties.get('es')
    const english = properties.get('en')
    if (spanish && english && ts.isObjectLiteralExpression(spanish) && ts.isObjectLiteralExpression(english)) {
      bilingualObjectCount += 1
      compareLocaleShape(sourceFile, node, spanish, english)
    }
  }

  ts.forEachChild(node, (child) => visit(sourceFile, child))
}

walk(sourceRoot)

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8')
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  visit(sourceFile, sourceFile)
}

if (issues.length) {
  for (const issue of issues) console.error(`FAIL ${issue}`)
  console.error(`UI contract audit failed: ${issues.length} issue(s).`)
  process.exit(1)
}

console.log(
  `PASS UI contracts: ${files.length} TSX files, ${buttonCount} buttons, `
  + `${anchorCount} anchors, ${imageCount} images, ${bilingualObjectCount} bilingual objects.`,
)
