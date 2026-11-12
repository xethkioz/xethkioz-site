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
    simulateDeleteConflict?: boolean,
    initialProjects?: Array<Record<string, unknown>>,
    profileRole?: string,
    userAppRole?: string,
    moderation?: (data: Record<string, unknown>) => unknown,
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
      if (url.pathname === '/auth/v1/user' && method === 'GET') return respond(options.userAppRole ? { ...user, app_metadata: { ...user.app_metadata, role: options.userAppRole } } : user)
      if (url.pathname === '/rest/v1/profiles' && method === 'GET') {
        return respond({ role: options.profileRole || 'GUEST', subscription_tier: 'BASIC' })
      }
      if (url.pathname === '/functions/v1/creator-moderation' && method === 'POST') {
        const data = request.postDataJSON() as Record<string, unknown>
        return respond(options.moderation?.(data) || { ok: true, queue: [], reports: [], reportedProjects: [] })
      }
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
        if (method === 'DELETE') {
          if (options.simulateDeleteConflict) return respond(null)
          const row = projects.find(item => url.searchParams.get('id') === 'eq.' + item.id && ['draft', 'rejected'].includes(String(item.status)))
          if (!row) return respond(null)
          projects.splice(projects.indexOf(row), 1)
          return respond({ id: row.id })
        }
        if (method === 'GET') {
          const rowId = url.searchParams.get('id')
          const status = url.searchParams.get('status')
          const category = url.searchParams.get('category')
          const expression = url.searchParams.get('or') || ''
          const search = /title\.ilike\.%([^%]+)%/.exec(expression)?.[1]?.toLocaleLowerCase('es') || ''
          const filtered = projects
            .filter(x => !rowId || rowId === 'eq.' + x.id)
            .filter(x => !status || status === 'eq.' + x.status)
            .filter(x => !category || category === 'eq.' + x.category)
            .filter(x => !search || [x.title, x.summary, x.author_name]
              .some(value => String(value || '').toLocaleLowerCase('es').includes(search)))
            .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || ''))
              || String(b.id).localeCompare(String(a.id)))
          const offset = Math.max(0, Number(url.searchParams.get('offset') || 0))
          const limit = Number(url.searchParams.get('limit') || filtered.length)
          const result = filtered.slice(offset, offset + limit)
          const single = (request.headers()['accept'] || '').includes('application/vnd.pgrst.object+json')
          return respond(single ? result[0] || null : result)
        }
      }
      if (url.pathname.startsWith('/rest/v1/') && method === 'GET') return respond([])
      return respond({ message: 'Not available in fixture' }, 404)
    })
  }

  async function seedSession(page: Page, appRole?: string) {
    const seededUser = appRole ? { ...user, app_metadata: { ...user.app_metadata, role: appRole } } : user
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
    }, { user: seededUser, storageKey: 'sb-mock-creator-auth-token' })
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

  test('Profile-only moderator cannot access the review controls', async ({ page }) => {
    await seedSession(page)
    await mockSupabase(page, { profileRole: 'MODERATOR' })
    await page.goto('/cms/creator-moderation')
    await expect(page.getByRole('heading', { name: 'Acceso restringido' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Aprobar y publicar' })).toHaveCount(0)
  })

  test('Trusted app moderator can review a pending creation', async ({ page }) => {
    const requests: Array<Record<string, unknown>> = []
    let approved = false
    const sample = {
      id: projectId, author_id: '22222222-2222-4222-8222-222222222222',
      author_name: 'Autor externo', title: 'Proyecto para revisar',
      summary: 'Una creación original para revisar en la comunidad.',
      external_url: 'https://drive.google.com/file/d/sample',
      category: 'programa', license: 'MIT', status: 'pending_review',
      created_at: '2026-11-11T00:00:00Z',
    }
    await seedSession(page, 'moderator')
    await mockSupabase(page, {
      userAppRole: 'moderator', profileRole: 'GUEST',
      moderation: data => {
        requests.push(data)
        if (data.action === 'review') { approved = true; return { ok: true, projectId, status: 'published' } }
        return { ok: true, queue: approved ? [] : [sample], reports: [], reportedProjects: [] }
      },
    })
    await page.goto('/cms/creator-moderation')
    await expect(page.getByRole('heading', { name: 'Revisión de creaciones' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Pendientes de revisión \(1\)/ })).toBeVisible()
    await page.getByRole('checkbox').first().check()
    await page.getByRole('button', { name: 'Aprobar y publicar' }).click()
    await expect(page.getByText('Proyecto aprobado y publicado.')).toBeVisible()
    const review = requests.find(data => data.action === 'review')
    expect(review?.projectId).toBe(projectId)
    expect(review?.decision).toBe('approve')
    expect(review?.reviewed).toBe(true)
  })
  test('Unsafe raw-IP cloud links cannot be submitted for review', async ({ page }) => {
    let submitted = false
    await seedSession(page)
    await mockSupabase(page, { projectPost: () => { submitted = true } })
    await page.goto('/publicar')
    await page.getByPlaceholder('Ej.: Mi videojuego de aventuras').fill('Archivo de prueba')
    await page.getByPlaceholder(/Qué creaste/).fill('Este archivo comprueba que no se aceptan servidores IP arbitrarios como enlaces públicos.')
    await page.locator('input[type="url"]').fill('https://8.8.8.8/archivo')
    await page.getByRole('button', { name: /Enviar a revisión/ }).click()
    await expect(page.getByText('Ingresá un enlace HTTPS público y válido de tu nube.')).toBeVisible()
    expect(submitted).toBe(false)
  })

  test('Catalog searches beyond page one and filters in database', async ({ page }) => {
    const projects = Array.from({ length: 31 }, (_, i) => ({
      id: '00000000-0000-4000-8000-' + (i + 1).toString(16).padStart(12, '0'),
      author_id: userId,
      author_name: i === 0 ? 'Taller Zafiro' : 'Comunidad',
      title: i === 0 ? 'Juego Zafiro Antiguo' : 'Proyecto de prueba ' + String(i + 1),
      summary: i === 0 ? 'Creación para buscar fuera de la primera página' : 'Proyecto creativo de pruebas',
      category: i % 2 === 0 ? 'videojuego' : 'programa',
      external_url: 'https://drive.google.com/file/d/test-' + String(i),
      license: 'MIT', tags: [],
      status: 'published',
      created_at: new Date(Date.UTC(2026, 0, i + 1)).toISOString(),
    }))
    await mockSupabase(page, { initialProjects: projects })
    await page.goto('/explorar')
    await expect(page.locator('.xk-creator-card')).toHaveCount(24)
    await page.getByRole('button', { name: 'Mostrar más creaciones' }).click()
    await expect(page.locator('.xk-creator-card')).toHaveCount(31)
    await expect(page.getByRole('button', { name: 'Mostrar más creaciones' })).toHaveCount(0)
    await page.getByRole('button', { name: /Videojuegos/ }).click()
    await expect(page.locator('.xk-creator-card')).toHaveCount(16)
    await page.getByPlaceholder(/Buscar juegos/).fill('Zafiro')
    await expect(page.locator('.xk-creator-card')).toHaveCount(1)
    await expect(page.getByRole('heading', { name: 'Juego Zafiro Antiguo' })).toBeVisible()
  })

  test('Deleting a draft only removes it once the database confirms', async ({ page }) => {
    await seedSession(page)
    await mockSupabase(page, { initialProjects: [{
      id: projectId, author_id: userId, author_name: 'Autora de prueba',
      title: 'Borrador eliminable', summary: 'Archivo privado de prueba',
      status: 'draft', category: 'programa', external_url: '',
      license: 'MIT', tags: [], created_at: '2026-11-11T00:00:00Z',
    }] })
    page.on('dialog', dialog => { void dialog.accept() })
    await page.goto('/mis-proyectos')
    await expect(page.getByRole('heading', { name: 'Borrador eliminable' })).toBeVisible()
    await page.getByRole('button', { name: 'Eliminar borrador' }).click()
    await expect(page.getByText('Todavía no creaste ninguna publicación.', { exact: false })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Borrador eliminable' })).toHaveCount(0)
  })

  test('A pending-state race does not falsely remove a draft from the library', async ({ page }) => {
    await seedSession(page)
    await mockSupabase(page, {
      simulateDeleteConflict: true,
      initialProjects: [{
        id: projectId, author_id: userId, author_name: 'Autora de prueba',
        title: 'Borrador que cambió de estado', summary: 'Proyecto con otra operación simultánea',
        status: 'draft', category: 'programa', external_url: '',
        license: 'MIT', tags: [], created_at: '2026-11-11T00:00:00Z',
      }],
    })
    page.on('dialog', dialog => { void dialog.accept() })
    await page.goto('/mis-proyectos')
    await expect(page.getByRole('heading', { name: 'Borrador que cambió de estado' })).toBeVisible()
    await page.getByRole('button', { name: 'Eliminar borrador' }).click()
    await expect(page.getByRole('alert')).toContainText('No se eliminó el borrador.')
    await expect(page.getByRole('heading', { name: 'Borrador que cambió de estado' })).toBeVisible()
  })

})
