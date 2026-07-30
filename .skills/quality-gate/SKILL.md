---
name: quality-gate
description: "Validacion de cambios antes de commit, pull request o merge. Usar cuando Codex deba leer instrucciones y configuracion del repositorio, identificar comandos reales del proyecto, revisar criterios de aceptacion, inspeccionar archivos modificados y diff, ejecutar validaciones aplicables, evaluar suficiencia de pruebas segun riesgo y capas afectadas, detectar problemas bloqueantes, y devolver PASS, PASS WITH WARNINGS o FAIL sin ocultar fallos ni asumir herramientas no configuradas."
---

# Quality Gate

## Principios

- Validar contra la configuracion real del repositorio; no asumir comandos ni herramientas.
- Leer primero `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, docs, contratos, CI, dependencias, build y configuracion de pruebas si existen.
- Revisar criterios de aceptacion, archivos modificados y alcance del cambio.
- No afirmar que una validacion paso si no fue ejecutada.
- No desactivar pruebas, reducir cobertura, ocultar fallos ni modificar requisitos para aprobar.
- No crear commits, pull requests ni merges salvo solicitud explicita.

## Validaciones

Ejecutar cuando aplique y exista comando o configuracion:

- formato, lint, type checking y analisis estatico
- pruebas unitarias, componentes, handlers/controladores, integracion, contrato, e2e y regresion
- cobertura
- build de produccion
- validacion de contratos de API
- build de contenedores
- revision de documentacion

Si faltan pruebas necesarias, generarlas cuando el alcance lo permita o indicar claramente que deben agregarse antes de aprobar.

Cuando la arquitectura o especificacion declare pruebas obligatorias, esa capa pasa a ser requerida para el resultado. Por ejemplo, si el proyecto exige e2e, el gate debe confirmar configuracion, tests y ejecucion real; si no existen o no se ejecutan, el resultado debe ser `FAIL`.

## Suficiencia de pruebas

No exigir todos los tipos de pruebas en cada cambio. Justificar cuales aplican y cuales no segun comportamiento modificado, riesgo y arquitectura.

Evaluar cuando aplique:

- cobertura unitaria de logica nueva
- pruebas de componentes para UI
- pruebas de integracion entre capas
- pruebas de contrato para API
- pruebas e2e para flujos criticos
- pruebas de regresion para errores corregidos
- casos exitosos, invalidos, limites y errores esperados
- organizacion clara por capa y comportamiento, sin suites monoliticas que oculten brechas de cobertura
- cumplimiento de la estructura de tests definida por la arquitectura, incluyendo `internal/<capa>/tests/` en backend cuando exista esa convencion

## Revision de diff

Detectar:

- cambios no relacionados o alcance excesivo
- codigo duplicado, sin uso o de depuracion
- dependencias innecesarias
- validaciones faltantes y errores sin manejar
- pruebas faltantes, triviales, duplicadas o debilitadas
- cambios incompatibles en API
- documentacion desactualizada
- secretos o credenciales

## Resultado

Devolver exactamente uno:

- `PASS`: todas las validaciones requeridas fueron exitosas.
- `PASS WITH WARNINGS`: las validaciones pasaron, pero hay observaciones no bloqueantes.
- `FAIL`: existe un fallo bloqueante, faltan pruebas necesarias o una validacion requerida no pudo comprobarse.

## Reporte

Incluir:

- comando o revision realizada
- resultado
- resumen del error o advertencia
- si bloquea commit, pull request o merge
- pruebas generadas o faltantes
- acciones recomendadas
