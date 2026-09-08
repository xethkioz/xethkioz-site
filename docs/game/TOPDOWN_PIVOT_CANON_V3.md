# World of Xethkioz - Pivot Canon v3.0

## Production status
This document supersedes the lateral-platformer production direction while preserving the core lore and progression of Biblia v2.0. The old platformer branches remain as historical/rollback references.

## New genre and structure
- Primary format: 2D top-down Action-RPG with real-time combat.
- Visual/spatial reference: Pokemon Emerald/Ruby/PokeMMO-like top-down readability, without copying protected art or mechanics 1:1.
- Combat remains original real-time ARPG: movement, dash, basic attack, Q/E/R/F, mentors, equipment and companions.
- World structure: semi-open macro-regions, not 32 isolated platform levels.
- The original 1-32 numbering becomes 32 main progression milestones.
- The 120-node Atlas becomes a network of campaign milestones, POI, refuges, dungeons, events, bosses, secrets and future expansion locations.

## Canon preserved
- Argentina 2150 and the Prismatic Rift.
- The Traveler is the only campaign-controlled character.
- Ashley: female, 15, Bard mentor.
- Fermin: male, 13, Warrior mentor.
- Isabella: female, 8, Chaos Witch mentor.
- Gael: male, 7, Archer mentor.
- Alexis: male, 35, father/guide, black hooded sweatshirt/robe silhouette.
- Elida: elderly grandmother, apothecary/alchemist visual identity; refuge, healing, alchemy, pets, equipment and Atlas.
- Xethkioz: primary companion and emotional center of the final conflict.
- Izrdralar, Desfralar, Xiomalar and NigZen remain the principal territories.
- Xethkioz de Ensueno remains the canonical final boss.
- Difficulty increases by decisions, encounter density, puzzles, route complexity and combinations, not unfair one-shots.

## Traversal change
The old post-Boss-5 double jump no longer fits a top-down game. Its progression function is preserved as **Paso Prismatico**: a short blink/vault used to cross corrupted roots, narrow gaps and dangerous terrain. Alexis teaches it after Boss 5 at Elida's Refuge.

## Region blocks
- 1-5: first Izrdralar macro-region / forest-ruins basin. Tutorial, Xethkioz, Boss 5, mentor choice, first major Refuge state.
- 6-10: Izrdralar plains and future ruins. Projectiles, cover, routes and Boss 10.
- 11-15: First Cism. Corruption, puzzles, underground access and Boss 15.
- 16-25: Desfralar macro-regions.
- 26-30: Xiomalar.
- 31-32: Dream dimension and final boss.

## Demo production rule
Do not build 1-10 in parallel. First finish a professional 1-5 macro-region. Then extend to 6-10. Public Steam demo should default to 1-5 unless 1-10 reaches the same quality without degrading the Golden Region.

## Current implementation branch
`game/xethkioz-topdown-production`

Initial pivot code includes:
- 640x360 logical canvas.
- 8-direction CharacterBody2D controller.
- Dash and real-time attacks/skills.
- Basic top-down enemy AI.
- A large Izrdralar Node 1 technical map.
- Alexis/Ashley interactions.
- Open objectives in non-sequential order.
- Basic save/continue.
- CI workflow for script validation, real screenshots and Windows export.

This code is a technical pivot baseline, not final AAA-indie art.
