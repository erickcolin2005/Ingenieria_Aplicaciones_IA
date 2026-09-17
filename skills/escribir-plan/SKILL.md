---
name: escribir-plan
description: Deriva docs/PLAN.md a partir de una especificación que ya existe, repartiendo el trabajo en tareas con dueño, tamaño, dependencias y criterio sí/no, y señalando cuál es la primera tarea. Úsala cuando pidan planificar, organizar el trabajo, repartir tareas entre el equipo, estimar cuánto toma, decidir el orden o saber por dónde empezar, y ya haya una spec escrita. No la uses para redactar o corregir la especificación misma (eso es escribir-spec) ni para implementar las tareas (eso es ejecutar-plan). Si no existe una spec, detente y dilo.
---

# Escribir el plan derivado de una spec

## Qué produce

Un archivo `docs/PLAN.md` con cuatro secciones:

| Sección | Contenido | Criterio de éxito |
|---|---|---|
| Tareas | Qué, criterio, dueño, dependencias | Ninguna supera media jornada por persona |
| Orden | La secuencia y por qué esa | Se puede empezar sin esperar a nadie |
| Primera tarea | Señalada explícitamente | No depende de nada |
| Fuera de este ciclo | Lo que la spec pospuso | No queda vacía |

## Procedimiento

1. **Lee la spec completa.** Si no existe, detente y dilo: no hay nada que derivar.
2. Lista los criterios de aceptación. Cada tarea del plan debe cerrar al menos uno.
3. Pregunta los nombres de las personas del equipo. **No los inventes ni escribas
   "desarrollador 1".**
4. Pregunta cuánto tiempo real hay y cuántas personas trabajan.
5. Escribe las tareas. Parte cualquiera que pase de cuatro horas.
6. Ordénalas de modo que la primera no dependa de nada y que el equipo pueda empezar
   en paralelo desde el día uno.
7. Antes de entregar, revisa las once reglas duras una por una y reporta cuál
   incumpliste, si alguna.

## Las once reglas duras

1. Todo criterio se responde con sí o con no.
2. Ninguna tarea supera media jornada de una persona: cuatro horas.
3. Toda tarea tiene un dueño identificado con nombre.
4. Solo entran tareas que la spec especifique. Nada de trabajo extra.
5. El plan **deriva** la spec, no la repite. Lo que ya está escrito allá se referencia,
   no se copia.
6. Se pregunta antes de inventar. Nombres, plazos, capacidades y límites se preguntan.
7. El skill no asume nombres de personas: los solicita si faltan.
8. Ningún verbo impreciso. "Procura", "intenta", "idealmente" y "se recomienda"
   invalidan una regla dura: se escribe qué se hace y qué no.
9. Las dependencias son explícitas: cada tarea dice de cuál otra depende, o dice que
   de ninguna.
10. La primera tarea se ejecuta sin bloqueos.
11. Se pregunta qué cosas la spec no dice pero el plan necesita, y las respuestas
    quedan escritas en el plan.

## Reglas añadidas por el equipo

12. **Ninguna tarea puede depender de una decisión que la spec dejó abierta.** Si al
    escribir una tarea aparece un "depende de qué decidamos sobre X", el skill se
    detiene y avisa que falta cerrar X en la spec. Razón: una tarea así se ve
    planificada y en realidad está bloqueada, y eso no se descubre hasta el día en
    que alguien intenta hacerla.

13. **Cada tarea nombra el archivo o los archivos concretos que toca.** Razón: dos
    tareas que dicen "implementar validaciones" y "arreglar la lógica" son la misma
    tarea escrita dos veces, y no se nota hasta que dos personas la hacen en paralelo.

14. **Si la suma de las tareas no cabe en el tiempo declarado, el plan lo dice en una
    línea y propone qué sacar.** Razón: un plan que no cabe no es un plan optimista,
    es un plan falso. Es mejor mover algo a "fuera de este ciclo" el primer día que
    descubrirlo el último.

## Antes de entregar

- [ ] ¿Alguna tarea pasa de cuatro horas?
- [ ] ¿Alguna tarea no tiene dueño con nombre propio?
- [ ] ¿Algún criterio necesita interpretación para responderse?
- [ ] ¿La primera tarea depende de algo?
- [ ] ¿"Fuera de este ciclo" quedó vacía?
- [ ] ¿Hay alguna tarea que la spec no pida?
- [ ] ¿Quedó algún verbo impreciso?
