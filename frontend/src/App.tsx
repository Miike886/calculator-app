import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { calculateExpression } from './api/calculations'
import {
  MAX_EXPRESSION_LENGTH,
  appendInput as appendCalculatorInput,
  formatCalculatorNumber,
  isOperator,
  isWithinExpressionLimit,
  lastCharacter,
  normalizeExpression,
} from './calculator'

type ButtonConfig = {
  label: string
  action: string
  kind?: 'control' | 'operator' | 'equals' | 'blank'
  ariaLabel?: string
}

const buttons: ButtonConfig[] = [
  { label: 'C', action: 'clear', kind: 'control', ariaLabel: 'Limpiar' },
  { label: 'DEL', action: 'delete', kind: 'control', ariaLabel: 'Eliminar ultimo caracter' },
  { label: '√', action: '√', kind: 'operator', ariaLabel: 'Raiz cuadrada' },
  { label: '÷', action: '÷', kind: 'operator', ariaLabel: 'Dividir' },
  { label: '^', action: '^', kind: 'operator', ariaLabel: 'Potencia' },
  { label: '%', action: '%', kind: 'operator', ariaLabel: 'Porcentaje' },
  { label: '', action: 'blank', kind: 'blank' },
  { label: '×', action: '×', kind: 'operator', ariaLabel: 'Multiplicar' },
  { label: '7', action: '7' },
  { label: '8', action: '8' },
  { label: '9', action: '9' },
  { label: '−', action: '−', kind: 'operator', ariaLabel: 'Restar' },
  { label: '4', action: '4' },
  { label: '5', action: '5' },
  { label: '6', action: '6' },
  { label: '+', action: '+', kind: 'operator', ariaLabel: 'Sumar' },
  { label: '1', action: '1' },
  { label: '2', action: '2' },
  { label: '3', action: '3' },
  { label: '=', action: 'equals', kind: 'equals', ariaLabel: 'Calcular' },
  { label: '0', action: '0' },
  { label: '.', action: '.', ariaLabel: 'Punto decimal' },
  { label: '', action: 'blank', kind: 'blank' },
  { label: '', action: 'blank', kind: 'blank' },
]

function getDisplayError(message: string) {
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes('cero')) {
    return 'No se puede dividir entre cero'
  }

  if (normalizedMessage.includes('raiz') || normalizedMessage.includes('raíz')) {
    return 'Raíz inválida'
  }

  if (normalizedMessage.includes('finito')) {
    return 'Resultado no válido'
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
  const expressionDisplayRef = useRef<HTMLSpanElement>(null)
  const resultDisplayRef = useRef<HTMLElement>(null)

  const displayExpression = expression || '0'
  const expressionLimitText = `${expression.length}/${MAX_EXPRESSION_LENGTH}`
  const displayResult = useMemo(() => {
    if (error) {
      return 'Error'
    }

    if (isSubmitting) {
      return 'Calculando...'
    }

    if (result !== null) {
      return formatCalculatorNumber(result)
    }

    return '0'
  }, [error, isSubmitting, result])

  const appendInput = useCallback(
    (value: string) => {
      const hasResult = result !== null

      setError('')
      setResult(null)
      setExpression((current) => {
        const nextState = appendCalculatorInput(current, hasResult ? result : null, value)
        setError(nextState.error)
        return nextState.expression
      })
    },
    [result],
  )

  useEffect(() => {
    const expressionDisplay = expressionDisplayRef.current
    const resultDisplay = resultDisplayRef.current

    if (expressionDisplay) {
      expressionDisplay.scrollLeft = expressionDisplay.scrollWidth
    }

    if (resultDisplay) {
      resultDisplay.scrollLeft = resultDisplay.scrollWidth
    }
  }, [displayExpression, displayResult])

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

    if (!isWithinExpressionLimit(expression)) {
      setResult(null)
      setError(`Máximo ${MAX_EXPRESSION_LENGTH} caracteres`)
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
        '^': '^',
        '%': '%',
        r: '√',
        R: '√',
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
          <span className="expression-line" data-testid="expression-display" ref={expressionDisplayRef}>
            {displayExpression}
          </span>
          <strong className="result-line" data-testid="result-display" ref={resultDisplayRef}>
            {displayResult}
          </strong>
          <span className="display-message" data-testid="display-message" role={error ? 'alert' : undefined}>
            {error || (isSubmitting ? 'Procesando operación' : expressionLimitText)}
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
