# DATABASE — XETHKIOZ v4.0

## Proveedor

Supabase.

## Tabla principal

Usar:

```txt
profiles
```

No usar:

```txt
creator_profiles
```

## Tablas previstas

- profiles
- articles
- categories
- authors
- comments
- reactions
- notifications
- streams
- media
- gallery
- games
- site_settings
- roles
- permissions
- analytics

## Reglas

- Toda tabla debe tener motivo documentado.
- Toda migración debe poder revertirse.
- Mantener seeds.
- Mantener backups.
- Revisar RLS antes de producción.
