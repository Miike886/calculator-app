# Pruebas e2e

Las pruebas end-to-end se agrupan por flujo critico de usuario.

- `calculation-flow.spec.ts`: calculos exitosos usando la UI real.
- `advanced-operations.spec.ts`: potencia, raiz cuadrada, porcentaje y errores avanzados.
- `keyboard-controls.spec.ts`: entrada manual y controles especiales.
- `validation-errors.spec.ts`: errores visibles, decimales y limite de caracteres.
- `helpers.ts`: utilidades compartidas de arranque de la calculadora.

Comando principal:

```bash
npm run e2e
```

Puertos alternos:

```bash
E2E_BACKEND_PORT=18081 E2E_FRONTEND_PORT=5174 npm run e2e
```

En PowerShell:

```powershell
$env:E2E_BACKEND_PORT='18081'; $env:E2E_FRONTEND_PORT='5174'; npm run e2e
```
