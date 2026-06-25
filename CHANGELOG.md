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
