# DEPLOY — XETHKIOZ v4.0

## Hosting actual

Vercel.

## Proyecto Vercel

```txt
xethkioz-site
```

## Rama de producción

```txt
main
```

## Dominios

```txt
https://xethkioz.com.ar
https://www.xethkioz.com.ar
```

## Stack

```txt
React
Vite
TypeScript
Tailwind
Supabase
Vercel
GitHub
```

## Build

```bash
npm run build
```

## Publish directory

```txt
dist
```

## Variables obligatorias en Vercel

Configurar en Project Settings -> Environment Variables.

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

`VITE_SUPABASE_ANON_KEY` puede ser una publishable key nueva de Supabase con formato `sb_publishable_*`.

No usar `service_role`, `sb_secret_*` ni claves privadas en variables `VITE_*`.

## Validacion local

```bash
node scripts/env-ready-check.mjs
npm run build
```

## Reglas de oro deploy

- No subir `.env`.
- No subir secretos.
- No subir `dist`.
- No subir `node_modules`.
- Todo cambio debe pasar por `main` y Vercel Production.
- Si el chat aparece en modo LOCAL, revisar variables de Vercel y redeploy.
- Si `/news` no muestra datos, revisar Supabase `news_articles` con `status = published`.
- Si `/cms` muestra Supabase pendiente, revisar variables y ejecutar redeploy posterior a la carga.
