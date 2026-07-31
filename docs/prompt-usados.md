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

## Prompt 2

```text
[$skill-creator](C:\Users\s2g51\.codex\skills\.system\skill-creator\SKILL.md) 
Crea una Skill reutilizable llamada `software-architect` en:

`.skills/software-architect`

 

Su función será analizar nuevos requerimientos o features antes de su implementación. Debe:

* leer primero la documentación existente del repositorio;
* verificar que el cambio sea compatible con la arquitectura aprobada;
* identificar impacto en frontend, backend, API, datos, seguridad, pruebas y documentación;
* definir criterios de aceptación verificables;
* proponer la solución mínima necesaria;
* detectar sobreingeniería, contradicciones, supuestos y decisiones pendientes;
* crear o actualizar especificaciones o decisiones técnicas solo cuando sea necesario;
* no implementar código de aplicación.

Debe considerar como fuente de verdad los archivos disponibles, especialmente:

* `docs/specification.md`
* `docs/architecture.md`
* `docs/ui-specification.md`
* `docs/features/`
* contratos de API y ADRs existentes.

Crea únicamente:

* `SKILL.md`
* `agents/openai.yaml`
* las referencias mínimas que realmente sean necesarias.

Mantén `SKILL.md` breve, usa instrucciones en español y elimina archivos de ejemplo innecesarios.

Valida la Skill al finalizar.
```

## Prompt 3

```text
[$skill-creator](C:\Users\s2g51\.codex\skills\.system\skill-creator\SKILL.md) Crea una Skill reutilizable llamada `feature-implementer` en: 

`.skills/feature-implementer`

Su función será implementar nuevas features, correcciones o mejoras de forma incremental, manteniendo el proyecto operable, escalable y fácil de extender.

Antes de modificar código debe:

* leer la documentación y las instrucciones existentes del repositorio;
* revisar los criterios de aceptación de la feature;
* identificar impacto en frontend, backend, API, pruebas y documentación;
* detectar conflictos con la arquitectura aprobada;
* revisar implementaciones similares antes de crear nuevos patrones.

Durante la implementación debe:

* trabajar mediante cambios verticales pequeños y funcionales;
* implementar únicamente lo necesario para cumplir el requerimiento;
* respetar la separación de responsabilidades existente;
* reutilizar componentes, servicios y patrones actuales;
* evitar refactors, dependencias y abstracciones no relacionadas;
* mantener compatibilidad con contratos existentes, salvo que el cambio haya sido aprobado;
* incluir validación de entradas y manejo de errores;
* agregar o actualizar pruebas de casos exitosos, inválidos y casos límite;
* actualizar contratos de API y documentación cuando cambie el comportamiento;
* no eliminar ni debilitar pruebas para hacer pasar una implementación.

Al finalizar debe:

* ejecutar los comandos aplicables de formato, lint, type checking, tests y build;
* corregir fallos introducidos por el cambio;
* reportar archivos modificados, decisiones tomadas, comandos ejecutados y resultados;
* indicar limitaciones, riesgos o trabajo pendiente;
* no afirmar que una validación pasó si no fue ejecutada;
* dejar el cambio listo para un commit y una pull request enfocados.

Debe considerar como fuente de verdad los archivos disponibles, especialmente:

* `AGENTS.md`
* `README.md`
* `CONTRIBUTING.md`
* `docs/specification.md`
* `docs/architecture.md`
* `docs/ui-specification.md`
* `docs/features/`
* contratos de API;
* código, pruebas y configuración existentes.

Si el requerimiento contradice la arquitectura o no tiene criterios de aceptación suficientes, debe reportarlo antes de introducir una decisión arbitraria.

Crea únicamente:

* `SKILL.md`
* `agents/openai.yaml`
* las referencias mínimas que realmente sean necesarias.

Mantén `SKILL.md` breve, usa instrucciones en español y elimina archivos de ejemplo innecesarios.

Valida la Skill al finalizar.
```

## Prompt 4

```text
[$skill-creator](C:\Users\s2g51\.codex\skills\.system\skill-creator\SKILL.md) 
Crea una Skill reutilizable llamada `feature-documenter` en:

`.skills/feature-documenter`

Su función será documentar cada feature de forma consistente, verificable y útil para futuros desarrolladores.

Antes de documentar debe:

* leer la especificación, arquitectura y documentación existente;
* revisar la implementación real, las pruebas y los cambios realizados;
* identificar el comportamiento visible de la feature;
* distinguir entre funcionalidad completada, pendiente y fuera de alcance;
* evitar documentar como terminado algo que no esté respaldado por código, pruebas o validaciones.

Por cada feature debe crear o actualizar un documento dentro de:

`docs/features/`

Cada documento debe incluir, cuando aplique:

* identificador y nombre de la feature;
* objetivo;
* estado;
* comportamiento implementado;
* criterios de aceptación;
* componentes y archivos afectados;
* impacto en frontend, backend, API, datos y seguridad;
* validaciones y manejo de errores;
* pruebas agregadas o modificadas;
* comandos de validación ejecutados y sus resultados;
* decisiones técnicas;
* limitaciones conocidas;
* consideraciones de mantenimiento;
* posibles mejoras futuras.

También debe mantener actualizado:

`docs/features/README.md`

Este archivo debe funcionar como índice de features e incluir al menos:

* identificador;
* nombre;
* estado;
* impacto en API;
* estado de pruebas;
* enlace al documento correspondiente.

Debe considerar como fuente de verdad los archivos disponibles, especialmente:

* `docs/specification.md`
* `docs/architecture.md`
* `docs/ui-specification.md`
* `docs/features/`
* contratos de API;
* código y pruebas existentes;
* resultados reales de validación.

Debe usar lenguaje claro, evitar copiar bloques grandes de código y no inventar resultados de pruebas o comandos.

Crea únicamente:

* `SKILL.md`
* `agents/openai.yaml`
* las referencias mínimas que realmente sean necesarias.

Mantén `SKILL.md` breve, usa instrucciones en español y elimina archivos de ejemplo innecesarios.

Valida la Skill al finalizar.
```

## Prompt 5

```text
[$skill-creator](C:\Users\s2g51\.codex\skills\.system\skill-creator\SKILL.md) 
Crea una Skill reutilizable llamada `quality-gate` en:

`.skills/quality-gate`

Su función será validar si un cambio está listo para commit, pull request o merge.

Antes de ejecutar validaciones debe:

* leer las instrucciones y configuración del repositorio;
* identificar los comandos reales definidos por el proyecto;
* revisar los criterios de aceptación de la feature;
* inspeccionar los archivos modificados y el alcance del cambio;
* evitar asumir herramientas o comandos que no estén configurados;
* identificar qué tipos de pruebas aplican según el riesgo y las capas afectadas.

Debe ejecutar, cuando aplique:

* formato;
* lint;
* type checking;
* análisis estático;
* pruebas unitarias;
* pruebas de componentes;
* pruebas de handlers o controladores;
* pruebas de integración;
* pruebas de contrato para APIs;
* pruebas end-to-end;
* pruebas de regresión;
* cobertura;
* build de producción;
* validación de contratos de API;
* build de contenedores;
* revisión de documentación.

Si faltan pruebas necesarias, debe generarlas o indicar claramente qué pruebas deben agregarse antes de aprobar el cambio.

Debe evaluar, cuando aplique:

* cobertura unitaria de la lógica nueva;
* pruebas de componentes para cambios de UI;
* pruebas de integración para interacciones entre capas;
* pruebas de contrato para cambios de API;
* pruebas end-to-end para flujos críticos;
* pruebas de regresión para errores corregidos;
* casos exitosos, inválidos, límites y errores esperados.

No debe exigir todos los tipos de pruebas en cada cambio. Debe justificar cuáles aplican y cuáles no, según el comportamiento modificado, el riesgo y la arquitectura.

También debe revisar el diff para detectar:

* cambios no relacionados;
* código duplicado o sin uso;
* dependencias innecesarias;
* validaciones faltantes;
* errores sin manejar;
* pruebas faltantes, triviales, duplicadas o debilitadas;
* cambios incompatibles en la API;
* documentación desactualizada;
* secretos, credenciales o código de depuración;
* alcance excesivo.

Al finalizar debe devolver uno de estos resultados:

* `PASS`: todas las validaciones requeridas fueron exitosas;
* `PASS WITH WARNINGS`: las validaciones pasaron, pero existen observaciones no bloqueantes;
* `FAIL`: existe al menos un fallo bloqueante, faltan pruebas necesarias o una validación requerida no pudo comprobarse.

El reporte debe indicar:

* comando o revisión realizada;
* resultado;
* resumen del error o advertencia;
* si bloquea el commit, pull request o merge;
* pruebas generadas o faltantes;
* acciones recomendadas para corregirlo.

Debe considerar como fuente de verdad los archivos disponibles, especialmente:

* `AGENTS.md`
* `README.md`
* `CONTRIBUTING.md`
* `docs/specification.md`
* `docs/architecture.md`
* `docs/ui-specification.md`
* `docs/features/`
* contratos de API;
* configuración de CI;
* archivos de dependencias, build y pruebas.

No debe afirmar que una validación pasó si no fue ejecutada, ocultar fallos, desactivar pruebas, reducir cobertura ni modificar requisitos para obtener un resultado exitoso.

No debe crear commits, abrir pull requests ni realizar merges salvo que se le solicite explícitamente.

Crea únicamente:

* `SKILL.md`
* `agents/openai.yaml`
* las referencias mínimas que realmente sean necesarias.

Mantén `SKILL.md` breve, usa instrucciones en español y elimina archivos de ejemplo innecesarios.

Valida la Skill al finalizar.
```

## Prompt 6

```text
Usa la Skill `feature-implementer` para generar el scaffolding inicial del proyecto conforme a la documentación existente.

Crea:

* `frontend/` con React, TypeScript y Vite;
* `backend/` con Go;
* endpoint `GET /health`;
* configuración base de pruebas;
* Dockerfiles para frontend y backend;
* `docker-compose.yml`;
* variables de entorno de ejemplo cuando sean necesarias.

El frontend debe quedar preparado para consumir el backend mediante `VITE_API_BASE_URL`.

El backend debe leer el puerto desde `PORT`, responder JSON desde `/health` e incluir una prueba del endpoint.

No implementes todavía las operaciones de la calculadora ni la UI final.
```

## Prompt 7

```text
Ejecuta quality-gate
Documenta el scaffold con feature-documenter
```

## Prompt 8

```text
La siguiente feature debería ser un flujo completo mínimo:

1. Definir POST /api/v1/calculations.
2. Implementar suma en Go.
3. Agregar unit tests de la lógica.
4. Agregar tests del handler HTTP.
5. Crear el cliente API en React.
6. Implementar una UI mínima que envíe una suma.
7. Mostrar resultado y errores.
8. Agregar pruebas de frontend.
9. Ejecutar quality-gate.
10. Documentar la feature.

No implementes todavía todas las operaciones ni la UI visual completa. Primero comprueba que el flujo:

React → REST API → Go → resultado → React
```

## Prompt 9

```text
Usa la Skill `feature-implementer` para reemplazar la interfaz provisional por una calculadora visual interactiva, respetando `docs/ui-specification.md` y el asset de referencia adjunto.

La imagen es una referencia para el estilo, proporciones y jerarquía visual. La siguiente distribución es la fuente de verdad funcional:

┌─────┬─────┬─────┬─────┐
│  C  │ DEL │     │  ÷  │
├─────┼─────┼─────┼─────┤
│  7  │  8  │  9  │  ×  │
├─────┼─────┼─────┼─────┤
│  4  │  5  │  6  │  −  │
├─────┼─────┼─────┼─────┤
│  1  │  2  │  3  │  +  │
├─────┼─────┼─────┼─────┤
│  0  │  .  │     │  =  │
└─────┴─────┴─────┴─────┘

Los espacios vacíos pueden usarse para extender los botones `C` y `0`, o conservarse según la composición visual más coherente.

La interfaz debe incluir:

- display para la expresión actual y el resultado;
- botones clickeables del `0` al `9`;
- punto decimal;
- botones `C`, `DEL` y `=`;
- suma, resta, multiplicación y división;
- entrada mediante clic y teclado;
- soporte para `Enter`, `Backspace` y `Escape`;
- estados de carga, resultado y error;
- diseño responsive utilizable desde 320 px.

Los clics y las teclas deben utilizar la misma lógica de estado. Al presionar `=`, consume el endpoint existente del backend.

No agregues todavía potencia, raíz cuadrada ni porcentaje.
Usa el asset de referencia como referencia visual
```

## Prompt 10

```text
Usa la Skill `feature-implementer` para mejorar la presentación de errores de la calculadora sin modificar su diseño general.

Integra los errores dentro del display superior en lugar de mostrarlos en un bloque separado debajo del teclado.

Cuando ocurra un error:

- conserva la expresión actual en la parte superior del display;
- muestra `Error` en el área principal del resultado;
- muestra debajo un mensaje breve y claro;
- aplica un estado visual de error discreto dentro del display;
- no cambies el tamaño general de la calculadora;
- no provoques saltos de layout.

Usa mensajes breves, por ejemplo:

- `Completa la operación`
- `No se puede dividir entre cero`
- `Ingresa un número válido`
- `No fue posible realizar el cálculo`

El error debe limpiarse cuando el usuario:

- ingrese un nuevo número;
- presione `DEL`;
- presione `C`;
- seleccione una nueva operación.

Mantén accesibilidad mediante `role="alert"` o `aria-live`, sin depender únicamente del color.

No modifiques el backend ni agregues nuevas operaciones.

Agrega este prompt a `docs/prompts-usados.md`.
No hagas commits ni modifiques ramas.
```

## Prompt 11

```text
Usa la Skill `feature-implementer` para ampliar el flujo de cálculo actual.

Implementa soporte para las operaciones básicas:

- suma;
- resta;
- multiplicación;
- división.

La calculadora debe aceptar cadenas con múltiples operandos, por ejemplo:

- `2 + 3 + 4`
- `20 - 5 - 3`
- `2 × 3 × 4`
- `100 ÷ 2 ÷ 5`

La evaluación debe seguir el orden de captura de la calculadora, sin implementar todavía precedencia matemática entre operadores distintos.

Después de obtener un resultado, el usuario debe poder seleccionar otra operación y continuar usando ese resultado como primer operando.

Ejemplo:

- `5 + 5 = 10`
- después `× 2 = 20`

También debe permitir:

- iniciar una nueva operación después de un resultado al escribir un número;
- reemplazar la operación seleccionada si todavía no se ingresó el siguiente operando;
- impedir operadores consecutivos invalidos;
- manejar división entre cero;
- conservar la integración actual entre frontend y backend;
- mostrar errores dentro del display;
- mantener soporte por clic y teclado.

Actualiza el backend, frontend, contrato API y pruebas necesarias.

No agregues todavía potencia, raíz cuadrada, porcentaje ni precedencia de operadores.

Agrega este prompt a `docs/prompts-usados.md`.

No hagas commits ni modifiques ramas.
```

## Prompt 12

```text
Usa la Skill `feature-implementer` para agregar operaciones avanzadas a la calculadora existente.

Implementa:

- potencia;
- raíz cuadrada;
- porcentaje.

Comportamiento esperado:

- Potencia debe recibir base y exponente.
- Raíz cuadrada debe operar sobre un solo valor.
- Porcentaje debe calcular:
  percentage(value, rate) = value * rate / 100
- El resultado de cualquiera de estas operaciones debe poder reutilizarse para continuar calculando.
- Debe funcionar mediante clic y teclado cuando exista una tecla o combinación apropiada.
- Mantén los errores integrados en el display.

Agrega botones para las nuevas operaciones sin romper la distribución visual actual. Ajusta la cuadrícula de forma coherente y responsive.

Incluye validaciones para:

- raíz cuadrada de números negativos;
- operandos faltantes;
- valores no numéricos;
- resultados no finitos;
- base o exponente inválidos;
- uso incorrecto de operaciones unarias y binarias.

Actualiza frontend, backend y contrato API. Agrega pruebas backend y frontend para casos exitosos, inválidos, límites y continuidad desde resultados previos.

No agregues historial, persistencia ni parsing de expresiones con precedencia matemática.

Agrega este prompt a `docs/prompts-usados.md`.

No hagas commits ni modifiques ramas.
```

## Prompt 13

```text
Usa la Skill `feature-implementer` para ampliar las pruebas E2E existentes con Playwright después de la implementación de las operaciones básicas y avanzadas.

Agrega o ajusta pruebas para los flujos críticos:

- operación básica mediante clics;
- operación mediante teclado;
- cálculo con varios operandos;
- operación encadenada usando el resultado anterior;
- limpieza con `C` y `Escape`;
- borrado con `DEL` y `Backspace`;
- división entre cero;
- raíz cuadrada de un número negativo;
- potencia;
- porcentaje;
- errores del backend o de red;
- funcionamiento básico en viewport móvil.

Reutiliza la configuración, fixtures, helpers y convenciones actuales de Playwright. Evita duplicar escenarios ya cubiertos.

Las pruebas deben usar selectores accesibles, ejecutar el flujo real entre frontend y backend y no depender de esperas arbitrarias ni detalles visuales frágiles.

Revisa también si existen huecos relevantes en las pruebas unitarias, de componentes, handlers e integración, y agrega únicamente los casos faltantes que aporten cobertura real.

No cambies el comportamiento funcional ni el diseño salvo que sea necesario para mejorar la accesibilidad o estabilidad de las pruebas.

Agrega este prompt a `docs/prompts-usados.md`.

No hagas commits ni modifiques ramas.
El borde derecho del delete y del "=" no está alineado con los demás
```

## Prompt 14

```text
El límite de 48 caracteres es bastante, hay que reducirlo a algo realista y razonable
```

## Prompt 15

```text
la ui no tiene un controlador directo para navegar horizontalmente en el resultado, tenemos que ajustar eso ya sea restringiendo la cantidad de caracteres, o agregando navegación explícita de forma natural
```

## Prompt 16

```text
Asegúrate de manejar todas las excepciones, por ejemplo si un resultado sobrepasa el límite del tipo de dato
```

## Prompt 17

```text
Usa la Skill `feature-implementer` para preparar el proyecto para su entrega final, respetando la documentación y configuración existentes.

Completa y revisa:

- `README.md` con descripción del proyecto, stack, arquitectura y estructura del repositorio setup instructions, API examples, and design decisions; 
- requisitos previos e instrucciones para ejecutar frontend y backend localmente;
- instrucciones para levantar toda la aplicación con Docker Compose;
- variables de entorno necesarias;
- ejemplos de uso del API con `curl`;
- operaciones soportadas y formato de errores;
- comandos para ejecutar pruebas unitarias, integración, E2E y cobertura;
- decisiones técnicas y supuestos relevantes;
- limitaciones conocidas;
- sección sobre uso de IA y referencia a `docs/prompts-usados.md`.

Verifica también que:

- `docker compose up --build` levante frontend y backend correctamente;
- el frontend consuma la URL configurada del backend;
- el backend exponga `GET /health`;
- no existan instrucciones obsoletas o contradictorias;
- no haya secretos, archivos temporales ni contenido de depuración;
- la documentación permita que otra persona clone y ejecute el proyecto sin contexto adicional.

No agregues nuevas funcionalidades salvo que sea necesario corregir un problema que impida ejecutar, probar o evaluar la aplicación.

Agrega este prompt a `docs/prompts-usados.md`.

No hagas commits ni modifiques ramas.
```

## Prompt 18

```text
Usa la Skill `feature-implementer` para agregar jerarquía de operaciones a la calculadora existente.

La calculadora debe evaluar expresiones mixtas respetando esta precedencia:

1. raíz cuadrada;
2. potencia;
3. multiplicación y división;
4. suma y resta.

Las operaciones con la misma prioridad deben evaluarse de izquierda a derecha, excepto potencia si la implementación actual define asociatividad distinta; en ese caso, documenta y prueba la decisión.

Ejemplos esperados:

- `2 + 3 × 4 = 14`
- `20 ÷ 5 × 2 = 8`
- `2 + 3² = 11`
- `√16 + 2 × 3 = 10`

Actualiza la lógica necesaria para que frontend y backend utilicen una representación consistente de la expresión. No evalúes expresiones con `eval` ni mediante ejecución dinámica de código.

Mantén:

- entrada por clic y teclado;
- cálculo con múltiples operandos;
- continuidad usando el resultado anterior;
- errores integrados en el display;
- validación de expresiones incompletas;
- división entre cero;
- resultados no finitos.

Agrega o actualiza pruebas unitarias, de integración, frontend y E2E para:

- precedencia entre operaciones distintas;
- operaciones con la misma prioridad;
- expresiones largas;
- operaciones avanzadas combinadas;
- expresiones inválidas;
- regresión de los flujos existentes.

Actualiza el contrato API y la documentación si cambia la estructura del request.

No agregues todavía paréntesis, variables, funciones adicionales ni un lenguaje matemático completo.

Agrega este prompt a `docs/prompts-usados.md`.

No hagas commits ni modifiques ramas.
```

