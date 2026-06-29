# Changelog — XETHKIOZ Fusion Platform

## 2026-06-29 — RC4 Closeout Prep / PR #3 superseded

### Estado
- PR #3 `RC3 Performance: Lazy route loading kickoff` fue cerrado sin merge porque quedó desfasado respecto de `main`.
- PR #5 `RC3 Live Sync: Performance and hidden Green Node` reemplazó a PR #3 y fue mergeado correctamente.
- Se preservó la integración de `@vercel/analytics`, rutas de cuenta, SPA Routing y la lógica de Green Node oculto.
- Se consolidó lazy route loading en `src/App.tsx` con `React.lazy` y `Suspense`.
- Se ocultó Green Node de los accesos visibles del portal y World Gates, manteniéndolo enlazado al flujo de Wisp/session unlock.

### Validación documental
- Se registra este cierre para preparar la transición operativa hacia RC4.
- No se modificó lógica de producción en esta actualización documental.
- Pendiente recomendado: ejecutar validación local/CI con `npm run deploy:check` si GitHub Actions o entorno local están disponibles.

---

# Fusion Alpha 2.2 — World Hero Stage

- Updated Section 0 World Hero Stage with RPG avatar actions.
- Linked role actions to AvatarRenderer poses.
- Applied official gaming/fun/text DesignSystem tokens to the XETHKIOZ brand gradient.
- Preserved ES/EN action copy and added transition cleanup.


## Fusion Alpha 1.5 — Wisp Engine + Full Audit

- Added `WispEngineContext` with persistent Wisp mood, energy, focus route and event trail.
- Expanded `FusionWispEntity` states for future AI/event integration.
- Connected global Wisp to route changes, account status and interaction signals.
- Added Wisp state/energy to the global status panel.
- Added `audit:code`, `audit:media` and `audit:wisp-engine`.
- Generated code/route/structure, visual/audio object and SQL review reports.
- No SQL execution, no Supabase runtime changes, no real audio engine yet.


## Fusion Alpha 1.3 — Global HUD

- Added persistent global HUD foundation.
- Added login preview state in HudContext.
- Added FusionGlobalStatus.
- Added FusionGlobalWisp.
- Removed Home-only Wisp duplication.
- Extended ES/EN strings for HUD, audio, account and system status.
- Updated audit scripts for HUD/global Wisp guardrails.
- No SQL or Supabase runtime changes.

# Fusion Alpha 1.2 — World Gate Recovery

- Home rediseñada como World Gate Cyberpunk 3000.
- Portales visibles: Gaming, Science, Green Node y Fun Portal.
- FusionPortalGate agrega tono Green.
- Portales con profundidad, iluminación, runas, vórtices, hover 3D y animaciones livianas.
- i18n actualizado para cuatro portales y Green Node.
- Build y auditorías fusion/live validadas.


## Fusion Alpha 0.5 — Core Architecture

- Se agrega contrato central `src/lib/fusionConfig.ts`.
- Se agrega auditoría de arquitectura con `npm run audit:architecture`.
- Se documentan rutas públicas, redirects legacy, componentes globales y páginas internas/legado.
- Se actualiza versión a `7.0.0-fusion-alpha.0.5`.
- No se modifican SQL, Supabase runtime ni visual principal.


## 7.0.0-clean-restart-alpha.5 — Visual Portal Base

### Objetivo
- Establecer la base visual del ecosistema XETHKIOZ antes de agregar nuevas funcionalidades.

### Cambios
- Home rediseñado como núcleo oscuro de fantasía/sci-fi.
- Tres portales principales con efecto de portal arcano inspirado en portales MMORPG: Juegos, Ciencia/Tecnología y Fun.
- Green Wisp integrado como acceso oculto y elemento visual vivo.
- Dragón simbólico con ojos animados, marca X y atmósfera de portal.
- Animaciones CSS livianas: vórtice, runas, wisp, brasas y brillo del dragón.

### Restricciones mantenidas
- Sin CMS nuevo.
- Sin SQL nuevo.
- Sin Supabase nuevo.
- Sin nuevas funciones de comunidad.

### Verificación
- Pendiente de prueba local por el usuario.

# V7 Clean Restart Alpha 3

- Core de idioma ES/EN completado para áreas visibles principales.
- Persistencia de idioma en navegador.
- Portales principales y Green Node usan una única fuente de traducción.
- Build validado.


## 7.0.0-clean-restart-alpha.2

- Pulido de Home sobre Web_GITHUB(25).
- Header reducido a controles mínimos.
- Eliminado navbar tradicional de la experiencia principal.
- Green Wisp ahora funciona como acceso oculto visual sin texto explicativo.
- Portales principales simplificados: Juegos, Ciencia/Tecnología y Fun.
- Green Node queda aislado como mundo verde.
- Idiomas activos reducidos a ES/EN.
- Build validado con TypeScript + Vite.

# Changelog XETHKIOZ

## v4.0.0-rc.2.2 — Stability Render Fix
- Fix de pantalla vacía: se agrega `AppErrorBoundary` y Safe Boot.
- Chat/presencia/Wisp quedan aislados para no romper el render principal.
- Supabase se vuelve tolerante a configuración faltante o inválida.
- `realtimeCommunity.ts` protege localStorage, BroadcastChannel, Realtime y crypto.
- Build validado con Vite.


## v4.0.0-rc.2.0 — Realtime Chat + Wisp Evolution

- Agregado motor de chat híbrido: local multi-pestaña, BroadcastChannel y Supabase Realtime cuando la migración esté aplicada.
- El chat ahora muestra cuántas personas están mirando la ruta actual y cuántos usuarios hay activos en el ecosistema.
- El Wisp ahora tiene nivel, energía, nombre evolutivo y gana XP por interacción/chat.
- Agregada sala Green Node al chat de comunidad.
- Agregada migración SQL `20260625_rc20_realtime_chat_wisp_evolution.sql` para salas, mensajes, presencia y eventos del Wisp.
- Preparada la base para presencia por ruta y evolución futura con perfiles reales.



## v4.0.0-rc.1.9 — Milestones + Data Governance

- Agrega `/milestones` como tablero maestro de progreso.
- Integra roadmap operativo en `/network`.
- Agrega matriz SQL/Data Governance para separar modulos de datos.
- Agrega matriz de XP, donadores, insignias y moderacion temporal.
- Agrega migracion `20260625_rc19_milestones_data_governance.sql`.
- Actualiza version a `v4.0.0-rc.1.9`.
# Changelog

## v4.0.0-rc.1.7 — Layout Isolation + Green Node Video Polish

- Simplificación del header principal con menú `Más`.
- Green Node aislado del chrome global.
- Science Lab aislado con navegación formal propia.
- Video verde integrado como hero real de Green Node.
- Wisp oculto en portales aislados para evitar loop visual.
- Documentación RC1.7 agregada.

# CHANGELOG — XETHKIOZ

## [4.0.0-rc.1] — Dynamic News + Roles + Admin Foundation

### Added
- Dynamic News Engine con fuentes externas iniciales.
- Página `/news-engine`.
- Sistema base de roles, XP, insignias y moderación temporal.
- Página `/roles`.
- Paneles nuevos dentro de CMS Studio.
- Migración SQL para fuentes, external news, XP, badges, moderación, comentarios y reacciones.

### Changed
- Versión del proyecto actualizada a `4.0.0-rc.1`.
- Release label actualizado a `Dynamic News + Roles + Admin Foundation`.

### Notes
- Green Node queda como proyecto/sección especial futura. No se integra aún en la web clásica.
- Para música del módulo Green Node usar audio propio o con licencia clara.


# XETHKIOZ Changelog

## v3.6.1 — Stability & Image Cleanup

- Added centralized site version metadata.
- Added public `/version.json` for production verification.
- Added footer version indicator to confirm the live release.
- Centralized donation and social links in `siteConfig.ts`.
- Preserved SafeImage behavior to prevent broken images and blocked demo portraits.
- Verified production build.
