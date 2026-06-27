# Fusion Alpha 1.7 — Calendar Drag & Drop Fix

## Objetivo
Corregir el módulo de calendario operativo para XETHKIOZ Fusion Platform.

## Cambios
- Agregado `FusionCalendarGrid.tsx`.
- Agregada ruta `/calendar` mediante `CalendarHub.tsx`.
- `currentDate` ahora usa `useState`.
- `dateKey` se deriva con `useMemo` desde `currentDate`.
- `onExistingDragStart` transfiere payload con `isExisting: true`.
- Las drop zones usan `onDragOver={(event) => event.preventDefault()}`.
- `handleColumnDrop` diferencia eventos existentes vs nuevos.
- Estética base Cyberpunk 3000 según regla 60-30-10.

## Seguridad
- El payload drag se parsea con función segura y valida `isExisting`.
- No se agregaron llamadas Supabase ni mutaciones backend.
- Sin SQL nuevo.

## Validación
- `npm run build` exitoso.
