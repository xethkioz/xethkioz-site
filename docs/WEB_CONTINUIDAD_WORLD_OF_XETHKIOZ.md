# WEB CONTINUIDAD — WORLD OF XETHKIOZ

Actualizado: 2026-09-15
Proyecto: XETHKIOZ / World of Xethkioz — WEB

## Regla de alcance
Este archivo continúa exclusivamente el trabajo de la WEB pública. El juego en Unity/Blender sirve como fuente de contenido y arte, pero no se desarrollan sistemas del juego desde este flujo salvo pedido explícito.

## Estado seguro actual
- Worktree: `E:\WEB XETHKIOZ\xethkioz-site-web-only`
- Rama activa: `wox-aaa-rebuild-v2`
- Último cambio visual funcional: `5f7cc6f — feat(home): polish AAA first visit and media placeholders`
- Hito anterior: `7329029 — feat(home): add AAA chapter flow and mobile territory polish`
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
Revisar el Preview Pass 07 completo en teléfono y escritorio. Si la composición visual queda aprobada, hacer un último release-candidate pass centrado sólo en regresiones, ES/EN y smoke visual antes de considerar producción.

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


## Checkpoint AAA Rebuild V2 — Pass 06 (2026-09-15)
- Commit visual: `5f7cc6f — feat(home): polish AAA first visit and media placeholders`.
- El banner de privacidad de primera visita adopta la gramática visual World/AAA en Home, sin alterar su función ni decisiones de consentimiento.
- En móvil, consentimiento usa 2 botones superiores + acción principal a ancho completo; conserva lectura cómoda y evita overflow.
- Se añadió `scripts/wox-first-visit-visual-check.mjs` + `npm run audit:wox-first-visit` para validar el estado real de primera visita.
- Todos los placeholders oficiales comparten ahora señalética `OFFICIAL MEDIA // PENDING`, rejilla y tratamiento visual consistente; siguen sin usar arte random.
- QA: build completo PASS; Home desktop/móvil PASS; primera visita desktop/móvil PASS; 0 overflow y 0 errores de consola.
- Producción continúa estable en `fc1df9c`; Pass 06 permanece sólo en Preview hasta aprobación visual explícita.

## Checkpoint AAA Rebuild V2 — Pass 07 (2026-09-15)
- Commit visual: `b7f0f30 — feat(home): harden responsive AAA world layouts`.
- Territorios móviles: región activa conserva ancho completo y las otras tres regiones pasan a una fila compacta de 3 tarjetas en pantallas ≥360 px; debajo de ese ancho se mantiene el fallback más amplio.
- La matriz QA de Home se amplió a 1440×1000, 1024×900, 768×900, 430×932 y 390×844.
- La primera visita/consentimiento se valida además explícitamente en 430×932, el ancho donde ocurrió la regresión visual anterior.
- ES→EN→ES validado sobre Preview real: botón muestra idioma destino, rutas `/`↔`/en`, `html lang` correcto y copy inglés real.
- Build completo PASS; todos los viewports PASS; 0 overflow y 0 errores de consola.
- Preview Pass 07 READY y validado remotamente: `xethkioz-site-ithlovwzb-xethkioz-site.vercel.app`; producción continúa en `fc1df9c`.

## Gate preproducción después de Pass 07
- Vercel Preview real: READY; smoke visual remoto PASS en 5 viewports y primera visita PASS en 3 viewports.
- Runtime Preview: 0 logs error/fatal en la ventana verificada.
- `npm run audit:production-ready`: PASS.
- `npm run audit:dependencies`: PASS; sin advisories high/critical de producción.
- `npm run verify` local se detiene únicamente en `audit:env` porque este worktree no contiene `.env`; las variables reales viven en hosting y el Preview con entorno real está READY.
- Git de código queda limpio salvo `artifacts/` no versionados.
- Gate siguiente: aprobación visual explícita del Preview; recién después considerar merge/promoción a producción.
## Checkpoint AAA Rebuild V2 — Pass 08 funcional (2026-09-15)
- Commit funcional: `786ff57 — fix: complete localized Wisp functional flow`.
- Se agregó la ruta real `/en/green-node`, su rewrite de Vercel y cabecera `noindex, nofollow, noarchive` equivalente a la ruta ES.
- Veyr/Wisp ahora normaliza rutas ES/EN y abre Green Node mediante `localizePath('/green-node')`, manteniendo estado Home y estado dentro de Green Node en ambos idiomas.
- Se añadió `scripts/wox-home-functional-check.mjs` + `npm run audit:wox-functional` para probar interacciones completas de Home en español e inglés.
- Funcionalidad validada: 4 territorios, 4 categorías Prisma-Atlas, 8 Formas, 14 personajes, chat abrir/cerrar, enlaces requeridos, Wisp y selector ES↔EN.
- Build completo local PASS; `production-ready-check` PASS; `wisp-entity-check` PASS; `git diff --check` PASS.
- QA visual local PASS en 1440×1000, 1024×900, 768×900, 430×932 y 390×844; 0 overflow y 0 errores de consola.
- Primera visita local PASS en 1440×1000, 430×932 y 390×844.
- Preview Vercel funcional READY: `xethkioz-site-aznc6pqfd-xethkioz-site.vercel.app`.
- Preview remoto autenticado PASS en los 5 viewports; 14 personajes, 8 Formas, 4 métricas Hero, 9 capítulos, 3 slots 3D, 0 imágenes random y Wisp activo.
- Preview remoto funcional ES/EN PASS: chat, selecciones, `/green-node`, `/en/green-node` y cambio `/`↔`/en` sin errores.
- Primera visita remota PASS en desktop, 430 px y 390 px; Runtime Preview: 0 logs error/fatal en la ventana verificada.
- Producción continúa en `fc1df9c`; no promover a `main` hasta aprobación visual explícita del Preview en el chat actual.

## Checkpoint AAA Rebuild V2 — Pass 09 visual fit (2026-09-15)
- Se corrigió el doble padding heredado en Territorios/Atlas móvil que comprimía el ancho útil de las tarjetas secundarias.
- DESFRALAR, XIOMALAR y ZODNIGHT muestran ahora el nombre completo en 390/430 px sin overflow ni recorte interno.
- Personajes móvil deja el carrusel horizontal recortado y pasa a una grilla 2 columnas con las 14 identidades visibles y seleccionables.
- Se corrigieron recortes internos de `ESCENARIOS 3D`, `GAMEPLAY REAL` en desktop y `DESFRALAR` en 1024 px.
- `wox-home-visual-check.mjs` ahora falla también ante overflow interno de títulos, aunque la página no tenga overflow horizontal global.
- QA local PASS: build completo, production-ready, Wisp entity, visual 1440/1024/768/430/390, primera visita y flujo funcional ES/EN.
- En los 5 viewports: `internalTextOverflow=[]`, 0 overflow horizontal y 0 errores de consola.
- Producción continúa protegida en `fc1df9c`; Pass 09 sigue sólo por Preview hasta validación remota y aprobación visual explícita.
### Cierre remoto Pass 09
- Commits publicados en `wox-aaa-rebuild-v2`: `15c335a — feat(home): finish AAA responsive text and cast polish` y `680fe7c — docs: checkpoint World AAA visual pass 09`.
- Preview Vercel READY: `xethkioz-site-3tm79uo3f-xethkioz-site.vercel.app` (`dpl_3WjjRuyGkumxXdDGMhw5cVXWDbbq`).
- QA visual remoto autenticado PASS en 1440×1000, 1024×900, 768×900, 430×932 y 390×844; `internalTextOverflow=[]`, 0 overflow global y 0 errores de navegador.
- QA funcional remoto ES/EN PASS: 4 territorios, 4 Atlas, 8 Formas, 14 personajes, chat, Wisp `/green-node` + `/en/green-node` y cambio de idioma.
- Primera visita remota PASS en desktop, 430 px y 390 px; 3 controles de consentimiento, 0 overflow y 0 errores.
- Runtime Preview: 0 logs `error`/`fatal`. Producción permanece en `fc1df9c`; gate siguiente sigue siendo aprobación visual explícita antes de `main`.

## Checkpoint AAA Rebuild V2 — Pass 10 anchor navigation (2026-09-15)
- Se confirmó que `Saltar al contenido principal` permanece fuera del viewport salvo foco de teclado; su aparición en screenshots completos/por elemento era un artefacto de captura, no una regresión visible.
- Se detectó una regresión real en navegación por anclas: cada capítulo aterrizaba parcialmente debajo del dock sticky (≈38 px desktop, ≈12 px móvil).
- `WorldOfXethkiozAAA.css` ajusta ahora `scroll-margin-top` a 146 px desktop/tablet y 118 px móvil.
- Se añadió `scripts/wox-anchor-navigation-check.mjs` + `npm run audit:wox-anchor-nav` para validar las 6 anclas en 1440, 768 y 390 px.
- Resultado: las 6 anclas dejan 12 px de aire en desktop/tablet y 10 px en móvil; 0 errores de navegador.
- Build completo PASS; visual 1440/1024/768/430/390 PASS; primera visita PASS; funcional ES/EN PASS; production-ready PASS; Wisp entity PASS; `git diff --check` PASS.
- Producción continúa en `fc1df9c`; Pass 10 permanece sólo en Preview hasta validación remota y aprobación visual explícita.

## Checkpoint AAA Rebuild V2 — Pass 10 remoto (2026-09-15)
- Commit validado: `40e4ab1 — fix(home): clear sticky nav on World anchors`.
- Preview Vercel READY: `xethkioz-site-mjcrjbokg-xethkioz-site.vercel.app` (`dpl_F265PCiiLgQEuYhVcLRDAmG7vm6M`).
- QA visual remoto PASS en 1440×1000, 1024×900, 768×900, 430×932 y 390×844; 0 overflow global, `overflowText=[]`, 14 personajes, 8 Formas, 3 slots 3D y 0 imágenes random en Mundo/Atlas/Personajes.
- QA funcional remoto ES/EN PASS: 4 territorios, 4 Atlas, 8 Formas, 14 personajes, chat, Wisp `/green-node` y `/en/green-node`, sin errores de navegador.
- Primera visita remota PASS en 1440, 430 y 390 px; 3 acciones de consentimiento, 0 overflow y 0 errores.
- Navegación por anclas remota PASS: 12 px de clearance en 1440/768 y 10 px en 390 para Historia, Mundo, Prisma-Atlas, Personajes, 3D y Desarrollo.
- Runtime Preview: 0 logs error/fatal. Build Vercel completado; sólo informa timings diagnósticos de plugins Vite/Rolldown, sin fallo.
- Vercel Toolbar: 0 threads sin resolver para `wox-aaa-rebuild-v2`.
- Gate técnico de la rama: cerrado. Producción sigue en `fc1df9c`; no promover a `main` hasta aprobación visual explícita del Preview en el chat actual.

## Checkpoint AAA Rebuild V2 — Pass 11 Veyr clearance (2026-09-15)
- Commit visual/QA: `d95c929 — fix(home): keep Veyr clear of chapter content`.
- Se detectó que Veyr/Wisp flotante podía cubrir texto o métricas al navegar capítulos en 390, 768 y 1024 px.
- El Hero conserva el tamaño cinematográfico original: 72 px en 390/430 y 96 px en 768/1024.
- Cuando el dock de capítulos está visible, Veyr pasa a 56 px y se posiciona en el borde superior derecho: `top:128px` móvil y `top:152px` tablet/laptop.
- En capítulos mantiene 18–20 px de clearance respecto del dock sticky y no intersecta texto visible.
- Se añadió `scripts/wox-wisp-clearance-check.mjs` + `npm run audit:wox-wisp-clearance`; prueba 6 capítulos × 4 viewports = 24 combinaciones.
- QA local PASS: clearance Veyr, visual 1440/1024/768/430/390, funcional ES/EN, primera visita, anclas, production-ready, Wisp entity y `git diff --check`.
- Preview Vercel READY: `xethkioz-site-atkmf67ze-xethkioz-site.vercel.app` (`dpl_CGhruwk28Uh7mnZNytmtpAxPW5E4`).
- QA remoto autenticado PASS: visual 5 viewports, funcional ES/EN, primera visita 1440/430/390 y anclas 1440/768/390.
- Clearance remoto Veyr PASS en 390/430/768/1024: Hero 72/96 px, capítulos 56 px, 18–20 px bajo dock y 0 solapamientos en las 24 combinaciones.
- Runtime Preview: 0 logs `error`/`fatal`; build Vercel completado sin fallos; 0 Vercel Toolbar threads sin resolver.
- Producción continúa en `fc1df9c`; no promover a `main` hasta aprobación visual explícita del Preview en el chat actual.

## Checkpoint AAA Rebuild V2 — Pass 12 edge + accesibilidad (2026-09-15)
- Commit funcional: `66262a1 — fix(home): harden edge viewports and keyboard focus`.
- Se amplió QA a 320, 360, 1366 y 1920 px además de la matriz estándar 390/430/768/1024/1440.
- Se corrigió `UNITY` recortado a 320 px y `DESFRALAR` recortado a 1920 px, sin degradar 390–1440.
- `RouteAccessibility` ya no fuerza foco a `main-content` en la primera carga; el primer Tab vuelve a ser `Saltar al contenido principal`.
- En navegación SPA posterior el foco sí vuelve a `main-content`; el skip-link entra visualmente a `top:16px` tras su transición.
- Se añadió `scripts/wox-edge-accessibility-check.mjs` + `npm run audit:wox-edge-accessibility`.
- Axe WCAG A/AA: 0 violaciones; 320/360/1366/1920: 0 overflow global, 0 texto interno recortado, 14 personajes y 8 Formas.
- QA visual remoto PASS en 320/360/390/430/768/1024/1366/1440/1920; 3 slots 3D, 0 imágenes random y 0 errores de navegador.
- QA funcional remoto ES/EN PASS: 4 territorios, 4 Atlas, 8 Formas, 14 personajes, chat, Wisp/Green Node y cambio de idioma.
- Primera visita remota PASS en 1440/430/390 con 3 acciones de consentimiento y 0 overflow.

## Producci�n AAA V2 publicada � 2026-09-15
- Aprobaci�n expl�cita de publicaci�n recibida en el chat actual.
- `main` avanz� por fast-forward desde `fc1df9c` hasta `7041512`; sin conflictos ni merge manual.
- Deployment Vercel production: `dpl_HMw8vmv2vzp7Fbjw5a54wcAsMhj7`, READY, con alias `xethkioz.com.ar` y `www.xethkioz.com.ar`.
- QA visual en producci�n PASS: 1440/1024/768/430/390; 14 personajes, 8 Formas, 3 slots 3D, 0 im�genes random, 0 overflow y 0 errores.
- QA edge en producci�n PASS: 320/360/1366/1920 sin overflow ni texto recortado; Axe WCAG A/AA con 0 violaciones.
- QA funcional producci�n ES/EN PASS: 4 territorios, 4 Atlas, 8 Formas, 14 personajes, chat, Wisp/Green Node y cambio de idioma.
- Primera visita producci�n PASS en 1440/430/390; navegaci�n por 6 anclas PASS; Veyr clearance PASS en 390/430/768/1024 con 0 intersecciones.
- El foco SPA a `/gaming` fue medido en producci�n y llega correctamente a `main-content`; el audit usa ahora espera sem�ntica en vez de timeout fijo para evitar falsos negativos por latencia.
- `artifacts/` permanece fuera de Git. Estado objetivo: producci�n AAA activa; `main` vuelve a ser la fuente can�nica.
