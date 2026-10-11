import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.use({ viewport: { width: 390, height: 844 } })

for (const path of ['/', '/world-of-xethkioz/elemental-realms', '/digital', '/green-node']) {
  test('Luminous stage 2 serious/critical axe audit: ' + path, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' })
    const result = await new AxeBuilder({ page })
      .include('#main-content')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    const blocking = result.violations.filter(violation => violation.impact === 'serious' || violation.impact === 'critical')
    expect(blocking.map(violation => ({
      id: violation.id,
      count: violation.nodes.length,
      targets: violation.nodes.slice(0, 3).map(node => node.target),
    }))).toEqual([])
  })
}
