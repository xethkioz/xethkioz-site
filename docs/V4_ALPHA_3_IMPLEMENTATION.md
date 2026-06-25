# XETHKIOZ v4.0 Alpha 3 — Portal Pro Foundation

## Implementado

- Base de 100 artículos editoriales mock distribuidos por Gaming, Esports, Pokémon, Asia Gaming, IA, Hardware, Software, Ciencia, Medicina y Streaming.
- Portadas SVG propias para artículos, videos, media y streaming.
- Miniaturas mejoradas para Media y Streaming.
- Chat flotante tipo Discord con salas comunitarias y persistencia local.
- Chat Overlay OBS mejorado con mensajes, badges, alertas y modo `/chat-overlay?obs=1`.
- Reacciones en artículos con persistencia local.
- Migración SQL preparada para comentarios, reacciones y chat con Supabase Realtime.
- Versionado actualizado a `v4.0.0-alpha.3`.
- Documentación de revisión y próximos pasos.

## Rutas críticas

- `/`
- `/news`
- `/gaming`
- `/tech`
- `/science`
- `/streaming`
- `/media`
- `/chat-overlay`
- `/chat-overlay?obs=1`
- `/admin`

## Limitaciones

- El contenido editorial es base/mock para validar diseño y CMS.
- El chat flotante funciona localmente; Supabase Realtime queda preparado por SQL.
- Las imágenes son SVG internas para evitar dependencias externas y enlaces rotos.
- El CMS admin ya tiene base, pero la edición avanzada visual queda para Alpha 4.

## Próximo paso

Alpha 4 debe concentrarse en CMS real:
- editor visual,
- subida de imágenes,
- comentarios reales,
- reacciones reales,
- chat realtime,
- roles y moderación.
