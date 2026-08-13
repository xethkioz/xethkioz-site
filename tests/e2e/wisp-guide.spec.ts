import { expect, test } from '@playwright/test'

test('Green Node Protect es público y Vault 13 conserva el acceso WISP', async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('xethkioz.greenNodeUnlocked', String(Date.now()))
    window.localStorage.setItem('xethkioz.green-node.wisp-guide.v1', 'complete')
  })

  await page.goto('/green-node', { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('heading', { level: 1, name: /green node/i })).toBeVisible()
  await expect(page.getByText(/protect \/\/ public/i)).toBeVisible()
  await expect(page.locator('.xk-wisp-guide-launcher')).toHaveCount(0)

  await page.getByRole('button', { name: /abrir vault 13|open vault 13/i }).click()
  await expect(page).toHaveURL(/\/green-node\/vault/)

  const launcher = page.locator('.xk-wisp-guide-launcher')
  const guide = page.locator('.xk-wisp-guide')

  await expect(launcher).toBeVisible()
  await expect(guide).toHaveCount(0)

  await launcher.getByRole('button').click()
  await expect(guide).toBeVisible()
  await expect(guide.getByRole('heading', { level: 2 })).toBeVisible()

  await guide.getByRole('button', { name: /cerrar la guía de wisp|close wisp guide/i }).click()
  await expect(launcher).toBeVisible()
})
