# XETHKIOZ v4.0 RC1.3 — Network Links + Wisp Review

Build: 2026-06-25

## Objetivo

Pulir la etapa XETHKIOZ Network antes de avanzar a RC2: revisar enlaces, estructura modular, Science Lab, Green Node, Wisp/Easter Egg, SQL y preparación LIVE.

## Cambios principales

- Nueva página `/network` con mapa del ecosistema.
- Registro visual de enlaces funcionales mediante `LinkAuditPanel`.
- Wisp verde mejorado con:
  - click directo,
  - hint visual,
  - secuencia secreta `greennode`,
  - portal con runas,
  - soporte `prefers-reduced-motion`.
- Green Node ampliado con access vectors y comandos extra.
- SQL nuevo para:
  - `network_modules`,
  - `link_registry`,
  - `green_node_access_logs`,
  - `science_report_sources`.
- Dynamic News Engine ampliado con más fuentes de gaming, IA y ciencia.

## Rutas a probar

- `/`
- `/network`
- `/gaming`
- `/tech`
- `/science`
- `/news-engine`
- `/green-node`
- `/cms`
- `/roles`
- `/community`
- `/chat-overlay?obs=1`

## Criterio de Green Node

Green Node debe sentirse como una sección oculta dentro de XETHKIOZ, no como una pestaña normal. El Wisp es el acceso recomendado. La ruta directa existe para testeo, SEO controlado y administración.

## Política de audio

El enlace de YouTube compartido queda como referencia estética. Para producción usar audio propio o generado por IA con derechos claros. No se incorpora reproducción automática externa.

## Próximo paso

RC2 debe enfocarse en contenido real administrable, CMS conectado a Supabase y pruebas de roles/permisos.
