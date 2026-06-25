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
