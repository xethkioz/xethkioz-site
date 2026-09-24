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
const engines = srcFiles.filter((file) => file.startsWith('src/engines/'))
const libs = srcFiles.filter((file) => file.startsWith('src/lib/'))
const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8')
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))

const publicRoutes = [
  '/', '/world-of-xethkioz', '/gaming', '/gaming/guides', '/science', '/news',
  '/community', '/creacion-web', '/support', '/green-node', '/account', '/profile', '/cms',
]
const retiredRoutes = ['/fun', '/nexus-city']

const report = [
  '# XETHKIOZ Web Code / Routes / Structure Review',
  '',
  `Generated: ${new Date().toISOString()}`,
  `Version: ${pkg.version}`,
  '',
  '## Summary',
  `- Source TS/TSX/JS files: ${srcFiles.length}`,
  `- Page files: ${routes.length}`,
  `- Component files: ${components.length}`,
  `- Engine files: ${engines.length}`,
  `- Lib/config/context files: ${libs.length}`,
  '',
  '## Current route contract detected in App.tsx',
  ...publicRoutes.map((route) => `- ${route}: ${app.includes(`path="${route}"`) ? 'present' : 'missing'}`),
  '',
  '## Retired compatibility routes',
  ...retiredRoutes.map((route) => `- ${route}: ${app.includes(`path="${route}"`) ? 'redirect retained' : 'missing'}`),
  '',
  '## Maintenance notes',
  '- The canonical production repository is xethkioz/xethkioz-site.',
  '- Legacy page/component files may remain for compatibility; delete only after import/reference analysis.',
  '- New database migrations belong in supabase/migrations; database/migrations is historical.',
  '- Build, Browser Quality, Lighthouse, dependency policy and repository hygiene should pass before production merge.',
  '',
].join('\n')

fs.mkdirSync(path.join(root, 'docs/ARCHITECTURE'), { recursive: true })
fs.writeFileSync(path.join(root, 'docs/ARCHITECTURE/CURRENT_CODE_STRUCTURE_REVIEW.md'), report)
console.log(report)
