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
  'gaming-witcher-3-songs-of-the-past-letten-remaster-guia',
  'Gaming · The Witcher 3: Songs of the Past vuelve a Geralt con una región completamente nueva',
  'Xbox mostró 45 minutos de la expansión ambientada en Letten. Ordenamos historia, enemigos, nueva arma y la diferencia entre el DLC de 2027 y el remaster gratuito.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Un regreso que no intenta repetir Velen$x$),
    jsonb_build_object('type','paragraph','text',$x$Xbox Wire publicó el 29 de agosto de 2026 un anticipo de The Witcher 3: Songs of the Past basado en unos 45 minutos de sus primeras etapas. La expansión lleva a Geralt a Letten, tierra natal de Jaskier, para investigar la fractura de su familia aristocrática y un misterio relacionado con el Jardín de Espinas. Fool’s Theory codesarrolla el proyecto con CD Projekt Red y define la región como un mundo abierto completo, inspirado en zonas rurales inglesas y polacas.$x$),
    jsonb_build_object('type','heading','text',$x$Letten cambia antes de revelar su amenaza$x$),
    jsonb_build_object('type','paragraph','text',$x$La demostración comienza con colinas, un lago navegable, pueblos activos y una atmósfera más tranquila que las regiones castigadas por la guerra del juego original. Esa apariencia se transforma mientras Geralt sigue el rastro de Jaskier: la vegetación se cierra, la luz disminuye y antiguos asentamientos aparecen invadidos por espinas. El estudio también actualizó sistemas de personajes no jugables para dar más actividad cotidiana al territorio, aunque una presentación inicial no permite medir todavía su profundidad real.$x$),
    jsonb_build_object('type','list','text',$x$Datos confirmados: Geralt incorpora una cadena con gancho para atraer enemigos; los Thornblooms atacan desde una posición fija; los Swarmion usan enjambres de avispones como escudo; habrá nuevas mutaciones, decisiones y decenas de misiones y puntos de interés. Songs of the Past está anunciado para 2027 en Xbox Series X|S. El remaster del juego base llegará el 29 de septiembre de 2026 y será gratuito para propietarios del original.$x$),
    jsonb_build_object('type','heading','text',$x$Expansión y remaster no son lo mismo$x$),
    jsonb_build_object('type','paragraph','text',$x$La comunicación oficial separa dos productos: Songs of the Past agrega una historia, una región y sistemas jugables; The Witcher 3: Wild Hunt — Remastered actualiza jugabilidad, fidelidad visual, rendimiento y progresión. Que el remaster sea gratuito no significa que la expansión también lo sea, y todavía faltan precio, duración final, fecha exacta de 2027 y detalles de otras plataformas. Conviene esperar las fichas regionales antes de reservar o asumir condiciones para Argentina.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta nota se conecta con /news/gaming-xbox-lanzamientos-31-agosto-4-septiembre-2026-guia, donde XETHKIOZ ordena los estrenos inmediatos. Xbox Wire es la fuente primaria para la demostración y las fechas comunicadas. El texto distingue observaciones del anticipo, promesas del estudio y datos confirmados de tienda para evitar presentar una muestra controlada como análisis del producto terminado.$x$)
  ),
  'gaming', (select author_id from editorial_author), 'published', '2026-08-30T12:30:00Z',
  array['gaming','the-witcher-3','songs-of-the-past','cd-projekt-red','fools-theory','xbox','remaster','fuente-oficial'],
  array['https://news.xbox.com/en-us/2026/08/29/the-witcher-3-songs-of-the-past-preview/'],
  false, 'approved', 'Fuente primaria: Xbox Wire, 29 de agosto de 2026. Se separan la demostración, la expansión de 2027 y el remaster gratuito de septiembre.', now(), now()
),
(
  'ai-github-copilot-visual-studio-agosto-2026-agentes-modelos-review',
  'IA y tecnología · Copilot en Visual Studio suma agentes compartidos, control de modelos y revisión Git',
  'La actualización de agosto agrega agentes de organización, consumo visible, niveles de razonamiento y revisiones antes del pull request. Explicamos cuándo sirve cada función.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Más control dentro de Visual Studio 2026$x$),
    jsonb_build_object('type','paragraph','text',$x$GitHub publicó el 28 de agosto de 2026 el resumen mensual de Copilot para Visual Studio 2026. La versión reúne controles que antes estaban dispersos: agentes personalizados distribuidos por una organización, consulta detallada del uso del plan, niveles de esfuerzo de razonamiento, administración de modelos y revisión de cambios mediante el agente Git. GitHub afirma que las funciones están disponibles en todos los planes de Copilot, aunque los agentes de organización requieren una organización de GitHub.$x$),
    jsonb_build_object('type','heading','text',$x$Agentes comunes sin copiar instrucciones$x$),
    jsonb_build_object('type','paragraph','text',$x$Propietarios de organizaciones y empresas pueden publicar agentes personalizados para varios repositorios. Visual Studio los detecta y muestra su descripción y organización de origen en el selector. La utilidad práctica es compartir criterios especializados —por ejemplo, convenciones de arquitectura o revisión— sin duplicar archivos manualmente en cada proyecto. Eso no reemplaza los permisos del repositorio ni convierte al agente en una autoridad: sus instrucciones deben revisarse, versionarse y probarse como cualquier automatización.$x$),
    jsonb_build_object('type','list','text',$x$Funciones clave: “View all Copilot usage” muestra plan y consumo; Low, Medium y High ajustan el esfuerzo compatible con cada modelo; los modelos favoritos pueden fijarse y los menos usados, plegarse; la vista de administración informa capacidades, contexto y costo; y el agente Git revisa cambios sin confirmar o commits completos, mostrando hallazgos en línea. Esa revisión funciona con repositorios alojados en GitHub y Azure DevOps.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo elegir esfuerzo sin gastar de más$x$),
    jsonb_build_object('type','paragraph','text',$x$Low resulta razonable para transformaciones simples o preguntas puntuales; Medium ofrece un equilibrio para trabajo cotidiano; High conviene reservarlo para depuración compleja, algoritmos o decisiones de arquitectura. Más razonamiento no garantiza una respuesta correcta y puede aumentar consumo y espera. La nueva visibilidad de uso permite comparar resultados con el costo real del plan. Para revisión, el agente Git puede detectar problemas temprano, pero no sustituye pruebas, CI ni revisión humana en cambios sensibles.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía complementa /news/ai-github-copilot-politicas-facturacion-retencion-septiembre-2026: aquella cubre políticas, cobro y conservación de chats; ésta se concentra en el trabajo dentro del editor. GitHub Changelog es la fuente primaria. XETHKIOZ recomienda verificar canal estable o Insiders, modelo compatible, límites del plan y políticas de la organización antes de adoptar una función en producción.$x$)
  ),
  'ai', (select author_id from editorial_author), 'published', '2026-08-30T12:25:00Z',
  array['ia','github-copilot','visual-studio-2026','agentes','modelos','code-review','desarrollo','fuente-oficial'],
  array['https://github.blog/changelog/2026-08-28-github-copilot-in-visual-studio-august-update-2/'],
  false, 'approved', 'Fuente primaria: GitHub Changelog, 28 de agosto de 2026. Se distinguen disponibilidad general, requisito de organización y controles que dependen del modelo.', now(), now()
),
(
  'science-nasa-roman-lanzamiento-exitoso-rumbo-l2-proximos-pasos',
  'Ciencia · Roman ya vuela por su cuenta: qué ocurrió y qué falta antes de comenzar la ciencia',
  'El telescopio despegó en un Falcon Heavy y quedó rumbo al punto L2. La misión entra ahora en una etapa de despliegues, activación, calibración y pruebas de unos tres meses.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Del conteo al vuelo independiente$x$),
    jsonb_build_object('type','paragraph','text',$x$NASA inició el 30 de agosto de 2026 la cobertura oficial del lanzamiento del telescopio espacial Nancy Grace Roman desde el Complejo 39A del Centro Espacial Kennedy. La secuencia publicada para el Falcon Heavy incluía despegue, máxima presión aerodinámica, separación y regreso de los propulsores laterales, dos encendidos de la segunda etapa y despliegue del observatorio unos 31 minutos después. La cobertura posterior de NASA informó que Roman quedó volando por su cuenta rumbo al espacio profundo.$x$),
    jsonb_build_object('type','heading','text',$x$El destino está a unos 1,6 millones de kilómetros$x$),
    jsonb_build_object('type','paragraph','text',$x$Roman viaja hacia una órbita alrededor del segundo punto de Lagrange Sol-Tierra, L2, aproximadamente a un millón de millas de nuestro planeta. No comenzará a producir resultados científicos inmediatamente: el trayecto, los despliegues, la activación de sistemas, las calibraciones y las pruebas integran una puesta en servicio estimada en unos tres meses. Esa etapa comprueba que el observatorio pueda apuntar, comunicarse, controlar temperatura y entregar datos utilizables antes de abrir su programa regular.$x$),
    jsonb_build_object('type','list','text',$x$Qué sigue: confirmar el estado de energía y comunicaciones; desplegar y verificar componentes; ajustar el telescopio y los detectores; calibrar la cámara infrarroja Wide Field Instrument; probar el Coronagraph Instrument; y validar el flujo de datos hacia tierra. Un lanzamiento exitoso completa sólo el primer gran riesgo. Cada hito posterior debe confirmarse en el blog oficial y no inferirse de horarios previstos.$x$),
    jsonb_build_object('type','heading','text',$x$Una cámara panorámica para un archivo público enorme$x$),
    jsonb_build_object('type','paragraph','text',$x$El Wide Field Instrument utiliza una cámara infrarroja de unos 300 megapíxeles con resolución angular comparable a Hubble y un campo de visión al menos cien veces mayor. NASA espera que los relevamientos de Roman cartografíen miles de millones de galaxias y encuentren alrededor de 100.000 exoplanetas. El coronógrafo demostrará tecnologías para bloquear la luz de estrellas y observar planetas y discos cercanos. Los datos alimentarán un archivo público para investigaciones sobre energía oscura, materia oscura, estrellas y agujeros negros.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta actualización continúa /news/science-nasa-roman-go-lanzamiento-30-agosto-2026-clima-horario, publicada antes del despegue. Las fuentes primarias son el blog de lanzamiento y la cronología oficial de NASA. XETHKIOZ separa los hitos ya comunicados de los objetivos futuros: llegar a L2, completar la puesta en servicio y comenzar observaciones son etapas diferentes que todavía requieren confirmación.$x$)
  ),
  'science', (select author_id from editorial_author), 'published', '2026-08-30T12:20:00Z',
  array['ciencia','nasa','roman','falcon-heavy','l2','telescopio-espacial','exoplanetas','fuente-oficial'],
  array['https://science.nasa.gov/blogs/roman/2026/08/30/nasas-roman-space-telescope-launch-updates/','https://science.nasa.gov/blogs/roman/2026/08/30/nasa-roman-space-telescope-key-milestones-for-726-a-m-edt-launch/'],
  false, 'approved', 'Fuentes primarias: NASA Roman Blog, 30 de agosto de 2026. Se separan lanzamiento, despliegue, viaje a L2 y puesta en servicio.', now(), now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, content = excluded.content,
  category = excluded.category, author_id = coalesce(excluded.author_id, public.news_articles.author_id),
  status = excluded.status, published_at = excluded.published_at, tags = excluded.tags,
  source_urls = excluded.source_urls, ai_generated = excluded.ai_generated,
  review_status = excluded.review_status, editor_notes = excluded.editor_notes, updated_at = now();

commit;
