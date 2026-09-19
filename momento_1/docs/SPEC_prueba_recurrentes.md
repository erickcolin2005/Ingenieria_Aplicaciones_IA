# SPEC (ejercicio) — Reservas recurrentes

**Equipo:** Erick Albornoz · Frank Palma · Ana María Ruiz
**Extiende:** `docs/SPEC.md` v1.2 (dominio, puestos, franjas, R-1 a R-8, C-1 a C-3)
**Versión:** 1.0 · 2026-09-19

> **Esto es un ejercicio para practicar la skill `escribir-spec`, no un cambio de
> alcance real.** `docs/SPEC.md` §3 (FA-6) sigue vigente: las reservas recurrentes
> siguen fuera de Momento 1, pospuestas a Momento 2. Este archivo se guarda aparte
> a propósito y se borra cuando termine el ejercicio.

---

## 1. Resumen

Una reserva recurrente deja que una persona reserve el mismo puesto y la misma
franja **todas las semanas**, sin repetir el trámite cada vez. Se apoya en el
dominio ya definido en `docs/SPEC.md` v1.2: no introduce puestos, franjas ni
límites nuevos — reutiliza R-1 a R-7 para validar cada ocurrencia, y C-1/C-2 para
cancelarlas. Lo nuevo es únicamente cómo una intención semanal se convierte, con
el tiempo, en reservas individuales reales, y qué pasa cuando una semana no se
puede cumplir.

## 2. Objetivos

| # | Objetivo | Cómo se comprueba |
|---|---|---|
| O-1 | Crear una serie valida la primera ocurrencia con las reglas existentes y la reserva de inmediato | CA-R1 |
| O-2 | Una serie activa materializa automáticamente su siguiente ocurrencia, sin intervención manual, en cuanto la fecha entra en la ventana de 7 días | CA-R2 |
| O-3 | Una ocurrencia que no se puede crear, por cualquier regla, se salta sin romper el resto de la serie | CA-R3, CA-R4 |
| O-4 | Cancelar una sola ocurrencia no afecta a las demás semanas de la serie | CA-R5, CA-R6 |
| O-5 | Cancelar la serie completa detiene la generación de futuras ocurrencias, incluso si la ocurrencia vigente no se puede cancelar todavía | CA-R7, CA-R11 |
| O-6 | Toda serie tiene una fecha de fin obligatoria y deja de generar ocurrencias después de ella | CA-R8, CA-R9 |
| O-7 | Un estado guardado de una versión sin series sigue cargando sin perder reservas | CA-R10 |
| O-8 | La persona reconoce en pantalla qué reservas pertenecen a una serie y actúa sobre la ocurrencia o la serie por separado | CA-R12, CA-R13 |

## 3. Fuera de alcance

| # | No se hace | Por qué |
|---|---|---|
| FA-R1 | Avisar de algún modo (pantalla, correo) cuando una ocurrencia se salta | Es tan silencioso como R-8 en la spec base. Un aviso persistente exige decidir dónde vive ese registro y por cuánto tiempo, y no hay red saliente (FA-5 de la spec base) para notificar por otro canal. |
| FA-R2 | Pausar una serie temporalmente y reactivarla después | Pausar exige un tercer estado además de activa/cancelada (`pausada`, con su propia fecha de reactivación), y ninguna regla de negocio lo necesita todavía. Solo existe crear y cancelar. |
| FA-R3 | Editar el puesto o la franja de una serie ya creada | Editar reabre todas las validaciones de creación sobre una serie que ya puede tener una ocurrencia materializada. Cancelar y crear una serie nueva cubre el mismo caso sin una ruta de código adicional. |
| FA-R4 | Un tope al número de series activas por persona, más allá de lo que ya imponen R-2 y R-3 día a día | Cada ocurrencia materializada se valida como una reserva normal contra los límites existentes. Agregar un tope de "series" sería un límite nuevo que nadie pidió ni dio un número para. |
| FA-R5 | Cambiar el alcance de Momento 1 | Instrucción explícita: este documento no reemplaza ni modifica `docs/SPEC.md`. FA-6 sigue vigente. |

## 4. Diseño

### 4.1 Sobre qué se construye

Este documento no repite el dominio de `docs/SPEC.md` §4.2 (puestos, franjas,
persona) ni sus reglas R-1 a R-8 y C-1 a C-3: los reutiliza tal cual. Solo agrega
el concepto de **serie** y las reglas que gobiernan su ciclo de vida.

### 4.2 Serie recurrente

```json
{
  "serieId": "s-P-07-10-2026-09-22",
  "puesto": "P-07",
  "franja": 10,
  "diaSemana": 2,
  "codigo": "123456",
  "motivo": "",
  "fechaInicio": "2026-09-22",
  "fechaFin": "2026-12-15",
  "activa": true
}
```

- `diaSemana` se deriva de `fechaInicio` al crear la serie y no cambia.
- `serieId` es determinista: `s-<puesto>-<franja>-<fechaInicio>`. No hace falta
  más que estos tres campos para que sea único, porque dos series con el mismo
  puesto, franja y fecha de inicio serían la misma ocurrencia inicial, y la
  segunda ya se habría rechazado por R-9 antes de llegar a pedir un identificador.
- `motivo` se pide una sola vez, al crear la serie (relevante solo si `puesto` es
  `P-19` o `P-20`, por R-7), y se reutiliza en cada ocurrencia materializada. No
  se vuelve a pedir, porque la materialización es automática (R-11) y no hay
  momento en el que preguntarle nada a nadie.

### 4.3 Estado guardado

Extiende `reservas_lab_v1` (`docs/SPEC.md` §4.3) con un arreglo nuevo:

```json
{
  "version": 1,
  "reservas": [
    { "id": "r-...", "puesto": "P-07", "fecha": "2026-09-22", "franja": 10,
      "codigo": "123456", "motivo": "", "creada": "...",
      "serieId": "s-P-07-10-2026-09-22" }
  ],
  "series": [
    { "serieId": "s-P-07-10-2026-09-22", "puesto": "P-07", "franja": 10,
      "diaSemana": 2, "codigo": "123456", "motivo": "",
      "fechaInicio": "2026-09-22", "fechaFin": "2026-12-15", "activa": true }
  ]
}
```

`serieId` en una reserva es `null` (o el campo no existe) cuando la reserva no
viene de una serie. Un estado guardado sin el campo `series` se normaliza a
`series: []`, con el mismo criterio que ya usa `normalizarEstado` para campos
faltantes (CB-9 de la spec base).

### 4.4 Reglas de recurrencia (continúan la numeración de R-1 a R-8)

| # | Regla | Valor |
|---|---|---|
| R-9 | Crear una serie exige que su primera ocurrencia pase R-1 a R-7 vigentes | Si cualquiera falla, no se crea la serie ni ninguna reserva |
| R-10 | `fechaFin` es obligatoria y debe ser posterior a `fechaInicio` | Sin tope máximo de duración |
| R-11 | Al abrir la aplicación, toda serie activa cuya siguiente ocurrencia no materializada tenga fecha dentro de la ventana de R-4 (hoy … hoy+6) se intenta crear como una reserva normal, validada con R-1 a R-7 | — |
| R-12 | Si una ocurrencia no llega a materializarse dentro de su ventana —porque falla alguna regla, o porque su fecha pasó sin que la aplicación se abriera a tiempo— esa ocurrencia se pierde y la serie sigue con la semana siguiente | No se reintenta esa fecha |
| R-13 | Una serie deja de generar ocurrencias cuando la siguiente fecha calculada supera `fechaFin` | La serie queda `activa: false`; no se borra del estado |

### 4.5 Cancelación de recurrencia (extiende C-1 a C-3)

| # | Regla | Valor |
|---|---|---|
| C-4 | Cancelar una sola ocurrencia materializada se rige por C-1 y C-2, igual que cualquier reserva | La serie sigue generando las semanas siguientes |
| C-5 | Cancelar la serie completa intenta cancelar también la ocurrencia vigente (sujeta a C-1/C-2) **y**, pase o no esa cancelación puntual, marca la serie `activa: false` | Si la ocurrencia vigente está a menos de 60 minutos (C-2), esa reserva puntual queda viva, pero la serie deja de generar futuras igual |

### 4.6 Interfaz (extiende §4.8 de la spec base)

- Crear: al reservar una celda, un campo opcional "repetir cada semana hasta"
  con una fecha. Si se llena, se crea la serie (R-9); si se deja vacío, se crea
  una reserva única, como hoy.
- Cuadrícula: una celda que pertenece a una serie se distingue visualmente de una
  reserva única (por ejemplo, un ícono junto al código).
- Cancelar: al hacer clic en una celda propia que pertenece a una serie, la
  aplicación ofrece dos acciones por separado: "cancelar esta semana" (C-4) y
  "cancelar la serie" (C-5). Una celda que no pertenece a una serie se comporta
  como hoy.

## 5. Casos borde

| # | Caso | Comportamiento esperado |
|---|---|---|
| CB-R1 | La primera ocurrencia de una serie nueva choca con una reserva existente | Rechazo total (R-9); no se crea la serie ni ninguna reserva |
| CB-R2 | Se abre la aplicación y una serie activa tiene su siguiente ocurrencia ya dentro de la ventana de 7 días, y la celda está libre | Se crea automáticamente esa reserva (R-11), sin pedir nada a la persona |
| CB-R3 | La ocurrencia que le tocaba materializarse choca con una reserva de otra persona (R-1) | Se salta esa semana (R-12); la serie sigue |
| CB-R4 | La ocurrencia que le tocaba materializarse violaría R-2 o R-3 de la propia persona ese día | Mismo tratamiento que CB-R3: se salta (R-12) |
| CB-R5 | La aplicación no se abre durante toda la ventana en que le tocaba a una ocurrencia, y esa fecha ya pasó | Esa ocurrencia se pierde (R-12); la semana siguiente se evalúa normalmente cuando entre en ventana |
| CB-R6 | Cancelar una ocurrencia materializada 30 minutos antes de su inicio | Rechazo por C-2 (vía C-4), igual que cualquier reserva |
| CB-R7 | Cancelar una sola ocurrencia y luego llega el turno de la semana siguiente | La semana siguiente se materializa igual, sin verse afectada |
| CB-R8 | Cancelar la serie completa cuando ya hay una ocurrencia materializada dentro de 3 días | Se cancela también esa ocurrencia (C-1/C-2 lo permiten) y no se genera ninguna más (C-5) |
| CB-R9 | Cancelar la serie completa cuando la ocurrencia vigente está a 30 minutos de su inicio | La cancelación de esa ocurrencia puntual se rechaza por C-2; la serie igual queda `activa: false` y no genera más (C-5) |

## 6. Criterios de aceptación

| # | Criterio | Cómo |
|---|---|---|
| CA-R1 | Crear una serie cuya primera ocurrencia choca con una reserva existente no crea la serie ni la reserva | ✅ |
| CA-R2 | Una serie activa materializa automáticamente su siguiente ocurrencia cuando la fecha entra en la ventana de 7 días | ✅ |
| CA-R3 | Una ocurrencia que chocaría con otra reserva (R-1) se salta sin romper la serie: la semana siguiente se sigue intentando | ✅ |
| CA-R4 | Una ocurrencia que violaría R-2 o R-3 se salta con el mismo criterio que CA-R3 | ✅ |
| CA-R5 | Cancelar una sola ocurrencia materializada a menos de 60 minutos de su inicio se rechaza (C-2) | ✅ |
| CA-R6 | Cancelar una sola ocurrencia no afecta las ocurrencias futuras de la misma serie | ✅ |
| CA-R7 | Cancelar la serie completa detiene la generación de ocurrencias futuras | ✅ |
| CA-R8 | Crear una serie sin `fechaFin`, o con `fechaFin` anterior o igual a `fechaInicio`, se rechaza | ✅ |
| CA-R9 | Una serie no genera ninguna ocurrencia con fecha posterior a `fechaFin` | ✅ |
| CA-R10 | Un estado guardado sin el campo `series` se carga con `series: []`, sin perder ninguna reserva | ✅ |
| CA-R11 | Cancelar la serie cuando la ocurrencia vigente está a menos de 60 minutos de su inicio igual detiene la generación de futuras, aunque esa ocurrencia puntual no se cancele | ✅ |
| CA-R12 | La cuadrícula distingue visualmente una celda de una serie de una reserva única | 👁 |
| CA-R13 | Al hacer clic en una celda propia de una serie, la aplicación ofrece "cancelar esta semana" y "cancelar la serie" como acciones separadas | 👁 |

## 7. Decisiones

### Ambigüedades del encargo original, cerradas con el usuario antes de escribir

| Pregunta | Respuesta elegida | Alternativas descartadas |
|---|---|---|
| ¿Cómo convive la recurrencia semanal con R-4 (horizonte de 7 días), si la siguiente ocurrencia cae exactamente en el día 7? | Auto-materializar: cada ocurrencia se crea sola quien abre la app y su fecha ya entró en la ventana (R-11) | (a) Eximir a las series de R-4 y reservar todas las semanas futuras de una vez — rompe el límite que existe para todo lo demás. (b) Confirmación manual cada semana — agrega un trámite que la recurrencia existe justamente para evitar |
| ¿Qué pasa si una ocurrencia futura choca con otra persona? | Se salta esa semana; la serie sigue (R-12) | Cancelar la serie completa por un choque de una sola semana — penaliza semanas futuras que no tienen ningún problema |
| ¿El salto aplica solo a choques de puesto+franja (R-1), o también a los propios límites de la persona (R-2/R-3)? | Aplica a cualquier motivo de rechazo por igual (R-12) | Tratar R-2/R-3 distinto (por ejemplo, cancelando la serie) — no hay ninguna razón de negocio para que un choque con otra persona y un choque con las propias reservas se resuelvan distinto |
| ¿Cómo se cancela una serie: por ocurrencia, completa, o ambas? | Ambas, como dos acciones separadas (C-4 cancela una semana, C-5 cancela la serie) | Solo permitir cancelar la serie completa — obliga a perder todas las semanas futuras para corregir un solo choque de agenda de una semana puntual |
| ¿La recurrencia tiene fecha de fin obligatoria o es indefinida? | Obligatoria (R-10) | Indefinida hasta cancelar — genera series que nadie recuerda haber creado y que siguen materializando reservas meses después |
| ¿Hay un máximo de duración además de la fecha de fin? | No, sin tope superior | Un máximo de 16 semanas (un semestre) — es un número que nadie pidió; agregarlo sería inventar un límite, algo que la regla dura 5 del skill prohíbe |

### Decisiones de diseño derivadas

| Decisión | Alternativa descartada | Por qué |
|---|---|---|
| `serieId` determinista: `s-<puesto>-<franja>-<fechaInicio>` | Un id con `Math.random()` | Sigue la convención ya fijada para `id` de reserva en `docs/SPEC.md` §4.3: un id no reproducible no se puede afirmar en una prueba |
| Cancelar la serie también intenta cancelar la ocurrencia vigente, sujeta a C-1/C-2 | Dejar viva la ocurrencia ya materializada y solo detener la generación futura | Una reserva que sigue en pantalla después de que la persona "canceló toda la serie" es una reserva que nadie sabe explicar por qué sigue ahí. Se prefiere que la cancelación de la serie incluya lo que ya existe, bajo las mismas reglas que cualquier cancelación |
| `motivo` se guarda una sola vez en la serie y se reutiliza en cada ocurrencia | Pedirlo de nuevo en cada materialización | R-11 materializa sin interacción del usuario; no existe un momento en el que preguntarle algo a alguien |
| Este documento vive aparte, en `docs/SPEC_prueba_recurrentes.md` | Modificar `docs/SPEC.md` y revertir FA-6 | Instrucción explícita: es un ejercicio de la skill `escribir-spec`, no una decisión real de alcance para Momento 1. Se borra al terminar |
