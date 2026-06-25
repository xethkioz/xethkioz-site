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
