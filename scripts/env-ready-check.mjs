import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const envPath = path.join(root, '.env')
const examplePath = path.join(root, '.env.example')
const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
const secretPatterns = [/SERVICE_ROLE/i, /SUPABASE_SERVICE/i, /sb_secret_/i]

function fail(message) {
  console.error(`FAIL ${message}`)
  process.exitCode = 1
}
function pass(message) { console.log(`PASS ${message}`) }
function readEnv(file) {
  const content = fs.readFileSync(file, 'utf8')
  const out = new Map()
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index <= 0) continue
    out.set(trimmed.slice(0, index), trimmed.slice(index + 1))
  }
  return { content, out }
}

if (!fs.existsSync(examplePath)) fail('.env.example is missing')
else pass('.env.example exists')

if (!fs.existsSync(envPath)) {
  fail('.env is missing for local validation. Create it from .env.example or configure variables in Netlify.')
} else {
  const { content, out } = readEnv(envPath)
  for (const key of required) {
    const value = out.get(key)
    if (!value || value.includes('your-') || value.includes('YOUR_') || value.includes('PEG')) fail(`${key} is missing or still uses a placeholder`)
    else pass(`${key} is configured`)
  }

  const url = out.get('VITE_SUPABASE_URL') ?? ''
  if (url && !/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) fail('VITE_SUPABASE_URL does not look like a Supabase project URL')
  else if (url) pass('VITE_SUPABASE_URL format looks valid')

  for (const pattern of secretPatterns) {
    if (pattern.test(content)) fail('A service/secret Supabase key pattern was found in .env. Remove it immediately.')
  }
  if (!process.exitCode) pass('No service_role/secret key pattern detected in .env')
}

if (process.exitCode) process.exit(process.exitCode)
console.log('XETHKIOZ environment check PASS')
