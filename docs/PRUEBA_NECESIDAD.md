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

Aplicamos la misma tabla a lo que estamos considerando. *(Si el equipo cambia de
idea, se re-evalúa con esta misma tabla antes de empezar a construir.)*

### Candidata A — "Asistente de reservas por chat"

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

### Candidata B — "Revisor de coherencia entre documentos normativos"

Le entregas tres documentos (reglamento, instructivo, procedimiento) y devuelve la
lista de contradicciones entre ellos: un documento dice 60 minutos y otro dice una
hora y media, uno permite algo que el otro prohíbe.

| Eje | Resultado |
|---|---|
| Entrada | Texto en prosa, de largo y estructura impredecibles → **modelo** |
| Reglas | "Contradicción" no se puede enumerar: depende del significado, no de las palabras. Un `diff` no lo encuentra. → **modelo** |
| Determinismo | Se tolera variación: es una lista de sospechas para que un humano revise → **modelo** |
| Volumen | Decenas de documentos → **modelo** |
| Latencia | Segundos, sin problema → **modelo** |
| Costo del error | Bajo: un falso positivo cuesta una lectura; y lo revisa una persona antes de cambiar nada → **modelo** |

**Veredicto: pasa.** Si le quitamos el modelo, **desaparece**. No hay forma de
detectar "estos dos párrafos se contradicen" con reglas explícitas, porque la
contradicción está en el significado. Los seis ejes apuntan al mismo lado.

**Señales de rechazo verificadas:** no funciona igual con un buscador (buscar
"60 minutos" no encuentra "una hora y media"); el modelo no está redactando una
respuesta ya calculada, está haciendo el trabajo; y no se resolvería con reglas
explícitas, que fue justo lo que intentamos primero.
