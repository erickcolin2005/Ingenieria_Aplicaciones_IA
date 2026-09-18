# Guion de la demo — 6 minutos

**Equipo:** Erick Albornoz · Frank Palma · Ana María Ruiz
**Regla que manda:** mostrar, no contar. El tiempo que se va explicando es tiempo que
no se ve el producto.

## Antes de empezar (montaje, no cuenta en los 6 minutos)

- [ ] `producto/reservas.html` **ya abierto** en el navegador, con dos o tres reservas
      puestas de antemano en el día de mañana. Nadie quiere ver una cuadrícula vacía.
- [ ] `producto/pruebas.html` abierto en otra pestaña.
- [ ] Una terminal abierta en `momento_1`, con el comando `node producto/pruebas.js`
      ya escrito y **sin ejecutar**.
- [ ] Una sesión de la herramienta abierta en `momento_1`.
- [ ] `docs/decisiones/pruebas_skills.md` abierto en el editor.
- [ ] Zoom del navegador en 150 %: la cuadrícula tiene 140 celdas y desde la tercera
      fila del salón no se ve nada.
- [ ] Wi-Fi **apagado**, a propósito. Es parte de lo que se demuestra.

## El orden, y por qué este

El reto pide cuatro puntos; la rúbrica pide que *"la demo abra"*. Los ponemos en el
orden de la rúbrica: **primero el producto funcionando**, después las decisiones. Si
algo se sale de tiempo, que sea lo que se cuenta, no lo que se ve.

**Quién habla:** se decide en el ensayo, no aquí. Los tres se saben los cuatro bloques
completos, porque el orden de presentación se sortea el mismo día y porque si alguien
falta, los otros presentan igual.

Dos reglas fijas, y la segunda importa más de lo que parece:

1. Cada uno abre al menos un bloque. Son cuatro bloques y tres personas: el que sobra lo
   toma quien menos haya hablado.
2. **El cambio de persona no cuesta tiempo.** Con tres presentadores en seis minutos, lo
   que hunde la demo no es lo que se dice, son las transiciones: "ah, ahora sigues tú",
   el computador que pasa de mano, el hilo que se pierde. Se ensaya el cambio, no solo el
   contenido. Un solo computador, uno maneja el mouse todo el tiempo.

| Tiempo | Punto | Qué se hace exactamente |
|---|---|---|
| **0:00 – 2:00** | **El producto funcionando** | 1. *"Esto es el laboratorio: 20 puestos, franjas de dos horas, y está corriendo sin internet."* (Wi-Fi apagado a la vista.)<br>2. Escribe el código `202410` y reserva **P-05 a las 10:00**. Aparece en verde.<br>3. Intenta **P-05 a las 12:00** → acepta. Intenta **las 14:00** → *"Regla R-2: quedarías con más de 2 franjas seguidas."*<br>4. Cambia el código a `303030` e intenta **P-05 a las 10:00** → *"Regla R-1: P-05 ya está reservado…"*<br>5. Intenta **P-19** (el de la GPU) sin motivo → *"Regla R-7…"*<br>6. Cierra el navegador y lo vuelve a abrir: **las reservas siguen ahí.**<br>7. Pestaña de `pruebas.html`: **23 / 23 criterios pasan.** *"Cada uno es un criterio de aceptación de la spec, ejecutándose."* |
| **2:00 – 3:00** | **Las dos decisiones más difíciles de la spec** | **(a) No hay login.** Sin servidor, cualquier contraseña se valida en la máquina de quien la escribe: se salta abriendo la consola. Descartamos el login falso y **declaramos el hueco** en la spec (FA-1). Un candado que no cierra es peor que ninguno, porque la gente confía en él.<br>**(b) La inasistencia no la ejecuta el sistema.** El sistema no sabe quién llegó al laboratorio. Escribimos la política completa (§4.6) y dejamos que la aplique el laboratorista. Descartamos un botón de "marcar asistencia" que cualquiera podría apretar por otro. |
| **3:00 – 5:00** | **La cadena de skills trabajando** | 1. Las tres descripciones juntas en `skills/`. *"Se escribieron juntas a propósito: si una se activa cuando le toca a otra, la culpa es de la descripción."*<br>2. **El caso real, en el `git log`: T-10, de punta a punta.** `escribir-spec` recibió un encargo ambiguo y **no lo rellenó**: listó las tres lecturas posibles y explicó cuál eligió y por qué (mostrar `SPEC.md §7`, bloque v1.1). De ahí salieron R-8, CB-15 y CA-18.<br>3. `ejecutar-plan` la cerró: anunció qué tarea y por qué esa, **esperó confirmación**, verificó contra el criterio literal del plan, reportó 22 → 23 y **se detuvo sin marcarla como hecha** — *"eso lo marca quien confirma, no yo"*.<br>4. **El momento que hay que contar:** encontró dos defectos que no eran de su tarea y **no los arregló**. Los reportó y esperó. Esa es su regla dura 3 actuando sola, sobre un caso que nadie preparó.<br>5. Y probó que la prueba prueba algo: corrió CA-18 contra el código anterior y mostró que ahí falla. *"Un caso que pasa igual con el arreglo y sin él no verifica nada."*<br>6. Si alguna prueba de `pruebas_skills.md` falló, mostrar cuál y qué se le corrigió: vale más que tres que salieron bien. |
| **5:00 – 6:00** | **La decisión que defendemos** | *"Nuestro producto no usa ningún modelo de lenguaje, y eso es la decisión, no una carencia."* Los seis ejes, en quince segundos: entrada de un conjunto cerrado, siete reglas que caben en una tabla, exige determinismo, latencia de milisegundos, y el error —dos personas en el mismo puesto— es presencial e irreversible. Cinco ejes hacia código, ninguno hacia el modelo.<br>*"Lo que sí usó modelo fue el proceso: la spec, el plan y la construcción. El producto es determinista de punta a punta."*<br>Cierre: *"Si nos quitan el modelo, el producto sigue igual. Si nos lo quitan del proceso, todavía estaríamos escribiendo la spec."* |

## Plan B

Wi-Fi apagado desde el principio: no hay nada que dependa de internet. Lo demás:

| Si falla… | Qué se muestra |
|---|---|
| El navegador no abre el archivo | La terminal: `node producto/pruebas.js` → 23/23. Las mismas reglas, sin navegador. |
| `localStorage` está bloqueado (modo privado, política del equipo) | Es un caso borde previsto: la aplicación avisa en pantalla y sigue funcionando en memoria. **Se enseña como parte de la demo**, no se disimula: es CB-10. |
| Un computador no arranca | Los otros dos tienen el repositorio clonado y probado antes. Cualquiera de los tres puede presentar solo. |
| No hay proyector o no se ve | El repositorio está en GitHub: se comparte el enlace y se hace el recorrido por los archivos. |
| La sesión de la herramienta no carga los skills | Se muestran los tres `SKILL.md` abiertos y la tabla de resultados ya llena de `pruebas_skills.md`. La evidencia está escrita, no depende de que algo corra en vivo. |
| Nos quedamos sin tiempo | Se sacrifica el punto 4 (la decisión que defendemos) y se deja para las preguntas. El producto y la cadena **no** se sacrifican. |

## Las preguntas que van a hacer

Responde el que esté hablando en ese momento. No hay preguntas "de Erick", "de Frank" ni
"de Ana María": si una pregunta solo la puede responder uno de los tres, el trabajo se
repartió mal y la rúbrica lo va a encontrar.

| Pregunta | Respuesta |
|---|---|
| *"¿Qué deja de funcionar si les quito el modelo?"* | Nada. El producto nunca tuvo uno. Lo que se detiene es el proceso de construirlo. |
| *"¿Qué parte decidieron resolver sin LLM y por qué?"* | Todas. `docs/PRUEBA_NECESIDAD.md` §3 tiene el mapeo componente por componente. La única parte que lo justificaría es interpretar una frase en lenguaje natural, y ahí el modelo **traduciría**, no decidiría: la validación seguiría siendo `reglas.js`. |
| *"Muéstrenme el plan de este incremento y sus criterios"* | `docs/PLAN.md`, tabla de tareas. Cada una apunta al criterio de `SPEC.md §6` que la cierra. |
| *"¿Qué encontró la revisión con contexto fresco?"* | `docs/decisiones/revision_contexto_fresco.md` — **hay que tenerlo lleno antes de la demo.** |
| *"Explíquenme qué hace esta función"* (al azar) | `maximaCadena` es la más probable: ordena las franjas que la persona ya tiene ese día, mete la nueva, y mide la cadena más larga con saltos de dos horas. Mira el resultado final, no el movimiento — por eso atrapa CB-4, rellenar un hueco. |
| *"¿Por qué así y no de otra forma?"* | Contar solo los vecinos inmediatos de la franja pedida deja pasar el caso de reservar 6:00 y 10:00 y después rellenar las 8:00. Lo encontramos probando, está en `docs/decisiones/loop.md`. |
| *"¿Quién hizo qué?"* | Los tres, todo. Trabajamos sobre cada tarea juntos, rotando quién escribe. Está justificado en `docs/PLAN.md`: un reparto por módulos deja a cada uno dominando un tercio, y aquí preguntan al azar. |
| *"¿Qué descartaron?"* | Login falso, marcar asistencia desde la app, reservas recurrentes, histórico, vista semanal. Cada uno con su razón en `SPEC.md §3`. |
| *"Si empezaran de nuevo, ¿qué cambiarían?"* | Escribiríamos los casos de prueba **antes** que las reglas. Dos de las tres correcciones al contexto salieron al escribir las pruebas, no al escribir el código: CB-4 y el reloj por parámetro. |

## Ensayo

Dos veces, con cronómetro, el día **anterior** al anterior. No la noche de antes.
Se anota aquí cuánto dio:

| | Duración | Qué se salió de tiempo |
|---|---|---|
| Ensayo 1 | | |
| Ensayo 2 | | |
