# WORLD OF XETHKIOZ — Reference Libraries Audit

## Scope
This note catalogs external/user-supplied technical/reference material intended to accelerate WORLD OF XETHKIOZ. Reference projects are not imported wholesale into the Godot project. Mechanics, map structure, editor workflows and specifically compatible assets may be adapted after license review.

## Ruby Library 3.3.0.rar
- ~1,444 entries.
- Dominant groups: Bundler, RubyGems, RDoc, IRB, JSON, OpenSSL, CSV, YAML/Psych, URI, networking and utilities.
- Language/runtime: Ruby 3.3 ecosystem.
- Relevance to Godot/GDScript: indirect. Useful mainly as reference for utility patterns, packaging, serialization, dependency/tooling concepts and algorithms; not plug-and-play for Godot.

## Plugins.rar
- ~479 entries.
- Appears to be a collection of Ruby/Pokémon Essentials-style plugins and utilities.
- High-value concepts to study/port into native GDScript architecture:
  - Advanced AI System
  - Continuous Weather Animations
  - Dynamic Darkness
  - Map Zoom
  - Multi Save
  - damage numbers
  - companion following
  - Modular UI Scenes / Enhanced UI
  - Side Stairs
  - Level Caps
  - overworld encounters
  - animated title screen
  - debugging utilities
  - Discord RPC / overlays as future optional integrations

## Solarus 2.1.3 Windows x64
- User-supplied package inspected: ~977 archive entries, including offline engine documentation, Lua API docs and file-format specifications for maps, tilesets, sprites, shaders, dialogs, sounds and quest data.
- Solarus engine licensing documented in the supplied package: GNU GPL v3.
- Solarus documentation explicitly separates engine licensing from quest/content licensing: the engine is GPL; quest files can use another license, but importing GPL Lua code into a quest can impose GPL obligations on that codebase.
- WORLD OF XETHKIOZ remains on Godot 4.7.2; Solarus is a reference implementation, not a replacement engine.
- High-value concepts to study:
  - top-down action-adventure map/entity architecture
  - tileset/map data separation
  - Lua-style event-driven entity interactions
  - hero/camera/map transitions
  - collision and traversal conventions
  - sprite/animation resource organization
  - dungeon/interior/overworld composition
  - quest packaging and data-driven content

## Tuxemon / GitHub
Repository: `Tuxemon/Tuxemon` (development branch inspected).

### Code
- Free/open-source monster RPG.
- Code license: GNU GPL v3 or later, except bundled `lib` components which may have their own licenses.
- Useful architecture described by its README:
  - data-driven JSON game data
  - maps authored in Tiled
  - map scripting and NPC interactions
  - localization
  - keyboard/mouse/gamepad input
  - animated maps
  - CLI/live debugging
  - documented save system
- Do not paste GPL Python modules directly into WORLD OF XETHKIOZ unless we deliberately accept the corresponding GPL obligations. Prefer clean-room reimplementation of mechanics/architecture in GDScript.

### Assets
- Tuxemon maintains a detailed `ATTRIBUTIONS.md`; asset licenses are per-item, not one uniform license.
- Examples include CC BY-SA 4.0, CC BY and CC0 assets.
- Therefore landscape/structure/tileset assets may be candidates for direct reuse only when the exact source asset has a compatible license and required attribution/share-alike conditions are satisfied.
- Prefer CC0/clearly permissive generic terrain/structure assets for direct production use; otherwise use them as visual reference and recreate/adapt a WORLD OF XETHKIOZ-specific equivalent.
- Never carry over Tuxemon names, monsters, story, logos or distinctive branded elements.

## TopdownStarter
User-supplied archive: `TopdownStarter-6075a3e651639a7181333f9873e91d9b4333a667.zip`.
Public source reviewed: `ForlornU/TopdownStarter`.
- License: MIT at repository root.
- Runtime target: Godot 4.2 or later; patterns are directly portable to Godot 4.7.2 after adaptation.
- Project examples include two levels, enemies, NPC conversations, quests, pickups, 2D lighting/shadows, music/SFX, signals, tweening and timers.
- Architecture includes finite-state machines for both player and enemies and inheritance across units/states.
- High-value patterns for WORLD OF XETHKIOZ:
  - readable enemy state transitions rather than permanent straight-line chase
  - attack windup/recovery states
  - hit flash and impact particles
  - lightweight state-driven animation control
  - explicit quest/pickup feedback
- Production decision: use the architecture/patterns as reference and reimplement them inside Xethkioz controllers rather than importing the starter wholesale.
- Implemented adaptation: production enemies now use idle/patrol/chase/windup/recover/return states with telegraphed melee/ranged attacks and stagger feedback.

## action-rpg-template
User-supplied archive: `action-rpg-template-main.zip`.
Public source reviewed: `KonyD/action-rpg-template`.
- Runtime target: modern Godot 4.x action-RPG architecture.
- Useful concepts include modular components, reusable gameplay composition and integration of a dialogue-manager addon.
- The public repository does not expose a single clear root license covering all bundled project content in the same way as TopdownStarter; bundled addons/assets may have separate licenses.
- Production decision: reference-only until license provenance is clear per code/asset. Do not copy source or art directly into the commercial build without a verified compatible license.
- Best use: compare component boundaries, attack/interaction architecture and dialogue workflow against our existing modular Godot implementation.

## Fantasy Character Pack — Dragon Knight
User-supplied archive: `fcp-dragon-knight.zip`.
- Appears to correspond to the official RPG Maker free Fantasy Character Pack / Dragon Knight material.
- Candidate use is visual reference or specifically licensed character material for secondary humanoid combatants, advanced-discipline presentation or Paladin-adjacent prototypes.
- Do not assign this art directly to core canon characters unless it fits the Art Bible after recolor/redesign.
- Before committing any binary production asset from the pack, record the exact included EULA/source and attribution/usage terms in the asset provenance manifest.

## ARPG Plugin Set
User-supplied archive: `ARPG-plugin-set.zip` (~194 MB; too large for current direct materialization limit, but identifiable as an RPG Maker MZ ARPG reference package).
- Treat as an RPG Maker implementation reference, not a Godot plugin.
- High-value concepts to study:
  - free movement / DotMove-style collision conventions
  - action hit detection
  - event activation around the player
  - map-space combat loops
  - enemy action cadence
  - sample-project UX for action RPG controls
- Production decision: reimplement useful mechanics natively in Godot 4.7.2. Never introduce RPG Maker runtime dependencies into WORLD OF XETHKIOZ.

## Integration policy
1. Godot 4.7.2 remains the production engine.
2. Use external projects to accelerate architecture, map design, tools, world density, UI patterns and workflow.
3. Port mechanics into native GDScript rather than mixing foreign runtimes into the production build.
4. Generic landscapes, structures, terrain and props may be reused when their exact asset license allows it; track attribution per asset.
5. Do not use Pokémon-branded characters, creatures, names, logos or distinctive protected assets.
6. Keep WORLD OF XETHKIOZ naming, lore, pets, characters, combat and visual identity original.
7. Record provenance for every externally sourced production asset in an asset manifest before Steam release.
8. Prefer assets that do not create viral/share-alike licensing across unrelated proprietary project content unless we intentionally choose that licensing model.
9. When a reference package already solves a mechanic we need, port the behavior and tests into the existing Xethkioz module instead of replacing the project architecture.

## Immediate shortlist for Izrdralar demo
P0:
- large connected map/chunk architecture inspired by GBA-era readability + Solarus/Tuxemon data separation
- Tiled/Godot TileMap-compatible workflow
- companion following
- weather continuity and dynamic darkness/lighting
- map/minimap navigation
- modular production HUD/menu/creator
- save robustness and multi-slot design
- readable player/enemy action poses and attack telegraphs

P1:
- advanced enemy AI patterns
- damage numbers/combat feedback
- overworld creature ecology
- stair/terrain traversal
- reusable interior/dungeon transition system
- selective audio/SFX pass after visual combat feedback is stable

P2:
- Discord RPC and nonessential overlays
- randomizer/nuzlocke/genre-specific systems unrelated to WORLD OF XETHKIOZ
