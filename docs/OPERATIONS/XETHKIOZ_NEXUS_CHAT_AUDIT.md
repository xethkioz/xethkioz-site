# XETHKIOZ Nexus Chat - Technical Audit

Fecha: 2026-06-29
Rama: `rc5-nexus-chat`

## Alcance

Se agrega estructura de chat realtime separada en dos capas:

- Frontend Vite/React: widget flotante `NexusChatWidget`.
- Servicio Node independiente: `services/nexus`.

## Prevención de crasheos

- El widget no modifica rutas existentes.
- El widget se monta en un root separado desde `src/main.tsx`.
- No aparece dentro de `/cms` para evitar conflictos con el panel admin.
- Si falta `VITE_NEXUS_CHAT_URL`, el widget queda en modo setup y no intenta abrir sockets.
- El backend se despliega por separado y no bloquea el build estático de Vercel.

## Seguridad

- React renderiza texto como contenido escapado; no se usa `dangerouslySetInnerHTML`.
- Cliente limita nickname y mensajes antes de enviar.
- Servidor limpia caracteres de control y remueve `<` / `>` del contenido recibido.
- CORS limitado por `CLIENT_ORIGINS`.
- Helmet activo en Express.
- Rate limiting HTTP activo.
- Cooldown por socket para reducir spam.
- Tamaño máximo de payload Socket.io: `8192` bytes.
- Tokens de HuggingFace solo viven en el backend; nunca se exponen al frontend.

## Rendimiento

- Historial en memoria limitado por `HISTORY_LIMIT`.
- El cliente conserva como máximo las últimas 80 señales.
- El socket se abre solo al desplegar el widget.
- Reconnection attempts limitados a 5.
- Ping interval y timeout configurados.

## Escalabilidad

Estado actual: MVP realtime en memoria.

Para escalar:

1. Persistir historial en Supabase.
2. Mover presencia/salas a Redis o adapter compatible con Socket.io.
3. Separar traducción y bot en cola async.
4. Agregar moderación por rol cuando el sistema de usuarios esté estable.
5. Agregar auth JWT desde Supabase para apodos verificados.

## Variables

Frontend Vercel:

```env
VITE_NEXUS_CHAT_URL=https://your-nexus-service.onrender.com
```

Backend Render:

```env
PORT=10000
CLIENT_ORIGINS=https://xethkioz.com.ar,https://www.xethkioz.com.ar
TRANSLATION_PROVIDER=mymemory
HUGGINGFACE_API_KEY=
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.3
```

## Validación requerida

- Root frontend: `npm ci && npm run deploy:check`.
- Servicio Nexus: `cd services/nexus && npm install && npm start`.
- Vercel deploy de frontend.
- Render deploy de backend.
- Configurar `VITE_NEXUS_CHAT_URL` en Vercel y redeploy.
