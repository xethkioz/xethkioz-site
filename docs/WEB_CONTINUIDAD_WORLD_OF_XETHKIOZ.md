# WEB CONTINUIDAD â€” WORLD OF XETHKIOZ

Actualizado: 2026-09-15
Proyecto: XETHKIOZ / World of Xethkioz â€” WEB

## Regla de alcance
Este archivo continÃºa exclusivamente el trabajo de la WEB pÃºblica. El juego en Unity/Blender sirve como fuente de contenido y arte, pero no se desarrollan sistemas del juego desde este flujo salvo pedido explÃ­cito.

## Estado seguro actual
- Worktree: `E:\WEB XETHKIOZ\xethkioz-site-web-only`
- Rama activa: `wox-aaa-rebuild-v2`
- Ãšltimo cambio visual funcional: `5f7cc6f â€” feat(home): polish AAA first visit and media placeholders`
- Hito anterior: `7329029 â€” feat(home): add AAA chapter flow and mobile territory polish`
- ProducciÃ³n pÃºblica estable: `main` en rollback seguro `fc1df9c â€” revert(home): restore stable World layout after AAA regression`
- NO reemplazar producciÃ³n hasta aprobaciÃ³n visual explÃ­cita del usuario.

## Objetivo visual bloqueado
La parte World of Xethkioz debe sentirse como el sitio oficial de un juego AAA: cinematogrÃ¡fico, oscuro, premium, interactivo y coherente con el banner principal.
No usar una grilla genÃ©rica de tarjetas. Cada capÃ­tulo debe sentirse como una pantalla/cÃ³dice del universo.
No insertar imÃ¡genes random. Los espacios reservados se completarÃ¡n sÃ³lo con renders/capturas/gameplay aprobados de Unity + Blender.

## Hero actual
- Conserva fondo animado oficial existente.
- Logo transparente World of Xethkioz integrado al escenario.
- Marco cinematogrÃ¡fico y seÃ±alÃ©tica de Resonancia.
- MÃ©tricas funcionales: 04 Territorios / 32 Mapas / 08 Formas / 3D Unity + Blender.
- CTAs: Descubrir mundo / Chat / Prisma-Atlas.
- NavegaciÃ³n interna: Historia / Mundo / Prisma-Atlas / Personajes / 3D / Desarrollo.
- Mobile se diseÃ±a como composiciÃ³n propia, no como desktop comprimido.

## Secciones y comportamiento
- Historia / Fisura: composiciÃ³n editorial + timeline; en mÃ³vil las fechas se recorren horizontalmente.
- Viajero + Xethkioz: dos protagonistas, slots oficiales para renders finales.
- Territorios: Izrdralar / Desfralar / Xiomalar / Zodnight con identidad, color y motivos propios; selecciÃ³n cambia panel principal y ruta canÃ³nica.
- Prisma-Atlas: selector de categorÃ­as + ficha ampliada; Goblins / Mecas + Tecnoflora / Fauna / Raros + Bosses.
- Formas: las 8 Formas mantienen identidad propia y panel de selecciÃ³n.
- Personajes: roster de 14 identidades canÃ³nicas + ficha protagonista.
- ProducciÃ³n 3D: Veyr activo; Escenarios 3D y Gameplay real quedan reservados.
- Desarrollo: 32 mapas / nivel 120 / 8 Formas / Unity.
- Roadmap: Canon â†’ Vertical Slice â†’ Juego base â†’ ExpansiÃ³n Saga I.
- Apoyo + cierre: CTA de apoyo y footer cinematogrÃ¡fico con estado de Saga I.

## Arte y assets
- Fondo Home: `/assets/bg-dragon-animated.mp4`
- Poster Home: `/assets/bg-dragon-poster.webp`
- Logo: `/assets/world-of-xethkioz/world-of-xethkioz-logo.svg` + `.webp`
- Veyr web: `/assets/world-of-xethkioz/veyr/veyr-wisp-poster.webp`
- Veyr es el Ãºnico recurso 3D real visible actualmente.
- Mundo / Atlas / Personajes: 0 imÃ¡genes random; mantener placeholders hasta disponer de arte aprobado.

## Canon de nombres bloqueado para UI
Alxion â€” Taumaturgo Primigenio; Ivander â€” El CientÃ­fico CuÃ¡ntico; Andrealis â€” Anclaje de Resonancia; Valdros â€” Vinculadora de Bestias y Mascotas; Matrias â€” Arconte TÃ¡ctico; Nikoras â€” Vanguardia de la Luz; Braxian â€” sin tÃ­tulo; Milaviel â€” sin tÃ­tulo; Mamporath â€” TitÃ¡n de Choque; Ashley â€” Voz del Silencio; FermÃ­n â€” BastiÃ³n de la Tierra; Isabella â€” Llama IndÃ³mita; Gael â€” Heredero del Viento; Elida â€” Guardiana de la Memoria.

Formas que NO deben renombrarse por reemplazos globales: Xethkioz, Killaruna, Mozaruk, Heller, Kahezer, Itzuke, Dvalin, Okuninust.

## NavegaciÃ³n que debe preservarse
Ecosistema XETHKIOZ: Juegos / ArgenCiencia / Mascotas / Nexus City / CreaciÃ³n Web / Noticias / EN-ES / Iniciar sesiÃ³n.
EN muestra el sitio en inglÃ©s; ES vuelve al espaÃ±ol. En mÃ³vil, `XETHKIOZ +` contiene los seis destinos del ecosistema y deja idioma/login accesibles.
Wisp/Veyr debe permanecer flotante y enlazar Green Node con ruta localizada.

## QA obligatorio antes de cada Preview/producciÃ³n
Ejecutar desde el worktree:
`npm run build`
`WOX_PREVIEW_URL=<url> node scripts/wox-home-visual-check.mjs`
`WOX_PREVIEW_URL=<url> node scripts/wox-aaa-section-capture.mjs`

Criterios mÃ­nimos:
- Desktop 1440Ã—1000 PASS.
- MÃ³vil 390Ã—844 PASS.
- Sin overflow horizontal.
- Sin errores de consola.
- 14 personajes y 8 Formas funcionales.
- 3 slots de ProducciÃ³n 3D, sÃ³lo 1 imagen real (Veyr).
- 6 placeholders oficiales y 0 imÃ¡genes random en Mundo/Atlas/Personajes.
- Wisp presente y con asset oficial.
- NavegaciÃ³n interna y ecosistema completos.
- Revisar visualmente las capturas, no confiar sÃ³lo en tests automÃ¡ticos.

Capturas locales de comparaciÃ³n: `artifacts/wox-aaa-v2/` y `artifacts/wox-home-visual/`.
Copias destacadas del Hero: `E:\WEB XETHKIOZ\wox-aaa-v2-pass03-hero-desktop.png` y `E:\WEB XETHKIOZ\wox-aaa-v2-pass03-hero-mobile.png`.

## Incidente que NO debe repetirse
La primera implementaciÃ³n AAA se publicÃ³ con layouts de escritorio comprimidos en mÃ³vil y quedÃ³ visualmente rota. Se revirtiÃ³ producciÃ³n a `fc1df9c`.
Desde entonces el rediseÃ±o se rehace en `wox-aaa-rebuild-v2`, con mobile-first real, capturas por secciÃ³n y aprobaciÃ³n visual previa a producciÃ³n.

## PrÃ³xima acciÃ³n recomendada
Revisar el Preview Pass 07 completo en telÃ©fono y escritorio. Si la composiciÃ³n visual queda aprobada, hacer un Ãºltimo release-candidate pass centrado sÃ³lo en regresiones, ES/EN y smoke visual antes de considerar producciÃ³n.

## Regla de despliegue
Push de la rama Preview estÃ¡ permitido para generar Preview. No mergear a `main`, no apuntar el dominio real y no publicar producciÃ³n sin aprobaciÃ³n visual explÃ­cita del usuario en el chat actual.


## Checkpoint AAA Rebuild V2 â€” Pass 05 (2026-09-15)
- Commit visual: `7329029 â€” feat(home): add AAA chapter flow and mobile territory polish`.
- Los 9 capÃ­tulos principales ahora llevan identidad numÃ©rica discreta (`01` a `09`) y seÃ±alÃ©tica `CHAPTER // WORLD OF XETHKIOZ` en desktop.
- Territorios, Prisma-Atlas, Formas y Personajes re-montan su consola seleccionada con transiciÃ³n corta al cambiar de opciÃ³n; reduced-motion desactiva la animaciÃ³n.
- QA suma contrato de 9 paneles/capÃ­tulos para evitar regresiones estructurales.
- Mobile Territorios dejÃ³ la fila de 3 mini tarjetas comprimidas: ahora usa 2 columnas legibles y el territorio activo mantiene ancho completo.
- Se corrigiÃ³ el tamaÃ±o del nombre activo y los secundarios para evitar cortes en Izrdralar / Desfralar / Xiomalar / Zodnight.
- Build completo PASS; QA local desktop 1440Ã—1000 PASS y mÃ³vil 390Ã—844 PASS; 0 overflow y 0 errores de consola.
- ProducciÃ³n sigue en `fc1df9c`; este Pass continÃºa sÃ³lo en Preview hasta aprobaciÃ³n visual.


## Checkpoint AAA Rebuild V2 â€” Pass 06 (2026-09-15)
- Commit visual: `5f7cc6f â€” feat(home): polish AAA first visit and media placeholders`.
- El banner de privacidad de primera visita adopta la gramÃ¡tica visual World/AAA en Home, sin alterar su funciÃ³n ni decisiones de consentimiento.
- En mÃ³vil, consentimiento usa 2 botones superiores + acciÃ³n principal a ancho completo; conserva lectura cÃ³moda y evita overflow.
- Se aÃ±adiÃ³ `scripts/wox-first-visit-visual-check.mjs` + `npm run audit:wox-first-visit` para validar el estado real de primera visita.
- Todos los placeholders oficiales comparten ahora seÃ±alÃ©tica `OFFICIAL MEDIA // PENDING`, rejilla y tratamiento visual consistente; siguen sin usar arte random.
- QA: build completo PASS; Home desktop/mÃ³vil PASS; primera visita desktop/mÃ³vil PASS; 0 overflow y 0 errores de consola.
- ProducciÃ³n continÃºa estable en `fc1df9c`; Pass 06 permanece sÃ³lo en Preview hasta aprobaciÃ³n visual explÃ­cita.

## Checkpoint AAA Rebuild V2 â€” Pass 07 (2026-09-15)
- Commit visual: `b7f0f30 â€” feat(home): harden responsive AAA world layouts`.
- Territorios mÃ³viles: regiÃ³n activa conserva ancho completo y las otras tres regiones pasan a una fila compacta de 3 tarjetas en pantallas â‰¥360 px; debajo de ese ancho se mantiene el fallback mÃ¡s amplio.
- La matriz QA de Home se ampliÃ³ a 1440Ã—1000, 1024Ã—900, 768Ã—900, 430Ã—932 y 390Ã—844.
- La primera visita/consentimiento se valida ademÃ¡s explÃ­citamente en 430Ã—932, el ancho donde ocurriÃ³ la regresiÃ³n visual anterior.
- ESâ†’ENâ†’ES validado sobre Preview real: botÃ³n muestra idioma destino, rutas `/`â†”`/en`, `html lang` correcto y copy inglÃ©s real.
- Build completo PASS; todos los viewports PASS; 0 overflow y 0 errores de consola.
- Preview Pass 07 READY y validado remotamente: `xethkioz-site-ithlovwzb-xethkioz-site.vercel.app`; producciÃ³n continÃºa en `fc1df9c`.

## Gate preproducciÃ³n despuÃ©s de Pass 07
- Vercel Preview real: READY; smoke visual remoto PASS en 5 viewports y primera visita PASS en 3 viewports.
- Runtime Preview: 0 logs error/fatal en la ventana verificada.
- `npm run audit:production-ready`: PASS.
- `npm run audit:dependencies`: PASS; sin advisories high/critical de producciÃ³n.
- `npm run verify` local se detiene Ãºnicamente en `audit:env` porque este worktree no contiene `.env`; las variables reales viven en hosting y el Preview con entorno real estÃ¡ READY.
- Git de cÃ³digo queda limpio salvo `artifacts/` no versionados.
- Gate siguiente: aprobaciÃ³n visual explÃ­cita del Preview; reciÃ©n despuÃ©s considerar merge/promociÃ³n a producciÃ³n.
## Checkpoint AAA Rebuild V2 â€” Pass 08 funcional (2026-09-15)
- Commit funcional: `786ff57 â€” fix: complete localized Wisp functional flow`.
- Se agregÃ³ la ruta real `/en/green-node`, su rewrite de Vercel y cabecera `noindex, nofollow, noarchive` equivalente a la ruta ES.
- Veyr/Wisp ahora normaliza rutas ES/EN y abre Green Node mediante `localizePath('/green-node')`, manteniendo estado Home y estado dentro de Green Node en ambos idiomas.
- Se aÃ±adiÃ³ `scripts/wox-home-functional-check.mjs` + `npm run audit:wox-functional` para probar interacciones completas de Home en espaÃ±ol e inglÃ©s.
- Funcionalidad validada: 4 territorios, 4 categorÃ­as Prisma-Atlas, 8 Formas, 14 personajes, chat abrir/cerrar, enlaces requeridos, Wisp y selector ESâ†”EN.
- Build completo local PASS; `production-ready-check` PASS; `wisp-entity-check` PASS; `git diff --check` PASS.
- QA visual local PASS en 1440Ã—1000, 1024Ã—900, 768Ã—900, 430Ã—932 y 390Ã—844; 0 overflow y 0 errores de consola.
- Primera visita local PASS en 1440Ã—1000, 430Ã—932 y 390Ã—844.
- Preview Vercel funcional READY: `xethkioz-site-aznc6pqfd-xethkioz-site.vercel.app`.
- Preview remoto autenticado PASS en los 5 viewports; 14 personajes, 8 Formas, 4 mÃ©tricas Hero, 9 capÃ­tulos, 3 slots 3D, 0 imÃ¡genes random y Wisp activo.
- Preview remoto funcional ES/EN PASS: chat, selecciones, `/green-node`, `/en/green-node` y cambio `/`â†”`/en` sin errores.
- Primera visita remota PASS en desktop, 430 px y 390 px; Runtime Preview: 0 logs error/fatal en la ventana verificada.
- ProducciÃ³n continÃºa en `fc1df9c`; no promover a `main` hasta aprobaciÃ³n visual explÃ­cita del Preview en el chat actual.

## Checkpoint AAA Rebuild V2 â€” Pass 09 visual fit (2026-09-15)
- Se corrigiÃ³ el doble padding heredado en Territorios/Atlas mÃ³vil que comprimÃ­a el ancho Ãºtil de las tarjetas secundarias.
- DESFRALAR, XIOMALAR y ZODNIGHT muestran ahora el nombre completo en 390/430 px sin overflow ni recorte interno.
- Personajes mÃ³vil deja el carrusel horizontal recortado y pasa a una grilla 2 columnas con las 14 identidades visibles y seleccionables.
- Se corrigieron recortes internos de `ESCENARIOS 3D`, `GAMEPLAY REAL` en desktop y `DESFRALAR` en 1024 px.
- `wox-home-visual-check.mjs` ahora falla tambiÃ©n ante overflow interno de tÃ­tulos, aunque la pÃ¡gina no tenga overflow horizontal global.
- QA local PASS: build completo, production-ready, Wisp entity, visual 1440/1024/768/430/390, primera visita y flujo funcional ES/EN.
- En los 5 viewports: `internalTextOverflow=[]`, 0 overflow horizontal y 0 errores de consola.
- ProducciÃ³n continÃºa protegida en `fc1df9c`; Pass 09 sigue sÃ³lo por Preview hasta validaciÃ³n remota y aprobaciÃ³n visual explÃ­cita.
### Cierre remoto Pass 09
- Commits publicados en `wox-aaa-rebuild-v2`: `15c335a â€” feat(home): finish AAA responsive text and cast polish` y `680fe7c â€” docs: checkpoint World AAA visual pass 09`.
- Preview Vercel READY: `xethkioz-site-3tm79uo3f-xethkioz-site.vercel.app` (`dpl_3WjjRuyGkumxXdDGMhw5cVXWDbbq`).
- QA visual remoto autenticado PASS en 1440Ã—1000, 1024Ã—900, 768Ã—900, 430Ã—932 y 390Ã—844; `internalTextOverflow=[]`, 0 overflow global y 0 errores de navegador.
- QA funcional remoto ES/EN PASS: 4 territorios, 4 Atlas, 8 Formas, 14 personajes, chat, Wisp `/green-node` + `/en/green-node` y cambio de idioma.
- Primera visita remota PASS en desktop, 430 px y 390 px; 3 controles de consentimiento, 0 overflow y 0 errores.
- Runtime Preview: 0 logs `error`/`fatal`. ProducciÃ³n permanece en `fc1df9c`; gate siguiente sigue siendo aprobaciÃ³n visual explÃ­cita antes de `main`.

## Checkpoint AAA Rebuild V2 â€” Pass 10 anchor navigation (2026-09-15)
- Se confirmÃ³ que `Saltar al contenido principal` permanece fuera del viewport salvo foco de teclado; su apariciÃ³n en screenshots completos/por elemento era un artefacto de captura, no una regresiÃ³n visible.
- Se detectÃ³ una regresiÃ³n real en navegaciÃ³n por anclas: cada capÃ­tulo aterrizaba parcialmente debajo del dock sticky (â‰ˆ38 px desktop, â‰ˆ12 px mÃ³vil).
- `WorldOfXethkiozAAA.css` ajusta ahora `scroll-margin-top` a 146 px desktop/tablet y 118 px mÃ³vil.
- Se aÃ±adiÃ³ `scripts/wox-anchor-navigation-check.mjs` + `npm run audit:wox-anchor-nav` para validar las 6 anclas en 1440, 768 y 390 px.
- Resultado: las 6 anclas dejan 12 px de aire en desktop/tablet y 10 px en mÃ³vil; 0 errores de navegador.
- Build completo PASS; visual 1440/1024/768/430/390 PASS; primera visita PASS; funcional ES/EN PASS; production-ready PASS; Wisp entity PASS; `git diff --check` PASS.
- ProducciÃ³n continÃºa en `fc1df9c`; Pass 10 permanece sÃ³lo en Preview hasta validaciÃ³n remota y aprobaciÃ³n visual explÃ­cita.

## Checkpoint AAA Rebuild V2 â€” Pass 10 remoto (2026-09-15)
- Commit validado: `40e4ab1 â€” fix(home): clear sticky nav on World anchors`.
- Preview Vercel READY: `xethkioz-site-mjcrjbokg-xethkioz-site.vercel.app` (`dpl_F265PCiiLgQEuYhVcLRDAmG7vm6M`).
- QA visual remoto PASS en 1440Ã—1000, 1024Ã—900, 768Ã—900, 430Ã—932 y 390Ã—844; 0 overflow global, `overflowText=[]`, 14 personajes, 8 Formas, 3 slots 3D y 0 imÃ¡genes random en Mundo/Atlas/Personajes.
- QA funcional remoto ES/EN PASS: 4 territorios, 4 Atlas, 8 Formas, 14 personajes, chat, Wisp `/green-node` y `/en/green-node`, sin errores de navegador.
- Primera visita remota PASS en 1440, 430 y 390 px; 3 acciones de consentimiento, 0 overflow y 0 errores.
- NavegaciÃ³n por anclas remota PASS: 12 px de clearance en 1440/768 y 10 px en 390 para Historia, Mundo, Prisma-Atlas, Personajes, 3D y Desarrollo.
- Runtime Preview: 0 logs error/fatal. Build Vercel completado; sÃ³lo informa timings diagnÃ³sticos de plugins Vite/Rolldown, sin fallo.
- Vercel Toolbar: 0 threads sin resolver para `wox-aaa-rebuild-v2`.
- Gate tÃ©cnico de la rama: cerrado. ProducciÃ³n sigue en `fc1df9c`; no promover a `main` hasta aprobaciÃ³n visual explÃ­cita del Preview en el chat actual.

## Checkpoint AAA Rebuild V2 â€” Pass 11 Veyr clearance (2026-09-15)
- Commit visual/QA: `d95c929 â€” fix(home): keep Veyr clear of chapter content`.
- Se detectÃ³ que Veyr/Wisp flotante podÃ­a cubrir texto o mÃ©tricas al navegar capÃ­tulos en 390, 768 y 1024 px.
- El Hero conserva el tamaÃ±o cinematogrÃ¡fico original: 72 px en 390/430 y 96 px en 768/1024.
- Cuando el dock de capÃ­tulos estÃ¡ visible, Veyr pasa a 56 px y se posiciona en el borde superior derecho: `top:128px` mÃ³vil y `top:152px` tablet/laptop.
- En capÃ­tulos mantiene 18â€“20 px de clearance respecto del dock sticky y no intersecta texto visible.
- Se aÃ±adiÃ³ `scripts/wox-wisp-clearance-check.mjs` + `npm run audit:wox-wisp-clearance`; prueba 6 capÃ­tulos Ã— 4 viewports = 24 combinaciones.
- QA local PASS: clearance Veyr, visual 1440/1024/768/430/390, funcional ES/EN, primera visita, anclas, production-ready, Wisp entity y `git diff --check`.
- Preview Vercel READY: `xethkioz-site-atkmf67ze-xethkioz-site.vercel.app` (`dpl_CGhruwk28Uh7mnZNytmtpAxPW5E4`).
- QA remoto autenticado PASS: visual 5 viewports, funcional ES/EN, primera visita 1440/430/390 y anclas 1440/768/390.
- Clearance remoto Veyr PASS en 390/430/768/1024: Hero 72/96 px, capÃ­tulos 56 px, 18â€“20 px bajo dock y 0 solapamientos en las 24 combinaciones.
- Runtime Preview: 0 logs `error`/`fatal`; build Vercel completado sin fallos; 0 Vercel Toolbar threads sin resolver.
- ProducciÃ³n continÃºa en `fc1df9c`; no promover a `main` hasta aprobaciÃ³n visual explÃ­cita del Preview en el chat actual.

## Checkpoint AAA Rebuild V2 â€” Pass 12 edge + accesibilidad (2026-09-15)
- Commit funcional: `66262a1 â€” fix(home): harden edge viewports and keyboard focus`.
- Se ampliÃ³ QA a 320, 360, 1366 y 1920 px ademÃ¡s de la matriz estÃ¡ndar 390/430/768/1024/1440.
- Se corrigiÃ³ `UNITY` recortado a 320 px y `DESFRALAR` recortado a 1920 px, sin degradar 390â€“1440.
- `RouteAccessibility` ya no fuerza foco a `main-content` en la primera carga; el primer Tab vuelve a ser `Saltar al contenido principal`.
- En navegaciÃ³n SPA posterior el foco sÃ­ vuelve a `main-content`; el skip-link entra visualmente a `top:16px` tras su transiciÃ³n.
- Se aÃ±adiÃ³ `scripts/wox-edge-accessibility-check.mjs` + `npm run audit:wox-edge-accessibility`.
- Axe WCAG A/AA: 0 violaciones; 320/360/1366/1920: 0 overflow global, 0 texto interno recortado, 14 personajes y 8 Formas.
- QA visual remoto PASS en 320/360/390/430/768/1024/1366/1440/1920; 3 slots 3D, 0 imÃ¡genes random y 0 errores de navegador.
- QA funcional remoto ES/EN PASS: 4 territorios, 4 Atlas, 8 Formas, 14 personajes, chat, Wisp/Green Node y cambio de idioma.
- Primera visita remota PASS en 1440/430/390 con 3 acciones de consentimiento y 0 overflow.

## Producción AAA V2 publicada — 2026-09-15
- Aprobación explícita de publicación recibida en el chat actual.
- `main` avanzó por fast-forward desde `fc1df9c` hasta `7041512`; sin conflictos ni merge manual.
- Deployment Vercel production: `dpl_HMw8vmv2vzp7Fbjw5a54wcAsMhj7`, READY, con alias `xethkioz.com.ar` y `www.xethkioz.com.ar`.
- QA visual en producción PASS: 1440/1024/768/430/390; 14 personajes, 8 Formas, 3 slots 3D, 0 imágenes random, 0 overflow y 0 errores.
- QA edge en producción PASS: 320/360/1366/1920 sin overflow ni texto recortado; Axe WCAG A/AA con 0 violaciones.
- QA funcional producción ES/EN PASS: 4 territorios, 4 Atlas, 8 Formas, 14 personajes, chat, Wisp/Green Node y cambio de idioma.
- Primera visita producción PASS en 1440/430/390; navegación por 6 anclas PASS; Veyr clearance PASS en 390/430/768/1024 con 0 intersecciones.
- El foco SPA a `/gaming` fue medido en producción y llega correctamente a `main-content`; el audit usa ahora espera semántica en vez de timeout fijo para evitar falsos negativos por latencia.
- `artifacts/` permanece fuera de Git. Estado objetivo: producción AAA activa; `main` vuelve a ser la fuente canónica.

## Checkpoint AAA V2 - Pass 13 medios 3D reales (2026-09-15)
- Commit de medio oficial: `9cf1502 - feat(home): publish Xethkioz production render`.
- Commit de QA: `5299fb2 - test(web): support protected Vercel previews`.
- Xethkioz LOD0 es el primer render adicional del pipeline Blender/Unity integrado en Home como `MODELO 3D EN PRODUCCION`; no se presenta como gameplay ni como Game Ready final.
- Asset web: `/assets/world-of-xethkioz/xethkioz/xethkioz-lod0-production.webp`, WebP 4:5 optimizado, con encuadre especifico para presentacion web.
- En movil se ocultan los rotulos internos redundantes del frame de Xethkioz para mantener el modelo limpio; el badge `FORMA` y el texto canonico exterior permanecen visibles.
- Viajero sigue bloqueado para publicacion por rig/import QA; Braxian/Milaviel y familia requieren renders de presentacion aprobados; Formas requieren cerrar el mapeo Bestia Legendaria 1-8 a nombres canonicos antes de integrarlas.
- Mundo, Escenarios 3D y Gameplay Real permanecen bloqueados hasta disponer de capturas Unity oficiales de la version vigente.
- `wox-home-visual-check.mjs` exige ahora el asset oficial de Xethkioz y evita una regresion silenciosa a placeholder o imagen random.
- `wox-home-functional-check.mjs` soporta Preview Vercel protegido autenticando primero la entrada temporal y navegando luego por el hostname limpio.
- QA local PASS: build completo, production-ready, visual 1440/1024/768/430/390, edge 320/360/1366/1920, Axe A/AA 0 violaciones, teclado, primera visita, anclas, Veyr clearance y funcional ES/EN.
- Preview remoto PASS en `9cf1502`: visual 5 viewports, funcional ES/EN, primera visita y edge/accesibilidad; runtime 0 error/fatal.
- `main` avanzo por fast-forward de `190c896` a `5299fb2`; sin conflictos ni merge manual.
- Deployment production `dpl_4kMzjYLsY3DQfvui3pfH6zpYyyxJ` READY con alias `www.xethkioz.com.ar` y `xethkioz.com.ar`.
- QA de produccion PASS: visual 1440/1024/768/430/390 con Xethkioz oficial, funcional ES/EN, primera visita, 6 anclas, Veyr clearance, edge 320/360/1366/1920, Axe A/AA 0 violaciones y navegacion de teclado.
- Runtime production: 0 logs `error`/`fatal`; build Vercel completado; Toolbar sin observaciones pendientes.
- `artifacts/` permanece fuera de Git. `main` sigue siendo la fuente canonica de produccion.

## Checkpoint AAA V2 - Pass 14 canon de Formas (2026-09-15)
- Se cruzaron la Biblia Final Consolidada Saga I v2.0 (Canon Lock) y el Bestiario Maestro v2.0 (Canon 3D + Ecologia) desde Google Drive.
- Canon vigente confirmado: Xethkioz, Killaruna, Mozaruk, Heller, Kahezer, Itzuke, Dvalin y Okuninust son las Ocho Formas de Convergencia y una sola familia prismatica.
- `Bestia_Legendaria_1..8` NO poseen identidad canonica asignada a esas Formas; queda prohibido mapearlas por numero, parecido visual o suposicion.
- Produccion de Formas: familia/anatomia compartida de Xethkioz con variantes controladas de silueta, materiales, VFX y afinidad. No publicar medios individuales hasta existir variantes aprobadas.
- `WORLD_OF_XETHKIOZ_MEDIA_SLOTS.md` fue corregido para eliminar la suposicion vieja de mapeo 1-8.
- `wox-home-visual-check.mjs` bloquea ahora los ocho nombres canonicos y su orden exacto.
- Guard visual ejecutado contra produccion en 1440/1024/768/430/390: nombres canonicos exactos, 0 overflow y 0 errores.
- Pass 14 no modifica UI runtime; es un lock documental/QA para impedir una futura integracion 3D incorrecta.

## Checkpoint AAA V2 - Pass 15 proteccion IP + biomas (2026-09-15)
- Nueva politica: los assets 3D limpios y detalles reconstruibles quedan fuera del paquete publico hasta un gate posterior.
- Este checkpoint reemplaza la autorizacion de Pass 13 para exponer el LOD0 de Xethkioz y el render/GLB limpio de Veyr.
- Originales resguardados fuera del repo en E:\\WEB XETHKIOZ\\02_REFERENCIAS_PRIVADAS_NO_PUBLICAR.
- Retirados de public: xethkioz-lod0-production.webp, veyr-wisp-poster.webp y veyr-wisp-v03.glb.
- Web-safe activos: Etereo, Xethkioz y Veyr como sigilos/arte derivado; cuatro key arts de bioma.
- Izrdralar usa verde/esmeralda, vegetacion dominante y cristales verde-cian; Desfralar turquesa/cienaga; Xiomalar cian-violeta/cielo; Zodnight magenta-violeta/noche.
- Guard obligatorio: scripts/wox-ip-protection-check.mjs bloquea raw 3D/archive y referencias legacy en el arbol publico.
- Build completo PASS; production-ready PASS; guard IP PASS.
- QA visual PASS 1440/1024/768/430/390: 0 overflow, 0 errores, 4 key arts, 8 Formas y 14 personajes.
- QA funcional ES/EN PASS: territorios, Atlas, Formas, personajes, chat, Wisp/Green Node y cambio de idioma.
- Primera visita PASS 1440/430/390; edge PASS 320/360/1366/1920; Axe A/AA 0 violaciones; anclas y Wisp clearance PASS.
- Produccion permanece intacta mientras esta rama se valida en Preview.

### Pass 15B - sigilos protegidos y cierre visual
- Atlas, Formas y Personajes reemplazan los marcos vacios por sigilos geometricos web-safe.
- El color del sigilo responde a la familia Atlas, afinidad de Forma o identidad seleccionada.
- Labels publicos ya no prometen renders pendientes: usan Archivo visual protegido, Sigilo de Resonancia e Identidad visual protegida.
- Guard visual exige 3 sigilos protegidos ademas de 4 key arts de region y 7 assets web-safe.
- Revision visual manual: Izrdralar, Desfralar, Xiomalar y Zodnight muestran atmosferas diferenciadas y coherentes.
- QA visual 1440/1024/768/430/390 PASS; funcional ES/EN PASS; 0 overflow y 0 errores.

## Pass 15C - Hero familiar protegido (2026-09-15)
- Hero usa `hero-family-resonance.svg`, arte vectorial derivado y no un asset de produccion.
- Composicion: Etereo + Xethkioz + cuatro emblemas prismáticos para Ashley, Fermin, Isabella y Gael.
- El centro queda libre para logo, lema y CTA; el elenco ocupa laterales y funciona como constelacion visual.
- Guard visual exige el asset oficial del Hero y guard IP lo incluye entre los web-art requeridos.
- Produccion no se modifica hasta Preview remoto aprobado.
