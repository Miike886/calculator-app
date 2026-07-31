import { expect, test } from '@playwright/test'
import { openCalculator } from './helpers'

test.beforeEach(async ({ page }) => {
  await openCalculator(page)
})

test('shows backend or network errors inside the display', async ({ page }) => {
  await page.route('**/api/v1/calculations', async (route) => {
    await route.abort('failed')
  })

  await page.getByRole('button', { name: '1' }).click()
  await page.getByRole('button', { name: 'Sumar' }).click()
  await page.getByRole('button', { name: '2' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('1+2')
  await expect(page.getByTestId('result-display')).toHaveText('Error')
  await expect(page.getByRole('alert')).toContainText('No fue posible realizar el cálculo')
})
