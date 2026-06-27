# XETHKIOZ Fusion Alpha 2.9 — Interaction Engine

## Objetivo

Integrar `framer-motion` como base para interacciones cinemáticas reutilizables dentro de la arquitectura por motores.

## Cambios principales

- Nuevo motor: `src/engines/animations/InteractionEngine.tsx`.
- Nuevo barrel export: `src/engines/animations/index.ts`.
- Nuevo dependency contract: `framer-motion`.
- Componente reutilizable `AnimatedItem`.
- Variantes base para hover expansivo, rotación 3D sutil, tap feedback, partículas y brillo.
- Variantes `wispPulse` preparadas para Wisp Engine.
- Variantes `cinematicContainer` preparadas para overlays, portales y paneles.

## Uso previsto

`AnimatedItem` debe envolver objetos interactivos del ecosistema:

- espada del simulador RPG;
- Wisp;
- objetos del inventario;
- cards de portal;
- piezas del Green Node;
- futuros elementos del Avatar/Profile Engine.

## Seguridad y arquitectura

- No toca Supabase.
- No cambia SQL.
- No altera rutas públicas.
- No reemplaza componentes existentes.
- Deja el motor listo para adopción progresiva.

## Validación

Ejecutado:

```bash
npm run audit
```

Resultado: PASS.
