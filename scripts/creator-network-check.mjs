import fs from 'node:fs'
import assert from 'node:assert/strict'

const read = path => fs.readFileSync(path, 'utf8')
const vercel = JSON.parse(read('vercel.json'))
const app = read('src/App.tsx')
const frontend = read('src/creator/CreatorPlatform.tsx')
const edge = read('supabase/functions/creator-moderation/index.ts')
const sql = read('supabase/migrations/20261112041220_creator_platform_mvp.sql')
const routes = new Map(vercel.rewrites.map(r => [r.source, r.destination]))
const paths = ['/explorar','/publicar','/publicar/:id','/mis-proyectos','/proyecto/:id','/creador/:id']
for (const path of paths.flatMap(p => [p,'/en'+p])) {
  assert.ok(routes.has(path), 'Vercel direct access unavailable: '+path)
  assert.ok(app.includes('path="'+path+'"'), 'React route missing: '+path)
}
for(const path of ['/green-node','/science']) assert.ok(app.includes('path="'+path+'"'), 'Section removed: '+path)
assert.ok(fs.existsSync('public/mascotas/index.html'), 'Mascotas removed')
assert.ok(frontend.includes('creator_project_reports'), 'Report button missing')
assert.ok(frontend.includes('reason: reportReason') && frontend.includes('creator-report-reason'), 'Report reasons must be selectable')
assert.ok(app.includes("basePath.startsWith('/creador/')") && !app.includes('isHomeRoute || isThemedPortalRoute'), 'Creator profile must not inherit the old global navigation or fantasy shell')
assert.ok(app.includes("'/account'].includes(basePath)") && read('src/pages/AccountAccessStable.tsx').includes('<PlatformFrame>') && read('src/pages/AccountAccessStable.tsx').includes('url="/account" noIndex'), 'Creator account must use a private, standalone luminous layout')
assert.ok(frontend.includes('CreatorPublicProfile') && frontend.includes('noIndex={!visibleProject}') && frontend.includes('get(\'q\')'), 'Public creator profiles, search query or private metadata missing')
assert.ok(frontend.includes("const visibleProject = project && project.id === id ? project : null") && frontend.includes("select(PUBLISHED_COLUMNS).eq('id', id!).eq('status', 'published')") && frontend.includes("if (!visibleProject) return"), 'Project detail must never display or report a stale project when navigating')
assert.ok(frontend.includes("error && !items.length") && frontend.includes("Reintentar cargar más") && frontend.includes("generation.current === currentGeneration"), 'A paginated catalog error must preserve loaded projects and permit retry')
assert.ok(frontend.includes("if (authorId) query = query.eq('author_id', authorId)") && frontend.includes("usePublishedProjects('todos', '', 24, validId ? id : undefined, validId)") && !frontend.includes(".limit(48)"), 'Public creator profiles must paginate only their own approved content')
assert.ok(read('index.html').includes('Creá, compartí y descubrí'), 'Home must advertise the creator network in crawl metadata')
assert.ok(read('src/components/SEO.tsx').includes('noIndex = false') && read('src/components/SEO.tsx').includes('/explorar?q='), 'Search metadata or privacy controls not migrated')
assert.ok(frontend.includes("status === 'draft'") && frontend.includes("status === 'pending_review'"), 'Draft/pending forms not guarded')
assert.ok(app.includes('creator-moderation') && read('src/cms/layout/CmsSidebar.tsx').includes('creator-moderation'), 'CMS moderation not connected')
assert.ok(edge.includes('admin.auth.getUser(token)') && edge.includes('caller.app_metadata?.role'), 'Untrusted moderator roles')
const cmsAuth = read('src/cms/hooks/useAdminSession.ts')
assert.ok(cmsAuth.includes("const canModerate = trustedAppRole(user) !== null") && cmsAuth.includes("if (trustedRole === 'moderator')"), 'CMS client must require the same trusted app_metadata moderator role as the Edge Function')
assert.ok(edge.includes('SELF_REVIEW_DENIED') && edge.includes('safeExternalUrl'), 'Moderator safety checks missing')
assert.ok(edge.includes("admin.rpc('creator_review_project'") && edge.includes("admin.rpc('creator_resolve_report'"), 'Moderation must use atomic database transactions')
assert.ok(sql.includes('security invoker') && sql.includes('revoke execute on function public.creator_review_project') && sql.includes('revoke execute on function public.creator_resolve_report'), 'Moderator RPC execute grants not restricted')
assert.ok(sql.includes("v_project.author_id = p_actor"), 'Moderator RPC authorization or self-review guard missing')
assert.ok(read('supabase/config.toml').includes('[functions.creator-moderation]\nverify_jwt = true'), 'JWT verification not enabled')
assert.ok(sql.includes('creator_projects_owner_insert') && sql.includes('creator_projects_owner_update'), 'RLS missing')
assert.ok(sql.includes("auth.uid()) = author_id and status in ('draft','rejected')") && !sql.includes("auth.uid()) = author_id and status in ('draft','pending_review','rejected')"), 'Pending content must be immutable for creator-owned updates')
assert.ok(sql.includes('grant insert (project_id, reporter_id, reason) on public.creator_project_reports to authenticated;') && !sql.includes('grant insert, select on public.creator_project_reports'), 'Reporter must not forge resolution metadata')
assert.ok(frontend.includes(".in('status', ['draft', 'rejected'])") && frontend.includes('insert({ ...payload, author_id: userId })'), 'Author ownership or pending edits are incorrectly handled')
assert.ok(frontend.includes(".in('status', ['draft', 'rejected']).select('id').maybeSingle()") && frontend.includes('if (deleteError || !deleted)'), 'Draft deletion must verify the matching row was actually deleted')
assert.ok(!frontend.includes("data.user.email?.split('@')[0]"), 'Public creator name must not fall back to a private email local part')
assert.ok(edge.includes("const reportedIds = [...new Set(") && edge.includes(".in('id', reportedIds)"), 'Report moderation must query the actual reported IDs')
assert.ok(sql.includes('revoke all on public.creator_projects from anon, authenticated') && sql.includes('revoke all on public.creator_project_reports from anon, authenticated'), 'Default privileges were not revoked')
assert.ok(sql.includes('grant update (author_name') && !sql.includes('grant insert, update, delete on public.creator_projects'), 'Moderation metadata writable by users')
assert.ok(sql.includes('creator_moderation_events') && sql.includes('creator_publish_timestamp'), 'Audit/timestamps missing')
assert.ok(sql.includes("char_length(array_to_string(tags, ',')) <= 255"), 'Creator tags need total length bounds')
assert.ok(!sql.includes('external_url, cover_url, license, tags, status) on public.creator_projects'), 'User should not set unreviewed cover URLs')
assert.ok(sql.includes('project_id uuid not null,\n  reviewer_id uuid references auth.users'), 'Moderation audit must survive creator draft removal')
assert.ok(!frontend.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Browser contains server-only key')
// A Vercel production build must fail closed rather than publish a beautiful
// but unusable Creator Network with placeholder Supabase credentials.
// Local builds and protected previews can still run the isolated QA suite.
if (process.env.VERCEL_ENV === 'production') {
  const url = String(process.env.VITE_SUPABASE_URL || '')
  const key = String(process.env.VITE_SUPABASE_ANON_KEY || '')
  assert.ok(/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)
    && (key.startsWith('sb_publishable_') || (key.startsWith('eyJ') && key.length > 80)),
    'Production release blocked: configure valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel')
}
console.log('PASS creator network: routes, preserved modules, RLS and moderation contracts.')
