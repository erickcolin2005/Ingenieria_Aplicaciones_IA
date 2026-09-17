# SPEC — Sistema de reservas del laboratorio

**Equipo:** Erick Albornoz · Frank Palma · Ana María Ruiz
**Caso:** A (aplicación HTML sin librerías ni servidor)
**Versión:** 1.0 · 2026-09-17

---

## 1. Resumen

Una página HTML que se abre con doble clic y permite reservar uno de los 20 puestos
del laboratorio en franjas de dos horas, entre las 6:00 y las 20:00. Reemplaza la
hoja de papel en la puerta del laboratorio, donde nadie sabe si un puesto está libre
sin caminar hasta allá y donde dos personas escriben sobre la misma línea. El estado
vive en el navegador de quien la abre; no hay servidor, no hay base de datos y no hay
conexión a internet.

## 2. Objetivos

| # | Objetivo | Cómo se comprueba |
|---|---|---|
| O-1 | Ver de un vistazo qué está libre y qué está ocupado hoy | La cuadrícula muestra 20 puestos × 7 franjas con estado visible sin hacer clic |
| O-2 | Reservar un puesto en una franja, identificándose con el código de estudiante | Una reserva creada aparece en la cuadrícula y sobrevive al cerrar y reabrir el archivo |
| O-3 | Impedir que dos personas queden con el mismo puesto en la misma franja | El segundo intento sobre una celda ocupada se rechaza con mensaje |
| O-4 | Hacer cumplir los límites de uso por persona sin que nadie los vigile | Los límites de 2 consecutivas y 3 diarias se rechazan automáticamente |
| O-5 | Cancelar una reserva propia dentro del plazo permitido | Cancelar libera la celda; fuera de plazo se rechaza |
| O-6 | Que cualquiera del curso pueda verificar que las reglas se cumplen | `producto/pruebas.html` ejecuta los criterios de aceptación y reporta PASA/FALLA |

## 3. Fuera de alcance

Cada entrada dice **qué no se hace** y **por qué no**. Ninguna es "no alcanzamos":
todas son decisiones.

| # | No se hace | Por qué |
|---|---|---|
| FA-1 | **Autenticación real de usuarios** (usuario, contraseña, sesión) | No existe un directorio de estudiantes al que conectarse, y el reto prohíbe servidor y base de datos. Sin backend, cualquier "login" sería teatro: la validación viviría en el mismo navegador que el atacante controla. Preferimos declarar el hueco a fingir que lo tapamos: la persona escribe su código de estudiante y el sistema confía. |
| FA-2 | **Control de asistencia y penalización automática por no asistir** | Requiere saber si la persona efectivamente llegó al laboratorio — un torniquete, un carné, o el laboratorista marcando. Nada de eso existe en un HTML. La política queda **escrita** en §4.6 para que el laboratorista la aplique a mano; el sistema no la ejecuta. |
| FA-3 | **Rol de administrador y cierre por mantenimiento desde la aplicación** | Un botón "cerrar franja" sin autenticación (FA-1) es un botón para que cualquiera borre las reservas de todos. El protocolo de mantenimiento queda escrito en §4.7 y lo ejecuta el laboratorista por fuera del sistema. |
| FA-4 | **Estado compartido entre computadores** | `localStorage` es por navegador y por máquina. Dos personas en dos computadores distintos ven dos realidades distintas. Compartir estado exige un servidor, y el reto lo prohíbe explícitamente. Esta es la limitación más grave del producto y está declarada, no escondida: la aplicación **avisa en pantalla** que el estado es local. |
| FA-5 | **Notificaciones por correo o mensaje** | Exigen red saliente. La política de permisos del equipo niega la red saliente por diseño. |
| FA-6 | **Reservas recurrentes** ("todos los martes a las 10") | Multiplica la superficie de reglas (¿qué pasa si una ocurrencia choca? ¿cuenta para el límite diario de cada día?) sin agregar nada que la demo necesite mostrar. Se pospone al Momento 2. |
| FA-7 | **Historial y reportes de uso** | El valor del producto está en el día de hoy. Guardar histórico obliga a decidir retención de datos personales, y eso abre un problema de cumplimiento que no vamos a resolver bien en dos semanas. |

## 4. Diseño

### 4.1 Archivos

| Archivo | Qué es |
|---|---|
| `producto/reservas.html` | La aplicación. Interfaz y arranque. |
| `producto/reglas.js` | **Todas** las reglas de negocio, como funciones puras: reciben estado y datos, devuelven `{ok, error}`. No tocan el DOM ni `localStorage`. |
| `producto/pruebas.html` | Ejecuta los criterios de aceptación contra `reglas.js` y muestra PASA/FALLA. Se abre con doble clic. |
| `producto/pruebas.js` | Los casos de prueba. Corren igual en el navegador y en Node. |

Las reglas están separadas de la interfaz por una razón concreta: un criterio de
aceptación que no se puede ejecutar no es verificable, y una regla enterrada dentro
de un `onclick` no se puede ejecutar sin abrir un navegador y hacer clic.

### 4.2 Dominio

- **Puestos:** `P-01` … `P-20`. `P-19` y `P-20` tienen equipo especializado (GPU);
  reservarlos exige escribir un motivo de al menos 15 caracteres. Los otros 18 son
  intercambiables.
- **Franjas:** siete al día, de dos horas, identificadas por la hora de inicio:
  `6, 8, 10, 12, 14, 16, 18`. La última termina a las 20:00.
- **Persona:** un código de estudiante de 6 a 10 dígitos. No hay nombre ni correo.

### 4.3 Estado guardado

Clave de `localStorage`: `reservas_lab_v1`.

```json
{
  "version": 1,
  "reservas": [
    { "id": "r-1758...", "puesto": "P-07", "fecha": "2026-09-18",
      "franja": 10, "codigo": "123456", "motivo": "", "creada": "2026-09-17T14:22:03.000Z" }
  ]
}
```

Al leer, un estado con `version` distinta o con campos faltantes **no se descarta**:
se normaliza (ver CB-9). Un usuario no debería perder sus reservas porque nosotros
agregamos un campo.

### 4.4 Reglas de reserva

| # | Regla | Valor |
|---|---|---|
| R-1 | Un puesto, una franja, una fecha → una sola reserva | — |
| R-2 | Franjas **consecutivas** máximas por persona y día | 2 |
| R-3 | Franjas **totales** máximas por persona y día | 3 |
| R-4 | Anticipación máxima | Hoy y los 6 días siguientes (7 días en total) |
| R-5 | No se reserva una franja cuyo inicio ya pasó | — |
| R-6 | Código de estudiante | 6 a 10 dígitos, solo números |
| R-7 | Puesto con equipo especializado (`P-19`, `P-20`) | Motivo ≥ 15 caracteres |

### 4.5 Reglas de cancelación

| # | Regla | Valor |
|---|---|---|
| C-1 | Solo cancela quien reservó (mismo código) | — |
| C-2 | Plazo para cancelar sin penalización | Hasta 60 minutos antes del inicio |
| C-3 | Pasado el plazo | La aplicación rechaza; se resuelve con el laboratorista |

### 4.6 Política de inasistencia (escrita, no implementada — ver FA-2)

Quien reserva y no se presenta dentro de los primeros 20 minutos de la franja
pierde el puesto: el laboratorista lo libera y lo anota. Dos inasistencias
registradas en 30 días suspenden el derecho a reservar durante 7 días. **El sistema
no ejecuta nada de esto.** Lo aplica el laboratorista a mano, porque el sistema no
tiene forma de saber quién llegó.

### 4.7 Protocolo de mantenimiento (escrito, no implementado — ver FA-3)

Si el laboratorio cierra en una franja que ya tiene reservas: el laboratorista avisa
en la cartelera con al menos 24 horas de anticipación, las reservas afectadas se
consideran canceladas sin penalización, y quienes las tenían conservan prioridad para
la misma franja del siguiente día hábil. **Prioridad no significa reserva automática**:
es una regla que aplica una persona, no el sistema.

### 4.8 Interfaz

Una sola pantalla: selector de fecha, campo de código de estudiante, la cuadrícula
de 20 × 7, y una línea de mensaje. Al hacer clic en una celda libre se intenta
reservar; en una celda propia, se intenta cancelar; en una celda ajena, se informa
que está ocupada. Todo mensaje de error dice **qué regla se violó**, no "operación
inválida".

## 5. Casos borde

| # | Caso | Comportamiento esperado |
|---|---|---|
| CB-1 | Dos reservas sobre el mismo puesto, fecha y franja | La segunda se rechaza: *"P-07 ya está reservado en la franja 10:00–12:00."* |
| CB-2 | La persona ya tiene 10:00 y 12:00 e intenta 14:00 | Rechazo por R-2: tres consecutivas. |
| CB-3 | La persona tiene 6:00, 10:00 y 14:00 (no consecutivas) e intenta 18:00 | Rechazo por R-3: cuarta del día. |
| CB-4 | La persona tiene 6:00 y 10:00 e intenta 8:00 (rellena el hueco y genera una cadena de 3) | Rechazo por R-2. El cálculo mira la cadena **resultante**, no el orden de llegada. |
| CB-5 | Reservar hoy la franja de las 6:00 siendo las 9:00 | Rechazo por R-5: la franja ya empezó. |
| CB-6 | Reservar para el octavo día (hoy + 7) | Rechazo por R-4. El séptimo día (hoy + 6) sí se acepta. |
| CB-7 | Código `12345` (5 dígitos) o `12345a` | Rechazo por R-6, antes de tocar cualquier otra regla. |
| CB-8 | Reservar `P-19` con motivo `"trabajo"` (7 caracteres) | Rechazo por R-7. El sistema **no juzga si el motivo es bueno**; solo exige que haya uno escrito. |
| CB-9 | `localStorage` tiene reservas guardadas por una versión anterior, sin el campo `motivo` | Se cargan igual, con `motivo: ""`. No se pierde ninguna reserva ni se rompe la pantalla. |
| CB-10 | `localStorage` está lleno, deshabilitado o el archivo se abrió en modo privado | La aplicación muestra: *"No se pudo guardar. Tus reservas no persistirán al cerrar."* y sigue funcionando en memoria. |
| CB-11 | Cancelar una reserva de otra persona | Rechazo por C-1. |
| CB-12 | Cancelar 30 minutos antes del inicio | Rechazo por C-2, indicando que debe hablar con el laboratorista. |
| CB-13 | El archivo se deja abierto y cambia el día | El selector de fecha manda; la cuadrícula muestra la fecha seleccionada, no "hoy" cacheado. |
| CB-14 | Dos pestañas del mismo navegador reservando a la vez | Gana la última que escribe. Declarado, no resuelto: sin servidor no hay forma de arbitrar. |

## 6. Criterios de aceptación

Cada uno se responde sí o no. Los marcados con ✅ los ejecuta `producto/pruebas.html`;
los marcados con 👁 se verifican mirando la pantalla.

| # | Criterio | Cómo |
|---|---|---|
| CA-1 | `producto/reservas.html` se abre con doble clic en Windows y en Mac, sin servidor y sin conexión, y pinta la cuadrícula | 👁 |
| CA-2 | La cuadrícula tiene exactamente 20 filas de puestos y 7 columnas de franjas | 👁 |
| CA-3 | Una reserva creada sigue ahí después de cerrar el archivo y volver a abrirlo | 👁 |
| CA-4 | Reservar una celda ya ocupada devuelve error y **no** crea una segunda reserva | ✅ |
| CA-5 | Una tercera franja consecutiva se rechaza | ✅ |
| CA-6 | Una cuarta franja del día se rechaza | ✅ |
| CA-7 | Rellenar un hueco que forma tres consecutivas se rechaza | ✅ |
| CA-8 | Una franja cuyo inicio ya pasó se rechaza | ✅ |
| CA-9 | Una fecha a más de 7 días se rechaza | ✅ |
| CA-10 | Un código que no sea de 6 a 10 dígitos se rechaza | ✅ |
| CA-11 | `P-19` o `P-20` sin motivo de 15+ caracteres se rechaza; con motivo se acepta | ✅ |
| CA-12 | Cancelar con código distinto al de la reserva se rechaza | ✅ |
| CA-13 | Cancelar a menos de 60 minutos del inicio se rechaza | ✅ |
| CA-14 | Un estado guardado sin el campo `motivo` se carga sin perder reservas | ✅ |
| CA-15 | Todo mensaje de error nombra la regla violada; ninguno dice solo "error" | ✅ |
| CA-16 | La pantalla advierte que el estado es local a ese navegador | 👁 |
| CA-17 | `producto/pruebas.html` se abre con doble clic y muestra el conteo PASA/FALLA | 👁 |

## 7. Decisiones

| Decisión | Alternativa descartada | Por qué |
|---|---|---|
| Identidad = código de estudiante escrito a mano, sin verificación | Login con contraseña guardada en `localStorage` | Sin servidor, la contraseña se valida en la máquina del usuario: se salta abriendo la consola. Un candado que no cierra es peor que ninguno, porque la gente confía en él. Declaramos el hueco (FA-1). |
| Máximo 2 franjas consecutivas y 3 diarias | Sin límite; o límite semanal | Sin límite, dos personas madrugadoras se quedan el laboratorio entero. El límite semanal exige histórico y decisiones de retención de datos (FA-7). El límite diario se calcula con lo que ya está en pantalla. |
| Anticipación de 7 días | 30 días | Con 30 días la gente reserva "por si acaso" y no cancela; el laboratorio se ve lleno y está vacío. Siete días es un horizonte en el que la gente todavía sabe si va a ir. |
| Cancelar hasta 60 minutos antes | Cancelar en cualquier momento | Cancelar a la hora exacta libera un puesto que nadie alcanza a tomar: el efecto real es evadir el registro de inasistencia. Una hora es el mínimo para que otra persona pueda enterarse y llegar. |
| `P-19` y `P-20` diferenciados, exigiendo motivo escrito | Los 20 puestos iguales | Los dos puestos con GPU son escasos y se los lleva quien reserva más rápido, no quien los necesita. Pedir un motivo no impide el abuso — **el sistema no juzga el texto** — pero deja un rastro que el laboratorista puede revisar, y la fricción desalienta el "por si acaso". |
| Reglas en un archivo aparte (`reglas.js`), como funciones puras | Todo dentro de `reservas.html` | Un solo archivo es más fácil de repartir, pero convierte cada criterio de aceptación en una verificación manual a punta de clics. Con las reglas separadas, 11 de 17 criterios se ejecutan solos. El costo: el producto son dos archivos que deben viajar juntos. |
| Cálculo de consecutivas sobre la cadena resultante | Contar solo vecinos inmediatos de la franja pedida | Contar vecinos deja pasar CB-4: reservar 6:00 y 10:00, luego 8:00, y quedar con tres seguidas. La regla debe evaluar el estado final, no el movimiento. |
| Estado con `version` y normalización al cargar | Leer el JSON tal cual | El reto de la semana 3 avisó que los datos viejos no tienen los campos nuevos. Un producto que se rompe cuando agregas un campo es un producto que solo funciona la primera vez. |
| Sin ningún modelo de lenguaje en el producto | Un asistente que interprete "necesito un puesto mañana en la tarde" | Ver `docs/PRUEBA_NECESIDAD.md`. Los seis ejes apuntan todos hacia código: entrada estructurada, reglas escribibles, exactitud obligatoria, costo del error alto. Un modelo aquí agrega latencia, costo y una probabilidad de equivocarse, a cambio de nada. |
