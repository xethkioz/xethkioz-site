# XETHKIOZ v4.0 RC1.7 — Layout Isolation + Green Node Video Polish

Build: 2026-06-25

## Objetivo

Esta revisión corrige el comportamiento detectado en pruebas locales:

- Green Node quedaba demasiado conectado al header principal.
- La navegación superior estaba saturada.
- Science Lab necesitaba sentirse como una división formal y no como una página gamer.
- El video verde debía integrarse como banner real de Green Node.
- El Wisp debía seguir existiendo como EGG, pero no invadir los portales aislados.

## Cambios principales

### Navegación

- Header principal simplificado.
- Menú superior reducido a:
  - Inicio
  - Gaming & Tech
  - Science Lab
  - Network
  - Streaming
  - Comunidad
  - Más
- Elementos secundarios movidos a `Más`.
- Green Node sigue oculto y no aparece como link normal del menú.

### Green Node

- `/green-node` ahora funciona como portal aislado.
- No usa Header ni Footer global.
- Tiene navegación interna propia.
- Integra el video verde como hero/banner real:
  - `public/videos/green-node-banner.mp4`
- Mantiene terminal, protocolo, campos, logs y Easter Eggs.
- Incluye botón claro para volver a XETHKIOZ/Network.

### Science Lab

- `/science` ahora funciona como división formal aislada.
- No usa Header ni Footer global.
- Tiene navegación institucional propia:
  - Informes
  - Fuentes
  - Campos
  - Relacionadas
  - Network
- Mantiene tono profesional, fuentes, evidencia e informes.

### Wisp

- El Wisp no aparece dentro de Green Node ni Science Lab.
- El Wisp sigue funcionando como acceso oculto desde el ecosistema principal.
- Se conserva el EGG `greennode`.

## QA realizado

- Revisión de rutas.
- Revisión de navegación.
- Revisión de video Green Node.
- Build local esperado: `npm run build`.
- No incluir `.env`, `.git`, `node_modules` ni `dist` en ZIP de entrega.

## Próximo paso

Probar localmente:

```bash
npm install
npm run build
npm run dev
```

Rutas clave:

- `/`
- `/network`
- `/science`
- `/green-node`
- `/content-system`
- `/qa`
- `/cms`
