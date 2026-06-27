import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const walk = (dir, acc = []) => {
  if (!fs.existsSync(dir)) return acc
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) walk(full, acc)
    else acc.push(full)
  }
  return acc
}
const rel = (file) => path.relative(root, file).replaceAll('\\\\', '/')
const srcFiles = walk(path.join(root, 'src')).filter((file) => /\.(tsx?|jsx?)$/.test(file)).map(rel).sort()
const routes = srcFiles.filter((file) => file.startsWith('src/pages/'))
const components = srcFiles.filter((file) => file.startsWith('src/components/'))
const fusion = srcFiles.filter((file) => file.startsWith('src/components/fusion/'))
const libs = srcFiles.filter((file) => file.startsWith('src/lib/'))
const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8')

const report = [
  '# Fusion Alpha 1.5 Code / Routes / Structure Review',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Summary',
  `- Source TS/TSX files: ${srcFiles.length}`,
  `- Page route files: ${routes.length}`,
  `- Component files: ${components.length}`,
  `- Fusion engine components: ${fusion.length}`,
  `- Lib/config/context files: ${libs.length}`,
  '',
  '## Public route contract detected in App.tsx',
  ...['/','/gaming','/science','/fun','/green-node'].map((route) => `- ${route}: ${app.includes(`path="${route}"`) ? 'present' : 'missing'}`),
  '',
  '## Fusion components',
  ...fusion.map((file) => `- ${file}`),
  '',
  '## Risk notes',
  '- Legacy pages still exist in src/pages. They are mostly redirected/unused during Fusion Alpha and should not be deleted until CMS/News contracts are approved.',
  '- Main route surface is intentionally small. This matches the Master Design Bible requirement: stable public shell first, engines second.',
  '- The project now has multiple audit scripts. Future work should keep them passing before Live deploy.',
  '',
].join('\n')
fs.mkdirSync(path.join(root, 'docs/ARCHITECTURE'), { recursive: true })
fs.writeFileSync(path.join(root, 'docs/ARCHITECTURE/FUSION_ALPHA_1_5_CODE_STRUCTURE_REVIEW.md'), report)
console.log(report)
