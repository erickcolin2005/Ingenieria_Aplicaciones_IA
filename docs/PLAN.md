# PLAN — Sistema de reservas del laboratorio

**Derivado de:** `docs/SPEC.md` v1.0
**Equipo:** Erick Albornoz (E) · Frank Palma (F)
**Ventana real:** una semana, dos personas, con clase de por medio

Este plan no repite la spec. Cada tarea apunta al criterio de aceptación que la
cierra; lo que ese criterio significa está en la spec y no se copia aquí.

---

## Contrato de `producto/reglas.js`

Está en el plan y no en la spec porque es una decisión de implementación, y porque
fijarlo aquí es lo que permite que E y F arranquen el mismo día sin esperarse.

```js
crearEstado()                                  -> { version: 1, reservas: [] }
normalizarEstado(crudo)                        -> estado
validarReserva(estado, datos, ahora)           -> { ok, error, codigoError }
agregarReserva(estado, datos, ahora)           -> { ok, estado, error, codigoError }
validarCancelacion(estado, { id, codigo }, ahora) -> { ok, error, codigoError }
cancelarReserva(estado, { id, codigo }, ahora)    -> { ok, estado, error, codigoError }

// datos  = { puesto, fecha, franja, codigo, motivo }
// ahora  = objeto Date. Nunca se llama a new Date() dentro de reglas.js:
//          sin reloj inyectado, CA-8 y CA-13 no se pueden probar.
```

## Tareas

| # | Tarea | Dueño | Tamaño | Depende de | Criterio (sí/no) |
|---|---|---|---|---|---|
| T-1 | Crear `reglas.js` con las seis funciones del contrato, devolviendo la forma correcta aunque la lógica esté vacía | **E** | 3 h | — | `node -e "const r=require('./producto/reglas.js'); console.log(Object.keys(r).length)"` imprime `6` sin error |
| T-2 | Escribir `pruebas.js`: un caso por cada criterio ✅ de la spec (CA-4 a CA-15) más los casos borde que los sustentan | **F** | 3 h | Contrato (arriba) | El archivo declara ≥ 12 casos y cada caso nombra en su título el CA que verifica |
| T-3 | Implementar las reglas de reserva R-1 a R-7 | **E** | 3 h | T-1 | Los casos de CA-4, CA-5, CA-6, CA-7, CA-8, CA-9, CA-10 y CA-11 pasan |
| T-4 | Implementar las reglas de cancelación C-1 a C-3 | **E** | 2 h | T-1 | Los casos de CA-12 y CA-13 pasan |
| T-5 | Implementar `normalizarEstado`: versión, campos faltantes, JSON corrupto | **F** | 2 h | T-1 | El caso de CA-14 pasa y ninguna reserva previa se pierde |
| T-6 | Construir `reservas.html`: cuadrícula 20 × 7, selector de fecha, campo de código, línea de mensajes, aviso de estado local | **F** | 4 h | T-3 | CA-1, CA-2, CA-3 y CA-16 se verifican mirando la pantalla |
| T-7 | Construir `pruebas.html`: corre la misma suite en el navegador y muestra el conteo | **F** | 2 h | T-2 | CA-17: se abre con doble clic y muestra PASA/FALLA por caso |
| T-8 | Revisión con contexto fresco: sesión nueva, sin haber visto la construcción, contra los criterios de la spec | **E** | 2 h | T-6, T-7 | Existe `docs/decisiones/revision_contexto_fresco.md` con los hallazgos, o con la declaración explícita de cero hallazgos |
| T-9 | Ensayo cronometrado de la demo, con plan B | **E + F** | 2 h | T-6, T-7 | El ensayo completo cabe en 6:00 medido con cronómetro, dos veces seguidas |

**Carga:** E ≈ 10 h · F ≈ 11 h · 2 h compartidas.

## Orden y por qué

1. **T-1 primero**, sola, porque fija el contrato y desbloquea todo lo demás.
2. **T-2 arranca en paralelo con T-1**: F escribe las pruebas contra el contrato de
   este documento, no contra el código de E. Las pruebas fallan al principio — es lo
   esperado, no es un problema.
3. **T-3, T-4 y T-5** en paralelo: tocan funciones distintas del mismo archivo. El
   único riesgo es de conflicto en git, y se maneja commiteando seguido.
4. **T-6 después de T-3**, porque la interfaz llama a las reglas y no tiene sentido
   pintar una cuadrícula que no sabe rechazar nada.
5. **T-8 al final y por E**, que no escribió la interfaz. Un revisor que construyó lo
   que revisa no encuentra nada.
6. **T-9 el último día, no la noche anterior.**

## Primera tarea

**T-1, Erick.** No depende de nada: el contrato ya está escrito arriba. Se puede
empezar cerrando este documento.

## Fuera de este ciclo

Lo que la spec dejó fuera y no entra tampoco ahora:

- Reservas recurrentes (FA-6).
- Histórico y reportes (FA-7).
- Estado compartido entre máquinas (FA-4) — es la limitación conocida y declarada.
- Un botón explícito de "cancelar" separado del clic en la celda: mejora la interfaz,
  no cambia ninguna regla, no entra.
- Exportar el día a CSV para el laboratorista: útil, pero ningún criterio de
  aceptación lo pide.
- Vista de semana completa: multiplica el trabajo de interfaz sin tocar la cadena de
  skills, que es lo que evalúa el Momento 1.

## Lo que este plan necesita y la spec no dice

Preguntado y respondido antes de ejecutar, no asumido en silencio:

| Pregunta | Respuesta acordada |
|---|---|
| ¿`reglas.js` tiene que correr en Node, o solo en el navegador? | En los dos. En el navegador para `pruebas.html` (CA-17), en Node para poder verificar en la terminal sin abrir nada. Se resuelve con un bloque de compatibilidad al final del archivo. |
| ¿Quién es el dueño de `reglas.js` si E y F lo tocan a la vez? | E. F toca solo `normalizarEstado` (T-5). Si hay conflicto, decide E. |
| ¿Qué pasa si T-3 no termina el día previsto? | T-6 se hace contra el contrato con reglas incompletas. La interfaz no se bloquea por la lógica. |
| ¿Qué se muestra en la demo si nada funciona? | El plan B de `docs/DEMO.md`. Definido antes, no improvisado ese día. |
