# XETHKIOZ Fusion Alpha 0.3 — Inventory & Safety Lock

## Objetivo

Congelar una línea de trabajo segura antes de tocar visual fuerte o SQL. Esta versión no intenta mejorar la estética; intenta evitar volver a romper producción.

## Estado público actual

Rutas públicas activas:

- `/` — Home / núcleo actual.
- `/gaming` — Portal Gaming.
- `/science` — Science Lab.
- `/fun` — Fun Portal.
- `/green-node` — Green Node / Wisp Nexus.

Rutas heredadas redirigidas:

- `/news` → `/gaming`.
- `/community` → `/fun`.
- `/admin` → `/`.
- `/cms` → `/`.

## Componentes críticos

- `src/App.tsx` — routing principal y `AppErrorBoundary`.
- `src/components/Header.tsx` — controles globales: idioma, sonido y cuenta.
- `src/lib/LangContext.tsx` — idioma ES/EN persistido en `localStorage`.
- `src/pages/Home.tsx` — entrada actual del ecosistema.
- `src/pages/GreenNode.tsx` — zona Green/Wisp.

## Regla de seguridad

No volver a usar imágenes como interfaz completa. Los assets pueden ser fondo o atmósfera, pero navegación, portales, Wisp, controles y contenido deben ser componentes reales.

## Decisión sobre SQL

No se aplica ninguna migración en Alpha 0.3. Las carpetas `database/migrations` y `supabase/migrations` quedan en inventario para clasificación posterior.

## Próximo bloque recomendado

Fusion Alpha 0.4:

1. Crear rama de recuperación visual.
2. Separar `WorldShell`/layout visual de `App.tsx`.
3. Preparar contratos de datos para portales.
4. Recién después empezar la Home cinematográfica por capas.
