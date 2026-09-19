# Guion de la demo — 6 minutos

**Equipo:** Erick Albornoz · Frank Palma (Ana María Ruiz se retiró antes de la demo —
ver `docs/decisiones/cambio_equipo.md`)
**Regla que manda:** mostrar, no contar. El tiempo que se va explicando es tiempo que
no se ve el producto.

## Antes de empezar (montaje, no cuenta en los 6 minutos)

- [ ] La [presentación (5 slides)](https://claude.ai/code/artifact/89e4faf7-14bb-4322-aeb3-d1fc34386b0f)
      abierta en la **primera pestaña**, probada con las flechas del teclado antes de
      entrar al salón.
- [ ] `producto/reservas.html` **ya abierto** en otra pestaña, con dos o tres reservas
      puestas de antemano en el día de mañana. Nadie quiere ver una cuadrícula vacía.
- [ ] `producto/pruebas.html` abierto en otra pestaña.
- [ ] Una terminal abierta en `momento_1`, con el comando `node producto/pruebas.js`
      ya escrito y **sin ejecutar**.
- [ ] Una sesión de la herramienta abierta en `momento_1`, con `git log` ya corrido una
      vez para que el commit de T-10 esté a la vista sin buscarlo en vivo.
- [ ] `docs/decisiones/pruebas_skills.md` y `docs/SPEC.md` abiertos en el editor, en
      pestañas propias — se muestran en el bloque 3, sin salir a buscarlos.
- [ ] **Orden fijo de pestañas** (ver "Cómo se turnan las pantallas" abajo): moverse
      con `Ctrl+Tab` o clics directos, nunca buscando en una barra de tareas — eso es
      el tipo de segundo perdido que hunde un guion de 6 minutos.
- [ ] Zoom del navegador en 150 %: la cuadrícula tiene 140 celdas y desde la tercera
      fila del salón no se ve nada.
- [ ] Wi-Fi **apagado**, a propósito. Es parte de lo que se demuestra.
- [ ] **Frank conectado por llamada**, probado *antes* de entrar al salón: volumen alto,
      micrófono cerca, y alguien del salón (no Erick, que va a estar hablando) confirma
      que se escucha bien desde el fondo. La llamada se conecta **antes** de apagar el
      wifi del punto anterior — el celular de la llamada usa datos, no la red del salón.

## El orden, y por qué este

El reto pide cuatro puntos; la rúbrica pide que *"la demo abra"*. Los ponemos en el
orden de la rúbrica: **primero el producto funcionando**, después las decisiones. Si
algo se sale de tiempo, que sea lo que se cuenta, no lo que se ve.

**Quién habla:** se decide en el ensayo, no aquí. Los dos se saben los cuatro bloques
completos, porque el orden de presentación se sortea el mismo día y porque si uno
falta, el otro presenta la demo completa solo.

Dos reglas fijas, y la segunda importa más de lo que parece:

1. Son cuatro bloques y dos personas: **cada uno abre exactamente dos**, no importa
   cuáles hasta el sorteo del día. Ningún bloque queda sin dueño y ninguno se reparte
   a medias.
2. **El cambio de persona no cuesta tiempo.** Con dos presentadores en seis minutos, lo
   que hunde la demo no es lo que se dice, es la transición: "ah, ahora sigues tú", el
   computador que pasa de mano, el hilo que se pierde. Se ensaya el cambio, no solo el
   contenido. Un solo computador, **una sola persona maneja el mouse los seis minutos
   completos**, hable quien hable — así no hay entrega física del equipo a mitad de la
   demo, solo entrega de la palabra.

## Cómo se turnan las pantallas (slides vs. app en vivo)

**Hay dos cosas que pueden estar en pantalla: la presentación (5 slides,
`docs/DEMO.md` las llama por número) y las pestañas del navegador/terminal con el
producto real.** No compiten: cada bloque tiene un momento para cada una, en este
orden fijo, y es lo único que hay que recordar de memoria sobre pantallas:

| Bloque | La slide se ve... | La app/archivos reales se ven... |
|---|---|---|
| 1 — Producto | **Slide 2** solo 5 segundos, al abrir el bloque, como título | El resto de los 2 minutos: pestaña `reservas.html`, luego pestaña `pruebas.html` |
| 2 — Decisiones difíciles | **Slide 3, fija todo el bloque** | Ninguna — no hay nada que clicar aquí |
| 3 — Cadena de skills | **Slide 4** al abrir (5 seg) y al cerrar, para dejar el número 10 vs 7 en pantalla | En medio: `git log`, `SPEC.md §7`, `docs/decisiones/pruebas_skills.md` |
| 4 — Decisión que defendemos | **Slide 5, fija todo el bloque** | Ninguna |

**Regla de una sola frase:** si el bloque tiene clics o archivos que mostrar, la
slide es solo la portada de 5 segundos; si el bloque es puro argumento, la slide se
queda fija y no se toca nada más. La presentación no repite lo que ya se ve en vivo
— por eso la Slide 2 no lista las reglas R-1/R-2/R-7 con detalle: eso lo dice la app
al rechazar el clic, en tiempo real.

**Plan B que ya queda resuelto con esto:** si `reservas.html` no abre, la Slide 2
tiene el número **24/24** visible — se explica sobre la slide en vez de sobre la
app, y se sigue en `pruebas.html` o la terminal.

| Tiempo | Punto | En pantalla | Qué se dice/hace |
|---|---|---|---|
| **0:00 – 2:00** | **El producto funcionando** | Slide 2 (5s) → `reservas.html` → `pruebas.html` | 1. Slide 2 en pantalla: *"Esto es el laboratorio: 20 puestos, franjas de dos horas, y está corriendo sin internet."* (Wi-Fi apagado a la vista.) Clic para pasar a la pestaña del navegador.<br>2. En `reservas.html`: escribe el código `202410` y reserva **P-05 a las 10:00**. Aparece en verde.<br>3. Intenta **P-05 a las 12:00** → acepta. Intenta **las 14:00** → *"Regla R-2: quedarías con más de 2 franjas seguidas."*<br>4. Cambia el código a `303030` e intenta **P-05 a las 10:00** → *"Regla R-1: P-05 ya está reservado…"*<br>5. Intenta **P-19** (el de la GPU) sin motivo → *"Regla R-7…"*<br>6. Cierra el navegador y lo vuelve a abrir: **las reservas siguen ahí.**<br>7. Pestaña de `pruebas.html`: **24 / 24 criterios pasan.** *"Cada uno es un criterio de aceptación de la spec, ejecutándose."* |
| **2:00 – 3:00** | **Las dos decisiones más difíciles de la spec** | Slide 3, fija | **(a) No hay login.** Sin servidor, cualquier contraseña se valida en la máquina de quien la escribe: se salta abriendo la consola. Descartamos el login falso y **declaramos el hueco** en la spec (FA-1). Un candado que no cierra es peor que ninguno, porque la gente confía en él.<br>**(b) La inasistencia no la ejecuta el sistema.** El sistema no sabe quién llegó al laboratorio. Escribimos la política completa (§4.6) y dejamos que la aplique el laboratorista. Descartamos un botón de "marcar asistencia" que cualquiera podría apretar por otro. |
| **3:00 – 5:00** | **La cadena de skills trabajando** | Slide 4 (5s) → `git log`/`SPEC.md §7` → vuelve a Slide 4 | 1. Slide 4 en pantalla, título dicho en voz alta, clic para pasar a la terminal.<br>2. Las tres descripciones juntas en `skills/`. *"Se escribieron juntas a propósito: si una se activa cuando le toca a otra, la culpa es de la descripción."*<br>3. **El caso real, en el `git log`: T-10, de punta a punta.** `escribir-spec` recibió un encargo ambiguo y **no lo rellenó**: listó las tres lecturas posibles y explicó cuál eligió y por qué (mostrar `SPEC.md §7`, bloque v1.1). De ahí salieron R-8, CB-15 y CA-18.<br>4. `ejecutar-plan` la cerró: anunció qué tarea y por qué esa, **esperó confirmación**, verificó contra el criterio literal del plan, reportó 22 → 23 y **se detuvo sin marcarla como hecha** — *"eso lo marca quien confirma, no yo"*.<br>5. **El momento que hay que contar:** encontró dos defectos que no eran de su tarea y **no los arregló**. Los reportó y esperó.<br>6. Y probó que la prueba prueba algo: corrió CA-18 contra el código anterior y mostró que ahí falla.<br>7. Clic de vuelta a **Slide 4**: *"La que sí falló: `escribir-plan` no fue estable."* Con el número 10 vs 7 ya en pantalla, cierra explicando que la segunda corrida perdió la tarea que conecta la lógica nueva a la interfaz — se muestra así, no como "salió todo bien" (`docs/decisiones/pruebas_skills.md`, prueba P-7). |
| **5:00 – 6:00** | **La decisión que defendemos** | Slide 5, fija | *"Nuestro producto no usa ningún modelo de lenguaje, y eso es la decisión, no una carencia."* Los seis ejes, en quince segundos: entrada de un conjunto cerrado, siete reglas que caben en una tabla, exige determinismo, latencia de milisegundos, y el error —dos personas en el mismo puesto— es presencial e irreversible. Cinco ejes hacia código, ninguno hacia el modelo.<br>*"Lo que sí usó modelo fue el proceso: la spec, el plan y la construcción. El producto es determinista de punta a punta."*<br>Cierre, con la Slide 5 mostrando exactamente esta frase: *"Si nos quitan el modelo, el producto sigue igual. Si nos lo quitan del proceso, todavía estaríamos escribiendo la spec."* |

## Plan B

Wi-Fi apagado desde el principio: no hay nada que dependa de internet. Lo demás:

| Si falla… | Qué se muestra |
|---|---|
| El navegador no abre el archivo | La terminal: `node producto/pruebas.js` → 24/24. Las mismas reglas, sin navegador. |
| `localStorage` está bloqueado (modo privado, política del equipo) | Es un caso borde previsto: la aplicación avisa en pantalla y sigue funcionando en memoria. **Se enseña como parte de la demo**, no se disimula: es CB-10. |
| Un computador no arranca | El otro tiene el repositorio clonado y probado antes. Cualquiera de los dos puede presentar la demo completa solo — es justo lo que garantiza la regla de "nadie tiene su parte". |
| La llamada con Frank se cae o no se escucha | Erick presenta la demo completa solo, diciendo también las líneas de Frank — es exactamente lo que ya se ensayó como Opción B. No se espera a que la llamada vuelva: el reloj de 6 minutos no para. |
| No hay proyector o no se ve | El repositorio está en GitHub: se comparte el enlace y se hace el recorrido por los archivos. |
| La sesión de la herramienta no carga los skills | Se muestran los tres `SKILL.md` abiertos y la tabla de resultados ya llena de `pruebas_skills.md`. La evidencia está escrita, no depende de que algo corra en vivo. |
| Nos quedamos sin tiempo | Se sacrifica el punto 4 (la decisión que defendemos) y se deja para las preguntas. El producto y la cadena **no** se sacrifican. |

## Las preguntas que van a hacer

Responde el que esté hablando en ese momento. No hay preguntas "de Erick" ni "de
Frank": si una pregunta solo la puede responder uno de los dos, el trabajo se
repartió mal y la rúbrica lo va a encontrar.

| Pregunta | Respuesta |
|---|---|
| *"¿Qué deja de funcionar si les quito el modelo?"* | Nada. El producto nunca tuvo uno. Lo que se detiene es el proceso de construirlo. |
| *"¿Qué parte decidieron resolver sin LLM y por qué?"* | Todas. `docs/PRUEBA_NECESIDAD.md` §3 tiene el mapeo componente por componente. La única parte que lo justificaría es interpretar una frase en lenguaje natural, y ahí el modelo **traduciría**, no decidiría: la validación seguiría siendo `reglas.js`. |
| *"Muéstrenme el plan de este incremento y sus criterios"* | `docs/PLAN.md`, tabla de tareas. Cada una apunta al criterio de `SPEC.md §6` que la cierra. |
| *"¿Qué encontró la revisión con contexto fresco?"* | `docs/decisiones/revision_contexto_fresco.md` — **hay que tenerlo lleno antes de la demo.** |
| *"Explíquenme qué hace esta función"* (al azar) | `maximaCadena` es la más probable: ordena las franjas que la persona ya tiene ese día, mete la nueva, y mide la cadena más larga con saltos de dos horas. Mira el resultado final, no el movimiento — por eso atrapa CB-4, rellenar un hueco. |
| *"¿Por qué así y no de otra forma?"* | Contar solo los vecinos inmediatos de la franja pedida deja pasar el caso de reservar 6:00 y 10:00 y después rellenar las 8:00. Lo encontramos probando, está en `docs/decisiones/loop.md`. |
| *"¿Quién hizo qué?"* | Todos, todo — fuimos tres hasta antes de la demo (Ana María Ruiz se retiró, `docs/decisiones/cambio_equipo.md`), ahora somos dos, y ninguno de los dos tiene una parte propia. Trabajamos sobre cada tarea juntos, rotando quién escribe. Está justificado en `docs/PLAN.md`: un reparto por módulos deja a cada uno dominando una fracción, y aquí preguntan al azar. |
| *"¿Qué descartaron?"* | Login falso, marcar asistencia desde la app, reservas recurrentes, histórico, vista semanal. Cada uno con su razón en `SPEC.md §3`. |
| *"Si empezaran de nuevo, ¿qué cambiarían?"* | Escribiríamos los casos de prueba **antes** que las reglas. Dos de las tres correcciones al contexto salieron al escribir las pruebas, no al escribir el código: CB-4 y el reloj por parámetro. |
| *"El repositorio dice tres personas, ¿qué pasó con la tercera?"* | Ana María Ruiz se retiró antes de esta demo. Está registrado, con fecha, en `docs/decisiones/cambio_equipo.md` — no se editó el historial de lo que ella construyó, porque es cierto que lo construyó. La regla de "nadie tiene su parte" no dependía del número tres, así que se sostiene igual con dos. |

## Guion del primer ensayo — Erick y Frank (no es el orden del día de la demo)

**El orden real se sortea el día de la presentación** (regla ya fijada arriba: los
dos dominan los cuatro bloques completos, y por eso nadie tiene "su" parte). Esto de
aquí es para arrancar a practicar con algo concreto — se vuelve a sortear antes de la
demo real, y en el ensayo 2 se cambian los papeles para que ambos hayan hablado los
cuatro bloques al menos una vez antes del día real.

| Bloque | Tiempo | Quién habla — Ensayo 1 | Quién habla — Ensayo 2 |
|---|---|---|---|
| 1 — El producto funcionando | 0:00–2:00 | **Erick** | **Frank** |
| 2 — Las dos decisiones más difíciles | 2:00–3:00 | **Frank** | **Erick** |
| 3 — La cadena de skills trabajando (incluye el hallazgo de P-7) | 3:00–5:00 | **Erick** | **Frank** |
| 4 — La decisión que defendemos | 5:00–6:00 | **Frank** | **Erick** |

**Quién maneja el mouse:** Erick, los seis minutos completos, en los dos ensayos —
es quien hizo las pruebas de los skills y conoce mejor dónde está cada archivo en
pantalla (`SPEC.md`, `git log`, `pruebas_skills.md`). Frank no toca el teclado en
ningún bloque; habla mientras Erick navega lo que corresponde a cada punto. Esto es
independiente de quién habla: la regla es "una sola persona con el mouse todo el
tiempo", no "quien habla maneja el mouse".

**Guion hablado, bloque por bloque** (mismas líneas de la tabla de arriba — aquí solo
se marca quién las dice en el Ensayo 1):

- **Erick — Bloque 1 (0:00–2:00):** abre en **Slide 2** (5 segundos, dice el título),
  clic para pasar a `reservas.html`: reservar P-05 a las 10:00, la franja de las 12:00
  y el rechazo de las 14:00 (R-2), cambiar de código y chocar contra P-05 (R-1), P-19
  sin motivo (R-7), cerrar y reabrir el navegador, y cerrar en `pruebas.html` con
  24/24. La Slide 2 no se vuelve a mostrar en este bloque.
- **Frank — Bloque 2 (2:00–3:00):** **Slide 3 queda fija** toda la sección, Erick no
  toca nada. Frank dice las dos decisiones más difíciles — por qué no hay login (FA-1)
  y por qué la inasistencia no la ejecuta el sistema (FA-2) — de memoria, sin que
  nadie lea la spec en pantalla.
- **Erick — Bloque 3 (3:00–5:00):** abre en **Slide 4** (5 segundos), clic para pasar
  a la terminal/editor: el caso real de T-10 en el `git log` y `SPEC.md §7`. **Cierra
  volviendo a la Slide 4**, que ya tiene el "10 vs 7" en pantalla, para el hallazgo de
  P-7 (`escribir-plan` no fue estable: la segunda corrida perdió la tarea de conectar
  la lógica a la interfaz) — esa es la que se cuenta si preguntan por debilidades.
- **Frank — Bloque 4 (5:00–6:00):** **Slide 5 queda fija** toda la sección. Frank dice
  la decisión de no usar ningún modelo de lenguaje en el producto, los seis ejes en
  quince segundos, y el cierre — que la Slide 5 ya muestra en pantalla: *"Si nos
  quitan el modelo, el producto sigue igual. Si nos lo quitan del proceso, todavía
  estaríamos escribiendo la spec."*

En el Ensayo 2 se intercambian los bloques (columna de la derecha en la tabla) con
el mismo contenido — el objetivo es que el día del sorteo real, a ninguno de los dos
le toque un bloque que nunca haya dicho en voz alta.

## Ensayo

Dos veces, con cronómetro, el día **anterior** al anterior. No la noche de antes.
Se anota aquí cuánto dio:

| | Duración | Qué se salió de tiempo |
|---|---|---|
| Ensayo 1 | | |
| Ensayo 2 | | |
