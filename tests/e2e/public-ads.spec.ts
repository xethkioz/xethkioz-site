import { expect, test, type Page } from '@playwright/test'

type Campaign = {
  id: string
  campaign_key: string
  campaign_kind: 'house' | 'sponsor' | 'affiliate' | 'network'
  slot_id: string
  sponsor_name: string
  title: string
  description: string | null
  target_url: string | null
  image_url: string | null
  status: 'active'
  starts_at: string | null
  ends_at: string | null
}

async function mockCampaign(page: Page, campaign: Campaign) {
  await page.route('**/rest/v1/ads_campaigns*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([campaign]),
    })
  })
}

const baseCampaign: Campaign = {
  id: '00000000-0000-4000-8000-000000000001',
  campaign_key: 'test-campaign',
  campaign_kind: 'house',
  slot_id: 'news-inline',
  sponsor_name: 'XETHKIOZ',
  title: 'Guías para jugar mejor',
  description: 'Contenido propio del portal Gaming.',
  target_url: '/gaming/guides',
  image_url: null,
  status: 'active',
  starts_at: null,
  ends_at: null,
}

test.describe('campañas públicas', () => {
  test('la promoción propia conserva divulgación obligatoria y navegación interna', async ({ page }) => {
    await mockCampaign(page, baseCampaign)
    await page.goto('/news')

    await expect(page.getByText('Promoción propia de XETHKIOZ', { exact: true })).toBeVisible()
    await expect(page.getByText('XETHKIOZ NEWS SPONSOR', { exact: true })).toBeVisible()

    const link = page.getByRole('link', { name: 'Abrir promoción: Guías para jugar mejor' })
    await expect(link).toHaveAttribute('href', '/gaming/guides')
    await expect(link).not.toHaveAttribute('target', '_blank')
    await link.click()
    await expect(page).toHaveURL(/\/gaming\/guides$/)
  })

  test('un destino javascript queda neutralizado y no genera enlace', async ({ page }) => {
    await mockCampaign(page, {
      ...baseCampaign,
      campaign_key: 'unsafe-target',
      campaign_kind: 'sponsor',
      sponsor_name: 'Marca de prueba',
      title: 'Campaña insegura',
      target_url: 'javascript:alert(1)',
    })
    await page.goto('/news')

    await expect(page.getByText('Contenido patrocinado', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Campaña insegura' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Campaña insegura/ })).toHaveCount(0)
  })

  test('un sponsor externo abre en otra pestaña con rel patrocinado', async ({ page }) => {
    await mockCampaign(page, {
      ...baseCampaign,
      campaign_key: 'external-sponsor',
      campaign_kind: 'sponsor',
      sponsor_name: 'Marca externa',
      title: 'Sponsor externo',
      target_url: 'https://example.com/oferta',
    })
    await page.goto('/news')

    const link = page.getByRole('link', { name: 'Abrir promoción: Sponsor externo' })
    await expect(page.getByText('Contenido patrocinado', { exact: true })).toBeVisible()
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
    await expect(link).toHaveAttribute('rel', /noreferrer/)
    await expect(link).toHaveAttribute('rel', /sponsored/)
  })
})
