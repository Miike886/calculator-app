import { expect, test } from '@playwright/test'
import { openCalculator } from './helpers'

test.beforeEach(async ({ page }) => {
  await openCalculator(page)
})

test('calculates a sum using clicks', async ({ page }) => {
  await page.getByRole('button', { name: '1' }).click()
  await page.getByRole('button', { name: 'Sumar' }).click()
  await page.getByRole('button', { name: '2' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('1+2')
  await expect(page.getByTestId('result-display')).toHaveText('3')
})

test('calculates a mixed operation left to right using clicks', async ({ page }) => {
  await page.getByRole('button', { name: '2' }).click()
  await page.getByRole('button', { name: 'Sumar' }).click()
  await page.getByRole('button', { name: '3' }).click()
  await page.getByRole('button', { name: 'Multiplicar' }).click()
  await page.getByRole('button', { name: '4' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('2+3×4')
  await expect(page.getByTestId('result-display')).toHaveText('20')
})

test('calculates several operands in capture order', async ({ page }) => {
  await page.getByRole('button', { name: '1' }).click()
  await page.getByRole('button', { name: '0' }).click()
  await page.getByRole('button', { name: '0' }).click()
  await page.getByRole('button', { name: 'Dividir' }).click()
  await page.getByRole('button', { name: '2' }).click()
  await page.getByRole('button', { name: 'Dividir' }).click()
  await page.getByRole('button', { name: '5' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('100÷2÷5')
  await expect(page.getByTestId('result-display')).toHaveText('10')
})

test('continues calculating from the previous result', async ({ page }) => {
  await page.getByRole('button', { name: '5' }).click()
  await page.getByRole('button', { name: 'Sumar' }).click()
  await page.getByRole('button', { name: '5' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()
  await expect(page.getByTestId('result-display')).toHaveText('10')

  await page.getByRole('button', { name: 'Multiplicar' }).click()
  await page.getByRole('button', { name: '2' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('10×2')
  await expect(page.getByTestId('result-display')).toHaveText('20')
})
