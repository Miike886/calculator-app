import { expect, type Page } from '@playwright/test'

export async function openCalculator(page: Page) {
  await page.goto('/')
  await expect(page.getByTestId('expression-display')).toHaveText('0')
}
