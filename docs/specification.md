# Especificacion del Proyecto

## Objetivo

Definir una calculadora full-stack en modalidad monorepo, con frontend en React + TypeScript y backend en Go, comunicados mediante REST API.

La primera version debe comportarse visualmente como una calculadora real y permitir operaciones aritmeticas simples: suma, resta, multiplicacion y division. El alcance de esta fase es definir especificaciones y criterios de aceptacion, sin implementar codigo.

## Requisitos funcionales obligatorios

- La aplicacion debe mostrar una interfaz similar a una calculadora fisica.
- La UI debe incluir botones clickeables e interactivos para los digitos `0` a `9`.
- La UI debe incluir botones para las operaciones:
  - suma
  - resta
  - multiplicacion
  - division
- La UI debe incluir un boton `DEL` para eliminar el ultimo caracter ingresado.
- La UI debe incluir un boton `C` para limpiar completamente la operacion actual.
- La UI debe incluir un boton `=` para ejecutar el calculo.
- La entrada debe poder realizarse mediante clicks en botones.
- La entrada debe poder realizarse mediante teclado.
- El teclado debe soportar:
  - `Enter` para ejecutar el calculo
  - `Backspace` para eliminar el ultimo caracter
  - `Escape` para limpiar la operacion actual
- La pantalla de la calculadora debe mostrar:
  - la expresion actual
  - el resultado
- El backend debe exponer `GET /health`.
- El backend debe exponer `POST /api/v1/calculations`.
- El backend debe validar la expresion recibida antes de calcular.
- El backend debe retornar errores estructurados para entradas invalidas.
- El proyecto debe incluir pruebas automatizadas unitarias y e2e.

## Requisitos funcionales opcionales

Estas capacidades no pertenecen a la primera version, pero deben quedar contempladas para una version posterior:

- Potencia.
- Raiz cuadrada.
- Porcentaje.

## Recomendaciones funcionales

- Mantener la expresion visible aun despues de calcular, para que el usuario entienda que resultado corresponde a que entrada.
- Permitir continuar operando despues de obtener un resultado, usando el resultado anterior como punto de partida.
- Evitar que la UI envie al backend expresiones evidentemente incompletas, aunque el backend debe conservar la validacion autoritativa.

## Requisitos no funcionales obligatorios

- El repositorio debe organizarse como monorepo.
- El frontend debe estar desarrollado con React y TypeScript.
- El backend debe estar desarrollado en Go.
- La comunicacion entre frontend y backend debe realizarse mediante REST API.
- La primera version no debe incluir persistencia.
- La primera version no debe incluir autenticacion.
- La primera version no debe incluir historial de calculos.
- La primera version no debe incluir microservicios adicionales.
- La solucion debe ser testeable desde el inicio.
- Los errores del backend deben ser consistentes y faciles de consumir por el frontend.

## Operaciones obligatorias

| Operacion | Simbolo UI | Simbolo API | Operandos esperados | Comportamiento |
| --- | --- | --- | --- | --- |
| Suma | `+` | `+` | 2 o mas | Retorna la suma de los operandos. |
| Resta | `-` | `-` | 2 o mas | Resta los operandos de izquierda a derecha. |
| Multiplicacion | `x` | `*` | 2 o mas | Retorna el producto de los operandos. |
| Division | `/` | `/` | 2 o mas | Divide los operandos de izquierda a derecha. |

## Operaciones opcionales futuras

| Operacion | Simbolo sugerido | Operandos esperados | Notas |
| --- | --- | --- | --- |
| Potencia | `^` | 2 | Eleva base a exponente. |
| Raiz cuadrada | `sqrt` o `√` | 1 | No aceptar operandos negativos si se limita a reales. |
| Porcentaje | `%` | 1 o 2, por definir | Requiere definicion precisa antes de implementar. |

## Comportamiento de operaciones

- Las operaciones binarias deben evaluarse respetando precedencia aritmetica comun:
  - multiplicacion y division antes que suma y resta
  - evaluacion de izquierda a derecha para operadores con misma precedencia
- La division entre cero debe rechazarse con error estructurado.
- Los numeros decimales deben permitirse si se define soporte de punto decimal en la UI. Para la primera version, se recomienda contemplarlo en la validacion aunque el teclado visual inicial pueda priorizar enteros.
- Los espacios en la expresion deben ser ignorados por el backend.
- Una expresion enviada al backend debe representar una operacion completa, por ejemplo `12+7`, `8*3`, `20/5`.

## Reglas de validacion

### Obligatorias

- La expresion no debe estar vacia.
- La expresion solo debe contener caracteres permitidos para la version activa.
- La expresion no debe terminar en un operador.
- La expresion no debe comenzar con un operador binario, salvo que se defina explicitamente soporte para numeros negativos.
- No deben permitirse dos operadores binarios consecutivos, salvo casos definidos para negativos.
- Division entre cero debe retornar error.
- El backend debe rechazar operaciones no soportadas en la version actual.
- El backend debe devolver `400 Bad Request` para entradas invalidas.

### Recomendadas

- Definir una longitud maxima de expresion para evitar abuso accidental, por ejemplo 256 caracteres.
- Usar numeros de punto flotante con una politica clara de precision para resultados decimales.
- Normalizar simbolos visuales antes de enviar al backend, por ejemplo convertir `x` a `*`.

## Casos de limite

- Expresion vacia.
- Expresion con solo un numero.
- Expresion terminada en operador: `12+`.
- Expresion con operadores consecutivos: `12++3`.
- Division entre cero: `10/0`.
- Numeros grandes.
- Resultados decimales: `10/4`.
- Multiples operaciones en una expresion: `2+3*4`.
- Uso repetido de `DEL` hasta dejar la expresion vacia.
- Uso de `C` despues de un calculo exitoso.
- Presionar `=` con una expresion incompleta.
- Presionar `Enter`, `Backspace` o `Escape` desde teclado.

## Errores esperados

| Condicion | Codigo HTTP | Codigo de error sugerido | Mensaje esperado |
| --- | --- | --- | --- |
| JSON invalido | 400 | `INVALID_JSON` | El cuerpo de la solicitud no es JSON valido. |
| Expresion vacia | 400 | `EMPTY_EXPRESSION` | La expresion no puede estar vacia. |
| Caracter no permitido | 400 | `INVALID_CHARACTER` | La expresion contiene caracteres no permitidos. |
| Expresion incompleta | 400 | `INCOMPLETE_EXPRESSION` | La expresion esta incompleta. |
| Operacion no soportada | 400 | `UNSUPPORTED_OPERATION` | La operacion no esta soportada en esta version. |
| Division entre cero | 400 | `DIVISION_BY_ZERO` | No se puede dividir entre cero. |
| Error inesperado | 500 | `INTERNAL_ERROR` | Ocurrio un error inesperado. |

## Contrato del endpoint de calculo

### Endpoint

`POST /api/v1/calculations`

### Request JSON

```json
{
  "expression": "12+7*2"
}
```

### Response exitosa

Codigo HTTP: `200 OK`

```json
{
  "expression": "12+7*2",
  "result": 26
}
```

### Response de error

```json
{
  "error": {
    "code": "DIVISION_BY_ZERO",
    "message": "No se puede dividir entre cero.",
    "details": {
      "expression": "10/0"
    }
  }
}
```

### Operaciones soportadas en primera version

| Operacion | Simbolo | Operandos esperados |
| --- | --- | --- |
| Suma | `+` | 2 o mas |
| Resta | `-` | 2 o mas |
| Multiplicacion | `*` | 2 o mas |
| Division | `/` | 2 o mas |

### Ejemplos de uso

Request:

```http
POST /api/v1/calculations
Content-Type: application/json
```

```json
{
  "expression": "8*6"
}
```

Response:

```json
{
  "expression": "8*6",
  "result": 48
}
```

Request invalida:

```json
{
  "expression": "5/0"
}
```

Response:

```json
{
  "error": {
    "code": "DIVISION_BY_ZERO",
    "message": "No se puede dividir entre cero.",
    "details": {
      "expression": "5/0"
    }
  }
}
```

## Criterios de aceptacion

- La UI muestra una calculadora con pantalla, digitos, operadores, `DEL`, `C` y `=`.
- El usuario puede construir una expresion usando clicks.
- El usuario puede construir una expresion usando teclado.
- `Enter` ejecuta el calculo.
- `Backspace` elimina el ultimo caracter.
- `Escape` limpia la operacion.
- La pantalla muestra expresion actual y resultado.
- El frontend llama a `POST /api/v1/calculations` para calcular.
- `GET /health` retorna estado saludable del backend.
- El backend calcula correctamente suma, resta, multiplicacion y division.
- El backend rechaza division entre cero.
- El backend retorna errores estructurados.
- Existen pruebas unitarias para logica critica de frontend y backend.
- Existen pruebas e2e para flujos principales de calculadora.
- No existe persistencia, autenticacion ni historial en la primera version.

## Fuera de alcance

- Persistencia de calculos.
- Historial de calculos.
- Autenticacion y autorizacion.
- Gestion de usuarios.
- Microservicios adicionales.
- Operaciones cientificas fuera de las indicadas como futuras.
- Internacionalizacion.
- Temas visuales avanzados.
- Modo offline.
- Sincronizacion entre dispositivos.
- Exportacion de resultados.
- Panel administrativo.
