import { render, screen } from '@testing-library/react'
import { fireEvent, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../src/App'

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the minimal sum flow', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /calculator app/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sumar/i })).toBeInTheDocument()
    expect(screen.getByText(/resultado: -/i)).toBeInTheDocument()
  })

  it('submits a sum and renders the backend result', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ expression: '4+6', result: 10 }),
    } as Response)

    render(<App />)

    fireEvent.change(screen.getByLabelText(/primer numero/i), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText(/segundo numero/i), { target: { value: '6' } })
    fireEvent.click(screen.getByRole('button', { name: /sumar/i }))

    await waitFor(() => {
      expect(screen.getByText(/resultado: 10/i)).toBeInTheDocument()
    })

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/calculations'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ expression: '4+6' }),
      }),
    )
  })

  it('renders an error returned by the backend', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: 'La expresion no puede estar vacia.',
        },
      }),
    } as Response)

    render(<App />)

    fireEvent.change(screen.getByLabelText(/primer numero/i), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText(/segundo numero/i), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: /sumar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('La expresion no puede estar vacia.')
    })
  })
})
