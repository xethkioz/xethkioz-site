# XETHKIOZ v4.0.0-rc.4.0 — Stability Core

## Objetivo
RC4 no suma estética ni features grandes. Recupera estabilidad funcional para poder avanzar hacia V5/V6/V7 sin romper la base.

## Cambios clave
- Chat público fijado en sala `general` por defecto para que todos los visitantes vean el mismo flujo.
- Fallback local conservado, pero con cache RC4 separada para evitar arrastrar estados corruptos.
- Migración Supabase RC4 endurecida para `xeth_chat_messages`.
- Panel de salud del chat público agregado a `/qa`.
- Versionado actualizado a `4.0.0-rc.4.0`.

## QA obligatorio
1. `npm ci`
2. `npm run build`
3. `npm run preview`
4. Abrir dos navegadores o incógnito + normal.
5. En ambos abrir `/`.
6. Enviar mensaje en chat. Debe verse en ambos.
7. Abrir `/qa` y revisar Public Chat Health.
8. Abrir `/green-node`, `/news`, `/cms`, `/community`, `/network`.

## Supabase obligatorio para chat real
Aplicar:
`supabase/migrations/20260626_rc40_stability_core_public_chat.sql`

Después verificar en Supabase que la tabla `xeth_chat_messages` esté incluida en Realtime.
