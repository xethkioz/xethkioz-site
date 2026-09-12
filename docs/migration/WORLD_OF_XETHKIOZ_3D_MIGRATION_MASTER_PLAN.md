# WORLD OF XETHKIOZ — 3D / 2.5D MIGRATION MASTER PLAN

Date: 2026-09-12
Engine: Godot 4.7.2
Branch: `game/xethkioz-3d-vertical-slice`
Human baseline from tested build: Graphics 2/10 · Gameplay 2/10 · Map 1/10

## Canon lock
The migration changes presentation and runtime architecture, not the story.
Authoritative order:
1. Biblia Final Consolidada Saga I v1.2.
2. Historia Final Canon v3.7 corregida.
3. CURRENT STATE.
4. GitHub live technical implementation.
5. Drive documentation/art/evidence.

Locked facts include: Viajero protagonist; Xethkioz Resonante Primario companion; active character identities and relationships; Mela, not Milo; Nahuel excluded from active canon; Nico M. and Matí A. retained; Zodnight closes Saga I; Isla Temporal is post-final bridge; Inframundo is Saga II. No migration task may silently alter canon.

## Product direction
World of Xethkioz becomes a stylized 3D Action-RPG presented through a controlled 3/4 camera. The world, characters and combat are 3D. UI, portraits, Atlas, cards, bestiary and selected resonance motifs remain 2D/illustrated where advantageous.

The game is region-based, not open world. Authored maps take priority over generated scale.

## Production law
A feature is not accepted because CI passes. Acceptance order is:
1. visual inspection;
2. hands-on human playtest;
3. gameplay score;
4. map/readability score;
5. technical regression/CI;
6. reproducible Windows export.

No vertical-slice category may be considered approved below 7/10.

## Phase 0 — Freeze and preserve
Output:
- keep PR #245 DRAFT and unmerged;
- preserve current 2D runtime as legacy prototype;
- preserve save, narrative data, progression contracts, authored dialogues and QA knowledge;
- stop P10+ feature expansion until the vertical slice is approved.
Done when: legacy remains reproducible and the 3D branch is isolated.

## Phase 1 — 3D technical foundation
Create:
- `World3D` root;
- 3D player controller;
- controlled 3/4 camera rig;
- collision layers/masks;
- navigation mesh and NavigationAgent3D conventions;
- interaction ray/area system;
- character action/state contract;
- 3D save transform adapter;
- debug room.
Preserve existing game-state flags and narrative IDs.
Done when: capsule/player can move, collide, interact and save/load position in a blank 3D test room.

## Phase 2 — Visual target room
Before building M01, establish a small benchmark scene with:
- terrain;
- one tree family;
- rocks;
- grass;
- water or wet surface;
- lighting/fog;
- Viajero proxy rig;
- Xethkioz proxy;
- one enemy;
- one pickup.
Goal: decide scale, camera, palette, material style and density.
Done when: human visual score >=7/10 from still image and short gameplay capture.

## Phase 3 — Viajero 3D production character
Use approved P01 concept as visual authority.
Required states:
- idle;
- walk/run 8-direction blend;
- start/stop/turn;
- dash;
- light combo;
- hurt/stagger;
- death/downed;
- interact;
- pickup;
- consume;
- resonance burst.
Animation drives movement feel; VFX never substitute body motion.
Done when: Gameplay and Animation >=7/10 in target room.

## Phase 4 — Xethkioz 3D companion
Use approved P02 identity.
Required:
- organic follow;
- acceleration/braking;
- obstacle avoidance;
- tail motion;
- rest;
- alert;
- support action;
- hurt/reaction;
- resonance action;
- narrative tail-stage flags, not normal level progression.
Done when: companion never reads as a floating/static pet and can traverse target room robustly.

## Phase 5 — Combat vertical slice
Implement one enemy family first: Brote Goblin.
Cycle:
`IDLE -> ALERT -> APPROACH -> TELEGRAPH -> ACTIVE -> RECOVERY -> HURT/STAGGER -> DEATH`
Required feedback:
- anticipation;
- weapon/body movement;
- hitbox active window;
- hit-stop;
- knockback;
- hurt reaction;
- physical death sequence;
- drop/XP after death presentation.
Then add Slime as a deliberately different locomotion/body model.
Done when: Combat >=7/10 by human playtest.

## Phase 6 — Interaction slice
Implement physically readable:
- pickup;
- consume/use;
- chest/container;
- readable lore object;
- NPC dialogue interaction;
- simple environmental reaction.
Inventory/health changes occur at authored commitment frames, not input press.
Done when: no key interaction is represented by instant `visible=false` or pure UI-only state change.

## Phase 7 — Rebuild M01 as authored 3D map
M01 remains Cuenca del Despertar and preserves its narrative sequence.
Design goals:
- strong entrance composition;
- readable main route plus optional pockets;
- forest density gradients;
- terrain height variation without platforming;
- creek/wetland or drainage logic where appropriate;
- landmarks;
- combat clearings;
- visual foreshadowing;
- bridge/Gustavo/Alexis staging;
- secrets and backtracking hooks;
- no procedural scatter look.
Done when: Map >=7/10 and a first-time tester can navigate without debug overlays.

## Phase 8 — M01 narrative integration
Port authored sequence, not rewrite:
- survival encounter;
- Xethkioz appearance;
- strange object;
- bridge / ????? Gustavo;
- Alexis;
- medidor sin bateria;
- doble trueno setup;
- exit toward Aldea del Alba.
Preserve canonical dialogue IDs and flags where possible.
Done when: narrative sequence is playable from entry to exit with save/load.

## Phase 9 — UI / HUD / onboarding redesign
Rules:
- world first;
- HUD only shows persistent essentials;
- tutorial prompts are contextual and dismissible;
- no large overlays covering exploration;
- Atlas/Bestiary remain rich 2D surfaces.
Done when: gameplay remains readable at 1080p and 1440p without blocking the world.

## Phase 10 — Audio and atmosphere
Add minimum production layer:
- footsteps by surface;
- attack/hit/death synchronization;
- pickup/use audio;
- forest ambience;
- local water/wind layers;
- music transitions;
- accessibility volume controls.
Done when: major actions have synchronized audio feedback and silence no longer makes the world feel unfinished.

## Phase 11 — Human Vertical Slice Gate
Required real scores:
- Graphics >=7/10
- Gameplay >=7/10
- Map >=7/10
- Animation >=7/10
- Combat >=7/10
- UI/UX >=7/10
- Audio >=7/10
- Stability/export >=8/10
No average can hide a category below 7.

## Phase 12 — Propagate the standard
Only after Phase 11:
- M02 Aldea del Alba;
- M03 Lago Encantado;
- M04 Ruinas Vivas / Santuario de las Raices;
- M05 Corazon del Bosque Velado / Boss 5;
- then resume Character Core P10+ as 3D production characters;
- only after M01-M05 approval reconsider M06-M10.

## Asset pipeline
Visual source order:
1. approved project concept art;
2. project-owned/licensed Drive assets;
3. original models/materials/textures built for Xethkioz;
4. external assets only with documented license/provenance.

Concept sheets are visual authority, not runtime sprites. 3D models must reproduce identity, palette, equipment and silhouette without copying contaminated presentation backgrounds.

## Tools
- Godot 4.7.2: runtime, animation, navigation, export.
- Blender: modeling, UVs, rigging, retargeting and optimization when required.
- Aseprite: UI, portraits, Atlas/Bestiary art, icons and pixel/illustrated overlays.
- Drive: canon, art source, build evidence and QA.
- GitHub: source of live technical truth.

## Migration rule for existing code
PORT when useful:
- SaveService/schema/migration;
- GameState/narrative flags;
- dialogue/content data;
- inventory/progression rules;
- input mapping concepts;
- boss and quest state contracts;
- CI/export knowledge.

REWRITE for 3D:
- player/world physics;
- camera;
- navigation;
- combat hit geometry;
- enemy locomotion;
- map rendering;
- character rendering;
- environmental interaction.

ARCHIVE, do not extend:
- procedural square/circle character renderers;
- placeholder SVG gameplay bodies;
- 2D maps rated 1/10 by human playtest;
- visual gates that only verify node existence rather than perceived quality.

## Immediate next action
Build Phase 1 and Phase 2 only. Do not port the full campaign yet. The next deliverable must be a short 3D target-room executable/capture that proves camera, scale, movement and aesthetic direction before M01 production begins.
