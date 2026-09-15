import config from '../vercel.json'
import authHealth from '../api/auth-health'
import adminAuthLink from '../api/admin-auth-link'
import generateNews from '../api/generate-news/index'
import visitLog from '../api/visit-log'
import huellasStats from '../api/huellas-stats'
import webQuote from '../api/web-quote'
import sitemap from '../api/sitemap'
import newsSitemap from '../api/news-sitemap'
import feed from '../api/feed'
import notFound from '../api/not-found'
import { renderNewsPage } from '../api/news-page'
import { runApi, type ApiHandler } from './adapter'

interface Env { ASSETS: { fetch(request: Request): Promise<Response> } }
interface Context { waitUntil(promise: Promise<unknown>): void }

function routePattern(source: string) {
  const names: string[] = []
  const expression = source.split(/(\(\.\*\)|:[A-Za-z]\w*)/).map((part) => {
    if (part === '(.*)') return '.*'
    if (part.startsWith(':')) { names.push(part.slice(1)); return '([^/]+)' }
    return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }).join('')
  return { regex: new RegExp(`^${expression}$`), names }
}

const headerRules = config.headers.map((rule) => ({ ...rule, ...routePattern(rule.source) }))
const dynamicRules = config.rewrites
  .filter((rule) => rule.destination.startsWith('/api/') && !rule.source.includes('?!'))
  .map((rule) => ({ ...rule, ...routePattern(rule.source) }))
const cacheablePaths = new Set(['/sitemap.xml', '/news-sitemap.xml', '/feed.xml'])

function withHeaders(result: Response, url: URL, method: string) {
  const headers = new Headers(result.headers)
  for (const rule of headerRules) {
    if (!rule.regex.test(url.pathname)) continue
    for (const { key, value } of rule.headers) {
      // Preserve stricter per-handler privacy and cache directives.
      if (!headers.has(key)) headers.set(key, value)
    }
  }
  if (url.hostname.endsWith('.workers.dev') && !headers.has('X-Robots-Tag')) {
    headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return new Response(method === 'HEAD' ? null : result.body, {
    status: result.status, statusText: result.statusText, headers,
  })
}

function apiTarget(url: URL) {
  if (url.pathname.startsWith('/api/')) return new URL(url)
  for (const rule of dynamicRules) {
    const match = rule.regex.exec(url.pathname)
    if (!match) continue
    const values = Object.fromEntries(rule.names.map((name, index) => [name, encodeURIComponent(decodeURIComponent(match[index + 1]))]))
    const destination = rule.destination.replace(/:([A-Za-z]\w*)/g, (_, name: string) => values[name])
    const target = new URL(destination, url)
    for (const [key, value] of url.searchParams) if (!target.searchParams.has(key)) target.searchParams.append(key, value)
    return target
  }
  return null
}

function handlers(env: Env, request: Request): Record<string, ApiHandler> {
  return {
    '/api/auth-health': authHealth,
    '/api/admin-auth-link': adminAuthLink,
    '/api/generate-news': generateNews,
    '/api/visit-log': visitLog,
    '/api/huellas-stats': huellasStats,
    '/api/web-quote': webQuote,
    '/api/sitemap': sitemap,
    '/api/news-sitemap': newsSitemap,
    '/api/feed': feed,
    '/api/not-found': notFound,
    '/api/news-page': (req, res) => renderNewsPage(req, res, async () => {
      // Read this deployment's assets directly: no self-fetch to Vercel,
      // cookies, protection bypass tokens or an untrusted Host header.
      const asset = await env.ASSETS.fetch(new Request(new URL('/seo-shells/news.html', request.url)))
      if (!asset.ok) throw new Error('ARTICLE_SHELL_UNAVAILABLE')
      const html = await asset.text()
      if (!html.includes('<div id="root"></div>')) throw new Error('ARTICLE_SHELL_INVALID')
      return html
    }),
  }
}

export default {
  async fetch(request: Request, env: Env, context: Context): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      const destination = new URL(url)
      destination.pathname = url.pathname.replace(/\/+$/, '') || '/'
      return withHeaders(Response.redirect(destination.href, 308), url, request.method)
    }
    // These are exclusively published, public resources. Private APIs,
    // sessions and mutation responses never enter the shared cache.
    const canCache = request.method === 'GET'
      && !request.headers.has('authorization') && !request.headers.has('cookie')
      && !url.search && (cacheablePaths.has(url.pathname) || /^\/news\/[a-z0-9-]+$/.test(url.pathname))
    const cache = (caches as CacheStorage & { default: Cache }).default
    if (canCache) {
      const hit = await cache.match(request)
      if (hit) return hit
    }

    let target: URL | null
    try { target = apiTarget(url) }
    catch { return withHeaders(new Response('Invalid URL', { status: 400 }), url, request.method) }
    let result: Response
    if (target) {
      const handler = handlers(env, request)[target.pathname]
      result = handler
        ? await runApi(handler, request, target)
        : Response.json({ ok: false, error: 'NOT_FOUND' }, { status: 404, headers: { 'Cache-Control': 'no-store' } })
    } else {
      result = await env.ASSETS.fetch(request)
      if (result.status === 404) result = await runApi(notFound, request, url)
    }
    result = withHeaders(result, url, request.method)
    if (canCache && result.status === 200 && !result.headers.has('set-cookie')
      && !/private|no-store/i.test(result.headers.get('cache-control') || '')) {
      context.waitUntil(cache.put(request, result.clone()).catch(() => undefined))
    }
    return result
  },
}
