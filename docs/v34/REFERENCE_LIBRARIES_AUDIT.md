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

## Integration policy
1. Godot 4.7.2 remains the production engine.
2. Use external projects to accelerate architecture, map design, tools, world density, UI patterns and workflow.
3. Port mechanics into native GDScript rather than mixing foreign runtimes into the production build.
4. Generic landscapes, structures, terrain and props may be reused when their exact asset license allows it; track attribution per asset.
5. Do not use Pokémon-branded characters, creatures, names, logos or distinctive protected assets.
6. Keep WORLD OF XETHKIOZ naming, lore, pets, characters, combat and visual identity original.
7. Record provenance for every externally sourced production asset in an asset manifest before Steam release.
8. Prefer assets that do not create viral/share-alike licensing across unrelated proprietary project content unless we intentionally choose that licensing model.

## Immediate shortlist for Izrdralar demo
P0:
- large connected map/chunk architecture inspired by GBA-era readability + Solarus/Tuxemon data separation
- Tiled/Godot TileMap-compatible workflow
- companion following
- weather continuity and dynamic darkness/lighting
- map/minimap navigation
- modular production HUD/menu/creator
- save robustness and multi-slot design

P1:
- advanced enemy AI patterns
- damage numbers/combat feedback
- overworld creature ecology
- stair/terrain traversal
- reusable interior/dungeon transition system

P2:
- Discord RPC and nonessential overlays
- randomizer/nuzlocke/genre-specific systems unrelated to WORLD OF XETHKIOZ
