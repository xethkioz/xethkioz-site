import { Helmet } from 'react-helmet-async'
import { useLang } from '../lib/LangContext'
import { isLocalizedPublicPath, localizedAlternates, localizedPath, stripEnglishPrefix } from '../lib/localizedRoutes'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  author?: string
  tags?: string[]
}

const SITE = 'XETHKIOZ'
const SITE_URL = 'https://www.xethkioz.com.ar'
const DESCRIPTIONS = {
  es: 'Portal gamer y tecnológico con noticias, comunidad, streaming, IA, ciencia y cultura digital.',
  en: 'Gaming and technology portal covering news, community, streaming, AI, science and digital culture.',
} as const
const DEFAULT_TITLES = {
  es: `${SITE} - Gaming, Tecnología y Streaming`,
  en: `${SITE} - Gaming, Tech & Streaming`,
} as const
const SEARCH_TITLES = {
  es: 'Buscar en XETHKIOZ',
  en: 'Search XETHKIOZ',
} as const
const SAME_AS = [
  'https://www.instagram.com/xethkioz',
  'https://www.threads.com/@xethkioz',
  'https://www.tiktok.com/@xethkioz0',
  'https://www.youtube.com/@XETHKIOZ',
  'https://www.twitch.tv/xethkioz',
  'https://kick.com/xethkioz',
]

function absoluteUrl(value: string) {
  if (!value) return SITE_URL
  if (value.startsWith('http')) return value.replace('https://xethkioz.com.ar', SITE_URL)
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

function canonicalPath(value: string) {
  if (!value) return '/'
  if (!value.startsWith('http')) return stripEnglishPrefix(value)
  try {
    const parsed = new URL(value)
    return stripEnglishPrefix(`${parsed.pathname}${parsed.search}`)
  } catch {
    return '/'
  }
}

export default function SEO({
  title,
  description,
  image = '/og-image.svg',
  url = '',
  type = 'website',
  publishedTime,
  author,
  tags,
}: SEOProps) {
  const { lang } = useLang()
  const resolvedDescription = description ?? DESCRIPTIONS[lang]
  const fullTitle = title ? `${title} | ${SITE}` : DEFAULT_TITLES[lang]
  const basePath = canonicalPath(url)
  const hasLocalizedVersion = type === 'website' && isLocalizedPublicPath(basePath)
  const canonical = absoluteUrl(hasLocalizedVersion ? localizedPath(basePath, lang) : basePath)
  const alternates = hasLocalizedVersion ? localizedAlternates(basePath) : null
  const imageUrl = absoluteUrl(image)
  const locale = lang === 'es' ? 'es_AR' : 'en_US'
  const alternateLocale = lang === 'es' ? 'en_US' : 'es_AR'
  const language = lang === 'es' ? 'es-AR' : 'en'
  const audienceType = lang === 'es'
    ? 'Comunidad de gaming, tecnología y cultura digital'
    : 'Gaming, technology and digital culture community'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta httpEquiv="content-language" content={language} />
      <link rel="canonical" href={canonical} />
      {alternates ? <link rel="alternate" hrefLang="es-AR" href={absoluteUrl(alternates.es)} /> : null}
      {alternates ? <link rel="alternate" hrefLang="en" href={absoluteUrl(alternates.en)} /> : null}
      {alternates ? <link rel="alternate" hrefLang="x-default" href={absoluteUrl(alternates.es)} /> : null}
      {tags && tags.length > 0 && <meta name="keywords" content={tags.join(', ')} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}
      {tags && tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

      <meta property="og:site_name" content={SITE} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={locale} />
      {hasLocalizedVersion ? <meta property="og:locale:alternate" content={alternateLocale} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <link rel="alternate" type="application/rss+xml" title="XETHKIOZ // Nexus News" href={`${SITE_URL}/feed.xml`} />
      <link rel="search" type="application/opensearchdescription+xml" title={SEARCH_TITLES[lang]} href={`${SITE_URL}/opensearch.xml`} />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': `${SITE_URL}/#organization`,
              name: SITE,
              alternateName: 'XETHKIOZ Nexus City',
              description: resolvedDescription,
              url: SITE_URL,
              logo: absoluteUrl('/favicon.svg'),
              areaServed: 'Worldwide',
              knowsLanguage: ['es', 'en'],
              sameAs: SAME_AS,
            },
            {
              '@type': 'WebSite',
              '@id': `${SITE_URL}/#website`,
              name: SITE,
              alternateName: 'XETHKIOZ Web 11.0 · World Gate',
              url: SITE_URL,
              inLanguage: ['es-AR', 'en'],
              audience: { '@type': 'PeopleAudience', audienceType },
              publisher: { '@id': `${SITE_URL}/#organization` },
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}/news?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@type': 'WebPage',
              '@id': `${canonical}#webpage`,
              url: canonical,
              name: fullTitle,
              description: resolvedDescription,
              inLanguage: language,
              isPartOf: { '@id': `${SITE_URL}/#website` },
            },
          ],
        })}
      </script>

      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: title,
            description: resolvedDescription,
            image: imageUrl,
            datePublished: publishedTime,
            inLanguage: language,
            isAccessibleForFree: true,
            author: { '@type': 'Person', name: author || 'XETHKIOZ' },
            publisher: {
              '@id': `${SITE_URL}/#organization`,
            },
            mainEntityOfPage: canonical,
          })}
        </script>
      )}
    </Helmet>
  )
}
