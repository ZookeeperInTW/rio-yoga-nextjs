import { test, expect } from '@playwright/test'

async function loginAdmin(page: any) {
  await page.goto('/login')
  await page.fill('input[name="phone"]', '900000000')
  await page.fill('input[name="password"]', 'admin123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/admin\/calendar/, { timeout: 10_000 })
}

test.describe('Admin — Sidebar navigation', () => {
  test.beforeEach(async ({ page }) => { await loginAdmin(page) })

  const PAGES = [
    { label: 'Calendar',  url: /\/admin\/calendar/  },
    { label: 'Bookings',  url: /\/admin\/bookings/  },
    { label: 'Teachers',  url: /\/admin\/teachers/  },
    { label: 'Branches',  url: /\/admin\/branches/  },
    { label: 'Members',   url: /\/admin\/members/   },
    { label: 'Reports',   url: /\/admin\/reports/   },
    { label: 'Settings',  url: /\/admin\/settings/  },
  ]

  for (const p of PAGES) {
    test(`sidebar "${p.label}" navigates correctly`, async ({ page }) => {
      await page.getByRole('link', { name: p.label }).click()
      await expect(page).toHaveURL(p.url)
      await expect(page.locator('main')).toBeVisible()
    })
  }
})

test.describe('Admin — Calendar', () => {
  test.beforeEach(async ({ page }) => { await loginAdmin(page) })

  test('calendar page loads with date header', async ({ page }) => {
    await page.goto('/admin/calendar')
    await expect(page.getByText(/calendar/i)).toBeVisible()
  })

  test('branch selector buttons are visible', async ({ page }) => {
    await page.goto('/admin/calendar')
    await expect(page.getByRole('button', { name: /sukhumvit|thonglor|sathorn/i }).first()).toBeVisible()
  })

  test('"New booking" button opens modal', async ({ page }) => {
    await page.goto('/admin/calendar')
    await page.getByRole('button', { name: /new booking/i }).click()
    await expect(page.getByText(/walk-in/i)).toBeVisible()
  })

  test('modal can be closed', async ({ page }) => {
    await page.goto('/admin/calendar')
    await page.getByRole('button', { name: /new booking/i }).click()
    await page.getByRole('button', { name: /cancel/i }).click()
    await expect(page.getByText(/walk-in/i)).not.toBeVisible()
  })

  test('date navigation changes date', async ({ page }) => {
    await page.goto('/admin/calendar')
    const before = page.url()
    await page.locator('input[type="date"]').first().fill('2026-06-01')
    await page.locator('input[type="date"]').first().press('Enter')
    await expect(page).not.toHaveURL(before)
  })
})

test.describe('Admin — Bookings', () => {
  test.beforeEach(async ({ page }) => { await loginAdmin(page) })

  test('bookings page loads with table', async ({ page }) => {
    await page.goto('/admin/bookings')
    await expect(page.getByText(/bookings/i)).toBeVisible()
    await expect(page.locator('table')).toBeVisible()
  })

  test('search filters booking list', async ({ page }) => {
    await page.goto('/admin/bookings')
    const searchInput = page.getByPlaceholder(/search/i)
    await searchInput.fill('zzznomatch')
    await expect(page.getByText(/no bookings/i)).toBeVisible()
  })
})

test.describe('Admin — Teachers', () => {
  test.beforeEach(async ({ page }) => { await loginAdmin(page) })

  test('teachers page lists teachers', async ({ page }) => {
    await page.goto('/admin/teachers')
    await expect(page.getByText(/teachers/i)).toBeVisible()
  })

  test('clicking a teacher shows their detail panel', async ({ page }) => {
    await page.goto('/admin/teachers')
    const firstTeacher = page.locator('button.w-full').first()
    await firstTeacher.click()
    await expect(page.getByText(/weekly availability/i)).toBeVisible()
  })
})

test.describe('Admin — Branches', () => {
  test.beforeEach(async ({ page }) => { await loginAdmin(page) })

  test('branches page shows branch cards', async ({ page }) => {
    await page.goto('/admin/branches')
    await expect(page.getByText(/branches/i)).toBeVisible()
    await expect(page.getByText(/sukhumvit/i)).toBeVisible()
  })

  test('switching branch shows studios', async ({ page }) => {
    await page.goto('/admin/branches')
    const branches = page.getByRole('button', { name: /thonglor/i })
    if (await branches.isVisible()) {
      await branches.click()
      await expect(page.getByText(/studios at/i)).toBeVisible()
    }
  })
})

test.describe('Admin — Members', () => {
  test.beforeEach(async ({ page }) => { await loginAdmin(page) })

  test('members page loads with table', async ({ page }) => {
    await page.goto('/admin/members')
    await expect(page.getByText(/members/i)).toBeVisible()
    await expect(page.locator('table')).toBeVisible()
  })

  test('search filters members', async ({ page }) => {
    await page.goto('/admin/members')
    await page.getByPlaceholder(/search/i).fill('Aria')
    await expect(page.getByText(/Aria/)).toBeVisible()
  })
})

test.describe('Admin — Reports', () => {
  test.beforeEach(async ({ page }) => { await loginAdmin(page) })

  test('reports page shows stats', async ({ page }) => {
    await page.goto('/admin/reports')
    await expect(page.getByText(/total bookings/i)).toBeVisible()
    await expect(page.getByText(/active members/i)).toBeVisible()
  })
})

test.describe('Admin — Settings', () => {
  test.beforeEach(async ({ page }) => { await loginAdmin(page) })

  test('settings page loads', async ({ page }) => {
    await page.goto('/admin/settings')
    await expect(page.getByText(/settings/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible()
  })
})
