# XETHKIOZ Alpha 3.1 — Green Node Banner Preview

## Objetivo

Agregar un prototipo sandbox para el banner Green Node con:

- video local como capa atmosférica;
- overlay falso negro #0B0A0F;
- grid/noise digital;
- sintetizador Web Audio procedural;
- respeto conceptual del estado de sonido HUD mediante prop `hudSoundEnabled`.

## Archivo

```txt
src/engines/world/sandbox/GreenNodeBannerPreview.tsx
```

## Encapsulamiento

No se importa en producción. Debe permanecer como sandbox hasta pasar por Media Engine review.

## Recurso esperado

```txt
public/videos/green-wisp-nexus.mp4
```

## Nota de audio

No usa archivos `.mp3` ni `.wav`. Genera bleeps/glitches con Web Audio API.
