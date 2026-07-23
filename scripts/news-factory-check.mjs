import { existsSync, readFileSync } from 'node:fs'

const memeRadarMigration = 'supabase/migrations/20260723231000_meme_radar_cover_images.sql'
const requiredFiles = [
  'src/services/cms/databaseSchema.ts',
  'src/components/news/XethkiozNewsFactory.tsx',
  'public/assets/identity/memes-anime-chaos-v1.webp',
  'public/assets/portal-fun-chaos-v2.webp',
  memeRadarMigration,
]

const missing = requiredFiles.filter((file) => !existsSync(file))
if (missing.length > 0) {
  console.error('[news-factory-check] Missing files:', missing.join(', '))
  process.exit(1)
}

const schema = readFileSync('src/services/cms/databaseSchema.ts', 'utf8')
const factory = readFileSync('src/components/news/XethkiozNewsFactory.tsx', 'utf8')
const coverMigration = readFileSync(memeRadarMigration, 'utf8')

const schemaTokens = [
  'ArticleRow',
  'CategoryConfigRow',
  'CmsNewsDatabase',
  'XETHKIOZ_CATEGORY_CONFIG',
  'satisfies Record<XethkiozCategorySlug, CategoryConfigRow>',
  'color_code: `#${string}`',
]

const factoryTokens = [
  'XethkiozNewsFactory',
  'Safe Area Redes 12-15%',
  'Bloque editorial flexible',
  'resolveCategoryConfig',
  "variant = 'web'",
]

const coverTokens = [
  'meme-radar-great-meme-reset-2026',
  '/assets/identity/memes-anime-chaos-v1.webp',
  'meme-radar-sophie-cunningham-dedo-viral',
  '/assets/portal-fun-chaos-v2.webp',
  'cover_image_alt',
  'is distinct from',
]

const failedSchema = schemaTokens.filter((token) => !schema.includes(token))
const failedFactory = factoryTokens.filter((token) => !factory.includes(token))
const failedCovers = coverTokens.filter((token) => !coverMigration.includes(token))

if (failedSchema.length > 0 || failedFactory.length > 0 || failedCovers.length > 0) {
  console.error('[news-factory-check] Contract failed')
  console.error({ failedSchema, failedFactory, failedCovers })
  process.exit(1)
}

console.log('[news-factory-check] PASS: CMS contracts, XETHKIOZ News Factory and Meme Radar covers are present and isolated.')
