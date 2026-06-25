# XETHKIOZ v4.0 RC1.5 — Database + Network Review

## Base oficial

- Version: `v4.0.0-rc.1.5`
- Build: `2026-06-25`
- Codename: `Network Database Baseline + General Review`

## Objetivo

Dejar una línea base sólida para continuar desde XETHKIOZ Network sin seguir acumulando tablas o páginas sueltas.

## Cambios principales

### 1. Supabase baseline

Se agregó una migración consolidada:

```txt
supabase/migrations/20260625_rc15_network_database_baseline.sql
```

Incluye base para:

- portales de XETHKIOZ Network;
- Science Lab formal;
- Green Node y Wisp events;
- CMS publication jobs;
- noticias externas con atribución;
- roles, XP, insignias y moderación;
- donor tiers;
- article SEO fields;
- tags normalizados.

### 2. Panel de revisión DB

Se agregó `DatabaseBaselinePanel` en:

- `/network`
- `/cms`

Sirve como checklist técnico visible para revisar qué módulos de Supabase sostienen cada parte del ecosistema.

### 3. Wisp mejorado

El Wisp ahora:

- cambia posición según la ruta;
- registra cantidad de clicks en `localStorage`;
- conserva estado descubierto;
- mantiene acceso por secuencia `greennode`;
- muestra mejor señal visual antes de abrir Green Node.

### 4. Green Node

Se mantiene como sección oculta/EGG. No debe exponerse como una categoría común del menú principal.

Regla editorial:

- Linux, programación, ciberseguridad defensiva y OSINT ético.
- Misterios y teorías solo como análisis documental.
- Nada ofensivo, ilegal o presentado como verdad sin evidencia.

### 5. Science Lab

Se consolida como división formal separada visualmente del portal gamer/tech.

Campos previstos:

- fuente;
- DOI;
- nivel de evidencia;
- fecha de revisión;
- fuente primaria/institucional;
- estado editorial.

## Antes de LIVE

1. Ejecutar `npm install`.
2. Ejecutar `npm run build`.
3. Revisar `/network`, `/cms`, `/science`, `/green-node`, `/news-engine`, `/roles`.
4. Hacer backup de Supabase.
5. Ejecutar migraciones SQL manualmente en orden.
6. Verificar que `.env`, `node_modules`, `dist` y `tsconfig.tsbuildinfo` no se suban.

## Estado

RC1.5 deja lista la base para seguir con:

- contenido dinámico real;
- CMS conectado;
- Supabase Realtime;
- perfiles y XP reales;
- carga editorial del portal.
