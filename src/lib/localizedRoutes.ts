export type SiteLanguage = 'es' | 'en'

export const ENGLISH_PREFIX = '/en'

export const LOCALIZED_PUBLIC_PATHS = new Set([
  '/',
  '/gaming',
  '/gaming/guides',
  '/science',
  '/comicon',
  '/nexus-city',
  '/creacion-web',
  '/community',
  '/about',
  '/contact',
  '/support',
  '/privacy',
  '/editorial-policy',
])

function splitPathSuffix(value: string) {
  const match = value.match(/^([^?#]*)(.*)$/)
  return { pathname: match?.[1] || '/', suffix: match?.[2] || '' }
}

export function stripEnglishPrefix(value: string) {
  const { pathname, suffix } = splitPathSuffix(value)
  if (pathname === ENGLISH_PREFIX || pathname === `${ENGLISH_PREFIX}/`) return `/${suffix}`
  if (!pathname.startsWith(`${ENGLISH_PREFIX}/`)) return value
  return `${pathname.slice(ENGLISH_PREFIX.length) || '/'}${suffix}`
}

export function isEnglishPath(value: string) {
  const { pathname } = splitPathSuffix(value)
  return pathname === ENGLISH_PREFIX || pathname.startsWith(`${ENGLISH_PREFIX}/`)
}

export function isLocalizedPublicPath(value: string) {
  const { pathname } = splitPathSuffix(stripEnglishPrefix(value))
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/'
  return LOCALIZED_PUBLIC_PATHS.has(normalized)
}

export function localizedPath(value: string, lang: SiteLanguage) {
  const stripped = stripEnglishPrefix(value)
  const { pathname, suffix } = splitPathSuffix(stripped)
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/'
  if (!LOCALIZED_PUBLIC_PATHS.has(normalized)) return stripped
  if (lang === 'es') return `${normalized}${suffix}`
  return `${normalized === '/' ? ENGLISH_PREFIX : `${ENGLISH_PREFIX}${normalized}`}${suffix}`
}

export function localizedAlternates(value: string) {
  const stripped = stripEnglishPrefix(value)
  return {
    es: localizedPath(stripped, 'es'),
    en: localizedPath(stripped, 'en'),
  }
}
