---
name: ejecutar-plan
description: Ejecuta UNA tarea de un docs/PLAN.md que ya existe: anuncia cuál va a hacer y por qué esa, dice qué archivos va a modificar, espera confirmación, hace el cambio, lo verifica contra el criterio de aceptación, reporta paso o fallo con evidencia, y se detiene. Úsala cuando pidan implementar, construir, hacer la siguiente tarea, avanzar el plan, continuar con lo planificado o marcar algo como terminado. No la uses para redactar la especificación (eso es escribir-spec) ni para armar o reorganizar la lista de tareas (eso es escribir-plan). Si no existe un plan, detente y dilo.
---

# Ejecutar una tarea del plan

Sirve igual para código y para documentos. "Verificar" cambia de forma —correr una
prueba, o contrastar dos documentos— pero el protocolo es el mismo.

## Protocolo, en orden

1. **Anuncia qué tarea vas a ejecutar y por qué esa.** La razón viene del orden y las
   dependencias del plan, no de cuál parece más fácil.
2. **Di exactamente qué vas a modificar**: los archivos, y qué les va a pasar.
   **Espera confirmación.** No empieces sin ella.
3. Haz el cambio.
4. **Verifica contra el criterio de aceptación de esa tarea**, tal como está escrito
   en el plan. No contra lo que crees que quería decir.
5. **Reporta PASA o FALLA con evidencia**: la salida de la prueba, el fragmento del
   documento, lo que sea que se pueda mirar. Un "listo" sin evidencia no cuenta.
6. **Detente.** No sigas con la siguiente tarea.

## Las ocho reglas duras

1. Una tarea por ciclo. Nunca dos.
2. Confirmación humana antes de cualquier cambio.
3. Solo se ejecutan tareas que estén en el plan. Si aparece trabajo necesario que no
   está, se reporta y se espera: no se hace de paso.
4. Siempre se verifica y siempre se reporta el resultado explícitamente.
5. Si el criterio de aceptación **no se puede verificar** con lo que hay disponible,
   se dice así y **no** se declara cumplido.
6. Nunca se marca una tarea como hecha automáticamente. Lo marca quien confirma.
7. Terminada una tarea, se para.
8. Funciona igual para código y para documentos.

## Reglas añadidas por el equipo

9. **Un criterio que se cumple a medias se reporta FALLA, no "parcial".** Razón:
   "parcial" es la palabra con la que una tarea sin terminar se convierte en una
   tarea terminada. O el criterio se responde sí, o se responde no.

10. **Si durante la ejecución aparece algo que contradice la spec, se detiene el ciclo
    y se reporta la contradicción.** No se resuelve sobre la marcha. Razón: la spec es
    el acuerdo del equipo; cambiarla en silencio desde una tarea deja al otro
    integrante trabajando contra un acuerdo que ya no existe.

## El criterio no verificable

Es el caso que más se falla. Ejemplo real: el criterio dice *"20 personas reservan
al tiempo sin conflictos"* y no hay 20 personas.

La respuesta correcta es:

> No puedo verificar este criterio: exige 20 usuarios simultáneos y no tengo forma de
> simularlos con lo que hay. La tarea queda **sin verificar**. Opciones: reescribir el
> criterio como algo ejecutable (por ejemplo, 20 llamadas seguidas a la función de
> reserva sobre el mismo estado), o conseguir con qué probarlo.

La respuesta incorrecta —la que hay que evitar— es implementar algo, no poder
probarlo, y escribir "verificado".

## Formato del reporte

```
TAREA: T-x — <título tal como está en el plan>
POR QUÉ ESTA: <dependencia u orden del plan>
VOY A MODIFICAR: <archivos y qué les pasa>
→ espera confirmación

CAMBIO REALIZADO: <resumen en una línea>
CRITERIO: <copiado literal del plan>
VERIFICACIÓN: <el comando corrido o la comprobación hecha>
EVIDENCIA: <salida real>
RESULTADO: PASA / FALLA / NO VERIFICABLE
DETENIDO. Esperando instrucción para la siguiente tarea.
```
