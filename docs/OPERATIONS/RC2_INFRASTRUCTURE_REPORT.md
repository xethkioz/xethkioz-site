# XETHKIOZ RC2 Infrastructure Report

## Objetivo

Convertir la base LIVE de XETHKIOZ en una plataforma con despliegue reproducible, auditable y protegida contra regresiones.

## Cambios aplicados

- `netlify.toml` endurecido para ejecutar `npm run deploy:check` antes de publicar.
- Redirección SPA configurada para React Router.
- Headers de seguridad y cache-control definidos.
- GitHub Actions `ci.yml` para PRs y pushes.
- GitHub Actions `nightly-audit.yml` para auditoría diaria.
- `.gitignore` reforzado contra secretos, builds y dependencias.
- `.env.example` convertido en plantilla segura.
- `.editorconfig`, `.gitattributes`, `.nvmrc`, `.npmrc` y `.prettierignore` agregados.
- Scripts `verify`, `typecheck`, `deploy:check` y `ci:check` normalizados.

## Contrato de producción

Todo despliegue debe pasar:

```bash
npm run audit:env
npm run audit:production-ready
npm run build
npm audit --omit=dev
```

## Variables obligatorias

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Nunca usar `service_role` ni `secret` keys en frontend, GitHub Actions o Netlify para este proyecto web.
