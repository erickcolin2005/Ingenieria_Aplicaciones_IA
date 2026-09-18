# Revisión con contexto fresco

**Tarea:** T-8 · **La corren los tres**
**Estado: REVISIÓN HECHA, PENDIENTE DE JUICIO DEL EQUIPO.** Corrida en un agente sin
contexto de esta conversación ni del proceso de construcción — solo recibió el prompt
de abajo, tal cual. Los tres deben revisar cada fila y llenar "¿Es real?" y "Qué
hicimos" juntos; eso no lo decide una sesión sola.

Esta página está a propósito sin llenar. Los hallazgos de una revisión que no se hizo
no se pueden escribir de antemano, y en la sustentación la pregunta es literal:
*"¿qué encontró la revisión con contexto fresco que ustedes no vieron?"*

## Por qué en sesión aparte

La sesión que escribió el código ya tiene una explicación para cada decisión que tomó.
Pedirle que la critique es pedirle que se contradiga. Una sesión que no vio el proceso
solo tiene el código y los criterios, que es lo que importa.

## Cómo se hace

1. Cerrar la sesión actual por completo.
2. Abrir una sesión nueva en la carpeta `momento_1`.
3. Pegar el prompt de abajo **sin agregar contexto ni explicar nada**. Si uno empieza
   a justificar, la revisión ya se contaminó.
4. Copiar los hallazgos tal como salgan a la tabla de resultados. **También los que
   nos parezcan injustos**: si un hallazgo se descarta, se escribe por qué, no se borra.

## El prompt

```
Revisa producto/reglas.js, producto/reservas.html y producto/pruebas.js
contra los criterios de aceptación de docs/SPEC.md sección 6 y las reglas
de la sección 4.

Busca qué está mal. En concreto:
- Reglas de la spec que el código no implementa, o que implementa distinto.
- Criterios de aceptación que ninguna prueba verifica de verdad.
- Casos borde de la sección 5 que no tienen caso de prueba.
- Reglas de negocio duplicadas en la interfaz en vez de estar en reglas.js.
- Mensajes de error que no nombran la regla violada.

No arregles nada. Lista los hallazgos con archivo y línea.
```

## Resultados

| # | Hallazgo | Archivo y línea | ¿Es real? | Qué hicimos |
|---|---|---|---|---|
| 1 | `E_PUESTO`, `E_FRANJA`, `E_FECHA` y `E_NO_EXISTE` no nombran ninguna regla en su mensaje — los otros 10 códigos de `fallo()` sí llevan el prefijo "Regla X:" | `producto/reglas.js:191-199` (E_PUESTO, E_FRANJA, E_FECHA), `:274-276` (E_NO_EXISTE) | **Sí, pero el defecto está en el criterio, no en los mensajes.** Verificado leyendo las cuatro líneas. No existe ninguna regla que violar: "el puesto P-99 no existe" no incumple R-1…R-8, es un dato inválido. Inventar una regla para poder citarla sería peor. Lo que está mal escrito es CA-15, que dice "todo mensaje" cuando quería decir "todo rechazo por regla" | |
| 2 | CA-15 dice verificar "todo mensaje de error" pero solo ejercita 6 de los 14 códigos de fallo; nunca dispara los 4 del hallazgo 1, así que pasa en verde sin detectarlos | `producto/pruebas.js:239-256` | **Sí, y es el hallazgo grave.** Contados uno por uno: el caso dispara E_OCUPADA, E_CODIGO, E_INICIADA, E_ANTICIPACION, E_MOTIVO y E_AJENA. Nunca E_PUESTO, E_FRANJA, E_FECHA, E_NO_EXISTE, E_PASADA, E_MAX_DIARIAS, E_CONSECUTIVAS ni E_PLAZO. La aserción `indexOf('Regla ') === -1` es correcta y **no puede dispararse**, porque no se le pasan los mensajes que la romperían. Es una prueba en verde sobre un criterio falso | |
| 3 | El caso etiquetado "(CB-10)" prueba que `normalizarEstado` filtra entradas basura, no el escenario de CB-10 (localStorage lleno/deshabilitado/modo privado, con el mensaje "No se pudo guardar..."). CB-10 real no tiene caso de prueba | `producto/pruebas.js:201-210` (dentro de CA-14) | **Sí.** La etiqueta miente sobre qué se probó. CB-10 además **no es alcanzable** desde `pruebas.js`: `localStorage` lo toca `reservas.html`, no `reglas.js`, así que ese caso borde solo se verifica a ojo (abrir en modo privado) | |
| 4 | CA-2 está marcado 👁 en la spec (verificación visual), pero `pruebas.js` trae un caso automatizado con esa etiqueta que solo valida `R.PUESTOS.length` y `R.FRANJAS.length`, no el renderizado real de la cuadrícula | `producto/pruebas.js:258-265` | **Sí.** Mismo problema que el 3: la etiqueta promete más de lo que el caso hace. Lo que verifica —que el dominio son 20 puestos y 7 franjas— vale, pero no es CA-2 | |
| 5 | Las pistas de la interfaz ("Hoy y los 6 días siguientes", "6 a 10 dígitos", "mínimo 15 caracteres") están escritas a mano en vez de leerse de `REGLAS.DIAS_ADELANTE` / `MOTIVO_MINIMO`, que ya se exportan para esto | `producto/reservas.html:92, 97, 102` | **Sí.** Riesgo real: cambiar un límite en `reglas.js` deja la pantalla diciendo el número viejo, y nadie se entera porque ninguna prueba mira el HTML | |
| 6 | `pintar()` reimplementa la comparación de dueño (C-1: `reserva.codigo === codigo`) y de "franja ya pasó" (R-5: `inicioFranja(...) <= momento`) en vez de usar algo expuesto por `reglas.js`. Hoy coinciden con las reglas; es riesgo de divergencia futura, no un fallo actual | `producto/reservas.html:199, 201` | **Sí, y contradice una restricción que escribimos nosotros.** `docs/decisiones/loop.md`, incremento 3: *"La interfaz no reimplementa ninguna regla: si aparece un `if` con una regla de negocio en el HTML, está mal"*. Está mal | |

Sin hallazgos en: reglas de negocio que el código no implemente o implemente distinto
(R-1 a R-8 y C-1 a C-3 se revisaron una por una contra §4.4/§4.5 y coinciden en valores
y comportamiento con la spec).

**Conteo:** hallazgos reportados: 6 · confirmados: **6** · descartados con razón: **0**

Los seis se verificaron abriendo los archivos y leyendo las líneas señaladas, no dando
por buena la lista. Ninguno resultó inventado ni exagerado. Queda por decidir cuáles se
corrigen antes de la demo y cuáles se dejan documentados — esa columna la llenan los tres.

Si la revisión no encuentra nada, se escribe aquí *"cero hallazgos"* y se dice en la
demo. Es un resultado válido; inventarse hallazgos para que se vea trabajado, no.
