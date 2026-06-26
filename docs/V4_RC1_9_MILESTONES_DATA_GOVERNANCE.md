# XETHKIOZ v4.0 RC1.9 — Milestones + Data Governance

## Objetivo

Ordenar el crecimiento de XETHKIOZ Network por hitos, no por paginas sueltas. Esta version agrega un tablero de progreso, matriz de datos y reglas comunitarias base para sostener v4.0 Stable y preparar v5.0.

## Nuevas rutas

- `/milestones`: plan maestro del proyecto.
- `/network`: ahora integra roadmap, datos y progresion comunitaria.

## Nuevos componentes

- `MilestoneRoadmap`
- `DataGovernanceMatrix`
- `CommunityProgressionMatrix`

## SQL agregado

Migracion: `20260625_rc19_milestones_data_governance.sql`

Tablas nuevas:

- `platform_milestones`
- `platform_milestone_tasks`
- `service_backlog`
- `community_progression_rules`

## Principio de comunidad

Las donaciones pueden aportar beneficios, insignias y prioridad comunitaria, pero no deben otorgar moderacion automaticamente. La moderacion temporal depende de historial, reputacion y aprobacion del staff.

## QA recomendado

```powershell
npm install
npm run build
npm run dev
```

Rutas a revisar:

- `/`
- `/network`
- `/milestones`
- `/content-system`
- `/roles`
- `/science`
- `/green-node`
- `/ai-lab`
- `/creator-studio`
