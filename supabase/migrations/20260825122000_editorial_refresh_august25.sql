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
  'gaming-into-the-radius-2-psvr2-lanzamiento-guia',
  'Gaming · Into the Radius 2 llega a PS VR2: campaña primero y cooperativo después',
  'El survival táctico se estrena el 24 de septiembre con campaña individual, equipamiento modular y funciones específicas de PS VR2. El cooperativo para dos llegará mediante una actualización posterior.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una fecha confirmada y dos etapas diferentes$x$),
    jsonb_build_object('type','paragraph','text',$x$CM Immersive anunció mediante PlayStation Blog que Into the Radius 2 llegará a PlayStation VR2 el 24 de septiembre de 2026. El lanzamiento incluirá una campaña individual completa. El modo cooperativo para dos jugadores no estará disponible ese día: se incorporará gratuitamente durante el cuarto trimestre de 2026. Separar ambas fechas evita comprar esperando una función que todavía estará en desarrollo.$x$),
    jsonb_build_object('type','heading','text',$x$Preparación y mantenimiento como parte del riesgo$x$),
    jsonb_build_object('type','paragraph','text',$x$La secuela amplía la configuración física del equipo. El jugador puede ajustar la posición de bolsillos y fundas en chalecos y mochilas, modificar cañones, culatas, miras, empuñaduras y cargadores, y personalizar colores o patrones. Cada componente del arma registra desgaste y suciedad por separado. Descuidar la limpieza puede provocar un atasco durante una expedición, por lo que el inventario no funciona sólo como decoración.$x$),
    jsonb_build_object('type','list','text',$x$Antes de comprar conviene comprobar espacio libre alrededor del visor; tolerancia personal al desplazamiento en realidad virtual; disponibilidad de PS VR2 y controles Sense; preferencia por campaña individual; interés real en esperar el cooperativo; y capacidad para sostener sesiones de exploración lenta. La propuesta premia observación, mantenimiento y planificación más que avanzar disparando sin pausa.$x$),
    jsonb_build_object('type','heading','text',$x$Qué aporta el hardware de PS VR2$x$),
    jsonb_build_object('type','paragraph','text',$x$El estudio anuncia 90 cuadros por segundo nativos, renderizado foveado mediante seguimiento ocular, audio 3D, resistencia adaptable en los gatillos y respuesta háptica en visor y controles. También describe enemigos que usan cobertura o flanquean, anomalías eléctricas, zonas que consumen salud y una marea que redistribuye rivales y botín. Son características declaradas por el desarrollador; el rendimiento final deberá comprobarse con la versión publicada.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía se conecta con /news/gaming-modern-warfare-4-beta-abierta-ps5-guia: ambas ayudan a distinguir lo disponible ahora de lo prometido para después. PlayStation Blog respalda fecha, contenido y funciones técnicas. XETHKIOZ recomienda evaluar comodidad, duración de sesión y campaña antes que el número de accesorios, y revisar la ficha regional por precio, idioma y posibles cambios previos al estreno.$x$)
  ),
  'gaming', (select author_id from editorial_author), 'published', '2026-08-25T12:20:00Z',
  array['gaming','playstation-vr2','realidad-virtual','into-the-radius-2','survival','cooperativo','guia','fuente-oficial'],
  array['https://blog.playstation.com/2026/08/24/vr-shooter-into-the-radius-2-hits-ps-vr2-september-24/'],
  false, 'approved', 'Fuente primaria: PlayStation Blog y CM Immersive, 24 de agosto de 2026. Se diferencia con claridad el lanzamiento individual del cooperativo previsto para Q4.', now(), now()
),
(
  'ai-openai-gpt-5-6-kiro-desarrollo-especificaciones',
  'IA y tecnología · GPT‑5.6 llega a Kiro: cómo funciona el desarrollo guiado por especificaciones',
  'OpenAI y AWS incorporaron Sol, Terra y Luna al agente de desarrollo Kiro. La propuesta combina requisitos, diseños técnicos, tareas verificables y puntos de revisión antes de implementar cambios.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Tres modelos dentro de un flujo estructurado$x$),
    jsonb_build_object('type','paragraph','text',$x$OpenAI informó el 24 de agosto de 2026 que la familia GPT‑5.6 ya está disponible en Kiro, el agente de desarrollo de AWS. La integración ofrece Sol, Terra y Luna para planificar, construir, revisar y probar software. El valor anunciado no consiste solamente en generar código: Kiro transforma una intención general en requisitos, diseño técnico y tareas ejecutables que el equipo puede revisar durante el proceso.$x$),
    jsonb_build_object('type','heading','text',$x$Qué trabajo puede organizar$x$),
    jsonb_build_object('type','list','text',$x$Convertir una idea de producto en un plan de implementación; mantener contexto del repositorio y normas del equipo; resolver tareas de varios pasos; revisar decisiones en puntos definidos; refinar resultados antes de aplicarlos; y comprobar propiedades esperadas mediante pruebas basadas en propiedades. Ninguna de estas capacidades elimina la necesidad de permisos limitados, revisión de cambios ni pruebas propias del proyecto.$x$),
    jsonb_build_object('type','paragraph','text',$x$OpenAI afirma que GPT‑5.6 Terra logró tareas exitosas en Terminal-Bench 2.1 dentro de Kiro con una reducción de costo cercana al 82 por ciento. Ese resultado pertenece a una prueba concreta de OpenAI y AWS: no significa que cualquier repositorio vaya a costar 82 por ciento menos. El ahorro real depende de complejidad, contexto enviado, reintentos, modelo elegido, herramientas y cantidad de revisión humana.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo evaluarlo sin entregar el repositorio a ciegas$x$),
    jsonb_build_object('type','paragraph','text',$x$Una prueba responsable debería comenzar con un módulo aislado, requisitos medibles y una rama protegida. Conviene registrar tiempo total, consumo, número de correcciones, cobertura añadida y defectos detectados después de la revisión. También hay que definir qué archivos puede leer o modificar el agente, impedir el acceso a secretos y exigir aprobación antes de fusionar. La estructura de una especificación ayuda, pero no sustituye gobierno técnico.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta nota complementa /news/ai-github-copilot-slack-preview-guia-seguridad: Slack organiza la colaboración alrededor de una conversación, mientras Kiro organiza el trabajo alrededor de especificaciones y tareas. OpenAI es la fuente primaria para disponibilidad, modelos y resultado de referencia. Las recomendaciones de evaluación y seguridad son elaboración editorial de XETHKIOZ y no una garantía comercial.$x$)
  ),
  'ai', (select author_id from editorial_author), 'published', '2026-08-25T12:15:00Z',
  array['ia','openai','aws','kiro','gpt-5-6','desarrollo','pruebas','fuente-oficial'],
  array['https://openai.com/index/gpt-5-6-in-kiro/'],
  false, 'approved', 'Fuente primaria: OpenAI, 24 de agosto de 2026. La reducción de costo se presenta únicamente como resultado de una prueba conjunta en Terminal-Bench 2.1.', now(), now()
),
(
  'science-nasa-cometa-220p-estallido-binoculares',
  'Ciencia · El cometa 220P aumentó su brillo unas 20.000 veces y todavía no se conoce la causa',
  'Dos estallidos volvieron observable con binoculares a un cometa que normalmente exige telescopio. NASA explica qué se sabe de su órbita, qué sigue siendo una hipótesis y qué ocurrirá en octubre.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Un objeto tenue cambió de forma inesperada$x$),
    jsonb_build_object('type','paragraph','text',$x$Astronomy Picture of the Day de NASA destacó el 24 de agosto de 2026 al cometa periódico 220P/McNaught. Dos estallidos registrados durante el año lo volvieron aproximadamente 20.000 veces más brillante que su nivel habitual. Normalmente requiere un telescopio; en este estado puede observarse con binoculares y mediante exposiciones fotográficas largas, siempre que las condiciones del cielo y la ubicación lo permitan.$x$),
    jsonb_build_object('type','heading','text',$x$Qué muestra la imagen y qué no demuestra$x$),
    jsonb_build_object('type','paragraph','text',$x$La exposición tomada desde Sudáfrica muestra una cabeza verde brillante y una cola de polvo corta. El color puede estar relacionado con compuestos excitados por la radiación solar, pero una fotografía por sí sola no identifica el mecanismo que provocó el aumento. NASA señala que la causa todavía es desconocida. Entre las posibilidades menciona liberación de gas acumulado bajo la superficie o movimientos comparables a sismos del cometa.$x$),
    jsonb_build_object('type','list','text',$x$Datos confirmados: 220P orbita el Sol entre Marte y Júpiter; completa una vuelta en más de cinco años; atravesó dos estallidos durante 2026; actualmente es mucho más brillante de lo normal; y en octubre pasará a una distancia cercana a una unidad astronómica de la Tierra. Hipótesis abiertas: qué disparó los estallidos y cuánto contribuyó cada proceso.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo intentar observarlo responsablemente$x$),
    jsonb_build_object('type','paragraph','text',$x$No debe buscarse apuntando cerca del Sol ni usando una posición tomada de una nota general. La ubicación aparente cambia cada noche. Para observarlo se necesita una carta celeste actualizada, cielo oscuro, adaptación visual y un sitio seguro. Los binoculares pueden mostrar una mancha difusa, no necesariamente la estructura verde de una exposición prolongada. Después del paso de octubre se espera que vuelva a perder brillo rápidamente.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta publicación complementa /news/science-nasa-lago-bonneville-huellas-orbita-venus porque ambas separan imagen, medición e interpretación. NASA respalda el aumento de brillo, la órbita, la aproximación y las hipótesis citadas. XETHKIOZ evita presentar una explicación tentativa como descubrimiento confirmado y recomienda consultar efemérides astronómicas actualizadas antes de cualquier observación.$x$)
  ),
  'science', (select author_id from editorial_author), 'published', '2026-08-25T12:10:00Z',
  array['ciencia','nasa','astronomia','cometa-220p','mcnaught','observacion','espacio','fuente-oficial'],
  array['https://science.nasa.gov/image-article/apod/apod-2026-august-24-comet-220p-in-outburst/'],
  false, 'approved', 'Fuente primaria: NASA Astronomy Picture of the Day, 24 de agosto de 2026. Se preserva como desconocida la causa de los estallidos y se diferencian datos de hipótesis.', now(), now()
),
(
  'comicon-tomb-of-apocalypse-1-wolverine-jubilee-guia',
  'COMICON · Tomb of Apocalypse #1: Wolverine y Jubilee entran en una misión que exige contexto',
  'Marvel publica el 26 de agosto el inicio de una miniserie centrada en el regreso de Apocalypse y el reclutamiento de dos X-Men. Ordenamos premisa, equipo creativo y qué conviene saber antes de leer.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Un número uno para entrar sin comprar toda la tanda semanal$x$),
    jsonb_build_object('type','paragraph','text',$x$Marvel incluyó Tomb of Apocalypse #1 entre sus lanzamientos del miércoles 26 de agosto de 2026. El inicio está escrito por Ashley Allen, dibujado por Domenico Carbone y cuenta con portada principal de Rod Reis. La serie coloca a Apocalypse nuevamente sobre la Tierra después de su exilio espacial y lo muestra reclutando a Wolverine y Jubilee para una misión vinculada con sus capacidades particulares.$x$),
    jsonb_build_object('type','heading','text',$x$La premisa sin adelantar el resultado$x$),
    jsonb_build_object('type','paragraph','text',$x$El material oficial presenta un dispositivo desconocido llegado desde Marte que reacciona con los poderes de Jubilee. Ella y Wolverine son enviados hacia una excavación en Egipto asociada con la tumba de Apocalypse. El recorrido promete una búsqueda de reliquias, peligros subterráneos y preguntas sobre los planes del antiguo mutante para humanidad, mutantes, Tierra y Arakko. La nota no revela cómo se resuelve esa misión.$x$),
    jsonb_build_object('type','list','text',$x$Antes de comprar: confirmar que se trata del número 1 de una miniserie y no de una recopilación; revisar autores y portada porque existen variantes; comprobar idioma y edición disponibles en la tienda local; decidir si interesa el eje mutante posterior a Krakoa; y evitar adelantos visuales si se prefiere descubrir la tumba sin spoilers.$x$),
    jsonb_build_object('type','heading','text',$x$Cuánto contexto hace falta$x$),
    jsonb_build_object('type','paragraph','text',$x$Conocer la relación histórica entre Wolverine y Jubilee ayuda a entender por qué funcionan como pareja de aventura, mientras el exilio reciente de Apocalypse explica su punto de partida. Sin embargo, el número uno está diseñado como comienzo de una misión propia. Un lector nuevo puede apoyarse en la recapitulación incluida y buscar contexto adicional sólo si los conceptos de Krakoa o Arakko resultan centrales después del primer capítulo.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía se conecta con /news/comicon-marvel-comics-19-agosto-2026-guia: aquella organiza una tanda completa y ésta profundiza una única puerta de entrada. Marvel respalda fecha, premisa y equipo creativo mediante su lista semanal y su anticipo oficial. XETHKIOZ no reproduce páginas ni diálogos, y evita tratar material promocional como una reseña del cómic terminado.$x$)
  ),
  'comicon', (select author_id from editorial_author), 'published', '2026-08-25T12:05:00Z',
  array['comicon','marvel','x-men','apocalypse','wolverine','jubilee','comics','guia','fuente-oficial'],
  array[
    'https://www.marvel.com/articles/comics/august-26-2026-new-marvel-comics-collections-releases-full-list',
    'https://www.marvel.com/articles/comics/tomb-of-apocalypse-1-preview-sends-wolverine-and-jubilee-relic-hunting-quest'
  ],
  false, 'approved', 'Fuentes primarias: Marvel, lista publicada el 24 de agosto y anticipo oficial del número 1. Se describe la premisa sin convertir el adelanto en reseña ni reproducir páginas.', now(), now()
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
