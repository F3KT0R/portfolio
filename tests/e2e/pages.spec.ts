import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pages } from './routes'

for (const page of pages) {
  test.describe(`${page.label} (${page.path})`, () => {
    test('renders one h1 and no horizontal scroll', async ({ page: p }) => {
      await p.goto(page.path)
      await expect(p.locator('h1')).toHaveCount(1)
      const overflow = await p.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })

    for (const theme of ['dungeon', 'parchment'] as const) {
      test(`has no axe violations in the ${theme} theme`, async ({ page: p }) => {
        await p.addInitScript((t) => localStorage.setItem('portfolio.theme', t), theme)
        await p.goto(page.path)
        await expect(p.locator('html')).toHaveAttribute('data-theme', theme)
        // Measure settled colours: a toast fading in is not a contrast failure.
        await p.waitForFunction(() =>
          document
            .getAnimations()
            .filter((a) => a.effect?.getTiming().iterations !== Infinity)
            .every((a) => a.playState === 'finished'),
        )
        const results = await new AxeBuilder({ page: p })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze()
        const report = results.violations.flatMap((v) =>
          v.nodes.map((n) => `${v.id}: ${n.target.join(' ')} — ${n.failureSummary ?? v.help}`),
        )
        expect(report).toEqual([])
      })
    }
  })
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  for (const page of pages) {
    test(`${page.path} still shows its content`, async ({ page: p }) => {
      await p.goto(page.path)
      await expect(p.locator('h1')).toBeVisible()
      await expect(p.locator('main')).not.toBeEmpty()
    })
  }
})

test('unknown addresses get the 404 page', async ({ page }) => {
  const response = await page.goto('/quests/no-such-quest')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: /wandered into the fog/i })).toBeVisible()
})

test('v2 addresses redirect to their new homes', async ({ request }) => {
  for (const [from, to] of [
    ['/projects', '/quests'],
    ['/experience', '/chronicle'],
    ['/contact', '/recruit'],
    ['/api/download-cv', '/cv/Tibor_Balint_CV.pdf'],
  ]) {
    const response = await request.get(from!, { maxRedirects: 0 })
    expect(response.status(), from).toBe(308)
    expect(response.headers().location, from).toBe(to)
  }
})

test('the CV is downloadable', async ({ request }) => {
  const response = await request.get('/cv/Tibor_Balint_CV.pdf')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/pdf')
})
