# XETHKIOZ WEB — HOJA DE RUTA MAESTRA
**Fecha de corte:** 11 de noviembre de 2026  
**Estado:** planificación y validación del rediseño en rama de pruebas; no es una constancia de puesta en producción.  
**Documento único de seguimiento:** `CREATOR_PLATFORM_ROADMAP.md`  
**Repositorio:** `xethkioz/xethkioz-site`  
**Rama:** `redesign/creator-cloud-platform`  
**Pull request:** https://github.com/xethkioz/xethkioz-site/pull/313  
**Último commit comprobado antes de actualizar esta hoja:** `4618a6f60d4be5b91fc1e8e8c6ee7b44e5104fdf`  
**Preview Vercel READY:** https://xethkioz-site-3ef30vjzn-xethkioz-site.vercel.app/ (acceso protegido por Vercel).

---

## 1. Visión del producto

XETHKIOZ dejará de ser principalmente un portal gamer de secciones independientes para convertirse en una **plataforma comunitaria de creadores**. Cada persona podrá registrarse, tener un perfil y publicar una ficha de su software, videojuegos, videos, obras digitales, modelos y herramientas de inteligencia artificial.

**Principio de almacenamiento BYOS (Bring Your Own Storage):** el creador conserva los archivos en su propia nube; XETHKIOZ almacena las fichas, metadatos, permisos mínimos y enlaces, no copias masivas del contenido de la comunidad. Los enlaces a archivos son externos y deben pasar revisión. Google Drive, Dropbox y OneDrive son las primeras opciones; una integración OAuth/Picker solo puede ofrecerse cuando esté técnicamente verificada y configurada con consentimiento.

### Mantener — sin borrar datos ni rutas útiles
- **Green Node:** seguridad, tecnología y cultura digital, con estética cyber/hacking propia. No imponerle a este espacio un tema claro que le reste identidad.
- **Ciencia / ArgenCiencia:** divulgación, investigación, ciencia y tecnología; información contrastada, navegación legible y diseño luminoso.
- **Mascotas / Huellas Argentina:** sitio y datos existentes, estética natural, modelos/ilustraciones de mascotas de calidad y usabilidad móvil.

### Retirar de navegación principal
Antiguos portales Gaming, Aion 2, WoW Forever, secciones Digital/comunidad general, servicios/creación web y portales anteriores, de acuerdo con la nueva dirección aprobada. **No implica destruir juegos, código histórico, cuentas, archivos, backups imprescindibles ni datos de proyectos**. La nueva rama ya prepara 23 redirecciones HTTP a /explorar; comprobar compatibilidad y SEO antes de promoverlas. Noticias y archivos legacy pueden conservarse técnicamente aunque desaparezcan del menú.

### Arquitectura actual
React + Vite + Vercel + Supabase Auth/Postgres + CMS existente. **No iniciar una migración a Next.js por estética o preferencia previa:** evaluar su costo y dependencias en una decisión arquitectónica independiente.

---

## 2. Inventario verificado — qué existe realmente

| Componente | Estado | Evidencia / limitación |
|---|---|---|
| Nueva portada Creator Network luminosa | **Implementada en preview** | CTA, categorías, últimos proyectos aprobados, módulos conservados |
| Catálogo /explorar | **Implementado en preview** | Filtros y búsqueda local sobre un conjunto limitado de proyectos publicados; falta paginación/búsqueda en servidor |
| Fichas /proyecto/:id | **Implementadas en frontend** | Se muestran solo proyectos publicados; tabla SQL todavía ausente |
| Perfil público /creador/:id | **Implementado en frontend** | Se deriva de publicaciones aprobadas; no muestra correos ni borradores |
| Registro/login | **Reutilización preparada** | Supabase Auth anterior; falta QA de altas, recuperación de contraseña, sesiones y redirecciones |
| Biblioteca /mis-proyectos | **Frontend preparado** | Estados y borradores; CRUD sin activación de tablas nuevas |
| Formulario /publicar | **Frontend preparado** | Hoy requiere pegar enlace HTTPS de una nube; no sube archivos automáticamente |
| Guardar borrador / enviar a revisión | **Frontend + SQL preparados** | Sin prueba real end-to-end ni migración aplicada |
| Panel CMS /cms/creator-moderation | **Código preparado** | Cola, aprobación, rechazo, reportes; función Edge no desplegada |
| Migración de proyectos, reportes y auditoría | **Preparada, NO aplicada** | `supabase/migrations/20261021111400_creator_platform_mvp.sql` |
| Seguridad de base de datos | **Diseñada, sin test de RLS real** | Políticas por propietario, grants por columna, RPC transaccionales de moderación |
| Google Drive OAuth/Picker | **Pendiente** | Solo enlace compartido manual |
| Dropbox y OneDrive | **Enlaces externos manuales** | No hay conexión de cuentas ni gestor de archivos |
| Redirecciones legacy y sitemap | **Implementadas en rama** | 23 redirecciones; mapa principal actualizado, no publicado |
| Green Node | **Conservado** | Falta regresión visual/funcional completa |
| Ciencia | **Conservado** | Falta regresión visual/funcional completa |
| Mascotas/Huellas Argentina | **Conservado** | Sitio estático propio; falta regresión completa y mejora gráfica |
| Vercel preview | **READY** | Build y auditorías estáticas correctas; la vista solicita Login de Vercel a externos |
| Pruebas Playwright reales | **Especificaciones añadidas, pendientes de ejecutar** | No confundir compilación con prueba visual o autenticada |
| Producción `main` | **Sin cambios** | Último SHA comprobado: `e544bf558dab3305d91b4a8d1333180a899445f3` |
| Supabase de creadores | **Sin activar** | Verificación SQL de 11/11/2026: las tres tablas no existen |

**Interpretación:** tenemos un MVP visual y su arquitectura de seguridad en código, **no** una red de creadores utilizable públicamente de punta a punta.

---

## 3. Plan priorizado de ejecución

Usar los códigos WEB-* en commits, pruebas y seguimiento. Los estados son **LISTO EN RAMA**, **EN PREPARACIÓN**, **PENDIENTE**, **BLOQUEADO** o **POST-MVP**. La prioridad P0 es obligatoria para una beta segura, P1 para una versión pública usable, P2 para ampliar el producto.

### FASE 0 — Base técnica reproducible y QA del preview (P0)
**Meta:** comprobar la aplicación como usuario real antes de activar escrituras.

- [ ] **WEB-001** Resolver el acceso al preview protegido de Vercel con una sesión autorizada. No desactivar la protección de previews por comodidad ni exponer una URL privada de bypass.
- [ ] **WEB-002** Ejecutar pruebas Playwright reales en escritorio y móvil contra una compilación local o preview autorizado. Verificar Home, Explorar, perfiles, errores, autenticación, privacidad, Science, Green Node y Mascotas.
- [ ] **WEB-003** Corregir desbordes, navegación duplicada, ventanas superpuestas, controles inaccesibles, errores de consola y fallos de carga.
- [ ] **WEB-004** Levantar inventario y mapa de dependencias: tablas, Storage buckets, rutas, variables, funciones, assets y páginas que aún consumen el sistema legacy.
- [ ] **WEB-005** Registrar el plan de rollback de la web y de la base. Mantener los juegos y proyectos privados fuera de la limpieza web.

**Salida exigida:** QA visual documentado, lista de fallos críticos en cero, prueba reproducible y preview accesible a revisores autorizados.

### FASE 1 — Base de datos de creadores y pruebas de permisos (P0)
**Meta:** garantizar que un usuario solo puede crear/modificar sus propios registros y nunca publicarse por sí mismo.

- [ ] **WEB-010** Revisar migración SQL aditiva, dependencias, índices, costos de consultas, constraints, eliminación de usuarios y grants. Evaluar reversión segura.
- [ ] **WEB-011** Probar la migración en entorno aislado con cuentas de prueba o base de staging. Evitar ejecutar primero contra la única base real.
- [ ] **WEB-012** Comprobar políticas RLS para anon, usuario A, usuario B, moderador y servicio. Probar SELECT/INSERT/UPDATE/DELETE no autorizados, falsificación de author_id, de estado y de campos administrativos.
- [ ] **WEB-013** Verificar RPC transaccionales de aprobación, rechazo y denuncia: bloqueo de doble aprobación, autoaprobación, condiciones de carrera y rollback del evento de auditoría.
- [ ] **WEB-014** Revisar el riesgo TOCTOU: el autor no debe poder cambiar el enlace entre la revisión humana y la aprobación sin invalidar la revisión. Considerar revisión por versión/huella de la ficha o bloquear modificaciones mientras está pendiente.
- [ ] **WEB-015** Confirmar permisos del esquema REST y el comportamiento de Supabase Auth, email confirmado, recuperación y renovaciones de sesión.
- [ ] **WEB-016** Aplicar migración a la base principal **solo tras pruebas, respaldo y aprobación de liberación**; ejecutar SQL de comprobación posterior.

**Salida exigida:** matriz de permisos aprobada y CRUD real sin exposición cruzada. No activar formularios públicos hasta superar esta fase.

### FASE 2 — Moderación y defensa contra abuso (P0)
**Meta:** impedir la publicación automática de software o enlaces maliciosos.

- [ ] **WEB-020** Revisar y desplegar Edge Function `creator-moderation` en staging; comprobar origen permitido, validación de JWT por servidor y rol confiable (`app_metadata`).
- [ ] **WEB-021** Probar aprobación, devolución con motivo, despublicación por denuncia, actualización de estados y trazabilidad.
- [ ] **WEB-022** Incorporar limitación de frecuencia **persistente** en API/base (el contador en memoria de una función serverless no basta como límite global) y controles anti-bot.
- [ ] **WEB-023** Implementar validación del enlace en el servidor: HTTPS, dominio, credenciales embebidas, redirecciones, hosts privados, URLs firmadas que expiran, enlaces inaccesibles y posible phishing.
- [ ] **WEB-024** Definir evaluación por reputación/escaneo cuando corresponda; la aprobación humana no constituye garantía antivirus. Evitar SSRF: no descargar arbitrariamente desde el servidor sin controles.
- [ ] **WEB-025** Permitir denuncias categorizadas (malware, derechos de autor, suplantación, spam, otros), cola priorizada, decisiones auditables y mecanismo de apelación.
- [ ] **WEB-026** Definir condiciones de rechazo y plazo razonable de revisión, sin prometer SLA que todavía no existe.

**Salida exigida:** ningún enlace público sin revisión autorizada; denuncias verificables y reversión de publicación funcional.

### FASE 3 — Registro, perfil y experiencia de creador (P0 → P1)
**Meta:** que una persona nueva pueda entrar, entender qué hacer y conservar su trabajo.

- [ ] **WEB-030** Alta, login, logout, recuperación, confirmación de correo, sesión expirada y redirección a /publicar, probados en móvil.
- [ ] **WEB-031** Perfil editable: nombre público, alias único, bio, avatar, enlaces sociales y preferencias, con permisos y moderación de nombres/avatares.
- [ ] **WEB-032** Perfil público con URL estable, creaciones aprobadas, enlace desde ficha/tarjeta y no indexación de perfiles vacíos o privados.
- [ ] **WEB-033** Biblioteca personal: estados claros (borrador, pendiente, publicado, corrección solicitada), edición, borrado de borradores y solicitud de despublicación de fichas aprobadas.
- [ ] **WEB-034** Notificaciones en el sitio y, si se autoriza, correo de aprobación/rechazo, denuncia relevante o enlace caducado. Evitar envíos no consentidos.
- [ ] **WEB-035** Confirmación antes de acciones irreversibles, errores comprensibles, guardado seguro ante cortes de conexión y accesibilidad en formularios.

**Salida exigida:** recorrido completo con cuenta de prueba, sin tickets manuales ni edición de datos por consola.

### FASE 4 — Nube personal y publicación de archivos (P1)
**Meta:** cumplir de verdad el requisito de que cada usuario use su nube personal.

- [x] **WEB-040** Primera opción: pegar URL pública HTTPS de solo lectura de Drive, Dropbox, OneDrive o nube propia; sujeto a revisión.
- [ ] **WEB-041** Conectar Google Drive mediante consentimiento y OAuth de mínimo alcance; selector Google Picker donde sea apropiado. No almacenar contraseñas ni claves de servicio en frontend.
- [ ] **WEB-042** Diseñar manejo seguro de tokens: expiración, revocación, scopes, almacenamiento mínimo y política de desconexión. Verificar reglas de Google y permisos de uso de archivos.
- [ ] **WEB-043** Permitir seleccionar un archivo existente; diferenciar seleccionarlo de **subirlo**. Implementar subida directa a la nube del usuario solo cuando la integración lo permita, con controles de tamaño/MIME y permisos.
- [ ] **WEB-044** Integrar progresivamente OneDrive y Dropbox (OAuth/API o enlaces), solo tras probar consentimiento y límites de proveedores.
- [ ] **WEB-045** Resolver enlaces rotos, archivos eliminados, acceso no compartido, cuotas, caducidad y visualizaciones previas seguras. No presentar Drive como CDN o hosting garantizado.
- [ ] **WEB-046** Especificar reglas de formatos: programas, instaladores, ZIP, juegos, videos, arte, modelos 3D y proyectos de IA; bloquear formatos o descargas de riesgo hasta completar controles.

**Salida exigida:** archivo en nube personal, ficha registrada, permisos verificables y enlace funcionando con un visitante externo autorizado.

### FASE 5 — Catálogo, fichas, descubrimiento y comunidad (P1)
**Meta:** pasar de un prototipo con filtros locales a una biblioteca escalable.

- [ ] **WEB-050** Búsqueda en servidor, paginación, categorías, etiquetas, orden por fecha/popularidad y consultas indexadas; no limitar producción a los primeros 48 proyectos.
- [ ] **WEB-051** Tarjetas con miniaturas autorizadas, descripción breve, licencia, plataforma, tamaño/formato cuando sea verificable y creador enlazado.
- [ ] **WEB-052** Fichas completas: requisitos mínimos, versión, changelog, instrucciones, capturas y videos embebidos bajo una política CSP segura.
- [ ] **WEB-053** Badges de verificación **solo cuando existe un proceso real**. No inventar descargas, métricas, popularidad, pruebas de virus ni valoraciones.
- [ ] **WEB-054** Perfiles públicos, proyectos relacionados y destacados editoriales con criterios transparentes.
- [ ] **WEB-055** Estadísticas básicas agregadas y privacidad respetada. No exponer datos personales de quienes visitan una ficha.
- [ ] **WEB-056** Evaluar comentarios, seguidores y favoritos como etapa posterior; moderación y bloqueo de spam antes de activarlos.

**Salida exigida:** búsqueda consistente, resultados útiles, fichas accesibles y rendimiento estable con datos de prueba numerosos.

### FASE 6 — UX/UI y los tres espacios conservados (P1)
**Meta:** identidad luminosa profesional sin perder personalidad ni funcionalidades.

- [x] **WEB-060** Nueva estética general luminosa: blanco, naturaleza, aventura, violeta suave y energía creativa; Green Node mantiene un contraste cyber específico.
- [ ] **WEB-061** Revisar header, footer, navegación móvil, transiciones, contraste, foco visible, estados vacíos y fallos de carga.
- [ ] **WEB-062** Unificar navegación y evitar wrappers/overlays legacy sobre Home, Explorar y perfiles.
- [ ] **WEB-063** Green Node: QA funcional y técnico de enlaces, contenido, legibilidad, rendimiento y elementos de seguridad; mantener su tema propio.
- [ ] **WEB-064** Ciencia / ArgenCiencia: verificar fuentes, actualidad, bibliotecas, navegación, componentes y enlaces existentes.
- [ ] **WEB-065** Huellas Argentina: preservar contenido y páginas, mejorar visuales de mascotas (evitar bloques básicos), formularios, estados y experiencia móvil sin borrar información.
- [ ] **WEB-066** Accesibilidad WCAG, teclado, lectores de pantalla, tamaños táctiles y reducción de animación.
- [ ] **WEB-067** Core Web Vitals, imágenes adaptativas, lazy loading, CSS por ruta y eliminación cuidadosa de dependencias **solo cuando no estén en uso**.

**Salida exigida:** QA real en móvil y escritorio sin superposición, navegación duplicada o regresiones en los tres módulos conservados.

### FASE 7 — Privacidad, propiedad intelectual y confianza (P0 → P1)
**Meta:** publicar una plataforma que pueda operar con contenido de terceros.

- [ ] **WEB-070** Condiciones de uso, privacidad, cookies, política editorial y normas de creadores actualizadas a este modelo comunitario; revisión legal cuando corresponda.
- [ ] **WEB-071** Proceso de denuncias y reclamaciones de copyright, suplantación y malware; trazabilidad de decisiones, atención y apelaciones.
- [ ] **WEB-072** Consentimiento de analytics y de enlaces a proveedores, sin cambiar silenciosamente preferencias existentes.
- [ ] **WEB-073** Procedimiento de solicitud de exportación/eliminación de datos y cuenta; aclarar que borrar una ficha de XETHKIOZ no borra automáticamente un archivo de Drive/Dropbox.
- [ ] **WEB-074** Políticas de retención y backups de metadatos, especialmente por reportes y auditorías; nunca almacenar tokens ni archivos privados innecesarios.
- [ ] **WEB-075** Política de contenido generado con IA, derechos de uso, licencias declaradas y restricciones para software inseguro.

**Salida exigida:** textos coherentes con funciones reales, permisos mínimos y procedimiento de respuesta a denuncias.

### FASE 8 — SEO, idioma y migración de contenidos (P1)
**Meta:** posicionar la nueva web sin generar enlaces rotos ni prometer traducciones inexistentes.

- [x] **WEB-080** Rutas de creador, catálogo y enlaces profundos; mapa inicial de 23 redirecciones legacy en rama de prueba.
- [ ] **WEB-081** Comprobar cada redirección HTTP, canonical, Open Graph y sitemap después de desplegar, no solo en validadores de texto.
- [ ] **WEB-082** Traducir de verdad la interfaz y textos ES/EN; si una página sigue solo en español, evitar que su versión /en se anuncie falsamente como traducción.
- [ ] **WEB-083** Corregir fichas dinámicas para SEO según exposición pública, sin indexar borradores, rutas de administración, perfiles no públicos o publicaciones rechazadas.
- [ ] **WEB-084** Resolver noticias/feeds/servicios legacy: conservar archivo histórico donde proceda, quitar entradas del menú y decidir qué rutas deben quedar como archivo, redirección o 410.
- [ ] **WEB-085** Verificar robots.txt, Search Console y sitemap en la liberación; no modificar indexación productiva antes de tener la nueva experiencia validada.

**Salida exigida:** catálogo indexable con contenido aprobado, rutas antiguas controladas y URLs privadas fuera del índice.

### FASE 9 — Lanzamiento seguro y operaciones (P0 → P1)
**Meta:** poner la web en producción sin interrumpir a los usuarios ni perder datos.

- [ ] **WEB-090** Monitoreo de errores, métricas de uso, cambios de estado, intentos de abuso y gastos/cuotas de Supabase, Vercel y proveedores de nube.
- [ ] **WEB-091** Pruebas de carga y concurrencia, usuarios con sesiones simultáneas, redes lentas y fallos de proveedor.
- [ ] **WEB-092** Beta cerrada: propietario, moderador y un grupo pequeño de creadores; pruebas con cuentas separadas.
- [ ] **WEB-093** Auditoría final de dependencias, variables, secretos, accesibilidad, CSS, rutas y backups.
- [ ] **WEB-094** Liberación progresiva con aprobación final; preservar rollback instantáneo de frontend y procedimiento de recuperación de base.
- [ ] **WEB-095** Lista de verificación post-despliegue y revisión de 24/48 horas **solo si está programada expresamente**; no asumir supervisión en segundo plano.
- [ ] **WEB-096** Mantener una sola hoja maestra actualizada con el commit, estado de preview, pruebas, incidencias y siguiente bloque.

**Salida exigida:** liberación autorizada, monitoreada, reversible y documentada.

---

## 4. Alcance mínimo para la primera beta

La **BETA 1** puede empezar con:
1. Alta/inicio de sesión real y perfil público mínimo.
2. Fichas con título, categoría, descripción, etiquetas, licencia y **enlace HTTPS compartido manualmente desde la nube del creador**.
3. Borradores, envío a revisión, aprobación/rechazo humano y seguimiento del estado.
4. Catálogo con búsqueda y perfiles públicos, solo de creaciones aprobadas.
5. Denuncias, derechos de autor, privacidad y RLS verificadas.
6. Green Node, Ciencia y Mascotas funcionando como hoy y sin pérdida de datos.
7. Navegación móvil/escritorio probada y rollback preparado.

**No hay que bloquear toda la beta esperando a Google Picker**, pero la integración Drive es una función prioritaria para la versión pública completa. La beta deberá explicar claramente que, al principio, hay que pegar un enlace compartido y que XETHKIOZ no hospeda el archivo.

**Quedan fuera de BETA 1:** chat, seguidores, economía interna, pagos a creadores, rankings artificiales, CDN propio de grandes archivos, editor de software en navegador, migración de framework, aplicaciones móviles nativas y automatización total de la revisión.

---

## 5. Riesgos y decisiones pendientes

| Riesgo / decisión | Consecuencia | Mitigación |
|---|---|---|
| Preview con Login de Vercel | No permite QA externo anónimo | Probar con autorización legítima o entorno local |
| SQL sin aplicar | Formularios de proyectos no funcionan contra datos reales | Staging + revisión RLS antes de migrar |
| Edición durante revisión | Podría aprobarse contenido cambiado respecto a lo inspeccionado | Bloquear edición pending o validar versión/huella al aprobar |
| URL HTTPS aparentemente válida | HTTPS no equivale a archivo seguro | Revisión de reputación y permisos; evitar fetch SSRF |
| Límite en memoria en función serverless | No limita ataques entre instancias | Rate limit compartido y cuotas por cuenta |
| Enlaces Drive/OneDrive/Dropbox | Permisos privados, cuotas y caducidad | Verificar acceso y notificar al creador |
| SEO /en sin traducción completa | Indexación engañosa y mala UX | Traducir o desindexar temporalmente rutas incompletas |
| Código CSS/servicios legacy | Regresiones si se borra indiscriminadamente | Análisis de dependencias y pruebas por módulo |
| Costos de terceros | Posibles cargos por hosting, llamadas, storage o OAuth | No activar servicios pagos sin aprobación |
| Contenido externo inseguro | Riesgos legales, malware y suplantación | Reglas, moderación, reportes y retirada rápida |
| Duplicaciones/respaldos enormes | Saturación de disco local | Mantener repositorio limpio y respaldos proporcionados, **sin borrar juegos/proyectos** |

---

## 6. Orden operativo del próximo bloque

No iniciar todo a la vez; avanzar por dependencias y cerrar cada bloque con pruebas.

**Bloque inmediato — Seguridad y QA**
1. Localizar el código correcto en la PC autorizada sin sobrescribir clones o proyectos ajenos.
2. Levantar el preview local o abrir el preview protegido con autorización.
3. Ejecutar los tests Playwright nuevos, registrar fallos reales y corregir navegación/errores.
4. Auditar SQL completo: permisos por columna, RPC, restricciones, claves externas y carreras de edición.
5. Preparar un entorno de staging o una transacción de prueba segura para la migración, sin escribir en producción.
6. Probar usuarios A/B, invitado y moderador; demostrar que nadie puede autoproclamarse moderador ni publicar sin revisión.
7. Comprobar la función Edge con los mismos casos; finalizar esquema de reportes y límites persistentes.
8. Registrar evidencias, SHA, bloqueadores y próximos cambios aquí. Pedir aprobación antes de aplicar cambios a producción.

**Bloque siguiente — Primera beta funcional**
9. Habilitar el backend tras pasar los controles anteriores.
10. Integrar el flujo completo de borrador, revisión, publicación y denuncia.
11. Probar recorrido de creador a visitante real, y regresión de los tres sectores conservados.
12. Revisar privacidad, licencia, enlaces, móvil y contenido antes de beta cerrada.

**Bloque posterior — Nube conectada y mejora del producto**
13. Google Drive Picker/OAuth de alcance mínimo; luego OneDrive/Dropbox.
14. Catálogo escalable, perfiles configurables, buenas fichas y notificaciones.
15. SEO final, idioma inglés completo, optimización de rendimiento y apertura gradual.

---

## 7. Criterios de salida antes de producción

No promover este PR hasta verificar **todos** los puntos siguientes:

- [ ] Build, typecheck y auditorías automáticas verdes en el commit candidato.
- [ ] E2E desktop + mobile ejecutados de verdad, sin fallos críticos.
- [ ] Supabase RLS, grants y permisos de RPC comprobados con cuentas diferentes.
- [ ] Ningún usuario puede aprobar su propia ficha o alterar metadatos de moderación.
- [ ] Moderación, denuncias y rollback de decisión comprobados de punta a punta.
- [ ] Pruebas de abuso, URL insegura, spam, sesión inválida y errores de red satisfactorias.
- [ ] Registro, borrador, publicar, editar, retirarse, recuperar cuenta funcionales.
- [ ] Ciencia, Green Node y Mascotas regresionados, sin pérdida de contenido.
- [ ] Privacidad, copyright, condiciones de uso y noindex de páginas privadas revisados.
- [ ] SEO, canonical, redirects y feeds verificados en el despliegue.
- [ ] Respaldo + recuperación probados y límites de costos aceptados.
- [ ] **Aprobación final del propietario para publicar, migrar y fusionar `main`.**

---

## 8. Reglas permanentes del proyecto

- Trabajar en `redesign/creator-cloud-platform` y PR #313 hasta nueva aprobación; no publicar automáticamente.
- Una build READY no implica pruebas E2E completadas ni moderación real funcionando.
- No borrar `World of Xethkioz 2D`, `Elemental Realms`, juegos, cliente/servidor de World of Warcraft, modelos 3D, archivos privados o proyectos de otras carpetas.
- No sobreescribir clones locales ni crear múltiples backups completos sin necesidad. Minimizar uso de disco y preservar fuentes.
- No guardar contraseñas, tokens OAuth o claves privilegiadas en frontend/repo.
- No subir contenido a plataformas externas ni consumir dinero o créditos de generación sin autorización específica.
- Preservar la privacidad de usuarios y la propiedad de sus obras; alojar el contenido en nubes del propietario cuando sea posible.
- El diseño general prioriza luz, crecimiento, naturaleza y creatividad, con Green Node oscuro solo como estética propia.
- Si un test falla, registrar qué falló, qué se corrigió y qué continúa pendiente; no declarar completo lo que no se probó.

---

## 9. Registro de avance al corte

**Verificado el 11/11/2026:**
- Rama de trabajo: `4618a6f60d4be5b91fc1e8e8c6ee7b44e5104fdf`, antes de la actualización de este documento.
- PR #313: abierto, en borrador, no fusionado.
- Vercel: preview del commit anterior READY.
- Producción: último deploy READY desde `main`, SHA `e544bf558dab3305d91b4a8d1333180a899445f3`.
- Supabase sitio: `creator_projects`, `creator_project_reports` y `creator_moderation_events` ausentes. Solo se ejecutaron consultas de lectura.
- No se aplicaron migraciones ni se desplegó la nueva Edge Function desde esta hoja de ruta.
- No se ejecutaron nuevos tests Playwright reales desde esta actualización.
- No hubo fusión, limpieza destructiva, gastos ni cambios en la PC derivados de este documento.

**Siguiente tarea concreta:** WEB-001/WEB-002, después WEB-010/WEB-014. Primero verificar el preview y cerrar el diseño de permisos; después activar backend de forma controlada.

---
_Actualizar esta única hoja tras cada bloque de ejecución, sin multiplicar planes contradictorios._


## Registro de trabajo — 11/11/2026 · WEB-010/WEB-014 (seguridad previa a la beta)
- [x] **Preparado en rama:** el dueño no puede editar una ficha en estado pendiente de revisión. La política RLS de UPDATE solo permite modificar fichas draft o rejected, con CHECK de destino draft/pending_review. Esto impide modificar el contenido entre la lectura del moderador y la aprobación, salvo actores del servidor privilegiado.
- [x] **Preparado en rama:** frontend sin posibilidad de editar pendientes; biblioteca muestra el bloqueo. Edición ahora omite author_id (que tiene permiso de INSERT pero NO UPDATE) y comprueba que se haya modificado realmente una fila draft/rejected.
- [x] **Preparado en rama:** reportes tienen GRANT INSERT por columna (project_id/reporter_id/reason) para que el usuario no pueda declarar resuelta una denuncia por sí mismo.
- [x] **Preparado en rama:** panel de moderación obtiene las fichas exactas a las que se refieren los reportes, incluso publicaciones antiguas, en lugar de limitarse a 150 publicaciones arbitrarias.
- [x] **Preparado en rama:** nombre de autor ya no usa automáticamente la parte local del correo como nombre público.
- [ ] **PENDIENTE:** ejecutar pruebas RLS contra staging con usuarios reales, E2E autenticados, revisar grants y RPC transaccionales antes de publicar.
- **Entorno de pruebas PC:** conexión VEYR Remote inactiva en este bloque; no se han ejecutado comandos ni modificado archivos de la PC.


## Actualización de seguridad adicional — 11/11/2026
- [x] **Preparado en rama:** longitud combinada de etiquetas limitada a 255 caracteres, 8 etiquetas como máximo; cover_url limitado a 2048 caracteres y reservado a flujos del servidor (no editable desde navegador durante MVP).
- [x] **Preparado en rama:** eventos de moderación ya no se eliminan silenciosamente mediante borrado en cascada cuando el autor elimina un proyecto rechazado. Pendiente revisión de retención/privacidad antes de abrir el servicio.
- [x] **Preparado en rama:** los visitantes registrados pueden indicar el tipo de denuncia (malware, copyright, spam, otros, revisión general) desde la ficha de la creación; la revisión humana sigue siendo obligatoria.
- [ ] **Pendiente:** comprobar en staging políticas de retención, denuncias y auditoría con cuentas reales, no dar por validada la seguridad solo por build.


## WEB-030 / WEB-061 — 11/11/2026
- [x] Preparado en rama: registro, acceso y recuperación utilizan la misma estructura de navegación de Creator Network, estética luminosa y metadatos noindex, evitando el contraste con la antigua página de cuenta cyber.
- [x] La navegación de acceso vuelve a la biblioteca de creadores; el flujo conserva el parámetro redirect cuando se cambia entre registro e inicio de sesión.
- [ ] Queda pendiente comprobar visualmente pantallas completas y validación real de Auth, así como la integración de la migración nueva en Supabase.
