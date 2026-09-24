# TECH DEBT — XETHKIOZ Web 11

**Revisión:** 2026-09-24

## Alta prioridad

- Proteger `main` y exigir checks de CI antes de merge.
- Reducir cientos de ramas históricas/mergeadas.
- Separar Factura Salud del repositorio web.
- Mantener Browser Quality en verde con el diseño vigente.
- Definir una única fuente canónica de documentación operativa.

## Media prioridad

- Consolidar migraciones duplicadas entre `database/migrations` y `supabase/migrations` después de reconciliar el historial aplicado.
- Mover notas históricas de raíz a un archivo documental.
- Inventariar páginas/componentes sin imports antes de borrarlos.
- Decidir si `services/nexus` será workspace formal o repositorio separado.
- Agregar cobertura unitaria para helpers, auth, sanitización y APIs.

## Performance / repositorio

- Mover videos grandes de larga duración a object storage/CDN cuando sea viable.
- Deduplicar blobs multimedia idénticos.
- Mantener budgets Lighthouse y bundle contract.

## Seguridad

- Migrar rate limiting sensible a almacenamiento distribuido si aumenta el tráfico.
- Reducir gradualmente dependencias de CSP que requieran `unsafe-inline`.
- Mantener revisión de grants/RLS y políticas de privacidad.

## Regla de limpieza

No borrar por nombre o antigüedad. Primero confirmar referencias/imports, historial aplicado y ruta de rollback; luego limpiar por PRs pequeños.
