import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const news = fs.readFileSync(path.join(root, 'src/pages/News.tsx'), 'utf8')
const ads = fs.readFileSync(path.join(root, 'src/components/ads/PublicAdSlot.tsx'), 'utf8')
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

check('News reserves the active topics row during hydration', news.includes('data-news-topics-reserve') && news.includes('min-h-[76px]'))
check('News renders a dedicated featured loading skeleton', news.includes('data-news-loading-skeleton') && news.includes('FeaturedArticleLoading'))
check('Loading and final featured cards share mobile height', (news.match(/min-h-\[680px\]/g) ?? []).length >= 3)
check('Loading and final featured cards share desktop height', (news.match(/md:min-h-\[730px\]/g) ?? []).length >= 3)
check('Featured content is marked for regression inspection', news.includes('data-news-featured-article'))
check('News ad continues reserving its own async campaign height', ads.includes('data-ad-slot-loading={slotId}') && ads.includes("min-h-[176px]"))
check('CLS budget remains strict', !news.includes('layout-shift') && !news.includes('0.128'))

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`News layout stability audit failed: ${failed} checks failed.`)
  process.exit(1)
}

console.log('XETHKIOZ News layout stability audit PASS')
