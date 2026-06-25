# SECURITY — XETHKIOZ v4.0

## Prioridades

- RLS en Supabase.
- Roles y permisos.
- Admin protegido.
- Variables de entorno fuera del repo.
- No subir `.env`.
- No subir `node_modules`.
- No subir `dist`.

## Riesgos detectados

El repositorio público en GitHub muestra carpetas/archivos que deberían revisarse: `dist`, `node_modules` y `.env`.

## Acción recomendada

Limpiar el repositorio remoto en una rama segura antes del release estable.
