import { FormEvent, useState } from 'react'
import { calculateExpression } from './api/calculations'

export function App() {
  const [left, setLeft] = useState('2')
  const [right, setRight] = useState('3')
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextExpression = `${left}+${right}`
    setExpression(nextExpression)
    setResult(null)
    setError('')
    setIsSubmitting(true)

    try {
      const response = await calculateExpression(nextExpression)
      setResult(response.result)
    } catch (calculationError) {
      setError(calculationError instanceof Error ? calculationError.message : 'No se pudo calcular la expresion.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section aria-labelledby="app-title" className="scaffold-panel">
        <h1 id="app-title">Calculator App</h1>
        <p>Flujo minimo de suma conectado al backend.</p>

        <form className="sum-form" onSubmit={handleSubmit}>
          <label>
            Primer numero
            <input
              inputMode="decimal"
              name="left"
              onChange={(event) => setLeft(event.target.value)}
              value={left}
            />
          </label>

          <span aria-hidden="true" className="operator">
            +
          </span>

          <label>
            Segundo numero
            <input
              inputMode="decimal"
              name="right"
              onChange={(event) => setRight(event.target.value)}
              value={right}
            />
          </label>

          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Calculando...' : 'Sumar'}
          </button>
        </form>

        <output aria-live="polite" className="result-panel">
          <span>Expresion: {expression || 'Sin calcular'}</span>
          <strong>Resultado: {result ?? '-'}</strong>
        </output>

        {error ? (
          <p className="error-message" role="alert">
            {error}
          </p>
        ) : null}
      </section>
    </main>
  )
}
