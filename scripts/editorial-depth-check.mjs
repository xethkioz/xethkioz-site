import { readFileSync } from 'node:fs'

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const editorial = read('src/data/editorialArticles202608.ts')
const comicon = read('src/pages/ComicUniverse.tsx')
const comicSaga = read('src/data/originalComicSaga.ts')
const pets = read('public/mascotas/index.html')

const failures = []
const articles = editorial.split(/\n  \{\n    id: 'editorial-/).slice(1)
const requiredCategories = ['gaming', 'science', 'ai', 'green', 'programming', 'tech', 'comicon']

if (articles.length < 9) failures.push(`Expected at least 9 editorial articles, found ${articles.length}.`)

for (const category of requiredCategories) {
  if (!editorial.includes(`category: '${category}'`)) failures.push(`Missing editorial coverage for ${category}.`)
}

for (const [index, article] of articles.entries()) {
  const editorialText = [...article.matchAll(/text: '([^']+)'/g)].map((match) => match[1]).join(' ')
  const wordCount = editorialText.split(/\s+/).filter(Boolean).length
  if (wordCount < 180) failures.push(`Editorial article ${index + 1} is too short (${wordCount} words).`)
  if (!/source_urls: \['https:\/\//.test(article)) failures.push(`Editorial article ${index + 1} has no HTTPS primary source.`)
  if (!/type: 'list'/.test(article)) failures.push(`Editorial article ${index + 1} has no practical list.`)
}

if (!comicon.includes("getCuratedExternalNews('comicon')")) failures.push('COMICON does not load its curated fallback feed.')
if (!comicon.includes('officialSource')) failures.push('COMICON cards do not expose the official source.')
if (!comicSaga.includes("cadence: { es: 'Nueva entrega cada viernes'")) failures.push('The original comic has no weekly cadence.')
if ((comicSaga.match(/status: 'available'/g) ?? []).length < 3) failures.push('The original comic needs at least three readable releases.')
if (!comicSaga.includes("scheduledFor: '2026-08-21'")) failures.push('The next original-comic episode has no visible schedule.')
if ((pets.match(/href="https:\/\/www\.argentina\.gob\.ar/g) ?? []).length < 3) failures.push('Huellas needs three official Argentina.gob.ar guide sources.')

if (failures.length) {
  console.error('Editorial depth check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`Editorial depth check passed: ${articles.length} articles, ${requiredCategories.length} portal categories, 3 Huellas guides and weekly COMICON cadence.`)
