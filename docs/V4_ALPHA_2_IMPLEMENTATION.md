# XETHKIOZ v4.0 Alpha 2 — Content, Chat & CMS Foundation

## Implementado

- Ampliación de contenido fallback por sectores: Gaming, Tech, IA, Ciencia, Streaming y Comunidad.
- Nuevas portadas SVG locales para artículos, videos, streaming, chat y CMS.
- Miniaturas para Media Center y Streaming Center.
- Links sociales centralizados en `src/lib/siteConfig.ts`.
- Chat Overlay revisado con modo OBS: `/chat-overlay?obs=1`.
- Nueva ruta corta `/chat-overlay`.
- Chat flotante de comunidad tipo Discord con salas: General, Gaming, IA, Ciencia y Streaming.
- Mensajes locales con `localStorage`, emojis rápidos y estructura preparada para Supabase Realtime.
- Migración SQL documental para `chat_rooms`, `chat_messages` y `cms_drafts`.

## Estado del chat flotante

Alpha 2 usa datos locales/mock para validar diseño y experiencia.
Alpha 3 debe conectar:

- Supabase Realtime.
- Usuarios logueados.
- Roles admin/mod/member.
- Moderación.
- Reportes.

## Verificación manual recomendada

- `/`
- `/news`
- `/gaming`
- `/tech`
- `/science`
- `/streaming`
- `/media`
- `/community`
- `/community/chat-flotante`
- `/chat-overlay`
- `/chat-overlay?obs=1`

## Notas

El canal de YouTube está marcado como enlace probable `@XETHKIOZ`; debe verificarse con el usuario antes de producción final.
