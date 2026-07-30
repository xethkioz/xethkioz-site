import fs from 'node:fs'

const read = (file) => fs.readFileSync(file, 'utf8')
const checks = []
const check = (name, ok) => checks.push({ name, ok: Boolean(ok) })

const app = read('src/App.tsx')
const page = read('src/pages/ComicUniverse.tsx')
const css = read('src/pages/ComicUniverse.css')
const realLibraryCss = read('src/components/comicon/ComiconLibraryReal.css')
const home = read('src/pages/Home.tsx')
const header = read('src/components/Header.tsx')
const service = read('src/services/news/publicNewsService.ts')
const catalogService = read('src/services/comicon/publicComiconCatalogService.ts')
const generator = read('src/cms/routes/CmsGenerate.tsx')
const api = read('api/generate-news/index.ts')
const migration = read('supabase/migrations/20260729140000_add_comicon_news_category.sql')
const catalogMigration = read('supabase/migrations/20260730223000_comicon_real_catalog.sql')
const realLoad = read('docs/OPERATIONS/COMICON_REAL_LOAD_2026-07-30.md')
const catalog = read('src/data/comiconCatalog.ts')
const originalFeature = read('src/components/comicon/OriginalComicFeature.tsx')
const library = read('src/components/comicon/ComiconLibrary.tsx')
const animeHero = 'public/assets/xethkioz-light-shadow-comic-anime.webp'
const editorialRouteCount = (catalog.match(/id: 'catalog-/g) ?? []).length
const realCatalogCount = (realLoad.match(/^- `[-a-z0-9]+` · (?:marvel|dc|anime|screen|comics) ·/gm) ?? []).length
const realComiconArticles = (realLoad.match(/^- `comicon-[-a-z0-9]+` · comicon ·/gm) ?? []).length

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
check('Comic anime hero is optimized and accessible', fs.existsSync(animeHero) && page.includes("src=\"/assets/xethkioz-light-shadow-comic-anime.webp\"") && page.includes('alt={t.heroAlt}') && page.includes('fetchPriority="high"'))
check('Original XETHKIOZ comic is integrated', page.includes('<OriginalComicFeature') && catalog.includes('Dos almas, un guerrero') && originalFeature.includes('aria-controls="xk-original-comic-reader"'))
check('Original comic includes a readable prologue', catalog.includes("id: 'prologo'") && originalFeature.includes('prologue.panels.map') && css.includes('.xk-comicon-panels'))
check('Editorial library keeps at least 36 development routes', editorialRouteCount >= 36)
check('Structured COMICON catalog is protected by RLS', catalogMigration.includes('create table if not exists public.comicon_catalog') && catalogMigration.includes('comicon_catalog_public_read') && catalogMigration.includes("xethkioz_has_role(array['ADMIN'])"))
check('Real catalog load records at least 40 sourced profiles', realCatalogCount >= 40 && realLoad.includes('Cada ficha incluye editorial/estudio') && realLoad.includes('imágenes'))
check('Public catalog service reads only published profiles', catalogService.includes(".from('comicon_catalog')") && catalogService.includes(".eq('status', 'published')"))
check('Library exposes real entity categories', ['hero', 'villain', 'antihero', 'team', 'comic', 'manga', 'screen'].every((entity) => library.includes(`'${entity}'`)))
check('Library renders image, facts and source links', library.includes('selectedItem.image_url') && library.includes('selectedItem.facts') && library.includes('selectedItem.source_urls'))
check('Library scales without rendering every card initially', library.includes('slice(0, visibleCount)') && library.includes('current + 12'))
check('Real library stays responsive', realLibraryCss.includes('@media(max-width:620px)') && realLibraryCss.includes('.xk-comicon-library-card-real'))
check('COMICON editorial feed records at least 12 real articles', realComiconArticles >= 12 && realLoad.includes('Revisión: `approved`'))

for (const item of checks) console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.name}`)
const failed = checks.filter((item) => !item.ok)
if (failed.length) {
  console.error(`\nCOMICON portal audit failed: ${failed.length} check(s).`)
  process.exit(1)
}
console.log(`\nCOMICON portal: ${checks.length}/${checks.length} checks passed.`)
