# Pruebas de la cadena de skills

**Estado: MONTADAS, SIN EJECUTAR.** Las columnas de resultado están vacías a
propósito. Todas estas pruebas exigen una **sesión nueva** —y una de ellas, la
máquina de Frank— así que no se pueden ejecutar desde la sesión en la que se
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
| P-1 | *"Necesito dejar por escrito qué vamos a construir y cómo sabremos que quedó bien."* | Se carga `escribir-spec` | | |
| P-2 | *"Ya tenemos claro qué hay que hacer. Repártelo entre Erick y Frank con tiempos."* | Se carga `escribir-plan` | | |
| P-3 | *"Arranca con lo primero de la lista."* | Se carga `ejecutar-plan` | | |
| P-4 | *"Explícame qué hace la función maximaCadena."* | **No se carga ninguno.** Los tres se tienen que quedar quietos ante una pregunta que no es su trabajo | | |

**P-4 es la que más importa.** Un skill que se activa siempre es ruido: acaba
cargándose para responder cualquier cosa y contamina la sesión.

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
| P-8 | Usable por otros | **Frank** lo corre en **su** máquina, sin que Erick le explique nada | Funciona sin asistencia | |

Para P-7, anotar las dos corridas:

| | Corrida 1 | Corrida 2 |
|---|---|---|
| Primera tarea | | |
| Número de tareas | | |
| ¿Dependencias iguales? | | |

## Grupo D — El skill `ejecutar-plan`, la prueba del criterio no verificable

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
