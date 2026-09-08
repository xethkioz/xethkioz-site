# WORLD OF XETHKIOZ — Reference Libraries Audit

## Scope
This note catalogs two user-supplied RAR5 archives intended as technical/reference material for WORLD OF XETHKIOZ. These archives are not imported directly into the Godot project.

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
  - Caruban's Dynamic Darkness
  - Map Zoom
  - Multi Save
  - damage numbers
  - Following Pokemon EX (reference for companion following)
  - Modular UI Scenes / Enhanced UI
  - Side Stairs
  - Level Caps EX
  - overworld encounters / VOE systems
  - animated title screen
  - switch/variable usage reporting and debugging utilities
  - Discord RPC / overlays as future optional integrations

## Integration policy
1. Do not copy these Ruby plugins directly into the Godot project.
2. Port only useful mechanics/architectural ideas into native GDScript modules.
3. Keep WORLD OF XETHKIOZ naming, data models, combat rules, art and UX original.
4. Verify per-plugin license/attribution before incorporating any substantial source-code fragment verbatim, because the archive mixes many authors/plugins and a single archive-level claim is not enough to establish one uniform license.
5. Prioritize concepts that materially improve the Steam demo: readable overworld, companion behavior, AI, weather, lighting, save robustness, map/navigation and UI.

## Immediate shortlist for Izrdralar demo
P0: companion following, weather continuity, dynamic darkness/lighting concepts, modular UI, map zoom/navigation, save robustness.
P1: advanced enemy AI ideas, damage numbers, overworld encounter behavior, side-stair/terrain traversal patterns.
P2: Discord RPC, overlays, randomizer/nuzlocke/monotype and Pokémon-specific battle systems are not relevant to the first Steam demo.
