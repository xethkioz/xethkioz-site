# Xethkioz Web 12 — visión y hoja de ruta

Estado: propuesta posterior a Web 11.0  
Fecha base: 17 de agosto de 2026

## Objetivo

Convertir Xethkioz en una red editorial y comunitaria más rápida, reconocible y sostenible, sin perder la identidad de sus portales. Web 12 debe evolucionar por módulos y mantener siempre una versión pública estable.

## Principios

- El contenido y la navegación tienen prioridad sobre los efectos.
- Cada portal comparte un sistema visual, pero conserva una identidad inequívoca.
- Las imágenes se cargan según contexto y nunca bloquean la primera lectura.
- Las funciones comunitarias nacen con moderación, privacidad y límites de abuso.
- Cada publicación informa su fecha, autor, fuente oficial y última revisión.
- Mascotas conserva su dirección actual: solo se mejora rendimiento, accesibilidad y operación.

## Líneas de producto

### 1. Gaming: centro de juego

- Portada editorial con noticias, guías completas, calendario y fichas de juegos.
- Diseño más inmersivo, con color y movimiento controlados por el usuario.
- Filtros por plataforma, género y tipo de contenido.
- Guías versionadas para evitar instrucciones obsoletas.
- Carga progresiva de portadas y capturas; prioridad para texto y navegación.

### 2. Green Node: tecnología útil

- Reorganización en IA, ciencia, seguridad, programación y tecnología.
- Interfaz de nodo técnico más clara, con menos ruido visual y mayor contraste.
- Fichas prácticas con requisitos, pasos, riesgos, verificación y fuente primaria.
- Indicadores visibles de contenido actualizado, archivado o pendiente de revisión.

### 3. Universo COMICON

- Archivo de personajes con imágenes editoriales reales o arte original autorizado.
- Noticias explicadas, cronologías, comparadores y fichas enlazadas.
- Mini cómic semanal con temporada, capítulo, navegación y calendario de publicación.
- Separación clara entre información oficial, análisis y creación original.

### 4. Huellas de Puan

- Mantener el diseño aprobado y reforzar búsqueda, adopciones, perdidos y encontrados.
- Formularios con moderación, datos mínimos y vencimiento automático.
- Mejoras de accesibilidad y rendimiento sin alterar su identidad visual.
- Herramientas locales de prevención y cuidado con fuentes sanitarias oficiales.

### 5. Cuenta y comunidad

- Perfil real sin datos de demostración, preferencias por portal y privacidad comprensible.
- Consola exclusiva del propietario separada de los roles de moderación.
- Chat efímero, anti-suplantación, límites de frecuencia, denuncia y bloqueo.
- Logros y actividad calculados en servidor; nunca confiar en el cliente para permisos.

## Plataforma editorial

- Flujo borrador, revisión, publicación, corrección y archivo.
- Campos obligatorios: resumen, cuerpo desarrollado, fuentes primarias, fecha y responsable.
- Revisión automática de enlaces rotos y avisos de contenido envejecido.
- Presupuestos por ruta para JavaScript, CSS, fuentes e imágenes.
- Imágenes responsivas, formatos modernos y carga diferida fuera del primer viewport.

## Seguridad y operación

- Activar protección de contraseñas filtradas en Supabase Auth.
- Revisar y limitar los RPC públicos de estadísticas de Huellas.
- Mantener RLS como barrera principal y añadir pruebas de autorización a CI.
- Política de seguridad de contenido, cabeceras defensivas y registro de eventos administrativos.
- Copias y restauración probadas antes de migraciones estructurales.

## Fases propuestas

### Fase 0 — Medición

Inventario de rutas, contenidos, consultas, peso visual, accesibilidad y métricas reales. Define la línea base y los presupuestos.

### Fase 1 — Sistema común

Tokens visuales, componentes, navegación, tipografía, tarjetas editoriales, estados vacíos y contratos de datos compartidos.

### Fase 2 — Gaming y Green Node

Reconstrucción gradual detrás de rutas o banderas de función. Cada portal debe pasar QA visual, editorial, móvil y de rendimiento antes de reemplazar al actual.

### Fase 3 — Comunidad y publicación

Panel, moderación, calendario editorial, validación de fuentes, mantenimiento de enlaces y herramientas del propietario.

### Fase 4 — Lanzamiento Web 12

Auditoría integral, prueba de restauración, accesibilidad, SEO, seguridad, telemetría respetuosa y despliegue progresivo con reversión.

## Criterios mínimos de salida

- Sin rutas rotas ni datos de demostración en producción.
- Ningún usuario común puede adoptar la identidad reservada del propietario.
- Contenido nuevo con fuente oficial y suficiente desarrollo editorial.
- Cumplimiento de los presupuestos de carga definidos en la Fase 0.
- Navegación completa por teclado y contraste AA en las rutas principales.
- Migraciones reversibles y verificadas en un entorno previo.
- Versión visible y coherente en el pie, metadatos y documentación.
