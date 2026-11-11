import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

// Run the real Deno Edge handler inside a local, isolated JS runtime.
// Only the Supabase API is simulated. Never calls production, uses real keys,
// or creates real moderation records.
const source = readFileSync('supabase/functions/creator-moderation/index.ts', 'utf8')
const importLine = "import { createClient } from 'npm:@supabase/supabase-js@2.110.7'\n"
assert.ok(source.startsWith(importLine), 'Update this harness for the pinned dependency if it changes.')
const result = ts.transpileModule(source.slice(importLine.length), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
})
assert.equal(result.diagnostics?.length || 0, 0)

const ids = {
  moderator: '33333333-3333-4333-8333-333333333333',
  own: '11111111-1111-4111-8111-111111111111',
  other: '22222222-2222-4222-8222-222222222222',
  pending: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  published: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  report: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
}

function createMock() {
  const state = {
    actor: { id: ids.moderator, app_metadata: { role: 'moderator' } },
    rpcCalls: [],
    lookups: [],
    projects: [
      { id: ids.pending, author_id: ids.other, status: 'pending_review',
        title: 'Archivo para revisar', external_url: 'https://drive.google.com/file/d/approved',
        created_at: '2026-11-11T03:00:00Z' },
      { id: ids.published, author_id: ids.other, status: 'published',
        title: 'Proyecto antiguo', external_url: 'https://drive.google.com/file/d/old',
        created_at: '2026-01-01T03:00:00Z' },
    ],
    reports: [
      { id: ids.report, project_id: ids.published, reason: 'malware',
        created_at: '2026-11-11T03:00:00Z', resolved_at: null },
    ],
    environment: {
      SUPABASE_URL: 'https://test-only.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'local-testing-only-secret',
    },
  }
  function from(name) {
    const filters = []
    let limit = Number.POSITIVE_INFINITY
    const q = {
      select() { return q },
      eq(key, value) { filters.push(row => row[key] === value); return q },
      is(key, value) { filters.push(row => row[key] === value); return q },
      in(key, values) {
        state.lookups.push({ table: name, field: key, values })
        filters.push(row => values.includes(row[key]))
        return q
      },
      order() { return q },
      limit(n) { limit = n; return q },
      maybeSingle() {
        const list = getRows()
        return Promise.resolve({ data: list[0] || null, error: null })
      },
      then(ok, fail) {
        return Promise.resolve({ data: getRows(), error: null }).then(ok, fail)
      },
    }
    function getRows() {
      const sourceRows = name === 'creator_projects' ? state.projects : state.reports
      return sourceRows.filter(row => filters.every(fn => fn(row))).slice(0, limit)
    }
    return q
  }
  const client = {
    auth: {
      async getUser(token) {
        return token === 'signed-test-token'
          ? { data: { user: state.actor }, error: null }
          : { data: { user: null }, error: { message: 'Invalid token' } }
      },
    },
    from,
    async rpc(name, args) {
      state.rpcCalls.push({ name, args })
      if (name === 'creator_review_project') {
        return { data: args.p_decision === 'approve' ? 'published' : 'rejected', error: null }
      }
      if (name === 'creator_resolve_report') return { data: 'removed', error: null }
      return { data: null, error: { message: 'RPC does not exist' } }
    },
  }
  let handler
  const fakeDeno = {
    env: { get: key => state.environment[key] || undefined },
    serve: callback => { handler = callback },
  }
  const sandbox = { Deno: fakeDeno, createClient: () => client,
    Response, Request, Headers, URL, Date, Map, Set, console }
  vm.runInNewContext(result.outputText, sandbox, { filename: 'creator-moderation.local.js', timeout: 2500 })
  assert.equal(typeof handler, 'function')
  async function request(body, options = {}) {
    const headers = { Origin: options.origin || 'https://xethkioz.com.ar' }
    if (!options.noAuth) headers.Authorization = 'Bearer ' + (options.token || 'signed-test-token')
    const method = options.method || 'POST'
    if (method === 'POST') headers['Content-Type'] = 'application/json'
    const req = new Request('https://test-only.supabase.co/functions/v1/creator-moderation', {
      method, headers, body: method === 'POST' ? JSON.stringify(body) : undefined,
    })
    const response = await handler(req)
    const data = response.status === 204 ? null : await response.json()
    return { status: response.status, data, headers: response.headers }
  }
  return { state, request }
}

let checks = 0
async function check(name, fn) {
  try { await fn(); checks++; console.log('PASS ' + name) }
  catch (error) { console.error('FAIL ' + name + ': ' + error.message); throw error }
}
const mock = createMock()

await check('Reject untrusted browser origins', async () => {
  const r = await mock.request({ action: 'list' }, { origin: 'https://attacker.invalid' })
  assert.equal(r.status, 403)
  assert.equal(r.data.error, 'ORIGIN_NOT_ALLOWED')
})
await check('Only allowed domains receive CORS headers', async () => {
  const r = await mock.request({ action: 'list' }, { origin: 'https://attacker.invalid' })
  assert.equal(r.headers.get('access-control-allow-origin'), null)
})
await check('Deny requests without a user token', async () => {
  const r = await mock.request({ action: 'list' }, { noAuth: true })
  assert.equal(r.status, 401)
})
await check('Deny invalid signed user token', async () => {
  const r = await mock.request({ action: 'list' }, { token: 'not-a-real-session' })
  assert.equal(r.status, 401)
})
await check('Do not trust a profile or user metadata role', async () => {
  const saved = mock.state.actor
  mock.state.actor = { id: ids.moderator, app_metadata: {}, user_metadata: { role: 'admin' } }
  try {
    const r = await mock.request({ action: 'list' })
    assert.equal(r.status, 403)
    assert.equal(r.data.error, 'MODERATOR_REQUIRED')
  } finally { mock.state.actor = saved }
})
await check('A trusted app moderator can list pending and reported projects', async () => {
  const r = await mock.request({ action: 'list' })
  assert.equal(r.status, 200)
  assert.equal(r.data.queue.length, 1)
  assert.equal(r.data.reports.length, 1)
  assert.equal(r.data.reportedProjects.length, 1)
  assert.equal(r.data.reportedProjects[0].id, ids.published)
  assert.equal(mock.state.lookups[0].field, 'id')
  assert.ok(mock.state.lookups[0].values.includes(ids.published))
})
await check('Self-review is denied before any RPC call', async () => {
  mock.state.projects[0].author_id = ids.moderator
  const before = mock.state.rpcCalls.length
  try {
    const r = await mock.request({ action: 'review', projectId: ids.pending,
      decision: 'approve', reviewed: true })
    assert.equal(r.status, 403)
    assert.equal(r.data.error, 'SELF_REVIEW_DENIED')
    assert.equal(mock.state.rpcCalls.length, before)
  } finally { mock.state.projects[0].author_id = ids.other }
})
await check('Unsafe creator URLs are blocked before approval', async () => {
  mock.state.projects[0].external_url = 'https://127.0.0.1/private'
  const before = mock.state.rpcCalls.length
  try {
    const r = await mock.request({ action: 'review', projectId: ids.pending,
      decision: 'approve', reviewed: true })
    assert.equal(r.status, 400)
    assert.equal(r.data.error, 'UNSAFE_EXTERNAL_URL')
    assert.equal(mock.state.rpcCalls.length, before)
  } finally { mock.state.projects[0].external_url = 'https://drive.google.com/file/d/approved' }
})
await check('Explicit human review is mandatory for approval', async () => {
  const r = await mock.request({ action: 'review', projectId: ids.pending, decision: 'approve' })
  assert.equal(r.status, 400)
  assert.equal(r.data.error, 'INVALID_REVIEW')
})
await check('Approval calls only the atomic database workflow', async () => {
  const r = await mock.request({ action: 'review', projectId: ids.pending,
    decision: 'approve', reviewed: true })
  assert.equal(r.status, 200)
  assert.equal(r.data.status, 'published')
  const call = mock.state.rpcCalls.at(-1)
  assert.equal(call.name, 'creator_review_project')
  assert.equal(call.args.p_actor, ids.moderator)
  assert.equal(call.args.p_project, ids.pending)
})
await check('Rejection requires an explanatory note', async () => {
  const r = await mock.request({ action: 'review', projectId: ids.pending,
    decision: 'reject', reviewed: true, reason: 'bad' })
  assert.equal(r.status, 400)
  assert.equal(r.data.error, 'REJECTION_REASON_REQUIRED')
})
await check('Cannot remove a report without human review', async () => {
  const r = await mock.request({ action: 'resolve_report', reportId: ids.report,
    decision: 'remove', reason: 'Malware report is valid' })
  assert.equal(r.status, 400)
  assert.equal(r.data.error, 'MANUAL_REVIEW_REQUIRED')
})
await check('Report removal calls the atomic resolution workflow', async () => {
  const r = await mock.request({ action: 'resolve_report', reportId: ids.report,
    decision: 'remove', reason: 'Malware report is valid', reviewed: true })
  assert.equal(r.status, 200)
  const call = mock.state.rpcCalls.at(-1)
  assert.equal(call.name, 'creator_resolve_report')
  assert.equal(call.args.p_report, ids.report)
})
await check('Refuse unconfigured server-side service credentials', async () => {
  const original = mock.state.environment.SUPABASE_SERVICE_ROLE_KEY
  mock.state.environment.SUPABASE_SERVICE_ROLE_KEY = ''
  try {
    const r = await mock.request({ action: 'list' })
    assert.equal(r.status, 503)
    assert.equal(r.data.error, 'NOT_CONFIGURED')
  } finally { mock.state.environment.SUPABASE_SERVICE_ROLE_KEY = original }
})

console.log('ALL ' + checks + ' Edge moderation assertions passed in isolated runtime.')
