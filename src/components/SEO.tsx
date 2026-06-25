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
const SITE_URL = 'https://xethkioz.com.ar'
const DESC = 'Tu portal al futuro del gaming y la tecnología. Gaming, esports, tecnología, ciencia, streaming e inteligencia artificial.'

function absoluteUrl(value: string) {
  if (!value) return SITE_URL
  if (value.startsWith('http')) return value
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
  const canonical = url ? absoluteUrl(url) : (typeof window !== 'undefined' ? window.location.href : SITE_URL)
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
              '@type': 'Organization',
              name: SITE,
              logo: { '@type': 'ImageObject', url: absoluteUrl('/favicon.svg') },
            },
            mainEntityOfPage: canonical,
          })}
        </script>
      )}
    </Helmet>
  )
}
