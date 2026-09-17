# Revisión con contexto fresco

**Tarea:** T-8 · **La corren los tres**
**Estado: PENDIENTE — se ejecuta en sesión nueva antes de la demo.**

Esta página está a propósito sin llenar. Los hallazgos de una revisión que no se hizo
no se pueden escribir de antemano, y en la sustentación la pregunta es literal:
*"¿qué encontró la revisión con contexto fresco que ustedes no vieron?"*

## Por qué en sesión aparte

La sesión que escribió el código ya tiene una explicación para cada decisión que tomó.
Pedirle que la critique es pedirle que se contradiga. Una sesión que no vio el proceso
solo tiene el código y los criterios, que es lo que importa.

## Cómo se hace

1. Cerrar la sesión actual por completo.
2. Abrir una sesión nueva en la carpeta `momento_1`.
3. Pegar el prompt de abajo **sin agregar contexto ni explicar nada**. Si uno empieza
   a justificar, la revisión ya se contaminó.
4. Copiar los hallazgos tal como salgan a la tabla de resultados. **También los que
   nos parezcan injustos**: si un hallazgo se descarta, se escribe por qué, no se borra.

## El prompt

```
Revisa producto/reglas.js, producto/reservas.html y producto/pruebas.js
contra los criterios de aceptación de docs/SPEC.md sección 6 y las reglas
de la sección 4.

Busca qué está mal. En concreto:
- Reglas de la spec que el código no implementa, o que implementa distinto.
- Criterios de aceptación que ninguna prueba verifica de verdad.
- Casos borde de la sección 5 que no tienen caso de prueba.
- Reglas de negocio duplicadas en la interfaz en vez de estar en reglas.js.
- Mensajes de error que no nombran la regla violada.

No arregles nada. Lista los hallazgos con archivo y línea.
```

## Resultados

| # | Hallazgo | Archivo y línea | ¿Es real? | Qué hicimos |
|---|---|---|---|---|
|   |          |                 |           |             |

**Conteo:** hallazgos reportados: ___ · confirmados: ___ · descartados con razón: ___

Si la revisión no encuentra nada, se escribe aquí *"cero hallazgos"* y se dice en la
demo. Es un resultado válido; inventarse hallazgos para que se vea trabajado, no.
