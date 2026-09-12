# P06 — ASHLEY · RUNTIME CONTRACT

Status: Character Core functional integration candidate. Not final art. No new authored placement in M01–M05.

## Canon lock

- ID: P06 / Ashley.
- Age: 15.
- Role: Mentora de Ritmo y Cadencia / control rítmico de combate.
- Affinity: Luz Lunar / Resonancia Rítmica.
- Resonant bond: Killaruna.
- Existing M01–M05 mentor-power semantics remain protected; this isolated Character Core does not rewrite authored route progression.

## Implemented runtime states

- `idle_rhythmic`
- `walk_graceful`
- `lunar_crescent`
- `rhythm_cadence`
- `moon_phase_burst`
- `hurt`
- `downed` + timed recovery

## RhythmSystem contract

- Internal BPM clock emits `beat_pulse` at a stable interval.
- `rhythm_window_open()` exposes a narrow timing window around a beat.
- `rhythm_attack_multiplier()` returns neutral outside that window and a controlled bonus inside it.
- BPM and bonus values are implementation tuning, not narrative canon.

## Functional combat/support contract

- Accelerated graceful follow movement without teleporting.
- Lunar Crescent damages a compatible target only inside its authored runtime range.
- Rhythm Cadence buffs a compatible ally through `apply_rhythm_cadence(duration, multiplier)`.
- Moon Phase Burst affects only targets inside the burst radius, damages them and bridges stun through `apply_stun(duration)`.
- Burst stun duration is stronger if triggered during the rhythm timing window.
- Hurt/downed/recovery are functional.

## Visual contract

`AshleyRuntimeVisual` is a procedural placeholder-production renderer used only to validate silhouette, state readability, lunar VFX and rhythm feedback. It reports `P06_ASHLEY_PROTOTYPE_RENDERER_NOT_FINAL_ART` and must not be described as approved final sprite art.

## QA

Dedicated gate: `Izrdralar P06 Ashley Runtime Gate`.
Smoke validates identity/age/role/affinity/bond, BPM pulses, support movement, Lunar Crescent, Rhythm Cadence, Moon Phase Burst radius/stun, damage/downed/recovery and explicit provisional-renderer status under Godot 4.7.2.

## Placement rule

Do not add Ashley to authored M01–M05 NPC arrays solely because this runtime exists. Physical placement remains controlled by the canonical story/map contract.
