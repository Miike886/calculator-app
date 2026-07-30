---
name: feature-documenter
description: "Documentacion consistente, verificable y util de features implementadas o modificadas. Usar cuando Codex deba crear o actualizar documentos en docs/features/, mantener docs/features/README.md como indice, revisar especificacion, arquitectura, UI, contratos de API, codigo, pruebas y resultados reales de validacion, distinguir funcionalidad completada, pendiente y fuera de alcance, y evitar documentar como terminado algo sin evidencia en codigo, pruebas o comandos ejecutados."
---

# Feature Documenter

## Principios

- Documentar solo comportamiento respaldado por codigo, pruebas o validaciones reales.
- Leer primero especificacion, arquitectura, UI, contratos, `docs/features/`, codigo y pruebas relevantes.
- Distinguir claramente completado, pendiente, fuera de alcance y recomendaciones.
- No copiar bloques grandes de codigo.
- No inventar resultados de pruebas, comandos ni validaciones.

## Flujo

1. Revisar fuentes de verdad: `docs/specification.md`, `docs/architecture.md`, `docs/ui-specification.md`, `docs/features/`, contratos de API, codigo, pruebas y resultados de validacion.
2. Identificar comportamiento visible de la feature y cambios reales realizados.
3. Crear o actualizar el documento de la feature en `docs/features/`.
4. Actualizar `docs/features/README.md` como indice.
5. Verificar que la documentacion no prometa funcionalidad no implementada.

## Documento de feature

Incluir cuando aplique:

- Identificador y nombre.
- Objetivo.
- Estado.
- Comportamiento implementado.
- Criterios de aceptacion.
- Componentes y archivos afectados.
- Impacto en frontend, backend, API, datos y seguridad.
- Validaciones y manejo de errores.
- Pruebas agregadas o modificadas.
- Comandos de validacion ejecutados y resultados.
- Decisiones tecnicas.
- Limitaciones conocidas.
- Consideraciones de mantenimiento.
- Posibles mejoras futuras.

## Indice de features

Mantener `docs/features/README.md` con al menos:

- Identificador.
- Nombre.
- Estado.
- Impacto en API.
- Estado de pruebas.
- Enlace al documento correspondiente.

## Validacion

Antes de finalizar:

- Confirmar que se reviso la implementacion real y las pruebas disponibles.
- Confirmar que cada resultado de validacion documentado fue ejecutado o proviene de evidencia disponible.
- Confirmar que el indice enlaza correctamente al documento de la feature.
- Reportar cualquier informacion faltante, riesgo o trabajo pendiente.
