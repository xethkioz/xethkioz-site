# PR9 PRE-MERGE CHECKLIST — `/api/generate-news`

Base estable: `v7.0.0-fusion-rc4`  
PR: `#9 feat(api): add generate-news scaffold`  
Rama: `feature/api-generate-news`  
Destino: `main`

## Estado confirmado

- PR #9 abierto.
- PR #9 mergeable.
- Vercel preview READY.
- `deploy:check` local reportado como PASS.
- `npm audit` reportado con 0 vulnerabilities.
- Migración Supabase ejecutada manualmente desde SQL Editor.
- Tablas verificadas:
  - `news_articles`
  - `news_audit_log`

## Validaciones pendientes antes del merge

### 1. Variables de entorno en Vercel

Confirmar en Vercel Project Settings > Environment Variables:

- `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Regla:

- `SUPABASE_SERVICE_ROLE_KEY` debe existir solo como variable privada server-side.
- No debe tener prefijo `VITE_`.
- Debe estar disponible al menos en Preview y Production.

### 2. Rol admin en Supabase

Confirmar que el usuario que va a usar la API tenga rol admin en metadata.

Consulta sugerida:

```sql
SELECT
  id,
  email,
  raw_app_meta_data->>'role' AS app_role,
  raw_user_meta_data->>'role' AS user_role,
  created_at
FROM auth.users
ORDER BY created_at DESC;
```

Criterio:

- El usuario operativo debe tener `app_role = admin` o `user_role = admin`.

### 3. Prueba real del endpoint

Después de confirmar variables y rol admin, ejecutar una prueba real con token admin.

Resultado esperado:

- HTTP 201.
- Draft creado en `news_articles`.
- Evento creado en `news_audit_log`.

## Decisión de merge

El PR puede mergearse solo cuando estén confirmados:

- Variables Vercel OK.
- Rol admin OK.
- Prueba real OK o aprobación explícita del usuario para mergear como scaffold sin prueba runtime.

## Próxima rama sugerida después del merge

```txt
feature/cms-generate-news
```

Objetivo:

- Crear UI dentro del CMS para generar drafts usando `/api/generate-news`.

## Nota para Gemini

Registrar este archivo como fuente operativa del pre-merge de PR #9.

## Nota para Qwen

Mantener IA-OS separado. No tocar `main`. No activar LLM ni agregar dependencias nuevas en este PR.
