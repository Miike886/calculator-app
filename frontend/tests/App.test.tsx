import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../src/App'

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the visual calculator controls', () => {
    render(<App />)

    expect(screen.getByTestId('expression-display')).toHaveTextContent('0')
    expect(screen.getByTestId('result-display')).toHaveTextContent('0')
    expect(screen.getByTestId('display-message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Punto decimal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Calcular' })).toBeInTheDocument()
  })

  it('uses click input to submit a sum and render the backend result', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ expression: '12+3', result: 15 }),
    } as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('result-display')).toHaveTextContent('15')
    })

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/calculations'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ expression: '12+3' }),
      }),
    )
  })

  it('uses keyboard input with Enter, Backspace and Escape', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ expression: '8+1', result: 9 }),
    } as Response)

    render(<App />)

    fireEvent.keyDown(window, { key: '8' })
    fireEvent.keyDown(window, { key: '+' })
    fireEvent.keyDown(window, { key: '2' })
    fireEvent.keyDown(window, { key: 'Backspace' })
    fireEvent.keyDown(window, { key: '1' })
    fireEvent.keyDown(window, { key: 'Enter' })

    await waitFor(() => {
      expect(screen.getByTestId('result-display')).toHaveTextContent('9')
    })

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(screen.getByTestId('expression-display')).toHaveTextContent('0')
    expect(screen.getByTestId('result-display')).toHaveTextContent('0')
  })

  it('normalizes multiplication and division symbols before calling the API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: 'La operacion no esta soportada en esta version.',
        },
      }),
    } as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '6' }))
    fireEvent.click(screen.getByRole('button', { name: 'Multiplicar' }))
    fireEvent.click(screen.getByRole('button', { name: '7' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('result-display')).toHaveTextContent('Error')
      expect(screen.getByRole('alert')).toHaveTextContent('No fue posible realizar el cálculo')
    })

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/calculations'),
      expect.objectContaining({
        body: JSON.stringify({ expression: '6*7' }),
      }),
    )
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
          message: 'La operacion no esta soportada en esta version.',
        },
      }),
    } as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '6' }))
    fireEvent.click(screen.getByRole('button', { name: 'Multiplicar' }))
    fireEvent.click(screen.getByRole('button', { name: '7' }))
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
})
