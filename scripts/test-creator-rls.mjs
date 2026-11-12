import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { PGlite } from '@electric-sql/pglite'
const db = new PGlite()
const id = {
 a:'11111111-1111-4111-8111-111111111111',
 b:'22222222-2222-4222-8222-222222222222',
 mod:'33333333-3333-4333-8333-333333333333',
 draft:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
 pending:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
 published:'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
 rejected:'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
}
let passed=0
async function test(name,fn) {
 try { await fn();console.log('PASS '+name);passed++ }
 catch(error){console.error('FAIL '+name+': '+error.message);throw error}
}
async function as(role,user,sql,args=[],commit=false) {
 await db.exec('BEGIN')
 try {
  await db.exec('SET LOCAL ROLE '+role)
  if(user) await db.query("select set_config('request.jwt.claim.sub',$1,true)",[user])
  const r=await db.query(sql,args)
  await db.exec(commit?'COMMIT':'ROLLBACK')
  return r
 } catch(e) { await db.exec('ROLLBACK');throw e }
}
async function expectDenied(p) { try {await p} catch {return} assert.fail('Operation was unexpectedly allowed') }
try {
 await db.exec(`
 create role anon nologin;
 create role authenticated nologin;
 create role service_role nologin bypassrls;
 create schema auth;
 create table auth.users(id uuid primary key,raw_app_meta_data jsonb default '{}'::jsonb);
 create function auth.uid() returns uuid language sql stable as $uid$
 select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $uid$;
 grant usage on schema public to anon,authenticated,service_role;
 grant usage on schema auth to authenticated,service_role;
 grant execute on function auth.uid() to authenticated;
 `)
 await db.query('insert into auth.users(id) values ($1),($2),($3)',[id.a,id.b,id.mod])
 await db.exec(readFileSync('supabase/migrations/20261112041220_creator_platform_mvp.sql','utf8'))
 await db.query(`
 insert into public.creator_projects(id,author_id,author_name,title,summary,category,external_url,license,status,published_at) values
 ($1,$2,'Autor A','Borrador','','programa','','MIT','draft',null),
 ($3,$2,'Autor A','Pendiente','Una descripcion valida de proyecto pendiente','videojuego','https://drive.google.com/file/d/abc','MIT','pending_review',null),
 ($4,$5,'Autor B','Publicado','Una descripcion valida de proyecto publicado','arte','https://drive.google.com/file/d/xyz','MIT','published',now()),
 ($6,$2,'Autor A','Rechazable','Una descripcion valida para proyecto rechazable','video','https://drive.google.com/file/d/123','MIT','pending_review',null)
 `,[id.draft,id.a,id.pending,id.published,id.b,id.rejected])
 await test('Anon sees published only',async()=>{
  const r=await as('anon',null,'select id from public.creator_projects')
  assert.deepEqual(r.rows.map(x=>x.id),[id.published])
 })
 await test('Owner sees own drafts and public',async()=>{
  assert.equal((await as('authenticated',id.a,'select id from public.creator_projects')).rows.length,4)
 })
 await test('Stranger cannot see owner drafts',async()=>{
  assert.equal((await as('authenticated',id.b,"select id from public.creator_projects where status <> 'published'")).rows.length,0)
 })
 await test('Owner can update own draft',async()=>{
  const r=await as('authenticated',id.a,"update public.creator_projects set summary='Borrador modificado' where id=$1 returning id",[id.draft],true)
  assert.equal(r.rows[0].id,id.draft)
 })
 await test('Pending content cannot be changed by author',async()=>{
  const r=await as('authenticated',id.a,"update public.creator_projects set external_url='https://evil.example/fake' where id=$1 returning id",[id.pending])
  assert.equal(r.rows.length,0)
 })
 await test('Author cannot publish without moderator',async()=>{
  await expectDenied(as('authenticated',id.a,"update public.creator_projects set status='published' where id=$1",[id.draft]))
 })
 await test('Author cannot forge ownership on insert',async()=>{
  await expectDenied(as('authenticated',id.a,"insert into public.creator_projects(author_id,author_name,title,category,status) values ($1,'Spoof','X','programa','draft')",[id.b]))
 })
 await test('Author cannot modify review metadata',async()=>{
  await expectDenied(as('authenticated',id.a,"update public.creator_projects set reviewed_by=$1 where id=$2",[id.mod,id.draft]))
 })
 await test('Reporter may submit own report',async()=>{
  const r=await as('authenticated',id.a,"insert into public.creator_project_reports(project_id,reporter_id,reason) values ($1,$2,'spam') returning id",[id.published,id.a],true)
  assert.equal(r.rows.length,1)
 })
 await test('Reporter cannot forge resolution or other identity',async()=>{
  await expectDenied(as('authenticated',id.a,"insert into public.creator_project_reports(project_id,reporter_id,reason,resolved_at) values ($1,$2,'spam',now())",[id.published,id.a]))
  await expectDenied(as('authenticated',id.a,"insert into public.creator_project_reports(project_id,reporter_id,reason) values ($1,$2,'spam')",[id.published,id.b]))
 })
 await test('Moderation RPC is not callable by ordinary users',async()=>{
  await expectDenied(as('authenticated',id.a,"select public.creator_review_project($1,$2,'approve','')",[id.a,id.pending]))
 })
 await test('Service moderator can atomically approve',async()=>{
  const r=await as('service_role',null,"select public.creator_review_project($1,$2,'approve','') as outcome",[id.mod,id.pending],true)
  assert.equal(r.rows[0].outcome,'published')
  assert.equal((await db.query("select count(*)::int as n from public.creator_moderation_events where project_id=$1",[id.pending])).rows[0].n,1)
 })
 await test('Moderator cannot review own project',async()=>{
  await expectDenied(as('service_role',null,"select public.creator_review_project($1,$2,'reject','A detailed rejection reason')",[id.a,id.rejected]))
 })
 await test('Report removal updates project and event together',async()=>{
  const report=await db.query("select id from public.creator_project_reports where project_id=$1",[id.published])
  const r=await as('service_role',null,"select public.creator_resolve_report($1,$2,'remove','External URL violates safety rules') as outcome",[id.mod,report.rows[0].id],true)
  assert.equal(r.rows[0].outcome,'removed')
  assert.equal((await db.query("select status from public.creator_projects where id=$1",[id.published])).rows[0].status,'rejected')
 })
 await test('Audit persists after deleting rejected project',async()=>{
  await as('service_role',null,"select public.creator_review_project($1,$2,'reject','Incomplete licensing details')",[id.mod,id.rejected],true)
  const r=await as('authenticated',id.a,"delete from public.creator_projects where id=$1 returning id",[id.rejected],true)
  assert.equal(r.rows.length,1)
  assert.equal((await db.query("select count(*)::int as n from public.creator_moderation_events where project_id=$1",[id.rejected])).rows[0].n,1)
 })
 await test('Failed audit insert rolls back approval',async()=>{
  const target='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'
  await db.query("insert into public.creator_projects(id,author_id,author_name,title,summary,category,external_url,license,status) values ($1,$2,'Autor A','Prueba rollback','Descripcion valida para validar transacciones','programa','https://drive.google.com/file/d/rollback','MIT','pending_review')",[target,id.a])
  await db.exec('revoke insert on public.creator_moderation_events from service_role')
  try {
   await expectDenied(as('service_role',null,"select public.creator_review_project($1,$2,'approve','')",[id.mod,target]))
  } finally {
   await db.exec('grant insert on public.creator_moderation_events to service_role')
  }
  const project=await db.query('select status from public.creator_projects where id=$1',[target])
  assert.equal(project.rows[0].status,'pending_review')
  const audit=await db.query('select count(*)::int as n from public.creator_moderation_events where project_id=$1',[target])
  assert.equal(audit.rows[0].n,0)
 })
 console.log('ALL '+passed+' PGlite RLS checks passed')
} finally {await db.close()}
