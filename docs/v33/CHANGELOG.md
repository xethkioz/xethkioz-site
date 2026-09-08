# World of Xethkioz — development changelog

## 2026-09-08 — v3.3-dev.9 / Bestiary + Legendary Separation
- Added in-game Prisma-Atlas Familiar inspection overlay on `B`.
- Bestiary now shows active Familiar name, primary affinity, recommended mentor, training rank, Familiar bond and unlocked technique.
- Explicitly separated all eight legendary species from the common capture/assessment/training pipeline.
- Common capture now rejects Xethkioz, Itzuke, Mozaruk, Killaruna, Heller, Kahezer, Okuninust and Dvalin.
- Familiar training refreshes active Familiar UI state after Rank I unlock.
- Closed issue #241 after completing Val assessment → sibling mentor → playable Fermín training → `embate_cristal` → inspect UI.
- Godot 4.7.2 CI passed import/compile and vertical-slice boot on gameplay head `7e1ae718ecf7051b839620031ea4bd3c671a630e`.

## 2026-09-08 — v3.3-dev.8 / Steam Demo Closure Loop
- Extended the playable Golden Region route from Lago Encantado through a complete demo ending.
- Added `DemoEncounterDirector` to keep staged encounters/NPC reveals decoupled from the large world controller.
- Added Santuario de las Raíces miniboss: `custodio_raices_menor`.
- Added functional Boss 5 `Guardián del Bosque Velado` with three combat phases: direct pressure, terrain/root pulse, and protected/exposed core windows.
- Added post-Boss 5 return to Elida and reveal of Ashley, Fermín, Isabella and Gael as selectable initial mentor paths.
- Added persistent mentor selection and Paso Prismático traversal upgrade.
- Added playable Fermín Rank I Familiar training: break three Impact training cores, return to Fermín, unlock `embate_cristal` for Carpinchito de Cristal.
- Bumped save schema to v6 for mentor/traversal/training state.
- Updated issues #238 and #241 to reflect current playable scope and remaining Steam-demo work.
- Godot 4.7.2 CI passed import/compile, vertical-slice boot and source snapshot on gameplay head `990d98ec86d18ddce6405a48a578b76fdf3c89dd`.

## 2026-09-08 — v3.3-dev.7 / Izrdralar Presentation Pass
- Added `src/world/izrdralar_visual_layer.gd` as a presentation-only layer for the Golden Region vertical slice.
- Added first non-greybox environmental shapes for terrain, Lago Encantado, ruins, vegetation and prism accents while keeping collisions/gameplay separated.
- Redesigned the gameplay HUD around Viajero vitality, quest tracking, Xethkioz/Familiar, Q/E/R/F abilities, world/Atlas information and dialogue.
- Created editable Figma reference `WORLD OF XETHKIOZ — HUD & Izrdralar UI v0.1` at 640×360.
- Production visual work is tracked in issue #242.

## 2026-09-08 — v3.3-dev.6 / Lago Encantado + First Familiar
- Added first peaceful deterministic Familiar capture: Carpinchito de Cristal using Manzana de Bruma.
- Added Rola and Mela to Lago Encantado with capture guidance dialogue.
- Val can assess the active Familiar and reveal affinity + recommended sibling mentor.
- First Familiar stores affinity, mentor, assessment and training-rank scaffold in persistent save state.
- Active Familiar now follows the player and is shown in the HUD.
- Added diagnostic artifacts and source snapshots to Godot CI.
- Validated Godot 4.7.2 import/compile and vertical-slice boot on `b1824181475870a261c84a57bca37a0dfef5e3f0` and documentation head `33a88143326887a3e3277352a6a548d586749505`.

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