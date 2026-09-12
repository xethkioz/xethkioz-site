# P04 — IVÁN · Runtime Contract v1.0

Estado: integración funcional M02 / rama PR #245.

## Canon protegido
- Iván es científico cuántico y soporte técnico/táctico.
- Su motivación central incluye encontrar/rescatar a Andrea de la Isla Temporal.
- Afinidad funcional: Rayo / Energía Cuántica.
- Resonante: Itzuke.
- Itzuke es un Resonante Primario; **no es dron, herramienta ni dispositivo de Iván**.
- En M02 Iván analiza el medidor sin batería y entrega/sincroniza el Prisma-Atlas I-01.
- El reposicionamiento cuántico pertenece a Iván. No desbloquea fast travel del Viajero.
- No lee Input directo: es NPC controlado por IA/guion.

## Estados runtime
`idle_calculating`, `walk_fast`, `lightning_strike`, `quantum_teleport`,
`emp_field`, `overclock_buff`, `analyze_device`, `hurt`, `downed`.

## Contrato transversal
- soporte de campo desactivado por defecto;
- follow/reposition con aceleración, sin snap de locomoción normal;
- salud/reacción/KO y recuperación temporal;
- interacción y diálogo authored heredados;
- VFX mediante `IzrdralarFxFactory`;
- teletransporte cuántico corto y limitado;
- no altera al Player al reposicionarse.

## Arte
La capa `ivan_runtime_visual.gd` es una silueta funcional original de producción,
basada en la paleta técnica aprobada de P04. No se declara arte final. Puede ser
reemplazada por sprites finales sin modificar la lógica del actor.

## QA
`IzrdralarP04IvanRuntimeSmoke` verifica:
- especialización real en M02;
- generic atlas oculto;
- visual contract propio;
- Itzuke como vínculo;
- prohibición de fast travel/direct Input;
- cinco acciones;
- movimiento acelerado;
- quantum reposition sólo de Iván;
- hurt/HP.
