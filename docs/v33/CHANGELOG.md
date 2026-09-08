# World of Xethkioz — development changelog

## 2026-09-08 — v3.3-dev.5 / Izrdralar Reactive Lore Seeds
- Added persistent lore discovery state to GameState and save schema v4.
- Added reusable `lore_interactable.gd` for notes, signs, artifacts and environmental clues.
- Added five playable Izrdralar lore seeds: Nota doblada, Piedra resonante, Hoja de cálculo, Reloj sin agujas and Cartel de mantenimiento.
- Added Atlas HUD counter for discovered lore clues.
- NPC dialogue can now react to discovered lore through reusable contextual rules.
- Alexis, Ivan and Val now respond to specific environmental discoveries.
- The first quest conclusion reacts to Elida's note if the player found it before returning to Alexis.
- Added `docs/v34/IZRDRALAR_LORE_SEEDS.md` with diegetic foreshadowing rules for Desfralar, Xiomalar, Zodnight and Saga II without explicit expansion announcements.

## 2026-09-08 — Canon v3.4 / Expansion Structure
- Defined **Izrdralar** as the complete base game of WORLD OF XETHKIOZ.
- Defined **Desfralar** as Expansion I.
- Defined **Xiomalar** as Expansion II.
- Registered **Zodnight** as a possible Expansion III, intentionally undefined for now.
- Locked production scope: current demo and launch development remain focused on Izrdralar.
- Future-expansion lore may be seeded in the base game, but Desfralar/Xiomalar/Zodnight must not inflate the Steam demo or base-game production scope.
- Added `docs/v34/CANON_EXPANSIONS_v3_4.md` as the authoritative delta over v3.3 for product/expansion structure.

## 2026-09-08 — v3.3-dev.4
- Added persistent InventoryService and integrated it with SaveService.
- Added first data-driven items: Manzana de Bruma, Hongo Azul de Rocío and Ración del Bosque.
- Added gatherable world resources using the same interaction contract as NPCs.
- Added Botánica XP on gathering and Cocina XP on recipe completion.
- Added first playable recipe at a Fogón: 2 Manzanas de Bruma + 1 Hongo Azul de Rocío → 1 Ración del Bosque.
- Added compact live inventory readout to the HUD.

## 2026-09-08 — v3.3-dev.3
- Added reusable NPC interaction architecture (`interactable` group + generic NPC controller).
- Added `C` interaction input without consuming future Q/E/R/F combat slots.
- Added Alexis, Ivan and Val to the Golden Region greybox with canon-aligned placeholder dialogue.
- Reworked the intro quest into a real loop: talk to Alexis → investigate 3 altered creatures → return to Alexis → receive XP/crystals/bond reward.
- Added dialogue presentation layer to HUD.

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
- Added Izrdalar art-direction seed and vertical-slice backlog.

### Compatibility note
Historical scripts remain in the repository for traceability but are no longer the preferred extension point for v3.3 systems.
