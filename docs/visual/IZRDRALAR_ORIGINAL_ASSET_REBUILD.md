# Izrdralar — original asset rebuild

This production slice establishes the safe visual base for World of Xethkioz.

## Decision

The external reference packages are not runtime dependencies. Their compiled formats and naming indicate material from another game ecosystem, so the repository receives no extracted binary, texture, sound bank, shader, character, map, or UI asset from those packages.

They remain useful as a private reference for:

- effect categories and feedback timing;
- lighting readability;
- animation-state coverage;
- inventory and HUD requirements;
- environmental prop taxonomy.

## Rebuild method

The runtime base is newly generated for Izrdralar with:

- Godot 4.7.2;
- logical viewport 640×360;
- nearest filtering and pixel snap;
- 16 px visual grid;
- forest, wetland, water, prism-violet and refuge-amber palette;
- original silhouettes, names, symbols and UI language.

Run:

```bash
python3 tools/generate_izrdralar_original_assets.py
```

Generated outputs are placed under:

- `assets/izrdralar_original/generated/fx`
- `assets/izrdralar_original/generated/lighting`
- `assets/izrdralar_original/generated/ui`
- `assets/izrdralar_original/generated/items`

## First runtime slice

The first functional slice adds procedural feedback for:

- hit and slash;
- boss telegraph;
- resonance aura;
- smoke/rune placeholders;
- pickup and save feedback compatibility.

The generated images are support assets; gameplay feedback remains procedural in Godot so it can scale with the eight-direction movement and attack system.

## QA gate

Nothing is considered final until a real runtime capture verifies M01–M05 readability, attack feedback, boss telegraphs, save feedback, collision and re-open behavior.

## Integración semántica de combate

La capa runtime usa src/fx/izrdralar_fx_factory.gd como única entrada para los feedbacks de producción:

- player_*: ataque, habilidades, guardia, daño recibido y curación.
- enemy_ward: telegráfica previa al golpe; no se confunde con el impacto.
- enemy_line y enemy_slash: ataques a distancia y cuerpo a cuerpo.
- enemy_hit y enemy_death: reacción de daño y resolución de enemigo.

La fábrica traduce esos eventos a efectos originales de world_feedback_fx.gd y a la paleta de Izrdralar. Esto deja los packs externos fuera del runtime y permite ajustar legibilidad por evento sin tocar cada enemigo o habilidad.

## Verificación actual

Se verificó por inspección de la rama que:

- los tres scripts apuntan a la fábrica nueva;
- no se agregaron archivos .xnb, .xwb, .xgs, .xsb ni enc;
- los IDs de efecto se resuelven a tipos existentes en world_feedback_fx.gd.

Pendiente obligatorio: ejecutar Godot 4.7.2 para validar parseo, arranque, captura 640×360, colisiones, telegráficas y save round-trip.