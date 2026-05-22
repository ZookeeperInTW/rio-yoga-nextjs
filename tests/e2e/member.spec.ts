import { test, expect } from '@playwright/test'

// Helper: login as member before each test
async function loginMember(page: any) {
  await page.goto('/login')
  await page.fill('input[name="phone"]', '812345678')
  await page.fill('input[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
}

test.describe('Member — Dashboard', () => {
  test('shows greeting and session count', async ({ page }) => {
    await loginMember(page)
    await expect(page.locator('.font-serif').first()).toBeVisible()
    // Package card or "No active package" visible
    await expect(page.getByText(/class|package|booked/i).first()).toBeVisible()
  })

  test('"Book a class" navigates to /book/service', async ({ page }) => {
    await loginMember(page)
    await page.getByRole('link', { name: /book a class/i }).click()
    await expect(page).toHaveURL(/\/book\/service/)
  })

  test('"Buy more" navigates to /packages', async ({ page }) => {
    await loginMember(page)
    const buyMore = page.getByRole('link', { name: /buy more/i })
    if (await buyMore.isVisible()) {
      await buyMore.click()
      await expect(page).toHaveURL(/\/packages/)
    }
  })

  test('"View all →" navigates to /schedule', async ({ page }) => {
    await loginMember(page)
    await page.getByRole('link', { name: /view all/i }).click()
    await expect(page).toHaveURL(/\/schedule/)
  })
})

test.describe('Member — Booking wizard', () => {
  test.beforeEach(async ({ page }) => { await loginMember(page) })

  test('step 1: service selection page loads', async ({ page }) => {
    await page.goto('/book/service')
    await expect(page.getByText(/choose/i)).toBeVisible()
  })

  test('step 2: location page loads with service param', async ({ page }) => {
    await page.goto('/book/location?service=private')
    await expect(page).not.toHaveURL(/\/login/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('step 3: teacher page loads', async ({ page }) => {
    await page.goto('/book/teacher?service=private')
    await expect(page).not.toHaveURL(/\/login/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('step 4: time page loads with slots', async ({ page }) => {
    const today = new Date().toISOString().slice(0, 10)
    await page.goto(`/book/time?service=private&teacher=any&date=${today}`)
    await expect(page).not.toHaveURL(/\/login/)
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Member — Schedule', () => {
  test.beforeEach(async ({ page }) => { await loginMember(page) })

  test('schedule page loads', async ({ page }) => {
    await page.goto('/schedule')
    await expect(page.getByText(/schedule/i)).toBeVisible()
  })

  test('"Book another session" navigates to booking wizard', async ({ page }) => {
    await page.goto('/schedule')
    await page.getByRole('link', { name: /book another/i }).click()
    await expect(page).toHaveURL(/\/book\/service/)
  })
})

test.describe('Member — Profile', () => {
  test.beforeEach(async ({ page }) => { await loginMember(page) })

  test('profile page loads with member name', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByText(/Aria|member/i).first()).toBeVisible()
  })

  test('"All bookings" navigates to /schedule', async ({ page }) => {
    await page.goto('/profile')
    await page.getByRole('link', { name: /all bookings/i }).click()
    await expect(page).toHaveURL(/\/schedule/)
  })

  test('"Package history" navigates to /packages', async ({ page }) => {
    await page.goto('/profile')
    await page.getByRole('link', { name: /package history/i }).click()
    await expect(page).toHaveURL(/\/packages/)
  })

  test('"Buy more classes" navigates to /packages', async ({ page }) => {
    await page.goto('/profile')
    await page.getByRole('link', { name: /buy more/i }).click()
    await expect(page).toHaveURL(/\/packages/)
  })
})

test.describe('Member — Packages', () => {
  test.beforeEach(async ({ page }) => { await loginMember(page) })

  test('packages page shows 3 tiers', async ({ page }) => {
    await page.goto('/packages')
    await expect(page.getByText('5')).toBeVisible()
    await expect(page.getByText('10')).toBeVisible()
    await expect(page.getByText('20')).toBeVisible()
  })

  test('buy button is present for each tier', async ({ page }) => {
    await page.goto('/packages')
    const buyButtons = page.getByRole('button', { name: /buy/i })
    await expect(buyButtons.first()).toBeVisible()
  })
})

test.describe('Member — Tab navigation', () => {
  test.beforeEach(async ({ page }) => { await loginMember(page) })

  test('tab bar navigates to all sections', async ({ page }) => {
    await page.goto('/dashboard')
    // Schedule tab
    await page.getByRole('link', { name: /schedule/i }).click()
    await expect(page).toHaveURL(/\/schedule/)
    // Profile tab
    await page.getByRole('link', { name: /profile/i }).click()
    await expect(page).toHaveURL(/\/profile/)
    // Home tab
    await page.getByRole('link', { name: /home/i }).click()
    await expect(page).toHaveURL(/\/dashboard/)
  })
})
