# XETHKIOZ v4.0.0-rc.4.1 — V7 Foundation UX Consolidation

## Objetivo

Esta revisión deja de sumar secciones por cantidad y empieza la consolidación hacia V7: menos ruido visual, mejor experiencia móvil/escritorio y Green Wisp como identidad transversal del ecosistema.

## Cambios principales

- Home reconstruida como portada editorial simple: hero, portales, Green Wisp, últimas publicaciones y streaming.
- Navegación pública reducida a rutas de valor para visitantes.
- Herramientas internas movidas al menú "Studio" para no contaminar la experiencia pública.
- Nuevo `greenWispCore.ts` con formas/estados del Wisp por portal.
- Green Wisp redefinido como forma etérea de XETHKIOZ y entrada evolutiva a Green Node.
- Chat flotante ajustado para móvil: menos invasivo, menor altura y sala general estable.
- Green Node optimizado para móvil: video de fondo desactivado en pantallas chicas y carga diferida en desktop.

## Revisión 1

- Build debe pasar con `npm run build`.
- Home debe cargar sin depender de múltiples consultas Supabase.
- Header móvil no debe abrir una lista interminable de enlaces principales.
- Chat no debe tapar la mayor parte de la pantalla en Redmi Note 13 Pro.

## Revisión 2

- Confirmar que `/`, `/green-node`, `/community`, `/news`, `/gaming`, `/tech`, `/ai-lab`, `/science` cargan sin pantalla blanca.
- Confirmar que `/cms`, `/qa`, `/content-system` siguen disponibles como backstage.
- Confirmar que Green Wisp aparece, no invade y abre Green Node.

## Prueba local sugerida

```powershell
npm ci
npm run build
npm run dev
```

Luego probar en PC y celular:

- `/`
- `/green-node`
- `/community`
- `/news`
- `/qa`
