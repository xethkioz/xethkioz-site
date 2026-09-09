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
  'gaming-playstation-plus-catalogo-septiembre-2026-fechas-guia',
  'Gaming · PlayStation Plus de septiembre: catálogo, fechas y qué conviene probar',
  'PlayStation confirmó la selección de Extra y Premium para septiembre. Ordenamos las fechas, plataformas y géneros para elegir con criterio sin confundir el catálogo con los juegos mensuales.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$El catálogo principal llega el 15 de septiembre$x$),
    jsonb_build_object('type','paragraph','text',$x$Sony Interactive Entertainment publicó el 9 de septiembre de 2026 la nueva tanda de PlayStation Plus Extra y Premium. La mayoría de los juegos se incorpora el 15 de septiembre, aunque hay excepciones: Date Everything! aparece desde el día 9, Ball x Pit y Slitterhead el 22, y Ninja Gaiden: Ragebound, Dungeons of Hinterberg y Sniper Elite: Resistance el 29. La disponibilidad puede variar por región, por lo que conviene comprobar cada ficha en PlayStation Store antes de descargar.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo elegir según tiempo y estilo$x$),
    jsonb_build_object('type','paragraph','text',$x$RuneScape: Dragonwilds propone supervivencia cooperativa, construcción y progresión RPG en PS5; WWE 2K26 apunta a partidas competitivas y una plantilla de más de 400 luchadores; Ball x Pit combina acción rápida y estructura roguelite; y Date Everything! convierte objetos domésticos en personajes de una aventura narrativa. Quien prefiera acción lineal puede mirar Slitterhead o Ninja Gaiden: Ragebound, mientras Dungeons of Hinterberg mezcla exploración, vínculos y rompecabezas.$x$),
    jsonb_build_object('type','list','text',$x$Plan práctico: revisar qué nivel de PlayStation Plus exige cada juego; confirmar plataforma PS5 o PS4; anotar la fecha regional; priorizar una descarga corta antes de comprometer espacio con campañas largas; activar guardado en la nube cuando esté incluido; y consultar la ficha de Store por idiomas, multijugador, accesibilidad y tamaño. El catálogo rota, así que “incluido” no equivale a propiedad permanente.$x$),
    jsonb_build_object('type','heading','text',$x$Premium suma dos regresos muy distintos$x$),
    jsonb_build_object('type','paragraph','text',$x$La selección Premium incorpora Mega Man X Command Mission para PS5 y PS4, un RPG futurista con más de 50 misiones, y Metro Redux para PS4, una recopilación de supervivencia y acción ambientada en un sistema de metro posapocalíptico. Son buenas opciones para probar formatos clásicos, pero la transmisión en la nube, las versiones disponibles y el catálogo Premium o Deluxe dependen del país. Sony también aclara que los juegos digitales aptos para streaming pueden cambiar.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía complementa /news/gaming-playstation-plus-septiembre-2026-juegos-fechas-guia, dedicada a los juegos mensuales reclamables, y /news/gaming-state-of-play-septiembre-2026-anuncios-fechas-guia, que ordena próximos lanzamientos. PlayStation Blog es la fuente primaria. XETHKIOZ separa fechas confirmadas, plataforma y disponibilidad regional para que cada lector pueda decidir qué instalar sin prometer permanencia ni acceso fuera de su suscripción.$x$)
  ),
  'gaming', (select author_id from editorial_author), 'published', '2026-09-09T20:40:00Z',
  array['gaming','playstation-plus','extra','premium','ps5','ps4','catalogo','septiembre-2026','guia','fuente-oficial'],
  array['https://blog.playstation.com/2026/09/09/playstation-plus-game-catalog-for-september-runescape-dragonwilds-wwe-2k26-ball-x-pit-date-everything-and-more/'],
  false, 'approved', 'Fuente primaria: PlayStation Blog, 9 de septiembre de 2026. Se distinguen catálogo, juegos mensuales, fechas escalonadas y variaciones regionales.', now(), now()
),
(
  'ai-github-copilot-agentic-autofix-calidad-lotes-guia-revision',
  'IA · Copilot repara hasta 25 hallazgos de calidad: flujo, costos y revisión humana',
  'GitHub añadió remediación por lotes a Code Quality. Explicamos qué automatiza el agente, qué requisitos tiene y por qué el pull request sigue necesitando revisión humana.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$De un hallazgo aislado a una tarea por lotes$x$),
    jsonb_build_object('type','paragraph','text',$x$GitHub anunció el 9 de septiembre de 2026 la disponibilidad de agentic autofix para hallazgos de Code Quality. Desde una página de resultados se pueden seleccionar hasta 25 hallazgos estándar y asignarlos a Copilot en una sola operación. El agente prepara correcciones en una rama, valida sus cambios y abre un pull request. La función reemplaza el flujo “Generate fix” para hallazgos individuales y unifica el proceso tanto para uno como para varios problemas.$x$),
    jsonb_build_object('type','heading','text',$x$Qué hace el agente y qué conserva el equipo$x$),
    jsonb_build_object('type','paragraph','text',$x$La automatización reduce trabajo repetitivo cuando existen advertencias similares, pero no convierte cada propuesta en una corrección segura. Un hallazgo puede admitir varias soluciones y una modificación técnicamente válida puede alterar comportamiento, rendimiento o compatibilidad. El pull request es el punto de control: allí deben revisarse el alcance, las pruebas, los archivos inesperados y el efecto sobre contratos de la aplicación. Copilot propone y valida; el equipo decide si la solución representa la intención del producto.$x$),
    jsonb_build_object('type','list','text',$x$Uso recomendado: agrupar hallazgos relacionados y no sólo los primeros 25; registrar el estado inicial; asignar el lote a Copilot; inspeccionar el diff completo; ejecutar pruebas unitarias, integración, seguridad y rendimiento; pedir revisión del propietario del código; rechazar cambios fuera del alcance; y fusionar únicamente el SHA que pasó todos los controles. Un lote pequeño y coherente facilita detectar una regresión.$x$),
    jsonb_build_object('type','heading','text',$x$Disponibilidad, política y créditos$x$),
    jsonb_build_object('type','paragraph','text',$x$La función requiere GitHub Code Quality habilitado y está disponible en repositorios de GitHub Team y GitHub Enterprise Cloud, incluida la modalidad con residencia de datos. Sigue la política empresarial existente de Code Quality; no agrega un permiso independiente. Cada asignación consume créditos de IA, por lo que una organización debería definir quién puede iniciar tareas, cómo medir el valor obtenido y cuándo una reparación manual es más simple.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta nota se relaciona con /news/ai-github-copilot-aprobar-pull-requests-configuracion-limites, donde explicamos el rol de las aprobaciones automáticas, y /news/ai-openai-hugging-face-incidente-agentes-sandbox-seguridad, sobre aislamiento de agentes. GitHub Changelog es la fuente primaria. XETHKIOZ recomienda tratar cada PR generado como código no confiable hasta revisar el diff y completar la misma batería de controles que se exige a un cambio humano.$x$)
  ),
  'ai', (select author_id from editorial_author), 'published', '2026-09-09T20:35:00Z',
  array['ia','github-copilot','agentic-autofix','code-quality','pull-request','revision','seguridad','creditos-ia','fuente-oficial'],
  array['https://github.blog/changelog/2026-09-09-remediate-code-quality-findings-with-agentic-autofix/'],
  false, 'approved', 'Fuente primaria: GitHub Changelog, 9 de septiembre de 2026. Se explican límite de 25 hallazgos, planes compatibles, créditos de IA y revisión humana obligatoria.', now(), now()
),
(
  'science-nasa-hubble-webb-objetos-transneptunianos-origen-planetas',
  'Ciencia · Hubble y Webb encuentran mundos pequeños que conservan la memoria del Sistema Solar',
  'Dos telescopios estudiaron 27 objetos transneptunianos diminutos. Sus colores y tamaños desafían algunas expectativas sobre colisiones y preservan pistas del nacimiento planetario.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Veintisiete objetos más allá de Neptuno$x$),
    jsonb_build_object('type','paragraph','text',$x$NASA informó el 8 de septiembre de 2026 que equipos científicos combinaron observaciones de Hubble en luz visible y Webb en infrarrojo para estudiar objetos transneptunianos extremadamente débiles. Descubrieron 27 cuerpos pequeños y midieron sus colores, tamaños y órbitas. El menor tiene cerca de cinco kilómetros de diámetro, unas cinco veces menos que el límite práctico de los telescopios terrestres más sensibles. Estos objetos son restos helados de la etapa en que polvo y guijarros formaban planetesimales.$x$),
    jsonb_build_object('type','heading','text',$x$Los colores conservan una historia inesperada$x$),
    jsonb_build_object('type','paragraph','text',$x$El estudio comparó poblaciones “frías”, que permanecen en órbitas relativamente circulares y cercanas al plano del Sistema Solar, con poblaciones “calientes”, desplazadas hacia órbitas inclinadas y elípticas durante la migración de los planetas gigantes. Los investigadores esperaban que las colisiones hubieran modificado más las superficies de los cuerpos pequeños. Sin embargo, sus colores siguen relaciones parecidas a las de objetos mayores, como si conservaran una firma de la región donde nacieron.$x$),
    jsonb_build_object('type','list','text',$x$Cómo interpretar el resultado: el color aporta pistas sobre composición superficial; la órbita ayuda a separar poblaciones dinámicas; el tamaño informa sobre el proceso de formación; una muestra de 27 cuerpos profundiza el registro, pero no describe por sí sola todo el cinturón; y “recordar” es una metáfora científica para una señal física preservada, no memoria biológica ni evidencia de vida.$x$),
    jsonb_build_object('type','heading','text',$x$También aparecieron menos cuerpos pequeños de lo previsto$x$),
    jsonb_build_object('type','paragraph','text',$x$Webb encontró menos objetos diminutos que los esperados por ciertos modelos y distribuciones de tamaño sorprendentemente similares entre las poblaciones frías y calientes. Eso sugiere que la formación de planetesimales pudo producir proporciones comparables bajo condiciones distintas del disco primitivo. Todavía no hay una explicación definitiva: puede haber menos colisiones, o las superficies podrían conservar mejor su composición original. Los resultados se presentaron en dos trabajos de The Astronomical Journal.$x$),
    jsonb_build_object('type','paragraph','text',$x$La nota complementa /news/science-nasa-cielo-septiembre-2026-venus-equinoccio-luna-guia para observación cercana y /news/science-nasa-pandora-exoplanetas-estrellas-inicio-mision para mundos fuera del Sistema Solar. NASA Science es la fuente primaria y enlaza ambos estudios. XETHKIOZ distingue descubrimiento, interpretación y preguntas abiertas: Hubble y Webb amplían la muestra, pero las causas de la preservación y la escasez observada todavía deben probarse.$x$)
  ),
  'science', (select author_id from editorial_author), 'published', '2026-09-09T20:30:00Z',
  array['ciencia','nasa','hubble','james-webb','objetos-transneptunianos','kuiper','planetesimales','sistema-solar','fuente-oficial'],
  array['https://science.nasa.gov/missions/hubble/nasas-hubble-webb-find-far-out-solar-system-objects-remember-past/'],
  false, 'approved', 'Fuente primaria: NASA Science, 8 de septiembre de 2026, actualizada el 9. Se separan observaciones, interpretación científica y preguntas abiertas.', now(), now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, content = excluded.content,
  category = excluded.category, author_id = coalesce(excluded.author_id, public.news_articles.author_id),
  status = excluded.status, published_at = excluded.published_at, tags = excluded.tags,
  source_urls = excluded.source_urls, ai_generated = excluded.ai_generated,
  review_status = excluded.review_status, editor_notes = excluded.editor_notes, updated_at = now();

commit;
