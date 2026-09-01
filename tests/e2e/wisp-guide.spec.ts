import { expect, test } from '@playwright/test'

test('la guía WISP de Green Node permanece estable y abre por interacción', async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('xethkioz.greenNodeUnlocked', String(Date.now()))
    window.localStorage.setItem('xethkioz.green-node.wisp-guide.v1', 'complete')
  })

  await page.goto('/green-node/vault', { waitUntil: 'domcontentloaded' })

  const launcher = page.locator('.xk-wisp-guide-launcher')
  const guide = page.locator('.xk-wisp-guide')

  await expect(launcher).toBeVisible()
  await page.waitForTimeout(600)
  await expect(guide).toHaveCount(0)

  await launcher.getByRole('button').click()
  await expect(guide).toBeVisible()
  await expect(guide.getByRole('heading', { level: 2 })).toBeVisible()

  await guide.getByRole('button', { name: /cerrar la guía de wisp|close wisp guide/i }).click()
  await expect(launcher).toBeVisible()
})
