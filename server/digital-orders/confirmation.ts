import { identifier, record, requireValue } from './domain'
import type { Order, PaymentConfig, Provider, Receipt } from './domain'
import { MercadoPago, PayPal, verifyMercadoPagoWebhook } from './providers'
import type { Transport } from './providers'
import { paidMessages } from './notifications'
import type { Message } from './notifications'

export interface OrderStore {
  findByProviderId(provider: Provider, providerOrderId: string): Promise<Order | null>
  // MUST be a database transaction: lock the order, bind the stored provider ID,
  // enforce UNIQUE(provider,payment_id), mark paid and enqueue these two stable
  // messages with UNIQUE(key). A duplicate returns false without adding emails.
  markPaidAndEnqueue(order: Order, receipt: Receipt, messages: Message[]): Promise<boolean>
}

export async function confirmMercadoPago(config: PaymentConfig, store: OrderStore, headers: Headers, queryId: string, body: unknown, transport: Transport = fetch): Promise<'ignored' | 'pending' | 'paid' | 'duplicate'> {
  const id = verifyMercadoPagoWebhook(config, headers, queryId, body)
  const order = await store.findByProviderId('mercadopago', id)
  if (!order) return 'ignored'
  const receipt = await new MercadoPago(config, transport).verify(order)
  if (!receipt) return 'pending'
  return await store.markPaidAndEnqueue(order, receipt, paidMessages(order, receipt, config)) ? 'paid' : 'duplicate'
}

export async function confirmPayPal(config: PaymentConfig, store: OrderStore, headers: Headers, body: unknown, transport: Transport = fetch): Promise<'ignored' | 'pending' | 'paid' | 'duplicate'> {
  const paypal = new PayPal(config, transport)
  const event = await paypal.verifyWebhook(headers, body)
  if (event.event_type !== 'CHECKOUT.ORDER.APPROVED' && event.event_type !== 'PAYMENT.CAPTURE.COMPLETED') return 'ignored'
  const resource = record(event.resource)
  const approved = event.event_type === 'CHECKOUT.ORDER.APPROVED'
  const id = approved ? identifier(resource.id) : identifier(record(record(resource.supplementary_data).related_ids).order_id)
  const order = await store.findByProviderId('paypal', id)
  if (!order) return 'ignored'
  const receipt = approved ? await paypal.captureApproved(order) : await paypal.verify(order)
  if (!receipt) return 'pending'
  if (!approved) requireValue(resource.id === receipt.paymentId, 'WEBHOOK_PAYMENT_MISMATCH')
  return await store.markPaidAndEnqueue(order, receipt, paidMessages(order, receipt, config)) ? 'paid' : 'duplicate'
}
