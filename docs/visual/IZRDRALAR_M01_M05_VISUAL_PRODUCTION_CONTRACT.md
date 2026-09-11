# WORLD OF XETHKIOZ — IZRDRALAR M01–M05 VISUAL PRODUCTION CONTRACT

Versión 1.1.0 · 11/09/2026

## Propósito

Este documento convierte el canon visual de Drive en una especificación de producción utilizable por Godot y registra el runtime authored activo de M01–M05. No es un mockup ni declara cierre visual definitivo: define qué existe, qué se valida automáticamente y qué falta para aprobar capturas finales 640×360.

Fuente activa: Biblia Final Consolidada Saga I v1.0, conexiones y naturaleza v1.0, rama técnica `feat/izrdralar-m01-m05-save-visual-contract` sobre `game/xethkioz-v34-production-rebuild`.

Runtime autoritativo del tramo: `res://scenes/izrdralar/IzrdralarM01M05Runtime.tscn`.

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
- M03 y M04 son una elección real del jugador desde M02 y pueden resolverse en cualquier orden.
- M05 queda bloqueado hasta resolver Lago y Ruinas/Santuario.
- Tras Boss 5 existe una acción separada ESTABILIZAR; Paso Prismático se desbloquea recién después de esa acción.
- M06 permanece fuera del Production Pass 01.
- Xethkioz es legendario, vulpino y no capturable.
- Todos los personajes deben compartir el contrato transversal de movimiento, ataque, interacción, colisión, estados, diálogo, flags y guardado.
- Guardado: schema 10 con `map_id`, `entry_id`, posición exacta, flags, backup y recuperación.

## Paquete visual obligatorio

Cada mapa debe tener, como mínimo:

1. Ground y bordes de terreno con lectura de ruta.
2. Agua, raíces, piedra y obstáculos con capas de profundidad.
3. POI reconocible desde cámara de gameplay.
4. Entradas y salidas rotuladas en datos de layout/navegación, no sólo dibujadas.
5. Colisiones separadas del glow y de la decoración.
6. Iluminación pixelada: fondo, medio, foreground y sombra de contacto.
7. Props interactivos identificables sin texto permanente.
8. Captura real dentro de Godot; una lámina aislada no aprueba el asset.
9. Procedencia/licencia de cada recurso externo.
10. Nombres estables M01–M05 y no aliases del scaffold como IDs narrativos.

## Pases por mapa

| ID | Pase visual | Interacción funcional |
|---|---|---|
| M01 | Cuenca, agua baja, puente roto, primera lectura de escala | movimiento libre, primer combate, Xethkioz, Eco del Despertar, checkpoint inicial |
| M02 | Aldea cálida, lámparas, NPC distinguibles, salida doble | Iván, Prisma-Atlas, decisión Lago/Ruinas, retorno a M01, guardado |
| M03 | Lago legible, piedra resonante, orilla transitable, hábitat | Piedra Resonante, combate, retorno a M02, sello del Lago |
| M04 | Ruinas orgánicas, raíces, santuario y telegraphs | Núcleo del Santuario, combate, retorno a M02, segundo sello |
| M05 | Arena del Corazón, presión vegetal, contraste violeta/ámbar | Boss 5, telegraphs, derrota, ESTABILIZAR, Paso Prismático y retorno |

## Contrato de personajes

Viajero: movimiento vectorial en ocho direcciones; arte final debe cubrir lectura direccional aprobada para idle, walk, attack, hurt e interact. El pivote está en los pies; la colisión no incluye auras ni efectos.

Xethkioz: idle, follow, lectura de resonancia, hurt y feedback de vínculo. Debe conservar silueta vulpina prismática reconocible en 640×360 y no funcionar como una mascota común.

## Estado funcional validado por gate

El workflow `Izrdralar M01-M05 Gate` ejecuta Godot 4.7.2 real y valida:

- importación sin Parse Error/SCRIPT ERROR;
- carga del contrato, recursos y runtime authored;
- grafo M01–M05 y ambos órdenes M03/M04;
- bloqueo de M05 hasta resolver las dos ramas;
- save v10 y recuperación desde backup;
- instanciación de M01, M02, M03, M04 y M05;
- Boss 5 → derrota → ESTABILIZAR → Paso Prismático;
- persistencia de flags y checkpoint exacto;
- autosave de posición con intervalo y umbral de movimiento;
- respawn en entrada authored del mapa actual;
- integración del bootstrap con Nueva Partida/Continuar;
- arranque del runtime principal sin timeout usado como falso PASS.

## Gate de aceptación visual pendiente

El tramo no se considera cerrado visualmente si falla una sola de estas condiciones:

- No se puede recorrer una conexión habilitada.
- La elección Lago/Ruinas no queda registrada.
- El ataque no tiene anticipación, impacto y reacción suficientes en captura real.
- El jugador o Xethkioz atraviesa un obstáculo visualmente sólido.
- Guardar y reabrir pierde mapa, entrada, posición o flags.
- M05 se presenta como “terminado” sin captura runtime.
- Hay placeholders o mockups usados como si fueran gameplay final.
- El nombre de M05 vuelve a aparecer como “Brote Vivo” en UI narrativa.
- Una expansión aparece como contenido jugable del juego base.

## Relación con Drive

- Canon: 01 - Biblia y Documentación / 01 - Canon Maestro.
- Construcción y código: 02 - Builds y Desarrollo / v3.5 - Producción Godot.
- Arte aprobado y previews: 03 - Arte, Mapas y Referencias / 00 - Canon Visual, 01 - Mapas y Diagramas y 02 - Personajes - Arte y Previews.
- La carpeta PixelLab permanece como referencia/asset candidato hasta registrar procedencia y aprobarlo dentro del runtime.

## Siguiente acción técnica

1. Mantener verde el gate funcional M01–M05.
2. Generar capturas runtime 640×360 de M01, M02, M03, M04-A/B y M05.
3. Revisar navegación visual, colisiones, telegraphs, escala y legibilidad contra el canon.
4. Completar el pase de arte/animación pendiente, incluido el objetivo visual de ocho direcciones.
5. Recién con runtime + capturas + QA aprobados evaluar merge y build de entrega.

Estado de este documento: runtime funcional activo bajo QA visual. No equivale todavía a cierre visual 100%.
