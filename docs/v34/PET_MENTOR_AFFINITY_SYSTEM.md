# WORLD OF XETHKIOZ — Pet Mentor Affinity System v3.4

Status: CANON DE SISTEMA (afinidades base) + balance pendiente
Date: 2026-09-08

## 1. Objetivo
Conectar de forma permanente el sistema de mascotas con los NPC principales, la exploración y el backtracking.

Las mascotas capturables no mejoran únicamente por nivel y experiencia. Cada especie posee una **Afinidad de Combate primaria** compatible con una escuela de entrenamiento representada por uno de los cuatro hermanos mentores.

El jugador descubre la afinidad real de la mascota con ayuda de Val y luego debe volver al mentor correspondiente para entrenarla, desbloquear técnicas y completar pruebas específicas.

Esto convierte a los mapas anteriores en lugares relevantes durante toda la progresión y evita que los mentores sean NPC de una sola aparición.

## 2. Flujo principal
1. Capturar una mascota.
2. Aumentar nivel y vínculo mediante juego normal.
3. Llevarla con Val para una **Evaluación de Afinidad**.
4. Val analiza comportamiento, capacidades y resonancia y determina a qué escuela pertenece.
5. El Códice de Mascotas indica el mentor recomendado y su ubicación conocida.
6. El jugador vuelve a la región/mapa donde se encuentra ese mentor.
7. El mentor propone entrenamiento, puzzle, combate o prueba práctica.
8. La mascota obtiene progreso de Escuela y puede desbloquear una técnica, modificador o evolución de habilidad.
9. Entrenamientos superiores exigen nivel de mascota, vínculo, materiales, hitos de campaña o pruebas anteriores.

## 3. Cuatro Escuelas de Afinidad base
Los cuatro hermanos son los entrenadores principales del sistema base.

### Ashley — Escuela de Resonancia
Rol de Ashley: Bardo.
Firma de combate: **Resonancia**.
Familias de daño/efecto: sonoro, arcano resonante, apoyo, control, buffs/debuffs.
Mascotas compatibles tienden a usar:
- ondas o pulsos;
- canto, vibración o energía;
- curación o escudos ligeros;
- control de masas;
- amplificación de aliados;
- debilitamiento del enemigo.

Entrenamiento típico: ritmo, sincronización, secuencias ambientales, protección de aliados y puzzles de eco.

### Fermín — Escuela de Impacto
Rol de Fermín: Guerrero.
Firma de combate: **Impacto**.
Familias de daño/efecto: físico pesado, tierra/mineral, ruptura, aguante, stagger.
Mascotas compatibles tienden a usar:
- embestidas;
- golpes pesados;
- placas, caparazones o dureza;
- provocación o protección;
- ruptura de guardia;
- resistencia.

Entrenamiento típico: resistencia, timing defensivo, ruptura de obstáculos y combates de fuerza/control del terreno.

### Isabella — Escuela del Caos
Rol de Isabella: Bruja del Caos.
Firma de combate: **Caos**.
Familias de daño/efecto: caos, vacío, anomalía prismática, área, estados y corrupción controlada.
Mascotas compatibles tienden a usar:
- AoE;
- estados alterados;
- teletransportes o distorsiones breves;
- daño periódico;
- efectos impredecibles controlables;
- manipulación de energía.

Entrenamiento típico: puzzles de patrones variables, supervivencia bajo anomalías, control de zonas y dominio de estados.

### Gael — Escuela de Acecho
Rol de Gael: Arquero.
Firma de combate: **Acecho**.
Familias de daño/efecto: perforación, precisión, naturaleza ofensiva, crítico, trampas y movilidad.
Mascotas compatibles tienden a usar:
- proyectiles;
- ataques de oportunidad;
- rastreo;
- velocidad;
- venenos naturales ligeros;
- trampas o marcas.

Entrenamiento típico: rastreo, blancos móviles, rutas ocultas, posicionamiento y pruebas de precisión.

## 4. Val — Evaluadora y guía del sistema
Val NO reemplaza a los mentores. Es el punto de entrada y la especialista que interpreta a la criatura.

Funciones:
- Evaluar Afinidad primaria.
- Explicar por qué una mascota responde mejor a determinada escuela.
- Indicar qué hermano puede entrenarla.
- Detectar una Afinidad secundaria potencial.
- Advertir si el vínculo jugador–mascota es insuficiente para un entrenamiento.
- Desbloquear información adicional de comportamiento y bienestar en el Bestiario.

La interfaz de Val debe poder mostrar:
- Afinidad primaria.
- Afinidad secundaria potencial (si existe).
- Mentor recomendado.
- Nivel de entrenamiento actual.
- Próximo requisito.
- Ubicación conocida del mentor.

## 5. Niveles de entrenamiento
Cada mascota capturable puede progresar por cuatro rangos de escuela.

**Rango 0 — Instintiva**
La mascota usa sus habilidades naturales sin formación.

**Rango I — Disciplina**
Primer entrenamiento con el mentor. Mejora una habilidad existente o desbloquea una técnica menor.

**Rango II — Técnica**
Requiere mayor nivel/vínculo y una prueba especializada. Permite elegir una variante de habilidad o pasiva.

**Rango III — Maestría**
Entrenamiento avanzado, normalmente después de un hito importante de campaña. Desbloquea una técnica distintiva de la escuela.

El sistema debe evitar que subir rangos sea solamente pagar recursos. Cada rango importante debe implicar gameplay.

## 6. Afinidad secundaria y libertad de builds
Una mascota puede poseer una Afinidad secundaria compatible, pero no todas la tendrán.

Esto permite cross-training limitado sin borrar la identidad de la especie.

Ejemplo conceptual: una criatura de Impacto con secundaria de Resonancia podría convertirse en un protector que genera una onda defensiva al bloquear.

Reglas:
- la Afinidad primaria nunca cambia;
- la secundaria modifica o complementa, no reemplaza;
- el cross-training se desbloquea más adelante;
- debe requerir vínculo alto y entrenamiento previo;
- no todas las combinaciones son válidas.

## 7. NPC principales como firmas avanzadas
Además de los cuatro hermanos, otros personajes principales poseen una **Firma de Combate** propia. Estas firmas no sustituyen las cuatro escuelas base; pueden habilitar entrenamientos avanzados o sistemas especiales en fases posteriores.

### Elida — Firma Ancestral
Espíritu, memoria, protección, conocimiento antiguo y despertares especiales.
Puede participar en evoluciones o despertares de mascotas de vínculo muy alto.

### Alexis — Firma de Supervivencia / Maestría
Adaptación, lectura de enemigos, experiencia práctica y técnicas híbridas.
Puede habilitar entrenamientos de maestría o pruebas que combinan dos escuelas.

### Ivan — Firma Cuántica
No funciona como entrenador elemental base. Sus intervenciones afectan resonancia, espacio, portales, equipamiento técnico y fenómenos imposibles de alcanzar mediante entrenamiento tradicional.

### Val — Firma de Vínculo
Curación, estabilidad, afinidad y compatibilidad. Es la puerta de entrada al sistema.

### Rola — Firma de Rastreo
Puede participar en pruebas de búsqueda, huellas y localización de criaturas raras.

### Mela — Firma de Intuición
Puede participar en pruebas de empatía, símbolos, sonidos, colores y comportamiento no racional.

Estas firmas permiten que el sistema crezca en expansiones sin añadir una docena de elementos base innecesarios.

## 8. Backtracking intencional
El entrenamiento de mascotas debe hacer que el jugador regrese a regiones anteriores con una razón real.

Reglas de diseño:
- los mentores reaparecen o mantienen lugares de entrenamiento en regiones conocidas;
- algunas pruebas usan zonas vistas antes pero ahora modificadas por clima, hora, historia o nuevas habilidades;
- secretos y recursos descubiertos durante el regreso pueden abrir contenido adicional;
- el viaje de retorno no debe sentirse como tiempo muerto: debe existir fast travel razonable, eventos regionales y nuevos descubrimientos;
- algunos entrenamientos pueden revelar rutas que eran visibles pero inaccesibles durante la primera visita.

## 9. Integración con el Bestiario
Cada entrada de mascota debe incluir:
- especie;
- nivel;
- vínculo;
- Afinidad primaria;
- secundaria potencial;
- rango de escuela;
- mentor asociado;
- técnicas aprendidas;
- variantes posibles;
- pistas de evolución;
- regiones donde fue observada;
- comportamiento y notas de Val/Rola/Mela.

## 10. Legendarios
Xethkioz y los siete legendarios NO siguen exactamente el mismo entrenamiento que las mascotas comunes.

Pueden compartir conceptos de Afinidad, pero su progresión principal es narrativa y está vinculada a Convergencias, pruebas especiales y desarrollo de personajes.

El sistema de mascotas capturables debe servir como preparación mecánica y temática para que el jugador entienda después cómo funcionan los vínculos legendarios.

## 11. Vertical Slice / Steam Demo
La demo debe mostrar una versión pequeña pero auténtica del sistema:
1. capturar una primera mascota común;
2. aumentar ligeramente su vínculo;
3. visitar a Val;
4. recibir Evaluación de Afinidad;
5. obtener la indicación del mentor correspondiente;
6. completar UN entrenamiento Rango I;
7. ver una habilidad de mascota modificada/desbloqueada.

No es necesario implementar las cuatro cadenas completas en la demo, pero la arquitectura debe soportarlas desde el inicio.

## 12. Reglas de balance
- Ninguna escuela debe ser universalmente superior.
- Cada escuela debe cambiar comportamiento, no limitarse a +X% daño.
- El entrenamiento no puede invalidar el leveo natural de la mascota.
- El vínculo sigue siendo un requisito relevante.
- El backtracking debe recompensar exploración y no convertirse en trámite repetitivo.
- Las pruebas de mentor deben ser reutilizables como plantilla con variaciones, evitando contenido idéntico.
- La Afinidad debe ser legible visualmente mediante iconos, VFX y animaciones sin depender solamente de colores.

## 13. Identidad visual de las escuelas
Dirección inicial:
- Resonancia: ondas, círculos, trazos fluidos y pulsos.
- Impacto: fragmentos, líneas pesadas, choque y polvo/mineral.
- Caos: geometría inestable, distorsión, fracturas prismáticas.
- Acecho: marcas, líneas finas, rastros, flechas y patrones orgánicos.

Cada mascota mantiene su paleta/especie propia; la Afinidad aparece como lenguaje VFX y no como recolor completo de la criatura.

## 14. Regla narrativa
Los cuatro hermanos nunca deben reducirse a menús de entrenamiento. Cada retorno debe poder aportar diálogo, evolución personal, lore o consecuencias de acontecimientos previos.

El sistema existe para reforzar la relación jugador–mascota–mentor y mantener vivos los mapas y personajes anteriores durante toda la saga.