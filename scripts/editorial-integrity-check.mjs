import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const refresh = read('supabase/migrations/20260724171000_editorial_refresh_primary_sources.sql')
const integrity = read('supabase/migrations/20260724171100_news_sources_integrity.sql')
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

const expectedArticles = [
  ['ai-chatgpt-health-connected-records', "'ai'", 'https://openai.com/'],
  ['tech-steam-wishlist-categories-gifting-2026', "'tech'", 'https://store.steampowered.com/'],
  ['science-roman-telescope-launch-august-2026', "'science'", 'https://www.nasa.gov/'],
  ['gaming-xbox-streaming-gratis-anuncios-insiders', "'gaming'", 'https://news.xbox.com/'],
]

for (const [slug, category, source] of expectedArticles) {
  check(`${slug} is versioned`, refresh.includes(`'${slug}'`))
  check(`${slug} has the expected category`, refresh.includes(category))
  check(`${slug} references a primary source`, refresh.includes(source))
}

check('all refresh articles are published and approved', (refresh.match(/'published'/g) ?? []).length >= 4 && (refresh.match(/'approved'/g) ?? []).length >= 4)
check('all refresh articles include editorial notes', (refresh.match(/Fuente primaria/g) ?? []).length === 4)
check('all refresh articles include accessible cover text', (refresh.match(/cover_image_alt/g) ?? []).length >= 2 && (refresh.match(/XETHKIOZ|Biblioteca|Telescopio|Jugador/g) ?? []).length >= 4)
check('refresh migration is idempotent by slug', refresh.includes('on conflict (slug) do update set'))
check('editorial author is selected dynamically', refresh.includes('with editorial_author as') && (refresh.match(/select author_id from editorial_author/g) ?? []).length === 4)
check('migration contains no generated author UUID', !/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i.test(refresh))
check('existing author attribution survives an empty target install', refresh.includes('author_id = coalesce(excluded.author_id, public.news_articles.author_id)'))
check('published factual reporting requires sources', integrity.includes("status <> 'published'") && integrity.includes("category = 'community'") && integrity.includes('cardinality(source_urls)'))
check('the source constraint is validated against existing data', integrity.includes('validate constraint news_articles_published_sources_check'))
check('community originals are explicitly exempt', integrity.includes('original community/humor content is exempt'))

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`Editorial integrity audit failed: ${failed} checks failed.`)
  process.exit(1)
}

console.log('XETHKIOZ editorial integrity audit PASS')
