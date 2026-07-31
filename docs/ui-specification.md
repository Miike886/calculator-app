# Especificacion de UI

## Objetivo

Definir la experiencia visual e interactiva de una calculadora web que se comporte como una calculadora real, permitiendo entrada por botones y teclado.

## Alcance obligatorio

- Pantalla de calculadora con expresion actual.
- Pantalla de calculadora con resultado.
- Botones numericos del `0` al `9`.
- Botones de operaciones:
  - suma `+`
  - resta `-`
  - multiplicacion `x`
  - division `/`
  - potencia `^`
  - raiz cuadrada `√`
  - porcentaje `%`
- Boton `DEL`.
- Boton `C`.
- Boton `=`.
- Soporte de entrada por teclado.
- Visualizacion de errores de calculo o validacion.

## Alcance opcional futuro

- Soporte visual para operaciones cientificas adicionales.

## Layout propuesto

La primera pantalla debe ser directamente la calculadora, no una landing page.

Estructura visual sugerida:

```text
+-----------------------+
| expresion actual      |
| resultado             |
+-----------------------+
| C    C   DEL DEL      |
| √    ^    %   /       |
| 7    8    9   x       |
| 4    5    6   -       |
| 1    2    3   +       |
| 0    .    =   =       |
+-----------------------+
```

La grilla no debe renderizar botones vacios o inservibles. Para conservar una distribucion natural, `C`, `DEL` y `=` pueden ocupar dos columnas horizontales, manteniendo la altura normal de una tecla; el resto de botones debe conservar tamano uniforme.

El punto decimal `.` queda como recomendacion si se decide soportar decimales desde la primera version. Si no se soporta, debe excluirse de la UI inicial para evitar expectativas incorrectas.

## Estados de pantalla

### Estado inicial

- Expresion actual vacia o `0`.
- Resultado vacio o `0`, segun decision visual.
- No debe mostrarse error.

### Mientras el usuario escribe

- La expresion actual debe actualizarse en tiempo real.
- El resultado debe conservar el ultimo resultado o mantenerse vacio hasta ejecutar `=`.

### Calculo exitoso

- La expresion enviada debe permanecer visible.
- El resultado debe mostrarse de forma destacada.
- La UI debe permitir iniciar una nueva operacion.
- Si el usuario selecciona un operador despues de un resultado, el resultado debe usarse como primer operando.
- Si el usuario escribe un numero despues de un resultado, debe iniciar una operacion nueva.
- Si la expresion o el resultado exceden el ancho disponible, el display debe permitir revisar el contenido sin cambiar el tamano de la calculadora.
- El display debe incluir controles explicitos para desplazarse horizontalmente cuando el contenido sea largo.
- El display debe mostrar un contador compacto de caracteres de la expresion actual.

### Error

- La expresion actual debe permanecer visible.
- Debe mostrarse un mensaje de error legible.
- El usuario debe poder corregir con `DEL` o limpiar con `C`.

## Interacciones por botones

| Boton | Comportamiento obligatorio |
| --- | --- |
| `0` a `9` | Agrega el digito a la expresion actual. |
| `+` | Agrega operador de suma si la expresion lo permite. |
| `-` | Agrega operador de resta si la expresion lo permite. |
| `x` | Agrega operador de multiplicacion; se normaliza como `*` al enviar al backend. |
| `/` | Agrega operador de division si la expresion lo permite. |
| `^` | Agrega operador de potencia si la expresion lo permite. |
| `%` | Agrega operador de porcentaje binario si la expresion lo permite. |
| `√` | Envuelve el operando actual o el resultado previo como raiz cuadrada. |
| `DEL` | Elimina el ultimo caracter de la expresion. |
| `C` | Limpia expresion, resultado y error. |
| `=` | Ejecuta el calculo llamando al backend. |

## Interacciones por teclado

| Tecla | Comportamiento obligatorio |
| --- | --- |
| `0` a `9` | Agrega el digito a la expresion actual. |
| `+` | Agrega suma. |
| `-` | Agrega resta. |
| `*` | Agrega multiplicacion. |
| `/` | Agrega division. |
| `^` | Agrega potencia. |
| `%` | Agrega porcentaje. |
| `r` o `R` | Aplica raiz cuadrada al operando actual. |
| `Enter` | Ejecuta el calculo. |
| `Backspace` | Elimina el ultimo caracter. |
| `Escape` | Limpia expresion, resultado y error. |

## Reglas de entrada

### Obligatorias

- No permitir caracteres no soportados por la primera version.
- No enviar expresiones vacias al backend.
- No enviar expresiones que terminen en operador.
- No permitir que la expresion supere 24 caracteres.
- No permitir que `DEL` produzca un estado invalido visualmente; si no quedan caracteres, volver al estado inicial.

### Recomendadas

- Prevenir operadores consecutivos desde la UI.
- Permitir reemplazar el operador pendiente si aun no se ingreso el siguiente operando.
- Al reemplazar un operador pendiente, no debe conservarse una secuencia previa de operadores.
- Permitir `-` como signo negativo al inicio de la expresion o despues de multiplicacion/division.
- Permitir `-` como signo negativo despues de potencia o porcentaje cuando se capture un operando negativo.
- La raiz cuadrada requiere un operando completo; no debe aplicarse sobre expresion vacia, operador pendiente o numero terminado en punto.
- La raiz cuadrada de un numero negativo debe mostrarse como error.
- Potencia y porcentaje requieren operandos a ambos lados.
- Al ingresar `.` al inicio de un operando, mostrar `0.` para que el punto sea visible y el numero siga siendo valido.
- Mostrar feedback visual cuando una tecla o boton no sea aplicable.
- Mantener botones con tamano estable para evitar saltos de layout.
- Usar `aria-label` en botones para accesibilidad.

## Estados visuales de botones

Cada boton debe contemplar:

- Estado normal.
- Estado hover.
- Estado active o pressed.
- Estado focus visible para navegacion por teclado.
- Estado disabled si aplica.

## Accesibilidad

### Obligatorio

- Los botones deben ser accesibles mediante teclado.
- La pantalla de resultado debe poder ser anunciada por tecnologias asistivas.
- El foco visible no debe eliminarse.
- Los textos de botones deben tener contraste suficiente.

### Recomendado

- Usar etiquetas accesibles descriptivas, por ejemplo `aria-label="Sumar"` para `+`.
- Anunciar errores mediante una region con `role="alert"`.
- Mantener orden de tabulacion coherente con la disposicion visual.

## Contrato visual de expresion y resultado

- La expresion actual debe mostrarse en una linea secundaria.
- El resultado debe mostrarse con mayor jerarquia visual.
- Si el resultado es largo, debe evitar romper el layout.
- Si la expresion o el resultado son largos, deben conservarse completos mediante desplazamiento horizontal.
- Los resultados usados para continuar una operacion deben mostrarse como numero decimal compatible con el parser, no en notacion cientifica.
- El contenido de pantalla debe alinearse de forma consistente, preferentemente a la derecha como en calculadoras tradicionales.
- El display no debe mostrar barras de desplazamiento vertical.

## Casos UI a probar

- Click en `1`, `+`, `2`, `=` muestra expresion `1+2` y resultado `3`.
- Teclado `8`, `*`, `6`, `Enter` muestra resultado `48`.
- `DEL` elimina el ultimo caracter.
- `Backspace` elimina el ultimo caracter.
- `C` limpia pantalla.
- `Escape` limpia pantalla.
- Division entre cero muestra error.
- Potencia calcula `2^3 = 8`.
- Raiz cuadrada calcula `√(81) = 9`.
- Porcentaje calcula `200%10 = 20`.
- Raiz cuadrada de numero negativo muestra error.
- Una expresion incompleta no dispara un calculo exitoso.

## Fuera de alcance UI

- Historial visual de calculos.
- Login o perfil de usuario.
- Configuracion de temas.
- Panel de administracion.
- Grafica de operaciones.
- Modo cientifico en primera version.
