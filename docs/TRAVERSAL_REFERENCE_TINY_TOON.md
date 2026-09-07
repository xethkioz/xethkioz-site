# World of Xethkioz — Traversal Reference Study

Reference studied: Tiny Toon Adventures: Buster's Hidden Treasure (Mega Drive / Genesis, 1993), using a user-supplied ROM for identification and a full longplay for gameplay observation.

## Purpose
This document extracts high-level design principles only. World of Xethkioz must not copy proprietary code, maps, sprites, music, characters, exact level layouts or exact physics constants.

## What works in the reference
- Walk-to-run acceleration instead of instantly reaching maximum speed.
- Variable jump height depending on button hold.
- Slide requires existing momentum, so speed becomes a tool rather than a permanent state.
- Wall bounce expands vertical routes and secret access.
- Levels frequently support upper, middle and lower paths.
- Hidden exits and replayable stages reward exploration.
- Speed corridors alternate with precision-platforming rooms.
- Boss cadence is frequent enough to punctuate groups of stages.
- Simple controls create a large movement vocabulary through combinations.

## What World of Xethkioz should improve
- Preserve acceleration in the air enough to avoid the abrupt loss of flow reported in the original.
- Keep coyote time and jump buffering.
- Keep smoother variable-jump release rather than an abrupt downward drop.
- Use camera look-ahead at high speed.
- Use readable telegraphs before hazards in sprint corridors.
- Do not make maximum speed the default solution; exploration, combat and equipment remain equally important.

## Pacing observation
The full longplay is roughly 80 minutes. Normal traversal stages shown in the longplay commonly take around 1–3 minutes when played efficiently, with bosses commonly around one minute. World of Xethkioz is an Action-RPG/Survival Platformer, so its production target is longer:
- traversal micro-section: 45–120 sec
- authored map: 4–8 min first clear
- secret route / optional chamber: 1–4 min
- boss encounter: 2–5 min depending on progression and phase count

## v0.6 implementation targets
1. Ground-only momentum charge: walk -> run -> sprint.
2. Momentum slide unavailable from standstill.
3. Wall bounce.
4. Downward stomp/bounce combat interaction.
5. Variable jump + double jump retained.
6. Coyote time + jump buffer retained.
7. Camera look-ahead based on horizontal velocity.
8. Existing dash remains an ARPG resource-driven move and is distinct from natural sprint speed.
9. Future map pass: top/mid/bottom routes and hidden exits.
10. Future environment pass: springs, slopes, breakable shortcuts and one-way platforms.

## Design rule
Traversal should feel good even when there is no enemy, loot or quest objective on screen. Combat and RPG progression then sit on top of that movement foundation rather than compensating for weak platforming.
