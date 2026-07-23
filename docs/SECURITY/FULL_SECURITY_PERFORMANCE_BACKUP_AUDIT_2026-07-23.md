# XETHKIOZ — Auditoría integral de seguridad, estabilidad, respaldo y experiencia

Fecha de corte: 2026-07-23

Rama de trabajo: `agent/security-performance-fun-audit`

Base auditada: `0cce47356141312d4bbe55fe486c0332bb0d64a7`

Dominio: `https://www.xethkioz.com.ar`

## 1. Alcance

Esta revisión incluye:

- repositorio Git, historial, archivos públicos, dependencias y secretos;
- build de producción, TypeScript, rutas, módulos y carga de recursos;
- Supabase Auth, roles, perfiles, RLS, funciones privilegiadas y políticas;
- APIs de Vercel y Supabase Edge Functions;
- panel público, panel de usuario y CMS administrativo;
- creación e invitación de cuentas;
- botones, enlaces, imágenes, rutas y contratos bilingües español/inglés;
- chat general, telemetría administrativa y nuevas salas VIP;
- FUN, RPG pixel, tienda de consumibles y Gran Sala;
- respaldo previo, restauración y riesgos pendientes.

No se copiaron contraseñas, tokens, claves privadas, mensajes ni registros de IP dentro de este informe.

## 2. Estado ejecutivo

### Resultado

- Build de producción: aprobado.
- TypeScript web/API: aprobado.
- Dependencias npm: 0 vulnerabilidades conocidas.
- Rutas internas: 42 rutas, 160 módulos alcanzables y 241 destinos internos verificados.
- UI: 163 archivos TSX, 234 botones, 52 enlaces HTML, 3 imágenes JSX y 64 objetos bilingües verificados.
- Nexus City: 65 controles funcionales y de seguridad.
- Runtime mundial: integrado y aprobado.
- Migraciones nuevas: ejecución transaccional de prueba aprobada contra producción y revertida.

### Hallazgos principales

| Severidad | Hallazgo | Estado |
|---|---|---|
| Crítica | La API de generación de noticias aceptaba `user_metadata.role=admin`, editable por el usuario | Corregido en código |
| Alta | El tier `ARCHITECT` se interpretaba como administrador del CMS | Corregido en código |
| Alta | Cuatro funciones `SECURITY DEFINER` estaban expuestas como RPC públicas | Migración preparada y validada |
| Alta | Política heredada de artículos permitía a cualquier usuario autenticado leer filas no publicadas | Migración preparada y validada |
| Alta | Auth reconocía un administrador, pero `profiles` lo registraba como `GUEST`, rompiendo RLS y paneles | Backfill seguro preparado |
| Alta | El panel de usuarios llamaba a un RPC inexistente en producción | Reemplazado por Edge Function autenticada |
| Alta preventiva | La primera versión de membresía VIP permitía manipular estado/identidad de invitación | Detectado antes de publicar y corregido |
| Media | Protección de contraseñas filtradas deshabilitada en Supabase Auth | Pendiente de configuración manual |
| Media | Chat general invitado no tiene un rate limit SQL individual durable | Riesgo residual documentado |
| Media | No existe un CSP estricto; hay otras cabeceras, pero falta esta defensa adicional | Pendiente por compatibilidad |
| Media operativa | No fue posible generar un dump lógico completo de PostgreSQL sin credenciales de backup | Pendiente |
| Baja | Historial SQL duplicado entre `database/` y `supabase/` | 13 duplicados reales inventariados |

## 3. Respaldo previo

### 3.1 Código e historial

Se creó una referencia remota inmutable al estado previo:

- rama GitHub: `backup/pre-security-audit-2026-07-23`;
- commit exacto: `0cce47356141312d4bbe55fe486c0332bb0d64a7`.

Se creó y verificó un Git bundle local con todas las referencias:

`backups/pre-security-audit-2026-07-23/xethkioz-site-all-refs.bundle`

El bundle contiene 146 referencias y pasó `git bundle verify`.

Restauración de emergencia:

```bash
git clone xethkioz-site-all-refs.bundle xethkioz-site-restored
git -C xethkioz-site-restored switch --detach 0cce47356141312d4bbe55fe486c0332bb0d64a7
```

No se debe reescribir `main` con `force-push`. El rollback normal debe realizarse mediante revert del PR o redeploy del commit anterior.

### 3.2 Archivos locales no confirmados

Tres medios modificados fuera de la rama limpia fueron preservados sin incorporarlos al release:

- `public/assets/portal-games-poster.png`;
- `public/videos/green-wisp-nexus2.mp4`;
- `public/videos/xethkioz-pixel-banner.mp4`.

Copia:

`backups/pre-security-audit-2026-07-23/local-media/`

Esto evita sobrescribir trabajo local no confirmado.

### 3.3 Base de datos

Las migraciones fueron probadas dentro de `BEGIN/ROLLBACK`; esa prueba no es un backup.

No se generó un dump lógico porque el entorno no dispone de:

- contraseña de conexión de PostgreSQL;
- `pg_dump` utilizable contra el proyecto;
- una API conectada para descargar backups nativos.

Antes de cambios destructivos futuros debe completarse una de estas opciones:

1. confirmar un backup nativo reciente en Supabase;
2. generar un dump cifrado con `pg_dump`;
3. habilitar PITR si el plan lo soporta.

No se exportaron `site_visit_logs`, correos, perfiles ni mensajes a archivos locales para evitar crear una copia insegura de datos personales.

## 4. Autenticación, roles y cuentas

### 4.1 Fuente de autoridad

La autorización administrativa queda separada de la monetización:

- `role=ADMIN` concede administración;
- `subscription_tier=ARCHITECT` no concede administración;
- `user_metadata` nunca concede privilegios;
- `app_metadata` y `profiles.role`, protegidos por backend/RLS, son las fuentes seguras.

### 4.2 API de generación

Se eliminó la aceptación de `user_metadata.role`. La API sólo reconoce el rol administrativo de `app_metadata`.

Impacto: un usuario ya no puede editar sus metadatos públicos para convertirse en administrador de la generación de noticias.

### 4.3 Panel administrativo de usuarios

El RPC que el frontend esperaba no existía en producción. Se reemplazó por `admin-users`, una Edge Function que:

- exige JWT válido;
- vuelve a verificar el usuario con Supabase Auth;
- valida el rol seguro del llamador;
- limita origen, método y tamaño de payload;
- aplica rate limit administrativo;
- bloquea el auto-despojo accidental del último contexto administrador;
- sincroniza `auth.app_metadata` y `profiles`;
- permite invitar usuarios sin permitir una invitación ADMIN directa;
- nunca entrega la clave administrativa al navegador.

La invitación acepta roles iniciales no administrativos. El ascenso a ADMIN debe hacerse después de verificar identidad y necesidad.

### 4.4 Prueba de cuentas

No se crearon cuentas falsas en producción y no se enviaron correos de prueba a destinatarios inventados.

Validado sin mutar usuarios:

- formulario y contrato de invitación;
- validaciones de email, rol y tier;
- rechazo de ADMIN directo;
- panel bilingüe;
- backend autenticado;
- coherencia de tipos y build.

Prueba final recomendada después del despliegue: invitar una dirección controlada por el propietario y recorrer confirmación, login, perfil, logout y revocación.

## 5. Base de datos y RLS

### 5.1 Estado observado

- 25 tablas públicas observadas antes del cambio;
- RLS habilitado en todas las tablas expuestas auditadas;
- cuatro usuarios Auth/perfiles existentes;
- telemetría con retención de 30 días;
- ninguna clave administrativa incluida en frontend.

### 5.2 Funciones privilegiadas

Las funciones de rol/publicación se mueven de `public` a `private`:

- `xethkioz_has_role`;
- `xethkioz_is_moderator_or_admin`;
- `xethkioz_can_publish_article`;
- `xethkioz_can_submit_article`.

Se fija `search_path=''`, se revocan permisos públicos y sólo se concede ejecución interna necesaria a `authenticated`/`service_role`.

Resultado esperado del asesor Supabase: desaparecen las cuatro advertencias de funciones `SECURITY DEFINER` ejecutables mediante RPC pública.

### 5.3 Lectura editorial

Se separan:

- artículos publicados, legibles públicamente;
- borradores propios del autor;
- acceso editorial de moderador/administrador.

La política de noticias también envuelve `auth.uid()` y helpers en `SELECT` para evitar reevaluación por fila.

### 5.4 Telemetría

La lectura de IP/dispositivo queda limitada a ADMIN mediante helper privado.

Retención: 30 días.

No se registra: contraseña, contenido de mensajes, formulario escrito, coordenadas GPS ni datos de pago.

## 6. Salas VIP

### Modelo

- máximo 3 salas activas por anfitrión;
- expiración máxima: 7 días;
- máximo 8 personas invitadas/activas;
- sólo se invita a contactos Nexus previamente aceptados;
- el invitado debe aceptar explícitamente;
- invitado pendiente puede ver la invitación, pero no mensajes;
- sólo miembro activo puede leer/escribir el canal;
- máximo 12 mensajes por minuto y 500 caracteres;
- mensajes y membresías protegidos por RLS.

### Protección contra manipulación

El servidor:

- fuerza `status='invited'` al crear una invitación;
- impide cambiar `room_id`, `user_id` o `invited_by`;
- sólo permite transición `invited → active/declined`;
- fija `responded_at` y `created_at`;
- normaliza el cuerpo del mensaje;
- fija la fecha del mensaje para impedir evasión del rate limit;
- limita `UPDATE` a columnas explícitas.

### Monetización

No se vende la capacidad de hablar ni de recibir invitaciones.

La monetización futura sólo puede cubrir:

- temas visuales;
- cosméticos;
- efectos de sala;
- apoyo voluntario separado.

## 7. FUN y RPG pixel

### FUN

La portada de memes se simplificó a tres actividades reales:

- Arcade;
- Clips;
- Muro.

Se eliminó el tab vacío/intermedio para entrar directamente a la diversión.

### RPG estilo portátil

Se amplió el mapa con:

- Casa Wisp de consumibles;
- Gran Sala pública;
- puerta al umbral VIP;
- nuevos NPC y objetos de interacción;
- mochila con uso de consumibles;
- señales visuales y controles compatibles con móvil.

La inspiración es la legibilidad y exploración de RPG portátiles, sin copiar personajes, mapas, marcas ni arte protegido de Pokémon.

### Economía

Los consumibles se canjean únicamente por fragmentos Wisp ganados localmente jugando.

Las donaciones:

- están separadas de la tienda;
- no compran poder;
- no compran chat;
- no compran invitaciones;
- no alteran límites o moderación.

## 8. Rendimiento

### Mejoras

- se restauró el montaje de `WorldRuntimeIntegration`, evitando un runtime incompleto;
- la imagen visual de Nexus pasó de PNG de 3,3 MB a WebP de aproximadamente 176 KB;
- el PNG queda únicamente para compatibilidad social/SEO donde corresponde;
- Wisp global usa carga diferida fuera de Inicio;
- rutas grandes continúan separadas en chunks lazy;
- VIP agrega aproximadamente 11,7 KB JS y 5,3 KB CSS sin cargar en otras rutas;
- FUN queda en un chunk independiente;
- se evitó cargar el video de 8,2 MB porque no está referenciado por la aplicación activa.

### Presupuesto observado

- CSS principal: ~350 KB raw / ~64 KB gzip;
- JS principal: ~58 KB raw / ~18,5 KB gzip;
- vendor: ~163 KB raw / ~54 KB gzip;
- Supabase: ~214 KB raw / ~56 KB gzip;
- mundo pixel: ~47 KB JS / ~15 KB gzip, cargado bajo demanda.

### Riesgos de rendimiento restantes

- CSS principal todavía es grande y requiere una futura división por dominio;
- existen medios pesados no referenciados que agrandan el despliegue, aunque no la navegación;
- Vercel/Node 24 emite avisos `DEP0169` desde runtime/dependencias de la función de noticias;
- algunos índices recientes aún aparecen como “unused”; no deben borrarse hasta reunir tráfico suficiente.

## 9. Botones, enlaces, imágenes y traducciones

Se incorporó `scripts/ui-contract-check.mjs` al control de producción.

Valida:

- todos los `<button>` declaran `type`;
- todos los `<a>` declaran `href`;
- enlaces con `target="_blank"` incluyen `noopener noreferrer`;
- todas las imágenes JSX tienen `alt`;
- `Link`/`NavLink` tienen destino;
- objetos de traducción con `es`/`en` conservan la misma estructura.

La auditoría de rutas valida además los destinos internos detectables estáticamente.

Los enlaces editoriales externos pueden cambiar o bloquear robots fuera del control del sitio; por eso se valida estructura/seguridad y se mantiene revisión editorial de estado HTTP.

## 10. Archivos y dependencias

- 729 archivos rastreados en la base previa;
- 76 archivos SQL reales después de corregir el doble conteo del auditor;
- 13 contenidos SQL duplicados entre historiales;
- `npm audit --omit=dev`: 0 vulnerabilidades;
- no se detectaron secretos reales rastreados en el estado o historial revisado;
- `.env`, `node_modules` y `dist` continúan excluidos de Git.

Los historiales duplicados no deben borrarse a ciegas: primero debe elegirse un único ledger canónico y comparar el historial de migraciones ya aplicado.

## 11. Cabeceras y navegador

Controles existentes/revisados:

- HTTPS/HSTS mediante plataforma;
- `X-Content-Type-Options`;
- política de referrer;
- CORS restringido en funciones sensibles;
- `Cache-Control: no-store` en respuestas administrativas;
- errores de arranque renderizados con `textContent`, sin `innerHTML`.

Pendiente: diseñar una CSP inicialmente en `Report-Only`, observar violaciones reales y luego endurecerla. Aplicar una CSP estricta directamente podría romper fuentes, estilos, analítica o integraciones actuales.

## 12. Riesgos pendientes y próximos pasos

### Prioridad alta

1. Activar “Leaked password protection” en Supabase Auth.
2. Confirmar backup nativo o generar dump lógico cifrado.
3. Hacer prueba de una invitación real con correo controlado.
4. Probar salas VIP con dos cuentas reales y contacto aceptado.

### Prioridad media

1. Enviar chat público invitado a un endpoint con CAPTCHA/rate limit durable, o exigir sesión para persistencia.
2. Desplegar CSP `Report-Only`, medir y endurecer.
3. Dividir CSS principal por rutas.
4. Comprimir o archivar medios pesados no usados después de confirmar sus versiones locales.
5. Consolidar los dos árboles de migraciones sin reescribir migraciones ya aplicadas.

### Criterio de aprobación

La publicación puede avanzar cuando:

- CI y Vercel estén verdes;
- la preview funcione en escritorio y móvil;
- las dos migraciones se apliquen en orden;
- la Edge Function `admin-users` quede con JWT obligatorio;
- asesores Supabase no muestren nuevos errores de seguridad;
- producción pase rutas públicas, login redirect y consola sin errores críticos.

## 13. Comandos de verificación

```bash
npm run typecheck
npm run audit:security-hardening
npm run audit:ui-contracts
npm run audit:nexus-city
npm run audit:runtime
npm run audit:routes
npm run audit:sql
npm run build
npm audit --omit=dev
```

## 14. Registro de despliegue

- PR: [#132](https://github.com/xethkioz/xethkioz-site/pull/132).
- Primera rama remota verificada: commit `232837b221c2554d870596fd508a956ef5a88748`.
- Árbol Git remoto/local verificado: `afbe6deface093a72d10c40630ec45876afda522`.
- Preview Vercel: `dpl_AaJG4ffASosNrzmuW1xhizSXwCd1`, estado `READY`.
- GitHub Actions: ejecución 416, aprobada.
- Migraciones aplicadas:
  - `security_admin_consistency`;
  - `articles_policy_consolidation`;
  - `nexus_vip_rooms`;
  - `nexus_vip_rooms_runtime_hardening`;
  - `nexus_vip_inviter_index`.
- Edge Function: `admin-users`, versión 1, `ACTIVE`, JWT obligatorio.
- Prueba SQL conductual: sala/mensaje creados dentro de transacción, campos de servidor verificados y rollback confirmado con cero filas persistidas.
- Asesor de seguridad posterior: sólo permanece `auth_leaked_password_protection`.
- Asesor de rendimiento posterior: sin política duplicada de artículos y sin clave foránea VIP desindexada.
- Pendiente al cerrar este documento: segunda ejecución CI/Vercel del hardening descubierto durante la prueba y verificación pública posterior al merge.
