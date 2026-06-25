# XETHKIOZ v4.0 Alpha 4 — Live Polish Report

## Objetivo

Preparar el proyecto para una futura actualización LIVE con una base más clara, revisable y profesional.

## Cambios incluidos

- CMS Studio visual en `/cms`.
- Checklist de publicación en `/live-checklist`.
- Chat flotante con sala Asia Gaming.
- Links reales centralizados en `siteConfig.ts`.
- Header/Footer con accesos de administración y revisión.
- Migración SQL base para CMS, chat, reacciones y moderación.
- Build local verificado.

## Rutas a revisar antes de deploy

- `/`
- `/news`
- `/gaming`
- `/tech`
- `/science`
- `/streaming`
- `/media`
- `/community`
- `/cms`
- `/chat-overlay`
- `/chat-overlay?obs=1`
- `/live-checklist`

## Comandos recomendados

```bash
npm install
npm run build
npm run dev
```

## Estado

Alpha 4 es una base de pulido. El próximo paso recomendado es Beta 1 con conexión real a Supabase Realtime para chat, comentarios, reacciones y CMS.
