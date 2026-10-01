import { createClient } from '@supabase/supabase-js'
import { createHash, randomUUID } from 'node:crypto'
import { PaymentError, requireValue } from './domain'
import type { Order, PaymentConfig, Provider, Receipt } from './domain'
import type { OrderStore } from './confirmation'
import type { Message, OutboxStore } from './notifications'

type Row = { id: string; snapshot: Order; provider_order_id: string | null; checkout_url: string | null; state: string }
export class DatabaseStore implements OrderStore, OutboxStore {
  private db
  private leases = new Map<string, string>()
  constructor(private config: PaymentConfig) {
    requireValue(config.databaseUrl && config.databaseKey, 'DATABASE_NOT_CONFIGURED')
    const url = new URL(config.databaseUrl)
    requireValue(url.protocol === 'https:' && url.hostname.endsWith('.supabase.co') && !url.username && !url.password, 'INVALID_DATABASE_URL')
    this.db = createClient(config.databaseUrl, config.databaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
  }
  private check(error: { message: string } | null) {
    if (error) throw new PaymentError(error.message === 'RATE_LIMITED' ? 'RATE_LIMITED' : 'DATABASE_UNAVAILABLE')
  }
  async healthy() {
    const { error } = await this.db.from('digital_orders').select('id', { head: true }).limit(1)
    this.check(error)
  }
  async create(order: Order, requestKey: string, ipHash: string): Promise<{ order: Order; url: string | null }> {
    const { id: _id, createdAt: _created, ...details } = order
    const fingerprint = createHash('sha256').update(JSON.stringify(details)).digest('hex')
    const { data, error } = await this.db.rpc('digital_order_create', { p_snapshot: order, p_request_key: requestKey, p_fingerprint: fingerprint, p_ip_hash: ipHash })
    this.check(error)
    const row = data as Row
    requireValue(row?.snapshot, 'DATABASE_UNAVAILABLE')
    return { order: { ...row.snapshot, ...(row.provider_order_id ? { providerOrderId: row.provider_order_id } : {}) }, url: row.checkout_url }
  }
  async bind(order: Order, id: string, url: string) {
    const { error } = await this.db.rpc('digital_order_bind', { p_id: order.id, p_provider_id: id, p_url: url })
    this.check(error)
  }
  async findByProviderId(provider: Provider, providerOrderId: string): Promise<Order | null> {
    const { data, error } = await this.db.from('digital_orders').select('snapshot,provider_order_id').eq('provider', provider).eq('mode', this.config.mode).eq('provider_order_id', providerOrderId).maybeSingle()
    this.check(error)
    return data ? { ...data.snapshot, providerOrderId: data.provider_order_id } : null
  }
  async markPaidAndEnqueue(order: Order, receipt: Receipt, messages: Message[]): Promise<boolean> {
    const { data, error } = await this.db.rpc('digital_order_paid', { p_id: order.id, p_receipt: receipt, p_messages: messages })
    this.check(error)
    return data === true
  }
  async keys() {
    const { data, error } = await this.db.rpc('digital_outbox_due', { p_mode: this.config.mode })
    this.check(error)
    return (data || []) as string[]
  }
  async claim(key: string) {
    const token = randomUUID()
    const { data, error } = await this.db.rpc('digital_outbox_claim', { p_key: key, p_token: token, p_mode: this.config.mode })
    this.check(error)
    if (!data) return null
    this.leases.set(key, token)
    return { message: data.message as Message, firstAttemptAt: data.first_attempt_at as string }
  }
  private async finish(key: string, state: string, providerId: string | null = null) {
    const { error } = await this.db.rpc('digital_outbox_finish', { p_key: key, p_token: this.leases.get(key), p_state: state, p_provider_id: providerId })
    this.check(error)
    this.leases.delete(key)
  }
  accepted(key: string, id: string) { return this.finish(key, 'accepted', id) }
  retry(key: string) { return this.finish(key, 'pending') }
  review(key: string) { return this.finish(key, 'review') }
}
