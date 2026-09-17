---
name: escribir-spec
description: Escribe o revisa la especificación de un trabajo en docs/SPEC.md, con las siete secciones del curso (resumen, objetivos, fuera de alcance, diseño, casos borde, criterios de aceptación, decisiones). Úsala cuando pidan especificar, definir el alcance, decidir qué se va a construir, aclarar requisitos ambiguos o dejar por escrito cómo se verificará algo — es decir, ANTES de que exista un reparto de tareas. No la uses para repartir trabajo en tareas con dueños y dependencias (eso es escribir-plan) ni para implementar o modificar archivos del producto (eso es ejecutar-plan).
---

# Escribir una especificación

## Qué produce

Un archivo `docs/SPEC.md` con exactamente siete secciones, en este orden:

1. **Resumen** — qué se construye y por qué, en tres o cuatro líneas.
2. **Objetivos** — cada uno comprobable por separado.
3. **Fuera de alcance** — qué no se hace, **con la razón**. Mínimo cuatro entradas.
4. **Diseño** — qué cambia y dónde, con detalle suficiente para producirlo.
5. **Casos borde** — tabla de caso y comportamiento esperado.
6. **Criterios de aceptación** — cada uno respondible con sí o no.
7. **Decisiones** — tabla con la alternativa descartada y por qué.

## Procedimiento

### Fase 1 — Preguntar

Lee lo que existe en el repositorio. Después lista, una por una, las decisiones que
el encargo deja abiertas y que la spec tiene que cerrar. **Pregunta y espera
respuesta.** No sigas a la fase 2 con preguntas sin contestar.

Si no hay material para una sección, paras y preguntas. No la rellenas.

Preguntas que casi siempre hacen falta:
- ¿Cuáles son los límites numéricos exactos? (cantidades, plazos, máximos)
- ¿Qué pasa cuando alguien incumple una regla: se rechaza, se avisa, se registra?
- ¿Qué parte del problema se resuelve **fuera** del sistema, con una persona?
- ¿Qué cosas parecen necesarias y en realidad no lo son?

### Fase 2 — Escribir

Escribe las siete secciones. Reglas de redacción:

- Cada criterio de aceptación se responde **sí o no**. Si para responderlo hace falta
  un juicio ("que funcione bien", "que sea rápido", "que sea usable"), no es un
  criterio: reescríbelo o pregunta con qué número se mide.
- Cada entrada de "fuera de alcance" lleva su razón. Una lista sin razones es una
  lista de deseos incumplidos.
- Cada decisión nombra **qué se descartó**. Una decisión sin alternativa descartada
  no es una decisión: es una descripción.
- Los casos borde incluyen datos viejos y estados corruptos, no solo entradas
  inválidas del usuario.

### Fase 3 — Autoevaluar

Antes de entregar, revisa contra esta lista y **reporta qué falló**, no lo arregles
en silencio:

- [ ] ¿Las siete secciones están y ninguna es relleno?
- [ ] ¿"Fuera de alcance" tiene cuatro o más entradas, cada una con razón?
- [ ] ¿Cada criterio se responde sí/no sin discutir?
- [ ] ¿Cada decisión nombra la alternativa descartada?
- [ ] ¿Hay algún objetivo que ningún criterio de aceptación verifica?
- [ ] ¿Hay algún criterio de aceptación que no corresponde a ningún objetivo?

## Reglas duras

1. Nunca rellenar una sección sin material: se pregunta.
2. Nunca escribir un criterio de aceptación que no se responda sí o no.
3. "Fuera de alcance" nunca queda vacío ni con menos de cuatro entradas.
4. Toda decisión registra la alternativa descartada.
5. Preguntar antes de inventar un número, un plazo o un límite.
6. La spec describe **qué** y **cómo se verifica**, nunca reparte tareas ni pone
   dueños ni fechas.
7. No ablandar una regla. Si algo es obligatorio se escribe "debe", nunca "procura"
   ni "idealmente".

## Regla añadida por el equipo

8. **Toda ambigüedad del encargo original queda listada explícitamente en la sección
   de decisiones, aunque se haya resuelto.** Razón: cuando alguien pregunte en la
   sustentación "¿por qué 7 días y no 30?", la respuesta tiene que estar escrita,
   no recordada.
