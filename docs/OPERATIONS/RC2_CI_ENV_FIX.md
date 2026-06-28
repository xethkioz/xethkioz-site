# RC2 CI Environment Fix

## Problema

El script `scripts/env-ready-check.mjs` validaba únicamente el archivo local `.env`.
Eso funcionaba en desarrollo, pero fallaba en GitHub Actions y Netlify Deploy Preview porque los entornos CI/CD inyectan variables por `process.env` y no deben contener `.env` dentro del repositorio.

## Fix aplicado

El script ahora usa este orden:

1. Si existe `.env`, valida `.env` para desarrollo local.
2. Si no existe `.env`, valida `process.env` para GitHub Actions, Netlify, Vercel u otro hosting.

## Variables obligatorias

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Seguridad

El script sigue bloqueando patrones peligrosos:

- `SERVICE_ROLE`
- `SUPABASE_SERVICE`
- `sb_secret_`

No usar claves `service_role` ni secret keys en frontend, GitHub Actions o Netlify para este proyecto web.
