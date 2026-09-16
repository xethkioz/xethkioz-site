# World of Xethkioz — Media Slots y Protección de IP

Estado: estructura web preparada; producción interna Unity + Blender separada de la presentación pública.

## Regla vigente — 2026-09-15

- NO publicar modelos 3D limpios, renders técnicos, mallas, materiales, UV, rig, model sheets ni archivos GLB/GLTF/FBX/OBJ/BLEND/ZIP.
- NO usar capturas de Unity, graybox, T-pose o QA como material promocional público.
- El material fuente permanece en `02_REFERENCIAS_PRIVADAS_NO_PUBLICAR` y fuera del repo desplegable.
- La web usa únicamente arte promocional transformado que conserve identidad sin permitir reconstruir el asset fuente.
- Screenshots/gameplay reales se habilitarán más adelante mediante una revisión visual y legal específica.
- Las Resonancias negativas se presentan con misterio; no se muestran modelos completos sin aprobación expresa.

## Slots públicos

- HERO: key art cinematográfico transformado + logo oficial.
- VIAJERO / ETEREO: silueta o sigilo editorial, nunca el modelo limpio.
- XETHKIOZ: arte de Resonancia derivado, nunca LOD0/T-pose/render técnico.
- MUNDO: key art propio por bioma; no captura Unity por ahora.
- PRISMA-ATLAS: arte editorial o silueta transformada de criaturas.
- FORMAS: sigilos / afinidades hasta que exista un paquete promocional aprobado.
- PERSONAJES: retrato promocional transformado; originales privados.
- VEYR / WISP: manifestación gráfica derivada del asset interno.
- ESCENARIOS / GAMEPLAY: placeholders hasta habilitar material in-game seguro.

## Arte web protegido vigente
- `/assets/world-of-xethkioz/web-art/player-etereo-sigil.svg`
- `/assets/world-of-xethkioz/web-art/xethkioz-resonance-sigil.svg`
- `/assets/world-of-xethkioz/web-art/veyr-green-sigil.svg`
- `/assets/world-of-xethkioz/web-art/biome-izrdralar.svg`
- `/assets/world-of-xethkioz/web-art/biome-desfralar.svg`
- `/assets/world-of-xethkioz/web-art/biome-xiomalar.svg`
- `/assets/world-of-xethkioz/web-art/biome-zodnight.svg`
- `/assets/world-of-xethkioz/web-art/hero-family-resonance.svg`

## Guardrail automático

`scripts/wox-ip-protection-check.mjs` debe bloquear el build si aparece un archivo 3D/archive prohibido bajo `public/assets/world-of-xethkioz` o si vuelve una referencia pública a los assets limpios retirados.

El criterio anterior de Pass 13 que permitía publicar el LOD0 de Xethkioz y el GLB/render limpio de Veyr queda reemplazado por esta política.

Objetivo: mostrar suficiente identidad para vender el universo sin entregar los archivos o detalles de producción necesarios para copiarlo.
