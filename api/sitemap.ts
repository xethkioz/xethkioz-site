import { SITE_URL } from './_public-news-feed.js'

type LocalizedRoute = {
  es: string
  en: string
  changefreq: 'daily' | 'weekly'
  priority: string
}

const localizedRoutes: LocalizedRoute[] = [
  { es: '/', en: '/en', changefreq: 'daily', priority: '1.0' },
  { es: '/explorar', en: '/en/explorar', changefreq: 'daily', priority: '0.9' },
  { es: '/green-node', en: '/en/green-node', changefreq: 'weekly', priority: '0.8' },
  { es: '/science', en: '/en/science', changefreq: 'weekly', priority: '0.8' },
  { es: '/about', en: '/en/about', changefreq: 'weekly', priority: '0.5' },
  { es: '/contact', en: '/en/contact', changefreq: 'weekly', priority: '0.5' },
  { es: '/privacy', en: '/en/privacy', changefreq: 'weekly', priority: '0.4' },
  { es: '/editorial-policy', en: '/en/editorial-policy', changefreq: 'weekly', priority: '0.4' },
]


function alternateLinks(route: LocalizedRoute) {
  return [
    `<xhtml:link rel="alternate" hreflang="es-AR" href="${SITE_URL}${route.es}" />`,
    `<xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${route.en}" />`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${route.es}" />`,
  ].join('')
}

function localizedUrl(path: string, route: LocalizedRoute) {
  return `<url><loc>${SITE_URL}${path}</loc>${alternateLinks(route)}<changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`
}

export default async function handler(_request: any, response: any) {
  const localizedUrls = localizedRoutes.flatMap((route) => [
    localizedUrl(route.es, route),
    localizedUrl(route.en, route),
  ])
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${localizedUrls.join('')}</urlset>`
  response.setHeader('Content-Type', 'application/xml; charset=utf-8')
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
  response.status(200).send(xml)
}
