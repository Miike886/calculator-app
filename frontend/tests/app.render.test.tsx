import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from '../src/App'

describe('App render', () => {
  it('renders the visual calculator controls', () => {
    render(<App />)

    expect(screen.getByTestId('expression-display')).toHaveTextContent('0')
    expect(screen.getByTestId('result-display')).toHaveTextContent('0')
    expect(screen.getByTestId('display-message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Punto decimal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Potencia' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Raiz cuadrada' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Porcentaje' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Calcular' })).toBeInTheDocument()
  })
})
