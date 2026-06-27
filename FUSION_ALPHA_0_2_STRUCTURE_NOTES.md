# XETHKIOZ Fusion Alpha 0.2 — Structure Cleanup

## Objetivo

Mantener la base pobre pero estable de Fusion Alpha 0.1 y corregir el primer problema funcional confirmado: los controles globales no estaban disponibles dentro de los portales.

## Cambios aplicados

- Se actualizó la versión a `7.0.0-fusion-alpha.0.2`.
- Se corrigió `src/App.tsx` para que el `Header` / panel global se renderice en todas las rutas públicas.
- Se eliminó la condición que ocultaba controles en `/gaming`, `/science`, `/fun` y `/green-node`.
- Se actualizó `public/version.json`.
- Se actualizó el indicador visible del núcleo en Home a `Fusion Alpha 0.2`.
- No se modificó la estructura de los portales.
- No se aplicó SQL nuevo.
- No se agregó Supabase nuevo.
- No se rediseñó la Home.

## Estado funcional

- Home: estable.
- Gaming Hub: estable con controles globales.
- Science Lab: estable con controles globales.
- Fun Portal: estable con controles globales.
- Green Node: estable con controles globales.
- Legacy routes: redirigidas según el contrato actual.

## Riesgos detectados

- Todavía existe CSS legacy acumulado en `src/index.css`.
- Existen componentes y páginas heredadas no expuestas públicamente.
- Hay migraciones SQL duplicadas entre `database/migrations` y `supabase/migrations`.
- El sistema de audio todavía es solo estado visual; no reproduce pistas.
- El botón de cuenta es placeholder; no debe prometer auth real todavía.

## Próximo bloque recomendado

Fusion Alpha 0.3:

- Inventario de rutas reales vs rutas legacy.
- Clasificación de componentes: conservar / ocultar / eliminar / reactivar luego.
- Primer plan de SQL: core, cms, comunidad, green node, legacy.
- No tocar diseño visual todavía.
