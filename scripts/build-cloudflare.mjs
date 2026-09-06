import { readFileSync, writeFileSync, rmSync, cpSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'))
const wrangler = JSON.parse(readFileSync('wrangler.json', 'utf8'))
const vars = wrangler.vars
const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || vars.SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || vars.SUPABASE_ANON_KEY,
  },
})
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status || 1)

const output = 'dist-cloudflare'
rmSync(output, { recursive: true, force: true })
cpSync('dist', output, { recursive: true })

const pattern = (path) => path.replaceAll('(.*)', '*')
const staticRewrites = vercel.rewrites.filter((rule) => !rule.destination.startsWith('/api/')
  && !(vercel.trailingSlash === false && rule.source.length > 1 && rule.source.endsWith('/')))
for (const rule of staticRewrites) {
  if (!existsSync(join(output, rule.destination))) throw new Error(`Missing static route target: ${rule.destination}`)
}
const redirects = [
  ...(vercel.trailingSlash === false ? ['/*/ /:splat 308'] : []),
  ...vercel.redirects.map((rule) => `${pattern(rule.source)} ${rule.destination} ${rule.permanent ? 308 : 307}`),
  ...staticRewrites.map((rule) => `${pattern(rule.source)} ${rule.destination} 200`),
]
writeFileSync(join(output, '_redirects'), `${redirects.join('\n')}\n`)

const headers = vercel.headers.map((rule) => [
  pattern(rule.source),
  ...rule.headers.map(({ key, value }) => `  ${key}: ${value}`),
].join('\n')).join('\n\n')
if (headers.split('\n').some((line) => line.length > 2000)) throw new Error('A Cloudflare header exceeds the 2000 character limit.')
writeFileSync(join(output, '_headers'), `${headers}\n\nhttps://:worker.:account.workers.dev/*\n  X-Robots-Tag: noindex, nofollow\n`)

let files = 0
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) inspect(path)
    else {
      files += 1
      if (statSync(path).size > 25 * 1024 * 1024) throw new Error(`Asset exceeds the free hosting file limit: ${path}`)
    }
  }
}
inspect(output)
if (files > 20000) throw new Error(`Asset count exceeds the free plan: ${files}`)
console.log(`Cloudflare assets ready: ${files} files, ${staticRewrites.length} static routes; dynamic routes use the Worker.`)
