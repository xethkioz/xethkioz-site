import {
  SITE_URL,
  absoluteUrl,
  fetchPublishedArticleMetadata,
  type PublicArticleMetadata,
} from './_public-news-feed.js'

const DEFAULT_DESCRIPTION = 'Noticias, análisis y señales verificadas sobre videojuegos, tecnología, inteligencia artificial, ciencia y cultura digital.'
const DEFAULT_IMAGE = '/assets/xethkioz-cover.png'
const AUTHOR_NAME = 'Alexis Díaz · XETHKIOZ'
const NOT_FOUND_TITLE = 'Noticia no encontrada | XETHKIOZ'
const NOT_FOUND_DESCRIPTION = 'La publicación no existe, todavía no está disponible o fue retirada del radar público de XETHKIOZ.'

function firstHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function escapeHtml(value: string) {
  return value.replace(/[&"<>]/g, (character) => ({
    '&': '&amp;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
  })[character] ?? character)
}

function safeJson(value: unknown) {
  return JSON.stringify(value)
    .replace(/[<>&]/g, (character) => ({
      '<': '\\u003c',
      '>': '\\u003e',
      '&': '\\u0026',
    })[character] ?? character)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function replaceRequired(html: string, pattern: RegExp, replacement: string, label: string) {
  if (!pattern.test(html)) throw new Error(`ARTICLE_SHELL_MISSING_${label}`)
  pattern.lastIndex = 0
  return html.replace(pattern, replacement)
}

function requestOrigin(request: any) {
  const host = firstHeader(request.headers?.['x-forwarded-host']) || firstHeader(request.headers?.host)
  const protocol = firstHeader(request.headers?.['x-forwarded-proto']) || 'https'
  return host ? `${protocol}://${host}` : SITE_URL
}

async function fetchStaticNewsShell(request: any) {
  const cookie = firstHeader(request.headers?.cookie)
  const protectionBypass = firstHeader(request.headers?.['x-vercel-protection-bypass'])
  const headers: Record<string, string> = {
    Accept: 'text/html',
    'User-Agent': 'XETHKIOZ-Article-Shell/1.0',
  }
  if (cookie) headers.Cookie = cookie
  if (protectionBypass) headers['x-vercel-protection-bypass'] = protectionBypass

  const origins = [...new Set([requestOrigin(request), SITE_URL])]
  let lastError: unknown = null

  for (const origin of origins) {
    try {
      const response = await fetch(`${origin}/seo-shells/news.html`, {
        headers,
        redirect: 'follow',
        signal: AbortSignal.timeout(4500),
      })
      if (!response.ok) {
        lastError = new Error(`ARTICLE_SHELL_HTTP_${response.status}`)
        continue
      }
      const html = await response.text()
      if (!html.includes('<div id="root"></div>')) {
        lastError = new Error('ARTICLE_SHELL_INVALID')
        continue
      }
      return html
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error ? lastError : new Error('ARTICLE_SHELL_UNAVAILABLE')
}

function renderArticleShell(template: string, article: PublicArticleMetadata) {
  const canonical = `${SITE_URL}/news/${article.slug}`
  const description = article.summary?.trim() || DEFAULT_DESCRIPTION
  const image = absoluteUrl(article.cover_image_url || DEFAULT_IMAGE)
  const imageAlt = article.cover_image_alt?.trim() || article.title
  const fullTitle = `${article.title} | XETHKIOZ`
  const tags = (article.tags ?? []).map((tag) => tag.trim()).filter(Boolean).slice(0, 16)
  const publishedAt = article.published_at || article.created_at
  const modifiedAt = article.updated_at || publishedAt
  let html = template

  html = replaceRequired(html, /<meta data-rh="true" name="description" content="[^"]*" \/>/, `<meta data-rh="true" name="description" content="${escapeHtml(description)}" />`, 'DESCRIPTION')
  html = replaceRequired(html, /<meta name="keywords" content="[^"]*" \/>/, `<meta name="keywords" content="${escapeHtml(tags.join(', '))}" />`, 'KEYWORDS')
  html = replaceRequired(html, /<link data-rh="true" rel="canonical" href="[^"]*" \/>/, `<link data-rh="true" rel="canonical" href="${escapeHtml(canonical)}" />`, 'CANONICAL')
  html = replaceRequired(html, /<meta data-rh="true" property="og:type" content="[^"]*" \/>/, '<meta data-rh="true" property="og:type" content="article" />', 'OG_TYPE')
  html = replaceRequired(html, /<meta data-rh="true" property="og:title" content="[^"]*" \/>/, `<meta data-rh="true" property="og:title" content="${escapeHtml(fullTitle)}" />`, 'OG_TITLE')
  html = replaceRequired(html, /<meta data-rh="true" property="og:description" content="[^"]*" \/>/, `<meta data-rh="true" property="og:description" content="${escapeHtml(description)}" />`, 'OG_DESCRIPTION')
  html = replaceRequired(html, /<meta data-rh="true" property="og:url" content="[^"]*" \/>/, `<meta data-rh="true" property="og:url" content="${escapeHtml(canonical)}" />`, 'OG_URL')
  html = replaceRequired(html, /<meta data-rh="true" property="og:image" content="[^"]*" \/>/, `<meta data-rh="true" property="og:image" content="${escapeHtml(image)}" />`, 'OG_IMAGE')
  html = replaceRequired(html, /<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`, 'OG_IMAGE_ALT')
  html = replaceRequired(html, /<meta data-rh="true" name="twitter:title" content="[^"]*" \/>/, `<meta data-rh="true" name="twitter:title" content="${escapeHtml(fullTitle)}" />`, 'TWITTER_TITLE')
  html = replaceRequired(html, /<meta data-rh="true" name="twitter:description" content="[^"]*" \/>/, `<meta data-rh="true" name="twitter:description" content="${escapeHtml(description)}" />`, 'TWITTER_DESCRIPTION')
  html = replaceRequired(html, /<meta data-rh="true" name="twitter:image" content="[^"]*" \/>/, `<meta data-rh="true" name="twitter:image" content="${escapeHtml(image)}" />`, 'TWITTER_IMAGE')
  html = replaceRequired(html, /<meta name="twitter:image:alt" content="[^"]*" \/>/, `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`, 'TWITTER_IMAGE_ALT')
  html = replaceRequired(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`, 'TITLE')

  const articleMetadata = [
    `<meta data-rh="true" property="article:published_time" content="${escapeHtml(publishedAt)}" />`,
    `<meta data-rh="true" property="article:modified_time" content="${escapeHtml(modifiedAt)}" />`,
    `<meta data-rh="true" property="article:section" content="${escapeHtml(article.category)}" />`,
    ...tags.map((tag) => `<meta data-rh="true" property="article:tag" content="${escapeHtml(tag)}" />`),
    `<script data-rh="true" type="application/ld+json">${safeJson({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description,
      image: [image],
      datePublished: publishedAt,
      dateModified: modifiedAt,
      inLanguage: 'es-AR',
      isAccessibleForFree: true,
      articleSection: article.category,
      keywords: tags,
      author: { '@type': 'Person', name: AUTHOR_NAME },
      publisher: {
        '@type': 'Organization',
        name: 'XETHKIOZ',
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
      },
      mainEntityOfPage: canonical,
    })}</script>`,
  ].map((tag) => `    ${tag}`).join('\n')

  return html.replace('  </head>', `${articleMetadata}\n  </head>`)
}

function renderNotFoundShell(template: string, slug: string) {
  const requestedUrl = `${SITE_URL}/news/${encodeURIComponent(slug)}`
  const image = absoluteUrl(DEFAULT_IMAGE)
  let html = template

  html = replaceRequired(html, /<meta data-rh="true" name="description" content="[^"]*" \/>/, `<meta data-rh="true" name="description" content="${escapeHtml(NOT_FOUND_DESCRIPTION)}" />`, 'NOT_FOUND_DESCRIPTION')
  html = replaceRequired(html, /<meta name="keywords" content="[^"]*" \/>/, '<meta name="keywords" content="XETHKIOZ, noticias" />', 'NOT_FOUND_KEYWORDS')
  html = replaceRequired(html, /<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow, noarchive" />', 'NOT_FOUND_ROBOTS')
  html = replaceRequired(html, /<meta name="googlebot" content="[^"]*" \/>/, '<meta name="googlebot" content="noindex, nofollow, noarchive" />', 'NOT_FOUND_GOOGLEBOT')
  html = replaceRequired(html, /<link data-rh="true" rel="canonical" href="[^"]*" \/>/, `<link data-rh="true" rel="canonical" href="${escapeHtml(requestedUrl)}" />`, 'NOT_FOUND_CANONICAL')
  html = replaceRequired(html, /<meta data-rh="true" property="og:type" content="[^"]*" \/>/, '<meta data-rh="true" property="og:type" content="website" />', 'NOT_FOUND_OG_TYPE')
  html = replaceRequired(html, /<meta data-rh="true" property="og:title" content="[^"]*" \/>/, `<meta data-rh="true" property="og:title" content="${escapeHtml(NOT_FOUND_TITLE)}" />`, 'NOT_FOUND_OG_TITLE')
  html = replaceRequired(html, /<meta data-rh="true" property="og:description" content="[^"]*" \/>/, `<meta data-rh="true" property="og:description" content="${escapeHtml(NOT_FOUND_DESCRIPTION)}" />`, 'NOT_FOUND_OG_DESCRIPTION')
  html = replaceRequired(html, /<meta data-rh="true" property="og:url" content="[^"]*" \/>/, `<meta data-rh="true" property="og:url" content="${escapeHtml(requestedUrl)}" />`, 'NOT_FOUND_OG_URL')
  html = replaceRequired(html, /<meta data-rh="true" property="og:image" content="[^"]*" \/>/, `<meta data-rh="true" property="og:image" content="${escapeHtml(image)}" />`, 'NOT_FOUND_OG_IMAGE')
  html = replaceRequired(html, /<meta property="og:image:alt" content="[^"]*" \/>/, '<meta property="og:image:alt" content="Noticia no encontrada en XETHKIOZ" />', 'NOT_FOUND_OG_IMAGE_ALT')
  html = replaceRequired(html, /<meta data-rh="true" name="twitter:title" content="[^"]*" \/>/, `<meta data-rh="true" name="twitter:title" content="${escapeHtml(NOT_FOUND_TITLE)}" />`, 'NOT_FOUND_TWITTER_TITLE')
  html = replaceRequired(html, /<meta data-rh="true" name="twitter:description" content="[^"]*" \/>/, `<meta data-rh="true" name="twitter:description" content="${escapeHtml(NOT_FOUND_DESCRIPTION)}" />`, 'NOT_FOUND_TWITTER_DESCRIPTION')
  html = replaceRequired(html, /<meta data-rh="true" name="twitter:image" content="[^"]*" \/>/, `<meta data-rh="true" name="twitter:image" content="${escapeHtml(image)}" />`, 'NOT_FOUND_TWITTER_IMAGE')
  html = replaceRequired(html, /<meta name="twitter:image:alt" content="[^"]*" \/>/, '<meta name="twitter:image:alt" content="Noticia no encontrada en XETHKIOZ" />', 'NOT_FOUND_TWITTER_IMAGE_ALT')
  return replaceRequired(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(NOT_FOUND_TITLE)}</title>`, 'NOT_FOUND_TITLE')
}

export default async function handler(request: any, response: any) {
  const slug = typeof request.query?.slug === 'string' ? request.query.slug : ''
  if (!slug) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8')
    response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
    response.status(400).send('Missing article slug.')
    return
  }

  try {
    const article = await fetchPublishedArticleMetadata(slug)
    if (!article) {
      response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=120')
      response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
      try {
        const template = await fetchStaticNewsShell(request)
        const html = renderNotFoundShell(template, slug)
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.setHeader('Content-Language', 'es-AR')
        response.status(404).send(html)
      } catch (shellError) {
        console.error(JSON.stringify({
          level: 'error',
          message: 'news-page 404 shell failed',
          slug,
          detail: shellError instanceof Error ? shellError.message : String(shellError),
        }))
        response.setHeader('Content-Type', 'text/plain; charset=utf-8')
        response.status(404).send('Published article not found.')
      }
      return
    }

    const template = await fetchStaticNewsShell(request)
    const html = renderArticleShell(template, article)
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.setHeader('Content-Language', 'es-AR')
    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=900, stale-while-revalidate=3600')
    response.status(200).send(html)
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'news-page render failed',
      slug,
      detail: error instanceof Error ? error.message : String(error),
    }))
    response.setHeader('Content-Type', 'text/plain; charset=utf-8')
    response.setHeader('Cache-Control', 'no-store, max-age=0')
    response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
    response.status(503).send('Article metadata is temporarily unavailable.')
  }
}
