# XETHKIOZ GO-LIVE Checklist

## Local

- [ ] `.env` existe localmente.
- [ ] `.env` tiene `VITE_SUPABASE_URL`.
- [ ] `.env` tiene `VITE_SUPABASE_ANON_KEY` publishable/anon.
- [ ] `.env` NO tiene service role.
- [ ] `npm ci` pasa.
- [ ] `npm run deploy:check` pasa.

## GitHub

- [ ] `.env` no aparece en `git status`.
- [ ] `node_modules/` no aparece.
- [ ] `dist/` no aparece.
- [ ] rama `rc-live-final-candidate` actualizada.

## Supabase

- [ ] SQL de `profiles` aplicado.
- [ ] RLS activo.
- [ ] `profiles` no expone role/tier públicamente.
- [ ] `public_profiles` existe como vista segura.
- [ ] Login/registro probado.

## Netlify Preview

- [ ] Variables de entorno cargadas.
- [ ] Build Netlify PASS.
- [ ] Deploy Preview abre.
- [ ] Rutas principales probadas.
- [ ] Mobile probado.
- [ ] Consola sin errores críticos.

## Producción

- [ ] Merge a `main` solo después del preview.
- [ ] `www.xethkioz.com.ar` abre.
- [ ] HTTPS activo.
- [ ] Navegación principal OK.
