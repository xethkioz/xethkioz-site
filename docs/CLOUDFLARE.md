# Alojamiento de bajo coste con Cloudflare

Preparación: 6 de septiembre de 2026. Esta configuración permite probar la web
en Workers con Static Assets. La producción y el DNS siguen en Vercel hasta
completar la validación del despliegue de Cloudflare.

## Coste previsto y límites

- Los archivos estáticos se sirven sin ejecutar el Worker cuando existe una
  ruta estática. Cloudflare los ofrece gratis y sin límite de solicitudes.
- El plan Workers Free incluye 100.000 solicitudes dinámicas diarias y un límite
  de CPU de 10 ms por invocación. El caché reduce consultas a Supabase; una
  solicitud que entra al Worker también cuenta si encuentra una respuesta en caché.
- No se añaden bases de datos, KV, R2, funciones de IA, tareas programadas ni
  almacenamiento de logs de pago. El proyecto no activa un plan de pago.
- Supabase continúa con la base y autenticación existentes. El tamaño revisado
  fue de unos 17 MB y la organización estaba en el plan Free. También se deben
  vigilar transferencia, usuarios y uso de funciones: el tamaño no es el único límite.
- La renovación del dominio en NIC Argentina sigue siendo un coste separado.

Referencias: [Workers](https://developers.cloudflare.com/workers/platform/pricing/),
[archivos estáticos](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
y [Supabase](https://supabase.com/pricing). Confirmar límites antes del cambio de producción.

## Qué se adapta

`vercel.json` sigue siendo la fuente de rutas, redirecciones y cabeceras.
`build:cloudflare` genera `dist-cloudflare`, `_redirects` y `_headers` sin modificar
el build habitual de Vercel. Las 11 funciones existentes se ejecutan mediante
un adaptador para Request/Response, con límites de tamaño de petición.

Las noticias leen su plantilla desde el mismo despliegue mediante `ASSETS`.
Los artículos publicados y los XML públicos pueden usar caché; las API privadas,
los errores y las peticiones con cookies o Authorization no entran en ese caché.
Los dominios de prueba `workers.dev` llevan `noindex`.

## Probar y desplegar una vista previa

```bash
npm ci
npm run check:cloudflare
```

El comando ejecuta TypeScript, las auditorías del build existente, un empaquetado
de Wrangler sin publicar y pruebas en el runtime local de Cloudflare.
Las peticiones externas de estas pruebas se simulan; no escriben en la base real.

Con la cuenta correcta de Cloudflare conectada y en Workers Free:

```bash
npm run deploy:cloudflare
```

`wrangler.json` no contiene rutas ni dominios de producción. El primer despliegue
se publica en `workers.dev`. No aceptar una ampliación de plan para completar
este paso sin revisar su coste y necesidad.

Las variables públicas de Supabase ya están declaradas. Para completar las
funciones administrativas se necesita `SUPABASE_SERVICE_ROLE_KEY` como secreto
del Worker; la recuperación de administrador también usa
`XETHKIOZ_ADMIN_RECOVERY_TOKEN`. Configurarlas mediante la gestión segura de
secretos de Cloudflare. Nunca incluirlas en variables `VITE_*`, archivos públicos
o Git. Los secretos no se trasladan automáticamente desde Vercel.

## Antes de cambiar el dominio

1. Validar la vista previa: portada, portales, noticias, enlaces, archivos,
   formularios y errores 404. Revisar CPU y cuotas reales de Workers Free.
2. Configurar los secretos y comprobar login, sesión y CMS con una cuenta de
   prueba autorizada. Añadir en Supabase únicamente la URL de callback exacta
   que necesite la vista previa. Verificar también los controles de origen de
   las API; los formularios rechazan orígenes no autorizados.
3. Ejecutar los controles de producción documentados en README y revisar la PR.
4. Exportar todos los registros DNS desde Vercel, incluidos subdominios. El
   dominio utiliza `ns1.vercel-dns.com` y `ns2.vercel-dns.com`. Conservar los
   registros TXT de OpenAI y CAA durante cualquier traslado.
5. Preparar la zona gratuita en Cloudflare y sus dominios personalizados antes
   de cambiar la delegación en NIC. Mantener `www` como URL canónica y la
   redirección desde el dominio raíz; comprobar HTTPS y la verificación de ChatGPT.
6. Mantener el despliegue de Vercel disponible para revertir si algo falla.
   Retirar las rutas de Cloudflare o restaurar la delegación anterior según el
   cambio realizado. Los cambios DNS pueden tardar en propagarse.

La verificación de `xethkioz.com.ar` en el perfil de constructor de GPT ya se
completó renovando el TXT en Vercel. No requiere contratar hosting nuevo.
La suspensión de Netlify se gestiona por separado: cambiar de hosting no cancela
suscripciones ni elimina posibles facturas pendientes.
