// Server-only payment logic. Disabled until explicitly configured.
import { randomUUID } from 'node:crypto'

export const ORDER_INBOX = 'aidss1991@gmail.com'
export const ACCOUNT_EMAILS = { mercadopago: 'aidss1991@gmail.com', paypal: 'dreanor666@gmail.com' } as const
export type Provider = keyof typeof ACCOUNT_EMAILS
export type Mode = 'sandbox' | 'live'

const products = {
  'course-1': { title: 'ChatGPT para el día a día', kind: 'course', hours: 24 },
  'course-2': { title: 'ChatGPT para automatizar tareas', kind: 'course', hours: 24 },
  'course-3': { title: 'Creá tu web con ChatGPT', kind: 'course', hours: 24 },
  'course-4': { title: 'Multi-IA: herramientas que trabajan juntas', kind: 'course', hours: 24 },
  'project-1': { title: 'PyME en Argentina: base para empezar', kind: 'project', hours: 48 },
  'project-2': { title: 'Tu proyecto a medida: base esencial', kind: 'project', hours: 48 },
  'project-3': { title: 'Huerta en casa: del plan a la práctica', kind: 'project', hours: 48 },
} as const
export type ProductId = keyof typeof products

export class PaymentError extends Error {
  constructor(public readonly code: string) { super(code); this.name = 'PaymentError' }
}
export function requireValue(condition: unknown, code: string): asserts condition {
  if (!condition) throw new PaymentError(code)
}
export function record(value: unknown): Record<string, unknown> {
  requireValue(value !== null && typeof value === 'object' && !Array.isArray(value), 'INVALID_PROVIDER_RESPONSE')
  return value as Record<string, unknown>
}
export function money(value: unknown): string {
  requireValue(typeof value === 'string' && /^(0|[1-9]\d{0,8})(\.\d{1,2})?$/.test(value), 'INVALID_AMOUNT')
  const [whole, decimal = ''] = value.split('.')
  const cents = Number(whole) * 100 + Number(decimal.padEnd(2, '0'))
  requireValue(cents > 0 && Number.isSafeInteger(cents), 'INVALID_AMOUNT')
  return `${whole}.${decimal.padEnd(2, '0')}`
}
export function identifier(value: unknown): string {
  requireValue(typeof value === 'string' && /^[A-Za-z0-9-]{1,80}$/.test(value), 'INVALID_IDENTIFIER')
  return value
}
export function email(value: unknown): string {
  requireValue(typeof value === 'string' && value.length <= 254 && /^[^\s@<>\x00-\x1f\x7f]+@[^\s@<>\x00-\x1f\x7f]+\.[^\s@<>\x00-\x1f\x7f]+$/.test(value), 'INVALID_EMAIL')
  return value.trim().toLowerCase()
}
function text(value: unknown, max: number, min = 0): string {
  requireValue(typeof value === 'string' && value.length <= max && !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value), 'INVALID_REQUEST')
  const result = value.replace(/\r\n?/g, '\n').trim()
  requireValue(result.length >= min, 'INVALID_REQUEST')
  return result
}

export type PaymentConfig = {
  mode: Mode
  returnUrl: string
  arsCourse: string
  arsProject: string
  mpAccessToken: string
  mpWebhookSecret: string
  mpSellerId: string
  paypalClientId: string
  paypalClientSecret: string
  paypalWebhookId: string
  paypalMerchantId: string
  paypalAccountEmail: string
  resendApiKey: string
  emailFrom: string
  databaseUrl?: string
  databaseKey?: string
  workerSecret?: string
}

// No guessed ARS price, automatic FX rate or environment fallback to production.
export function readConfig(env: Record<string, string | undefined>): PaymentConfig | null {
  if (env.DIGITAL_PAYMENTS_ENABLED !== 'true') return null
  requireValue(env.DIGITAL_PAYMENTS_MODE === 'sandbox' || env.DIGITAL_PAYMENTS_MODE === 'live', 'CONFIG_MODE_REQUIRED')
  const mode = env.DIGITAL_PAYMENTS_MODE
  requireValue(mode !== 'live' || env.VERCEL_ENV === 'production', 'LIVE_REQUIRES_PRODUCTION')
  requireValue(mode !== 'sandbox' || env.VERCEL_ENV !== 'production', 'SANDBOX_REQUIRES_PREVIEW')
  const secret = (name: string) => {
    requireValue(Boolean(env[name]?.trim()), `CONFIG_REQUIRED_${name}`)
    return env[name]!.trim()
  }
  const returnUrl = secret('DIGITAL_PAYMENTS_RETURN_URL')
  const url = new URL(returnUrl)
  requireValue(url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash, 'INVALID_RETURN_URL')
  requireValue(url.pathname === '/digital/cursos' || url.pathname === '/en/digital/cursos', 'INVALID_RETURN_URL')
  requireValue(mode !== 'live' || url.origin === 'https://www.xethkioz.com.ar', 'INVALID_RETURN_URL')
  const emailFrom = email(secret('DIGITAL_ORDERS_EMAIL_FROM'))
  // Gmail is the recipient. Sending requires a separately verified domain.
  requireValue(!emailFrom.endsWith('@gmail.com') && !emailFrom.endsWith('@resend.dev'), 'VERIFIED_SENDER_REQUIRED')
  return {
    mode, returnUrl,
    arsCourse: money(secret('DIGITAL_COURSE_PRICE_ARS')),
    arsProject: money(secret('DIGITAL_PROJECT_PRICE_ARS')),
    mpAccessToken: secret('MERCADOPAGO_ACCESS_TOKEN'),
    mpWebhookSecret: secret('MERCADOPAGO_WEBHOOK_SECRET'),
    mpSellerId: identifier(secret('MERCADOPAGO_SELLER_ID')),
    paypalClientId: secret('PAYPAL_CLIENT_ID'),
    paypalClientSecret: secret('PAYPAL_CLIENT_SECRET'),
    paypalWebhookId: identifier(secret('PAYPAL_WEBHOOK_ID')),
    paypalMerchantId: identifier(secret('PAYPAL_MERCHANT_ID')),
    // Sandbox uses a fictitious merchant, not the real user's live email.
    paypalAccountEmail: mode === 'live' ? ACCOUNT_EMAILS.paypal : email(secret('PAYPAL_SANDBOX_ACCOUNT_EMAIL')),
    resendApiKey: secret('RESEND_API_KEY'), emailFrom,
    databaseUrl: secret('SUPABASE_URL'), databaseKey: secret('DIGITAL_ORDERS_SUPABASE_KEY'),
    workerSecret: secret('DIGITAL_ORDERS_WORKER_SECRET'),
  }
}

export type Order = {
  id: string; productId: ProductId; title: string; kind: 'course' | 'project'; hours: 24 | 48
  provider: Provider; mode: Mode; amount: string; currency: 'ARS' | 'USD'
  email: string; whatsapp: string; brief: string; focus: string; notes: string; createdAt: string
  providerOrderId?: string
}

export function createOrder(input: unknown, config: PaymentConfig): Order {
  requireValue(input !== null && typeof input === 'object' && !Array.isArray(input), 'INVALID_REQUEST')
  const data = record(input)
  const allowed = new Set(['productId', 'provider', 'email', 'whatsapp', 'brief', 'focus', 'notes', 'consent'])
  requireValue(Object.keys(data).every(key => allowed.has(key)), 'INVALID_REQUEST')
  requireValue(typeof data.productId === 'string' && Object.hasOwn(products, data.productId), 'INVALID_PRODUCT')
  requireValue(data.provider === 'mercadopago' || data.provider === 'paypal', 'INVALID_PROVIDER')
  requireValue(data.consent === true, 'CONSENT_REQUIRED')
  const productId = data.productId as ProductId
  const product = products[productId]
  const whatsapp = text(data.whatsapp, 30, 7)
  const digits = whatsapp.replace(/\D/g, '').length
  requireValue(/^[+0-9 ]+$/.test(whatsapp) && digits >= 7 && digits <= 15, 'INVALID_WHATSAPP')
  const custom = productId === 'project-2'
  const amount = data.provider === 'paypal' ? (product.kind === 'course' ? '15.00' : '50.00')
    : money(product.kind === 'course' ? config.arsCourse : config.arsProject)
  return {
    id: randomUUID(), productId, ...product, provider: data.provider, mode: config.mode,
    amount, currency: data.provider === 'paypal' ? 'USD' : 'ARS',
    email: email(data.email), whatsapp,
    brief: custom ? text(data.brief, 500, 10) : '',
    focus: custom ? text(data.focus, 160, 3) : '',
    notes: text(data.notes ?? '', 800), createdAt: new Date().toISOString(),
  }
}

export type Receipt = Readonly<{
  orderId: string; providerOrderId: string; paymentId: string; provider: Provider
  amount: string; currency: 'ARS' | 'USD'; verifiedAt: string
}>
