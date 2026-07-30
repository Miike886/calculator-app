import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../src/App'

describe('App calculation flow', () => {
  afterEach(() => {
    vi.restoreAllMocks()
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

  it('normalizes multiplication and division symbols before calling the API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ expression: '6*7', result: 42 }),
    } as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '6' }))
    fireEvent.click(screen.getByRole('button', { name: 'Multiplicar' }))
    fireEvent.click(screen.getByRole('button', { name: '7' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('result-display')).toHaveTextContent('42')
    })

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/calculations'),
      expect.objectContaining({
        body: JSON.stringify({ expression: '6*7' }),
      }),
    )
  })

  it('submits multiple operands in capture order', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ expression: '100/2/5', result: 10 }),
    } as Response)

    render(<App />)

    for (const value of ['1', '0', '0']) {
      fireEvent.click(screen.getByRole('button', { name: value }))
    }
    fireEvent.click(screen.getByRole('button', { name: 'Dividir' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dividir' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('result-display')).toHaveTextContent('10')
    })

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/calculations'),
      expect.objectContaining({
        body: JSON.stringify({ expression: '100/2/5' }),
      }),
    )
  })

  it('continues calculating from the previous result when an operator is selected', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expression: '5+5', result: 10 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expression: '10*2', result: 20 }),
      } as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('result-display')).toHaveTextContent('10')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Multiplicar' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('expression-display')).toHaveTextContent('10×2')
      expect(screen.getByTestId('result-display')).toHaveTextContent('20')
    })

    expect(globalThis.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('/api/v1/calculations'),
      expect.objectContaining({
        body: JSON.stringify({ expression: '10*2' }),
      }),
    )
  })

  it('starts a new operation after a result when a number is entered', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ expression: '5+5', result: 10 }),
    } as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('result-display')).toHaveTextContent('10')
    })

    fireEvent.click(screen.getByRole('button', { name: '7' }))

    expect(screen.getByTestId('expression-display')).toHaveTextContent('7')
    expect(screen.getByTestId('result-display')).toHaveTextContent('0')
  })

  it('continues from large results without scientific notation in the expression', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expression: '99999999999999*99999999999999', result: 9.9999999999998e27 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ expression: '9999999999999800000000000000+2', result: 9.9999999999998e27 }),
      } as Response)

    render(<App />)

    for (const value of Array(14).fill('9')) {
      fireEvent.click(screen.getByRole('button', { name: value }))
    }
    fireEvent.click(screen.getByRole('button', { name: 'Multiplicar' }))
    for (const value of Array(14).fill('9')) {
      fireEvent.click(screen.getByRole('button', { name: value }))
    }
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('result-display')).toHaveTextContent('9999999999999800000000000000')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))

    expect(screen.getByTestId('expression-display')).toHaveTextContent('9999999999999800000000000000+2')
    expect(screen.getByTestId('expression-display')).not.toHaveTextContent('e')
  })
})
