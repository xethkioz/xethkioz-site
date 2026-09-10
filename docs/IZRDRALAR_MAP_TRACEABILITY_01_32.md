# IZRDRALAR — Hoja de trazabilidad técnica de mapas 1–32

**Estado:** ESTRUCTURA TÉCNICA DE PRODUCCIÓN alineada a Biblia v3.5 + Historia v3.6.  
**Base runtime:** scaffold PLAYER ONLY validado + Production Pass M01–M05 en integración.  
**Regla macro de scaffold:** 4 nodos de avance + 1 nodo de jefe por bloque; mapas 31–32 cierran el continente.  
**Regla de precedencia:** esta hoja organiza mapas, pero NO reemplaza la Biblia Maestra ni el canon narrativo.  
**Objetivo:** mantener 32 nodos estructurales mientras cada bloque se convierte, por etapas, en gameplay real.

## Corrección de canon 2026-09-10 — M01–M05

La primera versión del scaffold nombraba M05 como `Brote Vivo`. Eso era incorrecto: **Brote Vivo es el set inicial de cinco piezas**, no el Jefe 5. La Historia v3.6 fija al **Guardián del Bosque Velado** como Jefe 5. El primer tramo queda así:

1. `M01` — Cuenca del Despertar: despertar, supervivencia, primer combate, Xethkioz y Gustavo/?????.
2. `M02` — Aldea del Alba: Alexis/Ivan, Prisma-Atlas y hub de decisión.
3. `M03` — Lago Encantado: Val, Rola, Mela, Piedra Resonante y primer Familiar.
4. `M04` — Ruinas Vivas / Santuario de las Raíces: Hoja 17-B, nota de Elida, puzle de raíces y Custodio de Raíz.
5. `M05` — Corazón del Bosque Velado: Guardián del Bosque Velado, purga interactiva, Paso Prismático y primera pieza garantizada del set Brote Vivo.

**Agencia obligatoria:** M02 debe evolucionar a un hub que permita abordar Lago y Ruinas/Santuario en distinto orden. La cadena lineal `Anterior/Siguiente` sigue siendo válida solamente como herramienta de smoke técnico hasta que el grafo de producción M01–M05 quede implementado.

## Convenciones técnicas

- `STANDARD`: 2×2 chunks de 512 px = 1024×1024.
- `DOUBLE`: 4×2 o 2×4 chunks = el doble de superficie del mapa estándar.
- `BOSS_LARGE`: 3×3 chunks = 1536×1536 para arena y respiración.
- Los mapas del scaffold son data-driven y se reconstruyen desde el manifiesto 01–32.
- En M06–M32, mientras no se abra su Production Pass, las zonas siguen considerándose placeholders estructurales.
- Ningún nodo se declara terminado por cargar en headless; requiere contenido, recorrido, interacción, combate, persistencia y QA según su DoD.

| # | Código | Bloque | Nombre | Tipo | Tamaño | Biomas base | Funcionalidades / obligación | Dificultad |
|---:|---|---|---|---|---|---|---|---:|
| 1 | IZR-M01 | A | Cuenca del Despertar | Mapa inicial | 2×2 chunks | forest, river, ruins | Supervivencia, movimiento, ataque, Xethkioz, Gustavo | 1 |
| 2 | IZR-M02 | A | Aldea del Alba | Hub de historia | 2×2 chunks | forest, refuge, ruins | Ivan, Prisma-Atlas, elección Lago/Ruinas | 1 |
| 3 | IZR-M03 | A | Lago Encantado | Nodo de historia | 2×2 chunks | lake, river, forest | Val/Rola/Mela, Piedra Resonante, primer vínculo | 1 |
| 4 | IZR-M04 | A | Ruinas Vivas / Santuario de las Raíces | Dungeon doble | 4×2 chunks | ruins, sanctuary, forest, river | 17-B, Elida, puzle, miniboss Custodio | 2 |
| 5 | IZR-M05 | A | Corazón del Bosque Velado | Jefe principal | 3×3 chunks | boss, forest, sanctuary | Guardián, telegraphs, purga, Paso Prismático, Brote Vivo pieza 1 | 2 |
| 6 | IZR-M06 | B | Cuenca Brumosa | Mapa normal | 4×2 chunks · DOBLE | river, forest, lake | Agua, puentes, exploración | 2 |
| 7 | IZR-M07 | B | Paso del Guía | Nodo guía de Alexis | 2×2 chunks | forest, ruins | Guía, lore, mirador | 2 |
| 8 | IZR-M08 | B | Refugio de Elida I | Refugio | 2×2 chunks | refuge, forest | Refugio, guardado, descanso | 2 |
| 9 | IZR-M09 | B | Borde del Arroyo | Mapa normal | 4×2 chunks · DOBLE | river, lake, forest | Exploración, desvío, recompensa | 2 |
| 10 | IZR-M10 | B | Guardián de la Cuenca | Mapa de jefe | 3×3 chunks | boss, river | Arena, agua, cobertura | 3 |
| 11 | IZR-M11 | C | Bosque de Ecos | Mapa normal | 2×2 chunks | ruins, forest | Ruinas, lore, exploración | 3 |
| 12 | IZR-M12 | C | Casa de Val | Nodo de historia | 4×2 chunks · DOBLE | forest, refuge | Historia Val/Rola/Mela, tareas, vínculo | 3 |
| 13 | IZR-M13 | C | Sendero del Vínculo | Mapa normal | 2×2 chunks | forest, river | Interacción, vínculo, recompensa | 3 |
| 14 | IZR-M14 | C | Santuario de Piedras | Mapa normal | 4×2 chunks · DOBLE | sanctuary, ruins, forest | Puzle, santuario, transición | 3 |
| 15 | IZR-M15 | C | Eco de la Ruina | Mapa de jefe | 3×3 chunks | boss, ruins | Arena, ruinas, peligro | 4 |
| 16 | IZR-M16 | D | Tierras Elevadas | Mapa normal | 4×2 chunks · DOBLE | forest, ruins | Presión ambiental, altura, exploración | 4 |
| 17 | IZR-M17 | D | Terrazas del Río | Mapa normal | 2×4 chunks · DOBLE | river, lake, forest | Amenaza natural, recorrido, puentes | 4 |
| 18 | IZR-M18 | D | Grieta Oculta | Nodo secreto | 2×2 chunks | ruins, sanctuary | Secreto, botín, lore | 4 |
| 19 | IZR-M19 | D | Camino del Vigía | Mapa normal | 2×2 chunks | forest, river | Habilidad, antesala, combate | 4 |
| 20 | IZR-M20 | D | Guardián del Dosel | Mapa de jefe | 3×3 chunks | boss, sanctuary | Arena, mecánica, cobertura | 5 |
| 21 | IZR-M21 | E | Corazón del Bosque | Mapa normal | 4×2 chunks · DOBLE | forest, ruins | Ancestral, tensión, exploración | 5 |
| 22 | IZR-M22 | E | Refugio de Elida II | Refugio | 2×2 chunks | refuge, forest | Refugio, historia, reorganización | 5 |
| 23 | IZR-M23 | E | Archivo de Cartas | Mapa normal | 2×2 chunks | ruins, forest | Lore, cartas, recuerdos | 5 |
| 24 | IZR-M24 | E | Cruce de Guardianes | Mapa normal | 2×4 chunks · DOBLE | river, sanctuary, ruins | Puzle, combate, exploración | 5 |
| 25 | IZR-M25 | E | Bestia de la Frontera | Mapa de jefe | 3×3 chunks | boss, forest | Arena, frontera, peligro | 6 |
| 26 | IZR-M26 | F | Camino Final | Mapa normal | 4×2 chunks · DOBLE | forest, ruins | Cierre, presión, exploración | 6 |
| 27 | IZR-M27 | F | Cámara Sellada | Nodo secreto | 4×2 chunks · DOBLE | ruins, sanctuary | Secreto avanzado, premio, puzle | 6 |
| 28 | IZR-M28 | F | Revelación de Alexis | Nodo guía de Alexis | 2×2 chunks | forest, ruins | Guía, revelación, lore | 6 |
| 29 | IZR-M29 | F | Antesala del Umbral | Mapa normal | 2×4 chunks · DOBLE | forest, river, sanctuary | Presión alta, preparación, prueba | 7 |
| 30 | IZR-M30 | F | Soberano de las Raíces | Mapa de jefe | 3×3 chunks | boss, ruins, sanctuary | Boss final, arena, mecánica | 7 |
| 31 | IZR-M31 | Cierre | Mirador del Cierre | Mapa normal | 4×2 chunks · DOBLE | forest, ruins, lake | Síntesis, mirador, calma tensa | 7 |
| 32 | IZR-M32 | Cierre | Umbral Legendario | Nodo legendario / umbral | 3×3 chunks | sanctuary, forest | Umbral, legendario, fin del continente | 7 |

## Hitos de integración

1. Production Pass M01–M05: portar y redistribuir el gameplay real que ya existe en GoldenRegion v3.6, sin reescribir sistemas maduros.
2. Implementar grafo de agencia de M02 para Lago/Ruinas y gate de M05.
3. Validar Player P01 + Xethkioz P02 + NPC + enemigos + Familiar + lore + Boss 5 en runtime real.
4. Sustituir marcadores técnicos por geometría/arte de producción y capturas 640×360.
5. Sólo después de cerrar DoD M01–M05 abrir M06–M10.
6. M32 sigue siendo umbral de Izrdralar; no cruza automáticamente a una expansión.
