# XETHKIOZ Web 11.0 — auditoría de seguridad, cuenta y contenido

Fecha: 17 de agosto de 2026  
Commit funcional: `be474e694f6c9c5c49c0897f32784259085446ca`  
Estado: aprobado para producción

## Puerta de despliegue

La publicación sólo debe fusionarse cuando el preview final de Vercel figure como `READY`. El preview fue comprobado con el historial de 24 horas visible, la identidad reservada bloqueada para visitantes y el panel público libre de contenido de demostración.

## Alcance revisado

- portada y navegación pública;
- radar de noticias y detalle editorial;
- panel de usuario sin sesión;
- sesión autorizada y perfil de propietario;
- chat público, identidad visible y retención;
- permisos y tareas programadas de Supabase;
- compilación, rutas, SEO, privacidad, accesibilidad y presupuestos Lighthouse.

## Cambios aprobados

### Identidad del propietario

- `profiles.is_site_owner` separa la propiedad del sitio del rol administrativo.
- Sólo puede existir una cuenta propietaria.
- El indicador no puede ser cambiado por usuarios normales.
- `XETHKIOZ` y sus variantes normalizadas quedan reservados para esa cuenta.
- La base de datos aplica la regla aunque el cliente sea manipulado.

### Retención del chat

- La lectura pública sólo incluye mensajes de las últimas 24 horas.
- La caché local usa el mismo límite.
- Supabase Cron elimina cada hora los mensajes vencidos.
- El historial anterior a la ventana fue eliminado al aplicar la migración.

### Panel de usuario

- Se eliminó el panel de demostración que exponía contenido y misiones ficticias.
- Sin sesión, la ruta sólo presenta el estado de cuenta y acciones reales.
- Con sesión, la actividad se consulta por `user_id` bajo RLS.

### Contenido

Se publicaron ocho piezas desarrolladas con fuentes oficiales para Gaming, IA, Ciencia, Tecnología, Programación, Green Node, Universo COMICON y Huellas de Puan. No se agregaron portadas pesadas a la carga inicial.

## Pruebas superadas

- TypeScript y compilación de producción.
- Integridad de rutas y shells SEO.
- Privacidad, telemetría y sesión.
- Profundidad e integridad editorial.
- Diseño de contenido y conocimiento por portal.
- Playwright y Axe.
- Lighthouse: rendimiento, accesibilidad, buenas prácticas, SEO y presupuestos de peso.

## Hallazgos pendientes para una fase posterior

1. Activar la protección contra contraseñas filtradas desde la configuración de Supabase Auth.
2. Revisar límites y abuso de los RPC públicos de estadísticas de Huellas sin romper el contador.
3. Mover XP y recompensas relevantes a funciones de servidor antes de convertirlas en beneficios reales.
4. Incorporar rate limiting, denuncia y bloqueo más visibles al chat comunitario.
5. Evitar cadenas de commits pequeños antes de una preview: los builds intermedios pueden ejecutarse sin todas las migraciones requeridas.

Estos hallazgos no bloquean la publicación actual: están registrados como trabajo de seguridad y arquitectura para Web 12.
