import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const envPath = path.join(root, '.env')
const examplePath = path.join(root, '.env.example')
const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
const secretPatterns = [/SERVICE_ROLE/i, /SUPABASE_SERVICE/i, /sb_secret_/i]
const placeholderPatterns = [/your-/i, /YOUR_/i, /REPLACE_WITH/i, /PEG/i, /TU_/i]

function fail(message) {
  console.error(`FAIL ${message}`)
  process.exitCode = 1
}

function pass(message) {
  console.log(`PASS ${message}`)
}

function readEnvFile(file) {
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

function hasPlaceholder(value) {
  return placeholderPatterns.some((pattern) => pattern.test(value))
}

function assertNoSecretPatterns(label, content) {
  for (const pattern of secretPatterns) {
    if (pattern.test(content)) {
      fail(`A service/secret Supabase key pattern was found in ${label}. Remove it immediately.`)
      return
    }
  }
}

if (!fs.existsSync(examplePath)) {
  fail('.env.example is missing')
} else {
  pass('.env.example exists')
}

let source = 'process.env'
let contentForSecretScan = ''
const values = new Map()

if (fs.existsSync(envPath)) {
  const { content, out } = readEnvFile(envPath)
  source = '.env'
  contentForSecretScan = content

  for (const [key, value] of out.entries()) {
    values.set(key, value)
  }
} else {
  pass('.env file not found; using CI/hosting environment variables')

  for (const key of required) {
    if (typeof process.env[key] === 'string') {
      values.set(key, process.env[key])
      contentForSecretScan += `${key}=${process.env[key]}\n`
    }
  }
}

for (const key of required) {
  const value = values.get(key)

  if (!value || hasPlaceholder(value)) {
    fail(`${key} is missing or still uses a placeholder in ${source}`)
  } else {
    pass(`${key} is configured from ${source}`)
  }
}

const url = values.get('VITE_SUPABASE_URL') ?? ''
if (url && !/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) {
  fail('VITE_SUPABASE_URL does not look like a Supabase project URL')
} else if (url) {
  pass('VITE_SUPABASE_URL format looks valid')
}

assertNoSecretPatterns(source, contentForSecretScan)

if (!process.exitCode) {
  pass('No service_role/secret key pattern detected in environment configuration')
}

if (process.exitCode) process.exit(process.exitCode)
console.log('XETHKIOZ environment check PASS')
