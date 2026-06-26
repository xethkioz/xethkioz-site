# Alpha 7 Visual Gate Audit

## Build
- npm install: OK
- npm run build: OK

## Alcance
- Home visual recuperada.
- Portales funcionales.
- Wisp funcional.
- Controles globales preservados vía Header global.

## Riesgos
- La Home depende de `public/images/xethkioz/alpha6-portal-world.png`.
- La imagen tiene texto embebido; en futuras versiones debe reemplazarse por arte sin textos y texto HTML real.
- Hotspots están posicionados sobre la imagen desktop. En mobile se usa fallback para evitar errores de click.

## Pendiente
- Sustituir concept art por asset oficial final sin textos embebidos.
- Agregar avatar personalizado definitivo.
- Ajustar sonidos reales cuando se defina biblioteca sin copyright.
