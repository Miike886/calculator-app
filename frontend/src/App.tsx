import { useCallback, useEffect, useMemo, useState } from 'react'
import { calculateExpression } from './api/calculations'

type ButtonConfig = {
  label: string
  action: string
  kind?: 'control' | 'operator' | 'equals' | 'blank'
  ariaLabel?: string
}

const buttons: ButtonConfig[] = [
  { label: 'C', action: 'clear', kind: 'control', ariaLabel: 'Limpiar' },
  { label: 'DEL', action: 'delete', kind: 'control', ariaLabel: 'Eliminar ultimo caracter' },
  { label: '', action: 'blank', kind: 'blank' },
  { label: '÷', action: '÷', kind: 'operator', ariaLabel: 'Dividir' },
  { label: '7', action: '7' },
  { label: '8', action: '8' },
  { label: '9', action: '9' },
  { label: '×', action: '×', kind: 'operator', ariaLabel: 'Multiplicar' },
  { label: '4', action: '4' },
  { label: '5', action: '5' },
  { label: '6', action: '6' },
  { label: '−', action: '−', kind: 'operator', ariaLabel: 'Restar' },
  { label: '1', action: '1' },
  { label: '2', action: '2' },
  { label: '3', action: '3' },
  { label: '+', action: '+', kind: 'operator', ariaLabel: 'Sumar' },
  { label: '0', action: '0' },
  { label: '.', action: '.', ariaLabel: 'Punto decimal' },
  { label: '', action: 'blank', kind: 'blank' },
  { label: '=', action: 'equals', kind: 'equals', ariaLabel: 'Calcular' },
]

const operators = ['+', '−', '×', '÷']

function normalizeExpression(expression: string) {
  return expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
}

function isOperator(value: string) {
  return operators.includes(value)
}

function canAppendDecimal(expression: string) {
  const parts = expression.split(/[+−×÷]/)
  const currentNumber = parts[parts.length - 1] ?? ''
  return currentNumber !== '' && !currentNumber.includes('.')
}

function lastCharacter(expression: string) {
  return expression[expression.length - 1] ?? ''
}

function getDisplayError(message: string) {
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes('cero')) {
    return 'No se puede dividir entre cero'
  }

  if (normalizedMessage.includes('operacion') || normalizedMessage.includes('operación')) {
    return 'No fue posible realizar el cálculo'
  }

  if (normalizedMessage.includes('numero') || normalizedMessage.includes('número') || normalizedMessage.includes('operando')) {
    return 'Ingresa un número válido'
  }

  return 'No fue posible realizar el cálculo'
}

export function App() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const displayExpression = expression || '0'
  const displayResult = useMemo(() => {
    if (error) {
      return 'Error'
    }

    if (isSubmitting) {
      return 'Calculando...'
    }

    if (result !== null) {
      return String(result)
    }

    return '0'
  }, [error, isSubmitting, result])

  const appendInput = useCallback((value: string) => {
    setError('')
    setResult(null)
    setExpression((current) => {
      if (/^\d$/.test(value)) {
        return current === '0' ? value : `${current}${value}`
      }

      if (value === '.') {
        return canAppendDecimal(current) ? `${current}.` : current
      }

      if (isOperator(value)) {
        const lastInput = lastCharacter(current)
        if (current === '' || isOperator(lastInput) || lastInput === '.') {
          return current
        }

        return `${current}${value}`
      }

      return current
    })
  }, [])

  const clearAll = useCallback(() => {
    setExpression('')
    setResult(null)
    setError('')
  }, [])

  const deleteLast = useCallback(() => {
    setError('')
    setResult(null)
    setExpression((current) => current.slice(0, -1))
  }, [])

  const submitCalculation = useCallback(async () => {
    if (isSubmitting) {
      return
    }

    const lastInput = lastCharacter(expression)
    if (!expression || isOperator(lastInput) || lastInput === '.') {
      setResult(null)
      setError('Completa la operación')
      return
    }

    setError('')
    setResult(null)
    setIsSubmitting(true)

    try {
      const response = await calculateExpression(normalizeExpression(expression))
      setResult(response.result)
    } catch (calculationError) {
      setError(
        calculationError instanceof Error
          ? getDisplayError(calculationError.message)
          : 'No fue posible realizar el cálculo',
      )
    } finally {
      setIsSubmitting(false)
    }
  }, [expression, isSubmitting])

  const handleAction = useCallback(
    (action: string) => {
      if (action === 'blank') {
        return
      }

      if (action === 'clear') {
        clearAll()
        return
      }

      if (action === 'delete') {
        deleteLast()
        return
      }

      if (action === 'equals') {
        void submitCalculation()
        return
      }

      appendInput(action)
    },
    [appendInput, clearAll, deleteLast, submitCalculation],
  )

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const keyMap: Record<string, string> = {
        '*': '×',
        '/': '÷',
        '-': '−',
        Enter: 'equals',
        Backspace: 'delete',
        Escape: 'clear',
      }

      if (/^\d$/.test(event.key) || event.key === '.' || event.key === '+') {
        event.preventDefault()
        handleAction(event.key)
        return
      }

      const mappedAction = keyMap[event.key]
      if (mappedAction) {
        event.preventDefault()
        handleAction(mappedAction)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleAction])

  return (
    <main className="app-shell">
      <section aria-labelledby="app-title" className="calculator">
        <h1 id="app-title" className="sr-only">
          Calculator App
        </h1>

        <div className={`calculator-display${error ? ' calculator-display-error' : ''}`} aria-live="polite">
          <span className="expression-line" data-testid="expression-display">
            {displayExpression}
          </span>
          <strong className="result-line" data-testid="result-display">
            {displayResult}
          </strong>
          <span className="display-message" data-testid="display-message" role={error ? 'alert' : undefined}>
            {error || (isSubmitting ? 'Procesando operación' : '\u00a0')}
          </span>
        </div>

        <div className="keypad" aria-label="Calculadora">
          {buttons.map((button, index) =>
            button.kind === 'blank' ? (
              <span className="key key-blank" key={`${button.action}-${index}`} aria-hidden="true" />
            ) : (
              <button
                aria-label={button.ariaLabel ?? button.label}
                className={`key key-${button.kind ?? 'number'}`}
                disabled={isSubmitting && button.action === 'equals'}
                key={`${button.action}-${index}`}
                onClick={() => handleAction(button.action)}
                type="button"
              >
                {button.label}
              </button>
            ),
          )}
        </div>
      </section>
    </main>
  )
}
