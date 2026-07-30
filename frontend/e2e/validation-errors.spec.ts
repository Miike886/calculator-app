import { expect, test } from '@playwright/test'
import { openCalculator } from './helpers'

test.beforeEach(async ({ page }) => {
  await openCalculator(page)
})

test('shows division by zero errors inside the display', async ({ page }) => {
  await page.getByRole('button', { name: '8' }).click()
  await page.getByRole('button', { name: 'Dividir' }).click()
  await page.getByRole('button', { name: '0' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('8÷0')
  await expect(page.getByTestId('result-display')).toHaveText('Error')
  await expect(page.getByRole('alert')).toContainText('No se puede dividir entre cero')
})

test('keeps decimal and length validations usable', async ({ page }) => {
  await page.getByRole('button', { name: 'Punto decimal' }).click()
  await page.getByRole('button', { name: '5' }).click()
  await expect(page.getByTestId('expression-display')).toHaveText('0.5')

  await page.getByRole('button', { name: 'Limpiar' }).click()
  for (let index = 0; index < 49; index += 1) {
    await page.getByRole('button', { name: '1' }).click()
  }

  await expect(page.getByTestId('expression-display')).toHaveText('1'.repeat(48))
  await expect(page.getByRole('alert')).toContainText('Máximo 48 caracteres')
})
