import { expect, test } from '@playwright/test'

const E2E_SESSION_KEY = 'xethkioz.e2e.auth-session'

async function installConnectedHarness(page: Parameters<typeof test>[0]['page']) {
  await page.addInitScript((key) => {
    window.sessionStorage.setItem(key, 'connected')
  }, E2E_SESSION_KEY)
}

test.describe('sesión de usuario', () => {
  test('un estado HUD manipulado no se trata como sesión verificada', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('xethkioz.hud.account.status', 'connected')
      window.localStorage.setItem('xethkioz.hud.account.name', 'Intruso local')
      window.localStorage.setItem('xethkioz.hud.account.email', 'fake@example.com')
      window.localStorage.setItem('xethkioz.hud.account.user-id', '00000000-0000-4000-8000-000000000000')
    })

    await page.goto('/profile')
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    await expect(page.getByText('Intruso local', { exact: true })).not.toBeVisible()
    await expect(page.getByRole('alertdialog')).toHaveCount(0)
  })

  test('mantiene la sesión al navegar fuera y volver al panel', async ({ page }) => {
    await installConnectedHarness(page)
    await page.goto('/profile')
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()

    await page.goto('/gaming')
    await expect(page).toHaveURL(/\/gaming$/)
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/profile$/)
    await expect(page.getByRole('alertdialog')).toHaveCount(0)
  })

  test('avisa a los cinco minutos y permite continuar conectado', async ({ page }) => {
    await page.clock.install()
    await installConnectedHarness(page)
    await page.goto('/profile')
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()

    await page.clock.fastForward(5 * 60_000)
    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('10 segundos')

    await page.getByRole('button', { name: 'Continuar conectado' }).click()
    await expect(dialog).toHaveCount(0)

    await page.clock.fastForward(5 * 60_000)
    await expect(page.getByRole('alertdialog')).toBeVisible()
  })

  test('cierra la sesión diez segundos después del aviso', async ({ page }) => {
    await page.clock.install()
    await installConnectedHarness(page)
    await page.goto('/profile')
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()

    await page.clock.fastForward(5 * 60_000)
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await page.clock.fastForward(10_000)

    await expect(page).toHaveURL(/\/account\?mode=signin&reason=inactive$/)
    await expect.poll(() => page.evaluate((key) => window.sessionStorage.getItem(key), E2E_SESSION_KEY)).toBeNull()
  })
})
