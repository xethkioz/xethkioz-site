import { test, expect, type Page } from '@playwright/test'

// The fake host is never a real Supabase project. Run only after a local build with:
// VITE_SUPABASE_URL=https://mock-creator.supabase.co
// VITE_SUPABASE_ANON_KEY=sb_publishable_testonly
// MOCK_CREATOR_AUTH=1 npx playwright test tests/e2e/creator-auth-mock.spec.ts
test.describe('Creator network with simulated Supabase Auth and REST', () => {
  test.skip(process.env.MOCK_CREATOR_AUTH !== '1', 'Requires explicitly configured fake Supabase build.')

  const userId = '11111111-1111-4111-8111-111111111111'
  const projectId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  const user = {
    id: userId,
    aud: 'authenticated',
    role: 'authenticated',
    email: 'creator.fixture@example.test',
    confirmed_at: '2026-11-11T00:00:00Z',
    created_at: '2026-11-11T00:00:00Z',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { display_name: 'Autora de prueba' },
  }
  const headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'GET, POST, PATCH, OPTIONS',
    'content-type': 'application/json; charset=utf-8',
  }

  async function mockSupabase(page: Page, options: {
    signup?: (url: URL, data: Record<string, unknown>) => void,
    projectPost?: (data: Record<string, unknown>) => void,
    projectPatch?: (url: URL, data: Record<string, unknown>) => void,
    initialProjects?: Array<Record<string, unknown>>,
  } = {}) {
    const projects = [...(options.initialProjects || [])]
    await page.route('https://mock-creator.supabase.co/**', async route => {
      const request = route.request()
      const url = new URL(request.url())
      const method = request.method()
      const respond = async (body: unknown, status = 200) =>
        route.fulfill({ status, headers, body: JSON.stringify(body) })
      if (method === 'OPTIONS') return route.fulfill({ status: 204, headers, body: '' })
      if (url.pathname === '/auth/v1/signup' && method === 'POST') {
        const data = request.postDataJSON() as Record<string, unknown>
        options.signup?.(url, data)
        return respond({ user: { ...user, email: String(data.email) }, session: null })
      }
      if (url.pathname === '/auth/v1/user' && method === 'GET') return respond(user)
      if (url.pathname === '/rest/v1/creator_projects') {
        if (method === 'POST') {
          const data = request.postDataJSON() as Record<string, unknown>
          options.projectPost?.(data)
          projects.push({
            id: projectId, author_id: userId, author_name: 'Autora de prueba',
            title: data.title, summary: data.summary, status: data.status,
            category: data.category, external_url: data.external_url,
            license: data.license, tags: data.tags || [],
            created_at: '2026-11-11T00:00:00Z',
          })
          return respond({ id: projectId }, 201)
        }
        if (method === 'PATCH') {
          const data = request.postDataJSON() as Record<string, unknown>
          options.projectPatch?.(url, data)
          const match = projects.find(item => url.searchParams.get('id') === 'eq.' + item.id)
          if (!match) return respond({ message: 'No match' }, 404)
          Object.assign(match, data)
          return respond({ id: match.id })
        }
        if (method === 'GET') {
          const rowId = url.searchParams.get('id')
          const filtered = rowId ? projects.filter(x => 'eq.' + x.id === rowId) : projects
          const single = (request.headers()['accept'] || '').includes('application/vnd.pgrst.object+json')
          return respond(single ? filtered[0] || null : filtered)
        }
      }
      if (url.pathname.startsWith('/rest/v1/') && method === 'GET') return respond([])
      return respond({ message: 'Not available in fixture' }, 404)
    })
  }

  async function seedSession(page: Page) {
    await page.addInitScript(({ user, storageKey }) => {
      const payload = {
        sub: user.id, role: 'authenticated',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iss: 'https://mock-creator.supabase.co/auth/v1',
      }
      const body = btoa(JSON.stringify(payload))
        .replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
      const session = {
        access_token: 'eyJhbGciOiJIUzI1NiJ9.' + body + '.testsignature',
        refresh_token: 'test-only-refresh-token',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user,
      }
      localStorage.setItem(storageKey, JSON.stringify(session))
    }, { user, storageKey: 'sb-mock-creator-auth-token' })
  }

  test('Registration preserves confirmation notice and creator destination', async ({ page }) => {
    let signupUrl: URL | undefined
    let signupBody: Record<string, unknown> = {}
    await mockSupabase(page, {
      signup: (url, body) => { signupUrl = url; signupBody = body },
    })
    await page.goto('/account?mode=signup&redirect=%2Fpublicar')
    await page.getByPlaceholder(/Nombre visible/).fill('Autora de prueba')
    await page.getByPlaceholder('tu@email.com').fill('creator.fixture@example.test')
    await page.getByPlaceholder('Contraseña', { exact: true }).fill('PruebaSegura2026!')
    await page.getByPlaceholder('Repetir contraseña').fill('PruebaSegura2026!')
    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click()
    await expect(page.getByText(/Cuenta creada. Revisá el correo de confirmación/)).toBeVisible()
    await expect(page).toHaveURL(/mode=signin/)
    await expect(page).toHaveURL(/redirect=%2Fpublicar/)
    expect(signupBody.email).toBe('creator.fixture@example.test')
    expect((signupBody.data as Record<string, unknown>).display_name).toBe('Autora de prueba')
    expect(signupUrl?.searchParams.get('redirect_to')).toContain('/account?mode=signin&redirect=%2Fpublicar')
  })

  test('Signed-in creator can submit for human review and see a pending project', async ({ page }) => {
    let submitted: Record<string, unknown> | undefined
    await seedSession(page)
    await mockSupabase(page, { projectPost: data => { submitted = data } })
    await page.goto('/publicar')
    await expect(page.getByRole('heading', { name: 'Compartí tu creación.' })).toBeVisible()
    await page.getByPlaceholder('Ej.: Mi videojuego de aventuras').fill('Aventura de prueba')
    await page.getByPlaceholder(/Qué creaste/).fill(
      'Una aventura original en la que se exploran mundos imaginarios y se descubren criaturas.'
    )
    await page.locator('input[type="url"]').fill('https://drive.google.com/file/d/test')
    await page.getByRole('button', { name: /Enviar a revisión/ }).click()
    await expect(page).toHaveURL(/\/mis-proyectos\?guardado=1/)
    await expect(page.locator('.xk-creator-drafts article small').filter({ hasText: 'En revisión' })).toBeVisible()
    expect(submitted?.status).toBe('pending_review')
    expect(submitted?.author_id).toBe(userId)
    expect(submitted?.external_url).toBe('https://drive.google.com/file/d/test')
    await expect(page.getByRole('link', { name: 'Editar →' })).toHaveCount(0)
    await expect(page.getByText(/edición bloqueada/)).toBeVisible()
  })

  test('Editing a draft never rewrites author identity or pending content', async ({ page }) => {
    let patch: Record<string, unknown> | undefined
    let patchStatus = ''
    await seedSession(page)
    await mockSupabase(page, {
      initialProjects: [{
        id: projectId, author_id: userId, author_name: 'Autora de prueba',
        title: 'Borrador inicial', summary: 'Una idea inicial',
        status: 'draft', category: 'programa', external_url: '',
        license: 'MIT', tags: [], rejection_reason: null,
        created_at: '2026-11-11T00:00:00Z',
      }],
      projectPatch: (url, data) => {
        patch = data
        patchStatus = url.searchParams.get('status') || ''
      },
    })
    await page.goto('/publicar/' + projectId)
    await expect(page.getByRole('heading', { name: 'Editar mi proyecto' })).toBeVisible()
    await page.getByPlaceholder('Ej.: Mi videojuego de aventuras').fill('Borrador actualizado')
    await page.getByRole('button', { name: 'Guardar borrador' }).click()
    await expect(page).toHaveURL(/\/mis-proyectos\?guardado=1/)
    expect(patch?.title).toBe('Borrador actualizado')
    expect(patch).not.toHaveProperty('author_id')
    expect(patchStatus).toContain('draft')
    expect(patchStatus).toContain('rejected')
  })
})
