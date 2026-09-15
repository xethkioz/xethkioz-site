# World of Xethkioz — Media Slots

Estado: estructura web preparada; integración de medios 3D oficiales en progreso.

Regla: no usar bocetos, sprites, concept art 2D/2.5D ni imagenes random como representacion actual del juego. Solo material aprobado del pipeline Unity + Blender 3D.

## Slots preparados

- HERO: banner World of Xethkioz + fondo animado actual. No requiere imagen adicional por ahora.
- VIAJERO: retrato/render 3D, relacion 4:5.
- XETHKIOZ: render/modelo 3D, relacion 4:5.
- MUNDO: captura oficial por region, relacion 16:9. Izrdralar, Desfralar, Xiomalar y Zodnight.
- PRISMA-ATLAS: criatura/entidad seleccionada, relacion 1:1.
- FORMAS DE CONVERGENCIA: render de la Forma seleccionada, relacion 1:1.
- PERSONAJES: retrato del personaje seleccionado, relacion 4:5.
- PRODUCCION 3D: Veyr ya integrado como primer activo vigente.
- ESCENARIOS 3D: captura/render Unity, relacion 16:10.
- GAMEPLAY REAL: captura o frame de gameplay Unity, relacion 16:10.

## Estado de publicación — Pass 13

- XETHKIOZ: PUBLICABLE COMO MODELO 3D EN PRODUCCIÓN. Render LOD0 vigente optimizado para web; no se etiqueta como gameplay ni como Game Ready final.
- VIAJERO: BLOQUEADO PARA WEB. El asset actual sigue en rig/import QA y su preview es técnico, no una presentación AAA.
- FORMAS: BLOQUEADAS PARA MEDIA INDIVIDUAL. El Bestiario Maestro v2.0 fija que las Ocho Formas derivan de una misma familia/anatomia de Xethkioz; `Bestia_Legendaria_1..8` no tienen identidad canonica asignada y NO deben mapearse por numero o apariencia. Publicar cada Forma solo cuando exista variante aprobada de silueta/material/VFX/afinidad sobre la familia compartida.
- PERSONAJES: Braxian/Milaviel y familia tienen candidatos 3D, pero faltan renders de presentación aprobados; no usar T-pose.
- MUNDO / ESCENARIOS / GAMEPLAY: BLOQUEADOS hasta existir captura Unity oficial de la versión vigente.
- PRODUCCIÓN 3D: Veyr permanece como activo público vigente.

## Convencion futura

Usar WebP/AVIF para renders estaticos y mantener GLB/GLTF solo cuando la interaccion 3D aporte valor real.

Rutas sugeridas:

- `/assets/world-of-xethkioz/characters/<slug>/`
- `/assets/world-of-xethkioz/forms/<slug>/`
- `/assets/world-of-xethkioz/regions/<slug>/`
- `/assets/world-of-xethkioz/atlas/<slug>/`
- `/assets/world-of-xethkioz/gameplay/`

Los marcos `MediaPlaceholder` aceptan `src` y `alt`, por lo que el arte final se puede insertar sin rehacer la composicion de la Home.

Objetivo: reemplazar un slot solamente cuando el material represente la version 3D vigente del juego y este aprobado para publicacion.
