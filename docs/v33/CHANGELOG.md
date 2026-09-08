# World of Xethkioz — v3.3 development changelog

## 2026-09-08 — v3.3-dev.2 / Canon Freeze
- Promoted the consolidated Game Bible v3.3 to production source of truth.
- Locked campaign gates, XP formula `100 + 40L + 10L²`, level cap 60 and Steam demo scope.
- Locked Golden Region 1-5 as the only public-demo production target until quality gates are met.
- Corrected GameState XP logic to match canon and bumped save schema to 3.
- Reworked CI so scripts that depend on autoloads are validated through full project import/boot instead of invalid standalone checks.
- Kept historical scripts/assets for traceability; v3.3 modular `src/` remains the only preferred extension point.

## 2026-09-08 — v3.3-dev.1
- Created branch `game/xethkioz-v33-vertical-slice`.
- Froze v3.2 as canonical baseline.
- Confirmed Godot 4.7.2 stable as production engine.
- Introduced modular `src/` architecture.
- Added EventBus, GameState and SaveService.
- Added greybox player combat, enemy AI, XP/levels and Xethkioz follower.
- Added simplified quest, weather, world clock and HUD.
- Added Izrdralar art-direction seed and vertical-slice backlog.

### Compatibility note
Historical scripts remain in the repository for traceability but are no longer the preferred extension point for v3.3 systems.
