# Pruebas de la cadena de skills

**Estado: MONTADAS, SIN EJECUTAR.** Las columnas de resultado están vacías a
propósito. Todas estas pruebas exigen una **sesión nueva** —y una de ellas, la otra
máquina— así que no se pueden ejecutar desde la sesión en la que se
escribieron los skills: el resultado estaría contaminado por la conversación.

**Antes de la demo hay que correrlas y llenar las tablas.** Se anota lo que pase,
incluido lo que falle. Un skill que falló y se corrigió, con el registro del antes y
el después, califica igual que uno que salió bien a la primera. Fingir, no.

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
| # | Qué se pide (pegar literal) | Qué debe pasar | ¿Se activó el correcto? | Notas |
|---|---|---|---|---|
| P-1 | *"Necesito dejar por escrito qué vamos a construir y cómo sabremos que quedó bien."* | Se carga `escribir-spec` | **Sí** | Produjo `SPEC.md` v1.1. Detalle en el grupo B. |
| P-2 | *"Ya tenemos claro qué hay que hacer. Organízalo en tareas con tiempos y dime por dónde empezar."* (sin dar nombres, para que además se vea si cumple la regla dura 7 y los pregunta) | Se carga `escribir-plan` **y pregunta los nombres antes de asignar nada** | | |
| P-3 | *"Arranca con lo primero de la lista."* | Se carga `ejecutar-plan` | | Ver abajo: la respuesta fue correcta en contenido; falta confirmar si el skill se cargó o la sesión respondió sola. |
| P-4 | *"Explícame qué hace la función maximaCadena."* | **No se carga ninguno.** Los tres se tienen que quedar quietos ante una pregunta que no es su trabajo | | Respondió con una explicación técnica normal, sin protocolo de skill. Falta confirmar en la transcripción. |

**P-4 es la que más importa.** Un skill que se activa siempre es ruido: acaba
cargándose para responder cualquier cosa y contamina la sesión.

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

### Dato pendiente de confirmar

En las dos corridas de arriba falta un solo dato: **si la herramienta cargó el skill o si
la sesión respondió por su cuenta.** Se ve en la transcripción — aparece una invocación
del skill por nombre. Sin ese dato, P-3 y P-4 quedan sin marcar: el contenido de las
respuestas fue el correcto, pero estas dos pruebas miden **activación**, no contenido, y
darlas por buenas sin verlo sería justamente lo que este documento no hace.

## Grupo B — El skill `escribir-spec`, medido dos veces

El reto pide medirlo **antes y después** de redactar las tres descripciones juntas.
La segunda columna es la que demuestra si la cadena mejoró o solo cambió.

| Medición | Antes (descripciones sueltas) | Después (las tres escritas juntas) |
|---|---|---|
| ¿Se activó sin nombrarlo? | | |
| ¿Cuántas preguntas hizo antes de escribir? | | |
| ¿Qué decisiones abiertas detectó solo? (de las seis: franjas seguidas, franjas diarias, anticipación, inasistencia, plazo de cancelación, puestos diferenciados, mantenimiento) | | |
| ¿Rellenó alguna sección sin material? | | |

## Grupo C — El skill `escribir-plan`, las cuatro pruebas del reto

| # | Prueba | Cómo se hace | Éxito si… | Resultado |
|---|---|---|---|---|
| P-5 | Activación correcta | Pedir un reparto de trabajo sin nombrar el skill | Se carga solo | |
| P-6 | No se activa de más | Pedir una especificación | Carga `escribir-spec`, no este | |
| P-7 | Estabilidad | Correrlo **dos veces** sobre `docs/SPEC.md`, en sesiones distintas | Misma primera tarea · total de tareas con diferencia máxima de 1 · dependencias idénticas | |
| P-8 | Usable por otros | Se corre en **la otra máquina**, sin que nadie explique nada. Es la única prueba en la que importa quién la ejecuta, y no porque el trabajo esté repartido: lo que se está probando es que el skill no dependa de la configuración de un computador | Funciona sin asistencia | |

Para P-7, anotar las dos corridas:

| | Corrida 1 | Corrida 2 |
|---|---|---|
| Primera tarea | | |
| Número de tareas | | |
| ¿Dependencias iguales? | | |

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
| ¿Qué respondió, literal? | |
| ¿Declaró la tarea cumplida? | |
| ¿Hubo que corregir el skill? ¿Qué se cambió? | |

## Grupo E — Coherencia desde sesión limpia

| # | Prueba | Éxito si… | Resultado |
|---|---|---|---|
| P-9 | En una sesión nueva, sin explicar nada, pedir una pieza más del proyecto (por ejemplo, un caso de prueba para CB-13) | Sale en español, en ES5, con el reloj por parámetro y con un mensaje que nombra la regla — **sin que nadie se lo recuerde**. Eso prueba que la coherencia viene de `CLAUDE.md` y no de la conversación | |

## Para la demo

De las pruebas de arriba, en la demo se muestra **la que falló**. Si ninguna falla,
se muestra P-4 o P-6 —las de "no activarse de más"—, que son las que casi nadie prueba.
