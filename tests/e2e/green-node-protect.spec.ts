import { createHash } from 'node:crypto'
import { expect, test } from '@playwright/test'

test.describe('Green Node Protect público y local-first', () => {
  test('abre sin sesión y mantiene Vault 13 separado', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'ABRIR PROTECT: GREEN NODE PROTECT' })).toHaveAttribute('href', '/green-node')

    await page.goto('/green-node')

    await expect(page).toHaveURL(/\/green-node$/)
    await expect(page.getByRole('heading', { level: 1, name: /GREEN NODE/i })).toBeVisible()
    await expect(page.getByText('PROTECT // PUBLIC', { exact: true })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Zonas de Green Node' })).toBeVisible()
    await expect(page.locator('.xk-green-access-sequence')).toHaveCount(0)
  })

  test('el inspector analiza la estructura sin contactar el destino', async ({ page }) => {
    const contactedDestination: string[] = []
    page.on('request', (request) => {
      if (request.url().includes('phish.invalid')) contactedDestination.push(request.url())
    })

    await page.goto('/green-node')
    await page.getByLabel('Dirección para revisar').fill('https://cuenta.example.com@phish.invalid/iniciar')
    await page.getByRole('button', { name: 'ANALIZAR' }).click()

    await expect(page.getByText('phish.invalid', { exact: true })).toBeVisible()
    await expect(page.getByText('Credenciales dentro de la URL', { exact: true })).toBeVisible()
    expect(contactedDestination).toEqual([])
  })

  test('calcula y compara SHA-256 sin subir el archivo', async ({ page }) => {
    const contents = Buffer.from('xethkioz-green-node')
    const expected = createHash('sha256').update(contents).digest('hex')
    const unexpectedUploads: string[] = []
    page.on('request', (request) => {
      if (request.method() !== 'GET' && request.postData()?.includes('xethkioz-green-node')) unexpectedUploads.push(request.url())
    })

    await page.goto('/green-node')
    await page.locator('input[type="file"]').setInputFiles({
      name: 'green-node.txt',
      mimeType: 'text/plain',
      buffer: contents,
    })
    await page.getByLabel('SHA-256 oficial opcional').fill(expected)

    await expect(page.getByText('COINCIDE con el SHA-256 de referencia.', { exact: true })).toBeVisible()
    await expect(page.locator('.xk-sos-hash-output code')).toHaveText(expected)
    expect(unexpectedUploads).toEqual([])
  })
})
