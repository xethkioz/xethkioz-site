# IZRDRALAR · FUNCTIONAL V2 · Production Notes

Estado: PLAYER ONLY / mapa y navegación. No integra NPC, Xethkioz, Familiar, enemigos ni bosses reales.

## Canon de producción aplicado

- Las imágenes oficiales `IZRDRALAR_ATLAS_OFICIAL_MAPAS_01_32.png` y `IZRDRALAR_HOJA_TRAZABILIDAD_OFICIAL_01_32.png` fijan la ruta y los 32 nodos de Izrdralar.
- Los 32 nodos son mapas jugables del primer continente para la línea activa actual.
- Cadencia: cuatro mapas de avance + un mapa de jefe en 5/10/15/20/25/30, más 31–32 como cierre.
- M08 y M22 son accesos exteriores al Refugio de Elida; el interior puede ser una escena separada sin consumir otro nodo.
- M12 es el área principal de Casa de Val / Lago / Rola / Mela.
- M18 y M27 son nodos secretos.
- M07 y M28 son nodos narrativos reservados para Alexis.
- M32 termina en Umbral Legendario y no entra al territorio siguiente.

## Regla de nombres de jefe

Los nombres de la hoja visual son nombres del mapa/nodo. No necesariamente sustituyen el nombre narrativo del enemigo.

- M05 `Brote Vivo`: el jefe narrativo puede seguir siendo Guardián del Bosque Velado.
- M10 `Guardián de la Cuenca`: conserva el examen de movilidad/proyectiles del segundo gran combate.
- M30 `Soberano de las Raíces`: es el nombre del mapa/arena de cierre; el enemigo final de Izrdralar puede conservar el canon narrativo de Arconte del Umbral Subterráneo cuando se integre la historia definitiva.
- M15/M20/M25 quedan como jefes regionales; su identidad final se fija durante el pass narrativo sin alterar la cadencia 4+1.

## Filosofía de layout

Inspiración estructural: rutas densas tipo Pokémon Esmeralda, sin copiar mapas.

- El mapa físico es mayor que la superficie navegable.
- Objetivo: aproximadamente 40–65% de superficie útil, según función.
- Árboles, agua, ruinas, raíces, desniveles y masas de terreno delimitan recorrido.
- Mapas largos usan switchbacks, loops y shortcuts en vez de explanadas.
- Los bosses tempranos son compactos para mejorar lectura de telegraphs.
- M30 permanece grande para soportar varias fases/sectores.
- Los mapas verticales M17/M24/M29 cambian el ritmo y funcionan como grandes ascensos/rutas.

## Transiciones

V2 retira el portal genérico + tecla C entre mapas.

- Entrada/salida = camino físico en borde.
- El jugador camina hacia el borde correcto.
- La transición se dispara automáticamente al seguir avanzando hacia afuera.
- Fade corto de 0.18 s.
- El mapa siguiente coloca al PLAYER dentro del borde correspondiente.
- El regreso funciona de forma simétrica.
- PageUp/PageDown/Home/End son solamente herramientas de QA.

## Tamaños V2

- Compacto: 1024×1024.
- Medio horizontal: 1536×1024.
- Medio vertical: 1024×1536.
- Doble horizontal: 2048×1024.
- Doble vertical: 1024×2048.
- Final grande: 1536×1536.

Mapas dobles principales: M04, M06, M12, M14, M16, M17, M21, M24, M26, M29.

## Estado funcional

Esta rama valida primero navegación y lectura del continente. Los marcadores de `zone` son placeholders de producción para decidir después ubicación de:

- combate,
- puzles,
- NPC/eventos,
- refugios/interiores,
- secretos,
- recompensas,
- arenas.

No considerar estos marcadores arte final ni gameplay narrativo terminado.

## Definition of Done de este pass

- 32 mapas cargan en Godot 4.7.2.
- PLAYER aparece con cámara y colisiones.
- tamaños V2 coinciden con manifiesto.
- perfiles de ruta generan diferencias de recorrido.
- transición natural anterior/siguiente funciona sin `interact`.
- M32 no cruza al siguiente continente.
- 0 NPC/personajes externos instanciados.
- export Windows exitoso.
