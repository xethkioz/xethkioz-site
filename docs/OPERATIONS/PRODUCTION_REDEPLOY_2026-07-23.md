# XETHKIOZ — Redeploy limpio de producción

Fecha: 2026-07-23  
Issue relacionado: `#142`

## Motivo

El PR `#149` eliminó la función diagnóstica y el rewrite temporal de `/triggers/github`, dejando `main` limpio en `757a0153f12248afbe682670da8cfe7c4dfab395`.

Vercel no desplegó ese commit por el límite de frecuencia de builds del plan. Producción continuó sirviendo temporalmente el endpoint seguro `410 Gone` del commit anterior, aunque el código ya había sido retirado del repositorio.

Este documento crea un cambio operativo trazable para solicitar un nuevo deployment del `main` limpio. No modifica React, rutas públicas, datos, Supabase, RLS, CMS, estilos, contenido editorial ni políticas de seguridad.

## Verificación requerida

Después del merge:

- GitHub CI y Vercel Production deben quedar en `READY`.
- `/triggers/github` no debe responder con el JSON diagnóstico temporal.
- La cabecera CSP de enforcement debe permanecer activa.
- Los deploys automáticos y checks de GitHub/Vercel deben continuar funcionando.
- Se observarán los logs durante 24 horas para confirmar que no reaparecen POST recurrentes a `/triggers/github`.

## Pendiente externo

El trigger destination de Vercel Connect asociado al Hook ID documentado en `#142` debe retirarse desde Vercel Team → Connect. No se debe desconectar la integración Git normal del repositorio.
