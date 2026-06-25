# XETHKIOZ v4.0 RC1.4 — Network Integrity + Wisp Review

## Objetivo
Pulir la estructura de XETHKIOZ Network sobre RC1.3 sin romper la web clásica.

## Cambios principales
- Se actualiza versión a `v4.0.0-rc.1.4`.
- Se agrega `NetworkIntegrityPanel` para auditar sectores, links internos críticos, redes oficiales y EGGs.
- Se refuerza Science Lab con política editorial, campos obligatorios y tablero de fuentes.
- Se amplía Green Node con módulos editoriales: Ubuntu/Linux, programación, cyber defensivo y misterios documentales.
- El Wisp recuerda localmente si el usuario ya descubrió Green Node.
- Se agrega migración SQL aditiva para `network_modules`, `green_node_unlocks` y `science_sources`.

## Revisión funcional
- `/network`: debe mostrar mapa modular + auditoría + links + EGG Matrix.
- `/science`: debe mantener estética formal, ahora con tablero de fuentes.
- `/green-node`: debe conservar video banner, terminal y ahora sumar field modules.
- Wisp flotante: click abre portal, escribir `greennode` abre portal, si ya fue descubierto muestra indicador.

## Nota LIVE
No usar audio de YouTube en producción si no hay licencia. Usarlo solo como referencia estética. Para LIVE subir audio propio o generado por IA con derechos claros.
