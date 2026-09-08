# WORLD OF XETHKIOZ — Izrdralar Lore Seeds v3.4

Status: CANON DE PRODUCCIÓN PARA JUEGO BASE
Date: 2026-09-08

## 1. Objetivo
Izrdralar debe cerrar su propia historia y funcionar como juego completo, pero al mismo tiempo sembrar señales diegéticas de conflictos futuros sin anunciar expansiones de forma explícita.

Las semillas de lore deben sentirse útiles en el presente y adquirir una segunda lectura cuando el jugador conozca Desfralar, Xiomalar, Zodnight o Saga II: Inframundo.

## 2. Regla de presentación
Las pistas futuras se presentan mediante:
- conversaciones contextuales;
- cartas y notas;
- carteles y señalética vieja;
- objetos extraños;
- registros de Ivan;
- relatos de Elida;
- comportamiento de criaturas y Xethkioz;
- cambios ambientales.

No usar textos promocionales como “esto será importante en la próxima expansión”. El jugador debe poder ignorar una pista y entenderla mucho después.

## 3. Primeras cinco semillas jugables
### Nota doblada — Elida
Texto inicial:
“Las raíces viejas recuerdan caminos que nadie cavó. Si un día dejan de beber agua y empiezan a beber luz, no las sigan solos.”

Lectura inmediata: advertencia sobre el Bosque Alterado.
Lectura futura: profundidad, rutas antiguas y conexión con Desfralar.
Efecto actual: Alexis reacciona si el jugador encuentra la nota; también modifica la conclusión de la misión `Raíces alteradas`.

### Piedra resonante — Lago Encantado
Texto inicial:
“La piedra está tibia. Al tocarla aparece un segundo latido: no pertenece al Viajero ni a Xethkioz, y desaparece apenas intentás seguirlo.”

Lectura inmediata: anomalía del lago.
Lectura futura: diferencia entre vínculo auténtico y Eco Resonante.
Efecto actual: desbloquea un diálogo contextual de Val.

### Hoja de cálculo — Ivan
Texto inicial:
“Lectura 17-B: la anomalía no desciende. Una señal gemela asciende por encima de las nubes y mantiene masa aparente donde el radar insiste en marcar vacío.”

Lectura inmediata: fallo extraño del Prisma-Atlas.
Lectura futura: primera semilla de Xiomalar.
Efecto actual: desbloquea un diálogo contextual de Ivan.

### Reloj sin agujas
Texto inicial:
“No tiene agujas ni óxido. Cada ocho segundos emite un pulso que hace retroceder a Xethkioz. El sonido parece llegar una fracción antes de que el objeto vibre.”

Lectura inmediata: anomalía temporal.
Lectura futura: Tiempo Primigenio / conflicto tardío de Zodnight.
Efecto actual: activa reacciones contextuales de Alexis e Ivan.

### Cartel de mantenimiento
Texto inicial:
“ACCESO SELLADO. Riesgo de presión y pérdida de orientación. Las galerías continúan descendiendo más allá del último nivel cartografiado.”

Lectura inmediata: justifica una ruta cerrada.
Lectura futura: existencia de profundidad mucho mayor bajo Izrdralar y semilla de Desfralar.

## 4. Sistema jugable
- Cada pista es un objeto `interactable` real.
- Primera lectura: se registra en GameState, actualiza Atlas y otorga +8 XP.
- Relectura: mantiene el texto, sin repetir recompensa.
- El progreso de pistas se guarda en SaveService mediante `discovered_lore`.
- Los NPC pueden consultar `GameState.has_lore(id)` y responder con líneas contextuales.
- El HUD muestra `Atlas · Ecos X/5` para la vertical slice.

## 5. Principio de backtracking narrativo
Las pistas descubiertas pueden alterar conversaciones cuando el jugador regresa a un NPC. Este patrón debe ampliarse en Izrdralar:

explorar → descubrir pista → volver a un personaje → obtener nueva interpretación → abrir misión/puzzle/entrenamiento.

La intención es que volver a regiones anteriores tenga valor narrativo además de recompensas y progresión de mascotas.

## 6. Guardrail
Las cinco semillas actuales son una muestra funcional. No deben llenar el mapa de texto. La densidad final debe mantener curiosidad y lectura ambiental: una pista importante debe estar rodeada de gameplay, no competir con otras cinco notas en el mismo espacio.

## 7. Próxima ampliación
Después de validar esta base:
1. añadir Rola y Mela al Lago Encantado;
2. conectar la Piedra Resonante con el tutorial de afinidad/captura;
3. convertir al menos una pista en una pequeña cadena de búsqueda;
4. añadir cartas/diálogos rotativos de Ashley, Fermín, Isabella, Gael y Elida;
5. hacer que clima/hora habiliten al menos una pista adicional;
6. mantener todas las referencias futuras ambiguas durante el juego base.
