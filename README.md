# Ingeniería de Aplicaciones con IA

**Equipo:** Erick Albornoz · Frank Palma · Ana María Ruiz
Universidad Cooperativa de Colombia · Ingeniería de Sistemas

| Momento | Qué es | Estado |
|---|---|---|
| [**Momento 1**](momento_1/) — Trabajar con IA | Sistema de reservas del laboratorio, construido con la cadena `escribir-spec` → `escribir-plan` → `ejecutar-plan` | Entregado |
| Momento 2 — Construir con IA | Sistemas agénticos, tool calling, RAG | Pendiente |
| Momento 3 — Responder por lo construido | Seguridad y gobernanza | Pendiente |

## Momento 1, en corto

Abrir [`momento_1/producto/reservas.html`](momento_1/producto/reservas.html) con doble
clic: 20 puestos, franjas de dos horas, sin servidor, sin dependencias y sin internet.

Los criterios de aceptación se ejecutan:

```bash
cd momento_1
node producto/pruebas.js     # hoy: 22/22, ninguno en FALLA
```

El recorrido completo —qué se decidió, qué se descartó y por qué— está en
[`momento_1/README.md`](momento_1/README.md).
