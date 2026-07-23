function headerValue(request: any, name: string) {
  const raw = request?.headers?.[name] ?? request?.headers?.[name.toLowerCase()]
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === 'string' ? value.slice(0, 180) : null
}

export default function handler(request: any, response: any) {
  const metadata = {
    method: typeof request?.method === 'string' ? request.method.slice(0, 12) : 'UNKNOWN',
    userAgent: headerValue(request, 'user-agent'),
    githubEvent: headerValue(request, 'x-github-event'),
    githubHookId: headerValue(request, 'x-github-hook-id'),
    githubDelivery: headerValue(request, 'x-github-delivery'),
    contentType: headerValue(request, 'content-type'),
  }

  // This endpoint is temporary and intentionally never reads the request payload.
  console.info('[XETHKIOZ_TRIGGER_DIAGNOSTIC]', JSON.stringify(metadata))

  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store, max-age=0')
  response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
  response.status(410).json({
    error: 'gone',
    message: 'This obsolete webhook destination is disabled.',
  })
}
