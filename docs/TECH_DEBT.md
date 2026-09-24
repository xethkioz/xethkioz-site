# TECH DEBT — XETHKIOZ 11.4

## Prioridad alta

- Exceso de ramas históricas y temporales.
- Documentación antigua mezclada con documentación operativa.
- Factura Salud todavía vive dentro del repositorio web.
- Migraciones históricas duplicadas entre `database/migrations` y `supabase/migrations`.
- Multimedia pesada almacenada directamente en Git.
- Código legado de rutas/experiencias retiradas que requiere inventario por imports antes de borrar.

## Prioridad media

- `services/nexus` no está formalizado como workspace ni como repositorio separado.
- Falta suite unitaria dedicada para helpers, servicios y APIs.
- CSP conserva `'unsafe-inline'`.
- Algunos rate limits dependen de memoria de instancia.
- Releases/tags no reflejan toda la línea 11.x.

## Estrategia

1. Mantener `supabase/migrations` como ubicación canónica de migraciones nuevas.
2. Limpiar ramas sólo después de verificar merge/backup.
3. Separar Factura Salud con historial de recuperación.
4. Mover videos grandes a almacenamiento/CDN.
5. Ejecutar grafo de imports antes de retirar páginas/componentes.
6. Convertir Nexus en workspace o servicio independiente.
7. Añadir tests unitarios y cobertura sobre lógica crítica.
8. Mantener documentación de versión sincronizada con `package.json`.
