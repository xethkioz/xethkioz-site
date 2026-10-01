import { createHmac, timingSafeEqual } from 'node:crypto'
import { createOrder, readConfig, requireValue, PaymentError, ORDER_INBOX } from './domain'
import type { PaymentConfig } from './domain'
import { DatabaseStore } from './store'
import { MercadoPago, PayPal } from './providers'
import type { Transport } from './providers'
import { confirmMercadoPago, confirmPayPal } from './confirmation'
import { deliverMessage } from './notifications'
import { DIGITAL_PRICES } from '../../src/lib/digitalPrices'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export type StoreContract = Pick<DatabaseStore, 'healthy' | 'create' | 'bind' | 'findByProviderId' | 'markPaidAndEnqueue' | 'keys' | 'claim' | 'accepted' | 'retry' | 'review'>
type Dependencies = { config: () => PaymentConfig | null; store: (config: PaymentConfig) => StoreContract; transport: Transport }
const defaults: Dependencies = { config: () => readConfig(process.env), store: config => new DatabaseStore(config), transport: (url, init) => fetch(url, init) }
export function createHandler(deps: Dependencies = defaults) {
  return async function handler(req: any, res: any) {
    res.setHeader('Cache-Control', 'no-store, max-age=0')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    const reply = (status: number, payload: unknown) => res.status(status).json(payload)
    const action = req.query?.action || 'config'
    try {
      requireValue(['config', 'checkout', 'webhook', 'worker'].includes(action), 'INVALID_REQUEST')
      requireValue((action === 'config' && req.method === 'GET') || (action === 'worker' && ['GET', 'POST'].includes(req.method)) || (['checkout', 'webhook'].includes(action) && req.method === 'POST'), 'METHOD_NOT_ALLOWED')
      const config = deps.config()
      if (!config) return reply(action === 'config' ? 200 : 503, { enabled: false, error: action === 'config' ? undefined : 'SERVICE_UNAVAILABLE' })
      requireValue(config.workerSecret && config.workerSecret.length >= 32, 'WORKER_NOT_CONFIGURED')
      const store = deps.store(config)
      if (action === 'config') {
        await store.healthy()
        return reply(200, { enabled: true, mode: config.mode, inbox: ORDER_INBOX,
          prices: { mercadopago: { course: config.arsCourse, project: config.arsProject, currency: 'ARS' }, paypal: { course: DIGITAL_PRICES.course.usd.toFixed(2), project: DIGITAL_PRICES.project.usd.toFixed(2), currency: 'USD' } } })
      }
      if (action === 'worker') {
        const header = req.headers?.authorization
        const expected = Buffer.from(`Bearer ${config.workerSecret}`)
        const received = Buffer.from(typeof header === 'string' ? header : '')
        requireValue(received.length === expected.length && timingSafeEqual(received, expected), 'UNAUTHORIZED')
        const keys = await store.keys()
        const result: Record<string, number> = {}
        for (const key of keys) {
          const state = await deliverMessage(key, store, config, deps.transport)
          result[state] = (result[state] || 0) + 1
        }
        return reply(200, { ok: true, result })
      }
      const limit = action === 'webhook' ? 100_000 : 6_000
      requireValue(Number(req.headers?.['content-length'] || 0) <= limit, 'PAYLOAD_TOO_LARGE')
      requireValue(typeof req.headers?.['content-type'] === 'string' && req.headers['content-type'].split(';')[0] === 'application/json', 'INVALID_REQUEST')
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      requireValue(JSON.stringify(body)?.length <= limit, 'PAYLOAD_TOO_LARGE')
      if (action === 'checkout') {
        const origin = req.headers?.origin
        requireValue(origin === new URL(config.returnUrl).origin, 'INVALID_ORIGIN')
        const key = req.headers?.['idempotency-key']
        requireValue(typeof key === 'string' && uuid.test(key), 'INVALID_REQUEST')
        const proposed = createOrder(body, config)
        const ip = typeof req.headers?.['x-forwarded-for'] === 'string' ? req.headers['x-forwarded-for'].split(',')[0].trim() : 'unknown'
        const day = new Date().toISOString().slice(0, 10)
        const ipHash = createHmac('sha256', config.workerSecret).update(`${day}:${ip}`).digest('hex')
        const saved = await store.create(proposed, key, ipHash)
        requireValue(saved.order.mode === config.mode, 'ORDER_PROVIDER_MISMATCH')
        requireValue(Date.now() - Date.parse(saved.order.createdAt) < 2 * 60 * 60_000, 'CHECKOUT_EXPIRED')
        if (saved.url) return reply(200, { orderId: saved.order.id, checkoutUrl: saved.url })
        const provider = saved.order.provider === 'paypal' ? new PayPal(config, deps.transport) : new MercadoPago(config, deps.transport)
        const checkout = await provider.create(saved.order)
        await store.bind(saved.order, checkout.id, checkout.url)
        return reply(201, { orderId: saved.order.id, checkoutUrl: checkout.url })
      }
      const headers = new Headers()
      for (const [key, value] of Object.entries(req.headers || {})) if (typeof value === 'string') headers.set(key, value)
      if (req.query?.provider === 'mercadopago') {
        requireValue(typeof req.query['data.id'] === 'string', 'INVALID_WEBHOOK')
        await confirmMercadoPago(config, store, headers, req.query['data.id'], body, deps.transport)
      } else if (req.query?.provider === 'paypal') {
        await confirmPayPal(config, store, headers, body, deps.transport)
      } else throw new PaymentError('INVALID_PROVIDER')
      // Emails are durably enqueued in the payment transaction. A separate
      // authenticated worker retries them without blocking provider delivery.
      return reply(200, { ok: true })
    } catch (error) {
      const code = error instanceof PaymentError ? error.code : 'SERVICE_UNAVAILABLE'
      if (code === 'METHOD_NOT_ALLOWED') { res.setHeader('Allow', 'GET, POST'); return reply(405, { error: code }) }
      if (code === 'RATE_LIMITED') { res.setHeader('Retry-After', '3600'); return reply(429, { error: code }) }
      if (code === 'PAYLOAD_TOO_LARGE') return reply(413, { error: code })
      if (['UNAUTHORIZED', 'INVALID_ORIGIN', 'INVALID_SIGNATURE', 'WEBHOOK_ACCOUNT_MISMATCH'].includes(code)) return reply(403, { error: 'REQUEST_NOT_AUTHORIZED' })
      if (['INVALID_REQUEST', 'INVALID_PRODUCT', 'INVALID_PROVIDER', 'CONSENT_REQUIRED', 'INVALID_EMAIL', 'INVALID_WHATSAPP', 'CHECKOUT_EXPIRED'].includes(code)) return reply(400, { error: code })
      // Configuration, merchant mismatches and provider/database failures are
      // not exposed. No body, receipt, account credential or PII is logged.
      return reply(503, { enabled: false, error: 'SERVICE_UNAVAILABLE' })
    }
  }
}
