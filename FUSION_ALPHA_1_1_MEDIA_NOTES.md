# XETHKIOZ Fusion Alpha 1.1 — Media Slots

## Objetivo
Integrar el video provisto por el usuario en la Green Web sin usarlo como interfaz completa ni romper la arquitectura.

## Cambios
- Agregado `public/videos/green-wisp-nexus.mp4`.
- Green Node ahora tiene una capa de video ambiental fija, con overlays de lectura.
- El video es decorativo: `muted`, `loop`, `playsInline`, `aria-hidden`.
- No se tocó SQL.
- No se tocó Supabase runtime.
- La portada mencionada de otro chat no fue incluida porque no está disponible en este hilo/ZIP. Queda pendiente cargarla aquí para integrarla como asset real.

## Riesgo
Bajo. El video pesa menos de 2 MB y se usa como fondo ambiental.
