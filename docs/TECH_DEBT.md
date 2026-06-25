# TECH DEBT — XETHKIOZ v4.0

## Deuda técnica inicial

- `src/lib` concentra demasiadas responsabilidades.
- Documentación histórica mezclada con documentación actual.
- Posible presencia de archivos generados en repositorio remoto.
- Falta estructura preparada para CMS grande.
- Falta separación admin/community/content.

## Plan de resolución

1. Crear `feature/v4-audit`.
2. Separar carpetas.
3. Mover archivos por grupos.
4. Actualizar imports.
5. Ejecutar build.
6. Documentar.
