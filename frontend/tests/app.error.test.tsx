import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../src/App'

describe('App error handling', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows division by zero errors inside the display', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          code: 'DIVISION_BY_ZERO',
          message: 'No se puede dividir entre cero.',
        },
      }),
    } as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '8' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dividir' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('expression-display')).toHaveTextContent('8÷0')
      expect(screen.getByTestId('result-display')).toHaveTextContent('Error')
      expect(screen.getByRole('alert')).toHaveTextContent('No se puede dividir entre cero')
    })
  })

  it('prevents expressions over the visual character limit', () => {
    render(<App />)

    for (let index = 0; index < 49; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: '1' }))
    }

    expect(screen.getByTestId('expression-display')).toHaveTextContent('1'.repeat(48))
    expect(screen.getByRole('alert')).toHaveTextContent('Máximo 48 caracteres')
  })

  it('shows a local validation error for incomplete expressions', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('expression-display')).toHaveTextContent('1+')
      expect(screen.getByTestId('result-display')).toHaveTextContent('Error')
      expect(screen.getByRole('alert')).toHaveTextContent('Completa la operación')
    })
  })

  it('clears errors when the user continues editing', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: 'No se puede dividir entre cero.',
        },
      }),
    } as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '6' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dividir' }))
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('result-display')).toHaveTextContent('Error')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar ultimo caracter' }))

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByTestId('result-display')).toHaveTextContent('0')
    })
  })

  it('shows a local validation error when square root has no operand', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Raiz cuadrada' }))

    expect(screen.getByTestId('result-display')).toHaveTextContent('Error')
    expect(screen.getByRole('alert')).toHaveTextContent('Ingresa un número válido')
  })

  it('shows square root domain errors inside the display', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          code: 'NEGATIVE_SQUARE_ROOT',
          message: 'No se puede calcular la raiz cuadrada de un numero negativo.',
        },
      }),
    } as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Restar' }))
    fireEvent.click(screen.getByRole('button', { name: '9' }))
    fireEvent.click(screen.getByRole('button', { name: 'Raiz cuadrada' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('expression-display')).toHaveTextContent('√(−9)')
      expect(screen.getByTestId('result-display')).toHaveTextContent('Error')
      expect(screen.getByRole('alert')).toHaveTextContent('Raíz inválida')
    })
  })
})
