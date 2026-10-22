import fs from 'node:fs'
import assert from 'node:assert/strict'

const read = path => fs.readFileSync(path, 'utf8')
const vercel = JSON.parse(read('vercel.json'))
const app = read('src/App.tsx')
const frontend = read('src/creator/CreatorPlatform.tsx')
const edge = read('supabase/functions/creator-moderation/index.ts')
const sql = read('supabase/migrations/20261021111400_creator_platform_mvp.sql')
const routes = new Map(vercel.rewrites.map(r => [r.source, r.destination]))
const paths = ['/explorar','/publicar','/publicar/:id','/mis-proyectos','/proyecto/:id']
for (const path of paths.flatMap(p => [p,'/en'+p])) {
  assert.ok(routes.has(path), 'Vercel direct access unavailable: '+path)
  assert.ok(app.includes('path="'+path+'"'), 'React route missing: '+path)
}
for(const path of ['/green-node','/science']) assert.ok(app.includes('path="'+path+'"'), 'Section removed: '+path)
assert.ok(fs.existsSync('public/mascotas/index.html'), 'Mascotas removed')
assert.ok(frontend.includes('creator_project_reports'), 'Report button missing')
assert.ok(frontend.includes("status === 'draft'") && frontend.includes("status === 'pending_review'"), 'Draft/pending forms not guarded')
assert.ok(app.includes('creator-moderation') && read('src/cms/layout/CmsSidebar.tsx').includes('creator-moderation'), 'CMS moderation not connected')
assert.ok(edge.includes('admin.auth.getUser(token)') && edge.includes('caller.app_metadata?.role'), 'Untrusted moderator roles')
assert.ok(edge.includes('SELF_REVIEW_DENIED') && edge.includes('safeExternalUrl'), 'Moderator safety checks missing')
assert.ok(read('supabase/config.toml').includes('[functions.creator-moderation]\nverify_jwt = true'), 'JWT verification not enabled')
assert.ok(sql.includes('creator_projects_owner_insert') && sql.includes('creator_projects_owner_update'), 'RLS missing')
assert.ok(sql.includes('revoke all on public.creator_projects from anon, authenticated') && sql.includes('revoke all on public.creator_project_reports from anon, authenticated'), 'Default privileges were not revoked')
assert.ok(sql.includes('grant update (author_name') && !sql.includes('grant insert, update, delete on public.creator_projects'), 'Moderation metadata writable by users')
assert.ok(sql.includes('creator_moderation_events') && sql.includes('creator_publish_timestamp'), 'Audit/timestamps missing')
assert.ok(!frontend.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Browser contains server-only key')
console.log('PASS creator network: routes, preserved modules, RLS and moderation contracts.')
