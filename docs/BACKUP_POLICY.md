# BACKUP POLICY — XETHKIOZ

## Antes de cambios grandes

Crear backup local:

```txt
Web_BACKUP_LOCAL_FECHA
```

## Antes de migraciones SQL

- Exportar esquema.
- Exportar datos críticos.
- Guardar migración en `database/migrations`.
- Guardar rollback si corresponde.

## Antes de release

- Build exitoso.
- Git limpio.
- Changelog actualizado.
- Roadmap actualizado.
