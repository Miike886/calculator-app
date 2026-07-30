# Pruebas frontend

Las pruebas de `frontend/tests/` se organizan por capa y comportamiento para evitar archivos monoliticos.

- `calculator.test.ts`: unit tests de logica pura en `src/calculator.ts`.
- `app.render.test.tsx`: render inicial y controles visibles.
- `app.calculation-flow.test.tsx`: flujo React -> API -> resultado y continuidad de calculos.
- `app.input.test.tsx`: clicks, teclado, operadores, decimales y limites de entrada.
- `app.error.test.tsx`: errores locales, errores del backend y limpieza de errores.

Comando principal:

```bash
npm test
```
