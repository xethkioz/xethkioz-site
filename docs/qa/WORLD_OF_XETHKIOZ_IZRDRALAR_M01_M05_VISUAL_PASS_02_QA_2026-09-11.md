# World of Xethkioz — Izrdralar M01–M05 — Visual Production Pass 02 QA

Fecha: 2026-09-11
Estado: checkpoint estable de desarrollo interno
PR: #245
Rama: `feat/izrdralar-m01-m05-save-visual-contract`
HEAD validado: `d90189214cdb663c0c1e27e54304d90d15f8de7e`
Godot: 4.7.2
Último gate completo: run 162 — PASS

## Alcance

Este pase eleva la lectura visual del bloque authored M01–M05 sin modificar canon, orden narrativo, navegación funcional, progresión, guardado ni combate de acción.

No habilita producción de M06–M10 y no declara M01–M05 visualmente finalizados.

## Cambios verificados

### Caminos y composición

- Los caminos authored bajan a 3 tiles / 48 px y conservan continuidad entre chunks.
- Se mantienen los offsets orgánicos para evitar cruces rígidos y repetitivos.
- M02 reemplaza grandes áreas rectangulares de camino por claros irregulares alrededor de sus puntos importantes.
- M05 reduce el disco de suelo desnudo del boss para recuperar lectura de bosque alrededor de la arena.

### HUD 640×360

- Se reduce la ocupación de pantalla manteniendo salud, maná, nivel, misión, Xethkioz, skills, Atlas e inventario.
- Se conserva la lógica y señales del HUD base; el cambio es de composición visual.
- El centro del viewport queda más libre para navegación y combate.

### Landmarks authored

- Viviendas de Aldea del Alba reciben zócalos, acceso, vegetación y pequeños acentos de iluminación/prisma.
- Ruinas reciben base, escombros, musgo y acentos de Resonancia.
- Santuario de las Raíces recibe base de piedra, raíces y acentos prismáticos.
- Los elementos siguen utilizando arte original de World of Xethkioz; no se copian píxeles ni assets de packs externos.

## Gate Godot 4.7.2

Run 162 completó correctamente:

- importación del proyecto sin Parse Error / SCRIPT ERROR;
- contrato visual;
- Viajero 8 direcciones;
- facing de Xethkioz;
- melee 8 direcciones;
- navegación M01–M05;
- save schema 10 + backup/recovery;
- runtime authored M01–M05;
- progresión y Boss 5;
- continuidad narrativa;
- autosave de posición exacta;
- respawn authored;
- integración del bootstrap;
- capturas reales 640×360 bajo GL Compatibility;
- arranque del runtime principal sin aceptar timeout como PASS.

## Evaluación visual

El Pass 02 mejora de forma visible la relación mapa/HUD y reduce tres señales claras de prototipo: caminos sobredimensionados, grandes claros rectangulares y landmarks aislados sobre el terreno.

Todavía no alcanza calidad de atlas final. Los principales puntos pendientes son:

1. aumentar variedad de tiles de suelo sin introducir ruido;
2. reducir repetición evidente de cristales y props;
3. mejorar variedad de vegetación por microzona;
4. elevar silueta y detalle de viviendas/ruinas manteniendo lectura a 640×360;
5. revisar telegraphs, escalas y contraste en combate real;
6. realizar QA de colisiones tras cada cambio artístico;
7. repetir capturas y revisión visual antes de considerar merge.

## Decisión

Mantener PR #245 en draft. Continuar exclusivamente dentro de M01–M05 hasta cerrar el pase visual y QA correspondiente. No mergear todavía y no avanzar producción a M06–M10.
