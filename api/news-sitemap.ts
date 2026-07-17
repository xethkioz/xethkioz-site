import { SITE_URL, escapeXml, fetchFeedArticles } from './_public-news-feed.js'

export default async function handler(_request: any, response: any) {
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000
  const articles = (await fetchFeedArticles(1000)).filter((article) => article.published_at && new Date(article.published_at).getTime() >= cutoff)
  const urls = articles.map((article) => `<url><loc>${SITE_URL}/news/${escapeXml(article.slug)}</loc><news:news><news:publication><news:name>XETHKIOZ</news:name><news:language>es</news:language></news:publication><news:publication_date>${escapeXml(article.published_at || '')}</news:publication_date><news:title>${escapeXml(article.title)}</news:title></news:news></url>`)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls.join('')}</urlset>`
  response.setHeader('Content-Type', 'application/xml; charset=utf-8')
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=900, stale-while-revalidate=3600')
  response.status(200).send(xml)
}
