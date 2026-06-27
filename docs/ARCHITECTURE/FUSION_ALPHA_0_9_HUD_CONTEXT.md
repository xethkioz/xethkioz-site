# Fusion Alpha 0.9 — HUD Context

El HUD deja de depender del estado local de `Header` y pasa a tener un contexto global: `HudProvider`.

## Razón
Los controles de idioma, audio y cuenta son parte del ecosistema completo, no de una página ni de un portal individual.

## Estado actual
- Idioma: sigue controlado por `LangProvider`.
- Audio: ahora vive en `HudProvider`.
- Volumen: persistente y preparado para pistas futuras.
- Cuenta: sigue como botón placeholder hasta reconstrucción de Auth.

## Regla
Ningún portal debe implementar controles globales propios. Todos dependen del HUD global.
