/* pruebas.js — Los criterios de aceptación de docs/SPEC.md §6, ejecutables.
 *
 * Cada caso nombra el criterio que verifica. Si un criterio no se puede escribir
 * como un caso de este archivo, o no es verificable o no es un criterio.
 *
 * En terminal:  node producto/pruebas.js
 * En navegador: abrir producto/pruebas.html con doble clic
 *
 * El reloj es fijo (AHORA). Una prueba que depende de la hora a la que se corre
 * no es una prueba.
 */

(function (raiz, definir) {
  var R = (typeof require === 'function') ? require('./reglas.js') : raiz.REGLAS;
  var api = definir(R);
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  else { raiz.PRUEBAS = api; }
  // En Node, correr de una vez.
  if (typeof require === 'function' && typeof module !== 'undefined' && require.main === module) {
    var r = api.ejecutar();
    r.resultados.forEach(function (x) {
      console.log((x.ok ? 'PASA  ' : 'FALLA ') + x.ca + ' — ' + x.titulo + (x.ok ? '' : '\n        ' + x.detalle));
    });
    console.log('\n' + r.pasan + '/' + r.total + ' criterios pasan.');
    process.exit(r.fallan === 0 ? 0 : 1);
  }
})(typeof window !== 'undefined' ? window : globalThis, function (R) {

  // --------------------------------------------------------- reloj y ayudas

  var AHORA = new Date(2026, 8, 17, 9, 30, 0);  // jueves 17 sep 2026, 9:30 a. m.
  var HOY = '2026-09-17';
  var MANANA = '2026-09-18';

  function conReservas(lista) {
    var estado = R.crearEstado();
    lista.forEach(function (x) {
      estado.reservas.push({
        id: R.idDeReserva(x.puesto, x.fecha, x.franja),
        puesto: x.puesto, fecha: x.fecha, franja: x.franja,
        codigo: x.codigo, motivo: x.motivo || '', creada: AHORA.toISOString()
      });
    });
    return estado;
  }

  function esperarError(resultado, codigoEsperado) {
    if (resultado.ok) return 'Se esperaba el rechazo ' + codigoEsperado + ' y fue aceptado.';
    if (resultado.codigoError !== codigoEsperado) {
      return 'Se esperaba ' + codigoEsperado + ' y llegó ' + resultado.codigoError + ' ("' + resultado.error + '").';
    }
    return null;
  }

  function esperarOk(resultado) {
    return resultado.ok ? null : 'Se esperaba que fuera aceptado y fue rechazado: ' + resultado.error;
  }

  // ------------------------------------------------------------------ casos

  var casos = [

    { ca: 'CA-4', titulo: 'Un puesto ya reservado en esa franja se rechaza y no se duplica', fn: function () {
      var estado = conReservas([{ puesto: 'P-07', fecha: MANANA, franja: 14, codigo: '111111' }]);
      var e = esperarError(R.validarReserva(estado, { puesto: 'P-07', fecha: MANANA, franja: 14, codigo: '222222' }, AHORA), 'E_OCUPADA');
      if (e) return e;
      var r = R.agregarReserva(estado, { puesto: 'P-07', fecha: MANANA, franja: 14, codigo: '222222' }, AHORA);
      if (r.estado.reservas.length !== 1) return 'La reserva rechazada igual se agregó al estado.';
      return null;
    }},

    { ca: 'CA-4', titulo: 'Un puesto libre en esa misma franja sí se acepta', fn: function () {
      var estado = conReservas([{ puesto: 'P-07', fecha: MANANA, franja: 14, codigo: '111111' }]);
      return esperarOk(R.validarReserva(estado, { puesto: 'P-08', fecha: MANANA, franja: 14, codigo: '222222' }, AHORA));
    }},

    { ca: 'CA-5', titulo: 'Una tercera franja consecutiva se rechaza (R-2)', fn: function () {
      var estado = conReservas([
        { puesto: 'P-01', fecha: MANANA, franja: 12, codigo: '111111' },
        { puesto: 'P-01', fecha: MANANA, franja: 14, codigo: '111111' }
      ]);
      return esperarError(R.validarReserva(estado, { puesto: 'P-01', fecha: MANANA, franja: 16, codigo: '111111' }, AHORA), 'E_CONSECUTIVAS');
    }},

    { ca: 'CA-5', titulo: 'Dos consecutivas y una separada sí se aceptan', fn: function () {
      var estado = conReservas([
        { puesto: 'P-01', fecha: MANANA, franja: 6, codigo: '111111' },
        { puesto: 'P-01', fecha: MANANA, franja: 8, codigo: '111111' }
      ]);
      return esperarOk(R.validarReserva(estado, { puesto: 'P-01', fecha: MANANA, franja: 12, codigo: '111111' }, AHORA));
    }},

    { ca: 'CA-6', titulo: 'Una cuarta franja del día se rechaza (R-3)', fn: function () {
      var estado = conReservas([
        { puesto: 'P-01', fecha: MANANA, franja: 6, codigo: '111111' },
        { puesto: 'P-02', fecha: MANANA, franja: 10, codigo: '111111' },
        { puesto: 'P-03', fecha: MANANA, franja: 14, codigo: '111111' }
      ]);
      return esperarError(R.validarReserva(estado, { puesto: 'P-04', fecha: MANANA, franja: 18, codigo: '111111' }, AHORA), 'E_MAX_DIARIAS');
    }},

    { ca: 'CA-6', titulo: 'El límite diario es por persona, no por puesto', fn: function () {
      var estado = conReservas([
        { puesto: 'P-01', fecha: MANANA, franja: 6, codigo: '111111' },
        { puesto: 'P-02', fecha: MANANA, franja: 10, codigo: '111111' },
        { puesto: 'P-03', fecha: MANANA, franja: 14, codigo: '111111' }
      ]);
      return esperarOk(R.validarReserva(estado, { puesto: 'P-04', fecha: MANANA, franja: 18, codigo: '999999' }, AHORA));
    }},

    { ca: 'CA-7', titulo: 'Rellenar el hueco que forma tres seguidas se rechaza (CB-4)', fn: function () {
      var estado = conReservas([
        { puesto: 'P-05', fecha: MANANA, franja: 6, codigo: '111111' },
        { puesto: 'P-05', fecha: MANANA, franja: 10, codigo: '111111' }
      ]);
      return esperarError(R.validarReserva(estado, { puesto: 'P-05', fecha: MANANA, franja: 8, codigo: '111111' }, AHORA), 'E_CONSECUTIVAS');
    }},

    { ca: 'CA-8', titulo: 'Una franja de hoy que ya empezó se rechaza (R-5)', fn: function () {
      var estado = R.crearEstado();
      var e = esperarError(R.validarReserva(estado, { puesto: 'P-01', fecha: HOY, franja: 6, codigo: '111111' }, AHORA), 'E_INICIADA');
      if (e) return e;
      return esperarError(R.validarReserva(estado, { puesto: 'P-01', fecha: HOY, franja: 8, codigo: '111111' }, AHORA), 'E_INICIADA');
    }},

    { ca: 'CA-8', titulo: 'Una franja de hoy que todavía no empieza se acepta', fn: function () {
      return esperarOk(R.validarReserva(R.crearEstado(), { puesto: 'P-01', fecha: HOY, franja: 10, codigo: '111111' }, AHORA));
    }},

    { ca: 'CA-9', titulo: 'El octavo día se rechaza y el séptimo se acepta (R-4)', fn: function () {
      var estado = R.crearEstado();
      var e = esperarError(R.validarReserva(estado, { puesto: 'P-01', fecha: '2026-09-24', franja: 10, codigo: '111111' }, AHORA), 'E_ANTICIPACION');
      if (e) return e;
      return esperarOk(R.validarReserva(estado, { puesto: 'P-01', fecha: '2026-09-23', franja: 10, codigo: '111111' }, AHORA));
    }},

    { ca: 'CA-9', titulo: 'Una fecha pasada se rechaza (R-5)', fn: function () {
      return esperarError(R.validarReserva(R.crearEstado(), { puesto: 'P-01', fecha: '2026-09-16', franja: 10, codigo: '111111' }, AHORA), 'E_PASADA');
    }},

    { ca: 'CA-10', titulo: 'Un código que no sea de 6 a 10 dígitos se rechaza (R-6)', fn: function () {
      var estado = R.crearEstado();
      var invalidos = ['12345', '12345a', '', '   ', '12345678901'];
      for (var i = 0; i < invalidos.length; i++) {
        var e = esperarError(R.validarReserva(estado, { puesto: 'P-01', fecha: MANANA, franja: 10, codigo: invalidos[i] }, AHORA), 'E_CODIGO');
        if (e) return 'Con el código "' + invalidos[i] + '": ' + e;
      }
      return esperarOk(R.validarReserva(estado, { puesto: 'P-01', fecha: MANANA, franja: 10, codigo: '123456' }, AHORA));
    }},

    { ca: 'CA-11', titulo: 'P-19 y P-20 sin motivo suficiente se rechazan (R-7)', fn: function () {
      var estado = R.crearEstado();
      var e = esperarError(R.validarReserva(estado, { puesto: 'P-19', fecha: MANANA, franja: 10, codigo: '111111', motivo: 'trabajo' }, AHORA), 'E_MOTIVO');
      if (e) return e;
      e = esperarError(R.validarReserva(estado, { puesto: 'P-20', fecha: MANANA, franja: 10, codigo: '111111' }, AHORA), 'E_MOTIVO');
      if (e) return e;
      return esperarOk(R.validarReserva(estado, { puesto: 'P-19', fecha: MANANA, franja: 10, codigo: '111111', motivo: 'entrenar el modelo de vision del proyecto' }, AHORA));
    }},

    { ca: 'CA-11', titulo: 'Un puesto normal no exige motivo', fn: function () {
      return esperarOk(R.validarReserva(R.crearEstado(), { puesto: 'P-18', fecha: MANANA, franja: 10, codigo: '111111' }, AHORA));
    }},

    { ca: 'CA-12', titulo: 'Cancelar la reserva de otra persona se rechaza (C-1)', fn: function () {
      var estado = conReservas([{ puesto: 'P-03', fecha: MANANA, franja: 10, codigo: '111111' }]);
      var id = R.idDeReserva('P-03', MANANA, 10);
      var e = esperarError(R.validarCancelacion(estado, { id: id, codigo: '222222' }, AHORA), 'E_AJENA');
      if (e) return e;
      var r = R.cancelarReserva(estado, { id: id, codigo: '222222' }, AHORA);
      if (r.estado.reservas.length !== 1) return 'La cancelación ajena igual borró la reserva.';
      return esperarOk(R.validarCancelacion(estado, { id: id, codigo: '111111' }, AHORA));
    }},

    { ca: 'CA-13', titulo: 'Cancelar a menos de 60 minutos del inicio se rechaza (C-2)', fn: function () {
      // A las 9:30, la franja de las 10:00 arranca en 30 minutos.
      var estado = conReservas([{ puesto: 'P-03', fecha: HOY, franja: 10, codigo: '111111' }]);
      var e = esperarError(R.validarCancelacion(estado, { id: R.idDeReserva('P-03', HOY, 10), codigo: '111111' }, AHORA), 'E_PLAZO');
      if (e) return e;
      // La de las 12:00 arranca en 150 minutos: todavía se puede.
      var estado2 = conReservas([{ puesto: 'P-03', fecha: HOY, franja: 12, codigo: '111111' }]);
      var r = R.cancelarReserva(estado2, { id: R.idDeReserva('P-03', HOY, 12), codigo: '111111' }, AHORA);
      if (!r.ok) return 'No dejó cancelar con 150 minutos de anticipación: ' + r.error;
      if (r.estado.reservas.length !== 0) return 'Dijo que canceló pero la reserva sigue ahí.';
      return null;
    }},

    { ca: 'CA-14', titulo: 'Un estado guardado por una versión anterior se carga sin perder reservas (CB-9)', fn: function () {
      var viejo = { version: 0, reservas: [
        { puesto: 'P-01', fecha: MANANA, franja: 10, codigo: '111111' },              // sin motivo, sin id, sin creada
        { id: 'viejo-2', puesto: 'P-02', fecha: MANANA, franja: 12, codigo: '222222' }
      ]};
      var estado = R.normalizarEstado(viejo);
      if (estado.reservas.length !== 2) return 'Se perdieron reservas: quedaron ' + estado.reservas.length + ' de 2.';
      if (estado.reservas[0].motivo !== '') return 'El campo motivo faltante no quedó como cadena vacía.';
      if (!estado.reservas[0].id) return 'No se generó id para la reserva que no lo traía.';
      if (estado.reservas[1].id !== 'viejo-2') return 'Se pisó el id que ya existía.';
      if (estado.version !== 1) return 'La versión no se actualizó a 1.';
      return null;
    }},

    { ca: 'CA-14', titulo: 'Un estado corrupto o vacío no rompe la aplicación (CB-10)', fn: function () {
      var basura = [null, undefined, 'texto', 42, {}, { reservas: 'no es lista' },
                    { reservas: [null, { puesto: 'P-99' }, { puesto: 'P-01', fecha: 'ayer' }] }];
      for (var i = 0; i < basura.length; i++) {
        var estado = R.normalizarEstado(basura[i]);
        if (!estado || !Array.isArray(estado.reservas)) return 'Con la entrada ' + JSON.stringify(basura[i]) + ' no devolvió un estado usable.';
        if (estado.reservas.length !== 0) return 'Con la entrada ' + JSON.stringify(basura[i]) + ' dejó pasar reservas inválidas.';
      }
      return null;
    }},

    { ca: 'CA-15', titulo: 'Todo rechazo explica qué regla se violó', fn: function () {
      var estado = conReservas([{ puesto: 'P-07', fecha: MANANA, franja: 14, codigo: '111111' }]);
      var rechazos = [
        R.validarReserva(estado, { puesto: 'P-07', fecha: MANANA, franja: 14, codigo: '222222' }, AHORA),
        R.validarReserva(estado, { puesto: 'P-01', fecha: MANANA, franja: 10, codigo: '123' }, AHORA),
        R.validarReserva(estado, { puesto: 'P-01', fecha: HOY, franja: 6, codigo: '111111' }, AHORA),
        R.validarReserva(estado, { puesto: 'P-01', fecha: '2026-10-30', franja: 10, codigo: '111111' }, AHORA),
        R.validarReserva(estado, { puesto: 'P-19', fecha: MANANA, franja: 10, codigo: '111111' }, AHORA),
        R.validarCancelacion(estado, { id: R.idDeReserva('P-07', MANANA, 14), codigo: '222222' }, AHORA)
      ];
      for (var i = 0; i < rechazos.length; i++) {
        var m = rechazos[i].error;
        if (!m || m.length < 20) return 'Hay un mensaje demasiado corto para explicar algo: "' + m + '"';
        if (m.indexOf('Regla ') === -1) return 'El mensaje no nombra la regla violada: "' + m + '"';
        if (!rechazos[i].codigoError) return 'Un rechazo llegó sin código de error.';
      }
      return null;
    }},

    { ca: 'CA-2', titulo: 'El dominio es de 20 puestos y 7 franjas de dos horas entre 6:00 y 20:00', fn: function () {
      if (R.PUESTOS.length !== 20) return 'Hay ' + R.PUESTOS.length + ' puestos, no 20.';
      if (R.PUESTOS[0] !== 'P-01' || R.PUESTOS[19] !== 'P-20') return 'Los puestos no van de P-01 a P-20.';
      if (R.FRANJAS.length !== 7) return 'Hay ' + R.FRANJAS.length + ' franjas, no 7.';
      if (R.FRANJAS[0] !== 6) return 'La primera franja no empieza a las 6:00.';
      if (R.FRANJAS[6] + 2 !== 20) return 'La última franja no termina a las 20:00.';
      return null;
    }},

    { ca: 'contrato', titulo: 'reglas.js expone las seis funciones del contrato del plan', fn: function () {
      var faltan = ['crearEstado', 'normalizarEstado', 'validarReserva', 'agregarReserva', 'validarCancelacion', 'cancelarReserva']
        .filter(function (n) { return typeof R[n] !== 'function'; });
      return faltan.length ? 'Faltan funciones del contrato: ' + faltan.join(', ') : null;
    }},

    { ca: 'contrato', titulo: 'Las funciones no modifican el estado que reciben', fn: function () {
      var estado = conReservas([{ puesto: 'P-01', fecha: MANANA, franja: 10, codigo: '111111' }]);
      var copia = JSON.stringify(estado);
      R.agregarReserva(estado, { puesto: 'P-02', fecha: MANANA, franja: 12, codigo: '111111' }, AHORA);
      R.cancelarReserva(estado, { id: R.idDeReserva('P-01', MANANA, 10), codigo: '111111' }, AHORA);
      return JSON.stringify(estado) === copia ? null : 'El estado original quedó modificado.';
    }}
  ];

  // ---------------------------------------------------------------- ejecutor

  function ejecutar() {
    var resultados = casos.map(function (c) {
      var detalle;
      try { detalle = c.fn(); }
      catch (err) { detalle = 'Excepción: ' + (err && err.message ? err.message : String(err)); }
      return { ca: c.ca, titulo: c.titulo, ok: !detalle, detalle: detalle || '' };
    });
    var pasan = resultados.filter(function (r) { return r.ok; }).length;
    return { total: resultados.length, pasan: pasan, fallan: resultados.length - pasan, resultados: resultados };
  }

  return { casos: casos, ejecutar: ejecutar, AHORA: AHORA };
});
