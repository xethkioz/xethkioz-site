# WORLD OF XETHKIOZ — BIBLIA MAESTRA DE JUEGO Y PRODUCCIÓN v3.5

**Fecha de consolidación:** 8 de septiembre de 2026  
**Estado:** CANON MAESTRO + REGLAS DE PRODUCCIÓN  
**Motor de producción:** Godot 4.7.2  
**Plataforma objetivo inicial:** PC / Steam  
**Formato:** Action-RPG 2D top-down · mundo semiabierto · exploración · mascotas · supervivencia ligera · secretos

---

## 0. REGLA DE PRECEDENCIA Y FUENTE DE VERDAD

Esta v3.5 consolida la Biblia Final v3.3 y los deltas aprobados durante v3.4. Desde esta consolidación:

1. **Biblia Maestra v3.5** prevalece ante cualquier documento anterior cuando exista contradicción.
2. Los documentos v3.4 específicos siguen siendo canon cuando amplían un sistema y no contradicen esta Biblia.
3. La Biblia v3.3 queda congelada como referencia histórica de producción.
4. Documentos v3.2 y anteriores son material histórico; no deben reintroducir decisiones retiradas.
5. La rama activa de implementación puede conservar temporalmente el nombre `game/xethkioz-v34-production-rebuild`; la numeración de Biblia no obliga a renombrar una rama estable en medio de CI.
6. **GitHub es la fuente técnica viva. Google Drive es el respaldo documental y de entregables.** Ningún chat paralelo crea un proyecto alternativo sin reconciliación explícita.

---

## 1. VISIÓN DEL JUEGO

WORLD OF XETHKIOZ es un Action-RPG 2D top-down ambientado en una Argentina de 2150 alterada por la Fisura Prismática. Tecnología futura, naturaleza argentina, ruinas, magia, espíritus y planos antiguos coexisten sobre una geografía fracturada.

La promesa central es recorrer un mundo que se siente continuo y vivo, construir una identidad jugable flexible, formar vínculos con criaturas, regresar a lugares antiguos con nuevas capacidades y descubrir qué puede sobrevivir después de la Fisura.

**Tema rector:**  
> Un mundo fracturado. Una familia unida.

Explorar no significa conquistar un checklist; significa entender un territorio, sus criaturas, sus habitantes y sus cambios.

---

## 2. ESTRUCTURA OFICIAL DEL PRODUCTO

### Juego base — IZRDRALAR
Izrdralar es el juego base completo. Debe contener campaña principal cerrada, progresión completa de lanzamiento, sistemas fundamentales, Golden Region, demo de Steam y suficiente resolución narrativa para sentirse como un producto completo.

### Expansión I — DESFRALAR
Primera expansión oficial posterior al juego base. No es requisito para cerrar Izrdralar.

### Expansión II — XIOMALAR
Segunda expansión oficial, posterior a Desfralar, asociada a regiones superiores, entidades antiguas y progresión de mayor escala.

### Posible Expansión III — ZODNIGHT
Reserva futura. No consume scope de producción actual.

### Saga II — INFRAMUNDO
Inframundo pertenece a una saga posterior y separada. **No se denomina Expansión IV.** Su producción queda fuera del juego base y de la demo.

**Regla de scope actual:** producir Izrdralar. El resto sólo puede avanzar como semillas narrativas y arquitectura escalable.

---

## 3. CANON NARRATIVO CENTRAL

Argentina, año 2150. La Fisura Prismática rompe las fronteras entre el mundo físico, planos espirituales y dimensiones primigenias.

Ashley, Fermín, Isabella y Gael quedan atrapados en un colapso temporal y mantienen visualmente 15, 13, 8 y 7 años.

El jugador controla al **Viajero**, protagonista de campaña. No controla de forma permanente a los hermanos durante la historia principal.

Personajes centrales:
- **Alexis**, 35: guía de supervivencia y experiencia práctica; asociado a Paso Prismático y pruebas híbridas.
- **Elida**: abuela, boticaria/alquimista, memoria familiar, Refugio y conocimiento ancestral.
- **Ivan**: científico; estudia tecnología 2150, energía prismática, portales y fenómenos cuánticos.
- **Val**, 46: médica de criaturas y evaluadora de afinidad.
- **Rola**, 14: rastreo y observación de campo.
- **Mela**, 12: intuición, empatía y lectura de patrones no racionales.
- **Xethkioz**: compañero legendario central y eje narrativo. Nunca es una mascota capturable común.

---

## 4. DIRECCIÓN TÉCNICA OFICIAL

Producción nativa en **Godot 4.7.2** con GDScript como lenguaje principal.

Reglas:
- canvas lógico 640×360;
- nearest/pixel-perfect para sprites y tiles cuando corresponda;
- renderer GL Compatibility;
- TileMap/TileMapLayer y escenas modulares;
- CharacterBody2D para entidades móviles;
- arquitectura data-driven;
- gameplay, datos, UI y presentación desacoplados;
- señales/eventos para comunicación entre módulos;
- macro-zonas divididas en chunks/sectores;
- guardado de estado persistente, no snapshots completos de escena;
- culling/sleep de IA lejos del jugador;
- no extender el antiguo `topdown_main.gd` monolítico.

Módulos de referencia: CORE, PLAYER, NPC&AI, PETS, WORLD, QUEST, ITEMS, UI/UX, ART, AUDIO, QA, BALANCE y LORE.

---

## 5. REGLA DE PROYECTO ÚNICO Y TRABAJO ENTRE CHATS

No deben existir dos WORLD OF XETHKIOZ distintos evolucionando en paralelo.

Todo experimento realizado en otro chat —PixelLab, RPG Maker, plugins, prototipos, pruebas de sprites o mapas— se clasifica en una de tres categorías:

1. **Referencia**: sirve para estudiar estética, flujo o mecánica.
2. **Asset candidato**: puede entrar al proyecto sólo tras revisión visual/licencia/procedencia.
3. **Implementación oficial**: únicamente cuando está integrada al proyecto Godot y versionada en GitHub.

Antes de continuar una línea de trabajo paralela se debe revisar lo ya implementado en la rama oficial para evitar rehacer la misma función o generar activos incompatibles.

---

## 6. PIXELLAB / RPG MAKER — REGLA DE INTEGRACIÓN v3.5

La línea de trabajo de PixelLab/RPG Maker no constituye un segundo motor ni una segunda versión del juego.

### PixelLab
PixelLab puede utilizarse para:
- bocetos de sprites;
- limpieza rápida de PNG;
- composición de referencias;
- pruebas de paleta y silueta;
- preparación de imágenes para revisar dirección artística.

PixelLab **no** define la arquitectura, el mapa, el combate ni el runtime. Un PNG generado allí sólo entra a producción después de pasar el pipeline visual oficial.

### RPG Maker MZ y paquetes ARPG
RPG Maker, plugins ARPG y proyectos estilo Pokémon Essentials sirven como referencia de:
- movimiento libre;
- colisión y acción en mapa;
- encuentros overworld;
- seguidores;
- UI;
- ritmo de exploración;
- densidad y legibilidad de mapas.

No se introducen dependencias de RPG Maker en el build comercial. Las mecánicas útiles se reimplementan de forma nativa en Godot 4.7.2.

### Regla práctica
Si una tarea de PixelLab genera sólo una imagen que una herramienta de IA puede producir y revisar más rápido, se prioriza la vía más eficiente, siempre que el resultado mantenga consistencia, procedencia clara y adaptación al juego.

---

## 7. ART BIBLE v3.5 — QUALITY BAR

Pipeline obligatorio:

**REFERENCE → APPROVED TARGET → PRODUCTION ASSET → IN-GAME CAPTURE → QA VISUAL**

No se considera terminado un asset porque “se vea bien aislado”. Debe funcionar a 640×360 dentro de una escena real.

### Identidad de Izrdralar
- bosque: `#1C322D`;
- humedal: `#29493D`;
- agua: `#244958`;
- prisma violeta: `#8B5CF6`;
- refugio/ámbar: `#FF8C42`;
- UI principal: `#F0F0F5`.

Materiales: vegetación nativa, piedra antigua, metal/cobre del 2150, cristal prismático y tecnología improvisada/weathered.

### Prioridades visuales
1. primer minuto / Cuenca del Despertar;
2. Viajero + Xethkioz;
3. Refugio de Elida;
4. Boss 5 y telegraphs;
5. Lago Encantado;
6. HUD/UI;
7. Aldea del Alba y Ruinas Vivas.

### Gate visual obligatorio
**No se entrega al usuario una build pública/interna de evaluación visual si sigue pareciendo greybox, tech demo o placeholder.**

Antes de una nueva build visible deben existir capturas reales del ejecutable con:
- jugador reconocible;
- Xethkioz reconocible;
- NPC/enemigos diferenciables por silueta;
- terreno, caminos, agua, vegetación y estructuras legibles;
- HUD integrado;
- combate con feedback y telegraphs claros;
- composición comparable al target visual aprobado.

Mockups y concept art nunca se presentan como screenshots de gameplay.

---

## 8. XETHKIOZ — DIRECCIÓN VISUAL ACTUALIZADA

Xethkioz debe sentirse como una criatura legendaria y central, no como una mascota genérica.

**Dirección visual aprobada v3.5:** silueta vulpina inspirada en el imaginario japonés de kitsune/kyūbi, reinterpretada de forma original para WORLD OF XETHKIOZ.

Características visuales deseadas:
- lectura inmediata de zorro mítico;
- cuerpo claro/prismático;
- energía violeta y turquesa;
- orejas/cristales con firma prismática;
- cola o tratamiento de cola con peso visual y energía;
- expresión inteligente y protectora;
- evolución visual posible durante la historia sin copiar personajes existentes.

No copiar diseños de Pokémon, Naruto u otras IP. La referencia es folklórica/funcional, no una reproducción.

El número/forma final de colas y la hoja de animación completa permanecen como decisión de producción hasta aprobar un sprite sheet definitivo.

---

## 9. CREADOR DEL VIAJERO

La experiencia debe comenzar con portada/menú y creación del Viajero antes de entrar al mundo.

Variables actuales:
- nombre;
- complexión;
- tono de piel;
- peinado;
- color de cabello;
- acento visual del equipo.

La clase no se elige en el creador. La identidad de combate se construye jugando mediante mentorías, armas, sets y decisiones posteriores.

La preview debe evolucionar desde la guía funcional actual hacia un sprite real del Viajero y nunca quedar como ColorRects/placeholder en una build de evaluación visual.

---

## 10. GOLDEN REGION — ESCALA Y ARQUITECTURA DE MAPA

La Golden Region constituye el vertical slice de Izrdralar y debe sentirse como una región explorable, no como una secuencia de salas pequeñas.

Arquitectura actual de producción:
- tile base: 16×16 px;
- chunk: 32×32 tiles = 512×512 px;
- región Golden actual: 5×4 chunks = aproximadamente 2560×2048 px de espacio macro;
- streaming/culling por sectores;
- rutas principales + ramificaciones + backtracking + POI reconocibles.

La inspiración de escala/lectura tipo Pokémon Esmeralda significa:
- rutas largas pero densas;
- landmarks memorables;
- conexiones claras;
- interiores y desvíos;
- secretos;
- accesos bloqueados que luego se revisitan;
- evitar grandes áreas vacías.

No se copian mapas, tiles ni layouts de Pokémon.

### POI Golden Region
- Cuenca del Despertar;
- Refugio de Elida;
- Aldea del Alba;
- Lago Encantado;
- Ruinas Vivas;
- Santuario de las Raíces;
- Cueva del Ala Silente;
- Corazón del Bosque Velado / Jefe 5.

Golden Region debe producir al menos 4 secretos y 8 POI reconocibles.

---

## 11. COMBATE, MENTORÍAS Y SETS

Antes de mentor activo el Viajero utiliza un kit prismático de aprendiz.

Mentores principales:
- Ashley — Bardo / Resonancia;
- Fermín — Guerrero / Impacto;
- Isabella — Bruja del Caos / Caos;
- Gael — Arquero / Acecho.

Las habilidades Q/E/R pertenecen al kit activo. **F no pertenece automáticamente al mentor.** F se activa por un bonus de set de 4 piezas.

### Brote Vivo
Set inicial de 5 piezas. Las cuatro primeras piezas deben enseñarse de forma garantizada en Golden Region, sin RNG.

Regla:
- 2 piezas: pasivo;
- 4 piezas: habilidad F `Brote Vivo`;
- 5ª pieza: utilidad/ajuste estadístico.

La build debe comunicar el progreso del set en HUD/UI.

---

## 12. MASCOTAS, VAL Y AFINIDADES DE MENTOR

Flujo canónico de mascota común:

**captura → vínculo → evaluación de Val → mentor recomendado → backtracking → entrenamiento → rango/técnica nueva**

Escuelas base:
- Ashley — Resonancia;
- Fermín — Impacto;
- Isabella — Caos;
- Gael — Acecho.

Rangos:
- 0 Instintiva;
- I Disciplina;
- II Técnica;
- III Maestría.

Val evalúa y guía, pero no reemplaza a los mentores.

Vertical Slice objetivo:
- capturar Carpinchito de Cristal;
- subir algo de vínculo;
- evaluación de Val;
- afinidad Impacto;
- regreso a Fermín;
- entrenamiento Rango I;
- desbloqueo/modificación `Embate Cristal`.

Xethkioz y los siete legendarios no siguen el mismo flujo de captura/entrenamiento común.

---

## 13. XETHKIOZ, LEGENDARIOS Y MAMPORRO

Legendarios base:
- Xethkioz;
- Itzuke — rayo;
- Mozaruk — tierra;
- Killaruna — luna;
- Heller — fuego;
- Kahezer — viento;
- Okuninust — agua;
- Dvalin — hielo.

Mamporro es un aliado abisal especial, no un integrante capturable del listado de ocho legendarios.

Ivan entrega una herramienta/ancla para recuperar a Mamporro. Posteriormente Mamporro permite despertar en Xethkioz una capacidad de vuelo entre ciudades/zonas seguras visitadas, bajo requisitos y cooldown definidos.

---

## 14. SISTEMAS DE PROGRESIÓN

### Viajero
Nivel máximo base: 60. La progresión obligatoria nunca debe requerir grind arbitrario para compensar diseño insuficiente.

### Mascotas
Nivel propio, vínculo, afinidad y rango de escuela. No deben eclipsar al Viajero ni convertirse en stats pasivos sin gameplay.

### Profesiones
Todos los oficios pueden aprenderse. Nivel 1-100. Se integran con exploración, recursos, crafting y economía, no con monetización de poder.

### Equipo
Slots y rarezas definidos en v3.3 se mantienen salvo rebalance posterior explícito.

### Clima/día-noche
El sistema completo escala a Izrdralar, pero la demo sólo expone estados controlados suficientes para demostrar mundo vivo sin comprometer legibilidad ni telegraphs.

---

## 15. PRESENTACIÓN DE NPC, ENEMIGOS Y COMBATE

A 640×360, la lectura tiene prioridad sobre el detalle microscópico.

NPC principales deben distinguirse por silueta, edad/rol y equipo, no sólo por color.

Enemigos Golden base deben distinguirse por forma y comportamiento, no ser recolores simples.

Base actual de lectura:
- Brote Goblin;
- Explorador Goblin;
- Slime Prismático;
- Escarabajo de Corteza;
- Espíritu de Bruma;
- Drone Pampeano Roto.

Cada variante relevante cambia al menos comportamiento/parámetro y VFX/telegraph además de la paleta.

---

## 16. REFUGIO DE ELIDA

El Refugio es un hub emocional y mecánico.

Debe sentirse cálido, vivido y personal: madera, botica, alquimia, archivo, fogón, tecnología recuperada, objetos familiares y luz ámbar/prismática.

Funciones:
- descanso/recuperación;
- mentorías;
- crafting/alquimia;
- diálogos familiares;
- archivo/lore;
- cambio/respec cuando corresponda;
- punto seguro de retorno.

No debe parecer una habitación vacía o un fondo genérico.

---

## 17. ESTADO REAL DE PRODUCCIÓN — CORTE v3.5

La producción oficial ya contiene:
- bootstrap con splash, menú, nueva partida, opciones, créditos y salida;
- creador del Viajero;
- introducción narrativa inicial;
- persistencia de CharacterProfile;
- Golden Region modular/chunked;
- streaming de chunks y POI;
- terreno con variantes deterministas;
- agua, riveras, puentes, ruinas, santuario, boss arena y refugio exterior;
- props/landmarks de segunda pasada visual;
- Refugio interior explorable;
- Viajero y Xethkioz con sprites direccionales de producción intermedia;
- atlas de NPC principales con siluetas diferenciadas;
- atlas de seis enemigos iniciales con siluetas diferenciadas;
- feedback de combate, daño, pickups, estados y telegraphs;
- IA con estados y windup/recovery;
- seguidores Xethkioz/Familiar;
- Val/afinidad/mentor como sistema canónico;
- CI para import, boot de flujo, Golden Region, Refugio y export Windows;
- sistema en incorporación para capturas reales 640×360 de menú, creador, Cuenca, Lago y Refugio.

### Qué NO debe afirmarse todavía
- no es Steam-ready;
- no hay Art Bible final cerrada para todos los personajes;
- no hay demo visual aprobada por el usuario;
- no debe mostrarse como build de calidad final hasta superar el gate visual;
- los assets de producción actuales todavía pueden requerir reemplazo/pulido.

---

## 18. CAPTURAS REALES Y QA VISUAL

El pipeline de CI debe producir capturas reales de Godot, no mockups, como criterio de evaluación continua.

Capturas mínimas:
- menú;
- creador;
- Cuenca del Despertar;
- Lago Encantado;
- Refugio de Elida.

Cada pase visual se evalúa contra:
- claridad de personaje;
- densidad del entorno;
- variedad de terreno;
- composición;
- iluminación;
- escala;
- HUD;
- lectura de combate;
- coherencia con el target aprobado.

Una build visual sólo se entrega después de revisar estas capturas.

---

## 19. LICENCIAS Y PROCEDENCIA DE ASSETS

Referencias externas —Solarus, Tuxemon, TopdownStarter, action-rpg-template, RPG Maker, Pokémon Essentials/plugins y packs— nunca se importan indiscriminadamente.

Política:
- estudiar patrones y reimplementar mecánicas en GDScript;
- usar asset directo sólo con licencia compatible verificada;
- registrar procedencia por asset antes de Steam;
- evitar dependencias GPL o share-alike no deseadas sobre contenido propietario;
- no usar personajes, criaturas, logos, nombres o tiles distintivos de Pokémon u otras IP;
- mantener la identidad original de WORLD OF XETHKIOZ.

---

## 20. DRIVE, GITHUB Y BACKUP

### GitHub
Fuente técnica viva del proyecto.

Rama de reconstrucción actual:
`game/xethkioz-v34-production-rebuild`

### Google Drive
Estructura oficial:
- `01 - Biblia y Documentación` — Biblia maestra, sistemas y documentación;
- `02 - Builds y Desarrollo` — source snapshots, builds internas validadas y checksums;
- `03 - Arte, Mapas y Referencias` — referencias visuales aprobadas, mapas, capturas reales y assets revisados;
- `04 - Expansiones y Roadmap Futuro` — Desfralar, Xiomalar, Zodnight;
- `05 - Saga II - Inframundo` — saga posterior.

### Regla de sincronización
Cada hito significativo debe quedar:
1. versionado en GitHub;
2. validado por CI;
3. respaldado en Drive cuando corresponda;
4. documentado en Biblia/changelog si cambia canon o arquitectura.

No se sube al Drive de builds una compilación fallida o un greybox presentado como demo. Puede conservarse un artefacto técnico si está claramente marcado como interno.

---

## 21. RELEASE GATE PARA LA PRÓXIMA BUILD DEL USUARIO

La próxima build entregada al usuario debe pasar todos estos puntos:

- main menu real y creador funcional;
- entrada a Izrdralar sin saltar directamente a escena técnica;
- Viajero identificable;
- Xethkioz identificable y visualmente más cercano a la dirección vulpina/kyūbi;
- al menos Cuenca/Lago/Refugio visualmente coherentes;
- terreno sin repetición obvia;
- NPC y enemigos distinguibles;
- HUD integrado;
- feedback de combate legible;
- capturas 640×360 revisadas;
- CI verde;
- build Windows limpia;
- backup de snapshot/build en Drive;
- ninguna pantalla principal basada en placeholders geométricos.

Si no pasa este gate, la build permanece interna.

---

## 22. ROADMAP INMEDIATO v3.5

### P0 — Calidad visible
1. completar capturas reales automáticas del ejecutable;
2. revisar Cuenca, Lago y Refugio contra el target visual;
3. reemplazar cualquier asset que siga pareciendo placeholder;
4. pulir HUD, menú y preview del creador;
5. cerrar sprite sheet de Xethkioz con dirección vulpina aprobada;
6. terminar Boss 5/telegraphs con calidad de showcase.

### P0 — Integración funcional
7. terminar wiring de Brote Vivo: piezas 1-4, HUD y F sólo con 4 piezas;
8. validar Carpinchito → Val → Fermín → Rango I;
9. probar guardado/carga con CharacterProfile, quest y Familiar;
10. revisar colisiones, navegación, cámara y chunk streaming.

### P1 — Región Golden
11. elevar Aldea del Alba y Ruinas Vivas al mismo nivel visual;
12. secretos/POI/backtracking;
13. minimapa/Atlas útil en mapas grandes;
14. audio/SFX base y ambiente regional;
15. playtest funcional 45-90 min.

### P2 — Después del vertical slice
16. expansión de sistemas al resto de Izrdralar;
17. contenido de profesiones/loot a escala;
18. más especies capturables y variantes;
19. localización, gamepad y accesibilidad;
20. Steam packaging sólo cuando calidad y estabilidad lo justifiquen.

---

## 23. CAMBIOS PRINCIPALES DESDE v3.3

v3.5 consolida:
- Izrdralar como juego base completo;
- Desfralar y Xiomalar como expansiones I/II;
- Zodnight como posible expansión III;
- Inframundo como Saga II separada;
- Pet Mentor Affinity System con Val como evaluadora;
- backtracking de mentores;
- producción actual por chunks de Golden Region;
- quality gate que prohíbe entregar greybox como demo;
- capturas reales de CI como parte de QA visual;
- PixelLab/RPG Maker como pipeline auxiliar/referencia, no proyecto alternativo;
- dirección visual de Xethkioz más vulpina, inspirada en kitsune/kyūbi pero original;
- regla explícita de sincronización GitHub ↔ Drive ↔ Biblia;
- política anti-duplicación entre chats.

---

## 24. DECISIONES AÚN ABIERTAS

No quedan cerradas por esta Biblia:
- sprite sheet definitivo final de Xethkioz;
- número/forma narrativa final de sus colas;
- set completo final de animaciones del Viajero;
- identidad musical definitiva;
- balance final de XP/loot/profesiones;
- diseño final de todos los bosses posteriores a Boss 5;
- fecha de Steam.

Estas decisiones se incorporarán mediante delta v3.5.x o una futura v3.6 sólo cuando sean realmente materiales.

---

**Regla final:** primero coherencia, después cantidad. WORLD OF XETHKIOZ no vuelve a dividirse en proyectos paralelos ni a entregar prototipos visuales como si fueran demos.