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
