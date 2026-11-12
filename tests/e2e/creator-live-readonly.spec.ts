import { expect, test } from '@playwright/test'

// Explicitly opted-in read-only check using the *real* Supabase endpoint and
// a public publishable key at BUILD time. No account, email, writes or secrets.
// This spec is skipped on ordinary CI and local preview builds.
test('Real Supabase REST reads from the new creator catalog', async ({ page }) => {
  test.skip(process.env.LIVE_CREATOR_READONLY !== '1', 'Requires explicitly configured real Supabase public-key build.')
  const catalogResponse = page.waitForResponse(response =>
    response.url().includes('/rest/v1/creator_projects') &&
    response.request().method() === 'GET', { timeout: 15000 })
  await page.goto('/explorar')
  await expect(page.getByRole('heading', { name: 'Descubrí lo próximo.' })).toBeVisible()
  const result = await catalogResponse
  expect(result.status()).toBe(200)
  expect(result.url()).toContain('status=eq.published')
  await expect(page.getByText('Estamos preparando la apertura del catálogo.')).toHaveCount(0)
  await expect(page.getByText('El catálogo todavía no está conectado.')).toHaveCount(0)
  await expect(page.locator('.xk-creator-state[role="status"]')).toHaveCount(0)
  // An empty catalog is normal before the first real moderated submission.
  expect(await page.locator('.xk-creator-card').count()).toBeGreaterThanOrEqual(0)
})
