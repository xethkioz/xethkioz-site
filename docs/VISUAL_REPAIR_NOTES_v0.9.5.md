# v0.9.5 — Composition & Layout Repair

This pass exists to fix the playtest failures seen in the 2026-09-07 recording before expanding content.

## Confirmed defects
1. Duplicate scenic/background pass on maps 1–15.
2. Bright debug geometry visible as final terrain.
3. NPC Y coordinates tied to obsolete geometry; characters can float or overlap terrain.
4. HUD/map/environment panels overlap.
5. Map-5 NPC encounter is overcrowded.
6. Player has too little visual presence at current camera scale.
7. Q/E/R are effectively dead before mentor selection.

## Repair rules
- One background/scenery composition pass only.
- Physics helpers may remain but their visual geometry must blend into terrain.
- Story NPCs snap to walkable collision floor.
- M1 Alexis + Ashley, M2 Fermín, M3 Gael, M4 Isabella, M5 Alexis.
- Apprentice Prismático gets three starter skills; mentor replaces them after boss 5.
- Only one compact zone-title presentation is visible.
- Golden Slice 1–5 is the quality template for maps 6–15.
