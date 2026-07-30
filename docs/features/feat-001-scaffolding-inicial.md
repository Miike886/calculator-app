# FEAT-001 - Scaffolding inicial full-stack

## Objetivo

Crear la base operable del monorepo para una calculadora full-stack con frontend en React + TypeScript + Vite y backend en Go, sin implementar todavia operaciones de calculadora ni la UI final.

## Estado

Implementada y validada.

## Comportamiento implementado

- Existe `frontend/` con React, TypeScript, Vite y configuracion base de Vitest.
- Existe `backend/` con Go, estructura `cmd/api` e `internal`.
- El backend expone `GET /health`.
- `GET /health` responde JSON con estado saludable.
- El backend lee el puerto desde `PORT`, con valor por defecto `8080`.
- El frontend queda preparado para consumir el backend mediante `VITE_API_BASE_URL`.
- Existen Dockerfiles para frontend y backend.
- Existe `docker-compose.yml` para levantar ambos servicios.
- Existen variables de entorno de ejemplo en `frontend/.env.example` y `backend/.env.example`.

## Criterios de aceptacion

- `frontend/` existe con React, TypeScript y Vite.
- `backend/` existe con Go.
- `GET /health` responde `200 OK` y JSON.
- El backend usa `PORT`.
- El frontend expone configuracion `VITE_API_BASE_URL`.
- Hay configuracion base de pruebas frontend y backend.
- Hay Dockerfiles para ambos servicios.
- `docker-compose.yml` es valido.
- No se implementaron operaciones de calculadora ni UI final.

## Componentes y archivos afectados

- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/vite.config.ts`
- `frontend/vitest.config.ts`
- `frontend/tsconfig.json`
- `frontend/src/App.tsx`
- `frontend/src/config.ts`
- `frontend/src/api/health.ts`
- `frontend/tests/App.test.tsx`
- `backend/go.mod`
- `backend/cmd/api/main.go`
- `backend/internal/config/config.go`
- `backend/internal/transport/router.go`
- `backend/internal/transport/health.go`
- `backend/internal/transport/health_test.go`
- `frontend/Dockerfile`
- `backend/Dockerfile`
- `docker-compose.yml`
- `.gitignore`

## Impacto

| Area | Impacto |
| --- | --- |
| Frontend | Agrega scaffold React + Vite, configuracion de entorno y prueba base de render. |
| Backend | Agrega servicio Go con health check y prueba de handler. |
| API | Agrega `GET /health`; no agrega todavia `POST /api/v1/calculations`. |
| Datos | Sin persistencia ni modelos de datos. |
| Seguridad | Sin autenticacion ni manejo de secretos; variables actuales no contienen credenciales. |
| Documentacion | Agrega esta documentacion de feature y actualiza el indice de features. |

## Validaciones y manejo de errores

- `GET /health` responde siempre `{"status":"ok"}` cuando el servicio esta activo.
- El puerto se toma desde `PORT`; si no existe, usa `8080`.
- No hay validaciones de calculo porque el endpoint de calculo todavia no fue implementado.

## Pruebas agregadas o modificadas

- `backend/internal/transport/health_test.go`: valida status HTTP, `Content-Type` y cuerpo JSON del health check.
- `frontend/tests/App.test.tsx`: valida que el scaffold inicial renderiza sin la UI final de calculadora.

## Comandos de validacion ejecutados

| Comando | Resultado |
| --- | --- |
| `npm test` en `frontend/` | PASS: 1 archivo de prueba, 1 prueba exitosa. |
| `npm run build` en `frontend/` | PASS: TypeScript y build Vite exitosos. |
| `npm audit --audit-level=moderate` en `frontend/` | PASS: 0 vulnerabilidades reportadas. |
| `go test ./...` en `backend/` con `GOCACHE` local | PASS: paquete `internal/transport` exitoso; otros paquetes sin pruebas. |
| `gofmt -l` sobre archivos Go | PASS: sin archivos pendientes de formato. |
| `docker compose config` | PASS: configuracion valida. |
| `docker compose build` | PASS: imagen frontend e imagen backend construidas. |
| Revision de secretos/debug en codigo propio | PASS: sin secretos ni codigo de depuracion detectado; solo falsos positivos de paquetes en `package-lock.json`. |

## Decisiones tecnicas

- Usar `net/http` en backend para evitar dependencias innecesarias.
- Separar configuracion de puerto en `internal/config`.
- Separar transporte HTTP en `internal/transport`.
- Usar Vite para frontend por estar recomendado en arquitectura.
- Separar `vite.config.ts` y `vitest.config.ts` para evitar conflictos de tipos entre build y pruebas.
- Usar `VITE_API_BASE_URL` como variable del frontend.
- Pasar `VITE_API_BASE_URL` como build arg en Docker, porque Vite embebe variables al construir.

## Limitaciones conocidas

- La UI final de calculadora no esta implementada.
- `POST /api/v1/calculations` no estaba implementado en esta feature inicial; se agrega posteriormente en `FEAT-002`.
- No existen pruebas e2e todavia porque no hay flujo funcional de calculadora.
- No hay pruebas de contrato del endpoint de calculo porque el contrato aun no esta implementado.

## Consideraciones de mantenimiento

- Mantener `VITE_API_BASE_URL` sincronizado entre entorno local, Docker y futuros despliegues.
- Agregar pruebas e2e cuando exista el flujo de calculadora.
- Agregar contrato y pruebas de API cuando se implemente `POST /api/v1/calculations`.
- Evitar agregar persistencia, autenticacion o historial antes de que entren al alcance aprobado.

## Posibles mejoras futuras

- Extender `POST /api/v1/calculations` con operaciones adicionales.
- Implementar UI de calculadora real.
- Agregar pruebas e2e de flujos de calculo.
- Agregar validacion de contrato API cuando exista el endpoint de calculo.
