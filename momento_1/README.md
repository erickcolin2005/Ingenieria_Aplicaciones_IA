# Momento 1 — Sistema de reservas del laboratorio

**Curso:** Ingeniería de Aplicaciones con IA · Universidad Cooperativa de Colombia
**Equipo:** Erick Albornoz · Frank Palma · Ana María Ruiz
**Caso:** A — aplicación HTML sin librerías ni servidor

20 puestos, franjas de dos horas, de 6:00 a 20:00. Construido con la cadena
`escribir-spec` → `escribir-plan` → `ejecutar-plan`.

## Cómo correrlo

No hay nada que instalar. No hay servidor, no hay base de datos, no hace falta
internet.

**La aplicación:** doble clic en `producto/reservas.html`.

**Los criterios de aceptación:**

```bash
node producto/pruebas.js        # en terminal
```

o doble clic en `producto/pruebas.html` para verlos en el navegador. Debe decir
hoy **22/22**, y ninguno puede quedar en FALLA. Sube a 23 cuando se cierre T-10.

> `producto/reglas.js` tiene que estar en la misma carpeta que los dos HTML. Los tres
> archivos viajan juntos.

## Qué hay aquí

```
momento_1/
├── CLAUDE.md                          el archivo de contexto que gobierna el repositorio
├── .claude/settings.json              la política de permisos, aplicada
├── .env.example                       plantilla de credenciales (el producto no usa ninguna)
├── sync_skills.ps1                    copia skills/ -> .claude/skills/
│
├── docs/
│   ├── SPEC.md                        la especificación: 7 secciones, 17 criterios
│   ├── PLAN.md                        9 tareas con dueño, dependencias y criterio sí/no
│   ├── POLITICA_PERMISOS.md           qué puede hacer la herramienta y el peor escenario de cada cosa
│   ├── PRUEBA_NECESIDAD.md            los seis ejes: por qué este producto no lleva modelo
│   ├── DEMO.md                        guion de 6 minutos y plan B
│   └── decisiones/
│       ├── contexto_inicial.md        versión 1 del contexto, congelada
│       ├── contexto.md                qué cambió del contexto y por qué
│       ├── loop.md                    rastro de explorar / planear / ejecutar / verificar
│       ├── semana04.md                el reporte del reto
│       ├── pruebas_skills.md          protocolo de pruebas de la cadena
│       ├── pruebas_permisos.md        protocolo de pruebas de los permisos
│       └── revision_contexto_fresco.md
│
├── skills/                            fuente de verdad de los tres skills
│   ├── escribir-spec/SKILL.md
│   ├── escribir-plan/SKILL.md
│   └── ejecutar-plan/SKILL.md
│
└── producto/
    ├── reservas.html                  la aplicación
    ├── reglas.js                      todas las reglas, como funciones puras
    ├── pruebas.js                     los criterios de aceptación, ejecutables
    └── pruebas.html                   los mismos criterios en el navegador
```

## Dónde está cada cosa de la rúbrica

| Criterio | Archivo |
|---|---|
| Archivo de contexto | `CLAUDE.md` · evolución en `docs/decisiones/contexto.md` |
| Credenciales | `.gitignore` · `.env.example` · el producto no hace peticiones de red |
| Política de permisos | `docs/POLITICA_PERMISOS.md` · `.claude/settings.json` |
| Spec | `docs/SPEC.md` |
| Loop | `docs/decisiones/loop.md` |
| Plan derivado | `docs/PLAN.md` |
| Cadena de skills | `skills/` · pruebas en `docs/decisiones/pruebas_skills.md` |
| Producto | `producto/` |
| Prueba de necesidad | `docs/PRUEBA_NECESIDAD.md` |
| Guion de la demo | `docs/DEMO.md` |

## Lo que este producto no hace

Y por qué, en `docs/SPEC.md §3`: no hay login, no hay control de asistencia, no hay
rol de administrador, y **el estado es local a cada navegador**. Esta última es la
limitación real del producto y está declarada en la propia pantalla, no escondida.
