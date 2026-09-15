export type ApiHandler = (request: any, response: any) => unknown

const DEFAULT_BODY_LIMIT = 1_000_000
const bodyLimits: Record<string, number> = {
  '/api/web-quote': 32_000,
  '/api/visit-log': 4_096,
  '/api/huellas-stats': 512,
}

class RequestError extends Error {
  constructor(readonly status: number, message: string) { super(message) }
}

async function readBody(request: Request, limit: number) {
  if (!request.body) return undefined
  const length = Number(request.headers.get('content-length') || 0)
  if (Number.isFinite(length) && length > limit) throw new RequestError(413, 'PAYLOAD_TOO_LARGE')

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > limit) {
        await reader.cancel()
        throw new RequestError(413, 'PAYLOAD_TOO_LARGE')
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  if (!total) return undefined
  // Match the JSON endpoints' existing contract; other media types are
  // rejected by the handlers rather than guessed from the body.
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return undefined
  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
  try { return JSON.parse(new TextDecoder().decode(bytes)) }
  catch { throw new RequestError(400, 'INVALID_JSON') }
}

export async function runApi(handler: ApiHandler, request: Request, target: URL) {
  const headers = new Headers({ 'Cache-Control': 'no-store, max-age=0' })
  let status = 200
  let body: BodyInit | null = null
  const response = {
    setHeader(name: string, value: string | number) { headers.set(name, String(value)); return response },
    status(value: number) { status = value; return response },
    json(value: unknown) { headers.set('Content-Type', 'application/json; charset=utf-8'); body = JSON.stringify(value); return response },
    send(value: string) { body = value; return response },
  }
  try {
    const url = new URL(request.url)
    const forwarded = Object.fromEntries(request.headers)
    // Cloudflare overwrites CF-Connecting-IP. Never trust client-supplied
    // forwarding headers for the existing authorization/rate-limit checks.
    const clientIp = request.headers.get('cf-connecting-ip') || 'unknown-ip'
    forwarded['x-forwarded-for'] = clientIp
    forwarded['x-real-ip'] = clientIp
    forwarded['x-forwarded-host'] = url.host
    forwarded['x-forwarded-proto'] = url.protocol.slice(0, -1)
    forwarded.host = url.host
    await handler({
      method: request.method,
      url: `${target.pathname}${target.search}`,
      headers: forwarded,
      socket: { remoteAddress: clientIp },
      body: await readBody(request, bodyLimits[target.pathname] || DEFAULT_BODY_LIMIT),
    }, response)
  } catch (error) {
    status = error instanceof RequestError ? error.status : 500
    response.json({ ok: false, error: error instanceof RequestError ? error.message : 'INTERNAL_ERROR' })
    if (!(error instanceof RequestError)) console.error('Cloudflare API handler failed:', error instanceof Error ? error.message : 'unknown error')
  }
  return new Response(request.method === 'HEAD' ? null : body, { status, headers })
}
