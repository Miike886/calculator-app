# Prompts Usados

## Prompt 1

```text
Actúa como un arquitecto de software y ayúdame a definir y alinear más detalladamente la estructura del proyecto. 
- El proyecto a desarrollar es una calculadora full-stack
- el stack pensado para el proyecto es el siguiente; frontend react, typescript
- el backend será en go
- la comunciación será a través de rest api
- el repositorio será monorepo
- es imprescindible implementar pruebas automatizadas unitarias, e2e
Dentro de la visualización de la aplicación, debe comportarse como una calculadora real
- Se busca incluir una ui con botones clickeables interactivos del 0 al 9
- La primera versión del desarrollo busca incluir las operaciones simples que son suma, resta, multiplicación y división 
- en una versión posterior se agregarán las operaciones de potencia, raíz cuadrada y porcentaje
- incluir un botón "DEL" para eliminar el último caracter 
- Incluir un botón "C" para limpiar toda la operación
- Incluir un botón "=" para ejecutar el cálculo. 
- La entrada puede ser tanto mediante clicks de los botnes, como a través del teclado. 
- Alineado con el punto anterior, se debe considerar el uso de Enter, backspace y escape para la entrada manual 
- La pantalla que muestra el resultado debe contener la expresión actual y el resultado

para el backend, tomaremos como base un solo microservicio, y excluir persistencia, autenticación, historial, microservicios adicionales, como endpoints obligatorios para esa fase de desarrollo, generar
- GET /health
- POST /api/v1/calculations
para el endpoint de cálculo definir el request json, response exitosa, error estructurado, códigos http, operaciones soportadas, número esperado de operandos, ejemplos de uso. 

El objetivo de esta tarea es únicamente para definir especificaciones y dejarlas plasmadas, no generes ninguna línea de código ni comiences con el desarrollo. 

Genera los siguientes documentos alineados con toda la información que te acabo de compartir:
docs/specification.md - objetivo del proyecto, requisitos funcionales, requisitos no funcionales, operaciones obligatorias y opcionales, comportamiento de cada operación, reglase de validación, casos de límite y errores esperados, criterios de aceptación, elementos fuera de alcande
docs/architecture.md - stack tecnológico, estructura propuesta del monorepo, responsabilidades del front y back, flujo de comunicación entre front y cback, estructrua interna del back, estrateia de manejo de errores, estrategia de pruebas, variables de entorno (si corresponde), decisiones de arquitectura y justificación, riesgos de sobreingeniería a evitar
docs/ui-specification.md
docs/prompt-usados.md (para cada prompt que yo te proporciones, lo tienes que almacenar en este archivo)

Restricciones:
- No escribas todavía la implementación
- no agregues persistencia
- no agregues funcionalidad no definidas
- no agregues historial
- no agregues dependencias sin necesidad
- distingue claramente entre requisitos obligatorios, opcionales y recomendaciones
```
