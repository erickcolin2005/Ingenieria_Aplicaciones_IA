# Decisiones — Semana 4

**Equipo:** Erick Albornoz · Frank Palma
**Caso elegido:** A — aplicación HTML sin librerías ni servidor

---

## Las tres decisiones más difíciles de la spec

### 1. No hay autenticación, y lo decimos

El enunciado no menciona login, pero un sistema de reservas sin identidad no tiene
sentido: cualquiera cancela la reserva de cualquiera. La tentación era poner un
usuario y una contraseña guardados en `localStorage`.

**Lo descartamos.** Sin servidor, la contraseña se valida en la misma máquina de
quien la escribe: se salta abriendo la consola del navegador. Habríamos construido
un candado que no cierra, y esos son peores que no tener candado, porque la gente
confía en ellos.

**Lo que hicimos:** identidad por código de estudiante, sin verificar, y el hueco
declarado como FA-1 en la spec, con la razón escrita. Preferimos una limitación
documentada a una seguridad fingida.

### 2. Los límites de uso: 2 consecutivas y 3 diarias

Esta fue la más discutida porque no hay respuesta correcta, solo consecuencias.

- **Sin límite**: dos personas madrugadoras se quedan el laboratorio entero.
- **Límite semanal** (lo que primero quisimos): obliga a guardar histórico, y el
  histórico abre una decisión de retención de datos personales que no íbamos a
  resolver bien en dos semanas. Descartado, y quedó en FA-7.
- **Límite diario**: se calcula con lo que ya está en pantalla, no necesita histórico,
  y se explica en una frase.

Después apareció el caso que casi se nos escapa: **dos consecutivas no es lo mismo
que dos seguidas en el orden en que se piden**. Alguien reserva 6:00 y 10:00, y
después rellena las 8:00. Ninguna regla se dispara si uno mira solo los vecinos de
la franja pedida, pero la persona termina con tres horas seguidas. La regla tuvo que
reescribirse para evaluar **la cadena resultante**, no el movimiento. Es CB-4, y
salió probando, no diseñando.

### 3. Lo que el sistema no ejecuta: inasistencia y mantenimiento

El enunciado pide decidir qué pasa si alguien reserva y no va, y qué pasa si el
laboratorio cierra por mantenimiento. La respuesta fácil era implementar botones:
"marcar inasistencia", "cerrar franja".

**Lo descartamos**, y esta fue la decisión que más nos costó aceptar. El sistema no
tiene forma de saber quién llegó al laboratorio: un botón de asistencia sin
autenticación (decisión 1) es un botón para que cualquiera marque por otro, o para
que alguien borre las reservas de todos. Habría sido funcionalidad que se ve bien en
una demo y miente en producción.

**Lo que hicimos:** las dos políticas están **escritas completas** en la spec (§4.6 y
§4.7) y las aplica el laboratorista a mano. El sistema no ejecuta lo que no puede
verificar. Están en "fuera de alcance" con la razón, no en una lista de pendientes.

## Los skills, dónde quedaron

**Dos copias, con un script que las sincroniza.**

La fuente de verdad es `skills/`, que es lo que se versiona y lo que se entrega. La
herramienta lee de `.claude/skills/`, y `sync_skills.ps1` copia de la primera a la
segunda.

Consideramos las tres opciones:

| Opción | Por qué no / por qué sí |
|---|---|
| Solo en `.claude/skills/` | Cumpliría igual —la carpeta está en el repositorio— pero esconde en un directorio de configuración lo que es un entregable evaluado. |
| Enlace simbólico | Es lo correcto en Mac y Linux. En Windows exige permisos de administrador o el modo desarrollador, y no controlamos las máquinas del laboratorio. Además git lo trata como archivo, no como enlace, y en la máquina del otro integrante aparecería roto. |
| **Dos copias + script** | El costo conocido es que se desincronizan. Lo asumimos y lo mitigamos: `sync_skills.ps1` se corre **antes de cada prueba de skills**, y está en el procedimiento escrito de `pruebas_skills.md`. Un riesgo que se nombra y tiene un paso asignado es manejable; uno que se olvida, no. |

## Cómo repartimos el trabajo: no lo repartimos

Las dos personas trabajan sobre todas las tareas, rotando quién escribe. No hay
módulos de uno ni del otro.

La razón es la sustentación: la rúbrica dice que el evaluador señala una función **al
azar** y pregunta qué hace. Un reparto por módulos produce dos personas que dominan la
mitad cada una, y "esa parte la hizo el otro" es la segunda peor respuesta posible,
después de "lo hizo la IA". El costo —se avanzaría más rápido en paralelo— lo asumimos
a cambio de que cualquiera de los dos pueda defender cualquier línea del repositorio.

La única excepción es la prueba P-8, que exige dos máquinas distintas por definición.
Ahí no se reparte trabajo: se prueba portabilidad.

## Reglas duras que agregamos

Sobre las once de `escribir-plan` y las ocho de `ejecutar-plan`, agregamos seis
propias. Cada una salió de un problema que tuvimos, no de un catálogo.

| Skill | Regla nuestra | De dónde salió |
|---|---|---|
| `escribir-spec` | Toda ambigüedad del encargo queda listada en la sección de decisiones, **aunque ya se haya resuelto** | Porque en la sustentación preguntan "¿por qué 7 días y no 30?" y esa respuesta tiene que estar escrita, no recordada |
| `escribir-plan` | Ninguna tarea puede depender de una decisión que la spec dejó abierta; si aparece, el skill se detiene y avisa | Una tarea así se ve planificada y está bloqueada, y no se descubre hasta el día en que alguien intenta hacerla |
| `escribir-plan` | Cada tarea nombra los archivos concretos que toca | "Implementar validaciones" y "arreglar la lógica" son la misma tarea escrita dos veces, y no se nota hasta que dos personas la hacen en paralelo |
| `escribir-plan` | Si las tareas no caben en el tiempo declarado, el plan lo dice y propone qué sacar | Un plan que no cabe no es optimista, es falso. Mejor mover algo a "fuera de este ciclo" el primer día que descubrirlo el último |
| `ejecutar-plan` | Un criterio que se cumple a medias se reporta **FALLA**, no "parcial" | "Parcial" es la palabra con la que una tarea sin terminar se convierte en una tarea terminada |
| `ejecutar-plan` | Si durante la ejecución aparece algo que contradice la spec, se detiene el ciclo y se reporta | Cambiar la spec en silencio desde una tarea deja al otro integrante trabajando contra un acuerdo que ya no existe |

**Ninguna se ablandó.** No hay un "procura", un "idealmente" ni un "se recomienda" en
los tres archivos. Un verbo impreciso convierte una regla dura en una sugerencia, y
una sugerencia no se puede incumplir.

## El guion de la demo

Completo en `docs/DEMO.md`. Resumen:

| Tiempo | Punto |
|---|---|
| 0:00 – 2:00 | El producto funcionando, sin internet, con los rechazos de R-1, R-2 y R-7 en vivo, y 22/22 criterios |
| 2:00 – 3:00 | Las dos decisiones más difíciles de la spec y qué descartamos |
| 3:00 – 5:00 | La cadena: activación sin nombrar el skill, la prueba que falló, y el criterio no verificable |
| 5:00 – 6:00 | La decisión que defendemos: ningún modelo dentro del producto, y los seis ejes que lo sustentan |

**Quién dice qué se decide en el ensayo**, no aquí: los dos se saben los cuatro
bloques. Es la misma razón por la que no repartimos las tareas — ver "Cómo repartimos
el trabajo" en `docs/PLAN.md`.

**Por qué el producto abre** y no las decisiones, que es el orden del reto: la rúbrica
premia que *"la demo abra"*. Si algo se sale de tiempo, que sea lo que se cuenta y no
lo que se ve.

**Plan B:** el Wi-Fi va apagado desde el principio — nada depende de internet. Si el
navegador falla, la terminal muestra los mismos 22 criterios. Si el computador falla,
el del otro integrante tiene el repositorio clonado. Si `localStorage` está bloqueado,
**se enseña**: es el caso borde CB-10 y la aplicación lo avisa en pantalla. Tabla
completa en `docs/DEMO.md`.

## Lo que no alcanzamos, y por qué

Honestidad antes que tabla llena. Estas cosas están **montadas pero sin ejecutar**, y
todas dependen de algo que no se puede hacer desde la sesión donde se escribieron:

| Qué falta | Por qué no está | Dónde se llena |
|---|---|---|
| Las pruebas de activación de los tres skills | Exigen una **sesión nueva**. Correrlas en la sesión que los escribió mide la conversación, no la descripción: el resultado sería falso | `docs/decisiones/pruebas_skills.md` |
| La medición "antes y después" de `escribir-spec` | Misma razón: son dos corridas en dos sesiones | `docs/decisiones/pruebas_skills.md`, grupo B |
| La prueba P-8 (el skill corriendo en la otra máquina) | Exige el segundo computador | `docs/decisiones/pruebas_skills.md`, grupo C |
| La revisión con contexto fresco | Exige una sesión que no haya visto cómo se construyó. Lo que cambia es el contexto, no la persona | `docs/decisiones/revision_contexto_fresco.md` |
| Las pruebas de la política de permisos | Exigen una sesión abierta **dentro de `momento_1`** para que `.claude/settings.json` aplique | `docs/decisiones/pruebas_permisos.md` |
| Los dos ensayos cronometrados de la demo | Se hacen dos días antes, no la noche anterior | `docs/DEMO.md`, última tabla |

Y estas quedaron **fuera por decisión**, no por tiempo: reservas recurrentes,
histórico de uso, estado compartido entre máquinas, vista semanal y exportar a CSV.
Cada una con su razón en `docs/SPEC.md §3` y en `docs/PLAN.md`.
