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
  'gaming-state-of-play-septiembre-2026-anuncios-fechas-guia',
  'Gaming · State of Play de septiembre: más de 30 anuncios ordenados por fecha y certeza',
  'PlayStation reunió dos presentaciones con estrenos inmediatos, demos y lanzamientos hasta 2028. Separamos qué ya puede jugarse, qué tiene fecha y qué sigue siendo una promesa.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Dos transmisiones y más de treinta juegos$x$),
    jsonb_build_object('type','paragraph','text',$x$PlayStation publicó el 3 de septiembre de 2026 su resumen conjunto de State of Play y State of Play Japan. Hubo más de treinta juegos entre anuncios, avances, expansiones y fechas. La cantidad impresiona, pero no todo está igual de cerca: algunas propuestas ya tienen demo o contenido disponible, otras fijaron día de lanzamiento y varias sólo confirmaron un año. Ordenarlas por nivel de certeza evita convertir cada tráiler en una reserva automática.$x$),
    jsonb_build_object('type','heading','text',$x$Lo inmediato y lo fechado para 2026$x$),
    jsonb_build_object('type','paragraph','text',$x$Keeper se lanzó durante la presentación; Final Fantasy Resonance habilitó su primer capítulo como demo con progreso transferible y anunció el juego para el 22 de octubre. Ghost of Yōtei recibirá el 1 de octubre el modo Most Wanted y Echoes of Sekigahara dentro de Complete Edition. Gran Turismo 7 dividirá Spec IV entre octubre y diciembre, con dos circuitos, doce autos y nuevos modos. Where the Seeds Fall llegará el 5 de noviembre y los controles de GTA VI se venderán desde el 19 de noviembre, con reservas desde el 10 de septiembre.$x$),
    jsonb_build_object('type','list','text',$x$Fechas principales: Rematch x Blue Lock, 24 de septiembre; Crimson Desert: Charting the Unknown, 15 de octubre; Stupid Never Dies, 21 de octubre; Dragon Quest Monsters: The Withered World, 3 de diciembre; Fate/Extra Record y Until Dawn 2, 28 de enero de 2027; Metro 2039, 4 de febrero de 2027; Gundam Rogue Orbit, 5 de marzo de 2027; Final Fantasy VII Revelation, 8 de abril de 2027.$x$),
    jsonb_build_object('type','heading','text',$x$Qué conviene hacer antes de comprar$x$),
    jsonb_build_object('type','paragraph','text',$x$Primero probá las demos disponibles y comprobá si el progreso se conserva. Para expansiones como Monster Hunter Wilds: Ascendance, anunciada para 2027, esperá precio, contenido final y requisitos de la edición base. En juegos fechados para el próximo año, una presentación confirma la intención actual del editor, no garantiza ausencia de demoras. También conviene revisar la tienda argentina: disponibilidad, moneda, impuestos y ediciones pueden diferir de los anuncios globales.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía complementa /news/gaming-playstation-plus-septiembre-2026-juegos-fechas-guia, centrada en el catálogo mensual. PlayStation Blog es la fuente primaria del resumen y enlaza los artículos de cada estudio. XETHKIOZ separa contenido ya disponible, fechas concretas y ventanas amplias para que el lector pueda decidir qué probar ahora, qué seguir y qué todavía no justifica una compra anticipada.$x$)
  ),
  'gaming', (select author_id from editorial_author), 'published', '2026-09-03T20:30:00Z',
  array['gaming','playstation','state-of-play','ps5','lanzamientos','demos','septiembre-2026','fuente-oficial'],
  array['https://blog.playstation.com/2026/09/03/state-of-play-state-of-play-japan-all-announcements-trailers/'],
  false, 'approved', 'Fuente primaria: PlayStation Blog, 3 de septiembre de 2026. Las novedades se separan por disponibilidad, fecha concreta y ventana provisional.', now(), now()
),
(
  'ai-github-copilot-aprobar-pull-requests-configuracion-limites',
  'IA y tecnología · Copilot puede aprobar pull requests: cómo funciona y qué no reemplaza',
  'GitHub incorporó una evaluación de aprobación a todas las revisiones de Copilot y permite que administradores autoricen una aprobación formal. Explicamos controles, límites y uso seguro.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una recomendación visible en cada revisión$x$),
    jsonb_build_object('type','paragraph','text',$x$GitHub anunció el 1 de septiembre de 2026 que Copilot code review ahora indica en su comentario general si considera que un pull request está listo para aprobarse. Esa evaluación aparece en cada revisión, pero por sí sola no satisface las reglas de fusión. La novedad adicional, disponible en vista previa pública, permite que administradores habiliten a Copilot para enviar una aprobación formal que sí puede contar dentro de los requisitos del repositorio.$x$),
    jsonb_build_object('type','heading','text',$x$Está apagado hasta que un administrador lo decida$x$),
    jsonb_build_object('type','paragraph','text',$x$La capacidad de aprobar viene desactivada. Puede gestionarse en niveles de empresa, organización y repositorio: una empresa puede bloquearla o delegar la decisión; la organización puede habilitarla globalmente o por repositorio; y cada repositorio puede restringir las rutas de archivos que Copilot está autorizado a aprobar. Está incluida en la vista previa para Copilot Pro, Pro+, Max, Business y Enterprise, pero la disponibilidad del plan no reemplaza la configuración administrativa.$x$),
    jsonb_build_object('type','list','text',$x$Configuración prudente: comenzar en repositorios de bajo riesgo; permitir sólo documentación, pruebas o archivos no sensibles; mantener revisión humana para autenticación, pagos, permisos y datos; exigir que CI compile y ejecute pruebas; proteger ramas; y revisar el comentario detallado, no únicamente la marca de aprobación. Si entra un commit nuevo después de la aprobación, GitHub la descarta como haría con una revisión humana y debe solicitarse otra evaluación.$x$),
    jsonb_build_object('type','heading','text',$x$La IA suma una señal, no una garantía$x$),
    jsonb_build_object('type','paragraph','text',$x$Copilot puede acelerar revisiones repetitivas y señalar cuándo no detecta bloqueos, pero trabaja con el código y contexto disponibles. No conoce automáticamente requisitos externos, secretos ausentes, comportamiento real en producción ni decisiones de producto. Una aprobación tampoco prueba accesibilidad, rendimiento o seguridad. En proyectos sensibles conviene tratarla como un revisor adicional: útil para ampliar cobertura, nunca como único responsable del merge.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta nota se conecta con /news/ai-github-copilot-visual-studio-agosto-2026-agentes-modelos-review, que explica la revisión desde el editor, y con /news/ai-github-copilot-politicas-facturacion-retencion-septiembre-2026 para políticas y retención. La fuente primaria es GitHub Changelog. XETHKIOZ recomienda habilitar la función gradualmente, medir falsos negativos y conservar trazabilidad humana en cambios con impacto real.$x$)
  ),
  'ai', (select author_id from editorial_author), 'published', '2026-09-03T20:25:00Z',
  array['ia','github-copilot','code-review','pull-request','aprobaciones','seguridad','desarrollo','fuente-oficial'],
  array['https://github.blog/changelog/2026-09-01-copilot-code-review-can-now-approve-pull-requests/'],
  false, 'approved', 'Fuente primaria: GitHub Changelog, 1 de septiembre de 2026. Se distingue la evaluación informativa de la aprobación formal configurable.', now(), now()
),
(
  'science-nasa-cielo-septiembre-2026-venus-equinoccio-luna-guia',
  'Ciencia · Guía del cielo de septiembre: Venus, equinoccio y la Luna cerca de Saturno',
  'NASA publicó las fechas astronómicas destacadas de septiembre de 2026. Adaptamos la guía al hemisferio sur y explicamos qué puede verse a simple vista o con instrumentos.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Un calendario útil también desde Argentina$x$),
    jsonb_build_object('type','paragraph','text',$x$NASA publicó el 1 de septiembre de 2026 su guía mensual de observación. Entre el 14 y el 20, la Luna servirá como referencia para ubicar Antares y el asterismo de la Tetera en Sagitario; bajo un cielo oscuro, esa región permite reconocer la dirección del centro de la Vía Láctea. La geometría es global, aunque la orientación y altura cambian según la latitud. Para Puan y buena parte de Argentina conviene comenzar después del atardecer, con el horizonte despejado.$x$),
    jsonb_build_object('type','heading','text',$x$Venus y el comienzo de la primavera$x$),
    jsonb_build_object('type','paragraph','text',$x$El 18 de septiembre Venus alcanzará el máximo brillo de su aparición vespertina. Se verá bajo hacia el oeste poco después de ponerse el Sol y debería distinguirse sin telescopio si el horizonte está limpio. El 22 llegará el equinoccio: mientras NASA lo presenta como inicio del otoño boreal, en el hemisferio sur marca el comienzo astronómico de la primavera. Día y noche quedan cerca de la misma duración, aunque la atmósfera y la definición de salida solar impiden una igualdad exacta.$x$),
    jsonb_build_object('type','list','text',$x$Agenda: del 14 al 20, seguir la Luna hacia Antares y la Tetera; el 18, buscar Venus al oeste tras el atardecer; el 19, participar de la Noche Internacional de Observación de la Luna; el 22, registrar el equinoccio; y el 26, observar la Luna llena cerca de Saturno y Neptuno. Saturno puede verse sin ayuda, pero Neptuno, de magnitud aproximada 8, requiere binoculares o telescopio y buenas condiciones.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo observar sin convertir la guía en una promesa$x$),
    jsonb_build_object('type','paragraph','text',$x$Elegí un sitio oscuro, verificá el pronóstico y dejá que la vista se adapte unos veinte minutos. Una aplicación de cielo ayuda a identificar objetos, pero debe configurarse con ubicación y hora correctas. Los binoculares mejoran cúmulos y estrellas, aunque no garantizan ver Neptuno desde una ciudad iluminada. Las fechas describen alineaciones previstas; nubes, edificios y contaminación lumínica pueden impedir la observación sin que el fenómeno haya fallado.$x$),
    jsonb_build_object('type','paragraph','text',$x$La guía complementa /news/science-nasa-roman-lanzamiento-exitoso-rumbo-l2-proximos-pasos, dedicada a exploración espacial profesional, con una actividad posible desde casa. NASA/JPL es la fuente primaria y ofrece mapas mensuales. XETHKIOZ adaptó las estaciones al hemisferio sur y mantiene la denominación “Harvest Moon” sólo como nombre tradicional del calendario norteamericano, no como descripción de la primavera argentina.$x$)
  ),
  'science', (select author_id from editorial_author), 'published', '2026-09-03T20:20:00Z',
  array['ciencia','nasa','astronomia','venus','equinoccio','luna','saturno','argentina','fuente-oficial'],
  array['https://science.nasa.gov/solar-system/skywatching/whats-up-september-2026-skywatching-tips-from-nasa/'],
  false, 'approved', 'Fuente primaria: NASA/JPL, 1 de septiembre de 2026. La explicación adapta estaciones y orientación general al hemisferio sur.', now(), now()
),
(
  'comicon-marvel-wolverine-japon-fotogrametria-insomniac-guia',
  'COMICON · Marvel’s Wolverine reconstruye Japón con 600 escaneos y 5,6 TB de referencias',
  'Insomniac explicó cómo una expedición técnica convirtió paisajes, arquitectura y detalles culturales de Japón en materiales para el juego. Analizamos el proceso y sus límites.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$La adaptación empieza fuera del estudio$x$),
    jsonb_build_object('type','paragraph','text',$x$Insomniac Games publicó el 1 de septiembre de 2026 una mirada a la investigación ambiental de Marvel’s Wolverine, previsto para PS5 el 15 de septiembre. El equipo viajó por Japón después de meses de exploración virtual y planificación junto a Sony Interactive Entertainment Japan. La ruta conectó Tokio, Joetsu, Tsumago-juku y Magome-juku, Kioto y nuevamente Tokio para reunir materiales de regiones que no podían representarse con una biblioteca genérica.$x$),
    jsonb_build_object('type','heading','text',$x$De una pared real a una pieza reutilizable$x$),
    jsonb_build_object('type','paragraph','text',$x$La fotogrametría combina numerosas fotografías para reconstruir superficies y objetos tridimensionales. Insomniac registró roca, corteza, nieve, musgo, pavimento, metal, señalización y arquitectura; luego esos datos se convierten en kits modulares que los artistas pueden adaptar. La expedición cubrió cuatro biomas: montañas nevadas, bosques de bambú, calles urbanas y espacios de transporte subterráneo. También documentó desgaste, escala y formas constructivas que ayudan a evitar escenarios culturalmente genéricos.$x$),
    jsonb_build_object('type','list','text',$x$Cifras oficiales del viaje: más de 600 escaneos; más de 100 millas recorridas a pie; unos 20 libras de equipo transportado con frecuencia; 5,6 TB de datos; 189.589 fotografías, sin contar referencias adicionales; y tres piezas de equipo dañadas. Esas cantidades describen la captura, no el volumen final instalado ni cuántos elementos aparecerán sin modificaciones en el juego.$x$),
    jsonb_build_object('type','heading','text',$x$Por qué importa para una historia de Marvel$x$),
    jsonb_build_object('type','paragraph','text',$x$Wolverine tiene décadas de cómics ligados a Japón, pero autenticidad visual no significa copiar un lugar completo. Escanear aporta proporciones y materialidad; guion, dirección artística y diseño deciden cómo se reorganizan esos elementos en una ficción. El valor del proceso está en partir de observación directa y colaboración local. La nota oficial no confirma que cada ciudad visitada sea una ubicación jugable ni permite evaluar todavía la representación cultural del producto terminado.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta pieza enlaza con /news/gaming-state-of-play-septiembre-2026-anuncios-fechas-guia, donde se ordenan el tráiler de lanzamiento y las fechas del evento. PlayStation Blog y el artista técnico principal Nathaniel Bell son la fuente primaria del proceso. XETHKIOZ distingue datos de producción, interpretación editorial y aspectos que sólo podrán comprobarse con el juego final, evitando convertir material promocional en una reseña anticipada.$x$)
  ),
  'comicon', (select author_id from editorial_author), 'published', '2026-09-03T20:15:00Z',
  array['comicon','marvel','wolverine','insomniac-games','japon','fotogrametria','ps5','adaptacion','fuente-oficial'],
  array['https://blog.playstation.com/2026/09/01/marvels-wolverine-inside-insomniac-games-location-scanning-trip-to-japan/'],
  false, 'approved', 'Fuente primaria: PlayStation Blog e Insomniac Games, 1 de septiembre de 2026. Se separan cifras de captura, interpretación y presencia final no confirmada.', now(), now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, content = excluded.content,
  category = excluded.category, author_id = coalesce(excluded.author_id, public.news_articles.author_id),
  status = excluded.status, published_at = excluded.published_at, tags = excluded.tags,
  source_urls = excluded.source_urls, ai_generated = excluded.ai_generated,
  review_status = excluded.review_status, editor_notes = excluded.editor_notes, updated_at = now();

commit;
