import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const checks = []
const check = (name, ok, detail = '') => checks.push([name, Boolean(ok), detail])

const routes = read('src/lib/localizedRoutes.ts')
const langContext = read('src/lib/LangContext.tsx')
const app = read('src/App.tsx')
const header = read('src/components/Header.tsx')
const footer = read('src/components/Footer.tsx')
const seo = read('src/components/SEO.tsx')
const generator = read('scripts/generate-seo-shells.mjs')
const sitemap = read('api/sitemap.ts')
const vercelSource = read('vercel.json')
const vercelConfig = JSON.parse(vercelSource)
const index = read('index.html')
const webCreation = read('creacion-web.html')
const browserTest = read('tests/e2e/internationalization.spec.ts')

const localizedPaths = [
  '/', '/gaming', '/gaming/guides', '/science', '/fun', '/creacion-web',
  '/community', '/about', '/contact', '/support', '/privacy', '/editorial-policy',
]
const englishPaths = localizedPaths.map((route) => route === '/' ? '/en' : `/en${route}`)
const rewriteSources = new Set((vercelConfig.rewrites ?? []).map((rewrite) => rewrite?.source).filter(Boolean))
const missingEnglishRewrites = englishPaths.filter((route) => !rewriteSources.has(route))

check('localized route contract includes every core page', localizedPaths.every((route) => routes.includes(`'${route}'`)))
check('news remains outside the localized route contract', !/LOCALIZED_PUBLIC_PATHS[\s\S]*['"]\/news['"]/.test(routes))
check('language is derived from URL before local storage', langContext.includes('isEnglishPath(window.location.pathname)') && langContext.includes("return 'en'"))
check('language changes preserve the current route', langContext.includes('buildLocalizedPath(current, next)') && langContext.includes('navigate(destination)'))
check('no IP or browser-language redirect is used', !langContext.includes('navigator.language') && !langContext.includes('x-vercel-ip-country'))
check('header navigation localizes links', header.includes('localizePath(item.to)') && header.includes("setLang(lang === 'es' ? 'en' : 'es')"))
check('footer trust links preserve language', footer.includes("localizePath('/about')") && footer.includes("localizePath('/editorial-policy')"))
check('all English core routes are mounted', englishPaths.every((route) => app.includes(`path="${route}"`)))
check('English news routes are intentionally absent', !app.includes('path="/en/news"') && !app.includes('path="/en/news/:slug"'))
check('runtime SEO provides reciprocal language alternates', seo.includes('hrefLang="es-AR"') && seo.includes('hrefLang="en"') && seo.includes('hrefLang="x-default"'))
check('runtime SEO localizes canonicals only for supported pages', seo.includes("type === 'website' && isLocalizedPublicPath(basePath)"))
check('article SEO does not invent English translations', seo.includes("hasLocalizedVersion = type === 'website'"))
check('shell generator creates English documents', generator.includes("file: 'en-home.html'") && generator.includes("file: 'en-gaming.html'") && generator.includes("file: 'en-editorial-policy.html'"))
check('shell generator emits language and hreflang metadata', generator.includes('<html lang=') && generator.includes('hreflang="es-AR"') && generator.includes('hreflang="x-default"'))
check('shared root template avoids duplicate hreflang tags', !index.includes('hreflang='))
check('Spanish web creation shell links to English counterpart', webCreation.includes('hreflang="en"') && webCreation.includes('/en/creacion-web'))
check('Vercel maps every English path to a dedicated shell', missingEnglishRewrites.length === 0, missingEnglishRewrites.join(', '))
check('sitemap declares XHTML alternate namespace', sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'))
check('sitemap contains reciprocal English and Spanish URLs', sitemap.includes("{ es: '/gaming', en: '/en/gaming'") && sitemap.includes('hreflang="x-default"'))
check('sitemap keeps articles Spanish-only', sitemap.includes('${SITE_URL}/news/${escapeXml(article.slug)}') && !sitemap.includes('/en/news/${escapeXml(article.slug)}'))
check('browser tests cover canonicals, language switch and untranslated news', browserTest.includes('canonical y alternates') && browserTest.includes('Noticias no publica una traducción inglesa inexistente'))

let failed = 0
for (const [name, ok, detail] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${!ok && detail ? `: ${detail}` : ''}`)
  if (!ok) failed += 1
}

if (failed) {
  console.error(`International indexing audit failed: ${failed} checks failed.`)
  process.exit(1)
}

console.log('XETHKIOZ international indexing audit PASS')
