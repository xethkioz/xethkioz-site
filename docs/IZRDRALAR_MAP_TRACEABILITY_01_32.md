# IZRDRALAR — Hoja de trazabilidad técnica de mapas 1–32

**Estado:** CANON OFICIAL de estructura de Izrdralar para producción real.  
**Base runtime actual:** PLAYER ONLY.  
**Regla macro:** 4 mapas de avance + 1 mapa de jefe, repetido en seis bloques; mapas 31–32 cierran el continente.  
**Objetivo de esta versión:** 32 mapas genéricos conectados para testear escala, ritmo, texturas, zonas y colocación futura de contenido.

## Convenciones técnicas

- `STANDARD`: 2×2 chunks de 512 px = 1024×1024.
- `DOUBLE`: 4×2 o 2×4 chunks = el doble de superficie del mapa estándar.
- `BOSS_LARGE`: 3×3 chunks = 1536×1536 para arena y respiración.
- Los mapas son **data-driven**: una sola escena runtime reconstruye cada mapa a partir del manifiesto 1–32.
- La transición `Anterior/Siguiente` conserva PLAYER pero reconstruye el mundo; el nodo 32 no cruza al siguiente continente.
- En esta fase no se instancian personajes secundarios, companion, enemigos, familiares ni bosses reales. Los espacios se marcan como zonas placeholder.

| # | Código | Bloque | Nombre | Tipo | Tamaño | Biomas base | Funcionalidades/zonas placeholder | Dificultad |
|---:|---|---|---|---|---|---|---|---:|
| 1 | IZR-M01 | A | Despertar del Claro | Mapa normal | 2×2 chunks | forest | Tutorial, Exploración, Movimiento | 1 |
| 2 | IZR-M02 | A | Sendero de Raíces | Mapa normal | 2×2 chunks | forest, river | Exploración, Ruta, Secreto posible | 1 |
| 3 | IZR-M03 | A | Círculo de Runas | Mapa normal | 2×2 chunks | forest, sanctuary | Puzle, Runas, Exploración | 1 |
| 4 | IZR-M04 | A | Garganta Verde | Mapa normal | 4×2 chunks · DOBLE | forest, river, ruins | Combate, Verticalidad, Atajo | 2 |
| 5 | IZR-M05 | A | Brote Vivo | Mapa de jefe | 3×3 chunks | boss, forest | Arena, Cobertura, Recompensa | 2 |
| 6 | IZR-M06 | B | Cuenca Brumosa | Mapa normal | 4×2 chunks · DOBLE | river, forest, lake | Agua, Puentes, Exploración | 2 |
| 7 | IZR-M07 | B | Paso del Guía | Nodo guía de Alexis | 2×2 chunks | forest, ruins | Guía, Lore, Mirador | 2 |
| 8 | IZR-M08 | B | Refugio de Elida I | Refugio | 2×2 chunks | refuge, forest | Refugio, Guardado, Descanso | 2 |
| 9 | IZR-M09 | B | Borde del Arroyo | Mapa normal | 4×2 chunks · DOBLE | river, lake, forest | Exploración, Desvío, Recompensa | 2 |
| 10 | IZR-M10 | B | Guardián de la Cuenca | Mapa de jefe | 3×3 chunks | boss, river | Arena, Agua, Cobertura | 3 |
| 11 | IZR-M11 | C | Bosque de Ecos | Mapa normal | 2×2 chunks | ruins, forest | Ruinas, Lore, Exploración | 3 |
| 12 | IZR-M12 | C | Casa de Val | Nodo de historia | 4×2 chunks · DOBLE | forest, refuge | Historia Val/Rola/Mela, Tareas, Vínculo | 3 |
| 13 | IZR-M13 | C | Sendero del Vínculo | Mapa normal | 2×2 chunks | forest, river | Interacción, Vínculo, Recompensa | 3 |
| 14 | IZR-M14 | C | Santuario de Piedras | Mapa normal | 4×2 chunks · DOBLE | sanctuary, ruins, forest | Puzle, Santuario, Transición | 3 |
| 15 | IZR-M15 | C | Eco de la Ruina | Mapa de jefe | 3×3 chunks | boss, ruins | Arena, Ruinas, Peligro | 4 |
| 16 | IZR-M16 | D | Tierras Elevadas | Mapa normal | 4×2 chunks · DOBLE | forest, ruins | Presión ambiental, Altura, Exploración | 4 |
| 17 | IZR-M17 | D | Terrazas del Río | Mapa normal | 2×4 chunks · DOBLE | river, lake, forest | Amenaza natural, Recorrido, Puentes | 4 |
| 18 | IZR-M18 | D | Grieta Oculta | Nodo secreto | 2×2 chunks | ruins, sanctuary | Secreto, Botín, Lore | 4 |
| 19 | IZR-M19 | D | Camino del Vigía | Mapa normal | 2×2 chunks | forest, river | Habilidad, Antesala, Combate | 4 |
| 20 | IZR-M20 | D | Guardián del Dosel | Mapa de jefe | 3×3 chunks | boss, sanctuary | Arena, Mecánica, Cobertura | 5 |
| 21 | IZR-M21 | E | Corazón del Bosque | Mapa normal | 4×2 chunks · DOBLE | forest, ruins | Ancestral, Tensión, Exploración | 5 |
| 22 | IZR-M22 | E | Refugio de Elida II | Refugio | 2×2 chunks | refuge, forest | Refugio, Historia, Reorganización | 5 |
| 23 | IZR-M23 | E | Archivo de Cartas | Mapa normal | 2×2 chunks | ruins, forest | Lore, Cartas, Recuerdos | 5 |
| 24 | IZR-M24 | E | Cruce de Guardianes | Mapa normal | 2×4 chunks · DOBLE | river, sanctuary, ruins | Puzle, Combate, Exploración | 5 |
| 25 | IZR-M25 | E | Bestia de la Frontera | Mapa de jefe | 3×3 chunks | boss, forest | Arena, Frontera, Peligro | 6 |
| 26 | IZR-M26 | F | Camino Final | Mapa normal | 4×2 chunks · DOBLE | forest, ruins | Cierre, Presión, Exploración | 6 |
| 27 | IZR-M27 | F | Cámara Sellada | Nodo secreto | 4×2 chunks · DOBLE | ruins, sanctuary | Secreto avanzado, Premio, Puzle | 6 |
| 28 | IZR-M28 | F | Revelación de Alexis | Nodo guía de Alexis | 2×2 chunks | forest, ruins | Guía, Revelación, Lore | 6 |
| 29 | IZR-M29 | F | Antesala del Umbral | Mapa normal | 2×4 chunks · DOBLE | forest, river, sanctuary | Presión alta, Preparación, Prueba | 7 |
| 30 | IZR-M30 | F | Soberano de las Raíces | Mapa de jefe | 3×3 chunks | boss, ruins, sanctuary | Boss final, Arena, Mecánica | 7 |
| 31 | IZR-M31 | Cierre | Mirador del Cierre | Mapa normal | 4×2 chunks · DOBLE | forest, ruins, lake | Síntesis, Mirador, Calma tensa | 7 |
| 32 | IZR-M32 | Cierre | Umbral Legendario | Nodo legendario / umbral | 3×3 chunks | sanctuary, forest | Umbral, Legendario, Fin del continente | 7 |

## Hitos de integración futura

1. Cerrar geometría y ritmo de M01–M05 con PLAYER ONLY.
2. Convertir los marcadores genéricos de zona en puzles, encuentros, narrativa y secretos reales.
3. Repetir por bloque 6–10, 11–15, 16–20, 21–25, 26–30.
4. Integrar Refugios, Val/Rola/Mela y Alexis únicamente cuando sus implementaciones runtime estén estables.
5. El nodo 32 queda como umbral visual; no se ingresa al siguiente continente en esta prueba.
