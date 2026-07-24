import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

const schemaMigration = read('supabase/migrations/20260724173500_safe_house_campaigns.sql')
const seedMigration = read('supabase/migrations/20260724173600_house_campaign_seed.sql')
const service = read('src/services/ads/publicAdsService.ts')
const component = read('src/components/ads/PublicAdSlot.tsx')
const tests = read('tests/e2e/public-ads.spec.ts')

check('campaigns have stable idempotency keys', schemaMigration.includes('campaign_key text') && schemaMigration.includes('ads_campaigns_campaign_key_unique') && seedMigration.includes('on conflict (campaign_key)'))
check('campaign disclosure types are constrained', schemaMigration.includes("campaign_kind in ('house', 'sponsor', 'affiliate', 'network')"))
check('database permits only internal paths or HTTPS targets', schemaMigration.includes('ads_campaigns_target_url_safe_check') && schemaMigration.includes("left(target_url, 2) <> '//'" ) && schemaMigration.includes("lower(target_url) like 'https://%'"))
check('database permits only internal paths or HTTPS images', schemaMigration.includes('ads_campaigns_image_url_safe_check') && schemaMigration.includes("left(image_url, 2) <> '//'" ) && schemaMigration.includes("lower(image_url) like 'https://%'"))
check('campaign text and URL lengths are bounded', schemaMigration.includes('ads_campaigns_content_length_check') && schemaMigration.includes('char_length(target_url) <= 2048'))
check('schema deploy does not activate campaigns prematurely', !schemaMigration.includes("'house-web-creation'") && !schemaMigration.includes('insert into public.ads_campaigns'))
check('four house campaigns cover all public slots', ['home-hero', 'news-inline', 'section-sidebar', 'stream-banner'].every((slot) => seedMigration.includes(`'${slot}'`)) && (seedMigration.match(/'house'/g) ?? []).length >= 4)
check('house campaigns do not add user tracking', !seedMigration.includes('impression') && !seedMigration.includes('click_id') && !seedMigration.includes('fingerprint'))

check('client validates URLs again before rendering', service.includes('function safePublicUrl') && service.includes("parsed.protocol === 'https:'") && service.includes("!normalized.startsWith('//')"))
check('client validates campaign type and status', service.includes("['house', 'sponsor', 'affiliate', 'network']") && service.includes("['draft', 'review', 'active', 'paused', 'archived']"))
check('public query keeps schedule and active filters', service.includes(".eq('status', 'active')") && service.includes('starts_at.is.null') && service.includes('ends_at.is.null'))

check('disclosure cannot be replaced by placement label', component.includes('const disclosure = ui[campaign.campaign_kind]') && !component.includes('fallbackLabel || ui['))
check('internal links stay in the current tab', component.includes("target={isInternalTarget ? undefined : '_blank'}"))
check('commercial external links use sponsored rel', component.includes("isCommercial ? 'noopener noreferrer sponsored'"))
check('campaign images use SafeImage fallback', component.includes('<SafeImage') && component.includes('fallback="/images/articles/fallback.svg"'))
check('disclosures support Spanish and English', component.includes('Promoción propia de XETHKIOZ') && component.includes('Sponsored content'))

check('browser tests cover house disclosure and internal navigation', tests.includes('Promoción propia de XETHKIOZ') && tests.includes("toHaveAttribute('href', '/gaming/guides')"))
check('browser tests neutralize javascript targets', tests.includes("target_url: 'javascript:alert(1)'") && tests.includes('no genera enlace'))
check('browser tests require sponsored rel on external campaigns', tests.includes("toHaveAttribute('rel', /sponsored/)"))

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`Ads monetization security audit failed: ${failed} checks failed.`)
  process.exit(1)
}

console.log('XETHKIOZ ads monetization security audit PASS')
