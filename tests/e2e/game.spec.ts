import { expect, test, type Page } from '@playwright/test'

/** A toast only appears once the client islands have hydrated and handled the visit. */
async function toast(page: Page, title: string) {
  const status = page.getByRole('status').filter({ hasText: 'Achievement unlocked' })
  await expect(status).toContainText(title)
}

test.describe('game layer', () => {
  test('a first visit unlocks "Press Start" and announces it', async ({ page }) => {
    await page.goto('/')
    await toast(page, 'Press Start')
  })

  test('progress survives a reload and shows in the codex', async ({ page }) => {
    await page.goto('/skills')
    await toast(page, 'Scholar')
    await page.goto('/codex')
    await page.reload()
    const scholar = page.getByRole('listitem').filter({ hasText: 'Studied the skill tree.' })
    await expect(scholar).toContainText('Unlocked')
  })

  test('the command palette opens with the keyboard and navigates', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard shortcut')
    await page.goto('/')
    await toast(page, 'Press Start')
    await page.keyboard.press('/')
    const dialog = page.getByRole('dialog', { name: 'Command palette' })
    await expect(dialog).toBeVisible()
    await page.getByRole('combobox').fill('chron')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/chronicle$/)
    await expect(dialog).toBeHidden()
  })

  test('number keys travel between regions', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard shortcut')
    await page.goto('/')
    await toast(page, 'Press Start')
    await page.keyboard.press('3')
    await expect(page).toHaveURL(/\/skills$/)
  })

  test('the theme toggle switches and remembers', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    const before = await html.getAttribute('data-theme')
    await page.getByRole('button', { name: /Switch to/ }).click()
    await expect(html).not.toHaveAttribute('data-theme', before ?? '')
    await page.reload()
    await expect(html).not.toHaveAttribute('data-theme', before ?? '')
  })

  test('item cards open on click', async ({ page }) => {
    await page.goto('/skills')
    await page
      .getByRole('button', { name: /TypeScript/ })
      .first()
      .click()
    await expect(page.getByText('Strict mode everywhere', { exact: false })).toBeVisible()
  })

  test('tampered progress resets instead of crashing the codex', async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem(
        'portfolio.progress.v1',
        JSON.stringify({ version: 1, visited: [], events: [], unlocked: { scholar: 'x' } }),
      ),
    )
    await page.goto('/codex')
    await expect(page.getByRole('heading', { name: 'Codex' })).toBeVisible()
    await expect(
      page.getByRole('listitem').filter({ hasText: 'Studied the skill tree.' }),
    ).toContainText('Locked')
  })

  test('storage that cannot be read does not break the page', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('portfolio.progress.v1', '{broken'))
    await page.goto('/codex')
    await expect(page.getByRole('heading', { name: 'Codex' })).toBeVisible()
  })
})

test.describe('recruit form', () => {
  test('validates before sending', async ({ page }) => {
    await page.goto('/recruit')
    await page.getByRole('button', { name: 'Send the raven' }).click()
    await expect(page.getByText('Tell me who you are.')).toBeVisible()
    await expect(page.getByLabel('Name')).toBeFocused()
  })

  test('sends to Netlify Forms and forms the party', async ({ page }) => {
    let body = ''
    await page.route('/__forms.html', async (route) => {
      body = route.request().postData() ?? ''
      await route.fulfill({ status: 200, body: 'ok' })
    })
    await page.goto('/recruit')
    await page.getByLabel('A freelance project').check()
    await page.getByLabel('Name').fill('Ada Lovelace')
    await page.getByLabel('E-mail').fill('ada@example.com')
    await page.getByLabel('The quest').fill('We need a bilingual marketing site by spring.')
    await page.getByRole('button', { name: 'Send the raven' }).click()
    await expect(page.getByText('Party formed.')).toBeVisible()
    expect(body).toContain('form-name=contact')
    expect(body).toContain('intent=freelance')
  })
})

test.describe('screens', () => {
  test('the before/after slider moves with the keyboard', async ({ page }) => {
    await page.goto('/quests/ravioly')
    const slider = page.getByRole('slider')
    await expect(slider).toHaveValue('50')
    await slider.focus()
    await page.keyboard.press('ArrowRight')
    await expect(slider).toHaveValue('51')
  })
})

test.describe('call requests', () => {
  test('the sheet button opens the call option, which asks for days and a time', async ({
    page,
  }) => {
    let body = ''
    await page.route('/__forms.html', async (route) => {
      body = route.request().postData() ?? ''
      await route.fulfill({ status: 200, body: 'ok' })
    })
    await page.goto('/')
    await page.getByRole('link', { name: 'Request a 15-minute call' }).click()
    await expect(page).toHaveURL(/\/recruit#call$/)
    await expect(page.getByLabel('A quick call')).toBeChecked()

    await page.getByLabel('Name').fill('Ada Lovelace')
    await page.getByLabel('E-mail').fill('ada@example.com')
    await page
      .getByLabel('What would you like to talk about?')
      .fill('A three-month frontend contract, remote.')
    await page.getByRole('button', { name: 'Send the raven' }).click()
    await expect(page.getByText('Pick at least one day that suits you.')).toBeVisible()
    await expect(page.getByText('Pick a time of day.')).toBeVisible()

    await page.getByLabel('Tue').check()
    await page.getByLabel('Thu').check()
    await page.getByLabel(/^Afternoon/).check()
    await page.getByRole('button', { name: 'Send the raven' }).click()
    await expect(page.getByText('Party formed.')).toBeVisible()
    expect(body).toContain('intent=call')
    expect(body).toContain('callDays=Tue%2CThu')
    expect(body).toContain('callTime=afternoon')
    expect(body).not.toContain('day=')
  })
})
