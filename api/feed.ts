import { SITE_URL, absoluteUrl, escapeXml, fetchFeedArticles } from './_public-news-feed.js'

export default async function handler(_request: any, response: any) {
  const articles = await fetchFeedArticles(50)
  const items = articles.map((article) => `<item><title>${escapeXml(article.title)}</title><link>${SITE_URL}/news/${escapeXml(article.slug)}</link><guid isPermaLink="true">${SITE_URL}/news/${escapeXml(article.slug)}</guid><pubDate>${new Date(article.published_at || Date.now()).toUTCString()}</pubDate><category>${escapeXml(article.category)}</category><description>${escapeXml(article.summary || '')}</description>${article.cover_image_url ? `<enclosure url="${escapeXml(absoluteUrl(article.cover_image_url))}" type="image/webp" />` : ''}</item>`)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>XETHKIOZ // Nexus News</title><link>${SITE_URL}/news</link><description>Gaming, ciencia, tecnología, humor y archivos Green Node desde el universo XETHKIOZ.</description><language>es-ar</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items.join('')}</channel></rss>`
  response.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=900, stale-while-revalidate=3600')
  response.status(200).send(xml)
}
