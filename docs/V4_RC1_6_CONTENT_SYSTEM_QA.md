# XETHKIOZ v4.0 RC1.6 — Content System + Final Network UX QA

## Objetivo

Cerrar la base editorial de XETHKIOZ Network antes de avanzar a integración real de Supabase, APIs/RSS y automatizaciones de IA.

## Cambios principales

- Nuevo `/content-system` como tablero del sistema editorial.
- Nuevo `/qa` como tablero de revisión final antes de LIVE.
- `ContentOpsDashboard` para separar tipos de contenido:
  - Noticias propias.
  - Radar externo diario.
  - Informes Science Lab.
  - Green Node logs.
  - Videos/directos.
  - Comunidad.
- `NetworkFinalQaPanel` para enlaces, rutas, SQL, Wisp, Science Lab, CMS y producción.
- Wisp con aparición menos invasiva por ruta y secuencia secundaria `wisp`.
- Migración SQL incremental `20260625_rc16_content_system_final_qa.sql`.
- Versionado actualizado a `v4.0.0-rc.1.6`.

## Reglas editoriales consolidadas

1. Las noticias externas no se copian: se atribuyen, se enlazan y se convierten en análisis propio.
2. Science Lab exige fuente, evidencia, fecha y contexto.
3. Green Node mantiene enfoque educativo/defensivo/documental.
4. Donadores pueden obtener beneficios e insignias, pero no moderación automática.
5. La moderación temporal requiere actividad positiva, confianza y aprobación.

## Rutas nuevas

- `/content-system`
- `/qa`

## SQL

Aplicar después del baseline RC1.5:

```sql
supabase/migrations/20260625_rc16_content_system_final_qa.sql
```

o copia equivalente en:

```text
database/migrations/20260625_rc16_content_system_final_qa.sql
```

## Pendiente para RC2

- Conectar CMS Studio a Supabase real.
- Guardar cola editorial real.
- Implementar RSS/API fuente por fuente.
- Realtime para chat y eventos Wisp.
- Roles/RLS por permisos definitivos.
- Generación IA de borradores con revisión humana.
