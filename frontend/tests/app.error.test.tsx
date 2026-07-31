import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../src/App'
import { MAX_EXPRESSION_LENGTH } from '../src/calculator'

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

    for (let index = 0; index < MAX_EXPRESSION_LENGTH + 1; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: '1' }))
    }

    expect(screen.getByTestId('expression-display')).toHaveTextContent('1'.repeat(MAX_EXPRESSION_LENGTH))
    expect(screen.getByRole('alert')).toHaveTextContent(`Máximo ${MAX_EXPRESSION_LENGTH} caracteres`)
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

  it('shows network errors inside the display', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('expression-display')).toHaveTextContent('1+2')
      expect(screen.getByTestId('result-display')).toHaveTextContent('Error')
      expect(screen.getByRole('alert')).toHaveTextContent('No fue posible realizar el cálculo')
    })
  })

  it('rejects non-finite API results before rendering them', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        expression: '9^9',
        result: Number.POSITIVE_INFINITY,
      }),
    } as unknown as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '9' }))
    fireEvent.click(screen.getByRole('button', { name: 'Potencia' }))
    fireEvent.click(screen.getByRole('button', { name: '9' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('expression-display')).toHaveTextContent('9^9')
      expect(screen.getByTestId('result-display')).toHaveTextContent('Error')
      expect(screen.getByRole('alert')).toHaveTextContent('Resultado no válido')
    })
  })

  it('handles malformed successful API responses as calculation errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new SyntaxError('Unexpected token')
      },
    } as unknown as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '4' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }))
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('expression-display')).toHaveTextContent('4+4')
      expect(screen.getByTestId('result-display')).toHaveTextContent('Error')
      expect(screen.getByRole('alert')).toHaveTextContent('Resultado no válido')
    })
  })
})
