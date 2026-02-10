import { test, expect } from '@playwright/test'

test('home loads and has featured section', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /I build fast, polished web experiences/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Featured/i })).toBeVisible()
})

test('cv download endpoint responds', async ({ request }) => {
  const res = await request.get('/api/download-cv')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('application/pdf')
})
