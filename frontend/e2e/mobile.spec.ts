import { expect, test } from '@playwright/test'
import { openCalculator } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await openCalculator(page)
})

test('supports a basic calculation in a mobile viewport', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Limpiar' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Calcular' })).toBeVisible()

  await page.getByRole('button', { name: '1' }).click()
  await page.getByRole('button', { name: 'Sumar' }).click()
  await page.getByRole('button', { name: '2' }).click()
  await page.getByRole('button', { name: 'Calcular' }).click()

  await expect(page.getByTestId('expression-display')).toHaveText('1+2')
  await expect(page.getByTestId('result-display')).toHaveText('3')
})

test('keeps wide action keys aligned to the keypad grid', async ({ page }) => {
  const deleteBox = await page.getByRole('button', { name: 'Eliminar ultimo caracter' }).boundingBox()
  const equalsBox = await page.getByRole('button', { name: 'Calcular' }).boundingBox()
  const divideBox = await page.getByRole('button', { name: 'Dividir' }).boundingBox()
  const zeroBox = await page.getByRole('button', { name: '0' }).boundingBox()

  expect(deleteBox).not.toBeNull()
  expect(equalsBox).not.toBeNull()
  expect(divideBox).not.toBeNull()
  expect(zeroBox).not.toBeNull()

  const rightEdge = (box: NonNullable<typeof deleteBox>) => box.x + box.width

  expect(Math.abs(rightEdge(deleteBox!) - rightEdge(divideBox!))).toBeLessThanOrEqual(1)
  expect(Math.abs(rightEdge(equalsBox!) - rightEdge(divideBox!))).toBeLessThanOrEqual(1)
  expect(Math.abs(deleteBox!.height - divideBox!.height)).toBeLessThanOrEqual(1)
  expect(Math.abs(equalsBox!.height - zeroBox!.height)).toBeLessThanOrEqual(1)
})
