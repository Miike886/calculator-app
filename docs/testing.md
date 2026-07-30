# Estrategia de pruebas

Este proyecto valida la calculadora en cuatro capas.

## Organizacion

Las pruebas deben separarse por capa y por comportamiento verificable.

- Backend: los tests viven en una subcarpeta `tests/` dentro de la capa que prueban. La logica de calculo se prueba en `internal/calculation/tests/`; los handlers y contrato HTTP en `internal/transport/tests/`.
- Frontend unitario: la logica pura se prueba en `frontend/tests/calculator.test.ts`.
- Frontend componentes: los tests de React se dividen por responsabilidad usando `frontend/tests/app.<area>.test.tsx`.
- E2E: los flujos reales se dividen por escenario critico en `frontend/e2e/*.spec.ts`.

Un archivo de test no debe mezclar capas distintas ni crecer como suite general. Si empieza a cubrir render, input, API, errores y flujos completos a la vez, debe dividirse.

## Backend unitario

Comando:

```bash
cd backend
go test ./...
```

Cubre:

- parser y calculo lineal de suma, resta, multiplicacion y division;
- multiples operandos;
- numeros decimales y negativos;
- limite maximo de expresion;
- division entre cero;
- entradas vacias, incompletas, caracteres invalidos y operaciones futuras no soportadas.

Estructura actual:

- `backend/internal/calculation/tests/calculation_success_test.go`: operaciones exitosas, decimales, negativos y evaluacion izquierda a derecha.
- `backend/internal/calculation/tests/calculation_errors_test.go`: errores de validacion, operaciones no soportadas y division entre cero.

## Backend handlers / contrato HTTP

Comando:

```bash
cd backend
go test ./...
```

Cubre:

- `GET /health`;
- `POST /api/v1/calculations`;
- respuestas exitosas JSON;
- errores estructurados con codigos estables.

Estructura actual:

- `backend/internal/transport/tests/health_handler_test.go`: contrato HTTP de `GET /health`.
- `backend/internal/transport/tests/calculations_handler_test.go`: contrato HTTP de `POST /api/v1/calculations`.

## Frontend unitario y componentes

Comando:

```bash
cd frontend
npm test
```

Cubre:

- logica pura de entrada de calculadora en `src/calculator.ts`;
- normalizacion de simbolos visuales para API;
- punto decimal con `0.` visible;
- reemplazo de operadores pendientes;
- limite de caracteres;
- resultados grandes sin notacion cientifica;
- render e interacciones de la UI con React Testing Library.

Estructura actual:

- `frontend/tests/calculator.test.ts`: helpers puros de calculadora.
- `frontend/tests/app.render.test.tsx`: render inicial.
- `frontend/tests/app.calculation-flow.test.tsx`: flujo React -> API -> resultado.
- `frontend/tests/app.input.test.tsx`: teclado, clicks, operadores, decimales y limites.
- `frontend/tests/app.error.test.tsx`: errores locales y remotos.

## End-to-end

Comando:

```bash
cd frontend
npm run e2e
```

La configuracion de Playwright levanta automaticamente:

- backend Go en `http://127.0.0.1:18080`;
- frontend Vite en `http://127.0.0.1:5173`;
- `VITE_API_BASE_URL=http://127.0.0.1:18080`.

Cubre flujos reales:

- suma por clicks;
- operacion mixta evaluada de izquierda a derecha;
- calculo por teclado con `Enter`;
- `Backspace`, `DEL`, `Escape` y `C`;
- division entre cero;
- punto decimal y limite de caracteres.

Estructura actual:

- `frontend/e2e/calculation-flow.spec.ts`: calculos exitosos.
- `frontend/e2e/keyboard-controls.spec.ts`: teclado, `Backspace`, `DEL`, `Escape` y `C`.
- `frontend/e2e/validation-errors.spec.ts`: errores y validaciones visibles.

## Build

Comando:

```bash
cd frontend
npm run build
```

Valida type checking y build de produccion de Vite.
