export const operators = ['+', '−', '×', '÷']
export const MAX_EXPRESSION_LENGTH = 48

export type AppendInputState = {
  error: string
  expression: string
  result: number | null
}

export function normalizeExpression(expression: string) {
  return expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
}

export function formatCalculatorNumber(value: number) {
  if (!Number.isFinite(value)) {
    return String(value)
  }

  const rawValue = String(value)
  if (!rawValue.includes('e')) {
    return rawValue === '-0' ? '0' : rawValue
  }

  const [coefficient, exponentValue] = rawValue.split('e')
  const exponent = Number(exponentValue)
  const sign = coefficient.startsWith('-') ? '-' : ''
  const unsignedCoefficient = coefficient.replace('-', '')
  const [integerPart, decimalPart = ''] = unsignedCoefficient.split('.')
  const digits = `${integerPart}${decimalPart}`

  if (exponent >= 0) {
    const decimalPlaces = decimalPart.length
    const zeroCount = exponent - decimalPlaces
    const decimalValue =
      zeroCount >= 0
        ? `${sign}${digits}${'0'.repeat(zeroCount)}`
        : `${sign}${digits.slice(0, exponent + integerPart.length)}.${digits.slice(exponent + integerPart.length)}`

    return decimalValue === '-0' ? '0' : decimalValue
  }

  const leadingZeros = Math.abs(exponent) - 1
  const decimalValue = `${sign}0.${'0'.repeat(leadingZeros)}${digits}`

  return decimalValue === '-0' ? '0' : decimalValue
}

export function isOperator(value: string) {
  return operators.includes(value)
}

export function isWithinExpressionLimit(expression: string) {
  return expression.length <= MAX_EXPRESSION_LENGTH
}

export function lastCharacter(expression: string) {
  return expression[expression.length - 1] ?? ''
}

export function appendInput(expression: string, result: number | null, value: string): AppendInputState {
  const hasResult = result !== null

  if (/^\d$/.test(value)) {
    const baseExpression = hasResult || expression === '0' ? '' : expression
    return completeAppend(baseExpression, value)
  }

  if (value === '.') {
    if (hasResult) {
      return { error: '', expression: '0.', result: null }
    }

    return appendDecimal(expression)
  }

  if (isOperator(value)) {
    const baseExpression = hasResult ? formatCalculatorNumber(result) : expression
    const lastInput = lastCharacter(baseExpression)

    if (isMinusOperator(value) && canAppendNegativeSign(baseExpression)) {
      return completeAppend(baseExpression, value)
    }

    if (baseExpression === '' || lastInput === '.') {
      return { error: '', expression, result: null }
    }

    if (isOperator(lastInput)) {
      return completeAppend(removePendingOperators(baseExpression), value)
    }

    return completeAppend(baseExpression, value)
  }

  return { error: '', expression, result: null }
}

function appendDecimal(expression: string): AppendInputState {
  if (!canAppendDecimal(expression)) {
    return { error: '', expression, result: null }
  }

  const lastInput = lastCharacter(expression)
  const decimalValue = expression === '' || isOperator(lastInput) ? '0.' : '.'
  return completeAppend(expression, decimalValue)
}

function completeAppend(current: string, nextValue: string): AppendInputState {
  const nextExpression = `${current}${nextValue}`

  if (!isWithinExpressionLimit(nextExpression)) {
    return {
      error: `Máximo ${MAX_EXPRESSION_LENGTH} caracteres`,
      expression: current,
      result: null,
    }
  }

  return {
    error: '',
    expression: nextExpression,
    result: null,
  }
}

function isMinusOperator(value: string) {
  return value === '−'
}

function canAppendNegativeSign(expression: string) {
  const lastInput = lastCharacter(expression)
  return expression === '' || lastInput === '×' || lastInput === '÷'
}

function removePendingOperators(expression: string) {
  return expression.replace(/[+−×÷]+−?$/, '')
}

function canAppendDecimal(expression: string) {
  const parts = expression.split(/[+−×÷]/)
  const currentNumber = parts[parts.length - 1] ?? ''
  return !currentNumber.includes('.')
}
