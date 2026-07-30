import { describe, expect, it } from 'vitest'
import {
  MAX_EXPRESSION_LENGTH,
  appendInput,
  formatCalculatorNumber,
  isWithinExpressionLimit,
  normalizeExpression,
} from '../src/calculator'

describe('calculator state helpers', () => {
  it('normalizes visual operators for the API contract', () => {
    expect(normalizeExpression('8÷−2+3×4')).toBe('8/-2+3*4')
  })

  it('starts decimal operands with a visible leading zero', () => {
    expect(appendInput('', null, '.').expression).toBe('0.')
    expect(appendInput('1+', null, '.').expression).toBe('1+0.')
  })

  it('prevents multiple decimal points in the same operand', () => {
    expect(appendInput('1.2', null, '.').expression).toBe('1.2')
  })

  it('replaces stacked pending operators with the latest operator', () => {
    expect(appendInput('8+', null, '×').expression).toBe('8×')
    expect(appendInput('8+×', null, '÷').expression).toBe('8÷')
  })

  it('allows negative operands after multiplication and division', () => {
    expect(appendInput('8÷', null, '−').expression).toBe('8÷−')
    expect(appendInput('8×', null, '−').expression).toBe('8×−')
  })

  it('continues from a previous result when an operator is entered', () => {
    expect(appendInput('5+5', 10, '×').expression).toBe('10×')
  })

  it('starts a new expression from a previous result when a digit is entered', () => {
    expect(appendInput('5+5', 10, '7').expression).toBe('7')
  })

  it('enforces the expression length limit', () => {
    const fullExpression = '1'.repeat(MAX_EXPRESSION_LENGTH)
    const nextState = appendInput(fullExpression, null, '1')

    expect(isWithinExpressionLimit(fullExpression)).toBe(true)
    expect(nextState.expression).toBe(fullExpression)
    expect(nextState.error).toBe(`Máximo ${MAX_EXPRESSION_LENGTH} caracteres`)
  })

  it('formats scientific notation as parser-compatible decimal text', () => {
    expect(formatCalculatorNumber(9.9999999999998e27)).toBe('9999999999999800000000000000')
  })
})
