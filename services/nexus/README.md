# XETHKIOZ Nexus Service

Realtime service for XETHKIOZ Nexus Chat.

## Local run

```bash
cd services/nexus
npm install
cp .env.example .env
npm start
```

## Render setup

- Root directory: `services/nexus`
- Build command: `npm install`
- Start command: `npm start`
- Runtime: Node 20+

## Required environment variables

```env
PORT=10000
CLIENT_ORIGINS=https://xethkioz.com.ar,https://www.xethkioz.com.ar
TRANSLATION_PROVIDER=mymemory
HUGGINGFACE_API_KEY=
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.3
```

After deploying the service, copy its public URL into the Vercel frontend variable:

```env
VITE_NEXUS_CHAT_URL=https://your-service.onrender.com
```
