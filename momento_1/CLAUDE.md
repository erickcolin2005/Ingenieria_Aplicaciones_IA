# Contexto del proyecto

## Qué es esto

Momento 1 del curso Ingeniería de Aplicaciones con IA. Equipo: Erick Albornoz,
Frank Palma y Ana María Ruiz. Producto: un sistema de reservas del laboratorio (20 puestos, franjas
de 2 horas, 6:00–20:00) construido con la cadena `escribir-spec` → `escribir-plan`
→ `ejecutar-plan`.

`docs/SPEC.md` manda. Si algo que te piden contradice la spec, dilo antes de
escribir código.

## Cómo se corre

```
node producto/pruebas.js          # los criterios de aceptación. Ninguno puede quedar en FALLA.
start producto\reservas.html      # la aplicación (Windows). Mac: open producto/reservas.html
start producto\pruebas.html       # los mismos criterios, en el navegador
```

No hay `npm install`, no hay servidor, no hay build. Si algo pide instalarse,
está mal planteado.

## Convenciones

- **Todo en español**: código, comentarios, mensajes, nombres de funciones y de
  variables. `validarReserva`, no `validateBooking`.
- **`reglas.js` no toca el DOM, no toca `localStorage` y nunca llama a `new Date()`.**
  El reloj entra por parámetro (`ahora`). Sin eso, CA-8 y CA-13 no se pueden probar.
- Las funciones de reglas devuelven `{ ok, codigoError, error }`. Nunca lanzan
  excepciones para reportar una regla violada, y nunca devuelven solo `true`/`false`.
- Las funciones que cambian el estado devuelven **uno nuevo**. No se muta el que
  reciben.
- ES5 en `producto/`: `var`, `function`, sin `const`/`let`/flechas/módulos. Razón
  abajo, en "decisiones ya tomadas".
- Todo mensaje de error nombra la regla violada: `"Regla R-2: quedarías con más de
  2 franjas seguidas."` Nunca `"Error"` ni `"Solicitud inválida"`.
- Una regla nueva del negocio es: una entrada en `docs/SPEC.md §4.4`, una función o
  rama en `reglas.js`, un caso en `pruebas.js`. **Las tres.** Si falta el caso de
  prueba, la regla no existe.
- Documentos en `docs/`, producto en `producto/`, skills en `skills/`.

## Decisiones ya tomadas — no las vuelvas a proponer

- **Sin dependencias y sin base de datos.** Es restricción del reto, no preferencia.
- **ES5 en `producto/`**: el archivo se abre con doble clic desde `file://` en
  máquinas del laboratorio que no controlamos. No vale la pena averiguar qué
  navegador tienen.
- **Sin modelo de lenguaje dentro del producto.** Ya está sustentado con los seis
  ejes en `docs/PRUEBA_NECESIDAD.md`. No propongas agregar IA al producto.
- **Sin login.** Se identifica con el código de estudiante y el sistema confía. Está
  declarado como FA-1 en la spec, con la razón.
- **El estado es local al navegador** (FA-4). Es la limitación conocida; la
  aplicación la muestra en pantalla. No propongas sincronizar entre máquinas.
- `id` de reserva = `r-<fecha>-<franja>-<puesto>`. Determinista a propósito: un
  `Math.random()` ahí rompe las pruebas.

## Qué NO hacer

- No instalar nada, ni sugerir librerías, ni usar `npx`.
- No tocar `docs/SPEC.md` para que cuadre con el código. Va al revés: si el código
  contradice la spec, el que está mal es el código.
- No marcar una tarea como terminada sin correr `node producto/pruebas.js`.
- No escribir criterios de aceptación con juicio ("que funcione bien", "rápido",
  "usable"). Si no se responde sí/no, no es criterio.
- No poner llaves de API en ningún archivo. Van en `.env`, que está en `.gitignore`.
  El producto **no hace peticiones de red**: si algo necesita una llave, algo se
  desvió.
- No inventar números. Todo límite (2 consecutivas, 3 diarias, 7 días, 60 minutos,
  15 caracteres) está en la spec. Si falta uno, pregúntalo.
