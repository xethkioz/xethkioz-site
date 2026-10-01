import test from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { createOrder, money, readConfig, ORDER_INBOX } from '../../server/digital-orders/domain'
import type { Order, PaymentConfig, Receipt } from '../../server/digital-orders/domain'
import { MercadoPago, PayPal, verifyMercadoPagoWebhook, checkoutUrl } from '../../server/digital-orders/providers'
import type { Transport } from '../../server/digital-orders/providers'
import { confirmMercadoPago, confirmPayPal } from '../../server/digital-orders/confirmation'
import type { OrderStore } from '../../server/digital-orders/confirmation'
import { paidMessages, deliverMessage } from '../../server/digital-orders/notifications'
import type { Message, OutboxStore } from '../../server/digital-orders/notifications'
import { createHandler } from '../../server/digital-orders/handler'
import type { StoreContract } from '../../server/digital-orders/handler'

// Tests must never use a provider account or email service.
globalThis.fetch = async () => { throw new Error('Real network requests are forbidden in payment tests') }
const config: PaymentConfig = {
  mode: 'sandbox', returnUrl: 'https://preview.example.com/digital/cursos',
  arsCourse: '10000.00', arsProject: '35000.00', // Fictional test prices only.
  mpAccessToken: 'test-mp-token', mpWebhookSecret: 'test-webhook-secret', mpSellerId: '123456',
  paypalClientId: 'test-client', paypalClientSecret: 'test-secret', paypalWebhookId: 'WH-TEST',
  paypalMerchantId: 'TESTSELLER', paypalAccountEmail: 'merchant@example.test',
  resendApiKey: 'test-email-key', emailFrom: 'orders@example.test',
  workerSecret: 'test-worker-secret-that-is-long-enough',
}
const input = { productId: 'course-1', provider: 'paypal', email: 'buyer@example.test', whatsapp: '+54 9 11 1234 5678', consent: true }
function order(provider: 'mercadopago' | 'paypal' = 'paypal', productId = 'course-1'): Order {
  return { ...createOrder({ ...input, provider, productId, brief: 'Organizar un pequeño comercio.', focus: 'Ventas', notes: 'Quiero aprender.' }, config), providerOrderId: provider === 'paypal' ? 'PP-TEST-ORDER' : 'ORDTEST001' }
}
function mpResult(o: Order, changes: Record<string, unknown> = {}) {
  return {
    id: o.providerOrderId, user_id: config.mpSellerId, external_reference: o.id, currency: 'ARS',
    total_amount: o.amount, total_paid_amount: o.amount, status: 'processed', status_detail: 'accredited',
    transactions: { payments: [{ id: 'PAYTEST001', amount: o.amount, paid_amount: o.amount, status: 'processed', status_detail: 'accredited' }] },
    ...changes,
  }
}
function ppResult(o: Order, status = 'COMPLETED') {
  return {
    id: o.providerOrderId, intent: 'CAPTURE', status,
    purchase_units: [{ reference_id: o.id, custom_id: o.id, amount: { currency_code: 'USD', value: o.amount },
      payee: { merchant_id: config.paypalMerchantId, email_address: config.paypalAccountEmail },
      payments: { captures: [{ id: 'CAPTURE-TEST', status: 'COMPLETED', final_capture: true, amount: { currency_code: 'USD', value: o.amount } }] },
    }],
  }
}
function json(value: unknown, status = 200) { return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } }) }
function ppTransport(responses: unknown[], calls: { url: string; init: RequestInit }[] = []): Transport {
  return async (url, init) => {
    calls.push({ url, init })
    assert.ok(url.startsWith('https://api-m.sandbox.paypal.com/'))
    assert.equal(init.redirect, 'error')
    if (url.endsWith('/v1/oauth2/token')) return json({ access_token: 'test-access' })
    assert.ok(responses.length, `Unexpected request: ${url}`)
    return json(responses.shift())
  }
}
function mpWebhook(o: Order) {
  const ts = '1790810000000', requestId = 'req-test'
  const digest = createHmac('sha256', config.mpWebhookSecret).update(`id:${o.providerOrderId!.toLowerCase()};request-id:${requestId};ts:${ts};`).digest('hex')
  return { headers: new Headers({ 'x-signature': `ts=${ts},v1=${digest}`, 'x-request-id': requestId }),
    body: { type: 'order', user_id: config.mpSellerId, live_mode: false, data: { id: o.providerOrderId } } }
}
const ppHeaders = () => new Headers({
  'paypal-auth-algo': 'SHA256withRSA', 'paypal-cert-url': 'https://api.paypal.com/v1/notifications/certs/TEST',
  'paypal-transmission-id': 'TRANS-TEST', 'paypal-transmission-sig': 'test-signature', 'paypal-transmission-time': '2026-10-01T00:00:00Z',
})
function memoryStore(o: Order): OrderStore & { messages: Message[]; paid: Receipt[] } {
  return {
    messages: [], paid: [],
    async findByProviderId(provider, id) { return o.provider === provider && o.providerOrderId === id ? o : null },
    async markPaidAndEnqueue(saved, receipt, messages) {
      assert.equal(saved.id, o.id)
      if (this.paid.length) return false
      this.paid.push(receipt); this.messages.push(...messages); return true
    },
  }
}

test('Payment configuration is disabled by default and cannot silently activate live charges', () => {
  assert.equal(readConfig({}), null)
  assert.throws(() => readConfig({ DIGITAL_PAYMENTS_ENABLED: 'true' }), /CONFIG_MODE_REQUIRED/)
  assert.throws(() => readConfig({ DIGITAL_PAYMENTS_ENABLED: 'true', DIGITAL_PAYMENTS_MODE: 'live', VERCEL_ENV: 'preview' }), /LIVE_REQUIRES_PRODUCTION/)
  assert.throws(() => readConfig({ DIGITAL_PAYMENTS_ENABLED: 'true', DIGITAL_PAYMENTS_MODE: 'sandbox', VERCEL_ENV: 'production' }), /SANDBOX_REQUIRES_PREVIEW/)
})
test('Live configuration requires the agreed ARS 1900 conversion and per-item prices', () => {
  const env = {
    DIGITAL_PAYMENTS_ENABLED: 'true', DIGITAL_PAYMENTS_MODE: 'live', VERCEL_ENV: 'production',
    DIGITAL_PAYMENTS_RETURN_URL: 'https://www.xethkioz.com.ar/digital/cursos',
    DIGITAL_ORDERS_EMAIL_FROM: 'orders@example.test', DIGITAL_COURSE_PRICE_ARS: '22800', DIGITAL_PROJECT_PRICE_ARS: '66500',
    MERCADOPAGO_ACCESS_TOKEN: 'fictitious', MERCADOPAGO_WEBHOOK_SECRET: 'fictitious', MERCADOPAGO_SELLER_ID: '123456',
    PAYPAL_CLIENT_ID: 'fictitious', PAYPAL_CLIENT_SECRET: 'fictitious', PAYPAL_WEBHOOK_ID: 'WH-TEST', PAYPAL_MERCHANT_ID: 'TESTSELLER',
    RESEND_API_KEY: 'fictitious', SUPABASE_URL: 'https://test.supabase.co', DIGITAL_ORDERS_SUPABASE_KEY: 'fictitious',
    DIGITAL_ORDERS_WORKER_SECRET: 'fictitious-worker-secret-long-enough',
  }
  const live = readConfig(env)!
  assert.equal(createOrder({ ...input, provider: 'mercadopago' }, live).amount, '22800.00')
  assert.equal(createOrder({ ...input, provider: 'mercadopago', productId: 'project-1' }, live).amount, '66500.00')
  assert.throws(() => readConfig({ ...env, DIGITAL_COURSE_PRICE_ARS: '10000' }), /CONFIG_PRICE_MISMATCH/)
  assert.throws(() => readConfig({ ...env, DIGITAL_PROJECT_PRICE_ARS: '35000' }), /CONFIG_PRICE_MISMATCH/)
})
test('Amount handling rejects zero, negatives, exponents, excess precision and invalid prices', () => {
  assert.equal(money('15'), '15.00'); assert.equal(money('50.1'), '50.10')
  for (const value of ['0', '-10', '1e3', '15.999', '01.00', 'NaN', 15, undefined]) assert.throws(() => money(value), /INVALID_AMOUNT/)
  assert.throws(() => createOrder({ ...input, provider: 'mercadopago' }, { ...config, arsCourse: '' }), /INVALID_AMOUNT/)
})
test('Server determines a per-product USD/ARS price and rejects client price overrides', () => {
  assert.equal(order().amount, '12.00'); assert.equal(order('paypal', 'project-1').amount, '35.00')
  assert.equal(order('mercadopago').amount, '10000.00'); assert.equal(order('mercadopago', 'project-1').amount, '35000.00')
  assert.throws(() => createOrder({ ...input, amount: '0.01' }, config), /INVALID_REQUEST/)
  assert.throws(() => createOrder({ ...input, productId: 'toString' }, config), /INVALID_PRODUCT/)
})
test('Contact and custom project validation do not carry custom fields into a course', () => {
  for (const changes of [{ consent: false }, { email: 'buyer@example.test\r\nBcc: attacker@example.test' }, { whatsapp: '+12345' }]) assert.throws(() => createOrder({ ...input, ...changes }, config))
  assert.throws(() => createOrder({ ...input, productId: 'project-2' }, config), /INVALID_REQUEST/)
  const custom = order('paypal', 'project-2')
  assert.equal(custom.focus, 'Ventas'); assert.ok(custom.brief.length > 10)
  assert.equal(order().brief, ''); assert.equal(order().focus, '')
})
test('Only exact HTTPS provider hosts are accepted as checkout destinations', () => {
  for (const url of ['https://www.paypal.com.evil.test/checkout', 'https://www.paypal.com@evil.test/checkout', 'http://www.paypal.com/checkout', 'javascript:alert(1)', 'https://www.paypal.com:8443/checkout']) assert.throws(() => checkoutUrl(url, ['www.paypal.com']), /INVALID_CHECKOUT_URL/)
})
test('Mercado Pago creation sends the fixed server ARS price, item and durable idempotency key', async () => {
  const o = order('mercadopago')
  let key = ''
  const transport: Transport = async (url, init) => {
    assert.equal(url, 'https://api.mercadopago.com/v1/orders'); assert.equal(init.method, 'POST')
    assert.equal(init.redirect, 'error')
    key = new Headers(init.headers).get('x-idempotency-key')!
    const body = JSON.parse(init.body as string)
    assert.equal(body.total_amount, '10000.00'); assert.equal(body.external_reference, o.id)
    assert.equal(body.items[0].quantity, 1); assert.equal(body.payer.email, input.email)
    return json(mpResult(o, { checkout_url: 'https://www.mercadopago.com.ar/checkout/v1/redirect?order_id=ORDTEST001' }), 201)
  }
  const mp = new MercadoPago(config, transport)
  assert.equal((await mp.create(o)).id, o.providerOrderId)
  await mp.create(o); assert.equal(key, o.id)
})
test('Mercado Pago requires a signature for the query ID, same JSON ID and expected account/mode', () => {
  const o = order('mercadopago'), { headers, body } = mpWebhook(o)
  assert.equal(verifyMercadoPagoWebhook(config, headers, o.providerOrderId!, body), o.providerOrderId)
  assert.throws(() => verifyMercadoPagoWebhook(config, headers, 'ORDOTHER', body), /INVALID_WEBHOOK/)
  assert.throws(() => verifyMercadoPagoWebhook(config, headers, o.providerOrderId!, { ...body, live_mode: true }), /WEBHOOK_ACCOUNT_MISMATCH/)
  headers.set('x-request-id', 'tampered')
  assert.throws(() => verifyMercadoPagoWebhook(config, headers, o.providerOrderId!, body), /INVALID_SIGNATURE/)
  assert.throws(() => verifyMercadoPagoWebhook(config, new Headers(), o.providerOrderId!, body), /INVALID_SIGNATURE/)
})
test('Mercado Pago rechecks amount, currency, order reference and seller in its API', async () => {
  const o = order('mercadopago')
  for (const changes of [{ user_id: 'OTHERMERCHANT' }, { external_reference: 'other' }, { currency: 'USD' }, { total_amount: '1.00' }, { total_paid_amount: '1.00' }, { id: 'ORDOTHER' }]) {
    await assert.rejects(new MercadoPago(config, async () => json(mpResult(o, changes))).verify(o))
  }
  const verified = await new MercadoPago(config, async () => json(mpResult(o))).verify(o)
  assert.equal(verified?.paymentId, 'PAYTEST001')
})
test('Pending, rejected, refunded, partial or disputed Mercado Pago orders do not mark a sale paid', async () => {
  const o = order('mercadopago')
  for (const status of ['created', 'processing', 'failed', 'refunded', 'cancelled']) assert.equal(await new MercadoPago(config, async () => json(mpResult(o, { status }))).verify(o), null)
  assert.equal(await new MercadoPago(config, async () => json(mpResult(o, { status_detail: 'partially_refunded' }))).verify(o), null)
  const transactions = mpResult(o).transactions
  assert.equal(await new MercadoPago(config, async () => json(mpResult(o, { transactions: { ...transactions, chargebacks: [{ id: 'CBKTEST' }] } }))).verify(o), null)
  await assert.rejects(new MercadoPago(config, async () => json(mpResult(o, { transactions: { payments: [{ ...transactions.payments[0], paid_amount: '1.00' }] } }))).verify(o), /AMOUNT_MISMATCH/)
})
test('Forged approved webhook body cannot override the fetched pending Mercado Pago state', async () => {
  const o = order('mercadopago'), store = memoryStore(o), { headers, body } = mpWebhook(o)
  const result = await confirmMercadoPago(config, store, headers, o.providerOrderId!, { ...body, status: 'approved' }, async () => json(mpResult(o, { status: 'created' })))
  assert.equal(result, 'pending'); assert.equal(store.paid.length, 0); assert.equal(store.messages.length, 0)
})
test('Duplicate Mercado Pago confirmations enqueue one owner/buyer pair', async () => {
  const o = order('mercadopago', 'project-2'), store = memoryStore(o), { headers, body } = mpWebhook(o)
  const transport: Transport = async () => json(mpResult(o))
  assert.equal(await confirmMercadoPago(config, store, headers, o.providerOrderId!, body, transport), 'paid')
  assert.equal(await confirmMercadoPago(config, store, headers, o.providerOrderId!, body, transport), 'duplicate')
  assert.equal(store.messages.length, 2); assert.equal(store.messages[0].to, ORDER_INBOX)
  for (const value of [o.brief, o.focus, o.email, o.whatsapp, '48 horas', 'PAYTEST001']) assert.ok(store.messages[0].text.includes(value))
  assert.equal(store.messages[1].replyTo, ORDER_INBOX)
})
test('PayPal creation requests USD per item, intended merchant, no shipping and a stable key', async () => {
  const o = order(), calls: { url: string; init: RequestInit }[] = []
  const pp = new PayPal(config, ppTransport([{ id: o.providerOrderId, status: 'PAYER_ACTION_REQUIRED', links: [{ rel: 'payer-action', href: 'https://www.sandbox.paypal.com/checkoutnow?token=PP-TEST-ORDER' }] }], calls))
  assert.equal((await pp.create(o)).id, o.providerOrderId)
  const call = calls.at(-1)!, body = JSON.parse(call.init.body as string)
  assert.equal(new Headers(call.init.headers).get('paypal-request-id'), o.id)
  assert.equal(body.purchase_units[0].amount.value, '12.00'); assert.equal(body.purchase_units[0].amount.currency_code, 'USD')
  assert.equal(body.purchase_units[0].payee.merchant_id, config.paypalMerchantId)
  assert.equal(body.payment_source.paypal.experience_context.shipping_preference, 'NO_SHIPPING')
})
test('PayPal rejects mismatched merchant, account email, reference, currency and capture amount', async () => {
  const o = order()
  for (const field of ['merchant', 'email', 'reference', 'currency', 'captureAmount', 'providerId']) {
    const result = ppResult(o), unit = result.purchase_units[0]
    if (field === 'merchant') unit.payee.merchant_id = 'OTHER'
    if (field === 'email') unit.payee.email_address = 'other@example.test'
    if (field === 'reference') unit.custom_id = 'other'
    if (field === 'currency') unit.amount.currency_code = 'ARS'
    if (field === 'captureAmount') unit.payments.captures[0].amount.value = '1.00'
    if (field === 'providerId') result.id = 'OTHER'
    await assert.rejects(new PayPal(config, ppTransport([result])).verify(o))
  }
  assert.equal((await new PayPal(config, ppTransport([ppResult(o)])).verify(o))?.paymentId, 'CAPTURE-TEST')
})
test('PayPal approved or pending orders/captures are not payment receipts', async () => {
  const o = order()
  for (const status of ['CREATED', 'APPROVED', 'PAYER_ACTION_REQUIRED']) assert.equal(await new PayPal(config, ppTransport([ppResult(o, status)])).verify(o), null)
  const result = ppResult(o); result.purchase_units[0].payments.captures[0].status = 'PENDING'
  assert.equal(await new PayPal(config, ppTransport([result])).verify(o), null)
})
test('PayPal captures only after provider-confirmed approval, with a distinct stable key under 38 chars', async () => {
  const o = order(), calls: { url: string; init: RequestInit }[] = []
  const responses = [ppResult(o, 'APPROVED'), {}, ppResult(o)]
  assert.equal((await new PayPal(config, ppTransport(responses, calls)).captureApproved(o))?.paymentId, 'CAPTURE-TEST')
  const capture = calls.find(call => call.url.endsWith('/capture'))!
  const key = new Headers(capture.init.headers).get('paypal-request-id')!
  assert.equal(key, `cap-${o.id.replaceAll('-', '')}`); assert.ok(key.length <= 38); assert.notEqual(key, o.id)
  await assert.rejects(new PayPal(config, ppTransport([ppResult(o, 'CREATED')])).captureApproved(o), /BUYER_APPROVAL_REQUIRED/)
})
test('Invalid PayPal webhook signature never reads or updates an order', async () => {
  const o = order(), store = memoryStore(o)
  const event = { id: 'EVENT-TEST', event_type: 'CHECKOUT.ORDER.APPROVED', resource: { id: o.providerOrderId } }
  await assert.rejects(confirmPayPal(config, store, ppHeaders(), event, ppTransport([{ verification_status: 'FAILURE' }])), /INVALID_SIGNATURE/)
  assert.equal(store.paid.length, 0); assert.equal(store.messages.length, 0)
})
test('PayPal completed webhook must match the capture retrieved from the stored order', async () => {
  const o = order(), store = memoryStore(o)
  const event = { id: 'EVENT-TEST', event_type: 'PAYMENT.CAPTURE.COMPLETED', resource: { id: 'OTHER-CAPTURE', supplementary_data: { related_ids: { order_id: o.providerOrderId } } } }
  await assert.rejects(confirmPayPal(config, store, ppHeaders(), event, ppTransport([{ verification_status: 'SUCCESS' }, ppResult(o)])), /WEBHOOK_PAYMENT_MISMATCH/)
  assert.equal(store.messages.length, 0)
  event.resource.id = 'CAPTURE-TEST'
  assert.equal(await confirmPayPal(config, store, ppHeaders(), event, ppTransport([{ verification_status: 'SUCCESS' }, ppResult(o)])), 'paid')
  assert.equal(store.messages[0].to, 'aidss1991@gmail.com')
})
test('Payment evidence must match the order before notification content is built', () => {
  const o = order()
  const proof: Receipt = { orderId: o.id, providerOrderId: o.providerOrderId!, paymentId: 'CAPTURE-TEST', provider: o.provider, currency: o.currency, amount: o.amount, verifiedAt: new Date().toISOString() }
  assert.throws(() => paidMessages(o, { ...proof, amount: '1.00' }, config), /RECEIPT_MISMATCH/)
  assert.ok(paidMessages(o, proof, config)[1].text.includes('24 horas'))
})
test('Email failure stays pending; retry reuses the same key and records acceptance only once', async () => {
  const o = order(), proof: Receipt = { orderId: o.id, providerOrderId: o.providerOrderId!, paymentId: 'CAPTURE-TEST', provider: o.provider, currency: o.currency, amount: o.amount, verifiedAt: new Date().toISOString() }
  const message = paidMessages(o, proof, config)[0]
  let state = 'pending', accepted = 0, attempts = 0
  const firstAttemptAt = new Date().toISOString()
  const store: OutboxStore = {
    async claim() { if (state !== 'pending') return null; state = 'claimed'; return { message, firstAttemptAt } },
    async accepted(_key, id) { assert.equal(id, 'EMAIL-TEST'); state = 'accepted'; accepted++ },
    async retry() { state = 'pending' }, async review() { state = 'review' },
  }
  const transport: Transport = async (url, init) => {
    assert.equal(url, 'https://api.resend.com/emails'); assert.equal(new Headers(init.headers).get('idempotency-key'), message.key)
    const body = JSON.parse(init.body as string); assert.deepEqual(body.to, ['aidss1991@gmail.com'])
    assert.equal(body.reply_to, input.email)
    attempts++; return attempts === 1 ? json({ error: 'unavailable' }, 503) : json({ id: 'EMAIL-TEST' })
  }
  assert.equal(await deliverMessage(message.key, store, config, transport), 'pending'); assert.equal(accepted, 0)
  assert.equal(await deliverMessage(message.key, store, config, transport), 'accepted'); assert.equal(accepted, 1)
  assert.equal(await deliverMessage(message.key, store, config, transport), 'skipped'); assert.equal(attempts, 2)
})
test('Ambiguous email retries beyond provider idempotency window require manual review', async () => {
  let reviewed = false
  const store: OutboxStore = {
    async claim() { return { message: {} as Message, firstAttemptAt: '2026-09-28T00:00:00Z' } },
    async accepted() { assert.fail('must not accept') }, async retry() { assert.fail('must not retry') }, async review() { reviewed = true },
  }
  assert.equal(await deliverMessage('old-job', store, config, undefined, Date.parse('2026-10-01T00:00:00Z')), 'review')
  assert.equal(reviewed, true)
})

function apiResponse() {
  return { code:0, body:undefined as any, headers:{} as Record<string,string>,
    setHeader(key:string,value:string) {this.headers[key]=value},
    status(code:number) {this.code=code;return this}, json(body:unknown) {this.body=body;return this},
  }
}
function apiStore(o:Order):StoreContract {
  return { ...memoryStore(o), async healthy(){}, async create(proposed){return {order:proposed,url:null}}, async bind(){},
    async keys(){return []}, async claim(){return null}, async accepted(){}, async retry(){},async review(){},
  }
}
test('Disabled public config does not open the database or expose credentials',async()=>{
  const handler=createHandler({config:()=>null,store:()=>{assert.fail('No database while disabled')},transport:globalThis.fetch})
  const res=apiResponse();await handler({method:'GET',headers:{},query:{}},res)
  assert.equal(res.code,200);assert.equal(res.body.enabled,false)
  const checkout=apiResponse();await handler({method:'POST',headers:{},query:{action:'checkout'}},checkout)
  assert.equal(checkout.code,503)
})
test('Checkout API rejects foreign origins, price tampering, missing keys and oversized bodies',async()=>{
  const store=apiStore(order()),handler=createHandler({config:()=>config,store:()=>store,transport:globalThis.fetch})
  const base={method:'POST',query:{action:'checkout'},headers:{origin:'https://preview.example.com','content-type':'application/json','idempotency-key':crypto.randomUUID()},body:input}
  for(const req of [
    {...base,headers:{...base.headers,origin:'https://evil.test'}},
    {...base,headers:{...base.headers,'idempotency-key':''}},
    {...base,body:{...input,amount:'0.01'}},
    {...base,headers:{...base.headers,'content-length':'20000'}},
  ]) {const res=apiResponse();await handler(req,res);assert.ok([400,403,413].includes(res.code))}
})
test('Checkout API saves server-priced order before provider creation and binds before redirect',async()=>{
  const actions:string[]=[];let saved:Order
  const store=apiStore(order('mercadopago'))
  store.create=async proposed=>{actions.push('save');saved=proposed;return {order:proposed,url:null}}
  store.bind=async()=>{actions.push('bind')}
  const transport:Transport=async()=>{actions.push('provider');return json(mpResult({...saved,providerOrderId:'ORDTEST001'},{checkout_url:'https://www.mercadopago.com.ar/checkout/v1/redirect?order_id=ORDTEST001'}))}
  const handler=createHandler({config:()=>config,store:()=>store,transport})
  const res=apiResponse();await handler({method:'POST',query:{action:'checkout'},headers:{origin:'https://preview.example.com','content-type':'application/json','idempotency-key':crypto.randomUUID()},body:{...input,provider:'mercadopago'}},res)
  assert.equal(res.code,201);assert.deepEqual(actions,['save','provider','bind'])
  assert.equal(saved!.amount,'10000.00');assert.ok(res.body.checkoutUrl)
  assert.ok(!JSON.stringify(res.body).includes(input.email));assert.ok(!JSON.stringify(res.body).includes(input.whatsapp))
})
test('Worker API rejects missing authorization and every untrusted caller',async()=>{
  let invoked=false
  const store=apiStore(order());store.keys=async()=>{invoked=true;return []}
  const handler=createHandler({config:()=>config,store:()=>store,transport:globalThis.fetch})
  const res=apiResponse();await handler({method:'GET',query:{action:'worker'},headers:{authorization:'Bearer wrong'}},res)
  assert.equal(res.code,403);assert.equal(invoked,false)
  const accepted=apiResponse();await handler({method:'GET',query:{action:'worker'},headers:{authorization:`Bearer ${config.workerSecret}`}},accepted)
  assert.equal(accepted.code,200);assert.equal(invoked,true)
})
