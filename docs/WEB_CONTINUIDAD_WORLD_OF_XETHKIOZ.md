# WEB CONTINUIDAD — WORLD OF XETHKIOZ

Actualizado: 2026-09-15
Proyecto: XETHKIOZ / World of Xethkioz — WEB

## Regla de alcance
Este archivo continúa exclusivamente el trabajo de la WEB pública. El juego en Unity/Blender sirve como fuente de contenido y arte, pero no se desarrollan sistemas del juego desde este flujo salvo pedido explícito.

## Estado seguro actual
- Worktree: `E:\WEB XETHKIOZ\xethkioz-site-web-only`
- Rama activa: `wox-aaa-rebuild-v2`
- Último cambio visual funcional: `7329029 — feat(home): add AAA chapter flow and mobile territory polish`
- Hito anterior: `573b6a8 — feat(home): polish AAA interactions and cinematic closure`
- Producción pública estable: `main` en rollback seguro `fc1df9c — revert(home): restore stable World layout after AAA regression`
- NO reemplazar producción hasta aprobación visual explícita del usuario.

## Objetivo visual bloqueado
La parte World of Xethkioz debe sentirse como el sitio oficial de un juego AAA: cinematográfico, oscuro, premium, interactivo y coherente con el banner principal.
No usar una grilla genérica de tarjetas. Cada capítulo debe sentirse como una pantalla/códice del universo.
No insertar imágenes random. Los espacios reservados se completarán sólo con renders/capturas/gameplay aprobados de Unity + Blender.

## Hero actual
- Conserva fondo animado oficial existente.
- Logo transparente World of Xethkioz integrado al escenario.
- Marco cinematográfico y señalética de Resonancia.
- Métricas funcionales: 04 Territorios / 32 Mapas / 08 Formas / 3D Unity + Blender.
- CTAs: Descubrir mundo / Chat / Prisma-Atlas.
- Navegación interna: Historia / Mundo / Prisma-Atlas / Personajes / 3D / Desarrollo.
- Mobile se diseña como composición propia, no como desktop comprimido.

## Secciones y comportamiento
- Historia / Fisura: composición editorial + timeline; en móvil las fechas se recorren horizontalmente.
- Viajero + Xethkioz: dos protagonistas, slots oficiales para renders finales.
- Territorios: Izrdralar / Desfralar / Xiomalar / Zodnight con identidad, color y motivos propios; selección cambia panel principal y ruta canónica.
- Prisma-Atlas: selector de categorías + ficha ampliada; Goblins / Mecas + Tecnoflora / Fauna / Raros + Bosses.
- Formas: las 8 Formas mantienen identidad propia y panel de selección.
- Personajes: roster de 14 identidades canónicas + ficha protagonista.
- Producción 3D: Veyr activo; Escenarios 3D y Gameplay real quedan reservados.
- Desarrollo: 32 mapas / nivel 120 / 8 Formas / Unity.
- Roadmap: Canon → Vertical Slice → Juego base → Expansión Saga I.
- Apoyo + cierre: CTA de apoyo y footer cinematográfico con estado de Saga I.

## Arte y assets
- Fondo Home: `/assets/bg-dragon-animated.mp4`
- Poster Home: `/assets/bg-dragon-poster.webp`
- Logo: `/assets/world-of-xethkioz/world-of-xethkioz-logo.svg` + `.webp`
- Veyr web: `/assets/world-of-xethkioz/veyr/veyr-wisp-poster.webp`
- Veyr es el único recurso 3D real visible actualmente.
- Mundo / Atlas / Personajes: 0 imágenes random; mantener placeholders hasta disponer de arte aprobado.

## Canon de nombres bloqueado para UI
Alxion — Taumaturgo Primigenio; Ivander — El Científico Cuántico; Andrealis — Anclaje de Resonancia; Valdros — Vinculadora de Bestias y Mascotas; Matrias — Arconte Táctico; Nikoras — Vanguardia de la Luz; Braxian — sin título; Milaviel — sin título; Mamporath — Titán de Choque; Ashley — Voz del Silencio; Fermín — Bastión de la Tierra; Isabella — Llama Indómita; Gael — Heredero del Viento; Elida — Guardiana de la Memoria.

Formas que NO deben renombrarse por reemplazos globales: Xethkioz, Killaruna, Mozaruk, Heller, Kahezer, Itzuke, Dvalin, Okuninust.

## Navegación que debe preservarse
Ecosistema XETHKIOZ: Juegos / ArgenCiencia / Mascotas / Nexus City / Creación Web / Noticias / EN-ES / Iniciar sesión.
EN muestra el sitio en inglés; ES vuelve al español. En móvil, `XETHKIOZ +` contiene los seis destinos del ecosistema y deja idioma/login accesibles.
Wisp/Veyr debe permanecer flotante y enlazar Green Node con ruta localizada.

## QA obligatorio antes de cada Preview/producción
Ejecutar desde el worktree:
`npm run build`
`WOX_PREVIEW_URL=<url> node scripts/wox-home-visual-check.mjs`
`WOX_PREVIEW_URL=<url> node scripts/wox-aaa-section-capture.mjs`

Criterios mínimos:
- Desktop 1440×1000 PASS.
- Móvil 390×844 PASS.
- Sin overflow horizontal.
- Sin errores de consola.
- 14 personajes y 8 Formas funcionales.
- 3 slots de Producción 3D, sólo 1 imagen real (Veyr).
- 6 placeholders oficiales y 0 imágenes random en Mundo/Atlas/Personajes.
- Wisp presente y con asset oficial.
- Navegación interna y ecosistema completos.
- Revisar visualmente las capturas, no confiar sólo en tests automáticos.

Capturas locales de comparación: `artifacts/wox-aaa-v2/` y `artifacts/wox-home-visual/`.
Copias destacadas del Hero: `E:\WEB XETHKIOZ\wox-aaa-v2-pass03-hero-desktop.png` y `E:\WEB XETHKIOZ\wox-aaa-v2-pass03-hero-mobile.png`.

## Incidente que NO debe repetirse
La primera implementación AAA se publicó con layouts de escritorio comprimidos en móvil y quedó visualmente rota. Se revirtió producción a `fc1df9c`.
Desde entonces el rediseño se rehace en `wox-aaa-rebuild-v2`, con mobile-first real, capturas por sección y aprobación visual previa a producción.

## Próxima acción recomendada
Revisar el Preview Pass 05 completo y hacer un último pase de terminación: densidad tipográfica, respiración entre capítulos, navegación móvil y consistencia de placeholders. Luego generar un release candidate Preview y sólo considerar producción con aprobación visual explícita.

## Regla de despliegue
Push de la rama Preview está permitido para generar Preview. No mergear a `main`, no apuntar el dominio real y no publicar producción sin aprobación visual explícita del usuario en el chat actual.


## Checkpoint AAA Rebuild V2 — Pass 05 (2026-09-15)
- Commit visual: `7329029 — feat(home): add AAA chapter flow and mobile territory polish`.
- Los 9 capítulos principales ahora llevan identidad numérica discreta (`01` a `09`) y señalética `CHAPTER // WORLD OF XETHKIOZ` en desktop.
- Territorios, Prisma-Atlas, Formas y Personajes re-montan su consola seleccionada con transición corta al cambiar de opción; reduced-motion desactiva la animación.
- QA suma contrato de 9 paneles/capítulos para evitar regresiones estructurales.
- Mobile Territorios dejó la fila de 3 mini tarjetas comprimidas: ahora usa 2 columnas legibles y el territorio activo mantiene ancho completo.
- Se corrigió el tamaño del nombre activo y los secundarios para evitar cortes en Izrdralar / Desfralar / Xiomalar / Zodnight.
- Build completo PASS; QA local desktop 1440×1000 PASS y móvil 390×844 PASS; 0 overflow y 0 errores de consola.
- Producción sigue en `fc1df9c`; este Pass continúa sólo en Preview hasta aprobación visual.
