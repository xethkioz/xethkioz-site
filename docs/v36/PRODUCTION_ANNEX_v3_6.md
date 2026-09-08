# WORLD OF XETHKIOZ — ANEXO DE PRODUCCIÓN v3.6

**Fecha:** 8 de septiembre de 2026  
**Estado:** PRODUCCIÓN ACTIVA  
**Fuente narrativa:** `World_of_Xethkioz_Historia_Final_Canon_v3_6.pdf`  
**Motor:** Godot 4.7.2  
**Objetivo inmediato:** reconstruir el demo Golden Region como producto jugable real, no como prototipo técnico.

---

## 0. PRECEDENCIA DE CANON

1. **Historia Final Canon v3.6** fija continuidad narrativa, motivaciones, escenas, diálogos, puzles, flags, vínculos legendarios y estructura de Saga I / Saga II.
2. **Biblia v3.3** conserva los sistemas base que v3.6 no modifica.
3. **Deltas v3.4** conservan prioridad en producto, afinidades, Convergencias, expansiones, Zodnight e Inframundo cuando no contradicen v3.6.
4. **Biblia Maestra v3.5** queda como corte técnico histórico. Sus reglas de QA, GitHub/Drive, arquitectura Godot y quality gate se mantienen, excepto donde este anexo las sustituye.
5. Este anexo no reescribe la historia del PDF. Sólo transforma su contenido en reglas de implementación y corrige divergencias del prototipo actual.

---

## 1. CAMBIOS CANÓNICOS QUE AFECTAN AL RUNTIME ACTUAL

### 1.1 Viajero — Resonancia Abierta
El Viajero no es elegido por sangre. Su capacidad diferencial proviene de haber atravesado una microfractura sin quedar fijado a una única firma temporal. Esto justifica:
- cambio de mentoría;
- distintas familias de armas;
- sistemas incompatibles;
- entrada a zonas que rechazan a los anclados;
- bucle de Andrea;
- Fusión de Luz con Xethkioz.

La revelación completa se reserva para más adelante. El sistema existe desde el inicio sin exposición excesiva.

### 1.2 Xethkioz — progresión de colas fijada
- Izrdralar: **3 colas estables**.
- Desfralar: **5 colas**.
- Xiomalar: **7 colas**.
- Zodnight: **9 colas**.

No son niveles. Son capas de vínculo/resonancia adquiridas sin perder individualidad.

### 1.3 Gustavo / ?????
Gustavo comienza identificado como `?????` / `El Vagabundo`.
- ID técnico permanente: `gustavo`.
- display_name antes de revelación: `?????`.
- display_name después de `gustavo_identity_known`: `Gustavo`.
- Nunca actúa como spoiler humano.
- Sus anticipaciones describen consecuencias o contradicciones y pueden interpretarse mal.

### 1.4 Andrea
Andrea es:
- esposa de Ivan;
- madre de Alexis;
- hermana de Gustavo;
- viva dentro de una Isla Temporal;
- parcialmente enlazada espiritualmente al futuro portal.

Ivan se convierte en científico cuántico para encontrarla.

### 1.5 Estructura comercial/narrativa
- Juego base: **Izrdralar**.
- Expansión I: **Desfralar**.
- Expansión II: **Xiomalar**.
- Zodnight: cierre mayor de Saga I.
- Isla Temporal: arco post-final.
- Saga II: **Inframundo**.

---

## 2. EL PROTOTIPO v3.5 DEJA DE SER BASE ARTÍSTICA

La build v3.5 se conserva como prueba técnica de:
- movimiento;
- combate;
- guardado/carga;
- compañeros;
- quests;
- chunk streaming;
- export Windows;
- CI.

**No se reutiliza como base visual del demo.**

Causa: la presentación actual se apoya en un atlas muy pequeño, rutas geométricas y decoración pseudoaleatoria por celda. Eso produce ruido sin jerarquía ni composición.

Desde v3.6:
- no se considera “mapa de producción” un chunk decorado por RNG;
- los POI principales se diseñan manualmente;
- el RNG queda reservado a variaciones menores controladas: flores, hojas, pequeños recursos, clima, fauna ambiental;
- caminos, agua, edificios, bosques, puentes, ruinas, landmarks, combates clave y secretos tienen composición intencional.

---

## 3. PIPELINE VISUAL OFICIAL v3.6

**Canon / escena → blockout → target visual → assets → Aseprite → Godot → captura real → QA.**

Herramientas:
- **Godot 4.7.2:** runtime.
- **PixelLab:** generación rápida de bases pixel-art, variantes, tiles, sprites y referencias consistentes.
- **Aseprite:** master final de sprites, animaciones, paletas, tilemaps y limpieza.
- **GitHub:** fuente técnica.
- **Drive:** masters, documentación, referencias y builds.

### Regla de assets
Ningún asset de IA se considera final porque “se vea bien”. Tiene que:
1. respetar la Art Bible;
2. tener procedencia registrada;
3. estar limpio en Aseprite;
4. funcionar a escala real de gameplay;
5. pasar captura in-game.

---

## 4. QUALITY BAR DEL DEMO REAL

La referencia visual entregada por el usuario se utiliza como **quality bar de densidad, legibilidad y sensación comercial**, no como material para copiar.

La primera build considerada “demo real” debe mostrar:
- caminos orgánicos y claros;
- vegetación en capas;
- agua con orillas y animación;
- foreground/occlusion;
- Viajero legible;
- Xethkioz legendario de 3 colas legibles;
- NPC con silueta propia;
- enemigos que no parezcan iconos;
- edificios/ruinas reconocibles;
- HUD compacto e integrado;
- diálogos con retratos;
- puntos de interés memorables;
- ausencia de formas geométricas usadas como arte final.

### Regla de release
No se genera una build de evaluación al usuario sólo porque compile. Primero se revisan capturas reales de:
1. menú;
2. creador;
3. Cuenca;
4. Aldea del Alba;
5. Lago Encantado;
6. Ruinas Vivas;
7. Santuario;
8. Boss 5;
9. Refugio.

---

## 5. GOLDEN REGION — NUEVO FLUJO CANÓNICO DEL DEMO

El viejo flujo `Alexis → matar 3 enemigos → Val → captura → Santuario → Boss → Refugio` queda retirado.

### Fase 0 — Creación / identidad
- creación del Viajero;
- reconstrucción mediante Prisma-Atlas opcional;
- sin selección de clase.

### Fase 1 — Cuenca del Despertar
Objetivo inicial: **SOBREVIVÍ**.
- Brote Goblin;
- Slime Prismático;
- segundo ataque desde ángulo ciego;
- Xethkioz se interpone;
- Xethkioz decide seguir al Viajero;
- recoger `objeto_extrano`;
- el medidor se enciende junto a Xethkioz.

### Fase 2 — Puente / ?????
Primer encuentro con Gustavo sin revelar identidad.

Línea canónica:
> ?????: No cruces ese puente cuando esté entero.

El puente es opcional. Si se intenta cruzar, una anomalía devuelve al jugador sin daño.

### Fase 3 — Alexis
Alexis no rescata al Viajero. Reconoce la anomalía del vínculo Xethkioz–Viajero.

Objetivo: acompañar/explorar rumbo a **Aldea del Alba**.

### Fase 4 — Aldea del Alba / Ivan
Ivan analiza el medidor y detecta una sincronización imposible.

Se entrega **Prisma-Atlas I-01** después de completar el mapa local inicial.

Se habilitan tres rutas:
- Lago Encantado;
- Ruinas Vivas;
- sendero del Santuario (visitable pero todavía incompleto).

El orden Lago/Ruinas debe poder variar.

### Fase 5A — Lago Encantado
Val, Rola, Mela.

Primer vínculo:
- no atacar al Carpinchito;
- leer huellas;
- reducir focos prismáticos;
- elegir comida/distancia/bloqueo de ruido;
- la criatura acepta el vínculo.

Flag: `familiar_first_bond`.

Val evalúa afinidad y presenta mentor recomendado.

### Fase 5B — Ruinas Vivas
Objetivo principal:
- exploración ambiental;
- encontrar Hoja 17-B;
- registrar `lore_ivan_calc_17b`;
- primera etiqueta `A-0`;
- encuentro con ????? a la salida.

Las rutas Lago/Ruinas actualizan diálogos según qué conocimiento obtuvo primero el jugador.

### Fase 6 — Santuario de las Raíces
Antes de entrar puede encontrarse `lore_elida_roots_note`.

Dungeon real de tres cámaras:
1. Agua;
2. Luz;
3. Elección combate/ecosistema.

Miniboss: Custodio de Raíz.

El Santuario revela que contenía un problema mayor.

### Fase 7 — Corazón del Bosque / Boss 5
Guardián del Bosque Velado.

No muere como enemigo común.
- al llegar a cero de la fase física entra en estado `PURGABLE`;
- se deshabilita daño letal;
- prompt: **ESTABILIZAR**;
- completar requiere interacción del jugador.

Al purgar:
- tormenta cesa;
- acceso a Refugio;
- Brote Vivo garantizado;
- mentorías desbloqueadas;
- Paso Prismático se prepara.

### Fase 8 — Puente roto / segunda lectura
El puente inicial queda roto.
Paso Prismático permite cruzarlo.

?????:
> Ahora sí.

La primera frase obtiene significado jugable.

### Fase 9 — Refugio de Elida
Elida recibe al jugador con comida, no con exposición.

El Refugio es hub emocional y funcional.

Se presentan Ashley, Fermín, Isabella y Gael como personas, no cuatro menús.

### Fase 10 — Mentoría
Prueba común con cuatro soluciones:
- Ashley: pulsos;
- Fermín: presión/contrapeso;
- Isabella: runas;
- Gael: blancos/huellas de luz.

El jugador puede probar las cuatro.

---

## 6. MAPA REAL — REGLAS DE COMPOSICIÓN

La arquitectura por sectores puede mantenerse, pero los sectores principales pasan a **mapas autorales**.

### Capas
1. **Ground:** césped, barro, piedra, senderos, agua, costa.
2. **World:** NPC, enemigos, edificios, rocas, troncos, props.
3. **Foreground:** copas, ramas, niebla, partículas, overlays de clima.

### Macrozonas Golden
- Cuenca del Despertar;
- Aldea del Alba;
- Lago Encantado;
- Ruinas Vivas;
- Bosque Velado;
- Santuario de las Raíces;
- Corazón del Bosque;
- Cueva del Ala Silente;
- Refugio de Elida.

Cada zona importante debe tener:
- entrada reconocible;
- landmark principal;
- al menos una ruta secundaria;
- al menos un secreto o interacción opcional;
- lectura visual distinta;
- backtracking futuro identificable.

No ampliar mapas por superficie vacía. La referencia de Pokémon Emerald se usa para ritmo, conectividad y memoria espacial, nunca para copiar layouts o tiles.

---

## 7. PACK VISUAL MAESTRO A PRODUCIR ANTES DE EXPANDIR CONTENIDO

### Izrdralar Style Anchor Pack
1. grass A/B/C;
2. wet grass;
3. dirt;
4. organic path edges;
5. water + 3/4 animation frames;
6. shore transitions;
7. native tree family;
8. ceibo family;
9. shrubs/flowers/reeds;
10. rocks/cliffs;
11. bridge modules;
12. prism crystal family;
13. 2150 ruin/copper modules;
14. Aldea del Alba architecture kit;
15. Refugio exterior/interior kit;
16. HUD frame/icon language.

### Character Anchor Pack
- Viajero;
- Xethkioz 3-tail form;
- Alexis;
- ?????/Gustavo;
- Ivan;
- Val;
- Rola;
- Mela;
- Elida;
- Ashley;
- Fermín;
- Isabella;
- Gael.

No producir decenas de personajes antes de aprobar estos anchors in-game.

---

## 8. XETHKIOZ — PRODUCTION TARGET

Forma inicial:
- vulpino legendario;
- 3 colas claramente legibles;
- identidad propia;
- no clon de ninguna IP;
- silueta reconocible incluso a escala pequeña;
- lenguaje prismático violeta/turquesa;
- comportamiento animal/inteligente, no mascota caricaturesca.

Animaciones mínimas del demo:
- idle;
- walk 4 direcciones;
- run/follow;
- intercept;
- hurt;
- resonance;
- rest/sleep.

---

## 9. SISTEMAS QUE DEBEN QUEDAR DIEGÉTICOS

- Prisma-Atlas = mapa + POI + resonancias + lore + rutas selladas.
- `discovered_lore` = huellas registradas, no enciclopedia automática.
- mascotas = vínculo, no captura por sometimiento.
- mentoría = formas de interpretar problemas, no clases cerradas.
- herramientas/profesiones = construidas/enseñadas por NPC.
- Brote Vivo = procedencia del Guardián purgado.
- Paso Prismático = capacidad que recontextualiza rutas anteriores.

---

## 10. FLAGS v3.6 QUE DEBEN EXISTIR DESDE AHORA

Estructurales del demo:
- `golden_awaken`;
- `xethkioz_first_intercept`;
- `strange_meter_collected`;
- `gustavo_bridge_warning_01`;
- `alexis_xethkioz_recognition`;
- `atlas_boot`;
- `route_lake_complete`;
- `route_ruins_complete`;
- `familiar_first_bond`;
- `lore_lake_resonant_stone`;
- `lore_ivan_calc_17b`;
- `lore_elida_roots_note`;
- `sanctuary_complete`;
- `boss5_physical_defeated`;
- `boss5_purged`;
- `prism_step_unlocked`;
- `refuge_key_pending`;
- `mentor_first_solution`.

Saga:
- `player_open_resonance_revealed`;
- `xethkioz_tail_stage` = 3/5/7/9;
- `gustavo_identity_known`;
- `andrea_name_known`;
- `andrea_loop_located`;
- `andrea_rescued`;
- `elida_dead_zodnight`;
- `elida_soul_detected`;
- `elida_soul_freed`.

---

## 11. QA DEL DEMO REAL

Antes de volver a entregar una build al usuario:

### Narrativa
- nueva partida reproduce el orden v3.6;
- Gustavo aparece antes de Alexis;
- Xethkioz no habla en el prólogo;
- Atlas no se entrega antes de Aldea del Alba;
- Lago/Ruinas admiten orden variable;
- Boss 5 requiere purga/interacción;
- Refugio se abre después de Boss 5;
- puente del inicio tiene segunda lectura.

### Visual
- ninguna escena principal parece generada aleatoriamente;
- Viajero, Xethkioz, NPC y enemigos tienen silueta legible;
- rutas y landmarks se entienden sin minimapa;
- HUD no tapa el mundo;
- capturas reales comparadas contra quality bar.

### Técnica
- CI verde;
- packaged PCK boot;
- save round-trip;
- sin recursos legacy;
- snapshot GitHub + Drive;
- build Windows en carpeta limpia.

---

## 12. ORDEN DE CONSTRUCCIÓN A PARTIR DE ESTE CORTE

### Sprint A — Prólogo real
1. reemplazar QuestManager por flujo v3.6;
2. secuenciar Brote/Slime/Xethkioz;
3. implementar OBJETO EXTRAÑO;
4. implementar ????? + puente;
5. reescribir Alexis;
6. conectar Aldea/Ivan/Atlas.

### Sprint B — Visual Rebuild de Cuenca
7. retirar decoración procedural del arranque;
8. tiles/style anchor;
9. Xethkioz 3 colas;
10. Viajero final demo;
11. puente/ruinas 2150/agua/foreground;
12. HUD reducido.

### Sprint C — Rutas de agencia
13. Lago / hábitat Carpinchito;
14. Ruinas / Hoja 17-B;
15. diálogos condicionales según orden;
16. Santuario 3 cámaras.

### Sprint D — cierre demo
17. Boss 5 con estado PURGABLE;
18. tormenta y cambio del mundo;
19. puente roto + Paso Prismático;
20. Refugio y mentorías;
21. playthrough 45–90 min;
22. build candidata.

---

**Decisión de producción v3.6:** la tecnología validada del prototipo se conserva; la narrativa y la capa visual se reconstruyen. No se vuelve a escalar contenido sobre la presentación v3.5.