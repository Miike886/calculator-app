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
    expect(normalizeExpression('8÷−2+3×4^2%10+√(81)')).toBe('8/-2+3*4^2%10+sqrt(81)')
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
    expect(appendInput('8+^', null, '%').expression).toBe('8%')
  })

  it('allows negative operands after multiplication, division, power and percentage', () => {
    expect(appendInput('8÷', null, '−').expression).toBe('8÷−')
    expect(appendInput('8×', null, '−').expression).toBe('8×−')
    expect(appendInput('8^', null, '−').expression).toBe('8^−')
    expect(appendInput('8%', null, '−').expression).toBe('8%−')
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

  it('wraps the current operand with square root', () => {
    expect(appendInput('9', null, '√').expression).toBe('√(9)')
    expect(appendInput('2+9', null, '√').expression).toBe('2+√(9)')
    expect(appendInput('−9', null, '√').expression).toBe('√(−9)')
  })

  it('continues from a previous result when square root is entered', () => {
    expect(appendInput('5+4', 9, '√').expression).toBe('√(9)')
  })

  it('rejects square root without a complete operand', () => {
    expect(appendInput('', null, '√').error).toBe('Ingresa un número válido')
    expect(appendInput('2+', null, '√').error).toBe('Ingresa un número válido')
    expect(appendInput('2.', null, '√').error).toBe('Ingresa un número válido')
  })
})
