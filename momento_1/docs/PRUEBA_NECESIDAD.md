# Prueba de necesidad — ¿este caso necesita un modelo de lenguaje?

**Equipo:** Erick Albornoz · Frank Palma

## Respuesta corta

**No.** El sistema de reservas del laboratorio no usa ningún modelo de lenguaje, y
esa es una decisión, no una limitación. Si nos quitan el modelo, el producto sigue
funcionando exactamente igual, porque nunca hubo uno.

Lo que sí usó modelo fue **el proceso**: la spec, el plan y la construcción se
hicieron con la cadena de skills. El producto es determinista de punta a punta.

---

## 1. El caso completo contra los seis ejes

| Eje | Qué pide este caso | Hacia dónde apunta |
|---|---|---|
| **Entrada** | Un puesto de una lista de 20, una franja de una lista de 7, una fecha de un calendario, un código de 6 a 10 dígitos. Todo son opciones de un conjunto cerrado; ni un solo campo de texto libre que haya que interpretar. | **Código** |
| **Reglas** | Siete reglas de reserva y tres de cancelación, todas numéricas y todas escritas en `docs/SPEC.md §4.4`. Caben en una tabla. No cambian solas. | **Código** |
| **Determinismo** | La misma solicitud sobre el mismo estado tiene que dar siempre la misma respuesta. Si el martes rechaza una tercera franja consecutiva y el jueves la acepta, el sistema perdió su única razón de existir. | **Código** |
| **Volumen** | Cientos de operaciones al día en un laboratorio de 20 puestos. El volumen no obliga a nada. | Neutro |
| **Latencia** | Alguien hace clic en una celda frente a la puerta del laboratorio. La respuesta tiene que ser inmediata. Un modelo tardaría entre uno y varios segundos, y sin conexión no respondería nunca. | **Código** |
| **Costo del error** | Dos personas con el mismo puesto a la misma hora es un problema presencial: llegan las dos y una se queda sin trabajar. No hay forma de deshacerlo después. | **Código** |

Cinco ejes hacia código, uno neutro, **cero hacia el modelo**.

## 2. ¿Hay alguna parte que sí lo justificaría?

Sí, dos — y ninguna entra en este producto.

### 2.1 Una entrada en lenguaje natural

> *"Necesito un puesto mañana en la tarde, de preferencia con GPU"*

Aquí la entrada **sí** es lenguaje abierto: hay un número infinito de formas de
escribir lo mismo, y las reglas para interpretarlas no se pueden enumerar. Los ejes
cambian de lado: entrada abierta, reglas inescribibles, se tolera variación (si
entiende mal, la persona corrige), latencia de segundos aceptable al escribir una
frase, y el costo del error es bajo **porque el modelo no reserva nada**.

Esa última parte es la condición. El diseño correcto sería:

```
frase libre → [modelo] → { fecha, franja, puesto, preferencia }
                           ↓
                  validarReserva(...)   ← las mismas reglas deterministas
```

El modelo **traduce**, no decide. Sigue siendo `reglas.js` quien acepta o rechaza, y
si el modelo entiende "mañana" como el día equivocado, la persona lo ve en la
pantalla antes de confirmar. Un modelo que pudiera reservar directamente sería un
modelo capaz de asignarle a alguien un puesto que no pidió.

**Por qué no entra:** sería comodidad sobre una interfaz donde hacer clic en una
celda ya toma dos segundos, y agregaría una dependencia de red a un producto cuyo
valor está en funcionar sin conexión, parado frente a la puerta del laboratorio.

### 2.2 Redactar el aviso de cierre por mantenimiento

Un texto distinto cada vez, tono institucional, sin una respuesta correcta única.
Eso es exactamente para lo que sirve un modelo. Pero el aviso lo escribe el
laboratorista una vez cada varios meses, en la herramienta que quiera, por fuera del
sistema. Meterlo dentro del producto no le ahorraría trabajo a nadie.

## 3. Mapeo de componentes

| Componente | ¿Usa modelo? | Por qué |
|---|---|---|
| Validación de reglas (`reglas.js`) | No | Reglas numéricas finitas. Exige determinismo absoluto. |
| Cálculo de franjas consecutivas | No | Es aritmética sobre una lista ordenada. |
| Persistencia (`localStorage`) | No | Serializar JSON. |
| Normalización de datos viejos | No | Hay que decidir campo por campo qué se conserva. Un modelo "arreglando" datos guardados es una forma elegante de perderlos. |
| Cuadrícula e interacción | No | 140 celdas con tres estados posibles. |
| Mensajes de error | No | Un mensaje por regla, escritos a mano. Además tienen que ser idénticos siempre: el mensaje **es** la explicación de la regla. |
| Interpretación de lenguaje natural | *Lo usaría* | No está construido (§2.1). |
| Especificación, plan y construcción | **Sí** | Ahí está el trabajo abierto: decidir qué construir, cómo repartirlo y escribirlo. Eso es la cadena de skills, y es lo que evalúa el Momento 1. |

## 4. La decisión arquitectónica, en una línea

**No hay modelo dentro del producto; el modelo está en el proceso que lo produjo.**
Un LLM dentro de este sistema agregaría latencia, dependencia de red, costo por
consulta y una probabilidad de equivocarse, a cambio de ninguna capacidad que las
reglas no tengan ya.

## 5. Las ideas candidatas del equipo para el Momento 2

Aplicamos la misma tabla a las dos ideas que pusimos sobre la mesa. Una no pasó.

### Candidata A (descartada) — "Asistente de reservas por chat"

Ponerle un chat al sistema que ya tenemos.

| Eje | Resultado |
|---|---|
| Entrada | Lenguaje libre → favorece modelo |
| Reglas | Las de interpretación no se pueden enumerar → favorece modelo |
| Determinismo | La decisión final sigue siendo determinista → el modelo solo traduce |
| Costo del error | Bajo, porque la persona confirma antes de que se reserve |

**Veredicto: pasa, pero débil.** Si le quitamos el modelo, la funcionalidad no
desaparece: queda la cuadrícula, que es más rápida. El modelo agrega comodidad, no
capacidad. Según el criterio del curso —*"¿deja de existir o solo queda más fea?"*—
esta idea solo queda más fea. **No alcanza.**

### Candidata B (elegida) — Sistema de captación: auditoría SEO y generador de clientes

Dos piezas que se alimentan entre sí:

1. **Auditoría SEO.** Analiza la web de un negocio en siete áreas y produce un informe
   presentable, con hallazgos, severidad y el fragmento de código para arreglar cada
   uno. Es el producto que se vende.
2. **Generador de clientes.** Barre las fichas públicas de un tipo de negocio en una
   ciudad, las enriquece leyendo sus reseñas, las puntúa de 0 a 100 según qué tanto
   conviene contactarlas, y redacta un correo de primer contacto que cita un detalle
   real de ese negocio. **Ningún correo se envía solo:** quedan en borrador.

| Eje | Qué pide esta idea | Hacia dónde apunta |
|---|---|---|
| **Entrada** | Reseñas escritas por clientes: prosa libre, de cualquier largo, con faltas de ortografía, ironía y quejas dichas de mil formas distintas | **Modelo** |
| **Reglas** | "Cuál es la queja que se repite" no se puede enumerar. *"Tardaron mucho"*, *"llevo 40 minutos esperando"* y *"se demoraron una eternidad"* son la misma queja y no comparten **ni una palabra**. Ninguna lista de términos las agrupa | **Modelo** |
| **Determinismo** | Se tolera variación en el resumen y en el correo: son borradores que una persona lee antes de usar. **Pero la puntuación no**: ver la tabla de abajo | **Modelo** (en la parte de lenguaje) |
| **Volumen** | Cientos de fichas por barrido, no millones | **Modelo** |
| **Latencia** | Es un proceso por lotes que corre mientras uno hace otra cosa. Segundos por ficha no molestan a nadie | **Modelo** |
| **Costo del error** | Un resumen mal hecho cuesta una lectura. Un correo mal redactado no se envía, porque la persona lo revisa. El diseño pone un humano en el medio **por decisión**, no por cortesía | **Modelo** |

**Veredicto: pasa.** Si le quitamos el modelo, la extracción sigue funcionando, la
puntuación sigue funcionando y el informe sigue saliendo — pero el enriquecimiento y
los correos personalizados **desaparecen**, y con ellos la razón de ser del sistema.
Lo que queda es una plantilla con mail-merge, que es exactamente lo que el propio
sistema declara que no vale: *"si el detalle no es específico de ese negocio, no vale"*.

**Señales de rechazo, verificadas una por una:**

- *¿Funciona igual cambiando "con IA" por "con un buscador"?* No. Un buscador
  encuentra la ficha; no lee treinta reseñas y dice qué molesta a los clientes.
- *¿El modelo solo redacta una respuesta ya calculada?* No en el enriquecimiento.
  **Sí lo sería si le pidiéramos la nota** — y por eso la nota no se la pedimos.
- *¿Se resolvería con reglas explícitas?* La puntuación sí, y por eso va en código.
  El resto no.

### Dónde va el modelo, y dónde no debe ir

Esta es la parte que hay que defender, porque la tentación es pedirle todo al modelo.

| Componente | ¿Modelo? | Por qué |
|---|---|---|
| Extracción de las fichas | No | Datos estructurados de una página: nombre, teléfono, dirección, valoración. Es extracción, no comprensión. |
| Enriquecimiento: a qué se dedica, la queja que se repite, si es cadena o negocio de trato directo | **Sí** | Es el núcleo. Entrada en prosa libre, reglas inenumerables. |
| **Puntuación de 0 a 100** | **No — y esta es la decisión importante** | Son pesos fijos sobre datos ya extraídos: tiene teléfono, cuántas reseñas contra la mediana del listado, tiene web, es cadena. Si la calcula el modelo, el mismo negocio saca notas distintas en dos corridas y **el desglose que muestra cada tarjeta deja de significar nada**. La aritmética va en código. |
| Correos de primer contacto | **Sí** | Escribir 80 palabras que citen un detalle específico. Es generación pura. |
| Auditoría: Core Web Vitals, sitemap, canonicals, indexabilidad | No | Se miden con herramientas. Un número es un número, y pedirle a un modelo que lo estime es cambiar una medición por una suposición. |
| Auditoría: huecos de contenido frente a la competencia, E-E-A-T, redacción de los hallazgos | **Sí** | Comparar qué cubre un sitio y el otro no exige entender de qué hablan los dos. |
| Informe HTML: gráficas, filtros, persistencia de las notas de llamada | No | Código. |
| Envío de los correos | **No existe, a propósito** | El modelo redacta; la persona envía. Un sistema que escribe a personas reales necesita un humano en el medio por diseño. |

### Lo que hay que resolver antes de construirlo

Lo dejamos escrito ahora porque el Momento 3 evalúa seguridad y gobernanza, y porque
son problemas de diseño, no detalles:

- **Términos de Google.** Extraer de Google Maps va contra sus términos de servicio, y
  con cientos de fichas el bloqueo es probable. La vía permitida es la API de Places,
  que es de pago. **Decisión pendiente**, y condiciona si el sistema puede escalarse o
  se queda en ejercicio académico.
- **Datos personales.** Los teléfonos y correos de dueños de negocios pequeños pueden
  contar como datos personales bajo la Ley 1581 de 2012, y la Ley 2300 de 2023 limita
  canales y horarios del contacto comercial. Hay que verificarlo antes de usarlo con
  datos reales. No somos abogados y no vamos a fingir que lo somos.
- **"Sin web localizable" no es "sin web".** La etiqueta dice que el método no la
  encontró, no que no exista. Un sistema que afirma más de lo que sabe produce correos
  que empiezan con una mentira comprobable.
- **Dónde quedan las notas de llamada.** En el navegador donde se abre el informe, no
  dentro del archivo. Es el mismo problema que ya tenemos en el producto del Momento 1
  (FA-4), y ya sabemos cómo se declara: en pantalla, no en una nota al pie.
