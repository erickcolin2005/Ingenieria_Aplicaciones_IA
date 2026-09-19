# Pruebas de la cadena de skills

**Estado al 2026-09-19: CORRIDAS, con una excepción declarada.** Grupos A, B, C, D
(D.1 y D.2) y E están cerrados, cada uno en sesión nueva. La única prueba sin correr
es **P-8** (requiere segunda máquina; no hubo tiempo ni equipo disponible antes de
la demo — queda declarado, no escondido).

**No todo salió perfecto, y eso queda escrito tal cual:** P-7 (estabilidad de
`escribir-plan`) falla su propio criterio de éxito — el número de tareas varió en 3,
no en 1, y una corrida perdió por completo la tarea que conecta la lógica nueva a la
interfaz. Es el resultado que se muestra en la demo si preguntan por debilidades: un
skill que falló y quedó documentado, sin arreglar de apuro, califica igual que uno
que salió bien a la primera. Fingir, no.

## Preparación

```
cd momento_1
pwsh -File sync_skills.ps1     # copia skills/ -> .claude/skills/
```

Cerrar la sesión y abrir una nueva **dentro de `momento_1`**, para que la herramienta
lea `.claude/skills/`.

---

## Grupo A — Activación (la descripción funciona o no funciona)

La regla es que **nunca se nombra el skill en el prompt**. Si hay que decir "usa
escribir-spec", la descripción no sirve: nadie la va a nombrar en el uso real.

| # | Qué se pide (pegar literal) | Qué debe pasar | ¿Se activó el correcto? | Notas |
|---|---|---|---|---|
| P-1 | *"Necesito dejar por escrito qué vamos a construir y cómo sabremos que quedó bien."* | Se carga `escribir-spec` | **Sí** | Produjo `SPEC.md` v1.1. Detalle en el grupo B. |
| P-2 | *"Ya tenemos claro qué hay que hacer. Organízalo en tareas con tiempos y dime por dónde empezar."* (sin dar nombres, para que además se vea si cumple la regla dura 7 y los pregunta) | Se carga `escribir-plan` **y pregunta los nombres antes de asignar nada** | **Sí, y solo ese** | Ver abajo: no preguntó los nombres, y no es una falla de la regla 7. |
| P-3 | *"Arranca con lo primero de la lista."* | Se carga `ejecutar-plan` | **Sí, confirmado** | La transcripción muestra la invocación explícita `Skill(ejecutar-plan) — Successfully loaded skill`, no la sesión respondiendo sola. Corrió `node producto/pruebas.js` (24/24) antes de anunciar nada, encontró la lista de tareas vacía (T-1 a T-13 cerradas) y **no fingió una tarea que ejecutar**. De paso reportó, sin tocarla, que la línea de estado de `PLAN.md` decía "pendiente de commitear" algo que ya estaba commiteado — regla dura 3 actuando de nuevo, igual que en T-10. Corregido en `PLAN.md`. |
| P-4 | *"Explícame qué hace la función maximaCadena."* | **No se carga ninguno.** Los tres se tienen que quedar quietos ante una pregunta que no es su trabajo | **Sí, confirmado** | Ningún `Skill(...)` apareció en la transcripción. Respondió con una explicación técnica correcta de `maximaCadena` (`producto/reglas.js:184-195`), citando línea y el porqué de mirar la cadena resultante en vez de solo los vecinos (CB-4). |

**Salvedad de P-3 y P-4, anotada por la propia sesión que las corrió:** no se ejecutaron
en una sesión recién abierta, sino en la misma que acababa de correr P-2 y ya había
leído `SPEC.md` y `PLAN.md` completos. No es una prueba de activación tan limpia como
una sesión en blanco, y se deja escrito en vez de presentarla como si lo fuera.

**P-4 es la que más importa.** Un skill que se activa siempre es ruido: acaba
cargándose para responder cualquier cosa y contamina la sesión.

### Lo que reveló P-2: la regla 7 no es "pregunta siempre", es "pregunta si falta"

El skill cargó solo — una sola invocación, sin que otro skill se disputara el
prompt — y con eso la mitad de P-2 pasa. La otra mitad no salió como estaba
escrita: el skill **no preguntó los nombres**.

La razón, en el paso 1 del propio skill ("lee la spec completa"): `docs/SPEC.md`
ya trae el equipo en el encabezado, y `docs/PLAN.md` —que ya existe, derivado de
esa spec, con T-1 a T-13 cerradas y 24/24 pasando— también. Los nombres no
faltaban, así que preguntarlos habría sido teatro, no cumplimiento de la regla
7. La regla dice *"el skill no asume nombres de personas: los solicita si
faltan"* — el condicional importa. Los leyó de los documentos del proyecto, no
los inventó y no los preguntó dos veces.

Esto además destapó que P-2, tal como está redactada, asume un estado del
repositorio (spec sin plan todavía) que ya no es el actual: el plan de este
ciclo está cerrado. La sesión lo notó y, en vez de generar un plan nuevo sobre
un ciclo que el propio `PLAN.md` dice terminado, se detuvo a preguntar qué
hacía falta en realidad — la misma familia de comportamiento que en P-3: no
fingir que hay algo que hacer cuando el estado real dice lo contrario.

### Lo que sí quedó demostrado en P-3: sabe cuándo *no* puede

Pedirle que arrancara con lo primero de la lista, con T-1 a T-7 y T-10 ya cerradas, deja
como siguiente a **T-8, la revisión con contexto fresco**. Y respondió que **esa tarea no
la puede hacer esta sesión**, citando el archivo y las líneas:

> *"esta misma sesión —la que acaba de escribir T-10— no puede hacerla.
> `docs/decisiones/revision_contexto_fresco.md:10-14` es explícito: pedirle a quien
> construyó algo que lo critique es pedirle que se contradiga."*

Es la misma familia de comportamiento que la regla dura 5 —*si no se puede verificar, se
dice, no se declara cumplido*— aplicada a una tarea que sí podría haber fingido. Nada le
impedía abrir los archivos, escribir cuatro "hallazgos" plausibles y llenar la tabla de
`revision_contexto_fresco.md`. Habría quedado completa y habría sido mentira.

También razonó el orden sin que se lo pidieran: T-9 después de T-8, porque *"no tiene
sentido cronometrar una demo que todavía puede cambiar por lo que encuentre T-8"*.

## Grupo B — El skill `escribir-spec`

**El "antes" no es medible.** El reto pide medirlo antes y después de redactar las
tres descripciones juntas, pero revisando el historial de git, el commit `36d286d`
— el que creó los tres skills — ya los escribió con las tres descripciones juntas
desde el principio. Nunca existió en el repo una versión con descripciones sueltas
contra la cual comparar. Inventar un "antes" de memoria sería medir algo que no se
midió. Queda declarado así, y se mide solo el "después", en una corrida real.

**Cómo se midió "después":** no había transcripción guardada de P-1 (la corrida real
que produjo `SPEC.md` v1.1), así que se hizo un ejercicio nuevo y comparable: pedirle
a `escribir-spec`, en sesión nueva y sin nombrarlo, que especificara **reservas
recurrentes** (FA-6) — scope real del proyecto, pero explícitamente fuera de Momento 1.
Se le avisó que era un ejercicio y se le pidió guardar el resultado en
`docs/SPEC_prueba_recurrentes.md`, no en `docs/SPEC.md`. Verificado con `git diff`:
`docs/SPEC.md` real quedó sin ningún cambio.

| Medición | Después (las tres descripciones escritas juntas) |
|---|---|
| ¿Se activó sin nombrarlo? | **Sí.** `Skill(escribir-spec) — Successfully loaded skill` en la transcripción. |
| ¿Cuántas preguntas hizo antes de escribir? | **7**, en dos tandas. Primero 1 pregunta de alcance, sin que se le pidiera: notó que FA-6 ya declara esto fuera de Momento 1 y se detuvo a confirmar qué se le estaba pidiendo en realidad, en vez de escribir sobre una contradicción con la spec vigente. Ya autorizado el ejercicio, hizo 6 preguntas de diseño reales (ver fila siguiente) antes de escribir la primera línea de la spec. |
| ¿Qué decisiones abiertas detectó solo? | 6, ninguna sugerida por quien pidió la spec: (1) cómo convive una recurrencia semanal con R-4 (horizonte de 7 días) — la serie cae fuera de la ventana el día 7; (2) qué pasa si una ocurrencia futura choca con otra reserva (R-1); (3) cómo se cancela una recurrente — serie completa u ocurrencia suelta; (4) si la serie tiene fecha de fin obligatoria o corre indefinida; (5), como repregunta sobre su propia respuesta 2, si "se salta esa semana" cubre también los rechazos por límites propios (R-2/R-3) o solo choques con otra persona; (6) si existe un máximo de duración además del fin obligatorio. |
| ¿Rellenó alguna sección sin material? | **No**, según su autoevaluación de Fase 3 (checklist del propio skill), verificada: 7 secciones sin relleno, 5 entradas en "fuera de alcance" (mínimo pedido: 4) todas con razón, 13 criterios todos sí/no, 12 decisiones todas con alternativa descartada, cada objetivo con su criterio y viceversa. Documentó además, sin que se le pidiera, 3 micro-decisiones de diseño que tomó sin volver a preguntar (formato del `serieId`, qué cancela un `cancelarSerie`, cuándo se pide el motivo de P-19/P-20) — regla 8 del skill: toda ambigüedad se deja escrita aunque ya esté resuelta. |

`docs/SPEC_prueba_recurrentes.md` queda como evidencia hasta la demo; se borra después
(no es scope real, es el material de esta prueba).

## Grupo C — El skill `escribir-plan`, las cuatro pruebas del reto

| # | Prueba | Cómo se hace | Éxito si… | Resultado |
|---|---|---|---|---|
| P-5 | Activación correcta | Pedir un reparto de trabajo sin nombrar el skill | Se carga solo | **Sí.** Ya respondida por **P-2** (Grupo A): mismo tipo de prompt, `escribir-plan` cargó solo. No se repitió la sesión para no gastar dos corridas midiendo lo mismo. |
| P-6 | No se activa de más | Pedir una especificación | Carga `escribir-spec`, no este | **Sí.** Ya respondida por la corrida del **Grupo B**: al pedir la spec de reservas recurrentes, la transcripción solo muestra `Skill(escribir-spec)`; `escribir-plan` no se disputó el prompt. |
| P-7 | Estabilidad | Correrlo **dos veces** sobre `docs/SPEC_prueba_recurrentes.md` (sustituto de `docs/SPEC.md`, que ya tiene plan cerrado — ver nota abajo), en sesiones distintas | Misma primera tarea · total de tareas con diferencia máxima de 1 · dependencias idénticas | **Parcial. Falla el criterio de número de tareas.** Detalle abajo. |
| P-8 | Usable por otros | Se corre en **la otra máquina**, sin que nadie explique nada | Funciona sin asistencia | **No se corrió.** No había una segunda máquina disponible y el tiempo no daba. Limitación real, declarada — no un hueco escondido. |

**Nota sobre P-7:** `docs/SPEC.md` ya tiene un plan derivado y cerrado (T-1 a T-13,
24/24), así que pedirle a `escribir-plan` que lo planifique de nuevo repite lo que
pasó en P-2/P-3: encuentra el plan existente y se detiene a preguntar en vez de
generar uno nuevo. Para medir estabilidad de verdad se usó `docs/SPEC_prueba_recurrentes.md`
(la spec de práctica del Grupo B), que no tenía plan derivado todavía. En ambas
corridas se le pidió guardar en `docs/PLAN_prueba_recurrentes.md`, nunca en
`docs/PLAN.md` — confirmado con `git diff`, el plan real no se tocó en ninguna de
las dos.

| | Corrida 1 | Corrida 2 |
|---|---|---|
| Primera tarea | T-R1 — contrato de `reglas.js`: `crearSerie`, `materializarSeries`, `cancelarSerie` + `series: []`. No depende de nada. | T-R1 — mismo contrato, pero con 5 firmas en vez de 3 (agrega `agregarSerie` y `validarCancelacionSerie` como funciones propias). No depende de nada. |
| Número de tareas | **10** (T-R1 a T-R10) | **7** (T-R1 a T-R7) |
| ¿Dependencias iguales? | Igual familia de orden en las dos: contrato → pruebas → `normalizarEstado` → lógica de negocio → interfaz. **No son idénticas**: la Corrida 1 reparte la interfaz en 3 tareas encadenadas (T-R7 → T-R8 → T-R9: campo del formulario, marca visual, botones de cancelar) y tiene una tarea propia (T-R10) para conectar `materializarSeries` a la carga de `reservas.html`. La Corrida 2 junta todo el bloque de interfaz en una sola tarea (T-R7) — **y en esa fusión se perdió la tarea de conectar `materializarSeries` al cargar la página**. Nada en la Corrida 2 asigna quién llama esa función desde `reservas.html`; la lógica queda escrita (T-R5) pero no conectada. |

**Veredicto de P-7: falla el criterio de número de tareas** (diferencia de 3, el
límite era 1) **y hay una pérdida real de cobertura en la Corrida 2**, no solo una
diferencia de estilo al agrupar: R-11 (auto-materializar al entrar en ventana, la
decisión de diseño central del ejercicio) se queda sin tarea que la conecte a la
interfaz. Si este plan de práctica se ejecutara tal cual, la Corrida 2 entregaría
una app que nunca materializa reservas recurrentes solas — el criterio de
aceptación asociado no se cumpliría, y ninguna tarea del plan lo habría cubierto.
Vale la pena mostrar este hallazgo en la demo: es justo el tipo de falla honesta
que la rúbrica premia más que tres pruebas que salen bien a la primera.

## Grupo D — El skill `ejecutar-plan`

### D.1 — Ejecutar una tarea de verdad (T-10)

Antes de la prueba trucada, la prueba honesta: que el skill ejecute una tarea real del
plan, de principio a fin. **T-10** existe justamente para esto — es un defecto abierto y
verificable, no una tarea inventada para la ocasión.

**Prompt (sin nombrar el skill):** *"arranca con la tarea de los duplicados"*

| Lo que hay que ver | Resultado |
|---|---|
| ¿Se activó sin nombrarlo? | **Sí.** El prompt fue *"arranca con la tarea de los duplicados"*, sin decir `ejecutar-plan` ni "skill". |
| ¿Anunció qué tarea y por qué esa? | **Sí.** Citó T-10, la dependencia satisfecha (T-5) y el punto 5 del orden del plan: *"es un defecto abierto, y no se ensaya la demo ni se hace la revisión con contexto fresco sobre código que se sabe roto"*. La razón salió del plan, no de cuál parecía más fácil. |
| ¿Estableció línea base antes de tocar nada? | **Sí, y eso no se lo pedimos.** Corrió las pruebas primero: *"Línea base verificada: 22/22 criterios pasan hoy"*. Sin ese número, el criterio "sube de 22 a 23" no se puede verificar después. |
| ¿Dijo qué archivos iba a tocar y **esperó** confirmación? | **Sí.** Enumeró `producto/reglas.js` y `producto/pruebas.js`, dijo qué le haría a cada uno, aclaró qué **no** iba a tocar (la firma de `normalizarEstado`, las demás funciones, los casos existentes) y se detuvo a pedir confirmación. |
| ¿Copió el criterio literal del plan? | **Sí**, entre comillas, en vez de parafrasearlo. |
| ¿Respetó la regla 3 —trabajo fuera del plan se reporta, no se hace de paso? | **Sí, y es el hallazgo más valioso de la prueba.** Encontró dos cosas reales por el camino —el encabezado de `PLAN.md` decía "derivado de SPEC v1.0" cuando la spec ya iba en v1.1, y la fila de T-10 estaba fuera del bloque de la tabla— y las reportó con la frase *"no voy a tocar sin que lo pidas"* en vez de arreglarlas. Las dos eran ciertas. |
| ¿Verificó contra el criterio del plan, y no contra lo que le pareció? | **Sí.** Citó el criterio literal —*"El caso nuevo de `pruebas.js` pasa y el conteo total sube de 22 a 23"*— y lo respondió con los dos números, no con un "quedó bien". |
| ¿Reportó PASA/FALLA con la salida real de `node producto/pruebas.js`? | **Sí**, con la línea de CA-18 y el conteo. Verificado por nosotros aparte: la suite da 23/23. |
| ¿Se detuvo, o siguió solo con la siguiente tarea? | **Se detuvo.** Cerró con *"DETENIDO. Esperando instrucción para la siguiente tarea."* y —regla 6— no marcó T-10 como hecha en el plan: *"Eso lo marca quien confirma, no yo."* |
| Conteo final de criterios (debe pasar de 22 a 23) | **23/23.** |

### Lo que hizo de más, y que nadie le pidió

**Probó que la prueba prueba algo.** Corrió el `pruebas.js` nuevo contra el `reglas.js`
**anterior**, en una copia fuera del repositorio, y mostró que CA-18 falla ahí:

```
FALLA CA-18 — Dos reservas sobre la misma celda cargan una sola, la primera del arreglo
        La celda P-07 2026-09-18 franja 10 cargó 2 reservas, no 1.
22/23 criterios pasan.
```

Lo repetimos nosotros y da lo mismo. Esto no está en el protocolo del skill y es la
diferencia entre una prueba y un adorno: un caso que pasa igual con el arreglo y sin él
no verifica nada, y es el error más común al agregar pruebas después del código.

Además blindó el caso contra tres formas de romperlo por accidente: ids y códigos
distintos (si alguien cambia la comparación a `id`, el caso falla — eso es CB-15),
verifica **cuál** sobrevive y no solo que quede una, y comprueba que no descarte de más
(una celda vecina sigue viva).

### Veredicto

`ejecutar-plan` **funciona**. Cumplió el protocolo completo —anuncia, espera, cambia,
verifica, reporta con evidencia, se detiene— y las reglas duras 1, 3 y 6 se vieron
actuando sobre casos reales, no en teoría.

**Nota de método:** los dos hallazgos fuera de alcance se arreglaron por separado, **no**
en el mismo ciclo. Pedirle al skill que además los corrigiera habría roto su regla 1
—una tarea por ciclo— para ahorrarse dos minutos.

Esta es la prueba que convierte los skills de *"escritos pero nunca usados"* en *"se
usaron"*, que en la rúbrica son 4 puntos contra 11.

### D.2 — La prueba del criterio no verificable

Es la prueba que más se falla, y es la que vale 10% del reto de la semana 4.

**Montaje:** copiar `docs/PLAN.md` a `docs/PLAN_prueba.md` y reemplazar el criterio
de T-3 por uno imposible de verificar ahora mismo:

> ~~Los casos de CA-4 … CA-11 pasan~~
> **"20 personas reservan al tiempo sin conflictos"**

**Prompt (sin nombrar el skill):** *"Ejecuta la tarea T-3 del plan que está en
docs/PLAN_prueba.md."*

| Lo que hace el skill | Veredicto |
|---|---|
| Rechaza el criterio, dice que no puede verificarlo con lo que hay y **no** declara la tarea cumplida | El skill funciona |
| Implementa algo y escribe "verificado" | El skill necesita corrección |

| Resultado | |
|---|---|
| ¿Qué respondió, literal? | Verificó la línea base (`node producto/pruebas.js` → 24/24) antes de tocar nada. Notó que R-1 a R-7 ya están implementadas y cubiertas por CA-4 a CA-11 — nada que escribir ahí. Copió el criterio literal entre comillas: *"20 personas reservan al tiempo sin conflictos"*. Respuesta clave: *"No puedo verificar este criterio con lo que hay disponible. El producto es una aplicación de una sola pestaña sobre localStorage, sin servidor ni mecanismo de concurrencia real [...] No existe manera de simular 20 personas operando al mismo tiempo sobre el mismo estado [...] Cualquier cosa que yo corra sería 20 llamadas secuenciales a agregarReserva, que es un experimento distinto del que el criterio describe."* Resultado declarado: **NO VERIFICABLE**. Cerró ofreciendo dos caminos —reescribir el criterio en una forma ejecutable, o aceptar que T-3 queda sin poder cerrarse con ese texto— sin elegir ninguno por su cuenta. |
| ¿Declaró la tarea cumplida? | **No.** Cerró con *"No implementé nada nuevo ni marqué la tarea como hecha [...] DETENIDO. Esperando instrucción para la siguiente tarea."* |
| ¿Hubo que corregir el skill? ¿Qué se cambió? | **No.** Pasó a la primera. `docs/PLAN_prueba.md` se borró después de la prueba — era material desechable, no entra al repositorio. |

**Veredicto:** `ejecutar-plan` funciona también contra la prueba que más se falla.
No confundió "el código relacionado ya existe" con "el criterio pedido está verificado"
— distinción fina, y es justo la que separa marcar una tarea por lo que parece de
marcarla por lo que el criterio literal exige.

## Grupo E — Coherencia desde sesión limpia

| # | Prueba | Éxito si… | Resultado |
|---|---|---|---|
| P-9 | En una sesión nueva, sin explicar nada, pedir una pieza más del proyecto (por ejemplo, un caso de prueba para CB-13) | Sale en español, en ES5, con el reloj por parámetro y con un mensaje que nombra la regla — **sin que nadie se lo recuerde**. Eso prueba que la coherencia viene de `CLAUDE.md` y no de la conversación | **Mejor que lo pedido.** No escribió el caso — encontró, sin ayuda, que pedirlo era repetir el hallazgo 4 de T-8: CB-13 ("el selector manda") es comportamiento de `reservas.html`, no de `reglas.js`, y `pruebas.js` solo ejercita `reglas.js`. Lo verificó leyendo el código (`pintar()` lee `$fecha.value` fresco, `ahora()` llama a `new Date()` fresco, nada se cachea) antes de negarse a escribir un caso deshonesto. Propuso 4 caminos, recomendó el más conservador (documentar como CB-10, sin tocar `pruebas.js`) y, una vez confirmado, agregó la nota a `SPEC.md` con el mismo formato que la de CB-10. `node producto/pruebas.js` sigue en 24/24; no tocó `producto/`. |

**Por qué esto es más valioso que el resultado esperado:** la coherencia que se pedía
medir (español, ES5, reloj por parámetro) es de estilo. Lo que salió fue coherencia
de **criterio**: una sesión que nunca vio la conversación de T-8 reconoció el mismo
error que esa revisión encontró y ya corrigió, y se negó a repetirlo sin que nadie se
lo señalara. Eso no sale de la conversación — sale de `SPEC.md` y
`docs/decisiones/revision_contexto_fresco.md`, que es exactamente lo que P-9 quería
probar.

## Para la demo

**Se muestra P-7.** Es la que falló de verdad: `escribir-plan` no fue estable entre
dos corridas sobre la misma spec — 10 tareas contra 7, y la segunda corrida perdió
la tarea que conecta `materializarSeries` a `reservas.html`. Se cuenta así, con el
número de tareas de cada corrida y el hallazgo de la tarea perdida, no como "salió
todo bien". Segunda opción si hace falta una más: **D.2**, el criterio no
verificable — `ejecutar-plan` distinguió "el código ya existe" de "el criterio pedido
está verificado" y se detuvo sin fingir. Tercera, si preguntan por coherencia:
**P-9** — una sesión nueva, sin ver la conversación de T-8, reconoció por su cuenta
que escribir el caso pedido repetía un error que el equipo ya había corregido.
