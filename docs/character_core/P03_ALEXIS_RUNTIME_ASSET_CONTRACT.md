# P03 — ALEXIS — RUNTIME ASSET CONTRACT

Estado: integración activa sobre Izrdralar M01–M05.

## Canon
- Alexis es mentor/NPC y compañero temporal de soporte.
- No reemplaza al Viajero como protagonista controlable.
- Afinidad: Hielo-Sombra.
- Vínculo: Dvalin.
- Estados aprobados: idle_down, idle_up, idle_left, idle_right, walk_heavy, frost_strike, shadow_step, trap_place, mentor_buff.

## Transporte de arte
- Cada estado se versiona como PNG independiente de 52×48 px.
- Runtime usa nearest filtering y escala 2× para lectura Pixel HD.
- Esta estrategia evita truncado de un atlas binario grande y permite verificación SHA por archivo.

## Reglas de integración
- El NPC genérico de Alexis permanece oculto sólo como compatibilidad de diálogo/contrato.
- `AlexisApprovedVisual` es la capa visible.
- El modo compañero temporal está desactivado por defecto.
- Las acciones de soporte no deben alterar balance o combate global hasta superar el gate P03 y la regresión M01–M05.
