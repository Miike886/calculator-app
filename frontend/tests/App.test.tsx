import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from '../src/App'

describe('App', () => {
  it('renders the initial scaffold without the final calculator UI', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /calculator app/i })).toBeInTheDocument()
    expect(screen.getByText(/initial scaffold ready/i)).toBeInTheDocument()
  })
})
