import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const checks = []
const check = (name, ok) => checks.push({ name, ok: Boolean(ok) })

const app = read('src/App.tsx')
const page = read('src/pages/NexusCity.tsx')
const header = read('src/components/Header.tsx')
const home = read('src/pages/Home.tsx')
const chat = read('src/components/nexus/NexusChatWidget.tsx')
const css = read('src/xethkioz-redesign.css')
const migration = read('supabase/migrations/20260719210000_nexus_city_social_foundation.sql')
const sitemap = read('api/sitemap.ts')
const seo = read('src/components/SEO.tsx')
const index = read('index.html')
const search = read('public/opensearch.xml')

check('lazy public route', app.includes("import('./pages/NexusCity')") && app.includes('path="/nexus-city"'))
check('global and Home navigation', header.includes("to: '/nexus-city'") && home.includes('to="/nexus-city"'))
check('avatar configurator', page.includes('xk-avatar-stage') && page.includes('const acquire') && page.includes('const equip'))
check('social districts', page.includes('Plaza Nexus') && page.includes('Gaming District') && page.includes('Future Lab') && page.includes('Chaos Alley'))
check('chat bridge', chat.includes("xethkioz:nexus-chat-open") && page.includes("xethkioz:nexus-chat-open"))
check('earned-only economy', page.includes('Nexus Shards') && page.includes('pagos con dinero real permanecerán desactivados') && !page.includes('stripe'))
check('safety roadmap', page.includes('moderación') && page.includes('antifraude') && page.includes('reembolsos'))
check('avatar RLS', migration.includes('alter table public.nexus_avatar_profiles enable row level security') && migration.includes('nexus_avatar_profiles_own_update'))
check('report queue RLS', migration.includes('nexus_safety_reports') && migration.includes('nexus_safety_reports_own_insert') && migration.includes('xethkioz_is_moderator_or_admin'))
check('no payment ledger', !/create table[^;]+(?:payment|credit_card|checkout_session)/i.test(migration))
check('responsive world UI', css.includes('.xk-city-page') && css.includes('@media(max-width:640px)') && css.includes('.xk-avatar-stage'))
check('discoverable route', sitemap.includes("'/nexus-city'") && seo.includes('SearchAction'))
check('OpenSearch discovery', index.includes('rel="search"') && search.includes('/news?q={searchTerms}'))

for (const item of checks) console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.name}`)
const failed = checks.filter((item) => !item.ok)
if (failed.length) {
  console.error(`\n${failed.length} Nexus City check(s) failed.`)
  process.exit(1)
}
console.log(`\nNexus City foundation: ${checks.length}/${checks.length} checks passed.`)
