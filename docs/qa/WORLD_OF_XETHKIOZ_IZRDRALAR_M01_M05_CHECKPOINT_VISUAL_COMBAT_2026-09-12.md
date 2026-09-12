# World of Xethkioz — IZRDRALAR M01–M05
## Checkpoint visual + combate — 2026-09-12

### Estado

- PR: #245 `Izrdralar M01–M05: guardado seguro y contrato visual Pixel HD`
- Rama: `feat/izrdralar-m01-m05-save-visual-contract`
- HEAD validado: `2649ef183cd83e3db18bcbdf45a4fe962a659de7`
- PR permanece **DRAFT / sin merge**.
- M06–M10 continúa fuera de alcance hasta cerrar M01–M05.

### QA real Godot 4.7.2

- `Izrdralar M01-M05 Gate` — run **246** — **PASS**.
- `Izrdralar Combat Visual Capture` — run **15** — **PASS**.
- Capturas runtime: 6 imágenes reales a 640×360.
- Capturas combate: 3 imágenes reales a 640×360.
- Sin `Parse Error` / `SCRIPT ERROR` en el gate validado.

### Cambios cerrados en este checkpoint

1. **Visual Pass 07 — variedad regional de props**
   - Segunda familia original de árboles, ceibo, prisma, ruina, roca y juncos.
   - Selección determinista por celda.
   - Misma semántica y footprint de colisión que el atlas validado.
   - No se copiaron píxeles ni recursos de los packs externos; se mantienen como referencia funcional únicamente.

2. **Visual Pass 08 — detalle de suelo por bioma**
   - Hojarasca, raíces, microflora, desgaste de Aldea, limo de Lago, fracturas de Ruina y fragmentos rúnicos.
   - Capa exclusivamente visual: sin colisiones nuevas ni cambios de ruta.
   - M05 se mantiene deliberadamente limpio para preservar telegraphs de Boss 5.

3. **Visual Pass 09 — identidad authored de mapa**
   - M01: firma de suelo/resonancia de la Cuenca.
   - M02: inlay propio alrededor del Prisma-Atlas para dar centro visual a la Aldea.
   - M04B: raíces y canales rúnicos que rompen la lectura de plaza cuadrada repetitiva del Santuario.
   - No se modificaron objetivos, NPC, enemigos, entradas, transiciones ni puzzles.

4. **Refinamiento de impacto de combate**
   - Slash ligeramente más persistente y definido a 640×360.
   - Núcleo blanco de contacto muy breve en burst/hit.
   - Rayos de impacto más claros sin aumentar el área de daño.
   - No cambió daño, hitbox, cooldown, alcance lógico ni progresión.

### Revisión humana de capturas

- **M01 — Cuenca del Despertar:** conserva el claro de lectura del inicio; las nuevas raíces/props quitan parte de la sensación de suelo vacío sin convertirlo en ruido.
- **M02 — Aldea del Alba:** el Prisma-Atlas ya funciona como foco visual del núcleo cívico; las viviendas conservan sus variantes authored y el centro dejó de verse como un campo verde genérico.
- **M03 — Lago Encantado:** la costa, Val/Rola/Mela, Carpinchito y los focos siguen siendo reconocibles; el detalle de suelo no compite con el puzzle.
- **M04A — Ruinas Vivas:** mantiene lectura de estructura rota y ruta; la variedad de props evita repetición excesiva.
- **M04B — Santuario de las Raíces:** los canales y raíces rompen el mosaico regular y refuerzan la identidad del puzzle sin ocultar cristales ni enemigo.
- **M05 — Corazón del Bosque Velado:** se preservó el contraste del arena y del Guardián; no se agregó decoración en el centro de combate.
- **Combate:** telegraph enemigo legible, contacto melee más claro y pulso de Boss 5 todavía delimitado sin tapar jugador, boss ni HUD.

### Canon / funcionalidad protegida

- M02→M03/M04 continúa siendo una elección real en ambos órdenes.
- M05 sigue bloqueado hasta `lake_resolved + ruins_sanctuary_resolved`.
- Boss 5: derrota → acción separada **ESTABILIZAR** → Paso Prismático.
- Val, Rola y **Mela** permanecen correctas; Milo no se reintroduce.
- M05 conserva el nombre canónico **Corazón del Bosque Velado**.
- Combate continúa siendo acción en tiempo real.

### Pendiente antes de merge / Internal Test Build

- Continuar auditoría de siluetas/personajes y detectar placeholders visuales residuales.
- Revisar lectura de movimiento/ataque sobre secuencias, no sólo capturas estáticas.
- Mantener QA real tras cada cambio relevante.
- No abrir producción de M06–M10 hasta cerrar este bloque.

### Evidencia

- `WORLD_OF_XETHKIOZ_IZRDRALAR_M01_M05_VISUAL_PASS_09_RUNTIME_CAPTURES_RUN_246_2026-09-12.zip`
- `WORLD_OF_XETHKIOZ_IZRDRALAR_COMBAT_VISUAL_QA_CAPTURES_RUN_15_2026-09-12.zip`

Este checkpoint mejora presentación y sensación de impacto sin declarar M01–M05 terminados ni autorizar merge todavía.
