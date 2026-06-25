# XETHKIOZ v4.0 RC1 — Dynamic News + Roles + Admin Foundation

Fecha: 2026-06-25  
Base: v4.0.0-alpha.4 · Portal PRO Polish + CMS Studio + Live Readiness  
Nueva versión propuesta: v4.0.0-rc.1

## Objetivo

Cerrar la web clásica de XETHKIOZ con base funcional para pasar de portal estático a plataforma administrable:

- noticias propias desde CMS;
- fuentes externas configurables;
- roles y escalafón de usuarios;
- XP e insignias;
- moderación temporal;
- comentarios y reacciones;
- preparación para actualización diaria;
- SQL preparado para Supabase.

## Cambios agregados

### Dynamic News Engine

Se agregó:

- `src/lib/newsSources.ts`
- `src/components/DailyNewsSourcesPanel.tsx`
- `src/pages/NewsEngine.tsx`
- ruta `/news-engine`

Incluye fuentes iniciales para:

- Gaming
- Tecnología
- IA
- Ciencia
- Streaming
- Asia Gaming

Regla editorial: XETHKIOZ no copia artículos completos. Usa fuentes como disparador, atribuye y publica resumen/análisis propio.

### Roles y escalafón

Se agregó:

- `src/lib/roles.ts`
- `src/components/RoleLadder.tsx`
- `src/pages/RolesDashboard.tsx`
- ruta `/roles`

Roles base:

- Visitante
- Miembro
- Colaborador
- Donador
- Embajador
- Moderador Temporal
- Moderador
- Editor
- Sponsor
- Administrador

### CMS Studio ampliado

El CMS ahora muestra también:

- panel de fuentes externas;
- reglas editoriales;
- sistema de roles/XP;
- política de moderación.

### SQL

Se agregó migración:

- `database/migrations/20260625_v4_rc1_dynamic_news_roles.sql`
- `supabase/migrations/20260625_v4_rc1_dynamic_news_roles.sql`

Tablas previstas:

- `news_sources`
- `external_news_items`
- `user_xp_events`
- `user_badges`
- `moderation_assignments`
- `article_comments`
- `article_reactions`

## Pendientes antes de LIVE Final

- Ejecutar migración SQL en Supabase.
- Confirmar valores reales de `profiles.role`.
- Activar políticas RLS admin/editor definitivas.
- Conectar CMS Studio a tablas reales.
- Crear edge function o backend para RSS/API.
- Conectar comentarios y reacciones reales.
- Probar responsive final.
- Ejecutar `npm run build`.
- Revisar `/news-engine`, `/roles`, `/cms`, `/admin`, `/news`, `/article/:slug`.

## Nota sobre música para Green Node

El enlace de YouTube puede usarse como referencia estética, pero para producción conviene usar un track propio, generado por IA o con licencia explícita sin copyright. No integrar audio de terceros sin permiso claro.
