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
  'gaming-gamescom-2026-playstation-19-anuncios-guia',
  'Gaming · Gamescom 2026 en PlayStation: 19 anuncios ordenados por fecha y nivel de certeza',
  'PlayStation reunió 19 juegos de Opening Night Live. Ordenamos los lanzamientos confirmados, las ventanas amplias y los proyectos todavía sin fecha para evitar que un tráiler se confunda con disponibilidad inmediata.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Diecinueve anuncios, pero no diecinueve estrenos inmediatos$x$),
    jsonb_build_object('type','paragraph','text',$x$Sony Interactive Entertainment publicó el 25 de agosto de 2026 su resumen oficial de Gamescom Opening Night Live con 19 juegos anunciados para PlayStation 5. La lista combina productos que llegan en pocas semanas, títulos fechados para 2027 y proyectos sin día confirmado. Por eso la información más útil no es contar tráilers, sino separar lo que puede planificarse de lo que todavía depende de anuncios posteriores.$x$),
    jsonb_build_object('type','heading','text',$x$Las fechas que sí permiten organizar una compra$x$),
    jsonb_build_object('type','list','text',$x$Aniimo está previsto para el 16 de septiembre; Control Resonant y Silent Hill: Townfall para el 24 de septiembre; Valor Mortis para el 13 de octubre; Path of Exile 2 versión 1.0 para el 11 de diciembre; Ananta para el 15 de enero de 2027; Metro 2039 para febrero; Final Fantasy VII Revelation para la primavera boreal; y Exodus para el 7 de abril de 2027. Resonance: A Plague Tale Legacy figura para el 27 de agosto.$x$),
    jsonb_build_object('type','paragraph','text',$x$Otros anuncios necesitan más cautela. Acornia: Mirror Worlds, Ontos, Rainbow Six Tactics, Turok: Origins y Warlock: Dungeons & Dragons sólo apuntan a ventanas amplias de 2027. Exterminauts, LEGO Skylines y Tides of Annihilation continúan sin fecha. Crimson Desert recibió una actualización mejorada ya disponible, pero eso no lo convierte en un lanzamiento nuevo. Son diferencias pequeñas en una presentación y decisivas al armar expectativas.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo usar el resumen sin comprar por impulso$x$),
    jsonb_build_object('type','paragraph','text',$x$Antes de reservar conviene esperar la ficha regional, confirmar precio, idioma, edición, requisitos de conexión y alcance real de cualquier mejora gratuita. Una ventana de lanzamiento tampoco garantiza que el calendario no cambie. Los tráilers muestran una selección controlada por cada editor y no sustituyen análisis de rendimiento, accesibilidad o versión final. XETHKIOZ recomienda guardar sólo los títulos realmente relevantes y revisar sus páginas oficiales cerca del estreno.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía complementa /news/gaming-xbox-lanzamientos-24-28-agosto-2026-guia: aquella ordena una semana concreta y ésta clasifica anuncios a más largo plazo. PlayStation Blog respalda la lista, las plataformas y las fechas comunicadas el 25 de agosto. La jerarquía por certeza y las recomendaciones de compra son elaboración editorial de XETHKIOZ, no garantías de Sony ni de los estudios.$x$)
  ),
  'gaming', (select author_id from editorial_author), 'published', '2026-08-26T13:20:00Z',
  array['gaming','playstation-5','gamescom-2026','lanzamientos','calendario','guia','fuente-oficial'],
  array['https://blog.playstation.com/2026/08/25/gamescom-opening-night-live-highlights-19-games-coming-to-playstation/'],
  false, 'approved', 'Fuente primaria: PlayStation Blog, 25 de agosto de 2026. Se distinguen fechas confirmadas, ventanas amplias y proyectos sin fecha.', now(), now()
),
(
  'ai-openai-jalapeno-chip-inferencia-rendimiento-eficiencia',
  'IA y tecnología · Jalapeño: qué midió OpenAI en su primer chip de inferencia',
  'OpenAI publicó resultados de rendimiento y eficiencia para su primer acelerador propio. Explicamos las métricas, los modelos probados y por qué una comparación del fabricante necesita contexto antes de generalizarse.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Silicio propio orientado a servir modelos$x$),
    jsonb_build_object('type','paragraph','text',$x$OpenAI presentó el 25 de agosto de 2026 los primeros resultados de Jalapeño, su chip personalizado para inferencia. La empresa afirma que el sistema fue diseñado junto con memoria, red y software para atender modelos de lenguaje y agentes interactivos. El objetivo es aumentar el trabajo útil por unidad de energía sin aceptar como costo una latencia mayor, una tensión habitual entre procesamiento por lotes y respuestas rápidas.$x$),
    jsonb_build_object('type','heading','text',$x$Qué cifras publicó la compañía$x$),
    jsonb_build_object('type','paragraph','text',$x$En GPT‑OSS 120B, DeepSeek R1 670B y Kimi K2.5 1T, OpenAI informa entre 1,5 y 1,9 veces más trabajo de IA por watt a máximo rendimiento y entre 1,7 y 3,6 veces menos latencia de extremo a extremo frente a los sistemas comparados. Para cargas altamente interactivas declara entre 2,1 y 4,1 veces más rendimiento. Jalapeño tiene una potencia nominal de 700 watts, aunque la medición sostenida no superó 550 watts en esas pruebas.$x$),
    jsonb_build_object('type','list','text',$x$El método usa InferenceX de SemiAnalysis y compara la experiencia con objetivos equivalentes de latencia. También normaliza por la potencia publicada de cada acelerador. Los resultados corresponden a configuraciones, modelos y puntos operativos concretos; no prueban por sí solos menor costo total, mejor calidad del modelo ni idéntica ventaja en cualquier aplicación. Las comparaciones internas sobre modelos de frontera no son una evaluación independiente.$x$),
    jsonb_build_object('type','heading','text',$x$La arquitectura y el papel de la propia IA$x$),
    jsonb_build_object('type','paragraph','text',$x$El diseño intenta reducir movimientos de datos entre cómputo, memoria y red, manteniendo local el estado usado durante la generación. OpenAI también dice haber empleado modelos para diseñar circuitos, verificar implementaciones y programar kernels. La compañía pasó del diseño inicial al tapeout en nueve meses. En bloques seleccionados de atención y mezcla de expertos, implementaciones generadas con IA fueron entre 1,5 y 1,8 veces más rápidas que versiones humanas existentes; esa cifra no describe al modelo completo.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta nota se conecta con /news/ai-openai-gpt-5-6-kiro-desarrollo-especificaciones: Kiro trata el flujo de desarrollo y Jalapeño la infraestructura que ejecuta inferencia. OpenAI es la fuente primaria para arquitectura y resultados. XETHKIOZ conserva los rangos, identifica el origen de las mediciones y evita convertir una prueba del fabricante en una conclusión universal sobre costos, energía o disponibilidad comercial.$x$)
  ),
  'ai', (select author_id from editorial_author), 'published', '2026-08-26T13:15:00Z',
  array['ia','openai','jalapeno','chips','inferencia','eficiencia','latencia','benchmark','fuente-oficial'],
  array['https://openai.com/index/jalapeno-first-results/'],
  false, 'approved', 'Fuente primaria: OpenAI, 25 de agosto de 2026. Las cifras se atribuyen al fabricante y se limitan a los modelos, bloques y condiciones informados.', now(), now()
),
(
  'science-nasa-pandora-exoplanetas-estrellas-inicio-mision',
  'Ciencia · Pandora inicia su misión: cómo separará la atmósfera de un exoplaneta de la señal de su estrella',
  'La misión pequeña de NASA comenzó a observar al menos 20 exoplanetas y sus estrellas. Su objetivo es distinguir agua, nubes y brumas planetarias de las variaciones producidas por manchas y regiones brillantes estelares.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una misión pequeña para un problema grande$x$),
    jsonb_build_object('type','paragraph','text',$x$NASA confirmó el 25 de agosto de 2026 que Pandora comenzó su fase científica después del proceso de puesta en servicio. Es el primer satélite lanzado mediante el programa Astrophysics Pioneers y opera en órbita terrestre baja desde el 11 de enero. Durante su misión primaria de un año observará al menos 20 exoplanetas y las estrellas que orbitan para estudiar la composición atmosférica, incluidas señales relacionadas con agua, nubes y brumas.$x$),
    jsonb_build_object('type','heading','text',$x$Por qué una estrella puede confundir la medición$x$),
    jsonb_build_object('type','paragraph','text',$x$Cuando un planeta transita frente a su estrella, una parte de la luz atraviesa su atmósfera y adquiere huellas químicas. Sin embargo, los telescopios también reciben luz del resto de la superficie estelar. Manchas más frías y regiones brillantes pueden cambiar con la rotación y producir variaciones que se parecen a una señal planetaria o la deforman. Pandora observará simultáneamente en luz visible e infrarroja cercana para separar ambos aportes.$x$),
    jsonb_build_object('type','list','text',$x$El plan prevé diez observaciones por objetivo; cada una durará 24 horas e incluirá un tránsito. El telescopio de aluminio mide unos 45 centímetros. Su detector infrarrojo cercano fue desarrollado originalmente como repuesto para James Webb. La nave estudiará durante más tiempo objetivos que un observatorio muy demandado como Webb no puede seguir de manera regular, y luego permitirá combinar ambos conjuntos de datos.$x$),
    jsonb_build_object('type','heading','text',$x$Qué puede demostrar y qué todavía no$x$),
    jsonb_build_object('type','paragraph','text',$x$Pandora no fue presentada como un detector directo de vida. Su trabajo es mejorar la interpretación de atmósferas y superficies estelares, reduciendo una fuente importante de ambigüedad. Encontrar vapor de agua tampoco demostraría habitabilidad por sí solo: harían falta contexto sobre temperatura, presión, composición, radiación y otros factores. La misión crea una base metodológica para Webb y futuros observatorios enfocados en mundos potencialmente habitables.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta explicación complementa /news/science-nasa-microbios-polo-sur-lunar-contaminacion al mostrar otra forma de separar medición e interpretación. NASA respalda estado, instrumentos, objetivos y calendario. Los datos científicos de Pandora estarán disponibles en NASA Exoplanet Archive. XETHKIOZ evita llamar Tierra 2 a cualquier objetivo y reserva la palabra descubrimiento para resultados revisados, no para el inicio operativo de la misión.$x$)
  ),
  'science', (select author_id from editorial_author), 'published', '2026-08-26T13:10:00Z',
  array['ciencia','nasa','pandora','exoplanetas','atmosferas','estrellas','james-webb','fuente-oficial'],
  array['https://science.nasa.gov/missions/pandora-missions/nasas-pandora-mission-begins-study-of-exoplanets-host-stars/'],
  false, 'approved', 'Fuente primaria: NASA Science, 25 de agosto de 2026. Se diferencia la caracterización atmosférica de una detección de vida o habitabilidad.', now(), now()
),
(
  'comicon-dc-black-tower-raven-conspiracy-guia',
  'COMICON · Black Tower: The Raven Conspiracy mezcla espionaje y magia bajo el sello Vertigo',
  'Ram V explica la inspiración del nuevo cómic junto a Mike Perkins y Mike Spicer. Ordenamos la propuesta, el equipo creativo y lo que conviene saber antes de entrar, sin convertir el texto promocional en reseña.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una puerta de entrada basada en la tensión humana$x$),
    jsonb_build_object('type','paragraph','text',$x$DC publicó el 25 de agosto de 2026 un texto de Ram V sobre Black Tower: The Raven Conspiracy #1, disponible esa semana en formato impreso y digital. El guionista presenta el proyecto como una unión de espionaje y magia, dos campos construidos alrededor de información oculta, identidades inestables y decisiones tomadas bajo presión. La obra aparece dentro del espacio editorial Vertigo y prioriza personajes falibles antes que una fantasía de agentes invulnerables.$x$),
    jsonb_build_object('type','heading','text',$x$De dónde viene la mezcla$x$),
    jsonb_build_object('type','paragraph','text',$x$Ram V relaciona su interés temprano por novelas de espías con una visión menos glamorosa del género: personas que fingen seguridad mientras sienten miedo, obedecen ideales dudosos y participan en maniobras que pueden derrumbarse por motivos íntimos. Para la dimensión mágica menciona figuras históricas y relatos donde conocimiento oculto y poder político se acercan. Esas referencias explican el tono buscado, pero no deben leerse como afirmaciones históricas verificadas por el cómic.$x$),
    jsonb_build_object('type','list','text',$x$El número uno reúne a Ram V en guion, Mike Perkins en arte, Mike Spicer en color y Andworld Design. Antes de comprar conviene confirmar edición e idioma, formato digital o impreso, precio regional y disponibilidad del sello. También ayuda entrar esperando intriga, doble juego y ocultismo, no una historia de superhéroes convencional ni una reconstrucción documental de hechos reales.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo leer una presentación de autor$x$),
    jsonb_build_object('type','paragraph','text',$x$El artículo oficial sirve como declaración de intención: explica influencias y promete personajes que engañan, traicionan y usan magia mientras intentan evitar una crisis. No evalúa ritmo, claridad, dibujo o cierre porque está escrito por el propio creador para acompañar el estreno. Una reseña responsable requerirá leer el número completo y separar la ejecución final de lo que el equipo quiso conseguir.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía complementa /news/comicon-dc-boy-of-steel-guia-superboy: Boy of Steel ofrece una entrada juvenil a Superman, mientras Black Tower propone espionaje ocultista para lectores adultos. DC y Ram V respaldan disponibilidad, equipo e intención creativa. XETHKIOZ no reproduce páginas ni presenta la promoción como crítica independiente; organiza la información para decidir si el tono y el género justifican probar el primer número.$x$)
  ),
  'comicon', (select author_id from editorial_author), 'published', '2026-08-26T13:05:00Z',
  array['comicon','dc','vertigo','black-tower','ram-v','espionaje','magia','comics','fuente-oficial'],
  array['https://www.dc.com/blog/2026-08-25/of-spies-and-sorcerers'],
  false, 'approved', 'Fuente primaria: DC y Ram V, 25 de agosto de 2026. La declaración del autor se presenta como intención creativa y no como reseña independiente.', now(), now()
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
