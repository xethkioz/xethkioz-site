# Architecture — Fusion Alpha 1.8 World Gate V5

## Componente principal
`src/components/fusion/FusionWorldStageV5.tsx`

## Responsabilidad
Ordenar la Home como vista principal del ecosistema:

1. Hero XETHKIOZ.
2. World Gates.
3. Noticias/actualizaciones.
4. Señales de contenido.
5. Wisp panel.
6. Estado de comunidad.
7. Cola editorial/misiones.

## Integraciones
- `LangContext`
- `WispEngineContext`
- `ProfileProgressContext`
- `fusionContent`
- `fusionConfig`

## Decisiones
- Se evita sobrecargar la vista con portales enormes.
- Los portales pasan a accesos compactos con identidad visual propia.
- El Wisp global se mantiene fuera de rutas; el panel interno solo muestra estado/contexto.
