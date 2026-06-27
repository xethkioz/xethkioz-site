# Fusion Alpha 1.8 — World Gate V5

## Objetivo
Reestructurar la Home como World Gate V5 con una jerarquía limpia, modular y menos saturada.

## Cambios
- Nuevo componente `FusionWorldStageV5`.
- Home delega la composición al nuevo World Gate.
- Paleta DesignSystem añadida a Tailwind: `fusionBg`, `fusionSurface`, `fusionAccent`.
- Nueva clase base `panel-cyber`.
- Hero, portales, noticias/actualizaciones, Wisp panel, estado de comunidad y señales de contenido separados por secciones.
- Mantiene i18n ES/EN mediante datos localizados y traducciones existentes.
- Mantiene HUD/Wisp global fuera de rutas.

## Seguridad/arquitectura
- Sin SQL nuevo.
- Sin Supabase runtime.
- Sin imágenes usadas como interfaz completa.
- Sin romper rutas públicas.
