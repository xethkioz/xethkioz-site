import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const exists = (relative) => fs.existsSync(path.join(root, relative))

const activeFiles = [
  'src/App.tsx',
  'src/pages/Home.tsx',
  'src/pages/HomeReborn.css',
  'src/components/Header.tsx',
  'src/components/Footer.tsx',
  'src/services/news/publicNewsService.ts',
  'src/cms/routes/CmsGenerate.tsx',
  'src/cms/routes/CmsNewsList.tsx',
  'api/generate-news/index.ts',
  'api/sitemap.ts',
  'vercel.json',
]

const removedFiles = [
  'src/pages/ComicUniverse.tsx',
  'src/pages/ComicUniverse.css',
  'src/pages/ComicUniverseExpansion.css',
  'src/components/comicon/ComiconLibrary.tsx',
  'src/components/comicon/ComiconLibraryReal.css',
  'src/components/comicon/OriginalComicFeature.tsx',
  'src/services/comicon/publicComiconCatalogService.ts',
  'src/data/comiconCatalog.ts',
  'src/data/originalComicSaga.ts',
  'public/assets/portal-comicon-duality-v11.webp',
  'public/assets/portal-comicon-world.svg',
  'public/assets/xethkioz-light-shadow-comic-anime.webp',
]

const failures = []
for (const file of activeFiles) {
  if (/comicon/i.test(read(file))) failures.push(`${file} still exposes COMICON`)
}
for (const file of removedFiles) {
  if (exists(file)) failures.push(`${file} still exists`)
}

const migration = read('supabase/migrations/20260914203000_remove_comicon_section.sql')
if (!/delete from public\.news_articles\s+where category = 'comicon'/.test(migration)) failures.push('migration does not delete COMICON news')
if (!migration.includes('drop table if exists public.comicon_catalog')) failures.push('migration does not drop COMICON catalog')
if (/\bcomicon\b/.test(read('src/data/editorialArticles202608.ts'))) failures.push('local editorial fallback still contains COMICON')

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`))
  process.exit(1)
}

console.log('COMICON removal audit passed: routes, navigation, editor, fallbacks and dedicated assets are absent.')
