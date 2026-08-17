begin;

with editorial_author as (
  select id as author_id
  from public.profiles
  order by is_site_owner desc, (upper(role) = 'ADMIN') desc, created_at asc nulls last
  limit 1
)
insert into public.news_articles (
  slug, title, summary, content, category, author_id, status, published_at,
  tags, source_urls, ai_generated, review_status, editor_notes, created_at, updated_at
)
values
(
  'gaming-playstation-plus-catalogo-agosto-2026-guia',
  'Gaming · PlayStation Plus actualiza su catálogo de agosto: qué llega y cómo elegir',
  'Sony confirmó la tanda de agosto para Extra y Premium. Ordenamos fechas, regiones y tipos de juego para que puedas decidir qué descargar sin llenar la consola por impulso.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una actualización grande, pero no toda llega el mismo día$x$),
    jsonb_build_object('type','paragraph','text',$x$PlayStation publicó el catálogo de agosto de 2026 para los planes Extra y Premium. Helldivers 2 se incorporó el 12 de agosto, mientras que la mayoría de los demás juegos de la tanda está prevista para el martes 18. Entre los títulos destacados aparecen Kingdom Come: Deliverance II, Vampire Survivors, Hell is Us, Two Point Museum, Metro Exodus y Dying Light 2. Premium suma además clásicos como Onimusha: Dawn of Dreams y Disney’s Atlantis: The Lost Empire. La lista es atractiva, pero la disponibilidad puede variar por territorio y plan: la comprobación final siempre debe hacerse en la PlayStation Store de la cuenta que va a jugar.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo elegir sin descargar todo$x$),
    jsonb_build_object('type','list','text',$x$1. Si querés cooperativo inmediato, empezá por Helldivers 2 y verificá que tu conexión y suscripción estén activas; 2. Si buscás una campaña larga, reservá espacio y tiempo para Kingdom Come: Deliverance II; 3. Para sesiones cortas, Vampire Survivors ofrece progreso rápido sin exigir una agenda; 4. Hell is Us y Metro Exodus priorizan atmósfera y exploración; 5. Antes de instalar, revisá tamaño, idioma, versión PS4/PS5 y fecha regional.$x$),
    jsonb_build_object('type','paragraph','text',$x$También conviene separar “incluido en el catálogo” de “comprado”. Mientras un juego forme parte de Extra o Premium y la suscripción siga vigente, podrá jugarse bajo las condiciones del servicio; si abandona el catálogo, el acceso puede terminar. Para una biblioteca estable, comprar sigue siendo diferente de reclamar o instalar desde una suscripción. Sony aclara además que el catálogo y la disponibilidad de streaming cambian según el país.$x$),
    jsonb_build_object('type','heading','text',$x$La recomendación XETHKIOZ$x$),
    jsonb_build_object('type','paragraph','text',$x$Elegí un juego principal y uno de descanso. Esa combinación reduce descargas innecesarias y evita abandonar cinco campañas a la vez. La fuente oficial respalda nombres, planes y fechas anunciadas; las recomendaciones de organización son análisis editorial. Si Sony modifica la lista o una fecha regional, la Store local tiene prioridad sobre cualquier resumen.$x$)
  ),
  'gaming', (select author_id from editorial_author), 'published', '2026-08-17T13:45:00Z',
  array['gaming','playstation-plus','guia','catalogo','fuente-oficial'],
  array['https://blog.playstation.com/2026/08/12/playstation-plus-game-catalog-for-august-helldivers-2-kingdom-come-deliverance-ii-vampire-survivors-hell-is-us-and-more/'],
  false, 'approved', 'Fuente primaria: PlayStation Blog. Fechas y disponibilidad regional diferenciadas; recomendaciones editoriales identificadas.', now(), now()
),
(
  'ai-openai-ultrafast-gpt-5-6-guia-latencia',
  'IA · GPT‑5.6 Sol Ultrafast: cuándo la velocidad cambia un producto y cuándo no',
  'OpenAI presentó una vista previa capaz de generar hasta 750 tokens por segundo. Explicamos dónde la baja latencia aporta valor y qué controles siguen siendo indispensables.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$La novedad no es sólo “responde más rápido”$x$),
    jsonb_build_object('type','paragraph','text',$x$OpenAI presentó Ultrafast, un nuevo nivel de servicio para GPT‑5.6 Sol en la API. Según la compañía, puede alcanzar hasta catorce veces la velocidad del procesamiento estándar y producir hasta 750 tokens de salida por segundo. La infraestructura está impulsada por Cerebras y comenzó como una vista previa para un grupo inicial de clientes. Esto no significa que todas las solicitudes vayan a sostener el máximo anunciado ni que el modo esté disponible de inmediato para cualquier cuenta: son cifras de referencia y un acceso todavía controlado.$x$),
    jsonb_build_object('type','heading','text',$x$Dónde la latencia sí cambia la experiencia$x$),
    jsonb_build_object('type','list','text',$x$Asistentes de voz que deben contestar sin silencios incómodos; edición de código en tiempo real; simuladores interactivos; clasificación operativa con una persona esperando; interfaces donde la respuesta se construye mientras el usuario actúa. En documentos largos, lotes nocturnos o tareas que ya tardan minutos por procesos externos, pagar por más velocidad puede aportar poco.$x$),
    jsonb_build_object('type','paragraph','text',$x$Velocidad tampoco equivale a precisión. Un modelo que entrega texto antes puede equivocarse antes. La aplicación debe conservar validación de datos, límites de salida, observabilidad, control de costos y una ruta de recuperación. En flujos sensibles conviene medir tiempo hasta el primer token, tiempo total, tasa de errores y calidad de la respuesta, no sólo tokens por segundo.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo evaluar el modo sin dejarse llevar por la cifra$x$),
    jsonb_build_object('type','paragraph','text',$x$Prepará un conjunto de tareas reales, compará Standard y Ultrafast bajo la misma carga y registrá costo, calidad y percentiles de latencia. Si la mejora no cambia una decisión del usuario o una métrica de negocio, probablemente sea optimización sin impacto. La fuente oficial respalda el anuncio, el proveedor de infraestructura y los máximos publicados; la metodología de evaluación es una guía editorial de XETHKIOZ.$x$)
  ),
  'ai', (select author_id from editorial_author), 'published', '2026-08-17T13:40:00Z',
  array['ia','openai','gpt-5-6','api','rendimiento','fuente-oficial'],
  array['https://openai.com/index/previewing-ultrafast/'],
  false, 'approved', 'Fuente primaria: OpenAI. Se preserva el carácter de preview y se evita presentar máximos como garantía.', now(), now()
),
(
  'science-eclipse-total-2026-nasa-que-aprendimos',
  'Ciencia · El eclipse total de 2026 ya pasó: qué mostró y cómo leer sus imágenes',
  'NASA documentó la totalidad sobre España el 12 de agosto. Esta guía explica qué se observa, por qué aparece la corona y cómo evitar conclusiones falsas a partir de fotografías compuestas.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una alineación precisa vista desde la Tierra$x$),
    jsonb_build_object('type','paragraph','text',$x$El 12 de agosto de 2026 la Luna se alineó entre el Sol y la Tierra y produjo un eclipse total visible a lo largo de una franja que incluyó sectores de Groenlandia, Islandia y España. NASA Earth Observatory publicó el 14 de agosto una imagen compuesta tomada en San Millán de los Caballeros, España, que muestra la progresión del fenómeno sobre un campo de girasoles. Durante la totalidad, el disco brillante del Sol quedó cubierto y fue posible observar su atmósfera exterior, la corona.$x$),
    jsonb_build_object('type','heading','text',$x$Qué significa “imagen compuesta”$x$),
    jsonb_build_object('type','paragraph','text',$x$Una composición reúne varias exposiciones o instantes en una sola escena para mostrar una secuencia que el ojo no ve simultáneamente. No es una falsificación: es una técnica explicativa, siempre que se identifique como tal. La posición aparente, el brillo de la corona y el paisaje pueden combinar tomas con ajustes diferentes. Por eso una imagen científica debe leerse junto con su crédito, descripción, lugar, fecha y método.$x$),
    jsonb_build_object('type','list','text',$x$Para verificar una foto: buscá la publicación original; confirmá lugar y horario; revisá si dice composite o composición; distinguí color real de procesamiento; compará con mapas oficiales del recorrido de la sombra; evitá usar una foto espectacular como prueba de afirmaciones que la fuente no hace.$x$),
    jsonb_build_object('type','heading','text',$x$Por qué la corona interesa a la ciencia$x$),
    jsonb_build_object('type','paragraph','text',$x$La corona es mucho más caliente que la superficie visible del Sol y está conectada con el viento solar y el clima espacial. Los eclipses ofrecen una oportunidad excepcional para observar estructuras cercanas al borde solar con la luz intensa bloqueada. Aun así, una fotografía pública no reemplaza los datos de instrumentos ni permite por sí sola medir temperaturas o predecir tormentas.$x$),
    jsonb_build_object('type','paragraph','text',$x$La fuente de NASA respalda la fecha, el lugar, el carácter compuesto de la imagen y la descripción de la corona. La guía de lectura crítica es elaboración editorial. Para futuros eclipses, nunca se debe mirar el Sol sin protección certificada salvo durante la fase breve de totalidad y únicamente cuando una autoridad especializada confirme que es seguro.$x$)
  ),
  'science', (select author_id from editorial_author), 'published', '2026-08-17T13:35:00Z',
  array['ciencia','nasa','eclipse','astronomia','guia','fuente-oficial'],
  array['https://science.nasa.gov/earth/earth-observatory/a-sunflowers-view-of-totality/'],
  false, 'approved', 'Fuente primaria: NASA Earth Observatory. Técnica fotográfica y límites explicados.', now(), now()
),
(
  'tech-github-oauth-tokens-rotativos-redirect-uri-guia',
  'Tecnología · GitHub moderniza OAuth: tokens rotativos y hasta diez URLs de retorno',
  'Las aplicaciones OAuth pueden usar accesos de ocho horas, refresh tokens y múltiples callbacks. Una guía para migrar sin abrir redirecciones peligrosas.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Tres cambios que resuelven problemas distintos$x$),
    jsonb_build_object('type','paragraph','text',$x$GitHub anunció el 14 de agosto varias mejoras para aplicaciones OAuth y GitHub Apps. Las nuevas aplicaciones OAuth reciben por defecto tokens de acceso de corta duración: ocho horas, acompañados por un refresh token válido por seis meses. También es posible registrar hasta diez URLs de retorno para separar producción, pruebas y otros dominios sin crear aplicaciones distintas. Finalmente, GitHub permite habilitar coincidencias con comodines cuando el proyecto realmente lo necesita.$x$),
    jsonb_build_object('type','heading','text',$x$La mejora de seguridad depende de la implementación$x$),
    jsonb_build_object('type','paragraph','text',$x$Un token corto reduce la ventana de abuso si se filtra, pero el refresh token pasa a ser un secreto de alto valor. Debe guardarse en el servidor, cifrarse o protegerse mediante el gestor de secretos de la plataforma y rotarse siguiendo el flujo oficial. En una aplicación web pública no corresponde exponerlo en localStorage, código del cliente, logs o parámetros de URL.$x$),
    jsonb_build_object('type','list','text',$x$Inventariá todas las callback actuales; registrá URLs exactas siempre que sea posible; separá desarrollo y producción; actualizá el SDK antes de activar expiración; tratá refresh tokens como credenciales; probá revocación y cierre de sesión; monitoreá errores de callback; usá comodines sólo cuando los subdominios sean controlados y el patrón sea estrecho.$x$),
    jsonb_build_object('type','heading','text',$x$Por qué un comodín exige más cuidado$x$),
    jsonb_build_object('type','paragraph','text',$x$Una URL de retorno define dónde puede terminar el navegador después de autorizar. Un patrón demasiado amplio puede aceptar un subdominio olvidado o comprometido y facilitar el robo del código de autorización. La comodidad de un wildcard no compensa una frontera ambigua. Si el proyecto sólo tiene dos entornos, registrar dos URLs exactas suele ser más seguro y más fácil de auditar.$x$),
    jsonb_build_object('type','paragraph','text',$x$La fuente oficial respalda los límites, duraciones y opciones anunciadas. Antes de migrar una integración real, hay que leer la documentación de autorización enlazada por GitHub y probar el cambio en un entorno separado. Esta nota explica el impacto y no reemplaza el procedimiento específico del SDK utilizado.$x$)
  ),
  'tech', (select author_id from editorial_author), 'published', '2026-08-17T13:30:00Z',
  array['tecnologia','github','oauth','seguridad','tokens','fuente-oficial'],
  array['https://github.blog/changelog/2026-08-14-multiple-redirect-uris-and-token-refresh-for-oauth-apps/'],
  false, 'approved', 'Fuente primaria: GitHub Changelog. Parámetros y recomendaciones de seguridad diferenciados.', now(), now()
),
(
  'programming-chrome-email-verification-origin-trial-guia',
  'Programación · Chrome cambia la verificación de email: qué probar antes de adoptar el experimento',
  'El origin trial mejora la experiencia y cambia el formato de emisión en Chrome 153. Explicamos compatibilidad, validación de tokens y una migración prudente.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una mejora progresiva, no un reemplazo universal$x$),
    jsonb_build_object('type','paragraph','text',$x$Chrome mantiene una prueba de origen para verificar direcciones de correo directamente con el proveedor y reducir el salto a un enlace mágico u OTP. La actualización de agosto permite iniciar el proceso después de escribir o pegar el correo y salir del campo, agrega un indicador visual en Chrome 152 y mantiene la función limitada a escritorio en esa versión. El sitio recibe un token que debe validar correctamente; el mecanismo todavía no debe tratarse como requisito para todas las personas.$x$),
    jsonb_build_object('type','heading','text',$x$El cambio incompatible de Chrome 153$x$),
    jsonb_build_object('type','paragraph','text',$x$Para proveedores de email, Chrome 153 cambia la solicitud de emisión: pasa de un POST form-urlencoded con request_token a JSON firmado mediante HTTP Message Signatures. Durante la transición, la opción más segura suele ser aceptar ambos formatos según Content-Type, medir tráfico real y retirar el formato anterior cuando la versión estable esté suficientemente desplegada. Cambiar de una vez deja afuera a navegadores anteriores.$x$),
    jsonb_build_object('type','list','text',$x$Conservá el flujo clásico de enlace u OTP como fallback; validá firma, audiencia, nonce y vinculación del token; usá una biblioteca SD-JWT mantenida; compará emails sin distinguir mayúsculas; probá teclado, lector de pantalla y autofill; no registres tokens completos; protegé los endpoints con límites de frecuencia; activá el origin trial sólo en dominios controlados.$x$),
    jsonb_build_object('type','heading','text',$x$Lo que esta API no soluciona$x$),
    jsonb_build_object('type','paragraph','text',$x$Verificar que una persona controla un correo no prueba su identidad legal ni evita por sí solo el abuso de cuentas. Tampoco reemplaza la gestión de sesiones, recuperación segura, protección contra CSRF o controles antifraude. La experiencia puede ser más fluida, pero la arquitectura de autenticación sigue necesitando capas.$x$),
    jsonb_build_object('type','paragraph','text',$x$La documentación de Chrome respalda versiones, comportamiento y formato nuevo. La lista de pruebas es una guía editorial aplicable a equipos pequeños. Por tratarse de un origin trial, cualquier implementación debe vigilar cambios de especificación y mantener una salida funcional para navegadores no compatibles.$x$)
  ),
  'programming', (select author_id from editorial_author), 'published', '2026-08-17T13:25:00Z',
  array['programacion','chrome','autenticacion','email','web','fuente-oficial'],
  array['https://developer.chrome.com/blog/email-verification-august-2026'],
  false, 'approved', 'Fuente primaria: Chrome for Developers. Se mantiene fallback y se marca el estado experimental.', now(), now()
),
(
  'green-mozilla-clave-firma-firefox-thunderbird-guia',
  'Green Node · Mozilla reemplazó una clave de firma: qué deben revisar usuarios y administradores',
  'La clave anterior fue revocada tras quedar expuesta en un repositorio privado. Mozilla no encontró acceso no autorizado y explica dos casos que requieren atención.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Qué ocurrió y qué no se debe exagerar$x$),
    jsonb_build_object('type','paragraph','text',$x$Mozilla informó el 10 de agosto que cambió la subclave GPG utilizada para firmar determinados artefactos de Firefox y Thunderbird, como tarballs de Linux, paquetes RPM y archivos de checksums. Una copia sin cifrar de la subclave anterior había sido incluida por error en un repositorio privado de GitHub. La organización revocó la clave y añadió controles preventivos. Su revisión de registros no encontró evidencia de acceso no autorizado; eso reduce el riesgo observado, pero no vuelve innecesaria la rotación.$x$),
    jsonb_build_object('type','heading','text',$x$Para la mayoría no hay una acción manual$x$),
    jsonb_build_object('type','paragraph','text',$x$Quienes actualizan Firefox o Thunderbird mediante los canales normales de su distribución o del propio producto generalmente reciben los cambios correspondientes sin intervenir. Los casos especiales son administradores que validan descargas manualmente contra la clave de Mozilla y sistemas automatizados que fijaron el fingerprint anterior. Esos flujos deben incorporar la clave nueva siguiendo la publicación oficial.$x$),
    jsonb_build_object('type','list','text',$x$Confirmá que la descarga provenga del dominio oficial; actualizá la clave sólo desde la fuente de Mozilla; verificá fingerprint y revocación; buscá referencias fijadas a la clave anterior en CI o scripts; no desactives la verificación para “hacer pasar” una tarea; revisá logs por fallas de firma; documentá la rotación y la fecha.$x$),
    jsonb_build_object('type','heading','text',$x$La lección para cualquier proyecto$x$),
    jsonb_build_object('type','paragraph','text',$x$Una clave de firma demuestra procedencia e integridad. Guardarla sin cifrar, aunque el repositorio sea privado, aumenta el impacto posible de un acceso indebido. Los secretos de publicación deben vivir en almacenamiento dedicado, con acceso mínimo, auditoría, rotación ensayada y un plan de revocación. También conviene impedir que herramientas de desarrollo los agreguen al control de versiones.$x$),
    jsonb_build_object('type','paragraph','text',$x$La fuente oficial respalda el incidente, la ausencia de evidencia detectada y el alcance de los artefactos. Esta nota no afirma que hubo explotación ni recomienda descargar claves desde terceros. Frente a un error de verificación, el camino seguro es detener la publicación y contrastar la documentación vigente.$x$)
  ),
  'green', (select author_id from editorial_author), 'published', '2026-08-17T13:20:00Z',
  array['green-node','mozilla','firefox','thunderbird','seguridad','fuente-oficial'],
  array['https://blog.mozilla.org/security/2026/08/10/updated-gpg-key-for-signing-firefox-and-thunderbird-releases/'],
  false, 'approved', 'Fuente primaria: Mozilla Security Blog. Sin especular sobre acceso o explotación no confirmados.', now(), now()
),
(
  'comicon-marvel-d23-2026-resumen-confirmado',
  'COMICON · Marvel en D23 2026: cómo separar adelantos confirmados de rumores',
  'Marvel reunió sus anuncios del evento, con nueva información de X‑Men, VisionQuest y Avengers. Ordenamos qué significa cada tipo de revelación y qué todavía necesita fecha o detalle oficial.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Un evento grande produce noticias y también ruido$x$),
    jsonb_build_object('type','paragraph','text',$x$Marvel publicó el 15 de agosto su recapitulación oficial de D23 2026. Entre los ejes destacados por la compañía aparecen novedades sobre el reparto de X‑Men, un avance de VisionQuest y una mirada especial a Avengers. La página funciona como fuente primaria para saber qué mostró Marvel; capturas aisladas, relatos del público y cuentas que reinterpretan el evento no tienen el mismo peso.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo leer un anuncio de entretenimiento$x$),
    jsonb_build_object('type','list','text',$x$Reparto confirmado no equivale a trama confirmada; tráiler presentado no siempre significa lanzamiento inmediato; una “mirada especial” puede contener material de producción sin fecha definitiva; logo o título no prueban duración ni clasificación; una ventana de estreno es menos precisa que un día oficial; cualquier dato regional debe revisarse en el distribuidor local.$x$),
    jsonb_build_object('type','paragraph','text',$x$Para seguir las novedades sin spoilers, conviene leer primero el resumen oficial y después elegir análisis. Un tráiler puede confirmar personajes o tono, pero las teorías sobre variantes, villanos o conexiones del multiverso siguen siendo teorías hasta que Marvel las publique. XETHKIOZ las presentará como hipótesis, nunca como información cerrada.$x$),
    jsonb_build_object('type','heading','text',$x$Qué debería actualizarse en una nota futura$x$),
    jsonb_build_object('type','paragraph','text',$x$Cuando aparezcan fechas, plataformas, reparto completo o sinopsis definitivas, la nota deberá indicar qué dato cambió y conservar la fuente. Si una producción se retrasa, el titular anterior no debería quedar circulando sin corrección. La cultura fan gana valor cuando el entusiasmo puede convivir con un archivo claro de confirmaciones.$x$),
    jsonb_build_object('type','paragraph','text',$x$La fuente oficial respalda que Marvel reunió esos ejes en D23. Este artículo no reproduce material exclusivo ni afirma detalles que el resumen público no confirme. Las explicaciones sobre jerarquía de anuncios y actualización editorial son elaboración de XETHKIOZ.$x$)
  ),
  'comicon', (select author_id from editorial_author), 'published', '2026-08-17T13:15:00Z',
  array['comicon','marvel','d23','x-men','visionquest','avengers','fuente-oficial'],
  array['https://www.marvel.com/articles/live-events/d23-2026-all-the-marvel-news-recap'],
  false, 'approved', 'Fuente primaria: Marvel. El texto distingue anuncios, materiales presentados e inferencias de fans.', now(), now()
),
(
  'community-huellas-rabia-vacunacion-guia-practica',
  'Huellas de Puan · Vacunación antirrábica y prevención: guía práctica para perros y gatos',
  'La vacuna anual desde los tres meses es una medida central de salud pública. Explicamos qué registrar, cómo actuar ante una mordedura y cuándo llamar a un profesional.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$La rabia se previene antes de una emergencia$x$),
    jsonb_build_object('type','paragraph','text',$x$El Ministerio de Salud de la Nación indica la vacunación antirrábica anual para perros y gatos a partir de los tres meses y durante toda su vida. La rabia es una zoonosis mortal una vez que aparecen síntomas, por eso la prevención combina vacunación, control veterinario y evitar el contacto con animales silvestres. No alcanza con recordar que “alguna vez” recibió una dosis: la libreta o certificado permite confirmar fecha y vigencia.$x$),
    jsonb_build_object('type','heading','text',$x$Qué debería tener una carpeta básica de la mascota$x$),
    jsonb_build_object('type','list','text',$x$Certificado de vacuna antirrábica con fecha y profesional; calendario de vacunas y desparasitación indicado por veterinaria; foto reciente y señas particulares; teléfono de contacto; medicación habitual y alergias conocidas; comprobante de castración si corresponde; datos del centro veterinario o autoridad local para urgencias.$x$),
    jsonb_build_object('type','paragraph','text',$x$Ante una mordedura o arañazo potencialmente riesgoso, lavá la zona con abundante agua y jabón y buscá atención de salud humana sin esperar síntomas. La evaluación profesional definirá si corresponde profilaxis. No intentes capturar con las manos a un murciélago u otro animal silvestre y evitá que perros o gatos entren en contacto con ejemplares enfermos o muertos.$x$),
    jsonb_build_object('type','heading','text',$x$Publicar un aviso también requiere cuidado$x$),
    jsonb_build_object('type','paragraph','text',$x$Si una mascota se pierde, informá zona y momento, una foto nítida, tamaño, color, señas, si necesita medicación y un canal de contacto. No publiques documentos personales completos ni una dirección exacta. Cuando reaparezca, cerrá el aviso para que la comunidad no siga difundiendo información vieja. Huellas de Puan mantiene avisos activos por un período limitado precisamente para reducir confusión.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía resume recomendaciones oficiales y no reemplaza una consulta veterinaria ni la evaluación de un centro de salud. Las campañas, turnos y contactos pueden cambiar; antes de trasladarte, verificá el canal oficial de la autoridad local. En una urgencia, priorizá atención profesional sobre consejos de redes sociales.$x$)
  ),
  'community', (select author_id from editorial_author), 'published', '2026-08-17T13:10:00Z',
  array['huellas-de-puan','mascotas','rabia','vacunacion','guia','fuente-oficial'],
  array['https://www.argentina.gob.ar/salud/glosario/rabia','https://www.argentina.gob.ar/salud/protenencia'],
  false, 'approved', 'Fuentes primarias: Ministerio de Salud de la Nación y Protenencia. La guía remite a atención profesional.', now(), now()
)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  category = excluded.category,
  author_id = coalesce(excluded.author_id, public.news_articles.author_id),
  status = excluded.status,
  published_at = excluded.published_at,
  tags = excluded.tags,
  source_urls = excluded.source_urls,
  ai_generated = excluded.ai_generated,
  review_status = excluded.review_status,
  editor_notes = excluded.editor_notes,
  updated_at = now();

commit;
