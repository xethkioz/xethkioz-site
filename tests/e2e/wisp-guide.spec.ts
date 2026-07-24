import { expect, test } from '@playwright/test'

test('la guía Wisp permanece estable y abre por interacción', async ({ page }) => {
  await page.goto('/fun', { waitUntil: 'domcontentloaded' })

  const launcher = page.locator('.xk-portal-wisp-launcher[data-variant="fun"]')
  const guide = page.locator('.xk-portal-wisp-guide[data-variant="fun"]')

  await expect(launcher).toBeVisible()
  await page.waitForTimeout(600)
  await expect(guide).toHaveCount(0)

  await launcher.getByRole('button').click()
  await expect(guide).toBeVisible()
  await expect(guide.getByRole('heading', { level: 2 })).toBeVisible()

  await guide.getByRole('button', { name: /cerrar la guía|close lumina guide/i }).click()
  await expect(launcher).toBeVisible()
})
