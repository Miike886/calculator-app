import { expect, test } from '@playwright/test'
import { openCalculator } from './helpers'

test.beforeEach(async ({ page }) => {
  await openCalculator(page)
})

test('calculates using keyboard and Enter', async ({ page }) => {
  await page.evaluate(() => window.focus())
  await page.keyboard.press('8')
  await page.keyboard.press('/')
  await page.keyboard.press('2')
  await page.keyboard.press('Enter')

  await expect(page.getByTestId('expression-display')).toHaveText('8÷2')
  await expect(page.getByTestId('result-display')).toHaveText('4')
})

test('supports Backspace, DEL, Escape and C', async ({ page }) => {
  await page.evaluate(() => window.focus())
  await page.keyboard.press('8')
  await page.keyboard.press('+')
  await page.keyboard.press('3')
  await page.keyboard.press('Backspace')
  await expect(page.getByTestId('expression-display')).toHaveText('8+')

  await page.getByRole('button', { name: '2' }).click()
  await page.getByRole('button', { name: 'Eliminar ultimo caracter' }).click()
  await expect(page.getByTestId('expression-display')).toHaveText('8+')

  await page.keyboard.press('Escape')
  await expect(page.getByTestId('expression-display')).toHaveText('0')

  await page.getByRole('button', { name: '9' }).click()
  await page.getByRole('button', { name: 'Limpiar' }).click()
  await expect(page.getByTestId('expression-display')).toHaveText('0')
})
