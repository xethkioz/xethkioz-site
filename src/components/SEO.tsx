import { Helmet } from 'react-helmet-async'

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
const DESC = 'Portal gamer y tecnológico con noticias, comunidad, streaming, IA, ciencia y cultura digital.'
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

export default function SEO({
  title,
  description = DESC,
  image = '/og-image.svg',
  url = '',
  type = 'website',
  publishedTime,
  author,
  tags,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE}` : `${SITE} - Gaming, Tech & Streaming`
  const canonical = url ? absoluteUrl(url) : SITE_URL
  const imageUrl = absoluteUrl(image)

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {tags && tags.length > 0 && <meta name="keywords" content={tags.join(', ')} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}
      {tags && tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

      <meta property="og:site_name" content={SITE} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="es_AR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <link rel="alternate" type="application/rss+xml" title="XETHKIOZ // Nexus News" href={`${SITE_URL}/feed.xml`} />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE, url: SITE_URL, logo: absoluteUrl('/favicon.svg'), sameAs: SAME_AS },
            { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE, url: SITE_URL, inLanguage: 'es-AR', publisher: { '@id': `${SITE_URL}/#organization` } },
          ],
        })}
      </script>

      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: title,
            description,
            image: imageUrl,
            datePublished: publishedTime,
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
