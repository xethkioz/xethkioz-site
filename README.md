# XETHKIOZ - Gaming & Streaming

> 🚀 Tu portal al futuro del gaming y la tecnología

Premium digital media platform for Gaming, Technology, Science, and Streaming — built with Vite, React, TypeScript, Tailwind CSS, and Supabase.

## Brand
- Electric Orange: `#FF6A00` | Neon Purple: `#8A2BE2` | Deep Black: `#0A0A0F`
- Fonts: Orbitron (display) + Inter (body)

## Quick Start
```bash
npm install
cp .env.example .env  # Add your Supabase URL + anon key
# Run supabase/schema.sql in your Supabase SQL Editor
npm run dev  # Open http://localhost:5173
```

## Build
```bash
npm run build    # Outputs to dist/
npm run preview  # Preview production build
```

## Environment Variables
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Content Management
- Go to `/admin` to create articles and upload media
- Manage categories and authors via Supabase Dashboard (Table Editor)

## Deployment
- **Vercel**: Import repo, auto-detects Vite, add env vars
- **Netlify**: Build: `npm run build`, Publish: `dist`
- **Cloudflare Pages**: Use included GitHub Action or manual import
- **Hostinger**: `npm run build`, upload `dist/` to public_html, add .htaccess with SPA rewrite
- **VPS (Nginx)**: Copy `dist/` to server, configure `try_files $uri $uri/ /index.html`

## Languages
Spanish (es), English (en), Chinese (zh) — switch via header dropdown

## Pages
`/` Home | `/gaming` | `/tech` | `/science` | `/news` | `/article/:slug` | `/streaming` | `/media` | `/community` | `/about` | `/contact` | `/authors` | `/author/:slug` | `/admin`

## License
© XETHKIOZ. All rights reserved.
