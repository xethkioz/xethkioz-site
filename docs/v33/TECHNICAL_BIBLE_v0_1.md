# WORLD OF XETHKIOZ — Technical Bible v0.1

## Runtime target
- Godot 4.7.2 stable
- GDScript
- PC / Steam first
- Logical viewport: 640x360
- Renderer: GL Compatibility until art/performance profiling justifies another choice

## Architecture decision 001
The v3.3 line stops growing the historical monolithic `topdown_main.gd`. New systems live under `src/` grouped by responsibility. Presentation may change without rewriting domain state.

## Modules
- `src/core`: events, persistent state, save
- `src/player`: player controller and future abilities
- `src/npc`: enemies/NPC AI
- `src/pets`: Xethkioz and pet runtime
- `src/world`: region orchestration, weather, time, streaming later
- `src/quest`: quest state and objectives
- `src/ui`: HUD and menus

## Rules
1. Data and progression state must not live only inside scene nodes.
2. Cross-system notifications prefer EventBus signals.
3. Scene scripts stay small; content tables become Resources/JSON once schema stabilizes.
4. Large world streaming/chunking is postponed until the Golden Region geometry is validated.
5. First implementation is functional greybox; art replacement must not require gameplay rewrites.
