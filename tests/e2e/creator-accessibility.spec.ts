import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

// The creator platform is the current public experience. Check the same
// WCAG AA violations in desktop and mobile without changing any user data.
for (const [path, name] of [
  ['/', 'Portada'],
  ['/explorar', 'Catálogo'],
  ['/account?mode=signup', 'Registro'],
] as const) {
  test('Creator accessibility · ' + name, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('.xk-creator-app')).toBeVisible()
    const result = await new AxeBuilder({ page })
      .include('.xk-creator-app')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    const violations = result.violations.map(issue => ({
      id: issue.id, impact: issue.impact, nodes: issue.nodes.map(node => node.target),
    }))
    if (violations.length) console.log(name + ': ' + JSON.stringify(violations))
    expect(violations).toEqual([])
  })
}
