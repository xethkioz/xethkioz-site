# Netlify Environment Variables — XETHKIOZ

Configurar en:

```txt
Netlify → Site configuration → Environment variables
```

Variables obligatorias:

```txt
VITE_SUPABASE_URL=https://pascicauudfyydzknoop.supabase.co
VITE_SUPABASE_ANON_KEY=tu_publishable_key
```

Variables opcionales:

```txt
VITE_ADMIN_ACCESS_CODE=
VITE_GA4_ID=
VITE_CLARITY_ID=
VITE_FACEBOOK_PIXEL_ID=
```

## Prohibido

Nunca configurar en frontend:

```txt
SUPABASE_SERVICE_ROLE_KEY
SERVICE_ROLE
sb_secret_...
```

La service role solo puede vivir en backend seguro, funciones server-side o Supabase Edge Functions.
