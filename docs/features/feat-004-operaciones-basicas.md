# FEAT-004 - Operaciones basicas completas

## Objetivo

Ampliar el flujo `React -> REST API -> Go -> resultado -> React` para soportar suma, resta, multiplicacion y division con dos o mas operandos.

## Estado

Implementada y validada.

## Comportamiento implementado

- `POST /api/v1/calculations` acepta expresiones con `+`, `-`, `*` y `/`.
- Las expresiones se evaluan de izquierda a derecha, en orden de captura, sin precedencia matematica entre operadores distintos.
- El backend ignora espacios y retorna JSON exitoso con `expression` y `result`.
- Division entre cero retorna error estructurado `DIVISION_BY_ZERO`.
- La division acepta operandos negativos, por ejemplo `100/-2/5`.
- La UI permite continuar desde un resultado si se selecciona otro operador.
- La UI inicia una operacion nueva si, despues de un resultado, el usuario ingresa un numero.
- La UI reemplaza un operador pendiente cuando aun no se ingreso el siguiente operando.
- La UI evita apilar operadores pendientes y conserva solo el ultimo operador seleccionado.
- Los resultados largos se muestran y reutilizan sin notacion cientifica para mantener expresiones compatibles con el parser.
- La expresion queda limitada a 48 caracteres en frontend y backend.
- El display muestra el contador de caracteres y oculta barras de desplazamiento vertical.
- El punto decimal al inicio de un operando se presenta como `0.`.
- Los errores siguen mostrandose dentro del display.

## Criterios de aceptacion

- `2+3+4` retorna `9`.
- `20-5-3` retorna `12`.
- `2*3*4` retorna `24`.
- `100/2/5` retorna `10`.
- `100/-2/5` retorna `-10`.
- `2+3*4` retorna `20`.
- Una expresion de mas de 48 caracteres retorna `EXPRESSION_TOO_LONG`.
- `10/0` retorna `400` con `DIVISION_BY_ZERO`.
- Clicks y teclado mantienen la misma logica de estado.
- No se agregan potencia, raiz cuadrada, porcentaje ni precedencia.

## Impacto

- Frontend: actualiza la gestion de expresion y resultado.
- Backend: amplia parser y calculadora lineal.
- API: mantiene el endpoint y formato JSON; amplia operaciones soportadas.
- Datos: sin impacto, no hay persistencia.
- Seguridad: sin nuevos datos sensibles ni autenticacion.

## Pruebas

- Unit tests de backend para operaciones basicas, operandos multiples, evaluacion izquierda-a-derecha, division entre cero y entradas invalidas.
- Tests de handler HTTP para respuestas exitosas y errores estructurados.
- Unit tests frontend para la logica pura de entrada, normalizacion, limite de caracteres, decimales, negativos y resultados grandes.
- Tests de frontend para normalizacion de simbolos, multiples operandos, continuidad desde resultado, reinicio desde resultado, reemplazo de operador pendiente y errores en display.
- Tests e2e Playwright para flujos reales React -> REST API -> Go -> React.

## Comandos de validacion

- `gofmt`: PASS.
- `go test ./...`: PASS.
- `npm test`: PASS.
- `npm run e2e`: PASS.
- `npm run build`: PASS.

## Limitaciones

- No hay precedencia matematica entre operadores distintos.
- No hay numeros negativos como primer operando.
- No hay operaciones avanzadas.
