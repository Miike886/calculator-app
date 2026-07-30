# Pruebas e2e

Las pruebas end-to-end se agrupan por flujo critico de usuario.

- `calculation-flow.spec.ts`: calculos exitosos usando la UI real.
- `keyboard-controls.spec.ts`: entrada manual y controles especiales.
- `validation-errors.spec.ts`: errores visibles, decimales y limite de caracteres.
- `helpers.ts`: utilidades compartidas de arranque de la calculadora.

Comando principal:

```bash
npm run e2e
```
