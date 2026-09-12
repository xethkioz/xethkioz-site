# P08 — ISABELLA — CHARACTER CORE RUNTIME CONTRACT

Fecha: 2026-09-12
Estado: implementación funcional aislada / arte provisional.

## Canon protegido
- Edad: 8 años.
- Rol: Mentora de Magia Caótica y Pirotecnia / atacante de área y efectos volátiles.
- Afinidad vigente: Fuego / Caos Controlado.
- Vínculo: Heller.
- La antigua referencia visual Viento/Astral queda fuera de este runtime por conflicto con la ficha técnica y la Historia Final vigente.
- Heller no se instancia físicamente en M01–M05 ni se adelanta su Convergencia.

## Estados funcionales
- `idle_playful`
- `walk_hop`
- `spark_shot`
- `chaos_burst`
- `heller_fury`
- `hurt`
- `downed` / recuperación temporal

## Contrato de combate
`Spark Shot` es un ataque a distancia con daño directo y una secuencia secundaria controlada y reproducible: burn → stun → chain. La secuencia mantiene la identidad de caos sin introducir RNG opaco en QA.

`Chaos Burst` afecta únicamente objetivos dentro del radio authored y aplica daño + el siguiente efecto de la secuencia controlada.

`Heller Fury` representa fuego delimitado: daño y quemadura sólo dentro de un radio fijo. Esto protege el concepto narrativo de “caos con borde” y evita convertir a Heller en una explosión indiscriminada.

## QA
Gate dedicado: `Izrdralar P08 Isabella Runtime Gate`.
Debe validar identidad, afinidad vigente, renderer provisional, movimiento, ciclo burn/stun/chain, límites de Chaos Burst/Heller Fury y hurt/downed/recovery.

## Visual
`P08_ISABELLA_PROTOTYPE_RENDERER_NOT_FINAL_ART`.
El renderer procedural es exclusivamente evidencia técnica. No equivale a aprobación de arte Pixel HD ni debe usarse como objetivo visual final.
