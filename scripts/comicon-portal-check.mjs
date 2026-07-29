import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const checks = []
const check = (name, ok) => checks.push({ name, ok: Boolean(ok) })

const app = read('src/App.tsx')
const page = read('src/pages/ComicUniverse.tsx')
const css = read('src/pages/ComicUniverse.css')
const home = read('src/pages/Home.tsx')
const header = read('src/components/Header.tsx')
const service = read('src/services/news/publicNewsService.ts')
const generator = read('src/cms/routes/CmsGenerate.tsx')
const api = read('api/generate-news/index.ts')
const migration = read('supabase/migrations/20260729140000_add_comicon_news_category.sql')

check('COMICON has localized public routes', app.includes('path="/comicon"') && app.includes('path="/en/comicon"'))
check('Home exposes the fourth portal', home.includes("id: 'comicon'") && home.includes("route: '/comicon'"))
check('ArgenCiencia is the direct Science destination', home.includes("route: 'https://argenciencia.com/'") && header.includes("to: 'https://argenciencia.com/'"))
check('Portal covers requested universes', ['marvel', 'dc', 'anime', 'screen', 'comics'].every((channel) => page.includes(`'${channel}'`)))
check('Channel state is shareable', page.includes("searchParams.get('channel')") && page.includes("next.set('channel', channel)"))
check('Published COMICON content loads from CMS', page.includes("fetchPublishedNews('comicon')") && page.includes('visibleArticles.map'))
check('Public news recognizes COMICON', service.includes("'comicon'") && service.includes("comicon: 'Universo COMICON'"))
check('CMS generator exposes COMICON', generator.includes("value: 'comicon'"))
check('Editorial API allows COMICON', api.includes("'comicon'") && api.includes('allowedCategories'))
check('Database constraint allows COMICON', migration.includes("'comicon'") && migration.includes('news_articles_category_check'))
check('Portal is responsive and motion-safe', css.includes('@media(max-width:620px)') && css.includes('@media(prefers-reduced-motion:reduce)'))
check('Editorial safeguards are visible', page.includes('Diferenciar anuncios oficiales, rumores y teorías') && page.includes('Avisar antes de revelar spoilers'))

for (const item of checks) console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.name}`)
const failed = checks.filter((item) => !item.ok)
if (failed.length) {
  console.error(`\nCOMICON portal audit failed: ${failed.length} check(s).`)
  process.exit(1)
}
console.log(`\nCOMICON portal: ${checks.length}/${checks.length} checks passed.`)
