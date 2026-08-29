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
  'gaming-xbox-lanzamientos-31-agosto-4-septiembre-2026-guia',
  'Gaming · Xbox del 31 de agosto al 4 de septiembre: lanzamientos y Game Pass ordenados',
  'Xbox detalló una semana cargada de acción, deportes, terror e indies. Separamos estrenos, accesos anticipados y juegos de Game Pass para elegir sin confundir disponibilidad.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Una semana con varios tipos de lanzamiento$x$),
    jsonb_build_object('type','paragraph','text',$x$Xbox Wire publicó el 28 de agosto de 2026 su agenda oficial para la semana del 31 de agosto al 4 de septiembre. El listado mezcla estrenos completos, versiones preliminares, accesos anticipados y títulos que entran a Game Pass. Entre los nombres principales aparecen The Blood of Dawnwalker el 2 de septiembre, Avatar Legends: The Fighting Game, NBA 2K27 y Onimusha: Way of the Sword el día 3, además del acceso anticipado de NHL 27 Deluxe y Halloween Digital Deluxe el 4.$x$),
    jsonb_build_object('type','heading','text',$x$Qué llega a Game Pass y qué exige compra$x$),
    jsonb_build_object('type','paragraph','text',$x$Young Suns alcanza su versión 1.0 el 31 de agosto y figura para PC Game Pass y Xbox Game Pass. Shelldiver se suma el 1 de septiembre, mientras Moonlighter 2: The Endless Vault completa su versión 1.0 el día 2 dentro de PC Game Pass. El resto no debe darse por incluido: la propia agenda marca por separado preventa, compra, prueba gratuita o disponibilidad en el servicio. También distingue Xbox Play Anywhere, Smart Delivery y optimización para Series X|S.$x$),
    jsonb_build_object('type','list','text',$x$Ruta rápida: elegí The Blood of Dawnwalker u Onimusha si buscás acción narrativa; Avatar Legends si preferís lucha 2D; Young Suns para cooperación relajada; Moonlighter 2 para acción y gestión; y BioEden para construcción de ecosistemas. Antes de descargar, comprobá plataforma, edición, idioma, tamaño y región en la ficha argentina. Las fechas pueden cambiar y un acceso anticipado no equivale al lanzamiento estándar.$x$),
    jsonb_build_object('type','heading','text',$x$Cómo organizar la semana sin comprar por impulso$x$),
    jsonb_build_object('type','paragraph','text',$x$La concentración de estrenos alrededor del 2 y 3 de septiembre hace útil separar interés real de novedad. Quienes ya pagan Game Pass pueden empezar por los juegos incluidos y esperar reseñas o pruebas para los títulos de precio completo. Las ediciones Deluxe de NHL 27 y Halloween adelantan el acceso, pero conviene comparar su contenido con la edición base. Xbox Wire aporta el calendario; cada ficha de tienda confirma precio y condiciones regionales.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía continúa /news/gaming-xbox-lanzamientos-24-28-agosto-2026-guia, que cubre la semana anterior. La fuente primaria es Xbox Wire y XETHKIOZ no presenta precios en dólares como valores argentinos ni convierte anuncios de tienda en recomendaciones automáticas. El objetivo es ordenar fechas, servicios y formatos para que cada jugador decida con información verificable.$x$)
  ),
  'gaming', (select author_id from editorial_author), 'published', '2026-08-29T12:30:00Z',
  array['gaming','xbox','game-pass','lanzamientos','septiembre-2026','guia','fuente-oficial'],
  array['https://news.xbox.com/en-us/2026/08/28/next-week-on-xbox-new-games-for-august-31-to-september-4/'],
  false, 'approved', 'Fuente primaria: Xbox Wire, 28 de agosto de 2026. Se distinguen compra, Game Pass, acceso anticipado, plataformas y disponibilidad regional.', now(), now()
),
(
  'ai-github-copilot-politicas-facturacion-retencion-septiembre-2026',
  'IA y tecnología · GitHub Copilot cambia políticas, facturación y retención: fechas clave',
  'GitHub anunció cambios para Business y Enterprise desde septiembre y octubre. La experiencia unificada también modifica políticas, retención de chats y esfuerzo de revisión.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Tres cambios con calendarios diferentes$x$),
    jsonb_build_object('type','paragraph','text',$x$GitHub informó el 28 de agosto de 2026 tres modificaciones próximas para Copilot. Desde el 1 de septiembre comenzará a reabrir altas de clientes Business y Enterprise que pagan con tarjeta o PayPal, con validaciones de cuenta y cobro previo por cada asiento asignado. Para clientes existentes con esos medios de pago, el cobro anticipado de los asientos asignados empezará con el ciclo de facturación del 1 de octubre. GitHub aclara que los precios de los planes no cambian.$x$),
    jsonb_build_object('type','heading','text',$x$Una experiencia unificada y una retención distinta$x$),
    jsonb_build_object('type','paragraph','text',$x$No antes del 28 de septiembre, Copilot Chat en github.com, GitHub Mobile y el agente cloud pasarán a una experiencia y política únicas, habilitadas por defecto. El cambio más sensible para equipos es la conservación: los datos de chat en github.com pasarán de 28 días a mantenerse durante la vida de la cuenta, alineándose con el agente cloud. Quienes se excluyan perderán acceso a Copilot en github.com y Mobile cuando se complete la unificación.$x$),
    jsonb_build_object('type','list','text',$x$Lista para administradores: revisar asientos antes del próximo ciclo; configurar límites de gasto y alertas; confirmar la política del agente cloud antes del 28 de septiembre; documentar la nueva retención para privacidad y cumplimiento; y elegir explícitamente Lite si no quieren que las revisiones automáticas adopten Balanced. Revocar un asiento no produce reintegro proporcional y el exceso de uso puede requerir pago adicional.$x$),
    jsonb_build_object('type','heading','text',$x$Balanced pasa a ser el valor predeterminado$x$),
    jsonb_build_object('type','paragraph','text',$x$También desde el 28 de septiembre, la opción Default de Copilot code review utilizará esfuerzo Balanced en organizaciones y repositorios. Los equipos que prefieran Lite deberán seleccionarlo de forma explícita. Balanced puede ofrecer una revisión más profunda, pero conviene medir consumo, latencia y calidad sobre repositorios representativos antes de adoptarlo como norma. El valor de organización se aplica donde el repositorio no tenga una selección propia.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta nota complementa /news/ai-github-copilot-slack-preview-guia-seguridad: aquella explica el trabajo desde Slack y ésta cubre administración, costos y privacidad. GitHub es la fuente primaria. XETHKIOZ diferencia anuncios futuros de funciones ya activas y recomienda revisar contrato, región, método de pago y documentación oficial antes de modificar políticas de una organización.$x$)
  ),
  'ai', (select author_id from editorial_author), 'published', '2026-08-29T12:25:00Z',
  array['ia','github-copilot','facturacion','privacidad','retencion','code-review','enterprise','fuente-oficial'],
  array['https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/'],
  false, 'approved', 'Fuente primaria: GitHub Changelog, 28 de agosto de 2026. Se separan fechas de facturación, política unificada, retención y esfuerzo de revisión.', now(), now()
),
(
  'science-nasa-roman-go-lanzamiento-30-agosto-2026-clima-horario',
  'Ciencia · Roman recibe el “go” final: horario, clima y objetivos del lanzamiento',
  'NASA y SpaceX completaron la revisión final para el telescopio Roman. El despegue apunta al 30 de agosto, con una probabilidad meteorológica favorable del 60%.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$La revisión final quedó aprobada$x$),
    jsonb_build_object('type','paragraph','text',$x$NASA confirmó el 28 de agosto de 2026 que el telescopio espacial Nancy Grace Roman está autorizado para avanzar al conteo de lanzamiento. La agencia y SpaceX completaron la Launch Readiness Review, el control que reúne el estado del observatorio, el cohete Falcon Heavy, el clima y los equipos de apoyo. El objetivo es despegar el domingo 30 de agosto a las 7:26 EDT desde el Complejo de Lanzamiento 39A del Centro Espacial Kennedy, en Florida.$x$),
    jsonb_build_object('type','heading','text',$x$El clima todavía puede mover la ventana$x$),
    jsonb_build_object('type','paragraph','text',$x$El pronóstico de la 45.ª Ala Meteorológica de la Fuerza Espacial de Estados Unidos estimaba un 60% de condiciones favorables al momento del anuncio. El “go” técnico no garantiza que el despegue ocurra en el primer intento: meteorología, sistemas del cohete o verificaciones de último minuto pueden provocar una pausa. Por eso conviene seguir el blog de la misión y la cobertura oficial de NASA en lugar de conservar un horario aislado.$x$),
    jsonb_build_object('type','list','text',$x$Qué observar: confirmación del abastecimiento y del conteo; evolución del porcentaje meteorológico; hora local, que corresponde a las 8:26 de Argentina si no cambia la ventana; transmisión oficial de NASA; y comunicación posterior sobre separación y estado del observatorio. Una demora no implica una falla de la misión: los lanzamientos incluyen márgenes y criterios estrictos para proteger hardware irremplazable.$x$),
    jsonb_build_object('type','heading','text',$x$Por qué Roman importa después del despegue$x$),
    jsonb_build_object('type','paragraph','text',$x$Roman realizará relevamientos amplios y profundos para estudiar materia oscura, energía oscura, exoplanetas, agujeros negros y miles de millones de galaxias. Su diseño busca combinar una visión del cielo extensa con observaciones detalladas y grandes volúmenes de datos abiertos para la comunidad científica. Será la sexta misión principal de NASA lanzada por SpaceX desde Kennedy mediante un cohete Falcon, después de IXPE, Psyche, GOES-U, Europa Clipper e IMAP.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta actualización continúa /news/science-roman-cuenta-regresiva-30-agosto-2026, publicada cuando la misión todavía estaba en preparación. NASA es la fuente primaria para estado, hora, clima y objetivos. XETHKIOZ presenta el horario como objetivo vigente al 28 de agosto y no como garantía; cualquier cambio posterior debe confirmarse en la cobertura oficial.$x$)
  ),
  'science', (select author_id from editorial_author), 'published', '2026-08-29T12:20:00Z',
  array['ciencia','nasa','roman','telescopio-espacial','lanzamiento','30-agosto-2026','fuente-oficial'],
  array['https://science.nasa.gov/blogs/roman/2026/08/28/nasas-roman-space-telescope-go-for-launch/'],
  false, 'approved', 'Fuente primaria: NASA Roman Blog, 28 de agosto de 2026. El horario y el 60% meteorológico se presentan como condiciones vigentes y sujetas a cambio.', now(), now()
),
(
  'comicon-dc-tales-green-lantern-corps-guia-lectura',
  'COMICON · Tales of the Green Lantern Corps: una guía corta para entrar al mito',
  'DC recuperó la miniserie de 1981 como puerta de entrada a Hal Jordan, los Guardianes y el Cuerpo. Ordenamos qué incluye, qué presenta y dónde encaja.',
  jsonb_build_array(
    jsonb_build_object('type','heading','text',$x$Tres números que amplían todo el Cuerpo$x$),
    jsonb_build_object('type','paragraph','text',$x$DC publicó el 28 de agosto de 2026 una guía oficial de Tales of the Green Lantern Corps, la miniserie de tres números aparecida en 1981. La historia convoca a los 3.600 Green Lanterns en Oa para enfrentar el regreso de Krona, mientras la Batería Central queda destruida y los anillos conservan menos de 24 horas de carga. El relato vuelve a contar el origen de Hal Jordan y del Cuerpo, por lo que puede leerse sin completar décadas de continuidad.$x$),
    jsonb_build_object('type','heading','text',$x$Autores y personajes que dejaron huella$x$),
    jsonb_build_object('type','paragraph','text',$x$Len Wein escribió la miniserie a partir de un argumento de Mike W. Barr, con lápices de Joe Staton, tintas de Frank McLaughlin y portadas tempranas de Brian Bolland. La obra presenta a Arisia y funciona como antecedente del enfoque coral que luego caracterizaría al título Green Lantern Corps. También introduce a Nekron, señor de los muertos que décadas después sería el antagonista central de Blackest Night.$x$),
    jsonb_build_object('type','list','text',$x$Orden práctico: leer primero los tres números de Tales of the Green Lantern Corps; continuar con los dos anuales incluidos en la colección digital; y pasar después a Blackest Night si interesa seguir a Nekron. El primer anual contiene trabajo de Gil Kane y el segundo incluye la primera historia de Green Lantern escrita por Alan Moore. Antes de comprar, comprobá edición, idioma, disponibilidad regional y contenido exacto de la recopilación.$x$),
    jsonb_build_object('type','heading','text',$x$Por qué sigue siendo una buena puerta de entrada$x$),
    jsonb_build_object('type','paragraph','text',$x$La miniserie ocupa un punto intermedio entre las aventuras clásicas centradas en Hal y la etapa moderna, donde numerosos Lanterns ganaron identidad y series propias. Su escala permite conocer Oa, a los Guardianes, la Batería Central y la cooperación entre sectores sin empezar por un evento largo. El dibujo de Staton es más expresivo y caricaturesco que el de etapas posteriores, una diferencia de estilo que conviene conocer antes de elegir la edición.$x$),
    jsonb_build_object('type','paragraph','text',$x$Esta guía complementa /news/comicon-dc-boy-of-steel-guia-superboy: ambas proponen clásicos accesibles para entrar a una mitología sin leer toda la continuidad. DC es la fuente primaria y su nota también promociona DC Universe Infinite. XETHKIOZ resume contexto y orden de lectura sin reproducir páginas ni asumir que el servicio o la edición física estén disponibles en Argentina.$x$)
  ),
  'comicon', (select author_id from editorial_author), 'published', '2026-08-29T12:15:00Z',
  array['comicon','dc','green-lantern','hal-jordan','nekron','guia-de-lectura','clasicos','fuente-oficial'],
  array['https://www.dc.com/blog/2026-08-28/lantern-lights-unite-in-tales-of-the-green-lantern-corps'],
  false, 'approved', 'Fuente primaria: DC, 28 de agosto de 2026. Se distingue la historia publicada, la colección promocionada y la disponibilidad regional.', now(), now()
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, content = excluded.content,
  category = excluded.category, author_id = coalesce(excluded.author_id, public.news_articles.author_id),
  status = excluded.status, published_at = excluded.published_at, tags = excluded.tags,
  source_urls = excluded.source_urls, ai_generated = excluded.ai_generated,
  review_status = excluded.review_status, editor_notes = excluded.editor_notes, updated_at = now();

commit;
