begin;

with editorial_author as (
  select id as author_id from public.profiles
  order by is_site_owner desc, (upper(role) = 'ADMIN') desc, created_at asc nulls last limit 1
)
insert into public.news_articles (
  slug, title, summary, content, category, author_id, status, published_at,
  tags, source_urls, ai_generated, review_status, editor_notes, created_at, updated_at
)
values
(
  'community-huellas-ingresar-argentina-perros-gatos-cvi-guia',
  'Huellas · Viajar a Argentina con perros o gatos: documentos, plazos y controles',
  'SENASA detalla cómo ingresar al país con una mascota sin quedar detenido en frontera. Esta guía ordena el CVI, la vacuna antirrábica, las traducciones y los requisitos del transporte.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$El documento central es el CVI$x$),
    jsonb_build_object('type','paragraph','text',$x$Quien ingresa a Argentina desde el exterior con un perro o un gato debe gestionar antes del viaje un Certificado Veterinario Internacional, o CVI, emitido por la autoridad veterinaria oficial del país de procedencia. No alcanza con una libreta sanitaria privada ni con un certificado firmado únicamente por el veterinario habitual. SENASA recomienda consultar con anticipación el procedimiento, los costos y los plazos de la autoridad del país de salida, porque cada administración organiza el trámite de forma diferente.$x$),
    jsonb_build_object('type','heading','text',$x$Vigencia, idioma y vacuna antirrábica$x$),
    jsonb_build_object('type','paragraph','text',$x$Una vez emitido, el CVI permite el ingreso durante 60 días corridos siempre que la vacuna antirrábica continúe vigente y el animal se encuentre clínicamente apto. El documento puede presentarse en su idioma original, pero debe estar acompañado por una versión en español. Para animales procedentes de la Unión Europea también puede utilizarse el pasaporte veterinario oficial, siempre que la autoridad veterinaria del país exportador lo haya refrendado, visado o convalidado con firma y sello.$x$),
    jsonb_build_object('type','list','text',$x$Control previo: confirmar que el nombre y la identificación del animal coincidan en todos los papeles; revisar fecha y vigencia de la vacuna antirrábica; comprobar firma y sello de la autoridad oficial; llevar la traducción al español cuando corresponda; verificar que el CVI no supere los 60 días; y guardar copias digitales sin reemplazar los originales exigidos en frontera.$x$),
    jsonb_build_object('type','heading','text',$x$La aerolínea puede pedir condiciones adicionales$x$),
    jsonb_build_object('type','paragraph','text',$x$Cumplir con SENASA no garantiza por sí solo el embarque. Aerolíneas, empresas fluviales y servicios terrestres pueden establecer medidas del transportín, cupos, restricciones de raza, temperatura o documentación extra. Conviene consultar al transportista antes de comprar el pasaje y volver a confirmar cerca de la salida. Si el CVI está vencido, carece de validación oficial o no tiene la traducción requerida, el ingreso puede demorarse e incluso terminar en la reexportación del animal.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía complementa /news/community-huellas-rabia-vacunacion-guia-practica, dedicada a la prevención antirrábica cotidiana. La fuente oficial es SENASA y sus requisitos deben revisarse nuevamente antes de cada viaje, porque el país de origen, el itinerario y la empresa de transporte pueden cambiar el procedimiento. Ante una duda concreta, SENASA ofrece oficinas, formulario web y canales de atención publicados en su portal.$x$)
  ),
  'community', (select author_id from editorial_author), 'published', '2026-09-07T20:20:00Z',
  array['huellas','mascotas','senasa','viajes','perros','gatos','cvi','vacuna-antirrabica','argentina','fuente-oficial'],
  array['https://www.argentina.gob.ar/noticias/documentos-fundamentales-para-ingresar-la-argentina-con-perros-y-gatos'],
  false, 'approved', 'Fuente oficial: SENASA, 8 de enero de 2026. Guía evergreen revisada el 7 de septiembre de 2026; se distinguen requisitos sanitarios de condiciones adicionales del transportista.', now(), now()
),
(
  'green-tor-browser-15-0-21-actualizacion-seguridad-guia',
  'Green Node · Tor Browser 15.0.21: por qué conviene actualizar la versión estable',
  'Tor Browser actualizó Firefox ESR, OpenSSL, NoScript y GeckoView e incorporó correcciones de seguridad. Explicamos qué cambia, cómo actualizar y por qué la versión alpha no reemplaza a la estable.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una actualización estable centrada en seguridad$x$),
    jsonb_build_object('type','paragraph','text',$x$The Tor Project publicó Tor Browser 15.0.21 el 1 de septiembre de 2026 para Windows, macOS, Linux y Android. La versión incorpora correcciones de seguridad provenientes de Firefox 155 sobre la base Firefox ESR 140.15.0 y GeckoView 140.15.0 en Android. También actualiza OpenSSL a 3.5.8 y NoScript a 13.6.32.1984. No es una edición con funciones llamativas: su valor principal es reducir exposición a fallas ya corregidas dentro de los componentes que sostienen el navegador.$x$),
    jsonb_build_object('type','heading','text',$x$Actualizar sin perder el perfil de privacidad$x$),
    jsonb_build_object('type','paragraph','text',$x$La vía recomendada es el actualizador integrado de Tor Browser o la descarga desde el sitio oficial. Antes de instalar manualmente conviene cerrar el navegador y, si se conserva información local importante, respaldar marcadores de forma consciente: Tor Browser está diseñado para minimizar rastros persistentes, no para funcionar como depósito de datos. Después de actualizar, el número visible debe ser 15.0.21. No hace falta instalar extensiones adicionales ni cambiar la configuración avanzada para recibir las correcciones.$x$),
    jsonb_build_object('type','list','text',$x$Pasos prudentes: abrir el menú de Tor Browser y buscar actualizaciones; reiniciar cuando lo solicite; comprobar la versión; descargar sólo desde torproject.org si el proceso automático falla; evitar instaladores compartidos por mensajes o anuncios; y mantener actualizado también el sistema operativo. En una organización, primero se puede probar el paquete estable con las aplicaciones internas y luego desplegarlo sin demoras innecesarias.$x$),
    jsonb_build_object('type','heading','text',$x$Estable y alpha cumplen funciones distintas$x$),
    jsonb_build_object('type','paragraph','text',$x$Tor Browser 16.0a11 también apareció durante la misma semana, pero la letra “a” identifica un canal de prueba. Sirve para detectar errores y anticipar cambios; no es el reemplazo recomendado para quien necesita navegación cotidiana. Tampoco debe confundirse privacidad con invisibilidad total: Tor separa origen y destino mediante su red, pero una cuenta iniciada, un archivo descargado, un sitio malicioso o una configuración modificada pueden revelar información por otros caminos.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta nota actualiza el seguimiento de /news/green-tor-browser-15016-seguridad y se conecta con /news/guia-green-passkeys-gestor-contrasenas para proteger también las cuentas utilizadas fuera de Tor. The Tor Project es la fuente primaria del paquete y del registro de cambios. XETHKIOZ recomienda la rama estable 15.0.21 para uso normal y reservar los canales alpha a pruebas deliberadas.$x$)
  ),
  'green', (select author_id from editorial_author), 'published', '2026-09-07T20:15:00Z',
  array['green-node','tor-browser','privacidad','seguridad','firefox-esr','openssl','noscript','actualizacion','fuente-oficial'],
  array['https://blog.torproject.org/new-release-tor-browser-15021/'],
  false, 'approved', 'Fuente primaria: The Tor Project, 1 de septiembre de 2026. Se separa la rama estable 15.0.21 del canal alpha y no se promete anonimato absoluto.', now(), now()
),
(
  'programming-chrome-154-beta-css-webcrypto-cors-guia-pruebas',
  'Creación Web · Chrome 154 beta: qué probar en CSS, WebCrypto, CORS y diálogos',
  'Chrome 154 entra en beta con cambios de accesibilidad, seguridad de red y APIs web. Ordenamos qué puede mejorar un proyecto y qué todavía no debería llegar a producción sin compatibilidad comprobada.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una beta amplia que exige pruebas selectivas$x$),
    jsonb_build_object('type','paragraph','text',$x$Google publicó Chrome 154 beta el 2 de septiembre de 2026 para Android, ChromeOS, Linux, macOS y Windows. Entre sus cambios aparecen modos accesibles para scroll markers, mejoras al cierre de popovers y diálogos, iframes con tamaño responsivo, nuevas capacidades criptográficas y controles más estrictos para Background Fetch. Que una función esté en beta significa que puede evaluarse hoy, no que deba convertirse inmediatamente en requisito de un sitio público.$x$),
    jsonb_build_object('type','heading','text',$x$Accesibilidad y comportamiento de interfaz$x$),
    jsonb_build_object('type','paragraph','text',$x$scroll-marker-group ahora distingue modos links y tabs con roles, orden de foco y navegación de teclado acordes a patrones WAI-ARIA. Es útil para carruseles, pero debe probarse con teclado y lectores de pantalla, además de mantener una alternativa para navegadores sin soporte. El cierre ligero de popovers y diálogos pasa a depender del evento click: desplazarse en una pantalla táctil o pulsar con el botón derecho ya no debería cerrar accidentalmente la superficie. Este cambio merece pruebas sobre menús, modales y selectores existentes.$x$),
    jsonb_build_object('type','list','text',$x$Plan de ensayo: ejecutar la suite en Chrome 154 beta sin cambiar producción; verificar foco y teclas en carruseles; probar scroll y clic exterior en diálogos; revisar iframes en varios anchos; confirmar que Background Fetch cumple CORS y permisos de red local; añadir detección de soporte para APIs nuevas; y repetir las rutas críticas en Firefox y Safari antes de retirar cualquier solución compatible.$x$),
    jsonb_build_object('type','heading','text',$x$Criptografía poscuántica no es una migración automática$x$),
    jsonb_build_object('type','paragraph','text',$x$WebCrypto incorpora ML-KEM, ML-DSA, ChaCha20-Poly1305 y X-Wing. Son primitivas provistas por el navegador, no una orden de reemplazar de inmediato la autenticación o el cifrado actuales. La interoperabilidad, el formato de claves, el almacenamiento y la compatibilidad del servidor deben diseñarse y probarse. Chrome también aplica CORS y permisos de acceso a red local a Background Fetch, cerrando caminos que podían comportarse distinto de fetch común.$x$),
    jsonb_build_object('type','paragraph','text',$x$La guía continúa /news/programming-chrome-ciclo-dos-semanas-septiembre-2026, que explica la nueva cadencia, y complementa /news/guia-programming-supabase-rls-seguro para la seguridad del backend. Chrome for Developers es la fuente primaria. XETHKIOZ recomienda usar la beta como laboratorio, conservar mejoras progresivas y no depender de una API hasta validar compatibilidad, accesibilidad y comportamiento real.$x$)
  ),
  'programming', (select author_id from editorial_author), 'published', '2026-09-07T20:10:00Z',
  array['creacion-web','programacion','chrome-154','css','webcrypto','cors','accesibilidad','pruebas','fuente-oficial'],
  array['https://developer.chrome.com/blog/chrome-154-beta'],
  false, 'approved', 'Fuente primaria: Chrome for Developers, 2 de septiembre de 2026. La nota distingue disponibilidad beta, mejora progresiva y preparación para producción.', now(), now()
),
(
  'tech-github-api-historial-estrellas-privacidad-metricas-guia',
  'Tecnología · GitHub abre métricas históricas de estrellas sin exponer identidades',
  'La nueva API de GitHub devuelve la evolución temporal de estrellas de un repositorio sin listar a cada usuario. Explicamos para qué sirve, qué protege y cómo migrar paneles antiguos.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Métricas útiles con menos datos personales$x$),
    jsonb_build_object('type','paragraph','text',$x$GitHub anunció el 4 de septiembre de 2026 un endpoint REST para consultar el crecimiento histórico de estrellas de un repositorio. La respuesta entrega conteos asociados a marcas de tiempo, sin revelar la identidad de las personas que marcaron el proyecto. La alternativa llega después de que los listados de stargazers quedaran restringidos a administradores y colaboradores, y permite recuperar tendencias sin reabrir una base de perfiles individuales.$x$),
    jsonb_build_object('type','heading','text',$x$Qué análisis permite y cuál no$x$),
    jsonb_build_object('type','paragraph','text',$x$Una serie temporal sirve para observar el efecto de una versión, una conferencia o una campaña; calcular crecimiento por período; y detectar cambios sostenidos en el interés. No demuestra uso activo, calidad ni intención de compra. Tampoco permite atribuir el movimiento a personas concretas. Para un panel público, esa limitación es saludable: reduce la recopilación de datos que no hacen falta para responder la pregunta principal, que es cómo evolucionó la señal agregada.$x$),
    jsonb_build_object('type','list','text',$x$Migración sugerida: localizar integraciones que enumeran stargazers; documentar qué gráfico o decisión depende de ellas; sustituir la colección de perfiles por el endpoint histórico cuando sólo se necesiten conteos; guardar el mínimo período necesario; respetar autenticación, paginación y límites de la API; indicar que “estrellas” no equivale a usuarios; y validar los totales antes de retirar el proceso anterior.$x$),
    jsonb_build_object('type','heading','text',$x$Privacidad por diseño también mejora el mantenimiento$x$),
    jsonb_build_object('type','paragraph','text',$x$Trabajar con datos agregados reduce el riesgo de conservar nombres de usuario, elimina dependencias de campos que una política puede restringir y simplifica la explicación del panel. Aun así, una serie histórica puede ser sensible para un proyecto privado y debe protegerse con los mismos permisos del repositorio. La API no resuelve por sí sola retención, control de acceso, caché ni cumplimiento: cada integración sigue siendo responsable de decidir cuánto almacena y quién puede consultarlo.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta nota complementa /news/tech-github-oauth-tokens-rotativos-redirect-uri-guia, dedicada a autenticación de aplicaciones, y /news/ai-github-copilot-politicas-facturacion-retencion-septiembre-2026, centrada en gobierno de datos de Copilot. GitHub Changelog es la fuente primaria del nuevo endpoint. XETHKIOZ recomienda migrar sólo los usos que buscan tendencias agregadas y conservar una descripción honesta de lo que la métrica representa.$x$)
  ),
  'tech', (select author_id from editorial_author), 'published', '2026-09-07T20:05:00Z',
  array['tecnologia','github','rest-api','metricas','estrellas','privacidad','datos-agregados','open-source','fuente-oficial'],
  array['https://github.blog/changelog/2026-09-04-new-api-endpoint-provides-privacy-safe-star-history-data/'],
  false, 'approved', 'Fuente primaria: GitHub Changelog, 4 de septiembre de 2026. Se distingue interés agregado de uso real y se evita inferir identidades.', now(), now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, content = excluded.content,
  category = excluded.category, author_id = coalesce(excluded.author_id, public.news_articles.author_id),
  status = excluded.status, published_at = excluded.published_at, tags = excluded.tags,
  source_urls = excluded.source_urls, ai_generated = excluded.ai_generated,
  review_status = excluded.review_status, editor_notes = excluded.editor_notes, updated_at = now();

commit;
