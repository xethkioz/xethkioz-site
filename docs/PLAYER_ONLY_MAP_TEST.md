# WORLD OF XETHKIOZ — PLAYER ONLY MAP TEST

Branch: `game/player-only-map-test-20260910`
Engine target: Godot 4.7.2

## Scope

This branch is an isolated test baseline for continuing map construction with only P01 / PLAYER active.

Active runtime pieces:
- P01 / PLAYER using `res://src/player/player_controller_production.gd`.
- Golden Region production chunks and deterministic terrain.
- Player collision body.
- Camera2D with smoothing and world limits.
- Chunk streaming around the player.
- World boundary collisions.
- Keyboard controls and apprentice Q/E/R kit.

Explicitly NOT instantiated:
- Xethkioz.
- Familiar companion.
- Alexis.
- Ivan.
- Elida.
- Ashley.
- Fermín.
- Isabella.
- Gael.
- Gustavo.
- Andrea.
- Val.
- Rola.
- Mela.
- enemies.
- capturable creatures.
- NPC interaction/services.
- encounter director.

## Controls

- WASD / arrows: movement.
- SHIFT: dash.
- J: melee attack.
- Q / E / R: apprentice abilities.
- C: interaction input; there are intentionally no NPC targets in this test.

## Test objective

Validate PLAYER independently before integrating any other character package:
1. clean project import/parser;
2. spawn at Golden Region start point;
3. movement and facing;
4. collision against chunk blockers and world edges;
5. dash movement;
6. camera following and limits;
7. chunk streaming while crossing sectors;
8. player visual/profile overlay stability;
9. no character/NPC scripts required by the test scene.

## Status rule

Static/project wiring can be audited in repository. Runtime is only considered validated after opening this branch with Godot 4.7.2 and running the scene without parser/runtime errors.
