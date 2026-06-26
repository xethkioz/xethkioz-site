# CLEAN RESTART ALPHA 3 — Stability & Language Fix

## Objetivo
Consolidar funcionamiento antes de seguir agregando visuales o funciones.

## Cambios
- Se completó ES/EN para la Home, controles, tres portales y Green Node.
- Se eliminó texto visible hardcodeado de las áreas principales.
- El idioma principal queda en Español Latino y se recuerda en `localStorage`.
- Cada portal mantiene navegación aislada con regreso al núcleo.
- Green Wisp conserva su rol de acceso oculto al Green Node.
- No se tocó SQL ni Supabase.

## Auditoría
- Build validado con `npm install` y `npm run build`.
- Sin cambios en backend.
- Sin agregar dependencias.
- Se mantiene la base visual previa, priorizando estabilidad.

## Resultado
Pendiente de validación final en local por el usuario: Home, idioma, portales y Green Node.
