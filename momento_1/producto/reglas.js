/* reglas.js — Reglas del sistema de reservas del laboratorio.
 *
 * Aquí vive TODA la lógica de negocio, como funciones puras: reciben el estado y
 * los datos, devuelven un resultado. No tocan el DOM ni localStorage, y nunca
 * llaman a new Date(): el reloj se recibe por parámetro (`ahora`). Sin eso, los
 * criterios CA-8 y CA-13 no se podrían probar.
 *
 * Corre igual en el navegador (pruebas.html, reservas.html) y en Node
 * (node producto/pruebas.js). Ver el bloque de compatibilidad al final.
 *
 * Referencia: docs/SPEC.md §4.2 a §4.5
 */

// ---------------------------------------------------------------- constantes

var TOTAL_PUESTOS = 20;
var FRANJAS = [6, 8, 10, 12, 14, 16, 18];   // hora de inicio; cada franja dura 2 h
var PUESTOS_ESPECIALES = ['P-19', 'P-20'];  // equipo especializado (GPU)

var MAX_CONSECUTIVAS = 2;   // R-2
var MAX_DIARIAS = 3;        // R-3
var DIAS_ADELANTE = 6;      // R-4: hoy + 6 = siete días en total
var MINUTOS_CANCELACION = 60; // C-2
var MOTIVO_MINIMO = 15;     // R-7
var CODIGO_MIN = 6;         // R-6
var CODIGO_MAX = 10;        // R-6

// Se arma con las constantes para que el límite viva en un solo sitio: si cambia
// R-6, cambia arriba y lo siguen la validación, el mensaje de error y la pantalla.
var RE_CODIGO = new RegExp('^\\d{' + CODIGO_MIN + ',' + CODIGO_MAX + '}$');

var PUESTOS = (function () {
  var lista = [];
  for (var i = 1; i <= TOTAL_PUESTOS; i++) {
    lista.push('P-' + (i < 10 ? '0' + i : '' + i));
  }
  return lista;
})();

// ------------------------------------------------------------------ utilidad

function dosDigitos(n) { return n < 10 ? '0' + n : '' + n; }

/** Fecha local de un Date en formato YYYY-MM-DD. No usa UTC a propósito: el
 *  laboratorio abre a las 6:00 hora local, no a las 6:00 de Greenwich. */
function fechaISO(fecha) {
  return fecha.getFullYear() + '-' + dosDigitos(fecha.getMonth() + 1) + '-' + dosDigitos(fecha.getDate());
}

function esFechaValida(texto) {
  if (typeof texto !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  var partes = texto.split('-');
  var d = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  return fechaISO(d) === texto;
}

/** Medianoche local del día indicado por 'YYYY-MM-DD'. */
function medianoche(fechaTexto) {
  var partes = fechaTexto.split('-');
  return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
}

/** Momento exacto en que empieza una franja. */
function inicioFranja(fechaTexto, franja) {
  var d = medianoche(fechaTexto);
  d.setHours(franja, 0, 0, 0);
  return d;
}

/** Días completos entre hoy y la fecha pedida. Negativo = pasado. */
function diasDesdeHoy(fechaTexto, ahora) {
  var hoy = medianoche(fechaISO(ahora));
  var objetivo = medianoche(fechaTexto);
  return Math.round((objetivo - hoy) / 86400000);
}

function etiquetaFranja(franja) {
  return dosDigitos(franja) + ':00–' + dosDigitos(franja + 2) + ':00';
}

function esPuestoEspecial(puesto) {
  return PUESTOS_ESPECIALES.indexOf(puesto) !== -1;
}

function fallo(codigo, mensaje) {
  return { ok: false, codigoError: codigo, error: mensaje };
}

function exito() {
  return { ok: true, codigoError: null, error: null };
}

/** Identificador determinista. R-1 garantiza que esta terna es única, así que no
 *  hace falta un número aleatorio (que además rompería las pruebas). */
function idDeReserva(puesto, fechaTexto, franja) {
  return 'r-' + fechaTexto + '-' + franja + '-' + puesto;
}

// --------------------------------------------------------------------- estado

function crearEstado() {
  return { version: 1, reservas: [] };
}

/** Celda = la terna puesto + fecha + franja. Es lo que R-1 y R-8 declaran único.
 *  Nunca se compara por `id`: un estado viejo puede traer ids con otro formato, y
 *  dos reservas de la misma celda no compartirían identificador (CB-15). */
function claveCelda(puesto, fechaTexto, franja) {
  return puesto + '|' + fechaTexto + '|' + franja;
}

/** CB-9 y CB-10: un estado guardado por una versión anterior, con campos
 *  faltantes o con basura adentro, se limpia — no se descarta. Nadie debería
 *  perder sus reservas porque nosotros agregamos un campo.
 *
 *  R-8 y CB-15: si el estado ya llegó con dos reservas sobre la misma celda
 *  —escrito a mano, copiado entre máquinas, o producido por dos pestañas—, se
 *  conserva la primera del arreglo y las siguientes se descartan. R-1 no alcanza
 *  a impedirlo: solo actúa sobre lo que pasa por validarReserva, y esto entra por
 *  otro lado. El descarte es silencioso a propósito (SPEC.md §4.4 y §7). */
function normalizarEstado(crudo) {
  var estado = crearEstado();
  if (!crudo || typeof crudo !== 'object' || !Array.isArray(crudo.reservas)) return estado;

  var celdasVistas = {};

  for (var i = 0; i < crudo.reservas.length; i++) {
    var r = crudo.reservas[i];
    if (!r || typeof r !== 'object') continue;
    if (PUESTOS.indexOf(r.puesto) === -1) continue;
    if (FRANJAS.indexOf(Number(r.franja)) === -1) continue;
    if (!esFechaValida(r.fecha)) continue;
    if (typeof r.codigo !== 'string' || !RE_CODIGO.test(r.codigo)) continue;

    // R-8: la celda ya la tomó una reserva anterior del arreglo.
    var clave = claveCelda(r.puesto, r.fecha, Number(r.franja));
    if (celdasVistas[clave] === true) continue;
    celdasVistas[clave] = true;

    estado.reservas.push({
      id: typeof r.id === 'string' && r.id ? r.id : idDeReserva(r.puesto, r.fecha, Number(r.franja)),
      puesto: r.puesto,
      fecha: r.fecha,
      franja: Number(r.franja),
      codigo: r.codigo,
      motivo: typeof r.motivo === 'string' ? r.motivo : '',
      creada: typeof r.creada === 'string' ? r.creada : null
    });
  }
  return estado;
}

/** C-1: ¿esta reserva es de quien dice ser? Existe para que la interfaz no compare
 *  códigos por su cuenta: si el criterio de identidad cambia, cambia aquí y en un
 *  solo sitio. */
function esDe(reserva, codigo) {
  if (!reserva || typeof codigo !== 'string') return false;
  return reserva.codigo === codigo.trim();
}

/** R-5: ¿la franja ya empezó? Mismo criterio exacto que usa `validarReserva`, para
 *  que la pantalla no pueda decir "libre" sobre algo que la regla rechaza. */
function franjaYaPaso(fechaTexto, franja, ahora) {
  return inicioFranja(fechaTexto, franja) <= ahora;
}

function reservasDe(estado, codigo, fechaTexto) {
  return estado.reservas.filter(function (r) {
    return r.codigo === codigo && r.fecha === fechaTexto;
  });
}

function buscarReserva(estado, puesto, fechaTexto, franja) {
  for (var i = 0; i < estado.reservas.length; i++) {
    var r = estado.reservas[i];
    if (r.puesto === puesto && r.fecha === fechaTexto && r.franja === franja) return r;
  }
  return null;
}

/** Cadena consecutiva más larga que quedaría si se agrega `nueva`.
 *  Mira el resultado final, no el orden de llegada: es lo que atrapa CB-4
 *  (reservar 6 y 10, y después rellenar el hueco de las 8). */
function maximaCadena(franjasOcupadas, nueva) {
  var todas = franjasOcupadas.slice();
  if (todas.indexOf(nueva) === -1) todas.push(nueva);
  todas.sort(function (a, b) { return a - b; });

  var mejor = 1, actual = 1;
  for (var i = 1; i < todas.length; i++) {
    actual = (todas[i] - todas[i - 1] === 2) ? actual + 1 : 1;
    if (actual > mejor) mejor = actual;
  }
  return todas.length === 0 ? 0 : mejor;
}

// ------------------------------------------------------------------- reservar

/** Valida una reserva contra R-1 … R-7. Devuelve { ok, codigoError, error }.
 *  El orden importa: primero lo que hace inválida la petición en sí (datos,
 *  código, fecha) y después lo que depende del estado. Así el mensaje señala la
 *  causa real y no una consecuencia. */
function validarReserva(estado, datos, ahora) {
  datos = datos || {};
  var puesto = datos.puesto;
  var fecha = datos.fecha;
  var franja = Number(datos.franja);
  var codigo = typeof datos.codigo === 'string' ? datos.codigo.trim() : '';
  var motivo = typeof datos.motivo === 'string' ? datos.motivo.trim() : '';

  if (PUESTOS.indexOf(puesto) === -1) {
    return fallo('E_PUESTO', 'El puesto "' + puesto + '" no existe. Van de P-01 a P-' + TOTAL_PUESTOS + '.');
  }
  if (FRANJAS.indexOf(franja) === -1) {
    return fallo('E_FRANJA', 'La franja ' + datos.franja + ' no existe. El laboratorio abre de 6:00 a 20:00 en bloques de dos horas.');
  }
  if (!esFechaValida(fecha)) {
    return fallo('E_FECHA', 'La fecha "' + fecha + '" no es válida. Debe tener el formato AAAA-MM-DD.');
  }
  // R-6 antes que todo lo demás (CB-7): sin identidad no hay nada que validar.
  if (!RE_CODIGO.test(codigo)) {
    return fallo('E_CODIGO', 'Regla R-6: el código de estudiante debe tener entre ' + CODIGO_MIN + ' y ' + CODIGO_MAX + ' dígitos, solo números.');
  }

  var dias = diasDesdeHoy(fecha, ahora);
  if (dias < 0) {
    return fallo('E_PASADA', 'Regla R-5: esa fecha ya pasó.');
  }
  if (dias > DIAS_ADELANTE) {
    return fallo('E_ANTICIPACION', 'Regla R-4: solo se reserva hoy y los ' + DIAS_ADELANTE + ' días siguientes. Esa fecha está a ' + dias + ' días.');
  }
  if (franjaYaPaso(fecha, franja, ahora)) {
    return fallo('E_INICIADA', 'Regla R-5: la franja ' + etiquetaFranja(franja) + ' ya empezó.');
  }
  // R-7
  if (esPuestoEspecial(puesto) && motivo.length < MOTIVO_MINIMO) {
    return fallo('E_MOTIVO', 'Regla R-7: ' + puesto + ' tiene equipo especializado. Escribe para qué lo necesitas (mínimo ' + MOTIVO_MINIMO + ' caracteres).');
  }
  // R-1
  var ocupada = buscarReserva(estado, puesto, fecha, franja);
  if (ocupada) {
    return fallo('E_OCUPADA', 'Regla R-1: ' + puesto + ' ya está reservado en la franja ' + etiquetaFranja(franja) + '.');
  }

  var propias = reservasDe(estado, codigo, fecha);
  // R-3
  if (propias.length >= MAX_DIARIAS) {
    return fallo('E_MAX_DIARIAS', 'Regla R-3: ya tienes ' + propias.length + ' franjas ese día. El máximo es ' + MAX_DIARIAS + '.');
  }
  // R-2
  var franjasPropias = propias.map(function (r) { return r.franja; });
  if (maximaCadena(franjasPropias, franja) > MAX_CONSECUTIVAS) {
    return fallo('E_CONSECUTIVAS', 'Regla R-2: quedarías con más de ' + MAX_CONSECUTIVAS + ' franjas seguidas. Deja un bloque libre entre medio.');
  }

  return exito();
}

/** Devuelve un estado NUEVO con la reserva agregada. No modifica el recibido. */
function agregarReserva(estado, datos, ahora) {
  var v = validarReserva(estado, datos, ahora);
  if (!v.ok) return { ok: false, estado: estado, error: v.error, codigoError: v.codigoError };

  var franja = Number(datos.franja);
  var codigo = datos.codigo.trim();
  var reserva = {
    id: idDeReserva(datos.puesto, datos.fecha, franja),
    puesto: datos.puesto,
    fecha: datos.fecha,
    franja: franja,
    codigo: codigo,
    motivo: typeof datos.motivo === 'string' ? datos.motivo.trim() : '',
    creada: ahora.toISOString()
  };

  return {
    ok: true,
    estado: { version: estado.version, reservas: estado.reservas.concat([reserva]) },
    error: null,
    codigoError: null
  };
}

// ------------------------------------------------------------------ cancelar

function validarCancelacion(estado, datos, ahora) {
  datos = datos || {};
  var codigo = typeof datos.codigo === 'string' ? datos.codigo.trim() : '';
  var reserva = null;

  for (var i = 0; i < estado.reservas.length; i++) {
    if (estado.reservas[i].id === datos.id) { reserva = estado.reservas[i]; break; }
  }
  if (!reserva) {
    return fallo('E_NO_EXISTE', 'Esa reserva no existe.');
  }
  // C-1
  if (!esDe(reserva, codigo)) {
    return fallo('E_AJENA', 'Regla C-1: esa reserva es de otra persona. Solo la cancela quien la hizo.');
  }
  // C-2
  var minutos = (inicioFranja(reserva.fecha, reserva.franja) - ahora) / 60000;
  if (minutos < MINUTOS_CANCELACION) {
    return fallo('E_PLAZO', 'Regla C-2: faltan menos de ' + MINUTOS_CANCELACION + ' minutos para la franja ' + etiquetaFranja(reserva.franja) + '. Habla con el laboratorista.');
  }

  return exito();
}

function cancelarReserva(estado, datos, ahora) {
  var v = validarCancelacion(estado, datos, ahora);
  if (!v.ok) return { ok: false, estado: estado, error: v.error, codigoError: v.codigoError };

  return {
    ok: true,
    estado: {
      version: estado.version,
      reservas: estado.reservas.filter(function (r) { return r.id !== datos.id; })
    },
    error: null,
    codigoError: null
  };
}

// --------------------------------------------------- compatibilidad de entorno

var REGLAS = {
  // constantes
  TOTAL_PUESTOS: TOTAL_PUESTOS, FRANJAS: FRANJAS, PUESTOS: PUESTOS,
  PUESTOS_ESPECIALES: PUESTOS_ESPECIALES, MAX_CONSECUTIVAS: MAX_CONSECUTIVAS,
  MAX_DIARIAS: MAX_DIARIAS, DIAS_ADELANTE: DIAS_ADELANTE,
  MINUTOS_CANCELACION: MINUTOS_CANCELACION, MOTIVO_MINIMO: MOTIVO_MINIMO,
  CODIGO_MIN: CODIGO_MIN, CODIGO_MAX: CODIGO_MAX,
  // contrato (docs/PLAN.md)
  crearEstado: crearEstado,
  normalizarEstado: normalizarEstado,
  validarReserva: validarReserva,
  agregarReserva: agregarReserva,
  validarCancelacion: validarCancelacion,
  cancelarReserva: cancelarReserva,
  // auxiliares que la interfaz necesita
  fechaISO: fechaISO, etiquetaFranja: etiquetaFranja, inicioFranja: inicioFranja,
  esPuestoEspecial: esPuestoEspecial, buscarReserva: buscarReserva,
  diasDesdeHoy: diasDesdeHoy, idDeReserva: idDeReserva,
  // la interfaz las usa para no reimplementar C-1 ni R-5
  esDe: esDe, franjaYaPaso: franjaYaPaso
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = REGLAS;           // node producto/pruebas.js
} else if (typeof window !== 'undefined') {
  window.REGLAS = REGLAS;            // reservas.html y pruebas.html
}
