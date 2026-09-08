# World of Xethkioz — Golden Slice 1–5

Production target for the Steam demo foundation.

## Scope locked for this milestone
- Final-style main menu / cover presentation.
- Character creator with Masculino/Femenino, name and palette; later facial/hair/body options must plug into the same frame.
- Maps 1–5 as one coherent Izrdralar ecosystem with changing time/weather.
- Compact HUD, visible Q/E/R/F skills, damage numbers and pickup notifications.
- NPC dialogue with portrait and choices.
- Story encounter pacing: M1 Alexis+Ashley, M2 Fermín, M3 Gael, M4 Isabella, M5 Alexis before boss.
- Enemy base family with four silhouettes/roles and edge-safe AI.
- Boss at Map 5.
- Post-map transition screen with optional Elida Refuge after Map 5.
- Elida Refuge services: talk, rest, alchemy, pets, equipment, atlas, Alexis advice, continue.

## Quality gates
- No duplicated backgrounds.
- No visible debug polygons/triangles as final terrain.
- NPCs must snap to valid walkable floor/platform positions.
- No HUD panels or labels overlapping each other.
- Every combat skill must have visible VFX and feedback.
- Maps must read as organic environments rather than floating rectangles.
- Build is rejected if Maps 1–5 fail to load, if Map 5 has no boss, or if approved flow screens fail runtime capture.

This block is the template for maps 6–15. New large systems stay out until this block is accepted visually and functionally.
