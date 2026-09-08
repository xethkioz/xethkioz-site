# WORLD OF XETHKIOZ — NPC Support Arcs v3.4

Status: canon de personajes + diseño de implementación propuesto
Date: 2026-09-08

## Regla general
WORLD OF XETHKIOZ tendrá NPC recurrentes con funciones narrativas y sistémicas concretas. No deben sentirse como simples vendedores o interfaces humanas: cada uno debe entrar en la historia mediante una situación, misión, rescate, descubrimiento o vínculo previo y luego convertirse en una pieza útil de progresión.

## Nico M. — compañero de antaño de Alexis

### Canon
- Nico M. es un antiguo compañero de Alexis.
- El jugador debe rescatarlo en uno de los territorios de Izrdralar.
- Tras el rescate se convierte en NPC recurrente.
- Su arco está relacionado con una transformación avanzada del estilo de combate y con el desbloqueo del Paladín.

### Diseño de producción
Nico M. será el NPC que convierte al Paladín en una recompensa narrativa, no en una opción disponible desde la creación del personaje.

Ruta propuesta:
1. El jugador encuentra referencias a un antiguo compañero de Alexis desaparecido.
2. Alexis entrega información incompleta sobre la última expedición de Nico.
3. Se abre una cadena de rastreo/exploración en una zona peligrosa.
4. El jugador localiza a Nico atrapado, herido, sellado o resistiendo una anomalía.
5. Rescate con combate + puzzle + decisión de ruta.
6. Nico regresa a un refugio/hub.
7. Tras una segunda prueba enseña la Disciplina Paladín.

### Paladín
El Paladín no debe reemplazar las clases base ni convertirse en una quinta clase rígida inicial. Se plantea como una disciplina avanzada/híbrida desbloqueable.

Funciones posibles:
- conversión parcial de habilidades existentes a variantes sagradas/protectoras;
- bloqueo/parry mejorado;
- aura o protección de aliado/mascota;
- curación limitada basada en combate;
- daño contra corrupción/entidades específicas;
- acceso a armas o sets de Paladín.

Regla de balance: el Paladín debe ofrecer una nueva forma de build, no ser estrictamente superior a Guerrero/Bardo/Brujo/Arquero.

## Matí A. — amigo de Alexis / desarrollo técnico

### Canon
- Matí A. es otro amigo de Alexis.
- Se incorpora cuando el jugador desbloquea el segundo mundo: DESFRALAR.
- Trabaja junto a Ivan desarrollando complementos y funcionalidades para el jugador.

### Función narrativa
Matí A. debe complementar a Ivan sin duplicarlo:
- Ivan diseña la teoría, energía, dispositivos cuánticos y tecnología imposible.
- Matí A. convierte prototipos en herramientas prácticas, estables y utilizables durante la aventura.
- Alexis aporta la experiencia de campo para detectar qué funciones realmente necesita el grupo.

Esta combinación forma un pequeño núcleo de ingeniería de expedición:
IVAN = investigación.
MATÍ A. = implementación y optimización.
ALEXIS = validación de campo.

## Sistema de Complementos
Matí A. e Ivan desbloquean un sistema modular de complementos. Los complementos deben obtenerse mediante quests, recursos y progreso; nunca mediante pago real ni ventajas P2W.

Ejemplos iniciales:

### Módulo de Inyección Automática
- permite configurar auto-uso de una poción cuando la vida cae por debajo de un porcentaje seleccionado;
- consume pociones reales del inventario;
- posee cooldown;
- puede mejorarse para soportar una segunda condición o tipo de consumible;
- no elimina la gestión de recursos.

### Analizador de Experiencia
La "mejora de EXP" no será un multiplicador permanente gratuito.

Diseño recomendado:
- inicialmente +5% a +10% de EXP bajo condiciones concretas;
- requiere un módulo equipado o activado;
- puede consumir carga/recurso;
- versiones avanzadas recompensan exploración, elites, dungeons o primeras derrotas en lugar de fomentar grind repetitivo;
- límites de balance por expansión.

Objetivo: acelerar ligeramente progresión secundaria y alts/builds sin romper la curva principal.

### Complementos futuros posibles
- detector de recursos cercanos;
- registro automático de criaturas para el bestiario;
- alerta de objeto raro;
- estabilizador de portal;
- mejora de recuperación fuera de combate;
- presets de consumibles;
- ampliación de ranuras de herramientas, nunca de daño bruto ilimitado.

## Integración con expansiones
### IZRDRALAR
- sembrar referencias a Nico M.;
- rescatarlo y desbloquear progresivamente la disciplina Paladín;
- mencionar a Matí A. mediante conversaciones de Alexis/Ivan sin necesidad de presentarlo todavía.

### DESFRALAR
- entrada formal de Matí A.;
- primer laboratorio/taller conjunto Ivan + Matí A.;
- sistema de Complementos desbloqueado;
- primeras mejoras automáticas y utilidades de expedición.

### XIOMALAR
- complementos cuántico-prismáticos avanzados;
- Matí A. enfrenta límites de convertir teoría de Ivan en tecnología estable;
- Nico puede aportar una evolución superior del Paladín o una prueba especial relacionada con entidades superiores.

### ZODNIGHT
- los sistemas creados por Nico, Ivan y Matí deben seguir siendo relevantes;
- algunos complementos pueden ser necesarios para preparar la expedición final, pero nunca deben sustituir los Ocho Vínculos Legendarios ni el protagonismo de Xethkioz.

## Regla técnica
El sistema debe implementarse data-driven:
- `npc_id`
- `unlock_requirements`
- `quest_chain`
- `services`
- `upgrade_tree`
- `expansion_requirement`

Los servicios de NPC deben ser módulos independientes para poder sumar otros personajes con nuevas funciones sin modificar controladores monolíticos.
