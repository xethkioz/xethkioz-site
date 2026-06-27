
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

## v3.6.0 — Pixel Banner + Support

- Added Pixel Art hero banner support.
- Added `/support` for donations and sponsor intent.
- Added SafeImage fallbacks and XETHKIOZ image placeholders.
- Added Supabase community tables.

## v3.6.2 - Creator Account Hotfix

- Fixed creator login flow: successful login now redirects to `/creator/panel`.
- Added `/creator/panel` private user dashboard.
- Added signup cooldown to reduce repeated confirmation/spam emails.
- Added clearer signup message explaining email confirmation and spam folder.
- Added Supabase email redirect target for account confirmation.
- Updated site version to v3.6.2.


## [4.0.0-alpha.1] - 2026-06-25

### Added
- Chat Overlay visual para streaming y nueva ruta `/streaming/chat-overlay`.
- Fallback editorial para noticias por sector: gaming, tecnología, ciencia, IA y streaming.
- Fallback multimedia con miniaturas SVG para videos, streams y overlay.
- Links sociales reales centralizados en `siteConfig.ts`.
- Documentación de implementación v4 alpha 1.

### Changed
- Versión del proyecto actualizada a `4.0.0-alpha.1`.
- Página Streaming reforzada con accesos a Kick, Twitch y overlay.
- Páginas de portal reforzadas con bloques introductorios.

### Notes
- No se incluye `.env`, `.git`, `node_modules` ni `dist` en el paquete entregable.

## [4.0.0-alpha.2] - 2026-06-25

### Added

- Content foundation expanded by portal.
- Local SVG cover images and video thumbnails.
- Floating community chat mock with rooms and emojis.
- OBS-ready chat overlay route: `/chat-overlay?obs=1`.
- Short route `/chat-overlay`.
- CMS and chat SQL foundation draft.
- Alpha 2 implementation and final review docs.

### Changed

- Version updated to `4.0.0-alpha.2`.
- Streaming/media/article fallback data improved.

### Notes

- Community chat is currently local/mock and prepared for Supabase Realtime.
- YouTube handle requires final confirmation before production.


## v4.0.0-alpha.3

- Added 100 editorial fallback articles.
- Added internal SVG covers and video thumbnails.
- Improved OBS chat overlay with alert blocks.
- Added article reaction component.
- Added Supabase SQL foundation for comments, reactions and realtime chat.
- Updated docs for Alpha 3 QA.


## [4.0.0-alpha.4] - 2026-06-25

### Added
- CMS Studio público en `/cms` como base visual del flujo editorial.
- Checklist de publicación LIVE en `/live-checklist`.
- Sala `Asia Gaming` en el chat flotante de comunidad.
- Documentación Alpha 4 de pulido, deploy y revisión final.
- Migración SQL base para CMS, chat, reacciones y moderación.

### Changed
- Versión del proyecto actualizada a `4.0.0-alpha.4`.
- Header y Footer incorporan accesos a CMS Studio y Checklist LIVE.
- Chat flotante ajustado como modo local preparado para Supabase Realtime.
- Chat Overlay documentado como Alpha 4.

### Notes
- Alpha 4 está pensada como punto de pulido antes de preparar una Beta con conexión real a Supabase Realtime y CMS operativo completo.


## v4.0.0-rc.1.1 — Network + Science Lab + Green Node

- Added XETHKIOZ Network portal map.
- Converted Science Lab into a formal scientific division.
- Added hidden Green Node portal with neon-green hacker/cyberpunk identity.
- Added wisp Easter Egg access with portal transition.
- Added Green Node video hero support.
- Added Supabase SQL migration for network portals, science reports and Green Node entries/logs.
- Documented safety boundaries for cybersecurity/OSINT/conspiracy-documentary content.


## v4.0.0-rc.1.2 — Network Polish Review

- Se agrega terminal interactiva mock para Green Node.
- Se mejora el wisp oculto con animación más orgánica y vortex de portal.
- Se agrega protocolo editorial visible para Green Node.
- Se agrega matriz formal de evidencia para Science Lab.
- Se agrega migración Supabase RC1.2 para comandos, fuentes científicas y eventos de portales.
- Build objetivo: preparar XETHKIOZ Network para contenido dinámico real y revisión RC.


## v4.0.0-rc.1.3 — Network Polish + Link Audit + Wisp Portal System

### Added
- Nueva ruta `/network` para mostrar el mapa modular de XETHKIOZ Network.
- Panel `LinkAuditPanel` para revisar enlaces internos, redes reales, rutas especiales y accesos LIVE.
- Wisp verde mejorado con pista visual, secuencia secreta `greennode`, portal con runas y modo reduced-motion.
- Green Node ampliado con access vectors y comandos `wisp` y `ubuntu`.
- Migración SQL `20260625_rc13_network_link_wisp_audit.sql` para módulos, registro de links, logs de acceso Green Node y fuentes Science Lab.
- Fuentes externas nuevas para Dynamic News Engine: PC Gamer, arXiv CS.AI, Nature News y Eurogamer.

### Changed
- `siteConfig` actualizado a `v4.0.0-rc.1.3`.
- Header y Footer incluyen mapa Network, manteniendo Green Node como experiencia especial por Wisp.
- Green Node conserva enfoque educativo/documental y evita audio externo automático por copyright/autoplay.

### Review
- Revisar `/network`, `/science`, `/green-node`, `/news-engine`, `/cms` y el Wisp antes de publicar LIVE.

## v4.0.0-rc.1.4 — Network Integrity + Wisp Review

- Se agregó auditoría visual de módulos de XETHKIOZ Network.
- Se reforzó Science Lab con política editorial y tablero de fuentes.
- Se amplió Green Node con módulos Linux, programación, cyber defensivo y misterios documentales.
- Se mejoró el Wisp flotante con memoria local de descubrimiento.
- Se agregó SQL aditivo para módulos, fuentes científicas y unlocks de Green Node.

## v4.0.0-rc.1.5 — Network Database Baseline + General Review

- Added consolidated Supabase baseline migration for XETHKIOZ Network.
- Added database readiness panel for `/network` and `/cms`.
- Improved Wisp behavior with route-aware positioning and discovery state.
- Documented Science Lab, Green Node and CMS database foundation.
- Updated version metadata to `v4.0.0-rc.1.5`.

## v4.0.0-rc.1.6 — Content System + Final Network UX QA

- Agregado tablero `/content-system` para ordenar el flujo editorial modular.
- Agregado tablero `/qa` para revisión final antes de despliegue LIVE.
- Agregado `ContentOpsDashboard` con lanes de contenido: propias, externas, Science Lab, Green Node, video/streaming y comunidad.
- Agregado `NetworkFinalQaPanel` con revisión de rutas, links, SQL, Wisp, Science Lab, CMS y producción.
- Wisp mejorado: aparición menos invasiva, oculto en overlay, keyword secundaria `wisp`.
- SQL incremental `20260625_rc16_content_system_final_qa.sql`.
- Versionado actualizado a `v4.0.0-rc.1.6`.

## v4.0.0-rc.1.8 — Network Architecture Cleanup + AI Lab + Creator Studio

- Se agregan rutas `/ai-lab` y `/creator-studio`.
- Se actualiza el mapa de XETHKIOZ Network para separar IA y producción de contenido como divisiones propias.
- Se actualiza Header/Footer con accesos más ordenados desde el menú secundario.
- Se agrega migración SQL `20260625_rc18_network_architecture_cleanup.sql` en `database/migrations` y `supabase/migrations`.
- Se mantiene Green Node como nodo oculto por Wisp/EGG.
- Build local validado con `npm run build`.

## v4.0.0-rc.2.3 — Content Ready UX Polish

- Agregado `EditorialCommandCenter`.
- Agregado `editorialPlan.ts`.
- Integrado el centro editorial en `/cms` y `/content-system`.
- Agregada migración `20260625_rc23_content_ready_ux_polish.sql`.
- Actualizada documentación de QA y flujo editorial.
- Versión preparada para carga progresiva de contenido real.

## v4.0.0-rc.2.4 — Realtime Community + Daily Loop

- Reescritura del chat para usar Supabase Realtime Broadcast por sala.
- Presencia global con contador por página y sala.
- Wisp evolucionable con XP y eventos persistibles.
- Nuevo panel de actividad diaria en Home.
- SQL RC2.4 para chat, presencia, eventos del Wisp y slots diarios.
- Limpieza de fallback local para que el sitio no se rompa si Supabase no está disponible.


## 7.0.0-clean-restart-alpha.4 — Stability Scope Lock

- Reduced the public runtime scope to the V7 core routes: Home, Gaming, Science & Technology, Fun, and Green Node.
- Collapsed legacy public routes into safe redirects instead of exposing unfinished dashboards.
- Removed public account navigation to avoid loading unfinished admin/CMS flows during the clean restart.
- Kept Supabase files in the repository for future integration, but removed them from the current public bundle path.
- Added QA documentation for the Alpha 4 stability pass.
- Removed the forced Supabase manual chunk from Vite output during Alpha 4 because Supabase is not part of the current public runtime.


## 7.0.0-fusion-alpha.0.1 — Baseline

- Se congela Alpha 5 como base estable de XETHKIOZ Fusion.
- Se descarta Fusion Web 1.0 como base visual.
- Se documenta la regla de no usar imágenes pegadas como interfaz.
- Se mantiene build estable sin SQL nuevo.

## 7.0.0-fusion-alpha.0.2 — Structure Cleanup

- Fixed global controls visibility across all public portal routes.
- Kept Home visual baseline unchanged.
- Updated package and public version metadata.
- Added structure audit and notes.
- No SQL, Supabase, CMS, or visual overhaul included.

## 7.0.0-fusion-alpha.0.3 — Inventory & Safety Lock

- Se congela base estable posterior a Fusion Alpha 0.2.
- Se agrega inventario de arquitectura para rutas/componentes/SQL.
- Se agrega script `npm run audit:inventory`.
- Se documenta regla de seguridad: assets visuales no deben reemplazar UI funcional.
- No se aplican cambios SQL ni Supabase.

## 7.0.0-fusion-alpha.0.4 — SQL & Data Safety Audit

- Added SQL inventory script: `npm run audit:sql`.
- Generated SQL classification report.
- Confirmed no SQL migrations are applied in this phase.
- Kept Home and visual layer unchanged.
- Preserved Fusion Alpha baseline stability.



## Fusion Alpha 0.6 — Design System Foundation

- Agregado contrato inicial `src/lib/designSystem.ts`.
- Agregados componentes reutilizables `FusionShell`, `FusionHero`, `FusionFeatureGrid` y `FusionLevelGrid`.
- Migrados Gaming Hub, Science Lab, Fun Portal y Green Node a la nueva base de componentes.
- Versión actualizada a `7.0.0-fusion-alpha.0.6`.
- Build validado sin errores.

## Fusion Alpha 0.7 — Revision Safety + Portal Component Foundation

- Versión actualizada a `7.0.0-fusion-alpha.0.7`.
- Agregado `FusionPortalGate` como componente reutilizable para los portales de la Home.
- Home migrada parcialmente al nuevo componente sin rediseño fuerte.
- Agregado `npm run audit:fusion` con guardrails críticos del ecosistema.
- Build y auditorías validadas.

## Fusion Alpha 0.8 — Wisp Entity Foundation

- Agregado componente reutilizable `FusionWispEntity`.
- Home deja de hardcodear el Wisp.
- Agregado `npm run audit:wisp`.
- Documentada arquitectura inicial del Wisp como entidad del ecosistema.
- Sin cambios en SQL, Supabase runtime ni CMS.


## 7.0.0-fusion-alpha.0.9 — Persistent HUD Foundation

- Added global HUD context for sound state and volume foundation.
- Header no longer owns local-only sound state.
- Added persistent `xethkioz.hud.sound` and `xethkioz.hud.volume` storage keys.
- Added `npm run audit:hud`.
- No SQL, Supabase runtime, or heavy visual rewrite.


## Fusion Alpha 1.0 — Live Candidate

- Home reconstruida como World Gate por capas React/CSS.
- Agregado FusionWorldStage.
- Agregado FusionStatusRail.
- Portales siguen siendo componentes reales, sin imagen plana como UI.
- Wisp continúa como entidad reusable.
- Agregado audit:live.
- Build y auditorías completas OK.


## Fusion Alpha 1.1 — Media Slots
- Integrado video ambiental para Green Web/Nexus.
- Green Node mantiene arquitectura funcional y video como capa decorativa.
- Preparado flujo para integrar portada principal cuando el asset esté disponible.


## Fusion Alpha 1.4 — Portal Engine

- Refuerza identidad visual propia por portal.
- Agrega panel hints por sección en el World Gate.
- Mejora profundidad, partículas, runas y hover 3D.
- Agrega Green Node con duende mágico y fuente de oro como acceso especial.
- Mantiene HUD global, Wisp global, SQL y Supabase sin cambios.
