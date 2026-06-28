# XETHKIOZ Web Audit — 2026-06-28

## Estado operativo

- Vercel project: `xethkioz-site`.
- Production domain: `www.xethkioz.com.ar`.
- Apex domain: `xethkioz.com.ar` redirects to `www`.
- Framework: Vite + React + TypeScript.
- Production deploy source: GitHub `xethkioz/xethkioz-site`, branch `main`.
- Build command: `npm run build`.
- Output directory: `dist`.

## Cambios aplicados

1. Vercel Web Analytics integrado y desplegado.
2. Página de acceso de cuenta agregada en `/login` y `/account`.
3. HUD conectado a Supabase Auth para reflejar sesión real.
4. Ruta `/register` redirige a `/login`.
5. Green Node deja de funcionar como ruta pública directa: ahora requiere desbloqueo de Wisp en `sessionStorage`.
6. Se agregó una capa CSS de visibilidad para ocultar el portal verde del grid público.

## Configuración esperada en Vercel

Variables necesarias:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` para funciones backend futuras, nunca en frontend.

## Pendientes recomendados

- Validar creación real de cuenta con Supabase Auth desde producción.
- Revisar configuración de email confirmation en Supabase.
- Normalizar canonical/OG hacia `https://www.xethkioz.com.ar`.
- Reordenar textos por sector: Home, Gaming, Science, Fun, News, Community, Profile y CMS.
- Reemplazar la solución CSS temporal del Green Node por filtrado estructural definitivo en `portalRegistry` o `WorldGateV5`.
- Auditar PR #3 antes de mergear.

## Nota de seguridad

No exponer claves privadas en React. La integración de IA debe ejecutarse desde Vercel Functions o backend equivalente.
