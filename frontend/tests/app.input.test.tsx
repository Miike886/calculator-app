import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../src/App'

describe('App input handling', () => {
  afterEach(() => {
    vi.restoreAllMocks()
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

  it('replaces a pending operator before the next operand is entered', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '8' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Restar' }))

    expect(screen.getByTestId('expression-display')).toHaveTextContent('8−')
  })

  it('does not stack pending operators before the next operand is entered', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '8' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Multiplicar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Multiplicar' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))

    expect(screen.getByTestId('expression-display')).toHaveTextContent('8×2')
  })

  it('submits division with a negative divisor', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ expression: '8/-2', result: -4 }),
    } as Response)

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '8' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dividir' }))
    fireEvent.click(screen.getByRole('button', { name: 'Restar' }))
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Calcular' }))

    await waitFor(() => {
      expect(screen.getByTestId('expression-display')).toHaveTextContent('8÷−2')
      expect(screen.getByTestId('result-display')).toHaveTextContent('-4')
    })

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/calculations'),
      expect.objectContaining({
        body: JSON.stringify({ expression: '8/-2' }),
      }),
    )
  })

  it('keeps long expressions available in the display', () => {
    render(<App />)

    for (const value of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4']) {
      fireEvent.click(screen.getByRole('button', { name: value }))
    }

    expect(screen.getByTestId('expression-display')).toHaveTextContent('12345678901234')
  })

  it('starts decimal numbers with a visible leading zero', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Punto decimal' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))

    expect(screen.getByTestId('expression-display')).toHaveTextContent('0.5')
  })

  it('starts a decimal operand after an operator with a visible leading zero', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sumar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Punto decimal' }))
    fireEvent.click(screen.getByRole('button', { name: '5' }))

    expect(screen.getByTestId('expression-display')).toHaveTextContent('1+0.5')
  })
})
