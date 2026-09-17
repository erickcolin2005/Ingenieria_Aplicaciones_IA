# Rastro del loop

Los cuatro pasos —**explorar, planear, ejecutar, verificar**— sobre cada incremento
del producto. La regla que seguimos: *nunca se ejecuta sin plan, nunca se da por
terminado sin verificar*.

Cada plan lleva las tres casillas de decisión: **contexto** (qué archivos importan),
**restricciones** (qué no se toca) y **criterio de aceptación** (cómo se verifica).

---

## Incremento 1 — Las reglas de reserva (T-1 y T-3)

| Paso | Qué pasó |
|---|---|
| **Explorar** | Leímos el enunciado del reto y `docs/SPEC.md §4.4`. No había código todavía, así que explorar fue listar qué decisiones estaban abiertas: cuántas franjas seguidas, cuánta anticipación, qué pasa con los puestos con GPU. Salieron a la spec, no al código. |
| **Planear · contexto** | Archivo nuevo `producto/reglas.js`. Nada más existe. El contrato de funciones está fijado en `docs/PLAN.md`. |
| **Planear · restricciones** | ES5, sin dependencias. Sin DOM, sin `localStorage`, sin `new Date()` dentro del archivo. No mutar el estado recibido. |
| **Planear · criterio** | Los casos de CA-4 a CA-11 pasan con `node producto/pruebas.js`. |
| **Ejecutar** | R-1 a R-7 implementadas, una función por regla, validadas en orden: primero lo que invalida la petición (puesto, franja, fecha, código), después lo que depende del estado (ocupación, límites). |
| **Verificar** | `node producto/pruebas.js` → los 14 casos de CA-4 a CA-11 pasan. |
| **Límite encontrado** | Contar solo los vecinos inmediatos de la franja pedida **no** detecta CB-4: alguien reserva 6:00 y 10:00, después rellena las 8:00 y queda con tres seguidas sin que ninguna regla se dispare. Se cambió el cálculo para evaluar la **cadena resultante**, no el movimiento. Registrado en `SPEC.md §7`. |

## Incremento 2 — Cancelación y datos viejos (T-4 y T-5)

| Paso | Qué pasó |
|---|---|
| **Explorar** | Releímos `reglas.js` ya escrito. Decisión: la cancelación reusa `inicioFranja`, no se escribe un cálculo de hora nuevo. |
| **Planear · contexto** | `producto/reglas.js`: se agregan `validarCancelacion`, `cancelarReserva` y `normalizarEstado`. |
| **Planear · restricciones** | Mismas de arriba. `normalizarEstado` **no puede lanzar excepciones**: es lo primero que corre al abrir la aplicación, y si revienta ahí no hay pantalla. |
| **Planear · criterio** | Los casos de CA-12, CA-13 y CA-14 pasan. |
| **Ejecutar** | C-1 a C-3, y una normalización que filtra reserva por reserva en vez de descartar el estado completo. |
| **Verificar** | `node producto/pruebas.js` → pasan. Probado **con datos preexistentes**, no solo con casos nuevos: el caso de CA-14 arranca de un estado guardado por una versión anterior, sin los campos `motivo`, `id` ni `creada`. |
| **Límite encontrado** | La primera versión descartaba el estado completo si **una** reserva venía mal. Una reserva corrupta borraba las de todo el mundo. Se cambió a filtrar por reserva. El caso de CB-10 se agregó después de encontrar esto, no antes. |

## Incremento 3 — La interfaz (T-6 y T-7)

| Paso | Qué pasó |
|---|---|
| **Explorar** | `reglas.js` completo y probado. La interfaz no decide nada: recoge datos, llama a las reglas y muestra el mensaje que devuelven. |
| **Planear · contexto** | `producto/reservas.html` y `producto/pruebas.html`. Los dos cargan `reglas.js` con `<script src>`. |
| **Planear · restricciones** | Sin librerías, sin `fetch`, sin `import` — `file://` bloquea los módulos ES. El `<script src>` clásico sí funciona con doble clic. La interfaz **no reimplementa** ninguna regla: si aparece un `if` con una regla de negocio en el HTML, está mal. |
| **Planear · criterio** | CA-1, CA-2, CA-3, CA-16 mirando la pantalla; CA-17 abriendo `pruebas.html`. |
| **Ejecutar** | Cuadrícula de 20 × 7, tres estados por celda, aviso permanente de que el estado es local. |
| **Verificar** | 140 celdas confirmadas (20 × 7). La suite corre igual en el navegador y en Node: verificamos que `pruebas.html` produzca el mismo 22/22 que la terminal, cargando los dos archivos en el orden del `<script src>`. |
| **Límite encontrado** | `localStorage` no está disponible con `file://` en algunos navegadores y en modo privado. La aplicación no puede asumir que guardar funciona: ahora avisa en pantalla y sigue trabajando en memoria (CB-10). |

## Verificación acumulada

```
$ node producto/pruebas.js
...
22/22 criterios pasan.
```

Los criterios que **no** se pueden ejecutar (CA-1, CA-2 en pantalla, CA-3, CA-16,
CA-17) se verifican mirando, y están marcados con 👁 en la spec precisamente para no
confundirlos con los automáticos.

## Paso 4 bis — La revisión con contexto fresco

Pendiente por diseño: la hace **Erick**, que no escribió la interfaz, en una sesión
nueva que no vio cómo se construyó. Pedirle a la misma sesión que critique su propio
trabajo es pedirle que se contradiga, y rara vez lo hace bien.

Protocolo y resultados: `docs/decisiones/revision_contexto_fresco.md`.
