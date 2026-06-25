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
