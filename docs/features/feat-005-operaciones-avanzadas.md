# FEAT-005 - Operaciones avanzadas

## Objetivo

Agregar potencia, raiz cuadrada y porcentaje al flujo existente `React -> REST API -> Go -> resultado -> React`.

## Estado

Implementada y validada.

## Comportamiento implementado

- `POST /api/v1/calculations` mantiene el request `{ "expression": "..." }`.
- Potencia usa `^` y requiere base y exponente.
- Raiz cuadrada usa `sqrt(value)` en API y `√(value)` en UI; requiere un solo valor.
- Porcentaje usa `%` como operacion binaria y calcula `value * rate / 100`.
- Las expresiones mixtas respetan precedencia: raiz cuadrada, potencia, multiplicacion/division/porcentaje, suma/resta.
- Las operaciones con la misma prioridad se evaluan de izquierda a derecha, incluida potencia.
- El resultado de una operacion avanzada puede reutilizarse para continuar calculando.
- La UI agrega botones `^`, `√` y `%` sin cambiar el endpoint ni agregar persistencia.
- El teclado soporta `^`, `%` y `r`/`R` para aplicar raiz cuadrada al operando actual.
- Los errores permanecen integrados dentro del display.

## Criterios de aceptacion

- `2^3` retorna `8`.
- `sqrt(81)` retorna `9`.
- `200%10` retorna `20`.
- `2+3^2` retorna `11` por precedencia de potencia.
- `sqrt(16)+2*3` retorna `10` por precedencia de raiz cuadrada y multiplicacion.
- `sqrt(-9)` retorna `NEGATIVE_SQUARE_ROOT`.
- Una potencia o porcentaje sin operandos retorna error estructurado.
- Un resultado no finito retorna `NON_FINITE_RESULT`.
- Clicks y teclado usan la misma logica de estado.
- No se agrega historial, persistencia, parentesis ni funciones adicionales.

## Impacto

- Frontend: agrega botones avanzados, normalizacion `√` -> `sqrt`, shortcuts de teclado y pruebas de continuidad.
- Backend: amplia parser y evaluador con precedencia para `^`, `%` y `sqrt(value)`.
- API: mantiene endpoint y formato JSON; amplia operaciones soportadas y codigos de error.
- Datos: sin impacto, no hay persistencia.
- Seguridad: sin nuevos datos sensibles ni autenticacion.

## Validaciones y errores

- Raiz cuadrada negativa: `NEGATIVE_SQUARE_ROOT`.
- Resultado no finito: `NON_FINITE_RESULT`.
- Operandos faltantes o no numericos: `INCOMPLETE_EXPRESSION`.
- Division entre cero conserva `DIVISION_BY_ZERO`.
- Expresiones mayores a 24 caracteres conservan `EXPRESSION_TOO_LONG`.

## Pruebas

- Backend dominio: operaciones avanzadas exitosas, operandos invalidos, raiz negativa y resultados no finitos.
- Backend handlers: contrato HTTP exitoso y errores estructurados para operaciones avanzadas.
- Frontend unitario: normalizacion, raiz cuadrada, operadores avanzados, negativos y continuidad desde resultado.
- Frontend componentes: botones, API calls, errores en display y shortcuts de teclado.
- E2E: potencia, raiz cuadrada, porcentaje, continuidad y errores visibles.

## Comandos de validacion

- `gofmt`: PASS.
- `go test ./...`: PASS.
- `npm test`: PASS.
- `npm run e2e`: PASS.
- `npm run build`: PASS.

## Limitaciones

- `sqrt(value)` acepta un valor numerico, no una subexpresion anidada.
- No hay parentesis para agrupar subexpresiones.
- No se agregan operaciones cientificas adicionales.
