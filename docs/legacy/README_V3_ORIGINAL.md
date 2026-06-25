# XETHKIOZ - Gaming & Streaming

> 🚀 Tu portal al futuro del gaming y la tecnología

Premium digital media platform for Gaming, Technology, Science, Streaming and AI content — built with Vite, React, TypeScript, Tailwind CSS and Supabase.

## Version

Current package: **XETHKIOZ v3.5.0**

## Brand

- Electric Orange: `#FF6A00`
- Neon Purple: `#8A2BE2`
- Deep Black: `#0A0A0F`
- Fonts: Orbitron for display + Inter for body

## Quick Start

```bash
npm install
cp .env.example .env
# Add your Supabase URL + anon key
# Run supabase/schema.sql in your Supabase SQL Editor
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GA4_ID=
VITE_CLARITY_ID=
VITE_FACEBOOK_PIXEL_ID=
```

## Content Management

- Go to `/admin` to create articles and upload media.
- Manage categories and authors via Supabase Dashboard.
- For production, add Supabase Auth and role-based protection before exposing admin workflows widely.

## Deployment

- **Vercel**: Import repo, Vite auto-detected, add env vars.
- **Netlify**: Build: `npm run build`, publish: `dist`.
- **Cloudflare Pages**: Import repo or use the included GitHub Action.
- **Hostinger**: `npm run build`, upload `dist/` to `public_html`, add SPA rewrite.

## Pages

`/` Home | `/gaming` | `/tech` | `/science` | `/news` | `/article/:slug` | `/streaming` | `/media` | `/community` | `/about` | `/contact` | `/authors` | `/author/:slug` | `/admin`

## v3.5 Highlights

- Fixed data hooks initial loading.
- Polished hero spacing and portal cards.
- Added safe About image from XETHKIOZ assets.
- Improved SEO, sitemap and robots.
- Added deployment security headers.
- Added analytics environment placeholders.

## License

© XETHKIOZ. All rights reserved.

## XETHKIOZ v3.6.0 Notes

This build adds:

- Animated pixel-art homepage banner.
- Safe image fallback system for news, articles, media and streams.
- `/support` page for donations, sponsorships and collaborations.
- Creator account navigation improvements.
- Community database foundation: posts, comments and reactions.
- `.gitignore` to prevent committing `node_modules`, `dist` and secrets.

### Donation / support links

- PayPal: https://www.paypal.com/ncp/payment/5ZYB8NGEGC8AS
- Mercado Pago: https://link.mercadopago.com.ar/xethkioz

### Important deployment note

After uploading this version, run `npm run build` locally or in Netlify. If using Supabase community features, run the updated `supabase/schema.sql` in Supabase SQL Editor.


## Current Release

- Version: `v3.6.1`
- Release: Stability & Image Cleanup
- Build date: 2026-06-25
- Public version check: `/version.json`

### v3.6.1 focus

This version stabilizes the v3.6 base before the progressive roadmap toward v4.0. It includes footer version visibility, centralized links, image fallback protection, and production build verification.

## v3.6.2 Creator Hotfix

This release fixes the creator account UX detected in mobile testing:
- login redirects to a real user panel;
- duplicate signup attempts are blocked temporarily;
- confirmation email messaging is clearer;
- version updated to v3.6.2.
