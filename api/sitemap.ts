import { SITE_URL, escapeXml, fetchFeedArticles } from './_public-news-feed.js'

const staticRoutes = ['/', '/gaming', '/gaming/guides', '/science', '/fun', '/news', '/community', '/creacion-web', '/about', '/support', '/contact', '/privacy', '/editorial-policy']

export default async function handler(_request: any, response: any) {
  const articles = await fetchFeedArticles(1000)
  const staticUrls = staticRoutes.map((route) => `<url><loc>${SITE_URL}${route}</loc><changefreq>${route === '/' || route === '/news' ? 'daily' : 'weekly'}</changefreq><priority>${route === '/' ? '1.0' : '0.8'}</priority></url>`)
  const articleUrls = articles.map((article) => `<url><loc>${SITE_URL}/news/${escapeXml(article.slug)}</loc><lastmod>${escapeXml(article.updated_at || article.published_at || new Date().toISOString())}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...staticUrls, ...articleUrls].join('')}</urlset>`
  response.setHeader('Content-Type', 'application/xml; charset=utf-8')
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
  response.status(200).send(xml)
}
