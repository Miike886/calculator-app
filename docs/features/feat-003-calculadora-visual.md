# FEAT-003 - Calculadora visual interactiva

## Objetivo

Reemplazar la interfaz provisional por una calculadora visual interactiva que respete `docs/ui-specification.md` y use el asset de referencia como guia de estilo, proporciones y jerarquia visual.

## Estado

Implementada y validada.

## Comportamiento implementado

- Display con expresion actual y resultado.
- Botones clickeables del `0` al `9`.
- Punto decimal.
- Botones `C`, `DEL` y `=`.
- Botones de suma, resta, multiplicacion y division.
- Entrada por click y teclado usando la misma logica de estado.
- Soporte de `Enter`, `Backspace` y `Escape`.
- Estados de carga, resultado y error.
- Diseño responsive utilizable desde 320 px.
- Al presionar `=`, la UI consume `POST /api/v1/calculations`.
- Los simbolos visuales `×`, `÷` y `−` se normalizan a `*`, `/` y `-` antes de enviar al backend.

## Criterios de aceptacion

- La UI ya no muestra el formulario provisional.
- La calculadora renderiza los controles definidos por la distribucion funcional aprobada.
- Clicks y teclado actualizan la misma expresion.
- `DEL` y `Backspace` eliminan el ultimo caracter.
- `C` y `Escape` limpian expresion, resultado y error.
- `Enter` y `=` ejecutan el calculo.
- La UI muestra resultados exitosos del backend.
- La UI muestra errores locales o devueltos por el backend.
- No se agregan potencia, raiz cuadrada ni porcentaje.

## Componentes y archivos afectados

- `frontend/src/App.tsx`
- `frontend/src/styles.css`
- `frontend/tests/App.test.tsx`
- `docs/prompt-usados.md`
- `docs/features/README.md`
- `docs/features/feat-002-flujo-minimo-suma.md`
- `docs/features/feat-003-calculadora-visual.md`

## Impacto

| Area | Impacto |
| --- | --- |
| Frontend | Reemplaza el formulario minimo por calculadora visual responsive con teclado y click. |
| Backend | Sin cambios funcionales en esta feature. |
| API | Sin cambios de contrato; la UI consume `POST /api/v1/calculations`. |
| Datos | Sin persistencia ni historial. |
| Seguridad | Sin nuevos secretos ni credenciales. |
| Documentacion | Agrega esta feature y actualiza el indice. |

## Validaciones y manejo de errores

- La UI bloquea calculos con expresiones vacias, terminadas en operador o terminadas en punto decimal.
- Los errores del backend se muestran mediante `role="alert"`.
- Los operadores no soportados por el backend se envian igualmente al endpoint existente y se muestran como error estructurado.

## Pruebas agregadas o modificadas

- `frontend/tests/App.test.tsx` cubre render de controles, entrada por click, entrada por teclado, `Enter`, `Backspace`, `Escape`, resultado exitoso, normalizacion de operadores y error local.

## Comandos de validacion ejecutados

| Comando | Resultado |
| --- | --- |
| `npm test` en `frontend/` | PASS: 1 archivo de prueba, 5 pruebas exitosas. |
| `npm run build` en `frontend/` | PASS: TypeScript y build Vite exitosos. |
| `go test ./...` en `backend/` con `GOCACHE` local | PASS: sin regresiones backend. |

## Decisiones tecnicas

- Mantener toda la entrada en una unica logica `handleAction` para clicks y teclado.
- Usar una distribucion de 4 columnas con espacios vacios para respetar la fuente de verdad funcional.
- Mantener la UI responsive con medidas fluidas y dimensiones estables de botones.
- No implementar operaciones nuevas en backend dentro de esta feature.

## Limitaciones conocidas

- El backend todavia solo soporta suma; resta, multiplicacion y division pueden mostrarse como error hasta que se implementen.
- No hay pruebas e2e automatizadas de navegador.
- No se uso captura visual automatizada; la validacion visual se hizo contra la especificacion y el asset de referencia.

## Consideraciones de mantenimiento

- Cuando se implementen las operaciones restantes en backend, las pruebas frontend deben cubrir resultados exitosos para cada operador.
- Si se agregan e2e, cubrir clicks, teclado, errores y responsive minimo.

## Posibles mejoras futuras

- Implementar resta, multiplicacion y division en backend.
- Agregar pruebas e2e visuales.
- Agregar estados visuales diferenciados por operador activo.
