---
name: feature-implementer
description: "Implementacion incremental de nuevas features, correcciones o mejoras en repositorios de software. Usar cuando Codex deba modificar codigo manteniendo el proyecto operable, escalable y facil de extender: leer documentacion e instrucciones existentes, revisar criterios de aceptacion, validar compatibilidad con arquitectura aprobada, identificar impacto en frontend, backend, API, pruebas y documentacion, reutilizar patrones actuales, agregar validaciones y pruebas suficientes segun riesgo, ejecutar verificaciones, marcar FAIL si faltan pruebas criticas, y reportar resultados sin introducir refactors, dependencias o decisiones arbitrarias fuera de alcance."
---

# Feature Implementer

## Principios

- Implementar solo lo necesario para cumplir el requerimiento.
- Mantener cambios verticales pequenos, funcionales y faciles de revisar.
- Respetar arquitectura, contratos, responsabilidades y patrones existentes.
- No agregar refactors, dependencias, abstracciones ni funcionalidades no relacionadas.
- No eliminar ni debilitar pruebas para hacer pasar una implementacion.
- No afirmar que una validacion paso si no fue ejecutada.

## Antes de modificar codigo

1. Leer instrucciones del repositorio: `AGENTS.md`, `README.md`, `CONTRIBUTING.md` si existen.
2. Leer fuentes de verdad relevantes: `docs/specification.md`, `docs/architecture.md`, `docs/ui-specification.md`, `docs/features/`, contratos de API, ADRs, codigo, pruebas y configuracion existentes.
3. Revisar criterios de aceptacion de la feature.
4. Identificar impacto en frontend, backend, API, pruebas y documentacion.
5. Buscar implementaciones similares antes de crear patrones nuevos.
6. Reportar antes de implementar si el requerimiento contradice la arquitectura o no tiene criterios suficientes.

## Durante la implementacion

- Trabajar en incrementos pequenos que mantengan el proyecto operable.
- Reutilizar componentes, servicios, helpers y convenciones actuales.
- Mantener compatibilidad con contratos existentes, salvo aprobacion explicita.
- Incluir validacion de entradas y manejo de errores donde aplique.
- Cubrir casos exitosos, invalidos y limite con pruebas nuevas o actualizadas.
- Mantener las pruebas separadas por capa y comportamiento; dividir suites cuando mezclen responsabilidades o se vuelvan dificiles de leer.
- En repositorios con convencion de tests por subcarpeta, respetar `internal/<capa>/tests/` en backend y paquetes externos de prueba cuando aplique.
- Actualizar contratos de API y documentacion cuando cambie el comportamiento.
- Preservar cambios ajenos existentes en el workspace.

## Validacion

Ejecutar los comandos aplicables disponibles para:

- formato
- lint
- type checking
- pruebas unitarias
- pruebas e2e
- build

Evaluar si la estrategia de pruebas es suficiente para el cambio, no solo si las pruebas existentes pasan. Verificar cuando aplique:

- cobertura unitaria de logica nueva
- pruebas de componentes para cambios de UI
- pruebas de integracion para interacciones entre capas
- pruebas de contrato para cambios de API
- pruebas e2e para flujos criticos
- pruebas de regresion para bugs corregidos
- casos exitosos, invalidos, limites y errores esperados

No exigir todos los tipos de pruebas en cada cambio. Justificar cuales aplican segun riesgo, comportamiento modificado y arquitectura del repositorio.

Si la documentacion del repositorio exige una capa de pruebas, por ejemplo e2e, la Skill debe verificar que exista configuracion ejecutable y al menos cobertura de los flujos criticos afectados. Si falta, debe crearla o marcar `FAIL` con acciones concretas.

Marcar la feature como `FAIL` si faltan pruebas necesarias para un comportamiento critico, aunque las pruebas existentes pasen.

Corregir fallos introducidos por el cambio. Si una validacion no puede ejecutarse, indicarlo con la razon.

## Cierre

Responder con:

- Archivos modificados.
- Decisiones tomadas.
- Comandos ejecutados y resultados.
- Evaluacion de suficiencia de pruebas y estado `PASS` o `FAIL`.
- Limitaciones, riesgos o trabajo pendiente.
- Estado final para commit y pull request enfocados.

Mantener el resumen breve y honesto.
