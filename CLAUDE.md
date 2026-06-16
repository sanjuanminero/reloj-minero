# RELOJ MINERO SAN JUAN — CONTEXTO COMPLETO PARA CLAUDE CODE
**Cuenta:** @sanjuanminero · **Versión actual:** v10 · **Última actualización del contexto:** junio 2026
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

> **Nota crítica:** hay una pequeña divergencia entre el array `DATA` del HTML v10 (27 proyectos cargados) y el documento de instrucciones (que lista algunos más, como Río Cenicero, Chinchillas, San Jorge, Puyú Mahuida, La Ortiga, Los Sapitos). El HTML v10 es la **fuente de verdad operativa**. Al centralizar datos, conviene reconciliar ambas listas.

### En producción (HTML v10)
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| Gualcamayo | Minas Argentinas (AISA) | Au/Ag | Jáchal | 21:30 |
| Veladero | Barrick / Shandong Gold (50/50) | Au/Ag | Iglesia | 18:45 |
| Hualilán | Challenger Gold / Golden Mining | Au/Ag/Zn | Ullum | 12:15 |
| Casposo | Austral Gold (Grupo Elsztain) | Au/Ag | Calingasta | 21:15 |

### Pre-producción
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| Los Azules | McEwen Copper | Cu | Calingasta | 10:30 |
| Vicuña / Josemaría | Lundin Mining / BHP / NGEx | Cu/Au/Ag | Iglesia | 09:30 |
| Gualcamayo DCP | Minas Argentinas (AISA) | Au | Jáchal | 08:30 |
| El Pachón | Glencore | Cu/Mo | Calingasta | 08:00 |

### Exploración avanzada
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| Altar | Aldebaran / Sibanye-Stillwater | Cu/Au/Mo | Calingasta | 07:30 |
| Chita Valley | Minsud Resources / South32 | Cu/Mo/Au | Iglesia | 06:30 |
| La Coipita | Teck Resources / AbraSilver | Cu/Mo | Iglesia | 06:00 |
| Taguas | Orvana Minerals | Au/Ag | Iglesia | 05:30 |
| Del Carmen | Shandong Gold | Au/Ag | Iglesia | 05:30 |

### Exploración
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| Piuquenes | Andina Copper | Cu/Au | Calingasta | 04:30 |
| Lunahuasi | NGEx Minerals / Grupo Lundin | Cu/Au/Ag | Iglesia | 04:00 |
| Don Julio | Sable Resources / South32 | Cu/Au/Mo | Iglesia | 04:00 |
| El Fierro | Sable Resources | Au/Ag | Iglesia | 03:30 |
| Vanesa I y II | Fortescue Argentina | Cu/Mo | Calingasta | 03:30 |
| TMT | Belararox | Cu/Au | Iglesia | 03:00 |

### Prospecto
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| Rincones de Araya | Fortescue / IPEEM | Cu/Au | Iglesia | 03:00 |
| Jagüelito | Shandong Gold | Au/Ag | Iglesia | 02:30 |
| La Ortiga | IPEEM / a licitar | Au/Ag | Iglesia | 02:00 |

### Latente / Congelado
| Proyecto | Empresa | Metal | Depto | Hora |
|---|---|---|---|---|
| Lama (Pascua-Lama ARG) | Barrick Mining | Au/Ag/Cu | Iglesia | 07:00 ⏸ |

> **Correcciones históricas ya aplicadas (no revertir):** Veladero en 18:45 (20 años producción); Hualilán en depto **Ullum** (no Jáchal); Gualcamayo es `produccion` y el DCP es proyecto separado en `preproduccion`; Río Cenicero lo opera Minera Peregrine Argentina S.A.U. (subsidiaria local de Aldebaran, mismo grupo que Altar).

### Estructura de cada objeto `DATA` (campos del HTML)
`nombre, etapa, hora, empresa, metal, depto, frozen, desc, recursos, historial[], nota_hist, factores[]`
- `historial[]`: `{n, a (período), dur (años), c (color), hi (hora inicio), hf (hora fin), hs (horas en el reloj)}`
- `factores[]`: `{l (label), v (valor 0-100)}` — 5 factores que determinan la posición en el reloj, se dibujan como barras de %.
- También existe el objeto `LOGOS{}` que mapea nombre de proyecto → URL de logo (clearbit). **Cuidado al editar con scripts de Python: en sesiones previas se borró accidentalmente el objeto `LOGOS`. Validar siempre con `node --check`.**

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

- **Estándares:** NI 43-101, JORC. Reportes corporativos verificados hasta marzo 2026.
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

- `reloj-minero-v10.html` — sitio principal (fuente de verdad de datos hoy).
- `INSTRUCCIONES_RELOJ_MINERO.md` — instrucciones de proyecto (lista extendida de proyectos).
- Generadores IG: `reloj-minero-ig-v2.html` (posts), `reloj-minero-ig-stories.html` (stories), `reloj-minero-ig-claros.html` (modo intencional).
- Cuenta: **@sanjuanminero**.
