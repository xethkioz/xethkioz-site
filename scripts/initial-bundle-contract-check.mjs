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

if (issues.length) {
  issues.forEach((issue) => console.error(`FAIL ${issue}`))
  console.error(`Initial bundle contract failed: ${issues.length} issue(s).`)
  process.exit(1)
}

console.log(`PASS initial bundle: ${publicHtmlFiles.length} public HTML entries avoid Supabase preload.`)
