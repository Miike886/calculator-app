# Arquitectura

## Stack tecnologico

### Obligatorio

- Frontend: React + TypeScript.
- Backend: Go.
- Comunicacion: REST API sobre HTTP.
- Repositorio: monorepo.
- Pruebas: unitarias y e2e.

### Recomendado

- Frontend build tooling: Vite.
- Frontend tests unitarios: Vitest + React Testing Library.
- E2E: Playwright.
- Backend HTTP router: libreria estandar `net/http` o un router liviano si la complejidad lo justifica.
- Backend tests unitarios: `go test`.

## Estructura propuesta del monorepo

```text
calculator-app/
  docs/
    specification.md
    architecture.md
    ui-specification.md
    prompt-usados.md
  frontend/
    src/
    tests/
      calculator.test.ts
      app.<area>.test.tsx
    e2e/
      <flow>.spec.ts
    package.json
    tsconfig.json
    vite.config.ts
    playwright.config.ts
  backend/
    cmd/
      api/
    internal/
      calculation/
        tests/
          *_test.go
      transport/
        tests/
          *_test.go
      config/
    go.mod
  README.md
```

La estructura efectiva usa `frontend/` y `backend/` para mantener el monorepo simple. Las pruebas e2e viven dentro de `frontend/e2e/` porque Playwright y sus servidores de prueba se configuran desde el paquete frontend. En backend, los tests viven en `tests/` dentro de cada capa para mantener separados los archivos de produccion y las suites de validacion.

## Responsabilidades del frontend

### Obligatorias

- Renderizar una calculadora visual e interactiva.
- Gestionar la expresion actual mientras el usuario ingresa datos.
- Gestionar el resultado mostrado.
- Capturar clicks en botones.
- Capturar entradas de teclado:
  - numeros
  - operadores soportados
  - `Enter`
  - `Backspace`
  - `Escape`
- Normalizar simbolos antes de enviar al backend cuando sea necesario, por ejemplo `x` a `*`.
- Llamar a `POST /api/v1/calculations` al ejecutar el calculo.
- Mostrar errores de validacion de manera clara.

### Recomendadas

- Bloquear entradas claramente invalidas desde la UI para mejorar experiencia.
- Mantener la validacion final en backend.
- Separar componentes visuales de logica de interaccion.

## Responsabilidades del backend

### Obligatorias

- Exponer `GET /health`.
- Exponer `POST /api/v1/calculations`.
- Parsear y validar el request JSON.
- Validar la expresion recibida.
- Ejecutar operaciones soportadas.
- Retornar resultado exitoso en formato JSON.
- Retornar errores estructurados en formato JSON.
- Evitar persistencia, autenticacion, historial y dependencias innecesarias.

### Recomendadas

- Separar transporte HTTP, validacion y logica de calculo.
- Mantener la logica de calculo libre de detalles HTTP para facilitar pruebas unitarias.
- Definir codigos de error estables para que el frontend pueda reaccionar de forma consistente.

## Flujo de comunicacion

1. El usuario ingresa una expresion desde botones o teclado.
2. El frontend actualiza la expresion actual en pantalla.
3. El usuario presiona `=` o `Enter`.
4. El frontend envia `POST /api/v1/calculations`.
5. El backend valida el JSON y la expresion.
6. El backend calcula el resultado si la expresion es valida.
7. El backend responde con `200 OK` y el resultado, o con un error estructurado.
8. El frontend muestra el resultado o el mensaje de error.

## Endpoints obligatorios

### `GET /health`

Uso: verificar que el servicio esta disponible.

Respuesta exitosa:

```json
{
  "status": "ok"
}
```

Codigo HTTP esperado: `200 OK`.

### `POST /api/v1/calculations`

Uso: calcular una expresion aritmetica.

Request:

```json
{
  "expression": "2+3*4"
}
```

Response exitosa:

```json
{
  "expression": "2+3*4",
  "result": 20
}
```

Response de error:

```json
{
  "error": {
    "code": "INCOMPLETE_EXPRESSION",
    "message": "La expresion esta incompleta.",
    "details": {
      "expression": "2+"
    }
  }
}
```

## Estructura interna del backend

### `cmd/api`

Punto de entrada del servicio HTTP.

Responsabilidades:

- cargar configuracion
- inicializar rutas
- iniciar servidor HTTP

### `internal/transport`

Capa HTTP.

Responsabilidades:

- definir handlers
- leer requests
- escribir responses JSON
- mapear errores de dominio a codigos HTTP

### `internal/validation`

Validacion de entrada.

Responsabilidades:

- validar expresion vacia
- validar caracteres permitidos
- validar operadores soportados
- detectar expresiones incompletas

### `internal/calculation`

Logica de dominio.

Responsabilidades:

- parsear expresiones validas
- evaluar expresiones lineales de izquierda a derecha
- calcular resultados
- detectar division entre cero

## Estrategia de manejo de errores

### Principios

- Los errores deben tener una forma JSON uniforme.
- Los codigos de error deben ser estables.
- El frontend no debe depender de textos exactos para tomar decisiones.
- Los mensajes deben ser comprensibles para usuarios finales.

### Formato

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje legible.",
    "details": {}
  }
}
```

### Codigos HTTP

| Codigo HTTP | Uso |
| --- | --- |
| 200 | Calculo exitoso o health check exitoso. |
| 400 | Request invalido, expresion invalida u operacion no soportada. |
| 405 | Metodo HTTP no permitido. |
| 500 | Error inesperado del servidor. |

## Estrategia de pruebas

### Organizacion por capa

Obligatoria:

- Mantener los tests separados por capa: dominio backend, handlers HTTP, logica pura frontend, componentes React y e2e.
- En backend, ubicar tests en `internal/<capa>/tests/` usando paquetes externos de prueba cuando sea posible, por ejemplo `calculation_test` y `transport_test`.
- Evitar archivos de test genericos que mezclen render, entrada, API, errores y flujos completos.
- Dividir suites por comportamiento cuando un archivo empiece a ser dificil de leer.
- Mantener helpers de prueba pequenos y compartidos solo cuando reduzcan duplicacion real.

### Unitarias frontend

Obligatorias:

- Construccion de expresion mediante acciones de usuario.
- Comportamiento de `DEL`.
- Comportamiento de `C`.
- Disparo de calculo con `=`.
- Manejo de `Enter`, `Backspace` y `Escape`.
- Renderizado de expresion y resultado.
- Manejo de errores devueltos por backend.

### Unitarias backend

Obligatorias:

- Validacion de expresiones vacias.
- Validacion de caracteres invalidos.
- Validacion de expresiones incompletas.
- Calculo de suma.
- Calculo de resta.
- Calculo de multiplicacion.
- Calculo de division.
- Evaluacion de izquierda a derecha sin precedencia entre operadores distintos.
- Division entre cero.
- Serializacion de responses exitosas y errores.

### E2E

Obligatorias:

- Usuario calcula una suma usando clicks.
- Usuario calcula una operacion mixta usando clicks.
- Usuario calcula usando teclado y `Enter`.
- Usuario borra con `Backspace` o `DEL`.
- Usuario limpia con `Escape` o `C`.
- Usuario recibe error al intentar dividir entre cero.

Los comandos y alcance vigente de cada capa de pruebas se documentan en `docs/testing.md`.

## Variables de entorno

### Backend

Recomendadas:

| Variable | Uso | Valor por defecto sugerido |
| --- | --- | --- |
| `PORT` | Puerto HTTP del backend. | `8080` |
| `APP_ENV` | Entorno de ejecucion. | `development` |

### Frontend

Recomendadas:

| Variable | Uso | Valor por defecto sugerido |
| --- | --- | --- |
| `VITE_API_BASE_URL` | URL base del backend. | `http://localhost:8080` |

No se requieren variables para persistencia, autenticacion ni credenciales en esta fase.

## Decisiones de arquitectura y justificacion

| Decision | Justificacion |
| --- | --- |
| Monorepo | Facilita versionado conjunto de frontend, backend, docs y e2e. |
| REST API | Suficiente para un contrato simple de calculo y facil de probar. |
| Un solo microservicio | Reduce complejidad operativa y evita sobreingenieria. |
| Sin persistencia | El calculo es stateless en esta fase. |
| Validacion en backend | El backend debe ser la fuente autoritativa de reglas. |
| Validacion ligera en frontend | Mejora UX sin reemplazar reglas del servidor. |
| Separacion por capas en backend | Mejora mantenibilidad y testabilidad sin introducir complejidad excesiva. |
| Pruebas desde el inicio | Reduce riesgo de regresiones en interacciones y reglas de calculo. |
| Tests separados por capa y comportamiento | Mantiene legibilidad, evita suites monoliticas y facilita detectar brechas reales de cobertura. |

## Riesgos de sobreingenieria a evitar

- Agregar base de datos antes de necesitar historial o persistencia.
- Crear multiples microservicios para una logica de calculo simple.
- Introducir colas, eventos o mensajeria asincrona.
- Agregar autenticacion antes de existir usuarios o datos privados.
- Usar frameworks pesados sin una necesidad clara.
- Implementar un motor matematico demasiado amplio para la primera version.
- Agregar operaciones futuras antes de cerrar suma, resta, multiplicacion y division.
- Convertir la UI en una pantalla de marketing en lugar de una calculadora usable.
- Crear abstracciones genericas antes de tener repeticion real.
