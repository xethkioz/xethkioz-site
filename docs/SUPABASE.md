# SUPABASE — XETHKIOZ v4.0

## Objetivo

Supabase es la base de datos, autenticación, realtime y backend inicial del ecosistema XETHKIOZ.

## Reglas de oro

- Mantener `profiles` como tabla central de usuario.
- Proteger datos con RLS.
- No exponer claves privadas.
- No subir `.env` al repositorio.
- Usar `.env.example` como referencia pública.
- Usar `VITE_*` solo para variables públicas de frontend.
- Nunca poner `service_role`, `sb_secret_*` o claves privadas dentro del frontend.

## Variables públicas frontend

Local:

```txt
.env
```

Vercel:

```txt
Project Settings -> Environment Variables
```

Variables necesarias:

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

`VITE_SUPABASE_URL` debe tener formato:

```txt
https://PROJECT_ID.supabase.co
```

`VITE_SUPABASE_ANON_KEY` puede ser:

```txt
sb_publishable_*
```

o una anon key JWT antigua:

```txt
eyJ...
```

## Variables privadas backend

Solo para funciones servidor, si se usan:

```txt
SUPABASE_SERVICE_ROLE_KEY
```

No debe tener prefijo `VITE_`.
No debe aparecer en bundles de navegador.
No debe subirse al repo.

## Tablas principales

```txt
profiles
news_articles
news_audit_log
chat_rooms
chat_messages
```

## Chat realtime

El chat global usa:

```txt
chat_rooms
chat_messages
```

Si el widget muestra `LOCAL`, revisar:

```txt
1. VITE_SUPABASE_URL en Vercel Production
2. VITE_SUPABASE_ANON_KEY en Vercel Production
3. Redeploy posterior a cargar variables
4. SQL realtime ejecutado en Supabase
```

## Noticias

El feed público `/news` lee:

```txt
public.news_articles
```

Condición pública:

```txt
status = published
```

El CMS edita y publica desde:

```txt
/cms/news
/cms/news/:id
/cms/generate
```

## Validación local

```bash
node scripts/env-ready-check.mjs
npm run build
```

## Admin

El panel admin debe validar rol antes de permitir acciones CRUD.

Rutas principales:

```txt
/cms
/cms/news
/cms/generate
```
