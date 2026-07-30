# FEAT-002 - Flujo minimo de suma

## Objetivo

Comprobar el flujo vertical minimo `React -> REST API -> Go -> resultado -> React` mediante una suma, sin implementar todavia todas las operaciones ni la UI visual completa de calculadora.

## Estado

Implementada y validada.

## Comportamiento implementado

- El backend expone `POST /api/v1/calculations`.
- El request acepta JSON con `expression`.
- La logica de dominio calcula una suma de dos operandos, por ejemplo `2+3`.
- El backend responde JSON con `expression` y `result`.
- El backend devuelve errores estructurados para JSON invalido, expresion vacia, expresion incompleta u operacion no soportada.
- El frontend incluye un cliente API para `POST /api/v1/calculations`.
- La UI minima permite ingresar dos numeros, enviar una suma, mostrar expresion, resultado y errores.
- El backend habilita CORS basico para permitir llamadas desde el frontend en desarrollo.

## Criterios de aceptacion

- `POST /api/v1/calculations` existe.
- Una expresion de suma como `2+3` retorna resultado `5`.
- La logica de suma tiene pruebas unitarias.
- El handler HTTP tiene pruebas de exito y error.
- El frontend tiene cliente API para calculos.
- La UI minima envia una suma al backend.
- La UI muestra resultado exitoso.
- La UI muestra errores del backend.
- No se implementan resta, multiplicacion, division ni UI final de calculadora.

## Componentes y archivos afectados

- `backend/internal/calculation/calculation.go`
- `backend/internal/calculation/calculation_test.go`
- `backend/internal/transport/calculations.go`
- `backend/internal/transport/calculations_test.go`
- `backend/internal/transport/cors.go`
- `backend/internal/transport/router.go`
- `backend/internal/transport/health.go`
- `frontend/src/api/calculations.ts`
- `frontend/src/App.tsx`
- `frontend/src/styles.css`
- `frontend/tests/App.test.tsx`
- `docs/prompt-usados.md`
- `docs/features/README.md`
- `docs/features/feat-001-scaffolding-inicial.md`
- `docs/features/feat-002-flujo-minimo-suma.md`

## Impacto

| Area | Impacto |
| --- | --- |
| Frontend | Agrega cliente API y UI minima de suma con estados de resultado, carga y error. |
| Backend | Agrega dominio de calculo para suma, handler HTTP y CORS basico. |
| API | Agrega `POST /api/v1/calculations` con soporte inicial solo para suma. |
| Datos | Sin persistencia ni historial. |
| Seguridad | Sin autenticacion; CORS queda abierto para desarrollo local y debe revisarse antes de produccion. |
| Documentacion | Agrega esta feature y actualiza el indice. |

## Contrato API implementado

Endpoint:

```http
POST /api/v1/calculations
Content-Type: application/json
```

Request:

```json
{
  "expression": "2+3"
}
```

Response exitosa:

```json
{
  "expression": "2+3",
  "result": 5
}
```

Response de error:

```json
{
  "error": {
    "code": "UNSUPPORTED_OPERATION",
    "message": "La operacion no esta soportada en esta version.",
    "details": {
      "expression": "2*3"
    }
  }
}
```

## Validaciones y manejo de errores

- `INVALID_JSON`: cuerpo JSON invalido.
- `EMPTY_EXPRESSION`: expresion vacia.
- `INCOMPLETE_EXPRESSION`: expresion incompleta u operandos invalidos.
- `UNSUPPORTED_OPERATION`: operacion distinta de suma.

## Pruebas agregadas o modificadas

- Unit tests de dominio en `backend/internal/calculation/calculation_test.go`.
- Tests del handler HTTP en `backend/internal/transport/calculations_test.go`.
- Tests de frontend en `frontend/tests/App.test.tsx` para render, exito y error.

## Comandos de validacion ejecutados

| Comando | Resultado |
| --- | --- |
| `npm test` en `frontend/` | PASS: 1 archivo de prueba, 3 pruebas exitosas. |
| `npm run build` en `frontend/` | PASS: TypeScript y build Vite exitosos. |
| `npm audit --audit-level=moderate` en `frontend/` | PASS: 0 vulnerabilidades reportadas. |
| `go test ./...` en `backend/` con `GOCACHE` local | PASS: paquetes `calculation` y `transport` exitosos. |
| `gofmt` sobre archivos Go modificados | PASS. |
| `docker compose config` | PASS. |
| `docker compose build` | PASS. |
| `POST http://localhost:18080/api/v1/calculations` con `{"expression":"2+3"}` | PASS: `200` y `{"expression":"2+3","result":5}`. |
| Revision de secretos/debug en codigo propio | PASS: sin secretos ni codigo de depuracion detectado; solo falsos positivos de paquetes en `package-lock.json`. |

## Decisiones tecnicas

- Implementar solo suma con dos operandos para validar el flujo vertical minimo.
- Mantener la logica de calculo separada del handler HTTP.
- Reutilizar `net/http` y `http.ServeMux`.
- Reutilizar el formato de error estructurado definido en la especificacion.
- Agregar CORS basico para desarrollo local entre Vite y Go.
- Mantener la UI minima basada en formulario, sin construir todavia la calculadora visual completa.

## Limitaciones conocidas

- Solo se soporta suma de dos operandos.
- Resta, multiplicacion y division siguen pendientes.
- No hay precedencia de operadores porque no se implementan expresiones mixtas.
- No hay UI visual completa de calculadora.
- No hay e2e automatizado con navegador todavia.
- CORS abierto no debe considerarse configuracion final de produccion.

## Consideraciones de mantenimiento

- Al agregar nuevas operaciones, extender primero la logica de dominio y sus pruebas.
- Mantener compatibilidad del contrato `POST /api/v1/calculations`.
- Reemplazar la UI minima por la calculadora final sin romper el cliente API.
- Agregar e2e cuando exista el flujo visual definitivo.

## Posibles mejoras futuras

- Agregar resta, multiplicacion y division.
- Implementar parser con precedencia aritmetica.
- Implementar UI completa con botones de calculadora.
- Agregar pruebas e2e del flujo real en navegador.
