import { createHmac, timingSafeEqual } from 'node:crypto'
import { ACCOUNT_EMAILS, identifier, money, record, requireValue, PaymentError } from './domain'
import type { Order, PaymentConfig, Receipt } from './domain'

export type Transport = (url: string, init: RequestInit) => Promise<Response>
async function request(transport: Transport, url: string, init: RequestInit): Promise<Record<string, unknown>> {
  // No provider redirects, response dumps, tokens or customer information in errors.
  const response = await transport(url, { ...init, redirect: 'error', signal: AbortSignal.timeout(10_000) })
  requireValue(response.ok, 'PROVIDER_REQUEST_FAILED')
  return record(await response.json())
}
export function checkoutUrl(value: unknown, hosts: string[]): string {
  requireValue(typeof value === 'string', 'INVALID_CHECKOUT_URL')
  let url: URL
  try { url = new URL(value) } catch { throw new PaymentError('INVALID_CHECKOUT_URL') }
  requireValue(url.protocol === 'https:' && !url.username && !url.password && !url.port && hosts.includes(url.hostname), 'INVALID_CHECKOUT_URL')
  return url.href
}
function boundOrder(order: Order, config: PaymentConfig, provider: Order['provider']) {
  requireValue(order.provider === provider && order.mode === config.mode, 'ORDER_PROVIDER_MISMATCH')
  requireValue(order.currency === (provider === 'paypal' ? 'USD' : 'ARS'), 'ORDER_CURRENCY_MISMATCH')
  money(order.amount)
  identifier(order.id)
}
function receipt(order: Order, paymentId: unknown): Receipt {
  requireValue(order.providerOrderId, 'UNBOUND_PROVIDER_ORDER')
  return Object.freeze({
    orderId: order.id, providerOrderId: order.providerOrderId, paymentId: identifier(paymentId),
    provider: order.provider, amount: order.amount, currency: order.currency, verifiedAt: new Date().toISOString(),
  })
}

export class MercadoPago {
  constructor(private config: PaymentConfig, private transport: Transport = fetch) {}
  private api(path: string, method: string, body?: unknown, key?: string) {
    return request(this.transport, `https://api.mercadopago.com${path}`, {
      method, headers: { Authorization: `Bearer ${this.config.mpAccessToken}`, 'Content-Type': 'application/json', ...(key ? { 'X-Idempotency-Key': key } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  }
  async create(order: Order): Promise<{ id: string; url: string }> {
    boundOrder(order, this.config, 'mercadopago')
    const result = await this.api('/v1/orders', 'POST', {
      type: 'online', processing_mode: 'manual', total_amount: order.amount, external_reference: order.id,
      payer: { email: order.email },
      items: [{ external_code: order.productId, title: order.title, quantity: 1, unit_price: order.amount }],
      config: { online: { success_url: this.config.returnUrl, failure_url: this.config.returnUrl, pending_url: this.config.returnUrl, auto_return: 'approved' } },
    }, order.id)
    this.matches(result, order)
    return { id: identifier(result.id), url: checkoutUrl(result.checkout_url, ['www.mercadopago.com.ar']) }
  }
  private matches(result: Record<string, unknown>, order: Order) {
    requireValue(String(result.user_id) === this.config.mpSellerId, 'MERCHANT_MISMATCH')
    requireValue(result.external_reference === order.id, 'REFERENCE_MISMATCH')
    requireValue(result.currency === order.currency && money(result.total_amount) === order.amount, 'AMOUNT_MISMATCH')
  }
  async verify(order: Order): Promise<Receipt | null> {
    boundOrder(order, this.config, 'mercadopago')
    const id = identifier(order.providerOrderId)
    const result = await this.api(`/v1/orders/${id}`, 'GET')
    requireValue(result.id === id, 'PROVIDER_ORDER_MISMATCH')
    this.matches(result, order)
    if (result.status !== 'processed' || result.status_detail !== 'accredited') return null
    requireValue(money(result.total_paid_amount) === order.amount, 'AMOUNT_MISMATCH')
    const transactions = record(result.transactions)
    // One product, one payment. A partial refund or chargeback needs manual review.
    if (Array.isArray(transactions.refunds) && transactions.refunds.length) return null
    if (Array.isArray(transactions.chargebacks) && transactions.chargebacks.length) return null
    requireValue(Array.isArray(transactions.payments) && transactions.payments.length === 1, 'UNEXPECTED_PAYMENTS')
    const payment = record(transactions.payments[0])
    if (payment.status !== 'processed' || payment.status_detail !== 'accredited') return null
    requireValue(money(payment.amount) === order.amount && money(payment.paid_amount) === order.amount, 'AMOUNT_MISMATCH')
    return receipt(order, payment.id)
  }
}

// Require the signed query ID and the JSON ID to agree before using either.
// The timestamp is part of MP's signature. Persistence must deduplicate events;
// delayed provider retries are valid and must not be rejected as a fresh purchase.
export function verifyMercadoPagoWebhook(config: PaymentConfig, headers: Headers, queryId: string, body: unknown): string {
  const data = record(body)
  const id = identifier(queryId)
  requireValue(data.type === 'order' && record(data.data).id === id, 'INVALID_WEBHOOK')
  requireValue(data.live_mode === (config.mode === 'live') && String(data.user_id) === config.mpSellerId, 'WEBHOOK_ACCOUNT_MISMATCH')
  const signature = headers.get('x-signature') || ''
  const parts = signature.split(',').map(part => part.trim().split('='))
  requireValue(parts.length === 2 && parts.every(part => part.length === 2), 'INVALID_SIGNATURE')
  const map = new Map<string, string>(parts.map(part => [part[0], part[1]]))
  const timestamp = map.get('ts') || ''
  const digest = map.get('v1') || ''
  const requestId = headers.get('x-request-id') || ''
  requireValue(/^\d{10,13}$/.test(timestamp) && /^[a-f0-9]{64}$/i.test(digest) && /^[A-Za-z0-9-]{1,128}$/.test(requestId), 'INVALID_SIGNATURE')
  const expected = createHmac('sha256', config.mpWebhookSecret).update(`id:${id.toLowerCase()};request-id:${requestId};ts:${timestamp};`).digest()
  requireValue(timingSafeEqual(expected, Buffer.from(digest, 'hex')), 'INVALID_SIGNATURE')
  return id
}

export class PayPal {
  private base: string
  constructor(private config: PaymentConfig, private transport: Transport = fetch) {
    this.base = config.mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
  }
  private async token() {
    const auth = Buffer.from(`${this.config.paypalClientId}:${this.config.paypalClientSecret}`).toString('base64')
    const result = await request(this.transport, `${this.base}/v1/oauth2/token`, {
      method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials',
    })
    requireValue(typeof result.access_token === 'string' && result.access_token.length > 0, 'INVALID_PROVIDER_RESPONSE')
    return result.access_token
  }
  private async api(path: string, method: string, body?: unknown, key?: string) {
    return request(this.transport, `${this.base}${path}`, {
      method, headers: { Authorization: `Bearer ${await this.token()}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(key ? { 'PayPal-Request-Id': key } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  }
  async create(order: Order): Promise<{ id: string; url: string }> {
    boundOrder(order, this.config, 'paypal')
    const result = await this.api('/v2/checkout/orders', 'POST', {
      intent: 'CAPTURE', purchase_units: [{
        reference_id: order.id, custom_id: order.id, description: order.title,
        amount: { currency_code: 'USD', value: order.amount },
        payee: { merchant_id: this.config.paypalMerchantId },
      }],
      payment_source: { paypal: { experience_context: {
        shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW', return_url: this.config.returnUrl, cancel_url: this.config.returnUrl,
      } } },
    }, order.id)
    requireValue(result.status === 'CREATED' || result.status === 'PAYER_ACTION_REQUIRED', 'INVALID_PROVIDER_RESPONSE')
    requireValue(Array.isArray(result.links), 'INVALID_PROVIDER_RESPONSE')
    const link = result.links.map(record).find(link => link.rel === 'payer-action' || link.rel === 'approve')
    return { id: identifier(result.id), url: checkoutUrl(link?.href, [this.config.mode === 'live' ? 'www.paypal.com' : 'www.sandbox.paypal.com']) }
  }
  private unit(result: Record<string, unknown>, order: Order) {
    requireValue(result.id === order.providerOrderId && result.intent === 'CAPTURE', 'PROVIDER_ORDER_MISMATCH')
    requireValue(Array.isArray(result.purchase_units) && result.purchase_units.length === 1, 'UNEXPECTED_PAYMENTS')
    const unit = record(result.purchase_units[0])
    requireValue(unit.custom_id === order.id && unit.reference_id === order.id, 'REFERENCE_MISMATCH')
    const payee = record(unit.payee)
    requireValue(payee.merchant_id === this.config.paypalMerchantId, 'MERCHANT_MISMATCH')
    requireValue(typeof payee.email_address === 'string' && payee.email_address.toLowerCase() === this.config.paypalAccountEmail, 'MERCHANT_MISMATCH')
    requireValue(this.config.mode !== 'live' || this.config.paypalAccountEmail === ACCOUNT_EMAILS.paypal, 'MERCHANT_MISMATCH')
    const amount = record(unit.amount)
    requireValue(amount.currency_code === order.currency && money(amount.value) === order.amount, 'AMOUNT_MISMATCH')
    return unit
  }
  async verify(order: Order): Promise<Receipt | null> {
    boundOrder(order, this.config, 'paypal')
    const result = await this.api(`/v2/checkout/orders/${identifier(order.providerOrderId)}`, 'GET')
    const unit = this.unit(result, order)
    if (result.status !== 'COMPLETED') return null
    const payments = record(unit.payments)
    requireValue(Array.isArray(payments.captures) && payments.captures.length === 1, 'UNEXPECTED_PAYMENTS')
    const capture = record(payments.captures[0])
    if (capture.status !== 'COMPLETED' || capture.final_capture !== true) return null
    const amount = record(capture.amount)
    requireValue(amount.currency_code === order.currency && money(amount.value) === order.amount, 'AMOUNT_MISMATCH')
    return receipt(order, capture.id)
  }
  // Caller must bind this saved order to an authenticated customer action or a
  // verified CHECKOUT.ORDER.APPROVED webhook. Never call from a return URL alone.
  async captureApproved(order: Order): Promise<Receipt | null> {
    boundOrder(order, this.config, 'paypal')
    const id = identifier(order.providerOrderId)
    const before = await this.api(`/v2/checkout/orders/${id}`, 'GET')
    this.unit(before, order)
    if (before.status === 'COMPLETED') return this.verify(order)
    requireValue(before.status === 'APPROVED', 'BUYER_APPROVAL_REQUIRED')
    await this.api(`/v2/checkout/orders/${id}/capture`, 'POST', {}, `cap-${order.id.replaceAll('-', '')}`)
    return this.verify(order)
  }
  async verifyWebhook(headers: Headers, body: unknown): Promise<Record<string, unknown>> {
    const event = record(body)
    identifier(event.id)
    const requiredHeaders = ['paypal-auth-algo', 'paypal-cert-url', 'paypal-transmission-id', 'paypal-transmission-sig', 'paypal-transmission-time']
    for (const name of requiredHeaders) requireValue(Boolean(headers.get(name)), 'INVALID_SIGNATURE')
    const cert = new URL(headers.get('paypal-cert-url')!)
    requireValue(cert.protocol === 'https:' && !cert.username && !cert.password && !cert.port && ['api.paypal.com', 'api-m.paypal.com', 'api.sandbox.paypal.com', 'api-m.sandbox.paypal.com'].includes(cert.hostname), 'INVALID_SIGNATURE')
    // The certificate URL is passed to PayPal; this server never fetches it.
    const result = await this.api('/v1/notifications/verify-webhook-signature', 'POST', {
      auth_algo: headers.get('paypal-auth-algo'), cert_url: cert.href,
      transmission_id: headers.get('paypal-transmission-id'), transmission_sig: headers.get('paypal-transmission-sig'),
      transmission_time: headers.get('paypal-transmission-time'), webhook_id: this.config.paypalWebhookId, webhook_event: event,
    })
    requireValue(result.verification_status === 'SUCCESS', 'INVALID_SIGNATURE')
    return event
  }
}
