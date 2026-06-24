import { Helmet } from 'react-helmet-async'
interface SEOProps { title?: string; description?: string; image?: string; url?: string; type?: 'website' | 'article'; publishedTime?: string; author?: string; tags?: string[] }
const SITE = 'XETHKIOZ'
const DESC = 'Tu portal al futuro del gaming y la tecnología. Gaming, Esports, Tecnología, Ciencia, Streaming y más.'
export default function SEO({ title, description = DESC, image = '/og-image.svg', url = '', type = 'website', publishedTime, author, tags }: SEOProps) {
  const ft = title ? `${title} | ${SITE}` : `${SITE} - Gaming & Streaming`
  const canon = url || (typeof window !== 'undefined' ? window.location.href : '')
  return (
    <Helmet>
      <title>{ft}</title><meta name="description" content={description} /><link rel="canonical" href={canon} />
      {tags && tags.length > 0 && <meta name="keywords" content={tags.join(', ')} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}
      {tags && tags.map((t) => <meta key={t} property="article:tag" content={t} />)}
      <meta property="og:site_name" content={SITE} /><meta property="og:type" content={type} /><meta property="og:title" content={ft} /><meta property="og:description" content={description} /><meta property="og:image" content={image} /><meta property="og:url" content={canon} />
      <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={ft} /><meta name="twitter:description" content={description} /><meta name="twitter:image" content={image} />
      {type === 'article' && <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: title, description, image, datePublished: publishedTime, author: { '@type': 'Person', name: author || 'XETHKIOZ' }, publisher: { '@type': 'Organization', name: 'XETHKIOZ', logo: { '@type': 'ImageObject', url: '/favicon.svg' } } })}</script>}
    </Helmet>
  )
}
