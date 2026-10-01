import { ORDER_INBOX, requireValue, record } from './domain'
import type { Order, PaymentConfig, Receipt } from './domain'
import type { Transport } from './providers'

export type Message = Readonly<{
  key: string; from: string; to: string; replyTo: string; subject: string; text: string
}>

export function paidMessages(order: Order, receipt: Receipt, config: PaymentConfig): Message[] {
  requireValue(receipt.orderId === order.id && receipt.providerOrderId === order.providerOrderId
    && receipt.provider === order.provider && receipt.amount === order.amount && receipt.currency === order.currency, 'RECEIPT_MISMATCH')
  const summary = [
    `Pedido: ${order.id}`, `Producto: ${order.title}`, `Cantidad: 1`,
    `Pago confirmado: ${order.currency} ${order.amount}`, `Medio: ${order.provider === 'paypal' ? 'PayPal' : 'Mercado Pago'}`,
    `Orden del proveedor: ${receipt.providerOrderId}`, `Referencia del pago: ${receipt.paymentId}`,
    `Verificado: ${receipt.verifiedAt}`,
  ]
  const conditions = `Entrega dentro de ${order.hours} horas después de confirmar el pago y el contacto por correo.`
  return [
    {
      key: `digital-order/${order.id}/owner-paid-v1`, from: config.emailFrom, to: ORDER_INBOX, replyTo: order.email,
      subject: `Pedido pagado · ${order.title} · ${order.id}`,
      text: [...summary, '', `Email del cliente: ${order.email}`, `WhatsApp: ${order.whatsapp}`,
        ...(order.productId === 'project-2' ? [`Resumen: ${order.brief}`, `Enfoque: ${order.focus}`] : []),
        `Comentarios: ${order.notes || 'Sin comentarios adicionales'}`, '', conditions,
        'La referencia anterior fue consultada al proveedor; un comprobante del cliente se verifica por separado.',
      ].join('\n'),
    },
    {
      key: `digital-order/${order.id}/buyer-paid-v1`, from: config.emailFrom, to: order.email, replyTo: ORDER_INBOX,
      subject: `Pago confirmado · ${order.title}`,
      text: [...summary, '', conditions,
        `Escribí a ${ORDER_INBOX} con este número de pedido para confirmar el contacto y coordinar la entrega.`,
      ].join('\n'),
    },
  ]
}

export async function sendMessage(message: Message, config: PaymentConfig, transport: Transport = fetch): Promise<string> {
  const result = await transport('https://api.resend.com/emails', {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10_000),
    headers: { Authorization: `Bearer ${config.resendApiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': message.key },
    body: JSON.stringify({ from: message.from, to: [message.to], reply_to: message.replyTo, subject: message.subject, text: message.text }),
  })
  requireValue(result.ok, 'EMAIL_NOT_ACCEPTED')
  const payload = record(await result.json())
  requireValue(typeof payload.id === 'string' && payload.id.length > 0, 'EMAIL_NOT_ACCEPTED')
  // Accepted by the email service. Actual inbox delivery requires its delivery
  // webhook; never describe API acceptance as delivery to the recipient.
  return payload.id
}

// Production adapter must use a transaction and leases, not an in-memory map.
export interface OutboxStore {
  claim(key: string): Promise<{ message: Message; firstAttemptAt: string } | null>
  accepted(key: string, providerMessageId: string): Promise<void>
  retry(key: string): Promise<void>
  review(key: string): Promise<void>
}
export async function deliverMessage(key: string, store: OutboxStore, config: PaymentConfig, transport: Transport = fetch, now = Date.now()): Promise<'accepted' | 'pending' | 'review' | 'skipped'> {
  const job = await store.claim(key)
  if (!job) return 'skipped'
  // Resend's idempotency cache lasts 24h. Do not automatically retry an
  // ambiguous result outside that window; it could create a second email.
  const firstAttempt = Date.parse(job.firstAttemptAt)
  if (!Number.isFinite(firstAttempt) || firstAttempt > now || now - firstAttempt >= 23 * 60 * 60_000) {
    await store.review(key)
    return 'review'
  }
  try {
    const id = await sendMessage(job.message, config, transport)
    await store.accepted(key, id)
    return 'accepted'
  } catch {
    await store.retry(key)
    return 'pending'
  }
}
