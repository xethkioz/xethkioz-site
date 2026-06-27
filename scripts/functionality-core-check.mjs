import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'src/lib/fusionContent.ts',
  'src/lib/ProfileProgressContext.tsx',
  'src/components/fusion/FusionContentPanel.tsx',
  'src/pages/ProfileHub.tsx',
]

const requiredRoutes = ['/news', '/community', '/profile', '/cms']
const app = readFileSync('src/App.tsx', 'utf8')
const missingFiles = requiredFiles.filter((file) => !existsSync(file))
const missingRoutes = requiredRoutes.filter((route) => !app.includes(`path="${route}"`))

if (missingFiles.length || missingRoutes.length) {
  console.error('[audit:functionality] FAIL')
  if (missingFiles.length) console.error('Missing files:', missingFiles.join(', '))
  if (missingRoutes.length) console.error('Missing routes:', missingRoutes.join(', '))
  process.exit(1)
}

console.log('[audit:functionality] PASS — CMS/News/Community/Profile/Progress preview modules are wired.')
