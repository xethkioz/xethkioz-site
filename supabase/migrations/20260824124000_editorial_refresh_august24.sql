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
  'gaming-modern-warfare-4-beta-abierta-ps5-guia',
  'Gaming · Modern Warfare 4 abre su beta en PS5: horarios, mapas y qué conviene probar',
  'La segunda prueba será abierta para todos del 28 de agosto al 1 de septiembre. Reunimos horarios para Argentina, contenido disponible y una ruta útil para evaluar el juego sin confundir beta con versión final.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una beta abierta con mucho más que partidas rápidas$x$),
    jsonb_build_object('type','paragraph','text',$x$PlayStation Blog detalló el 21 de agosto de 2026 la prueba de Call of Duty: Modern Warfare 4 en PS5. El primer fin de semana requiere reserva o código y termina el 25 de agosto a las 10:00 PT. El segundo será abierto para todos desde el 28 de agosto a las 10:00 PT hasta el 1 de septiembre a la misma hora. En Argentina, durante este período, eso equivale a las 14:00. La descarga se busca como “Call of Duty: Modern Warfare 4 Beta” en PlayStation Store.$x$),
    jsonb_build_object('type','heading','text',$x$Qué incluye la prueba$x$),
    jsonb_build_object('type','list','text',$x$Seis mapas principales 6 contra 6: Rooftops, Silkworm, Transit 213, Cachette, Lotus y Lithium; modos clásicos junto con Inflation e Hijack; Kill Block con más de 500 combinaciones posibles; Ground War de 24 contra 24; 22 armas, Gunsmith y modificaciones Apex; un curso de movilidad; y Entrenched, la primera misión de campaña ofrecida dentro de una beta de Call of Duty.$x$),
    jsonb_build_object('type','paragraph','text',$x$La prioridad debería ser probar lo que cambia decisiones de compra. Primero, revisá respuesta de movimiento y visibilidad en dos mapas diferentes. Después compará un arma sin modificar con su configuración en Gunsmith. Recién entonces pasá a Kill Block o Ground War, donde la cantidad de jugadores y variaciones puede ocultar problemas básicos. Si el objetivo es medir conexión, anotá región, horario y tipo de partida: una sola sesión no representa toda la infraestructura.$x$),
    jsonb_build_object('type','heading','text',$x$Progreso, recompensas y Warzone$x$),
    jsonb_build_object('type','paragraph','text',$x$El progreso del primer fin de semana continúa en el segundo. Hay ocho recompensas hasta el nivel 30 que se trasladarán al lanzamiento, entre ellas un aspecto de operador y un plano de arma. El 28 de agosto también se suma Warzone Resurgence en Zodiac. Esos incentivos no significan que el progreso general, equilibrio de armas o rendimiento de la beta vayan a conservarse sin cambios cuando el juego llegue el 23 de octubre.$x$),
    jsonb_build_object('type','paragraph','text',$x$La fuente oficial respalda fechas, plataformas y contenido anunciado; el horario argentino es una conversión de la franja PT vigente. Esta guía complementa /news/gaming-xbox-lanzamientos-24-28-agosto-2026-guia: una organiza estrenos semanales y la otra ayuda a evaluar una prueba concreta. XETHKIOZ recomienda confirmar el horario en la ficha regional antes de descargar, porque el editor puede ajustar una beta.$x$)
  ),
  'gaming', (select author_id from editorial_author), 'published', '2026-08-24T12:40:00Z',
  array['gaming','playstation-5','call-of-duty','modern-warfare-4','beta-abierta','guia','fuente-oficial'],
  array['https://blog.playstation.com/2026/08/21/call-of-duty-modern-warfare-4-new-multiplayer-and-early-access-beta-details/'],
  false, 'approved', 'Fuente primaria: PlayStation Blog, 21 de agosto de 2026. Horario PT convertido a Argentina para las fechas anunciadas; disponibilidad y cambios sujetos al editor.', now(), now()
),
(
  'ai-github-copilot-slack-preview-guia-seguridad',
  'IA y tecnología · GitHub Copilot llega a Slack: qué puede hacer y qué debe controlar un equipo',
  'La integración permite investigar problemas, preparar cambios y abrir pull requests desde una conversación. Explicamos su alcance, disponibilidad y los controles mínimos antes de habilitarla.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Del mensaje del equipo a una tarea de desarrollo$x$),
    jsonb_build_object('type','paragraph','text',$x$GitHub anunció el 21 de agosto de 2026 una nueva experiencia de Copilot dentro de Slack, disponible como vista previa pública para organizaciones con Copilot Business o Enterprise. Al mencionar @GitHub en un mensaje directo, canal o hilo se puede iniciar una sesión agente que usa la conversación y el contexto de GitHub permitido. La propuesta no es un chatbot aislado: busca convertir una decisión compartida en investigación, cambios validados y una pull request.$x$),
    jsonb_build_object('type','heading','text',$x$Qué acciones describe GitHub$x$),
    jsonb_build_object('type','list','text',$x$Responder preguntas sobre código y actividad; clasificar reportes de errores; crear o actualizar issues; investigar fallas; implementar y validar cambios en un entorno seguro; abrir una pull request; continuar una sesión de forma asíncrona; y mostrar avances en canales dedicados de Slack Code. Cualquier capacidad efectiva sigue limitada por las conexiones, políticas y permisos habilitados.$x$),
    jsonb_build_object('type','paragraph','text',$x$La colaboración visible tiene una ventaja: más personas pueden aportar contexto o detener una dirección incorrecta antes de que llegue al repositorio. También aumenta el riesgo de que una conversación informal arrastre datos innecesarios. Un equipo debería definir en qué canales se permite invocar al agente, qué repositorios pueden asociarse y qué información nunca debe copiarse a un hilo, especialmente secretos, datos personales y detalles de incidentes todavía no publicados.$x$),
    jsonb_build_object('type','heading','text',$x$Lista mínima antes de habilitar la integración$x$),
    jsonb_build_object('type','paragraph','text',$x$El administrador debe habilitar la política del agente en la nube, instalar o actualizar la aplicación oficial para Slack y vincular las cuentas. Además conviene exigir revisión humana, proteger ramas, limitar presupuestos, revisar permisos de la aplicación y conservar trazabilidad entre conversación, issue, commits y pull request. GitHub permite requerir una aprobación adicional para cambios atribuidos a Copilot, una barrera especialmente útil en repositorios de producción.$x$),
    jsonb_build_object('type','paragraph','text',$x$La vista previa consume los derechos de Copilot existentes y puede usar presupuesto del agente en la nube; no debe presentarse como una función incluida sin límites. Esta nota complementa /news/ai-openai-zero-data-retention-private-safety-processing: allí el foco es privacidad de datos de API, mientras aquí importa el gobierno de permisos y revisiones dentro del flujo de desarrollo. La fuente oficial respalda capacidades, disponibilidad y pasos de inicio; las recomendaciones de control son análisis de XETHKIOZ.$x$)
  ),
  'ai', (select author_id from editorial_author), 'published', '2026-08-24T12:35:00Z',
  array['ia','github','copilot','slack','agentes','desarrollo','seguridad','fuente-oficial'],
  array['https://github.blog/changelog/2026-08-21-the-new-github-copilot-experience-in-slack/'],
  false, 'approved', 'Fuente primaria: GitHub Changelog, 21 de agosto de 2026. Se conserva el estado public preview y la disponibilidad limitada a Copilot Business y Enterprise.', now(), now()
),
(
  'science-nasa-lago-bonneville-huellas-orbita-venus',
  'Ciencia · Lo que el lago Bonneville dejó atrás y por qué NASA lo usa para preparar Venus',
  'Una imagen de Landsat 8 conecta las costas de un lago desaparecido, los salares de Utah y una prueba de instrumentos para DAVINCI. La lectura orbital permite reconstruir pasado y ensayar una misión futura.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Un paisaje actual conserva la escala de un lago antiguo$x$),
    jsonb_build_object('type','paragraph','text',$x$NASA Earth Observatory publicó el 24 de agosto de 2026 una imagen adquirida por Landsat 8 el 4 de junio. La escena muestra las montañas Silver Island, Crater Island y superficies salinas del oeste de Utah, dentro de la antigua cuenca del lago Bonneville. El lago comenzó a formarse hace unos 55.000 años y alcanzó una extensión mucho mayor que la del actual Gran Lago Salado.$x$),
    jsonb_build_object('type','heading','text',$x$La inundación que redibujó la cuenca$x$),
    jsonb_build_object('type','paragraph','text',$x$Hace aproximadamente 18.000 años, el agua superó y erosionó una barrera natural. NASA resume que el nivel descendió más de 350 pies, unos 105 metros, en alrededor de seis semanas. Tras nuevas variaciones climáticas quedaron remanentes como Great Salt Lake, Utah Lake y Sevier Lake. Las líneas de costa, terrazas y depósitos minerales todavía permiten leer diferentes niveles del agua desde el terreno y desde órbita.$x$),
    jsonb_build_object('type','list','text',$x$En la imagen conviene distinguir tres evidencias: relieves que emergían como islas; líneas claras que marcan costas anteriores; y llanuras salinas formadas por evaporación y concentración de minerales. Landsat no “ve” directamente toda la historia. Combinar geometría, color, mediciones de campo y datación permite convertir el patrón observado en una reconstrucción geológica.$x$),
    jsonb_build_object('type','heading','text',$x$Un análogo terrestre para una bajada a Venus$x$),
    jsonb_build_object('type','paragraph','text',$x$El equipo de DAVINCI utilizó Crater Island como un “Venus en la Tierra”. Desde un helicóptero probó una cámara y un paquete instrumental para reconstruir el relieve mientras descendía. Las imágenes permitieron generar mapas tridimensionales coherentes con la geología conocida. La misión real deberá obtener imágenes en infrarrojo cercano y medir química atmosférica durante un descenso de aproximadamente una hora bajo condiciones mucho más extremas.$x$),
    jsonb_build_object('type','paragraph','text',$x$La comparación no afirma que Utah sea idéntico a Venus: ofrece un terreno conocido para comprobar instrumentos, secuencia de captura y reconstrucción antes del vuelo. Esta nota complementa /news/science-nasa-microbios-polo-sur-lunar-contaminacion porque ambas muestran cómo una misión se prepara separando observación, modelo e interpretación. NASA respalda las edades, medidas, imagen y ensayo de DAVINCI; las conexiones didácticas son elaboración editorial de XETHKIOZ.$x$)
  ),
  'science', (select author_id from editorial_author), 'published', '2026-08-24T12:30:00Z',
  array['ciencia','nasa','landsat-8','lago-bonneville','geologia','davinci','venus','fuente-oficial'],
  array['https://science.nasa.gov/earth/earth-observatory/what-lake-bonneville-left-behind/'],
  false, 'approved', 'Fuente primaria: NASA Earth Observatory, 24 de agosto de 2026; imagen Landsat 8 del 4 de junio de 2026. Se diferencia análogo terrestre de equivalencia planetaria.', now(), now()
),
(
  'comicon-dc-boy-of-steel-guia-superboy',
  'COMICON · Boy of Steel: una puerta de entrada al Superman adolescente sin continuidad pesada',
  'DC reunió en tapa blanda Action Comics #1087–1092, una etapa narrada por el Clark adulto sobre sus primeros años en Smallville. Esta guía explica la premisa, el equipo creativo y para quién funciona.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Antes de Metrópolis, Clark todavía estaba aprendiendo$x$),
    jsonb_build_object('type','paragraph','text',$x$DC publicó el 21 de agosto de 2026 una recomendación oficial de Action Comics Vol. 1: Boy of Steel, recopilación en tapa blanda de los números 1087 a 1092. La historia sigue a Clark con quince años durante sus primeras aventuras como Superboy en Smallville, narradas por su versión adulta. Ese marco permite leer errores y decisiones juveniles sin perder de vista al Superman en el que se convertirá.$x$),
    jsonb_build_object('type','heading','text',$x$Qué conflicto propone la etapa$x$),
    jsonb_build_object('type','paragraph','text',$x$El joven Clark intenta entender los límites de sus poderes, cuándo es ético usarlos y cómo responder si el gobierno solicita su cooperación. También enfrenta un mentor de intenciones dudosas, una primera experiencia en una zona de guerra y el costo de sostener una identidad doble. La colección no depende de conocer cada evento actual de DC: está ambientada en el pasado y funciona como relato de formación.$x$),
    jsonb_build_object('type','list','text',$x$Guion principal de Mark Waid; dibujo de Skylar Patridge, con aportes de Cian Tormey y Patricio Angel; referencias a figuras como Lana Lang, Sam Lane, Dr. Will Magnus, Lois Lane, Pete Ross y Captain Comet; tono de crecimiento personal; y disponibilidad en librerías, comiquerías, bibliotecas, tiendas digitales y DC Universe Infinite según la región.$x$),
    jsonb_build_object('type','heading','text',$x$Para quién es una buena entrada$x$),
    jsonb_build_object('type','paragraph','text',$x$Boy of Steel puede servir a lectores que conocen a Superman por cine o televisión y quieren una historia autocontenida, o a quienes prefieren dilemas de identidad antes que un gran crossover. El traje de aspecto casero y la mirada vulnerable de Clark sostienen una escala humana incluso cuando aparecen elementos de ciencia ficción. Quien busque el presente editorial completo de Superman deberá continuar con otras etapas; esta recopilación cubre un arco específico.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía complementa /news/comicon-marvel-comics-19-agosto-2026-guia al ofrecer una lectura reunida y no una lista semanal de lanzamientos. DC es la fuente primaria para números incluidos, premisa, autores y formatos anunciados. XETHKIOZ no reproduce páginas ni diálogos y separa la descripción oficial de su recomendación por perfil, para que el lector pueda decidir antes de comprar o iniciar una suscripción.$x$)
  ),
  'comicon', (select author_id from editorial_author), 'published', '2026-08-24T12:25:00Z',
  array['comicon','dc','superman','superboy','action-comics','boy-of-steel','guia','fuente-oficial'],
  array['https://www.dc.com/blog/2026-08-21/boy-of-steel-is-a-modern-take-on-clark-s-superboy-era'],
  false, 'approved', 'Fuente primaria: DC, 21 de agosto de 2026. Se respetan números, equipo creativo, premisa y disponibilidad regional indicada por la editorial.', now(), now()
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
