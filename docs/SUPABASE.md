# SUPABASE — XETHKIOZ v4.0

## Objetivo

Supabase será la base de datos, autenticación y backend inicial del ecosistema.

## Reglas

- Mantener `profiles` como tabla central.
- Proteger datos con RLS.
- No exponer claves privadas.
- Usar `.env.example` para variables públicas.
- No subir `.env`.

## Variables

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Admin

El panel admin debe validar rol antes de permitir acciones CRUD.
