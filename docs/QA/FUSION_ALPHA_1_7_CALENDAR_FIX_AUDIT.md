# QA — Fusion Alpha 1.7 Calendar Fix

## Validaciones técnicas
- Drag start de cita existente incluye `isExisting: true`.
- Drop columns tienen `onDragOver` con `preventDefault`.
- Cambio de fecha dispara re-render porque `currentDate` es estado React.
- `dateKey` visible cambia al navegar entre días.
- Eventos existentes se reubican; elementos nuevos se crean.

## Validaciones visuales
- Fondo raíz: `#0B0A0F`.
- Paneles y columnas: `#16141F`.
- Bordes: `border-violet-500/10`.
- Acción principal: naranja eléctrico para `Hoy` y XP.
- Texto accesible en escala gris clara.

## Riesgos
- HTML5 DnD tiene comportamiento limitado en algunos navegadores móviles.
- Persistencia todavía local en memoria de React; Supabase debe integrarse en una fase posterior.

## Recomendación siguiente
Crear tabla `calendar_events`, RLS y persistencia real por usuario cuando Auth/roles queden estables.
