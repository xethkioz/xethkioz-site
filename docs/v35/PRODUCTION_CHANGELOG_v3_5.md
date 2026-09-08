# WORLD OF XETHKIOZ — Production Changelog v3.5

## 2026-09-08 — Reconciliación de proyecto y quality gate

### Canon / documentación
- Creada `GAME_BIBLE_MASTER_v3_5.md` como canon maestro.
- v3.3 queda congelada como referencia histórica; v3.4 específico permanece vigente cuando no contradice v3.5.
- PixelLab/RPG Maker quedan definidos como herramientas auxiliares/referencia, no como un segundo proyecto.
- Godot 4.7.2 + GitHub continúan como producción oficial.
- Xethkioz adopta dirección visual vulpina original inspirada en kitsune/kyūbi.

### Flujo de juego
- Corregido el bootstrap para entrar a `res://scenes/v34/GoldenRegion.tscn` en Nueva Partida/Continuar en lugar del antiguo `v33/VerticalSlice.tscn`.
- El flujo principal ya no puede regresar accidentalmente al greybox histórico.

### CI / QA
- CI serializado mediante `concurrency` y `cancel-in-progress`.
- Añadido timeout/fail-fast a capturas visuales.
- Capturas reales 640×360: menú, creador, Cuenca, Lago, Refugio.
- Snapshot de fuente incluye `docs/v35`.
- Run #209 validó import, bootstrap, Golden Region, Refugio, previews, export Windows y snapshot.

### Drive
- Creadas carpetas:
  - `02 - Builds y Desarrollo/v3.5 - Producción Godot`
  - `03 - Arte, Mapas y Referencias/Capturas Reales CI v3.5`
  - `03 - Arte, Mapas y Referencias/PixelLab - Referencias y Assets Candidatos`
- Respaldados artefactos del head validado `2a45fe27`:
  - previews CI;
  - build Windows interna;
  - source snapshot.
- Biblia v3.5 respaldada como Google Doc, Markdown, PDF y DOCX.

### Creador del Viajero
- Eliminada la preview humanoide basada en `ColorRect`.
- El panel de creación muestra ahora un frame real de `viajero_sheet.svg` con filtrado nearest.
- Tono de piel, cabello y acento se comunican mediante swatches mientras la personalización completa se aplica en gameplay mediante `CharacterProfile`/profile overlay.
- La complexión modifica el ancho de lectura de la preview real.

### Brote Vivo
Flujo confirmado en `quest_manager.gd`:
1. pieza 1 — Alexis, tras Raíces alteradas;
2. pieza 2 — Evaluación de Val;
3. pieza 3 — Custodio Menor / Santuario de las Raíces;
4. pieza 4 — Primera mentoría.

- F queda bloqueada antes de 4 piezas.
- `player_controller_production.gd` ya usa el gate correcto.
- Corregido también `player_controller.gd` base para eliminar el gate heredado basado en mentor y usar `GameState.set_piece_count("brote_vivo") >= 4`.
- HUD escucha `set_progress_changed` y actualiza el nombre/estado de F.

### Gate vigente
No entregar build al usuario hasta revisar visualmente capturas reales y confirmar:
- jugador/Xethkioz/NPC/enemigos legibles;
- Cuenca/Lago/Refugio coherentes con el target;
- HUD integrado;
- ausencia de placeholders geométricos en pantallas principales;
- CI verde;
- backup Drive actualizado.

## Próximo bloque
1. Validar CI del head posterior a creator/Brote patch.
2. Auditar capturas reales del nuevo head.
3. Pulir Xethkioz hacia la dirección vulpina aprobada.
4. Pulir primer minuto/Cuenca, Lago, Refugio y HUD según visual gate.
5. QA de Carpinchito → Val → Fermín → Rango I y persistencia de save.
