# Pedidos y pagos de Cursos digitales

Estado al 30/09/2026: catálogo y pedido por correo implementados. Cobro y notificación automática pendientes de conectar las cuentas comerciales y el servicio de envío. No anunciar un checkout activo.

## Funcionamiento publicado

`/digital/cursos` y `/en/digital/cursos` contienen cuatro cursos y tres proyectos. El titular confirmó USD 15 por cada curso y USD 50 por cada proyecto básico. Mercado Pago tendrá dos importes fijos en ARS, todavía pendientes de indicar; PayPal utilizará USD. Confirmar por correo cualquier alcance adicional y el importe final antes del pago.

Cursos: entrega dentro de 24 horas. Proyectos: entrega dentro de 48 horas. Los plazos comienzan después de confirmar el pago y el contacto por correo electrónico, conforme a lo solicitado por el titular.

El formulario requiere producto, email, WhatsApp y consentimiento de contacto. Para el proyecto personalizado solicita un resumen y su enfoque. Acepta comentarios y una referencia de pago opcional. Prepara un correo a `aidss1991@gmail.com`; el comprador lo revisa, adjunta el comprobante si corresponde y lo envía desde su aplicación. No se envía automáticamente ni se almacena el formulario en el sitio. Una referencia introducida por el comprador no acredita el pago.

## Sistema automático propuesto

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
- [Mercado Pago: notificaciones y validación de firma](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro-preferences/payment-notifications).
- [Supabase: envío de correos desde Edge Functions](https://supabase.com/docs/guides/functions/examples/send-emails). Requiere una clave del proveedor de email y un dominio verificado.
- [PayPal: recepción de pagos](https://www.paypal.com/ar/cshelp/article/help667). Verificar las funciones disponibles en la cuenta antes de habilitar esta opción.
