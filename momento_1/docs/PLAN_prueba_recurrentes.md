# PLAN (ejercicio) — Reservas recurrentes

**Derivado de:** `docs/SPEC_prueba_recurrentes.md` v1.0
**Dueño:** Erick Albornoz (única persona en las siete tareas — confirmado, no repartido)
**Ventana de tiempo:** sin límite fijo declarado; cada tarea ≤ 4 h (regla dura 2), el
total es la suma

> **Esto es un ejercicio para practicar la skill `escribir-plan`, no un plan real.**
> `docs/SPEC.md` §3 (FA-6) sigue vigente: las reservas recurrentes siguen fuera de
> Momento 1. Este documento se guarda aparte a propósito, nunca se fusiona con
> `docs/PLAN.md`, y se borra cuando termine el ejercicio — igual que
> `docs/SPEC_prueba_recurrentes.md`.

Este plan no repite la spec de práctica. Cada tarea apunta al criterio (CA-R#) que
cierra; lo que ese criterio significa está en `docs/SPEC_prueba_recurrentes.md` y no
se copia aquí.

---

## Contrato nuevo de `producto/reglas.js`

Extiende el contrato ya fijado en `docs/PLAN.md` (`crearEstado`, `normalizarEstado`,
`validarReserva`, `agregarReserva`, `validarCancelacion`, `cancelarReserva` — esos
seis no cambian). Se fija aquí, no en la spec, por la misma razón que la vez
anterior: permite empezar sin discutir firmas.

```js
crearEstado()                                        -> { version: 1, reservas: [], series: [] }
crearSerie(datos, ahora)                             -> { ok, serie, error, codigoError }
agregarSerie(estado, datos, ahora)                   -> { ok, estado, error, codigoError }
materializarSeries(estado, ahora)                    -> estado   // recorre series activas; no lanza error, no lo necesita
validarCancelacionSerie(estado, { serieId, codigo }, ahora) -> { ok, error, codigoError }
cancelarSerie(estado, { serieId, codigo }, ahora)    -> { ok, estado, error, codigoError }

// datos (crearSerie/agregarSerie) = { puesto, franja, fechaInicio, fechaFin, codigo, motivo }
// Cancelar UNA ocurrencia (C-4) no es función nueva: es cancelarReserva de siempre,
// sobre una reserva que además trae serieId. No se toca esa función.
```

## Tareas

| # | Tarea | Dueño | Tamaño | Depende de | Archivo(s) | Criterio (sí/no) |
|---|---|---|---|---|---|---|
| T-R1 | `crearEstado()` incluye `series: []`; declarar `crearSerie`, `agregarSerie`, `materializarSeries`, `validarCancelacionSerie`, `cancelarSerie` con la forma correcta y lógica vacía | Erick Albornoz | 1 h | — | `producto/reglas.js` | `node -e "var r=require('./producto/reglas.js'); console.log(['crearSerie','agregarSerie','materializarSeries','validarCancelacionSerie','cancelarSerie'].every(function(f){return typeof r[f]==='function'}) && Array.isArray(r.crearEstado().series))"` imprime `true` |
| T-R2 | Escribir en `pruebas.js` un caso por cada CA-R1 a CA-R11 (los automatizables), citando en el título el CB-R# que sustenta cada uno | Erick Albornoz | 3 h | T-R1 | `producto/pruebas.js` | El archivo declara ≥ 11 casos nuevos, cada uno nombra en su título el CA-R# que verifica, y `node producto/pruebas.js` corre sin error de sintaxis (aunque los nuevos casos fallen por falta de lógica) |
| T-R3 | `normalizarEstado`: normaliza el arreglo `series` (campos válidos, `[]` si falta o es inválido) y preserva `serieId` en cada reserva (`null` si no existe) | Erick Albornoz | 1,5 h | T-R1 | `producto/reglas.js` | El caso de CA-R10 pasa y ninguna reserva ni serie previa se pierde |
| T-R4 | `agregarSerie`: R-9 (la primera ocurrencia pasa por `validarReserva` sin excepción) y R-10 (`fechaFin` obligatoria y posterior a `fechaInicio`); el mensaje de rechazo cita R-9 o R-10 | Erick Albornoz | 2 h | T-R1, T-R2 | `producto/reglas.js` | Los casos de CA-R1 y CA-R8 pasan |
| T-R5 | `materializarSeries`: R-11 (ventana de 7 días, igual criterio que R-4), R-12 (cualquier ocurrencia que falle una regla se salta sin tocar la serie ni detenerla), R-13 (`activa: false` al superar `fechaFin`) | Erick Albornoz | 3 h | T-R4 | `producto/reglas.js` | Los casos de CA-R2, CA-R3, CA-R4, CA-R5, CA-R6 y CA-R9 pasan |
| T-R6 | `cancelarSerie`: intenta cancelar la ocurrencia vigente vía `validarCancelacion`/`cancelarReserva` existentes (sujeta a C-1/C-2), y marca `activa: false` pase o no esa cancelación puntual; mensaje de rechazo cita C-5 cuando aplica | Erick Albornoz | 1,5 h | T-R4 | `producto/reglas.js` | Los casos de CA-R7 y CA-R11 pasan |
| T-R7 | `reservas.html`: campo opcional "repetir cada semana hasta" al reservar; una celda de serie se distingue visualmente de una reserva única; al hacer clic en una celda propia de serie aparecen dos acciones separadas ("cancelar esta semana" / "cancelar la serie") | Erick Albornoz | 3 h | T-R4, T-R5, T-R6 | `producto/reservas.html` | CA-R12 y CA-R13 se verifican mirando la pantalla (👁, mismo criterio que CA-1 a CA-3 en `docs/SPEC.md`) |

**Total: 15 horas**, todas de Erick Albornoz. Ninguna tarea pasa de 4 h (regla dura 2).
No hay ventana de tiempo declarada contra la cual medir si esto "cabe" (regla añadida
14 no aplica: no hay un límite fijo del que sobrar).

## Orden y por qué

1. **T-R1 primero**, sola: fija el contrato y el campo `series` en el estado: nada
   más puede escribirse sin eso.
2. **T-R2 antes de implementar nada**, mismo criterio que el plan real: escribir los
   casos primero obliga a decidir qué significa cada CA-R# antes de que el código lo
   decida por accidente.
3. **T-R3 después de T-R2, antes de T-R4.** Es independiente de crear series
   (`normalizarEstado` es sobre cargar un estado guardado, no sobre crear uno nuevo),
   así que se hace mientras el contrato está fresco y se saca del camino.
4. **T-R4 antes que T-R5 y T-R6.** Ambas necesitan que una serie ya se pueda crear
   con forma válida antes de poder materializarla o cancelarla.
5. **T-R5 antes que T-R6.** Cancelar la serie (T-R6) se prueba mejor con una
   ocurrencia ya materializada por T-R5 en pantalla (CB-R8, CB-R9); si T-R6 fuera
   primero, sus propios casos tendrían que fabricar ese estado a mano dos veces.
6. **T-R7 al final.** Depende de las tres funciones de lógica (T-R4, T-R5, T-R6):
   pintar una interfaz que ofrece "cancelar la serie" antes de que esa función
   exista no tiene contra qué probarse.

## Primera tarea

**T-R1.** No depende de nada: el contrato ya está escrito arriba. Se empieza
cerrando este documento.

## Fuera de este ciclo

Lo que la spec de práctica ya deja fuera (`docs/SPEC_prueba_recurrentes.md` §3) y
este plan no repite ni reintroduce: avisar cuando una ocurrencia se salta (FA-R1),
pausar una serie (FA-R2), editar puesto/franja de una serie existente (FA-R3), un
tope al número de series por persona (FA-R4), y cualquier cambio al alcance real de
Momento 1 (FA-R5).

Dos cosas que el plan real sí tiene y este no, a propósito y no por olvido:

- **Sin revisión con contexto fresco** (equivalente a T-8 del plan real). La spec de
  práctica no la pide, y agregarla sería trabajo que nadie especificó (regla dura 4).
- **Sin ensayo de demo cronometrado** (equivalente a T-9). Mismo motivo: no hay CA
  que lo exija, y este documento no se va a sustentar — es un ejercicio de la skill.

## Lo que este plan necesita y la spec no dice

Preguntado y respondido antes de escribir las tareas:

| Pregunta | Respuesta acordada |
|---|---|
| ¿Reparto entre las tres personas, como en el plan real, o un solo dueño? | Un solo dueño: Erick Albornoz, en las siete tareas. Confirmado explícitamente por el usuario, no asumido por precedente del plan real. |
| ¿Cuánto tiempo real hay? | Sin límite fijo. Cada tarea respeta igual el techo de 4 h de la regla dura 2; el total (15 h) es informativo, no una fecha límite. |

## Verificación de las once reglas duras (más las dos del equipo)

1. Sí — cada criterio de la tabla se responde con un comando o con 👁, sin juicio.
2. Sí — ninguna tarea pasa de 4 h; la más larga es T-R2, T-R5 y T-R7 con 3 h.
3. Sí — las siete tareas tienen a Erick Albornoz como dueño nombrado.
4. Sí — cada tarea cierra al menos un CA-R#; no hay revisión ni ensayo de demo (ver
   "Fuera de este ciclo").
5. Sí — el contrato se referencia, no se repite el texto de la spec.
6. Sí — dueño y tiempo se preguntaron antes de escribir la tabla.
7. Sí — no se asumió "los tres" por precedente del plan real.
8. Sí — sin "procura", "intenta" ni "idealmente" en ningún criterio.
9. Sí — toda tarea dice de cuál depende, o dice "—".
10. Sí — T-R1 no depende de nada.
11. Sí — reparto y tiempo, preguntados y con la respuesta escrita arriba.
12. Sí — ninguna tarea depende de una decisión abierta: la spec (§7) cierra las seis
    ambigüedades del encargo antes de este plan.
13. Sí — toda tarea nombra el archivo exacto que toca.
14. No aplica — no hay ventana de tiempo declarada contra la cual medir si 15 h caben
    o no.
