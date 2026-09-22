export default function handler(request: any, response: any) {
  if (!['GET', 'HEAD'].includes(String(request.method || 'GET').toUpperCase())) {
    response.setHeader('Allow', 'GET, HEAD')
    response.setHeader('Cache-Control', 'no-store')
    response.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' })
    return
  }

  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
  response.status(200).json({ ok: true })
}
