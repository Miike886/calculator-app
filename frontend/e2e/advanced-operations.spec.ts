import { expect, test } from '@playwright/test'
import { openCalculator } from './helpers'

test.beforeEach(async ({ page }) => {
  await openCalculator(page)
})

test('calculates power using clicks', async ({ page }) => {
  await page.getByRole('button', { name: '2' }).click()
  await page.getByRole('button', { name: 'Potencia' }).click()
  await page.getByRole('button', { name: '3' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('2^3')
  await expect(page.getByTestId('result-display')).toHaveText('8')
})

test('calculates square root and continues with percentage', async ({ page }) => {
  await page.getByRole('button', { name: '8' }).click()
  await page.getByRole('button', { name: '1' }).click()
  await page.getByRole('button', { name: 'Raiz cuadrada' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()
  await expect(page.getByTestId('result-display')).toHaveText('9')

  await page.getByRole('button', { name: 'Porcentaje' }).click()
  await page.getByRole('button', { name: '5' }).click()
  await page.getByRole('button', { name: '0' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('9%50')
  await expect(page.getByTestId('result-display')).toHaveText('4.5')
})

test('shows square root errors inside the display', async ({ page }) => {
  await page.getByRole('button', { name: 'Restar' }).click()
  await page.getByRole('button', { name: '9' }).click()
  await page.getByRole('button', { name: 'Raiz cuadrada' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('√(−9)')
  await expect(page.getByTestId('result-display')).toHaveText('Error')
  await expect(page.getByRole('alert')).toContainText('Raíz inválida')
})

test('calculates square root with mixed operation precedence', async ({ page }) => {
  await page.getByRole('button', { name: '1' }).click()
  await page.getByRole('button', { name: '6' }).click()
  await page.getByRole('button', { name: 'Raiz cuadrada' }).click()
  await page.getByRole('button', { name: 'Sumar' }).click()
  await page.getByRole('button', { name: '2' }).click()
  await page.getByRole('button', { name: 'Multiplicar' }).click()
  await page.getByRole('button', { name: '3' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('√(16)+2×3')
  await expect(page.getByTestId('result-display')).toHaveText('10')
})

test('shows non-finite result errors inside the display', async ({ page }) => {
  for (let index = 0; index < 10; index += 1) {
    await page.getByRole('button', { name: '9' }).click()
  }

  await page.getByRole('button', { name: 'Potencia' }).click()

  for (let index = 0; index < 10; index += 1) {
    await page.getByRole('button', { name: '9' }).click()
  }

  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('9999999999^9999999999')
  await expect(page.getByTestId('result-display')).toHaveText('Error')
  await expect(page.getByRole('alert')).toContainText('Resultado no válido')
})
