# Pedidos y pagos de Cursos digitales

Estado al 30/09/2026: catálogo y pedido por correo implementados. Cobro y notificación automática pendientes de conectar las cuentas comerciales y el servicio de envío. No anunciar un checkout activo.

## Funcionamiento publicado

`/digital/cursos` y `/en/digital/cursos` contienen cuatro cursos y tres proyectos. El titular confirmó USD 15 por cada curso y USD 50 por cada proyecto básico. Mercado Pago tendrá dos importes fijos en ARS, todavía pendientes de indicar; PayPal utilizará USD. Confirmar por correo cualquier alcance adicional y el importe final antes del pago.

Cursos: entrega dentro de 24 horas. Proyectos: entrega dentro de 48 horas. Los plazos comienzan después de confirmar el pago y el contacto por correo electrónico, conforme a lo solicitado por el titular.

El formulario requiere producto, email, WhatsApp y consentimiento de contacto. Para el proyecto personalizado solicita un resumen y su enfoque. Acepta comentarios y una referencia de pago opcional. Prepara un correo a `aidss1991@gmail.com`; el comprador lo revisa, adjunta el comprobante si corresponde y lo envía desde su aplicación. No se envía automáticamente ni se almacena el formulario en el sitio. Una referencia introducida por el comprador no acredita el pago.

## Preparación técnica (01/10/2026 UTC)

Implementación preparada en una rama separada, con cobros desactivados por defecto. No se aplicó la migración remota, no se conectaron credenciales y no se hicieron compras ni envíos reales. El sitio publicado conserva el pedido manual a `aidss1991@gmail.com`.

El servidor `/api/digital-orders` reúne configuración pública sin secretos, creación de checkout, webhooks y procesamiento autenticado de la cola de correo. El formulario sólo muestra las pasarelas si ese servidor devuelve `enabled: true`; conserva la opción de coordinar por correo. Los importes ARS del código de pruebas son ficticios y no son precios comerciales.

`server/digital-orders/` incluye el catálogo y precios en servidor, adaptadores de Orders API de ambos proveedores, comprobación de firmas, consulta de pago, captura de PayPal sólo tras aprobación verificada y avisos con datos del comprador. La migración `20261001003210_digital_orders_payments.sql`, creada con Supabase CLI, prepara tablas privadas con RLS, permisos exclusivos de servidor, límites persistentes de solicitudes, estado de pago y dos mensajes en una misma transacción. Una clave de solicitud reutilizada con datos diferentes se rechaza. Los checkouts sólo se reintentan dentro de dos horas para no exceder la ventana de idempotencia del proveedor.

La cola usa claves estables y reservas por trabajador. Reintenta errores con la misma clave durante menos de 23 horas; pasada esa ventana exige revisar el envío para evitar duplicados tras expirar la idempotencia de Resend. `accepted` significa que el servicio de correo aceptó el mensaje, no que llegó a la bandeja del destinatario. Revisar rechazos y entrega en el panel de Resend; esta versión no recibe webhooks de entrega de correo. Una notificación de venta contiene la referencia verificada y el importe; no fabrica un comprobante fiscal ni adjunta un archivo bancario. El cliente puede adjuntar su comprobante al correo adicional.

### Configuración segura pendiente

Configurar en el servidor, fuera de variables `VITE`, chats, repositorio y registros:

| Variable | Uso |
|---|---|
| `DIGITAL_PAYMENTS_ENABLED` | `false` hasta completar las pruebas; activación explícita con `true` |
| `DIGITAL_PAYMENTS_MODE` | `sandbox` en preview o `live` en producción; no se mezclan |
| `DIGITAL_COURSE_PRICE_ARS`, `DIGITAL_PROJECT_PRICE_ARS` | Dos importes fijos por producto, confirmados por el titular, con punto decimal |
| `DIGITAL_PAYMENTS_RETURN_URL` | URL HTTPS de la página de cursos de ese entorno; sin parámetros ni credenciales |
| `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`, `MERCADOPAGO_SELLER_ID` | Aplicación comercial de la cuenta confirmada y su vendedor; para pruebas, usuario de prueba de Argentina |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_MERCHANT_ID` | Aplicación comercial, webhook y comerciante del entorno correspondiente |
| `PAYPAL_SANDBOX_ACCOUNT_EMAIL` | Sólo en sandbox, cuenta ficticia de vendedor; live valida el correo confirmado `dreanor666@gmail.com` |
| `SUPABASE_URL`, `DIGITAL_ORDERS_SUPABASE_KEY` | Proyecto de ese entorno y clave de servidor; nunca la clave pública |
| `RESEND_API_KEY`, `DIGITAL_ORDERS_EMAIL_FROM` | Servicio transaccional y dirección en un dominio verificado; Gmail es el destinatario, no el remitente |
| `DIGITAL_ORDERS_WORKER_SECRET` | Secreto aleatorio de al menos 32 caracteres para el trabajador de correo y protección de la referencia IP |

Webhooks: `POST /api/digital-orders?action=webhook&provider=mercadopago` para el tema `order`; Mercado Pago agrega `data.id`. PayPal: `POST /api/digital-orders?action=webhook&provider=paypal`, con eventos `CHECKOUT.ORDER.APPROVED` y `PAYMENT.CAPTURE.COMPLETED`. La URL de regreso no acredita ningún pago.

El trabajador recibe `GET` o `POST /api/digital-orders?action=worker` con `Authorization: Bearer <secreto del trabajador>`. Después de configurar el entorno, conectar un programador de solicitudes en servidor para ejecutarlo periódicamente; no se creó ni activó una tarea remota en esta preparación. Sin trabajador los pagos se guardan, pero los correos quedan pendientes. No poner el secreto en una URL o en el navegador.

Antes de producción: aplicar y verificar la migración en un proyecto de prueba, probar compradores ficticios y webhooks reales de sandbox de ambos proveedores, verificar pertenencia de las aplicaciones y IDs de vendedor, confirmar el dominio remitente y conectar/verificar el trabajador. Luego configurar live separado. No publicar anuncios de pago automático antes de esa verificación. Conservar la migración como preparación hasta reconciliar el historial del proyecto; no ejecutar todos los SQL históricos como parte de este cambio.

Operación y privacidad: conservar acceso sólo desde servidor. Limpiar pedidos sin pagar y sus referencias IP que ya no sean necesarios tras revisar un plazo de retención con el titular; los pedidos pagados y sus registros se conservan según sus obligaciones y necesidades de entrega. No se automatizó un borrado de historial comercial. Después de la entrega, el titular gestiona los materiales y contacto del comprador; esta integración no contiene los cursos ni automatiza su entrega.

Pruebas locales: `npm run test:digital-payments` ejecuta contratos, proveedores simulados y PostgreSQL en memoria con PGlite. Playwright prueba formularios, selección de pasarelas, datos personalizados y recuperación ante error, con respuestas interceptadas y sin navegar a cuentas reales.

### Flujo de compra

1. Registrar un pedido privado con ID, producto, importe fijado en servidor, moneda, email, WhatsApp y descripción/enfoque si es personalizado. Estado inicial: pendiente de pago.
2. Crear un checkout comercial de Mercado Pago para Argentina y PayPal para USD. No usar los enlaces de aportes del pie. Para Mercado Pago, acordar explícitamente el precio en pesos o la regla de conversión; nunca inventar una cotización desde el cliente.
3. Recibir la notificación del proveedor, validar su firma y consultar el pago en su API. Verificar destinatario, modo de operación, referencia del pedido, moneda, importe y estado aprobado/capturado. La URL de regreso, el comprobante adjunto y el texto del cliente no sirven como confirmación automática.
4. Enviar al titular un email con el ID de pedido, producto, importe/moneda, identificador y estado de pago, email y WhatsApp del comprador, comentarios y descripción/enfoque. Enviar al comprador una confirmación con su pedido y plazo. Conservar también la opción de escribir directamente al correo público.
5. Reintentar el envío si falla y deduplicar notificaciones. Registrar el estado de entrega del correo por pedido; nunca informar «enviado» ante una respuesta fallida del servicio.

Los datos de pedidos deben estar protegidos por RLS y accesibles sólo a personal autorizado/servidor. No almacenar números de tarjeta o claves. Las credenciales se configuran en secretos del servidor, nunca en variables VITE ni en el repositorio. No activar ventas ni enviar pruebas a personas reales hasta verificar el flujo en el entorno de prueba del proveedor.

## Conexiones necesarias

- Proveedores confirmados: Mercado Pago (`aidss1991@gmail.com`) y PayPal (`dreanor666@gmail.com`). Todos los pedidos y avisos al titular deben llegar a `aidss1991@gmail.com`. Los correos identifican las cuentas, pero no sustituyen credenciales comerciales ni acreditan que una aplicación pertenece a ellas.
- Conectar las aplicaciones comerciales y verificar sus IDs de vendedor. PayPal requiere credenciales sandbox y live separadas y un webhook registrado. La Orders API de Mercado Pago requiere las credenciales del usuario de prueba para probar; no aceptar una compra real como prueba. Configurar secretos únicamente en el servidor.
- Servicio de email transaccional y remitente verificado. La configuración actual de solicitudes de presupuesto guarda datos en Supabase, pero no envía correos comerciales.
- El titular eligió importes fijos ARS por producto; faltan el importe de cada curso y el importe de cada proyecto básico. Los precios USD de la página permanecen como referencia hasta confirmar el pedido.
- Prueba completa con compradores ficticios: pago aprobado, pendiente y rechazado; firma inválida; importe incorrecto; webhook duplicado; fallo y reintento de email. No realizar cobros reales de prueba.

## Documentación oficial consultada

- [Mercado Pago: APIs de Checkout Pro](https://www.mercadopago.com.ar/developers/es/reference/online-payments/checkout-pro-orders/overview). La documentación vigente recomienda Orders API para integraciones nuevas.
- [Mercado Pago: notificaciones Orders y firma](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro-orders/notifications).
- [Mercado Pago: consulta de order](https://www.mercadopago.com.ar/developers/es/reference/online-payments/checkout-pro/get-order/get).
- [PayPal: Orders API v2](https://developer.paypal.com/sdk/orders/v2/orders-create/).
- [PayPal: verificación de webhooks](https://developer.paypal.com/api/rest/webhooks/rest/).
- [Resend: envío e idempotencia de correos](https://resend.com/docs/api-reference/emails/send-email).
- [Supabase: envío de correos desde Edge Functions](https://supabase.com/docs/guides/functions/examples/send-emails). Requiere una clave del proveedor de email y un dominio verificado.
- [PayPal: recepción de pagos](https://www.paypal.com/ar/cshelp/article/help667). Verificar las funciones disponibles en la cuenta antes de habilitar esta opción.
