# RELOJ MINERO SAN JUAN — CONTEXTO COMPLETO PARA CLAUDE CODE
**Cuenta:** @sanjuanminero · **Versión actual:** v11 · **Última actualización del contexto:** agosto 2026
**Objetivo de esta sesión de Code:** automatizar (a) la publicación del sitio y (b) la generación de contenido para Instagram.

> Este documento resume TODO lo trabajado en las sesiones previas (concepto, datos, diseño, generador de Instagram, publicación). Pegalo como `CONTEXTO.md` o `CLAUDE.md` en la raíz del repo para que Claude Code tenga el panorama completo desde el primer prompt.

---

## 0. QUÉ QUIERO CONSTRUIR AHORA (META DE AUTOMATIZACIÓN)

1. **Publicación automática del sitio**: el `index.html` (el Reloj Minero) vive en un repo de GitHub y se publica solo vía GitHub Pages. Idealmente con un GitHub Action que valide el HTML/JS en cada push.
2. **Generación automática de contenido de Instagram**: un pipeline que tome los datos de los 27 proyectos y genere los posts (1080×1080) y stories (1080×1920) como PNG, listos para subir, sin tener que pedirlos uno por uno.
3. **Fuente de datos única**: hoy los datos viven hardcodeados en el array `DATA` del HTML. Quiero evaluar centralizarlos en un solo archivo (JSON o Google Sheet CSV) que alimente tanto el sitio como el generador de IG.

Decisiones de arquitectura a tomar con Code: ¿datos en JSON local versionado en git, o Google Sheet publicado como CSV? El HTML ya tiene código preparado para leer un `SHEET_CSV_URL` (integración latente, no activada).

---

## 1. PROPÓSITO Y AUDIENCIA

El **Reloj Minero San Juan** es una herramienta interactiva de divulgación que visualiza el ciclo de vida completo de los proyectos mineros metalíferos de San Juan, Argentina, usando una metáfora de reloj de 24 horas.

- **Audiencia:** público general, comunidad minera, medios.
- **Objetivo:** comunicar de forma visual y accesible en qué etapa está cada proyecto.
- **Canal:** Web (HTML estático, mobile-first) + Instagram (@sanjuanminero).
- **Es un único archivo HTML estático**, sin dependencias salvo Google Fonts.

---

## 2. METÁFORA DEL RELOJ (MARCO CONCEPTUAL CENTRAL)

```
00:00 = Inicio de exploración (prospecto)
12:00 = Primera producción comercial
24:00 = Cierre definitivo de la mina
```

### Regla 12+12
| Segmento | Período | Contenido |
|---|---|---|
| 00:00 → 12:00 | Pre-producción | Prospecto → Exploración → Expl. avanzada → Pre-producción |
| 12:00 → 24:00 | Post-producción | Producción → Cierre |

### Reglas de posicionamiento de horas (IMPORTANTE — no romper)
- **Siempre intervalos de cuarto de hora** (12:15, 12:30, 12:45 — nunca 12:06).
- La posición combina modelado matemático del ciclo + ponderación cualitativa de hitos (aprobación EIA/DIA, RIGI, FS completa, inicio construcción, FID).
- El "reloj congelado" (`frozen:true`) aplica solo a proyectos `latente` y activa el badge ⏸.

---

## 3. ETAPAS Y COLORES (no cambiar sin pedir)

| ID interno | Label | HEX etapa | LED HEX |
|---|---|---|---|
| `cierre` | Cierre | `#C0392B` | `#FF5040` |
| `produccion` | Producción | `#1A7A3A` | `#39E05A` |
| `preproduccion` | Pre-producción | `#1A50A0` | `#4A8FFF` |
| `exploracion_avanzada` | Exploración avanzada | `#7A4A1A` | `#FFAA00` |
| `exploracion` | Exploración | `#5A2D6E` | `#D070FF` |
| `prospecto` | Prospecto | `#607090` | `#5ACFFF` |
| `latente` | Latente / Congelado | `#404858` | `#7090B0` |

Orden de render: `cierre → produccion → preproduccion → exploracion_avanzada → exploracion → prospecto → latente`.

---

## 4. DATOS DE PROYECTOS

> **Fuente única de verdad: `data/proyectos.json`.** El `index.html` y el `kiosk.html` lo consumen por `fetch`; ya no hay array `DATA` hardcodeado. El JSON tiene cuatro bloques: `meta`, `proyectos[]`, `logos{}`, `gantt[]` y `predicciones[]`. Validar siempre con `npm run validate` (o `node scripts/validate.js`) antes de pushear.

**Estado v11 — 24 proyectos, datos verificados al 30/08/2026.**

### En producción
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| Hualilán | Challenger Gold / Golden Mining | Au/Ag/Zn | Ullum | 12:00 |
| Veladero | Barrick / Shandong Gold (50/50) | Au/Ag | Iglesia | 18:45 |
| Casposo | Austral Gold (Grupo Elsztain) | Au/Ag | Calingasta | 21:15 |
| Gualcamayo | Minas Argentinas (AISA) | Au/Ag | Jáchal | 21:30 |

### Pre-producción
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| El Pachón | Glencore | Cu/Mo | Calingasta | 08:00 |
| Gualcamayo DCP | Minas Argentinas (AISA) | Au | Jáchal | 09:00 |
| Los Azules | McEwen Copper | Cu | Calingasta | 10:30 |
| Vicuña / Josemaría | Vicuña Corp (Lundin Mining / BHP 50-50) | Cu/Au/Ag | Iglesia | 10:45 |

### Exploración avanzada
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| Taguas | Orvana Minerals | Au/Ag | Iglesia | 05:30 |
| Del Carmen | Shandong Gold | Au/Ag | Iglesia | 05:30 |
| La Coipita | Teck Resources / AbraSilver | Cu/Mo | Calingasta | 06:15 |
| Chita Valley | Minsud Resources / South32 | Cu/Mo/Au | Iglesia | 06:45 |
| Altar | Aldebaran (80%) / Sibanye-Stillwater (20%) | Cu/Au/Mo | Calingasta | 07:45 |

### Exploración
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| Zorro | Sable Resources | Cu/Au | Iglesia | 02:45 |
| TMT | Vantage Metals (ex Belararox) | Cu/Au | Iglesia | 03:00 |
| Vanesa I y II | Fortescue Argentina | Cu/Mo | Calingasta | 03:30 |
| El Fierro | Sable Resources / Moxico Resources | Au/Ag | Iglesia | 03:45 |
| Don Julio | Sable Resources / South32 | Cu/Au/Mo | Iglesia | 04:00 |
| Lunahuasi | NGEx Minerals / Grupo Lundin | Cu/Au/Ag | Iglesia | 04:30 |
| Piuquenes | Andina Copper (ex Pampa Metals) | Cu/Au | Calingasta | 04:45 |

### Prospecto
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| La Ortiga | IPEEM / a licitar | Au/Ag | Iglesia | 02:00 |
| Jagüelito | Shandong Gold | Au/Ag | Iglesia | 02:30 |
| Rincones de Araya | IPEEM (licitación 2026) | Cu/Au | Iglesia | 03:00 |

### Latente / Congelado
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| Lama (Pascua-Lama ARG) | Barrick Mining | Au/Ag/Cu | Iglesia | 07:00 ⏸ |

> **Correcciones históricas ya aplicadas (no revertir):** Veladero en 18:45 (20 años de producción); Hualilán en depto **Ullum** (no Jáchal); Gualcamayo es `produccion` y el DCP es proyecto separado en `preproduccion`; Río Cenicero lo opera Minera Peregrine Argentina S.A.U. (subsidiaria local de Aldebaran, mismo grupo que Altar).

> **Proyectos descartados del dataset (verificado ago-2026, no volver a agregarlos sin chequear):**
> - **San Jorge** (Cu/Mo) NO está en Calingasta: es *PSJ Cobre Mendocino*, en Las Heras, **Mendoza**. Entró al RIGI en may-2026 por US$891M. El esquema bi-provincial con San Juan fue abandonado en 2025.
> - **Chinchillas** (Ag/Pb/Zn) es una mina de **Jujuy** (SSR Mining / Puna Operations), no de Iglesia.
> - **Puyú Mahuida** y **Río Cenicero** no tienen novedades públicas verificables; quedan fuera hasta tener datos citables.

### Estructura de cada objeto de `proyectos[]`
`nombre, etapa, hora, empresa, metal, depto, frozen, desc, recursos, historial[], nota_hist, factores[]`
- `historial[]`: `{n, a (período), dur (años), c (color), hi (hora inicio), hf (hora fin), hs (horas en el reloj)}`
- `factores[]`: `{l (label), v (valor 0-100)}` — 5 factores que determinan la posición en el reloj, se dibujan como barras de %.
- `logos{}` mapea nombre de proyecto → URL de logo (clearbit). **Cuidado al editar con scripts: en sesiones previas se borró accidentalmente `LOGOS`. Validar siempre.**

---

## 5. SISTEMA DE DISEÑO

### Tipografías (Google Fonts)
| Uso | Familia |
|---|---|
| Títulos / logotipo | `Bebas Neue` |
| Datos / monoespaciado | `Share Tech Mono` |
| Cuerpo / UI | `DM Sans` |

### Paleta (variables CSS)
```css
--bg:#F2EFE9; --bg2:#FAFAF7; --bg3:#EDEAE3; --bg4:#E4E0D8;
--border:#D8D2C8; --border2:#C4BDB0; --border3:#A89E90;
--amber:#8A5200; --amber-mid:#B86800;
--led-bg:#1C1A16;
--text1:#1A1410; --text2:#4A3C2C; --text3:#7A6A58; --text4:#A89878;
```

### Display LED 7-segmentos
Componente JS que renderiza la hora como dígitos segmentados (relojes digitales clásicos). Aparece en cada tarjeta y en el modal. Dos tamaños: `'sm'` (tarjetas) y `'lg'` (modal). Color según etapa. Fondo `#1C1A16` con sombra interior. Funciones clave: `buildDigit()`, `buildColon()`, `buildLED()`, tabla `SEG7`.

### ELEMENTOS RECHAZADOS (nunca usar)
- ❌ Fuente **Playfair Display**
- ❌ Divisiones / badges **AM/PM** (chocan con etiquetas de metal Au/Ag/Cu)
- ❌ Reloj **analógico** con agujas (superado por los displays LED)
- ❌ Cualquier referencia a **DAMS SRL** en los outputs
- ❌ Layouts **densos con texto chico que obligue a hacer zoom**

---

## 6. ESTRUCTURA DEL SITIO (TABS)

```
⬡ PROYECTOS    → Grid de tarjetas filtrable por etapa (LED + nombre + empresa + depto)
◷ GRAN RELOJ   → Canvas infográfico: dos mitades (00→12 / 12→24), arcos por etapa + badges de proyectos
◈ COMPARACIÓN  → Gantt horizontal de ciclos de vida (1993–2042), barras sólidas=hechos / punteadas=proyección
◎ PREDICCIONES → Cards con hitos proyectados 2026–2035 por proyecto
```

Funciones JS principales: `showTab()`, `render()` (grid), `openModal()`, `setFilter()`, `drawGranRelojes()`/`_drawInfographic()` (canvas), `_buildGantt()`, `_buildPred()`.

**Punto abierto declarado:** mejorar el impacto visual del Gran Reloj (canvas) — es el principal pendiente de diseño.

---

## 7. GENERADOR DE CONTENIDO INSTAGRAM (herramienta separada)

Archivos HTML separados que renderizan posts en `<canvas>` y los descargan como PNG (sin screenshots). Mismo sistema de diseño que el sitio.

### Formatos
- **Posts cuadrados:** 1080×1080px
- **Stories:** 1080×1920px (9:16)
- Cada canvas tiene botón `↓ PNG` que descarga el archivo individual.
- Constantes de diseño replicadas en el generador: `BG='#F2EFE9'`, `AM2='#B86800'`, `BB="'Bebas Neue'..."`, `MN="'Share Tech Mono'..."`, objeto `ST{}` con etapas+LED+rango horario.

### "MODO DISEÑO INTENCIONAL" (default obligatorio para posts)
Tras feedback explícito ("posts que no necesiten zoom"), se definió el estándar:
- **Un solo héroe visual dominante** por post (ej: el número "6" a 520px).
- **Contraste extremo de tamaños** (520px vs 22px, sin tamaños intermedios que diluyan).
- **Espacio negativo activo** (el vacío dirige la mirada, no se rellena por reflejo).
- **Jerarquía de 3 niveles, no 5:** VEO (héroe) → LEO (título/dato) → DETALLO (datos chicos).
- **Texto grande:** títulos 148–200px, stats 90–100px, cuerpo nunca < 22px.
- **Máximo 3 stats por card, una idea por post.**

### Selección del héroe por proyecto (criterio estratégico, un dato icónico)
Ej. ya producidos: Hualilán → "6" (años hasta producción); Lunahuasi → "2023" (año descubrimiento); Piuquenes → "801m" (intercepto); El Fierro → "2.582 g/t AgEq" (ley); Don Julio → "SOUTH32" (respaldo); Vanesa I y II → "2" (dos pórfidos); TMT → "1.300m" (profundidad); Lama → reloj congelado / impacto emocional.

### Referencias de calidad de diseño (vocabulario compartido)
Bloomberg Graphics · NYT Magazine · Koto Studio · Collins.

### Series ya producidas
- Serie concepto (5 posts): qué es el reloj / las dos mitades / las 6 etapas / el mapa / el próximo relevo.
- 10 posts individuales por proyecto.
- Serie comparación (6 posts) desde la data del Gantt.
- 6 posts de proyectos en exploración (modo intencional).
- Versión stories de la serie concepto.

**Pendiente de contenido:** seguir produciendo posts para las etapas restantes más allá de exploración.

---

## 8. PUBLICACIÓN (estado actual y meta)

### Cómo se publica hoy (manual)
GitHub Pages, gratis:
1. Repo público en GitHub.
2. Subir el archivo como `index.html`.
3. Settings → Pages → Source: Deploy from branch → `main` → `/ (root)`.
4. URL: `https://USUARIO.github.io/REPO`.
- Sitio de referencia mencionado: `https://sanjuanminero.github.io/reloj-minero/`

### Integración Google Sheets (latente, no activada)
El HTML tiene código preparado para leer `const SHEET_CSV_URL=''`. Columnas esperadas del Sheet:
`nombre, empresa, metal, hora, etapa, depto, inversion, descripcion, f1_nombre..f6_color`.
Al publicar el Sheet como CSV y pegar la URL, el sitio se actualiza solo al recargar. **Decisión pendiente:** activar esto vs. mantener datos en JSON versionado.

### Meta de automatización (lo nuevo)
- GitHub Action que en cada push valide el JS (`node --check`) y publique.
- Pipeline de generación de PNGs de Instagram (evaluar: Puppeteer/Playwright headless para rasterizar los canvas a PNG automáticamente, o un script Node con `canvas`/`node-canvas`).
- Fuente de datos única que alimente sitio + generador.

---

## 9. FUENTES Y GLOSARIO

- **Estándares:** NI 43-101, JORC. Reportes corporativos, resoluciones oficiales y prensa especializada verificados hasta el 30/08/2026.
- **RIGI:** Régimen de Incentivo a las Grandes Inversiones (Argentina).
- **DCP:** Deep Carbonates Project (Gualcamayo). **POX:** oxidación por presión.
- **FID:** Final Investment Decision. **EIA/DIA:** Evaluación / Declaración de Impacto Ambiental.
- **Toll milling:** procesamiento en planta de terceros (Hualilán → Casposo).
- **PEA/PFS/FS:** Preliminary Economic Assessment / Pre-Feasibility / Feasibility Study.

---

## 10. APRENDIZAJES TÉCNICOS (para no repetir errores)

1. **Validar siempre el JS con `node --check`** tras editar el HTML (extraer el bloque `<script>` a un `.js` temporal y chequear).
2. **No editar el HTML con manipulación de strings de Python a ciegas:** en el pasado borró el objeto `LOGOS` y dejó caracteres sin escapar dentro de strings JS. Preferir `str_replace` quirúrgico y re-validar.
3. **Fuentes en canvas:** esperar `document.fonts.ready` antes de dibujar, con fallback `setTimeout`, o las fuentes (Bebas Neue / Share Tech Mono) no renderizan en el PNG.
4. **Archivo único, sin build:** el sitio no usa bundler. Mantenerlo así salvo decisión explícita.
5. **Idioma:** todo el contenido de cara al público en **español rioplatense** (voseo).

---

## 11. ARCHIVOS DE REFERENCIA

- `index.html` — sitio principal · `kiosk.html` — modo kiosko.
- `data/proyectos.json` — **fuente única de verdad de los datos** (la consumen el sitio, el kiosko y los generadores de IG).
- `scripts/validate.js` — validación de sintaxis JS + forma del JSON (`npm run validate`).
- `INSTRUCCIONES_RELOJ_MINERO.md` — instrucciones de proyecto (lista extendida de proyectos).
- Generadores IG: `reloj-minero-ig-v2.html` (posts), `reloj-minero-ig-stories.html` (stories), `reloj-minero-ig-claros.html` (modo intencional).
- Cuenta: **@sanjuanminero**.

---

## 12. CHANGELOG v10 → v11 (agosto 2026)

Actualización de datos a partir del relevamiento de noticias de marzo–agosto 2026.

### Horas movidas
| Proyecto | v10 | v11 | Motivo |
|---|---|---|---|
| Vicuña / Josemaría | 09:30 | **10:45** | DIA actualizada (mar), RIGI PEELP US$9.737M (jun–jul), ENReGE habilita la línea de 500 kV (jul), 1,1 Mt de movimiento de suelos en Q2 |
| Gualcamayo DCP | 08:30 | **09:00** | RIGI oficializado (Res. 6/2026) y obras de infraestructura por US$15M iniciadas en ago-2026 |
| Altar | 07:30 | **07:45** | Bought deal C$40M, campaña con 6 equipos, MRE prevista Q3 2026 (PFS corrida a 2027) |
| Chita Valley | 06:30 | **06:45** | Nuevo recurso feb-2026 + programa de 10.500 m financiado por South32 |
| La Coipita | 06:00 | **06:15** | 747,5 m a 0,69% Cu, descubrimiento Yaretas Sur, Teck excedió su earn-in |
| Piuquenes | 04:30 | **04:45** | Financiamiento US$27,5M + tercer centro mineralizado (Piuquenes Norte, jul-2026) |
| Lunahuasi | 04:00 | **04:30** | Fase 4 completa (27.318 m) con leyes excepcionales + permiso de galería |
| El Fierro | 03:30 | **03:45** | Extensión del pórfido Pyros financiada por Moxico Resources |
| Hualilán | 12:15 | **12:00** | Primera colada jun-2026 **pero** fin del toll milling en ago-2026: el reloj queda detenido en las 12:00 hasta que arranque la planta propia de Ullum (2029) |

Sin cambio de hora (sólo texto): Gualcamayo 21:30, Veladero 18:45, Casposo 21:15, Los Azules 10:30, El Pachón 08:00, Taguas 05:30, Del Carmen 05:30, Don Julio 04:00, Vanesa 03:30, TMT 03:00, Rincones de Araya 03:00, Jagüelito 02:30, La Ortiga 02:00, Lama 07:00 ⏸.

### Alta nueva
- **Zorro** (Sable Resources, Iglesia, Cu/Au) — `exploracion` **02:45**. ~8.460 ha, anomalía magnética de 7 × 4 km, perforación inaugural iniciada el 5-ago-2026.

### Correcciones de ficha
- **La Coipita**: departamento Iglesia → **Calingasta**.
- **El Pachón**: se eliminó "FS presentada" — la factibilidad NO está completa; el RIGI (US$11.600M) sigue en evaluación y Glencore lo ubica tercero en su cola argentina (Alumbrera → Agua Rica → El Pachón).
- **Altar**: empresa → "Aldebaran (80%) / Sibanye-Stillwater (20%)". El earn-in de Sibanye ya se completó; la opción viva es la de Nuton (Rio Tinto) por US$250M.
- **TMT**: empresa → "Vantage Metals (ex Belararox)" (cambio de nombre y ticker ASX: VAN, jul-2026).
- **El Fierro**: empresa → "Sable Resources / Moxico Resources" (Moxico financió la campaña, no South32).
- **Piuquenes**: empresa → "Andina Copper (ex Pampa Metals)".
- **Vicuña / Josemaría**: empresa → "Vicuña Corp (Lundin Mining / BHP 50-50)".
- **Rincones de Araya**: empresa → "IPEEM (licitación 2026)" — volvió a concurso público; única oferta de Cía. Minera Aguilar San Juan, sin adjudicar al 30/08/2026.

### Otros cambios
- `meta.version` → v11, `meta.actualizado` → 2026-08. El `index.html` ahora **lee la versión y la fecha desde `meta`** (barra de estado y footer), en vez de tenerlas hardcodeadas.
- Gantt actualizado: Hualilán (pausa 2026–2029 + planta propia), Los Azules (FID mediados 2027), Vicuña (RIGI + 500 kV + construcción 2027), Casposo (reactivación hasta 2032), Veladero (RIGI US$380M).
- Predicciones reescritas para Hualilán, Gualcamayo → DCP, Veladero, Los Azules, Vicuña y Lama. **Nueva card de Altar.**

### Pendiente de verificar (no se tocó por falta de fuente concluyente)
- Departamento de **Rincones de Araya**: la licitación del IPEEM la ubica en Calingasta; el dataset dice Iglesia.
- **Adjudicación de la licitación IPEEM 2026** (9 áreas): sin resolver al 30/08/2026.
- **Concesión de agua de Los Azules**: sin acto administrativo publicado.
