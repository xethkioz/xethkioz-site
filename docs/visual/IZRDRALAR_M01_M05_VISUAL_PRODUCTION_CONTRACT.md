# WORLD OF XETHKIOZ — IZRDRALAR M01–M05 VISUAL PRODUCTION CONTRACT

Versión 1.0.0 · 11/09/2026

## Propósito

Este documento convierte el canon visual de Drive en una especificación de producción utilizable por Godot. No es un mockup ni declara que los cinco mapas ya estén authored. Define qué debe existir para que el tramo inicial sea coherente, funcional y verificable dentro del runtime 640×360.

Fuente activa: Biblia Final Consolidada Saga I v1.0, conexiones y naturaleza v1.0, rama técnica game/xethkioz-v34-production-rebuild.

## Decisiones bloqueadas

- Motor: Godot 4.7.2.
- Canvas lógico: 640×360; preview 2×; filtro nearest.
- Tile base: 16×16; chunks: 512×512.
- M01: Cuenca del Despertar.
- M02: Aldea del Alba.
- M03: Lago Encantado.
- M04: Ruinas Vivas / Santuario de las Raíces, con subáreas 04-A y 04-B.
- M05: Corazón del Bosque Velado.
- “Brote Vivo” queda como alias técnico del prototipo y como set inicial; no reemplaza el nombre canónico de M05.
- M03 y M04 son una elección real del jugador desde M02.
- M05 requiere resolver la preparación del Lago/Santuario y luego habilita el Paso Prismático hacia M06.
- Xethkioz es legendario, vulpino y no capturable.
- Todos los personajes deben compartir el contrato transversal de movimiento, ataque, interacción, colisión, estados, diálogo, flags y guardado.

## Paquete visual obligatorio

Cada mapa debe tener, como mínimo:

1. Ground y bordes de terreno con lectura de ruta.
2. Agua, raíces, piedra y obstáculos con capas de profundidad.
3. POI reconocible desde cámara de gameplay.
4. Entradas y salidas rotuladas en el manifest, no sólo dibujadas.
5. Colisiones separadas del glow y de la decoración.
6. Iluminación pixelada: fondo, medio, foreground y sombra de contacto.
7. Props interactivos identificables sin texto permanente.
8. Captura real dentro de Godot; una lámina aislada no aprueba el asset.
9. Procedencia/licencia de cada recurso externo.
10. Nombres estables M01–M05 y no aliases del scaffold como IDs narrativos.

## Pases por mapa

| ID | Pase visual | Interacción funcional |
|---|---|---|
| M01 | Cuenca, agua baja, puente roto, primera lectura de escala | movimiento 8 direcciones, primer combate, aparición de Xethkioz, checkpoint inicial |
| M02 | Aldea cálida, lámparas, NPC distinguibles, salida doble | zona segura, diálogos, acceso a Iván, decisión Lago/Ruinas, guardado |
| M03 | Lago legible, piedra resonante, orilla transitable, hábitat | lore interactuable, XP único, retorno a M02, preparación del vínculo |
| M04 | Ruinas orgánicas, raíces, santuario y telegraphs | interacción de pista, combate, entrada M04-A/M04-B, Custodio |
| M05 | Arena del Corazón, presión vegetal, contraste violeta/ámbar | Boss 5, telegraphs, daño/feedback, estabilización, retorno y salida M06 |

## Contrato de personajes

Viajero: idle, walk, attack, hurt e interact en ocho direcciones. El pivote está en los pies; la colisión no incluye auras ni efectos.

Xethkioz: idle, follow, lectura de resonancia, hurt y feedback de vínculo. Debe conservar silueta vulpina prismática reconocible en 640×360 y no funcionar como una mascota común.

## Gate de aceptación

El tramo no pasa si falla una sola de estas condiciones:

- No se puede recorrer una conexión habilitada.
- La elección Lago/Ruinas no queda registrada.
- El ataque no tiene anticipación, impacto y reacción.
- El jugador o Xethkioz atraviesa un obstáculo visualmente sólido.
- Guardar y reabrir pierde mapa, entrada, posición o flags.
- M05 se presenta como “terminado” sin captura runtime.
- Hay placeholders o mockups usados como si fueran gameplay.
- El nombre de M05 vuelve a aparecer como “Brote Vivo” en UI narrativa.
- Una expansión aparece como contenido jugable del juego base.

## Relación con Drive

- Canon: 01 - Biblia y Documentación / 01 - Canon Maestro.
- Construcción y código: 02 - Builds y Desarrollo / v3.5 - Producción Godot.
- Arte aprobado y previews: 03 - Arte, Mapas y Referencias / 00 - Canon Visual, 01 - Mapas y Diagramas y 02 - Personajes - Arte y Previews.
- La carpeta PixelLab permanece como referencia/asset candidato hasta registrar procedencia y aprobarlo dentro del runtime.

## Siguiente acción técnica

1. Usar `data/visual/izrdralar_m01_m05_visual_contract.json` como contrato data-driven.
2. Aplicar el save schema 10 con backup y recuperación.
3. Portar la navegación real a M01–M05 sin sustituir la GoldenRegion por un contador de mapas.
4. Generar capturas 640×360 de M01, M02, M03, M04-A/B y M05.
5. Ejecutar el smoke del contrato y luego el QA funcional real.
6. Sólo después crear la build de entrega.

Estado de este documento: contrato de producción. No equivale a 100% terminado.
