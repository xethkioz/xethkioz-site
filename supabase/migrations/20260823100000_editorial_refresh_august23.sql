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
  'gaming-xbox-lanzamientos-24-28-agosto-2026-guia',
  'Gaming · Xbox del 24 al 28 de agosto: una semana fuerte para estrategia, cooperativo y Game Pass',
  'Xbox confirmó una agenda extensa con Star Wars Zero Company, Resonance: A Plague Tale Legacy, Once Human y más. Ordenamos la semana por fecha, género y forma de acceso.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una agenda oficial que conviene ordenar antes de comprar$x$),
    jsonb_build_object('type','paragraph','text',$x$Xbox Wire publicó el 21 de agosto de 2026 su lista de lanzamientos para la semana del 24 al 28. Entre los nombres con mayor peso aparecen Star Wars Zero Company, Resonance: A Plague Tale Legacy, Once Human, Aliens: Fireteam Elite 2, Captain Tsubasa 2: World Fighters y Metal Gear Solid: Master Collection Vol. 2. La propia fuente advierte que las fechas pueden cambiar, por lo que la ficha regional de Microsoft Store sigue siendo la referencia final para precio, disponibilidad e idioma.$x$),
    jsonb_build_object('type','heading','text',$x$Qué llega cada día$x$),
    jsonb_build_object('type','list','text',$x$24 de agosto: B.i.t.; 25 de agosto: Blood Dungeon, Once Human, Aliens: Fireteam Elite 2 y Apidya’ Special, entre otros; 26 de agosto: propuestas como Aggelos 2 y Brigandine: Abyss; 27 de agosto: Star Wars Zero Company, Resonance: A Plague Tale Legacy, Captain Tsubasa 2 y Metal Gear Solid: Master Collection Vol. 2; 28 de agosto: la tanda cierra con más indies y lanzamientos de catálogo. La lista completa y cualquier corrección permanecen en Xbox Wire.$x$),
    jsonb_build_object('type','paragraph','text',$x$Para quien ya paga Game Pass, Resonance, Blood Dungeon y Once Human merecen una revisión previa porque la publicación oficial los identifica dentro del servicio. Eso no significa que todos los títulos de la semana estén incluidos ni que permanezcan indefinidamente. Antes de descargar conviene comprobar edición, plataformas compatibles, modalidad online y si Xbox Play Anywhere forma parte de la ficha concreta.$x$),
    jsonb_build_object('type','heading','text',$x$La selección XETHKIOZ por tipo de jugador$x$),
    jsonb_build_object('type','paragraph','text',$x$Star Wars Zero Company apunta a quien busca táctica por turnos y campaña individual; Resonance propone una aventura narrativa previa a A Plague Tale: Requiem; Aliens: Fireteam Elite 2 prioriza coordinación cooperativa; Once Human ofrece supervivencia multijugador; y Metal Gear Solid Vol. 2 reúne sigilo clásico. La recomendación es elegir un juego largo y una opción breve, no llenar el almacenamiento con cinco estrenos simultáneos.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía se conecta con la nota de PlayStation Plus de agosto disponible en /news/gaming-playstation-plus-catalogo-agosto-2026-guia: una cubre lanzamientos y la otra catálogo por suscripción. La fuente oficial respalda fechas, plataformas y servicios anunciados; la clasificación por perfil y la estrategia de descarga son análisis editorial de XETHKIOZ.$x$)
  ),
  'gaming', (select author_id from editorial_author), 'published', '2026-08-23T12:45:00Z',
  array['gaming','xbox','lanzamientos','game-pass','guia','fuente-oficial'],
  array['https://news.xbox.com/en-us/2026/08/21/next-week-on-xbox-new-games-for-august-24-to-28/'],
  false, 'approved', 'Fuente primaria: Xbox Wire, publicada el 21 de agosto de 2026. Fechas sujetas a cambio y disponibilidad regional diferenciada.', now(), now()
),
(
  'ai-openai-zero-data-retention-private-safety-processing',
  'IA · OpenAI amplía Zero Data Retention con procesamiento privado de seguridad',
  'OpenAI presentó un sistema en prueba para detectar patrones de riesgo sin dar acceso humano al contenido retenido. Explicamos el alcance real, las excepciones y qué debería verificar una empresa.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Privacidad y seguridad intentan dejar de ser una elección binaria$x$),
    jsonb_build_object('type','paragraph','text',$x$OpenAI anunció el 19 de agosto de 2026 una vista previa de Private Safety Processing para clientes elegibles de la API con Zero Data Retention. En esos despliegues, las solicitudes y respuestas no se conservan después de procesarse y el contenido empresarial no se usa para entrenamiento salvo aceptación explícita. El nuevo enfoque busca reconocer patrones de riesgo entre interacciones relacionadas sin que el personal de OpenAI reciba acceso al texto subyacente.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo describe OpenAI el procesamiento privado$x$),
    jsonb_build_object('type','paragraph','text',$x$El contenido puede permanecer en infraestructura controlada por el cliente. OpenAI también desarrolla una opción alojada en su infraestructura pero cifrada con claves bajo control del cliente. Los sistemas automatizados generan señales limitadas sobre el tipo de actividad detectada; esas señales pueden apoyar decisiones de cumplimiento, mientras la investigación detallada queda en manos del cliente salvo que decida compartir información.$x$),
    jsonb_build_object('type','list','text',$x$Antes de adoptar: confirmar que la cuenta sea elegible para ZDR; documentar qué endpoints y funciones están cubiertos; revisar dónde viven las claves; registrar qué señales recibe el proveedor; definir un proceso de apelación; comprobar obligaciones regulatorias propias; y medir si integraciones, archivos o herramientas externas conservan datos fuera del alcance de la promesa principal.$x$),
    jsonb_build_object('type','heading','text',$x$Lo que Zero Data Retention no garantiza por sí solo$x$),
    jsonb_build_object('type','paragraph','text',$x$ZDR no vuelve anónimo el sistema completo ni elimina los registros que guarden la aplicación, el proveedor de observabilidad o una herramienta conectada. Tampoco sustituye controles de acceso, minimización de datos, cifrado, rotación de claves y contratos adecuados. OpenAI señala además una excepción legal para imágenes señaladas como posible material de abuso sexual infantil, que pueden retenerse para revisión y reporte.$x$),
    jsonb_build_object('type','paragraph','text',$x$Private Safety Processing sigue en prueba con clientes iniciales y OpenAI prevé comenzar su despliegue junto con un documento técnico en septiembre. Por eso esta publicación no lo presenta como disponibilidad general. Complementa la guía de latencia en /news/ai-openai-ultrafast-gpt-5-6-guia-latencia: rendimiento y privacidad son decisiones separadas que deben evaluarse con métricas y contratos distintos.$x$)
  ),
  'ai', (select author_id from editorial_author), 'published', '2026-08-23T12:40:00Z',
  array['ia','openai','privacidad','zero-data-retention','api','seguridad','fuente-oficial'],
  array['https://openai.com/index/offering-zero-data-retention-for-frontier-models/'],
  false, 'approved', 'Fuente primaria: OpenAI, 19 de agosto de 2026. Se preservan el estado preview, la elegibilidad limitada y la excepción legal indicada por la fuente.', now(), now()
),
(
  'science-nasa-microbios-polo-sur-lunar-contaminacion',
  'Ciencia · Microbios terrestres podrían sobrevivir en sombras del polo sur lunar',
  'Un estudio difundido por NASA modeló nichos donde microorganismos transportados por humanos podrían persistir. El resultado importa para Artemis y para distinguir hallazgos naturales de contaminación.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Explorar la Luna también significa llevar microorganismos$x$),
    jsonb_build_object('type','paragraph','text',$x$NASA informó el 19 de agosto de 2026 que algunos microbios asociados a seres humanos podrían sobrevivir en zonas sombreadas del polo sur lunar. El trabajo, publicado en Science Advances, combina límites conocidos de calor y radiación ultravioleta con mapas ambientales obtenidos a partir de Lunar Reconnaissance Orbiter. No encontró vida lunar: analizó qué organismos terrestres podrían persistir después de llegar con astronautas o equipos.$x$),
    jsonb_build_object('type','heading','text',$x$Qué significa sobrevivir en este estudio$x$),
    jsonb_build_object('type','paragraph','text',$x$Supervivencia significa permanecer viable al menos durante un día terrestre, no crecer ni formar una colonia. Las simulaciones estudiaron Nobile Rim, Connecting Ridge y De Gerlache Rim. Las irregularidades del terreno pueden crear sombras frías que reducen la exposición a radiación. Aspergillus niger apareció como uno de los organismos más resistentes, incluso en ciertos sectores con algo de luz.$x$),
    jsonb_build_object('type','list','text',$x$El estudio no demuestra ecosistemas en la Luna; no afirma que los microbios puedan reproducirse allí; usa modelos y evidencia previa, no una colonia observada sobre el terreno; identifica contaminación humana como variable científica; y propone medir una línea de base antes de que las visitas modifiquen la química que futuras misiones intentarán interpretar.$x$),
    jsonb_build_object('type','heading','text',$x$Por qué importa para Artemis y para Marte$x$),
    jsonb_build_object('type','paragraph','text',$x$Si una misión encuentra moléculas orgánicas o señales compatibles con procesos biológicos, primero deberá descartar que hayan viajado desde la Tierra. Esa distinción será aún más importante cuando se busquen indicios de vida en Marte. La presencia humana hace imposible una esterilidad absoluta, pero protocolos, muestreo previo y trazabilidad pueden reducir la confusión.$x$),
    jsonb_build_object('type','paragraph','text',$x$La fuente de NASA respalda la fecha, los organismos evaluados, las regiones simuladas y los límites del resultado. XETHKIOZ evita convertir “pueden sobrevivir” en “hay vida en la Luna”. Esta nota complementa /news/science-eclipse-total-2026-nasa-que-aprendimos, donde también se explica cómo separar una observación real de una conclusión que la evidencia todavía no permite.$x$)
  ),
  'science', (select author_id from editorial_author), 'published', '2026-08-23T12:35:00Z',
  array['ciencia','nasa','luna','artemis','microbios','contaminacion-planetaria','fuente-oficial'],
  array['https://science.nasa.gov/humans-in-space/human-related-microbes-may-survive-moons-south-pole-nasa-finds/'],
  false, 'approved', 'Fuente primaria: NASA Science y estudio enlazado en Science Advances, 19 de agosto de 2026. Se diferencia supervivencia simulada de crecimiento o vida lunar.', now(), now()
),
(
  'comicon-marvel-comics-19-agosto-2026-guia',
  'COMICON · Marvel del 19 de agosto: cómo entrar a Spider-Man, Hulk y Armageddon sin perderse',
  'Marvel publicó su tanda semanal con conflictos internos de Spider-Man y Hulk, el avance de Armageddon y la huida de Dylan Brock frente a Hela y Knull. La convertimos en una ruta de lectura clara.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una lista semanal necesita contexto, no sólo portadas$x$),
    jsonb_build_object('type','paragraph','text',$x$Marvel reunió el 17 de agosto de 2026 los cómics disponibles el miércoles 19. La presentación oficial destaca tres líneas: conflictos personales para Spider-Man y Hulk, la reunión de los Avengers dentro de Armageddon y la situación de Dylan Brock frente a Hela y Knull. La fuente confirma la selección semanal; no convierte todas esas historias en un único evento ni obliga a leerlas juntas.$x$),
    jsonb_build_object('type','heading','text',$x$Tres puertas de entrada según lo que buscás$x$),
    jsonb_build_object('type','list','text',$x$Elegí Spider-Man o Hulk si preferís una serie centrada en el conflicto del personaje; seguí Avengers y Armageddon si ya venís leyendo el gran evento y querés continuidad; buscá la trama de Dylan Brock, Hela y Knull si te interesa el costado cósmico y simbionte. Antes de comprar, revisá número, serie, autores y la sección “previously” de la edición.$x$),
    jsonb_build_object('type','paragraph','text',$x$Una tanda de novedades no es una guía cronológica completa. Los resúmenes comerciales adelantan el punto de partida, pero pueden omitir conexiones importantes o exagerar el alcance para despertar interés. Para evitar spoilers y compras duplicadas, conviene comparar la ficha digital con la edición física disponible en la tienda local y confirmar si se trata de número regular, especial, recopilatorio o variante de portada.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo seguir Armageddon sin confundir anuncios$x$),
    jsonb_build_object('type','paragraph','text',$x$XETHKIOZ ya documentó la nueva etapa posterior al evento en /news/comicon-avengers-1-zdarsky-checchetto-noviembre-2026. La publicación de esta semana pertenece al presente de la historia, mientras aquel anuncio mira hacia la serie que comenzará después. Mantener ambas fechas separadas evita leer una promesa editorial futura como si fuera un capítulo ya disponible.$x$),
    jsonb_build_object('type','paragraph','text',$x$Marvel es la fuente primaria para la fecha y los ejes promocionados. Esta nota no reproduce páginas ni diálogos y no agrega giros argumentales que la compañía no haya hecho públicos. La ruta por perfiles, el control de formatos y la interconexión con la guía anterior son elaboración editorial de XETHKIOZ.$x$)
  ),
  'comicon', (select author_id from editorial_author), 'published', '2026-08-23T12:30:00Z',
  array['comicon','marvel','comics','spider-man','hulk','avengers','armageddon','fuente-oficial'],
  array['https://www.marvel.com/articles/comics/august-19-2026-new-marvel-comics-collections-releases-full-list'],
  false, 'approved', 'Fuente primaria: Marvel, publicada el 17 de agosto para lanzamientos del 19. El artículo separa lista semanal, continuidad y anuncios futuros.', now(), now()
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
