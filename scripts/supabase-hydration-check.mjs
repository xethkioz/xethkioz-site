import fs from 'node:fs'

const requiredFiles = [
  'src/services/cms/supabaseClient.ts',
  'src/services/cms/newsDataService.ts',
  'src/hooks/useNewsHydration.ts',
  'src/components/news/XethkiozNewsFactory.tsx',
]
const checks = []
function addCheck(name, pass, detail) { checks.push({ name, pass, detail }) }
function read(file) { return fs.readFileSync(file, 'utf8') }

for (const file of requiredFiles) {
  addCheck(`${file} exists`, fs.existsSync(file), 'Alpha 3.5 hydration modules must be present.')
}

const client = read('src/services/cms/supabaseClient.ts')
const service = read('src/services/cms/newsDataService.ts')
const hook = read('src/hooks/useNewsHydration.ts')
const factory = read('src/components/news/XethkiozNewsFactory.tsx')
const combined = `${client}\n${service}\n${hook}`

addCheck('Typed Supabase client uses CmsNewsDatabase', /createClient<CmsNewsDatabase>/.test(client) && /CmsSupabaseClient/.test(client), 'CMS client must be type-safe against databaseSchema.ts.')
addCheck('Environment fallback is safe', /isCmsSupabaseConfigured/.test(client) && /fallback seguro|FALLBACK_SUPABASE/.test(client), 'Local builds must not crash without Supabase env vars.')
addCheck('Initial article fetch exists', /fetchInitial/.test(service) && /from\('articles'\)/.test(service) && /order\('release_date'/.test(service), 'Service must fetch CMS articles outside React.')
addCheck('Realtime INSERT/UPDATE subscription exists', /postgres_changes/.test(service) && /INSERT/.test(service) && /UPDATE/.test(service), 'Service must listen to Supabase Realtime changes.')
addCheck('EventBus transition is dispatched before React snapshot', /dispatchPortalTransition\(nextPortal, article\.id\)[\s\S]*publishSnapshot/.test(service), 'Portal event must reach EventBus before React receives new content.')
addCheck('PORTAL_STATE_CHANGED payload is emitted', /PORTAL_STATE_CHANGED/.test(service) && /eventBus\.emit/.test(service), 'Service must notify RuntimeBridge through EventBus.')
addCheck('Portal mapping includes GREEN_NODE and URGENT', /GREEN_NODE/.test(service) && /URGENT/.test(service) && /resolvePortalFromArticle/.test(service), 'Category/portal context must map to runtime nodes.')
addCheck('Hook exposes isLoading, error and newsData', /useNewsHydration/.test(hook) && /isLoading/.test(hook) && /error/.test(hook) && /newsData/.test(hook), 'React hook must keep only simple DOM data states.')
addCheck('News Factory consumes hydration hook', /useNewsHydration/.test(factory) && /hydration/.test(factory), 'Factory must be able to hydrate from CMS without owning runtime shader state.')
addCheck('No shader manager import in React hook/factory', !/ShaderManager/.test(hook + factory), 'Shader updates must remain EventBus -> RuntimeBridge -> ShaderManager, never React -> ShaderManager.')
addCheck('No sandbox writes outside EventBus contract', /PortalEventBusLike/.test(combined), 'Hydration integration must talk to runtime through typed EventBus contracts.')

console.log('# XETHKIOZ Supabase Hydration Check')
console.log(`Generated: ${new Date().toISOString()}\n`)
for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} - ${check.name}`)
  console.log(`  ${check.detail}`)
}
const failed = checks.filter((check) => !check.pass)
console.log(`\nResult: ${failed.length === 0 ? 'PASS' : 'FAIL'}`)
if (failed.length > 0) process.exit(1)
