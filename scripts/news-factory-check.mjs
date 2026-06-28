import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'src/services/cms/databaseSchema.ts',
  'src/components/news/XethkiozNewsFactory.tsx',
]

const missing = requiredFiles.filter((file) => !existsSync(file))
if (missing.length > 0) {
  console.error('[news-factory-check] Missing files:', missing.join(', '))
  process.exit(1)
}

const schema = readFileSync('src/services/cms/databaseSchema.ts', 'utf8')
const factory = readFileSync('src/components/news/XethkiozNewsFactory.tsx', 'utf8')

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
  'variant = \'web\'',
]

const failedSchema = schemaTokens.filter((token) => !schema.includes(token))
const failedFactory = factoryTokens.filter((token) => !factory.includes(token))

if (failedSchema.length > 0 || failedFactory.length > 0) {
  console.error('[news-factory-check] Contract failed')
  console.error({ failedSchema, failedFactory })
  process.exit(1)
}

console.log('[news-factory-check] PASS: CMS contracts and XETHKIOZ News Factory are present and isolated.')
