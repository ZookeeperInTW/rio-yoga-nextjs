import { test, expect } from '@playwright/test'

const MEMBER_PHONE = '812345678'
const MEMBER_PASS  = 'password'
const ADMIN_PHONE  = '900000000'
const ADMIN_PASS   = 'admin123'

test.describe('Authentication', () => {
  test('root redirect to /login when not logged in', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('login page renders phone + password fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[name="phone"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('wrong password shows error', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="phone"]', '812345678')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await expect(page.getByText(/incorrect/i)).toBeVisible()
  })

  test('member login redirects to /dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="phone"]', MEMBER_PHONE)
    await page.fill('input[name="password"]', MEMBER_PASS)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
  })

  test('admin login redirects to /admin/calendar', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="phone"]', ADMIN_PHONE)
    await page.fill('input[name="password"]', ADMIN_PASS)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin\/calendar/, { timeout: 10_000 })
  })

  test('protected routes redirect to /login when not authenticated', async ({ page }) => {
    for (const route of ['/dashboard', '/schedule', '/profile', '/packages']) {
      await page.goto(route)
      await expect(page).toHaveURL(/\/login/, { timeout: 5_000 })
    }
  })

  test('admin routes redirect to /login when not authenticated', async ({ page }) => {
    for (const route of ['/admin/calendar', '/admin/bookings', '/admin/members']) {
      await page.goto(route)
      await expect(page).toHaveURL(/\/login/, { timeout: 5_000 })
    }
  })
})
