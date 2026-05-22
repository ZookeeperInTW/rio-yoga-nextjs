import { test, expect } from '@playwright/test'

async function loginMember(page: any) {
  await page.goto('/login')
  await page.fill('input[name="phone"]', '812345678')
  await page.fill('input[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
}

async function loginAdmin(page: any) {
  await page.goto('/login')
  await page.fill('input[name="phone"]', '900000000')
  await page.fill('input[name="password"]', 'admin123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/admin\/calendar/, { timeout: 10_000 })
}

test.describe('No 404s — Member routes', () => {
  test.beforeEach(async ({ page }) => { await loginMember(page) })

  const MEMBER_ROUTES = [
    '/dashboard',
    '/schedule',
    '/profile',
    '/packages',
    '/book/service',
    '/book/location?service=private',
    '/book/teacher?service=private',
    '/book/time?service=private&teacher=any',
  ]

  for (const route of MEMBER_ROUTES) {
    test(`${route} returns 200`, async ({ page }) => {
      const res = await page.goto(route)
      expect(res?.status()).not.toBe(404)
      expect(res?.status()).not.toBe(500)
    })
  }
})

test.describe('No 404s — Admin routes', () => {
  test.beforeEach(async ({ page }) => { await loginAdmin(page) })

  const ADMIN_ROUTES = [
    '/admin/calendar',
    '/admin/bookings',
    '/admin/teachers',
    '/admin/branches',
    '/admin/members',
    '/admin/reports',
    '/admin/settings',
  ]

  for (const route of ADMIN_ROUTES) {
    test(`${route} returns 200`, async ({ page }) => {
      const res = await page.goto(route)
      expect(res?.status()).not.toBe(404)
      expect(res?.status()).not.toBe(500)
    })
  }
})

test.describe('Dark mode toggle', () => {
  test('toggle adds/removes dark class on html', async ({ page }) => {
    await loginMember(page)
    await page.goto('/profile')
    const toggle = page.locator('button[style*="--surface2"]').last()
    const html = page.locator('html')
    await toggle.click()
    await expect(html).toHaveClass(/dark/)
    await toggle.click()
    await expect(html).not.toHaveClass(/dark/)
  })
})
