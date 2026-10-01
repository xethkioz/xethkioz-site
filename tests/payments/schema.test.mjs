import { before, after, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { PGlite } from '@electric-sql/pglite'

let db
const hash = 'a'.repeat(64)
before(async () => {
  db = await PGlite.create()
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls; grant usage on schema public to anon,authenticated,service_role;')
  await db.exec(await readFile('supabase/migrations/20261001003210_digital_orders_payments.sql', 'utf8'))
})
after(async () => db?.close())
async function rpc(name, params) {
  return (await db.query(`select public.${name}(${params.map((_, i) => `$${i+1}`).join(',')}) as result`, params)).rows[0].result
}
function snapshot(id=randomUUID()) { return { id, provider:'paypal', mode:'sandbox', productId:'course-1', title:'Curso ficticio', kind:'course', hours:24, currency:'USD', amount:'12.00', email:`${id}@example.test`, whatsapp:'+5491112345678', brief:'', focus:'', notes:'', createdAt:new Date().toISOString() } }
async function saved(s=snapshot()) {
  await rpc('digital_order_create',[s,randomUUID(),hash,randomUUID().replaceAll('-','').repeat(2)])
  await rpc('digital_order_bind',[s.id,`PP-${s.id}`,'https://www.sandbox.paypal.com/checkoutnow?token=TEST'])
  const receipt={orderId:s.id,providerOrderId:`PP-${s.id}`,provider:'paypal',paymentId:`CAP-${s.id}`,currency:'USD',amount:'12.00',verifiedAt:new Date().toISOString()}
  const messages=[['owner','aidss1991@gmail.com'],['buyer',s.email]].map(([who,to])=>({key:`digital-order/${s.id}/${who}-paid-v1`,from:'orders@example.test',to,replyTo:'aidss1991@gmail.com',subject:'Test',text:'Test'}))
  return {s,receipt,messages}
}
test('Database denies browser roles every order/outbox table and payment RPC',async()=>{
  for(const role of ['anon','authenticated']) {
    await db.exec(`set role ${role}`)
    try {
      await assert.rejects(db.query('select * from public.digital_orders'), /permission denied/)
      await assert.rejects(db.query('select * from public.digital_order_outbox'), /permission denied/)
      await assert.rejects(rpc('digital_order_create',[snapshot(),randomUUID(),hash,hash]), /permission denied/)
      await assert.rejects(rpc('digital_outbox_due',['sandbox']), /permission denied/)
    } finally {await db.exec('reset role')}
  }
  const tables=await db.query("select relrowsecurity from pg_class where relname in ('digital_orders','digital_order_outbox')")
  assert.ok(tables.rows.every(row=>row.relrowsecurity))
})
test('Database creation reuses the request ID and rejects a changed purchase fingerprint',async()=>{
  const s=snapshot(),key=randomUUID()
  const first=await rpc('digital_order_create',[s,key,hash,hash])
  const second=await rpc('digital_order_create',[{...s,id:randomUUID()},key,hash,hash])
  assert.equal(first.id,second.id)
  await assert.rejects(rpc('digital_order_create',[s,key,'b'.repeat(64),hash]), /REQUEST_KEY_REUSED/)
})
test('Marking paid and enqueueing both recipients is atomic and deduplicated',async()=>{
  const {s,receipt,messages}=await saved()
  await db.exec('set role service_role')
  try {
    assert.equal(await rpc('digital_order_paid',[s.id,receipt,messages]),true)
    assert.equal(await rpc('digital_order_paid',[s.id,receipt,messages]),false)
    assert.equal((await db.query('select count(*)::integer as n from public.digital_order_outbox where order_id=$1',[s.id])).rows[0].n,2)
    await assert.rejects(rpc('digital_order_paid',[s.id,{...receipt,paymentId:'OTHER'},messages]), /RECEIPT_MISMATCH/)
  } finally {await db.exec('reset role')}
})
test('Invalid receipt/recipient rolls back the paid state and every email',async()=>{
  const {s,receipt,messages}=await saved()
  await assert.rejects(rpc('digital_order_paid',[s.id,{...receipt,amount:'1.00'},messages]), /RECEIPT_MISMATCH/)
  await assert.rejects(rpc('digital_order_paid',[s.id,receipt,[messages[0],{...messages[1],to:'other@example.test'}]]), /INVALID_MESSAGES/)
  assert.equal((await db.query('select state from public.digital_orders where id=$1',[s.id])).rows[0].state,'checkout')
  assert.equal((await db.query('select count(*)::integer as n from public.digital_order_outbox where order_id=$1',[s.id])).rows[0].n,0)
})
test('One capture cannot pay two different orders',async()=>{
  const one=await saved(),two=await saved()
  await rpc('digital_order_paid',[one.s.id,one.receipt,one.messages])
  await assert.rejects(rpc('digital_order_paid',[two.s.id,{...two.receipt,paymentId:one.receipt.paymentId},two.messages]), /duplicate key/)
  assert.equal((await db.query('select state from public.digital_orders where id=$1',[two.s.id])).rows[0].state,'checkout')
  assert.equal((await db.query('select count(*)::integer as n from public.digital_order_outbox where order_id=$1',[two.s.id])).rows[0].n,0)
})
test('Outbox leases isolate workers, recover crashes and prevent stale acceptance',async()=>{
  const {s,receipt,messages}=await saved()
  await rpc('digital_order_paid',[s.id,receipt,messages])
  const key=messages[0].key,first=randomUUID(),second=randomUUID()
  const job=await rpc('digital_outbox_claim',[key,first,'sandbox'])
  assert.equal(job.message.to,'aidss1991@gmail.com')
  assert.equal(await rpc('digital_outbox_claim',[key,second,'sandbox']),null)
  await db.query("update public.digital_order_outbox set claimed_at=now()-interval '5 minutes' where key=$1",[key])
  const recovered=await rpc('digital_outbox_claim',[key,second,'sandbox'])
  assert.equal(recovered.first_attempt_at,job.first_attempt_at)
  await assert.rejects(rpc('digital_outbox_finish',[key,first,'accepted','EMAIL-OLD']),/STALE_CLAIM/)
  await rpc('digital_outbox_finish',[key,second,'accepted','EMAIL-TEST'])
  assert.equal(await rpc('digital_outbox_claim',[key,randomUUID(),'sandbox']),null)
})
test('Sandbox worker cannot claim a live message and retry delay remains enforced',async()=>{
  const {s,receipt,messages}=await saved(snapshot())
  await rpc('digital_order_paid',[s.id,receipt,messages])
  const key=messages[0].key,token=randomUUID()
  assert.equal(await rpc('digital_outbox_claim',[key,token,'live']),null)
  await rpc('digital_outbox_claim',[key,token,'sandbox'])
  await rpc('digital_outbox_finish',[key,token,'pending',null])
  assert.equal(await rpc('digital_outbox_claim',[key,randomUUID(),'sandbox']),null)
})
test('Rate limiting is persistent across requests, while exact retries stay idempotent',async()=>{
  const ip='c'.repeat(64)
  let key='',s
  for(let i=0;i<12;i++){s=snapshot();key=randomUUID();await rpc('digital_order_create',[s,key,hash,ip])}
  await assert.rejects(rpc('digital_order_create',[snapshot(),randomUUID(),hash,ip]), /RATE_LIMITED/)
  assert.equal((await rpc('digital_order_create',[s,key,hash,ip])).id,s.id)
})
