# P07 — FERMÍN · RUNTIME CONTRACT

Status: Character Core functional integration candidate. Not final art. No new authored placement in M01–M05.

## Canon lock

- ID: P07 / Fermín.
- Age: 13.
- Role: Mentor de Fuerza e Impacto / control de masas y terreno.
- Affinity: Tierra / Densidad Sísmica.
- Resonant bond: Mozaruk.

## Implemented runtime states

- `idle_sturdy`
- `walk_heavy_step`
- `ground_slam`
- `rock_armor`
- `seismic_charge`
- `hurt`
- `downed` + timed recovery

## SeismicSystem contract

- Ground Slam affects only targets inside its radial range and bridges damage, stun and knockback.
- Rock Armor applies real incoming-damage mitigation for a limited duration.
- Seismic Charge moves Fermín through physics over time; it is not a teleport. Crossed targets can be damaged and knocked back once per charge.
- Compatible target hooks: `take_damage(amount)`, `apply_stun(duration)`, `apply_knockback(direction, strength)`.
- Damage, speed, radius, mitigation and timing values are implementation tuning, not narrative canon.

## Movement/support

- Accelerated heavy-step follow movement without teleporting.
- Hurt, downed and recovery are functional.

## Visual contract

`FerminRuntimeVisual` is a procedural placeholder-production renderer for state readability, ground cracks, debris, armor and charge feedback. It reports `P07_FERMIN_PROTOTYPE_RENDERER_NOT_FINAL_ART` and must not be described as approved final sprite art.

## QA

Dedicated gate: `Izrdralar P07 Fermin Runtime Gate`.
Smoke validates identity/age/role/affinity/bond, support movement, Ground Slam radius/damage/stun/knockback, Rock Armor mitigation, physical Seismic Charge movement/hit, hurt/downed/recovery and provisional-renderer status under Godot 4.7.2.

## Placement rule

Do not add Fermín to authored M01–M05 NPC arrays solely because this runtime exists. Physical placement remains controlled by canonical story/map requirements.
