import { API_BASE_URL } from '../config'

export type CalculationResponse = {
  expression: string
  result: number
}

type ErrorResponse = {
  error?: {
    code?: string
    message?: string
  }
}

export async function calculateExpression(expression: string): Promise<CalculationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/calculations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expression }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ErrorResponse
    throw new Error(payload.error?.message ?? 'No se pudo calcular la expresion.')
  }

  const payload = (await response.json().catch(() => null)) as Partial<CalculationResponse> | null

  if (!payload || typeof payload.result !== 'number' || !Number.isFinite(payload.result)) {
    throw new Error('El resultado no es finito.')
  }

  return payload as CalculationResponse
}
