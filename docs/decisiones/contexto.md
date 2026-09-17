# El archivo de contexto: qué cambió y por qué

**Versión 1 congelada:** `docs/decisiones/contexto_inicial.md`
**Versión final:** `CLAUDE.md` (raíz del repositorio)

## Cómo trabajamos

El método de la semana 2: **el contexto primero**, antes de cualquier pieza. Cuando
aparece una incoherencia entre piezas, se corrige **el contexto** y se regenera — no
se parcha la pieza suelta. Un parche arregla un archivo; una corrección del contexto
arregla todos los que vengan después.

Las piezas gobernadas por este contexto son diez: `SPEC.md`, `PLAN.md`, los tres
`SKILL.md`, `reglas.js`, `pruebas.js`, `reservas.html`, `pruebas.html` y
`POLITICA_PERMISOS.md`.

**Advertencia honesta sobre el método:** el reto de la semana 2 pide una sesión
limpia por pieza, para que la coherencia venga del archivo y no de la conversación.
Estas diez piezas se produjeron en **una sola sesión larga**, así que parte de la
coherencia observada puede venir de la conversación y no del contexto. Esa es
exactamente la prueba que queda pendiente y está montada en
`docs/decisiones/pruebas_skills.md`, prueba P-6: abrir una sesión nueva, pedir una
pieza más, y ver si sale coherente sin ayuda.

## Las incoherencias que encontramos

| # | Qué apareció | ¿La causaba el contexto? | Qué hicimos |
|---|---|---|---|
| I-1 | El contexto decía *"el producto es un archivo HTML"*. El diseño terminó con tres archivos (`reglas.js`, `reservas.html`, `pruebas.html`), porque los criterios de aceptación no son ejecutables si las reglas viven dentro de un `onclick`. | Sí | Contexto corregido: sección "Cómo se corre" con los tres comandos exactos, y decisión registrada en `SPEC.md §7`. |
| I-2 | `reglas.js` iba a leer la hora con `new Date()` internamente. Al escribir los casos de CA-8 (franja ya empezada) y CA-13 (cancelar tarde), quedó claro que así no se pueden probar: el resultado dependería de la hora a la que se corra la prueba. | Sí, por omisión | Regla nueva en el contexto: *"nunca llama a `new Date()`; el reloj entra por parámetro"*. Es la corrección que más trabajo ahorró: sin ella, dos criterios de la spec habrían sido inverificables. |
| I-3 | El contexto decía "todo en español" sin decir que aplicaba a los identificadores. Ambiguo: un nombre como `validateBooking` no lo violaba explícitamente. | Sí | Contexto corregido con el ejemplo literal: `validarReserva`, no `validateBooking`. |
| I-4 | Los mensajes de error empezaron saliendo genéricos ("solicitud inválida"), lo que hace imposible cumplir CA-15. | Sí, por omisión | Regla nueva: todo mensaje nombra la regla violada, con ejemplo. Después agregamos un caso de prueba que lo verifica automáticamente, para no depender de que alguien se acuerde. |
| I-5 | La spec decía *"anticipación máxima: 7 días calendario contando hoy"*. Al implementarla aparecieron dos lecturas: ¿se acepta hoy+6 o hoy+7? Con una lectura el criterio pasaba y con la otra fallaba. | No: era la **spec**, no el contexto | Se corrigió la spec (R-4 y CB-6) a *"hoy y los 6 días siguientes"*, y el caso de prueba verifica los dos bordes: hoy+6 se acepta, hoy+7 se rechaza. Del contexto salió una regla preventiva: *"no inventar números; si falta uno, pregúntalo"*. |
| I-6 | Nada impedía agregar una regla de negocio a `reglas.js` sin su caso de prueba. La regla existiría en el código y no en los criterios. | Sí, por omisión | Regla nueva: una regla nueva son **tres** cosas (entrada en la spec, rama en `reglas.js`, caso en `pruebas.js`). Si falta el caso, la regla no existe. |

## Los números

| Medición | Cantidad |
|---|---|
| Incoherencias encontradas | 6 |
| Corregidas cambiando el contexto | 5 (I-1, I-2, I-3, I-4, I-6) |
| Que no eran problema de contexto | 1 (I-5: ambigüedad de la spec) |
| Que necesitaron parche manual además del contexto | 2 (I-2 y I-4: el código ya escrito había que ajustarlo; el contexto evita que vuelva a pasar, no deshace lo hecho) |
| Incoherencias remanentes después de corregir y regenerar | 0 detectadas — con la salvedad del método de una sola sesión, arriba |

## Lo que aprendimos del ejercicio

- **Las omisiones pesan más que los errores.** Cuatro de las seis incoherencias
  (I-2, I-4, I-6 y en parte I-3) no fueron cosas mal escritas en el contexto, sino
  cosas que no estaban. Un contexto se evalúa por lo que impide, y lo que no dice no
  impide nada.
- **Las piezas tardías revelan el contexto malo.** I-2 apareció escribiendo la
  séptima pieza (`pruebas.js`), no la primera. En las primeras uno corrige sin darse
  cuenta; para la séptima ya no se acuerda de qué decidió.
- **La regla que más sirvió no es una prohibición, es una obligación**: "una regla
  nueva son tres cosas". Prohibir es fácil; lo difícil es que no se olvide un paso.

## Lo que quitamos del contexto

Estaba en el borrador y lo sacamos aplicando el criterio *"si borrándola la
herramienta haría lo mismo, sobra"*:

- *"Escribe código limpio y mantenible"* — no cambia una sola decisión.
- *"Usa buenas prácticas de programación"* — igual.
- *"El proyecto es para la universidad"* — no afecta ninguna línea del producto.
- Un párrafo que explicaba qué es `localStorage` — la herramienta ya lo sabe; solo
  ocupaba espacio y diluía las reglas que sí importan.
