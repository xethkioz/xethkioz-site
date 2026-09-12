# P05 — ELIDA · RUNTIME CONTRACT

Status: Character Core functional integration candidate. Not final art. Not authored placement in M01–M05.

## Canon lock

- ID: P05 / Elida.
- Role: Curadora / Soporte Principal.
- Affinity: Agua / Escudo Fluido.
- Resonant bond: Okuninust.
- M01–M05 continuity: Elida is referenced through dialogue/lore and the M04 note; this contract does **not** place her physically into M01–M05.
- Saga continuity: Elida later becomes a major emotional/support axis; her Zodnight death and Saga II soul arc remain outside this implementation scope.

## Implemented runtime states

- `idle_peaceful`
- `walk_calm`
- `water_surge`
- `hydro_shield`
- `okuninust_blessing`
- `hurt`
- `downed` + timed recovery

## Functional support contract

- Accelerated follow movement without teleporting.
- Water Surge heals Elida partially and a compatible nearby ally.
- Hydro Shield exposes a damage multiplier and bridges to targets that implement `apply_external_guard(duration, multiplier)`.
- Okuninust Blessing exposes an immunity timer and bridges to targets that implement `apply_status_immunity(duration)`.
- Sanctuary regenerates a compatible nearby ally while support mode is active.
- Damage/hurt/downed/recovery are functional.
- Compatible healing hooks: `heal`, `heal_support`, or `_heal`.

Tuning values in this runtime are implementation values for testing and are not promoted to narrative canon by this document.

## Visual contract

`ElidaRuntimeVisual` is procedural placeholder-production rendering used to validate silhouette, state readability and VFX integration. It reports `P05_ELIDA_PROTOTYPE_RENDERER_NOT_FINAL_ART` and must not be described as approved final sprite art.

## QA

Dedicated gate: `Izrdralar P05 Elida Runtime Gate`.
Smoke validates identity, role/affinity/bond, movement, three support actions, Sanctuary, damage/downed/recovery and explicit provisional-renderer status under Godot 4.7.2.

## Placement rule

Do not add Elida to authored M01–M05 NPC arrays solely because the runtime exists. Physical placement requires the corresponding canonical Refuge/story beat.
